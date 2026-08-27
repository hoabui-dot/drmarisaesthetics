# 11 — Proposed File Change Manifest

This is a planning manifest, not a command to modify every file. Codex should inspect the actual current file before editing it.

## Frontend — expected updates

```text
dental-frontend/
├── src/app/page.tsx                              # small LCP/caching-safe adjustments only
├── src/app/globals.css                           # tokens/utilities only; no page-specific html/body hacks
├── tailwind.config.ts                            # semantic v2 token aliases if needed
├── src/components/BlockRenderer.tsx              # new block cases + hero eager strategy
├── src/components/layout/Header.tsx              # visual rewrite
├── src/components/layout/Footer.tsx              # visual rewrite
├── src/components/blocks/HeroBlock.tsx           # rewrite
├── src/components/blocks/ServicesBlock.tsx       # rewrite
├── src/components/blocks/DoctorSection.tsx       # rewrite
├── src/components/blocks/CertificationSection.tsx# rewrite
├── src/components/blocks/CombinedTestimonialResult.tsx # refactor
├── src/components/blocks/BlogCollectionSection.tsx     # rewrite
├── src/lib/api/queries.ts                        # new mappings / aligned fields
└── src/types/strapi.ts                           # precise new raw + normalized types
```

## Frontend — expected additions

```text
dental-frontend/src/components/blocks/
├── HomeProofSection.tsx
├── TechnologyFeatureSection.tsx
├── EquipmentShowcaseSection.tsx
├── SocialProofSection.tsx
└── ConsultationSection.tsx
```

Potential shared extracted primitives, only when real duplication appears:

```text
src/components/ui/
├── HomeSectionHeader.tsx       # only if existing header primitive cannot match target cleanly
├── ClinicalCard.tsx            # only if multiple sections truly share structure
└── ResultBeforeAfter.tsx       # if extracted from combined result component
```

Do not preemptively create a large design-system component layer with one-off wrappers.

---

## Strapi — expected updates

```text
strapi-cms/
├── src/api/homepage/content-types/homepage/schema.json
├── src/api/homepage/controllers/homepage.ts
├── src/components/homepage/hero.json
└── src/components/homepage/services.json
```

## Strapi — expected additions

```text
strapi-cms/src/components/homepage/
├── proof-showcase.json
├── proof-metric.json
├── technology-feature.json
├── equipment-showcase.json
├── equipment-item.json
├── social-proof.json
├── review-item.json
├── press-logo.json
└── consultation.json
```

Reuse existing generic component schemas when their semantics are truly identical.

---

## Migration/seed script

Recommended new script name, following repository convention:

```text
strapi-cms/migration_scripts/0xx-seed-homepage-figma-v2.js
```

Use the next actual sequence number found at implementation time.

The script should:

- be idempotent where possible;
- not delete unrelated content types;
- preserve a clear backup/rollback path;
- validate that required media references exist;
- log final dynamic-zone block order.

---

# Files that should NOT be introduced

Avoid:

- a new `HomePageV2.tsx` that hardcodes all CMS content;
- a second homepage API client;
- a second carousel library;
- a second form stack;
- standalone Three.js scenes;
- one CSS file per section if Tailwind + semantic tokens already solve styling;
- duplicate Header/Footer components used only on `/`.
