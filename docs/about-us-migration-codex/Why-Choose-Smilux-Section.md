# UI Implementation Spec — About Us Why Choose Smilux Section

## 1. Identity

| Field                       | Value                                                                                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | Existing **About Us route in current codebase**                                                                                                    |
| Section ID                  | `about-why-choose`                                                                                                                                 |
| Section name                | `About Us — Why Choose Smilux`                                                                                                                     |
| Position in page            | **Immediately after `about-featured-services`**                                                                                                    |
| Section type                | Benefits/value-proposition grid + trust/statistics banner                                                                                          |
| Desktop benefit-card count  | `6`                                                                                                                                                |
| Desktop benefit layout      | `6 columns × 1 row`                                                                                                                                |
| Bottom trust banner         | Full-width dark-blue rounded panel                                                                                                                 |
| Statistics                  | `3`                                                                                                                                                |
| Accreditation items         | `4` in reference design                                                                                                                            |
| CMS integration             | Strapi CMS with reusable global statistics/accreditation data where appropriate                                                                    |
| Primary implementation goal | Reproduce the six-card Why Choose Smilux grid followed by the large blue trust banner containing clinic statistics and professional accreditations |
| Overall evidence quality    | High for desktop structure and hierarchy; Medium for exact sizing/colors; Low for responsive behavior                                              |

> **Critical position rule:** `about-why-choose` renders directly after `about-featured-services`.

> **Critical structure rule:** This section contains **two visually related but structurally distinct blocks**:
>
> 1. `Why Choose Smilux` benefit cards.
> 2. Blue trust/statistics/accreditation banner.
>
> Do not flatten the whole screenshot into one large image.

> **Critical CMS reuse rule:** The three statistics (`10,000+`, `15+`, `98%`) duplicate values already shown in the About Hero. Prefer a **shared source of truth** if these are intended to represent the same business statistics.

---

# 2. High-Level Section Anatomy

```text
about-why-choose
│
├── WhyChooseHeader
│   ├── Heading
│   └── DecorativeUnderline
│
├── WhyChooseGrid
│   ├── BenefitCard 01
│   ├── BenefitCard 02
│   ├── BenefitCard 03
│   ├── BenefitCard 04
│   ├── BenefitCard 05
│   └── BenefitCard 06
│
└── TrustBanner
    ├── ToothDecoration
    ├── StatisticsGroup
    │   ├── Statistic 01
    │   ├── Divider
    │   ├── Statistic 02
    │   ├── Divider
    │   └── Statistic 03
    │
    └── AccreditationPanel
        ├── Accreditation 01
        ├── Accreditation 02
        ├── Accreditation 03
        └── Accreditation 04
```

---

# 3. Scope Boundary

## Included

* USER-SPECIFIED — Section immediately follows Featured Services.
* OBSERVED — Centered heading:

  * `Why Choose Smilux`
* OBSERVED — Short blue underline.
* OBSERVED — Six benefit cards.
* OBSERVED — Benefits appear in one desktop row.
* OBSERVED — Each benefit contains:

  * blue icon,
  * title,
  * short description.
* OBSERVED — Bottom large dark-blue rounded panel.
* OBSERVED — Large decorative tooth outline on left.
* OBSERVED — Three statistics:

  * `10,000+`
  * `15+`
  * `98%`
* OBSERVED — Vertical dividers between statistics.
* OBSERVED — White accreditation panel embedded on right side of blue banner.
* OBSERVED — Four accreditation items:

  * ADA
  * ISO
  * ICOI
  * AACD
* OBSERVED — Accreditation items separated vertically.
* INFERRED — Benefit cards are CMS-editable ordered data.
* INFERRED — Stats should reuse global/About Hero statistics where semantically identical.
* INFERRED — Accreditation records may reuse an existing canonical accreditation/certificate model.

## Excluded

* UNKNOWN — benefit-card hover animation.
* UNKNOWN — card click behavior.
* UNKNOWN — stat count-up animation.
* UNKNOWN — accreditation links.
* UNKNOWN — trust-banner animation.
* UNKNOWN — exact mobile arrangement.
* UNKNOWN — tablet arrangement.
* UNKNOWN — whether benefit count is permanently fixed at six.
* UNKNOWN — whether accreditations are fixed at four.

---

# 4. Evidence and Confidence

| Item                            | Status         | Evidence                                 |
| ------------------------------- | -------------- | ---------------------------------------- |
| Section after Featured Services | USER-SPECIFIED | Explicit                                 |
| Six benefit cards               | OBSERVED       | Screenshot                               |
| One-row desktop layout          | OBSERVED       | Six complete cards visible               |
| Heading centered                | OBSERVED       | Screenshot                               |
| Large blue trust banner         | OBSERVED       | Lower portion                            |
| Three statistics                | OBSERVED       | Visible values                           |
| Four accreditation entries      | OBSERVED       | ADA / ISO / ICOI / AACD                  |
| Shared stat data                | INFERRED       | Same values already appear in About Hero |
| Accreditation canonical reuse   | INFERRED       | Similar concept already exists elsewhere |
| Animation                       | UNKNOWN        | Static screenshot                        |
| Responsive behavior             | UNKNOWN        | Desktop only                             |

---

# 5. OCR / Content Inventory

## 5.1 Section Heading

```text
Why Choose Smilux
```

---

# 5.2 Benefit 01 — Experienced Dentists

### Title

`Experienced Dentists`

### Description

`Board-certified specialists with years of clinical expertise.`

### Icon

Group / medical-professional people icon.

---

# 5.3 Benefit 02 — Advanced Digital Technology

### Title

`Advanced Digital Technology`

### Description

`State-of-the-art equipment for precise diagnosis and treatment.`

### Icon

Computer/monitor with medical cross.

---

# 5.4 Benefit 03 — Personalized Treatment Plans

### Title

`Personalized Treatment Plans`

### Description

`Care plans tailored to your needs and lifestyle.`

### Icon

Clipboard/checklist.

---

# 5.5 Benefit 04 — Transparent Consultation

### Title

`Transparent Consultation`

### Description

`Clear explanations and honest, upfront recommendations.`

### Icon

Chat/message bubble.

---

# 5.6 Benefit 05 — International-Quality Care

### Title

`International-Quality Care`

### Description

`Standards aligned with leading global dental practices.`

### Icon

Globe.

---

# 5.7 Benefit 06 — Comfortable Modern Clinic

### Title

`Comfortable Modern Clinic`

### Description

`Relaxing environment designed for your comfort and safety.`

### Icon

Dental chair.

---

# 5.8 Statistics

```text
10,000+
Happy Patients
```

```text
15+
Years of Experience
```

```text
98%
Patient Satisfaction
```

These match the About Hero statistics and should not be duplicated unnecessarily in CMS.

---

# 5.9 Accreditation Panel

Visible entries:

### ADA

```text
ADA
American Dental
Association
```

### ISO

```text
ISO
International
Standards
```

### ICOI

```text
ICOI
International Congress
of Oral Implantologists
```

### AACD

```text
AACD
American Academy
of Cosmetic Dentistry
```

Exact production organization copy should come from approved CMS/Figma data.

---

# 6. Desktop Layout

## 6.1 Overall

```text
                           Why Choose Smilux
                                  ───


┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│    ICON    │ │    ICON    │ │    ICON    │ │    ICON    │ │    ICON    │ │    ICON    │
│            │ │            │ │            │ │            │ │            │ │            │
│ Benefit 1  │ │ Benefit 2  │ │ Benefit 3  │ │ Benefit 4  │ │ Benefit 5  │ │ Benefit 6  │
│            │ │            │ │            │ │            │ │            │ │            │
│ Description│ │ Description│ │ Description│ │ Description│ │ Description│ │ Description│
└────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘


┌────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                    │
│   TOOTH       10,000+       │       15+       │        98%       ┌──────────────┐   │
│               Happy         │       Years      │        Patient   │ ADA ISO ICOI │   │
│               Patients      │       Experience │        Satisfaction│ AACD       │   │
│                                                                  └──────────────┘   │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

# 7. Section Heading

## Heading

```text
Why Choose Smilux
```

Visual requirements:

* center aligned,
* dark navy,
* semibold/bold,
* same About-page heading system as:

  * `Core Values`,
  * `Meet Our Doctors`,
  * `Featured Services`.

Approximate desktop size:

`32–38 px estimated`

---

## Decorative Underline

* short,
* centered,
* bright blue,
* approximately `35–50 px` wide,
* `2–3 px` high.

This underline should use the same shared `CenteredSectionHeading` component used by the other About sections.

---

# 8. Benefit Grid

## 8.1 Desktop Contract

Reference:

```text
visibleBenefits = 6
columns = 6
rows = 1
```

No carousel.

No navigation arrows.

No pagination.

---

## 8.2 Card Geometry

| Property    | Specification    |
| ----------- | ---------------- |
| Width       | Equal            |
| Height      | Equal/near-equal |
| Surface     | White            |
| Border      | Pale blue        |
| Radius      | Medium           |
| Shadow      | Very subtle      |
| Alignment   | Center           |
| Icon        | Top              |
| Title       | Below icon       |
| Description | Below title      |

These cards visually resemble the `about-core-values` cards, but content/icon semantics are different.

---

# 8.3 Card Anatomy

```text
WhyChooseCard
├── Icon
├── Title
└── Description
```

Visual:

```text
┌──────────────────┐
│                  │
│       ICON       │
│                  │
│     BENEFIT      │
│      TITLE       │
│                  │
│      Short       │
│   description    │
│                  │
└──────────────────┘
```

---

# 8.4 Card Alignment

All content is center aligned.

Unlike the About Featured Services cards:

```text
image left + content right
```

these benefit cards use:

```text
icon top + centered content
```

---

# 9. Benefit Icons

## Shared Visual Style

Icons use:

* blue,
* outline or controlled blue pictogram treatment,
* no large solid circular background,
* approximately equal visual size,
* consistent stroke weight.

---

## Required Mapping

| Benefit                      | Icon                |
| ---------------------------- | ------------------- |
| Experienced Dentists         | People/team         |
| Advanced Digital Technology  | Medical monitor     |
| Personalized Treatment Plans | Clipboard/checklist |
| Transparent Consultation     | Message bubble      |
| International-Quality Care   | Globe               |
| Comfortable Modern Clinic    | Dental chair        |

---

# 9.1 CMS Icon Strategy

Preferred:

```text
iconKey
```

using controlled icon values.

Example:

```text
team
medical-monitor
clipboard
message
globe
dental-chair
```

Frontend maps those values to the approved icon set.

Avoid arbitrary editor-uploaded icon images if possible, because this can introduce inconsistent:

* colors,
* stroke weights,
* dimensions.

---

# 10. Benefit Card Height Stability

Several titles wrap to two lines:

```text
Experienced
Dentists
```

```text
Advanced Digital
Technology
```

```text
Personalized
Treatment Plans
```

Therefore all cards should reserve consistent title space.

Recommended:

```text
WhyChooseCard
├── icon area
├── title area with stable min-height
└── description
```

This prevents description blocks from starting at different vertical positions.

---

# 11. Trust Banner

## 11.1 Identity

The lower area is a **single dark-blue rounded parent banner**.

It contains:

1. decorative tooth,
2. statistics,
3. accreditation panel.

Do not split this into unrelated independent cards with large external gaps.

---

# 11.2 Geometry

| Property   | Specification                          |
| ---------- | -------------------------------------- |
| Background | Deep blue gradient / dark-blue surface |
| Radius     | Large                                  |
| Width      | Nearly same width as benefit grid      |
| Layout     | Horizontal                             |
| Height     | Compact banner                         |
| Text       | White/light                            |
| Overflow   | Hidden                                 |

The screenshot suggests a subtle left-to-right blue tonal variation.

Exact gradient values are not available.

---

# 11.3 Structure

```text
TrustBanner
├── ToothDecoration
├── StatsArea
│   ├── Stat 01
│   ├── Divider
│   ├── Stat 02
│   ├── Divider
│   └── Stat 03
└── AccreditationPanel
```

---

# 12. Tooth Decoration

Large outline tooth icon appears at far-left.

Characteristics:

* oversized compared with stats icons,
* blue/cyan outline,
* low visual contrast against blue background,
* decorative only.

This should be frontend styling, not a CMS content item.

Recommended:

```text
aria-hidden = true
```

if implemented as SVG.

---

# 13. Statistics Group

## 13.1 Statistics

### Stat 01

```text
10,000+
Happy Patients
```

### Stat 02

```text
15+
Years of Experience
```

### Stat 03

```text
98%
Patient Satisfaction
```

---

# 13.2 Stat Appearance

Values:

* large,
* white,
* semibold/bold.

Labels:

* smaller,
* white/light,
* slightly muted.

---

# 13.3 Dividers

Thin vertical dividers appear between statistics.

Concept:

```text
10,000+       │       15+       │       98%
Happy         │       Years     │       Patient
Patients      │       ...       │       Satisfaction
```

Dividers should be low-opacity/light-blue.

---

# 13.4 Shared Statistic Data

These values already appear in `about-hero`.

Recommended architecture:

```text
About / Global Statistics
├── happyPatients
├── yearsExperience
└── patientSatisfaction
```

Consumed by:

```text
about-hero
about-why-choose
```

Do not maintain two independent versions:

```text
aboutHero.happyPatients = 10,000+
whyChoose.happyPatients = 12,000+
```

unless Product explicitly wants different editorial data.

---

# 14. Accreditation Panel

## 14.1 Geometry

The right area of the trust banner contains a white rounded inset panel.

```text
TrustBanner
└── AccreditationPanel
    ├── ADA
    ├── ISO
    ├── ICOI
    └── AACD
```

---

# 14.2 Appearance

| Property           | Specification            |
| ------------------ | ------------------------ |
| Surface            | White                    |
| Radius             | Large/moderate           |
| Layout             | 4 equal horizontal items |
| Item alignment     | Center                   |
| Separators         | Thin vertical lines      |
| Logo/title         | Upper area               |
| Organization label | Lower area               |

---

# 14.3 Desktop Topology

```text
┌──────────────────────────────────────────────┐
│   ADA     │   ISO     │   ICOI    │   AACD  │
│           │           │           │         │
│ American  │ Internat. │ Internat. │ American│
│ Dental    │ Standards │ Congress  │ Academy │
└──────────────────────────────────────────────┘
```

---

# 14.4 Important Distinction From Homepage Certificate Section

Homepage certificate section uses:

```text
logo summary
+
large certificate image
```

The About Why Choose panel shows only compact accreditation branding/text.

Therefore do not render full framed certificate images here.

Recommended shared model:

```text
Accreditation
├── logo
├── shortName
├── shortDescription
└── certificateImage?
```

Homepage may use:

```text
logo + description + certificateImage
```

About may use:

```text
logo + shortDescription
```

Same canonical accreditation data can feed both layouts.

---

# 15. Canonical Accreditation Model

Recommended:

```text
Accreditation
├── name
├── shortName
├── logo
├── shortDescription
├── certificateImage?
└── sort metadata?
```

Examples:

```text
ADA
ISO
ICOI
AACD
```

Then:

```text
Homepage Certificates
→ selected Accreditation records
→ render full certificate presentation
```

```text
About Why Choose
→ selected Accreditation records
→ render compact trust badges
```

---

# 16. Strapi CMS Contract

## 16.1 Recommended About Section

```text
About Page
└── Why Choose Section
    ├── heading
    ├── benefits[]
    ├── statistics
    └── accreditations[]
```

However, if statistics/accreditations are already canonical/shared, use relations rather than duplicate values.

---

# 16.2 Benefit Component

Recommended:

```text
why-choose-benefit
├── title
├── description
└── iconKey
```

Fields:

| Field         | Type                   | Required |
| ------------- | ---------------------- | -------: |
| `title`       | Short text             |      Yes |
| `description` | Short/long text        |      Yes |
| `iconKey`     | Controlled enumeration |      Yes |

---

# 16.3 Current Benefit Data

```text
benefits[0]
Experienced Dentists
```

```text
benefits[1]
Advanced Digital Technology
```

```text
benefits[2]
Personalized Treatment Plans
```

```text
benefits[3]
Transparent Consultation
```

```text
benefits[4]
International-Quality Care
```

```text
benefits[5]
Comfortable Modern Clinic
```

Preserve this order.

---

# 16.4 Statistics

Preferred relation/reference:

```text
statistics
→ About/Global Clinic Statistics
```

rather than three separate copies in this component.

---

# 16.5 Accreditations

Preferred:

```text
accreditations[]
    ↓ ordered relation
Accreditation Collection
```

Current reference contains:

```text
ADA
ISO
ICOI
AACD
```

---

# 17. Count Rules

## Benefits

Reference count:

```text
6
```

but no explicit min/max has been provided.

Do not automatically enforce a hard maximum without Product confirmation.

For screenshot fidelity, current About configuration should contain six.

---

## Statistics

The layout is clearly designed around:

```text
3 statistics
```

and these correspond to established site-level metrics.

Prefer a fixed semantic stats structure rather than a completely arbitrary list.

---

## Accreditations

Reference count:

```text
4
```

No explicit max/min requirement was provided here.

The white inset design is optimized for four items.

If Product allows more, layout behavior should be confirmed before unrestricted CMS growth.

---

# 18. Data-to-UI Mapping

```text
benefits[0..5]
        ↓
6-card desktop grid
```

```text
sharedStats
        ↓
TrustBanner statistics
```

```text
selectedAccreditations[0..3]
        ↓
TrustBanner white accreditation panel
```

---

# 19. Component Contract

Recommended frontend structure:

```text
AboutWhyChooseSection
├── CenteredSectionHeading
├── WhyChooseGrid
│   └── WhyChooseCard[]
│
└── TrustBanner
    ├── DecorativeToothIcon
    ├── StatsGroup
    │   └── StatItem[]
    └── AccreditationPanel
        └── AccreditationBadge[]
```

Reusable components:

| Component                | Responsibility                |
| ------------------------ | ----------------------------- |
| `CenteredSectionHeading` | Shared About heading          |
| `WhyChooseCard`          | Benefit icon/title/copy       |
| `ClinicStats`            | Reusable stat representation  |
| `AccreditationBadge`     | Compact accreditation display |
| `TrustBanner`            | Blue panel layout             |

---

# 20. CMS vs Frontend Responsibility

| Responsibility              |       Strapi       |     Frontend     |
| --------------------------- | :----------------: | :--------------: |
| Section heading             |          ✅         |                  |
| Benefit title               |          ✅         |                  |
| Benefit description         |          ✅         |                  |
| Benefit order               |          ✅         |                  |
| Benefit icon key            |          ✅         | ✅ icon rendering |
| Statistics values           | ✅ shared preferred |                  |
| Accreditation selection     |          ✅         |                  |
| Accreditation order         |          ✅         |                  |
| Accreditation logo/content  | ✅ canonical record |                  |
| Six-column desktop geometry |                    |         ✅        |
| Equal-height cards          |                    |         ✅        |
| Blue trust banner           |                    |         ✅        |
| Tooth decoration            |                    |         ✅        |
| Dividers                    |                    |         ✅        |
| White accreditation panel   |                    |         ✅        |
| Responsive behavior         |                    |         ✅        |

---

# 21. Responsive Specification

## Desktop

Reference:

```text
6 benefits × 1 row
```

followed by:

```text
[ tooth ][ stat ][ stat ][ stat ][ accreditation panel ]
```

---

## Tablet

Exact design unknown.

Structurally reasonable benefit fallback:

```text
3 columns × 2 rows
```

Trust banner may need internal wrapping.

This remains `INFERRED`.

---

## Mobile

Exact design unknown.

Likely benefit fallback:

```text
1–2 cards per row
```

Trust banner likely needs vertical stacking, for example:

```text
Statistics
↓
Accreditations
```

But this is not an approved design specification.

---

# 21.1 No Carousel

There is no carousel evidence for the benefit cards.

Do not reuse the Doctor slider pattern.

---

# 22. Interaction Specification

The screenshot presents this as informational content.

Therefore baseline:

* benefit cards static,
* statistics static,
* accreditations static.

Do not add:

* card flip,
* slider,
* stat count-up,
* badge tooltip,
* accreditation modal,
* click navigation,

without an explicit requirement.

---

# 23. Accessibility

## Benefit Cards

Use real text for:

* title,
* description.

Icons are supplementary and can generally be decorative.

---

## Statistics

Values and labels must remain text.

Do not bake numbers into the blue banner image.

---

## Accreditation Logos

If logo is paired with visible text, avoid redundant verbose alt.

If the logo contains the only organization identification, provide suitable accessible naming.

---

## Tooth Decoration

Decorative only.

Hide from assistive technology.

---

# 24. Implementation Constraints

1. Render `about-why-choose` immediately after `about-featured-services`.
2. Section contains **two blocks**:

   * six benefit cards,
   * blue trust banner.
3. Do not flatten the section into a single image.
4. Heading is centered with a short blue underline.
5. Full desktop shows six benefit cards in one row.
6. Cards have equal dimensions.
7. Each card contains icon, title and short description.
8. Benefit icons use a consistent blue icon system.
9. No benefit carousel.
10. Do not invent card hover effects.
11. Trust banner is one large rounded dark-blue container.
12. Preserve oversized decorative tooth on the left.
13. Preserve three statistics and vertical separators.
14. Reuse About/global statistic values where they represent the same data.
15. Preserve white accreditation inset panel on the right.
16. Render accreditation entries individually, not as a flattened panel image.
17. Prefer canonical Accreditation records shared with Homepage certificates.
18. Do not show framed certificate images in this section.
19. CMS controls text/data/order; frontend controls geometry and visual treatment.

---

# 25. Visual Acceptance Criteria

## Heading

* [ ] `Why Choose Smilux` centered.
* [ ] Short blue underline centered below.

## Benefits

* [ ] Six complete cards visible on full desktop.
* [ ] All cards same width.
* [ ] All cards equal/near-equal height.
* [ ] Icons centered.
* [ ] Titles centered.
* [ ] Descriptions centered.
* [ ] White card surfaces.
* [ ] Pale-blue borders.
* [ ] Rounded corners.
* [ ] No slider arrows or pagination.

## Benefit Content

* [ ] Experienced Dentists.
* [ ] Advanced Digital Technology.
* [ ] Personalized Treatment Plans.
* [ ] Transparent Consultation.
* [ ] International-Quality Care.
* [ ] Comfortable Modern Clinic.

## Trust Banner

* [ ] Large blue rounded banner appears below cards.
* [ ] Decorative tooth icon appears at left.
* [ ] `10,000+ / Happy Patients`.
* [ ] `15+ / Years of Experience`.
* [ ] `98% / Patient Satisfaction`.
* [ ] Thin dividers separate the statistics.
* [ ] White accreditation panel appears at right.

## Accreditation Panel

* [ ] ADA.
* [ ] ISO.
* [ ] ICOI.
* [ ] AACD.
* [ ] Four items align horizontally.
* [ ] Thin vertical separators appear between entries.
* [ ] White inset panel has rounded corners.
* [ ] No large framed certificates appear.

---

# 26. Shared Data Architecture

Recommended:

```text
                   GLOBAL / CANONICAL DATA

          ┌──────────────────┬──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
 Clinic Statistics       Accreditation      Service/Doctor
          │               Collection          Collections
          │                  │
     ┌────┴────┐        ┌────┴─────────┐
     │         │        │              │
     ▼         ▼        ▼              ▼
About Hero  WhyChoose  Homepage      About
                       Certificates  WhyChoose
```

This prevents duplicated business claims and credentials.

---

# 27. Visual / Architecture Risks

| Risk                                     | Why it matters                           | Mitigation                         | Priority |
| ---------------------------------------- | ---------------------------------------- | ---------------------------------- | -------- |
| Flattening blue banner into image        | Stats/accreditations become non-editable | Build real components              | High     |
| Duplicating stat values                  | About Hero and Why Choose can diverge    | Shared stats source                | High     |
| Recreating accreditation data separately | Certification labels/logos may conflict  | Canonical Accreditation collection | High     |
| Rendering full certificates here         | Wrong visual variant                     | Compact accreditation badges only  | High     |
| Making benefit grid a carousel           | No design evidence                       | Six-column desktop grid            | High     |
| Unequal title heights                    | Description alignment breaks             | Stable title region                | Medium   |
| Arbitrary uploaded icons                 | Visual inconsistency                     | Controlled icon keys               | Medium   |
| Banner becomes too tall                  | Loses compact premium composition        | Preserve horizontal desktop layout | Medium   |
| Strong tooth decoration                  | Competes with stats                      | Low-contrast outline               | Medium   |
| Hard-coded stats in frontend             | CMS loses control                        | Shared CMS/global settings         | High     |
| Too many accreditations added            | White panel becomes overcrowded          | Define count rule before expanding | Medium   |

---

# 28. Open Questions

| ID | Question                                                                                          | Blocking level           | Suggested owner     |
| -- | ------------------------------------------------------------------------------------------------- | ------------------------ | ------------------- |
| Q1 | Are the six Why Choose benefits always fixed at six?                                              | CMS validation decision  | Product             |
| Q2 | Should the stats reference the same global values used in About Hero?                             | Recommended yes          | Product / Developer |
| Q3 | Is `AACD` intentionally different from the `AAO` item shown in the Homepage Certificate section?  | **Content verification** | Product / Designer  |
| Q4 | Should accreditation data come from the same canonical Accreditation collection used by Homepage? | Architecture decision    | Developer           |
| Q5 | Are accreditation logos actual uploaded media or frontend-controlled brand assets?                | Implementation decision  | Developer           |
| Q6 | Do any benefit cards have hover interaction?                                                      | Non-blocking             | Designer            |
| Q7 | Is the trust-banner blue surface a flat color or gradient?                                        | Visual fidelity          | Designer            |
| Q8 | What is tablet layout for the trust banner?                                                       | Responsive decision      | Designer            |
| Q9 | What is mobile layout?                                                                            | Responsive decision      | Designer            |

---

# 29. Important Accreditation Content Note

The Homepage Certificate section previously displayed:

```text
ADA
ISO
ICOI
AAO
```

The current About screenshot displays:

```text
ADA
ISO
ICOI
AACD
```

These are different organizations.

Do **not** silently convert:

```text
AACD → AAO
```

or vice versa.

If both are valid business accreditations, canonical Accreditation data can simply contain both records and each section selects the correct set.

---

# 30. Strapi Handoff Summary

Recommended:

```text
About Page
└── Why Choose Section
    ├── heading
    │   └── Why Choose Smilux
    │
    ├── benefits[]
    │   ├── title
    │   ├── description
    │   └── iconKey
    │
    ├── statistics
    │   └── reference → shared clinic statistics
    │
    └── accreditations[]
        ↓ ordered relation
      Accreditation
```

Canonical:

```text
Clinic Statistics
├── happyPatients
├── yearsExperience
└── patientSatisfaction
```

```text
Accreditation
├── name
├── shortName
├── logo
├── shortDescription
└── certificateImage?
```

---

# 31. Desktop Handoff

```text
                              Why Choose Smilux
                                     ───


 [ BENEFIT ] [ BENEFIT ] [ BENEFIT ] [ BENEFIT ] [ BENEFIT ] [ BENEFIT ]


┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│   TOOTH       10,000+        │       15+       │       98%      ┌─────────────┐ │
│               Happy          │       Years     │       Patient  │ ADA │ ISO   │ │
│               Patients       │       Exp.      │       Satisf.  │ ICOI│ AACD  │ │
│                                                             →   └─────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

# 32. Mandatory Coding-Agent Rules

1. Create `about-why-choose` **immediately after `about-featured-services`**.
2. Render centered `Why Choose Smilux` heading with short blue underline.
3. Full desktop baseline uses **6 benefit cards in one row**.
4. Each benefit card contains:

   * blue icon,
   * title,
   * description.
5. Benefit cards are informational/static unless another interaction is supplied.
6. Do not add carousel behavior.
7. Use equal-width/equal-height card geometry.
8. Preserve controlled icon mapping for all six benefits.
9. Render the lower trust area as **one large rounded blue banner**.
10. Preserve oversized decorative tooth outline on the left.
11. Render the three statistics as real text/components.
12. Prefer sharing those statistics with `about-hero`.
13. Preserve vertical dividers between statistics.
14. Render the accreditation area as a separate white inset inside the blue banner.
15. Current accreditation set is:

    * ADA,
    * ISO,
    * ICOI,
    * AACD.
16. Do not replace AACD with AAO merely because another section uses AAO.
17. Prefer canonical Accreditation relations shared with the Homepage Certificate section.
18. Do not display full certificate images inside this About section.
19. Do not flatten the trust banner or accreditation panel into one bitmap.
20. Strapi owns content/data/order; frontend owns visual geometry, dividers, icons, banner treatment and responsive behavior.
