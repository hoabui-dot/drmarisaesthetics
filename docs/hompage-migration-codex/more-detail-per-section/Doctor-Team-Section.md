# UI Implementation Spec — Homepage Doctor Team Section

## 1. Identity

| Field                           | Value                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                           | `/`                                                                                                                                                     |
| Section ID                      | `home-doctors`                                                                                                                                          |
| Section name                    | `Homepage Doctor Team`                                                                                                                                  |
| Position in page                | Immediately after `home-devices`                                                                                                                        |
| Screenshot scope                | Full desktop doctor-team section shown in supplied screenshot                                                                                           |
| Section type                    | CMS-driven doctor list                                                                                                                                  |
| Minimum doctors                 | **1**                                                                                                                                                   |
| Maximum doctors                 | **4**                                                                                                                                                   |
| Full desktop target             | Up to **4 doctor entries**                                                                                                                              |
| Incomplete desktop row behavior | **Center the doctor-card group horizontally when fewer than 4 doctors are configured**                                                                  |
| Primary implementation goal     | Reproduce the asymmetric doctor-card composition while allowing Strapi editors to configure between 1 and 4 doctors without breaking the desktop layout |
| Overall evidence quality        | High for desktop composition; High for list-size rule supplied by user; Medium for exact typography/card dimensions; Low for responsive behavior        |

> **Critical data constraint:** This homepage section accepts **minimum 1 and maximum 4 doctors**.

> **Critical alignment rule:** If fewer than 4 doctors are configured, do **not** leave the cards pinned to the left with a large empty area on the right. The complete doctor-card group must be **horizontally centered inside the section container**.

> **Critical desktop layout note:** The first visible doctor in the supplied design uses a **featured/expanded card layout**, while the remaining doctors use compact vertical cards. This asymmetric composition must be modeled deliberately rather than forcing all doctor cards into identical geometry.

---

## 2. Scope Boundary

### Included in this spec

* OBSERVED — Section eyebrow:

  * `OUR DENTIST TEAM`
* OBSERVED — Section heading:

  * `Meet Our Expert Dentists`
* OBSERVED — Right-side CTA:

  * `VIEW ALL DOCTORS`
* OBSERVED — Four doctors in screenshot:

  1. Dr. Ethan Santos
  2. Dr. Michelle Jin
  3. Dr. Nicholas Tan
  4. Dr. Sophia Lim
* USER-SPECIFIED — Minimum doctor count = `1`.
* USER-SPECIFIED — Maximum doctor count = `4`.
* USER-SPECIFIED — When count `< 4`, cards are centered horizontally.
* OBSERVED — First doctor uses a featured wide card.
* OBSERVED — Featured doctor card contains:

  * large portrait panel on left,
  * detailed content panel on right.
* OBSERVED — Remaining doctor cards use compact vertical layout.
* OBSERVED — Doctor cards show:

  * portrait,
  * name,
  * specialty,
  * description,
  * credential/highlight list,
  * profile CTA.
* INFERRED — Homepage doctor order should be configurable in Strapi.
* INFERRED — First item in the ordered homepage list can drive the featured card unless a separate `featured` flag is preferred.
* INFERRED — Doctor records should ideally reference a canonical Doctor collection rather than duplicate doctor data inside Homepage.

### Excluded from this spec

* UNKNOWN — Exact `/doctors` route.
* UNKNOWN — Exact profile route structure.
* UNKNOWN — Hover animations.
* UNKNOWN — card-click behavior.
* UNKNOWN — whether whole cards are links.
* UNKNOWN — mobile layout.
* UNKNOWN — tablet layout.
* UNKNOWN — whether the first doctor is always featured or manually selected.
* UNKNOWN — whether featured doctor rotates.
* UNKNOWN — whether doctor order changes automatically.
* UNKNOWN — whether `VIEW ALL DOCTORS` is hidden if all doctors already fit in this section.

---

# 3. Evidence and Confidence

| Item                              | Status                           | Evidence / reason                                                      |
| --------------------------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Section structure                 | OBSERVED                         | Heading region and doctor-card collection are clearly visible.         |
| Maximum 4 doctors                 | USER-SPECIFIED                   | Explicit requirement.                                                  |
| Minimum 1 doctor                  | USER-SPECIFIED                   | Explicit requirement.                                                  |
| Center when fewer than 4          | USER-SPECIFIED                   | Explicit requirement.                                                  |
| Featured first card               | OBSERVED                         | First card is substantially wider and uses side-by-side image/content. |
| Compact doctor cards              | OBSERVED                         | Remaining three use narrow vertical format.                            |
| First item automatically featured | INFERRED                         | Matches screenshot structure but must be confirmed as data behavior.   |
| Doctor data reusable in CMS       | INFERRED                         | Suitable for canonical Doctor collection.                              |
| Typography values                 | INFERRED                         | Relative hierarchy visible; exact tokens unavailable.                  |
| Card border/radius                | OBSERVED / exact values INFERRED | Thin pale-blue border and moderate radius visible.                     |
| Responsive behavior               | UNKNOWN                          | Only desktop screenshot supplied.                                      |
| Interaction states                | UNKNOWN                          | Static screenshot only.                                                |

---

# 4. OCR Content Inventory

## 4.1 Section-level content

| Element ID        | Visible text               | Type    | Confidence |
| ----------------- | -------------------------- | ------- | ---------- |
| `doctor-eyebrow`  | `OUR DENTIST TEAM`         | Eyebrow | High       |
| `doctor-heading`  | `Meet Our Expert Dentists` | H2      | High       |
| `doctor-view-all` | `VIEW ALL DOCTORS`         | CTA     | High       |

---

## 4.2 Doctor 01 — Featured Card

| Element ID               | Visible text                                                                                               | Type                 | Confidence |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- | -------------------- | ---------- |
| `doctor-01-name`         | `DR. ETHAN SANTOS`                                                                                         | Doctor name          | High       |
| `doctor-01-specialty`    | `Implantology & Surgery`                                                                                   | Specialty            | High       |
| `doctor-01-description`  | `Specialized in advanced dental implants and surgical procedures with a focus on precision and longevity.` | Description          | High       |
| `doctor-01-highlight-01` | `10+ years of experience in implantology and oral surgery`                                                 | Credential/highlight | High       |
| `doctor-01-highlight-02` | `International Implant Association Member`                                                                 | Credential/highlight | High       |
| `doctor-01-highlight-03` | `Certified in Advanced Bone Augmentation`                                                                  | Credential/highlight | High       |
| `doctor-01-cta`          | `View Profile`                                                                                             | CTA                  | High       |

---

## 4.3 Doctor 02

| Element ID               | Visible text                                                | Type        | Confidence                            |
| ------------------------ | ----------------------------------------------------------- | ----------- | ------------------------------------- |
| `doctor-02-name`         | `DR. MICHELLE JIN`                                          | Doctor name | High                                  |
| `doctor-02-specialty`    | `Cosmetic Dentistry`                                        | Specialty   | High                                  |
| `doctor-02-description`  | `Expert in smile design, veneers, and aesthetic makeovers.` | Description | High                                  |
| `doctor-02-highlight-01` | `Member of the American`                                    | Credential  | Medium / screenshot appears truncated |
| `doctor-02-highlight-02` | `Certified in Advanced Aesthetic Restorations`              | Credential  | Medium                                |
| `doctor-02-cta`          | `View Profile`                                              | CTA         | High                                  |

> `[OCR UNCERTAIN]` — The first credential under Dr. Michelle Jin appears incomplete in the screenshot and must be confirmed from Figma/Strapi before production copy is finalized.

---

## 4.4 Doctor 03

| Element ID               | Visible text                                                                            | Type        | Confidence |
| ------------------------ | --------------------------------------------------------------------------------------- | ----------- | ---------- |
| `doctor-03-name`         | `DR. NICHOLAS TAN`                                                                      | Doctor name | High       |
| `doctor-03-specialty`    | `Orthodontics`                                                                          | Specialty   | High       |
| `doctor-03-description`  | `Expert in braces and clear aligners for all ages, creating healthy, confident smiles.` | Description | High       |
| `doctor-03-highlight-01` | `Member of the World Federation of Orthodontists`                                       | Credential  | High       |
| `doctor-03-highlight-02` | `Invisalign Certified Provider`                                                         | Credential  | High       |
| `doctor-03-cta`          | `View Profile`                                                                          | CTA         | High       |

---

## 4.5 Doctor 04

| Element ID               | Visible text                                                     | Type        | Confidence |
| ------------------------ | ---------------------------------------------------------------- | ----------- | ---------- |
| `doctor-04-name`         | `DR. SOPHIA LIM`                                                 | Doctor name | High       |
| `doctor-04-specialty`    | `Pediatric Dentistry`                                            | Specialty   | High       |
| `doctor-04-description`  | `Making dental visits fun and stress-free for your little ones.` | Description | High       |
| `doctor-04-highlight-01` | `Certified in Pediatric Dentistry`                               | Credential  | High       |
| `doctor-04-cta`          | `View Profile`                                                   | CTA         | High       |

---

# 5. Layout Anatomy

## 5.1 Global geometry

| Property                 | Specification                                  | Status         |
| ------------------------ | ---------------------------------------------- | -------------- |
| Section width            | Full viewport with centered internal container | OBSERVED       |
| Background               | White / near-white                             | OBSERVED       |
| Main structure           | Header + doctor-card row                       | OBSERVED       |
| Maximum items            | `4`                                            | USER-SPECIFIED |
| Minimum items            | `1`                                            | USER-SPECIFIED |
| Header alignment         | Heading left, View All CTA right               | OBSERVED       |
| Doctor row               | Horizontal on full desktop                     | OBSERVED       |
| Incomplete-row alignment | Center                                         | USER-SPECIFIED |
| Card heights             | Similar overall bottom alignment               | OBSERVED       |
| Overflow                 | None visible at desktop reference              | OBSERVED       |

---

## 5.2 Structure tree

```text
Section: home-doctors
├── SectionHeader
│   ├── HeadingGroup
│   │   ├── Eyebrow
│   │   └── H2
│   └── ViewAllDoctorsCTA
│
└── DoctorCollection
    ├── FeaturedDoctorCard
    │   ├── PortraitPanel
    │   └── ContentPanel
    │       ├── Name
    │       ├── Specialty
    │       ├── Description
    │       ├── Credentials[]
    │       └── ViewProfileCTA
    │
    ├── StandardDoctorCard
    │   ├── Portrait
    │   └── Content
    │       ├── Name
    │       ├── Specialty
    │       ├── Description
    │       ├── Credentials[]
    │       └── ViewProfileCTA
    │
    ├── StandardDoctorCard
    └── StandardDoctorCard
```

---

# 5.3 Section header

Approximate structure:

```text
OUR DENTIST TEAM

Meet Our Expert Dentists                         VIEW ALL DOCTORS →
```

### Rules

* Eyebrow and H2 share the same left alignment.
* `VIEW ALL DOCTORS` sits at far-right of the section header.
* CTA uses uppercase blue text.
* CTA includes a right-arrow icon.
* No filled CTA surface is visible in supplied screenshot.

---

# 5.4 Four-doctor desktop composition

Reference topology:

```text
┌───────────────────────────────────────────────────────────────────────────────┐
│ OUR DENTIST TEAM                                              VIEW ALL →     │
│ Meet Our Expert Dentists                                                   │
│                                                                               │
│ ┌───────────────────────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │                               │ │            │ │            │ │            │ │
│ │ PORTRAIT    FEATURE DETAILS   │ │ PORTRAIT   │ │ PORTRAIT   │ │ PORTRAIT   │ │
│ │                               │ │            │ │            │ │            │ │
│ │             Name              │ ├────────────┤ ├────────────┤ ├────────────┤ │
│ │             Specialty         │ │ Name       │ │ Name       │ │ Name       │ │
│ │             Description       │ │ Specialty  │ │ Specialty  │ │ Specialty  │ │
│ │             Credentials       │ │ Desc.      │ │ Desc.      │ │ Desc.      │ │
│ │             Credentials       │ │ Credentials│ │ Credentials│ │ Credential │ │
│ │             Credentials       │ │ Profile →  │ │ Profile →  │ │ Profile →  │ │
│ │             [View Profile →]  │ │            │ │            │ │            │ │
│ └───────────────────────────────┘ └────────────┘ └────────────┘ └────────────┘ │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

# 5.5 Featured Doctor Card

## Structure

The first card is visibly different from the remaining cards.

It is a **single parent card split horizontally**:

```text
FeaturedDoctorCard
┌──────────────────────────────────────┐
│                    │                 │
│                    │ Doctor Name     │
│                    │ Specialty       │
│                    │                 │
│    PORTRAIT        │ Description     │
│                    │                 │
│                    │ • Credential    │
│                    │ • Credential    │
│                    │ • Credential    │
│                    │                 │
│                    │ [View Profile]  │
└────────────────────┴─────────────────┘
```

### Geometry

| Property          | Specification                                  | Status   |
| ----------------- | ---------------------------------------------- | -------- |
| Overall type      | Wide horizontal card                           | OBSERVED |
| Left/right split  | Approximately `42/58` or `45/55 estimated`     | INFERRED |
| Left              | Large full-height doctor portrait              | OBSERVED |
| Right             | Detailed text/content                          | OBSERVED |
| Border            | Thin pale blue                                 | OBSERVED |
| Radius            | Moderate rounded corners                       | OBSERVED |
| Divider           | Vertical boundary between portrait and content | OBSERVED |
| Content alignment | Left                                           | OBSERVED |

> This must be implemented as **one Doctor card with a `featured` visual variant**, not as two independent CMS cards.

---

## 5.6 Featured portrait

* Portrait uses almost the full card height.
* Doctor is centered.
* White/light medical background.
* Doctor body extends farther down than portraits in compact cards.
* Image should use controlled crop/object positioning.
* Do not crop head, shoulders or arms.

---

## 5.7 Featured content panel

Visible hierarchy:

```text
DR. ETHAN SANTOS
Implantology & Surgery

Description...

◉ 10+ years...
◉ International Implant Association Member
◉ Certified in Advanced Bone Augmentation

[ View Profile  → ]
```

### Rules

* Doctor name is strongest text inside card.
* Specialty sits directly under name.
* Description separated by moderate vertical space.
* Credentials use repeated blue outline/icon bullet.
* CTA sits toward card bottom.
* CTA uses bordered-button treatment in featured card.

---

# 5.8 Standard Doctor Card

Standard cards use a vertical layout:

```text
StandardDoctorCard
┌───────────────────────┐
│                       │
│       PORTRAIT        │
│                       │
├───────────────────────┤
│ DOCTOR NAME           │
│ Specialty             │
│                       │
│ Description           │
│                       │
│ ◉ Credential          │
│ ◉ Credential          │
│                       │
│ View Profile →        │
└───────────────────────┘
```

### Geometry

| Property       | Specification              | Status   |
| -------------- | -------------------------- | -------- |
| Width          | Equal across compact cards | OBSERVED |
| Orientation    | Vertical                   | OBSERVED |
| Image region   | Upper ~50–55% estimated    | INFERRED |
| Content region | Lower remainder            | OBSERVED |
| Border         | Thin pale blue             | OBSERVED |
| Radius         | Moderate                   | OBSERVED |
| Name           | Left aligned               | OBSERVED |
| Specialty      | Left aligned               | OBSERVED |
| CTA            | Near bottom-left           | OBSERVED |

---

# 6. Dynamic Doctor Count Rules

## 6.1 Allowed count

```text
MIN = 1
MAX = 4
```

Strapi must not expose more than four doctor slots for this homepage section.

If using a relationship collection, validation should enforce:

```text
1 <= featuredDoctors.length <= 4
```

---

# 6.2 Count = 4

Reference behavior:

```text
[ FEATURED ] [ D2 ] [ D3 ] [ D4 ]
```

* Full desktop layout fills the intended section width.
* First doctor uses featured layout.
* Remaining 3 use standard layout.

---

# 6.3 Count = 3

Required alignment:

```text
              [ FEATURED ] [ D2 ] [ D3 ]
              <---- centered group ---->
```

Not:

```text
[ FEATURED ] [ D2 ] [ D3 ]                         EMPTY
```

The entire group must be centered horizontally.

---

# 6.4 Count = 2

Required:

```text
                    [ FEATURED ] [ D2 ]
                    <--- centered --->
```

The cards must not stretch disproportionately simply to fill the original four-doctor width.

---

# 6.5 Count = 1

Required:

```text
                       [ FEATURED ]
                         centered
```

With only one doctor:

* use the featured card presentation,
* center the card/group inside section container,
* do not stretch it to full viewport width,
* preserve a sensible maximum width corresponding to the featured desktop card.

---

# 6.6 Centering rule

Conceptually:

```text
DoctorCollection
    width = content width
    horizontal alignment = center when doctorCount < 4
```

The centering applies to the **doctor group as a whole**, not to the text inside individual cards.

Doctor content remains left-aligned where shown.

---

# 6.7 Do not fill missing slots

Incorrect:

```text
Doctor 1
Doctor 2
Placeholder
Placeholder
```

Incorrect:

```text
Doctor 1
Doctor 2
Duplicate Doctor 1
Duplicate Doctor 2
```

Correct:

```text
          Doctor 1
          Doctor 2
        centered group
```

No dummy data.

No duplicated doctors.

No empty bordered cards.

---

# 7. Visual Specification

## 7.1 Colors

| Token candidate                   | Usage                       | Description           | Status   |
| --------------------------------- | --------------------------- | --------------------- | -------- |
| `color/doctor-section/background` | Section                     | White / near-white    | OBSERVED |
| `color/doctor-heading`            | H2                          | Dark navy             | OBSERVED |
| `color/doctor-name`               | Doctor names                | Deep navy             | OBSERVED |
| `color/doctor-specialty`          | Specialty                   | Navy/blue             | OBSERVED |
| `color/doctor-body`               | Description/credential text | Muted navy            | OBSERVED |
| `color/doctor-accent`             | Eyebrow / CTA / icons       | Bright blue           | OBSERVED |
| `color/doctor-card-border`        | Card outline                | Very pale blue        | OBSERVED |
| `color/doctor-image-surface`      | Portrait area               | White/light blue-gray | OBSERVED |

---

# 7.2 Typography

| Element      | Weight              | Approx. size         | Status   |
| ------------ | ------------------- | -------------------- | -------- |
| Eyebrow      | `600–700 estimated` | `11–13 px estimated` | INFERRED |
| Section H2   | `600–700 estimated` | `27–32 px estimated` | INFERRED |
| Doctor name  | `700 estimated`     | `17–20 px estimated` | INFERRED |
| Specialty    | `500–600 estimated` | `13–15 px estimated` | INFERRED |
| Description  | `400–500 estimated` | `12–14 px estimated` | INFERRED |
| Credential   | `400–500 estimated` | `11–13 px estimated` | INFERRED |
| Profile CTA  | `500–600 estimated` | `12–14 px estimated` | INFERRED |
| View All CTA | `600 estimated`     | `11–13 px estimated` | INFERRED |

---

# 7.3 Borders and radius

| Element               | Border                                | Radius               | Status   |
| --------------------- | ------------------------------------- | -------------------- | -------- |
| Featured doctor card  | Thin pale-blue                        | `~8–12 px estimated` | INFERRED |
| Standard doctor cards | Thin pale-blue                        | `~8–12 px estimated` | INFERRED |
| Featured Profile CTA  | Blue outline                          | `~6–8 px estimated`  | INFERRED |
| Credential icon       | Thin blue circular/outlined treatment | Circular             | OBSERVED |

---

# 8. Asset Manifest

| Asset ID              | Description                                    | Format        | Crop behavior            | Status   |
| --------------------- | ---------------------------------------------- | ------------- | ------------------------ | -------- |
| `doctor-ethan-santos` | Male dentist portrait, white coat / blue shirt | WebP/PNG/JPG  | Controlled portrait crop | OBSERVED |
| `doctor-michelle-jin` | Female dentist portrait, white coat            | WebP/PNG/JPG  | Controlled portrait crop | OBSERVED |
| `doctor-nicholas-tan` | Male dentist portrait with glasses             | WebP/PNG/JPG  | Controlled portrait crop | OBSERVED |
| `doctor-sophia-lim`   | Female dentist portrait with glasses           | WebP/PNG/JPG  | Controlled portrait crop | OBSERVED |
| `credential-icon`     | Small blue circular credential icon            | SVG preferred | N/A                      | OBSERVED |
| `arrow-icon`          | Profile/View All arrow                         | SVG preferred | N/A                      | OBSERVED |

### Asset rules

* Doctor portraits must remain separate CMS media assets.
* Do not combine portrait + doctor information into one bitmap.
* All doctor names/specialties/credentials must remain editable text.
* Portrait focal position should be controllable by frontend or media focal metadata.
* Do not arbitrarily crop heads/hands to normalize image sizes.
* Use consistent portrait processing across standard cards.

---

# 9. Component Contract

## 9.1 Recommended component boundaries

| Component              | Responsibility                  | Reusable?   | Status                    |
| ---------------------- | ------------------------------- | ----------- | ------------------------- |
| `HomeDoctorsSection`   | Section orchestration           | No          | INFERRED                  |
| `DoctorSectionHeader`  | Eyebrow, H2, View All           | Potentially | INFERRED                  |
| `DoctorList`           | Count/alignment/layout handling | Yes         | USER-SPECIFIED / INFERRED |
| `FeaturedDoctorCard`   | Wide first-doctor presentation  | Yes         | OBSERVED                  |
| `DoctorCard`           | Compact doctor presentation     | Yes         | OBSERVED                  |
| `DoctorCredentialList` | Repeated credentials            | Yes         | INFERRED                  |
| `ProfileLink`          | Profile CTA                     | Yes         | INFERRED                  |

---

# 10. Strapi CMS Contract

## 10.1 Preferred architecture

Doctors should ideally exist as reusable canonical entities:

```text
Doctor Collection
├── Doctor A
├── Doctor B
├── Doctor C
├── Doctor D
└── ...

Homepage
└── Doctor Team Section
    └── featuredDoctors[]
          ↓ relation
        Doctor
```

This avoids duplicating doctor biographies between:

* homepage,
* Doctors listing page,
* Doctor detail page.

---

# 10.2 Doctor Collection fields

Recommended:

| Field              | Type                  |    Required | Notes                         |
| ------------------ | --------------------- | ----------: | ----------------------------- |
| `name`             | Short text            |         Yes | e.g. Dr. Ethan Santos         |
| `slug`             | UID                   |         Yes | Profile routing               |
| `specialty`        | Short text / relation |         Yes | Implantology & Surgery        |
| `shortDescription` | Long text             |         Yes | Homepage description          |
| `portrait`         | Media                 |         Yes | Main doctor portrait          |
| `portraitAlt`      | Short text            | Recommended | Accessibility                 |
| `credentials`      | Repeatable component  |    Optional | Homepage bullet list          |
| `profileEnabled`   | Boolean               |    Optional | If profile destination exists |

Potential long-form doctor data used elsewhere:

* biography,
* education,
* certifications,
* experience,
* languages,
* working schedule,
* treatments,
* awards.

Those fields are outside this screenshot scope.

---

# 10.3 Homepage Doctor Team fields

Recommended structure:

```text
HomepageDoctorSection
├── eyebrow
├── heading
├── viewAllCTA
└── doctors[]
      ↓ Doctor relation
```

Fields:

| Field          | Type             |              Required |
| -------------- | ---------------- | --------------------: |
| `eyebrow`      | Short text       |                   Yes |
| `heading`      | Short text       |                   Yes |
| `viewAllLabel` | Short text       |                   Yes |
| `viewAllLink`  | Link             | Yes for functionality |
| `doctors`      | Ordered relation |                   Yes |
| `doctors.min`  | Validation       |                   `1` |
| `doctors.max`  | Validation       |                   `4` |

---

# 10.4 Featured-doctor decision

Two possible CMS architectures exist.

### Recommended — Order determines featured doctor

```text
doctors[0] = featured
doctors[1...] = standard
```

Advantages:

* simple editor model,
* easy ordering,
* no invalid state with multiple featured doctors.

Example:

```text
1. Ethan Santos      → featured layout
2. Michelle Jin      → standard
3. Nicholas Tan      → standard
4. Sophia Lim        → standard
```

This matches the supplied screenshot.

---

### Alternative — Explicit featured field

```text
featuredDoctor
otherDoctors[]
```

Use only if Product requires featured doctor selection separately from display order.

Avoid:

```text
doctors[]
    isFeatured: true/false
```

unless CMS validation guarantees exactly one featured doctor, because editors could accidentally configure:

* no featured doctor,
* two featured doctors,
* three featured doctors.

---

# 10.5 CMS must not control geometry

Strapi controls:

* selected doctors,
* doctor order,
* content,
* portrait,
* credentials.

Frontend controls:

* featured-card width,
* standard-card width,
* first-card variant,
* group centering,
* gaps,
* card borders,
* portrait dimensions,
* responsive behavior.

Do not expose:

* `cardWidth`,
* `gridColumn`,
* `xPosition`,
* `leftOffset`,
* `featuredCardWidth`,
* arbitrary desktop alignment

to normal Strapi editors.

---

# 11. Count-Based Frontend Layout Contract

The frontend must derive layout from:

```text
doctorCount = doctors.length
```

Then:

```text
doctorCount === 4
→ full reference layout

doctorCount === 3
→ centered group

doctorCount === 2
→ centered group

doctorCount === 1
→ centered featured card
```

Conceptual:

```text
1 DOCTOR

                ┌──────────────────────┐
                │      FEATURED        │
                └──────────────────────┘


2 DOCTORS

          ┌──────────────────────┐ ┌─────────────┐
          │      FEATURED        │ │   DOCTOR 2  │
          └──────────────────────┘ └─────────────┘


3 DOCTORS

     ┌──────────────────────┐ ┌─────────────┐ ┌─────────────┐
     │      FEATURED        │ │   DOCTOR 2  │ │   DOCTOR 3  │
     └──────────────────────┘ └─────────────┘ └─────────────┘


4 DOCTORS

┌──────────────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│      FEATURED        │ │  DOCTOR 2  │ │  DOCTOR 3  │ │  DOCTOR 4  │
└──────────────────────┘ └────────────┘ └────────────┘ └────────────┘
```

For counts `1–3`, the outer available whitespace should be approximately balanced on both sides.

---

# 12. Interaction States

| Element               | Default                | Hover   | Focus             | Destination    | Status                          |
| --------------------- | ---------------------- | ------- | ----------------- | -------------- | ------------------------------- |
| View All Doctors      | Blue text + arrow      | UNKNOWN | Required          | UNKNOWN        | OBSERVED                        |
| Featured View Profile | Outlined button        | UNKNOWN | Required          | Doctor profile | OBSERVED / destination inferred |
| Standard View Profile | Blue text link + arrow | UNKNOWN | Required          | Doctor profile | OBSERVED / destination inferred |
| Doctor portrait       | Static                 | UNKNOWN | N/A unless linked | UNKNOWN        | OBSERVED                        |
| Whole doctor card     | Static                 | UNKNOWN | UNKNOWN           | UNKNOWN        | No full-card-link evidence      |

### Constraints

* Do not automatically make entire doctor card clickable.
* Do not add hover lift/scale effects without evidence.
* Do not add carousel behavior.
* Do not automatically rotate featured doctor.
* Do not reorder doctors client-side.
* Do not truncate credential data without an approved content-length rule.

---

# 13. Responsive Specification

## 13.1 Evidence available

| Viewport     | Evidence |
| ------------ | -------- |
| Full desktop | High     |
| Tablet       | UNKNOWN  |
| Mobile       | UNKNOWN  |

---

## 13.2 Desktop behavior

With four doctors:

* featured doctor remains first,
* featured card is wider,
* three compact cards appear afterward,
* card group fills intended content width.

With fewer than four:

* preserve card dimensions as much as possible,
* center collection,
* do not stretch cards to compensate.

---

## 13.3 Responsive data invariance

Strapi always returns the same ordered doctor list.

Do not create CMS fields such as:

```text
desktopDoctors
tabletDoctors
mobileDoctors
```

unless Product specifically requests different editorial sets per breakpoint.

Same doctor content should render responsively.

---

## 13.4 Mobile possibilities requiring approval

Potential patterns include:

* all cards become uniform vertical cards,
* featured card stays visually distinct but stacks vertically,
* horizontal card slider,
* one-card-per-row layout.

No supplied mobile evidence selects any of these.

Do not infer a carousel solely because doctor cards no longer fit horizontally.

---

# 14. Semantic HTML and Accessibility

## Recommended structure

* Section landmark associated with H2.
* Doctor list represented semantically as a list where appropriate.
* Each doctor card may use an `article`.
* Doctor name may use an internal heading level.
* Profile action uses a semantic link.
* Credentials use a semantic list.
* Portrait image gets meaningful alt text.

### Example accessible information hierarchy

```text
Meet Our Expert Dentists
└── Doctor
    ├── Dr. Ethan Santos
    ├── Implantology & Surgery
    ├── Description
    ├── Credentials
    └── View Profile
```

### Constraints

* Credential icons are decorative when label text exists.
* Do not repeat `bullet` semantics via icon alt text.
* Portrait alt should identify the doctor when useful.
* Focus state must be visible on Profile and View All links.
* Avoid making both whole card and nested `View Profile` separate links to the same destination unless accessibility implementation is deliberate.

---

# 15. Implementation Constraints

## Data

* Minimum `1` doctor.
* Maximum `4` doctors.
* Preserve CMS order.
* First doctor = featured by default unless Product selects alternate architecture.
* Do not fabricate missing doctors.

## Layout

* Four doctors use reference asymmetric desktop layout.
* Featured card remains wider.
* Standard cards remain equal width.
* When count `< 4`, center complete card group.
* Do not redistribute widths merely to fill empty area.
* Do not create empty placeholder columns.
* Do not stretch a single doctor to full content width.
* Preserve reasonable maximum width for featured card.
* Keep consistent inter-card gap.

## Featured card

* One parent card.
* Side-by-side portrait/content.
* Portrait is not separate CMS block.
* Content panel includes credentials and CTA.
* Featured CTA uses bordered-button treatment seen in screenshot.

## Standard cards

* Vertical portrait/content arrangement.
* Equal geometry.
* Maintain bottom CTA region.
* Long text must not arbitrarily change total card height at reference viewport.

## CMS

* Prefer Doctor collection relations.
* Homepage selection is `1–4`.
* No card geometry fields in CMS.
* No dummy slots.
* No duplicate doctor records for layout.

---

# 16. Visual Acceptance Criteria

## Header

* [ ] `OUR DENTIST TEAM` appears at upper-left.
* [ ] `Meet Our Expert Dentists` appears below eyebrow.
* [ ] `VIEW ALL DOCTORS` appears at upper-right.
* [ ] View All includes right-arrow indicator.

## Four-doctor reference

* [ ] Exactly four doctor records are rendered.
* [ ] Doctor 1 uses wide featured layout.
* [ ] Doctor 2–4 use standard vertical layout.
* [ ] Featured card uses image-left/content-right composition.
* [ ] Standard portraits occupy upper card area.
* [ ] All doctor card borders use consistent pale-blue treatment.
* [ ] Card bottoms align visually.
* [ ] Gaps are consistent.

## Featured doctor

* [ ] Large portrait appears on left.
* [ ] Name appears at top of right panel.
* [ ] Specialty appears below.
* [ ] Description appears below specialty.
* [ ] Credential list appears below description.
* [ ] Profile button sits toward lower content region.
* [ ] Vertical image/content separation remains visible.

## Standard doctors

* [ ] Name appears beneath portrait.
* [ ] Specialty appears beneath name.
* [ ] Description appears beneath specialty.
* [ ] Credentials use blue bullet/icon treatment.
* [ ] `View Profile` appears near card bottom.
* [ ] No compact doctor accidentally uses featured geometry.

## Dynamic count

* [ ] `1` doctor is accepted.
* [ ] `2` doctors are accepted.
* [ ] `3` doctors are accepted.
* [ ] `4` doctors are accepted.
* [ ] More than `4` cannot be configured for this section.
* [ ] With `3`, card group is centered.
* [ ] With `2`, card group is centered.
* [ ] With `1`, featured card is centered.
* [ ] Empty slots are never rendered.
* [ ] Existing doctors are never duplicated to fill layout.
* [ ] Card widths do not expand unnaturally when items are missing.

---

# 17. Visual Risks

| Risk                                                | Why it affects fidelity                  | Mitigation                                              | Priority |
| --------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------- | -------- |
| Treating all doctors as equal cards                 | Loses asymmetric featured-doctor design  | Use explicit featured variant                           | High     |
| Splitting featured image/content into two CMS cards | Breaks semantic doctor entity            | One featured card component                             | High     |
| Left-aligning 1–3 doctors                           | Leaves large unbalanced right whitespace | Center collection                                       | High     |
| Stretching fewer cards to full width                | Card proportions no longer match design  | Keep maximum card widths                                | High     |
| Empty placeholder cards                             | Produces fake UI                         | Render only actual doctors                              | High     |
| Duplicating doctor data                             | Misleading content                       | Never duplicate to fill slots                           | High     |
| More than four records                              | Breaks intended homepage composition     | Enforce CMS max = 4                                     | High     |
| Multiple manually-featured doctors                  | Ambiguous layout                         | Prefer first-item featured rule                         | Medium   |
| Wrong portrait crop                                 | Doctor composition visibly changes       | Controlled object position/focal point                  | High     |
| Long credentials overflow compact cards             | Breaks equal heights                     | Define CMS content limits / responsive content handling | Medium   |
| Separate homepage doctor records                    | Creates duplicate content maintenance    | Reuse canonical Doctor entries                          | Medium   |
| Auto carousel added                                 | Unsupported behavior                     | Keep static list unless specified                       | High     |

---

# 18. Open Questions

| ID  | Question                                                                                    | Blocking level                   | Suggested owner     |
| --- | ------------------------------------------------------------------------------------------- | -------------------------------- | ------------------- |
| Q1  | Should the first doctor in the Strapi ordered list always become the featured wide card?    | Important architecture decision  | Product / Developer |
| Q2  | Or should Homepage have a separate `featuredDoctor` relation?                               | Architecture decision            | Product / Developer |
| Q3  | What exact doctor profile route is used?                                                    | Blocking for functionality       | Developer           |
| Q4  | What destination does `VIEW ALL DOCTORS` use?                                               | Blocking for functionality       | Product             |
| Q5  | What is the complete first credential for Dr. Michelle Jin?                                 | Blocking for accurate copy       | Product / Designer  |
| Q6  | Are doctor credentials shared with their profile page or homepage-specific?                 | Non-blocking                     | Product             |
| Q7  | What content-length limits should apply to descriptions and credentials?                    | Important for stable card height | Product / Developer |
| Q8  | Should the whole doctor card be clickable or only View Profile?                             | Blocking for interaction         | Product             |
| Q9  | What is the approved tablet layout for the featured card?                                   | Blocking for tablet              | Designer            |
| Q10 | What is the approved mobile layout?                                                         | Blocking for mobile              | Designer            |
| Q11 | Should the View All CTA remain visible when the website contains only the same 1–4 doctors? | Non-blocking                     | Product             |

---

# Strapi Handoff Summary

## Recommended canonical structure

```text
Doctor Collection
│
├── Dr. Ethan Santos
├── Dr. Michelle Jin
├── Dr. Nicholas Tan
├── Dr. Sophia Lim
└── ...

Homepage
└── Doctor Team Section
    ├── eyebrow
    ├── heading
    ├── viewAllCTA
    │
    └── doctors[]
          ├── min: 1
          ├── max: 4
          └── relation → Doctor
```

### Recommended featured behavior

```text
doctors[0]
   ↓
FeaturedDoctorCard

doctors[1...3]
   ↓
StandardDoctorCard
```

---

# Layout Handoff Summary

## 4 doctors

```text
[========== FEATURED ==========] [ D2 ] [ D3 ] [ D4 ]
```

## 3 doctors

```text
       [========== FEATURED ==========] [ D2 ] [ D3 ]
       <-------------- CENTERED -------------------->
```

## 2 doctors

```text
             [========== FEATURED ==========] [ D2 ]
             <------------- CENTERED ------------->
```

## 1 doctor

```text
                  [========== FEATURED ==========]
                  <----------- CENTERED ----------->
```

---

# CMS vs Frontend Responsibility

| Responsibility         |         Strapi        |      Frontend     |
| ---------------------- | :-------------------: | :---------------: |
| Doctor selection       |           ✅           |                   |
| Doctor ordering        |           ✅           |                   |
| Doctor name            |           ✅           |                   |
| Specialty              |           ✅           |                   |
| Description            |           ✅           |                   |
| Credentials            |           ✅           |                   |
| Portrait               |           ✅           |                   |
| Profile slug           |           ✅           |                   |
| 1–4 validation         | ✅ / schema validation | ✅ defensive check |
| First card featured    |                       |         ✅         |
| Featured card geometry |                       |         ✅         |
| Standard card geometry |                       |         ✅         |
| Centering for `< 4`    |                       |         ✅         |
| Card gaps              |                       |         ✅         |
| Borders/radius         |                       |         ✅         |
| Responsive layout      |                       |         ✅         |

---

# Mandatory Coding-Agent Rules

1. Doctor section is a CMS-driven list.
2. Homepage accepts **minimum 1, maximum 4 doctors**.
3. With four doctors, reproduce the supplied asymmetric desktop design.
4. First doctor uses **featured horizontal card**:

   * portrait left,
   * details right.
5. Remaining doctors use compact vertical cards.
6. When doctor count is `1`, `2`, or `3`, **center the entire rendered card group horizontally**.
7. Never render empty placeholder cards.
8. Never duplicate doctors merely to fill desktop width.
9. Never stretch fewer cards unnaturally to fill four slots.
10. Prefer relation to canonical Strapi `Doctor` collection.
11. CMS controls content/order; frontend controls geometry.
12. Preserve doctor-card order exactly as configured in Strapi.
