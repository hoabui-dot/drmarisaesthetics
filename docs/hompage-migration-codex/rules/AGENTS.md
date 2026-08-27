# AGENTS.md — Mandatory Rules for Smilux Homepage Figma V2

This file is authoritative for Codex work on the Homepage Figma V2 migration.

## Scope

These rules apply to changes made to implement the new homepage visual design in `hoabui-dot/smilelux-dentist`.

## Rule precedence

1. Security/data integrity.
2. This `AGENTS.md`.
3. Target Figma homepage spec in `../references/figma-home.md`.
4. Existing repository architecture/business behavior.
5. Existing `.ai/context` coding standards.
6. Existing visual design system only where it does not conflict with the new Figma theme.

---

# MUST preserve

- Next.js App Router architecture.
- Strapi v5 homepage single type + dynamic zone.
- `getHomepage()` normalization boundary.
- `BlockRenderer` composition pattern.
- Existing booking submission/validation behavior.
- CMS-driven navigation/footer/content where already available.
- Next `Image` for repository/CMS images where applicable.
- TypeScript types for section contracts.

---

# MUST NOT

- hard-code the complete homepage in `src/app/page.tsx`;
- replace Strapi sections with static JSX content;
- introduce another CSS framework/UI framework;
- introduce another carousel package;
- introduce another animation package;
- introduce another form/validation stack;
- use Three.js/R3F/WebGL for the homepage design;
- add decorative perpetual motion not shown by the target;
- add cursor-following lighting to service cards;
- depend on hover to reveal the only actionable link;
- use external stock images as silent fallback for patient/result media;
- create duplicate booking endpoints or validation schemas;
- modify `html` or `body` in `globals.css` for a homepage-only layout fix;
- delete legacy Strapi homepage component schemas in the first migration release;
- change the homepage controller's `findMany(... status: 'published')` pattern just because older documentation mentions `findFirst`;
- publish new Strapi block data before frontend + backend support it;
- hide the primary hero CTA at mobile widths;
- add `priority` to below-fold images indiscriminately;
- add `'use client'` to a section unless it actually needs client interaction.

---

# Figma fidelity rules

- Treat Figma as visual intent, not absolute-positioned HTML instructions.
- Preserve section order and visual hierarchy.
- Use target ratios and responsive behavior from `../references/figma-home.md`.
- Do not recreate legacy glassmorphism/gradient/blob aesthetics where the new Figma is clean and clinical.
- Do not invent missing content as hard-coded marketing copy. Use CMS fields or clearly marked temporary fixtures during development.
- Raster source means exact token precision is not provable; use the normalized theme in `../references/theme.md`.

---

# Theme rules

Use Premium Clinical Blue semantic tokens.

Core target values:

- primary `#0B5FFF`;
- primary hover `#084FD6`;
- navy `#082E6F`;
- navy dark `#03245A`;
- heading `#102F66`;
- body `#50627C`;
- border `#DFE7F2`;
- pale surface `#F7FAFF` / `#F0F6FF`.

Prefer semantic Tailwind/CSS variables over arbitrary values.

Because only Homepage migrates first, avoid a global token change that unexpectedly redesigns every unmigrated page. Use a compatible alias/scoped strategy until the full site migrates.

---

# Responsive rules

- Mobile first.
- Test 360, 390, 430, 768, 1024, 1280, 1440, 1920 widths.
- Minimum touch target 44px.
- Mobile form input font >=16px.
- Never shrink text to save a desktop grid.
- Avoid page horizontal overflow.
- Use `overflow-x-clip` at component/layout level when needed; avoid creating sticky-breaking scroll containers.

---

# Motion rules

Allowed default:

- fade;
- 12–24px translate;
- media scale 1.02/1.03 → 1;
- short stagger;
- restrained card hover.

Forbidden by default:

- infinite hero floating;
- animated background blobs across sections;
- 3D/WebGL;
- cursor reactive glow;
- autoplay reviews without pause;
- motion that delays access to content.

Respect `prefers-reduced-motion`.

---

# CMS integration rule for every new block

A new Homepage block is incomplete until all are done:

1. Strapi component schema;
2. homepage dynamic-zone registration;
3. custom controller populate entry;
4. raw TS interface;
5. normalized TS interface;
6. `getHomepage()` mapping;
7. `BlockRenderer` case;
8. React component;
9. migration/seed content;
10. API verification.

Do not stop at “frontend renders with mock data”.

---

# Component decision rules

Rewrite in place when semantics already match:

- Hero;
- Services;
- Doctors;
- Certifications;
- Results;
- Articles;
- Header/Footer.

Add new semantic blocks for:

- Proof Showcase;
- Technology Feature;
- Equipment Showcase;
- Social Proof;
- Consultation.

Do not abuse generic About/Trust/Papers blocks just to avoid creating the correct schema.

---

# Performance rules

- Hero is LCP-critical; do not lazy-load the section component.
- Use `next/image` with accurate `sizes`.
- Only hero/above-fold critical media gets priority.
- Prefer CSS-only responsive grids/scroll snap where sufficient.
- Split client-only interactive islands out of otherwise static sections when practical.
- Do not change caching policy without explicit approval; current force-no-store behavior is a separate architectural decision.

---

# Data and rollback rules

Before changing live-like CMS content:

- export current `/api/homepage` payload;
- retain a DB/content backup;
- record current git SHA;
- keep migration scripts idempotent where practical;
- keep legacy schemas in release 1.

If actual CMS payload conflicts with repository types, stop and update the migration plan instead of guessing.

---

# Quality gates

Before completion:

```bash
# dental-frontend
npm run type-check
npm run lint
npm run build

# strapi-cms
npm run type-check
npm run build
```

Also verify all applicable checks in `../09-testing-acceptance.md`.

Never hide new build/lint/type errors with `any`, `@ts-ignore`, disabled lint rules, or broad exception handling solely to make CI green.
