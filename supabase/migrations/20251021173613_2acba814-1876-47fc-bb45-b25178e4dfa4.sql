-- Corregir permisos de la vista v_admin_users
-- Solo debe ser accesible desde Edge Functions con service role
-- NO debe estar disponible para clientes autenticados o anónimos

begin;

-- Revocar permisos de la vista a roles públicos
revoke select on public.v_admin_users from authenticated;
revoke select on public.v_admin_users from anon;

-- La vista seguirá siendo accesible desde service role (postgres owner)
-- que es lo único necesario para las Edge Functions

commit;