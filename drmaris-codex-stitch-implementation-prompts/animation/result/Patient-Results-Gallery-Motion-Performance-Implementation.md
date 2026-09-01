# Dr. Maris Aesthetics — Patient Results Gallery Motion & Performance Implementation

Patient-Results-Gallery-Motion-&-Performance Implementation

## Objective

Redesign and implement the **Patient Results Gallery** as a premium, clinical, interactive results experience using:

```text
GSAP
+
Motion for React
```

The goal is to create a refined gallery that feels:

**Premium / Clinical / Editorial / Trustworthy / Fast / Responsive**

Do NOT implement the Results section as another heavy pinned horizontal-scroll experience.

The homepage already contains multiple advanced GSAP scroll sections, so Results should intentionally use a different interaction model:

```text
Journey
= scroll-driven storytelling

Results
= interaction-driven browsing
```

This avoids scroll conflicts, reduces performance cost, and improves clinical usability.

---

# 1. Final Technology Decision

Use:

```text
GSAP
```

only for lightweight **section entrance choreography**.

Use:

```text
Motion for React
```

for:

```text
filter transitions
grid re-layout
card enter / exit
active filter indicator
card hover
shared-layout case expansion
case detail modal
```

Do NOT use:

```text
GSAP pinned horizontal scrolling
ScrollTrigger scrub for the entire Results gallery
Observer
scroll hijacking
multiple nested pin systems
```

The Results section must remain in normal document flow.

---

# 2. Keep the Current Core Gallery Structure

Preserve the existing concept:

```text
Patient Results Gallery

filter categories

2-column results grid

Before / After images

procedure name

case number

patient profile

recovery
```

Improve the visual hierarchy and interaction without making the clinical evidence feel manipulated.

---

# 3. Section Typography

Keep:

```text
Cormorant Garamond
```

for:

```text
Patient Results Gallery
```

Add an Editorial Lead below the heading.

Suggested copy direction:

```text
A curated record of surgical outcomes,
documented with consistency and clinical context.
```

Use:

```text
Cormorant Garamond
20–24px
Medium Italic
```

Keep supporting metadata and clinical information in the existing sans-serif.

Do not make long descriptions serif.

---

# 4. Section Entrance Animation

Use GSAP only once when the section first enters the viewport.

Do NOT use `scrub`.

Animate:

```text
eyebrow
↓
heading
↓
editorial lead
↓
filters
↓
result cards
```

Recommended behavior:

```text
heading:
masked line reveal

lead:
opacity 0 → 1
y 14px → 0

filters:
opacity 0 → 1
y 10px → 0

cards:
opacity 0 → 1
y 20–24px → 0
stagger approximately 0.06–0.08s
```

Suggested easing:

```text
power3.out
```

The entrance animation should complete quickly and then stop consuming scroll resources.

---

# 5. Filter Interaction — Use Motion

The filters should remain:

```text
ALL PROCEDURES
FACE & NECK
RHINOPLASTY
BREAST
BODY CONTOURING
```

Do not instantly replace the grid.

Use Motion to animate filtering.

Expected behavior:

```text
user clicks RHINOPLASTY

↓

active filter indicator moves

↓

non-matching cards fade out

↓

remaining cards smoothly reposition

↓

new relevant cards enter
```

Use:

```text
AnimatePresence
layout
layoutId
```

---

# 6. Active Filter Indicator

Use one shared animated visual indicator.

Conceptually:

```tsx
{active && (
  <motion.span
    layoutId="results-active-filter"
  />
)}
```

Do not independently animate the entire pill.

The shared indicator should glide between filter positions.

Keep it restrained.

Recommended duration:

```text
250–350ms
```

No bounce.

No elastic easing.

---

# 7. Grid Re-layout

Use Motion `layout` on each result card.

Conceptual structure:

```tsx
<AnimatePresence mode="popLayout">
  {filteredCases.map((item) => (
    <motion.article
      key={item.id}
      layout
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
    />
  ))}
</AnimatePresence>
```

Use:

```text
mode="popLayout"
```

where it improves layout reflow.

The purpose is:

```text
remove outgoing cards from layout cleanly

while

remaining cards animate into their new positions
```

---

# 8. Keep Filter Animation Fast

Filtering is a utility interaction.

Do not make it cinematic.

Target total response time:

```text
approximately 300–500ms
```

The UI should feel immediate.

Avoid:

```text
1s+ transitions
staggering every card for too long
large spring overshoot
```

---

# 9. Card Hover

Use only subtle interaction.

Recommended:

```text
image:
scale 1 → 1.01–1.02

border:
slightly stronger blue

case link arrow:
x 0 → 4px

metadata:
opacity 0.75 → 1
```

Avoid:

```text
large translateY lift
large shadows
3D tilt
rotation
glow effects
```

The card should continue to feel like clinical documentation, not a product card.

---

# 10. Do Not Animate Before → After Automatically

This is a strict design rule.

Do NOT implement:

```text
automatic crossfade
morph
liquid transition
auto-playing comparison
before → after wipe without user action
```

Before/After content must remain explicit.

The gallery should communicate:

```text
BEFORE | AFTER
```

clearly at all times.

This preserves clinical credibility.

---

# 11. Case Detail — Signature Interaction

The primary premium interaction should occur when the user opens a case.

When a result card is clicked:

```text
grid card
↓
shared-layout transition
↓
large case detail overlay / modal
```

Use Motion shared layout.

Recommended:

```text
layoutId
AnimatePresence
```

The transition should make the card feel like it expands into the detailed case view.

This is the primary "wow" interaction for the Results section.

Do not use a pinned scroll sequence for this purpose.

---

# 12. Case Detail Layout

Recommended desktop layout:

```text
┌─────────────────────────────────────────────────────┐
│ CASE 042                                         X  │
│                                                     │
│ BEFORE                    AFTER                      │
│ [ image ]                 [ image ]                  │
│                                                     │
│ Deep Plane Facelift                                  │
│                                                     │
│ Patient Profile                                     │
│ Female · 54                                         │
│                                                     │
│ Procedure                                           │
│ Deep Plane Facelift                                 │
│                                                     │
│ Recovery                                            │
│ 14 days                                             │
│                                                     │
│ Follow-up                                           │
│ 12 months                                           │
│                                                     │
│ Individual results vary.                            │
└─────────────────────────────────────────────────────┘
```

---

# 13. Interactive Before / After Comparison

Inside the case detail view, allow a user-driven comparison slider if supported by available assets.

Use:

```text
drag
pointer
touch
```

The slider must be user-controlled only.

Do NOT autoplay.

Do NOT use dramatic easing.

The interaction should feel like a clinical comparison tool.

---

# 14. Case Detail Content

Where data is available, include:

```text
procedure
case number
patient age
primary concern
procedure performed
recovery period
follow-up timing
surgeon
multiple view angles
```

This turns the gallery into a proof system rather than a photo collection.

Always include:

```text
Individual results vary.
```

where appropriate.

---

# 15. Modal / Overlay Animation

Use Motion.

Opening:

```text
backdrop:
opacity 0 → 1

case container:
opacity 0 → 1
scale 0.985 → 1
```

If using shared `layoutId`, let layout transition provide most of the movement.

Do not combine several competing large transforms.

Closing should return visually toward the originating card where possible.

---

# 16. Avoid ScrollTrigger Inside the Gallery Grid

Do not create a ScrollTrigger for every card.

Avoid:

```text
20 cards
=
20 independent ScrollTriggers
```

This adds unnecessary runtime work.

Use:

```text
one section entrance trigger
```

and Motion interactions after that.

If individual reveal behavior is required, prefer:

```text
Motion whileInView
```

with lightweight settings instead of dozens of custom GSAP triggers.

---

# 17. Remove the Horizontal Results Pin

If the previous implementation contains:

```text
horizontal gallery ScrollTrigger
pin: true
scrub
large manual section height
```

remove that implementation completely.

Do not leave dormant pin spacers or unused triggers behind.

The Results section should return to normal page flow.

This is important because the homepage already contains:

```text
Revision / Hospital advanced transition
International Journey pinned section
```

Do not add another heavy scroll owner unless absolutely necessary.

---

# 18. Recommended Results Layout

Desktop:

```text
max-width:
1180–1240px

columns:
2

column gap:
24–32px

row gap:
32–40px
```

Cards should have more breathing space than the current dense brochure-style layout.

Use:

```text
thin borders
minimal shadow
clean white or ivory surfaces
```

Avoid heavy cards.

---

# 19. Image Layout

Before and After images should maintain stable dimensions.

Recommended:

```text
same aspect ratio
same crop discipline
same viewport size
same alignment
```

Do not let one result card have a different height due to image natural dimensions.

Use stable image containers.

Example:

```css
aspect-ratio: 4 / 3;
overflow: hidden;
```

or the ratio already used by the source assets.

---

# 20. Image Performance

Use Next.js image optimization.

Prefer:

```text
next/image
AVIF / WebP
responsive sizes
lazy loading below the fold
```

Do not eagerly load every full-resolution result image.

Prioritize visible cards only.

For case detail images:

```text
load higher-resolution assets only when detail is opened
```

where practical.

---

# 21. Prevent Layout Shift

Every image must have:

```text
known width / height
or
known aspect-ratio
```

Do not let image loading resize the grid.

Avoid CLS because Motion layout animation becomes unstable if the geometry changes unexpectedly.

---

# 22. Motion Performance Rules

Prioritize:

```text
transform
opacity
```

Use Motion layout transitions only on the card container and necessary elements.

Avoid animating:

```text
large blur
filter
box-shadow continuously
height on many cards
width on many cards
```

Do not animate every child inside each result card.

Keep the animated layer count low.

---

# 23. Avoid Excessive Shared Layout

Do not apply `layout` or `layoutId` to every text node.

Use it only for:

```text
result card
active filter indicator
selected case image/container
```

Too many layout-tracked elements increase measurement work.

---

# 24. Avoid Heavy Springs

Do not use highly elastic springs.

Recommended Motion transition:

```text
type: tween
duration: 0.3–0.45s
ease: easeOut
```

or a very controlled spring.

Avoid:

```text
bounce
overshoot
long settling motion
```

---

# 25. React Rendering Performance

Use stable keys:

```text
case.id
```

Do not use array index as the primary result card key.

Memoize derived filtered data when needed.

Example:

```ts
const filteredCases = useMemo(...)
```

Do not perform heavy filtering/calculations during every animation frame.

Animation should never cause high-frequency React state updates.

---

# 26. Do Not Store Animation Progress in React State

Avoid:

```ts
setProgress(...)
```

on every frame.

Avoid:

```ts
setMousePosition(...)
```

for unnecessary hover animation.

Let Motion / GSAP handle transforms directly.

React state should be used for:

```text
active filter
selected case
modal open/close
```

not continuous animation values.

---

# 27. Lazy Rendering

If the gallery contains many cases, consider:

```text
initial result limit
Load More
pagination
category filtering
```

instead of rendering dozens of high-resolution cards immediately.

Do not virtualize the grid unless the number of results becomes very large and testing proves it necessary.

Keep UX straightforward.

---

# 28. Filter State

Filter changes should not cause the page to jump vertically.

Keep the section heading and filter bar stable.

The grid should smoothly contract or expand beneath them.

If the number of cards changes significantly, avoid forcing scroll position programmatically.

---

# 29. Optional Sticky Filter Bar

If the gallery becomes long, optionally make the filter bar:

```text
position: sticky
```

below the global header.

Do NOT use GSAP pinning for the filter bar.

Use native CSS sticky behavior.

Only implement this if the case count makes it useful.

---

# 30. Mobile Filter UX

On mobile:

```text
filters:
native horizontal scroll
```

Optional:

```text
scroll-snap
```

Do not use JS carousel behavior.

Keep touch interaction native and fast.

---

# 31. Mobile Results Cards

Use one-column layout.

If side-by-side Before / After images become too small:

use an interactive comparison slider or stacked comparison presentation.

Do not sacrifice clinical visibility just to preserve desktop layout.

---

# 32. Mobile Case Detail

Use:

```text
full-screen modal
or
large bottom sheet
```

Keep:

```text
close action visible
comparison interaction touch-friendly
metadata readable
```

Avoid shared-layout animation if it causes jank on weaker mobile devices.

A simple fade/scale fallback is acceptable.

---

# 33. Responsive Motion Strategy

Use simpler transitions on smaller devices.

Desktop:

```text
full Motion layout transitions
shared case expansion
```

Tablet:

```text
layout transitions
reduced image scale effects
```

Mobile:

```text
simple opacity + position transitions
avoid expensive shared-layout if performance is poor
```

Test on actual mid-range devices.

---

# 34. Reduced Motion

Respect:

```css
prefers-reduced-motion: reduce
```

Use Motion:

```text
MotionConfig reducedMotion="user"
```

Reduced-motion behavior:

```text
filter changes:
instant or opacity-only

card open:
simple fade

hover transforms:
disabled

GSAP heading reveal:
minimal opacity
```

All functionality must remain available.

---

# 35. Prevent Main-Thread Overload

Avoid running simultaneously:

```text
Journey scrub animations
+
Results pin animations
+
many card ScrollTriggers
+
large layout transitions
```

Because Results is no longer pinned, it should reduce animation pressure after Journey releases.

This is intentional.

---

# 36. GSAP Cleanup

The one Results entrance animation must be scoped with:

```text
useGSAP()
```

Ensure cleanup on unmount.

Do not leave anonymous ScrollTriggers after route navigation.

Do not call:

```text
ScrollTrigger.killAll()
```

from this component.

---

# 37. Motion Component Boundaries

Do not wrap the entire homepage in a giant Motion layout container.

Scope Motion to the Results feature.

Recommended:

```text
PatientResults
├── ResultsHeader
├── ResultsFilters
├── ResultsGrid
├── ResultCard
└── ResultCaseModal
```

Keep layout animation local.

---

# 38. Accessibility

Filters must be real buttons.

Use:

```text
aria-pressed
```

or appropriate tab semantics if implementing as tabs.

Cards must be keyboard accessible.

Case modal must support:

```text
focus trap
ESC close
return focus to originating card
```

Before/After slider must be usable with keyboard where feasible.

Do not encode state only through color.

---

# 39. Do Not Implement

Do NOT add:

```text
horizontal pinned Results section
Observer
scroll hijacking
auto-playing result carousel
automatic Before → After transitions
3D card tilt
large parallax
cursor-follow effects
large blur effects
bounce
elastic animations
large shadow animation
one ScrollTrigger per result card
```

The Results section must remain calm and trustworthy.

---

# 40. Performance Acceptance Criteria

The implementation is successful only if:

```text
[ ] Results no longer owns a pinned scroll region
[ ] no blank pin spacer remains from the previous horizontal implementation
[ ] filter interaction feels immediate
[ ] cards re-layout smoothly
[ ] no visible layout jump occurs
[ ] image loading does not change card geometry
[ ] opening a case remains smooth
[ ] closing a case remains smooth
[ ] no continuous React re-render occurs during animation
[ ] no unnecessary ScrollTriggers are created
[ ] desktop remains smooth during fast scrolling
[ ] mid-range mobile remains responsive
[ ] reduced-motion works
```

---

# 41. UX Acceptance Criteria

The final interaction should feel:

```text
browse
↓
filter
↓
compare
↓
inspect
↓
understand the clinical case
```

not:

```text
scroll through another animation showcase
```

The user must always be able to clearly understand:

```text
Before
After
Procedure
Case
Recovery
Clinical context
```

---

# 42. Final Motion System

The Results experience should use this hierarchy:

```text
SECTION ENTER
GSAP
↓
subtle editorial reveal


FILTER
Motion
↓
active indicator
grid reflow
enter / exit


CARD HOVER
Motion
↓
minimal emphasis


CARD CLICK
Motion shared layout
↓
case detail expansion


CASE DETAIL
Motion
↓
user-controlled Before / After comparison


CLOSE
Motion
↓
return to gallery
```

---

# 43. Final Engineering Principle

The Results section is a **clinical evidence interface**, not a scroll-story section.

Use animation only where it improves:

```text
orientation
filter feedback
layout continuity
case exploration
comparison
```

Avoid motion that makes patient results feel manipulated.

The final implementation should be:

**visually premium, clinically trustworthy, technically lightweight, and deliberately simpler than the homepage's major GSAP storytelling sections.**