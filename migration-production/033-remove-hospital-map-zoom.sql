-- The per-location zoom field is redundant: the canonical Google Maps embed
-- URL already carries its own zoom level. Keep the frontend's fallback zoom
-- fixed in code rather than exposing a setting that cannot affect valid embeds.

BEGIN;

ALTER TABLE IF EXISTS public.components_website_setting_hospital_locations
  DROP COLUMN IF EXISTS zoom;

-- Remove stale component metadata/layout so the deleted field does not remain
-- visible in a customized Strapi Content Manager configuration.
WITH component_config AS (
  SELECT key, value::jsonb AS config
  FROM public.strapi_core_store_settings
  WHERE key = 'plugin_content_manager_configuration_components::website-setting.hospital-location'
), edit_rows AS (
  SELECT component_config.key,
         rows.row_order,
         jsonb_agg(fields.field ORDER BY fields.field_order)
           FILTER (WHERE fields.field->>'name' <> 'zoom') AS row_fields
  FROM component_config
  CROSS JOIN LATERAL jsonb_array_elements(
    COALESCE(component_config.config #> '{layouts,edit}', '[]'::jsonb)
  ) WITH ORDINALITY AS rows(row_data, row_order)
  CROSS JOIN LATERAL jsonb_array_elements(rows.row_data)
    WITH ORDINALITY AS fields(field, field_order)
  GROUP BY component_config.key, rows.row_order
), new_edit_layout AS (
  SELECT key,
         jsonb_agg(row_fields ORDER BY row_order)
           FILTER (WHERE row_fields IS NOT NULL AND row_fields <> '[]'::jsonb) AS layout
  FROM edit_rows
  GROUP BY key
)
UPDATE public.strapi_core_store_settings AS target
SET value = jsonb_set(
      jsonb_set(
        jsonb_set(component_config.config, '{layouts,edit}',
          COALESCE(new_edit_layout.layout, '[]'::jsonb), true),
        '{layouts,list}',
        COALESCE(component_config.config #> '{layouts,list}', '[]'::jsonb) - 'zoom',
        true
      ),
      '{metadatas}',
      COALESCE(component_config.config->'metadatas', '{}'::jsonb) - 'zoom',
      true
    )::text
FROM component_config
JOIN new_edit_layout ON new_edit_layout.key = component_config.key
WHERE target.key = component_config.key;

COMMIT;
