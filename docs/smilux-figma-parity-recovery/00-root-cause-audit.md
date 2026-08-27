# 00 — Root Cause Audit

## Executive diagnosis

The current homepage migration is not a 1:1 Figma migration. It is a hybrid migration that:

- preserves compatible legacy CMS blocks/content;
- changes the visual shell;
- creates generic placeholder copy for missing semantic sections;
- validates build/type/lint/runtime health;
- postpones true visual/content parity until after the migration is already reported as implemented.

That strategy is incompatible with a requirement of strict Figma content/action parity.

## Root cause 1 — wrong document is stored at the expected Home path

Current repository:

- `docs/design-spec/pages/01-home.md` contains accessibility rules, not the Home page specification.
- `docs/design-spec/pages/02-about.md` contains the Home page specification.

Therefore an agent following the expected page filename can read the wrong specification.

## Root cause 2 — migration package paths are broken

Current `docs/hompage-migration-codex/AGENTS.md` points to paths such as:

- `../reference/figma-home.md`
- `../09-testing-acceptance.md`

But the actual directory is `references/` (plural), and the acceptance file is in the same package directory.

`CODEX_START_PROMPT.md` also points to `reference/...` while the actual directory is `references/...`.

This makes the source-of-truth chain unreliable.

## Root cause 3 — the Home spec is descriptive, not a strict content contract

The reference says things like:

- H1: “Your Smile, Our Passion” style message;
- primary appointment + secondary watch/video or learn action;
- reassurance/social-proof line and/or metrics.

Those phrases describe intent, but they do not force exact values such as:

- exact eyebrow string;
- exact paragraph;
- exact button count;
- exact labels;
- exact action semantics;
- exact trust label;
- exact numeric rating;
- exact header nav labels/order.

An agent can satisfy the descriptive spec while still producing the wrong content.

## Root cause 4 — migration script deliberately keeps the old Hero

`migration_scripts/129-migrate-homepage-new-ui.js` builds the target with:

```js
first(blocks, 'hero') || first(blocks, 'video-hero')
```

It does not patch that block to the canonical Figma Hero content. Therefore the old CMS heading/subheading survive the migration.

This directly explains why the new page can render “Clinical Excellence Meets Compassionate Care” instead of the Figma target “Your Smile, Our Passion”.

## Root cause 5 — new sections receive generic scaffolding, not Figma content

The migration creates generic copy such as:

- `Trusted care`
- `Care built on clinical trust`
- `Modern dentistry, clearly explained`
- `Precision equipment`
- `A calm, modern clinical environment`
- `Start with a consultation`

These are structural defaults, not a content migration from the Figma target.

## Root cause 6 — optional fields silently disappear

The Hero schema has optional fields for eyebrow, secondary CTA, trust label/value and avatars. The frontend also renders the secondary CTA only if `secondaryCtaLink` is present.

Therefore missing CMS data produces missing UI rather than a parity failure.

For a migration target, required Figma-visible elements must be treated as migration-required even if the long-term CMS schema keeps them optional for editorial flexibility.

## Root cause 7 — Hero component includes fallback/invented content

Current Hero UI falls back to generic strings such as:

- `Premium dental care`
- `Book an appointment`
- `Learn more`
- `Trusted care for every smile`

The trust row does not faithfully consume all trust fields from CMS.

A parity migration must not hide missing data with generic UI copy.

## Root cause 8 — action semantics are under-modeled

A CTA is not only a label + href.

Target Hero contains at least two different actions:

- `BOOK APPOINTMENT` → open existing booking flow;
- `WATCH VIDEO` → open/play video experience.

The current secondary CTA model is link-oriented. A real action contract is needed so Codex cannot convert “Watch Video” into a generic navigation link or omit it when no href exists.

## Root cause 9 — acceptance checks do not assert content/action parity

Current acceptance checks verify layout ratios, responsiveness, architecture, build, accessibility, and broad CTA functionality.

They do not require:

- exact Figma-visible text inventory;
- exact number of buttons;
- exact labels;
- exact action type;
- exact nav labels/order;
- trust content/rating;
- a zero-missing-elements report.

Therefore the current implementation can pass the documented gate while failing the user's actual acceptance criterion.

## Root cause 10 — completion was reported before parity review

The generated migration report states the new UI is implemented, while also saying full visual review is still the final step.

For design migration, visual/content/action parity is not a post-completion step. It is a release gate.
