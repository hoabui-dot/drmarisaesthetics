-- Expose the repeatable hospital location component in Website Settings' saved
-- Content Manager layout. Deploy the matching Strapi schema first.

BEGIN;

WITH setting AS (
  SELECT key, value::jsonb AS config
  FROM public.strapi_core_store_settings
  WHERE key = 'plugin_content_manager_configuration_content_types::api::website-setting.website-setting'
), has_field AS (
  SELECT key, config,
    EXISTS (
      SELECT 1
      FROM jsonb_array_elements(COALESCE(config #> '{layouts,edit}', '[]'::jsonb)) AS rows(row_data)
      CROSS JOIN LATERAL jsonb_array_elements(rows.row_data) AS fields(field)
      WHERE fields.field->>'name' = 'hospital_locations'
    ) AS present
  FROM setting
)
UPDATE public.strapi_core_store_settings AS target
SET value = jsonb_set(
  has_field.config,
  '{layouts,edit}',
  COALESCE(has_field.config #> '{layouts,edit}', '[]'::jsonb)
    || jsonb_build_array(jsonb_build_array(jsonb_build_object('name', 'hospital_locations'))),
  true
)::text
FROM has_field
WHERE target.key = has_field.key AND NOT has_field.present;

COMMIT;
