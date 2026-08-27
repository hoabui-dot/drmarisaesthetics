# Design System — Responsive Rules

## Breakpoint strategy
Use content-driven breakpoints rather than copying a framework blindly.

| Name | Range | Typical behavior |
|---|---|---|
| mobile-s | 320–399 | 1 column, full-width CTAs |
| mobile | 400–767 | 1 column / occasional 2-card grid |
| tablet | 768–1023 | 2–3 columns, reduced gutters |
| desktop | 1024–1279 | full nav, 3–4 columns |
| wide | ≥1280 | intended 5/6-card rows |

## Global desktop → mobile transformations
### Header
- desktop horizontal nav → mobile drawer;
- keep booking CTA prominent;
- sticky behavior retained.

### Two-column hero
- desktop 45/55 or 50/50 → mobile single column;
- text first unless the page is image-led by product requirement;
- remove unnecessary absolute positioning.

### Dense feature rows
- 5/6 columns → 3 → 2 → 1;
- prefer wrap/grid over tiny card scaling.

### Carousels
Use carousels only where the desktop source already suggests a rail/slider (doctors, testimonials) or where mobile length would otherwise be excessive.

### Sidebars
- desktop article/sidebar → single flow;
- conversion CTA moves immediately after useful article content;
- avoid sticky elements on mobile.

### Tables/pricing
- card stack on mobile;
- avoid horizontal tables unless comparison absolutely requires it.

### Procedure timeline
- horizontal desktop → vertical mobile.

### Form blocks
- multi-column field rows → 1 column under ~700 px;
- labels remain above fields;
- CTA full width under ~480 px.

## Mobile safe-area rules
- 16 px minimum horizontal gutter.
- Touch targets 44×44 px minimum.
- Fixed/sticky bottom CTA must account for `env(safe-area-inset-bottom)`.

## Content order principle
When flattening columns, prioritize:
1. page/section context;
2. explanatory content;
3. primary CTA;
4. key visual;
5. supporting detail.
