-- Sincronización retroactiva de auth.users con public.profiles
-- Esto poblará public.profiles con todos los usuarios existentes en auth.users

BEGIN;

-- Insertar todos los usuarios de auth.users en public.profiles
INSERT INTO public.profiles (user_id, first_name, last_name, email)
SELECT 
  au.id,
  au.raw_user_meta_data->>'first_name',
  au.raw_user_meta_data->>'last_name',
  au.email
FROM auth.users au
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  updated_at = NOW();

COMMIT;