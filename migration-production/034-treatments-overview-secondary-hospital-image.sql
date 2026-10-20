-- Add the optional second hospital photo used by the Treatments Overview
-- image-stack interaction. This stores a URL/alt pair, not a Media Library
-- relation, so the existing primary image and all its media links are intact.
ALTER TABLE IF EXISTS public.components_treatments_page_editorial_sections
  ADD COLUMN IF NOT EXISTS secondary_image_url TEXT,
  ADD COLUMN IF NOT EXISTS secondary_image_alt VARCHAR(255);
