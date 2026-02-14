
-- Add is_dhaka_metro to districts
ALTER TABLE public.districts ADD COLUMN IF NOT EXISTS is_dhaka_metro BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.districts ADD COLUMN IF NOT EXISTS estimated_delivery_days INTEGER NOT NULL DEFAULT 3;

-- Update Dhaka district
UPDATE public.districts SET is_dhaka_metro = true, estimated_delivery_days = 1 WHERE name = 'Dhaka';

-- Add status timestamps to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS processing_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS visitor_session_id TEXT;

-- Create order_status enum type
DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Alter status column to use enum (need to convert)
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';

-- Add contact settings
INSERT INTO public.settings (key, value) VALUES 
  ('contact_phone', '01XXXXXXXXX'),
  ('contact_email', 'info@deshifoods.com'),
  ('whatsapp_number', '8801XXXXXXXXX')
ON CONFLICT DO NOTHING;

-- Rate limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  action_type TEXT NOT NULL DEFAULT 'order_submission',
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  blocked_until TIMESTAMPTZ
);
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rate limits are publicly insertable" ON public.rate_limits FOR INSERT WITH CHECK (true);
CREATE POLICY "Rate limits are publicly readable" ON public.rate_limits FOR SELECT USING (true);

-- Activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- RLS for activity_logs (admin only)
CREATE POLICY "Admins can read activity logs" ON public.activity_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert activity logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin policies for orders (read/update)
CREATE POLICY "Admins can read all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Add session_id to visitor_analytics
ALTER TABLE public.visitor_analytics ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE public.visitor_analytics ADD COLUMN IF NOT EXISTS order_id UUID;

-- Rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_ip TEXT, p_action TEXT DEFAULT 'order_submission')
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INTEGER;
  is_currently_blocked BOOLEAN;
BEGIN
  -- Check if blocked
  SELECT EXISTS(
    SELECT 1 FROM public.rate_limits 
    WHERE ip_address = p_ip AND action_type = p_action AND is_blocked = true AND blocked_until > now()
  ) INTO is_currently_blocked;
  
  IF is_currently_blocked THEN RETURN false; END IF;
  
  -- Count recent attempts (last hour)
  SELECT COUNT(*) INTO recent_count 
  FROM public.rate_limits 
  WHERE ip_address = p_ip AND action_type = p_action AND attempted_at > now() - interval '1 hour';
  
  -- Record attempt
  INSERT INTO public.rate_limits (ip_address, action_type) VALUES (p_ip, p_action);
  
  -- Block if exceeded
  IF recent_count >= 5 THEN
    UPDATE public.rate_limits SET is_blocked = true, blocked_until = now() + interval '24 hours'
    WHERE ip_address = p_ip AND action_type = p_action;
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Trigger to update order status timestamps
CREATE OR REPLACE FUNCTION public.update_order_status_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN NEW.confirmed_at = now(); END IF;
  IF NEW.status = 'processing' AND OLD.status != 'processing' THEN NEW.processing_at = now(); END IF;
  IF NEW.status = 'shipped' AND OLD.status != 'shipped' THEN NEW.shipped_at = now(); END IF;
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN NEW.delivered_at = now(); END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_order_status_timestamps
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_order_status_timestamps();
