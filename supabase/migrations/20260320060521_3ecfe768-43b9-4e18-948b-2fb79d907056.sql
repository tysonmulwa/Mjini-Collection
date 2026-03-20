-- Remove the duplicate admin notification trigger
DROP TRIGGER IF EXISTS on_new_order ON public.orders;