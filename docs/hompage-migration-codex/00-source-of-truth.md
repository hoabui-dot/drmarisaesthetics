# 00 — Source of Truth & Audit Boundary

## 1. Target design

Figma file:

`https://www.figma.com/design/laHILnraOznsr3xbCeYE6m/Untitled--Copy-?node-id=0-1&p=f&t=jGaVi1qGprlvLe6O-0`

Homepage frame audited: `9:46`.

The Figma source is primarily raster/screenshot based. Native Figma color variables and motion nodes were not available. Therefore:

- section composition, relative layout, visual hierarchy and image placement are treated as design-derived;
- exact hex values, font family and breakpoints are normalized production proposals;
- do not claim pixel-perfect extraction where the source does not provide native values.

## 2. Codebase baseline

Repository:

`https://github.com/hoabui-dot/smilelux-dentist`

Audit was performed against `main`, latest observed commit:

`eafc2f4175e4644dc67936a7cb8984f14db2f007`

Important repository locations:

```text
smilelux-dentist/
├── dental-frontend/
│   ├── src/app/page.tsx
│   ├── src/app/layout.tsx
│   ├── src/app/globals.css
│   ├── src/components/BlockRenderer.tsx
│   ├── src/components/blocks/*
│   ├── src/components/layout/Header.tsx
│   ├── src/components/layout/Footer.tsx
│   ├── src/lib/api/queries.ts
│   ├── src/types/strapi.ts
│   └── .ai/context/*
├── strapi-cms/
│   ├── src/api/homepage/content-types/homepage/schema.json
│   ├── src/api/homepage/controllers/homepage.ts
│   └── src/components/homepage/*.json
└── AGENT_SKILL.md
```

## 3. Important limitation

This audit validates **repository source compatibility**, not the current live/published Strapi database contents. The exact current homepage block order, content records and media assets in a deployed Strapi instance were not verified.

Before destructive CMS migration or reseeding, Codex must query the target Strapi environment and export/backup the current homepage payload.

## 4. Precedence rule

For this homepage migration:

```text
Figma visual target
    > this migration package
    > current business behavior/data flow
    > old repository visual guidelines
```

Existing repository guidelines remain valid for TypeScript, file organization, accessibility and architecture unless this package explicitly supersedes them for the new homepage theme.
