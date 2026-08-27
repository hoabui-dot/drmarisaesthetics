# SmileLux Figma parity recovery report

Date: 2026-08-18

## Implemented recovery steps

- Repaired the design-spec source chain: Home is now `docs/design-spec/pages/01-home.md`; accessibility has its own page; migration references use `references/` and correct package-relative paths.
- Added `scripts/check-design-docs.mjs` and verified documentation integrity.
- Added the machine-readable target contract at `docs/design-spec/contracts/homepage.target.json`.
- Added the Header + Hero element inventory at `docs/design-spec/contracts/header-hero-inventory.md`.
- Added explicit Hero action fields (`secondary_cta_action`, `secondary_cta_video_url`) and numeric `trust_rating` to Strapi, frontend raw/normalized types, and query mapping.
- Replaced Hero migration-critical generic fallbacks with CMS contract values and added an accessible video dialog.
- Header CTA now renders the CMS-driven target label.
- Revised migration 129 to canonicalize Figma Hero content, emit before/after dry-run diffs, back up the current payload, and support `--write --publish`.
- Added migration 130 for CMS-driven Header labels/order and CTA text.
- Updated the Strapi Dockerfile to avoid the multi-minute recursive ownership pass while retaining non-root runtime ownership.

## Header + Hero parity gates

```text
Content parity: PASS (API checker)
Action parity: PASS for booking-modal and video-dialog
Desktop visual parity: NOT RUN in this environment
Mobile visual parity: NOT RUN in this environment
Blocked media: Hero/avatar imagery may be unavailable and is allowed by the current review scope
Blocked functional: Technology route `/technology`; Pricing route `/pricing` (no CMS page exists)
Missing Figma elements: None in Header + Hero content/API contract
Extra non-Figma elements: None in the migrated Hero contract
```

## API verification

- `dental-frontend/scripts/check-figma-parity.mjs`: PASS.
- Canonical Hero is published with exact eyebrow, H1, paragraph, CTA labels, trust label, `4.9/5`, numeric rating `4.9`, and video source.
- Header CMS labels/order are `Home`, `About Us`, `Services`, `Technology`, `Pricing`, `Blog`, `Contact`.
- Header CTA is `BOOK APPOINTMENT`.
- Frontend health: HTTP 200.
- Strapi health: HTTP 204 and container healthy.

## Commands run

```text
node scripts/check-design-docs.mjs
npm run type-check (dental-frontend)
npm run type-check (strapi-cms)
targeted eslint (Hero, VideoDialog, Header): PASS
node migration_scripts/129-migrate-homepage-new-ui.js --dry-run
node migration_scripts/129-migrate-homepage-new-ui.js --write --publish
node migration_scripts/130-migrate-header-parity.js --write
node dental-frontend/scripts/check-figma-parity.mjs
docker compose build smilux-strapi
```

The repository-wide frontend lint currently reports 10 pre-existing errors and many warnings in unrelated legacy files; targeted lint for the changed Hero/Header/VideoDialog files has no errors. Strapi’s lint command is currently blocked by the repository’s missing `@strapi/eslint-config/server` package resolution; Strapi type-check and Docker build pass.

Visual screenshot comparison at 1440px and 390px remains a manual UI review gate; no visual PASS is claimed here.

## Homepage Hero section implementation

Specification followed: `docs/hompage-migration-codex/more-detail-per-section/hero-section.md`.

Changed files for this section:

- `dental-frontend/src/components/blocks/HeroBlock.tsx` — desktop full-bleed clinic composition, explicit two-line H1, transparent-header-compatible layout, CTA icons, social proof and accessibility semantics.
- `dental-frontend/src/components/blocks/HeroBlock.preview.tsx` — preview wrapper and comparison viewport declaration (`1034 × 666 px`).
- `dental-frontend/src/components/layout/Header.tsx`, `NavLink.tsx`, `app/globals.css` — homepage transparent header, compact desktop navigation, active HOME underline and tokenized Hero radius.
- `dental-frontend/src/types/strapi.ts`, `src/lib/api/queries.ts`, `strapi-cms/src/components/homepage/hero.json`, `migration_scripts/129-migrate-homepage-new-ui.js` — `heading_line_1`/`heading_line_2` CMS mapping and migration.
- `dental-frontend/tailwind.config.ts` — semantic `hero` radius token.

Implementation notes:

- The uploaded CMS clinic image was inspected and already contains the observed white/light left fade; no additional gradient or duplicated wall logo was added.
- Existing semantic Smilux tokens are used for colors, type hierarchy, borders, CTA surfaces and focus rings. No new image URL or raw color was introduced.
- OCR copy remains exact, including `Your Smile,` / `Our Passion`, `BOOK APPOINTMENT`, `WATCH VIDEO`, `Trusted by 10,000+ Patients`, and `4.9/5`.

Inferred/provisional items: desktop spacing and scale use the existing token scale because the raster provides estimates only; the hero corner uses the new semantic `hero` radius token. UNKNOWN items remain unresolved: exact Figma font/source SVGs, responsive layouts, nav/booking destinations, video product behavior beyond the existing configured dialog, sticky-scroll state, and whether wall branding is embedded (the inspected asset contains no separate DOM wall-logo requirement).

Validation checklist for manual UI review at `1034 × 666 px`:

- [ ] Header has no visible surface, border, blur or shadow on the initial homepage state.
- [ ] Navigation order and active HOME underline match the specification.
- [ ] H1 line break/color distinction, paragraph measure and side-by-side CTAs match.
- [ ] Four avatar overlap, five blue stars, trust label and `4.9/5` are visible when CMS media exists.
- [ ] Clinic chair, monitor, lamp and baked left fade retain the reference crop.
- [ ] Lower-right rounded boundary is visible.
- [ ] Keyboard focus is visible on links and controls; rating has an accessible label.

Unresolved questions are non-blocking for this desktop implementation but block final screenshot/behavior sign-off: Q1–Q15 in the Hero specification, especially exact font/assets and responsive/destination decisions.

## Hero visual refinement

- Fixed the background image stacking bug: the CMS clinic image now covers the full Hero section and is visible behind the content.
- Added a semantic white-to-transparent left overlay that ends at the desktop 50% boundary, allowing the supplied image to remain visible on the right without a hard divider.
- Added semantic Hero color tokens for the requested RGB values: common blue `rgb(1 81 247)`, title line 1 `rgb(0 84 74)`, and title line 2 `rgb(4 65 207)`.
- Hero social proof now uses four CMS avatars (IDs 97–100), approximately 30% overlap, `Trusted by 10,000+ Patients`, five sky-blue stars, and sky-blue `4.9/5`.
- Re-published the homepage migration; API parity remains PASS.

## Strapi Hero media field migration

- Confirmed `hero_images` belongs to `about.hero`; it is not a Homepage Hero field.
- Added explicit Homepage Hero upload fields: `background_image` (single image) and `patient_avatars` (multiple images).
- Kept the former `image` and `user_avatars` attributes private for backward compatibility while the new fields become the Admin editing surface.
- Updated Strapi population, frontend normalization, and migration mapping.
- Migrated and published the existing Hero media: background image `273`; patient avatars `97, 98, 99, 100`.
- Rebuilt both Strapi Admin and frontend containers. Health checks passed: Strapi `204`, frontend `200`.

## Avatar upload validation fix

- Strapi logs confirmed avatar uploads themselves returned `201`; the save validation was caused by legacy private media attributes remaining in the `homepage.hero` dynamic-zone schema/payload.
- Removed legacy `image` and `user_avatars` attributes from the runtime Hero schema and controller population. The Admin form now validates only `background_image` and `patient_avatars`.
- Kept migration-time fallback support so existing old records can still be read and converted, but writes now omit the legacy keys.
- Rebuilt Strapi Admin and re-ran the homepage migration/publish successfully.

## Publish log diagnosis

- Content Manager publish/save request completed with `PUT /content-manager/single-types/api::homepage.homepage` status `200`; no server-side validation 4xx was emitted.
- The actual server error was lifecycle revalidation using `http://localhost:3000` from inside the Strapi container (`ECONNREFUSED`).
- Docker Compose now routes lifecycle revalidation through `http://smilux-frontend:3000`; migration publish verified `Revalidation successful` and API writes remained `200`.
