# Codex Prompt — Recover SmileLux Homepage to Strict Figma Content/Action Parity

You are repairing an incomplete SmileLux homepage migration in `hoabui-dot/smilelux-dentist`.

The current implementation is NOT accepted merely because it uses the new visual theme or passes build/type checks. The previous migration preserved legacy CMS copy and omitted required Figma buttons/actions. Your task is to recover strict Figma content/action parity section by section while preserving the existing Next.js + Strapi architecture and existing business logic.

## Read first

Read these recovery docs in order:

1. `00-root-cause-audit.md`
2. `01-homepage-content-action-contract.md`
3. `02-hero-parity-contract.md`
4. `03-docs-path-repair.md`
5. `04-migration-recovery-strategy.md`
6. `05-parity-acceptance-gates.md`

Then inspect the live repository and the target Figma node. Do not rely only on old Markdown descriptions if the Figma target is available.

## Source precedence

For migrated Homepage values:

1. Figma-visible target content/action intent;
2. strict parity contract;
3. existing business behavior to reuse;
4. existing CMS values only where Figma does not specify a value;
5. legacy content last.

Do NOT preserve legacy content when it conflicts with visibly specified Figma content.

## First task: repair the documentation source chain

Verify and fix the repository documentation wiring before using it:

- `docs/design-spec/pages/01-home.md` must be the Home spec, not accessibility rules;
- the actual Home reference is currently available under `docs/hompage-migration-codex/references/figma-home.md`;
- fix `reference/...` vs `references/...` references;
- fix incorrect `../09-testing-acceptance.md` relative path;
- make all required documents discoverable from the start prompt;
- do not continue if an authoritative referenced document path is broken.

## Second task: stop using migration 129 as-is

Audit `migration_scripts/129-migrate-homepage-new-ui.js`.

It currently preserves the existing Hero via `first(blocks, 'hero')`. This is the principal reason old copy survives.

Replace/revise the migration so that Figma-specified content fields are explicitly migrated. Preserve only compatible values not replaced by the target, especially media references.

Add dry-run output showing before → after for every Figma-required field before writing CMS content.

Never inject generic marketing defaults into target-required fields.

## Third task: Hero only — do not proceed to the next section yet

Build a Figma Element Inventory for Header + Hero.

Required target content:

### Header

- Home
- About Us
- Services
- Technology
- Pricing
- Blog
- Contact
- `BOOK APPOINTMENT` CTA

Header CTA must open the existing booking flow.

Resolve actual repository routes. If a target route is absent, report `BLOCKED_FUNCTIONAL`; do not rename/reorder the navigation to match legacy CMS data.

### Hero

Eyebrow:
`PREMIUM DENTAL CARE & SERVICES`

H1:
`Your Smile, Our Passion`

Paragraph:
`At Smilux Dental, we combine advanced technology, experienced professionals, and a patient-first approach to deliver safe, lasting, and beautiful smiles for you and your loved ones.`

Primary CTA:
- label `BOOK APPOINTMENT`
- action `booking-modal`
- reuse existing booking flow

Secondary CTA:
- label `WATCH VIDEO`
- action `video-dialog`
- find/resolve the real video source/config in repository/CMS
- if no source exists, report a functional blocker; do not hide the button or change it to `Learn more`

Trust proof:
- `Trusted by 10,000+ Patients`
- 5-star presentation
- `4.9/5`
- avatar group; missing avatar assets may be reported as `BLOCKED_MEDIA` for this task

## Schema/action changes

Current Hero schema already has eyebrow, heading, subheading, primary CTA, secondary CTA, trust label/value and avatars. Use those fields.

Add an explicit numeric rating field if necessary to avoid encoding behavior by parsing `4.9/5`.

Model CTA action semantics explicitly. A secondary CTA must not be implemented only as an optional `href` when the target action is a video dialog.

Prefer a reusable action type/component if it improves consistency without over-engineering.

## Frontend correction

Audit `HeroBlock.tsx`.

Remove migration-critical generic fallback copy. Required target elements must consume migrated data.

The component must not display invented strings such as generic `Premium dental care`, `Learn more`, or `Trusted care for every smile` when target fields are missing.

Missing required fields should be surfaced in development/parity validation, not silently replaced.

The trust row must use actual CMS values and remain visible even when avatar media is unavailable.

## Parity checker

Add a lightweight validation script with no unnecessary dependencies, e.g.:

`dental-frontend/scripts/check-figma-parity.mjs`

It must be able to verify at minimum the canonical Header + Hero content/action configuration after migration. It should fail when:

- H1 differs;
- eyebrow differs;
- paragraph differs;
- required CTA count < 2;
- button labels differ;
- target trust label/rating is missing;
- nav labels/order differ;
- required action type is unresolved.

API-backed validation is preferred when Strapi is available; otherwise validate the migration target manifest plus frontend action mapping and clearly state what cannot be checked offline.

## Required validation loop

For Hero:

1. inspect Figma;
2. inspect current CMS/schema/query/component;
3. produce field/action mapping table;
4. migrate CMS data;
5. verify `/api/homepage` values;
6. render local page;
7. compare 1440 desktop against Figma;
8. compare 390 mobile;
9. verify Booking action;
10. verify Watch Video action;
11. run type-check/lint/build/parity check;
12. produce the strict parity report.

Do not move to Services/Technology/etc. until Header + Hero content/action parity is PASS.

## Completion rule

A build pass is not completion.

For the current slice, completion requires:

- Header target labels/order mapped;
- Header booking action works;
- Hero required text 100% mapped;
- Hero has 2/2 target CTAs;
- primary booking action works;
- secondary video action works (or task remains blocked/incomplete);
- trust text/rating visible;
- no generic replacement copy;
- desktop/mobile parity reviewed;
- missing images may be explicitly `BLOCKED_MEDIA` only because the user allowed image work to be deferred.

At the end, output:

```text
HEADER + HERO PARITY REPORT
Content parity: PASS/FAIL
Action parity: PASS/FAIL
Desktop visual parity: PASS/FAIL
Mobile visual parity: PASS/FAIL
Blocked media: [...]
Blocked functional: [...]
Missing Figma elements: [...]
Extra non-Figma elements: [...]
CMS fields changed: [...]
Files changed: [...]
Commands/tests run: [...]
```

If any non-media Figma element is missing, do not state that the migration is complete.
