# Page Phase — Reusable Service Detail Master


> Target repository: `https://github.com/hoabui-dot/drmarisaesthetics`
>
> Primary design source: Stitch MCP project `11858440040360110865` — **Remix of Dr. Maris Aesthetic Digital System**
>
> Figma mirror for visual verification only: `zEjuuaNerFPeaJHsWlXmyo`
>
> Do not implement from memory. Retrieve the exact Stitch screen named in this prompt before coding.


**Stitch screen ID:** `d157742981aa4f869cb110bad2ff2476`
**Figma mirror frame:** `2:881`

This screen is **not** a second competing Rhinoplasty page. Its purpose is to define the reusable service-detail architecture.

## Goal

Create or refactor a typed service-detail renderer and CMS contract that can support Rhinoplasty now and other surgical services later.

## Steps

1. Retrieve the exact master screen.
2. Inventory every section and mark it:
   - required;
   - optional;
   - repeatable;
   - relational/shared;
   - presentation-only.
3. Audit existing service routes, service collections, slug handling, metadata, sitemap, preview and revalidation.
4. Prefer a stable typed section contract over an unrestricted generic page builder.
5. Allow optional sections to disappear cleanly without blank whitespace.
6. Preserve semantic heading order and sticky table-of-contents behavior if shown.
7. Derive TOC IDs from stable section identifiers; avoid duplicate IDs and client-only mismatches.
8. Keep medical copy, quick facts, risks, recovery, FAQ, result references and CTA fields CMS-managed as appropriate.
9. Use shared components for repeated patterns, but do not force visually distinct sections through one unreadable mega-component.

## Route/data behavior

- Existing service slugs/URLs should continue working.
- Unpublished/deleted service documents should not remain in sitemap/cache.
- Preview should render draft content.
- On publish/update/unpublish/delete, existing revalidation flow must remain effective.

## Acceptance

Before applying the Medical Blue instance:
- render at least the current Rhinoplasty data through the new master contract;
- prove optional-section behavior;
- verify metadata/sitemap/preview;
- type-check the CMS response mapping without broad `any`.
