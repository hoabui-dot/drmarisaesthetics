# UI Implementation Spec — About Us Core Values Section

## 1. Identity

| Field                        | Value                                                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Route                        | Existing **About Us route in current codebase**                                                                       |
| Section ID                   | `about-core-values`                                                                                                   |
| Section name                 | `About Us Core Values`                                                                                                |
| Position in page             | **Immediately after `about-mission-vision`**                                                                          |
| Section type                 | Centered heading + repeatable Core Value cards                                                                        |
| Reference desktop card count | `6`                                                                                                                   |
| Desktop composition          | One horizontal row of six equal cards                                                                                 |
| CMS integration              | Strapi CMS                                                                                                            |
| Primary implementation goal  | Reproduce the clean six-card Core Values presentation while keeping value content editable and ordered through Strapi |
| Overall evidence quality     | High for desktop structure and card anatomy; Medium for exact spacing/typography; Low for responsive behavior         |

> **Critical layout rule:** At the supplied full desktop viewport, the section shows **six equal Core Value cards in one horizontal row**.

> **Critical card rule:** These are six independent but visually uniform cards. Unlike the previous Mission/Vision section, they do **not** share one outer parent card.

> **Critical CMS rule:** Core Values are suitable for a **repeatable ordered Strapi component** because each item follows exactly the same content structure:
>
> `Icon + Title + Description`

---

# 2. Scope Boundary

## Included

* OBSERVED — Centered section heading:

  * `Core Values`
* OBSERVED — Short blue decorative underline below heading.
* OBSERVED — Six equal cards.
* OBSERVED — Every card contains:

  * blue outline icon,
  * title,
  * short description.
* OBSERVED — Visible Core Values:

  1. Integrity
  2. Expertise
  3. Compassion
  4. Innovation
  5. Personalization
  6. Excellence
* OBSERVED — White/light card backgrounds.
* OBSERVED — Pale blue card border.
* OBSERVED — Medium rounded corners.
* OBSERVED — Very subtle card shadow.
* OBSERVED — Icons centered above titles.
* OBSERVED — All text is centered.
* USER-SPECIFIED — Section comes immediately after Mission/Vision section.
* INFERRED — Core Value items should be ordered through Strapi.
* INFERRED — Icon styling should remain controlled by frontend/design system.
* INFERRED — Six-card count represents the current approved design, but no explicit CMS min/max rule has been supplied yet.

## Excluded

* UNKNOWN — Hover effect.
* UNKNOWN — click behavior.
* UNKNOWN — card link destination.
* UNKNOWN — animation/reveal behavior.
* UNKNOWN — tablet layout.
* UNKNOWN — mobile layout.
* UNKNOWN — whether Core Values are always fixed at exactly six.
* UNKNOWN — whether editor can add more than six values.
* UNKNOWN — whether icon is uploaded from Strapi or selected from a controlled icon library.

---

# 3. Evidence and Confidence

| Item                           | Status         | Evidence / reason                                       |
| ------------------------------ | -------------- | ------------------------------------------------------- |
| Section follows Mission/Vision | USER-SPECIFIED | Explicit requirement                                    |
| Heading centered               | OBSERVED       | Clear in screenshot                                     |
| Six cards                      | OBSERVED       | Six complete cards visible                              |
| Single horizontal desktop row  | OBSERVED       | All cards on same row                                   |
| Equal card geometry            | OBSERVED       | Same visual width/height                                |
| Icon above text                | OBSERVED       | Uniform anatomy                                         |
| Centered text                  | OBSERVED       | All six cards                                           |
| Repeatable CMS list            | INFERRED       | Content structure repeats cleanly                       |
| Exact max of six               | UNKNOWN        | Screenshot shows six but user did not define validation |
| Card interactions              | UNKNOWN        | Static screenshot                                       |
| Responsive behavior            | UNKNOWN        | Desktop reference only                                  |

---

# 4. OCR Content Inventory

## 4.1 Section Heading

`Core Values`

Confidence: High.

---

# 4.2 Value 01 — Integrity

### Title

`Integrity`

### Description

`We are honest, transparent, and ethical in everything we do.`

Confidence: High.

### Icon concept

Shield with check mark.

---

# 4.3 Value 02 — Expertise

### Title

`Expertise`

### Description

`Highly trained professionals delivering evidence-based care.`

Confidence: High.

### Icon concept

Graduation cap.

---

# 4.4 Value 03 — Compassion

### Title

`Compassion`

### Description

`We treat every patient with empathy, respect, and kindness.`

Confidence: High.

### Icon concept

Hands supporting heart.

---

# 4.5 Value 04 — Innovation

### Title

`Innovation`

### Description

`We embrace advanced technology to achieve better results.`

Confidence: High.

### Icon concept

Light bulb.

---

# 4.6 Value 05 — Personalization

### Title

`Personalization`

### Description

`Care tailored to your unique needs and smile goals.`

Confidence: High.

### Icon concept

Person/user outline.

---

# 4.7 Value 06 — Excellence

### Title

`Excellence`

### Description

`We pursue the highest standards in every detail.`

Confidence: High.

### Icon concept

Trophy / award.

---

# 5. Layout Anatomy

## 5.1 Global Geometry

| Property           | Specification                                 | Status              |
| ------------------ | --------------------------------------------- | ------------------- |
| Section width      | Full viewport with centered content container | OBSERVED / INFERRED |
| Background         | White / near-white                            | OBSERVED            |
| Header alignment   | Center                                        | OBSERVED            |
| Desktop card count | `6`                                           | OBSERVED            |
| Card row           | One horizontal row                            | OBSERVED            |
| Cards              | Equal width                                   | OBSERVED            |
| Cards              | Equal/near-equal height                       | OBSERVED            |
| Gap                | Consistent between all cards                  | OBSERVED            |
| Text alignment     | Center                                        | OBSERVED            |
| Icons              | Centered horizontally                         | OBSERVED            |

---

# 5.2 Structure Tree

```text
Section: about-core-values
├── SectionHeader
│   ├── H2: Core Values
│   └── DecorativeUnderline
│
└── CoreValuesList
    ├── CoreValueCard
    │   ├── Icon
    │   ├── Title
    │   └── Description
    │
    ├── CoreValueCard
    ├── CoreValueCard
    ├── CoreValueCard
    ├── CoreValueCard
    └── CoreValueCard
```

---

# 5.3 Desktop Topology

```text
                         Core Values
                            ───


┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│    ICON    │ │    ICON    │ │    ICON    │ │    ICON    │ │    ICON    │ │    ICON    │
│            │ │            │ │            │ │            │ │            │ │            │
│ Integrity  │ │ Expertise  │ │ Compassion │ │ Innovation │ │ Personal.  │ │ Excellence │
│            │ │            │ │            │ │            │ │            │ │            │
│ Short      │ │ Short      │ │ Short      │ │ Short      │ │ Short      │ │ Short      │
│ paragraph  │ │ paragraph  │ │ paragraph  │ │ paragraph  │ │ paragraph  │ │ paragraph  │
└────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘
```

---

# 6. Section Header

## 6.1 Heading

```text
Core Values
```

### Appearance

* centered,
* deep navy,
* bold/semibold,
* visually larger than card titles.

Approximate desktop size:

`32–38 px estimated`

---

# 6.2 Decorative Underline

A short blue horizontal line appears directly below the heading.

### Rules

* centered beneath heading,
* width significantly shorter than text width,
* bright blue,
* approximately `2–3 px` height,
* no extra decorative elements.

Conceptually:

```text
Core Values
    ───
```

Do not extend this line across the whole section.

---

# 7. Core Values Grid

## 7.1 Desktop Grid Contract

At the supplied desktop width:

```text
columns = 6
```

Recommended relationship:

```text
availableWidth
=
6 × cardWidth
+
5 × gap
```

All six cards should fit completely.

Do not intentionally expose:

* partial seventh card,
* horizontal scrolling,
* carousel behavior

at full desktop.

---

# 7.2 Card Group Alignment

The grid should be horizontally centered inside the site container.

Reference:

```text
        [1] [2] [3] [4] [5] [6]
        <----- centered row ----->
```

The section does not use a left-heavy layout.

---

# 7.3 If CMS Count Differs From Six

The supplied design only demonstrates six.

No explicit count contract has been provided.

Safe frontend principle:

* render actual configured values,
* preserve equal card dimensions,
* center incomplete rows,
* do not render empty placeholders,
* do not duplicate existing values.

For example, if Product later allows four:

```text
          [1] [2] [3] [4]
          <--- centered --->
```

This behavior is `INFERRED`, not yet a formal design requirement.

---

# 8. Core Value Card Specification

## 8.1 Anatomy

```text
CoreValueCard
├── IconArea
│   └── BlueOutlineIcon
│
├── Title
└── Description
```

---

# 8.2 Geometry

| Property          | Specification                      | Status              |
| ----------------- | ---------------------------------- | ------------------- |
| Orientation       | Vertical                           | OBSERVED            |
| Width             | Equal                              | OBSERVED            |
| Height            | Equal/near-equal                   | OBSERVED            |
| Surface           | White                              | OBSERVED            |
| Border            | Pale blue/light gray               | OBSERVED            |
| Radius            | Approximately `12–16 px estimated` | INFERRED            |
| Shadow            | Very soft/subtle                   | OBSERVED / INFERRED |
| Content alignment | Center                             | OBSERVED            |
| Internal padding  | Medium                             | INFERRED            |
| Overflow          | Hidden only if needed              | INFERRED            |

---

# 8.3 Card Vertical Hierarchy

Approximate pattern:

```text
┌─────────────────────┐
│                     │
│        ICON         │
│                     │
│       TITLE         │
│                     │
│     Description     │
│     Description     │
│     Description     │
│                     │
└─────────────────────┘
```

The icon occupies the strongest visual space before the text.

---

# 9. Icon Specification

## 9.1 Shared Style

All six icons follow the same visual system:

* outline/line icon,
* bright blue,
* no filled circular background,
* consistent stroke weight,
* similar visual bounding box,
* centered.

Unlike Mission/Vision icons, these icons **do not use large solid blue circles**.

This distinction must be preserved.

---

# 9.2 Icon Mapping

| Core Value      | Icon           |
| --------------- | -------------- |
| Integrity       | Shield + check |
| Expertise       | Graduation cap |
| Compassion      | Hands + heart  |
| Innovation      | Light bulb     |
| Personalization | User/person    |
| Excellence      | Trophy         |

---

# 9.3 Icon Ownership

Recommended:

```text
CoreValue.iconKey
```

selected from a controlled set, or fixed frontend mapping if the six values remain canonical.

Two possible approaches:

### Option A — Controlled CMS enum

```text
shield-check
graduation-cap
hands-heart
lightbulb
user
trophy
```

Frontend resolves to the project's icon library.

### Option B — Media upload

Only use if the project's Strapi architecture already handles icon SVG/media safely.

### Preferred

Controlled icon selection is better than arbitrary image uploads because it preserves:

* stroke style,
* scale,
* blue color,
* design consistency.

---

# 10. Card 01 — Integrity

```text
[ Shield Check ]

Integrity

We are honest,
transparent, and
ethical in everything
we do.
```

### Visual priority

1. Icon
2. Title
3. Description

---

# 11. Card 02 — Expertise

```text
[ Graduation Cap ]

Expertise

Highly trained
professionals
delivering evidence-
based care.
```

Keep description text centered.

Do not manually hard-code line breaks from the screenshot.

---

# 12. Card 03 — Compassion

```text
[ Hands + Heart ]

Compassion

We treat every
patient with empathy,
respect, and
kindness.
```

---

# 13. Card 04 — Innovation

```text
[ Light Bulb ]

Innovation

We embrace
advanced technology
to achieve better
results.
```

---

# 14. Card 05 — Personalization

```text
[ Person ]

Personalization

Care tailored to
your unique needs
and smile goals.
```

---

# 15. Card 06 — Excellence

```text
[ Trophy ]

Excellence

We pursue the
highest standards
in every detail.
```

---

# 16. Visual Specification

## 16.1 Colors

| Token candidate                | Usage           | Description          | Status   |
| ------------------------------ | --------------- | -------------------- | -------- |
| `color/core-values/background` | Section         | White / near-white   | OBSERVED |
| `color/core-values/heading`    | Section heading | Deep navy            | OBSERVED |
| `color/core-values/underline`  | Heading accent  | Bright blue          | OBSERVED |
| `color/core-value/card`        | Card surface    | White                | OBSERVED |
| `color/core-value/border`      | Card border     | Very pale blue       | OBSERVED |
| `color/core-value/icon`        | All value icons | Bright blue          | OBSERVED |
| `color/core-value/title`       | Card titles     | Navy                 | OBSERVED |
| `color/core-value/body`        | Description     | Muted navy/gray-blue | OBSERVED |

---

# 16.2 Typography

| Element                 | Weight              | Approx. size | Status   |
| ----------------------- | ------------------- | ------------ | -------- |
| Section H2              | `600–700 estimated` | `32–38 px`   | INFERRED |
| Card title              | `600–700 estimated` | `16–18 px`   | INFERRED |
| Card description        | `400–500 estimated` | `12–14 px`   | INFERRED |
| Description line-height | `1.5–1.7 estimated` | —            | INFERRED |

Use the site's existing typography system.

---

# 17. Card Height Stability

Because each description has slightly different text length, frontend should keep cards visually aligned.

Recommended layout:

```text
Card
├── fixed/min icon region
├── title
└── description
```

and use:

```text
height: 100%
```

inside an equal-height grid where appropriate.

Do not allow:

```text
Card 1 = 245px
Card 2 = 270px
Card 3 = 220px
```

at the reference desktop viewport.

The supplied design clearly presents a uniform row.

---

# 18. Strapi CMS Contract

## 18.1 Recommended Section Model

```text
About Page
└── Core Values Section
    ├── heading
    └── values[]
        ├── title
        ├── description
        └── iconKey / icon
```

---

# 18.2 Section Fields

| Field     | Type                 | Required | Example            |
| --------- | -------------------- | -------: | ------------------ |
| `heading` | Short text           |      Yes | `Core Values`      |
| `values`  | Repeatable component |      Yes | Six current values |

The decorative underline does not belong in CMS.

---

# 18.3 Core Value Component

Recommended component:

```text
core-value
```

Fields:

| Field              | Type                      | Required |
| ------------------ | ------------------------- | -------: |
| `title`            | Short text                |      Yes |
| `description`      | Long/short text           |      Yes |
| `icon` / `iconKey` | Controlled icon reference |      Yes |

---

# 18.4 Initial Strapi Data

```text
values[0]
title: Integrity
description: We are honest, transparent, and ethical in everything we do.
icon: shield-check
```

```text
values[1]
title: Expertise
description: Highly trained professionals delivering evidence-based care.
icon: graduation-cap
```

```text
values[2]
title: Compassion
description: We treat every patient with empathy, respect, and kindness.
icon: hands-heart
```

```text
values[3]
title: Innovation
description: We embrace advanced technology to achieve better results.
icon: lightbulb
```

```text
values[4]
title: Personalization
description: Care tailored to your unique needs and smile goals.
icon: user
```

```text
values[5]
title: Excellence
description: We pursue the highest standards in every detail.
icon: trophy
```

---

# 18.5 Ordering

Strapi order should map directly to visual order:

```text
values[0] → left-most card
values[1]
values[2]
values[3]
values[4]
values[5] → right-most card
```

Frontend must not alphabetically sort them.

---

# 19. Count Validation

Current screenshot shows exactly six.

However the user has not explicitly specified:

```text
min
max
```

for this section.

Therefore recommended implementation for now:

* no arbitrary strict `max = 6` unless Product confirms,
* configure the current section with six records,
* frontend gracefully supports fewer values,
* define behavior for more than six before allowing unrestricted editor growth.

### Recommended Product decision later

Possible rule:

```text
min: 3
max: 6
```

or:

```text
exactly: 6
```

but neither is currently supported by the supplied requirement.

---

# 20. Component Contract

| Component                | Responsibility               | Reusable?     |
| ------------------------ | ---------------------------- | ------------- |
| `AboutCoreValuesSection` | Section orchestration        | Page-specific |
| `CenteredSectionHeading` | Heading + underline          | Yes           |
| `CoreValuesGrid`         | Responsive value card layout | Yes           |
| `CoreValueCard`          | Icon/title/description       | Yes           |
| `CoreValueIcon`          | Controlled line icon         | Yes           |

Recommended:

```text
AboutCoreValuesSection
├── CenteredSectionHeading
└── CoreValuesGrid
    └── CoreValueCard × N
```

---

# 21. CMS vs Frontend Responsibility

| Responsibility            |   Strapi   |   Frontend  |
| ------------------------- | :--------: | :---------: |
| Section heading           |      ✅     |             |
| Core Value title          |      ✅     |             |
| Description               |      ✅     |             |
| Icon selection/reference  | ✅ optional | ✅ rendering |
| Item order                |      ✅     |             |
| Number of desktop columns |            |      ✅      |
| Card dimensions           |            |      ✅      |
| Equal-height behavior     |            |      ✅      |
| Icon blue styling         |            |      ✅      |
| Borders/radius            |            |      ✅      |
| Heading underline         |            |      ✅      |
| Center alignment          |            |      ✅      |
| Responsive behavior       |            |      ✅      |

---

# 22. Responsive Specification

## 22.1 Evidence

| Viewport     | Evidence |
| ------------ | -------- |
| Full desktop | High     |
| Tablet       | UNKNOWN  |
| Mobile       | UNKNOWN  |

---

# 22.2 Desktop

Required:

```text
6 cards
1 row
```

All complete and visible.

No carousel.

No horizontal scroll.

---

# 22.3 Responsive Structural Approach

The same data should flow into a responsive grid.

Potential structural progression:

```text
Desktop
6 columns

↓ narrower

3 columns × 2 rows

↓ narrower

2 columns × 3 rows

↓ mobile

1 column
```

This is a reasonable implementation strategy but remains `INFERRED` until responsive Figma is supplied.

Do not treat those breakpoint counts as pixel-perfect approved values.

---

# 22.4 Incomplete Rows

If responsive or CMS count produces an incomplete final row, center the items rather than leaving them awkwardly pinned to one side where practical.

Example:

```text
[ 1 ] [ 2 ] [ 3 ]
[ 4 ] [ 5 ] [ 6 ]
```

or with five:

```text
[ 1 ] [ 2 ] [ 3 ]
    [ 4 ] [ 5 ]
```

This is an implementation recommendation, not explicit screenshot evidence.

---

# 22.5 No Carousel

The supplied visual provides no evidence for:

* slider,
* auto-scroll,
* pagination,
* arrows.

Do **not** convert Core Values into a carousel merely to fit smaller viewports unless mobile design explicitly requires it.

---

# 23. Interaction States

The reference is static.

Therefore:

| Element         | Interaction |
| --------------- | ----------- |
| Core Value card | Static      |
| Icon            | Static      |
| Title           | Static      |
| Description     | Static      |

Do not introduce:

* hover fill,
* card flip,
* elevation animation,
* icon bounce,
* click navigation,
* accordion expansion.

without a separate requirement.

---

# 24. Semantic HTML and Accessibility

## Section Heading

`Core Values` should use the appropriate heading level beneath the About page H1.

---

## Core Value Collection

The collection can use semantic list structure:

```text
Core Values
└── list
    ├── Integrity
    ├── Expertise
    ├── Compassion
    ├── Innovation
    ├── Personalization
    └── Excellence
```

---

## Icons

The icons visually reinforce already-labeled concepts.

Therefore they can generally be treated as decorative to avoid screen readers announcing:

```text
shield icon, Integrity
```

when:

```text
Integrity
```

already conveys the meaning.

---

# 25. Implementation Constraints

1. Place `about-core-values` immediately after `about-mission-vision`.
2. Use a centered `Core Values` heading.
3. Preserve short centered blue underline.
4. Desktop reference uses **six cards in one row**.
5. All cards have equal width and equal/near-equal height.
6. Keep consistent card gap.
7. Cards have independent borders/radius.
8. Do not wrap all six cards in one bordered parent container.
9. Use blue outline icons.
10. Do not reuse Mission/Vision's solid blue circular icon style.
11. Icon appears above title.
12. All card text remains centered.
13. Do not add a carousel.
14. Do not add unsupported hover animation.
15. Preserve Strapi item order.
16. Render actual CMS values only.
17. Do not duplicate cards to fill a row.
18. CMS controls content/order; frontend controls geometry/style.

---

# 26. Visual Acceptance Criteria

## Section

* [ ] Section renders directly after Mission/Vision.
* [ ] Background remains white/light.
* [ ] `Core Values` is centered.
* [ ] Small blue underline appears centered below heading.
* [ ] Proper vertical whitespace exists between heading and card row.

## Card Row

* [ ] Six complete cards appear on full desktop.
* [ ] All cards align horizontally.
* [ ] Cards are equal width.
* [ ] Cards are equal/near-equal height.
* [ ] Gaps are consistent.
* [ ] No partial seventh card appears.
* [ ] No horizontal slider appears.

## Card Styling

* [ ] White card surface.
* [ ] Pale-blue border.
* [ ] Rounded corners.
* [ ] Subtle shadow only.
* [ ] Blue outline icon centered.
* [ ] Title centered.
* [ ] Description centered.
* [ ] Text does not overflow.

## Core Values

* [ ] `Integrity`
* [ ] `Expertise`
* [ ] `Compassion`
* [ ] `Innovation`
* [ ] `Personalization`
* [ ] `Excellence`

## Icon Mapping

* [ ] Integrity → shield/check.
* [ ] Expertise → graduation cap.
* [ ] Compassion → hands/heart.
* [ ] Innovation → lightbulb.
* [ ] Personalization → person.
* [ ] Excellence → trophy.

---

# 27. Visual / Architecture Risks

| Risk                                         | Why it affects fidelity                                   | Mitigation                           | Priority |
| -------------------------------------------- | --------------------------------------------------------- | ------------------------------------ | -------- |
| Using Mission/Vision solid-circle icon style | Core Values visually becomes inconsistent with screenshot | Use standalone blue outline icons    | High     |
| Turning section into carousel                | Unsupported behavior                                      | Six-column desktop grid              | High     |
| Unequal card heights                         | Makes row visually unstable                               | Equal-height grid strategy           | High     |
| Fixed image dimensions for icons             | Different source icons may appear inconsistent            | Controlled icon system               | Medium   |
| Arbitrary SVG uploads                        | Stroke weight/colors may vary                             | Controlled icon enum/library         | Medium   |
| Long description                             | Could increase card height                                | Content limits + equal-height layout | Medium   |
| Cards packed too tightly                     | Loses clean premium spacing                               | Preserve consistent gap              | Medium   |
| Overly strong box shadow                     | Changes minimal visual language                           | Keep effect subtle                   | Medium   |
| Hard max six without Product approval        | Could unnecessarily constrain CMS                         | Await count rule                     | Medium   |
| Alphabetical frontend sorting                | Changes intentional order                                 | Preserve CMS order                   | High     |
| Placeholder cards for missing values         | Fake content                                              | Render actual records only           | High     |

---

# 28. Open Questions

| ID | Question                                                                    | Blocking level                     | Suggested owner     |
| -- | --------------------------------------------------------------------------- | ---------------------------------- | ------------------- |
| Q1 | Must Core Values always contain exactly six items?                          | Important CMS validation decision  | Product             |
| Q2 | If editors may add more than six, what is the approved desktop behavior?    | Layout decision                    | Designer            |
| Q3 | Are the six icons already available in the frontend design system?          | Non-blocking                       | Developer           |
| Q4 | Should icons be fixed to each canonical Core Value or selectable in Strapi? | CMS architecture decision          | Product / Developer |
| Q5 | Does the section have any hover interaction not visible in the screenshot?  | Non-blocking                       | Designer            |
| Q6 | What is the approved tablet grid?                                           | Blocking for exact tablet fidelity | Designer            |
| Q7 | What is the approved mobile grid?                                           | Blocking for exact mobile fidelity | Designer            |

---

# 29. Strapi Handoff Summary

## Recommended Structure

```text
About Page
└── Core Values Section
    ├── heading
    │   └── Core Values
    │
    └── values[]
        ├── Integrity
        │   ├── icon
        │   ├── title
        │   └── description
        │
        ├── Expertise
        ├── Compassion
        ├── Innovation
        ├── Personalization
        └── Excellence
```

---

# 30. Desktop Handoff

```text
                              Core Values
                                  ───

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│     ♢      │ │     ▱      │ │     ♡      │ │     💡     │ │     ○      │ │     🏆     │
│            │ │            │ │            │ │            │ │            │ │            │
│ Integrity  │ │ Expertise  │ │ Compassion │ │ Innovation │ │ Personal.  │ │ Excellence │
│            │ │            │ │            │ │            │ │            │ │            │
│   body     │ │   body     │ │   body     │ │   body     │ │   body     │ │   body     │
└────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘
```

Actual implementation must use the approved outline icon set, not emoji.

---

# 31. CMS vs Frontend Responsibility

| Responsibility              |   Strapi   | Frontend |
| --------------------------- | :--------: | :------: |
| Section heading             |      ✅     |          |
| Value title                 |      ✅     |          |
| Value description           |      ✅     |          |
| Value order                 |      ✅     |          |
| Icon key/media              | ✅ optional |     ✅    |
| Six-column desktop geometry |            |     ✅    |
| Centered heading            |            |     ✅    |
| Decorative underline        |            |     ✅    |
| Equal card heights          |            |     ✅    |
| Border/radius/shadow        |            |     ✅    |
| Icon styling                |            |     ✅    |
| Responsive grid             |            |     ✅    |

---

# 32. Mandatory Coding-Agent Rules

1. Create `about-core-values` immediately after `about-mission-vision`.
2. Desktop screenshot baseline = **6 Core Value cards in one row**.
3. Use one centered section heading with a short blue underline.
4. Each card contains:

   * icon,
   * title,
   * description.
5. Cards are individual white rounded cards with pale-blue borders.
6. Do not wrap the six items in one shared Mission/Vision-style bordered container.
7. Core Value icons are **blue outline icons without solid circular backgrounds**.
8. Preserve icon mapping:

   * Integrity → shield/check,
   * Expertise → graduation cap,
   * Compassion → hands/heart,
   * Innovation → lightbulb,
   * Personalization → person,
   * Excellence → trophy.
9. Preserve equal desktop card dimensions.
10. Do not add slider/carousel behavior.
11. Do not invent hover/click interactions.
12. Model values as an ordered repeatable Strapi component.
13. Preserve CMS order exactly.
14. Do not duplicate or create placeholder values.
15. Current reference uses six values, but do not enforce an arbitrary CMS max until Product confirms.
16. Strapi controls title/description/order/icon reference; frontend controls visual system and responsive grid.
