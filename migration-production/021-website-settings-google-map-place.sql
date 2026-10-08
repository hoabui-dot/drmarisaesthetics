-- Website Settings owns the canonical map display name and optional exact
-- Google Maps iframe URL shared by the footer and Contact page.
ALTER TABLE IF EXISTS website_settings
  ADD COLUMN IF NOT EXISTS map_display_name varchar(255),
  ADD COLUMN IF NOT EXISTS map_embed_url text;
