# QA Phase — Lint, Type Check, and Production Build Gates

Run from the correct project root using the existing package manager.

## Required gates

1. Lint
2. TypeScript type-check
3. Production build
4. Strapi admin/server build if the active CMS is part of this repository and has a build step
5. Any existing unit/integration tests relevant to touched code

Known frontend scripts include:
- `lint`
- `type-check`
- `build`

but confirm the current package manifest before execution.

## Rules

- Do not disable ESLint rules globally to make the redesign pass.
- Do not add `// @ts-ignore`, broad `any`, or `skipLibCheck` as a blanket escape.
- Do not mark dynamic routes or CMS calls as static incorrectly just to satisfy build.
- Do not hide build-time Strapi connectivity problems; determine whether build requires live CMS and follow the established project strategy.

## Baseline policy

If an unrelated failure existed before the redesign:
- prove it is pre-existing where possible;
- do not make it worse;
- report it separately.

All newly introduced errors must be fixed.

Capture the exact command and final result in the completion report.
