
-- Remove public INSERT policies - these are now handled by edge functions using service role

-- Orders: remove public insert, add service-role-only insert via authenticated
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Abandoned carts: remove public insert
DROP POLICY IF EXISTS "Anyone can insert abandoned carts" ON public.abandoned_carts;

-- Visitor analytics: remove public insert
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.visitor_analytics;

-- Rate limits: remove public insert (check_rate_limit is SECURITY DEFINER so it bypasses RLS)
DROP POLICY IF EXISTS "Rate limits are publicly insertable" ON public.rate_limits;
