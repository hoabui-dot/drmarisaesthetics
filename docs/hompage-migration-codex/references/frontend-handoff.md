# Frontend Handoff Rules

## Core implementation principle
Treat the Figma screenshots as visual intent, not as a mandate to reproduce absolute pixel positions.

## Recommended page architecture
```text
app/
  layout
  home
  about
  services
  services/[slug]
  knowledge
  knowledge/[slug]
  contact

components/
  layout/
  ui/
  medical/
  knowledge/
  forms/
```

## Build shared primitives first
1. tokens/theme;
2. container/grid;
3. buttons/inputs/card;
4. header/footer;
5. section heading;
6. service card;
7. doctor card;
8. article card;
9. consultation form;
10. responsive helpers/carousels.

## Responsive acceptance tests
Test at minimum:
- 360 × 800;
- 390 × 844;
- 430 × 932;
- 768 × 1024;
- 1024 × 768;
- 1280 × 800;
- 1440 × 900;
- 1920 × 1080.

## Layout quality checks
- no horizontal overflow;
- no clipped button labels;
- no 5/6-column card rows forced below comfortable width;
- nav does not wrap on desktop;
- article body keeps readable line length;
- sticky elements stop above footer;
- diagrams remain legible on mobile;
- form labels remain visible;
- images preserve focal subjects.

## Performance
- optimize LCP hero image;
- lazy-load below-fold images;
- reserve aspect-ratio boxes;
- defer non-critical carousels/animation JS;
- prefer CSS transitions for simple motion.

## Suggested component props
Shared components should receive content/data, not page-specific CSS overrides. Favor variants such as `tone`, `size`, `layout`, `emphasis` rather than one-off class strings throughout pages.
