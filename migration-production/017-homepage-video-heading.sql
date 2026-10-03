-- Add editorial heading fields to the Homepage customer-video section.
-- The title default keeps already-configured production video sections valid;
-- editors can replace it and optionally add a subtitle in Content Manager.
ALTER TABLE IF EXISTS components_homepage_video_sections
  ADD COLUMN IF NOT EXISTS title varchar(255) NOT NULL DEFAULT 'A patient''s perspective',
  ADD COLUMN IF NOT EXISTS subtitle text;

COMMENT ON COLUMN components_homepage_video_sections.title IS
  'Section heading displayed above the Homepage customer video testimonial';
COMMENT ON COLUMN components_homepage_video_sections.subtitle IS
  'Optional supporting copy displayed below the Homepage video section heading';
