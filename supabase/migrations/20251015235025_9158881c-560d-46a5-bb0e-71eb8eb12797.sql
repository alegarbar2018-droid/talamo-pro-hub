-- Create system user in auth.users for MT5 EA signals
-- This prevents FK violations when signals are inserted with default author_id

INSERT INTO auth.users (
  id, 
  instance_id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data
)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'system@signals.internal',
  crypt('system-no-login-allowed', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"system": true, "source": "mt5_ea"}'::jsonb,
  '{"provider": "system", "providers": ["system"]}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users 
  WHERE id = '00000000-0000-0000-0000-000000000000'
);