-- Stores the ordered Result component IDs selected for the Homepage gallery.
-- Deploy the matching Strapi schema before applying this migration.
ALTER TABLE IF EXISTS "components_homepage_patient_results_sections"
  ADD COLUMN IF NOT EXISTS "selected_case_ids" jsonb;
