-- Remove legacy single-video fields from the persisted Strapi Content Manager
-- edit layout. The schema keeps those attributes hidden for data/API backward
-- compatibility; this clears the old DB-saved layout that can override that
-- visibility and leave the fields rendered in the Homepage editor.
WITH setting AS (
  SELECT key, value::jsonb AS config
  FROM strapi_core_store_settings
  WHERE key = 'plugin_content_manager_configuration_components::homepage.video-section'
), edit_rows AS (
  SELECT row_ordinality,
         jsonb_agg(field ORDER BY field_ordinality)
           FILTER (WHERE field->>'name' NOT IN (
             'youtube_url', 'quote', 'customer_name',
             'customer_description', 'thumbnail_url'
           )) AS fields
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
