# Integration Phase — Responsive, Accessibility, and SEO

Run this only after all page structures are implemented.

## Responsive QA widths

At minimum inspect:
- 320 px;
- 375/390 px;
- 768 px;
- 1024 px;
- 1280/1440 px.

Do not merely shrink desktop absolute positioning. Reflow the editorial grid intentionally.

## Accessibility

Verify:
- semantic landmarks;
- one logical H1 per page;
- sequential heading hierarchy;
- keyboard operability;
- visible focus;
- mobile menu focus behavior;
- form labels/errors;
- accordion state and controls;
- filter controls;
- image alt text;
- decorative SVGs hidden from screen readers;
- adequate contrast;
- touch targets;
- reduced-motion support;
- no keyboard traps.

## SEO

Preserve and validate:
- canonical URLs;
- metadata;
- Open Graph/Twitter images;
- robots behavior;
- sitemap inclusion/exclusion;
- service/article/page schema already supported by the project;
- FAQ structured data only when visible content matches;
- redirects if any route was intentionally consolidated.

Do not create duplicate Patient Results URLs without a canonical/redirect strategy.

## Performance

Follow repository performance rules:
- server-first initial render;
- ISR/SSG for public content where current architecture supports it;
- lazy-load non-critical sections/media;
- prioritize LCP hero;
- avoid broad Framer Motion usage;
- do not over-populate Strapi;
- avoid unnecessary client state.
