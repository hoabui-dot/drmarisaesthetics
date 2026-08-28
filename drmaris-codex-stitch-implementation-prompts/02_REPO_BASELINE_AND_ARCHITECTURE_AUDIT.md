# Phase 2 — Repository Baseline and Architecture Audit


> Target repository: `https://github.com/hoabui-dot/drmarisaesthetics`
>
> Primary design source: Stitch MCP project `11858440040360110865` — **Remix of Dr. Maris Aesthetic Digital System**
>
> Figma mirror for visual verification only: `zEjuuaNerFPeaJHsWlXmyo`
>
> Do not implement from memory. Retrieve the exact Stitch screen named in this prompt before coding.


Do not implement the redesign in this phase. Produce a verified baseline first.

## Audit tasks

Inspect and report:

### Repository
- current branch and dirty files;
- monorepo/root structure;
- package manager and workspace layout;
- active Next.js application root;
- active Strapi v5 application root;
- Docker Compose files and which one is canonical for local/prod-like validation;
- CI workflow commands;
- environment variables required for frontend ↔ Strapi communication.

### Frontend
- all routes under the App Router;
- current implementations of `/`, `/about-us`, `/contact`, `/customers`, `/services`, service details, and doctor/profile routes if present;
- shared Header/Footer/navigation;
- design tokens, fonts, globals, Tailwind config;
- server/client component boundaries;
- Strapi client/fetch layer;
- image loader/domain settings;
- forms, reCAPTCHA, email submission, uploads;
- metadata, structured data, sitemap and robots;
- preview/draft mode;
- cache tags/ISR/on-demand revalidation.

### CMS
- content types;
- single types;
- reusable components;
- dynamic zones;
- media fields;
- SEO components;
- relationships;
- lifecycle/webhook behavior;
- Draft & Publish;
- localization if enabled;
- existing data that will map to new page designs.

### Baseline checks
Run the repository's real commands, discovered from its configuration:
- dependency install only if required;
- lint;
- type-check;
- production build;
- Docker config validation;
- Docker build/start/health if safe with available environment.

Do not "fix everything" yet. Record baseline failures separately.

## Required artifact

Create `implementation-audit.md` in a non-production report/docs location with:

1. architecture diagram in text;
2. route inventory;
3. Strapi content model inventory;
4. existing page → CMS mapping;
5. current quality-gate results;
6. Docker service table;
7. known technical debt;
8. risks;
9. proposed migration order;
10. explicit confirmation whether implementation can safely proceed.

If the current architecture is fundamentally incompatible with an incremental migration, explain why and stop before code changes. Otherwise proceed with an additive migration plan.
