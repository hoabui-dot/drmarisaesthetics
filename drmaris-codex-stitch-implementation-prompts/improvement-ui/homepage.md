# Dr. Maris Aesthetics Homepage V2 — Frontend Implementation Prompt

Implement a premium, GSAP-enhanced redesign of the **Dr. Maris Aesthetics homepage** in Next.js.

The goal is to evolve the current homepage from a long static medical landing page into a refined **premium medical editorial experience** with stronger visual hierarchy, better storytelling, richer imagery, and selective cinematic scroll interactions.

The final result must feel:

**Precise / Calm / Clinical / Premium / Editorial**

Do not turn the website into a creative-agency animation showcase. Motion must reinforce surgeon authority, medical safety, revision expertise, and the international patient journey.

---

## 1. Overall Homepage Structure

Refactor the homepage into this order:

```text
Header
↓
Cinematic Hero
↓
Signature Procedures
↓
The Maris Method
↓
Revision Surgery
↓
Patient Results
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

Remove duplicated storytelling sections.

Merge:

"Your Surgical Care Process"
+
"Your Case Is Personally Assessed by Dr. Maris"

into:

"The Maris Method"

Merge the two existing six-step international patient process sections into one definitive:

International Patient Journey
2. Visual Direction

Keep the existing brand DNA:

Primary Navy: #002D72
Clinical Blue: #4A90E2

Display:
Cormorant Garamond

UI / Body:
Plus Jakarta Sans

Introduce a warmer editorial neutral where appropriate:

#F5F3EE
#FAF9F6

Use:

large serif typography
asymmetric editorial grids
large-scale photography
generous negative space
thin hairline borders
oversized numeric typography
fewer cards
fewer shadows
more full-width visual moments

Avoid generic SaaS-style cards.

Avoid excessive rounded containers.

3. Image Strategy

Use real high-quality photography whenever possible.

Priority asset categories:

Dr. Maris editorial portraits
procedure photography
hospital / facility photography
consultation / patient journey photography
real consented before-and-after patient results
consultation environment

Do not repeatedly reuse the same Dr. Maris portrait.

Use full-cover background images only where they strengthen the narrative.

Recommended background-cover sections:

Revision Surgery
Hospital / CIH
selected International Journey states
Final Consultation CTA

Do not use background photography on every section.

4. GSAP Architecture

Use:

gsap
@gsap/react
ScrollTrigger
SplitText
Flip only where useful

Motion should be implemented per section.

Do not create one giant homepage timeline.

Suggested structure:

components/home/
  Hero.tsx
  SignatureProcedures.tsx
  MarisMethod.tsx
  RevisionSurgery.tsx
  PatientResults.tsx
  HospitalSection.tsx
  InternationalJourney.tsx
  FAQ.tsx
  ConsultationCTA.tsx

Use useGSAP() and scope all animations to each component.

All ScrollTriggers must be cleaned up when components unmount.

Do not update React state every scroll frame.

5. Header

Use one global sticky header.

When scrolling approximately 80–120px:

utility bar:
height 32px → 0
opacity 1 → 0

main navigation:
80px → approximately 68px

logo:
40px → approximately 34px

Keep the transition restrained.

Do not animate navigation aggressively.

6. Hero — Signature Motion Moment

Redesign the current hero to feel more editorial.

Target approximate desktop balance:

Text: 44–48%
Doctor visual: 52–56%

The doctor image should feel like the dominant visual evidence rather than a side illustration.

Suggested layout:

┌──────────────────────────────────────────────┐
│ Eyebrow                   Doctor portrait    │
│                                              │
│ Plastic Surgery                              │
│ in Vietnam for                               │
│ International Patients                       │
│                                              │
│ concise supporting copy                      │
│                                              │
│ [ Request Consultation ]                     │
│ Explore Procedures →                         │
│                                              │
├──────────────────────────────────────────────┤
│ Direct Surgeon Care / Hospital / Revision    │
└──────────────────────────────────────────────┘

Reduce long hero body copy if necessary.

Hero Load Animation

Animate in this order:

1. eyebrow divider
2. eyebrow text
3. H1 line-by-line
4. supporting body copy
5. primary CTA
6. secondary CTA
7. trust rail

Use SplitText or line wrappers for the H1.

yPercent: 100 → 0
stagger: 0.08–0.12
ease: power3.out

Doctor image:

clip-path:
inset(0 100% 0 0)
→
inset(0)

scale:
1.06–1.08 → 1

The image reveal should overlap with the heading animation.

Hero Scroll Exit

Use subtle depth only:

image:
scale 1 → 1.04–1.06
y 0 → 40–50px

text:
y 0 → -30px
opacity 1 → approximately 0.7

No aggressive parallax.

7. Signature Procedures — New Section

Add a highly visual procedure discovery section immediately after the hero.

Content direction:

SIGNATURE PROCEDURES

Designed around anatomy,
not trends.

Feature 4 major categories:

01 Rhinoplasty
02 Breast Surgery
03 Body Contouring
04 Revision Surgery

Use large image-led panels rather than small cards.

Possible desktop layout:

stacked editorial panels

or

large horizontal pinned cards

GSAP option:

ScrollTrigger
pin: true
scrub: approximately 0.8

Keep pinned duration approximately:

180–220vh

Each new panel should enter through:

translate
scale
clip reveal

Avoid flashy rotation.

8. The Maris Method

Merge the current surgeon care/process sections into one stronger chapter.

Title direction:

THE MARIS METHOD

Every case begins
with the surgeon,
not a procedure menu.

Suggested desktop layout:

Left:
large headline
supporting copy
5-step care timeline

Right:
large sticky Dr. Maris portrait

Timeline:

01 Consultation
02 Examination
03 Planning
04 Surgery
05 Follow-Up

Animate the timeline line using:

scaleX: 0 → 1
transform-origin: left

Activate each step sequentially.

Doctor image:

scale 0.96 → 1
rotate 2deg → 0

Use the existing quote as a large editorial quote instead of a small grey quote card.

Do not pin the entire section for too long.

The portrait may remain sticky while the content moves.

9. Revision Surgery — Major Signature Section

This should be the strongest visual chapter of the homepage.

Use a full-viewport dark environment.

Base:

#002D72

Add a high-quality medical / surgeon / procedure-related background image with a heavy navy overlay.

Example:

background image
+
navy overlay 65–85%
+
subtle gradient

Optionally add an oversized decorative word:

REVISION

at very low opacity:

0.04–0.07
Layout

Left side:

SPECIALIZED CARE

Revision
Cosmetic Surgery

supporting copy
revision assessment CTA

Right side:

Common Revision Concerns

Examples:

Capsular Contracture
Asymmetry Correction
Excessive Scar Tissue
Implant Malposition
Over-resected Rhinoplasty
Contour Irregularities
Functional Concerns
GSAP

Pin the section:

150–200vh

Use sequential active states for the right-side concerns.

Inactive:

opacity: 0.25–0.4

Active:

opacity: 1
x: 24–32px → 0

Heading should reveal line-by-line.

Do not rotate the entire section.

Do not use large 3D transforms.

10. Patient Results — New Section

Add a dedicated real-patient results chapter.

This is critical trust content.

Do not use a dense thumbnail grid.

Use large editorial case presentations.

Example:

REAL PATIENT RESULTS

Results are individual.
Planning is personal.

BEFORE                  AFTER
[ large image ]         [ large image ]

Revision Rhinoplasty
Case 024
12-month follow-up

Show approximately 2–4 featured cases.

Use real consented patient imagery only.

Animation

Use image-mask reveals:

clip-path:
inset(0 100% 0 0)
→
inset(0)

or a controlled before/after slider.

Do not morph the before image into the after image.

Do not use effects that make clinical imagery feel manipulated.

11. Hospital / CIH

The current hospital image is too visually small compared to how important this USP is.

Convert this into a full-bleed image chapter.

Use a City International Hospital / facility background cover.

Example gradient:

left:
rgba(0,45,114,0.92)

middle:
rgba(0,45,114,0.45)

right:
transparent

Place content on the dark side.

Headline:

Hospital-Based Surgery

Surgery Performed at
City International Hospital

Add 3–4 compact proof items such as:

24/7 medical infrastructure
professional nursing care
advanced surgical support
post-operative monitoring

Keep the legal disclaimer visible and readable.

Motion

Background image:

scale 1 → 1.05–1.06

Headline:

masked line reveal

Proof items:

staggered fade-up

Do not pin this section.

12. International Patient Journey

Remove the duplicated six-step international patient sections.

Use one definitive journey.

Steps:

01 Send Your Case
02 Video Consultation
03 Travel Planning
04 In-Person Examination
05 Your Procedure
06 Recovery & Follow-Up
Desktop Layout

Use a sticky storytelling composition.

Suggested structure:

Left:
large 01 / 02 / 03 / 04 / 05 / 06 timeline

Center / Right:
active step title
description
supporting image

Oversized numbers may use:

160–220px

Cormorant Garamond.

GSAP

Pin section approximately:

250–320vh

Use vertical progress:

scaleY: 0 → 1
transform-origin: top

Active step transition:

new:
y 20px → 0
opacity 0 → 1

old:
y 0 → -20px
opacity 1 → 0

If there are enough high-quality assets, switch the supporting image as each step becomes active.

Avoid horizontal scroll hijacking unless strongly justified.

13. FAQ

Replace the current two-column always-open FAQ layout.

Use:

Left:
sticky FAQ heading

Right:
accordion list

Example:

Frequently Asked
Questions About
Plastic Surgery
in Vietnam

                 Who performs my surgery?             +
                 ─────────────────────────────────────

                 Can I consult before travelling?     +
                 ─────────────────────────────────────

                 How long should I stay in Vietnam?   +

Only one answer needs to be open at a time.

Use CSS or Motion.

GSAP is not required here.

Keep accordion transitions fast and functional.

14. Final Consultation CTA

Move the final consultation CTA after the FAQ.

Narrative should become:

Understand
↓
Resolve objections
↓
Convert

Use a calm full-cover image such as:

consultation room
Dr. Maris consultation
hospital architecture
premium clinical interior

with a controlled navy gradient.

Headline direction:

Begin with a
clinical assessment.

Supporting copy:

Share your case directly with our surgical team
before making travel decisions.

Place the consultation form in a clean ivory/white panel.

Keep form motion minimal.

headline:
y 30px → 0
opacity 0 → 1

form:
scale 0.98 → 1
opacity 0 → 1

No parallax inside the form.

No pinned behavior.

15. Footer

Keep the footer simple and authoritative.

Use the global homepage information architecture.

Avoid decorative GSAP sequences.

Only use a subtle reveal if needed:

opacity 0 → 1
y 20px → 0
16. Animation Intensity

Only these sections should feel cinematic:

Hero
Signature Procedures
Revision Surgery
International Patient Journey

Medium motion:

The Maris Method
Patient Results
Hospital / CIH

Minimal motion:

FAQ
Final CTA
Footer

Avoid motion fatigue.

17. Performance Rules

Prioritize animation of:

transform
opacity

Use clip-path selectively.

Avoid continuous animation of:

width
height
top
left
filter
large blur
box-shadow

Do not run several heavy scrub timelines simultaneously.

Aim for approximately:

10–15 actively animated DOM layers

inside the viewport at one time.

Use optimized responsive images.

For Next.js:

next/image
correct sizes
AVIF/WebP where possible
lazy load below the fold
priority only for hero-critical assets
18. Mobile Motion Strategy

Do not copy desktop pinning directly to mobile.

Use responsive GSAP logic such as:

gsap.matchMedia()

Desktop:

stacked/pinned procedure section
pinned revision story
pinned international journey
image parallax

Mobile:

normal vertical procedure cards
normal Revision section
vertical international timeline
little or no parallax

Mobile must prioritize:

touch responsiveness
battery life
readability
stable browser behavior
19. Reduced Motion

Respect:

@media (prefers-reduced-motion: reduce)

Disable:

scrub
parallax
pinned storytelling
large masked transitions
non-essential transforms

Ensure all content remains visible and understandable without animation.

20. Motion Language

Preferred easing:

power2.out
power3.out
power3.inOut
expo.out

Avoid:

bounce
elastic
strong back overshoot

Motion should always feel controlled.

21. Do Not Implement

Do not add:

custom oversized cursor
constant mouse-follow effects
strong 3D card tilt
large whole-section rotations
scroll hijacking
heavy shader effects
blur-heavy transitions
random floating elements
animation on every paragraph
long delays before text becomes readable

The website must remain a premium medical platform, not an experimental portfolio.

22. Final Motion Storyboard

The intended experience should feel approximately like:

PAGE LOAD
│
├─ Header settles
├─ Hero headline reveals
└─ Dr. Maris portrait opens through a mask
      ↓
SIGNATURE PROCEDURES
large image panels progress through key procedures
      ↓
THE MARIS METHOD
care timeline draws from consultation to follow-up
      ↓
REVISION SURGERY
screen shifts into deep navy
revision concerns activate sequentially
      ↓
PATIENT RESULTS
large clinical results reveal through image wipes
      ↓
HOSPITAL / CIH
full-width facility imagery expands subtly
      ↓
INTERNATIONAL JOURNEY
01 → 02 → 03 → 04 → 05 → 06
      ↓
FAQ
quiet accordion interaction
      ↓
FINAL CONSULTATION
motion becomes minimal and conversion-focused
      ↓
FOOTER
23. Final Design Rule

Every animation must answer at least one of these:

Does it improve hierarchy?
Does it improve comprehension?
Does it reinforce trust?
Does it reinforce surgeon authority?
Does it create meaningful continuity?
Does it make the brand feel more premium without harming clarity?