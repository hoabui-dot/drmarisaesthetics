-- Remove the retired About Page HOSPITAL-BASED SURGERY dynamic-zone section.
-- The Homepage and other hospital-related sections are intentionally untouched.
-- Media Library files are retained; only links owned by this component are removed.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.about_pages_cmps') IS NOT NULL THEN
    DELETE FROM public.about_pages_cmps
    WHERE component_type = 'about.hospital';
  END IF;

  IF to_regclass('public.files_related_mph') IS NOT NULL THEN
    DELETE FROM public.files_related_mph
    WHERE related_type = 'about.hospital';
  END IF;
END
$$;

DROP TABLE IF EXISTS public.components_about_hospitals_cmps;
DROP TABLE IF EXISTS public.components_about_hospitals;

COMMIT;
