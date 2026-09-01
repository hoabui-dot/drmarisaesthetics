# Implement Premium Editorial Animation for the Revision Surgery Section

## Objective

Enhance the existing **Revision & Complex Cases / Revision Surgery** section with a refined, production-ready entrance animation using **Anime.js v4**.

The current section already has an established visual design and content hierarchy.

Do NOT redesign the section.

Preserve the existing:

- layout
- typography
- colors
- content
- spacing system
- responsive behavior
- image
- CTA
- list structure

The goal is to add animation that supports the editorial hierarchy and makes the section feel more polished and premium.

The motion should feel:

- calm
- deliberate
- elegant
- editorial
- medical/professional
- performance-conscious

Avoid flashy or playful animation.

---

# 1. Inspect the Existing Codebase First

Before implementing anything, inspect:

- the current Next.js version
- App Router vs Pages Router
- package manager:
  - npm
  - pnpm
  - yarn
  - bun
- TypeScript setup
- styling system
- responsive breakpoints
- existing component structure
- existing animation utilities
- the actual component that renders this section

Reuse the existing project's:

- typography
- colors
- spacing
- breakpoints
- container system
- utility functions

Do not introduce a parallel design system.

---

# 2. Anime.js v4 Dependency

Anime.js is NOT currently installed in the codebase.

Install the current Anime.js v4 package using the repository's existing package manager.

Expected dependency:

```bash
animejs
