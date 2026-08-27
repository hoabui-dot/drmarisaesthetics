# UI Implementation Spec — About Us Hero Section

## 1. Identity

| Field                       | Value                                                                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | Existing **About Us route in current codebase** — do not rename or invent a new route                                                         |
| Section ID                  | `about-hero`                                                                                                                                  |
| Section name                | `About Us Hero`                                                                                                                               |
| Page                        | About Us                                                                                                                                      |
| Position                    | First content section directly underneath / behind `SiteHeader`                                                                               |
| Layout family               | **Reuse Homepage Hero layout/system**                                                                                                         |
| Header state                | Global header; `ABOUT US` is active                                                                                                           |
| Background model            | Full hero background image / cover composition with light fade on left                                                                        |
| Primary implementation goal | Reuse the existing Homepage Hero structural/layout implementation while substituting About-specific content, hero asset and bottom statistics |
| Overall evidence quality    | High for desktop layout and content; Medium for exact sizing; Low for responsive behavior not otherwise defined by Homepage Hero              |

> **Critical reuse rule:** Do **not** build a second independent hero implementation for About Us. This section uses the same overall hero system as Homepage:
>
> * transparent global header,
> * full-width hero background composition,
> * content anchored on the left,
> * visual subject dominant on the right,
> * light/white fade behind text,
> * large image reaching the right/bottom edges.
>
> Only page-specific **content, media and action/content modules** should differ.

> **Critical routing rule:** `ABOUT US` must point to the existing About Us route already present in the codebase. Do not alter routing while implementing this section.

---

# 2. Relationship With Homepage Hero

The About Us hero should share the same implementation foundation as:

```text
home-hero
```

Recommended conceptual architecture:

```text
HeroShell
├── Global SiteHeader
├── HeroBackground
├── HeroContent
└── HeroBottomContent
```

Then:

```text
HomepageHero
└── HeroShell
    ├── Homepage background
    ├── Homepage copy
    ├── CTA buttons
    └── Social proof
```

and:

```text
AboutHero
└── HeroShell
    ├── About background
    ├── About copy
    └── Statistics
```

### Do not duplicate

Avoid creating unrelated implementations such as:

```text
HomeHero
AboutHeroCompletelyDifferentCSS
ServicesHeroCompletelyDifferentCSS
```

when the visual system clearly belongs to the same hero family.

Preferred:

```text
SharedHeroLayout
├── variant = home
└── variant = about
```

or equivalent component composition consistent with the current frontend architecture.

---

# 3. Scope Boundary

## Included

* OBSERVED — Global transparent header appears over hero.
* OBSERVED — Smilux image logo in header.
* OBSERVED — `ABOUT US` active navigation state.
* OBSERVED — Eyebrow:

  * `ABOUT SMILUX`
* OBSERVED — Main heading:

  * `About Smilux`
  * `Trusted Dental Excellence`
  * `Built Around You.`
* OBSERVED — Supporting paragraph.
* OBSERVED — Three bottom statistics:

  * `10,000+ / Happy Patients`
  * `15+ / Years of Experience`
  * `98% / Patient Satisfaction`
* OBSERVED — One icon per statistic.
* OBSERVED — Vertical dividers between statistics.
* OBSERVED — Dental treatment scene dominating right side.
* OBSERVED — Smilux wall branding inside/right portion of the clinic scene.
* OBSERVED — Large curved/rounded lower-right hero boundary.
* USER-SPECIFIED — Background/layout follows Homepage Hero.
* USER-SPECIFIED — Content/action configuration differs from Homepage Hero.

## Excluded

* Global Header internal specification — covered separately by `SiteHeader`.
* UNKNOWN — additional button/action not shown in supplied screenshot.
* UNKNOWN — hero animation.
* UNKNOWN — image parallax.
* UNKNOWN — statistic counter animation.
* UNKNOWN — responsive About-specific deviations from shared hero behavior.
* UNKNOWN — whether stats are live/dynamic business data.
* UNKNOWN — whether hero subject image is one baked image or several Figma layers.

---

# 4. Evidence and Confidence

| Item                             | Status                | Evidence / reason                                    |
| -------------------------------- | --------------------- | ---------------------------------------------------- |
| Shared layout with Homepage Hero | USER-SPECIFIED        | Explicit requirement                                 |
| Desktop composition              | OBSERVED              | Supplied screenshot                                  |
| Global header position           | OBSERVED              | Header appears inside top visual composition         |
| Transparent header               | OBSERVED / inherited  | Same visual model as Homepage Hero                   |
| Active `ABOUT US` item           | OBSERVED              | Blue label + underline                               |
| Main hero background             | OBSERVED              | Full clinic scene dominates hero                     |
| Left white/light fade            | OBSERVED              | Copy remains readable over low-detail area           |
| Heading content                  | OBSERVED              | Clearly readable                                     |
| Statistics                       | OBSERVED              | Three visible items                                  |
| CTA in hero content              | UNKNOWN / not visible | No standalone About CTA visible in screenshot        |
| Typography exact tokens          | INFERRED              | Relative hierarchy visible                           |
| Responsive behavior              | INHERITED / UNKNOWN   | Reuse shared hero behavior where already implemented |

---

# 5. OCR Content Inventory

## 5.1 Eyebrow

`ABOUT SMILUX`

* Type: Eyebrow / section label
* Confidence: High

---

## 5.2 Main heading

Visible hierarchy:

```text
About Smilux
Trusted Dental Excellence
Built Around You.
```

Confidence: High.

### Important visual hierarchy

The first line:

```text
About Smilux
```

has the strongest/boldest visual weight.

The following lines:

```text
Trusted Dental Excellence
Built Around You.
```

remain large but visually lighter than `About Smilux`.

Do not automatically apply exactly the same font weight to all three lines.

---

## 5.3 Supporting paragraph

Visible text:

`At Smilux Dental, we combine advanced technology, international expertise, and a passion for people, to deliver exceptional care and lasting smiles.`

Confidence: High.

Preserve approved source copy exactly once confirmed in Figma/Strapi.

---

## 5.4 Statistics

### Statistic 01

```text
10,000+
Happy Patients
```

### Statistic 02

```text
15+
Years of Experience
```

### Statistic 03

```text
98%
Patient Satisfaction
```

Confidence: High.

---

# 6. Layout Anatomy

## 6.1 Global geometry

| Property          | Specification                                             | Status                    |
| ----------------- | --------------------------------------------------------- | ------------------------- |
| Width             | Full viewport                                             | OBSERVED                  |
| Height            | Large hero / approximately viewport-dominant              | OBSERVED                  |
| Background        | Full-width clinic image composition                       | OBSERVED                  |
| Background sizing | Cover/fill hero region while preserving focal composition | USER-SPECIFIED / INFERRED |
| Left content area | Approximately `38–43%`                                    | INFERRED                  |
| Right visual area | Approximately `57–62%`                                    | INFERRED                  |
| Header            | Overlay/integrated with hero                              | OBSERVED                  |
| Content alignment | Left                                                      | OBSERVED                  |
| Statistics        | Horizontal row beneath paragraph                          | OBSERVED                  |
| Lower-right shape | Large rounded/curved crop                                 | OBSERVED                  |

---

# 6.2 Structure tree

```text
Page: About Us
├── SiteHeader
│   ├── Logo
│   ├── Navigation
│   │   └── ABOUT US = active
│   └── Book Appointment CTA
│
└── Section: about-hero
    ├── HeroBackground
    │   └── About dental-clinic visual
    │
    ├── HeroContent
    │   ├── Eyebrow
    │   ├── Heading
    │   │   ├── About Smilux
    │   │   ├── Trusted Dental Excellence
    │   │   └── Built Around You.
    │   └── Description
    │
    └── Statistics
        ├── Statistic 01
        │   ├── Icon
        │   ├── Value
        │   └── Label
        ├── Divider
        ├── Statistic 02
        ├── Divider
        └── Statistic 03
```

---

# 6.3 Desktop topology

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ LOGO          HOME   ABOUT US   SERVICES ...             BOOK APPOINTMENT │
│                      ────────                                            │
│                                                                           │
│ ABOUT SMILUX                                                              │
│                                                                           │
│ About Smilux                    DENTIST / PATIENT / CLINIC VISUAL          │
│ Trusted Dental Excellence                                                │
│ Built Around You.                                                         │
│                                                                           │
│ Supporting paragraph...                                                   │
│                                                                           │
│  ICON          ICON          ICON                                         │
│ 10,000+   │    15+      │    98%                                          │
│ Happy     │    Years     │    Patient                                     │
│ Patients  │    Experience│    Satisfaction                               │
│                                                                           │
│                                           RIGHT-SIDE DENTAL SCENE          │
└───────────────────────────────────────────────────────────────────────────╯
```

---

# 7. Shared Hero Layout Contract

## 7.1 Same elements as Homepage Hero

Reuse the shared behavior for:

* overall hero width/height model,
* global container/gutters,
* header placement,
* transparent header mode,
* background layer,
* left-side content anchoring,
* right-side image dominance,
* white/light text-supporting fade,
* large lower-right rounded clipping,
* desktop responsive container logic.

---

# 7.2 About-specific differences

Homepage Hero:

```text
Eyebrow
Heading
Paragraph
Primary CTA
Secondary CTA
Social proof
```

About Hero:

```text
Eyebrow
Heading
Paragraph
Statistics
```

Therefore the shared hero must allow interchangeable lower-content modules.

Recommended conceptual contract:

```text
HeroShell
├── headingContent
└── bottomSlot
```

Examples:

```text
Home:
bottomSlot = CTA + SocialProof
```

```text
About:
bottomSlot = Statistics
```

Do not hard-code Homepage CTA structure directly inside the shared hero shell.

---

# 8. Background Image Specification

## 8.1 Critical rule

The supplied About visual should be treated as the page-specific hero media asset.

Conceptually:

```text
AboutHero
└── backgroundImage = aboutHeroImage
```

The shared Homepage hero image must **not** be reused.

---

# 8.2 Visual content

Visible right-side visual contains:

* dentist wearing surgical mask,
* white dental coat,
* seated female patient,
* dental chair,
* dental monitor displaying dental imagery,
* Smilux branding on wall,
* bright modern dental clinic environment.

---

# 8.3 Background positioning

The image focal area must preserve:

* dentist around center/right,
* patient in lower-right,
* Smilux wall logo upper-right,
* diagnostic screen right-middle.

Left side should remain low-detail/light enough for text.

---

# 8.4 Fade treatment

The screenshot shows a substantial white/light region between text and primary subject.

Possible implementations:

1. fade baked into hero image,
2. overlay gradient,
3. Figma compositing.

Status: `UNKNOWN`.

### Rule

Inspect source hero asset first.

Do not add a second strong white gradient if the source image already includes the fade.

---

# 8.5 Hero boundary

Lower-right edge uses a large curved/rounded shape consistent with Homepage Hero family.

This geometry should come from the shared Hero shell rather than duplicated About-only CSS wherever possible.

---

# 9. Header Integration

## 9.1 Global header reuse

Use the existing:

```text
SiteHeader
```

Do not create:

```text
AboutHeader
```

---

# 9.2 Active state

On About page:

```text
ABOUT US
```

must use the active navigation style:

* bright blue text,
* short blue underline.

Other navigation links use default dark/navy style.

---

# 9.3 Route source

Use the actual current router state.

Do not hard-code:

```text
active = "ABOUT US"
```

inside a page-specific duplicate header.

Correct:

```text
currentRoute
→ SiteHeader
→ ABOUT US active
```

---

# 9.4 Background

Same rule as Homepage Hero initial state:

* transparent,
* no separate white bar,
* no drop shadow,
* no bottom border,
* no backdrop blur unless an existing approved state requires it.

---

# 10. Heading Specification

## 10.1 Eyebrow

```text
ABOUT SMILUX
```

* uppercase,
* blue,
* smaller than heading,
* semi-bold,
* slight letter spacing.

---

# 10.2 Heading hierarchy

```text
About Smilux
Trusted Dental Excellence
Built Around You.
```

### Visual hierarchy

`About Smilux`

* strongest weight,
* dark navy,
* approximately `54–60 px estimated`.

Remaining two lines:

* large dark navy,
* lighter/regular or medium weight relative to first line,
* approximately `40–46 px estimated`.

Exact source typography is UNKNOWN.

---

# 10.3 Line control

Desktop should preserve this visual structure:

```text
About Smilux
Trusted Dental Excellence
Built Around You.
```

Avoid accidental browser wrapping into:

```text
Trusted Dental
Excellence Built
Around You.
```

at reference viewport.

Whether the CMS stores one heading or explicit line fields depends on existing hero architecture.

For screenshot fidelity, explicit display lines are safer.

---

# 11. Description Specification

Text:

`At Smilux Dental, we combine advanced technology, international expertise, and a passion for people, to deliver exceptional care and lasting smiles.`

### Visual behavior

* left aligned,
* dark/muted navy,
* narrower than heading region,
* approximately 3 lines in supplied desktop screenshot,
* generous line-height.

---

# 12. Statistics Module

## 12.1 Overall structure

```text
StatisticsRow
├── StatItem
├── VerticalDivider
├── StatItem
├── VerticalDivider
└── StatItem
```

This is one cohesive hero submodule.

---

# 12.2 Desktop topology

```text
     icon                   icon                    icon

   10,000+          │       15+            │       98%
   Happy            │       Years of        │       Patient
   Patients         │       Experience      │       Satisfaction
```

---

# 12.3 Statistics layout

| Property      | Specification                              | Status   |
| ------------- | ------------------------------------------ | -------- |
| Count visible | `3`                                        | OBSERVED |
| Arrangement   | Horizontal                                 | OBSERVED |
| Item width    | Equal / near-equal                         | OBSERVED |
| Alignment     | Left/center hybrid within each stat region | OBSERVED |
| Dividers      | Vertical, pale blue/gray                   | OBSERVED |
| Icon          | Above numeric value                        | OBSERVED |
| Value         | Large bold navy                            | OBSERVED |
| Label         | Smaller navy/gray                          | OBSERVED |

---

# 12.4 Stat 01

### Icon concept

Patient/people/heart-like healthcare icon.

Exact icon source must come from Figma/design system.

### Value

`10,000+`

### Label

`Happy Patients`

---

# 12.5 Stat 02

### Icon

Dental/implant/professional experience-related outline icon.

### Value

`15+`

### Label

```text
Years of
Experience
```

---

# 12.6 Stat 03

### Icon

Heart outline.

### Value

`98%`

### Label

```text
Patient
Satisfaction
```

---

# 12.7 Animation

No counter animation is visible or specified.

Do **not** automatically animate:

```text
0 → 10,000+
0 → 15+
0 → 98%
```

unless a later interaction requirement explicitly requests it.

---

# 13. Strapi CMS Contract

## 13.1 Recommended About Hero configuration

```text
About Page
└── Hero
    ├── backgroundImage
    ├── eyebrow
    ├── heading
    ├── description
    └── statistics[]
```

---

# 13.2 Recommended fields

| Field                   | Type                        |    Required |
| ----------------------- | --------------------------- | ----------: |
| `backgroundImage`       | Media                       |         Yes |
| `backgroundImageAlt`    | Short text / media metadata | Recommended |
| `eyebrow`               | Short text                  |         Yes |
| `headingPrimary`        | Short text                  |         Yes |
| `headingSecondaryLine1` | Short text                  |         Yes |
| `headingSecondaryLine2` | Short text                  |         Yes |
| `description`           | Long text                   |         Yes |
| `statistics`            | Repeatable component        |         Yes |

Example:

```text
eyebrow:
ABOUT SMILUX

headingPrimary:
About Smilux

headingSecondaryLine1:
Trusted Dental Excellence

headingSecondaryLine2:
Built Around You.
```

---

# 13.3 Statistic component

Recommended:

```text
hero-stat
├── icon
├── value
└── label
```

Fields:

| Field   | Type                    | Required |
| ------- | ----------------------- | -------: |
| `icon`  | Media / controlled icon |      Yes |
| `value` | Short text              |      Yes |
| `label` | Short text              |      Yes |

### Why value should be text

Values contain formatting:

```text
10,000+
15+
98%
```

Using a plain integer alone would require extra formatting metadata.

A short text field is sufficient for these editorial statistics.

---

# 13.4 Statistics count

Screenshot displays exactly `3`.

For maximum screenshot fidelity:

```text
statistics.length = 3
```

is the expected initial data configuration.

However, unlike Doctor/Certificate sections, the user has not explicitly defined minimum/maximum CMS constraints.

Therefore do **not** enforce a hard schema max of `3` unless Product confirms that the layout must always contain exactly three statistics.

---

# 14. Shared Hero CMS Architecture

If Homepage and About both use a shared Page Builder hero component, the schema should support variants rather than duplicate the entire component.

Conceptually:

```text
Hero
├── variant
├── backgroundImage
├── eyebrow
├── heading
├── description
└── bottomContent
```

Possible variants:

```text
home
about
```

However, avoid making one overly-generic component with dozens of nullable fields.

An alternative cleaner model is:

```text
HeroShell
├── common fields
└── page-specific nested content
```

Frontend architecture should follow the existing project/page-builder conventions.

---

# 15. CMS vs Frontend Responsibility

| Responsibility         |       Strapi       |     Frontend     |
| ---------------------- | :----------------: | :--------------: |
| Hero background        |          ✅         |                  |
| Eyebrow                |          ✅         |                  |
| Heading copy           |          ✅         |                  |
| Description            |          ✅         |                  |
| Statistic values       |          ✅         |                  |
| Statistic labels       |          ✅         |                  |
| Statistic icons        | ✅ / design library |    ✅ rendering   |
| Hero geometry          |                    |         ✅        |
| White fade/composition |                    | ✅ / source asset |
| Header position        |                    |         ✅        |
| Active navigation      |                    |         ✅        |
| Stat divider           |                    |         ✅        |
| Typography             |                    |         ✅        |
| Responsive behavior    |                    |         ✅        |
| Lower-right radius     |                    |         ✅        |

---

# 16. Component Contract

| Component                             | Responsibility                             | Reusable?     |
| ------------------------------------- | ------------------------------------------ | ------------- |
| `HeroShell` / existing hero primitive | Overall hero geometry                      | Yes           |
| `AboutHero`                           | About-specific configuration/orchestration | Page-specific |
| `HeroBackground`                      | Right/background visual                    | Yes           |
| `HeroHeading`                         | Eyebrow + heading + description            | Yes           |
| `HeroStats`                           | Three-stat presentation                    | Yes           |
| `HeroStatItem`                        | Icon/value/label                           | Yes           |
| `SiteHeader`                          | Global navigation                          | Global        |

Recommended hierarchy:

```text
AboutHero
└── HeroShell
    ├── HeroBackground
    └── HeroContent
        ├── HeroHeading
        └── HeroStats
```

---

# 17. Visual Specification

## 17.1 Colors

| Token candidate               | Usage                   | Description       | Status   |
| ----------------------------- | ----------------------- | ----------------- | -------- |
| `color/about-hero/eyebrow`    | Eyebrow                 | Bright blue       | OBSERVED |
| `color/about-hero/title`      | `About Smilux`          | Deep navy         | OBSERVED |
| `color/about-hero/subtitle`   | Secondary heading lines | Deep navy         | OBSERVED |
| `color/about-hero/body`       | Paragraph               | Muted navy        | OBSERVED |
| `color/about-hero/stat-icon`  | Stats icons             | Bright blue       | OBSERVED |
| `color/about-hero/stat-value` | Numbers                 | Deep navy         | OBSERVED |
| `color/about-hero/stat-label` | Labels                  | Navy / muted navy | OBSERVED |
| `color/about-hero/divider`    | Stat separators         | Pale blue-gray    | OBSERVED |

---

# 17.2 Typography

| Element           | Weight              | Size                 | Status   |
| ----------------- | ------------------- | -------------------- | -------- |
| Eyebrow           | `600–700 estimated` | `12–14 px estimated` | INFERRED |
| Main title        | `700 estimated`     | `54–60 px estimated` | INFERRED |
| Secondary heading | `400–500 estimated` | `40–46 px estimated` | INFERRED |
| Description       | `400–500 estimated` | `14–16 px estimated` | INFERRED |
| Stat value        | `600–700 estimated` | `26–31 px estimated` | INFERRED |
| Stat label        | `400–500 estimated` | `12–14 px estimated` | INFERRED |

Use the same global font family and design-token system as Homepage Hero.

---

# 18. Asset Manifest

| Asset ID                    | Description                                      | Format        | Requirement        |
| --------------------------- | ------------------------------------------------ | ------------- | ------------------ |
| `about-hero-background`     | Dentist treating seated patient in Smilux clinic | WebP/JPG/PNG  | Required           |
| `about-stat-happy-patients` | Patient/health icon                              | SVG preferred | Required           |
| `about-stat-experience`     | Experience/dental icon                           | SVG preferred | Required           |
| `about-stat-satisfaction`   | Heart icon                                       | SVG preferred | Required           |
| `smilux-header-logo`        | Existing global header logo                      | SVG/image     | Reuse global asset |

### Rules

* Do not flatten hero text into background image.
* Do not flatten statistics into hero image.
* Do not flatten header logo into hero background.
* Preserve background focal composition.
* Prefer original Figma export rather than reconstructing dental scene.

---

# 19. Responsive Specification

## 19.1 Reuse shared Homepage Hero behavior

Because user explicitly identifies this as the same hero layout family, responsive rules should initially inherit the common Hero component behavior.

Do not create different breakpoint systems for Home and About without evidence.

---

# 19.2 Desktop

Required:

* transparent header,
* content left,
* visual right,
* heading retains intended line hierarchy,
* statistics remain horizontal,
* subject/image remains dominant on right.

---

# 19.3 Tablet/mobile

Exact screenshot evidence is unavailable.

If Homepage Hero already has approved responsive behavior:

```text
About Hero
→ reuse same responsive foundation
```

while replacing CTA/social-proof responsive slot with stats.

Potential layout adjustments for statistics may be necessary, but exact behavior must follow existing responsive hero patterns or future design.

Do not independently invent an entirely different About mobile hero.

---

# 20. Semantic HTML and Accessibility

## Heading hierarchy

Hero should expose one logical page H1.

Conceptually:

```text
About Smilux
Trusted Dental Excellence
Built Around You.
```

may be visually composed from multiple spans/lines but should remain one logical H1 unless site hierarchy specifies otherwise.

---

## Background image

If purely contextual/decorative:

* may be presentation/background media.

If content-bearing:

* provide meaningful accessible alternative through the approved media strategy.

Do not use OCR of visible clinic branding as image alt.

---

## Statistics

Each statistic must remain real text.

Do not bake:

```text
10,000+
15+
98%
```

into SVG/image assets.

Icons can be decorative where value/label communicates the meaning.

---

# 21. Interaction States

The supplied About Hero contains no standalone hero CTA.

Therefore:

| Element                 | Interaction             |
| ----------------------- | ----------------------- |
| Eyebrow                 | Static                  |
| H1                      | Static                  |
| Description             | Static                  |
| Statistics              | Static                  |
| Background              | Static                  |
| Global navigation       | Defined by `SiteHeader` |
| Header Book Appointment | Reuse existing action   |

Do not make statistics clickable unless Product later requires it.

Do not add unsupported hero buttons purely because Homepage Hero has buttons.

---

# 22. Key Difference From Homepage Hero

The coding agent should understand the relationship precisely:

```text
SAME:
✓ Header
✓ Hero shell
✓ Full-width background strategy
✓ Left content / right visual
✓ Light fade
✓ Container
✓ General spacing
✓ Lower-right curved boundary
✓ Responsive foundation
```

```text
DIFFERENT:
✓ Background asset
✓ Eyebrow
✓ Heading
✓ Description
✓ Active navigation = ABOUT US
✓ Bottom content = statistics instead of Homepage CTA/social-proof block
```

This is a **content/layout variant**, not a completely new design system.

---

# 23. Implementation Constraints

1. Reuse existing global `SiteHeader`.
2. Reuse existing shared hero shell/foundation where practical.
3. Do not duplicate Homepage Hero CSS wholesale into a disconnected component.
4. Use About-specific background media.
5. Keep global Header transparent over the hero.
6. `ABOUT US` active state derives from current route.
7. Preserve current codebase About route.
8. Do not invent a new `/about-us` path if codebase uses something else.
9. Preserve the screenshot heading hierarchy.
10. Do not automatically insert Homepage Hero buttons.
11. Render the three visible statistics as real UI.
12. Keep vertical dividers between stats.
13. Do not add statistic count-up animation without explicit requirement.
14. Do not reconstruct Smilux hero background using unrelated stock imagery.
15. CMS controls content/media; frontend controls geometry.

---

# 24. Visual Acceptance Criteria

## Shared hero

* [ ] About Hero visually belongs to the same family as Homepage Hero.
* [ ] Header overlays/integrates with hero.
* [ ] No standalone white header bar is introduced.
* [ ] Main content remains on left.
* [ ] Dental visual dominates right.
* [ ] Left copy remains readable over light/faded image region.
* [ ] Large lower-right curved boundary matches shared hero system.

## Header

* [ ] Smilux image logo appears.
* [ ] `ABOUT US` uses active blue state.
* [ ] Blue underline appears under `ABOUT US`.
* [ ] Other menu items remain default.
* [ ] Existing routes remain unchanged.
* [ ] Book Appointment remains at far-right.

## Copy

* [ ] `ABOUT SMILUX` matches.
* [ ] `About Smilux` matches.
* [ ] `Trusted Dental Excellence` matches.
* [ ] `Built Around You.` matches.
* [ ] Supporting paragraph matches approved CMS/Figma content.
* [ ] Heading line hierarchy matches reference.

## Statistics

* [ ] Exactly three statistics appear in reference configuration.
* [ ] `10,000+` appears.
* [ ] `Happy Patients` appears.
* [ ] `15+` appears.
* [ ] `Years of Experience` appears.
* [ ] `98%` appears.
* [ ] `Patient Satisfaction` appears.
* [ ] Each item includes a blue icon.
* [ ] Two vertical separators appear between the three items.
* [ ] Statistics remain aligned at the bottom of left content region.

## Background

* [ ] Correct About-specific dental scene is used.
* [ ] Dentist remains primary central/right subject.
* [ ] Patient remains clearly visible lower-right.
* [ ] Smilux wall branding remains visible.
* [ ] Dental monitor remains visible.
* [ ] Hero crop does not move focal subjects incorrectly.

---

# 25. Visual / Architecture Risks

| Risk                                              | Why it matters                                             | Mitigation                           | Priority |
| ------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------ | -------- |
| Creating a separate unrelated hero implementation | Causes inconsistent responsive behavior and duplicated CSS | Reuse Hero shell                     | High     |
| Reusing Homepage background                       | Wrong page identity                                        | About-specific hero media            | High     |
| Adding Homepage CTA buttons                       | Contradicts supplied About screenshot                      | Use stats as bottom slot             | High     |
| Rebuilding Header inside hero                     | Creates duplicate navigation logic                         | Global `SiteHeader` only             | High     |
| Hard-coding About route                           | Can break existing codebase navigation                     | Reuse router source                  | High     |
| All heading lines same weight                     | Loses screenshot hierarchy                                 | Preserve primary vs secondary weight | Medium   |
| Stats baked into image                            | Breaks CMS/accessibility                                   | Render as data/components            | High     |
| Background crop too aggressive                    | Dentist/patient/branding lost                              | Preserve focal position              | High     |
| Duplicate white gradient                          | Hero becomes washed out                                    | Inspect source asset first           | Medium   |
| Stat count-up invented                            | Unsupported interaction                                    | Keep static until requested          | Medium   |
| Different About breakpoints from Home             | Hero family becomes inconsistent                           | Reuse common responsive system       | High     |

---

# 26. Open Questions

| ID | Question                                                                          | Blocking level                     | Suggested owner    |
| -- | --------------------------------------------------------------------------------- | ---------------------------------- | ------------------ |
| Q1 | What exact existing codebase route maps to About Us?                              | Codebase verification              | Developer          |
| Q2 | Is there already a reusable Homepage `Hero` component suitable for variant reuse? | Architecture verification          | Developer          |
| Q3 | Can the exact About hero background asset be exported from Figma?                 | Blocking for final visual fidelity | Designer           |
| Q4 | Is the white left fade already embedded into the hero image?                      | Important visual implementation    | Designer           |
| Q5 | Are the three statistics always fixed at exactly three?                           | CMS/layout decision                | Product            |
| Q6 | Are statistic values editor-managed marketing numbers or sourced dynamically?     | Data decision                      | Product            |
| Q7 | What exact icon assets correspond to the three statistics?                        | Blocking for exact fidelity        | Designer           |
| Q8 | Should About Hero contain any CTA not visible in this screenshot?                 | Non-blocking                       | Designer / Product |
| Q9 | Does About Hero inherit the exact Homepage mobile layout?                         | Responsive decision                | Designer           |

---

# 27. Strapi Handoff Summary

Recommended page structure:

```text
About Page
└── Hero
    ├── backgroundImage
    │
    ├── eyebrow
    │   └── ABOUT SMILUX
    │
    ├── headingPrimary
    │   └── About Smilux
    │
    ├── headingSecondaryLine1
    │   └── Trusted Dental Excellence
    │
    ├── headingSecondaryLine2
    │   └── Built Around You.
    │
    ├── description
    │
    └── statistics[]
        ├── Stat 01
        │   ├── icon
        │   ├── 10,000+
        │   └── Happy Patients
        │
        ├── Stat 02
        │   ├── icon
        │   ├── 15+
        │   └── Years of Experience
        │
        └── Stat 03
            ├── icon
            ├── 98%
            └── Patient Satisfaction
```

---

# 28. Shared Hero Handoff

Recommended implementation relationship:

```text
                     SHARED HERO SHELL
                           │
          ┌────────────────┴────────────────┐
          │                                 │
          ▼                                 ▼
     HOMEPAGE HERO                      ABOUT HERO
          │                                 │
 Homepage background                  About background
 Homepage heading                     About heading
 Homepage CTA                         No visible CTA
 Social proof                         Statistics
```

This allows shared maintenance of:

* responsive geometry,
* container,
* background treatment,
* header integration,
* hero clipping,
* common typography rules.

---

# 29. CMS vs Frontend Responsibility

| Responsibility       |   Strapi   | Frontend |
| -------------------- | :--------: | :------: |
| About hero image     |      ✅     |          |
| Eyebrow              |      ✅     |          |
| Heading content      |      ✅     |          |
| Description          |      ✅     |          |
| Statistic values     |      ✅     |          |
| Statistic labels     |      ✅     |          |
| Statistic media/icon | ✅ optional | ✅ render |
| Hero shell           |            |     ✅    |
| Header integration   |            |     ✅    |
| Route active state   |            |     ✅    |
| Image positioning    |            |     ✅    |
| Fade treatment       |            |     ✅    |
| Statistic geometry   |            |     ✅    |
| Dividers             |            |     ✅    |
| Responsive behavior  |            |     ✅    |

---

# 30. Mandatory Coding-Agent Rules

1. Implement About hero as a **variant/reuse of the Homepage Hero layout family**.
2. Do not create a visually unrelated About hero architecture.
3. Reuse the global `SiteHeader`.
4. Keep Header transparent/no independent surface at initial hero state.
5. `ABOUT US` becomes active based on the existing route.
6. Preserve the codebase's existing About page URL.
7. Smilux header branding remains an image asset.
8. Use an About-specific hero background.
9. Maintain left content / right dental-visual composition.
10. Preserve heading hierarchy:

    * `About Smilux`
    * `Trusted Dental Excellence`
    * `Built Around You.`
11. Do not add Homepage CTA buttons because the supplied About hero does not show them.
12. Replace Homepage CTA/social-proof bottom content with the three-stat module.
13. Render `10,000+`, `15+`, and `98%` as real text.
14. Preserve statistic icons and vertical dividers.
15. Do not add counter animation unless explicitly requested.
16. Strapi manages page-specific copy/media/stat content.
17. Frontend owns common Hero geometry and responsive behavior.
