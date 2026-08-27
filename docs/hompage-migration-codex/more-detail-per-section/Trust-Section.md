# UI Implementation Spec — Homepage About / Trust Section

## 1. Identity

| Field                       | Value                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | `/`                                                                                                                                   |
| Section ID                  | `home-about`                                                                                                                          |
| Section name                | `Homepage About / Trust Section`                                                                                                      |
| Position in page            | Immediately after `home-hero`                                                                                                         |
| Screenshot scope            | Full desktop section visible in supplied screenshot                                                                                   |
| Target viewport             | `1116 × 533 px` screenshot raster                                                                                                     |
| Primary implementation goal | Reproduce the supplied desktop screenshot with maximum visual fidelity while keeping the content structure compatible with Strapi CMS |
| Overall evidence quality    | High for desktop layout and card composition; Medium for exact typography/colors; Low for responsive behavior                         |

> **Critical CMS/layout rule:** The right-side composition is **not** a generic image gallery or masonry list. It is a fixed editorial mosaic with named layout slots. In particular, the lower-left block is **one composite card** with a `50/50` horizontal split: image on the left, statistic/content on the right.

---

## 2. Scope Boundary

### Included in this spec

* OBSERVED — About-section eyebrow.
* OBSERVED — Two-line heading.
* OBSERVED — Introductory paragraph.
* OBSERVED — Four feature/benefit rows with circular check icons.
* OBSERVED — `LEARN MORE ABOUT US` CTA.
* OBSERVED — Right-side editorial card mosaic.
* OBSERVED — Large team image in the upper-left mosaic slot.
* OBSERVED — `15+ / Years of Experience` statistic card in the upper-right slot.
* OBSERVED — Technology/diagnostic image in the middle-right slot.
* OBSERVED — Lower-right patient/team photo.
* OBSERVED — Lower-left composite `50/50` card containing:

  * left image,
  * right `10,000+ / Happy Patients` statistic.
* OBSERVED — Rounded corners applied independently to cards/images.
* INFERRED — Right-side mosaic should use explicit named slots rather than CMS-driven free ordering.

### Excluded from this spec

* UNKNOWN — Exact link destination of `LEARN MORE ABOUT US`.
* UNKNOWN — Hover effects.
* UNKNOWN — Animation/reveal effects.
* UNKNOWN — Tablet/mobile layout.
* UNKNOWN — Whether statistics are dynamic.
* UNKNOWN — Whether images are managed through a global Media library or section-local Strapi fields.
* UNKNOWN — Whether the cards are intended to be reusable elsewhere.
* UNKNOWN — API fetching implementation.

### Section start and end

* Start: OBSERVED — White section starts immediately below the homepage hero.
* End: OBSERVED — Ends beneath the lower row of the right-side mosaic and CTA.
* Cropped/partially visible content: None clearly visible.

---

## 3. Evidence and Confidence

| Item                    | Status   | Evidence / reason                                                      |
| ----------------------- | -------- | ---------------------------------------------------------------------- |
| Section boundary        | OBSERVED | Entire section is visible within screenshot.                           |
| Desktop layout          | OBSERVED | Left text column and right mosaic are clearly distinguishable.         |
| Text content            | OBSERVED | Main heading, paragraph, benefits, CTA and statistics are readable.    |
| Typography exact values | INFERRED | Relative hierarchy is clear; exact font tokens are unavailable.        |
| Colors                  | INFERRED | Navy/blue/white visual system clearly visible; exact values unknown.   |
| Mosaic structure        | OBSERVED | Cards occupy specific non-uniform slots.                               |
| Bottom-left split card  | OBSERVED | One large rectangular block visually split into image and stat halves. |
| CMS structure           | INFERRED | Named slot model is recommended to preserve screenshot layout.         |
| Interaction states      | UNKNOWN  | Only static/default state visible.                                     |
| Responsive behavior     | UNKNOWN  | No tablet/mobile screenshot supplied.                                  |

---

## 4. OCR Content Inventory

| Element ID             | Visible text                                                                                                                                                                                          | Text type         | OCR confidence | Notes                              |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------- | ---------------------------------- |
| `about-eyebrow`        | `ABOUT SMILUX DENTAL`                                                                                                                                                                                 | Eyebrow           | High           | Uppercase blue text                |
| `about-heading-line-1` | `Trusted Care.`                                                                                                                                                                                       | Heading           | High           | Dark navy                          |
| `about-heading-line-2` | `Lasting Smiles.`                                                                                                                                                                                     | Heading           | High           | Dark navy                          |
| `about-body`           | `At Smilux Dental, we are committed to providing world-class dental care in a comfortable and friendly environment. Every smile we create is built on trust, innovation, and personalized attention.` | Paragraph         | High           | Multi-line paragraph               |
| `benefit-01`           | `Experienced & Certified Dental Experts`                                                                                                                                                              | Feature           | High           | Circular check icon                |
| `benefit-02`           | `State-of-the-Art Technology & Equipment`                                                                                                                                                             | Feature           | High           | Circular check icon                |
| `benefit-03`           | `Painless & Patient-Friendly Procedures`                                                                                                                                                              | Feature           | High           | Circular check icon                |
| `benefit-04`           | `Personalized Treatment Plans`                                                                                                                                                                        | Feature           | High           | Circular check icon                |
| `about-cta`            | `LEARN MORE ABOUT US`                                                                                                                                                                                 | CTA               | High           | Arrow icon at right                |
| `experience-value`     | `15+`                                                                                                                                                                                                 | Statistic         | High           | Upper-right card                   |
| `experience-label`     | `Years of Experience`                                                                                                                                                                                 | Statistic label   | High           | Two-line label                     |
| `patient-value`        | `10,000+`                                                                                                                                                                                             | Statistic         | High           | Inside lower-left composite card   |
| `patient-label`        | `Happy Patients`                                                                                                                                                                                      | Statistic label   | High           | Two-line label                     |
| `team-image-logo`      | `Smilux`                                                                                                                                                                                              | Text inside image | High           | Appears to be part of source image |

---

## 5. Layout Anatomy

### 5.1 Global geometry

| Property                | Specification                                  | Status   |
| ----------------------- | ---------------------------------------------- | -------- |
| Section width           | Full viewport width                            | OBSERVED |
| Screenshot width        | `1116 px`                                      | OBSERVED |
| Screenshot height       | `533 px`                                       | OBSERVED |
| Section background      | White / near-white                             | OBSERVED |
| Content container       | Centered desktop container                     | INFERRED |
| Approximate left gutter | `44–46 px estimated`                           | INFERRED |
| Main layout model       | Two major columns: content left + mosaic right | OBSERVED |
| Left content width      | Approximately `34–37%` of usable container     | INFERRED |
| Right mosaic width      | Approximately `58–61%` of usable container     | INFERRED |
| Inter-column gap        | Approximately `45–55 px estimated`             | INFERRED |
| Vertical alignment      | Both main columns begin near same top baseline | OBSERVED |
| Section overflow        | None visible                                   | OBSERVED |

### 5.2 Structure tree

```text
Section: home-about
├── Content column
│   ├── Eyebrow
│   ├── H2
│   │   ├── Trusted Care.
│   │   └── Lasting Smiles.
│   ├── Decorative short line
│   ├── Body paragraph
│   ├── Benefits list
│   │   ├── Check + benefit 01
│   │   ├── Check + benefit 02
│   │   ├── Check + benefit 03
│   │   └── Check + benefit 04
│   └── Learn More CTA
│
└── Media mosaic
    ├── Left mosaic column
    │   ├── Primary team image card
    │   └── Patient-count composite card
    │       ├── Left half: clinic image
    │       └── Right half: statistic
    │           ├── 10,000+
    │           └── Happy Patients
    │
    └── Right mosaic column
        ├── Experience statistic card
        │   ├── 15+
        │   └── Years of Experience
        ├── Technology image card
        └── Patient/team image card
```

---

### 5.3 Main section proportions

| Region              | Approximate width | Content                 |
| ------------------- | ----------------: | ----------------------- |
| Left content column |  `~36% container` | Text, feature list, CTA |
| Main gap            |   `~5% container` | Negative space          |
| Right mosaic        |  `~59% container` | Fixed card composition  |

OBSERVED — The right mosaic is visually dominant but does not overpower the text hierarchy.

---

### 5.4 Right mosaic grid

The mosaic must be treated as **two explicit vertical columns**.

| Mosaic column |        Approx. width | Contents                                           |
| ------------- | -------------------: | -------------------------------------------------- |
| Left          |  `~52% mosaic width` | Large team image + composite patient card          |
| Right         |  `~45% mosaic width` | Experience stat + technology image + patient photo |
| Column gap    | `~2–3% mosaic width` | Consistent vertical gap                            |

INFERRED — Estimated desktop column relation is approximately `1.1 : 1`.

Do **not** implement this as a generic `repeat(2, 1fr)` gallery if doing so causes slot heights to normalize.

---

### 5.5 Left mosaic column

#### Slot L1 — Primary Team Image

| Property | Specification                              | Status   |
| -------- | ------------------------------------------ | -------- |
| Position | Top-left of mosaic                         | OBSERVED |
| Width    | `100%` of left mosaic column               | OBSERVED |
| Height   | Approximately `230 px estimated`           | INFERRED |
| Aspect   | Landscape, approximately `1.35 : 1`        | INFERRED |
| Content  | Five dental staff members, Smilux branding | OBSERVED |
| Radius   | Approximately `10–12 px estimated`         | INFERRED |
| Crop     | Centered on staff group                    | OBSERVED |

---

#### Slot L2 — Patient Count Composite Card

> **Important:** Treat this as **one CMS card**, not `image item + stat item`.

| Property          | Specification                          | Status                     |
| ----------------- | -------------------------------------- | -------------------------- |
| Position          | Directly below L1                      | OBSERVED                   |
| Width             | `100%` of left mosaic column           | OBSERVED                   |
| Layout            | Horizontal two-panel split             | OBSERVED                   |
| Left panel width  | `50%`                                  | User-confirmed requirement |
| Right panel width | `50%`                                  | User-confirmed requirement |
| Outer card ratio  | Approximately same overall width as L1 | OBSERVED                   |
| Outer radius      | Approximately `10–12 px estimated`     | INFERRED                   |
| Overflow          | Clip child media to parent radius      | INFERRED                   |

##### Left half — image

* OBSERVED — Dental treatment-room photograph.
* OBSERVED — Image fills its half vertically.
* INFERRED — Use cover-style crop.
* OBSERVED — No text overlay.

##### Right half — statistic

* OBSERVED — White / very pale background.
* OBSERVED — `10,000+` positioned approximately around upper-middle.
* OBSERVED — `Happy Patients` underneath.
* OBSERVED — Content is left-aligned rather than fully centered.
* INFERRED — Internal horizontal padding approximately `28–35 px estimated`.

---

### 5.6 Right mosaic column

#### Slot R1 — Experience Statistic

| Property          | Specification                            | Status   |
| ----------------- | ---------------------------------------- | -------- |
| Position          | Top-right                                | OBSERVED |
| Width             | `100%` right mosaic column               | OBSERVED |
| Height            | Short stat-card format                   | OBSERVED |
| Background        | Very pale blue/white                     | OBSERVED |
| Radius            | Approximately `10–12 px estimated`       | INFERRED |
| Content alignment | Horizontally centered around card center | OBSERVED |
| Primary value     | `15+`                                    | OBSERVED |
| Label             | `Years of Experience`                    | OBSERVED |

---

#### Slot R2 — Technology Image

| Property       | Specification                                               | Status   |
| -------------- | ----------------------------------------------------------- | -------- |
| Position       | Below R1                                                    | OBSERVED |
| Width          | `100%` right mosaic column                                  | OBSERVED |
| Content        | Dentist showing patient diagnostic imagery on large display | OBSERVED |
| Orientation    | Landscape                                                   | OBSERVED |
| Radius         | Approximately `10–12 px estimated`                          | INFERRED |
| Image behavior | Cover crop                                                  | INFERRED |

---

#### Slot R3 — Patient / Team Photo

| Property       | Specification                                       | Status   |
| -------------- | --------------------------------------------------- | -------- |
| Position       | Bottom-right                                        | OBSERVED |
| Width          | `100%` right mosaic column                          | OBSERVED |
| Content        | Three people; central person holding flower bouquet | OBSERVED |
| Orientation    | Landscape                                           | OBSERVED |
| Radius         | Approximately `10–12 px estimated`                  | INFERRED |
| Image behavior | Cover crop                                          | INFERRED |

---

### 5.7 Critical mosaic relationship

The right side should preserve approximately this visual topology:

```text
┌───────────────────────────┬─────────────────────────┐
│                           │                         │
│      TEAM IMAGE           │      15+ YEARS          │
│                           │                         │
│                           ├─────────────────────────┤
│                           │                         │
├─────────────┬─────────────┤    TECHNOLOGY IMAGE     │
│             │             │                         │
│ CLINIC      │  10,000+    ├─────────────────────────┤
│ IMAGE       │  PATIENTS   │                         │
│             │             │     PATIENT PHOTO       │
│             │             │                         │
└─────────────┴─────────────┴─────────────────────────┘
```

This topology is more important than forcing every card into identical heights.

---

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate         | Usage                 | Description        | Status   |
| ----------------------- | --------------------- | ------------------ | -------- |
| `color/surface/about`   | Section background    | White / near-white | OBSERVED |
| `color/text/heading`    | Main heading          | Deep navy blue     | OBSERVED |
| `color/text/body`       | Body copy             | Muted navy         | OBSERVED |
| `color/text/eyebrow`    | Eyebrow               | Bright blue        | OBSERVED |
| `color/action/primary`  | CTA                   | Strong blue        | OBSERVED |
| `color/icon/check`      | Benefit check icon    | Bright blue        | OBSERVED |
| `color/stat/value`      | Numbers               | Dark navy          | OBSERVED |
| `color/stat/surface`    | Statistic cards       | Pale blue-white    | OBSERVED |
| `color/decorative/line` | Short heading divider | Bright/light blue  | OBSERVED |

---

### 6.2 Typography

| Element          | Weight              | Size                 | Line-height           | Alignment | Status   |
| ---------------- | ------------------- | -------------------- | --------------------- | --------- | -------- |
| Eyebrow          | `600–700 estimated` | `11–13 px estimated` | Compact               | Left      | INFERRED |
| H2               | `600–700 estimated` | `34–39 px estimated` | `1.15–1.25 estimated` | Left      | INFERRED |
| Body             | `400–500 estimated` | `12–14 px estimated` | `1.7–1.9 estimated`   | Left      | INFERRED |
| Benefit label    | `400–500 estimated` | `12–14 px estimated` | Normal                | Left      | INFERRED |
| CTA              | `600 estimated`     | `10–12 px estimated` | Compact               | Center    | INFERRED |
| `15+`            | `700 estimated`     | `29–32 px estimated` | Compact               | Center    | INFERRED |
| Experience label | `500–600 estimated` | `12–14 px estimated` | Multi-line            | Center    | INFERRED |
| `10,000+`        | `600–700 estimated` | `29–32 px estimated` | Compact               | Left      | INFERRED |
| Happy Patients   | `500–600 estimated` | `12–14 px estimated` | Multi-line            | Left      | INFERRED |

---

### 6.3 Borders, radius and effects

| Element         | Border           | Radius                | Shadow                   | Status   |
| --------------- | ---------------- | --------------------- | ------------------------ | -------- |
| Image cards     | None visible     | `~10–12 px estimated` | None or extremely subtle | INFERRED |
| Statistic cards | None visible     | `~10–12 px estimated` | None visible             | OBSERVED |
| Composite card  | None visible     | `~10–12 px estimated` | None visible             | INFERRED |
| CTA             | None visible     | `~5–7 px estimated`   | Very subtle              | INFERRED |
| Check icon      | Circular outline | Full circle           | None                     | OBSERVED |

---

## 7. Asset Manifest

| Asset ID                 | Visible description                            | Required format | Placement              | Crop rule                                 | Status   |
| ------------------------ | ---------------------------------------------- | --------------- | ---------------------- | ----------------------------------------- | -------- |
| `about-team-image`       | Five Smilux dental team members                | WebP/JPG/PNG    | Mosaic L1              | Landscape, preserve faces and Smilux logo | OBSERVED |
| `about-clinic-image`     | Modern dental chair / clinic room              | WebP/JPG/PNG    | Composite L2 left half | Portrait-ish crop inside 50% panel        | OBSERVED |
| `about-technology-image` | Dentist and patient viewing diagnostic display | WebP/JPG/PNG    | Mosaic R2              | Landscape crop                            | OBSERVED |
| `about-patient-image`    | Group photo with bouquet                       | WebP/JPG/PNG    | Mosaic R3              | Landscape crop                            | OBSERVED |
| `check-icon`             | Circular checkmark                             | SVG preferred   | Feature list           | Fixed icon                                | OBSERVED |
| `cta-arrow`              | Right arrow                                    | SVG preferred   | About CTA              | Right side of label                       | OBSERVED |

### Asset handling rules

* Each photographic slot must be separately configurable in Strapi.
* Do not combine the entire right mosaic into one flattened image.
* Do not require editors to prepare a single pre-composited collage.
* The layout must remain controlled by frontend/layout configuration.
* Strapi should manage **content**, not card coordinates.
* `about-clinic-image` belongs specifically to the left half of the composite patient-stat card.
* Editors must not be able to accidentally reorder mosaic slots if screenshot fidelity is a requirement.
* Each image field should expose suitable alt-text metadata.

---

## 8. Component Contract

### 8.1 Recommended component boundaries

| Component            | Responsibility                              | Reusable?                                | Status         |
| -------------------- | ------------------------------------------- | ---------------------------------------- | -------------- |
| `HomeAboutSection`   | Entire section orchestration                | No                                       | INFERRED       |
| `AboutContent`       | Eyebrow, heading, body, benefits and CTA    | Potentially                              | INFERRED       |
| `BenefitList`        | Repeated icon/text benefits                 | Yes                                      | INFERRED       |
| `AboutMosaic`        | Own exact right-side card topology          | Section-specific                         | INFERRED       |
| `ImageCard`          | Standard rounded image slot                 | Yes                                      | INFERRED       |
| `StatCard`           | Generic value + label card                  | Yes                                      | INFERRED       |
| `SplitMediaStatCard` | Single parent card split image/stat `50/50` | Yes if similar pattern appears elsewhere | User-confirmed |
| `PrimaryCTA`         | CTA presentation                            | Yes                                      | INFERRED       |

---

### 8.2 Strapi CMS content model

The Strapi model should separate **editorial data** from **frontend geometry**.

Do not expose arbitrary coordinates, widths or grid-row values to editors.

#### Recommended section-level fields

| Field           | Content type          |    Required | Editor responsibility                   |
| --------------- | --------------------- | ----------: | --------------------------------------- |
| `eyebrow`       | Short text            |         Yes | `ABOUT SMILUX DENTAL`                   |
| `headingLine1`  | Short text            |         Yes | `Trusted Care.`                         |
| `headingLine2`  | Short text            |         Yes | `Lasting Smiles.`                       |
| `description`   | Long text             |         Yes | Main paragraph                          |
| `benefits`      | Repeatable component  |         Yes | Four visible benefit rows               |
| `cta`           | Link/action component |         Yes | CTA label + destination                 |
| `mosaic`        | Single component      |         Yes | Right-side editorial media/stat content |
| `layoutVariant` | Enumeration           | Recommended | Locked/defaulted to `about_mosaic_v1`   |

---

### 8.3 Benefits component

Each benefit entry should contain only:

| Field   | Type                          | Required |
| ------- | ----------------------------- | -------: |
| `label` | Short text                    |      Yes |
| `icon`  | Optional media/icon reference |       No |

INFERRED — If all benefits always use the same check icon, the icon should remain a frontend/design-system concern rather than being individually configurable.

Recommended editor data:

1. `Experienced & Certified Dental Experts`
2. `State-of-the-Art Technology & Equipment`
3. `Painless & Patient-Friendly Procedures`
4. `Personalized Treatment Plans`

---

## 9. Strapi Mosaic Contract

### 9.1 Important architecture decision

Do **not** model the mosaic as:

* generic repeatable `cards[]`,
* generic gallery,
* masonry collection,
* sortable free-layout blocks.

That would allow editors to produce combinations that cannot match this design.

Use a **fixed named-slot component**.

---

### 9.2 Recommended `About Mosaic` component

| CMS field           | Frontend slot | Content                         |
| ------------------- | ------------- | ------------------------------- |
| `primaryTeamImage`  | `L1`          | Large top-left team image       |
| `experienceStat`    | `R1`          | `15+ / Years of Experience`     |
| `technologyImage`   | `R2`          | Dentist/display image           |
| `patientStoryImage` | `R3`          | Group/bouquet image             |
| `patientStatCard`   | `L2`          | Composite 50/50 image/stat card |

This gives Strapi a stable content contract while frontend permanently owns the placement.

---

### 9.3 `experienceStat`

Recommended nested fields:

| Field   | Type       | Required | Example               |
| ------- | ---------- | -------: | --------------------- |
| `value` | Short text |      Yes | `15+`                 |
| `label` | Short text |      Yes | `Years of Experience` |

Do not store:

* width,
* height,
* column,
* x/y position,
* font size,
* padding,
* alignment.

Those remain design-system/frontend responsibilities.

---

### 9.4 `patientStatCard`

This must be represented as **one nested component**.

Recommended structure:

| Field      | Type       |    Required | Function                         |
| ---------- | ---------- | ----------: | -------------------------------- |
| `image`    | Media      |         Yes | Left 50%                         |
| `value`    | Short text |         Yes | Right 50%, e.g. `10,000+`        |
| `label`    | Short text |         Yes | Right 50%, e.g. `Happy Patients` |
| `imageAlt` | Short text | Recommended | Accessible description           |

Frontend contract:

* Card itself occupies the full `L2` mosaic slot.
* Internal direction on desktop: horizontal.
* Left area: `50%`.
* Right area: `50%`.
* Image fills left half.
* Statistic fills right half.
* Both halves share one outer card boundary.
* Card clipping/radius belongs to parent composite card.

**Do not create two top-level Strapi blocks for these halves.**

---

### 9.5 Layout configuration ownership

| Property               | Strapi editor | Frontend |
| ---------------------- | ------------: | -------: |
| Image selection        |             ✅ |          |
| Image alt              |             ✅ |          |
| Stat value             |             ✅ |          |
| Stat label             |             ✅ |          |
| CTA copy               |             ✅ |          |
| CTA destination        |             ✅ |          |
| Benefit copy           |             ✅ |          |
| Card order             |               |        ✅ |
| Card width             |               |        ✅ |
| Mosaic columns         |               |        ✅ |
| `50/50` split          |               |        ✅ |
| Gaps                   |               |        ✅ |
| Radius                 |               |        ✅ |
| Typography             |               |        ✅ |
| Responsive arrangement |               |        ✅ |
| Image crop strategy    |               |        ✅ |
| Grid areas             |               |        ✅ |

This separation is important to prevent Strapi content changes from breaking the design.

---

## 10. Interaction States

| Element               | Default                          | Hover   | Focus                     | Destination        | Status   |
| --------------------- | -------------------------------- | ------- | ------------------------- | ------------------ | -------- |
| `LEARN MORE ABOUT US` | Blue filled rectangle with arrow | UNKNOWN | Accessible focus required | UNKNOWN            | OBSERVED |
| Benefit rows          | Static                           | N/A     | N/A                       | N/A                | OBSERVED |
| Mosaic images         | Static media                     | UNKNOWN | UNKNOWN                   | No link evidence   | OBSERVED |
| Stat cards            | Static                           | UNKNOWN | N/A                       | No action evidence | OBSERVED |

### Interaction constraints

* Do not make mosaic cards clickable without product requirements.
* Do not add image zoom behavior.
* Do not add counters/animated number effects based solely on the screenshot.
* Do not create carousel behavior.
* Do not animate/rearrange mosaic cards automatically.

---

## 11. Responsive Specification

### 11.1 Evidence available

* Desktop: OBSERVED.
* Tablet: UNKNOWN.
* Mobile: UNKNOWN.

### 11.2 Required desktop behavior

* Maintain two main section columns.
* Left text column must remain narrower than right mosaic.
* Mosaic top edges align with section text region.
* Preserve named-slot arrangement exactly.
* Preserve `L2` split card at `50/50`.
* Do not normalize all card heights.
* Do not convert mosaic to equal-card grid.

### 11.3 Proposed responsive behavior

| Range   | Proposed behavior                                  | Status   |
| ------- | -------------------------------------------------- | -------- |
| Desktop | Exact supplied composition                         | OBSERVED |
| Tablet  | Main text likely above or beside simplified mosaic | UNKNOWN  |
| Mobile  | Single-column content likely necessary             | UNKNOWN  |

Because no mobile source exists, final mobile arrangement requires design approval.

---

### 11.4 Safe responsive architecture

Even though exact responsive placement is UNKNOWN, the CMS schema should **not change by breakpoint**.

For example, the same fields remain:

* `primaryTeamImage`
* `experienceStat`
* `technologyImage`
* `patientStoryImage`
* `patientStatCard`

Only frontend placement changes.

This allows Strapi editors to manage one dataset while frontend controls desktop/tablet/mobile rendering.

---

## 12. Semantic HTML and Accessibility

### Recommended structure

* Section:

  * semantic section with accessible heading.
* Heading:

  * `Trusted Care. Lasting Smiles.` should represent one logical H2.
* Benefits:

  * semantic list.
* CTA:

  * semantic link if it navigates to About page.
* Statistics:

  * text must remain readable by assistive technologies.
* Images:

  * meaningful team/clinic imagery should have appropriate alt descriptions.
* Decorative check icons:

  * do not require repeated screen-reader announcements when benefit labels already convey the information.

### Accessibility constraints

* Do not render feature items as clickable elements.
* Do not rely on images to communicate `15+` or `10,000+`.
* Statistic values must exist as real text.
* Do not bake statistic text into images.
* Keep adequate contrast on pale statistic cards.
* CTA focus state must remain visible.

---

## 13. Implementation Constraints

* Section must remain compatible with Strapi CMS editing.
* Strapi stores semantic content, not geometry.
* Frontend owns mosaic layout.
* Avoid a generic card-list schema for this section.
* Use named media/stat slots.
* Keep `patientStatCard` atomic at CMS level.
* Preserve desktop `50/50` internal split in `patientStatCard`.
* Preserve the left mosaic column relationship:

  * `primaryTeamImage`
  * `patientStatCard`
* Preserve the right mosaic sequence:

  * `experienceStat`
  * `technologyImage`
  * `patientStoryImage`
* Do not allow Strapi sort/reorder to change these structural positions.
* If the CMS needs component reuse, reuse internal components such as `Stat`, `Media`, `Link`; do not make the visual mosaic itself editor-reorderable.
* Heading line breaks should remain controllable and not rely solely on automatic browser wrapping.
* Do not flatten heading into an image.
* Do not flatten statistic cards into image assets.
* Use source images individually.
* Preserve rounded clipping on photographic cards.
* Do not force each mosaic row to equal height.
* Do not convert the lower-left composite card to two disconnected cards.
* Do not place gutters between the two internal halves of the `50/50` composite card.
* Do not allow image aspect-ratio changes in CMS to alter grid geometry; frontend should crop predictably.

---

## 14. Visual Acceptance Criteria

* [ ] Section appears immediately below hero.
* [ ] Section background remains white / near-white.
* [ ] Left/right section proportions match reference.
* [ ] Eyebrow reads `ABOUT SMILUX DENTAL`.
* [ ] H2 appears as `Trusted Care.` / `Lasting Smiles.`.
* [ ] Short blue decorative line appears beneath heading.
* [ ] Main paragraph matches supplied content.
* [ ] Exactly four benefit rows appear.
* [ ] Every benefit has the visible circular check treatment.
* [ ] CTA reads `LEARN MORE ABOUT US`.
* [ ] CTA arrow appears on its right.
* [ ] Right mosaic begins at same approximate vertical level as left content.
* [ ] Top-left team image is the largest individual image card in the left mosaic column.
* [ ] `15+` stat card appears above the technology image.
* [ ] Technology image remains center-right.
* [ ] Patient/bouquet photo remains bottom-right.
* [ ] Lower-left block is one composite card.
* [ ] Composite card outer width equals the left mosaic column.
* [ ] Composite card has no visual gap between image/stat halves.
* [ ] Composite card left half is approximately `50%`.
* [ ] Composite card right half is approximately `50%`.
* [ ] `10,000+ / Happy Patients` appears only in composite-card right half.
* [ ] All mosaic cards preserve consistent corner radius.
* [ ] Different card heights remain intentional.
* [ ] Layout does not collapse into a uniform gallery.
* [ ] Strapi content changes cannot arbitrarily reorder mosaic structure.

---

## 15. Visual Risks

| Risk                                            | Why it affects fidelity                       | Mitigation                                        | Priority |
| ----------------------------------------------- | --------------------------------------------- | ------------------------------------------------- | -------- |
| Generic CMS card list                           | Editor ordering would destroy mosaic geometry | Use named Strapi fields/slots                     | High     |
| Treating composite card as two cards            | Introduces incorrect gap/radius/alignment     | Use one `patientStatCard` component               | High     |
| Equal-width/equal-height grid                   | Removes distinctive editorial layout          | Implement explicit mosaic grid                    | High     |
| Image dimensions controlled by CMS              | Unexpected uploads could deform layout        | Frontend owns slot ratio/crop                     | High     |
| Independent mobile CMS fields                   | Duplicate content and editor confusion        | Reuse same structured content at every breakpoint | High     |
| Statistics baked into images                    | Prevents accessibility and CMS editing        | Keep stats as text fields                         | High     |
| Incorrect image crop                            | Faces/equipment may be cut incorrectly        | Use fixed slot aspect + controlled focal position | Medium   |
| Editors reordering media                        | Screenshot fidelity becomes non-deterministic | Do not expose sortable card collection            | High     |
| `10,000+` stat centered instead of left-aligned | Changes internal composite-card character     | Preserve observed left alignment                  | Medium   |
| Missing rounded clipping across split card      | Child halves can appear disconnected          | Parent owns radius + clipping                     | Medium   |

---

## 16. Open Questions

| ID  | Question                                                                             | Blocking level                     | Suggested owner     |
| --- | ------------------------------------------------------------------------------------ | ---------------------------------- | ------------------- |
| Q1  | What exact section ID/name is already used in Strapi/content API?                    | Non-blocking                       | Developer           |
| Q2  | What exact font family and weights are used?                                         | Blocking for final visual fidelity | Designer            |
| Q3  | Can all four source photographs be exported individually?                            | Blocking                           | Designer            |
| Q4  | Is `Smilux` text in the team image part of the photograph?                           | Non-blocking                       | Designer            |
| Q5  | Should `15+` and `10,000+` remain editable in Strapi?                                | Non-blocking                       | Product             |
| Q6  | Should labels `Years of Experience` and `Happy Patients` be editable/localizable?    | Non-blocking                       | Product             |
| Q7  | Does `LEARN MORE ABOUT US` link to `/about`, anchor content, or another destination? | Blocking for functionality         | Product             |
| Q8  | Are benefits fully editor-editable or fixed product copy?                            | Non-blocking                       | Product             |
| Q9  | Does the project support media focal-point metadata for responsive cropping?         | Non-blocking                       | Developer           |
| Q10 | What is the approved tablet mosaic arrangement?                                      | Blocking for tablet                | Designer            |
| Q11 | What is the approved mobile mosaic arrangement?                                      | Blocking for mobile                | Designer            |
| Q12 | Should section layout variant be editable or permanently fixed to `about_mosaic_v1`? | Non-blocking                       | Product / Developer |

---

# Strapi Handoff Summary

## Safe CMS model

Recommended conceptual hierarchy:

```text
Homepage
└── About Section
    ├── Eyebrow
    ├── Heading Line 1
    ├── Heading Line 2
    ├── Description
    ├── Benefits[]
    ├── CTA
    │
    └── Mosaic
        ├── Primary Team Image
        ├── Experience Stat
        │   ├── Value
        │   └── Label
        ├── Technology Image
        ├── Patient Story Image
        │
        └── Patient Stat Card
            ├── Image
            ├── Value
            └── Label
```

## Frontend-only layout rule

```text
DESKTOP MOSAIC

LEFT COLUMN                  RIGHT COLUMN

┌─────────────────────┐     ┌───────────────────┐
│                     │     │       15+         │
│   PRIMARY TEAM      │     │ Years Experience  │
│      IMAGE          │     └───────────────────┘
│                     │
│                     │     ┌───────────────────┐
└─────────────────────┘     │                   │
                            │ TECHNOLOGY IMAGE  │
┌──────────┬──────────┐     │                   │
│          │          │     └───────────────────┘
│ CLINIC   │ 10,000+  │
│ IMAGE    │  HAPPY   │     ┌───────────────────┐
│          │ PATIENTS │     │                   │
│   50%    │   50%    │     │  PATIENT PHOTO   │
│          │          │     │                   │
└──────────┴──────────┘     └───────────────────┘
```

## Key rule for coding agent

**Strapi controls what appears inside the slots.
Frontend controls where those slots appear.**

Do not let the CMS turn this composition into a freely reorderable list.

The lower-left unit must be implemented and modeled as:

`Patient Stat Composite Card = Image 50% + Statistic 50%`

—not as two independent cards.
