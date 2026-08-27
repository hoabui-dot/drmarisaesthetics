# UI Implementation Spec — Homepage Dental Services Section

## 1. Identity

| Field                       | Value                                                                                                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | `/`                                                                                                                                                                          |
| Section ID                  | `home-services`                                                                                                                                                              |
| Section name                | `Homepage Dental Services`                                                                                                                                                   |
| Position in page            | Immediately after `home-about`                                                                                                                                               |
| Screenshot scope            | Section heading, global services CTA and five service cards visible in supplied desktop screenshot                                                                           |
| Target viewport             | `1056 × 312 px` screenshot raster                                                                                                                                            |
| Primary implementation goal | Reproduce the supplied desktop services section with maximum visual fidelity, CMS-editable service content, and the required bottom-to-top card color transition interaction |
| Overall evidence quality    | High for desktop layout/card structure; High for requested animation direction; Medium for exact typography/colors; Low for responsive layout                                |

> **Critical interaction requirement:** Every service card requires a **bottom-to-top color-fill transition**. On desktop this state is triggered by **hover**. On touch/mobile it is triggered by **tap/press**. The transition must visually originate from the card's bottom edge and progressively cover the card upward rather than switching the background color instantly.

> **Critical CMS rule:** Unlike the preceding About mosaic, this section is naturally modeled as a **repeatable ordered collection of service cards** in Strapi. Strapi controls card content/order. Frontend controls card geometry, responsive rules, visual state and animation.

---

## 2. Scope Boundary

### Included in this spec

* OBSERVED — Section eyebrow:

  * `OUR DENTAL SERVICES`
* OBSERVED — Main section heading:

  * `Comprehensive Care For Your Perfect Smile`
* OBSERVED — `VIEW ALL SERVICES` CTA aligned to the right of the section heading region.
* OBSERVED — Five desktop service cards.
* OBSERVED — Each card contains:

  * circular blue icon badge,
  * dental illustration/image,
  * service title,
  * description,
  * `LEARN MORE` action,
  * right-arrow indicator.
* USER-SPECIFIED — Special bottom-to-top color-fill interaction.
* USER-SPECIFIED — Desktop trigger: hover.
* USER-SPECIFIED — Mobile/touch trigger: click/tap.
* INFERRED — Service card data should be implemented as an ordered repeatable Strapi collection/component.
* INFERRED — Icon badge and dental image are separately managed visual assets.

### Excluded from this spec

* UNKNOWN — Exact hover target color.
* UNKNOWN — Exact text/icon recoloring during active/hover state.
* UNKNOWN — Whether dental illustration changes opacity/color during interaction.
* UNKNOWN — Card link destinations.
* UNKNOWN — `VIEW ALL SERVICES` destination.
* UNKNOWN — Exact animation duration/easing.
* UNKNOWN — Whether tapping the entire card navigates or only `LEARN MORE`.
* UNKNOWN — Tablet layout.
* UNKNOWN — Mobile card presentation: grid, stacked cards or carousel.
* UNKNOWN — Whether services come from the same Strapi collection used by a Services listing/detail page.
* UNKNOWN — Number of services beyond the five shown.

### Section start and end

* Start: OBSERVED — Begins with `OUR DENTAL SERVICES` above the main heading.
* End: OBSERVED — Extends beneath the five visible cards.
* Cropped/partially visible content:

  * OBSERVED — Screenshot is vertically tight around this section.
  * UNKNOWN — Exact vertical spacing to previous/next homepage sections.

---

## 3. Evidence and Confidence

| Item                               | Status                     | Evidence / reason                                                                 |
| ---------------------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| Section boundary                   | OBSERVED                   | Header/title and full card row are visible.                                       |
| Desktop layout                     | OBSERVED                   | Five cards form one horizontal row.                                               |
| Card structure                     | OBSERVED                   | All five cards repeat the same information hierarchy.                             |
| Service copy                       | OBSERVED / partial UNKNOWN | Most text is readable; Root Canal Therapy body copy is partially blurred/cropped. |
| Typography values                  | INFERRED                   | Relative hierarchy visible; exact design tokens unavailable.                      |
| Colors                             | INFERRED                   | Navy/blue/white palette visible; exact source hex values unavailable.             |
| Assets                             | OBSERVED                   | Five badge icons and five dental illustrations visible.                           |
| Desktop hover trigger              | USER-SPECIFIED             | Explicit requirement.                                                             |
| Mobile tap trigger                 | USER-SPECIFIED             | Explicit requirement.                                                             |
| Bottom-to-top transition direction | USER-SPECIFIED             | Explicit requirement.                                                             |
| Final hover visual palette         | UNKNOWN                    | User specified animation direction but not final fill/text colors.                |
| Responsive behavior                | UNKNOWN                    | No mobile/tablet screenshot supplied.                                             |
| CMS repeatability                  | INFERRED                   | Card structure visibly repeated and appropriate for Strapi repeatable data.       |

---

## 4. OCR Content Inventory

> Preserve readable text exactly. Do not silently correct unclear screenshot copy.

### Section-level copy

| Element ID          | Visible text                                | Type    | Confidence | Notes                       |
| ------------------- | ------------------------------------------- | ------- | ---------- | --------------------------- |
| `services-eyebrow`  | `OUR DENTAL SERVICES`                       | Eyebrow | High       | Uppercase blue text         |
| `services-heading`  | `Comprehensive Care For Your Perfect Smile` | H2      | High       | Single-line desktop heading |
| `services-view-all` | `VIEW ALL SERVICES`                         | CTA     | High       | Arrow at right              |

### Card 01

| Element ID               | Visible text                                                             | Type         | Confidence |
| ------------------------ | ------------------------------------------------------------------------ | ------------ | ---------- |
| `service-01-title`       | `Dental Implants`                                                        | Card heading | High       |
| `service-01-description` | `Restore missing teeth with strong and natural-looking dental implants.` | Body         | High       |
| `service-01-link`        | `LEARN MORE`                                                             | CTA/link     | High       |

### Card 02

| Element ID               | Visible text                                                       | Type         | Confidence |
| ------------------------ | ------------------------------------------------------------------ | ------------ | ---------- |
| `service-02-title`       | `Teeth Whitening`                                                  | Card heading | High       |
| `service-02-description` | `Brighten your smile with safe and effective whitening solutions.` | Body         | High       |
| `service-02-link`        | `LEARN MORE`                                                       | CTA/link     | High       |

### Card 03

| Element ID               | Visible text                                                    | Type         | Confidence |
| ------------------------ | --------------------------------------------------------------- | ------------ | ---------- |
| `service-03-title`       | `Orthodontics`                                                  | Card heading | High       |
| `service-03-description` | `Straighten your teeth braces or clear aligners for a perfect.` | Body         | Medium     |
| `service-03-link`        | `LEARN MORE`                                                    | CTA/link     | High       |

> The Orthodontics sentence appears grammatically incomplete in the screenshot. Preserve screenshot/source CMS copy until product copy is confirmed.

### Card 04

| Element ID               | Visible text                                                  | Type         | Confidence |
| ------------------------ | ------------------------------------------------------------- | ------------ | ---------- |
| `service-04-title`       | `Teeth Fillings`                                              | Card heading | High       |
| `service-04-description` | `Safe and durable to restore and protect your natural teeth.` | Body         | High       |
| `service-04-link`        | `LEARN MORE`                                                  | CTA/link     | High       |

### Card 05

| Element ID               | Visible text                                                                          | Type         | Confidence |
| ------------------------ | ------------------------------------------------------------------------------------- | ------------ | ---------- |
| `service-05-title`       | `Root Canal Therapy`                                                                  | Card heading | High       |
| `service-05-description` | `[OCR UNCERTAIN: Relieve pain and sa... your natural teeth with precise root canal.]` | Body         | Low        |
| `service-05-link`        | `LEARN MORE`                                                                          | CTA/link     | High       |

---

## 5. Layout Anatomy

### 5.1 Global geometry

| Property                        | Specification                                               | Status              |
| ------------------------------- | ----------------------------------------------------------- | ------------------- |
| Section width                   | Full viewport with centered content container               | OBSERVED / INFERRED |
| Screenshot width                | `1056 px`                                                   | OBSERVED            |
| Section background              | White / near-white                                          | OBSERVED            |
| Main horizontal gutter          | Approximately `37–40 px estimated`                          | INFERRED            |
| Header layout                   | Eyebrow + heading left; View All CTA right                  | OBSERVED            |
| Card layout                     | Five cards in one horizontal row                            | OBSERVED            |
| Number of visible desktop cards | `5`                                                         | OBSERVED            |
| Card widths                     | Visually equal                                              | OBSERVED            |
| Inter-card gap                  | Consistent narrow gap, approximately `10–14 px estimated`   | INFERRED            |
| Card height                     | Approximately `204–210 px estimated` in supplied screenshot | INFERRED            |
| Overflow                        | No horizontal clipping visible                              | OBSERVED            |

---

### 5.2 Structure tree

```text
Section: home-services
├── Section header
│   ├── Text block
│   │   ├── Eyebrow
│   │   └── H2
│   └── View All Services CTA
│
└── Service card collection
    ├── Service Card 01 — Dental Implants
    │   ├── Visual row
    │   │   ├── Circular icon badge
    │   │   └── Dental illustration
    │   ├── Title
    │   ├── Description
    │   └── Learn More + arrow
    │
    ├── Service Card 02 — Teeth Whitening
    ├── Service Card 03 — Orthodontics
    ├── Service Card 04 — Teeth Fillings
    └── Service Card 05 — Root Canal Therapy
```

---

### 5.3 Section header relationship

```text
┌───────────────────────────────────────────────────────────────────────┐
│ OUR DENTAL SERVICES                                                   │
│                                                                       │
│ Comprehensive Care For Your Perfect Smile        [VIEW ALL SERVICES →]│
└───────────────────────────────────────────────────────────────────────┘
```

* OBSERVED — Eyebrow aligns to left edge of the card grid.
* OBSERVED — Heading appears below eyebrow.
* OBSERVED — View All CTA sits at far right.
* OBSERVED — CTA vertically aligns around the heading region rather than eyebrow baseline.
* INFERRED — Section header should use two logical zones:

  * heading/content,
  * section action.

---

### 5.4 Desktop card grid

Approximate topology:

```text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ICON    IMG  │ │ ICON    IMG  │ │ ICON    IMG  │ │ ICON    IMG  │ │ ICON    IMG  │
│              │ │              │ │              │ │              │ │              │
│ TITLE        │ │ TITLE        │ │ TITLE        │ │ TITLE        │ │ TITLE        │
│              │ │              │ │              │ │              │ │              │
│ DESCRIPTION  │ │ DESCRIPTION  │ │ DESCRIPTION  │ │ DESCRIPTION  │ │ DESCRIPTION  │
│              │ │              │ │              │ │              │ │              │
│ LEARN MORE → │ │ LEARN MORE → │ │ LEARN MORE → │ │ LEARN MORE → │ │ LEARN MORE → │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

---

### 5.5 Individual Service Card

| Region               | Position                        | Approx. behavior                               | Status   |
| -------------------- | ------------------------------- | ---------------------------------------------- | -------- |
| Card container       | Entire service item             | White rounded surface                          | OBSERVED |
| Icon badge           | Upper-left                      | Circular dark/royal blue background            | OBSERVED |
| Service illustration | Upper-right                     | Dental asset with transparent/light background | OBSERVED |
| Title                | Below visual region             | Left aligned                                   | OBSERVED |
| Description          | Below title                     | Multi-line                                     | OBSERVED |
| Learn More           | Bottom-left                     | Uppercase blue text                            | OBSERVED |
| Arrow                | Immediately right of Learn More | Small blue arrow                               | OBSERVED |

### Recommended internal card zones

```text
ServiceCard
├── VisualArea
│   ├── IconBadge
│   └── Illustration
│
├── TextArea
│   ├── Title
│   └── Description
│
└── CardAction
    ├── Label
    └── Arrow
```

Avoid positioning title/description/action using independent absolute coordinates. Only decorative visual assets may require controlled positioning.

---

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate                  | Usage                    | Description          | Status                        |
| -------------------------------- | ------------------------ | -------------------- | ----------------------------- |
| `color/surface/services`         | Section background       | White / near-white   | OBSERVED                      |
| `color/surface/service-card`     | Default card             | White                | OBSERVED                      |
| `color/text/service-heading`     | Main H2                  | Dark navy            | OBSERVED                      |
| `color/text/service-title`       | Card headings            | Dark navy            | OBSERVED                      |
| `color/text/service-body`        | Card descriptions        | Muted navy/blue-gray | OBSERVED                      |
| `color/action/primary`           | Links/arrows             | Bright blue          | OBSERVED                      |
| `color/service/icon-surface`     | Circular icon background | Deep royal blue      | OBSERVED                      |
| `color/service/icon`             | Icon line                | White / very pale    | OBSERVED                      |
| `color/service/interactive-fill` | Hover/tap animated fill  | UNKNOWN              | Must be confirmed from design |
| `color/service/interactive-text` | Text during filled state | UNKNOWN              | Must be confirmed             |
| `color/service/interactive-icon` | Icon during filled state | UNKNOWN              | Must be confirmed             |

---

### 6.2 Typography

| Element         | Weight              | Size                 | Alignment | Status   |
| --------------- | ------------------- | -------------------- | --------- | -------- |
| Eyebrow         | `600–700 estimated` | `10–12 px estimated` | Left      | INFERRED |
| Section heading | `600–700 estimated` | `25–30 px estimated` | Left      | INFERRED |
| View All CTA    | `600 estimated`     | `9–11 px estimated`  | Center    | INFERRED |
| Card title      | `600–700 estimated` | `13–15 px estimated` | Left      | INFERRED |
| Description     | `400–500 estimated` | `11–13 px estimated` | Left      | INFERRED |
| Learn More      | `600 estimated`     | `9–11 px estimated`  | Left      | INFERRED |

---

### 6.3 Borders, radius and effects

| Element                | Border                                | Radius                            | Shadow                | Status                    |
| ---------------------- | ------------------------------------- | --------------------------------- | --------------------- | ------------------------- |
| Service card           | Very light boundary or none           | Approximately `8–12 px estimated` | Soft/light shadow     | INFERRED                  |
| Icon badge             | None visible                          | Circle                            | None                  | OBSERVED                  |
| View All CTA           | Very light outline/surface separation | Pill                              | Soft shadow           | OBSERVED / INFERRED       |
| Interactive fill layer | No additional visible border          | Must obey parent's radius         | No independent shadow | USER-SPECIFIED / INFERRED |

---

## 7. Asset Manifest

| Asset ID                     | Visible description                | Required format                      | Placement             | Status   |
| ---------------------------- | ---------------------------------- | ------------------------------------ | --------------------- | -------- |
| `service-implant-icon`       | Implant-related outline icon       | SVG preferred                        | Card 1 badge          | OBSERVED |
| `service-implant-image`      | Dental implant/tooth illustration  | PNG/WebP with transparency preferred | Card 1 upper-right    | OBSERVED |
| `service-whitening-icon`     | Whitening-related line icon        | SVG preferred                        | Card 2 badge          | OBSERVED |
| `service-whitening-image`    | White tooth illustration           | PNG/WebP                             | Card 2 upper-right    | OBSERVED |
| `service-orthodontics-icon`  | Orthodontic line icon              | SVG preferred                        | Card 3 badge          | OBSERVED |
| `service-orthodontics-image` | Clear aligner illustration         | PNG/WebP                             | Card 3 upper-right    | OBSERVED |
| `service-fillings-icon`      | Filling/tooth-related line icon    | SVG preferred                        | Card 4 badge          | OBSERVED |
| `service-fillings-image`     | Tooth treatment illustration       | PNG/WebP                             | Card 4 upper-right    | OBSERVED |
| `service-root-canal-icon`    | Root-canal-related line icon       | SVG preferred                        | Card 5 badge          | OBSERVED |
| `service-root-canal-image`   | Tooth + dental mirror illustration | PNG/WebP                             | Card 5 upper-right    | OBSERVED |
| `arrow-icon`                 | Right arrow                        | SVG preferred                        | View All + Learn More | OBSERVED |

### Asset handling rules

* Store icon and primary service illustration independently.
* Prefer SVG for badge icons.
* Preserve transparent background for dental illustrations where available.
* Do not bake title/description into images.
* Do not flatten entire card into one bitmap.
* Service image dimensions must be controlled by frontend.
* CMS should not expose arbitrary x/y positioning.
* Each service image should support alt-text metadata where appropriate.

---

## 8. Component Contract

### 8.1 Recommended component boundaries

| Component             | Responsibility                         | Reusable? | Status              |
| --------------------- | -------------------------------------- | --------- | ------------------- |
| `HomeServicesSection` | Section orchestration                  | No        | INFERRED            |
| `SectionHeader`       | Eyebrow, heading, View All             | Yes       | INFERRED            |
| `ServiceCardList`     | Ordered service card rendering         | Yes       | INFERRED            |
| `ServiceCard`         | One service tile and interactive state | Yes       | OBSERVED / INFERRED |
| `ServiceIconBadge`    | Circular badge                         | Yes       | INFERRED            |
| `AnimatedFillLayer`   | Bottom-to-top color transition         | Yes       | USER-SPECIFIED      |
| `TextArrowLink`       | Learn More action                      | Yes       | INFERRED            |

---

## 9. Strapi CMS Contract

### 9.1 Recommended modeling approach

This section is structurally different from the previous About mosaic.

For Services, a repeatable ordered component **is appropriate**:

```text
Homepage
└── Services Section
    ├── Eyebrow
    ├── Heading
    ├── View All CTA
    └── Services[]
        ├── Title
        ├── Description
        ├── Icon
        ├── Illustration
        └── CTA
```

The CMS controls data and order.

The frontend controls:

* number of desktop columns,
* card width,
* card height,
* gaps,
* typography,
* animation,
* breakpoint behavior,
* hover/tap states.

---

### 9.2 Section-level Strapi fields

| Field          | Type                                |              Required | Example                                     |
| -------------- | ----------------------------------- | --------------------: | ------------------------------------------- |
| `eyebrow`      | Short text                          |                   Yes | `OUR DENTAL SERVICES`                       |
| `heading`      | Short text                          |                   Yes | `Comprehensive Care For Your Perfect Smile` |
| `viewAllLabel` | Short text                          |                   Yes | `VIEW ALL SERVICES`                         |
| `viewAllLink`  | Link/reference                      | Yes for functionality | UNKNOWN                                     |
| `services`     | Repeatable component / relationship |                   Yes | Five visible items                          |

---

### 9.3 Recommended Service Card model

| Field            | Type           |              Required | Notes                                               |
| ---------------- | -------------- | --------------------: | --------------------------------------------------- |
| `title`          | Short text     |                   Yes | Service name                                        |
| `description`    | Long text      |                   Yes | Short card description                              |
| `icon`           | Media/SVG      |                   Yes | Badge icon                                          |
| `illustration`   | Media          |                   Yes | Dental visual                                       |
| `learnMoreLabel` | Short text     |                   Yes | Default visible value `LEARN MORE`                  |
| `link`           | Link/reference | Yes for functionality | Service detail route                                |
| `slug`           | UID/slug       |           Recommended | Useful if linked to service detail                  |
| `sortOrder`      | Integer        |              Optional | Only if relation ordering is not natively persisted |
| `imageAlt`       | Short text     |           Recommended | Accessibility                                       |

---

### 9.4 Reuse with Services detail/listing

INFERRED — If the website has a dedicated Services content collection in Strapi, homepage cards should preferably reference those entities rather than duplicate content.

Preferred conceptual structure:

```text
Service
├── title
├── slug
├── shortDescription
├── cardIcon
├── cardIllustration
└── ...

Homepage Services Section
├── heading
├── viewAllCTA
└── featuredServices[]
    └── relation → Service
```

This prevents the same Dental Implant/Whitening/etc. content from being independently maintained in multiple locations.

Whether this architecture fits the current Strapi project must be confirmed.

---

## 10. Special Card Animation Specification

## 10.1 Required effect

### Name

`Bottom-to-Top Color Fill`

### Requirement

USER-SPECIFIED — When a card becomes interactive:

```text
DEFAULT

┌───────────────┐
│               │
│               │
│               │
│               │
│_______________│
└───────────────┘


TRANSITION START

┌───────────────┐
│               │
│               │
│               │
│███████████████│
│███████████████│
└───────────────┘


TRANSITION PROGRESS

┌───────────────┐
│               │
│███████████████│
│███████████████│
│███████████████│
│███████████████│
└───────────────┘


ACTIVE / HOVER

┌───────────────┐
│███████████████│
│███████████████│
│███████████████│
│███████████████│
│███████████████│
└───────────────┘
```

The animation must **grow upward from the bottom edge**.

Do not implement it as:

* instant background-color replacement,
* fade-only transition,
* left-to-right wipe,
* top-to-bottom wipe,
* radial expansion,
* scale of the entire card.

---

## 10.2 Recommended visual layering

Conceptual card layering:

```text
ServiceCard
│
├── Layer 1 — Default card background
│
├── Layer 2 — Animated fill
│   └── starts at bottom
│
└── Layer 3 — Card content
    ├── icon
    ├── illustration
    ├── title
    ├── description
    └── CTA
```

Layer rule:

```text
Content
    ↑
Animated Fill
    ↑
Default Surface
```

The fill must stay behind text/assets.

---

## 10.3 Animation geometry

| Property                | Requirement                 | Status                        |
| ----------------------- | --------------------------- | ----------------------------- |
| Origin                  | Bottom edge of card         | USER-SPECIFIED                |
| Direction               | Bottom → Top                | USER-SPECIFIED                |
| Starting visible height | `0%`                        | INFERRED implementation model |
| Final visible height    | `100%`                      | INFERRED implementation model |
| Card geometry           | Must remain stationary      | REQUIRED                      |
| Card dimensions         | Must not change             | REQUIRED                      |
| Neighbor cards          | Must not move               | REQUIRED                      |
| Border radius           | Fill clipped to card radius | REQUIRED                      |
| Layout reflow           | None                        | REQUIRED                      |
| Content stacking        | Content stays above fill    | REQUIRED                      |

Suitable frontend mechanisms include an internal overlay whose vertical reveal is animated.

The specification does not mandate a particular CSS technique.

---

## 10.4 Desktop behavior

### Trigger

`hover`

USER-SPECIFIED.

Expected sequence:

```text
Pointer enters card
        ↓
Activate interactive state
        ↓
Fill begins at bottom edge
        ↓
Fill travels upward
        ↓
Card reaches full active color
```

When pointer leaves:

```text
Pointer leaves
        ↓
Reverse state
        ↓
Fill retreats toward bottom
        ↓
Return to default surface
```

INFERRED — Reverse animation should follow the same spatial direction to avoid an abrupt state reset.

---

## 10.5 Mobile / touch behavior

USER-SPECIFIED — Trigger through tap/click.

Important distinction:

Mobile devices do not provide reliable persistent `hover`.

Therefore frontend should treat this as a **touch/press interaction state**, not depend on `:hover`.

Recommended interaction model:

```text
Touch / pointer down
        ↓
Activate pressed visual state
        ↓
Bottom-to-top fill begins
```

If tapping the card also navigates immediately, the user may only see a brief part of the animation.

Therefore two acceptable implementation models exist:

### Model A — Press feedback

* Tap starts animation.
* Navigation proceeds normally.
* Do not deliberately delay route navigation.
* Animation acts as tactile/visual press feedback.

**Recommended default** unless Product explicitly requires the animation to finish before navigation.

### Model B — Complete animation before navigation

* Tap.
* Run complete fill animation.
* Navigate only after animation finishes.

This introduces artificial navigation latency and therefore must **not** be implemented without explicit Product approval.

---

## 10.6 Keyboard behavior

Desktop keyboard users must receive an equivalent state.

Required trigger:

* `focus-visible`

The card action must not be visually interactive only for mouse users.

Recommended mapping:

| Input method     | Trigger             |
| ---------------- | ------------------- |
| Desktop mouse    | Hover               |
| Desktop keyboard | Focus-visible       |
| Touch/mobile     | Tap / press         |
| Stylus/pointer   | Pointer interaction |

---

## 10.7 Animation timing

Exact motion tokens are not visible in the screenshot and were not supplied.

Therefore:

| Property      | Value                         |
| ------------- | ----------------------------- |
| Duration      | UNKNOWN                       |
| Easing        | UNKNOWN                       |
| Delay         | None recommended, but UNKNOWN |
| Exit duration | UNKNOWN                       |

INFERRED implementation starting range for design review:

* approximately `250–400 ms estimated`,
* smooth ease-out/ease-in-out style movement.

This is **not** a design-confirmed value.

Final motion token requires review.

---

## 10.8 Active-state color transformation

The user specified a **color transition**, but the final color is not visible in the static screenshot.

Therefore:

### Known

* Default card background = white/light.
* Fill originates from bottom.
* Fill covers card upward.

### UNKNOWN

* Final fill color.
* Whether card title becomes white.
* Whether body becomes white.
* Whether `LEARN MORE` becomes white.
* Whether icon badge changes color.
* Whether dental illustration changes opacity.
* Whether arrow changes color.

Do not invent these independently.

Recommended design-system contract:

```text
serviceCard.default.surface
serviceCard.default.title
serviceCard.default.body
serviceCard.default.action

serviceCard.active.surface
serviceCard.active.title
serviceCard.active.body
serviceCard.active.action
serviceCard.active.icon
```

These should be frontend design tokens, **not editable Strapi fields**.

---

## 10.9 Reduced motion

Accessibility requirement:

When `prefers-reduced-motion` is enabled:

* do not require the full wipe animation,
* state may switch using a minimal/no-motion color change,
* content and functionality must remain identical.

The hover/active state must not depend on movement to communicate interactivity.

---

## 11. Responsive Specification

### 11.1 Evidence available

* Desktop: OBSERVED.
* Tablet: UNKNOWN.
* Mobile: UNKNOWN.
* Mobile tap interaction: USER-SPECIFIED.

---

### 11.2 Required desktop layout

* Five cards remain in one horizontal row at the supplied desktop viewport.
* Cards use visually equal widths.
* Card top/bottom edges align.
* Visual area remains at top.
* Titles remain below illustrations.
* Description heights should not cause Learn More links to float inconsistently.
* Learn More actions should visually align near card bottoms.
* View All CTA remains aligned to right section header.

---

### 11.3 Proposed responsive behavior

| Range   | Layout                   | Interaction                            | Status                                      |
| ------- | ------------------------ | -------------------------------------- | ------------------------------------------- |
| Desktop | Five-card horizontal row | Hover + keyboard focus                 | OBSERVED / USER-SPECIFIED                   |
| Tablet  | UNKNOWN                  | Tap                                    | UNKNOWN layout                              |
| Mobile  | UNKNOWN                  | Tap/click activates bottom-to-top fill | USER-SPECIFIED interaction / UNKNOWN layout |

Do not select a mobile carousel solely because five cards exist.

Potential layouts requiring design approval:

* stacked single-column cards,
* two-column grid,
* horizontal swipe carousel,
* partial-card horizontal scroll.

No supplied evidence selects among these.

---

## 12. Semantic HTML and Accessibility

### Recommended structure

* Section:

  * semantic section associated with H2.
* H2:

  * `Comprehensive Care For Your Perfect Smile`.
* Services:

  * semantic list/list items if appropriate to application architecture.
* Card action:

  * link if it navigates to service detail.
* View All:

  * link if it navigates to service listing.
* Images:

  * informative dental illustrations require appropriate alt treatment if content-bearing.
* Decorative badge icons:

  * can be hidden from assistive technology when redundant with service title.

### Interaction accessibility

* Do not make a `div` clickable.
* Ensure entire clickable-card behavior, if adopted, has valid link semantics.
* `LEARN MORE` must remain understandable out of visual context.
* Focus state must be visible.
* Keyboard focus should trigger equivalent active visual treatment.
* Animation cannot cause layout shift.
* Respect reduced-motion preferences.

---

## 13. Implementation Constraints

### Layout

* Keep five equal desktop service-card slots.
* Do not use masonry for this section.
* Use a consistent card-height strategy.
* Description length must not alter neighboring card dimensions.
* Align action region predictably near card bottom.
* Do not scale cards on hover unless separately approved.
* Do not shift cards vertically during color animation.
* Keep section header CTA independent from service-card grid.

### CMS

* Services can be repeatable/orderable.
* Strapi stores:

  * title,
  * description,
  * icon,
  * illustration,
  * link/slug.
* Frontend stores:

  * card dimensions,
  * grid,
  * typography,
  * color tokens,
  * motion,
  * responsive behavior.
* Do not expose animation duration/color/easing to standard CMS editors unless there is a documented product requirement.
* Do not let individual editors select arbitrary animation types per service.
* Every service should use the same interaction pattern.

### Animation

* Bottom → top only.
* Fill occurs inside card bounds.
* Clip animation to rounded border.
* Content remains above fill.
* No layout reflow.
* No page scroll interference.
* Desktop = hover.
* Keyboard = focus.
* Mobile = tap/press.
* Avoid relying on CSS hover on touch devices.
* Do not delay mobile navigation merely to show the animation unless Product approves.
* Respect reduced-motion preference.

---

## 14. Visual Acceptance Criteria

### Section

* [ ] Eyebrow reads `OUR DENTAL SERVICES`.
* [ ] Heading reads `Comprehensive Care For Your Perfect Smile`.
* [ ] View All CTA appears on the right side of heading area.
* [ ] Five cards appear in one horizontal desktop row.
* [ ] Card widths are visually equal.
* [ ] Gaps are consistent.
* [ ] Card radius/shadow match reference.
* [ ] No card becomes taller due solely to longer text.

### Card anatomy

* [ ] Every card has circular icon badge at upper-left.
* [ ] Every card has dental illustration at upper-right/top area.
* [ ] Title appears below visual region.
* [ ] Description appears below title.
* [ ] Learn More appears near card bottom.
* [ ] Arrow appears beside Learn More.
* [ ] Visual assets do not overflow rounded boundaries.

### Copy

* [ ] `Dental Implants`
* [ ] `Teeth Whitening`
* [ ] `Orthodontics`
* [ ] `Teeth Fillings`
* [ ] `Root Canal Therapy`
* [ ] All confirmed descriptions use CMS/source copy.
* [ ] Root Canal description is confirmed before replacing `[OCR UNCERTAIN]` content.

### Desktop interaction

* [ ] Hovering each card starts a bottom-to-top fill.
* [ ] Fill starts exactly at card bottom.
* [ ] Fill moves upward.
* [ ] Fill does not fade in uniformly.
* [ ] Fill does not enter from left/right/top.
* [ ] Card dimensions remain fixed.
* [ ] Adjacent cards do not move.
* [ ] Content remains visible above fill.
* [ ] Leaving hover cleanly returns card to default state.
* [ ] Keyboard focus receives equivalent visual feedback.

### Mobile interaction

* [ ] Mobile does not depend on hover.
* [ ] Tap/press triggers bottom-to-top state.
* [ ] Interaction does not create accidental double-tap requirements unless intentionally specified.
* [ ] Navigation is not artificially delayed without Product approval.
* [ ] Reduced-motion users receive a functional non-motion state.

---

## 15. Visual Risks

| Risk                                              | Why it affects fidelity/UX                 | Mitigation                                             | Priority |
| ------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------ | -------- |
| Implementing simple `background-color` transition | Loses required bottom-to-top visual motion | Use dedicated animated fill layer                      | High     |
| Using hover on mobile                             | Touch behavior becomes inconsistent/stuck  | Explicit pointer/tap active state                      | High     |
| Delaying navigation for animation                 | Introduces UX latency                      | Use press-feedback model unless Product approves delay | High     |
| Animating card height/transform                   | Causes grid instability                    | Animate only internal visual layer                     | High     |
| Wrong stacking order                              | Fill hides content                         | Keep content above fill layer                          | High     |
| Missing radius clipping                           | Animated color leaks outside card          | Parent clipping required                               | High     |
| Final active color guessed                        | May conflict with Figma                    | Confirm active-state design token                      | High     |
| Text remains dark over dark fill                  | Contrast/accessibility failure             | Confirm active text palette                            | High     |
| Arbitrary per-card animations from CMS            | Creates inconsistent UI                    | Motion remains frontend-owned                          | Medium   |
| Unequal descriptions alter CTA position           | Card row looks unaligned                   | Use predictable internal vertical layout               | High     |
| Generic service data duplicated in Homepage       | CMS maintenance burden                     | Prefer relations to canonical Service collection       | Medium   |
| Using raster icons when SVG exists                | Visual degradation                         | Export source vectors                                  | Medium   |
| Root Canal description guessed from blur          | Incorrect production copy                  | Confirm source text in Figma/Strapi                    | Medium   |

---

## 16. Open Questions

| ID  | Question                                                                       | Blocking level                                   | Suggested owner      |
| --- | ------------------------------------------------------------------------------ | ------------------------------------------------ | -------------------- |
| Q1  | What exact color should fill the service card during hover/tap?                | Blocking for interaction fidelity                | Designer             |
| Q2  | What colors should title, body, Learn More and arrow use after fill completes? | Blocking                                         | Designer             |
| Q3  | Does circular icon badge change during hover/tap?                              | Non-blocking initially                           | Designer             |
| Q4  | Does dental illustration change color/opacity/position during interaction?     | Non-blocking initially                           | Designer             |
| Q5  | What exact animation duration/easing is required?                              | Non-blocking for first prototype                 | Designer             |
| Q6  | Should tapping anywhere on a card navigate, or only `LEARN MORE`?              | Blocking for interaction                         | Product              |
| Q7  | Should mobile navigation wait until animation finishes?                        | Blocking only if complete animation is mandatory | Product              |
| Q8  | What is the exact Root Canal Therapy description?                              | Blocking for accurate copy                       | Product / Designer   |
| Q9  | What destination does `VIEW ALL SERVICES` use?                                 | Blocking for functionality                       | Product              |
| Q10 | Are homepage cards relations to canonical Strapi `Service` entries?            | Architecture decision                            | Developer            |
| Q11 | Can editors choose which services appear on homepage?                          | Non-blocking                                     | Product              |
| Q12 | What is the maximum number of featured homepage services?                      | Non-blocking                                     | Product / Designer   |
| Q13 | What should happen if Strapi has fewer/more than five featured services?       | Important responsive/data rule                   | Designer / Developer |
| Q14 | What is the approved tablet card layout?                                       | Blocking for tablet                              | Designer             |
| Q15 | What is the approved mobile card layout?                                       | Blocking for mobile                              | Designer             |

---

# Strapi Handoff Summary

## Recommended data hierarchy

```text
Homepage
└── Services Section
    ├── Eyebrow
    ├── Heading
    ├── View All CTA
    │   ├── Label
    │   └── Destination
    │
    └── Featured Services[]
        └── Service
            ├── Title
            ├── Slug / Destination
            ├── Short Description
            ├── Card Icon
            └── Card Illustration
```

Preferred when a canonical service collection already exists:

```text
HomepageServicesSection
└── featuredServices[]
        ↓ relation
Service Collection
├── Dental Implants
├── Teeth Whitening
├── Orthodontics
├── Teeth Fillings
└── Root Canal Therapy
```

## CMS versus frontend responsibility

| Responsibility                    | Strapi | Frontend |
| --------------------------------- | :----: | :------: |
| Service title                     |    ✅   |          |
| Description                       |    ✅   |          |
| Icon                              |    ✅   |          |
| Illustration                      |    ✅   |          |
| Link/slug                         |    ✅   |          |
| Featured service order            |    ✅   |          |
| View All copy/link                |    ✅   |          |
| Number of desktop columns         |        |     ✅    |
| Equal card dimensions             |        |     ✅    |
| Card padding                      |        |     ✅    |
| Radius/shadow                     |        |     ✅    |
| Hover fill color token            |        |     ✅    |
| Bottom-to-top motion              |        |     ✅    |
| Animation easing/duration         |        |     ✅    |
| Touch handling                    |        |     ✅    |
| Responsive grid/carousel behavior |        |     ✅    |

---

# Animation Handoff Summary

The coding agent must treat the interaction as:

```text
SERVICE CARD
     │
     ├── Default = white/light card
     │
     └── Interactive
            │
            ├── Desktop mouse → hover
            ├── Keyboard → focus-visible
            └── Mobile/touch → press/tap
                         │
                         ▼
                ┌────────────────┐
                │ Fill starts at │
                │ BOTTOM edge    │
                └───────┬────────┘
                        │
                        ▼
                  moves upward
                        │
                        ▼
                Full active state
```

### Mandatory

**Bottom → Top.**

### Not acceptable

* Instant color switch.
* Uniform fade.
* Left → right wipe.
* Right → left wipe.
* Top → bottom wipe.
* Card scale instead of fill.
* Hover-only implementation on touch devices.

### Mobile-specific

Use the animation as tap/press feedback by default. Do **not** delay navigation just so the user can watch the complete animation unless this behavior is explicitly approved.

### Final design dependency

The motion direction and triggers are defined. The following still require design confirmation before final visual sign-off:

* active card fill color,
* active title color,
* active body color,
* active CTA color,
* active icon behavior,
* active illustration behavior,
* duration,
* easing.
