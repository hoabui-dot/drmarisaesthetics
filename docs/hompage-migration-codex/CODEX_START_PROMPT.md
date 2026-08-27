# Codex Start Prompt — Implement Smilux Homepage Figma V2

Use this prompt after placing this package in the repository or making it available to Codex.

---

You are implementing the Smilux homepage Figma V2 in the existing repository.

Before changing code, read in this exact order:

1. `rules/AGENTS.md`
2. `00-source-of-truth.md`
3. `01-current-homepage-audit.md`
4. `03-design-to-code-section-matrix.md`
5. `04-component-migration-plan.md`
6. `05-strapi-schema-migration.md`
7. `06-theme-token-migration.md`
8. `07-responsive-motion-performance.md`
9. `08-implementation-sequence.md`
10. `09-testing-acceptance.md`
11. `11-file-change-manifest.md`
12. `references/figma-home.md`
13. `references/theme.md`
14. `references/typography.md`
15. `references/responsive.md`
16. `../../design-spec/design-system/01-theme-colors.md`
17. `../../design-spec/design-system/02-typography.md`
18. `../../design-spec/design-system/08-accessibility.md`

Then inspect the current repository files before editing them. Do not trust this document instead of reading the live source.

## Objective

Replace the current homepage visual implementation with the audited Figma homepage while preserving the repository's CMS-driven Next.js + Strapi architecture and existing booking/business behavior.

## Start with Phase 0 and Phase 1 only

Do not immediately rewrite every section.

First:

1. create/confirm a feature branch;
2. record the current commit SHA;
3. run baseline frontend and Strapi type-check/lint/build commands;
4. inspect/export the current homepage API payload if environment credentials are available;
5. establish Premium Clinical Blue semantic tokens and typography without globally breaking unmigrated pages;
6. report the exact files you intend to change in the first implementation slice.

Then implement in the sequence defined in `08-implementation-sequence.md`.

## Non-negotiables

- Keep `getHomepage()` + `BlockRenderer` architecture.
- No giant hard-coded homepage component.
- No new frontend framework, animation library, carousel library or form library.
- No Three.js/WebGL for this design.
- Hero must be LCP-aware and primary CTA must be visible at 360px.
- New Strapi blocks require schema + dynamic zone + controller populate + types + query mapping + renderer + component.
- Reuse existing booking submission/validation for Consultation.
- Remove stock-image fallback behavior from clinical results.
- Simplify animations and respect reduced motion.
- Use semantic tokens, not scattered arbitrary hex values.
- Do not change global `html/body` styles to fix homepage-specific layout problems.
- Do not delete legacy Strapi homepage blocks in the first migration release.
- Do not publish/reseed new CMS block order before both backend and frontend support the block types.

## Completion

Do not call the task complete until every checkbox in `09-testing-acceptance.md` relevant to the implemented scope is verified or explicitly documented as blocked.
