# DR. MARIS AESTHETICS — Codex + Stitch MCP Implementation Prompt Pack

This pack is designed to migrate the existing DR. MARIS AESTHETICS website to the new Stitch design while preserving the existing Next.js + Strapi architecture, CMS editability, SEO behavior, preview flow, webhook revalidation, forms, and production data.

## How to use

### Recommended
1. Open the repository in Codex CLI.
2. Verify that the Stitch MCP server is authenticated and available.
3. Run `MASTER_ORCHESTRATOR.md` if you want Codex to manage the complete implementation.
4. For tighter control, execute the numbered prompts in `00_RUN_ORDER.md` one at a time.
5. Do not skip quality gates between phases.

## Known project facts discovered during preparation

- Frontend is based on Next.js 15, React 19, TypeScript, Tailwind CSS, and the App Router.
- The repository contains its own AI/architecture rules under `.ai/`; these must be read before code changes.
- The existing project uses a headless Next.js + Strapi v5 architecture with preview and webhook-driven revalidation.
- Repository performance rules favor server-first rendering, SSG/ISR for content pages, minimal Strapi payloads, lazy loading of non-critical UI, and selective Framer Motion.
- Strapi v5 migration requires special care around Draft & Publish/document IDs and component duplication.
- The frontend currently contains routes including `/`, `/about-us`, `/contact`, `/services`, `/customers`, `/news`, and a dynamic `[slug]` route.
- `dental-frontend/package.json` exposes `lint`, `type-check`, `build`, Docker, and Strapi scripts, but the agent must discover the actual active Docker/Strapi layout before assuming those scripts are current.

## Stitch screen registry

| Purpose | Stitch Screen ID | Title |
|---|---|---|
| Home | `f02c3c29c60949a5940ea4908cc3e2c9` | Maris Aesthetics \| Home (Complete with FAQ & Final CTA) |
| Patient Results | `afdcdb94f75742b8be793c299d811b85` | Patient Results \| Clinical Blue Gallery |
| Contact | `72a83ef98fc1400caafa5a899f93e124` | Contact & Consultation \| Premium Editorial Hero Update |
| Rhinoplasty visual target | `ebea7782814d4f229db4d6c1a29daf8e` | Rhinoplasty Surgery \| Medical Blue Edition |
| Service-detail master | `d157742981aa4f869cb110bad2ff2476` | Rhinoplasty Surgery \| Service Detail (Master Template) |
| Surgeon profile | `c6b066eca34a4ab68fada8b299831c25` | Dr. A. Maris, MD \| Surgeon Profile (Revision Cases Update) |
| About Us | `dc81d96c305b44dd9d94614b4458c76a` | About Us \| Maris Aesthetics (Medical Blue Sync) |

The empty/unnamed Stitch screen is intentionally excluded. Do not implement it unless the user explicitly identifies its purpose later.

## Design precedence

1. Exact Stitch screen ID listed above.
2. Figma mirror of the corresponding frame, only for visual verification/debugging.
3. Existing codebase behavior and data flow that must remain functional.
4. Never invent missing design details when the source can be queried.

## Critical Rhinoplasty rule

The two Rhinoplasty screens have different roles:
- **Service Detail (Master Template)** defines reusable service-detail information architecture and CMS/component contracts.
- **Medical Blue Edition** is the production visual/content target for the Rhinoplasty page.

Do not create two unrelated service systems. Build one reusable service-detail foundation from the master and render the Rhinoplasty instance using the Medical Blue target.

## Output discipline

After every phase, Codex must print a completion report containing:
- files changed;
- CMS/schema changes;
- migrations/data changes;
- commands executed and exact pass/fail result;
- routes tested;
- remaining visual differences;
- blockers/risks;
- whether the phase gate passed.

A phase is not complete because code was written. It is complete only after its required checks pass.
