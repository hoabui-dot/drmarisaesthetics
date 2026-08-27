# 01 — Current Homepage Code Audit

## Executive finding

The current homepage is already implemented as a modular, CMS-driven system. That is the strongest part of the codebase and should be preserved. The largest gap is that the current UI represents a different visual direction: more gradients, glass effects, floating animation, large cards and featured-card asymmetry than the new Figma.

The migration therefore should **not** start by replacing `src/app/page.tsx`. It should start from the section components, semantic tokens and missing Strapi components.

---

## 1. Runtime and frontend foundation

`dental-frontend/package.json` provides:

- Next.js 15.4.11;
- React 19;
- TypeScript 5;
- Tailwind CSS 3.4;
- Framer Motion;
- Embla Carousel;
- Radix UI;
- React Hook Form + Zod;
- Lucide and Font Awesome;
- Three.js packages, although the new Figma does not require 3D.

### Assessment

**Keep. No framework migration required.**

The stack is more than capable of implementing the target. Do not introduce another UI framework, CSS-in-JS library, animation library, carousel library or form library for this migration.

---

## 2. Homepage route and data flow

Current route:

`dental-frontend/src/app/page.tsx`

Observed behavior:

```text
Next.js Server Component
    ↓
getHomepage()
    ↓
Strapi /api/homepage
    ↓
normalize dynamic-zone blocks
    ↓
<BlockRenderer blocks={homepage.blocks} />
```

The route also derives metadata from the CMS homepage model.

### Good fit

This is exactly the right structural approach for the new design. Preserve it.

### Migration issue

The route currently uses:

```ts
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
```

That guarantees fresh CMS data but prevents effective page/data caching. It can hurt TTFB/LCP for a media-heavy homepage.

**Do not change this casually during the visual migration.** First confirm whether immediate CMS freshness is a business requirement. If not, a later performance phase can move to controlled revalidation.

---

## 3. BlockRenderer

Current renderer knows these homepage block types:

- `video-hero`
- `hero`
- `services`
- `cta`
- `about`
- `combined-testimonial-result`
- `trust`
- `process`
- `doctor`
- `certification`
- `papers-section`
- `faq`
- `blog-collection-section`

This already covers many conceptual homepage needs, but not all target sections.

### Important renderer issue for the new design

The regular static `HeroBlock` is lazy loaded while the current `VideoHero` receives eager treatment. The new Figma hero is a static/image-led above-the-fold hero.

For the new homepage:

- static `HeroBlock` should be treated as LCP-critical;
- do not add an unnecessary lazy boundary around the hero;
- legacy `video-hero` can stay in the code/schema for backward compatibility, but should not be present in the new homepage block order unless specifically requested.

### Diagnostic fallbacks

Unknown blocks currently render diagnostic UI. This is useful in development but should not leak into production. Keep the diagnostic behavior for migration development, then verify no unknown types exist before release.

---

## 4. `getHomepage()` normalization layer

`dental-frontend/src/lib/api/queries.ts` is a central compatibility boundary. It converts raw Strapi dynamic-zone components into frontend-friendly block types and resolves media URLs.

### Good fit

Preserve this layer. New section schemas should be normalized here rather than exposing raw Strapi shapes deep into presentation components.

### Existing debt

There is noticeable schema/type drift and broad `any` usage. Example:

- frontend services type exposes `subtitle`, `viewMoreLabel`, `viewMoreLink`;
- current Strapi `homepage.services` schema only defines `title`, `description`, and `items`.

Migration is the right time to align the new homepage schemas, raw types and normalized types for every touched block.

---

## 5. Strapi homepage architecture

Current homepage is a Strapi `singleType` with a `layout` dynamic zone. The dynamic zone currently permits 13 existing component types.

The custom homepage controller explicitly populates nested media/repeatable components for each known component type.

### Good fit

This architecture is highly compatible with the Figma page because the design is section-oriented.

### Mandatory migration rule

Every **new** dynamic-zone section that contains media or nested repeatable items requires all of the following together:

1. Strapi component JSON;
2. inclusion in homepage `layout.components`;
3. controller `populate` fragment;
4. raw TypeScript type;
5. normalized TypeScript type;
6. `getHomepage()` mapping;
7. `BlockRenderer` case;
8. React section component;
9. migration/seed data;
10. API verification.

Do not implement only the frontend half.

---

# Existing component-by-component audit

## Header — KEEP behavior, REWRITE visuals

Current file:

`dental-frontend/src/components/layout/Header.tsx`

### Reusable behavior

- global layout integration;
- CMS navigation data;
- mobile drawer;
- booking modal trigger;
- sticky/fixed behavior;
- progress/navigation handling;
- active section observation.

### Visual mismatch

Current implementation has:

- gradient/backdrop-heavy header;
- card-like logo styling with shadow/border;
- logo scaling on scroll;
- gradient CTA with shimmer/ping effects;
- extensive microanimation.

The Figma target is much quieter:

- clean white header;
- compact logo;
- flat navigation;
- simple active blue underline/text;
- solid blue booking CTA;
- subtle shadow only after scroll.

### Migration action

Rewrite styles and simplify motion while retaining the CMS nav + booking modal behavior. Do not fork a homepage-only header because Header is global chrome.

---

## HeroBlock — REWRITE visual component, EXTEND schema

Current file:

`src/components/blocks/HeroBlock.tsx`

### Reusable

- CMS heading/subheading/image;
- Next `Image`;
- booking CTA integration;
- avatar media support;
- responsive 12-column base;
- `useMobileAnimation` / `PerformanceAnimation` infrastructure.

### Current mismatch

Current hero adds design elements that are not part of the new Figma intent:

- animated background blobs;
- radial grid texture;
- hard-coded “World-Class Clinical Care” badge;
- hard-coded “15+ Years of Excellence” floating badge;
- floating hero image;
- heavy decorative glow treatment.

There is also a potential mobile conversion issue in the current code path: in the simplified mobile branch, the booking button is in a `hidden sm:block` desktop sub-layout while the `<sm` mobile portion shows trust/rating/avatars. During rewrite, explicitly test that the primary CTA is visible at 360/390/430 widths.

### Target

- 46–48% copy / 52–54% image on desktop;
- H1 ~56–64 desktop, 38–44 mobile;
- primary + optional secondary CTA;
- simple reassurance/proof line;
- image art direction without floating gimmicks;
- lightweight entrance motion only.

### Schema gap

Current schema supports heading, subheading, image, one CTA and avatars. Add optional fields rather than hard-coding content:

- `eyebrow`;
- `secondary_cta_label`;
- `secondary_cta_link`;
- optional `trust_label` / `trust_value` if the design/content team wants hero reassurance editable.

---

## TrustSection — PARTIAL REUSE, target requires new semantic block

Current file:

`TrustSection.tsx`

### Reusable

- count-up stat logic;
- stats content shape;
- certification/logo rendering idea;
- media handling.

### Mismatch

Current component is primarily a stats grid + certification rail over animated pale-blue backgrounds. The Figma proof section is editorial/magazine-like: ~35–40% copy and ~60–65% visual/stat composition with clinic/team imagery.

### Decision

Do not overload the old `homepage.trust` schema with unrelated media-mosaic semantics if it is used elsewhere. Add a new `homepage.proof-showcase` block or intentionally version the trust block.

Recommended new block: `homepage.proof-showcase`.

---

## ServicesBlock — KEEP data concept, REWRITE layout/interactions

Current file:

`ServicesBlock.tsx`

### Reusable

- service items and links;
- CMS images;
- responsive carousel primitive;
- section header primitive.

### Mismatch

Current UI is a large 3-column card design with:

- cursor-following light;
- large 20–24px rounded cards;
- heavy padding;
- lift + scale;
- hidden CTA revealed on hover;
- mobile one-card carousel.

Figma target:

- five compact cards on large desktop;
- roughly 18–19% width each;
- 5 → 3 → 2 → 1 responsive behavior;
- compact image/icon area;
- always-understandable link treatment;
- subtle `translateY(-3px)` hover only.

### Migration

Rewrite `ServicesBlock.tsx`; keep block type `homepage.services`. Align Strapi schema with frontend expectations by adding optional eyebrow/subtitle/view-more fields if used.

---

## Technology section — ADD

No current homepage block semantically models the target OTI technology feature.

Do not misuse `homepage.about` simply because it has a two-column image/text layout. Technology is a distinct CMS concept with its own features and CTA.

Add:

- Strapi: `homepage.technology-feature`;
- Frontend: `TechnologyFeatureSection.tsx`.

---

## Equipment showcase — ADD

No current block matches the dark navy 4-equipment showcase.

Add:

- `homepage.equipment-showcase`;
- repeatable equipment items with image/title/description/link;
- desktop 4-column, mobile horizontal snap.

Avoid Three.js/WebGL. The design only needs polished card/media motion.

---

## DoctorSection — KEEP data, REWRITE composition

Current file:

`DoctorSection.tsx`

### Reusable

- doctor data;
- 3:4 portrait handling;
- carousel component;
- credentials/badges/stats;
- Next Image.

### Mismatch

Current implementation emphasizes one lead specialist and uses dark image overlays, gradient scrims and hard-coded trust pills. The Figma target uses four visually equal, clean, white/light profile cards.

### Migration

- Remove forced featured hierarchy from the default homepage presentation.
- Remove hard-coded trust strip text.
- Keep 3:4 portrait ratio.
- Use 4 columns on wide desktop; tablet 2; mobile 1-card carousel/list.
- Add optional `view_all_label/link` to schema if desired.

---

## CertificationSection — KEEP content, REWRITE density

Current file:

`CertificationSection.tsx`

### Reusable

- certification data;
- media;
- optional lightbox logic.

### Mismatch

Current certificates are 400–450px tall hero-like carousel cards with dark overlays. Figma shows an accreditation/logo strip plus compact certificate cards, roughly five across at desktop.

### Migration

Rewrite visual density. Keep lightbox only if it remains a useful secondary interaction and does not distort the visual target.

---

## CombinedTestimonialResult — REUSE mechanics, SPLIT responsibilities

Current file:

`CombinedTestimonialResult.tsx`

### Strong reusable capability

- before/after range slider;
- testimonial content;
- rating rendering;
- carousel state;
- touch/drag support.

### Problems to migrate

1. The component includes fallback external Unsplash images. Production healthcare content should never silently fall back to unrelated stock clinical images. Missing required result media should result in a controlled placeholder or omission.
2. It auto-rotates every six seconds. The target review guidance avoids auto-rotating testimonial content unless a pause control exists.
3. The Figma separates **Real Stories / Results** from the following **Testimonials + Press** section.

### Decision

Use the existing before/after interaction as a base for a dedicated results presentation, but add a new `homepage.social-proof` block for reviews + press/logo proof.

If keeping autoplay anywhere, implement an explicit pause mechanism and respect reduced-motion; otherwise remove autoplay.

---

## BlogCollectionSection — KEEP data, REWRITE layout

Current file:

`BlogCollectionSection.tsx`

### Reusable

- CMS article data;
- article URLs;
- Next Image;
- carousel primitives.

### Mismatch

Current implementation is a uniform card carousel. Figma uses a mixed editorial composition: one larger featured article + smaller secondary items.

### Migration

- Keep `homepage.blog-collection-section` block type.
- Add/standardize featured selection semantics (`showFeatured` or first item).
- Desktop: editorial mixed grid.
- Mobile: feature first, then stacked article rows.
- Avoid forcing carousel if the screenshot does not require it.

---

## Consultation section — ADD, reuse booking business logic

The target homepage ends with an embedded consultation block: form left, clinic/expert info right.

The codebase already contains booking modal/form infrastructure and booking submission APIs. Reuse the validation, field definitions and submission client logic rather than creating a second divergent booking flow.

Add a presentational CMS block that controls copy/contact presentation while reusing the existing booking submission layer.

Do not make the CMS responsible for storing submission behavior or endpoints.

---

## Footer — KEEP data role, MAJOR visual rewrite

Current file:

`Footer.tsx`

### Reusable

- global placement;
- CMS footer data;
- contact links;
- social link infrastructure.

### Mismatch

Current footer is a light white-to-blue 3-column footer with hard-coded “International Dental Clinic” wording and mixed CMS/constants. The Figma target is a deep navy multi-column footer with stronger navigation/service/contact grouping and an appointment CTA.

### Migration

- move to `brand.navyDark` background;
- use CMS-provided brand/contact data wherever available;
- remove unnecessary hard-coded clinic naming when CMS data exists;
- align footer link groups with target IA;
- keep social and contact behavior;
- preserve optional back-to-top only if accessible.

Because Footer is global, this change affects all pages. Treat it as a deliberate shared-chrome migration, not an accidental homepage CSS side effect.

---

# Current homepage blocks that should NOT appear in the new Figma order by default

The repository may retain these schemas/components for backward compatibility, but the new homepage should not include them unless product explicitly asks:

- `homepage.video-hero`;
- `homepage.process`;
- `homepage.faq`;
- generic `homepage.cta` if consultation replaces it;
- generic `homepage.about` if proof/technology sections replace its role.

Do not delete legacy schemas during the first migration pass. Remove them from the new homepage record/order first; delete only after verifying no other content depends on them.
