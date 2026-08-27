# UI Implementation Spec — About Us Featured Services Section

## 1. Identity

| Field                        | Value                                                                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                        | Existing **About Us route in current codebase**                                                                                                                 |
| Section ID                   | `about-featured-services`                                                                                                                                       |
| Section name                 | `About Us — Featured Services`                                                                                                                                  |
| Position in page             | **Immediately after `about-doctors`**                                                                                                                           |
| Section type                 | Featured Service card grid                                                                                                                                      |
| Reference desktop item count | `6` services                                                                                                                                                    |
| Desktop composition          | **3 columns × 2 rows**                                                                                                                                          |
| Card type                    | Uniform horizontal service cards                                                                                                                                |
| CTA per card                 | `LEARN MORE →`                                                                                                                                                  |
| CMS integration              | Strapi CMS using canonical `Service` records                                                                                                                    |
| Primary implementation goal  | Reproduce the supplied six-service desktop layout while reusing existing Service data/routes and keeping image, title, description and destination synchronized |
| Overall evidence quality     | High for desktop geometry/card anatomy; Medium for exact dimensions; Low for responsive behavior and interactions                                               |

> **Critical position rule:** This section must render **directly after `about-doctors`**.

> **Critical data rule:** Reuse the canonical Strapi `Service` collection already used by the Homepage Services section and Service pages. Do not create duplicate About-page-only service records.

> **Critical visual distinction:** This is **not the same card presentation as the Homepage Services section**. Homepage uses tall vertical service cards. About Us uses **wide horizontal cards with image on the left and content on the right**.

> **Critical routing rule:** Every `LEARN MORE` action must use the Service's existing canonical route from the current codebase. Do not invent or rename service routes while implementing this section.

---

# 2. Relationship to Homepage Services Section

The same Service content can appear through different UI variants.

## Homepage

```text
home-services

[ Icon / Image ]
[ Title        ]
[ Description  ]
[ Learn More   ]

vertical cards
```

## About Us

```text
about-featured-services

┌───────────────┬────────────────────────┐
│ SERVICE IMAGE │ Title                  │
│               │ Description            │
│               │ LEARN MORE →           │
└───────────────┴────────────────────────┘

horizontal cards
```

Recommended architecture:

```text
Canonical Service Collection
            │
            ├───────────────→ Homepage Service Card
            │                  vertical variant
            │
            └───────────────→ About Service Card
                               horizontal variant
```

Reuse the **data**.

Do not force reuse of the exact same card geometry.

---

# 3. Scope Boundary

## Included

* USER-SPECIFIED — Section appears immediately after About Doctors.
* OBSERVED — Centered heading:

  * `Featured Services`
* OBSERVED — Short blue underline beneath heading.
* OBSERVED — Six service cards.
* OBSERVED — Desktop layout:

  * 3 cards per row,
  * 2 rows.
* OBSERVED — All cards have equal/near-equal dimensions.
* OBSERVED — Card layout is horizontal.
* OBSERVED — Service image/illustration on left.
* OBSERVED — Service title on right.
* OBSERVED — Short description beneath title.
* OBSERVED — `LEARN MORE` action beneath description.
* OBSERVED — Small right-arrow after CTA.
* OBSERVED — White card surface.
* OBSERVED — Thin pale-blue border.
* OBSERVED — Rounded corners.
* OBSERVED — Very subtle/no heavy shadow.
* INFERRED — Services should be manually selectable/orderable in Strapi.
* INFERRED — Card imagery should come from the canonical Service record or an existing service-card media field.
* INFERRED — `LEARN MORE` resolves to canonical Service detail route.

## Excluded

* UNKNOWN — hover animation.
* UNKNOWN — click behavior for whole card.
* UNKNOWN — whether image animates.
* UNKNOWN — pagination.
* UNKNOWN — carousel.
* UNKNOWN — maximum number of services.
* UNKNOWN — minimum number of services.
* UNKNOWN — tablet column count.
* UNKNOWN — mobile card layout.
* UNKNOWN — whether section contains `View All Services`.
* UNKNOWN — whether card descriptions use global Service excerpt or About-specific text.

---

# 4. Evidence and Confidence

| Item                        | Status         | Evidence                      |
| --------------------------- | -------------- | ----------------------------- |
| Section follows Doctors     | USER-SPECIFIED | Explicit requirement          |
| Centered heading            | OBSERVED       | Screenshot                    |
| Six visible services        | OBSERVED       | Six complete cards            |
| 3 × 2 desktop layout        | OBSERVED       | Three cards each row          |
| Horizontal card anatomy     | OBSERVED       | Image left, content right     |
| Learn More action           | OBSERVED       | Appears in all six cards      |
| Canonical Service reuse     | INFERRED       | Best CMS architecture         |
| Exact number always six     | UNKNOWN        | Screenshot only               |
| Carousel behavior           | NOT OBSERVED   | No navigation/slider controls |
| Homepage hover effect reuse | UNKNOWN        | Not visible/specified here    |
| Responsive layout           | UNKNOWN        | Desktop reference only        |

---

# 5. OCR Content Inventory

The screenshot contains six visible Service entries.

Final copy should come from canonical Strapi Service records rather than being recreated manually from OCR.

---

## Service 01 — Dental Implants

### Title

`Dental Implants`

### Description

Visible approximately:

`Permanent, natural-looking tooth replacement for lasting confidence.`

### CTA

`LEARN MORE →`

### Image

Dental implant/tooth implant illustration.

---

## Service 02 — Orthodontics

### Title

`Orthodontics`

### Description

Visible:

`Straighten your smile with braces or clear aligners.`

### CTA

`LEARN MORE →`

### Image

Clear-aligner / orthodontic arch illustration.

---

## Service 03 — Veneers

### Title

`Veneers`

### Description

Visible:

`Transform your smile with custom-crafted porcelain veneers.`

### CTA

`LEARN MORE →`

### Image

White tooth / veneer illustration.

---

## Service 04 — Teeth Whitening

### Title

`Teeth Whitening`

### Description

Visible:

`Safe, effective whitening for a brighter, more radiant smile.`

### CTA

`LEARN MORE →`

### Image

White tooth with sparkle/plus treatment.

---

## Service 05 — General Dentistry

### Title

`General Dentistry`

### Description

Visible:

`Comprehensive care to keep your teeth and gums healthy.`

### CTA

`LEARN MORE →`

### Image

Tooth with medical cross/shield-like visual.

---

## Service 06 — Smile Makeover

### Title

`Smile Makeover`

### Description

Visible:

`Personalized smile design for a stunning transformation.`

### CTA

`LEARN MORE →`

### Image

Smiling mouth / cosmetic dentistry visual.

---

# 6. Layout Anatomy

## 6.1 Global Geometry

| Property             | Specification                                  | Status              |
| -------------------- | ---------------------------------------------- | ------------------- |
| Section width        | Full viewport with centered internal container | OBSERVED / INFERRED |
| Background           | White / near-white                             | OBSERVED            |
| Heading alignment    | Center                                         | OBSERVED            |
| Desktop grid columns | `3`                                            | OBSERVED            |
| Desktop rows         | `2`                                            | OBSERVED            |
| Visible cards        | `6`                                            | OBSERVED            |
| Card width           | Equal                                          | OBSERVED            |
| Card height          | Equal/near-equal                               | OBSERVED            |
| Horizontal gaps      | Consistent                                     | OBSERVED            |
| Vertical gaps        | Consistent                                     | OBSERVED            |
| Card text alignment  | Left                                           | OBSERVED            |
| Image position       | Left                                           | OBSERVED            |

---

# 6.2 Structure Tree

```text
Section: about-featured-services
├── SectionHeader
│   ├── H2: Featured Services
│   └── DecorativeUnderline
│
└── ServiceGrid
    ├── ServiceCard
    │   ├── MediaArea
    │   │   └── ServiceImage
    │   │
    │   └── ContentArea
    │       ├── ServiceTitle
    │       ├── Description
    │       └── LearnMoreLink
    │
    ├── ServiceCard
    ├── ServiceCard
    ├── ServiceCard
    ├── ServiceCard
    └── ServiceCard
```

---

# 6.3 Desktop Topology

```text
                              Featured Services
                                    ───


┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌──────────────────────────────┐
│ IMAGE │ Dental Implants      │ │ IMAGE │ Orthodontics        │ │ IMAGE │ Veneers              │
│       │ Description...       │ │       │ Description...       │ │       │ Description...       │
│       │ LEARN MORE →         │ │       │ LEARN MORE →         │ │       │ LEARN MORE →         │
└──────────────────────────────┘ └──────────────────────────────┘ └──────────────────────────────┘


┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌──────────────────────────────┐
│ IMAGE │ Teeth Whitening     │ │ IMAGE │ General Dentistry    │ │ IMAGE │ Smile Makeover       │
│       │ Description...       │ │       │ Description...       │ │       │ Description...       │
│       │ LEARN MORE →         │ │       │ LEARN MORE →         │ │       │ LEARN MORE →         │
└──────────────────────────────┘ └──────────────────────────────┘ └──────────────────────────────┘
```

---

# 7. Section Header

## Heading

```text
Featured Services
```

Appearance:

* center aligned,
* deep navy,
* semibold/bold,
* same heading family as:

  * `Core Values`,
  * `Meet Our Doctors`.

Approximate desktop size:

`32–38 px estimated`

---

## Decorative Underline

A short blue horizontal line appears below the heading.

Rules:

* centered,
* bright blue,
* narrow,
* approximately `35–50 px estimated`,
* approximately `2–3 px` high.

Maintain visual consistency across About Us sections.

---

# 8. Desktop Grid Contract

## 8.1 Required Reference Layout

```text
columns = 3
rows = 2
```

Initial screenshot configuration:

```text
[DENTAL IMPLANTS] [ORTHODONTICS]      [VENEERS]
[TEETH WHITENING] [GENERAL DENTISTRY] [SMILE MAKEOVER]
```

---

# 8.2 Equal Card Width

Conceptually:

```text
availableGridWidth
=
3 × cardWidth
+
2 × columnGap
```

Cards should fill the content container evenly.

Do not allow one long service title to make one column wider.

---

# 8.3 Equal Height

All cards should align row-to-row.

Recommended:

```text
ServiceCard
height: 100%
```

within the grid.

Do not produce:

```text
Dental Implants     = 150px
Orthodontics        = 175px
Veneers             = 145px
```

at the desktop reference.

---

# 9. Service Card Anatomy

## 9.1 Main Structure

Each card is one parent unit split horizontally.

```text
ServiceCard
┌───────────────────┬────────────────────────────┐
│                   │ SERVICE TITLE              │
│ SERVICE IMAGE     │                            │
│                   │ Short description          │
│                   │                            │
│                   │ LEARN MORE →               │
└───────────────────┴────────────────────────────┘
```

This is **one card**, not separate Image Card + Text Card components.

---

# 9.2 Approximate Internal Ratio

Observed relationship:

```text
Image = ~35–40%
Content = ~60–65%
```

Exact measurement requires Figma.

Recommended:

```text
mediaWidth ≈ 38%
contentWidth ≈ 62%
```

as an initial visual approximation only.

---

# 9.3 Card Surface

| Property   | Specification                    | Status   |
| ---------- | -------------------------------- | -------- |
| Background | White                            | OBSERVED |
| Border     | Pale blue / very light gray-blue | OBSERVED |
| Radius     | `~12–16 px estimated`            | INFERRED |
| Shadow     | Minimal / very soft              | INFERRED |
| Overflow   | Hidden where needed              | REQUIRED |
| Padding    | Medium                           | INFERRED |

---

# 10. Service Media Area

## 10.1 Image Role

Each service uses a visual illustration/photo representing the service.

Current assets appear primarily:

* white,
* light blue,
* clinical,
* cutout/object-style illustrations.

---

# 10.2 Image Rendering

Preferred:

```text
object-fit: contain
```

because these assets behave more like product/service illustrations than full-bleed editorial photos.

Preserve:

* entire tooth,
* implant,
* aligner,
* mouth,
* medical symbol.

Do not aggressively crop with `cover`.

---

# 10.3 Image Alignment

* horizontally centered in media region,
* vertically centered,
* sufficient internal whitespace,
* similar visual size across cards.

Do not force every source image to identical raw dimensions.

Normalize by **visual bounding area**, not distortion.

---

# 11. Content Area

## 11.1 Service Title

Examples:

```text
Dental Implants
Orthodontics
Veneers
Teeth Whitening
General Dentistry
Smile Makeover
```

Appearance:

* deep navy,
* semibold/bold,
* left aligned,
* strongest text inside the card.

Approximate:

`16–19 px estimated`

---

# 11.2 Description

* muted navy/blue-gray,
* smaller than title,
* approximately 2–3 lines,
* left aligned,
* compact width.

Do not manually insert screenshot line breaks in Strapi.

Let frontend wrapping derive from card dimensions.

---

# 11.3 Learn More CTA

Visible:

```text
LEARN MORE →
```

Appearance:

* uppercase,
* bright blue,
* semibold,
* no filled button background,
* small right-arrow icon,
* aligned near lower-left of content region.

---

# 11.4 Stable CTA Alignment

Cards have slightly different description lengths.

Use internal card structure:

```text
ContentArea
├── Title
├── Description
└── LearnMore pushed toward bottom
```

Recommended:

```text
description / spacer = flex-grow
```

so all CTA links visually align across a row.

---

# 12. Interaction Specification

The screenshot does not show any special animation.

Therefore baseline:

```text
Card = static
CTA = interactive link
```

Do not automatically carry over the Homepage Service card's special hover behavior:

> color transition from bottom to top.

That animation was explicitly specified for `home-services`, not for this About section.

Unless Product explicitly requests reuse:

```text
about-featured-services
→ no special fill animation
```

---

# 12.1 CTA Interaction

`LEARN MORE` must navigate to the corresponding canonical Service detail page.

Concept:

```text
Service.slug / existing route
           ↓
LEARN MORE
           ↓
Service Detail
```

Use existing codebase routing.

---

# 12.2 Whole Card Click

UNKNOWN.

Do not automatically make the entire card clickable if only the `LEARN MORE` link is visibly presented as an action.

If whole-card navigation is later enabled, avoid nested interactive links.

---

# 13. Canonical Service Data Architecture

## Recommended

```text
Service Collection
├── Dental Implants
├── Orthodontics
├── Veneers
├── Teeth Whitening
├── General Dentistry
├── Smile Makeover
└── ...
```

Each Service can contain:

```text
Service
├── title
├── slug
├── shortDescription
├── cardImage
├── cardImageAlt
├── fullContent
└── additional service fields...
```

---

# 13.1 Reuse Across Website

```text
                        SERVICE COLLECTION
                               │
             ┌─────────────────┼──────────────────┐
             │                 │                  │
             ▼                 ▼                  ▼
     Homepage Services    About Services    Service Detail
       vertical cards    horizontal cards       page
```

This keeps:

* titles,
* slugs,
* descriptions,
* images

synchronized.

---

# 14. Strapi About Section Contract

Recommended:

```text
About Page
└── Featured Services Section
    ├── heading
    └── services[]
          ↓ ordered relation
        Service
```

---

# 14.1 Section Fields

| Field      | Type                          | Required |
| ---------- | ----------------------------- | -------: |
| `heading`  | Short text                    |      Yes |
| `services` | Ordered relation to `Service` |      Yes |

Optional only if Product requires custom section behavior:

| Field          | Type          |
| -------------- | ------------- |
| `viewAllLabel` | Short text    |
| `viewAllLink`  | Internal link |

No View All control is visible in the supplied design, so these fields are not currently necessary.

---

# 14.2 Do Not Duplicate Service Data

Avoid:

```text
AboutPage
└── services[]
    ├── title
    ├── description
    ├── image
    └── url
```

if a canonical Service collection already exists.

This would allow:

```text
Homepage:
Dental Implants

About:
Implant Dentistry

Service Page:
Dental Implant Service
```

to drift unintentionally.

Preferred:

```text
AboutPage.services[]
    ↓
Service relation
```

---

# 15. Service Ordering

The order in Strapi should define visual order.

Reference:

```text
services[0] → Dental Implants
services[1] → Orthodontics
services[2] → Veneers

services[3] → Teeth Whitening
services[4] → General Dentistry
services[5] → Smile Makeover
```

Frontend must not automatically sort alphabetically.

---

# 16. Service Count

The design shows:

```text
6 services
```

but the user has **not explicitly defined minimum/maximum CMS limits**.

Therefore distinguish:

```text
referenceItemCount = 6
```

from:

```text
maxItems = UNKNOWN
```

Do not automatically set:

```text
max = 6
```

without Product confirmation.

---

# 16.1 Fewer Than Six Services

Recommended defensive layout:

* render actual services,
* do not render blank cards,
* do not duplicate service records,
* center incomplete final rows where practical.

Example with 5:

```text
[D1] [D2] [D3]

    [D4] [D5]
```

This remains an implementation recommendation, not explicit screenshot evidence.

---

# 16.2 More Than Six Services

Behavior is currently UNKNOWN.

Do not automatically:

* turn the section into a carousel,
* add pagination,
* shrink cards,
* render all cards indefinitely.

Product should decide whether:

* Homepage/About CMS selection is capped,
* additional rows are allowed,
* only a curated subset is selected.

For the supplied design baseline:

```text
configure 6 selected Service relations
```

---

# 17. Image Data Strategy

Prefer canonical Service media:

```text
Service.cardImage
```

if it already exists.

If Homepage and About require radically different crops/assets, a controlled architecture may use:

```text
Service
├── primaryImage
├── cardImage
└── optional alternateCardImage
```

but do not add page-specific media fields without evidence.

Current assets are suitable for reuse as isolated service imagery.

---

# 18. Component Contract

Recommended frontend architecture:

```text
AboutFeaturedServicesSection
├── CenteredSectionHeading
└── FeaturedServicesGrid
    └── AboutServiceCard[]
```

### Components

| Component                      | Responsibility                  |
| ------------------------------ | ------------------------------- |
| `AboutFeaturedServicesSection` | Section orchestration           |
| `CenteredSectionHeading`       | Heading + blue underline        |
| `FeaturedServicesGrid`         | 3-column desktop grid           |
| `AboutServiceCard`             | Horizontal service presentation |
| `ServiceImage`                 | Contained service media         |
| `ServiceLearnMoreLink`         | Canonical service navigation    |

---

# 19. Responsive Specification

## 19.1 Desktop

Required reference:

```text
3 columns
2 rows
```

for six configured items.

---

# 19.2 Tablet

Exact design UNKNOWN.

A structurally reasonable fallback:

```text
2 columns
```

but this is not yet approved.

---

# 19.3 Mobile

Exact design UNKNOWN.

A likely structural fallback:

```text
1 card per row
```

while preserving:

```text
image left + content right
```

if enough horizontal room exists.

At very narrow widths, the card may need:

```text
image top
content bottom
```

but this should not be implemented as a permanent requirement without a mobile design.

---

# 19.4 Do Not Convert to Slider

There is no slider evidence in this section.

Unlike the preceding About Doctors section:

```text
about-doctors = carousel
```

this section should remain:

```text
about-featured-services = grid
```

unless future design explicitly changes it.

---

# 20. Visual Specification

## Colors

| Token candidate                   | Usage          | Description        |
| --------------------------------- | -------------- | ------------------ |
| `color/about-services/background` | Section        | White / near-white |
| `color/about-services/heading`    | H2             | Deep navy          |
| `color/about-services/underline`  | Heading accent | Bright blue        |
| `color/about-services/card`       | Card surface   | White              |
| `color/about-services/border`     | Card border    | Pale blue          |
| `color/about-services/title`      | Service title  | Deep navy          |
| `color/about-services/body`       | Description    | Muted navy         |
| `color/about-services/action`     | Learn More     | Bright blue        |

---

# 20.1 Typography

| Element         | Approximate specification  |
| --------------- | -------------------------- |
| Section heading | `32–38 px`, semibold/bold  |
| Service title   | `16–19 px`, semibold/bold  |
| Description     | `12–14 px`, regular/medium |
| Learn More      | `11–13 px`, semibold       |

Use the site's existing font system.

---

# 21. Semantic HTML and Accessibility

## Section

Use a semantic section associated with:

```text
Featured Services
```

---

## Cards

Each Service can be represented as:

* article-like grouping,
* list item.

---

## Images

Use meaningful alt metadata describing the service visual when informative.

Do not use generic:

```text
service image
```

if better metadata exists.

---

## Learn More

Repeated `LEARN MORE` labels are ambiguous to assistive technologies.

Visible text may remain:

```text
LEARN MORE →
```

but accessible labeling should include the Service.

Example:

```text
Learn more about Dental Implants
```

---

# 22. Implementation Constraints

1. Render `about-featured-services` immediately after `about-doctors`.
2. Use centered `Featured Services` heading.
3. Preserve short blue underline.
4. Full desktop baseline uses **3 columns × 2 rows**.
5. Reference configuration contains **6 Service records**.
6. Each card is a single horizontal card.
7. Service media stays on the left.
8. Title/description/CTA stay on the right.
9. Keep all cards equal width.
10. Keep row card heights equal/near-equal.
11. Use pale-blue card borders and rounded corners.
12. Service images should use `contain`-style rendering.
13. Do not distort/crop isolated service illustrations.
14. Reuse canonical Strapi `Service` entities.
15. Preserve CMS ordering.
16. Use canonical existing codebase Service routes.
17. Do not duplicate titles/descriptions/routes inside About CMS.
18. Do not turn this section into a slider.
19. Do not automatically reuse Homepage's bottom-to-top hover color animation.
20. Do not create placeholder services to complete the six-card layout.
21. Do not duplicate Service records when fewer items exist.
22. Frontend owns grid/card geometry; Strapi owns Service content and selection.

---

# 23. Visual Acceptance Criteria

## Placement

* [ ] Section appears directly after `about-doctors`.
* [ ] It remains visually separate from the preceding Doctor carousel.

## Header

* [ ] `Featured Services` is centered.
* [ ] Short blue underline appears directly beneath heading.
* [ ] Heading style matches About page section-heading family.

## Desktop Grid

* [ ] Three cards appear in first row.
* [ ] Three cards appear in second row.
* [ ] All six reference cards are fully visible.
* [ ] No partial card is shown.
* [ ] No carousel arrows or pagination dots are introduced.
* [ ] Horizontal and vertical gaps are consistent.

## Card

* [ ] White/light surface.
* [ ] Pale-blue border.
* [ ] Rounded corners.
* [ ] Service image on left.
* [ ] Service title on right.
* [ ] Description below title.
* [ ] `LEARN MORE →` below description.
* [ ] Card content is vertically balanced.
* [ ] CTA positions remain visually consistent between cards.

## Service Content

* [ ] Dental Implants.
* [ ] Orthodontics.
* [ ] Veneers.
* [ ] Teeth Whitening.
* [ ] General Dentistry.
* [ ] Smile Makeover.

## Data

* [ ] Card information comes from canonical Service records.
* [ ] Reordering services in Strapi changes card order.
* [ ] Updating a Service title updates this section automatically.
* [ ] Updating a Service image updates this section automatically.
* [ ] `LEARN MORE` uses the current canonical Service route.

---

# 24. Initial Data-to-UI Mapping

```text
services[0]
→ Dental Implants
→ row 1 / col 1

services[1]
→ Orthodontics
→ row 1 / col 2

services[2]
→ Veneers
→ row 1 / col 3

services[3]
→ Teeth Whitening
→ row 2 / col 1

services[4]
→ General Dentistry
→ row 2 / col 2

services[5]
→ Smile Makeover
→ row 2 / col 3
```

---

# 25. CMS vs Frontend Responsibility

| Responsibility              |         Strapi         |   Frontend   |
| --------------------------- | :--------------------: | :----------: |
| Service selection           |            ✅           |              |
| Service ordering            |            ✅           |              |
| Service title               |   ✅ canonical Service  |              |
| Service description/excerpt |            ✅           |              |
| Service image               |            ✅           |              |
| Service slug/route data     | ✅ / codebase canonical | ✅ navigation |
| Section heading             |            ✅           |              |
| 3-column desktop grid       |                        |       ✅      |
| Horizontal card layout      |                        |       ✅      |
| Image/content ratio         |                        |       ✅      |
| Equal heights               |                        |       ✅      |
| Border/radius               |                        |       ✅      |
| Learn More arrow            |                        |       ✅      |
| Responsive grid             |                        |       ✅      |
| Hover/focus visual behavior |                        |       ✅      |

---

# 26. Visual / Architecture Risks

| Risk                                             | Why it matters                                | Mitigation                                           | Priority |
| ------------------------------------------------ | --------------------------------------------- | ---------------------------------------------------- | -------- |
| Reusing Homepage vertical card UI                | About screenshot uses different card geometry | Dedicated horizontal renderer                        | High     |
| Duplicating Service data in About page           | Content/routes can diverge                    | Canonical Service relations                          | High     |
| Treating six items as arbitrary hard max         | User did not define count limit               | Keep reference count separate from schema constraint | Medium   |
| Converting section to carousel                   | No design evidence                            | Use grid                                             | High     |
| Reusing Homepage hover-fill effect automatically | Interaction not specified here                | Keep section-specific behavior                       | Medium   |
| Image uses `cover`                               | Tooth/implant illustrations can be cropped    | Prefer `contain`                                     | High     |
| Different description length changes card height | Grid becomes visually uneven                  | Equal-height/flex structure                          | High     |
| CTA positions vary                               | Cards look inconsistent                       | Push action toward stable lower position             | Medium   |
| Hard-coded service URLs                          | Could break existing routing                  | Use canonical route config/slug                      | High     |
| Alphabetical sorting                             | Changes approved content order                | Preserve Strapi order                                | High     |
| Placeholder cards                                | Fake services/UI                              | Render actual records only                           | High     |
| Too much card shadow                             | Loses minimal aesthetic                       | Keep border/elevation subtle                         | Medium   |

---

# 27. Open Questions

| ID | Question                                                                                    | Blocking level                                             | Suggested owner    |
| -- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------ |
| Q1 | Must this section always contain exactly six services?                                      | CMS validation decision                                    | Product            |
| Q2 | If more than six are selected, should additional rows render or should selection be capped? | Important                                                  | Product / Designer |
| Q3 | Should descriptions use the canonical Service excerpt exactly?                              | Content architecture                                       | Product            |
| Q4 | Are these service images already fields on existing Service records?                        | Codebase/CMS verification                                  | Developer          |
| Q5 | Should the entire card be clickable or only `LEARN MORE`?                                   | Interaction decision                                       | Product            |
| Q6 | Does this section use any hover animation?                                                  | Non-blocking                                               | Designer           |
| Q7 | Should Homepage's special bottom-to-top color transition also apply here?                   | Current recommendation: **No unless explicitly requested** | Designer           |
| Q8 | What is the tablet grid configuration?                                                      | Blocking for exact tablet fidelity                         | Designer           |
| Q9 | What is the mobile card layout?                                                             | Blocking for exact mobile fidelity                         | Designer           |

---

# 28. Strapi Handoff Summary

Recommended:

```text
Service Collection
├── title
├── slug
├── shortDescription
├── cardImage
├── cardImageAlt
├── content
└── ...


About Page
└── Featured Services Section
    ├── heading
    │   └── Featured Services
    │
    └── services[]
          ↓ ordered relation
        Service
```

No duplicate About-specific copies of:

* Service name,
* Service description,
* Service image,
* Service route

unless Product explicitly requires editorial overrides.

---

# 29. Desktop Handoff

```text
                             Featured Services
                                   ───


┌───────────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────────┐
│ IMAGE │ Dental Implants   │  │ IMAGE │ Orthodontics     │  │ IMAGE │ Veneers           │
│       │ Description       │  │       │ Description       │  │       │ Description       │
│       │ LEARN MORE →      │  │       │ LEARN MORE →      │  │       │ LEARN MORE →      │
└───────────────────────────┘  └───────────────────────────┘  └───────────────────────────┘


┌───────────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────────┐
│ IMAGE │ Teeth Whitening  │  │ IMAGE │ General Dentistry │  │ IMAGE │ Smile Makeover    │
│       │ Description       │  │       │ Description       │  │       │ Description       │
│       │ LEARN MORE →      │  │       │ LEARN MORE →      │  │       │ LEARN MORE →      │
└───────────────────────────┘  └───────────────────────────┘  └───────────────────────────┘
```

---

# 30. Mandatory Coding-Agent Rules

1. Create `about-featured-services` **immediately after `about-doctors`**.
2. Full desktop reference displays **6 services in a 3 × 2 grid**.
3. This is a **grid**, not a carousel.
4. Use one centered `Featured Services` heading with short blue underline.
5. Each service uses one horizontal card:

   * image left,
   * content right.
6. Card content contains:

   * title,
   * short description,
   * `LEARN MORE →`.
7. All cards use equal width and equal/near-equal height.
8. Keep white surface, pale-blue border and rounded corners.
9. Prefer `object-fit: contain` for service illustrations.
10. Reuse canonical Strapi `Service` records.
11. Do not duplicate service title/description/image/route inside About Page unnecessarily.
12. Preserve Strapi service ordering exactly.
13. `LEARN MORE` uses the existing canonical service route from the codebase.
14. Do not rename or invent service routes.
15. Do not automatically reuse Homepage's vertical Service card layout.
16. Do not automatically reuse Homepage's bottom-to-top hover color effect.
17. Do not create placeholder services.
18. Do not duplicate items to fill a row.
19. Current reference contains six services, but do not enforce an arbitrary CMS max of six until Product confirms it.
20. Frontend controls grid/card presentation; Strapi controls service selection/content/order.
