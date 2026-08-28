# MASTER ORCHESTRATOR — Full Stitch-to-Codebase Migration


> Target repository: `https://github.com/hoabui-dot/drmarisaesthetics`
>
> Primary design source: Stitch MCP project `11858440040360110865` — **Remix of Dr. Maris Aesthetic Digital System**
>
> Figma mirror for visual verification only: `zEjuuaNerFPeaJHsWlXmyo`
>
> Do not implement from memory. Retrieve the exact Stitch screen named in this prompt before coding.


You are responsible for the complete implementation of the new DR. MARIS AESTHETICS design into the existing repository.

This is a multi-phase engineering migration, not a one-shot HTML reproduction.

## Mission

Implement all approved Stitch screens:
- Home — `f02c3c29c60949a5940ea4908cc3e2c9`
- Patient Results — `afdcdb94f75742b8be793c299d811b85`
- Contact — `72a83ef98fc1400caafa5a899f93e124`
- Rhinoplasty Master — `d157742981aa4f869cb110bad2ff2476`
- Rhinoplasty Medical Blue — `ebea7782814d4f229db4d6c1a29daf8e`
- Surgeon Profile — `c6b066eca34a4ab68fada8b299831c25`
- About Us — `dc81d96c305b44dd9d94614b4458c76a`

Ignore the unnamed/empty Stitch screen.

## Execution model

Work in the exact phase order documented in this prompt pack:
1. execution contract;
2. repository baseline;
3. Stitch design lock/assets;
4. Strapi mapping/migration;
5. shared design system;
6. page implementation one page at a time;
7. content/null-state integration;
8. responsive/accessibility/SEO;
9. forms/interactions;
10. production asset cleanup;
11. Docker health;
12. lint/type-check/build;
13. visual regression;
14. release/rollback report.

Read the corresponding markdown file in this prompt pack before each phase if these files are present in the working directory.

## Hard gates

Do not proceed past a phase that introduced:
- schema/data corruption;
- Docker startup failure;
- fatal runtime errors;
- newly failing lint/type-check/build;
- broken CMS editing/preview/revalidation;
- missing required Stitch access.

Fix the phase before continuing.

## Repository-first rule

Before changing code:
- read all `.ai/` rules and project context;
- inspect existing uncommitted work;
- identify active Next.js/Strapi/Docker structure;
- preserve existing architecture and business behavior.

The repository currently appears to use Next.js 15 + React 19 + TypeScript + Tailwind and Strapi v5 concepts, but verify actual source before relying on this statement.

## Stitch-first rule

For every page:
- call Stitch MCP;
- select exact project/screen ID;
- inspect layout, content, components and assets;
- save a section/asset mapping;
- then implement.

Never implement a page solely from this prompt's textual summary.

## CMS-first content rule

Do not hardcode editable page copy just to match the screenshot.
Map content to Strapi and migrate existing content safely.
Keep shared doctor/hospital/contact data normalized when the existing architecture supports it.

## Rhinoplasty architecture rule

`d157742981aa4f869cb110bad2ff2476` is the reusable service-detail master.
`ebea7782814d4f229db4d6c1a29daf8e` is the Rhinoplasty production visual/content instance.

Build one typed reusable service system, then apply the Medical Blue instance. Do not create two separate service-detail architectures.

## Safety rule

Never destroy persistent Docker volumes or reset PostgreSQL.
Back up before destructive-risk schema work.
Respect Strapi v5 Draft & Publish/document/component ownership rules.

## Quality rule

Actual command execution is required.
Do not say "lint/build should pass."
Run the commands and report their output/result.

At the end of every phase, print the completion report from `templates/PHASE_COMPLETION_REPORT.md`.

## Final definition of done

Finish only after:
- all screens are implemented;
- CMS fields and existing data map correctly;
- Strapi Admin can edit/publish content;
- preview works;
- webhooks/revalidation/sitemap still work;
- forms work end-to-end;
- Docker runtime is healthy;
- lint passes with no new errors;
- TypeScript passes;
- production build passes;
- route smoke tests pass;
- desktop + mobile visual QA against Stitch is complete;
- temporary design URLs/mock data are gone;
- rollback documentation exists.

If any item cannot be verified, mark it explicitly as UNVERIFIED rather than claiming completion.
