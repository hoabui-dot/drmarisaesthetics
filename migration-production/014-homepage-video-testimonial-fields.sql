-- Extend the Homepage video component with customer testimonial content.
-- Keep fields nullable so existing configured video records remain valid;
-- editorial values are entered and published manually in Strapi.
ALTER TABLE IF EXISTS components_homepage_video_sections
  ADD COLUMN IF NOT EXISTS quote text,
  ADD COLUMN IF NOT EXISTS customer_name varchar(255),
  ADD COLUMN IF NOT EXISTS customer_description text,
  ADD COLUMN IF NOT EXISTS thumbnail_url text;

COMMENT ON COLUMN components_homepage_video_sections.quote IS
  'Customer testimonial quote displayed beside the video';
COMMENT ON COLUMN components_homepage_video_sections.customer_name IS
  'Optional customer display name';
COMMENT ON COLUMN components_homepage_video_sections.customer_description IS
  'Optional supporting customer description';
COMMENT ON COLUMN components_homepage_video_sections.thumbnail_url IS
  'Optional HTTPS or same-origin URL for the pre-play video thumbnail';
