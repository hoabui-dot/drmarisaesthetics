'''# Next.js Performance Strategy for Mobile and Low-CPU Devices

This document summarizes a practical performance strategy for a Next.js frontend backed by Strapi CMS, with a focus on mobile and low-CPU devices.

## 1. Rendering Strategy

Use a hybrid rendering model instead of applying one rendering mode everywhere. Prefer SSG or ISR for SEO pages and content pages that change infrequently, because Next.js recommends static generation when possible for better performance. Use SSR only for pages that must depend on request-time data, such as personalization, auth-gated content, or region-specific pricing. Use CSR only for highly interactive UI that does not need to be indexed.

### Recommended mapping

- Homepage: SSG + ISR.
- Listing and category pages: ISR.
- Detail pages such as articles or product pages: SSG or ISR.
- Search, filters, and interactive widgets: CSR.
- User-specific areas: SSR or CSR.

## 2. API Call Strategy

Fetch data on the server for the initial render whenever possible. For Strapi, request only the fields needed for the page, and avoid over-populating related content unless it is visible on first paint. Use cache and revalidation for content that changes moderately, and paginate large collections instead of loading everything at once. Client-side fetching should be reserved for after-load interactions such as filters, comments, and search suggestions.

## 3. Lazy Loading Strategy

Lazy load everything that is not critical for the first screen. Use dynamic import for heavy components such as editors, maps, charts, video players, and carousels. Use image optimization and lazy loading for all non-critical images. The hero image or any above-the-fold visual that affects LCP should be prioritized, while lower content images should remain lazy loaded.

## 4. Loading States

Use skeletons and section-level loading states instead of full-page spinners. Render the page shell first, then stream or fill in secondary content progressively. 

### Skeleton Implementation
- **Primitives**: Use `@/src/components/ui/skeleton` for small elements.
- **Sections**: Use `@/src/components/skeletons/SectionSkeleton` for larger blocks to prevent Layout Shift (CLS).
- **Full Pages**: Use `PageSkeleton` from `@/src/components/LoadingSkeleton` as a fallback in client components or `Suspense` boundaries while data is fetching.
- **Perceived Speed**: This makes the app feel faster on weak devices even when the backend is still working.

## 5. Animation Strategy

Use CSS transitions and animations for simple effects such as hover states, fades, slides, and accordions. Use Intersection Observer plus CSS for scroll reveal effects. Use Framer Motion only for components that truly need it, such as modal transitions, drawers, shared layout motion, or gesture-based interactions. Avoid animating layout properties like width, height, top, and left when transform and opacity can do the job more cheaply.

## 6. What to Avoid

Do not animate everything just because it looks nice. Avoid heavy JavaScript animations on the homepage or above-the-fold areas if they are not necessary. Do not load animation libraries globally if only a few pages need them. Do not ignore reduced-motion preferences, and do not use scroll-heavy JavaScript effects that can hurt responsiveness on mobile devices.

## 7. Practical Rules

1. Server-first for initial page render.
2. SSG/ISR as the default for content-driven pages.
3. CSR only for interactions that require it.
4. Fetch the minimum amount of data needed.
5. Lazy load non-critical components and images.
6. Use skeletons instead of blocking spinners.
7. Prefer CSS animations over JS animations. Use `grid-template-rows: 0fr -> 1fr` for high-performance height transitions without layout thrashing.
8. Use Framer Motion selectively (e.g., interactive physics-based components), not as a default for slide transitions or reveal effects.
9. Respect reduced-motion preferences.
10. Optimize for fewer re-renders and smaller bundles.
11. Ensure primary CTAs are prominent on mobile above the fold; avoid hiding critical interactive elements behind "desktop-only" classes.
12. Pointer-events management: Ensure inactive overlays (closed modals, etc.) use `visibility: hidden` and `pointer-events-none` to prevent "glass wall" interaction blocks.

## 8. Suggested Implementation Pattern

A practical setup could look like this: homepage and article pages rendered with ISR, comments and filters loaded client-side, heavy UI modules loaded dynamically, and animation kept to CSS plus a small number of Framer Motion components for important interactions. This approach balances SEO, perceived speed, and maintainability.

## 9. Framer Motion Recommendation

Framer Motion is acceptable in a Next.js project, but it should be used selectively. It is a good fit for page transitions, dialogs, drawers, and interactive UI where motion improves usability. It is not the best choice for every small hover or reveal animation. If most of the animation can be done with CSS, that is usually the better default for mobile performance.
