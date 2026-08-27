# Smilux Homepage — Figma → Existing Codebase Migration Package

This package is the implementation handoff for replacing the current homepage of `hoabui-dot/smilelux-dentist` with the approved Smilux Figma homepage while preserving the repository's existing Next.js + Strapi architecture.

## Scope

**In scope now:** Homepage only, including the global Header/Footer changes required to visually match the Figma homepage.

**Not in scope now:** Migrating About, Services listing, service detail, Knowledge, Single Post, or Contact page layouts. The shared token decisions in this package should, however, be chosen so those pages can migrate later without a second redesign of the foundation.

## Source of truth order

1. `references/figma-home.md` — target homepage composition from the Figma audit.
2. `references/theme.md`, `references/typography.md`, `references/responsive.md` — normalized Figma design rules.
3. `AGENTS.md` — mandatory Codex implementation rules for this migration (a duplicate also exists under `rules/`).
4. Existing repository architecture and business behavior.
5. Existing visual styling only when it does not conflict with the Figma target.

When existing visual code conflicts with the Figma target, **the Figma specification wins**. When an implementation detail is not visible/provable in Figma, preserve existing business behavior and choose the simplest accessible implementation.

## Repository baseline audited

- Repository: `hoabui-dot/smilelux-dentist`
- Branch: `main`
- Latest commit observed during audit: `eafc2f4175e4644dc67936a7cb8984f14db2f007`
- Commit message: `Homepage layout creation`
- Frontend: Next.js 15.4.11 + React 19 + TypeScript + Tailwind 3.4 + Framer Motion / Embla
- CMS: Strapi 5.40.0
- Homepage architecture: Strapi single type → dynamic zone → frontend `getHomepage()` normalization → `BlockRenderer`

## Recommended reading order for Codex

1. `AGENTS.md`
2. `00-source-of-truth.md`
3. `01-current-homepage-audit.md`
4. `02-compatibility-scorecard.md`
5. `03-design-to-code-section-matrix.md`
6. `04-component-migration-plan.md`
7. `05-strapi-schema-migration.md`
8. `06-theme-token-migration.md`
9. `07-responsive-motion-performance.md`
10. `08-implementation-sequence.md`
11. `09-testing-acceptance.md`
12. `10-risk-rollback.md`
13. `11-file-change-manifest.md`
14. `CODEX_START_PROMPT.md`

## Core architectural decision

Do **not** replace the homepage with one giant hard-coded JSX page. Keep the existing CMS-driven architecture. Rewrite compatible visual blocks, add only the missing semantic CMS blocks, and seed/reorder the homepage dynamic zone after the schemas and renderer are ready.

## Migration headline

The existing codebase is technically very compatible with the new design. The migration is mostly a **visual-system + content-model migration**, not a framework rewrite.

Indicative readiness:

- Framework/runtime: **95% compatible**
- Homepage data-flow architecture: **90% compatible**
- CMS dynamic-zone model: **85% compatible**
- Existing functional primitives: **85% reusable**
- Current homepage content model: **~65% compatible**
- Current component visual fidelity to new Figma: **~35%**
- Current theme/token fidelity to new Figma: **~40%**
- Overall implementation readiness: **~70%**

These are engineering assessment scores, not automated test results.
