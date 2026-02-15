
-- Fix 1: Restrict rate_limits SELECT to admins only
DROP POLICY IF EXISTS "Rate limits are publicly readable" ON public.rate_limits;
CREATE POLICY "Admins can read rate limits" ON public.rate_limits
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Replace COUNT(*)-based order number with sequence
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq;

-- Set sequence to current max to avoid collisions
DO $$
DECLARE
  max_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(
    NULLIF(regexp_replace(order_number, '^NH-\d{4}-', ''), '')::INTEGER
  ), 0) INTO max_num FROM public.orders;
  PERFORM setval('public.order_number_seq', GREATEST(max_num, 1));
END $$;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'NH-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('public.order_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
