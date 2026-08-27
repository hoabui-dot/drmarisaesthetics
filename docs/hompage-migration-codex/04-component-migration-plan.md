# 04 — Frontend Component Migration Plan

## Principle

Prefer **rewrite-in-place for semantically compatible blocks** and **new components only for genuinely new concepts**.

This keeps the dynamic-zone API stable and reduces CMS migration complexity.

---

# A. Rewrite existing components

## 1. `src/components/layout/Header.tsx`

Keep:

- navigation props;
- booking modal integration;
- mobile menu state;
- active/route behavior.

Change:

- white/clean visual target;
- solid CTA;
- simplified logo styling;
- simple shadow state;
- reduced motion;
- make content dimensions match target header.

Do not:

- add a second header;
- hard-code nav labels that already come from CMS;
- add page-specific global CSS to `html/body`.

---

## 2. `src/components/blocks/HeroBlock.tsx`

Refactor into a much lighter component.

Suggested structure:

```tsx
<section className="home-hero ...">
  <div className="... max-w-home-container grid lg:grid-cols-[0.47fr_0.53fr]">
    <div>{/* eyebrow, h1, copy, CTA, proof */}</div>
    <div>{/* Next Image */}</div>
  </div>
</section>
```

Use existing animation abstraction where useful, but entrance effects only.

Hero must be imported/rendered eagerly as it is LCP-critical.

---

## 3. `ServicesBlock.tsx`

Keep the prop/data shape where possible.

Remove:

- cursor light;
- large hover scaling;
- heavy gradient glows;
- particle decoration;
- interactions hidden until hover if needed to understand navigation.

Target responsive class strategy should express 5/3/2/1 behavior without creating a JS resize listener.

---

## 4. `DoctorSection.tsx`

Replace featured-card hierarchy with a uniform profile grid/rail.

Keep:

- Next Image;
- badges/credentials;
- carousel primitive on small screens if chosen.

Remove hard-coded trust strip and unrelated labels.

---

## 5. `CertificationSection.tsx`

Reduce card height/density to match Figma.

Keep optional lightbox behind a clear click affordance, but do not make the section visually dependent on a modal interaction.

---

## 6. `CombinedTestimonialResult.tsx`

Refactor toward a focused Results/Stories section.

Required fixes:

- remove Unsplash fallback URLs;
- preserve native range keyboard control;
- simplify carousel/autoplay behavior;
- do not combine press logos here.

It may be renamed later, but during migration it is safer to keep the existing block type and export mapping until CMS data is moved.

---

## 7. `BlogCollectionSection.tsx`

Turn uniform carousel into editorial featured+secondary composition.

Recommended pure-CSS responsive layout; carousel not mandatory.

---

## 8. `src/components/layout/Footer.tsx`

Rewrite visual surface to deep navy. Preserve external/social/contact behaviors, but prefer passed CMS data to hard-coded clinic text/constants where both exist.

---

# B. Add new frontend components

Recommended files:

```text
dental-frontend/src/components/blocks/
├── HomeProofSection.tsx
├── TechnologyFeatureSection.tsx
├── EquipmentShowcaseSection.tsx
├── SocialProofSection.tsx
└── ConsultationSection.tsx
```

## `HomeProofSection.tsx`

Props should model:

- eyebrow/title/body;
- optional bullets;
- primary media;
- optional secondary media;
- repeatable metrics.

No client directive unless count-up or carousel interaction is used. If metric count-up is isolated, consider making only the metric child client-side rather than the whole section.

## `TechnologyFeatureSection.tsx`

Mostly presentational. Prefer a server-compatible component unless animation primitive requires client rendering. Data:

- eyebrow;
- title;
- description;
- CTA;
- large media;
- repeatable features.

## `EquipmentShowcaseSection.tsx`

Desktop can be plain CSS grid. Mobile horizontal scroll-snap can be CSS-first and avoid JS entirely unless arrows/pagination are required.

## `SocialProofSection.tsx`

Data:

- title/subtitle;
- reviews;
- optional portrait/accent image;
- press logos.

If carousel is interactive, scope client state here. Autoplay is off by default.

## `ConsultationSection.tsx`

Compose/reuse existing booking form/submission logic. Do not duplicate the API client or Zod schema.

CMS owns presentation copy/contact/expert details; frontend owns submission mechanics.

---

# C. Update BlockRenderer

Add exact cases for the five new normalized block types.

Suggested names:

```ts
'proof-showcase'
'technology-feature'
'equipment-showcase'
'social-proof'
'consultation'
```

Do not use string heuristics or “includes” checks.

---

# D. Update homepage query normalization

`getHomepage()` must map new raw Strapi components to normalized frontend props and call the existing media transformer consistently.

Avoid passing raw Strapi data directly to new components.

---

# E. Update types

Add precise raw and normalized types for all new blocks in `src/types/strapi.ts`.

For touched schemas, reduce `any` usage rather than adding more `any`.

---

# F. Page route

`src/app/page.tsx` should remain simple and CMS-driven.

Permitted changes during this migration:

- LCP/rendering adjustments;
- metadata corrections;
- caching/revalidation only if explicitly approved.

Not permitted:

- hard-coded section JSX replacing `BlockRenderer`;
- directly fetching each homepage section independently from the page route;
- importing every section into the page route to bypass the renderer.
