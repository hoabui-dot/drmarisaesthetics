-- Structural cleanup after legacy Website Settings data has been copied into
-- hospital_locations for both draft and published versions. Run the explicit
-- content migration/seed first; this file intentionally does not move content.

BEGIN;

ALTER TABLE IF EXISTS public.components_website_setting_hospital_locations
  ALTER COLUMN latitude DROP NOT NULL,
  ALTER COLUMN longitude DROP NOT NULL;

ALTER TABLE IF EXISTS public.website_settings
  DROP COLUMN IF EXISTS address,
  DROP COLUMN IF EXISTS map_latitude,
  DROP COLUMN IF EXISTS map_longitude,
  DROP COLUMN IF EXISTS map_zoom,
  DROP COLUMN IF EXISTS map_display_name,
  DROP COLUMN IF EXISTS map_embed_url,
  DROP COLUMN IF EXISTS address_secondary_label,
  DROP COLUMN IF EXISTS address_secondary,
  DROP COLUMN IF EXISTS map_latitude_secondary,
  DROP COLUMN IF EXISTS map_longitude_secondary,
  DROP COLUMN IF EXISTS map_zoom_secondary,
  DROP COLUMN IF EXISTS map_display_name_secondary,
  DROP COLUMN IF EXISTS map_embed_url_secondary;

-- Remove deleted fields from the persisted edit layout so old fields do not
-- linger as stale Content Manager rows after the schema is rebuilt.
WITH setting AS (
  SELECT key, value::jsonb AS config
  FROM public.strapi_core_store_settings
  WHERE key = 'plugin_content_manager_configuration_content_types::api::website-setting.website-setting'
), edit_rows AS (
  SELECT setting.key, rows.row_order,
         jsonb_agg(fields.field ORDER BY fields.field_order)
           FILTER (WHERE fields.field->>'name' NOT IN (
             'address', 'map_latitude', 'map_longitude', 'map_zoom',
             'map_display_name', 'map_embed_url', 'address_secondary_label',
             'address_secondary', 'map_latitude_secondary',
             'map_longitude_secondary', 'map_zoom_secondary',
             'map_display_name_secondary', 'map_embed_url_secondary'
           )) AS row_fields
  FROM setting
  CROSS JOIN LATERAL jsonb_array_elements(COALESCE(setting.config #> '{layouts,edit}', '[]'::jsonb))
    WITH ORDINALITY AS rows(row_data, row_order)
  CROSS JOIN LATERAL jsonb_array_elements(rows.row_data)
    WITH ORDINALITY AS fields(field, field_order)
  GROUP BY setting.key, rows.row_order
), new_layout AS (
  SELECT key, jsonb_agg(row_fields ORDER BY row_order)
    FILTER (WHERE row_fields IS NOT NULL AND row_fields <> '[]'::jsonb) AS layout
  FROM edit_rows
  GROUP BY key
)
UPDATE public.strapi_core_store_settings AS target
SET value = jsonb_set(setting.config, '{layouts,edit}', new_layout.layout, true)::text
FROM setting
JOIN new_layout ON new_layout.key = setting.key
WHERE target.key = setting.key;

COMMIT;
