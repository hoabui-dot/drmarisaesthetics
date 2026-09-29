-- Remove the legacy api::page.page collection type.
--
-- This is a schema/data cleanup migration only. It deliberately does not seed
-- or transform replacement content. Production editors must update approved
-- single types and collections manually after deployment.

BEGIN;

-- Remove Media Library relation rows owned by the deleted content type. The
-- files themselves are intentionally retained because an asset may be shared
-- or may need manual review before deletion.
DO $$
BEGIN
  IF to_regclass('public.files_related_mph') IS NOT NULL THEN
    DELETE FROM public.files_related_mph
    WHERE related_type = 'api::page.page';
  END IF;
END
$$;

-- Remove Content Manager layout metadata if it exists in this Strapi database.
DO $$
BEGIN
  IF to_regclass('public.strapi_core_store_settings') IS NOT NULL THEN
    DELETE FROM public.strapi_core_store_settings
    WHERE key IN (
      'plugin_content_manager_configuration_content_types_api::page.page',
      'plugin_content_manager_configuration_content_types_api::page.page.edit'
    );
  END IF;
END
$$;

-- Remove the obsolete source toggle from the SEO Manager settings. This is
-- configuration cleanup for the deleted schema, not a replacement seed.
DO $$
BEGIN
  IF to_regclass('public.seo_manager_settings') IS NOT NULL THEN
    UPDATE public.seo_manager_settings
    SET sitemap_content_types = COALESCE(sitemap_content_types, '{}'::jsonb) - 'api::page.page',
        updated_at = CURRENT_TIMESTAMP
    WHERE sitemap_content_types ? 'api::page.page';
  END IF;
END
$$;

-- Strapi creates this join table for the page SEO component. It must be
-- removed before the collection table because it has a foreign key to pages.
DROP TABLE IF EXISTS public.pages_cmps;
DROP TABLE IF EXISTS public.pages;

COMMIT;
