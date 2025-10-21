-- Add missing permissions for user management

-- ADMIN can create users
INSERT INTO public.permissions (role, resource, action)
VALUES ('ADMIN', 'users', 'create')
ON CONFLICT DO NOTHING;

-- ADMIN can update identity
INSERT INTO public.permissions (role, resource, action)
VALUES ('ADMIN', 'users', 'update_identity')
ON CONFLICT DO NOTHING;

-- ADMIN can update profile
INSERT INTO public.permissions (role, resource, action)
VALUES ('ADMIN', 'users', 'update_profile')
ON CONFLICT DO NOTHING;