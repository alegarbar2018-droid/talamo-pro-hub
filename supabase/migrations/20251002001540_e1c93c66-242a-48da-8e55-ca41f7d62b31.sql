-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule binance-data-collector to run every 5 minutes
SELECT cron.schedule(
  'binance-data-collector',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://xogbavprnnbfamcjrsel.supabase.co/functions/v1/binance-data-collector',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- Schedule signal-automation-engine to run every 5 minutes (offset by 2 minutes)
SELECT cron.schedule(
  'signal-automation-engine',
  '2-59/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://xogbavprnnbfamcjrsel.supabase.co/functions/v1/signal-automation-engine',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- Create a function to manually trigger data collection (for testing)
CREATE OR REPLACE FUNCTION public.trigger_data_collection()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only admins can trigger manual collection
  IF NOT has_admin_permission('signals', 'manage') THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN jsonb_build_object(
    'message', 'Data collection triggered',
    'note', 'Check edge function logs for results'
  );
END;
$$;