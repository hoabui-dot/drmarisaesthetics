-- Store a verified Google Maps place page separately from the iframe embed URL.
-- The frontend uses this URL for the clickable map preview so Google search
-- geocoding cannot redirect users to a similarly named but incorrect address.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.components_website_setting_hospital_locations') IS NOT NULL THEN
    ALTER TABLE public.components_website_setting_hospital_locations
      ADD COLUMN IF NOT EXISTS maps_place_url text;
  END IF;
END
$$;

COMMIT;
