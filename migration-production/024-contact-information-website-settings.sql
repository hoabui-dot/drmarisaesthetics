-- Contact Information now reads addresses and contact methods from Website
-- Settings. Add storage for a second location and remove the unused location
-- options field from the Contact consultation component.

BEGIN;

ALTER TABLE IF EXISTS public.website_settings
  ADD COLUMN IF NOT EXISTS address_secondary_label varchar(255),
  ADD COLUMN IF NOT EXISTS address_secondary text,
  ADD COLUMN IF NOT EXISTS map_latitude_secondary numeric,
  ADD COLUMN IF NOT EXISTS map_longitude_secondary numeric,
  ADD COLUMN IF NOT EXISTS map_zoom_secondary integer DEFAULT 16,
  ADD COLUMN IF NOT EXISTS map_display_name_secondary varchar(255),
  ADD COLUMN IF NOT EXISTS map_embed_url_secondary text;

-- Preserve the saved Content Manager layout while exposing the new Settings
-- fields to editors. Store them as a final row and avoid duplicates on reruns.
WITH setting AS (
  SELECT key, value::jsonb AS config
  FROM public.strapi_core_store_settings
  WHERE key = 'plugin_content_manager_configuration_content_types::api::website-setting.website-setting'
), requested_fields(field_name, field_order) AS (
  VALUES
    ('address_secondary_label', 1),
    ('address_secondary', 2),
    ('map_display_name_secondary', 3),
    ('map_latitude_secondary', 4),
    ('map_longitude_secondary', 5),
    ('map_zoom_secondary', 6),
    ('map_embed_url_secondary', 7)
), missing_fields AS (
  SELECT setting.key, setting.config,
         jsonb_agg(jsonb_build_object('name', requested_fields.field_name)
                   ORDER BY requested_fields.field_order) AS fields
  FROM setting
  CROSS JOIN requested_fields
  WHERE NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(COALESCE(setting.config #> '{layouts,edit}', '[]'::jsonb)) AS rows(row_data)
    CROSS JOIN LATERAL jsonb_array_elements(row_data) AS fields(field)
    WHERE field->>'name' = requested_fields.field_name
  )
  GROUP BY setting.key, setting.config
)
UPDATE public.strapi_core_store_settings AS target
SET value = jsonb_set(
  missing_fields.config,
  '{layouts,edit}',
  COALESCE(missing_fields.config #> '{layouts,edit}', '[]'::jsonb)
    || jsonb_build_array(missing_fields.fields),
  true
)::text
FROM missing_fields
WHERE target.key = missing_fields.key;

DO $$
BEGIN
  IF to_regclass('public.components_contact_consultation_sections_cmps') IS NOT NULL THEN
    DELETE FROM public.components_contact_consultation_sections_cmps
    WHERE field = 'location_options';
  END IF;
END
$$;

ALTER TABLE IF EXISTS public.components_contact_consultation_sections
  DROP COLUMN IF EXISTS location_options;

DROP TABLE IF EXISTS public.components_contact_select_options;

WITH setting AS (
  SELECT key, value::jsonb AS config
  FROM public.strapi_core_store_settings
  WHERE key = 'plugin_content_manager_configuration_components::contact.consultation-section'
), edit_rows AS (
  SELECT row_ordinality,
         jsonb_agg(field ORDER BY field_ordinality)
           FILTER (WHERE field->>'name' <> 'location_options') AS fields
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
UPDATE public.strapi_core_store_settings AS target
SET value = jsonb_set(setting.config, '{layouts,edit}', filtered_layout.edit, true)::text
FROM setting, filtered_layout
WHERE target.key = setting.key;

DELETE FROM public.strapi_core_store_settings
WHERE key = 'plugin_content_manager_configuration_components::contact.select-option';

COMMIT;
