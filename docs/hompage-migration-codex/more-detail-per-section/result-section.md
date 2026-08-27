# UI Implementation Spec — Homepage Smile Transformations / Results Section

## 1. Identity

| Field                       | Value                                                                                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | `/`                                                                                                                                                                                       |
| Section ID                  | `home-results`                                                                                                                                                                            |
| Section name                | `Homepage Smile Transformations / Results`                                                                                                                                                |
| Position in page            | **Immediately after `home-doctors`**                                                                                                                                                      |
| Screenshot scope            | Complete desktop smile-transformation/result section shown in supplied screenshot                                                                                                         |
| Section type                | Result-story carousel containing interactive Before/After comparison                                                                                                                      |
| Current visible slide       | `01/04`                                                                                                                                                                                   |
| Primary implementation goal | Reproduce the result-story composition, interactive Before/After comparison, patient/result media, and slide navigation while keeping each transformation as one atomic Strapi CMS record |
| Overall evidence quality    | High for desktop layout and main interaction model; Medium for exact carousel behavior/timing; Low for responsive layout                                                                  |

> **Critical section-order rule:** According to the latest requirement, this section is placed **directly after `home-doctors`**.

> **Critical interaction rule:** The large center dental result visual is an **interactive Before / After comparison slider**, not one static image with a decorative vertical line.

> **Critical CMS rule:** One transformation/result story must keep all of its related data together:
>
> * story title,
> * description,
> * treatment steps,
> * before image,
> * after image,
> * patient/result portrait,
> * testimonial/caption.
>
> These fields belong to **one Result Story record**.

---

# 2. Scope Boundary

## Included in this spec

* OBSERVED — Section eyebrow:

  * `SMILE TRANSFORMATIONS`
* OBSERVED — Main heading:

  * `Real Stories. Real Smiles.`
* OBSERVED — Introductory section text.
* OBSERVED — Result/story title:

  * `Christina’s Smile. Transformed`
* OBSERVED — Story description.
* OBSERVED — `What We Did` treatment list.
* OBSERVED — Large center Before/After dental comparison.
* OBSERVED — Labels:

  * `Before`
  * `After`
* OBSERVED — Vertical comparison divider.
* OBSERVED — Circular draggable-looking comparison handle.
* OBSERVED — Large patient/result portrait on the right.
* OBSERVED — Result quote/caption below portrait.
* OBSERVED — Top-right previous/next controls.
* OBSERVED — Slide indicator:

  * `01/04`
* INFERRED — Section represents a result-story carousel with four records based on `01/04`.
* INFERRED — Previous/next controls switch complete result stories.
* INFERRED — Comparison handle should allow horizontal drag/touch.
* INFERRED — Each result slide should replace all related left/center/right content together.

## Excluded from this spec

* UNKNOWN — Carousel autoplay.
* UNKNOWN — Carousel animation duration.
* UNKNOWN — Swipe gesture between result stories.
* UNKNOWN — Whether carousel loops from 04 → 01.
* UNKNOWN — keyboard shortcuts for previous/next.
* UNKNOWN — exact starting position of comparison divider.
* UNKNOWN — whether the patient quote comes from the actual patient or marketing copy.
* UNKNOWN — tablet layout.
* UNKNOWN — mobile layout.
* UNKNOWN — number of transformation stories beyond the four indicated by the screenshot.
* UNKNOWN — route/detail page for individual results.

---

# 3. Evidence and Confidence

| Item                                 | Status   | Evidence / reason                                           |
| ------------------------------------ | -------- | ----------------------------------------------------------- |
| Desktop three-region layout          | OBSERVED | Left story text, center comparison, right portrait          |
| Before/After comparison              | OBSERVED | Labels, divider and central handle clearly visible          |
| Comparison draggable behavior        | INFERRED | Visual language strongly matches comparison slider controls |
| Slide navigation                     | OBSERVED | Previous arrow, `01/04`, next arrow                         |
| Four result slides                   | INFERRED | Pagination displays `01/04`                                 |
| Carousel content changes as one unit | INFERRED | Result story composition appears slide-specific             |
| Typography exact values              | INFERRED | Hierarchy visible, exact tokens unavailable                 |
| Colors                               | INFERRED | Navy/blue/white palette visible                             |
| CMS record structure                 | INFERRED | Strong semantic relationship between story and all media    |
| Responsive behavior                  | UNKNOWN  | Only desktop supplied                                       |
| Autoplay                             | UNKNOWN  | Static screenshot provides no timing evidence               |

---

# 4. OCR Content Inventory

## 4.1 Section-level copy

| Element ID        | Visible text                                                                                                                       | Type            | OCR confidence |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------- |
| `results-eyebrow` | `SMILE TRANSFORMATIONS`                                                                                                            | Eyebrow         | High           |
| `results-heading` | `Real Stories. Real Smiles.`                                                                                                       | H2              | High           |
| `results-intro`   | `Nothing speaks louder than the smiles of those we've experienced with, Here are some inspiring smile makeovers and real stories.` | Intro paragraph | Medium         |

> `[OCR UNCERTAIN]` — The introductory copy appears grammatically unusual in the raster reference. Preserve the source CMS/Figma copy rather than silently correcting it.

---

## 4.2 Result Story 01

### Story title

`Christina’s Smile. Transformed`

Confidence: High.

### Story description

Visible approximate text:

`Christine wanted a brighter, balanced, natural, smile aesthetic smile. We crafted a treatment plan tailored to her goals -- enhancing her teeth' white and giving her a confident...`

Confidence: Low/Medium due to raster quality.

> `[OCR UNCERTAIN]` — Exact story description must be sourced from Figma/Strapi before production.

---

## 4.3 Treatment list

Heading:

`What We Did`

Visible entries:

1. `Smile design planning with digital preview`
2. `Professional teeth whitening`
3. `Placement of composite veneers`

Confidence: High.

---

## 4.4 Comparison labels

| Element                | Text     | Confidence |
| ---------------------- | -------- | ---------- |
| Left comparison label  | `Before` | High       |
| Right comparison label | `After`  | High       |

---

## 4.5 Result quote/caption

Visible text approximates:

`“Christine’s smile, before and after – confident, complete, and truly hers.”`

Confidence: Medium.

Exact punctuation/copy must be verified from source design/CMS.

---

## 4.6 Pagination

| Element                 | Text    | Confidence |
| ----------------------- | ------- | ---------- |
| Current/total indicator | `01/04` | High       |

---

# 5. Layout Anatomy

## 5.1 Global geometry

| Property              | Specification                                             | Status   |
| --------------------- | --------------------------------------------------------- | -------- |
| Section width         | Full viewport with centered container                     | OBSERVED |
| Background            | White / near-white                                        | OBSERVED |
| Header region         | Left title/content + right navigation control             | OBSERVED |
| Main content          | Three major horizontal regions                            | OBSERVED |
| Left story column     | Approximately `26–29%`                                    | INFERRED |
| Center comparison     | Approximately `34–37%`                                    | INFERRED |
| Right result portrait | Approximately `30–32%`                                    | INFERRED |
| Main column gap       | Medium                                                    | OBSERVED |
| Vertical alignment    | Main columns start on approximately common upper baseline | OBSERVED |
| Overflow              | None visible                                              | OBSERVED |

---

# 5.2 Structure tree

```text
Section: home-results
├── SectionHeader
│   ├── HeadingGroup
│   │   ├── Eyebrow
│   │   ├── H2
│   │   └── Intro
│   │
│   └── ResultNavigation
│       ├── PreviousButton
│       ├── CurrentIndex / TotalCount
│       └── NextButton
│
└── ResultStory
    ├── StoryContent
    │   ├── StoryTitle
    │   ├── StoryDescription
    │   └── TreatmentList
    │       ├── TreatmentItem
    │       ├── TreatmentItem
    │       └── TreatmentItem
    │
    ├── BeforeAfterComparison
    │   ├── BeforeImage
    │   ├── AfterImage
    │   ├── BeforeLabel
    │   ├── AfterLabel
    │   ├── Divider
    │   └── ComparisonHandle
    │
    └── ResultPatientMedia
        ├── PatientPortrait
        └── Testimonial / Caption
```

---

# 5.3 Overall desktop topology

```text
SMILE TRANSFORMATIONS
Real Stories. Real Smiles.                         [ ← ] 01/04 [ → ]
Intro text...

┌───────────────────┬───────────────────────────┬──────────────────────┐
│                   │                           │                      │
│ Story title       │       Before │ After      │   Patient Portrait   │
│                   │              │            │                      │
│ Description       │              ◉            │                      │
│                   │              │            │                      │
│ What We Did       │     BEFORE / AFTER        │                      │
│ • Treatment       │       COMPARISON          │                      │
│ • Treatment       │                           │                      │
│ • Treatment       │                           │ Caption / quote      │
│                   │                           │                      │
└───────────────────┴───────────────────────────┴──────────────────────┘
```

---

# 5.4 Section header

## Left side

```text
SMILE TRANSFORMATIONS

Real Stories. Real Smiles.

Introductory paragraph...
```

### Rules

* Eyebrow uppercase.
* Eyebrow blue.
* H2 dark navy.
* H2 visually dominant.
* Intro is smaller muted navy.
* Intro width is significantly narrower than full section width.

---

## Right side

Navigation control:

```text
┌────────────────────────────┐
│   ←      01/04       →     │
└────────────────────────────┘
```

### Observed characteristics

* Outer rounded pill/container.
* Previous and next controls each appear inside circular outlines.
* Index text sits between them.
* All controls use blue accent.
* Navigation aligns toward section top-right.

---

# 6. Result Story Content

## 6.1 Story title

Desktop line behavior:

```text
Christina’s Smile.
Transformed
```

* Large relative to body text.
* Dark navy.
* Left aligned.
* Two visual lines in supplied screenshot.

Exact wrapping may depend on final container width.

---

# 6.2 Description

* Left aligned.
* Multi-line.
* Smaller than story title.
* Muted dark-blue/navy.
* Width constrained to story column.

---

# 6.3 `What We Did`

Hierarchy:

```text
What We Did

• Smile design planning with digital preview
• Professional teeth whitening
• Placement of composite veneers
```

### Rules

* Subheading uses strong weight.
* List markers are bright blue.
* Treatment text is dark/muted navy.
* Compact but readable vertical spacing.

---

# 7. Before / After Comparison

## 7.1 Critical implementation model

The comparison must use **two independent source images**:

```text
BeforeAfterComparison
├── beforeImage
└── afterImage
```

Do not upload a single screenshot containing both sides and fake a divider.

The comparison component must reveal one image over the other according to a horizontal comparison position.

---

# 7.2 Visual topology

```text
                 Before                    After
┌──────────────────────────┬──────────────────────────┐
│                          │                          │
│      BEFORE IMAGE        │        AFTER IMAGE       │
│                          │                          │
│                          │                          │
│                          ●                          │
│                          │                          │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
                           ↑
                      Drag handle
```

---

# 7.3 Comparison container

| Property     | Specification                        | Status              |
| ------------ | ------------------------------------ | ------------------- |
| Orientation  | Landscape                            | OBSERVED            |
| Width        | Full center-column width             | OBSERVED            |
| Radius       | Moderate rounded corners             | OBSERVED            |
| Overflow     | Hidden                               | REQUIRED            |
| Before image | Left/reveal layer                    | OBSERVED / INFERRED |
| After image  | Right/base or reveal layer           | OBSERVED / INFERRED |
| Divider      | Thin white/light vertical line       | OBSERVED            |
| Handle       | Circular white/light control         | OBSERVED            |
| Labels       | Positioned near respective top edges | OBSERVED            |

---

# 7.4 Comparison handle

Observed concept:

```text
   ← →
  ┌───┐
  │ ‹ ›
  └───┘
```

### Requirements

* Circular.
* White/light surface.
* Centered on divider.
* Contains bidirectional horizontal movement icon.
* Must remain above image layers.
* Must remain visually readable over varying dental imagery.

---

# 7.5 Desktop interaction

Recommended based on visible UI:

* pointer drag horizontally,
* clicking/tapping comparison track may reposition handle,
* handle should remain constrained between left and right comparison edges.

Interaction range:

```text
0% <= comparisonPosition <= 100%
```

Do not allow handle to escape the image area.

---

# 7.6 Touch behavior

INFERRED — Mobile/touch must support horizontal drag.

The comparison drag gesture must not unintentionally trigger:

* carousel slide change,
* browser horizontal page movement.

If story-carousel swipe is implemented later, gesture ownership between:

* comparison drag,
* carousel swipe

must be carefully separated.

---

# 7.7 Image alignment requirement

Before and After source images must represent the **same crop, scale and viewpoint** as closely as possible.

Otherwise the comparison divider becomes visually misleading.

Frontend should enforce same display geometry:

```text
beforeImage dimensions
=
afterImage dimensions
=
comparison container dimensions
```

Do not independently size the two image layers.

---

# 8. Right Patient / Result Media

## 8.1 Patient portrait

* Landscape image.
* Rounded corners.
* Shows smiling patient.
* Light-blue background.
* Fills right-column media width.
* Uses controlled crop.

---

## 8.2 Caption

Displayed directly below patient portrait.

Reference:

```text
“Christine’s smile, before and after – confident,
complete, and truly hers.”
```

* Left aligned.
* Muted navy/blue.
* Smaller than main story copy.
* No separate card background visible.

---

# 9. Carousel / Slide Navigation

## 9.1 Evidence

The control reads:

```text
←    01/04    →
```

This strongly supports multiple result stories.

INFERRED:

```text
totalResults = 4
currentResult = 1
```

---

# 9.2 Story atomicity

Changing result slide must change the complete story as one synchronized unit.

For example:

```text
Result Story 01
├── title
├── description
├── treatments
├── before image
├── after image
├── portrait
└── quote
```

Next click:

```text
Result Story 02
├── title 02
├── description 02
├── treatments 02
├── before image 02
├── after image 02
├── portrait 02
└── quote 02
```

Incorrect:

* story text changes while old comparison image remains,
* patient portrait changes independently,
* pagination advances before media updates.

All content must remain synchronized.

---

# 9.3 Navigation behavior

### Previous

```text
currentIndex - 1
```

### Next

```text
currentIndex + 1
```

Exact boundary behavior remains UNKNOWN:

* disable previous on slide 1,
* loop 1 ← 4,
* disable next on slide 4,
* loop 4 → 1.

Do not choose looping behavior without confirmation.

---

# 9.4 Pagination formatting

Observed:

```text
01/04
```

Not:

```text
1 / 4
```

For current screenshot fidelity, preserve two-digit formatting:

```text
01/04
02/04
03/04
04/04
```

---

# 10. Visual Specification

## 10.1 Colors

| Token candidate                   | Usage               | Description        | Status   |
| --------------------------------- | ------------------- | ------------------ | -------- |
| `color/result/background`         | Section background  | White / near-white | OBSERVED |
| `color/result/heading`            | H2                  | Deep navy          | OBSERVED |
| `color/result/eyebrow`            | Eyebrow             | Blue               | OBSERVED |
| `color/result/story-title`        | Story heading       | Navy               | OBSERVED |
| `color/result/body`               | Description         | Muted navy         | OBSERVED |
| `color/result/accent`             | Bullets/arrows      | Bright blue        | OBSERVED |
| `color/result/comparison-divider` | Comparison line     | White/light        | OBSERVED |
| `color/result/comparison-handle`  | Drag handle surface | White              | OBSERVED |
| `color/result/nav-border`         | Carousel control    | Pale blue          | OBSERVED |

---

# 10.2 Typography

| Element        | Weight              | Approx. size         | Status   |
| -------------- | ------------------- | -------------------- | -------- |
| Eyebrow        | `600–700 estimated` | `12–14 px estimated` | INFERRED |
| Section H2     | `700 estimated`     | `34–38 px estimated` | INFERRED |
| Section intro  | `400–500 estimated` | `12–14 px estimated` | INFERRED |
| Story heading  | `600–700 estimated` | `22–26 px estimated` | INFERRED |
| Story body     | `400–500 estimated` | `12–14 px estimated` | INFERRED |
| `What We Did`  | `600–700 estimated` | `14–16 px estimated` | INFERRED |
| Treatment item | `400–500 estimated` | `11–13 px estimated` | INFERRED |
| Quote          | `400–500 estimated` | `12–14 px estimated` | INFERRED |
| Slide index    | `500–600 estimated` | `13–15 px estimated` | INFERRED |

---

# 11. Asset Manifest

| Asset ID                 | Description                       | Format       |                             CMS? | Status   |
| ------------------------ | --------------------------------- | ------------ | -------------------------------: | -------- |
| `result-01-before`       | Christina before dental image     | WebP/JPG/PNG |                              Yes | OBSERVED |
| `result-01-after`        | Christina after dental image      | WebP/JPG/PNG |                              Yes | OBSERVED |
| `result-01-patient`      | Christina/result patient portrait | WebP/JPG/PNG |                              Yes | OBSERVED |
| `carousel-arrow-left`    | Previous icon                     | SVG          | No if shared design-system asset | OBSERVED |
| `carousel-arrow-right`   | Next icon                         | SVG          | No if shared design-system asset | OBSERVED |
| `comparison-handle-icon` | Bidirectional horizontal icon     | SVG          |             No if frontend asset | OBSERVED |

### Important

The three result media assets are separate:

```text
beforeImage
afterImage
patientImage
```

Do not combine them.

---

# 12. Component Contract

| Component            | Responsibility                      | Reusable?   | Status              |
| -------------------- | ----------------------------------- | ----------- | ------------------- |
| `HomeResultsSection` | Section orchestration               | No          | INFERRED            |
| `ResultsHeader`      | Eyebrow, heading, intro, pagination | Potentially | INFERRED            |
| `ResultCarousel`     | Current story/navigation state      | Yes         | INFERRED            |
| `ResultStoryContent` | Title, description, treatments      | Yes         | INFERRED            |
| `BeforeAfterSlider`  | Comparison interaction              | Yes         | OBSERVED / INFERRED |
| `ResultPatientMedia` | Portrait + quote                    | Yes         | INFERRED            |
| `CarouselNavigation` | Prev/index/next                     | Yes         | OBSERVED            |

---

# 13. Strapi CMS Contract

## 13.1 Recommended model

```text
Homepage
└── Results Section
    ├── eyebrow
    ├── heading
    ├── intro
    └── results[]
        ├── title
        ├── description
        ├── treatments[]
        ├── beforeImage
        ├── beforeImageAlt
        ├── afterImage
        ├── afterImageAlt
        ├── patientImage
        ├── patientImageAlt
        └── testimonial
```

---

# 13.2 Result Story component

Recommended Strapi component:

```text
result-story
```

Fields:

| Field             | Type                            |    Required | Notes                       |
| ----------------- | ------------------------------- | ----------: | --------------------------- |
| `title`           | Short text                      |         Yes | Story title                 |
| `description`     | Long text                       |         Yes | Transformation description  |
| `treatments`      | Repeatable short-text component |         Yes | `What We Did`               |
| `beforeImage`     | Media                           |         Yes | Comparison left/source      |
| `afterImage`      | Media                           |         Yes | Comparison right/source     |
| `beforeImageAlt`  | Short text                      | Recommended | Accessibility               |
| `afterImageAlt`   | Short text                      | Recommended | Accessibility               |
| `patientImage`    | Media                           |         Yes | Right result portrait       |
| `patientImageAlt` | Short text                      | Recommended | Accessibility               |
| `testimonial`     | Long text                       |         Yes | Quote/caption               |
| `sortOrder`       | Integer                         |    Optional | If CMS ordering unavailable |

---

# 13.3 Do not split Result Story into separate arrays

Incorrect:

```text
stories[]
beforeImages[]
afterImages[]
patientImages[]
testimonials[]
```

This creates synchronization risk.

Correct:

```text
results[]
├── story
├── before
├── after
├── patient
└── quote
```

One transformation = one atomic CMS record.

---

# 13.4 Result count

Screenshot provides:

```text
01/04
```

Therefore current design/source appears to contain four transformations.

However, a hard Strapi minimum/maximum was **not supplied by the user** for this section.

Do not automatically enforce exactly four CMS records unless Product confirms this requirement.

Pagination should preferably derive from actual CMS data:

```text
current / results.length
```

while preserving zero-padded formatting.

---

# 14. CMS vs Frontend Responsibility

| Responsibility           | Strapi | Frontend |
| ------------------------ | :----: | :------: |
| Story title              |    ✅   |          |
| Description              |    ✅   |          |
| Treatment steps          |    ✅   |          |
| Before image             |    ✅   |          |
| After image              |    ✅   |          |
| Patient portrait         |    ✅   |          |
| Testimonial              |    ✅   |          |
| Story order              |    ✅   |          |
| Alt text                 |    ✅   |          |
| Comparison position      |        |     ✅    |
| Comparison drag behavior |        |     ✅    |
| Divider/handle           |        |     ✅    |
| Carousel navigation      |        |     ✅    |
| Current index            |        |     ✅    |
| Pagination formatting    |        |     ✅    |
| Layout/columns           |        |     ✅    |
| Animation                |        |     ✅    |
| Responsive layout        |        |     ✅    |

---

# 15. Interaction Specification

## 15.1 Before/After slider

Required/strongly inferred interaction:

```text
Pointer/touch drag
        ↓
Update comparison position
        ↓
Reveal more Before or After image
```

### Required properties

* Smooth tracking.
* Horizontal only.
* Constrained to comparison container.
* Handle remains visible.
* Divider follows handle.
* No layout shift.

---

## 15.2 Carousel navigation

```text
Previous button
        ↓
show previous Result Story

Next button
        ↓
show next Result Story
```

### During slide transition

All result-specific content should switch together.

Recommended transition target:

```text
StoryContent
+ BeforeAfterComparison
+ PatientMedia
```

Do not transition those three independently with significantly different timings.

---

## 15.3 Autoplay

UNKNOWN.

Do not introduce automatic story rotation until confirmed.

The Before/After comparison itself already requires user interaction; autoplaying the whole result carousel could interfere with a user dragging the comparison.

Therefore default implementation should remain **manual navigation only** unless otherwise specified.

---

# 15.4 Keyboard accessibility

Carousel:

* previous and next controls must be focusable.
* Enter/Space triggers control.
* focus indicator required.

Comparison:

The drag handle should have an accessible keyboard mechanism if implemented as an interactive slider.

Recommended semantics correspond to a horizontal range/slider pattern.

Keyboard interaction should allow incremental left/right adjustment.

---

# 16. Responsive Specification

## 16.1 Evidence

| Viewport     | Evidence |
| ------------ | -------- |
| Full desktop | High     |
| Tablet       | UNKNOWN  |
| Mobile       | UNKNOWN  |

---

## 16.2 Desktop behavior

Required:

* header spans full container.
* navigation stays top-right.
* main content remains:

  * story left,
  * comparison center,
  * patient media right.
* center comparison remains the dominant interactive visual.
* right patient image remains clearly separate from Before/After images.

---

## 16.3 Responsive data model

Do not create separate:

```text
desktopResults
mobileResults
```

Use same result records.

Frontend changes layout only.

---

## 16.4 Likely mobile challenge

Three desktop regions cannot remain side-by-side at narrow widths.

A potential mobile arrangement could be:

```text
Story text
↓
Before / After comparison
↓
Patient portrait
↓
Quote
```

This is structurally logical but remains `INFERRED`.

Do not treat this as final mobile design without approval.

---

## 16.5 Comparison on mobile

If stacking is approved:

* Before/After component should remain full usable width.
* touch drag remains enabled.
* comparison gesture must not block normal vertical page scrolling when user is not actively dragging horizontally.

---

# 17. Semantic HTML and Accessibility

## Recommended hierarchy

```text
Section
├── H2: Real Stories. Real Smiles.
├── Result article
│   ├── Story heading
│   ├── Description
│   ├── Treatment list
│   ├── Before/After comparison
│   ├── Patient image
│   └── Testimonial
└── Carousel navigation
```

### Treatment list

Use semantic list markup.

### Patient quote

If content is truly testimonial quotation, use appropriate quote semantics.

### Before/After

Do not rely solely on visible `Before` / `After` text embedded in images.

Labels should exist in the UI layer.

### Images

Before and After images need meaningful context.

Examples:

* `Christina's teeth before treatment`
* `Christina's teeth after treatment`

Patient image:

* meaningful patient/result portrait alt where appropriate.

---

# 18. Implementation Constraints

## Section

* Position after `home-doctors`.
* White background.
* Preserve three-region desktop composition.
* Keep carousel navigation in header's right region.

## CMS

* One result story = one CMS record.
* Before/After images must be independent fields.
* Patient portrait must be separate from comparison images.
* Treatment list must remain editable text.
* Do not hard-code the `04` total if CMS count may change.
* Use actual result count for pagination unless Product fixes it at four.

## Comparison

* Do not flatten Before/After into one bitmap.
* Handle must move horizontally.
* Divider follows handle.
* Clip both images to shared outer radius.
* Both media layers must use identical geometry.
* Avoid image distortion.
* Comparison state should reset to its defined initial position when changing to another result slide unless design specifies preserved per-slide state.

## Carousel

* Do not autoplay without approval.
* Do not mix result-story fields from different records.
* Previous/next controls must update content atomically.
* Do not expose unsupported pagination dots.
* Do not add swipe-to-change-story until confirmed.

---

# 19. Visual Acceptance Criteria

## Section header

* [ ] `SMILE TRANSFORMATIONS` appears at upper-left.
* [ ] `Real Stories. Real Smiles.` appears below.
* [ ] Intro copy is present.
* [ ] Previous/index/next control appears at upper-right.
* [ ] Index uses `01/04` style formatting.

## Story content

* [ ] Story title is visible at left.
* [ ] Story description appears below.
* [ ] `What We Did` subheading appears.
* [ ] Three screenshot-confirmed treatment items appear for Story 01.
* [ ] Blue bullet styling matches reference.

## Before/After

* [ ] Large center image area exists.
* [ ] Before and After are separate media assets.
* [ ] `Before` label appears on left.
* [ ] `After` label appears on right.
* [ ] Vertical divider is visible.
* [ ] Circular drag handle is centered on divider.
* [ ] Handle supports horizontal interaction.
* [ ] Images remain perfectly overlaid/aligned.
* [ ] Outer image radius matches screenshot.
* [ ] Dragging does not shift page layout.

## Right media

* [ ] Patient/result portrait appears.
* [ ] Portrait has rounded corners.
* [ ] Quote/caption appears directly underneath.
* [ ] Portrait does not replace the After image; it is a separate third media field.

## Carousel

* [ ] Previous button works when applicable.
* [ ] Next button works when applicable.
* [ ] Current slide index updates.
* [ ] Total reflects actual configured result count or approved fixed count.
* [ ] Story text, Before/After images and patient media change together.
* [ ] No automatic slide rotation is introduced without approval.

---

# 20. Visual Risks

| Risk                                          | Why it affects fidelity/functionality  | Mitigation                              | Priority |
| --------------------------------------------- | -------------------------------------- | --------------------------------------- | -------- |
| Before/After uploaded as one combined image   | Comparison cannot actually work        | Separate before/after fields            | High     |
| Independent CMS arrays                        | Wrong story can pair with wrong photos | Atomic result-story component           | High     |
| Using static divider                          | Loses central interaction              | Build real comparison slider            | High     |
| Different before/after crops                  | Slider produces visual jump            | Enforce identical display geometry      | High     |
| Hard-coding `01/04`                           | Breaks if CMS count changes            | Derive pagination from data             | High     |
| Autoplaying carousel                          | Can interrupt comparison interaction   | Keep manual unless approved             | High     |
| Carousel swipe conflicts with comparison drag | Touch interaction becomes unreliable   | Separate gesture ownership              | High     |
| Portrait confused with After image            | Incorrect data architecture            | Keep patient image separate             | High     |
| Content changes asynchronously                | Mixed result story displayed           | Change current record atomically        | High     |
| Long treatment lists                          | Alters desktop composition             | Define content limits / adaptive layout | Medium   |
| Text corrected from blurry OCR                | Could differ from approved copy        | Use source Strapi/Figma text            | Medium   |
| Mobile comparison too small                   | Interaction difficult                  | Give comparison full mobile width       | High     |

---

# 21. Open Questions

| ID  | Question                                                                                          | Blocking level                         | Suggested owner     |
| --- | ------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------- |
| Q1  | Is the result section fixed at exactly four stories, or should `04` derive from CMS result count? | Important CMS decision                 | Product             |
| Q2  | Should previous/next navigation loop continuously?                                                | Blocking for navigation edge behavior  | Designer / Product  |
| Q3  | Does this result carousel autoplay?                                                               | Non-blocking; default should be manual | Designer            |
| Q4  | What is the exact initial Before/After divider position?                                          | Non-blocking for prototype             | Designer            |
| Q5  | Should clicking anywhere on comparison reposition the divider, or drag handle only?               | Interaction decision                   | Designer            |
| Q6  | Should the result carousel support touch swipe separately from comparison drag?                   | Important mobile interaction decision  | Designer            |
| Q7  | What is the exact Story 01 description copy?                                                      | Blocking for content fidelity          | Product / Designer  |
| Q8  | What is the exact testimonial copy?                                                               | Blocking for content fidelity          | Product / Designer  |
| Q9  | Are patient/result stories reusable on another Results page?                                      | Architecture decision                  | Product / Developer |
| Q10 | Is there a dedicated Result/Smile Transformation detail page?                                     | Non-blocking                           | Product             |
| Q11 | What is the tablet layout?                                                                        | Blocking for tablet                    | Designer            |
| Q12 | What is the mobile layout?                                                                        | Blocking for mobile                    | Designer            |

---

# Strapi Handoff Summary

## Recommended hierarchy

```text
Homepage
└── Results Section
    ├── eyebrow
    ├── heading
    ├── intro
    │
    └── results[]
        ├── title
        ├── description
        ├── treatments[]
        │
        ├── beforeImage
        ├── beforeImageAlt
        │
        ├── afterImage
        ├── afterImageAlt
        │
        ├── patientImage
        ├── patientImageAlt
        │
        └── testimonial
```

---

# Critical Result Bundle Contract

One entry:

```text
ResultStory
│
├── CONTENT
│   ├── Story title
│   ├── Description
│   └── What We Did[]
│
├── COMPARISON
│   ├── Before image
│   └── After image
│
└── RESULT MEDIA
    ├── Patient/result portrait
    └── Testimonial
```

Everything moves together when carousel index changes.

---

# Before / After Handoff

```text
              INTERACTIVE COMPARISON

 Before                                      After
┌────────────────────────────────────────────────────┐
│                                                    │
│ BEFORE IMAGE               │        AFTER IMAGE    │
│                            │                       │
│                            ●                       │
│                            │                       │
│                            │                       │
└────────────────────────────────────────────────────┘
                             ↔
                             drag
```

Mandatory:

1. Two source images.
2. Shared geometry.
3. One movable vertical divider.
4. One draggable handle.
5. Desktop mouse interaction.
6. Touch interaction.
7. Keyboard-accessible equivalent.
8. No fake static divider.

---

# Carousel Handoff

```text
RESULT STORY 01                                  [ ← ] 01/04 [ → ]

[ Story ]     [ Before ↔ After ]     [ Patient + Quote ]
```

Press Next:

```text
RESULT STORY 02                                  [ ← ] 02/04 [ → ]

[ Story 02 ]  [ Before ↔ After 02 ]  [ Patient 02 + Quote ]
```

The three regions must always display the **same Result Story record**.

---

# CMS vs Frontend Responsibility

| Responsibility         | Strapi | Frontend |
| ---------------------- | :----: | :------: |
| Result title           |    ✅   |          |
| Result description     |    ✅   |          |
| Treatment list         |    ✅   |          |
| Before image           |    ✅   |          |
| After image            |    ✅   |          |
| Patient image          |    ✅   |          |
| Testimonial            |    ✅   |          |
| Result ordering        |    ✅   |          |
| Image alt text         |    ✅   |          |
| Carousel current index |        |     ✅    |
| Prev/next logic        |        |     ✅    |
| Pagination formatting  |        |     ✅    |
| Before/After drag      |        |     ✅    |
| Divider position       |        |     ✅    |
| Comparison handle      |        |     ✅    |
| Three-column layout    |        |     ✅    |
| Responsive behavior    |        |     ✅    |

---

# Mandatory Coding-Agent Rules

1. `home-results` is placed **immediately after `home-doctors`**.
2. Treat each smile transformation as one atomic Strapi record.
3. Story content, Before/After images, patient portrait and quote must stay synchronized.
4. Before and After must be **two separate media assets**.
5. Build an actual interactive Before/After comparison slider.
6. Keep patient portrait as a separate third media asset.
7. Render Previous / `01/04` / Next controls in the top-right section header.
8. Derive total slides from CMS unless Product explicitly fixes total results at four.
9. Do not autoplay the result carousel without explicit approval.
10. Do not let carousel swipe conflict with the Before/After drag gesture.
11. Preserve zero-padded pagination style such as `01/04`.
12. CMS controls content/media/order; frontend controls interaction/layout.
