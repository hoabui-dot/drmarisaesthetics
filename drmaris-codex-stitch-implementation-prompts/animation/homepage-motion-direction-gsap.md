# Dr. Maris Aesthetics Homepage — Motion Direction & GSAP Implementation Prompt

## Purpose

Use this document as the motion-design and frontend implementation brief for the **Dr. Maris Aesthetics homepage** in Next.js.

The goal is not to turn the website into an animation showcase. Motion must reinforce the brand values of:

- clinical credibility
- surgical precision
- calm confidence
- premium editorial presentation
- patient trust
- clarity of the medical journey

The homepage should feel refined and cinematic where appropriate, while remaining professional, readable, accessible, performant, and trustworthy.

---

# 1. Motion Direction

## Core Motion Personality

The visual motion language should be:

**Precise / Calm / Clinical / Premium**

Animation should feel controlled rather than playful.

The user should feel that every transition is deliberate, measured, and structured, similar to the way surgical planning itself is presented.

Motion should support:

- trust
- hierarchy
- comprehension
- continuity between sections
- premium perception
- storytelling

Motion must never compete with medical content.

---

## Motion Characteristics

Prefer:

- controlled translation
- subtle scaling
- subtle rotation
- masked reveals
- clip-path reveals
- image crop movement
- soft parallax
- line drawing
- sequential progress animation
- pinned storytelling only for major narrative sections
- staggered typography reveals
- sticky timelines

Avoid:

- bounce
- elastic easing
- aggressive rotation
- random floating objects
- excessive depth effects
- exaggerated parallax
- cursor-follow gimmicks
- long scroll hijacking
- strong blur transitions
- constant 3D card tilting
- excessive simultaneous motion

---

## Suggested Motion Ranges

Use the following as general guidance, not rigid values:

```text
Micro interaction:
250–450ms

Section reveal:
700–1100ms

Scroll scrub:
0.6–1.2

Rotation:
approximately ±2° to ±5°

Scale:
approximately 0.94 to 1.03

Image parallax distance:
approximately 30px to 80px on desktop

Mobile parallax:
approximately 0px to 20px
```

Avoid large 15–30 degree section rotations.

---

# 2. Animation Hierarchy

Not every section should have the same animation intensity.

Use three animation levels.

## Heavy / Signature Motion

Use complex GSAP choreography only for:

1. Hero
2. Revision Surgery Feature
3. International Patient Journey

These are the main cinematic storytelling moments of the homepage.

---

## Medium Motion

Use moderate motion for:

4. Surgical Care Process
5. Hospital / CIH section

---

## Lightweight Motion

Use subtle entrance animation only for:

- Dr. Maris personal assessment section
- FAQ
- final consultation CTA
- footer
- supporting content blocks

---

# 3. Header Motion

The header should remain functional and calm.

Use a sticky header.

When the user scrolls approximately 80–120px:

```text
Utility bar:
height 32px → 0
opacity 1 → 0

Primary navigation:
height 80px → approximately 68px

Logo:
40px → approximately 34px
```

The header should become more compact while preserving:

- logo
- main navigation
- primary consultation CTA

Avoid large header movement.

Use GSAP ScrollTrigger or a lightweight scroll-state implementation.

The transition should feel smooth and restrained.

---

# 4. Hero Section

The hero is the first signature animation moment.

Current content structure:

- eyebrow
- H1
- supporting copy
- primary CTA
- secondary CTA
- trust statements
- surgeon image

## Initial Page Load Sequence

Animate in the following order:

1. horizontal eyebrow divider expands
2. eyebrow text reveals
3. H1 reveals line-by-line
4. first body paragraph reveals
5. second body paragraph reveals
6. CTA group appears
7. surgeon image reveals
8. trust labels appear

---

## Hero Typography

Use GSAP SplitText or a line-based wrapper.

Animate H1 by line.

Example:

```text
Plastic Surgery in
Vietnam for
International Patients
```

Each line should reveal through an overflow mask.

Suggested motion:

```text
yPercent: 100 → 0
opacity: optional
stagger: 0.08–0.12s
ease: power3.out
```

Do not reveal the entire heading as one fade block.

---

## Hero Image Reveal

Use:

```text
clip-path:
inset(0 100% 0 0)
→
inset(0 0% 0 0)

scale:
1.08 → 1
```

Keep the movement slow and premium.

Do not use aggressive rotation.

---

## Hero Scroll Exit

When scrolling away from the hero:

```text
surgeon image:
scale 1 → approximately 1.06
y 0 → approximately 50px

text content:
y 0 → approximately -40px
opacity 1 → approximately 0.65
```

This should create subtle visual depth.

Do not fully fade content out too early.

---

# 5. Transition from Hero to Surgical Care Process

Use visual continuity between the surgeon image in the hero and the surgeon image in the next section.

Preferred concept:

```text
Hero surgeon image
↓ scroll
image crop changes
↓
image compresses
↓
image shifts position
↓
becomes visually related to the surgeon card in the next section
```

GSAP Flip may be used if the implementation supports a real shared-element transition.

If DOM structure makes Flip impractical, simulate the continuity with:

- scale
- position
- crop
- opacity
- matching easing

The objective is psychological continuity, not technical novelty.

---

# 6. Surgical Care Process Section

This section should communicate a structured surgical journey.

The existing timeline contains:

1. Consultation
2. Examination
3. Planning
4. Surgery
5. Follow-up

## Timeline Animation

Animate the connecting line from left to right:

```text
scaleX: 0 → 1
transform-origin: left center
```

Activate the steps sequentially.

Each step can animate:

```text
number:
opacity 0.3 → 1
y 12px → 0

label:
opacity 0.5 → 1
```

The line progress and steps should feel synchronized.

---

## Surgeon Image

Animate the image with:

```text
scale 0.96 → 1
rotation 2deg → 0deg
opacity 0 → 1
```

---

## Experience Card

Animate the floating experience card:

```text
x -20px → 0
y 20px → 0
opacity 0 → 1
```

Keep the card motion secondary to the timeline.

---

# 7. Revision Surgery Feature

This is the strongest content section on the homepage and should become the second signature motion moment.

The section uses the deep navy brand color and should feel more focused and serious than the surrounding white sections.

## Section Entry

Instead of instantly switching to navy, reveal the navy background.

Possible techniques:

```text
clip-path reveal
```

or

```text
scaleY: 0 → 1
transform-origin: bottom
```

The transition should be clean and architectural.

Do not use blur-heavy transitions.

---

## Pinned Storytelling

Use ScrollTrigger pinning.

Suggested scroll length:

```text
approximately 150–200vh
```

Do not keep the user trapped in the section for too long.

---

## Heading Reveal

Reveal:

```text
Revision Cosmetic
Surgery Vietnam
```

line-by-line using mask-based motion.

Suggested motion:

```text
yPercent 100 → 0
opacity optional
```

---

## Revision Concern List

The list of revision concerns should react to scroll progress.

Examples:

- Capsular Contracture
- Asymmetry Correction
- Excessive Scar Tissue
- Implant Malposition
- Over-resected Rhinoplasty
- Contour Irregularities
- Unsatisfactory Functional Outcomes

Each item should become active sequentially.

Suggested active transition:

```text
x 20px → 0
opacity 0.3 → 1
```

Previous items may reduce to approximately:

```text
opacity: 0.45
```

The effect should feel like the surgeon is walking the patient through increasingly specific clinical concerns.

---

## Revision Card

The assessment card should enter once the main heading is established.

Use:

```text
y 30px → 0
opacity 0 → 1
```

Avoid dramatic rotation.

---

## Do Not Rotate the Entire Section

Do not use strong 3D rotation for the navy section.

If any rotational motion is used, keep it extremely subtle:

```text
-1.5deg → 0deg
```

for a card or small visual block only.

Medical credibility is more important than spectacle.

---

# 8. Dr. Maris Personal Assessment Section

This section should act as a visual breathing point after Revision Surgery.

Use a calm editorial entrance.

## Surgeon Image

```text
clip-path reveal
scale 1.06 → 1
```

---

## Heading

Reveal by line.

Use a restrained y-axis entrance.

---

## Quote Card

```text
x 30px → 0
opacity 0 → 1
```

---

## Checklist

Stagger checklist items:

```text
stagger: 0.06–0.08s
```

Do not pin this section.

Do not make this a major cinematic sequence.

---

# 9. Hospital / CIH Section

The purpose of this section is trust and medical infrastructure.

The hospital visual should feel authoritative.

## Image Container

Animate the outer image container:

```text
scale 0.92 → 1
opacity 0 → 1
```

Then apply subtle inner-image parallax:

```text
inner image scale 1 → 1.08
```

while keeping the frame stable.

This creates a soft Ken Burns effect.

---

## Heading

Reveal the headline by line:

```text
Surgery Performed at
City International
Hospital (CIH)
```

---

## Disclaimer

Do not animate the disclaimer aggressively.

Use only:

```text
opacity 0 → 1
```

Medical disclaimers must remain easy to read.

---

# 10. International Patients — Content Consolidation

The current homepage contains two separate six-step international patient journey sections.

This creates duplicated storytelling.

Do not create two major animated timelines.

Instead:

- consolidate the information
- retain one primary journey section
- use that section as the third signature GSAP experience

The final user journey should be:

1. Send Your Case
2. Video Consultation
3. Travel Planning
4. In-Person Examination
5. Your Procedure
6. Recovery & Follow-Up

---

# 11. International Patient Journey

This should become the third signature scroll-driven section.

Prefer a vertical sticky journey over a horizontally hijacked experience.

## Desktop Structure

Recommended layout:

```text
LEFT
01
02
03
04
05
06

RIGHT
active step content
```

The section heading remains visible while the steps progress.

---

## Sticky Behavior

Suggested pinned scroll distance:

```text
approximately 300–400vh
```

Use the actual content density to determine the final value.

The scroll should remain responsive and should not feel artificially slowed.

---

## Progress Line

Draw a vertical line as the user moves through steps:

```text
scaleY: 0 → 1
transform-origin: top
```

---

## Active Step

Each step should transition in sequence.

Suggested animation:

```text
y 20px → 0
opacity 0 → 1
```

Inactive steps remain visible at lower opacity.

Example:

```text
inactive opacity: 0.25–0.4
active opacity: 1
```

---

## Content Transition

When moving between steps:

```text
old content:
y 0 → -20px
opacity 1 → 0

new content:
y 20px → 0
opacity 0 → 1
```

Avoid hard cuts.

---

# 12. Optional Image Collage for International Journey

Only use a collage animation if the final asset set contains suitable real visuals for:

- consultation
- doctor
- travel / Ho Chi Minh City
- hospital
- procedure environment
- recovery

Possible pattern:

```text
Start:
images distributed across the viewport

Scroll:
images converge

End:
organized composition or grid
```

Use:

- GSAP ScrollTrigger
- GSAP Flip where appropriate

Do not create a collage using weak, generic, or visually inconsistent assets.

Content quality comes before motion complexity.

---

# 13. Final Consultation CTA

This is a conversion section.

Animation must become quieter here.

The user should feel that the interface has stabilized.

## Heading

```text
y 30px → 0
opacity 0 → 1
```

---

## Form

```text
scale 0.98 → 1
opacity 0 → 1
```

---

## Input Interaction

Use CSS or Motion for:

- focus
- hover
- validation
- success states

Do not use scroll-driven motion inside the form.

---

## Submit Button

Keep interaction simple:

```text
hover:
translateY(-1px)
```

Optionally add a subtle color or shadow transition.

---

# 14. FAQ Section

The existing static two-column FAQ is too text-heavy.

Prefer an accordion pattern.

## FAQ Behavior

Closed item:

```text
Question                              +
──────────────────────────────────────
```

Open item:

```text
Question                              −
Answer
──────────────────────────────────────
```

Use Motion or CSS for this interaction.

GSAP is not required unless the existing motion system already uses it.

Suggested transition:

```text
height: 0 → auto
opacity: 0 → 1
```

Keep the interaction fast and functional.

---

# 15. Recommended Homepage Information Flow

Preferred page rhythm:

```text
Hero
↓
Surgical Care Process
↓
Revision Surgery
↓
Dr. Maris Personal Assessment
↓
Hospital / CIH
↓
International Patient Journey
↓
FAQ
↓
Final Consultation CTA
↓
Footer
```

This order improves the conversion narrative:

```text
Trust
↓
Understand
↓
Differentiate
↓
Reduce uncertainty
↓
Resolve objections
↓
Convert
```

If the final CTA remains before FAQ, add a smaller secondary CTA after the FAQ.

---

# 16. Footer Motion

Do not create decorative footer animation.

Use only:

```text
opacity 0 → 1
y 20px → 0
```

for selected groups.

No pinning.

No parallax.

No 3D.

---

# 17. Motion Rhythm Across the Page

Do not apply the same fade-up effect everywhere.

Each section should have a distinct motion purpose.

| Section | Motion Pattern |
| --- | --- |
| Hero | split text + mask image reveal |
| Surgical Care Process | timeline drawing |
| Revision Surgery | pinned scroll storytelling |
| Dr. Maris Assessment | editorial reveal |
| Hospital | image crop + subtle parallax |
| International Journey | sticky sequential timeline |
| FAQ | accordion |
| Final CTA | minimal entrance |
| Footer | subtle fade |

---

# 18. What Not to Build

Do not add the following to this homepage:

- large custom cursor
- scroll hijacking
- full-page fake inertia that interferes with native navigation
- mouse-follow imagery throughout the site
- aggressive 3D card tilt
- 15–30 degree section rotations
- heavy blur-based transitions
- shader effects unless a specific future section requires them
- constant floating content
- animation on every paragraph
- large delays before content becomes readable

---

# 19. Next.js / GSAP Technical Direction

Recommended stack:

```text
Next.js
GSAP
@gsap/react
ScrollTrigger
SplitText
Flip
Motion
```

Lenis is optional and should only be used if smooth scrolling can be implemented without harming native usability.

Three.js / React Three Fiber is not required for the current homepage.

---

# 20. Suggested Component Structure

Organize animation by section.

```text
components/
  home/
    Hero.tsx
    SurgicalProcess.tsx
    RevisionFeature.tsx
    SurgeonAssessment.tsx
    HospitalSection.tsx
    InternationalJourney.tsx
    FAQ.tsx
    ConsultationCTA.tsx
```

Animation logic may live inside each component or in dedicated hooks.

Example:

```text
hooks/
  useHeroAnimation.ts
  useSurgicalProcessAnimation.ts
  useRevisionScroll.ts
  useInternationalJourneyAnimation.ts
```

Avoid one giant homepage animation file.

---

# 21. React / GSAP Lifecycle Rules

Use:

```text
@gsap/react
useGSAP()
```

All GSAP timelines and ScrollTriggers must be scoped to the component and cleaned up on unmount.

Do not attach global uncontrolled ScrollTriggers.

Avoid React state updates on every scroll frame.

Let GSAP manipulate transform and opacity directly when appropriate.

---

# 22. Performance Budget

The homepage should remain usable on average laptops and mid-range mobile devices.

## Preferred Animation Properties

Prioritize:

```text
transform
opacity
```

Use carefully:

```text
clip-path
```

Avoid continuous animation of:

```text
width
height
top
left
filter
large blur
box-shadow
```

---

## Simultaneous Layers

Target approximately:

```text
10–15 actively animated DOM layers
```

inside a viewport at any one time.

Do not run multiple large scrub timelines simultaneously.

---

# 23. Image Performance

Use:

- Next/Image
- responsive `sizes`
- modern formats such as WebP or AVIF where possible
- hero image priority only when necessary
- lazy loading below the fold
- correctly sized source assets

Avoid loading full-resolution 4K imagery when the rendered width is much smaller.

---

# 24. ScrollTrigger Performance

Only initialize complex triggers where needed.

Avoid:

- dozens of active triggers on one section
- unnecessary `onUpdate` callbacks
- using React setState inside ScrollTrigger updates
- large layout calculations on each frame

Prefer timelines controlled directly by ScrollTrigger progress.

---

# 25. Desktop vs Mobile Motion

Do not simply reuse desktop choreography on mobile.

Use GSAP `matchMedia()` or equivalent responsive logic.

## Desktop

Allow:

- pinned Revision section
- pinned International Journey
- stronger image parallax
- more elaborate typography reveals

---

## Mobile

Simplify:

```text
Revision:
pinned storytelling → normal stacked reveal

International Journey:
sticky desktop story → vertical timeline

Image parallax:
60px → 0–20px

Complex shared-element transitions:
disable if necessary
```

Mobile must prioritize:

- readability
- battery life
- touch responsiveness
- browser stability

---

# 26. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Disable or simplify:

- scrub animation
- parallax
- pinned storytelling
- large masked transitions
- non-essential movement

Keep:

- content visible
- accordion functionality
- minimal opacity transitions if acceptable

The page must remain fully understandable without motion.

---

# 27. Suggested GSAP Easing Language

Prefer smooth premium curves such as:

```text
power2.out
power3.out
power3.inOut
expo.out
```

Use sparingly.

Avoid:

```text
bounce
elastic
back with strong overshoot
```

The motion system should not feel playful.

---

# 28. Example Motion Storyboard

The homepage experience should feel approximately like this:

```text
PAGE LOAD
│
├─ Header settles
│
├─ Hero eyebrow appears
│
├─ Hero headline reveals line-by-line
│
├─ Supporting copy appears
│
└─ Surgeon image opens from a mask
      ↓
SCROLL
      ↓
Hero image subtly enlarges
      ↓
SURGICAL CARE PROCESS
timeline draws from 01 to 05
      ↓
REVISION SURGERY
navy background reveals
headline appears
revision concerns activate sequentially
      ↓
DR. MARIS
portrait reveal
quote slides in
      ↓
HOSPITAL
image gently expands
      ↓
INTERNATIONAL PATIENT JOURNEY
section pins
01 → 02 → 03 → 04 → 05 → 06
progress line follows scroll
      ↓
FAQ
clean accordion interactions
      ↓
FINAL CTA
quiet controlled entrance
      ↓
FOOTER
```

---

# 29. Implementation Priority

Build in phases.

## Phase 1 — High ROI

Implement:

- sticky compact header
- hero load animation
- general heading/image reveals
- surgical care timeline draw
- FAQ accordion
- reduced-motion support

---

## Phase 2 — Signature Motion

Implement:

- Revision Surgery pinned storytelling
- International Patient Journey sticky timeline

---

## Phase 3 — Polish

Implement:

- subtle image parallax
- refined section transitions
- shared-element / Flip transitions where beneficial
- micro interactions
- final easing and timing polish

---

# 30. Final Design Principle

The homepage must not feel like a creative agency portfolio.

It must feel like a premium medical experience.

Every animation should answer at least one of these questions:

1. Does this improve content hierarchy?
2. Does this help the patient understand the journey?
3. Does this reinforce trust or authority?
4. Does this create continuity between sections?
5. Does this improve premium perception without reducing clarity?

If the answer is no, remove the animation.

The final motion system should emphasize:

- surgeon authority
- hospital-based safety
- revision expertise
- international patient support

The three primary animated storytelling moments should remain:

**Hero cinematic reveal → Revision Surgery pinned story → International Patient Journey sticky scroll timeline**

Everything else should support those moments rather than compete with them.
