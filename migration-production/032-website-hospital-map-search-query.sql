-- Keep public English display addresses separate from Google Maps geocoding
-- queries. HIU needs a Vietnamese query to resolve its verified place preview.

BEGIN;

ALTER TABLE IF EXISTS public.components_website_setting_hospital_locations
  ADD COLUMN IF NOT EXISTS maps_search_query text;

COMMIT;
