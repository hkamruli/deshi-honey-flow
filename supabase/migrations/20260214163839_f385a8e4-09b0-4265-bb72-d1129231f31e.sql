
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can insert abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Anyone can insert abandoned carts" ON public.abandoned_carts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.visitor_analytics;
CREATE POLICY "Anyone can insert analytics" ON public.visitor_analytics FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Rate limits are publicly insertable" ON public.rate_limits;
CREATE POLICY "Rate limits are publicly insertable" ON public.rate_limits FOR INSERT WITH CHECK (true);
