# Design System — Images & Media

## Visual direction
- high-key clinical photography;
- white / light-blue treatment rooms;
- dentists in white coats;
- dental equipment shown clearly and cleanly;
- patient imagery friendly and natural;
- no heavy warm filters;
- imagery should feel premium, sterile, bright, safe.

## Recommended aspect ratios
| Content | Ratio |
|---|---:|
| Hero clinic photo | 4:3 to 5:4 |
| Service card thumbnail | 4:3 or 1:1 |
| Doctor portrait | 3:4 |
| Article feature image | 16:10 |
| Article hero | ~16:9 |
| Before/after block | 16:9 or split 1:1 pair |
| CTA banner | 16:5 to 16:6 |
| Map | 16:9 |
| Equipment card | 4:3 |

## Image sizing rule
Do not copy the literal raster dimensions from the Figma board. Preserve **relative area**:
- hero image: ~50–58% of desktop section width;
- editorial support image: ~40–55%;
- full service/card imagery: ~50–60% of card height;
- mobile hero/media: 100% width below copy.

## Cropping
- `object-fit: cover` for lifestyle/clinic photography;
- `object-fit: contain` for isolated dental devices, implant renders and diagrams;
- define focal points for CMS images if possible.

## Medical diagrams
If text/labels are embedded in a diagram:
- provide tap-to-zoom on mobile;
- keep a text equivalent nearby;
- do not rely on tiny embedded labels as the only explanation.

## Performance
- serve AVIF/WebP where available;
- use responsive `srcset`/image component;
- lazy-load below-fold media;
- do not lazy-load the LCP hero image;
- reserve explicit aspect ratio to avoid layout shift.
