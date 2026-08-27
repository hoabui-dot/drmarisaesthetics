# UI Implementation Spec — About Us Mission & Vision Section

## 1. Identity

| Field                       | Value                                                                                                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | Existing **About Us route in current codebase**                                                                                                                                         |
| Section ID                  | `about-mission-vision`                                                                                                                                                                  |
| Section name                | `About Us Mission & Vision`                                                                                                                                                             |
| Position in page            | **Immediately after `about-hero`**                                                                                                                                                      |
| Section type                | Single large Mission/Vision information card                                                                                                                                            |
| Desktop composition         | `Mission 50% / Vision 50%` inside one shared outer container                                                                                                                            |
| Background media            | Light dental-clinic image integrated into the **right side of the parent card**                                                                                                         |
| CMS integration             | Strapi CMS                                                                                                                                                                              |
| Primary implementation goal | Reproduce the supplied desktop Mission/Vision card while keeping Mission and Vision as explicit, semantically stable content groups and preserving the right-side background-image fade |
| Overall evidence quality    | High for desktop structure; Medium for exact typography/spacing; Low for responsive behavior                                                                                            |

> **Critical component rule:** This section is **one shared outer card**, not two separate cards. `Our Mission` occupies the left half and `Our Vision` occupies the right half, separated by one vertical divider.

> **Critical CMS rule:** Mission and Vision should be modeled as **explicit named fields/components**, not as an arbitrary sortable list. Editors should not be able to accidentally swap Mission and Vision order.

> **Critical visual rule:** The dental-clinic image visible behind the right side is a **background/supporting image of the parent section/card**, with a strong white fade so text remains readable. It is not a separate image card.

---

# 2. Scope Boundary

## Included

* OBSERVED — One large rounded rectangular outer container.
* OBSERVED — Thin pale-blue outer border.
* OBSERVED — White/light background.
* OBSERVED — Two information regions:

  * `Our Mission`
  * `Our Vision`
* OBSERVED — Circular blue icon for Mission.
* OBSERVED — Target/bullseye icon for Mission.
* OBSERVED — Circular blue icon for Vision.
* OBSERVED — Eye icon for Vision.
* OBSERVED — One vertical divider between Mission and Vision.
* OBSERVED — Heading + paragraph structure in each half.
* OBSERVED — Right-side dental-clinic background image.
* OBSERVED — Background image is heavily faded/washed into white.
* OBSERVED — Mission half remains almost fully white.
* OBSERVED — Vision text remains above the background image layer.
* USER-SPECIFIED — Section appears directly after About Hero.
* INFERRED — Mission/Vision content should be editable in Strapi.
* INFERRED — Icons should preferably remain frontend/design-system assets rather than arbitrary CMS uploads unless the existing page builder manages icons through media.

## Excluded

* UNKNOWN — Hover states.
* UNKNOWN — card animation.
* UNKNOWN — scroll reveal.
* UNKNOWN — mobile layout.
* UNKNOWN — tablet layout.
* UNKNOWN — whether the background image changes periodically.
* UNKNOWN — whether Mission/Vision link to additional pages.
* UNKNOWN — whether icons animate.
* UNKNOWN — exact background-position token.

---

# 3. Evidence and Confidence

| Item                           | Status   | Evidence / reason                                |
| ------------------------------ | -------- | ------------------------------------------------ |
| Single outer card              | OBSERVED | Both content blocks share one border/radius      |
| Two-column layout              | OBSERVED | Mission left, Vision right                       |
| Vertical divider               | OBSERVED | Thin line between both regions                   |
| Mission icon                   | OBSERVED | Target icon inside blue circle                   |
| Vision icon                    | OBSERVED | Eye icon inside blue circle                      |
| Right background image         | OBSERVED | Dental clinic visible behind Vision region       |
| White fade over image          | OBSERVED | Image becomes very light behind text             |
| Exact image implementation     | UNKNOWN  | Could be asset with fade baked in or overlay     |
| CMS fixed Mission/Vision model | INFERRED | Semantically safer than generic repeatable items |
| Typography exact values        | INFERRED | Relative hierarchy visible                       |
| Responsive behavior            | UNKNOWN  | Only desktop screenshot supplied                 |

---

# 4. OCR Content Inventory

## 4.1 Mission

### Heading

`Our Mission`

Confidence: High.

### Body

Visible text:

`To deliver world-class, patient-centered dental care by combining advanced technology, clinical precision, and genuine compassion—ensuring every patient enjoys a healthy smile and greater confidence for life.`

Confidence: High.

---

# 4.2 Vision

### Heading

`Our Vision`

Confidence: High.

### Body

Visible text:

`To become the leading and most trusted dental destination in Vietnam and the region, recognized for innovation, clinical excellence, and an unparalleled patient experience that sets the standard in modern dental care.`

Confidence: High.

---

# 5. Layout Anatomy

## 5.1 Global geometry

| Property                   | Specification                                | Status              |
| -------------------------- | -------------------------------------------- | ------------------- |
| Section width              | Centered within About page content container | OBSERVED / INFERRED |
| Outer card width           | Approximately `75–80%` of screenshot width   | INFERRED            |
| Outer card height          | Compact horizontal information card          | OBSERVED            |
| Background                 | White/light with right-side clinic imagery   | OBSERVED            |
| Border                     | Thin pale-blue                               | OBSERVED            |
| Radius                     | Large, approximately `16–20 px estimated`    | INFERRED            |
| Main layout                | Two columns                                  | OBSERVED            |
| Column ratio               | Approximately `50 / 50`                      | INFERRED            |
| Divider                    | Vertical, centered between columns           | OBSERVED            |
| Content vertical alignment | Near top/center within card                  | OBSERVED            |
| Overflow                   | Rounded container clips background media     | REQUIRED            |

---

# 5.2 Structure tree

```text
Section: about-mission-vision
└── MissionVisionCard
    ├── BackgroundLayer
    │   └── DentalClinicImage
    │       └── fade / low-opacity treatment
    │
    ├── MissionBlock
    │   ├── IconCircle
    │   │   └── TargetIcon
    │   └── Content
    │       ├── Heading: Our Mission
    │       └── Description
    │
    ├── VerticalDivider
    │
    └── VisionBlock
        ├── IconCircle
        │   └── EyeIcon
        └── Content
            ├── Heading: Our Vision
            └── Description
```

---

# 5.3 Desktop topology

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   ( TARGET )   Our Mission             │   ( EYE )   Our Vision              │
│                Mission body...         │             Vision body...           │
│                Mission body...         │             Vision body...           │
│                Mission body...         │             Vision body...           │
│                                       │                                      │
│                                       │             FADED CLINIC IMAGE         │
│                                       │                 behind content         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 5.4 Internal alignment

Both halves use the same content pattern:

```text
Icon
   ↓
aligned beside
   ↓
Heading + Paragraph
```

More precisely:

```text
┌───────┐  Heading
│ ICON  │  Paragraph...
└───────┘  Paragraph...
```

The icon is **not positioned above the heading**.

It is horizontally adjacent to the text block.

---

# 6. Mission Block

## 6.1 Layout

```text
MissionBlock
├── Icon
└── Text
    ├── Our Mission
    └── description
```

### Icon

* Large circular blue surface.
* White target/bullseye line icon.
* Positioned toward upper-left of Mission half.
* Icon circle substantially larger than body text line-height.
* Soft visual depth/shadow may be present.

### Heading

`Our Mission`

* dark navy,
* bold/semibold,
* positioned near top of content block.

### Description

* dark/muted navy,
* multiple lines,
* left aligned,
* width constrained.

---

# 6.2 Approximate Mission proportions

| Region    | Approximate behavior             |
| --------- | -------------------------------- |
| Icon area | `~20–24%` of inner Mission width |
| Text area | `~70–75%`                        |
| Gap       | Medium                           |

Status: INFERRED from screenshot.

Do not force the icon and text into equal-width columns.

---

# 7. Vision Block

## 7.1 Layout

Same structural pattern as Mission:

```text
VisionBlock
├── Icon
└── Text
    ├── Our Vision
    └── description
```

### Icon

* Blue circular surface.
* White eye icon.
* Same dimensions as Mission icon.
* Visually aligned with Mission icon on desktop.

### Heading

`Our Vision`

* same typography class as Mission heading.

### Description

* same body typography as Mission paragraph.
* slightly longer text but should not change card geometry.

---

# 8. Vertical Divider

## 8.1 Appearance

The divider:

* is thin,
* pale blue / light gray,
* positioned between Mission and Vision,
* does not touch exact top/bottom edges of outer card,
* begins below outer card top padding,
* ends above outer card bottom padding.

Conceptually:

```text
Mission Content       Vision Content
                    │
                    │
                    │
                    │
```

Not:

```text
Mission Content █████ Vision Content
```

Keep the divider subtle.

---

# 9. Background Image Specification

## 9.1 Critical role

The clinic photograph is **not a separate card or content image**.

It is a visual background/supporting layer.

Recommended hierarchy:

```text
MissionVisionCard
├── background image
└── foreground Mission/Vision content
```

---

# 9.2 Visible source content

The image appears to show:

* bright dental clinic interior,
* dental chairs,
* ceiling lighting,
* white/blue clinical environment,
* equipment along the right side.

The image is intentionally low-contrast.

---

# 9.3 Placement

Image concentration:

```text
LEFT                                         RIGHT
white / clean            →        dental clinic visible
```

It should be strongest near:

* upper-right,
* far-right,
* lower-right.

It should fade toward the center divider.

---

# 9.4 Fade treatment

Reference visual:

```text
Mission              Vision
WHITE        WHITE / FADE → CLINIC IMAGE
```

Possible implementation models:

### Option A — source image already contains fade

Preferred if Figma export provides the exact composite asset.

### Option B — raw image + controlled gradient overlay

If source image is un-faded:

```text
white → transparent
```

overlay can be used to reproduce the screenshot.

Status: implementation UNKNOWN.

### Rule

Inspect the original image first.

Do not apply a second strong overlay if the supplied asset already has the fade baked in.

---

# 9.5 Background positioning

Recommended visual target:

* image anchored to right,
* image does not intrude heavily behind Mission text,
* Vision content retains strong contrast,
* no image cropping that removes the recognizable clinical setting.

---

# 10. Outer Container Specification

## 10.1 Appearance

| Property   | Specification                                   | Status   |
| ---------- | ----------------------------------------------- | -------- |
| Background | White / translucent-white over background layer | OBSERVED |
| Border     | Thin pale blue                                  | OBSERVED |
| Radius     | `~18 px estimated`                              | INFERRED |
| Shadow     | Very subtle / none                              | INFERRED |
| Overflow   | Hidden for background image                     | REQUIRED |

---

# 10.2 Important layering nuance

The outer card needs to simultaneously allow:

* the background image to remain clipped by the card radius,
* Mission/Vision content to remain above the background,
* divider to remain above background,
* no text opacity reduction.

Conceptual z-order:

```text
Foreground content
        ↑
Divider
        ↑
Fade layer
        ↑
Background image
        ↑
Card surface
```

---

# 11. Visual Specification

## 11.1 Colors

| Token candidate               | Usage                   | Description               | Status   |
| ----------------------------- | ----------------------- | ------------------------- | -------- |
| `color/about-mv/card-surface` | Parent card             | White / near-white        | OBSERVED |
| `color/about-mv/border`       | Outer border            | Pale blue                 | OBSERVED |
| `color/about-mv/divider`      | Center divider          | Pale blue-gray            | OBSERVED |
| `color/about-mv/heading`      | Mission/Vision headings | Deep navy                 | OBSERVED |
| `color/about-mv/body`         | Paragraph text          | Muted navy                | OBSERVED |
| `color/about-mv/icon-bg`      | Icon circle             | Strong royal/medical blue | OBSERVED |
| `color/about-mv/icon`         | Target/eye              | White                     | OBSERVED |

---

# 11.2 Typography

| Element                | Weight               | Approx. size         | Status   |
| ---------------------- | -------------------- | -------------------- | -------- |
| Mission/Vision heading | `600–700 estimated`  | `23–27 px estimated` | INFERRED |
| Body paragraph         | `400–500 estimated`  | `13–15 px estimated` | INFERRED |
| Body line-height       | `~1.6–1.8 estimated` | —                    | INFERRED |

Use the existing global font family.

Do not introduce a separate typeface for this component.

---

# 12. Icon Specification

## 12.1 Mission icon

Concept:

```text
target / goal / bullseye
```

* white line icon,
* blue circular surface.

---

## 12.2 Vision icon

Concept:

```text
eye / vision
```

* white line icon,
* blue circular surface.

---

# 12.3 Icon ownership

Preferred implementation:

```text
Frontend design system
├── target icon
└── eye icon
```

Strapi does not need editors to select arbitrary icons.

If the site already uses CMS-managed icon media consistently, reuse that architecture.

Do not create an unrestricted icon upload if it would allow inconsistent visual styles.

---

# 13. Strapi CMS Contract

## 13.1 Recommended model

Because Mission and Vision have fixed meanings, use explicit fields:

```text
About Page
└── Mission Vision Section
    ├── backgroundImage
    │
    ├── mission
    │   ├── title
    │   └── description
    │
    └── vision
        ├── title
        └── description
```

---

# 13.2 Recommended Strapi fields

| Field                | Type       | Required |
| -------------------- | ---------- | -------: |
| `backgroundImage`    | Media      |      Yes |
| `missionTitle`       | Short text |      Yes |
| `missionDescription` | Long text  |      Yes |
| `visionTitle`        | Short text |      Yes |
| `visionDescription`  | Long text  |      Yes |

Alternative with nested components:

```text
mission
vision
```

is also appropriate if the project page builder prefers nested reusable components.

---

# 13.3 Do not model as generic sortable list

Avoid:

```text
items[]
├── title
├── description
└── icon
```

because an editor could create:

```text
Vision
Mission
Mission
Mission
```

or reorder them.

This component has a fixed semantic contract:

```text
LEFT  = Mission
RIGHT = Vision
```

on desktop.

---

# 13.4 Icons in CMS

Recommended:

```text
mission icon = frontend fixed target icon
vision icon = frontend fixed eye icon
```

No CMS fields required.

Only expose icon fields if the broader project already uses CMS-configurable icon media consistently.

---

# 14. Content Behavior

## Static structural behavior

Frontend controls:

* Mission appears first/left.
* Vision appears second/right.
* target icon maps to Mission.
* eye icon maps to Vision.
* divider remains between them.

## CMS-editable content

* Mission title.
* Mission paragraph.
* Vision title.
* Vision paragraph.
* background image.

---

# 15. Component Contract

| Component                   | Responsibility                       | Reusable?     |
| --------------------------- | ------------------------------------ | ------------- |
| `AboutMissionVisionSection` | Section wrapper                      | Page-specific |
| `MissionVisionCard`         | Shared outer container/background    | Potentially   |
| `MissionVisionItem`         | Icon + heading + description pattern | Yes           |
| `MissionIcon`               | Target visual                        | Yes           |
| `VisionIcon`                | Eye visual                           | Yes           |
| `VerticalDivider`           | Desktop separation                   | Yes           |

Recommended:

```text
AboutMissionVisionSection
└── MissionVisionCard
    ├── MissionVisionItem variant="mission"
    ├── Divider
    └── MissionVisionItem variant="vision"
```

The **data should remain explicit** even if the visual item component itself is reusable.

---

# 16. CMS vs Frontend Responsibility

| Responsibility              | Strapi |     Frontend     |
| --------------------------- | :----: | :--------------: |
| Mission heading             |    ✅   |                  |
| Mission description         |    ✅   |                  |
| Vision heading              |    ✅   |                  |
| Vision description          |    ✅   |                  |
| Clinic background image     |    ✅   |                  |
| Mission left / Vision right |        |         ✅        |
| Icon mapping                |        |    ✅ preferred   |
| Vertical divider            |        |         ✅        |
| Icon circle styling         |        |         ✅        |
| Background fade             |        | ✅ / source asset |
| Border/radius               |        |         ✅        |
| Responsive layout           |        |         ✅        |

---

# 17. Responsive Specification

## 17.1 Evidence available

| Viewport | Evidence |
| -------- | -------- |
| Desktop  | High     |
| Tablet   | UNKNOWN  |
| Mobile   | UNKNOWN  |

---

# 17.2 Required desktop behavior

Desktop remains:

```text
[ Mission ] │ [ Vision ]
```

* one outer card,
* same row,
* divider in center,
* equal/near-equal halves,
* background image primarily behind Vision side.

---

# 17.3 Mobile structural fallback

A logical narrow-screen layout would be:

```text
Mission
────────
Vision
```

inside the same shared parent card.

Status: `INFERRED`.

If this pattern is adopted:

* replace vertical divider with horizontal divider,
* icon/text can remain horizontally aligned where space permits,
* background image should remain subtle and must not impair readability.

Exact mobile specification requires design approval.

---

# 17.4 Do not create separate CMS content for mobile

Avoid:

```text
mobileMission
mobileVision
```

Same content should render responsively.

---

# 18. Semantic HTML and Accessibility

## Section

Use a semantic section associated with meaningful content hierarchy.

## Mission/Vision headings

They should use appropriate heading levels beneath the About page H1.

For example:

```text
About Us H1
└── Our Mission / Our Vision
```

exact heading level depends on surrounding page hierarchy.

---

## Icons

Target and eye icons are decorative because headings identify the concepts.

Therefore they should not produce redundant screen-reader output.

---

## Background image

The dental-clinic background is decorative/supporting.

It should not require verbose alt text if implemented as a CSS/background layer.

Do not expose background image OCR to screen readers.

---

# 19. Interaction States

This screenshot provides no evidence of interactive behavior.

Therefore:

| Element          | Behavior |
| ---------------- | -------- |
| Mission          | Static   |
| Vision           | Static   |
| Icons            | Static   |
| Parent card      | Static   |
| Background image | Static   |

Do not introduce:

* hover lift,
* card flip,
* tab switching,
* Mission/Vision toggle,
* icon animation,
* parallax.

---

# 20. Implementation Constraints

1. Place directly after `about-hero`.
2. Render as **one shared outer rounded card**.
3. Mission occupies left side on desktop.
4. Vision occupies right side on desktop.
5. Preserve one vertical divider.
6. Do not create two independent bordered cards.
7. Mission uses target icon.
8. Vision uses eye icon.
9. Preserve same icon-circle dimensions.
10. Clinic media is a background/supporting layer, not a third card.
11. Background media must remain strongest on the right.
12. Maintain strong white fade behind text.
13. Do not reduce text opacity just to simulate the background fade.
14. Model Mission and Vision explicitly in Strapi.
15. Do not expose them as arbitrary sortable repeated blocks.
16. CMS owns textual content/background media.
17. Frontend owns fixed semantics and geometry.

---

# 21. Visual Acceptance Criteria

## Section placement

* [ ] Section renders immediately after About Hero.
* [ ] Adequate whitespace separates hero and card according to design.

## Outer card

* [ ] One single outer container.
* [ ] Pale-blue border.
* [ ] Large rounded corners.
* [ ] White/light surface.
* [ ] Background image stays clipped to outer radius.
* [ ] No two-card appearance is introduced.

## Mission

* [ ] Target icon appears in blue circle.
* [ ] Heading reads `Our Mission`.
* [ ] Mission paragraph matches approved content.
* [ ] Icon appears left of Mission text.
* [ ] Mission content remains highly readable.

## Divider

* [ ] One thin vertical divider appears.
* [ ] Divider is pale/light.
* [ ] Divider does not touch outer card boundaries.

## Vision

* [ ] Eye icon appears in blue circle.
* [ ] Heading reads `Our Vision`.
* [ ] Vision paragraph matches approved content.
* [ ] Icon appears left of Vision text.

## Background

* [ ] Dental clinic image appears toward right side.
* [ ] Image remains subtle.
* [ ] Fade prevents image detail from competing with Vision paragraph.
* [ ] Background does not significantly appear behind Mission content.
* [ ] Background does not become a separate media card.

---

# 22. Visual / Architecture Risks

| Risk                                         | Why it affects fidelity               | Mitigation                     | Priority |
| -------------------------------------------- | ------------------------------------- | ------------------------------ | -------- |
| Building two separate cards                  | Breaks reference composition          | Single parent card             | High     |
| Generic repeatable Mission/Vision list       | Editors can reorder semantic content  | Explicit CMS fields            | High     |
| Background too opaque                        | Vision text becomes difficult to read | Preserve strong white fade     | High     |
| Background spans strongly behind Mission     | Changes screenshot balance            | Anchor media to right          | High     |
| Hard divider full card height                | Looks heavier than reference          | Respect inner padding          | Medium   |
| Icons uploaded arbitrarily                   | Design inconsistency                  | Fixed frontend icon mapping    | Medium   |
| Mission/Vision unequal card heights          | Breaks horizontal alignment           | One shared parent container    | High     |
| Background rendered as `<img>` beside Vision | Creates third-column behavior         | Use background layer           | High     |
| Separate mobile CMS fields                   | Unnecessary content duplication       | Same data, responsive frontend | Medium   |
| Added hover/animation                        | Unsupported by screenshot             | Keep static                    | Medium   |

---

# 23. Open Questions

| ID | Question                                                                               | Blocking level                       | Suggested owner |
| -- | -------------------------------------------------------------------------------------- | ------------------------------------ | --------------- |
| Q1 | Can the exact faded dental-clinic background asset be exported from Figma?             | Blocking for final fidelity          | Designer        |
| Q2 | Is the white fade baked into the source image or applied by frontend overlay?          | Important                            | Designer        |
| Q3 | Are Mission/Vision icons existing assets in the codebase?                              | Non-blocking                         | Developer       |
| Q4 | Should Mission and Vision titles remain editable in Strapi or only their descriptions? | CMS decision                         | Product         |
| Q5 | Is the section always fixed to exactly Mission + Vision?                               | Expected yes; confirm for CMS schema | Product         |
| Q6 | What is the approved tablet stacking behavior?                                         | Blocking for tablet                  | Designer        |
| Q7 | What is the approved mobile layout?                                                    | Blocking for mobile                  | Designer        |

---

# 24. Strapi Handoff Summary

## Recommended model

```text
About Page
└── Mission Vision Section
    │
    ├── backgroundImage
    │
    ├── mission
    │   ├── title: Our Mission
    │   └── description
    │
    └── vision
        ├── title: Our Vision
        └── description
```

Frontend provides:

```text
mission → target icon
vision  → eye icon
```

---

# 25. Desktop Layout Handoff

```text
ONE SHARED CARD

┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ●  Our Mission                   │   ●  Our Vision                 │
│      Mission paragraph...          │      Vision paragraph...        │
│      Mission paragraph...          │      Vision paragraph...        │
│                                    │                                 │
│                                    │          FADED CLINIC IMAGE      │
│                                    │            IN BACKGROUND         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
      TARGET ICON                    │        EYE ICON
```

---

# 26. Data-to-UI Contract

```text
missionTitle
missionDescription
        │
        ▼
LEFT HALF


visionTitle
visionDescription
        │
        ▼
RIGHT HALF


backgroundImage
        │
        ▼
RIGHT-SIDE BACKGROUND LAYER
```

No editor-configurable reordering is required.

---

# 27. Mandatory Coding-Agent Rules

1. Create `about-mission-vision` immediately after `about-hero`.
2. Use **one parent card**, not two cards.
3. Desktop layout is approximately `50% Mission / 50% Vision`.
4. Mission remains on the left.
5. Vision remains on the right.
6. Add one subtle vertical divider between both blocks.
7. Mission uses blue circular target icon.
8. Vision uses blue circular eye icon.
9. Icons sit beside headings/content, not above as independent cards.
10. Use the dental-clinic image as a **parent-card background/supporting layer**.
11. Keep the background image concentrated toward the right side.
12. Preserve strong white/light fade for text readability.
13. Do not invent hover, tabs or animation.
14. Model Mission and Vision as explicit Strapi fields/components.
15. Do not use an arbitrary sortable list for Mission/Vision.
16. Strapi controls copy and background media; frontend controls semantic placement, icons, divider and responsive geometry.
