# UI Implementation Prompt — Experienced Implant Specialists + Real Patient Results

## 1. Task Context

Continue implementing the reusable **Dental Implants service-detail page** immediately after the previous technology/procedure sections.

Implement the next **two sections visible in the supplied design reference**:

1. `Experienced Implant Specialists`
2. `Real Patient Results`

Use the screenshot as the primary source of truth for:

* desktop layout;
* proportions;
* spacing;
* card dimensions;
* typography hierarchy;
* borders/radius;
* image placement;
* blue/navy visual language.

Some text in the screenshot is too small to read reliably. For unclear content, use the approved seed content defined in this prompt.

Before coding, **search the existing codebase/assets/CMS first**, then research suitable licensed images/icons if matching assets do not already exist.

---

# 2. Section A — Experienced Implant Specialists

## Section Layout

Section title:

**Experienced Implant Specialists**

Desktop layout:

* One large rounded outer container.
* White background.
* Thin pale-blue border.
* Approximately `14–16px estimated` outer radius.
* Title aligned top-left.
* Directly below the title, render **4 equal doctor cards in one horizontal row**.
* Use approximately `30–36px estimated` gaps between cards.
* Cards should share the same width and height.
* Keep the section compact and visually consistent with previous service-detail sections.

Reference relationship:

`Doctor 1 | Doctor 2 | Doctor 3 | Doctor 4`

Do not turn this into a carousel at the supplied desktop viewport.

---

# 3. Doctor Card Anatomy

Each doctor card contains:

1. doctor portrait;
2. doctor name;
3. specialty;
4. two credential/experience rows;
5. `View Profile →` action.

### Visual requirements

* White card surface.
* Thin pale-blue border.
* Rounded corners approximately `12–14px estimated`.
* Portrait occupies approximately the upper `50–55%` of the card.
* Portrait background should remain white / very light cool blue.
* Doctors should wear professional white dental/medical coats.
* Crop each portrait consistently from approximately waist/chest upward.
* Doctor name uses bold navy text.
* Specialty uses smaller muted blue/navy text.
* Credential rows use small blue check icons.
* `View Profile →` uses Smilux blue.
* Keep all four cards visually aligned even when copy lengths differ.

Do not use emoji or decorative badges not shown in the reference.

---

# 4. Doctor Seed Content

Use these four doctor records for the initial implementation.

These are **seed/demo records unless actual clinic staff data already exists in the project**. If the project/CMS contains verified doctors, prefer real approved content rather than presenting fictional seed data as real staff.

---

## Doctor 1

**Name**

Dr. Ethan Santos

**Specialty**

Implantologist & Oral Surgeon

**Credential 1**

15+ Years Experience

**Credential 2**

Fellow, ICOI

**CTA**

View Profile →

### Portrait direction

* Male dentist.
* Approximately 35–45 years old.
* White dental coat.
* Blue scrub/shirt accent.
* Friendly professional smile.
* Front-facing or slight three-quarter angle.
* Bright white/light-blue studio background.

---

## Doctor 2

**Name**

Dr. Michelle Lim

**Specialty**

Prosthodontist

**Credential 1**

12+ Years Experience

**Credential 2**

Master in Prosthodontics

**CTA**

View Profile →

### Portrait direction

* Female dentist.
* Approximately 30–40 years old.
* White coat.
* Arms crossed or relaxed professional pose.
* Long dark hair.
* Friendly smile.
* Bright studio/clinic background.

---

## Doctor 3

**Name**

Dr. Nicholas Tan

**Specialty**

Periodontist

**Credential 1**

14+ Years Experience

**Credential 2**

Specialist in Gum Health

**CTA**

View Profile →

### Portrait direction

* Male dentist.
* Approximately 35–45 years old.
* Glasses acceptable and visually aligned with reference.
* White coat.
* Professional smile.
* Arms crossed.
* Bright white/light-blue background.

---

## Doctor 4

**Name**

Dr. Sophia Lee

**Specialty**

Oral & Implant Dentist

**Credential 1**

10+ Years Experience

**Credential 2**

Advanced Implantology

**CTA**

View Profile →

### Portrait direction

* Female dentist.
* Approximately 30–40 years old.
* Glasses acceptable.
* White coat with blue scrub/shirt accent.
* Professional smile.
* Bright studio/clinic background.

---

# 5. Doctor Image Research Requirements

Search the project first:

* `/public`
* `/assets`
* CMS media
* team/doctor pages
* existing clinic staff components
* Strapi media if available

Search terms:

* `doctor`
* `dentist`
* `implantologist`
* `specialist`
* `team`
* `staff`
* `oral surgeon`

If exact assets are unavailable, research high-quality licensed portraits with search concepts such as:

* `Asian dentist portrait white coat transparent background`
* `implant dentist professional portrait`
* `female dentist white coat studio portrait`
* `male oral surgeon white coat portrait`
* `Asian dental specialist portrait clinic`

### Asset selection requirements

All four portraits should feel like the same photographic set:

* similar background color;
* similar crop;
* similar lighting;
* similar scale;
* similar camera angle;
* professional clinical appearance.

Avoid mixing:

* studio portraits with lifestyle photography;
* transparent renders with busy clinic backgrounds;
* noticeably different image color temperatures;
* low-resolution or watermarked images.

If real clinic staff portraits exist, use those instead.

---

# 6. Doctor Card Interaction

The screenshot visually suggests `View Profile →` as an action.

Implementation behavior:

* Use a semantic link if doctor profile routes already exist.
* If doctor routes do not exist, keep the destination configurable.
* Do not invent modal behavior.
* Do not make the whole doctor card clickable unless the existing project pattern already does this.
* Do not invent certification details beyond configured data.

---

# 7. Section B — Real Patient Results

Section title:

**Real Patient Results**

This section must be implemented as **one synchronized patient-results slider**, not as disconnected static cards.

The slider has two main regions:

`Before/After comparison | Patient testimonial`

Desktop approximate ratio:

* left comparison region: `~52–55%`
* right testimonial region: `~38–42%`
* remaining width used for internal gap/navigation controls.

---

# 8. Slider Behavior

Seed exactly **4 patient result records**.

Only **one patient is active at a time**.

For each active patient:

* left side displays that patient's corresponding before/after images;
* right side displays that patient's testimonial information;
* previous/next controls change the entire active patient;
* image comparison and testimonial content must remain synchronized.

Required interaction:

* `Previous` button.
* `Next` button.
* Loop behavior is acceptable:

  * previous from patient 1 → patient 4;
  * next from patient 4 → patient 1.
* Changing patient updates:

  * before image;
  * after image;
  * patient portrait;
  * star rating;
  * testimonial;
  * patient name;
  * treatment label.

Do not autoplay unless a separate requirement is later provided.

Do not create 4 visible testimonial cards simultaneously.

---

# 9. Before / After Comparison

The left side is an **interactive before/after image comparison slider**.

### Required visual structure

* One rounded image frame.
* Before and after photos occupy exactly the same frame.
* `Before` label at the upper-left.
* `After` label at the upper-right.
* A vertical comparison divider.
* Circular drag handle centered on the divider.
* Dragging horizontally reveals more/less of the before/after image.

Reference default divider position:

approximately `50%`.

### Required behavior

Support:

* mouse drag;
* touch drag;
* pointer events;
* keyboard-accessible adjustment if practical within the existing component architecture.

The handle must stay constrained within the image bounds.

Do not implement before and after as two permanently separate side-by-side images.

The reference specifically requires an interactive comparison treatment.

---

# 10. Before / After Image Requirements

For each seeded patient, use a **matched before/after pair representing the same mouth/treatment scenario**.

Both images in each pair must have:

* identical or near-identical crop;
* similar angle;
* similar lighting;
* same approximate mouth position;
* same image dimensions.

Preferred image content:

* close-up smile/mouth;
* implant/restorative dentistry result;
* realistic dental photography;
* no excessive face area;
* no unrelated cosmetic procedures.

Search existing assets first.

Possible research queries:

* `dental implant before after smile`
* `implant dentistry before after teeth`
* `missing tooth implant before after`
* `full arch implant before after`
* `dental restoration before after smile`
* `implant supported bridge before after`

Do not use watermarked images.

Do not use before and after images from different patients as a fake pair.

If true matched clinical pairs cannot be sourced with appropriate rights, use clearly designated demo imagery during development rather than presenting fabricated imagery as genuine patient outcomes.

---

# 11. Patient Testimonial Card

The right side should contain **only one testimonial card for the active patient**.

Do not render two testimonial cards side-by-side as shown in the visual reference.

Use the screenshot's visual language but adapt it to the requested single synchronized slider architecture.

### Card anatomy

1. Patient portrait.
2. Five gold/yellow stars.
3. Testimonial.
4. Patient name.
5. Treatment label.
6. Previous/next slider controls.

### Visual requirements

* White surface.
* Pale-blue border.
* Rounded corners approximately `14–16px estimated`.
* Patient portrait on left or upper-left.
* Testimonial content occupies remaining area.
* Five stars near the top.
* Testimonial uses muted navy/slate body text.
* Patient name uses bold navy.
* Treatment label uses smaller muted text.
* Navigation controls should be visible but compact.
* Use circular outlined or filled blue arrow buttons consistent with the Smilux design system.

---

# 12. Slider Navigation Controls

Add explicit:

* left arrow button;
* right arrow button.

Recommended placement:

* vertically centered at the left/right edges of the testimonial area;

or

* aligned together near the bottom-right of the testimonial card if that better matches existing project slider controls.

Use the project's existing carousel/slider button style where available.

Buttons must:

* be semantic buttons;
* have accessible labels;
* remain keyboard accessible;
* have visible focus states.

Accessible labels:

* `Previous patient result`
* `Next patient result`

Do not rely only on arrow icons for accessible naming.

---

# 13. Patient Seed Data

The following content is **demo seed data**. Do not present it as verified real-patient testimony in production unless product/clinical teams replace it with approved patient data and consented imagery.

---

## Patient 1 — Maria T.

**Patient Name**

Maria T.

**Treatment**

Full-Arch Implant Patient

**Rating**

5 / 5

**Testimonial**

I had struggled with missing teeth for years and was nervous about treatment. The team explained every step clearly, and my new smile feels secure, natural, and comfortable. I can finally eat and smile with confidence again.

### Before image concept

* Multiple missing or severely compromised anterior teeth.
* Close-up frontal smile.

### After image concept

* Restored full-looking smile.
* Natural white teeth.
* Same frontal crop.

### Patient portrait concept

* Female adult.
* Approximately 40–55.
* Friendly professional/lifestyle portrait.
* Bright neutral background.

---

## Patient 2 — Robert K.

**Patient Name**

Robert K.

**Treatment**

Single Tooth Implant Patient

**Rating**

5 / 5

**Testimonial**

The entire process was professional and comfortable. My missing tooth was restored with an implant that looks and feels completely natural. I am extremely happy with the result.

### Before image concept

* One clearly missing visible tooth.
* Prefer anterior/premolar region.

### After image concept

* Natural-looking single implant crown.
* Same angle and crop.

### Patient portrait concept

* Male adult.
* Approximately 45–60.
* Friendly smile.
* Neutral clinical/lifestyle background.

---

## Patient 3 — Daniel P.

**Patient Name**

Daniel P.

**Treatment**

Implant-Supported Bridge Patient

**Rating**

5 / 5

**Testimonial**

I wanted a fixed solution instead of continuing with a removable option. The implant-supported bridge feels stable, comfortable, and much closer to having my natural teeth again.

### Before image concept

* Multiple adjacent missing teeth.

### After image concept

* Implant-supported bridge restoration.
* Matching orientation.

### Patient portrait concept

* Male adult.
* Approximately 40–55.
* Warm smile.
* Light background.

---

## Patient 4 — Linda S.

**Patient Name**

Linda S.

**Treatment**

Multiple Dental Implants Patient

**Rating**

5 / 5

**Testimonial**

From the first consultation through the final restoration, I felt well cared for. The implants have improved my chewing comfort and given me much more confidence in my smile.

### Before image concept

* Several compromised/missing teeth.

### After image concept

* Multiple restored implant crowns.
* Natural appearance.

### Patient portrait concept

* Female adult.
* Approximately 45–60.
* Bright friendly smile.
* Neutral/light background.

---

# 14. Important Content Safety / Production Rule

The 4 patient records above exist to seed the UI and verify slider behavior.

Treat them as:

`DEMO / PLACEHOLDER PATIENT DATA`

until approved production content is supplied.

Before production launch, replace seed records with:

* consented patient images;
* authentic matched before/after images;
* approved testimonial text;
* approved patient display names/initials;
* accurate treatment labels;
* legally approved outcome claims.

Do not imply that generated/demo portraits or stock before/after photography represent genuine Smilux patients.

---

# 15. Patient Asset Data Model

Each patient result should conceptually support:

* `id`
* `name`
* `treatment`
* `rating`
* `testimonial`
* `portrait`
* `beforeImage`
* `afterImage`
* `beforeAlt`
* `afterAlt`

The slider must derive all active content from **one patient object**.

Do not maintain separate arrays for:

* testimonials;
* portraits;
* before images;
* after images.

That can cause content synchronization bugs.

Use one data structure per patient.

---

# 16. Suggested Reusable Architecture

Recommended conceptual components:

### Specialists

* `ImplantSpecialistsSection`
* `DoctorGrid`
* `DoctorCard`

### Results

* `PatientResultsSection`
* `PatientResultsSlider`
* `BeforeAfterComparison`
* `PatientTestimonialCard`
* `SliderNavigation`

Do not create four manually duplicated patient-result components.

---

# 17. Before/After Slider State

The patient-results component needs two independent pieces of UI state:

### Active Patient

Represents which of the four patients is currently displayed.

Example conceptual value:

`activePatientIndex`

### Comparison Position

Represents how much of the Before/After image is visible.

Default:

`50%`

When the patient changes:

* keep the comparison position at `50%`, or
* reset it to `50%`.

Resetting to the center is preferred for predictable UX.

Do not accidentally use the comparison slider position to control the patient carousel.

They are separate interactions.

---

# 18. Image Research Workflow

Before implementation:

## Doctors

Search existing codebase/CMS for real staff portraits.

If unavailable, research visually consistent placeholder portraits.

## Patients

Search existing approved patient assets first.

If unavailable, research appropriate demo visuals for development.

## Before/After

Prioritize actual matched comparison sets.

Each pair must visually correspond to the same case.

### Search locations

* `/public`
* `/assets`
* CMS media
* Strapi uploads
* existing gallery/results pages
* doctor/team pages
* dental case study content

### External research terms

Doctors:

* `professional dentist portrait white coat`
* `Asian implant dentist portrait`
* `oral surgeon professional portrait`

Patients:

* `dental implant before after clinical`
* `single tooth implant before after`
* `multiple implants before after`
* `implant bridge before after`
* `full arch implant before after`

### File requirements

Prefer:

* WebP / optimized JPG for photography;
* SVG for icons;
* locally hosted project assets.

Do not use remote hot-linked images in final implementation.

---

# 19. Responsive Behavior

Only desktop is evidenced by the supplied screenshot.

## Desktop — Required

### Specialists

* Four cards remain in one horizontal row.
* Equal card dimensions.
* Equal portrait heights.
* No horizontal carousel.

### Patient Results

* Before/after comparison on the left.
* One testimonial card on the right.
* Both regions remain on the same row.
* Navigation controls remain visible.
* Entire results module remains within one outer container.

---

## Tablet — Inferred

Preferred:

### Specialists

`2 columns × 2 rows`

### Results

Either:

* comparison above testimonial;

or

* reduced two-column layout if sufficient width remains.

Do not compromise before/after usability merely to keep desktop structure.

---

## Mobile — Inferred

### Specialists

Use one card per row or an approved project carousel pattern.

### Results

Stack:

1. before/after comparison;
2. testimonial card;
3. navigation controls.

The before/after drag handle must remain touch-friendly.

---

# 20. Accessibility

## Doctor cards

* Doctor portrait requires meaningful alt text when using actual approved staff.
* `View Profile` must have an accessible name identifying the doctor if multiple identical labels exist.
* Credential check icons should be decorative.

Example accessible intent:

`View profile for Dr. Ethan Santos`

## Before/after comparison

The comparison cannot rely solely on visual labels.

Requirements:

* descriptive alt text for before and after images;
* visible `Before` and `After` labels;
* drag handle should expose meaningful accessibility behavior if implemented as an interactive control;
* pointer/touch target must be sufficiently large.

## Testimonials

* Stars require a text equivalent such as `5 out of 5`.
* Slider navigation controls need accessible labels.
* Patient portrait alt should be empty if decorative or appropriately descriptive if approved.
* Slide changes should not unexpectedly move keyboard focus.

---

# 21. Visual Acceptance Criteria — Specialists

The implementation is complete only when:

* [ ] `Experienced Implant Specialists` matches reference placement and hierarchy.
* [ ] Section uses one rounded bordered outer container.
* [ ] Exactly 4 doctor cards display in one desktop row.
* [ ] Cards have equal width and height.
* [ ] Portrait crops and image scale are visually consistent.
* [ ] Doctor names use bold navy text.
* [ ] Specialty text hierarchy matches the design.
* [ ] Two credential rows appear per doctor.
* [ ] Blue check icons align consistently.
* [ ] `View Profile →` appears at the bottom of every card.
* [ ] Cards do not overflow despite different copy lengths.
* [ ] No unrequested badges, social links, ratings, or booking buttons are added.

---

# 22. Visual Acceptance Criteria — Real Patient Results

The implementation is complete only when:

* [ ] `Real Patient Results` matches reference placement and typography.
* [ ] Results are implemented as one synchronized 4-patient slider.
* [ ] Only one active patient's information appears at a time.
* [ ] Left side contains one interactive before/after comparison.
* [ ] Before/after images belong to the active patient.
* [ ] `Before` and `After` labels are visible.
* [ ] Vertical comparison divider matches the reference.
* [ ] Circular drag handle is centered on the divider.
* [ ] Comparison can move horizontally.
* [ ] Right side contains only one testimonial card.
* [ ] Testimonial portrait corresponds to the same active patient.
* [ ] Exactly five stars appear for each seeded patient.
* [ ] Name and treatment label update when patient changes.
* [ ] Previous and next buttons are visible.
* [ ] Previous/next changes the entire patient record.
* [ ] Comparison position resets to approximately 50% when changing patients.
* [ ] The four patient records can be changed from data without rewriting the component.
* [ ] No autoplay is added.
* [ ] No two unrelated testimonial cards are displayed simultaneously.
* [ ] No mismatched before/after images are used as a pair.
* [ ] Final production content can replace demo patient data without changing component structure.

---

# 23. Important Implementation Constraints

## Specialists

Do not:

* hard-code the cards directly into layout markup;
* use four unrelated portrait styles;
* invent real medical credentials for actual named clinic doctors;
* add profile destinations that do not exist.

If actual staff records exist, use approved clinic data.

## Patient Results

Do not:

* render four independent results simultaneously;
* build separate unsynchronized image and testimonial carousels;
* use two different patients for a before/after pair;
* claim demo content represents real Smilux patients;
* autoplay;
* introduce pagination thumbnails not present in the requirement;
* use a generic gallery instead of the requested before/after comparison;
* remove the drag handle;
* render multiple testimonial cards at once.

The intended architecture is:

`Patient Result Slider`
→ `Active Patient`
→ `Before/After Comparison + One Matching Testimonial`

with exactly **4 seeded patient records** for initial implementation.
