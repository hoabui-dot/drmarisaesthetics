# Design System — Motion & Animation

## Source status
No native motion tracks were found on the inspected Home frame. The animations below are **implementation proposals**, not extracted Figma behavior.

## Motion personality
Clinical, calm, precise. Motion should signal hierarchy and interactivity, not entertainment.

## Timing tokens
| Token | Duration | Use |
|---|---:|---|
| `motion.fast` | 160 ms | hover, underline, icon response |
| `motion.base` | 240 ms | card/UI transitions |
| `motion.medium` | 360 ms | carousel/change of panel |
| `motion.reveal` | 520–620 ms | initial section reveal |

## Easing
- UI: `cubic-bezier(.2,.8,.2,1)`.
- Enter reveal: `cubic-bezier(.16,1,.3,1)`.
- Avoid spring/bounce on medical CTAs/forms.

## Recommended patterns
### Page load
- header: simple fade;
- hero copy: staggered fade-up 12–16 px;
- hero image: fade + scale 1.02→1.

### Scroll reveal
- trigger once when 15–20% enters viewport;
- offset 12–20 px;
- do not animate every paragraph.

### Cards
- hover translateY(-2 to -3 px);
- shadow increases softly;
- image scale max 1.02.

### Buttons
- background transition 160 ms;
- optional icon translateX(2 px) on arrow CTAs;
- pressed state scale 0.99 only if desired.

### Carousels
- 280–360 ms slide;
- support swipe, buttons and keyboard;
- no forced autoplay by default.

### Before/after
- slider handle responds instantly to pointer/keyboard;
- labels remain stationary;
- no automatic oscillation.

### Anchor nav / TOC
- smooth scroll only when reduced motion is not requested;
- active state transitions 160–200 ms.

## Reduced motion
Respect `prefers-reduced-motion: reduce`:
- remove reveal transforms;
- disable smooth scroll;
- no image scale animation;
- keep only immediate/short opacity or color changes where needed.
