-- Vista unificada de usuarios admin que combina auth.users, profiles y admin_users
-- Idempotente: se puede ejecutar múltiples veces sin errores

begin;

-- Crear o reemplazar la vista unificada
create or replace view public.v_admin_users as
select
  p.id                               as profile_id,
  u.id                               as user_id,
  coalesce(p.email, u.email)         as email,
  p.first_name,
  p.last_name,
  p.phone,
  p.avatar_url,
  coalesce(p.created_at, u.created_at) as created_at,
  au.role                            as admin_role,
  -- Campos de afiliación (null por ahora, se pueden agregar joins reales después)
  null::boolean                      as is_affiliated,
  null::text                         as partner_id
from auth.users u
left join public.profiles p on p.user_id = u.id
left join public.admin_users au on au.user_id = u.id;

-- Otorgar permisos de lectura (la Edge Function usa service role, pero por orden)
grant usage on schema public to authenticated, anon;
grant select on public.v_admin_users to authenticated, anon;

commit;