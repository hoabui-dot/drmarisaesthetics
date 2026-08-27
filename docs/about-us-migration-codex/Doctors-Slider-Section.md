# UI Implementation Spec — About Us Meet Our Doctors Slider Section

## 1. Identity

| Field                       | Value                                                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | Existing **About Us route in current codebase**                                                                                                                     |
| Section ID                  | `about-doctors`                                                                                                                                                     |
| Section name                | `About Us — Meet Our Doctors`                                                                                                                                       |
| Position in page            | **Immediately after `about-core-values`**                                                                                                                           |
| Section type                | Horizontal doctor carousel / slider                                                                                                                                 |
| Desktop visible cards       | `4` complete doctor cards in reference state                                                                                                                        |
| Navigation                  | **Manual Left / Right arrow controls**                                                                                                                              |
| Primary CTA                 | `VIEW ALL DOCTORS`                                                                                                                                                  |
| CMS integration             | Strapi CMS using canonical Doctor records                                                                                                                           |
| Primary implementation goal | Reproduce the four-card desktop doctor carousel with explicit previous/next controls, reusable Doctor data, consistent card geometry, and a View All Doctors action |
| Overall evidence quality    | High for desktop layout/card anatomy/navigation controls; Medium for exact slider boundary behavior; Low for responsive behavior                                    |

> **Critical position rule:** This section must render **directly after `about-core-values`**.

> **Critical interaction rule:** This section is a **real horizontal doctor slider/carousel**. The circular left/right arrow controls visible beside the cards are directional navigation controls and must move the doctor collection backward/forward.

> **Critical data rule:** Doctor information should preferably come from the same canonical Strapi `Doctor` collection used by the Homepage Doctor section and any Doctors listing/detail pages. Do not create duplicate About-page-only doctor biographies.

> **Critical visual distinction:** Unlike the Homepage Doctor section, the About Us Doctor section uses **uniform doctor cards**. There is no wide featured-doctor card in this design.

---

# 2. Relationship to Homepage Doctor Section

The website now contains two visually different representations of Doctor data.

### Homepage Doctor Section

```text
home-doctors

Doctor 01 → Featured wide card
Doctor 02 → Compact card
Doctor 03 → Compact card
Doctor 04 → Compact card
```

### About Us Doctor Section

```text
about-doctors

Doctor 01 → Standard card
Doctor 02 → Standard card
Doctor 03 → Standard card
Doctor 04 → Standard card

+ horizontal carousel navigation
```

Therefore:

```text
Doctor data
      ↓
shared canonical Strapi Doctor collection
      ↓
┌─────────────────────────────┐
│ Homepage Doctor Renderer    │
│ featured + compact variants │
└─────────────────────────────┘

┌─────────────────────────────┐
│ About Doctor Renderer       │
│ uniform carousel cards      │
└─────────────────────────────┘
```

Do **not** reuse Homepage Doctor card geometry directly.

Reuse the Doctor **data**, not necessarily the same presentation component.

---

# 3. Scope Boundary

## Included

* OBSERVED — Centered section heading:

  * `Meet Our Doctors`
* OBSERVED — Short blue underline beneath heading.
* OBSERVED — Four doctor cards visible simultaneously.
* OBSERVED — All four cards use equal/near-equal geometry.
* OBSERVED — Doctor portrait occupies upper card region.
* OBSERVED — Doctor information occupies lower region.
* OBSERVED — Each card displays:

  * portrait,
  * doctor name,
  * specialty,
  * credential/highlight bullet list,
  * LinkedIn/social icon.
* OBSERVED — Circular previous arrow on far-left.
* OBSERVED — Circular next arrow on far-right.
* OBSERVED — Bottom centered CTA:

  * `VIEW ALL DOCTORS`
* OBSERVED — Subtle pale-blue abstract decorative background.
* USER-SPECIFIED — This is a slide section with Left/Right directional arrows.
* INFERRED — Carousel should support more doctors than the four visible cards.
* INFERRED — Arrow controls should move the slider by one card or one logical group; exact step requires confirmation.
* INFERRED — Doctors should preserve Strapi order.

## Excluded

* UNKNOWN — autoplay.
* UNKNOWN — infinite looping.
* UNKNOWN — swipe/drag gesture.
* UNKNOWN — number of total doctors.
* UNKNOWN — whether arrows disable at boundaries.
* UNKNOWN — whether carousel wraps from last → first.
* UNKNOWN — card hover effect.
* UNKNOWN — doctor card click behavior.
* UNKNOWN — exact LinkedIn URLs.
* UNKNOWN — whether every doctor must have LinkedIn.
* UNKNOWN — tablet card count.
* UNKNOWN — mobile card count.

---

# 4. Evidence and Confidence

| Item                      | Status                    | Evidence                              |
| ------------------------- | ------------------------- | ------------------------------------- |
| Section after Core Values | USER-SPECIFIED            | Explicit requirement                  |
| Heading centered          | OBSERVED                  | Screenshot                            |
| Four visible cards        | OBSERVED                  | Four complete cards visible           |
| Equal card layout         | OBSERVED                  | All cards share same design           |
| Left/right navigation     | USER-SPECIFIED / OBSERVED | Circular arrows clearly visible       |
| Carousel behavior         | USER-SPECIFIED            | Explicitly described as slide         |
| Autoplay                  | UNKNOWN                   | Not supplied                          |
| Infinite loop             | UNKNOWN                   | Not supplied                          |
| LinkedIn control          | OBSERVED                  | Blue `in` circle visible on each card |
| View All CTA              | OBSERVED                  | Bottom centered button                |
| Canonical Doctor reuse    | INFERRED                  | Best CMS architecture                 |
| Responsive behavior       | UNKNOWN                   | Desktop reference only                |

---

# 5. OCR Content Inventory

The visible doctor content should be treated as reference copy. Final production copy should come from canonical Doctor data in Strapi.

## Doctor 01

Visible name:

`Dr. Ethan Santos`

Visible specialty:

`Implantologist & Surgeon`

Visible highlights approximately include:

* `Specialist in Implant Dentistry`
* `10+ years of experience`
* `Member, International Team for Implantology (ITI)`

Icon:

LinkedIn.

---

## Doctor 02

Visible name:

`Dr. Michelle Tran`

Visible specialty:

`Cosmetic Dentist`

Visible highlights approximately include:

* `Expert in Aesthetic Dentistry`
* `Certified in Advanced Smile Design`
* `Invisalign® Provider`

Icon:

LinkedIn.

---

## Doctor 03

Visible name:

`Dr. Nicholas Tam`

Visible specialty:

`Orthodontist`

Visible highlights approximately include:

* `Specialist in Orthodontics & Clear Aligners`
* `Master in Orthodontics`
* `Certified Invisalign® Provider`

Icon:

LinkedIn.

---

## Doctor 04

Visible name:

`Dr. Sophia Le`

Visible specialty:

`Pediatric Dentist`

Visible highlights approximately include:

* `Specialist in Pediatric Dentistry`
* `Member, American Academy of Pediatric Dentistry (AAPD)`
* `Gentle & Friendly Care`

Icon:

LinkedIn.

> Exact credential copy should come from Strapi/Figma rather than being reconstructed from screenshot OCR.

---

# 6. Layout Anatomy

## 6.1 Global Geometry

| Property            | Specification                                            | Status   |
| ------------------- | -------------------------------------------------------- | -------- |
| Section width       | Full viewport with centered content container            | OBSERVED |
| Background          | White / near-white with subtle pale-blue abstract curves | OBSERVED |
| Heading alignment   | Center                                                   | OBSERVED |
| Doctor carousel     | Centered horizontal row                                  | OBSERVED |
| Visible cards       | `4`                                                      | OBSERVED |
| Card widths         | Equal                                                    | OBSERVED |
| Card heights        | Equal                                                    | OBSERVED |
| Navigation arrows   | Outside/near horizontal edges of card row                | OBSERVED |
| CTA                 | Centered below carousel                                  | OBSERVED |
| Horizontal overflow | Must be clipped within carousel viewport                 | REQUIRED |

---

# 6.2 Structure Tree

```text
Section: about-doctors
├── BackgroundDecoration
│
├── SectionHeader
│   ├── H2: Meet Our Doctors
│   └── DecorativeUnderline
│
├── DoctorCarousel
│   ├── PreviousButton
│   │
│   ├── CarouselViewport
│   │   └── CarouselTrack
│   │       ├── DoctorCard
│   │       ├── DoctorCard
│   │       ├── DoctorCard
│   │       ├── DoctorCard
│   │       └── AdditionalDoctorCards...
│   │
│   └── NextButton
│
└── ViewAllDoctorsCTA
```

---

# 6.3 Desktop Topology

```text
                           Meet Our Doctors
                                ───

      ←     ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐     →
            │  PORTRAIT  │ │  PORTRAIT  │ │  PORTRAIT  │ │  PORTRAIT  │
            │            │ │            │ │            │ │            │
            ├────────────┤ ├────────────┤ ├────────────┤ ├────────────┤
            │ Name       │ │ Name       │ │ Name       │ │ Name       │
            │ Specialty  │ │ Specialty  │ │ Specialty  │ │ Specialty  │
            │            │ │            │ │            │ │            │
            │ • Detail   │ │ • Detail   │ │ • Detail   │ │ • Detail   │
            │ • Detail   │ │ • Detail   │ │ • Detail   │ │ • Detail   │
            │ • Detail   │ │ • Detail   │ │ • Detail   │ │ • Detail   │
            │            │ │            │ │            │ │            │
            │    in      │ │    in      │ │    in      │ │    in      │
            └────────────┘ └────────────┘ └────────────┘ └────────────┘

                         [ VIEW ALL DOCTORS ]
```

---

# 7. Section Header

## Heading

```text
Meet Our Doctors
```

Appearance:

* centered,
* deep navy,
* bold/semibold,
* approximately `32–38 px estimated`.

---

## Decorative underline

* small horizontal blue line,
* centered beneath heading,
* same visual family as Core Values heading underline,
* approximately `35–50 px estimated`.

Do not extend across the carousel.

---

# 8. Doctor Carousel Specification

## 8.1 Required Desktop Visible Count

At the supplied full desktop viewport:

```text
visibleDoctors = 4
```

The visible area should show:

```text
[ Doctor 1 ] [ Doctor 2 ] [ Doctor 3 ] [ Doctor 4 ]
```

completely.

Do not intentionally show:

```text
3.5 cards
```

or:

```text
4.5 cards
```

unless another breakpoint design explicitly requires preview cards.

---

# 8.2 Carousel Viewport

Recommended structure:

```text
DoctorCarousel
├── Previous
├── Viewport
│   └── Track
└── Next
```

The viewport must:

* hide overflow,
* prevent page-level horizontal scrolling,
* contain moving doctor cards,
* preserve fixed card dimensions while track moves.

---

# 8.3 Left Arrow

Visible on far-left.

Concept:

```text
○
‹
```

Appearance:

* circular light/white button,
* subtle shadow/light border,
* blue/navy left chevron,
* vertically centered relative to doctor-card region.

Required action:

```text
Previous
```

---

# 8.4 Right Arrow

Visible on far-right.

Concept:

```text
○
›
```

Required action:

```text
Next
```

Same dimensions/style as previous button.

---

# 8.5 Arrow Navigation Behavior

Mandatory:

```text
Left Arrow
→ move carousel toward previous doctor(s)

Right Arrow
→ move carousel toward next doctor(s)
```

Exact slide increment is not explicitly defined.

Two implementation models are possible.

### Model A — One doctor per click

```text
[1][2][3][4]
       ↓ next
[2][3][4][5]
```

### Model B — One viewport/page per click

```text
[1][2][3][4]
       ↓ next
[5][6][7][8]
```

For a doctor browsing section, **one-card stepping is generally smoother**, but this remains an implementation inference.

Do not hard-code paging behavior as a Product requirement without confirmation.

---

# 8.6 Autoplay

No autoplay has been requested.

Therefore default behavior:

```text
autoplay = false
```

unless another specification later explicitly requires automatic movement.

This section differs from:

* Device slider,
* Press logo slider,

which were explicitly requested to autoplay.

---

# 8.7 Infinite Loop

UNKNOWN.

Possible options:

### Finite

At first item:

```text
Previous = disabled
```

At final possible viewport:

```text
Next = disabled
```

### Infinite

Last cards continue back to first.

No supplied evidence selects one.

Do not assume infinite looping solely because the component is a carousel.

---

# 8.8 Swipe / Drag

Not visible in desktop screenshot.

For mobile, swipe may be appropriate, but exact interaction remains pending responsive design.

Desktop mouse drag should not be introduced unless the chosen carousel library already supports it cleanly and Product accepts it.

---

# 9. Doctor Card Specification

## 9.1 Anatomy

```text
DoctorCard
├── PortraitArea
│   └── DoctorPortrait
│
└── ContentArea
    ├── Name
    ├── Specialty
    ├── Highlights[]
    └── SocialLink
        └── LinkedInIcon
```

---

# 9.2 Geometry

| Property        | Specification                      | Status   |
| --------------- | ---------------------------------- | -------- |
| Orientation     | Vertical                           | OBSERVED |
| Width           | Equal                              | OBSERVED |
| Height          | Equal                              | OBSERVED |
| Surface         | White                              | OBSERVED |
| Border          | Very pale blue                     | OBSERVED |
| Radius          | Approximately `10–14 px estimated` | INFERRED |
| Shadow          | Minimal / very subtle              | INFERRED |
| Portrait region | Upper ~50%                         | INFERRED |
| Content region  | Lower ~50%                         | OBSERVED |
| Text alignment  | Left                               | OBSERVED |
| Card overflow   | Clip portrait to top card radius   | REQUIRED |

---

# 10. Portrait Area

Portraits use:

* white/light background,
* doctor centered,
* upper body visible,
* white dental coat,
* crossed-arm poses in reference.

### Image behavior

Prefer:

```text
object-fit: contain
```

or a controlled portrait crop that preserves:

* head,
* torso,
* shoulders,
* arms.

Do not aggressively use a generic `cover` crop that cuts off head or posture.

---

# 10.1 Portrait consistency

All Doctor images should be prepared/rendered with comparable:

* crop,
* scale,
* visual head height,
* body placement,
* light background.

Frontend should provide a predictable portrait slot even if original assets differ slightly.

---

# 11. Card Content

## 11.1 Doctor Name

Examples:

```text
Dr. Ethan Santos
Dr. Michelle Tran
Dr. Nicholas Tam
Dr. Sophia Le
```

* dark navy,
* bold/semibold,
* strongest text in content region.

---

# 11.2 Specialty

Examples:

```text
Implantologist & Surgeon
Cosmetic Dentist
Orthodontist
Pediatric Dentist
```

* bright/medium blue,
* directly beneath name,
* smaller than doctor name.

---

# 11.3 Credential / Highlight List

Structure:

```text
• Highlight
• Highlight
• Highlight
```

Appearance:

* small blue bullet,
* body text dark navy/gray,
* compact line-height,
* typically three visible bullets.

---

# 11.4 Content Height Stability

Doctor cards need equal heights even if credential strings differ.

Do not allow:

```text
Doctor A card = short
Doctor B card = tall
Doctor C card = medium
```

Recommended internal structure:

```text
ContentArea
├── Identity
├── Highlights
└── SocialLink pushed toward bottom
```

Using a stable flex layout makes the LinkedIn icon align near card bottoms.

---

# 12. LinkedIn / Social Action

## 12.1 Visible Treatment

Each card includes a small blue circular:

```text
in
```

LinkedIn icon near the lower-left.

### Recommended data behavior

Doctor record:

```text
linkedinUrl
```

Frontend:

```text
if linkedinUrl exists
→ render LinkedIn button/link

if linkedinUrl missing
→ do not render fake link
```

Do not require dummy social URLs merely to preserve layout.

---

# 12.2 Accessibility

If interactive:

* use semantic link,
* accessible name should include doctor context.

Conceptually:

```text
Dr. Ethan Santos on LinkedIn
```

If opening externally, follow the site's standard external-link behavior.

---

# 13. View All Doctors CTA

Visible:

```text
VIEW ALL DOCTORS
```

Position:

* centered below carousel.

Appearance:

* white/transparent surface,
* pale/bright-blue outline,
* blue label,
* pill / strongly rounded rectangle.

Unlike Homepage's text-only `VIEW ALL DOCTORS`, this About version is rendered as a clear outlined button.

---

# 13.1 Destination

Use the **existing Doctors listing route from the codebase** if already implemented.

Do not invent:

```text
/doctors
```

unless that is the current canonical route.

Same codebase-preservation principle used by Global Header applies here.

---

# 14. Background Decoration

The section contains subtle pale-blue abstract curved shapes.

Visible areas include approximately:

* lower-left flowing blue curves,
* upper/right light flowing line or ribbon.

These are decorative only.

Possible implementation:

* section background image,
* SVG decoration,
* CSS pseudo-element if original design uses vector shapes.

### Rule

If Figma provides one background decorative asset, use that rather than reconstructing multiple arbitrary shapes.

The decoration should remain:

* low contrast,
* behind card layer,
* non-interactive,
* non-semantic.

---

# 15. Strapi CMS Architecture

## 15.1 Canonical Doctor Collection

Recommended:

```text
Doctor
├── name
├── slug
├── specialty
├── portrait
├── shortDescription?
├── homepageCredentials?
├── aboutCredentials?
├── linkedinUrl?
└── extended profile fields...
```

However avoid creating page-specific duplicate credential fields unless the visible copy genuinely differs.

A cleaner model may be:

```text
Doctor
└── highlights[]
```

used in compact displays.

---

# 15.2 About Doctors Section

Recommended:

```text
About Page
└── Doctors Section
    ├── heading
    └── doctors[]
          ↓ ordered relation
        Doctor
```

Optional:

```text
viewAllCTA
```

if label/destination are intended to be CMS-managed.

---

# 15.3 Fields

| Field          | Type                       |                Required |
| -------------- | -------------------------- | ----------------------: |
| `heading`      | Short text                 |                     Yes |
| `doctors`      | Ordered relation to Doctor |                     Yes |
| `viewAllLabel` | Short text                 | Optional / configurable |
| `viewAllLink`  | Existing link/reference    |                Optional |

Do not duplicate:

* doctor name,
* image,
* specialty

inside About Page if those already belong to `Doctor`.

---

# 15.4 Doctor Ordering

Strapi selected order should define track order:

```text
doctors[0]
doctors[1]
doctors[2]
...
```

Frontend must not:

* alphabetically sort,
* randomly shuffle,
* sort by creation date

unless Product explicitly requests it.

---

# 16. Number of Doctors

The screenshot shows four visible cards but the carousel implies there may be more than four Doctor records.

Therefore:

```text
visibleDesktop = 4
```

does **not** mean:

```text
maxDoctorCount = 4
```

This section should support:

```text
4+
```

doctor entries if CMS provides them.

---

# 16.1 Fewer Than Four Doctors

If configured Doctor count is:

```text
1–3
```

recommended behavior:

* disable unnecessary carousel motion,
* render actual doctors only,
* center the card group,
* do not duplicate doctors,
* do not render blank card slots.

Example:

```text
3 doctors

        [ D1 ] [ D2 ] [ D3 ]
        <---- centered ----->
```

This is consistent with the site's prior doctor-section behavior and avoids artificial empty space.

---

# 16.2 Four Doctors

```text
[D1] [D2] [D3] [D4]
```

If total count is exactly four:

* slider navigation is functionally unnecessary.

Recommended frontend behavior:

```text
doctorCount <= visibleDesktop
→ hide/disable arrows
```

unless Product explicitly wants arrow visuals always shown.

Screenshot shows arrows because the design likely assumes additional doctors.

---

# 16.3 More Than Four Doctors

Example:

```text
CMS:
D1 D2 D3 D4 D5 D6 D7
```

Initial viewport:

```text
[D1] [D2] [D3] [D4]
```

Next:

```text
[D2] [D3] [D4] [D5]
```

if one-card stepping is adopted.

---

# 17. Carousel State Contract

Frontend state:

```text
currentIndex
visibleCount
doctorCount
```

Buttons derive behavior from these values.

For finite mode:

```text
canGoPrevious
canGoNext
```

Do not store current carousel position in Strapi.

---

# 18. CMS vs Frontend Responsibility

| Responsibility           |       Strapi       |  Frontend |
| ------------------------ | :----------------: | :-------: |
| Doctor name              | ✅ canonical Doctor |           |
| Specialty                |          ✅         |           |
| Portrait                 |          ✅         |           |
| Credentials/highlights   |          ✅         |           |
| LinkedIn URL             |          ✅         |           |
| Doctor selection         |          ✅         |           |
| Doctor order             |          ✅         |           |
| Heading                  |          ✅         |           |
| Visible cards = 4        |                    |     ✅     |
| Carousel arrows          |                    |     ✅     |
| Previous/next behavior   |                    |     ✅     |
| Carousel position        |                    |     ✅     |
| Card geometry            |                    |     ✅     |
| Equal-height cards       |                    |     ✅     |
| Background decoration    |                    | ✅ / asset |
| Responsive visible count |                    |     ✅     |

---

# 19. Component Contract

Recommended frontend architecture:

```text
AboutDoctorsSection
├── CenteredSectionHeading
├── DoctorsCarousel
│   ├── CarouselArrow direction="previous"
│   ├── CarouselViewport
│   │   └── DoctorCarouselCard[]
│   └── CarouselArrow direction="next"
└── ViewAllDoctorsButton
```

Reusable components:

| Component            | Responsibility         |
| -------------------- | ---------------------- |
| `DoctorsCarousel`    | Track/navigation state |
| `DoctorCarouselCard` | About-page Doctor card |
| `DoctorPortrait`     | Standardized portrait  |
| `DoctorHighlights`   | Credential bullets     |
| `DoctorSocialLink`   | LinkedIn               |
| `CarouselArrow`      | Previous/next          |
| `OutlinedCTA`        | View All               |

---

# 20. Interaction Specification

## Previous Button

```text
click
↓
move slider to previous doctor/group
```

---

## Next Button

```text
click
↓
move slider to next doctor/group
```

---

## Keyboard

Both arrow controls must be:

* semantic buttons,
* Tab-focusable,
* triggered by Enter/Space,
* visibly focused.

Accessible labels:

```text
Previous doctors
Next doctors
```

---

# 20.1 Arrow Key Shortcuts

Do not automatically bind browser keyboard arrow keys globally.

If the carousel uses keyboard Left/Right arrows while focus is inside the carousel, implement according to the selected accessible carousel pattern only.

---

# 20.2 Autoplay

Do not add.

This is a manually navigated carousel according to the current requirement.

---

# 21. Responsive Specification

## 21.1 Desktop

Reference:

```text
4 cards visible
```

plus left/right arrow navigation when overflow exists.

---

# 21.2 Tablet

UNKNOWN.

Structurally likely:

```text
2–3 cards visible
```

but exact count requires responsive design approval.

---

# 21.3 Mobile

UNKNOWN.

Likely interaction pattern could become:

```text
1 doctor card visible
+ swipe
+ left/right controls
```

but this is not approved evidence.

---

# 21.4 Responsive principle

Do not keep four tiny cards merely to maintain:

```text
visible = 4
```

on narrow screens.

The four-card rule applies to the supplied full desktop reference.

---

# 21.5 Same Doctor Data at Every Breakpoint

Do not create:

```text
desktopDoctors[]
tabletDoctors[]
mobileDoctors[]
```

Use the same canonical ordered relation and adjust only layout.

---

# 22. Semantic HTML and Accessibility

## Section

Use semantic section associated with:

```text
Meet Our Doctors
```

## Doctor cards

Each Doctor can be rendered as an article/list item.

## Portrait

Alt should identify the doctor where appropriate.

Example:

```text
Portrait of Dr. Ethan Santos
```

## Credentials

Use semantic list markup.

## LinkedIn

Use semantic external link.

## Slider

Controls require accessible names and correct disabled state if finite.

---

# 23. Visual Specification

## Colors

| Token                             | Usage                | Description        |
| --------------------------------- | -------------------- | ------------------ |
| `color/about-doctors/background`  | Section              | White / near-white |
| `color/about-doctors/heading`     | H2                   | Deep navy          |
| `color/about-doctors/underline`   | Heading accent       | Bright blue        |
| `color/about-doctors/card`        | Card                 | White              |
| `color/about-doctors/card-border` | Border               | Pale blue          |
| `color/about-doctors/name`        | Doctor name          | Deep navy          |
| `color/about-doctors/specialty`   | Specialty            | Medium blue        |
| `color/about-doctors/body`        | Highlights           | Muted navy         |
| `color/about-doctors/bullet`      | List bullet          | Bright blue        |
| `color/about-doctors/linkedin`    | Social circle        | Bright/deep blue   |
| `color/about-doctors/arrow`       | Carousel arrow       | Blue/navy          |
| `color/about-doctors/cta`         | View All border/text | Bright blue        |

---

# 23.1 Typography

| Element         | Approx. specification      |
| --------------- | -------------------------- |
| Section heading | `32–38 px`, semibold/bold  |
| Doctor name     | `16–19 px`, semibold/bold  |
| Specialty       | `13–15 px`, medium         |
| Highlights      | `11–13 px`, regular/medium |
| View All        | `12–14 px`, semibold       |

Exact values should follow global design tokens.

---

# 24. Card Geometry Stability

Each card must remain aligned despite varying credential lengths.

Recommended:

```text
DoctorCard
├── PortraitArea
└── ContentArea
    ├── Identity
    ├── Highlights flex-grow
    └── LinkedIn
```

This keeps social icons at consistent vertical positions.

Acceptance goal:

```text
Card 1 bottom
Card 2 bottom
Card 3 bottom
Card 4 bottom
→ aligned
```

---

# 25. Implementation Constraints

1. Render `about-doctors` immediately after `about-core-values`.
2. This is a horizontal carousel.
3. Use explicit Left and Right controls.
4. Full desktop shows four complete cards.
5. Do not reuse Homepage's featured Doctor card layout.
6. All About-page doctor cards use uniform geometry.
7. Reuse canonical Doctor Strapi records.
8. Do not duplicate Doctor profiles in the About page schema.
9. Do not add autoplay.
10. Do not add pagination dots unless another design shows them.
11. Preserve CMS Doctor ordering.
12. More than four Doctor records should continue inside the track.
13. Do not shrink cards just because more doctors exist.
14. Do not duplicate doctors for carousel looping.
15. If fewer than four doctors exist, center actual cards and avoid placeholder slots.
16. Arrow state/visibility should respond to actual overflow.
17. Preserve centered `VIEW ALL DOCTORS` CTA.
18. Frontend controls slider geometry/state; Strapi controls doctor content/order.

---

# 26. Visual Acceptance Criteria

## Section

* [ ] Renders after Core Values.
* [ ] White/light section background.
* [ ] Pale-blue decorative curves remain subtle.
* [ ] Heading reads `Meet Our Doctors`.
* [ ] Heading is centered.
* [ ] Short blue underline is centered.

## Carousel

* [ ] Four complete cards visible on full desktop.
* [ ] Cards remain equal width.
* [ ] Cards remain equal height.
* [ ] Left arrow appears beside carousel.
* [ ] Right arrow appears beside carousel.
* [ ] Left arrow moves carousel backward.
* [ ] Right arrow moves carousel forward.
* [ ] Page does not receive horizontal overflow.
* [ ] Doctor cards move without layout shift.

## Doctor Card

* [ ] Portrait occupies upper region.
* [ ] Name appears below portrait.
* [ ] Specialty appears below name.
* [ ] Credential list uses small blue bullets.
* [ ] LinkedIn icon appears near card bottom when configured.
* [ ] Pale-blue border remains consistent.
* [ ] Corners are rounded.
* [ ] No card uses Homepage's featured horizontal design.

## CTA

* [ ] `VIEW ALL DOCTORS` appears centered below carousel.
* [ ] CTA uses outlined pill treatment.
* [ ] CTA navigates to existing Doctor listing route when configured.

---

# 27. Carousel Acceptance Scenarios

### More than 4 doctors

```text
Initial:
[D1][D2][D3][D4]

Next:
[D2][D3][D4][D5]
```

or approved page-stepping equivalent.

* [ ] Additional doctors become reachable.
* [ ] Existing cards remain same width.

### Exactly 4 doctors

* [ ] Four cards display fully.
* [ ] No duplicate records are created.
* [ ] Arrow controls should not imply inaccessible extra content.

### 3 doctors

```text
       [D1][D2][D3]
```

* [ ] Centered.
* [ ] No empty fourth card.
* [ ] No duplicated doctor.

### 1 doctor

```text
             [D1]
```

* [ ] Centered.
* [ ] Card retains normal max width.
* [ ] No fake slider movement.

---

# 28. Visual / Architecture Risks

| Risk                                      | Why it matters                         | Mitigation                               | Priority |
| ----------------------------------------- | -------------------------------------- | ---------------------------------------- | -------- |
| Reusing Homepage Doctor card              | Wrong About-page design                | Separate uniform carousel card renderer  | High     |
| Treating four visible as max doctor count | Makes carousel pointless               | Separate visible count from data count   | High     |
| Autoplay added                            | User only requested directional slider | Manual navigation only                   | High     |
| Doctor data duplicated in About page      | CMS inconsistency                      | Canonical Doctor relations               | High     |
| Placeholder doctors                       | Displays false practitioner data       | Render real records only                 | High     |
| Duplicate doctors for looping             | Misleading UI/data                     | Never duplicate CMS records              | High     |
| Arrow controls don't react to boundaries  | Confusing carousel                     | Implement proper disabled/loop model     |          |
| Unequal cards                             | Breaks row rhythm                      | Equal-height card architecture           | High     |
| Long credential list                      | Changes card height                    | Content constraints/flex layout          | Medium   |
| Portrait crops differ                     | Row appears inconsistent               | Standard portrait slot/focal positioning | High     |
| LinkedIn icon rendered without URL        | Creates broken link                    | Conditional rendering                    | Medium   |
| Background decoration too strong          | Competes with doctor cards             | Low-opacity decorative layer             | Medium   |

---

# 29. Open Questions

| ID  | Question                                                         | Blocking level                     | Suggested owner    |
| --- | ---------------------------------------------------------------- | ---------------------------------- | ------------------ |
| Q1  | Should each arrow move one doctor or one full page/group?        | Important interaction decision     | Designer           |
| Q2  | Should the carousel loop infinitely?                             | Important                          | Designer / Product |
| Q3  | Should arrows become disabled at first/last position?            | Depends on Q2                      | Designer           |
| Q4  | How many doctors will normally exist in Strapi?                  | Non-blocking                       | Product            |
| Q5  | Should LinkedIn icon hide when a Doctor has no LinkedIn URL?     | Recommended yes                    | Product            |
| Q6  | Does clicking a Doctor card open Doctor detail?                  | Interaction decision               | Product            |
| Q7  | Is `VIEW ALL DOCTORS` routed to an existing Doctor listing page? | Codebase verification              | Developer          |
| Q8  | Should touch swipe be enabled?                                   | Mobile interaction decision        | Designer           |
| Q9  | What is tablet visible-card count?                               | Blocking for exact tablet fidelity | Designer           |
| Q10 | What is mobile visible-card count?                               | Blocking for exact mobile fidelity | Designer           |

---

# 30. Strapi Handoff Summary

Preferred:

```text
Doctor Collection
├── name
├── slug
├── specialty
├── portrait
├── highlights[]
├── linkedinUrl
└── profile content...


About Page
└── Doctors Section
    ├── heading
    │   └── Meet Our Doctors
    │
    └── doctors[]
          ↓ ordered relation
        Doctor
```

No duplicate Doctor profile data inside About Page.

---

# 31. Data-to-UI Mapping

```text
doctors[0] → DoctorCard 1
doctors[1] → DoctorCard 2
doctors[2] → DoctorCard 3
doctors[3] → DoctorCard 4

doctors[4+] → remain in carousel track
```

Desktop:

```text
visibleCount = 4
```

CMS count:

```text
independent from visibleCount
```

This distinction is mandatory.

---

# 32. Slider Handoff

```text
                           Meet Our Doctors
                                ───


     PREVIOUS                                         NEXT
        ↓                                               ↓

       (‹)   [ D1 ] [ D2 ] [ D3 ] [ D4 ]   (›)
                     carousel viewport


                     [ VIEW ALL DOCTORS ]
```

If additional doctors exist:

```text
TRACK

[D1][D2][D3][D4][D5][D6][D7]...
                 ↔
         controlled by arrows
```

---

# 33. CMS vs Frontend Responsibility

| Responsibility                  | Strapi | Frontend |
| ------------------------------- | :----: | :------: |
| Doctor selection                |    ✅   |          |
| Doctor order                    |    ✅   |          |
| Name                            |    ✅   |          |
| Specialty                       |    ✅   |          |
| Portrait                        |    ✅   |          |
| Credentials                     |    ✅   |          |
| LinkedIn URL                    |    ✅   |          |
| Heading                         |    ✅   |          |
| Four-card desktop viewport      |        |     ✅    |
| Carousel movement               |        |     ✅    |
| Previous/Next controls          |        |     ✅    |
| Card geometry                   |        |     ✅    |
| Equal height                    |        |     ✅    |
| Arrow disabled state            |        |     ✅    |
| Responsive card count           |        |     ✅    |
| Background decorative treatment |        |     ✅    |

---

# 34. Mandatory Coding-Agent Rules

1. Create `about-doctors` **immediately after `about-core-values`**.
2. Implement it as a **horizontal doctor carousel/slider**.
3. Provide visible **Left / Right directional arrow controls**.
4. Desktop reference displays **4 complete cards simultaneously**.
5. Do not add autoplay.
6. Doctor records beyond the first four remain accessible through the slider.
7. Do not interpret `4 visible` as `max 4 doctors`.
8. All cards use the same vertical About-page design.
9. Do not reuse Homepage's wide featured Doctor card.
10. Reuse canonical Strapi Doctor entities.
11. Preserve Strapi Doctor order.
12. Each card contains portrait, name, specialty, highlights and optional LinkedIn action.
13. Do not create fake LinkedIn links if URL is missing.
14. Keep doctor cards equal width and equal height.
15. Keep section heading and blue underline centered.
16. Preserve subtle pale-blue background decoration.
17. Add centered outlined `VIEW ALL DOCTORS` below carousel.
18. Use existing Doctor listing route from the codebase; do not invent a replacement route.
19. If there are fewer than four doctors, render real records only and center the group.
20. Frontend owns carousel interaction/layout; Strapi owns Doctor content and ordering.
