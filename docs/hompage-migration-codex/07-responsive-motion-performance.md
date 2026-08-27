# 07 — Responsive, Motion & Performance Rules

## Breakpoint intent

Use the project's Tailwind breakpoints where practical, but test these viewport classes explicitly:

- 320–399: small mobile;
- 400–767: mobile;
- 768–1023: tablet;
- 1024–1279: desktop;
- >=1280: wide desktop.

Acceptance viewports:

- 360×800
- 390×844
- 430×932
- 768×1024
- 1024×768
- 1280×800
- 1440×900
- 1920×1080

---

# Responsive layout rules

## General

- Mobile first.
- Minimum page gutter ~16px on mobile.
- Primary touch targets >=44×44px.
- Avoid shrinking typography to preserve desktop grids.
- Dense desktop card rows should collapse 5/6 → 3 → 2 → 1 unless the target calls for a horizontal media rail.

## Horizontal scrolling

Acceptable for:

- Equipment mobile rail;
- Doctors mobile carousel if chosen;
- Testimonials mobile carousel.

Not automatically required for Services/Articles if a clear stacked layout is more readable.

Use CSS `scroll-snap` when arrows/autoplay/state are not needed. Use the existing Embla carousel when actual carousel behavior is needed.

---

# Motion hierarchy

## Allowed default entrance motion

- opacity;
- translate 12–24px;
- small scale 1.02/1.03 → 1 for media;
- stagger 60–100ms;
- duration generally 250–650ms.

## Avoid

- perpetual hero floating;
- cursor-following lights;
- large springy card scaling;
- moving background blobs across many sections;
- unnecessary 3D/WebGL;
- autoplaying reviews without pause;
- motion that delays content visibility.

## Reduced motion

All non-essential motion must effectively stop when `prefers-reduced-motion: reduce` is active. Existing `useMobileAnimation` can remain part of the strategy, but OS reduced-motion preference is the accessibility requirement.

---

# Performance priorities

## LCP

Hero image is likely the LCP element.

Required:

- render hero without lazy component boundary;
- use `next/image`;
- `priority`/preload only for the true hero image;
- correct `sizes`;
- avoid downloading both desktop and mobile hero assets unnecessarily;
- preserve image aspect ratio to prevent CLS.

## Below the fold

- lazy-load media normally;
- do not use `priority` on doctor/certificate/article images;
- avoid huge source images where a responsive rendition exists.

## JS/client boundaries

Do not mark every section `'use client'` just because one small interaction exists.

Prefer:

- server/presentational section;
- small client child for carousel/count-up/before-after interaction.

This matters because the current codebase has many client-heavy homepage blocks.

## Third-party effects

Three.js/R3F is installed but should not be used for this Figma migration.

## Existing force-no-store

The homepage currently disables caching. Keep behavior unless product explicitly approves a caching strategy change. Measure TTFB/LCP after visual migration; handle caching as an independent, reversible optimization.

---

# Accessibility

- one `h1` on page;
- section headings descend logically;
- all images have meaningful alt or empty alt when decorative;
- carousels keyboard accessible;
- slider uses native range semantics;
- form labels are explicit, not placeholders only;
- error text is programmatically associated;
- color alone does not communicate active/error state;
- visible focus rings;
- input font >=16px on mobile;
- respect `prefers-reduced-motion`.
