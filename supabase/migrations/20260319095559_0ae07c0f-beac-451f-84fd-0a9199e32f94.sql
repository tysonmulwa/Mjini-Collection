
-- Drop the overly permissive insert policy and replace with a restrictive one
DROP POLICY "System can insert notifications" ON public.notifications;

-- Only allow users to insert notifications for themselves (triggers use SECURITY DEFINER so bypass RLS)
CREATE POLICY "Users can insert own notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
