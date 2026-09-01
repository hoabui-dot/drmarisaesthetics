# Implement a Premium Animated Signature Procedures Section in Next.js

## Objective

Enhance the existing **Signature Procedures** section with a premium, editorial animation system.

The current section already has a strong visual structure:

- eyebrow label
- large serif heading
- short supporting paragraph
- four adjacent procedure image panels
- procedure number
- title
- description
- CTA

Do **not redesign the section**.

Preserve the existing:

- content
- typography
- colors
- spacing
- image assets
- borders
- layout
- responsiveness
- CTA structure

The goal is to make the section feel more distinctive and premium through motion.

The final motion language should feel:

- cinematic
- editorial
- refined
- clinical
- luxury
- controlled
- intentional

Avoid playful, elastic, flashy, or overly decorative motion.

---

# 1. Inspect the Existing Codebase First

Before implementing anything, inspect the current project.

Determine:

- Next.js version
- App Router vs Pages Router
- package manager:
  - npm
  - pnpm
  - yarn
  - bun
- TypeScript usage
- styling system
- responsive breakpoints
- component conventions
- current implementation of this section
- existing animation dependencies, if any
- existing accessibility patterns

Reuse the existing:

- design tokens
- typography
- colors
- breakpoints
- spacing
- utility classes
- image components
- link/button components

Do not introduce a parallel design system.

---

# 2. Animation Library

Use **Anime.js v4** for the entrance choreography.

Important:

Anime.js is currently not installed in the codebase.

Install the current Anime.js v4 package using the package manager already used by the repository.

Expected package:

```bash
animejs

Before implementation, verify the installed Anime.js v4 API.

Prefer APIs such as:

import {
  animate,
  createTimeline,
  stagger,
  onScroll,
} from 'animejs';

Import only what is actually required.

Do not install:

GSAP
Motion
Framer Motion
Three.js
PixiJS
another scroll animation library
3. High-Level Motion Concept

The interaction should follow this model:

SCROLL INTO VIEW
      ↓
SECTION ENTRANCE
      ↓
TYPOGRAPHY REVEAL
      ↓
IMAGE CURTAIN REVEAL
      ↓
CARD CONTENT STAGGER
      ↓
STATIC FINAL STATE
      ↓
USER HOVERS A PROCEDURE
      ↓
SELECTED PANEL EXPANDS
      ↓
IMAGE RESPONDS
      ↓
TEXT + CTA EMPHASIZE

The section should have two distinct motion phases:

Entrance choreography
Interactive hover focus

Do not continuously animate the entire section after the entrance completes.

4. Entrance Trigger

Use viewport entry as the trigger.

The section should animate once when approximately:

20–30% of the section

becomes visible.

Do not scrub the entire entrance sequence directly against every scroll pixel.

Preferred behavior:

User scrolls
   ↓
section crosses threshold
   ↓
play Anime.js timeline once
   ↓
section remains stable

Do not repeatedly replay the full sequence during minor scroll movements.

5. Entrance Timeline

Create one coordinated Anime.js timeline.

Recommended choreography:

Eyebrow
   ↓
Heading line 1
   ↓
Heading line 2
   ↓
Supporting paragraph
   ↓
Image panel 01
   ↓
Image panel 02
   ↓
Image panel 03
   ↓
Image panel 04
   ↓
Procedure content
   ↓
Final interactive state

Animations should overlap slightly.

Do not make each stage wait for the previous one to fully finish.

Target total entrance duration:

~1.2s – 1.6s

Tune timing visually.

6. Eyebrow Animation

For the eyebrow label:

SIGNATURE PROCEDURES

use a subtle reveal:

opacity: 0 → 1
translateY: 8px → 0

Suggested duration:

300–400ms

This should be understated.

7. Heading Line Reveal

The heading is a major visual anchor.

Example:

Designed around anatomy, not
trends.

Animate it line by line.

Preferred implementation:

line wrapper:
overflow: hidden

text:
translateY: 105% → 0
opacity: 0 → 1

Suggested line stagger:

60–100ms

Do not animate:

individual letters
individual characters
random words
rotations
bounce
spring overshoot

The effect should resemble editorial typography entering a page.

The heading must remain readable if JavaScript is unavailable.

8. Supporting Paragraph

Animate the supporting paragraph after the heading begins.

Use:

opacity: 0 → 1
translateY: 10–14px → 0

Duration:

400–500ms

Allow this to overlap with the second heading line.

9. Main Signature Effect: Image Curtain Reveal

The four adjacent procedure images should not simply fade in.

Each image should use a cinematic curtain reveal.

Structure each image panel approximately as:

panel
└── image-wrapper
    ├── image
    └── reveal-overlay

The image wrapper must use:

overflow: hidden;

Initial image state:

scale: 1.05–1.08
translateY: 16–24px

Final image state:

scale: 1
translateY: 0

The reveal overlay should initially cover the image.

Preferred animation:

scaleY: 1 → 0

with:

transform-origin: bottom;

Alternative:

translateY: 0 → -100%

Use transform-based animation.

Do not animate image panel height or width during the entrance.

10. Image Reveal Cascade

Do not reveal all four image panels at the same time.

Use a controlled left-to-right cascade.

Recommended delay:

Panel 01: 0ms
Panel 02: +80–100ms
Panel 03: +160–200ms
Panel 04: +240–300ms

The images should feel connected as one visual strip.

Do not use large delays such as 300–500ms between each image.

The sequence must remain fast and sophisticated.

11. Image Motion During Reveal

While the overlay reveals the image, simultaneously animate the image itself.

Example:

scale: 1.07 → 1
translateY: 20px → 0

Optional subtle horizontal settling:

translateX: -2% → 0

only if it improves the image composition.

Do not use:

scale > 1.1

The image should feel like a camera settling into position, not an e-commerce zoom effect.

12. Procedure Content Reveal

After each image begins revealing, animate the content underneath it.

Each procedure contains:

number
title
description
CTA

Use a subtle sequence:

number
opacity: 0 → 1
translateY: 8px → 0

title
opacity: 0 → 1
translateY: 10px → 0

description
opacity: 0 → 1
translateY: 8px → 0

CTA
opacity: 0 → 1
translateY: 6px → 0

The content reveal should follow the same left-to-right rhythm as the images.

Do not animate every element with a large independent delay.

Keep the card content compact and controlled.

13. Interactive Hover Concept

After the entrance timeline completes, enable a premium hover interaction on desktop.

Normal layout:

1fr 1fr 1fr 1fr

When hovering a procedure, slightly expand that panel.

Example:

0.9fr 0.9fr 1.3fr 0.9fr

or a similarly restrained ratio.

The selected panel should expand by approximately:

15–30%

relative to neighboring panels.

Do not create an extreme expansion.

Avoid:

0.5fr 0.5fr 3fr 0.5fr

The layout should still feel like one cohesive editorial grid.

14. Prefer CSS for Hover Layout Changes

Use CSS for the hover-state layout when practical.

For example:

grid-template-columns

or:

flex-grow

may be used depending on the existing layout.

Anime.js should primarily control the entrance sequence.

CSS should preferably handle:

hover state
panel expansion
image hover zoom
arrow movement
border emphasis

Do not use Anime.js unnecessarily for every hover event.

15. Hover Image Response

When a procedure panel becomes active:

panel width expands

and the image should respond subtly.

Recommended:

scale: 1 → 1.025–1.04

Optional translation:

translateX: 0 → ±3–5px

depending on image composition.

Use a smooth ease-out transition.

Avoid:

large zoom
rotation
tilt
3D perspective
bouncing
16. Hover Typography Response

For the active procedure:

Number
opacity: ~0.6 → 1
translateY: 0 → -1px
Title

Increase emphasis slightly.

Possible approaches:

opacity
color token already used by the design

Do not change font family or size during hover.

Description

Keep it stable.

Do not move the paragraph significantly.

17. CTA Hover Interaction

The CTA should have a restrained micro-interaction.

Example:

EXPLORE PROCEDURE →

Animate only the arrow:

translateX: 0 → 4–6px

Suggested duration:

150–220ms

Do not animate the CTA with:

bounce
pulse
large scale
glow
18. Border Response

The existing vertical separators are important to the editorial structure.

On active hover, slightly emphasize the selected panel boundaries.

For example:

border opacity:
0.3 → 0.55

Do not introduce heavy borders or new colors.

This should remain subtle.

19. Hover Transition Easing

Use a smooth, premium easing curve.

Prefer something close to:

cubic-bezier(.22, 1, .36, 1)

or the equivalent easing available in the project's animation system.

Avoid:

spring bounce
elastic easing
back easing
large overshoot

The panel should open and close smoothly.

20. Mouse Leave Behavior

When the user leaves the procedure gallery:

expanded panel
   ↓
smoothly returns
   ↓
1fr 1fr 1fr 1fr

Return all image and text states smoothly to normal.

No bounce.

No overshoot.

No delayed reset.

21. Keyboard Focus

Hover must not be the only supported interaction.

If the procedure cards are interactive links, also apply the focused state when the card receives:

:focus-visible

A keyboard user should receive a comparable visual focus state.

Do not remove the existing browser-accessible focus semantics.

22. Mobile Behavior

Do not simulate desktop hover interaction on mobile.

On small screens:

preserve the current responsive layout
disable panel expansion
keep natural vertical or responsive card layout
preserve the entrance reveal
reduce translation distances
keep image animation subtle
avoid complex layout changes during touch interactions

If cards stack vertically, reveal them in DOM order:

01
↓
02
↓
03
↓
04

Do not create a fake hover-on-tap mechanism.

23. Reduced Motion

Respect:

@media (prefers-reduced-motion: reduce)

When reduced motion is enabled:

disable the curtain reveal
disable image zoom
disable large translations
disable cascading stagger
immediately expose all content
disable panel expansion if it produces significant movement
preserve visible focus states

The section must remain fully understandable without animation.

24. Next.js Architecture

Run Anime.js client-side only.

Use "use client" at the smallest appropriate component boundary.

Do not convert the entire page to a Client Component solely for animation.

Preferred architecture:

Server-rendered page
       ↓
SignatureProcedures client boundary
       ↓
Anime.js entrance timeline
25. DOM Scoping

Use a section-level ref.

Example:

const sectionRef = useRef<HTMLElement | null>(null);

Scope all animation selectors to descendants of this section.

Avoid global selectors such as:

document.querySelectorAll('.procedure-card');

Prefer selectors scoped through:

sectionRef.current

or use explicit refs where cleaner.

The animation must not affect procedure cards or headings elsewhere in the site.

26. Lifecycle and Cleanup

Initialize Anime.js after mount.

Clean up all:

observers
animation instances
timelines
event listeners

when the component unmounts.

The implementation must work correctly with:

React Strict Mode
Next.js client-side navigation
component remounting

Do not create duplicate timelines or duplicate viewport observers.

27. React Performance

Do not drive per-frame animation through React state.

Avoid:

mousemove / scroll
      ↓
setState(...)
      ↓
React render
      ↓
setState(...)

for animation.

Prefer:

Anime.js
CSS transitions
browser compositor

React should only manage actual UI state when necessary.

28. Performance Rules

Prioritize:

transform
opacity

Avoid continuously animating:

width
height
top
left
margin
padding

during the entrance animation.

For interactive panel expansion, layout-based CSS transitions may be used if necessary because the number of panels is small, but keep the implementation simple and profile if needed.

Avoid unnecessary:

filter
blur
box-shadow

during animation.

Do not permanently apply:

will-change

to all panels.

Use it only when justified.

29. Do Not Add These Effects

Do not add:

horizontal scroll hijacking
scroll pinning
parallax-heavy movement
3D card tilt
magnetic cursor effects
particles
rotating elements
continuous looping animation
large image zoom
marquee movement
elastic animation
floating cards
custom cursor

The section should remain elegant and clinically credible.

30. Preserve the Current Visual Structure

Do not redesign:

SIGNATURE PROCEDURES

Designed around anatomy, not
trends.

Supporting paragraph


┌────────┬────────┬────────┬────────┐
│ IMG 01 │ IMG 02 │ IMG 03 │ IMG 04 │
├────────┼────────┼────────┼────────┤
│ 01     │ 02     │ 03     │ 04     │
│ Title  │ Title  │ Title  │ Title  │
│ Desc   │ Desc   │ Desc   │ Desc   │
│ CTA    │ CTA    │ CTA    │ CTA    │
└────────┴────────┴────────┴────────┘

The motion should enhance this composition rather than replace it.

31. Expected Final Motion

The intended experience is:

                     USER SCROLL
                          │
                          ▼
                 SECTION ENTERS
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
       TYPOGRAPHY                  PHOTOGRAPHY
       LINE REVEAL                CURTAIN REVEAL
             │                         │
             └────────────┬────────────┘
                          ▼
                  PROCEDURE CONTENT
                       STAGGER
                          │
                          ▼
                 STABLE 4-PANEL GRID
                          │
                     USER HOVER
                          │
                          ▼
                  ACTIVE PROCEDURE
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
      PANEL EXPANDS    IMAGE ZOOMS     CTA MOVES
         ~20%             ~3%              →
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                   PREMIUM FOCUS STATE
32. Validation Checklist

Before considering the task complete, verify:

 Anime.js v4 is installed using the repository's existing package manager
 No additional animation library was introduced
 Existing section design was preserved
 Entrance animation triggers once when the section enters the viewport
 Eyebrow reveal works
 Heading uses line-by-line reveal
 Supporting paragraph reveal works
 Each image uses a curtain/mask-style reveal
 Images reveal with a subtle left-to-right cascade
 Image scale settles from approximately 1.05–1.08 to 1
 Procedure content follows the image reveal
 Desktop hover slightly expands the active panel
 Expansion remains restrained
 Active image zoom remains approximately 2.5–4%
 CTA arrow moves subtly on hover
 Focus-visible receives equivalent interactive treatment
 Mobile does not rely on hover
 Reduced motion is respected
 Animations are scoped to this section
 No per-frame React state is used
 All Anime.js resources are cleaned up
 React Strict Mode does not duplicate animations
 Next.js navigation does not leave stale observers
 No horizontal overflow is introduced
 The final section remains readable without animation
Final Direction

The primary visual concept is:

Cinematic Editorial Procedure Gallery

Do not treat this as four independent cards that fade upward.

The four images should behave as a connected photographic composition.

Use:

editorial heading reveal
+
image curtain cascade
+
subtle camera-settle motion
+
interactive panel focus
+
restrained CTA micro-motion

The key signature interaction is:

NORMAL
1fr | 1fr | 1fr | 1fr

        ↓ hover procedure

FOCUSED
.9fr | .9fr | 1.3fr | .9fr

combined with:

image scale
1 → ~1.03

and:

CTA arrow
0 → 4–6px

The final result should feel distinctive enough to be memorable, while still preserving the calm, authoritative tone of a premium surgical/medical website.