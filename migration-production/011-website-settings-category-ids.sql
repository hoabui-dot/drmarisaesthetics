-- Website Settings owns the Blog and Service category taxonomy. These nullable
-- scalar assignments intentionally preserve existing unclassified content.
-- Strapi creates/synchronizes component storage and its relation tables from
-- the registered component schemas when the updated CMS starts.

ALTER TABLE IF EXISTS blogs
  ADD COLUMN IF NOT EXISTS blog_category_id varchar(255);

ALTER TABLE IF EXISTS services
  ADD COLUMN IF NOT EXISTS service_category_id varchar(255);

CREATE INDEX IF NOT EXISTS blogs_blog_category_id_idx
  ON blogs (blog_category_id);

CREATE INDEX IF NOT EXISTS services_service_category_id_idx
  ON services (service_category_id);

COMMENT ON COLUMN blogs.blog_category_id IS
  'Nullable stable category_id from Website Settings blog_categories';

COMMENT ON COLUMN services.service_category_id IS
  'Nullable stable category_id from Website Settings service_categories';
