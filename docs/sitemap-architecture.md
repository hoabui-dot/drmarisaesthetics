# Sitemap architecture

## Single public pipeline

`strapi-cms/src/lib/sitemap.js` is the canonical URL registry and inclusion policy. It resolves the current frontend route map from published Strapi documents, SEO settings, robots settings, canonical rules, and redirects. It returns a normalized DTO to:

- `GET /api/seo/sitemap` — public-safe data only (URL, label/group, type, locale, last modified).
- `GET /seo-manager/sitemap` — authenticated Admin diagnostics, including exclusions and validation findings.
- Next.js Route Handlers — `/sitemap.xml` index and grouped XML child sitemaps, all rendered from the normalized Strapi DTO.
- Next.js `/sitemap.xsl` — browser-only presentation for both XML document types; it does not replace XML responses.

`/sitemap.xml` is the sole sitemap viewing entrypoint and its XSL stylesheet makes the XML readable in a browser. The footer Sitemap link and robots directive point to `/sitemap.xml`. `/sitemap.xml` is a sitemap index referencing `/service-sitemap.xml`, `/news-sitemap.xml`, and `/page-sitemap.xml` only when each group is enabled and has eligible URLs. The child endpoints request group-filtered items from the same public Strapi sitemap API. Webtools remains installed for existing CMS data, but its independent sitemap add-on is disabled so it does not create a second public pipeline. Its persisted settings/table are intentionally left untouched.

## Current route registry

Static routes are declared in `STATIC_ROUTES`; dynamic routes are declared in `COLLECTION_ROUTES`. Stable `sitemapKey` values and child paths are declared with this central registry (`service`, `news`, `page`), not independently in each XML route. Services map to `service`, blog/news to `news`, and approved static/page routes to `page`. The current frontend has no locale-prefixed route tree, so the registry emits only the configured default locale and includes locale identity in the DTO. It does not fabricate `/vi` URLs or hreflang alternates. Add alternate URLs only after localized frontend routes exist.

Per-entry `seo.include_in_sitemap` is an additive optional field in the shared Page SEO component. Published records are included only if deployment indexing, global sitemap, and robots indexing are enabled; the entry is not noindex or explicitly excluded; its canonical stays on the configured origin; the URL is not an active redirect source; and its canonical is unique. Drafts never enter the published query. Exclusions and validation findings are visible in SEO Manager.

The existing SEO Manager singleton also stores two optional JSON policy maps: `sitemap_content_types` (keyed by Strapi UID) and `sitemap_static_routes` (keyed by stable route ID). Missing keys default to enabled for backwards compatibility. These settings only include/exclude sources; they never edit route patterns or content. The Sitemap tab displays code-owned paths/patterns read-only. Entry SEO, canonical, publication and redirect rules remain authoritative. Unknown saved keys appear as diagnostics instead of being silently discarded.

Canonical and redirect validation is first-party and data-driven. It detects malformed/cross-origin canonicals, duplicate canonical URLs, missing canonical targets, redirect sources, duplicate active redirect sources, loops, and chains. It does not make network requests to arbitrary URLs; HTTP status/404 crawling is intentionally not performed during sitemap generation.

## Environment and indexing

`NEXT_PUBLIC_SERVER_URL` (or `FRONTEND_URL` in Strapi) is the public origin; no production hostname is hardcoded. `SITE_INDEXING_ENABLED` is a deployment-level safety switch. Production should set it to `true`; staging/preview must set it to `false`. When unset, indexing defaults to enabled only when `NODE_ENV=production`. Strapi and Next.js receive the same runtime value in Docker Compose.

Strapi content changes tagged by the existing webhook invalidate the shared `sitemap` cache tag and revalidate the index and all child sitemap paths. Next.js falls back to its existing five-minute revalidation if webhook delivery fails.

## Admin

SEO Manager > Sitemap shows status and URL counts, child sitemap information, diagnostics, and collapsible sections for source policy and URL details. The primary public link is `/sitemap.xml`; the HTML sitemap page has been removed. Policy is saved to the existing SEO Manager singleton; route patterns and sitemap filenames are developer-owned because they must match the real Next.js route tree. The authorized Revalidate Sitemap action delegates to the existing authenticated Next.js `/api/revalidate` webhook for the shared sitemap cache tag and public routes. Editors control per-entry inclusion using the shared SEO component and global sitemap/indexing controls through the existing SEO Manager.

## Verification

CMS tests: `cd strapi-cms && node --test test/sitemap.test.cjs test/seo-health.test.cjs`.

Frontend XML index, child sitemaps and HTML route consume the same Strapi DTO. In production verify:

```sh
curl -i https://YOUR_SITE/sitemap.xml
curl -i https://YOUR_SITE/service-sitemap.xml
curl -i https://YOUR_SITE/news-sitemap.xml
curl -i https://YOUR_SITE/page-sitemap.xml
curl -i https://YOUR_SITE/sitemap.xsl
curl -i https://YOUR_SITE/robots.txt
```

Expected: `/sitemap.xml` is `<sitemapindex>`, child routes are `<urlset>`, XSL is `text/xsl`, and robots is plain text. `/sitemap` redirects to `/sitemap.xml` for compatibility. The robots sitemap directive must point to the index using the same public origin as the frontend deployment.

### Adding a sitemap source

1. Implement the frontend route.
2. Add the code-owned content/static route mapping in `strapi-cms/src/lib/sitemap.js`.
3. Add rule tests and verify canonical/redirect behavior.
4. Confirm the source appears in SEO Manager > Sitemap (route data is read-only; the admin only controls inclusion).
5. Verify `/sitemap.xml` and `robots.txt` against the deployment origin.

Never add individual generated URLs or XML by hand in the Admin UI.
