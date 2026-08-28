# Phase 4 — Strapi Schema Mapping and Safe Content Migration


> Target repository: `https://github.com/hoabui-dot/drmarisaesthetics`
>
> Primary design source: Stitch MCP project `11858440040360110865` — **Remix of Dr. Maris Aesthetic Digital System**
>
> Figma mirror for visual verification only: `zEjuuaNerFPeaJHsWlXmyo`
>
> Do not implement from memory. Retrieve the exact Stitch screen named in this prompt before coding.


The current frontend/CMS schema does not fully match the new design. Redesign the content model only after auditing existing data.

## Primary objective

Create a CMS model that supports the new pages without turning every pixel into a CMS field and without hardcoding content that editors reasonably need to change.

## Mapping strategy

Classify each design value as one of:
1. **Global CMS** — shared contact info, clinic/hospital info, navigation/footer, doctor identity, global CTA.
2. **Page CMS** — page-specific hero, editorial sections, FAQs, SEO.
3. **Reusable component CMS** — timeline item, FAQ item, CTA, statistic, info list, gallery/case item where reuse/editing benefits justify it.
4. **Collection relation** — service, doctor, result/case, taxonomy/category.
5. **Code/design token** — spacing, typography, colors, visual-only labels, component variants.
6. **Derived value** — generated from existing CMS relations or metadata.

Do not create one-off fields for purely presentational CSS.

## Required schemas to evaluate

At minimum determine whether the existing models can support:
- homepage;
- About Us;
- Contact/Consultation;
- Doctor profile;
- patient result/case gallery;
- reusable service-detail page;
- Rhinoplasty instance;
- FAQ groups;
- CTA/consultation blocks;
- SEO metadata and structured-data inputs;
- shared site settings.

Do not duplicate existing schemas when they can be extended cleanly.

## Service architecture

Use a single reusable service-detail contract where practical.

The Stitch screen `d157742981aa4f869cb110bad2ff2476` is the reusable **Master Template**.
The screen `ebea7782814d4f229db4d6c1a29daf8e` is the **Rhinoplasty Medical Blue production instance**.

Model the reusable sections so future surgical services can use the same renderer with optional/ordered blocks where appropriate, but do not build an over-generic page builder that sacrifices type safety.

## Patient Results

Cases may contain medically sensitive imagery and structured case metadata. Preserve existing consent/disclaimer mechanisms if present. Map filters to real taxonomy/fields, not hardcoded labels if editors need to manage them.

## Safe migration

Before applying schema changes:
- create/verify DB backup;
- save a model diff;
- identify data-loss risks;
- make migration idempotent where possible;
- preserve document IDs and Draft & Publish semantics;
- migrate both draft/published states correctly according to the repository's Strapi v5 migration rules;
- ensure component rows are not incorrectly shared between draft/published documents;
- do not manually mutate PostgreSQL unless necessary and fully understood.

After migration verify:
- Content Manager shows entries normally;
- draft editing works;
- publish/unpublish works;
- API published state works;
- preview/draft fetch works;
- media relations work;
- existing content was not lost;
- webhook revalidation still fires/works as designed.

## Required deliverables

Create:
- `cms-field-mapping.md`
- `schema-change-plan.md`
- `migration-plan.md`

Use the matrix template in this prompt pack.

Only then implement schema/migration changes.
