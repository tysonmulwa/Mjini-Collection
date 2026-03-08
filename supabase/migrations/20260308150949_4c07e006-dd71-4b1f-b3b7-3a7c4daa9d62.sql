
CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Anyone can view store settings" ON public.store_settings
  FOR SELECT TO authenticated, anon USING (true);

-- Only admins can update
CREATE POLICY "Admins can update store settings" ON public.store_settings
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert store settings" ON public.store_settings
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default delivery fee settings
INSERT INTO public.store_settings (key, value) VALUES 
  ('delivery_fee', '{"amount": 300, "free_threshold": 3000}'::jsonb);
