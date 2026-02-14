
-- Fix 1: Restrict visitor_analytics SELECT to admins only (was publicly readable)
DROP POLICY IF EXISTS "Analytics are publicly readable" ON public.visitor_analytics;
CREATE POLICY "Admins can read analytics" ON public.visitor_analytics
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix 3: Add server-side validation constraints on orders table
ALTER TABLE public.orders ADD CONSTRAINT valid_phone 
  CHECK (phone ~ '^01[0-9]{9}$');
ALTER TABLE public.orders ADD CONSTRAINT valid_email 
  CHECK (email IS NULL OR email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$');
ALTER TABLE public.orders ADD CONSTRAINT reasonable_name_length 
  CHECK (LENGTH(customer_name) <= 200);
ALTER TABLE public.orders ADD CONSTRAINT reasonable_address_length 
  CHECK (LENGTH(full_address) <= 1000);
