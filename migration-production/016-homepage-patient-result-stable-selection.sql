-- Component database IDs can change when repeatable Result cases are replaced.
-- Use the editor-managed case_number value as the homepage selection key.
ALTER TABLE IF EXISTS "components_homepage_patient_results_sections"
  ADD COLUMN IF NOT EXISTS "selected_case_numbers" jsonb;

ALTER TABLE IF EXISTS "components_homepage_patient_results_sections"
  DROP COLUMN IF EXISTS "selected_case_ids";
