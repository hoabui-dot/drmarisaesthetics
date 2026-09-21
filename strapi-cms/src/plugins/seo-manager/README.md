# SEO Manager Health Audit

The SEO Health tab analyzes published Strapi documents against the SEO behavior currently implemented by `dental-frontend`. It is an operational first-party audit, not a crawler, Google Search Console integration, or ranking score. Sitemap decisions come from the shared route registry in `src/lib/sitemap.js`.

## Data flow

`GET /seo-manager/health` is an authenticated Strapi Admin route protected by the `plugin::seo-manager.health` permission. The server fetches published content in batches by locale, drafts needed for canonical-target checks, global SEO/robots settings, website OG fallback, redirects, and canonical rules. A 30-second in-process snapshot cache avoids repeating the full read for every filter/pagination interaction. `?refresh=true` forces a new analysis.

The endpoint filters and paginates normalized issues server-side. The dashboard does not fetch one record per card or perform content writes.

## Current checks

- Effective title/description and OG image fallbacks for CMS Pages and Blogs; Service title/description and cover fallbacks as used by its current route; direct SEO title/description fields for the deep-plane landing page.
- Duplicate effective metadata is scoped to the same locale.
- Page SEO noindex/nofollow for routes that consume the shared SEO component.
- robots indexing, sitemap directive format, contradictory allow/disallow paths, and additional `Disallow: /` directives.
- Canonical URL format, page/global-rule disagreement, known noindex/draft/redirect targets, and multiple pages sharing a canonical destination.
- Sitemap enablement and the same published/indexable/canonical/redirect checks used to produce the frontend XML sitemap. The SEO Manager Sitemap tab shows included URLs, exclusions, and diagnostics from this service.
- Redirect self-loops, cycles, chains, duplicate active sources, invalid destinations, and internal targets not found in the audited route inventory. External HTTP(S) destinations are accepted but not fetched.
- Custom structured-data JSON/type checks only where the frontend consumes that field; supported global business type values are checked against the frontend allowlist.

Metadata fields that exist in Strapi but are ignored by a route are not treated as effective SEO input. Medical author/reviewer/reference checks are omitted because the relevant service/blog schemas do not expose those fields.

## Scoring

The score starts from the observed checks and subtracts centralized severity weights (critical 10, warning 3, recommendation 1), normalized by check count and the maximum severity weight, then clamped to 0–100. It is informational and must not be described as a Google score. Weights are centralized in `server/health/analyzer.js`.

## Limitations

- No external crawling, HTTP reachability check, Google Search Console, Lighthouse, ranking, backlink, or keyword data.
- Internal redirect destinations are checked against audited CMS routes and known static routes only; frontend dynamic routes not represented by these sources can be reported as unverified.
- External redirect targets are not requested, avoiding network-dependent checks and SSRF risk.
- Route patterns are deliberately developer-owned in the central registry and must be updated alongside the Next.js route tree. The current frontend does not have locale-prefixed routes; only the default Strapi locale is emitted until localized frontend routes are implemented.
- The snapshot cache is per Strapi process and lasts 30 seconds; no external cache or database state is introduced.
