
-- Enable pg_net extension for making HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Function to send email notification via Edge Function when a notification is created
CREATE OR REPLACE FUNCTION public.send_notification_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  supabase_url text;
  service_key  text;
BEGIN
  -- Read project settings (these are automatically available in Supabase)
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_key  := current_setting('app.settings.service_role_key', true);

  -- If settings aren't available, try env-based approach
  IF supabase_url IS NULL OR service_key IS NULL THEN
    -- Fallback: use the Supabase project URL directly
    supabase_url := 'https://fbvruzkaohzdfzpfeuna.supabase.co';
  END IF;

  -- Only send emails for important notification types
  IF NEW.type IN ('order_update', 'admin_alert') THEN
    PERFORM extensions.http_post(
      url := supabase_url || '/functions/v1/send-notification-email',
      body := jsonb_build_object(
        'notification_id', NEW.id,
        'user_id', NEW.user_id,
        'title', NEW.title,
        'message', NEW.message,
        'type', NEW.type,
        'link', NEW.link
      )::text,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || COALESCE(service_key, '')
      )::jsonb
    );
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't block notification creation if email fails
    RAISE WARNING 'Email notification failed: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger: send email after every notification insert
CREATE TRIGGER on_notification_send_email
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.send_notification_email();
