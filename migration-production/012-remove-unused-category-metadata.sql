-- Category records only need their stable ID, label, and optional icon.
-- Strapi schema sync may already have removed these columns; IF EXISTS keeps
-- this structural cleanup safe and repeatable for existing deployments.

ALTER TABLE IF EXISTS components_website_setting_blog_categories
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS is_active;

ALTER TABLE IF EXISTS components_website_setting_service_categories
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS is_active;
