-- Homepage's video section is now managed only by its YouTube URL.
-- Remove legacy copy fields from the repeatable component storage.
ALTER TABLE IF EXISTS components_homepage_video_sections
  DROP COLUMN IF EXISTS eyebrow,
  DROP COLUMN IF EXISTS title,
  DROP COLUMN IF EXISTS description;
