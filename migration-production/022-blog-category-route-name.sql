-- Adds the public URL segment configured on each Website Settings blog
-- category. Existing values are populated by the CMS lifecycle when settings
-- are next saved; the frontend also derives a safe segment from the label
-- until then.
ALTER TABLE IF EXISTS components_website_setting_blog_categories
  ADD COLUMN IF NOT EXISTS route_name varchar(255);

COMMENT ON COLUMN components_website_setting_blog_categories.route_name IS
  'Public route segment used by blog articles: /news/{route_name}/{slug}';
