# Dr. Maris Aesthetics — International Patient Journey GSAP Lateral Pin Indicator Redesign

## Objective

Redesign the current **International Patient Journey** section into a premium scroll-driven storytelling experience inspired by the GSAP reference:

https://demos.gsap.com/demo/lateral-pin-indicator/

The current six-step static grid should be replaced with a **pinned sequential journey section** where the user scrolls vertically while:

- the section remains pinned
- one journey step becomes active at a time
- a lateral progress indicator moves through steps `01 → 06`
- the active title and description change
- a dedicated image changes for every step
- the image, copy, number, and indicator transition as one synchronized experience

The final experience must remain consistent with the Dr. Maris visual language:

**Clinical / Premium / Calm / Editorial / International / Surgeon-Led**

Do not copy the demo's visual design literally.

Reproduce the **interaction concept and lateral indicator behavior**, then adapt it to the Dr. Maris medical aesthetic.

---

# 1. Replace the Current Static 3 × 2 Grid

Remove the existing layout:

```text
01 Send Your Case
02 Video Consultation
03 Travel Planning

04 In-Person Exam
05 Your Procedure
06 Recovery & Follow-Up
```

Do not keep the six steps as equal static cards.

Transform the section into one immersive journey.

---

# 2. Preserve the Existing Section Introduction

Keep the existing content direction:

```text
INTERNATIONAL PATIENT JOURNEY

From your first inquiry to
confident recovery.

A seamless, medically supervised experience
for patients planning surgery in Vietnam
from overseas.
```

However, restructure it so the introduction becomes part of the pinned composition rather than sitting above a conventional card grid.

---

# 3. Recommended Desktop Layout

Use a three-part editorial composition:

```text
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  INTERNATIONAL PATIENT JOURNEY                                       │
│                                                                      │
│  From your first inquiry                                             │
│  to confident recovery.                                              │
│                                                                      │
│  ┌────────────┐  ┌─────────────────────────────┐  ┌────────────────┐ │
│  │            │  │                             │  │                │ │
│  │  01        │  │  SEND YOUR CASE             │  │                │ │
│  │  │         │  │                             │  │     IMAGE      │ │
│  │  02        │  │  Submit your medical        │  │                │ │
│  │  │         │  │  history, goals and         │  │    ACTIVE      │ │
│  │  03        │  │  high-resolution photos... │  │     STEP       │ │
│  │  │         │  │                             │  │                │ │
│  │  04        │  │  STEP 01 / 06               │  │                │ │
│  │  │         │  │                             │  │                │ │
│  │  05        │  │                             │  │                │ │
│  │  │         │  │                             │  │                │ │
│  │  06        │  │                             │  │                │ │
│  │            │  │                             │  │                │ │
│  └────────────┘  └─────────────────────────────┘  └────────────────┘ │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

Recommended proportions:

```text
Lateral indicator:
10–14%

Content:
34–38%

Image:
48–54%
```

The image should be the strongest visual element.

---

# 4. Lateral Pin Indicator

Create a vertical lateral navigation rail inspired by the GSAP demo.

Display:

```text
01
│
02
│
03
│
04
│
05
│
06
```

Inactive numbers:

```text
opacity: 0.25–0.35
```

Active number:

```text
opacity: 1
color: #4A90E2
scale: 1 → approximately 1.05
```

The active indicator should visibly progress down the rail while scrolling.

Use a thin vertical track.

Example:

```text
inactive track:
rgba(0,45,114,0.12)

active progress:
#4A90E2
```

Animate the active progress line using:

```text
scaleY: 0 → 1
transform-origin: top
```

The indicator must be visually connected to scroll progress.

Do not make it behave like six clickable SaaS tabs.

It should feel editorial and architectural.

---

# 5. Pinned Scroll Behavior

Use GSAP + ScrollTrigger.

The entire journey composition should remain pinned while the user progresses through the six steps.

Recommended direction:

```text
pin: true
scrub: approximately 0.8–1
```

The total scroll duration should provide enough time for six states without feeling slow.

Suggested starting range:

```text
approximately 350–450vh
```

Adjust after testing based on viewport height and actual transition timing.

Do not make each step require excessive scrolling.

Each wheel gesture should visibly advance the storytelling state.

---

# 6. Step Progress Mapping

Map scroll progress into six approximately equal ranges.

Conceptually:

```text
0.00–0.16 → Step 01
0.16–0.32 → Step 02
0.32–0.48 → Step 03
0.48–0.64 → Step 04
0.64–0.80 → Step 05
0.80–1.00 → Step 06
```

Do not rely on fragile hardcoded pixel offsets.

Derive active state from normalized ScrollTrigger progress where possible.

---

# 7. The Six Journey Steps

Use the following definitive content.

---

## 01 — Send Your Case

### Title

**Send Your Case**

### Description

```text
Submit your medical history, surgical goals,
high-resolution photographs, and relevant details
for a preliminary clinical review.
```

### Image Direction

Use a premium clinical consultation image showing:

```text
an international patient at home
using a laptop or tablet

medical documents visible but not readable

patient preparing or uploading clinical photographs

clean, sophisticated home or private consultation environment
```

Ideal visual concept:

**International female or male patient using a laptop to securely submit medical information before travelling.**

Do not use:

- generic customer support
- obvious stock call-center imagery
- selfie-style imagery
- visible private medical data
- generic beauty salon imagery

Image should communicate:

```text
remote clinical intake
privacy
planning before travel
```

---

## 02 — Video Consultation

### Title

**Video Consultation**

### Description

```text
A direct one-to-one consultation with Dr. Maris
to discuss your anatomy, goals, expectations,
previous procedures, and surgical considerations.
```

### Image Direction

Use:

```text
Dr. Maris or a premium plastic surgeon
speaking to an international patient through
a laptop or large monitor

professional consultation room

natural medical environment
```

Best visual:

**Surgeon seated in a private consultation room during a video consultation, with the patient visible on screen.**

Do not use a generic telemedicine stock image with exaggerated smiling or call-center aesthetics.

The scene should communicate:

```text
direct surgeon access
clinical authority
private consultation
```

---

## 03 — Travel Planning

### Title

**Travel Planning**

### Description

```text
Receive guidance for your medical itinerary,
hospital arrangements, recommended accommodation,
and appropriate recovery time in Ho Chi Minh City.
```

### Image Direction

Use an image combining:

```text
international travel
+
premium medical planning
```

Preferred scene:

**International patient preparing for travel with passport and luggage, with subtle Ho Chi Minh City / Vietnam context.**

Alternative:

```text
patient arriving at a premium hotel or hospital reception
with luggage
```

Keep it sophisticated.

Do not make the section look like a tourism website.

The medical journey must remain the primary narrative.

Avoid:

- tropical vacation imagery
- beach imagery
- tourist attractions as the dominant visual
- airline advertising aesthetics

The image should communicate:

```text
planned medical travel
organized arrival
confidence
```

---

## 04 — In-Person Exam

### Title

**In-Person Exam**

### Description

```text
Meet Dr. Maris for a complete clinical examination,
final anatomical assessment, and required
pre-operative testing at City International Hospital.
```

### Image Direction

Use a real or realistic premium plastic surgery consultation scene.

Preferred:

**Plastic surgeon professionally examining or assessing a patient inside a modern consultation room.**

Possible actions:

```text
reviewing anatomy
clinical photography
discussing surgical markings
reviewing scans or images
```

Keep the imagery respectful and non-invasive.

Avoid:

- sexualized patient imagery
- unnecessary exposed body areas
- dramatic surgical markings
- spa consultation imagery

This image should strongly communicate:

```text
clinical assessment
surgeon involvement
professional planning
```

---

## 05 — Your Procedure

### Title

**Your Procedure**

### Description

```text
Your procedure is performed by Dr. Maris
within the medical infrastructure of
City International Hospital.
```

### Image Direction

Use a premium operating-room image.

Preferred scene:

**Plastic surgeon and surgical team working inside a modern accredited operating theatre.**

The image may include:

```text
surgeon
assistant
operating lights
medical monitors
modern equipment
sterile surgical environment
```

Do not show:

- blood
- open wounds
- graphic surgical details
- exposed anatomy
- distressing medical imagery

The visual should communicate:

```text
precision
safety
medical infrastructure
surgical expertise
```

This should be one of the strongest images in the entire journey.

---

## 06 — Recovery & Follow-Up

### Title

**Recovery & Follow-Up**

### Description

```text
Receive structured post-operative care
and a long-term follow-up plan designed
to support safe healing and recovery.
```

### Image Direction

Use:

**A patient recovering comfortably in a premium hospital or recovery suite while being checked by a nurse or surgeon.**

Alternative:

```text
Dr. Maris conducting a calm post-operative
follow-up consultation
```

The patient should appear:

```text
comfortable
safe
calm
medically supervised
```

Avoid:

- spa recovery imagery
- exaggerated smiling
- hotel-only imagery with no medical context
- visible wounds

The final image should communicate:

```text
reassurance
continuity of care
safe recovery
```

---

# 8. Image Art Direction Across All Six Steps

All six images must feel like they belong to the same visual system.

Use:

```text
premium editorial medical photography

cool / neutral grading

natural light where appropriate

clean whites

clinical blues

subtle navy shadows

realistic healthcare environments
```

Avoid mixing:

```text
warm lifestyle stock
cold corporate stock
luxury hotel imagery
low-quality medical stock
generic spa photography
```

Maintain a consistent image aspect ratio.

Recommended desktop ratio:

```text
4:5
```

or:

```text
3:4
```

depending on the final composition.

Use `object-fit: cover`.

---

# 9. Image Transition Behavior

The right-side image panel should remain fixed within the pinned section.

Do not replace the complete image DOM abruptly.

Stack all six visual layers in the same image container.

Conceptually:

```text
image-container
├── image-01
├── image-02
├── image-03
├── image-04
├── image-05
└── image-06
```

Only the active image should be visually dominant.

Recommended transition:

```text
incoming image:
clip-path inset(100% 0 0 0) → inset(0)
scale 1.05 → 1
opacity 0.8 → 1

outgoing image:
scale 1 → 1.03
opacity 1 → 0
```

Alternative:

```text
vertical mask reveal
```

Keep transitions calm.

Do not use:

- spinning images
- aggressive horizontal flying
- 3D flipping
- large rotations

---

# 10. Content Transition

Only one step should have full visual emphasis at a time.

For incoming content:

```text
opacity 0 → 1
y 24px → 0
```

Outgoing:

```text
opacity 1 → 0
y 0 → -16px
```

Do not remove content from the DOM during every scroll update if unnecessary.

Avoid React re-renders on every ScrollTrigger frame.

Let GSAP control the visual state.

---

# 11. Oversized Step Number

In addition to the lateral indicator, introduce a large decorative active step number near the content.

Example:

```text
01
```

Typography:

```text
Cormorant Garamond
120–180px desktop
```

Use low visual emphasis:

```text
color: #002D72
opacity: approximately 0.05–0.08
```

It should act as an editorial background device.

When changing steps:

```text
01 → 02 → 03 → 04 → 05 → 06
```

animate with:

```text
y 20px → 0
opacity 0 → approximately 0.07
```

Do not let the decorative number compete with the actual content.

---

# 12. Section Background

Replace the current flat light-grey grid feel with a more refined editorial surface.

Recommended:

```text
#F8FAFC
```

or a slightly warmer tone:

```text
#FAF9F6
```

Optional subtle background treatment:

```text
large radial gradient

very faint medical-blue glow
```

Do not use visible decorative patterns.

The imagery should provide most of the visual richness.

---

# 13. Active Step Detail

Each active state should show:

```text
STEP 01 / 06

SEND YOUR CASE

description

optional supporting micro-label
```

Possible micro-labels:

```text
REMOTE CLINICAL REVIEW
DIRECT SURGEON CONSULTATION
MEDICAL TRAVEL PLANNING
FINAL CLINICAL ASSESSMENT
HOSPITAL-BASED SURGERY
STRUCTURED FOLLOW-UP
```

Use them sparingly.

---

# 14. Progress Microcopy

Near the lateral rail or content area, optionally show:

```text
01 / 06
```

Then:

```text
02 / 06
03 / 06
04 / 06
05 / 06
06 / 06
```

Keep this small and typographic.

Do not use a large progress bar.

---

# 15. GSAP Implementation Direction

Use:

```text
GSAP
ScrollTrigger
@gsap/react
```

Potential structure:

```tsx
<section ref={journeyRef}>
  <div className="journey-pin">

    <header className="journey-intro">
      ...
    </header>

    <div className="journey-layout">

      <aside className="journey-indicator">
        ...
      </aside>

      <div className="journey-content">
        ...
      </div>

      <div className="journey-visual">
        ...
      </div>

    </div>

  </div>
</section>
```

Create a single ScrollTrigger controlling the primary timeline where practical.

Avoid creating several independent scrub triggers that compete with each other.

---

# 16. Timeline Synchronization

Each journey step transition should synchronize:

```text
indicator active state
progress line
large step number
step title
step description
step micro-label
active image
```

These should not update at noticeably different moments.

The section should feel like one orchestrated storytelling system.

---

# 17. Scroll Snapping

Do not force hard snapping initially.

First implement smooth scrub behavior matching the GSAP lateral pin concept.

If testing shows that users frequently stop halfway between states, consider subtle ScrollTrigger snapping:

```text
snap to six journey states
```

Snap must remain gentle.

Do not make scrolling feel hijacked.

---

# 18. Section Entry

When the section first enters:

```text
eyebrow:
opacity 0 → 1

headline:
masked line reveal

description:
fade-up

indicator:
line draws in

image 01:
mask reveal
```

After Step 01 is established, the pinned scroll journey begins.

Do not immediately start changing steps before the user has read the section introduction.

---

# 19. Section Exit

After Step 06 reaches its completed state:

```text
Recovery & Follow-Up
```

allow a small final scroll interval so the user can read the content.

Then release the pin naturally and continue into the next homepage section.

Do not release the pin immediately when Step 06 first appears.

The final state needs breathing room.

---

# 20. Mobile Layout

Do not reproduce the complete desktop pinned experience on small screens.

For mobile, transform the section into a vertical editorial journey.

Recommended:

```text
01
IMAGE
Send Your Case
description

│

02
IMAGE
Video Consultation
description

│

03
...
```

Use a vertical progress line.

Apply lightweight ScrollTrigger animations such as:

```text
image mask reveal
number activation
progress line drawing
```

Do not pin the complete section on mobile if it interferes with native touch scrolling.

---

# 21. Tablet

Tablet may retain a simplified pinned layout if testing confirms it remains usable.

Possible tablet structure:

```text
left:
lateral numbers

right:
image
content beneath or overlaying image
```

Use GSAP `matchMedia()` to separate desktop, tablet, and mobile behavior.

---

# 22. Reduced Motion

Respect:

```css
prefers-reduced-motion: reduce
```

Reduced-motion fallback:

```text
normal vertical content
all images visible with their relevant step
no pinned section
no scrub
no parallax
```

All content must remain understandable without GSAP.

---

# 23. Performance

Optimize all six images.

Use:

```text
Next/Image
AVIF or WebP
responsive sizes
correct intrinsic dimensions
```

Preload only imagery necessary for the first visible journey state.

Do not eagerly load unnecessarily large original images.

Because images transition while the section is pinned, ensure subsequent journey images are available before their state becomes active.

Avoid heavy:

```text
blur filters
backdrop-filter animation
box-shadow animation
```

Animate primarily:

```text
transform
opacity
clip-path
```

---

# 24. Accessibility

The journey must remain semantically understandable even without scrolling animations.

Use proper headings.

Do not rely only on the active color to communicate current step.

The six journey steps should remain available to assistive technology.

Decorative images should use appropriate alt behavior.

Meaningful images should use descriptive alt text.

Examples:

```text
Patient preparing medical information for remote surgical review

Video consultation with plastic surgeon

International patient preparing for medical travel to Vietnam

Plastic surgeon conducting an in-person clinical examination

Plastic surgery team inside a modern operating theatre

Patient receiving post-operative follow-up care
```

---

# 25. Do Not Implement

Do not add:

```text
generic card carousel

horizontal draggable slider

SaaS tabs

large rounded feature cards

glassmorphism

3D card rotation

heavy image blur

custom cursor interaction

auto-playing carousel

large bounce effects

tourism-focused imagery

spa imagery
```

This section should feel like a **medical journey**, not a product feature carousel.

---

# 26. Final Desired Experience

The scroll experience should approximately feel like:

```text
INTERNATIONAL PATIENT JOURNEY

From your first inquiry
to confident recovery.

            ↓

01 ━━━
SEND YOUR CASE
[remote clinical submission image]

            ↓

02 ━━━━━
VIDEO CONSULTATION
[direct surgeon consultation image]

            ↓

03 ━━━━━━━
TRAVEL PLANNING
[international medical travel image]

            ↓

04 ━━━━━━━━━
IN-PERSON EXAM
[clinical examination image]

            ↓

05 ━━━━━━━━━━━
YOUR PROCEDURE
[modern operating theatre image]

            ↓

06 ━━━━━━━━━━━━━
RECOVERY & FOLLOW-UP
[supervised recovery image]

            ↓

release pinned section
continue homepage
```

The user should understand the complete international surgical journey without needing to read six static cards simultaneously.

---

# 27. Final Design Principle

The purpose of this redesign is not simply to make the section more animated.

The animation should transform six pieces of information into a clear narrative:

```text
Inquiry
→
Direct Surgeon Contact
→
Travel Preparation
→
Clinical Examination
→
Hospital-Based Surgery
→
Safe Recovery
```

The user should leave the section understanding:

**“I know exactly what happens if I contact Dr. Maris from overseas.”**

The final result should feel like a premium guided medical journey, with the GSAP lateral indicator acting as the visual navigation system for that story.