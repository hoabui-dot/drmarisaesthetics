-- Contact's clinic map now uses the canonical address and coordinates from
-- Website Settings. Remove duplicated values from the dynamic-zone component
-- and its persisted Content Manager edit layout.
ALTER TABLE IF EXISTS components_contact_map_sections
  DROP COLUMN IF EXISTS address,
  DROP COLUMN IF EXISTS clinic_name,
  DROP COLUMN IF EXISTS directions_url;

WITH setting AS (
  SELECT key, value::jsonb AS config
  FROM strapi_core_store_settings
  WHERE key = 'plugin_content_manager_configuration_components::contact.map-section'
), edit_rows AS (
  SELECT row_ordinality,
         jsonb_agg(field ORDER BY field_ordinality)
           FILTER (WHERE field->>'name' NOT IN ('address', 'clinic_name', 'directions_url')) AS fields
  FROM setting
  CROSS JOIN LATERAL jsonb_array_elements(config #> '{layouts,edit}')
    WITH ORDINALITY AS rows(row_data, row_ordinality)
  CROSS JOIN LATERAL jsonb_array_elements(row_data)
    WITH ORDINALITY AS items(field, field_ordinality)
  GROUP BY row_ordinality
), filtered_layout AS (
  SELECT COALESCE(
    jsonb_agg(fields ORDER BY row_ordinality)
      FILTER (WHERE fields IS NOT NULL AND fields <> '[]'::jsonb),
    '[]'::jsonb
  ) AS edit
  FROM edit_rows
)
UPDATE strapi_core_store_settings AS target
SET value = jsonb_set(setting.config, '{layouts,edit}', filtered_layout.edit, true)::text
FROM setting, filtered_layout
WHERE target.key = setting.key;
