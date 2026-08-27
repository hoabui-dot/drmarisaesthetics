# UI Implementation Spec — Contact Page Hero Section

## 1. Identity

| Field                       | Value                                                                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | Existing **Contact route in current codebase** — do not rename                                                                                       |
| Section ID                  | `contact-hero`                                                                                                                                       |
| Section name                | `Contact Page Hero`                                                                                                                                  |
| Position                    | First Contact-page content section below global `SiteHeader`                                                                                         |
| Section type                | Breadcrumb + contact introduction + clinic visual + quick contact cards                                                                              |
| Primary layout              | Top `content-left / image-right`, bottom `4 contact cards`                                                                                           |
| CMS integration             | Strapi CMS / canonical Clinic or Contact settings                                                                                                    |
| Primary implementation goal | Reproduce the Vietnamese Contact-page hero with editable introductory content, one clinic image, and four structured quick-contact information cards |
| Overall evidence quality    | High for desktop structure/content; Medium for exact dimensions; Low for responsive behavior                                                         |

> **Critical route rule:** Preserve the Contact page route already existing in the codebase.

> **Critical data rule:** Hotline, address, email and opening hours should be structured fields, not baked into images.

> **Critical visual rule:** The four information blocks at the bottom are **four independent cards**, unlike the About Mission/Vision shared card.

---

# 2. Section Position

Contact page structure begins:

```text
SiteHeader
↓
contact-hero
↓
next Contact page section...
↓
SiteFooter
```

The screenshot starts at the page content area and does not redefine the global header.

Reuse:

```text
SiteHeader
```

from the global header specification.

When current route is Contact:

```text
CONTACT
→ active navigation state
```

using the same blue text + underline treatment already defined globally.

---

# 3. Scope Boundary

## Included

* OBSERVED — Breadcrumb:

  * `Trang chủ`
  * `Liên hệ`
* OBSERVED — Large page heading:

  * `Liên hệ Smilux`
* OBSERVED — Blue supporting heading:

  * `Tư vấn – Đặt lịch – Hỗ trợ điều trị Implant`
* OBSERVED — Introductory paragraph.
* OBSERVED — Large clinic consultation image on right.
* OBSERVED — Smilux Dental Clinic branding inside image.
* OBSERVED — Four bottom contact-information cards:

  1. Hotline
  2. Địa chỉ
  3. Email
  4. Giờ làm việc
* OBSERVED — One blue icon inside pale circular background per card.
* OBSERVED — Contact cards use white surface, pale border and rounded corners.
* INFERRED — Breadcrumb Home should use the existing Homepage route.
* INFERRED — Contact information should reuse canonical Clinic/Contact data where appropriate.
* INFERRED — Hotline and email may be actionable links, but click behavior is not directly evidenced by the screenshot.

## Excluded

* UNKNOWN — subsequent Contact page sections.
* UNKNOWN — map.
* UNKNOWN — contact form.
* UNKNOWN — hover effects.
* UNKNOWN — card click behavior.
* UNKNOWN — image animation.
* UNKNOWN — tablet layout.
* UNKNOWN — mobile layout.
* UNKNOWN — whether the page supports multiple branches.

---

# 4. OCR / Content Inventory

## 4.1 Breadcrumb

```text
Trang chủ  >  Liên hệ
```

### Suggested semantics

* `Trang chủ` → existing Homepage route.
* `Liên hệ` → current page, non-clickable/current state.

Do not hard-code a guessed `/contact` route if the codebase uses another path.

---

# 4.2 Main Heading

```text
Liên hệ Smilux
```

Type:

* Contact page H1.

Visual:

* large,
* deep navy,
* bold,
* left aligned.

---

# 4.3 Supporting Heading

```text
Tư vấn – Đặt lịch – Hỗ trợ điều trị Implant
```

Appearance:

* bright blue,
* prominent,
* positioned immediately beneath H1,
* visually acts as page subtitle.

---

# 4.4 Introductory Copy

Visible:

```text
Đội ngũ chuyên gia của Smilux luôn sẵn sàng lắng nghe và đồng hành
cùng bạn trên hành trình kiến tạo nụ cười khỏe đẹp.
Liên hệ với chúng tôi để được tư vấn và đặt lịch khám nhanh chóng.
```

Confidence: High.

Final production copy should come from approved Strapi/Figma content.

---

# 4.5 Contact Card 01 — Hotline

### Label

```text
Hotline
```

### Primary value

```text
1800 8888
```

### Supporting text

```text
Tư vấn & đặt lịch miễn phí 24/7
```

### Icon

Phone handset.

---

# 4.6 Contact Card 02 — Address

### Label

```text
Địa chỉ
```

### Value

```text
233 – 233A Nguyễn Trọng Tuyển,
Phường Phú Nhuận,
TP. Hồ Chí Minh, Việt Nam
```

### Icon

Location pin.

---

# 4.7 Contact Card 03 — Email

### Label

```text
Email
```

### Value

```text
info@smiluxdental.vn
```

### Supporting text

```text
Phản hồi trong 30 phút
```

### Icon

Envelope.

---

# 4.8 Contact Card 04 — Opening Hours

### Label

```text
Giờ làm việc
```

### Value

```text
Thứ 2 – Chủ nhật
08:00 – 20:00
```

### Icon

Clock.

---

# 5. Layout Anatomy

## 5.1 Desktop Structure

```text
ContactHero
├── Breadcrumb
│
├── HeroTop
│   ├── IntroContent
│   │   ├── H1
│   │   ├── Subtitle
│   │   └── Description
│   │
│   └── ClinicImage
│
└── ContactInfoGrid
    ├── HotlineCard
    ├── AddressCard
    ├── EmailCard
    └── OpeningHoursCard
```

---

# 5.2 Desktop Topology

```text
Trang chủ  >  Liên hệ


┌─────────────────────────────────────┬──────────────────────────────────────┐
│                                     │                                      │
│ Liên hệ Smilux                      │                                      │
│                                     │                                      │
│ Tư vấn – Đặt lịch –                 │        CLINIC / CONSULTATION         │
│ Hỗ trợ điều trị Implant             │               IMAGE                 │
│                                     │                                      │
│ Introductory paragraph...           │        Smilux Dental Clinic         │
│ Introductory paragraph...           │                                      │
│                                     │                                      │
└─────────────────────────────────────┴──────────────────────────────────────┘


┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  PHONE          │ │  LOCATION       │ │  EMAIL          │ │  CLOCK          │
│                 │ │                 │ │                 │ │                 │
│  Hotline        │ │  Địa chỉ        │ │  Email          │ │  Giờ làm việc   │
│  1800 8888      │ │  Address...     │ │  info@...       │ │  Thứ 2-CN       │
│  Supporting     │ │                 │ │  Supporting     │ │  08:00-20:00    │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

# 6. Top Hero Layout

## 6.1 Column Ratio

Approximate desktop ratio:

```text
Intro Content ≈ 45–47%
Clinic Image  ≈ 53–55%
```

The right-side clinic image is slightly more visually dominant than the text region.

---

# 6.2 Intro Content Alignment

* Left aligned.
* Content remains vertically centered relative to main image region.
* H1/subtitle occupy upper-middle portion.
* Paragraph width constrained.

Do not stretch paragraph across the full left column width if that produces very long lines.

---

# 7. Breadcrumb Specification

## 7.1 Visual

```text
Trang chủ   >   Liên hệ
```

* small text,
* muted/dark navy,
* top-left,
* substantially smaller than H1.

Separator:

```text
>
```

or equivalent chevron.

---

# 7.2 Semantics

Recommended:

```text
nav aria-label="Breadcrumb"
```

Conceptually:

```text
Home
→ Contact
```

Current page should expose current-page semantics.

---

# 7.3 CMS Ownership

Breadcrumb labels can generally derive from page/router/localization data.

Do not create a bespoke Strapi breadcrumb array solely for this page unless the site architecture already does so.

---

# 8. Main Heading Specification

## H1

```text
Liên hệ Smilux
```

Approximate:

* `54–64 px estimated`,
* bold,
* deep navy.

This should be the logical page H1.

---

# 8.1 Subtitle

```text
Tư vấn – Đặt lịch – Hỗ trợ điều trị Implant
```

Approximate:

* `27–32 px estimated`,
* blue,
* medium/semibold.

Do not combine H1 and subtitle into one image.

---

# 9. Clinic Hero Image

## 9.1 Visible Content

Image contains:

* patient seated in dental chair,
* dentist explaining treatment,
* tablet/display in dentist's hand,
* dental imaging monitors,
* bright modern dental equipment,
* `Smilux DENTAL CLINIC` branding.

---

# 9.2 Container

Appearance:

* landscape orientation,
* large radius,
* no visible card text around it,
* right aligned.

Approximate:

```text
border-radius: 26–32 px estimated
```

---

# 9.3 Image Fit

Recommended:

```text
object-fit: cover
```

Preserve focal areas:

* patient,
* dentist,
* Smilux logo,
* diagnostic monitor.

Do not crop the right monitor or main doctor/patient interaction excessively.

---

# 9.4 CMS

Recommended field:

```text
heroImage
```

with media alt metadata.

Possible alt:

```text
Bác sĩ Smilux tư vấn điều trị nha khoa cho bệnh nhân
```

if the image is considered meaningful content.

---

# 10. Contact Information Grid

## 10.1 Desktop Contract

```text
columns = 4
rows = 1
```

All four cards are visible completely.

No slider.

No pagination.

---

# 10.2 Grid Topology

```text
[ Hotline ] [ Address ] [ Email ] [ Opening Hours ]
```

Cards have equal/near-equal widths.

The Address card may contain more text, but it should not become wider than other cards.

---

# 11. Contact Card Anatomy

Each card:

```text
ContactInfoCard
├── IconCircle
│   └── Icon
│
└── Content
    ├── Label
    ├── PrimaryValue
    └── SupportingText?
```

Visual:

```text
┌────────────────────────────┐
│                            │
│   ○    Label               │
│ ICON   Primary Value       │
│        Supporting text     │
│                            │
└────────────────────────────┘
```

---

# 11.1 Card Styling

| Property       | Specification               |
| -------------- | --------------------------- |
| Surface        | White                       |
| Border         | Pale blue / light gray-blue |
| Radius         | `14–18 px estimated`        |
| Shadow         | Minimal/subtle              |
| Content layout | Icon left + text right      |
| Text alignment | Left                        |
| Inner padding  | Medium                      |

Do not use the centered-card layout from `about-core-values`.

---

# 12. Contact Card Icon Style

Shared icon circle:

```text
○
```

Visual characteristics:

* pale blue circular background,
* bright-blue line icon,
* consistent diameter,
* positioned toward upper-left.

Required mapping:

| Card         | Icon         |
| ------------ | ------------ |
| Hotline      | Phone        |
| Địa chỉ      | Location pin |
| Email        | Envelope     |
| Giờ làm việc | Clock        |

Icons should come from the frontend/design system.

Do not require arbitrary uploads for these four standard contact semantics.

---

# 13. Hotline Card

## Hierarchy

```text
Hotline
1800 8888
Tư vấn & đặt lịch miễn phí 24/7
```

Visual priority:

1. `1800 8888`
2. `Hotline`
3. supporting copy

The phone number is bright blue and significantly larger than supporting text.

---

# 13.1 Interaction

A telephone action would be appropriate:

```text
tel:
```

but this behavior is INFERRED.

If existing site convention already makes phone numbers clickable, preserve it.

---

# 14. Address Card

```text
Địa chỉ

233 – 233A Nguyễn Trọng Tuyển,
Phường Phú Nhuận,
TP. Hồ Chí Minh, Việt Nam
```

Address is multi-line.

Do not truncate this to one line on desktop.

---

# 14.1 Data Architecture

Prefer:

```text
ClinicLocation.address
```

rather than duplicating this string in:

* Contact Hero,
* Footer,
* Booking section.

If different sections intentionally represent different branches, associate each section with the appropriate `ClinicLocation`.

---

# 15. Email Card

```text
Email

info@smiluxdental.vn

Phản hồi trong 30 phút
```

Primary email:

* bright blue,
* semibold.

Possible semantic interaction:

```text
mailto:
```

if consistent with site behavior.

---

# 16. Opening Hours Card

```text
Giờ làm việc

Thứ 2 – Chủ nhật
08:00 – 20:00
```

The two lines should be clearly grouped as the primary schedule.

Do not collapse into:

```text
Thứ 2 - Chủ nhật 08:00 - 20:00
```

if that weakens the screenshot hierarchy.

---

# 17. Strapi CMS Contract

## 17.1 Recommended Contact Page Model

```text
Contact Page
└── Hero
    ├── title
    ├── subtitle
    ├── description
    ├── heroImage
    └── contactData / clinicLocation
```

---

# 17.2 Recommended Page-Specific Fields

| Field         | Type       | Required |
| ------------- | ---------- | -------: |
| `title`       | Short text |      Yes |
| `subtitle`    | Short text |      Yes |
| `description` | Long text  |      Yes |
| `heroImage`   | Media      |      Yes |

Contact business information should preferably come from canonical shared data.

---

# 17.3 Recommended Canonical Clinic Model

If one clinic:

```text
ClinicSettings
├── hotline
├── hotlineDescription
├── address
├── email
├── emailDescription
├── openingDays
├── openingHours
└── ...
```

If multiple branches:

```text
ClinicLocation
├── name
├── hotline
├── address
├── email
├── openingHours
└── ...
```

Then:

```text
Contact Page
└── clinicLocation → relation
```

---

# 18. Do Not Store Contact Cards as Arbitrary Generic Blocks

Avoid unnecessarily generic CMS data such as:

```text
contactCards[]
├── randomIcon
├── title
├── content
└── link
```

if these four semantics are stable.

A more robust structure is:

```text
hotline
address
email
openingHours
```

because each field has distinct meaning and can be reused elsewhere.

Frontend maps:

```text
hotline      → phone icon
address      → location icon
email        → envelope icon
openingHours → clock icon
```

---

# 19. Shared Contact Data

The Contact page should become a strong candidate for the canonical contact-data source.

Recommended:

```text
ClinicLocation / ClinicSettings
        │
        ├── Contact Hero
        ├── Homepage Booking
        ├── About Booking
        ├── Footer
        └── Contact Details
```

This avoids inconsistent business information across the site.

---

# 20. Content Conflict Rule

Earlier supplied designs contain several different clinic addresses/contact values.

Do **not** silently overwrite them with the values from this Contact screenshot.

Possible explanations include:

* placeholder designs,
* different branches,
* localization variations.

If multiple branches are real:

```text
ClinicLocation
```

should model them explicitly.

If there is only one production clinic, Product must select the canonical contact dataset.

---

# 21. Visual Specification

## Colors

| Token                           | Usage          |
| ------------------------------- | -------------- |
| `color/contact/heading`         | Deep navy      |
| `color/contact/subtitle`        | Bright blue    |
| `color/contact/body`            | Muted navy     |
| `color/contact/card`            | White          |
| `color/contact/card-border`     | Pale blue      |
| `color/contact/icon-background` | Very pale blue |
| `color/contact/icon`            | Bright blue    |
| `color/contact/value-highlight` | Bright blue    |
| `color/contact/breadcrumb`      | Muted navy     |

---

# 21.1 Typography

| Element             | Approximate desktop specification |
| ------------------- | --------------------------------- |
| H1                  | `54–64 px`, bold                  |
| Subtitle            | `27–32 px`, semibold              |
| Intro paragraph     | `15–17 px`, regular/medium        |
| Card label          | `14–16 px`, semibold              |
| Highlight value     | `22–28 px`, semibold/bold         |
| Standard card value | `14–16 px`                        |
| Supporting text     | `12–14 px`                        |
| Breadcrumb          | `13–15 px`                        |

Use global site typography tokens rather than introducing Contact-specific font families.

---

# 22. Component Contract

Recommended frontend:

```text
ContactHeroSection
├── Breadcrumb
├── ContactHeroIntro
├── ContactHeroImage
└── ContactInfoGrid
    ├── ContactInfoCard variant="hotline"
    ├── ContactInfoCard variant="address"
    ├── ContactInfoCard variant="email"
    └── ContactInfoCard variant="opening-hours"
```

Reusable:

| Component         | Responsibility               |
| ----------------- | ---------------------------- |
| `Breadcrumb`      | Page hierarchy               |
| `ContactInfoCard` | Shared contact card geometry |
| `ContactIcon`     | Semantic icon mapping        |
| `ClinicImage`     | Hero media                   |

---

# 23. Responsive Specification

## Desktop

Required:

```text
TEXT | IMAGE

[ Hotline ][ Address ][ Email ][ Hours ]
```

---

## Tablet

Exact design unknown.

Reasonable structural fallback:

```text
TEXT
IMAGE

[ Hotline ][ Address ]
[ Email   ][ Hours   ]
```

but this is `INFERRED`, not an approved pixel specification.

---

## Mobile

Likely structure:

```text
Breadcrumb
↓
Title
Subtitle
Description
↓
Image
↓
Hotline
Address
Email
Opening Hours
```

Exact responsive design must be confirmed separately.

---

# 23.1 No Carousel

Contact information cards should remain a grid/stack.

Do not turn them into a slider on desktop.

---

# 24. Interaction Specification

Baseline visual behavior:

* hero text = static,
* hero image = static,
* address card = static unless a map destination is defined,
* hours = static.

Potentially interactive:

* Hotline → telephone link,
* Email → mail link,
* Breadcrumb Home → Homepage.

Do not add:

* hover lift,
* card color transitions,
* animation counters,
* appointment modal

unless separately specified.

---

# 25. Semantic HTML & Accessibility

## H1

Use:

```text
Liên hệ Smilux
```

as logical page H1.

---

## Breadcrumb

Use proper breadcrumb navigation semantics.

---

## Contact Data

Recommended semantic handling:

```text
Hotline → tel link
Email   → mailto link
Address → address/contact markup where appropriate
```

---

## Icon Accessibility

Icons are supplementary because each card already has visible labels.

Therefore they can generally be marked decorative.

---

## Hero Image

Use meaningful alternative text where appropriate, e.g.:

```text
Bác sĩ Smilux tư vấn kế hoạch điều trị nha khoa cho bệnh nhân
```

---

# 26. Implementation Constraints

1. Create `contact-hero` as the first Contact-page content section.
2. Reuse global `SiteHeader`.
3. Preserve the existing Contact route from the codebase.
4. `CONTACT` active state must derive from router state.
5. Render the breadcrumb at upper-left.
6. Desktop hero top uses text-left / image-right.
7. H1 is `Liên hệ Smilux`.
8. Subtitle is blue and remains separate from H1.
9. Hero image remains a real CMS media asset.
10. Preserve large image radius.
11. Render four independent contact cards beneath the hero.
12. Desktop contact grid uses four columns.
13. Preserve Phone / Location / Email / Clock icon mapping.
14. Keep icons frontend-controlled.
15. Contact values remain real text, not image content.
16. Prefer canonical `ClinicSettings` / `ClinicLocation` data.
17. Do not duplicate contact values arbitrarily across pages.
18. Do not invent carousel behavior.
19. Do not add unsupported hover animation.
20. Frontend owns geometry/icon rendering; Strapi owns editable page/contact data.

---

# 27. Visual Acceptance Criteria

## Breadcrumb

* [ ] `Trang chủ` appears.
* [ ] Chevron separator appears.
* [ ] `Liên hệ` appears as current page.
* [ ] Home uses existing route.

## Intro

* [ ] `Liên hệ Smilux` renders as large H1.
* [ ] Blue subtitle appears directly beneath.
* [ ] Intro paragraph matches approved Vietnamese copy.
* [ ] Content remains left aligned.

## Hero Image

* [ ] Clinic image appears on right.
* [ ] Image has large rounded corners.
* [ ] Smilux branding remains visible.
* [ ] Dentist and patient remain visible.
* [ ] Diagnostic monitor remains visible.
* [ ] Image does not distort.

## Contact Cards

* [ ] Four cards visible in one desktop row.
* [ ] All cards have white surfaces.
* [ ] Pale-blue borders.
* [ ] Rounded corners.
* [ ] Consistent card height.
* [ ] Icon on left.
* [ ] Content on right.

## Hotline

* [ ] Phone icon.
* [ ] `Hotline`.
* [ ] `1800 8888`.
* [ ] `Tư vấn & đặt lịch miễn phí 24/7`.

## Address

* [ ] Location icon.
* [ ] `Địa chỉ`.
* [ ] Full multi-line address visible.

## Email

* [ ] Email icon.
* [ ] `Email`.
* [ ] `info@smiluxdental.vn`.
* [ ] `Phản hồi trong 30 phút`.

## Opening Hours

* [ ] Clock icon.
* [ ] `Giờ làm việc`.
* [ ] `Thứ 2 – Chủ nhật`.
* [ ] `08:00 – 20:00`.

---

# 28. Strapi Handoff Summary

Recommended:

```text
Contact Page
└── Hero
    ├── title
    │   └── Liên hệ Smilux
    │
    ├── subtitle
    │   └── Tư vấn – Đặt lịch – Hỗ trợ điều trị Implant
    │
    ├── description
    ├── heroImage
    │
    └── clinicLocation
          ↓ relation
        ClinicLocation
```

Canonical:

```text
ClinicLocation
├── hotline
├── hotlineDescription
├── address
├── email
├── emailDescription
├── openingDays
└── openingHours
```

Frontend converts this structured data into the four visual contact cards.

---

# 29. Data-to-UI Mapping

```text
ClinicLocation.hotline
ClinicLocation.hotlineDescription
        ↓
Hotline Card
```

```text
ClinicLocation.address
        ↓
Address Card
```

```text
ClinicLocation.email
ClinicLocation.emailDescription
        ↓
Email Card
```

```text
ClinicLocation.openingDays
ClinicLocation.openingHours
        ↓
Opening Hours Card
```

This avoids storing card-layout presentation logic inside CMS.

---

# 30. Desktop Handoff

```text
Trang chủ  >  Liên hệ


Liên hệ Smilux                              ┌───────────────────────────────┐
Tư vấn – Đặt lịch –                        │                               │
Hỗ trợ điều trị Implant                    │       DENTAL CLINIC           │
                                           │       CONSULTATION            │
Intro paragraph...                         │           IMAGE               │
Intro paragraph...                         │                               │
                                           └───────────────────────────────┘


┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│ ○ Hotline           │ │ ○ Địa chỉ           │ │ ○ Email             │ │ ○ Giờ làm việc      │
│   1800 8888         │ │   Address...        │ │   info@...          │ │   Thứ 2 - Chủ nhật  │
│   Support text      │ │                     │ │   Response note     │ │   08:00 - 20:00     │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

---

# 31. Mandatory Coding-Agent Rules

1. Implement `contact-hero` as the first content section of the existing Contact page.
2. Reuse global `SiteHeader`; do not build a Contact-only header.
3. Preserve existing Contact route.
4. Add breadcrumb `Trang chủ > Liên hệ`.
5. Desktop upper layout is **text left / clinic image right**.
6. Render `Liên hệ Smilux` as H1.
7. Keep `Tư vấn – Đặt lịch – Hỗ trợ điều trị Implant` as a separate blue subtitle.
8. Keep description as editable text.
9. Use one real CMS image for the right clinic visual.
10. Below the hero, render **4 independent information cards**:

    * Hotline,
    * Địa chỉ,
    * Email,
    * Giờ làm việc.
11. Desktop baseline uses **4 columns × 1 row**.
12. Do not turn these cards into a carousel.
13. Use semantic frontend icon mapping:

    * phone,
    * location,
    * email,
    * clock.
14. Do not expose arbitrary icon uploads unless required by the existing architecture.
15. Prefer canonical `ClinicSettings` or `ClinicLocation` data.
16. Keep hotline/address/email/hours as structured CMS fields rather than card-image content.
17. Do not silently reconcile conflicting contact values from other design screenshots.
18. If multiple branches exist, model them as `ClinicLocation` records.
19. Strapi controls text/media/business data; frontend controls breadcrumb, layout, card geometry, icons and responsive presentation.
