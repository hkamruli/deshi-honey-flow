
-- Add admin write policies for districts table
CREATE POLICY "Admins can insert districts" ON public.districts
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update districts" ON public.districts
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete districts" ON public.districts
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
