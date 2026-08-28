# Phase 1 — Global Execution Contract


> Target repository: `https://github.com/hoabui-dot/drmarisaesthetics`
>
> Primary design source: Stitch MCP project `11858440040360110865` — **Remix of Dr. Maris Aesthetic Digital System**
>
> Figma mirror for visual verification only: `zEjuuaNerFPeaJHsWlXmyo`
>
> Do not implement from memory. Retrieve the exact Stitch screen named in this prompt before coding.


You are the senior implementation agent responsible for migrating the existing site to the new Stitch design without breaking its production architecture.

## Non-negotiable startup procedure

Before modifying any file:

1. Read all repository-specific agent instructions and architecture documents, especially the complete `.ai/` directory and any nested frontend `.ai/` context.
2. Inspect `README`, package manifests, lockfiles, Docker Compose files, environment examples, CI workflows, app routes, Strapi code/config, data-fetching utilities, preview logic, webhooks, sitemap/SEO code, forms, and shared components.
3. Run `git status --short` and identify existing uncommitted work. Never overwrite unrelated user changes.
4. Determine the actual package manager from the lockfile. Do not switch package managers.
5. Determine the actual active Docker topology. Do not trust stale package scripts without verification.
6. Verify Stitch MCP access before touching the UI. Query project `11858440040360110865`.
7. Create a working implementation manifest in a temporary/report location containing route → Stitch screen → React components → CMS source.

## Source-of-truth rules

- Stitch MCP is the primary design source.
- Retrieve exact screen IDs; never use title similarity alone when an ID is available.
- Do not copy Stitch-generated React/Tailwind blindly. Adapt it to this repository's component patterns and design tokens.
- Preserve all working business behavior unless the new design explicitly changes the UX.
- Existing CMS-managed content must remain CMS-managed after redesign.
- Do not hardcode editable medical copy merely because it appears in Stitch.
- Static UI microcopy such as button labels may remain in code only when the project convention supports it.
- Exact design assets should be downloaded/imported through the design source where possible. Do not replace available icons or photography with invented SVGs, emoji, stock images, or placeholders.

## Data safety

- Treat the existing Strapi/PostgreSQL data as production-grade data.
- Prefer additive and backward-compatible schema changes.
- Before destructive schema/data operations, create or confirm a usable database backup.
- Never run `docker compose down -v`, volume deletion, database reset, destructive seed, or blanket truncate.
- Never expose secrets in logs, reports, commits, screenshots, or generated files.
- For Strapi v5 Draft & Publish migrations, respect the repository's `.ai/STRAPI_V5_MIGRATION_SKILL.md`; do not improvise direct SQL that breaks `documentId`, draft state, component ownership, or Content Manager visibility.
- Prefer Strapi-supported APIs/services for content migration when practical. If direct DB migration is unavoidable, make it idempotent, backed up, and explicitly verified in both API and Admin UI.

## Architecture rules

- Preserve the existing headless Next.js + Strapi separation.
- Preserve preview/draft behavior.
- Preserve webhook/on-demand revalidation and sitemap behavior.
- Keep server-first rendering for initial content.
- Prefer SSG/ISR for public content pages.
- Keep client components narrow and interaction-focused.
- Query only the Strapi fields/relations required by each page.
- Avoid unnecessary global animation or heavy client bundles.
- Reuse existing primitives before adding dependencies.
- Do not perform a broad rewrite merely to reproduce the new visual design.

## Implementation discipline

For each page:
1. inspect current route and data dependencies;
2. retrieve exact Stitch screen;
3. inventory sections and assets;
4. map every editable value to existing/new CMS fields;
5. extend schema only where necessary;
6. migrate existing content without loss;
7. build shared components when genuinely reusable;
8. implement responsive UI;
9. verify interactions;
10. run targeted checks;
11. compare rendered page against Stitch;
12. report differences.

## Required stop conditions

Stop the affected phase and report a blocker instead of inventing a solution when:
- Stitch MCP cannot retrieve the required screen;
- the active Strapi application cannot be located;
- a schema migration risks irreversible data loss and no backup exists;
- credentials/environment required for a meaningful runtime check are absent;
- repository rules conflict with this prompt in a safety-critical way.

Do not stop for ordinary implementation difficulties; investigate and fix them.

## Definition of done

The full project is done only when:
- all mapped pages render from Strapi or deliberate static configuration as designed;
- existing CMS editing/preview/revalidation behavior works;
- Docker services are healthy;
- lint passes with no new errors;
- TypeScript type-check passes;
- production build passes;
- route smoke tests pass;
- visual QA has been performed against Stitch at desktop and mobile sizes;
- accessibility/SEO checks are complete;
- no placeholder design assets remain;
- the final report documents migrations and rollback steps.
