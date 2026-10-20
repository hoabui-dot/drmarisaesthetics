-- Add editor-facing copy fields for Contact's two-hospital explorer and
-- navigation/source metadata to the canonical About hospital records.
-- Hospital records remain centralized in About Page; Contact reads them there.

BEGIN;

ALTER TABLE IF EXISTS public.components_contact_map_sections
  ADD COLUMN IF NOT EXISTS eyebrow varchar(255),
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS official_website_label varchar(255);

ALTER TABLE IF EXISTS public.components_about_hospital_chapters
  ADD COLUMN IF NOT EXISTS short_name varchar(255),
  ADD COLUMN IF NOT EXISTS source_url varchar(255);

-- Retain Content Manager custom layouts while exposing the new fields.
WITH requested_fields(component_key, field_name, field_order) AS (
  VALUES
    ('plugin_content_manager_configuration_components::contact.map-section', 'eyebrow', 1),
    ('plugin_content_manager_configuration_components::contact.map-section', 'title', 2),
    ('plugin_content_manager_configuration_components::contact.map-section', 'description', 3),
    ('plugin_content_manager_configuration_components::contact.map-section', 'directions_label', 4),
    ('plugin_content_manager_configuration_components::contact.map-section', 'official_website_label', 5),
    ('plugin_content_manager_configuration_components::about.hospital-chapter', 'short_name', 1),
    ('plugin_content_manager_configuration_components::about.hospital-chapter', 'source_url', 2)
), settings AS (
  SELECT store.key, store.value::jsonb AS config, requested_fields.field_name, requested_fields.field_order
  FROM public.strapi_core_store_settings AS store
  JOIN requested_fields ON requested_fields.component_key = store.key
), missing_fields AS (
  SELECT settings.key, settings.config,
         jsonb_agg(jsonb_build_object('name', settings.field_name) ORDER BY settings.field_order) AS fields
  FROM settings
  WHERE NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(COALESCE(settings.config #> '{layouts,edit}', '[]'::jsonb)) AS rows(row_data)
    CROSS JOIN LATERAL jsonb_array_elements(rows.row_data) AS items(field)
    WHERE items.field->>'name' = settings.field_name
  )
  GROUP BY settings.key, settings.config
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

COMMIT;
