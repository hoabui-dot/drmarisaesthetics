# Dr. Maris Aesthetics — Premium CTA Section & Booking Modal Frontend Redesign Prompt

## Objective

Redesign the homepage **Final CTA section** and the **booking / consultation modal** so they fully match the current Dr. Maris Aesthetics premium medical theme.

The current CTA direction is visually strong, but the booking modal still uses an outdated promotional / dental-style design language.

The redesigned experience must feel:

**Clinical / Premium / Private / Trustworthy / Editorial / Surgeon-Led**

The conversion experience must feel like the beginning of a **private medical consultation**, not a promotional lead-generation popup.

---

# 1. Core Design Principle

The user should feel:

> “I am beginning a private clinical assessment with a surgical team.”

Never:

> “I am claiming a discount or filling out a marketing promotion form.”

Remove all legacy promotional concepts such as:

- Exclusive Offer
- Limited Time Offer
- 30% Off
- Special Pricing
- New Patient Promotion
- Dental Treatment
- Brighten Your Smile
- discount badges
- promotional SaaS-style cards

Do not reuse the old dental modal structure without redesigning it.

---

# 2. Final CTA Section — Current Direction

Keep the existing core headline concept:

**BEGIN YOUR JOURNEY**

**Your case deserves a surgical plan built around you.**

This messaging strongly supports the current positioning around individualized surgical planning.

However, improve the right-side action area.

The current small floating `SEND YOUR CASE` button and vertical utility circles feel detached from the composition and too weak compared with the headline.

Replace them with a stronger **Private Consultation Action Panel**.

---

# 3. Final CTA Section — Recommended Layout

Use a cinematic full-width clinical background image.

Recommended image types:

- Dr. Maris consultation
- premium surgical consultation room
- hospital interior
- clinical surgical environment
- surgeon-led consultation scene

Do not use generic beauty imagery.

Suggested desktop composition:

```text
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│ BEGIN YOUR JOURNEY                                            │
│                                                               │
│ Your case deserves a surgical          PRIVATE CONSULTATION   │
│ plan built around you.                 ─────────────────────   │
│                                                               │
│ Send your case for a preliminary       Submit your case for   │
│ clinical review and begin a direct     an initial clinical    │
│ conversation with Dr. Maris.           review before travel.  │
│                                                               │
│ [ START YOUR CONSULTATION → ]          01 Share your case     │
│ Continue via WhatsApp →                02 Preliminary review  │
│                                        03 Speak with Dr Maris │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

# 4. CTA Background Treatment

Avoid a flat navy overlay.

Use a layered gradient so the clinical environment remains visible.

Example direction:

```css
background:
linear-gradient(
  90deg,
  rgba(0, 35, 88, 0.97) 0%,
  rgba(0, 45, 114, 0.88) 45%,
  rgba(0, 45, 114, 0.62) 75%,
  rgba(0, 45, 114, 0.48) 100%
);
```

The content area must retain strong readability.

Optional scroll motion:

```text
background image:
scale 1.04 → 1
```

Keep it extremely subtle.

---

# 5. CTA Typography

Use the existing brand typography.

```text
Display:
Cormorant Garamond

Body / UI:
Plus Jakarta Sans
```

Recommended hierarchy:

```text
Eyebrow:
12–14px
uppercase
1.5–2px tracking

Headline:
64–84px desktop
Cormorant Garamond

Body:
16–18px

Action panel heading:
28–34px
Cormorant Garamond
```

---

# 6. CTA Primary Actions

Replace ambiguous labels such as:

```text
SEND YOUR CASE
```

as the only main CTA.

Preferred primary action:

**START YOUR CONSULTATION**

Alternative:

**BEGIN YOUR CLINICAL ASSESSMENT**

Secondary action:

**CONTINUE VIA WHATSAPP**

Use WhatsApp as a secondary communication method, not as an equal competing primary CTA.

---

# 7. CTA Reassurance Content

Add short reassurance content near the primary action.

Examples:

```text
Direct surgeon-led assessment
Preliminary review before travel
Hospital-based surgical care
International patient support
```

Alternatively, use a simple 3-step summary:

```text
01  Share your case
02  Receive a preliminary review
03  Arrange your consultation
```

Keep this content visually quiet.

---

# 8. CTA GSAP Motion

Do not pin this section.

Animate only on viewport entry.

Suggested sequence:

```text
eyebrow:
opacity 0 → 1
y 12px → 0

headline:
masked line reveal
yPercent 100 → 0

supporting text:
opacity 0 → 1
y 20px → 0

consultation panel:
opacity 0 → 1
x 40px → 0
```

Suggested easing:

```text
power3.out
```

The background may use very subtle scroll-linked scale.

Do not use:

- large rotation
- heavy parallax
- blur transitions
- 3D tilt
- scroll pinning

This is a conversion section and should feel stable.

---

# 9. Remove Ambiguous Floating Utility Buttons

Remove unclear circles such as:

```text
P
W
↑
```

Do not use letter-only floating controls.

If a floating WhatsApp control is required, use:

- recognizable WhatsApp icon
- optional label on desktop
- reduced prominence compared with the primary CTA

The back-to-top button may remain separately if needed.

---

# 10. Booking Modal — Complete Redesign

Do not simply reskin the old modal.

Redesign the modal around a **private surgical consultation workflow**.

The modal should visually and semantically belong to the current Dr. Maris homepage.

Use the same:

```text
#002D72
#4A90E2
#FAF9F6
#F5F3EE
Cormorant Garamond
Plus Jakarta Sans
```

---

# 11. Modal Design Concept

Preferred desktop structure:

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  LEFT VISUAL                    RIGHT CONSULTATION FLOW      │
│                                                             │
│  Real Dr. Maris /               PRIVATE CONSULTATION         │
│  consultation /                 Tell us about your case.    │
│  hospital image                                             │
│                                 Step 01 of 03                │
│  DIRECT SURGEON CARE                                        │
│                                 Form fields                  │
│  Your case is reviewed                                      │
│  before you travel.             [ CONTINUE → ]              │
│                                                             │
│  Hospital-Based Surgery                                     │
│  Ho Chi Minh City                                           │
│  International Support                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 12. Modal Left Panel

Use real brand photography.

Preferred order:

1. Dr. Maris editorial portrait
2. doctor-patient consultation
3. premium CIH / hospital environment

Do not use generic dental imagery.

Apply a restrained navy gradient overlay.

Suggested copy:

**DIRECT SURGEON CARE**

**Your case is reviewed before you travel.**

Supporting proof:

```text
Hospital-Based Surgery
Ho Chi Minh City, Vietnam
International Patient Support
```

Keep this panel editorial and visually calm.

---

# 13. Modal Right Panel

Use:

**PRIVATE CONSULTATION**

Main heading:

**Tell us about your case.**

Supporting copy:

> Share a few details so our team can understand your concerns and determine the appropriate next step.

Do not use promotional messaging.

---

# 14. Modal Flow — Use a 3-Step Intake

Do not place the entire surgical intake form inside one long scrolling modal.

Use a 3-step consultation flow.

---

## Step 01 — Your Details

Title:

**YOUR DETAILS**

Fields:

```text
Full Name
Email Address
WhatsApp / Phone
Country of Residence
```

Primary action:

**CONTINUE**

---

## Step 02 — Your Case

Title:

**YOUR CASE**

Ask:

```text
What are you considering?

○ Primary Cosmetic Surgery
○ Revision Surgery
○ Not Sure Yet
```

Then:

```text
Area / Procedure
Brief Case Description
```

If `Revision Surgery` is selected, progressively reveal:

```text
Previous Procedure
Date of Previous Surgery
Country / Clinic of Previous Surgery
Primary Concern
```

Do not show revision-specific fields unnecessarily.

---

## Step 03 — Supporting Information

Title:

**SUPPORTING INFORMATION**

Allow optional uploads:

```text
Clinical photographs
Previous operative reports
Implant information
Relevant medical documents
```

Use a clean upload component:

```text
Upload files
or
Drag files here
```

Supporting privacy copy:

> Files are used only to support your preliminary clinical review.

Do not make every upload mandatory.

---

# 15. Final Submission

Primary final action:

**SUBMIT CASE FOR REVIEW**

Do not use:

```text
BOOK NOW
BUY NOW
CLAIM OFFER
```

because the patient is not booking surgery at this stage.

After successful submission, show a dedicated confirmation state.

Example:

**Your case has been received.**

> Our team will review the information you provided and contact you regarding the appropriate next step.

Secondary action:

**CONTINUE ON WHATSAPP**

---

# 16. Modal Progress Indicator

Avoid SaaS-style percentage progress bars.

Use a refined clinical progress indicator.

Option A:

```text
01 / 03
YOUR DETAILS
```

Option B:

```text
01 ───── 02 ───── 03
```

Keep the line thin and understated.

---

# 17. Modal Dimensions

Recommended desktop size:

```text
width:
960–1080px

max-height:
85–88vh
```

Suggested split:

```text
left visual:
40–44%

right form:
56–60%
```

Avoid showing a scrollbar immediately when the modal opens.

The multi-step flow should naturally reduce vertical height.

---

# 18. Modal Surface Styling

Recommended modal radius:

```text
16px
```

Input radius:

```text
8px
```

Avoid overly rounded SaaS styling.

Use subtle borders:

```text
#E2E8F0
or
#E4E7EC
```

Use restrained shadow:

```css
box-shadow:
0 24px 80px rgba(0,0,0,0.16);
```

Avoid multiple nested shadows.

---

# 19. Modal Backdrop

Use a dark medical-blue backdrop.

Suggested:

```css
background:
rgba(0, 26, 65, 0.55);

backdrop-filter:
blur(8px);
```

The underlying homepage should still be perceptible.

Do not blur the page excessively.

---

# 20. Modal Opening Animation

Keep the opening motion refined and short.

Backdrop:

```text
opacity:
0 → 1

duration:
approximately 0.25s
```

Modal:

```text
opacity:
0 → 1

scale:
0.975 → 1

y:
16px → 0

duration:
approximately 0.4–0.5s

ease:
power3.out
```

Left image:

```text
scale:
1.04–1.05 → 1
```

Do not animate the modal dramatically.

---

# 21. Step Transition Animation

When moving between modal steps:

Old step:

```text
x 0 → -20px
opacity 1 → 0
```

New step:

```text
x 20px → 0
opacity 0 → 1
```

Recommended duration:

```text
300–400ms
```

GSAP or Motion may be used.

Do not over-engineer step transitions.

---

# 22. CTA Trigger Mapping

All consultation-related CTA buttons across the website should open the same shared booking modal.

Examples:

```text
START YOUR CONSULTATION
ONLINE CONSULTATION
REQUEST A CONSULTATION
SEND YOUR CASE
BEGIN YOUR JOURNEY
REQUEST A REVISION ASSESSMENT
```

The same modal should receive context from the trigger.

Example:

If the user clicks:

**REQUEST A REVISION ASSESSMENT**

pre-fill:

```text
Consultation Type:
Revision Surgery
```

If the user clicks from the International Patient section:

pre-fill:

```text
Patient Type:
International
```

If the user clicks from a procedure page:

pre-fill:

```text
Procedure:
Current Procedure
```

Build the modal as one reusable conversion system.

Do not maintain different booking modals for different pages.

---

# 23. Recommended Shared API

The modal trigger should support context similar to:

```ts
openConsultationModal({
  source: "revision-section",
  consultationType: "revision",
  procedure: "revision-rhinoplasty"
})
```

The exact implementation may follow the project's current state-management architecture.

Do not hardcode page-specific modal implementations.

---

# 24. Mobile Modal

Do not preserve the desktop split layout on small screens.

Mobile should use:

```text
full-screen or near-full-screen modal
```

Recommended order:

```text
Header
Progress
Title
Form
Primary CTA
```

Hide or significantly reduce the left visual panel.

Do not allow the visual image to consume half the mobile viewport.

Keep form controls large enough for touch interaction.

---

# 25. Accessibility

The modal must support:

```text
keyboard navigation
focus trapping
ESC to close
visible focus states
correct form labels
ARIA modal semantics
screen-reader friendly validation
```

Focus should move to the modal when opened.

When closed, focus should return to the CTA that opened it.

Support:

```css
prefers-reduced-motion
```

Disable non-essential entrance movement when reduced motion is requested.

---

# 26. Form UX

Provide clear states for:

```text
default
focus
validation error
uploading
upload success
submitting
submission success
submission failure
```

Do not show errors only using color.

Use clear error copy under the relevant field.

Avoid validating fields before the user interacts with them.

---

# 27. Performance

GSAP should only control visual animation.

Do not use React state for every animation frame.

Prioritize:

```text
transform
opacity
```

Use background image scaling carefully.

Do not animate:

```text
large blur
width continuously
height continuously
box-shadow continuously
```

Optimize CTA background and modal imagery using Next.js image handling where applicable.

---

# 28. Conversion Tone

The overall conversion experience should communicate:

```text
Private
Clinical
Direct
Personal
Safe
Internationally Accessible
```

Do not communicate:

```text
Urgency
Discount
Sale
Promotion
Limited Availability
Cheap Pricing
```

This is premium surgical care, not a promotional med-spa funnel.

---

# 29. Final CTA → Modal User Journey

The intended experience should be:

```text
FINAL CTA

Your case deserves a surgical plan built around you.

        ↓

START YOUR CONSULTATION

        ↓

PRIVATE CONSULTATION MODAL

        ↓

01
YOUR DETAILS

        ↓

02
YOUR CASE

        ↓

03
SUPPORTING INFORMATION

        ↓

SUBMIT CASE FOR REVIEW

        ↓

CASE RECEIVED

        ↓

OPTIONAL WHATSAPP CONTINUATION
```

---

# 30. Final Design Rule

Treat the CTA section and booking modal as one continuous premium consultation experience.

The CTA should create confidence.

The modal should preserve that confidence.

There must be no visual or semantic break between the homepage and the booking experience.

The final system should feel like:

**a private medical intake experience built around surgeon-led care**

not:

**a generic promotional popup attached to a premium website.**