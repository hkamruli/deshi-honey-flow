
-- Create abandoned_carts table to track visitors who fill info but don't submit
CREATE TABLE public.abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  customer_name text,
  phone text,
  email text,
  district_id uuid REFERENCES public.districts(id),
  area text,
  full_address text,
  product_variation_id uuid REFERENCES public.product_variations(id),
  quantity integer DEFAULT 1,
  ip_address text,
  user_agent text,
  referrer_url text,
  is_converted boolean DEFAULT false,
  contacted boolean DEFAULT false,
  contact_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (from the frontend form)
CREATE POLICY "Anyone can insert abandoned carts"
ON public.abandoned_carts FOR INSERT
WITH CHECK (true);

-- Admins can read all
CREATE POLICY "Admins can read abandoned carts"
ON public.abandoned_carts FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update (mark as contacted, add notes)
CREATE POLICY "Admins can update abandoned carts"
ON public.abandoned_carts FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete abandoned carts"
ON public.abandoned_carts FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Auto-update timestamp trigger
CREATE TRIGGER update_abandoned_carts_updated_at
BEFORE UPDATE ON public.abandoned_carts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
