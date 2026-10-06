-- The Homepage video section now supports a repeatable `stories` component.
-- Strapi owns and synchronizes the component table and its component relations
-- from the deployed schema. Keep former single-video fields nullable so
-- existing Homepage entries remain readable during manual content migration.
ALTER TABLE IF EXISTS components_homepage_video_sections
  ALTER COLUMN youtube_url DROP NOT NULL;
