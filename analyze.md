# Homepage Performance & SEO Analysis

Based on the rules in `.ai/PERFORMANCE_RULES.md`, this analysis identifies performance bottlenecks and SEO opportunities for the dental application's homepage.

## 1. Current Issues

| Issue | Category | Severity | Description |
|-------|----------|----------|-------------|
| **Forced Dynamic Rendering** | Rendering | High | Homepage uses `revalidate = 0`, forcing SSR on every request. This increases TTFB and server load. |
| **Missing Skeletons** | UX/CLS | Medium | Dynamic imports in `BlockRenderer` lack `loading` states, causing layout jumps as components load below the fold. |
| **Above-the-Fold Complexity** | LCP | Medium | `VideoHero` is a heavy client component. While it has a poster image, the JS execution for video logic can delay initial interactivity. |
| **Hero Conversion Clarity** | UX/CRO | Medium | Primary CTA placement on mobile needs to be more prominent. Trust indicators (stars, reviews) are missing from the immediate hero area. |
| **Carousel Missing** | UX | Low | `HeroBlock.tsx` is currently a static section and should be transformed into a promotional carousel to better highlight clinical offers. |
| **Global API Over-fetching** | API | Low | `getHomepage` fetches the entire dynamic zone. While necessary for layout, it doesn't utilize partial revalidation for sub-sections. |

## 2. Root Causes

1. **Conservative Revalidation**: The choice of `revalidate = 0` was likely for instant CMS updates, but it sacrifices the performance benefits of Next.js's Static Site Generation (SSG).
2. **Missing Dynamic Loading States**: `next/dynamic` was implemented for code splitting, but the `loading` property was omitted, leading to an "all-or-nothing" hydration feel.
3. **Client-Side Heavy Hero**: The Hero section relies heavily on client-side logic for YouTube/Video handling, which competes for main-thread resources during hydration.

## 3. Priority Recommendations

### Phase 1: Rendering Optimization (High Impact)
* **Switch to ISR**: Change `revalidate = 0` to `revalidate = 3600` (1 hour) or use on-demand revalidation. This enables SSG, serving the page from cache for near-instant loads.
* **Metadata Fetching**: Ensure `generateMetadata` also benefits from the same caching strategy.

### Phase 2: Perceived Performance (Medium Impact)
* **Section Skeletons**: Implement specific skeletons for each major block (Services, Testimonials, FAQ) to be used during lazy loading.
* **Dynamic Import Refinement**: Update `BlockRenderer` to use these skeletons in the `loading` property of `next/dynamic`.

### Phase 3: Animation & Interaction (Low/Medium Impact)
* **CSS Over JS**: Auditing `ServicesBlock` and others to ensure `framer-motion` is only used for high-value interactions. Entrance animations should strictly use `PerformanceAnimation` (CSS-based).

## 4. Implementation Notes

* **Skeletons**: Create a dedicated `SectionSkeleton` that mimics the height and structure of the blocks to eliminate CLS.
* **Rendering**: Set `export const revalidate = 3600` in `src/app/page.tsx`.
* **Dynamic Imports**: Update `BlockRenderer.tsx` with:
  ```tsx
  const ServicesBlock = dynamic(() => import('./blocks/ServicesBlock').then(m => m.ServicesBlock), {
    loading: () => <SectionSkeleton height="600px" />
  })
  ```

## 5. SEO & Core Web Vitals Impact

| Recommendation | LCP | CLS | INP | SEO Impact |
|----------------|-----|-----|-----|------------|
| **SSG + ISR** | 🚀 | - | - | **Positive**: Faster TTFB leads to better crawling and ranking. |
| **Skeletons** | - | 🚀 | - | **Positive**: Lower CLS is a direct ranking factor for Google. |
| **CSS Animations**| - | - | 🚀 | **Positive**: Better responsiveness (INP) improves user retention. |
| **Metadata Cache**| - | - | - | **Neutral/Positive**: Ensures search engines always see the latest meta tags quickly. |

## 6. Hero & Carousel Analysis (Detailed)

### VideoHero.tsx
* **Issue**: Full-screen video background is expensive for poor-CPU mobile devices.
* **UX/CRO**: Headline and sub-headline contrast is good, but "Trust Signals" (Google ratings) are currently below-fold.
* **Recommendation**: Add a floating trust badge in the hero. Implement "Low CPU" mode for mobile background.

### HeroBlock.tsx → Carousel
* **Current State**: Static two-column layout with text and a single image.
* **Goal**: Transform into a lightweight carousel for promotional content.
* **Performance**: Use Embla Carousel (already in package.json) for its small footprint and native performance.
