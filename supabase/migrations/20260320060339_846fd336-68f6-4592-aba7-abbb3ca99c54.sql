-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create the email notification function
CREATE OR REPLACE FUNCTION public.send_notification_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  supabase_url text := 'https://fbvruzkaohzdfzpfeuna.supabase.co';
BEGIN
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
        'Content-Type', 'application/json'
      )::jsonb
    );
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Email notification failed: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger: notify customer on order status change
CREATE OR REPLACE TRIGGER on_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_status_change();

-- Trigger: notify admins on new order
CREATE OR REPLACE TRIGGER on_new_order_notify_admin
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_new_order();

-- Trigger: send email when notification is inserted
CREATE OR REPLACE TRIGGER on_notification_send_email
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.send_notification_email();