
-- Allow admins to INSERT/UPDATE/DELETE product_variations
CREATE POLICY "Admins can insert products" ON public.product_variations FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update products" ON public.product_variations FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete products" ON public.product_variations FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to INSERT/UPDATE/DELETE testimonials
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to INSERT/UPDATE/DELETE bonuses
CREATE POLICY "Admins can insert bonuses" ON public.bonuses FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update bonuses" ON public.bonuses FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete bonuses" ON public.bonuses FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to INSERT/UPDATE/DELETE settings
CREATE POLICY "Admins can insert settings" ON public.settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update settings" ON public.settings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete settings" ON public.settings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
