-- Structural phase 4: run only after the manual merge script has been reviewed
-- and completed. This file intentionally never copies business data.
BEGIN;

DELETE FROM public.admin_permissions_role_lnk
WHERE permission_id IN (
  SELECT id FROM public.admin_permissions
  WHERE subject = 'api::promotion-submission.promotion-submission'
);

DELETE FROM public.admin_permissions
WHERE subject = 'api::promotion-submission.promotion-submission';

DROP TABLE IF EXISTS public.promotion_submissions CASCADE;

COMMIT;
