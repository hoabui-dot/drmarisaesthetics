-- Preserve GPS precision for the Website Settings hospital-location component.
-- Deploy the Strapi schema first so the component table exists.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.components_website_setting_hospital_locations') IS NOT NULL THEN
    ALTER TABLE public.components_website_setting_hospital_locations
      ALTER COLUMN latitude TYPE numeric(10,7) USING latitude::numeric(10,7),
      ALTER COLUMN longitude TYPE numeric(10,7) USING longitude::numeric(10,7);
  END IF;
END
$$;

COMMIT;
