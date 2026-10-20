-- Store a facility-specific Google Maps Embed URL so each Contact map can
-- display Google's verified pin for the exact hospital. Content is populated
-- manually from each facility's reviewed "Embed a map" URL in Strapi.

BEGIN;

ALTER TABLE IF EXISTS public.components_about_hospital_chapters
  ADD COLUMN IF NOT EXISTS maps_embed_url text;

WITH setting AS (
  SELECT key, value::jsonb AS config
  FROM public.strapi_core_store_settings
  WHERE key = 'plugin_content_manager_configuration_components::about.hospital-chapter'
), has_field AS (
  SELECT setting.key, setting.config,
         EXISTS (
           SELECT 1
           FROM jsonb_array_elements(COALESCE(setting.config #> '{layouts,edit}', '[]'::jsonb)) AS rows(row_data)
           CROSS JOIN LATERAL jsonb_array_elements(rows.row_data) AS fields(field)
           WHERE fields.field->>'name' = 'maps_embed_url'
         ) AS field_exists
  FROM setting
)
UPDATE public.strapi_core_store_settings AS target
SET value = jsonb_set(
  has_field.config,
  '{layouts,edit}',
  COALESCE(has_field.config #> '{layouts,edit}', '[]'::jsonb)
    || jsonb_build_array(jsonb_build_array(jsonb_build_object('name', 'maps_embed_url'))),
  true
)::text
FROM has_field
WHERE target.key = has_field.key
  AND NOT has_field.field_exists;

COMMIT;
