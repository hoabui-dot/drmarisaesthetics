# UI Implementation Spec — Homepage Advanced Technology Section

## 1. Identity

| Field                       | Value                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | `/`                                                                                                                                                     |
| Section ID                  | `home-technology`                                                                                                                                       |
| Section name                | `Homepage Advanced Technology`                                                                                                                          |
| Position in page            | Immediately after `home-services`                                                                                                                       |
| Screenshot scope            | Complete desktop technology section shown in supplied screenshot                                                                                        |
| Target viewport             | Approximately `1255 × 702 px` screenshot raster                                                                                                         |
| Primary implementation goal | Reproduce the supplied desktop section with maximum visual fidelity while keeping editorial content and media configurable through Strapi CMS           |
| Overall evidence quality    | High for desktop structure and copy; High for background-cover requirement; Medium for exact typography/colors; Low for responsive/interaction behavior |

> **Critical background requirement:** This section uses a **full-section background cover image**. The background is not a plain white surface with a few independently positioned decorations. It must be treated as a dedicated section-level background media asset, covering the complete section while the content layers render above it.

> **Critical CMS requirement:** The background cover image must be a **separate Strapi media field** from the large technology image shown inside the right feature card. These are two different visual responsibilities and must not be combined.

---

## 2. Scope Boundary

### Included in this spec

* USER-SPECIFIED — Full-section background cover image.
* OBSERVED — Left content column containing:

  * eyebrow,
  * three-line heading,
  * introductory paragraph,
  * primary CTA.
* OBSERVED — Lower-left capability/technology strip containing six icon/text items.
* OBSERVED — Large right-side feature card.
* OBSERVED — Circular numeric marker `1` overlapping the card's left boundary.
* OBSERVED — Technology title inside right card.
* OBSERVED — Technology description.
* OBSERVED — Large technology/implant image.
* OBSERVED — Thin blue card border.
* OBSERVED — Large rounded card corners.
* OBSERVED — Small circular visual element near the upper-right corner of the feature card.
* INFERRED — Technology capabilities should be CMS-configurable repeatable items.
* INFERRED — Main right-side feature should use a structured CMS component rather than baked text inside an image.

### Excluded from this spec

* UNKNOWN — Whether the technology card is part of a carousel.
* UNKNOWN — Whether index `1` changes dynamically.
* UNKNOWN — Whether small upper-right circular visual is:

  * navigation,
  * decorative media,
  * thumbnail,
  * icon,
  * badge.
* UNKNOWN — Hover behavior.
* UNKNOWN — card-transition animation.
* UNKNOWN — mobile/tablet layout.
* UNKNOWN — CTA destination.
* UNKNOWN — whether technology items link to dedicated pages.
* UNKNOWN — number of technology feature cards beyond the one shown.

### Section start and end

* Start: Section begins at top of supplied technology screenshot.
* End: Section ends after the capability strip and large technology card.
* Background: USER-SPECIFIED — cover image spans the complete section boundary.

---

## 3. Evidence and Confidence

| Item                     | Status                    | Evidence / reason                                                                                 |
| ------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------- |
| Main desktop layout      | OBSERVED                  | Clear left/right split.                                                                           |
| Background cover image   | USER-SPECIFIED / OBSERVED | User explicitly identifies it; screenshot shows decorative graphics extending throughout section. |
| Main copy                | OBSERVED                  | Clearly readable.                                                                                 |
| Technology card copy     | OBSERVED                  | Clearly readable.                                                                                 |
| Capability labels        | OBSERVED                  | Six labels readable.                                                                              |
| Right card geometry      | OBSERVED                  | Large rounded bordered container.                                                                 |
| Feature index `1`        | OBSERVED                  | Circular marker overlaps left card edge.                                                          |
| Carousel behavior        | UNKNOWN                   | Index marker alone does not prove carousel behavior.                                              |
| Small upper-right visual | OBSERVED / UNKNOWN role   | Visible but function cannot be determined.                                                        |
| Exact typography         | INFERRED                  | Screenshot provides hierarchy, not source tokens.                                                 |
| Exact colors             | INFERRED                  | Palette visible but exact design values unavailable.                                              |
| Responsive behavior      | UNKNOWN                   | Only desktop screenshot supplied.                                                                 |

---

## 4. OCR Content Inventory

### Left content

| Element ID                  | Visible text                                                                                                                                                                                                                              | Text type | Confidence |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| `technology-eyebrow`        | `SMILUX ADVANCED TECHNOLOGY`                                                                                                                                                                                                              | Eyebrow   | High       |
| `technology-heading-line-1` | `Technology That`                                                                                                                                                                                                                         | Heading   | High       |
| `technology-heading-line-2` | `Powers Precision`                                                                                                                                                                                                                        | Heading   | High       |
| `technology-heading-line-3` | `Smiles`                                                                                                                                                                                                                                  | Heading   | High       |
| `technology-description`    | `At Smilux, advanced dental technology helps us deliver safer, more accurate, and more comfortable treatment experiences. From diagnosis to implant placement, every step is guided by precision, efficiency, and patient-centered care.` | Paragraph | High       |
| `technology-cta`            | `Explore Our Technology`                                                                                                                                                                                                                  | CTA       | High       |

### Capability strip

| Element ID      | Visible text        | Type          | Confidence |
| --------------- | ------------------- | ------------- | ---------- |
| `capability-01` | `3D Imaging`        | Feature label | High       |
| `capability-02` | `Guided Implant`    | Feature label | High       |
| `capability-03` | `Digital Scan`      | Feature label | High       |
| `capability-04` | `Laser Support`     | Feature label | High       |
| `capability-05` | `Comfort Care`      | Feature label | High       |
| `capability-06` | `Smart Appointment` | Feature label | High       |

### Right feature card

| Element ID            | Visible text                                                                                                                             | Type            | Confidence |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- |
| `feature-index`       | `1`                                                                                                                                      | Index / badge   | High       |
| `feature-title`       | `OTI® Guided Implant Technology`                                                                                                         | Feature heading | High       |
| `feature-description` | `A screw-guided implant technique designed for precise placement, minimal tissue trauma, faster recovery, and stable long-term results.` | Paragraph       | High       |

---

## 5. Layout Anatomy

### 5.1 Global geometry

| Property            | Specification                                                             | Status         |
| ------------------- | ------------------------------------------------------------------------- | -------------- |
| Section width       | Full viewport width                                                       | OBSERVED       |
| Section height      | Approximately full supplied screenshot height                             | OBSERVED       |
| Background          | Full-section cover image                                                  | USER-SPECIFIED |
| Content layout      | Two major columns                                                         | OBSERVED       |
| Left column         | Approximately `43–46%` container                                          | INFERRED       |
| Right column        | Approximately `50–53%` container                                          | INFERRED       |
| Main horizontal gap | Narrow-to-medium                                                          | INFERRED       |
| Vertical alignment  | Both columns begin near same top region                                   | OBSERVED       |
| Bottom content      | Capability strip under left content; right card extends deeper vertically | OBSERVED       |

---

### 5.2 Structure tree

```text
Section: home-technology
├── BackgroundCoverImage
│
├── ContentContainer
│   ├── LeftColumn
│   │   ├── Eyebrow
│   │   ├── DecorativeLine
│   │   ├── H2
│   │   │   ├── Technology That
│   │   │   ├── Powers Precision
│   │   │   └── Smiles
│   │   ├── Description
│   │   ├── CTA
│   │   └── CapabilityStrip
│   │       ├── Capability 01
│   │       ├── Capability 02
│   │       ├── Capability 03
│   │       ├── Capability 04
│   │       ├── Capability 05
│   │       └── Capability 06
│   │
│   └── RightColumn
│       └── TechnologyFeatureCard
│           ├── NumberBadge — 1
│           ├── SmallTopRightVisual
│           ├── FeatureTitle
│           ├── FeatureDescription
│           └── FeatureImage
```

---

## 5.3 Desktop composition

```text
┌─────────────────────────────────────────────────────────────────────┐
│                   FULL SECTION BACKGROUND COVER                     │
│                                                                     │
│  SMILUX ADVANCED TECHNOLOGY      ┌───────────────────────────────┐   │
│  ─────                            │                               │   │
│                                  │  OTI® Guided Implant          │   │
│  Technology That                 │  Technology                   │   │
│  Powers Precision          (1)───┤                               │   │
│  Smiles                          │  Description                  │   │
│                                  │                               │   │
│  Description...                  │  ┌─────────────────────────┐  │   │
│                                  │  │                         │  │   │
│  [Explore Our Technology →]      │  │   TECHNOLOGY IMAGE      │  │   │
│                                  │  │                         │  │   │
│                                  │  │                         │  │   │
│  ┌────────────────────────────┐  │  └─────────────────────────┘  │   │
│  │ six technology features    │  │                               │   │
│  └────────────────────────────┘  └───────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5.4 Background cover layer

### Required behavior

The supplied screenshot includes abstract light-blue decorative graphics around the section:

* pale blue geometric/curved shape at far left,
* dotted pattern around lower-left,
* large pale-blue curved/geometric detail toward lower-right,
* soft blue lighting/shadow around lower areas.

These elements should be treated as components of the **background cover asset**, unless the original Figma proves they are individually layered assets.

### Frontend rule

```text
TechnologySection
├── background cover
└── content above background
```

Not:

```text
TechnologySection
├── arbitrary CSS decorative shape 01
├── arbitrary CSS decorative shape 02
├── arbitrary CSS dots
├── arbitrary gradient
├── arbitrary blur
└── content
```

Do not reconstruct the background manually if an original background asset is available.

### Background positioning

| Property                          | Requirement                            | Status         |
| --------------------------------- | -------------------------------------- | -------------- |
| Sizing                            | Cover complete section                 | USER-SPECIFIED |
| Repeat                            | No repetition                          | INFERRED       |
| Primary position                  | Center / design-preserving positioning | INFERRED       |
| Layer                             | Behind all section content             | REQUIRED       |
| Independent from right card image | Yes                                    | REQUIRED       |
| CMS configurable                  | Recommended                            | INFERRED       |

---

## 5.5 Left content column

### Eyebrow

* Uppercase.
* Bright blue.
* Aligned to same left edge as H2.
* Short blue decorative line appears below it.

### H2

Explicit desktop visual lines:

```text
Technology That
Powers Precision
Smiles
```

OBSERVED — First two lines are dark navy.

OBSERVED — `Smiles` is bright blue.

Do not allow automatic wrapping to change this desktop line structure if matching the screenshot is required.

### Description

* Left aligned.
* Medium content width.
* Visually rendered across approximately five lines.
* Uses muted navy.
* Comfortable line-height.

### CTA

* Filled royal/bright-blue button.
* White label.
* Arrow on right.
* Rounded rectangular shape rather than a fully circular pill.
* Visible soft blue shadow.

---

## 5.6 Capability strip

The lower-left feature block is **one shared outer container** divided internally into six equal or near-equal items.

Do not implement the six entries as six completely separate cards.

### Structure

```text
CapabilityStrip
├── CapabilityItem
│   ├── Icon
│   └── Label
├── Divider
├── CapabilityItem
├── Divider
├── CapabilityItem
├── Divider
├── CapabilityItem
├── Divider
├── CapabilityItem
├── Divider
└── CapabilityItem
```

### Geometry

| Property            | Specification                        | Status   |
| ------------------- | ------------------------------------ | -------- |
| Outer surface       | White / translucent-white appearance | OBSERVED |
| Border              | Very light pale-blue outline         | OBSERVED |
| Radius              | Large rounded outer rectangle        | OBSERVED |
| Items               | Six horizontal columns               | OBSERVED |
| Internal separators | Thin vertical dividers               | OBSERVED |
| Icon location       | Top/center within item               | OBSERVED |
| Label               | Below icon, centered                 | OBSERVED |
| Item sizing         | Equal or near-equal width            | OBSERVED |

### Capability items

```text
┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│  ICON   │  ICON   │  ICON   │  ICON   │  ICON   │  ICON   │
│         │         │         │         │         │         │
│ 3D      │ Guided  │ Digital │ Laser   │ Comfort │ Smart   │
│ Imaging │ Implant │ Scan    │ Support │ Care    │ Appt.   │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

---

## 5.7 Right technology feature card

### Outer card

| Property   | Specification                                                  | Status   |
| ---------- | -------------------------------------------------------------- | -------- |
| Width      | Almost entire right column                                     | OBSERVED |
| Height     | Large portrait-ish content card                                | OBSERVED |
| Background | White / very light surface                                     | OBSERVED |
| Border     | Thin bright/light blue                                         | OBSERVED |
| Radius     | Very large rounded corners, approximately `30–36 px estimated` | INFERRED |
| Padding    | Generous                                                       | OBSERVED |
| Overflow   | Card visual remains clipped within card                        | OBSERVED |

---

### Index badge

The number badge `1` intentionally overlaps the left border of the technology card.

```text
               CARD
          ┌──────────────
          │
      ┌───┤
      │ 1 │
      └───┤
          │
          │
```

| Property           | Requirement                            | Status   |
| ------------------ | -------------------------------------- | -------- |
| Shape              | Circle                                 | OBSERVED |
| Content            | `1`                                    | OBSERVED |
| Background         | White/light                            | OBSERVED |
| Border             | Blue                                   | OBSERVED |
| Position           | Horizontally overlaps card's left edge | OBSERVED |
| Vertical placement | Around upper 20–25% of card            | INFERRED |
| Z-order            | Above card/border                      | REQUIRED |

Do not place this badge fully inside the card.

---

### Feature title

`OTI® Guided Implant Technology`

* Large blue text.
* Positioned toward upper-left interior of card.
* Single-line in supplied desktop screenshot.
* `®` must be preserved.

---

### Feature description

```text
A screw-guided implant technique designed for precise
placement, minimal tissue trauma, faster recovery, and
stable long-term results.
```

Visual line breaks are approximate screenshot behavior.

Do not hard-code those exact internal breaks unless required by final Figma dimensions.

---

### Feature image

* Large landscape image.
* Positioned below title/description.
* Occupies most card width.
* Rounded corners.
* Shows guided implant equipment, transparent dental model and digital dental display.
* Must be stored as an independent media asset.

Approximate internal hierarchy:

```text
TechnologyFeatureCard

OTI® Guided Implant Technology

Description text...

┌────────────────────────────────┐
│                                │
│                                │
│      FEATURE TECHNOLOGY        │
│             IMAGE              │
│                                │
│                                │
└────────────────────────────────┘
```

---

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate                 | Usage              | Description                              | Status         |
| ------------------------------- | ------------------ | ---------------------------------------- | -------------- |
| `color/surface/technology`      | Section            | Determined primarily by background image | USER-SPECIFIED |
| `color/text/heading`            | H2 lines 1–2       | Deep navy                                | OBSERVED       |
| `color/text/heading-accent`     | `Smiles`           | Bright royal blue                        | OBSERVED       |
| `color/text/body`               | Main paragraph     | Muted navy                               | OBSERVED       |
| `color/text/feature-title`      | Technology title   | Bright/royal blue                        | OBSERVED       |
| `color/action/primary`          | Main CTA           | Bright/royal blue                        | OBSERVED       |
| `color/border/technology-card`  | Right card outline | Pale/bright blue                         | OBSERVED       |
| `color/border/capability-strip` | Lower-left strip   | Very pale blue                           | OBSERVED       |
| `color/icon/technology`         | Capability icons   | Bright blue                              | OBSERVED       |
| `color/surface/card`            | Feature card       | White / near-white                       | OBSERVED       |

---

## 6.2 Typography

| Element             | Weight              | Size                 | Status   |
| ------------------- | ------------------- | -------------------- | -------- |
| Eyebrow             | `600–700 estimated` | `13–15 px estimated` | INFERRED |
| Main H2             | `700 estimated`     | `48–56 px estimated` | INFERRED |
| Main paragraph      | `400–500 estimated` | `15–17 px estimated` | INFERRED |
| CTA                 | `500–600 estimated` | `15–17 px estimated` | INFERRED |
| Capability labels   | `500–600 estimated` | `11–13 px estimated` | INFERRED |
| Index `1`           | `600–700 estimated` | `30–34 px estimated` | INFERRED |
| Feature title       | `600–700 estimated` | `28–32 px estimated` | INFERRED |
| Feature description | `400–500 estimated` | `15–17 px estimated` | INFERRED |

Do not infer the font family solely from screenshot similarity.

---

## 7. Asset Manifest

| Asset ID                        | Description                                       | Required format               |                             CMS? | Status                  |
| ------------------------------- | ------------------------------------------------- | ----------------------------- | -------------------------------: | ----------------------- |
| `technology-section-background` | Full-section abstract light-blue cover background | WebP/PNG/JPG depending source |                              Yes | USER-SPECIFIED          |
| `technology-main-feature-image` | Guided implant / digital implant visual           | WebP/JPG/PNG                  |                              Yes | OBSERVED                |
| `technology-feature-thumbnail`  | Small circular upper-right visual                 | UNKNOWN                       |                         Possibly | OBSERVED / UNKNOWN role |
| `icon-3d-imaging`               | 3D imaging blue line icon                         | SVG                           |             Yes or design-system | OBSERVED                |
| `icon-guided-implant`           | Implant blue line icon                            | SVG                           |             Yes or design-system | OBSERVED                |
| `icon-digital-scan`             | Tooth/scan icon                                   | SVG                           |             Yes or design-system | OBSERVED                |
| `icon-laser-support`            | Laser blue line icon                              | SVG                           |             Yes or design-system | OBSERVED                |
| `icon-comfort-care`             | Heart blue line icon                              | SVG                           |             Yes or design-system | OBSERVED                |
| `icon-smart-appointment`        | Calendar blue line icon                           | SVG                           |             Yes or design-system | OBSERVED                |
| `cta-arrow`                     | Right-arrow icon                                  | SVG                           | No if shared design-system asset | OBSERVED                |

### Asset rules

* `technology-section-background` and `technology-main-feature-image` are separate assets.
* Do not flatten section copy into the background image.
* Do not flatten capability icons/text into background.
* Do not bake right-card heading/description into its photograph.
* Background image should be optimized for large desktop cover use.
* CMS editors should be able to replace background media without changing frontend geometry.
* Frontend should protect composition using controlled background sizing and positioning.

---

## 8. Component Contract

### 8.1 Recommended component boundaries

| Component                   | Responsibility                          | Reusable?   | Status              |
| --------------------------- | --------------------------------------- | ----------- | ------------------- |
| `HomeTechnologySection`     | Full section orchestration/background   | No          | INFERRED            |
| `TechnologyIntro`           | Eyebrow, H2, paragraph, CTA             | Potentially | INFERRED            |
| `TechnologyCapabilityStrip` | Six compact capability items            | Yes         | INFERRED            |
| `TechnologyCapabilityItem`  | Icon + label                            | Yes         | OBSERVED / INFERRED |
| `TechnologyFeatureCard`     | Main right-side technology presentation | Yes         | INFERRED            |
| `TechnologyIndexBadge`      | Overlapping numbered marker             | Potentially | INFERRED            |

---

## 9. Strapi CMS Contract

### 9.1 Section-level structure

Recommended conceptual structure:

```text
Homepage
└── Advanced Technology Section
    ├── Background Cover
    ├── Eyebrow
    ├── Heading
    │   ├── Line 1
    │   ├── Line 2
    │   └── Accent Line
    ├── Description
    ├── CTA
    ├── Capabilities[]
    └── Featured Technology
        ├── Index
        ├── Title
        ├── Description
        ├── Image
        └── Optional Small Visual
```

---

### 9.2 Recommended section fields

| Field                | Type                 | Required | Example                      |
| -------------------- | -------------------- | -------: | ---------------------------- |
| `backgroundImage`    | Media                |      Yes | Full background cover asset  |
| `eyebrow`            | Short text           |      Yes | `SMILUX ADVANCED TECHNOLOGY` |
| `headingLine1`       | Short text           |      Yes | `Technology That`            |
| `headingLine2`       | Short text           |      Yes | `Powers Precision`           |
| `headingAccent`      | Short text           |      Yes | `Smiles`                     |
| `description`        | Long text            |      Yes | Main intro copy              |
| `cta`                | Link component       |      Yes | Explore Our Technology       |
| `capabilities`       | Repeatable component |      Yes | Six visible features         |
| `featuredTechnology` | Component / relation |      Yes | OTI technology               |

### Why heading lines should be explicit fields

The screenshot requires a controlled desktop presentation:

```text
Technology That
Powers Precision
Smiles
```

Using one unconstrained rich-text heading risks CMS content wrapping differently.

Recommended:

* `headingLine1`
* `headingLine2`
* `headingAccent`

rather than a free-form WYSIWYG H2.

---

## 9.3 Capability component

Recommended fields:

| Field       | Type       |                     Required |
| ----------- | ---------- | ---------------------------: |
| `label`     | Short text |                          Yes |
| `icon`      | Media/SVG  | Yes if icons are CMS-managed |
| `sortOrder` | Integer    |                     Optional |

Visible content order:

1. `3D Imaging`
2. `Guided Implant`
3. `Digital Scan`
4. `Laser Support`
5. `Comfort Care`
6. `Smart Appointment`

### Layout rule

Strapi may control:

* text,
* icon,
* order.

Frontend must control:

* six-column layout,
* dividers,
* spacing,
* typography,
* radius,
* strip sizing.

---

## 9.4 Featured Technology component

Recommended fields:

| Field         | Type                 |           Required | Example                           |
| ------------- | -------------------- | -----------------: | --------------------------------- |
| `index`       | Integer / short text |                Yes | `1`                               |
| `title`       | Short text           |                Yes | `OTI® Guided Implant Technology`  |
| `description` | Long text            |                Yes | Visible description               |
| `image`       | Media                |                Yes | Guided implant image              |
| `thumbnail`   | Media                |       No / UNKNOWN | Small upper-right circular visual |
| `link`        | Link                 | Optional / UNKNOWN | No link evidence in screenshot    |

### Important

Do not store:

* index badge x/y coordinates,
* right-card width,
* card border radius,
* card padding,
* image height,
* feature title font size.

These remain frontend layout concerns.

---

## 9.5 If multiple technologies exist

The `1` marker suggests numbering, but screenshot does **not** prove a carousel.

Therefore the CMS may be designed in one of two ways depending on product requirements:

### Option A — Single featured technology

```text
featuredTechnology
└── one component
```

Safest based solely on supplied screenshot.

### Option B — Repeatable technologies

```text
technologies[]
├── index
├── title
├── description
└── image
```

Use only if Figma/Product confirms:

* carousel,
* tabs,
* next/previous behavior,
* multiple technology steps.

Do not build carousel logic just because the screenshot contains `1`.

---

## 10. Interaction States

| Element                           | Default         | Hover   | Active  | Destination             | Status           |
| --------------------------------- | --------------- | ------- | ------- | ----------------------- | ---------------- |
| Explore Our Technology            | Filled blue CTA | UNKNOWN | UNKNOWN | UNKNOWN                 | OBSERVED         |
| Capability items                  | Static          | UNKNOWN | UNKNOWN | No interaction evidence | OBSERVED         |
| Technology feature card           | Static          | UNKNOWN | UNKNOWN | UNKNOWN                 | OBSERVED         |
| Index badge                       | Static          | UNKNOWN | UNKNOWN | UNKNOWN                 | OBSERVED         |
| Small upper-right circular visual | Visible         | UNKNOWN | UNKNOWN | UNKNOWN                 | UNKNOWN behavior |

### Constraints

* Do not add carousel transitions.
* Do not animate index values without evidence.
* Do not make capability strip horizontally draggable without mobile requirement.
* Do not make the feature image zoom on hover.
* Do not add parallax to background cover unless supplied separately.
* Do not infer interaction from the small circular visual.

---

## 11. Responsive Specification

### 11.1 Evidence available

* Desktop: OBSERVED.
* Tablet: UNKNOWN.
* Mobile: UNKNOWN.

### 11.2 Desktop requirements

* Maintain two-column composition.
* H2 retains intentional three-line hierarchy.
* Capability strip remains below intro content.
* Right feature card remains substantially taller/larger than capability strip.
* Index circle continues to overlap the card's left border.
* Feature image remains contained inside card.
* Background image covers whole section.

---

### 11.3 Background responsive requirements

Even though exact mobile layout is unknown, the background architecture must support:

```text
desktop background position
tablet background position
mobile background position
```

without requiring editors to upload separate images unless Product explicitly wants art direction.

Recommended Strapi baseline:

```text
backgroundImage
```

Optional only if design supplies separate crops:

```text
backgroundDesktop
backgroundTablet
backgroundMobile
```

Do **not** create three mandatory background fields without corresponding design assets.

---

### 11.4 Proposed responsive behavior

| Range   | Layout behavior | Background                                         | Status   |
| ------- | --------------- | -------------------------------------------------- | -------- |
| Desktop | Two-column      | Full cover                                         | OBSERVED |
| Tablet  | UNKNOWN         | Cover with adjusted focal position likely required | INFERRED |
| Mobile  | UNKNOWN         | Cover while preserving readability                 | INFERRED |

Do not determine whether the right card moves below the left column until mobile design exists.

---

## 12. Semantic HTML and Accessibility

### Recommended semantic structure

* Section landmark associated with H2.
* H2:

  * one logical heading despite three visual lines.
* CTA:

  * semantic link if navigation.
* Capability strip:

  * semantic list.
* Feature card:

  * article-like grouping if it represents a distinct technology.
* Feature image:

  * meaningful alt description.
* Background:

  * decorative, should not be announced to screen readers.
* Index:

  * avoid unnecessary announcement if purely visual.

### Background accessibility

The background cover is decorative.

Therefore:

* Do not render it as an informative `<img>` requiring verbose alt text unless Product establishes semantic meaning.
* Ensure background does not reduce content contrast.
* Do not put critical textual information exclusively inside the background asset.

---

## 13. Implementation Constraints

### Background

* Full-section cover image is mandatory.
* Background layer must cover section bounds.
* Content renders above the background.
* Background image must not dictate section height.
* Do not combine feature-card photo with the section background.
* Do not manually recreate background artwork unless original asset is unavailable and Designer approves.
* Prevent unexpected background tiling.
* Preserve visual focal region when viewport changes.

### Layout

* Preserve left/right desktop split.
* Maintain intentional H2 line hierarchy.
* Keep capability strip as a single grouped panel.
* Do not turn capability entries into isolated floating cards.
* Keep six desktop capability items in one row.
* Preserve vertical separators.
* Keep feature index badge overlapping card edge.
* Do not clip overlapping index badge accidentally through parent overflow.
* Feature card itself should clip its internal image/content where required.
* Keep right card border thin and blue.
* Preserve large card radius.

### CMS

* `backgroundImage` must be editable independently.
* `featuredTechnology.image` must be independently editable.
* Do not store CSS/background position as arbitrary editor strings.
* CMS should control semantic data, not geometry.
* Background focal-point configuration may be exposed only if the existing media system supports a safe structured mechanism.
* Capabilities should be repeatable.
* Featured technology should not automatically become a carousel.
* Preserve `®` in the technology title.

---

## 14. Visual Acceptance Criteria

### Overall

* [ ] Section uses supplied background cover image.
* [ ] Background covers the complete section.
* [ ] Background does not repeat.
* [ ] Decorative blue forms/dots align visually with reference.
* [ ] Left/right section proportions match.
* [ ] Section remains readable over background.

### Left content

* [ ] `SMILUX ADVANCED TECHNOLOGY` matches.
* [ ] Short blue decorative line is present.
* [ ] Heading lines render as:

  * `Technology That`
  * `Powers Precision`
  * `Smiles`
* [ ] `Smiles` uses bright blue accent.
* [ ] Main description matches supplied copy.
* [ ] CTA reads `Explore Our Technology`.
* [ ] CTA has right arrow.
* [ ] CTA shadow/radius match screenshot.

### Capability strip

* [ ] One outer rounded container.
* [ ] Six items.
* [ ] Six blue icons.
* [ ] Labels match screenshot.
* [ ] Vertical dividers are present.
* [ ] Items have consistent widths.
* [ ] Icons remain centered over labels.

### Right feature card

* [ ] Large rounded white card matches screenshot proportion.
* [ ] Thin blue border is visible.
* [ ] Index circle overlaps left edge.
* [ ] Index reads `1`.
* [ ] Title reads `OTI® Guided Implant Technology`.
* [ ] Description matches screenshot.
* [ ] Main implant image fills expected card width.
* [ ] Main image has rounded corners.
* [ ] Image is not used as card background.
* [ ] Small upper-right circular visual remains present if confirmed as intentional asset.
* [ ] No unconfirmed slider/arrows/dots have been added.

---

## 15. Visual Risks

| Risk                                            | Why it affects fidelity                     | Mitigation                                    | Priority |
| ----------------------------------------------- | ------------------------------------------- | --------------------------------------------- | -------- |
| Treating background as plain color              | Loses major section artwork                 | Use exact background cover asset              | High     |
| Combining background + feature image            | Prevents correct layout/responsive behavior | Keep assets separate                          | High     |
| Recreating background with arbitrary CSS        | Difficult to match screenshot               | Export original Figma background              | High     |
| Wrong background-position                       | Decorative geometry shifts noticeably       | Compare against screenshot at target viewport | High     |
| Auto-wrapped H2                                 | Changes core visual hierarchy               | Use controlled heading lines                  | High     |
| Converting capability strip to six cards        | Changes grouping and spacing                | Keep one outer strip                          | High     |
| Clipping index badge                            | Breaks distinctive card geometry            | Allow badge to overflow card boundary         | High     |
| Building carousel from index `1`                | Introduces unsupported behavior             | Keep static until confirmed                   | High     |
| Guessing role of upper-right circular item      | May create incorrect interaction            | Keep role UNKNOWN until design confirmation   | Medium   |
| CMS controls geometry                           | Editors could break layout                  | CMS controls content only                     | High     |
| Background text contrast changes at mobile crop | Readability risk                            | Support frontend-controlled focal positioning | Medium   |
| Feature image wrong crop                        | Main technology visual loses intended focus | Preserve original asset ratio/focal point     | High     |

---

## 16. Open Questions

| ID  | Question                                                                                                                         | Blocking level                               | Suggested owner    |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------ |
| Q1  | Can the original full-section background cover asset be exported separately from Figma?                                          | Blocking                                     | Designer           |
| Q2  | What is the exact desktop background-position/focal point?                                                                       | Blocking for final fidelity                  | Designer           |
| Q3  | Is the small circular item in the feature card's upper-right corner a thumbnail, decorative image, control or another component? | Blocking if interactive                      | Designer           |
| Q4  | Does index `1` indicate a carousel/slider with multiple technologies?                                                            | Blocking for interaction architecture        | Designer / Product |
| Q5  | If multiple technologies exist, what are navigation controls and transition behavior?                                            | Blocking only if carousel confirmed          | Designer           |
| Q6  | Is `featuredTechnology` a homepage-specific component or relation to a reusable Technology collection in Strapi?                 | Architecture decision                        | Developer          |
| Q7  | What destination does `Explore Our Technology` use?                                                                              | Blocking for functionality                   | Product            |
| Q8  | Are the six capability items editable/reorderable?                                                                               | Non-blocking                                 | Product            |
| Q9  | Should capability icons come from Strapi or the frontend icon library?                                                           | Non-blocking                                 | Developer          |
| Q10 | Is separate mobile background artwork available?                                                                                 | Blocking only for exact mobile fidelity      | Designer           |
| Q11 | What is the mobile layout for the feature card and capability strip?                                                             | Blocking for responsive implementation       | Designer           |
| Q12 | Does the right card have hover/animation behavior?                                                                               | Non-blocking until interactions are supplied | Designer           |

---

# Strapi Handoff Summary

## Recommended content hierarchy

```text
Homepage
└── Advanced Technology Section
    │
    ├── backgroundImage
    │
    ├── eyebrow
    ├── headingLine1
    ├── headingLine2
    ├── headingAccent
    ├── description
    │
    ├── cta
    │   ├── label
    │   └── destination
    │
    ├── capabilities[]
    │   ├── icon
    │   └── label
    │
    └── featuredTechnology
        ├── index
        ├── title
        ├── description
        ├── image
        └── optionalThumbnail
```

## Critical media separation

```text
BACKGROUND ASSET
technology-section-background
        │
        ▼
covers entire section


CONTENT ASSET
technology-main-feature-image
        │
        ▼
lives ONLY inside right technology card
```

These two assets must **never be represented as the same CMS media field**.

---

# Frontend Layout Handoff

```text
FULL BACKGROUND COVER
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   LEFT CONTENT                  RIGHT FEATURE CARD            │
│                                                              │
│   Eyebrow                       ┌─────────────────────────┐   │
│   Heading                       │ Feature Title           │   │
│   Description              (1)──┤ Feature Description     │   │
│   CTA                           │                         │   │
│                                 │ ┌─────────────────────┐ │   │
│                                 │ │                     │ │   │
│                                 │ │   FEATURE IMAGE     │ │   │
│                                 │ │                     │ │   │
│   ┌───────────────────────┐     │ └─────────────────────┘ │   │
│   │ 6 CAPABILITY ITEMS    │     └─────────────────────────┘   │
│   └───────────────────────┘                                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Mandatory implementation rules

1. **Full-section background cover image.**
2. Background and right-card image are separate assets.
3. Six capability items belong to one shared strip.
4. Index `1` overlaps the technology card's left border.
5. Do not infer a carousel solely from the number badge.
6. Strapi controls content/media; frontend controls geometry.
7. Preserve the three-line desktop heading and blue `Smiles` accent.
8. Do not reproduce the background using arbitrary decorative CSS if the original background image exists.
