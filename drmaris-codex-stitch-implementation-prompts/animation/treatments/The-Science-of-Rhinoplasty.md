# Redesign and Animate the "Science of Rhinoplasty" Section as a Premium Surgical Atlas

## Objective

Redesign the existing **"The Science of Rhinoplasty"** section into a premium, editorial and clinically relevant interactive experience.

The current section contains:

- Section title: "The Science of Rhinoplasty"
- Introductory paragraph
- A large visual placeholder with a small medical/flask icon
- "Open Rhinoplasty" explanation
- "Closed Rhinoplasty" explanation

The existing large placeholder does not carry enough visual meaning and makes the section feel visually empty.

Replace this treatment with a **Surgical Atlas / Anatomical Study** concept.

The new section should communicate:

- anatomy
- structural planning
- surgical precision
- clinical expertise
- the difference between Open and Closed Rhinoplasty

The result should feel like a combination of:

- a premium medical journal
- a luxury editorial website
- an anatomical atlas
- a carefully art-directed surgical website

Do NOT make it look like a SaaS product, dashboard or generic medical landing page.

---

# 1. Inspect the Existing Codebase First

Before implementing anything, inspect:

- Next.js version
- App Router vs Pages Router
- package manager
- TypeScript configuration
- current styling system
- existing breakpoints
- existing design tokens
- image handling
- existing shared components
- animation dependencies
- current implementation of this section

Reuse the existing:

- fonts
- colors
- typography scale
- spacing system
- containers
- breakpoints
- borders
- buttons/links
- existing imagery

Do not introduce a new visual design system.

The existing codebase remains the source of truth for theme, colors and typography.

---

# 2. Animation Library

Use **Anime.js v4** for the section animation.

If Anime.js v4 already exists in the repository, reuse it.

If it does not exist, install:

```bash
animejs

using the project's existing package manager.

Do NOT install Motion, Motion+, GSAP, Three.js, PixiJS or another animation library solely for this section.

The interaction may take inspiration from Motion-style image reveals and GSAP-style scroll storytelling, but should be implemented with:

Anime.js v4
+
CSS
+
native browser layout

Useful Anime.js v4 APIs include:

import {
  animate,
  createTimeline,
  onScroll,
  svg,
} from 'animejs';

Import only APIs that are actually required.

3. Core Design Concept

The final section should behave like an interactive Surgical Atlas.

Desktop composition:

THE SCIENCE OF RHINOPLASTY

Understanding the structural approach is key to achieving...
────────────────────────────────────────────────────────────


┌───────────────────────────────┬──────────────────────────────┐
│                               │                              │
│                               │  01                          │
│       ANATOMICAL STUDY        │  OPEN RHINOPLASTY            │
│                               │                              │
│        clinical image         │  Existing description        │
│             +                 │                              │
│       SVG anatomy layer       │  ───────────────────────     │
│             +                 │                              │
│      surgical tracing         │  02                          │
│                               │  CLOSED RHINOPLASTY          │
│                               │                              │
│        sticky on desktop      │  Existing description        │
│                               │                              │
└───────────────────────────────┴──────────────────────────────┘

Use an asymmetrical editorial grid rather than two equally generic columns.

Suggested desktop ratio:

visual: 55–60%
content: 40–45%

Adjust this ratio to the existing container/grid system.

4. Remove the Generic Placeholder Treatment

Remove the current visual concept consisting primarily of:

large empty bordered rectangle
+
small flask icon
+
generic medical label

Do not replace it with another large empty decorative card.

The visual area must carry meaningful information.

5. Photography Strategy

Before adding any new asset, inspect the existing codebase for relevant photography.

Search for:

rhinoplasty profile photography
side-profile patient photography
surgeon planning photography
clinical consultation photography
surgical planning imagery
existing procedure card images
existing rhinoplasty hero images

Prefer reusing an existing approved image.

If an appropriate side-profile rhinoplasty image already exists elsewhere in the website, reuse that asset when visually appropriate.

Priority:

1. Real approved patient/profile photography
2. Real surgeon or consultation photography
3. Real clinic photography
4. Existing clinically reviewed anatomical illustration
5. Restrained illustrative fallback

Avoid introducing generic stock imagery.

Do not hotlink remote images.

Do not generate or invent medically inaccurate anatomy.

If no medically appropriate image exists, use a restrained profile/silhouette visual and keep the surgical annotation clearly illustrative rather than presenting invented anatomy as clinical information.

6. Anatomy Study Visual

The visual should contain multiple layers:

figure
│
├── base clinical photograph
│
├── subtle atmosphere / surface layer
│
├── anatomical SVG overlay
│
├── technique-specific surgical path
│
└── small atlas metadata

Example:

┌───────────────────────────────────┐
│ FIG. 01                           │
│ RHINOPLASTY / STRUCTURAL ACCESS   │
│                                   │
│              profile              │
│                 ╲                 │
│                  ╲                │
│                   ●               │
│               incision            │
│                                   │
│                         OPEN 01    │
└───────────────────────────────────┘

Keep annotations minimal.

The visual must not become a dense textbook illustration.

7. Medical Accuracy

Do not invent surgical claims, anatomy labels or procedural details.

Use the existing approved copy as the source of truth.

For example, the current content already establishes:

Open Rhinoplasty
→ small incision across the columella
→ increased visibility of nasal framework

Closed Rhinoplasty
→ incisions hidden inside the nostrils

Only create visual annotations that directly correspond to existing approved content.

If clinically reviewed SVG/anatomy assets already exist in the repository, prefer them.

Do not add unsupported medical claims.

8. Sticky Editorial Layout

On desktop, make the anatomical study visually persistent while the two techniques are explored.

Prefer native CSS:

position: sticky;

rather than JavaScript pinning.

Concept:

          viewport

┌───────────────────────────────────────┐
│                                       │
│   ┌──────────────┐    OPEN            │
│   │              │                    │
│   │   anatomy    │                    │
│   │   sticky     │                    │
│   │              │                    │
│   │              │    CLOSED          │
│   └──────────────┘                    │
│                                       │
└───────────────────────────────────────┘

Do not create an excessively long scroll experience.

There are only two techniques.

The interaction should feel concise.

Target roughly:

1.2–1.6 viewport heights

for the technique storytelling area on desktop, depending on the existing page composition.

Treat this as guidance rather than a hardcoded requirement.

9. Technique Chapters

Structure the right-hand content as two editorial chapters.

Example:

01

OPEN RHINOPLASTY

Involves a small incision across the columella...

then:

02

CLOSED RHINOPLASTY

All incisions are hidden inside the nostrils...

Do not turn them into floating rounded cards.

Prefer:

typography
whitespace
thin rules
numbering
subtle active states

over container decoration.

10. Active Technique State

As the user moves through the section, determine which technique is active.

Possible states:

ACTIVE

opacity: 1
heading: full emphasis
number: full emphasis
rule: full width


INACTIVE

opacity: 0.4–0.55

Do not fully hide inactive content.

Both explanations should always remain readable.

The active state exists to establish visual focus, not to remove information.

11. Scroll Activation

Use Anime.js v4 onScroll() or a native intersection mechanism to detect technique thresholds.

Concept:

user scroll
    ↓
Open chapter crosses focus threshold
    ↓
activate OPEN visual state


user continues
    ↓
Closed chapter crosses focus threshold
    ↓
activate CLOSED visual state

Do not update React state on every scroll frame.

Only change a coarse state when the active technique changes.

Example:

type Technique = 'open' | 'closed';

React state may be used for this state if necessary.

Do not use React to drive 60fps transforms.

12. Signature Motion: Surgical Tracing

The signature animation of this section is SVG surgical tracing.

Use Anime.js v4 SVG drawing utilities when appropriate.

Concept:

0%

   ·


30%

   ─────


60%

   ───────────


100%

   ───────────────────●
                     marker

Animate only a small number of medically relevant lines.

Suggested sequence:

primary anatomy line
        ↓
secondary structural line
        ↓
technique path
        ↓
annotation marker
        ↓
small label

Suggested total duration:

700–900ms

Do not continuously loop this animation.

13. Open Rhinoplasty Visual State

When Open Rhinoplasty becomes active:

keep the base photograph stable
reveal the Open-specific SVG overlay
draw its relevant tracing
reveal the relevant marker/annotation
subtly emphasize atlas metadata

Do not replace the entire photograph.

The conceptual relationship should be:

ANATOMY
stays constant

TECHNIQUE
changes

This is important to visually communicate that both approaches operate on the same anatomy.

14. Closed Rhinoplasty Visual State

When Closed Rhinoplasty becomes active:

transition from:

OPEN overlay

to:

CLOSED overlay

Use:

opacity
+
very small translate
+
SVG drawing

Example:

Open overlay:
opacity 1 → 0
translateY 0 → -4px

Closed overlay:
opacity 0 → 1
translateY 4px → 0

Then draw the Closed-specific tracing.

Avoid a hard image swap.

15. Atlas Metadata

Add restrained metadata inside or adjacent to the visual.

Examples:

ANATOMICAL STUDY
01 — OPEN APPROACH

or:

FIG. 01
RHINOPLASTY / STRUCTURAL ACCESS

Use existing typography styles and tokens.

It should resemble a medical/editorial figure caption.

Do NOT render it as:

rounded badge
pill
floating UI chip
SaaS label
16. Section Entrance

Before the technique interaction begins, create a controlled entrance sequence.

Recommended choreography:

section enters viewport
        ↓
section label/title
        ↓
intro text
        ↓
anatomy image reveal
        ↓
atlas metadata
        ↓
first technique becomes active
        ↓
OPEN surgical tracing draws

Keep the total entrance feeling approximately:

~1.0–1.4s

with overlapping stages.

17. Image Reveal

Do not simply fade in the main image.

Use a restrained editorial reveal.

Preferred structure:

image-wrapper
│
├── image
└── reveal-overlay

Initial image:

scale: 1.04
translateY: 12–20px

Final image:

scale: 1
translateY: 0

Reveal overlay:

scaleY: 1 → 0

or equivalent transform-based curtain motion.

Prefer transforms over changing height.

The effect should resemble uncovering an atlas plate.

18. Optional Diagnostic Sweep

If it can be implemented cleanly, add one very subtle diagnostic reveal effect when changing techniques.

Concept:

             scan
              ↓

PHOTO | ANATOMY OVERLAY
      │
      │ moves slowly
      │

A narrow mask/reveal region may expose the anatomy layer as it passes.

This must remain subtle.

Do not create a glowing sci-fi scanner.

Do not add neon effects.

If it starts feeling technological rather than surgical/editorial, remove it.

The SVG tracing is more important than this effect.

19. Technique Progress Indicator

Add a minimal progress treatment if it improves navigation.

For example:

01 ━━━━━━━━━━━━━━━

02 ───────────────

then:

01 ───────────────

02 ━━━━━━━━━━━━━━━

Animate the active rule using:

scaleX: 0 → 1

rather than width.

Keep this extremely restrained.

20. Hover and Focus Interaction

On desktop, hovering or keyboard-focusing a technique chapter may also activate its corresponding anatomy state.

This should allow users to directly inspect either technique without needing precise scrolling.

Support:

hover
focus-visible
scroll activation

with one shared activation mechanism.

Do not implement separate inconsistent animation logic for each input mode.

21. Motion Easing

Use controlled ease-out motion.

Prefer curves similar to:

cubic-bezier(.22, 1, .36, 1)

or equivalent Anime.js easing.

Avoid:

bounce
elastic
back overshoot
strong springs

Movement should feel surgically precise.

22. Performance

Prioritize:

transform
opacity

For SVG tracing, use Anime.js SVG drawing utilities.

Avoid unnecessary animation of:

width
height
top
left
margin
padding
filter
blur
box-shadow

Do not continuously animate the entire anatomy illustration during scrolling.

Animation should happen primarily when technique states change.

23. React / Next.js Performance

Do NOT implement:

scroll
 ↓
setProgress()
 ↓
React render
 ↓
scroll
 ↓
setProgress()

Anime.js or browser-native animation should own per-frame visual updates.

React may track:

activeTechnique

only when that discrete value changes.

24. DOM Scoping

Use a section-level ref.

Example:

const sectionRef = useRef<HTMLElement | null>(null);

Scope all Anime.js selectors and observers to descendants of this section.

Do not globally query:

document.querySelectorAll(...)

for generic classes used elsewhere.

25. Lifecycle

Initialize animation after mount.

Properly clean up:

timelines
ScrollObservers
animation instances
listeners

when the component unmounts.

The implementation must behave correctly with:

React Strict Mode
Next.js client navigation
component remounting

Do not create duplicate scroll observers.

26. Mobile Layout

Do not force the desktop sticky storytelling layout onto mobile.

On smaller screens, transform the structure into:

THE SCIENCE OF RHINOPLASTY

intro


┌─────────────────────┐
│ OPEN anatomy visual │
└─────────────────────┘

01
OPEN RHINOPLASTY
description


┌───────────────────────┐
│ CLOSED anatomy visual │
└───────────────────────┘

02
CLOSED RHINOPLASTY
description

The same base photography may be reused with different SVG overlays.

Each visual may reveal when entering the viewport.

Do not use hover-dependent behavior on touch devices.

Avoid long sticky sections on mobile.

27. Reduced Motion

Respect:

@media (prefers-reduced-motion: reduce)

When reduced motion is enabled:

immediately show the image
show the appropriate anatomy layers without drawing animation
disable curtain reveals
disable diagnostic sweeps
disable large transforms
keep both Open and Closed content readable
retain accessible focus indication

The section must remain understandable without motion.

28. Accessibility

Use semantic section structure.

Technique content should remain real textual content, not canvas-only content.

SVG annotations that are decorative should use:

aria-hidden="true"

Do not duplicate the visible medical content for screen readers.

If visual annotations communicate information not present in the text, provide appropriate accessible text.

Ensure keyboard users can activate interactive technique states when those states are exposed through interactive elements.

29. Avoid Over-Design

Do NOT add:

glassmorphism
large rounded cards
floating pills
3D models
WebGL
particles
large parallax
horizontal scroll
scroll hijacking
dramatic zoom
animated gradients
glowing lines
sci-fi scan effects
custom cursors
looping animation
bouncing
excessive iconography

The section should feel premium because of restraint and precision.

30. Visual Hierarchy

The intended hierarchy is:

SCIENCE OF RHINOPLASTY
        ↓
introductory context
        ↓
real anatomy / patient visual
        ↓
OPEN vs CLOSED technique
        ↓
surgical tracing

The visual is not decoration.

It should help explain the difference between the two techniques.

31. Final Interaction Model

The final experience should behave approximately like:

                        USER SCROLL
                             │
                             ▼
                    SECTION ENTERS
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
        EDITORIAL TEXT                ANATOMY PHOTO
           REVEAL                     CURTAIN REVEAL
              │                             │
              └──────────────┬──────────────┘
                             ▼
                        OPEN ACTIVE
                             │
                             ▼
                     SVG LINE DRAWING
                             │
                             ▼
                     STABLE OPEN STATE
                             │
                         user scroll
                             │
                             ▼
                       CLOSED ACTIVE
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
          OPEN OVERLAY              CLOSED OVERLAY
            fades                     appears
                │                         │
                └────────────┬────────────┘
                             ▼
                    NEW SURGICAL TRACE
                             │
                             ▼
                    STABLE CLOSED STATE
32. Validation Checklist

Before finishing, verify:

 Existing theme, colors and fonts remain unchanged
 The generic large flask placeholder has been replaced with meaningful visual content
 Existing approved photography is reused where possible
 No remote stock image hotlinks were introduced
 No unsupported medical claims were added
 Open and Closed Rhinoplasty copy remains intact
 Desktop uses an editorial anatomy + technique layout
 Anatomy visual is sticky using CSS where appropriate
 Sticky behavior does not create excessive page length
 Section entrance is subtle and controlled
 Image has an editorial curtain reveal
 Anime.js SVG tracing works
 Open and Closed techniques have distinct overlays
 Base anatomy image remains visually consistent during technique transitions
 Active/inactive technique hierarchy is clear
 Scroll only changes discrete technique state rather than rerendering React continuously
 Hover and keyboard focus can activate techniques where appropriate
 Mobile layout does not depend on sticky or hover
 prefers-reduced-motion is respected
 No animation affects unrelated components
 Anime.js resources are properly cleaned up
 React Strict Mode does not duplicate observers
 Next.js client navigation remains correct
 No horizontal overflow is introduced
 Animation remains smooth on mid-range mobile hardware
 The final result feels editorial and clinical rather than technological
Final Design Direction

The defining concept is:

"Surgical Atlas — Anatomy stays constant while technique evolves."

Do not create animation simply to make the section move.

The signature moment should be:

clinical anatomy
      +
surgical SVG tracing
      +
OPEN → CLOSED technique transition

The visitor should visually understand that the underlying anatomy remains the same while the surgical approach changes.

The final section should feel like a premium anatomical plate brought subtly to life.