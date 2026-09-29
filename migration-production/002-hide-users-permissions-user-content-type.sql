-- Hide the built-in Users & Permissions user model from Strapi Admin.
--
-- This is a schema/configuration cleanup only. The `up_users` table and the
-- plugin model remain because Strapi uses them for authentication, JWT
-- validation, role synchronisation and the user.me endpoint.

BEGIN;

-- Remove the Content Manager layout generated for the built-in user model.
DELETE FROM public.strapi_core_store_settings
WHERE key = 'plugin_content_manager_configuration_content_types::plugin::users-permissions.user';

-- Remove stale Content Manager permissions for this hidden model. Delete the
-- join rows first because the permission link has a foreign key to the action.
DELETE FROM public.admin_permissions_role_lnk
WHERE permission_id IN (
  SELECT id
  FROM public.admin_permissions
  WHERE subject = 'plugin::users-permissions.user'
);

DELETE FROM public.admin_permissions
WHERE subject = 'plugin::users-permissions.user';

COMMIT;
