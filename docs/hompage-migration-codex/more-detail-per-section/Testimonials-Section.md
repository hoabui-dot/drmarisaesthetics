# UI Implementation Spec — Homepage Customer Evaluation / Testimonials Section

## 1. Identity

| Field                             | Value                                                                                                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Route                             | `/`                                                                                                                                                                                                          |
| Section ID                        | `home-testimonials`                                                                                                                                                                                          |
| Section name                      | `Homepage Customer Evaluation / Testimonials`                                                                                                                                                                |
| Position in page                  | Immediately after `home-results`                                                                                                                                                                             |
| Screenshot scope                  | Complete desktop testimonial section visible in supplied screenshot                                                                                                                                          |
| Target screenshot                 | `1458 × 410 px`                                                                                                                                                                                              |
| Section type                      | Customer testimonial / patient evaluation presentation with testimonial cards and pagination indicator                                                                                                       |
| Desktop visible testimonial cards | `3`                                                                                                                                                                                                          |
| Primary implementation goal       | Reproduce the three-card patient testimonial composition, large right-side patient visual, rating presentation, and slider/pagination structure while keeping testimonial data manageable through Strapi CMS |
| Overall evidence quality          | High for desktop composition and card anatomy; Medium for carousel behavior; Low for tablet/mobile behavior                                                                                                  |

> **Critical visual rule:** The large smiling-patient visual on the right is **not another testimonial card**. It is a separate section-level media composition occupying the right side of the section.

> **Critical CMS rule:** Each testimonial must remain one atomic CMS record containing rating, review copy, patient identity fields, avatar and location. Do not store ratings, quotes, avatars and patient names in independent arrays.

> **Slider note:** Three pagination dots are visible beneath the testimonial cards. This provides evidence of multiple testimonial states/pages, but the exact paging model, autoplay behavior and number of testimonials per page remain **UNKNOWN** until confirmed.

---

# 2. Scope Boundary

## Included in this spec

* OBSERVED — Section eyebrow:

  * `PATIENTS LOVE SMILUX`
* OBSERVED — Section heading:

  * `What Our Patients Say`
* OBSERVED — Three testimonial cards visible simultaneously on desktop.
* OBSERVED — Each card contains:

  * five-star rating,
  * testimonial quote,
  * patient avatar,
  * patient name,
  * patient location.
* OBSERVED — First card also contains a large decorative quotation-mark element near the upper-left.
* OBSERVED — Pagination indicator with three dots below card area.
* OBSERVED — First pagination dot is active blue.
* OBSERVED — Remaining dots use a pale inactive color.
* OBSERVED — Large smiling female patient image on right.
* OBSERVED — Right-side patient visual spans most of the section height.
* OBSERVED — Left testimonial area sits on a white / very pale blue section surface.
* INFERRED — Testimonial content is likely carousel/slider driven due to pagination indicators.
* INFERRED — Right-side patient image is section-level content rather than being tied to an individual testimonial.
* INFERRED — Testimonial records should be ordered in Strapi.

## Excluded from this spec

* UNKNOWN — Carousel autoplay.
* UNKNOWN — Previous/next arrows.
* UNKNOWN — Horizontal swipe.
* UNKNOWN — Number of testimonials per pagination page.
* UNKNOWN — Total number of testimonials.
* UNKNOWN — Whether dots represent:

  * pages,
  * individual testimonial groups,
  * slides.
* UNKNOWN — Dot click behavior.
* UNKNOWN — card hover effect.
* UNKNOWN — testimonial detail page.
* UNKNOWN — external review provider link.
* UNKNOWN — whether ratings are imported from Google/Facebook/another platform.
* UNKNOWN — whether right-side patient image changes with carousel.
* UNKNOWN — tablet layout.
* UNKNOWN — mobile layout.

---

# 3. Evidence and Confidence

| Item                            | Status   | Evidence / reason                                                                  |
| ------------------------------- | -------- | ---------------------------------------------------------------------------------- |
| Section desktop layout          | OBSERVED | Clear left testimonial content + right patient image                               |
| Three visible cards             | OBSERVED | Exactly three complete cards visible                                               |
| Five-star presentation          | OBSERVED | Five gold stars visible in each card                                               |
| Patient avatar/name/location    | OBSERVED | Visible in all three cards                                                         |
| Pagination dots                 | OBSERVED | Three dots visible below testimonials                                              |
| Carousel behavior               | INFERRED | Pagination commonly indicates slider states, but movement is not visible           |
| Pagination count = total slides | UNKNOWN  | Three dots do not prove three total individual testimonials                        |
| Right image section-level       | INFERRED | Large image occupies independent right visual region                               |
| Exact typography                | INFERRED | Relative hierarchy visible, source tokens unavailable                              |
| Exact background implementation | INFERRED | Pale blue/white fade visible; unclear whether gradient or source image composition |
| Responsive behavior             | UNKNOWN  | Only desktop screenshot provided                                                   |

---

# 4. OCR Content Inventory

## 4.1 Section-level copy

| Element ID             | Visible text            | Type    | Confidence |
| ---------------------- | ----------------------- | ------- | ---------- |
| `testimonials-eyebrow` | `PATIENTS LOVE SMILUX`  | Eyebrow | High       |
| `testimonials-heading` | `What Our Patients Say` | H2      | High       |

---

## 4.2 Testimonial 01

| Element ID                | Visible text                                                                                | Type             | Confidence |
| ------------------------- | ------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| `testimonial-01-rating`   | `★★★★★`                                                                                     | Rating           | High       |
| `testimonial-01-quote`    | `"The doctors and staff are very professional and caring. I'm so happy with my new smile!"` | Testimonial      | High       |
| `testimonial-01-name`     | `Jennifer L.`                                                                               | Patient name     | High       |
| `testimonial-01-location` | `Vietnam`                                                                                   | Patient location | High       |

### Visual notes

* Large blue opening quotation mark appears at upper-left of card.
* Five gold stars appear near upper portion.
* Avatar appears at lower-left.
* Patient identity appears immediately right of avatar.

---

## 4.3 Testimonial 02

| Element ID                | Visible text                                                              | Type             | Confidence |
| ------------------------- | ------------------------------------------------------------------------- | ---------------- | ---------- |
| `testimonial-02-rating`   | `★★★★★`                                                                   | Rating           | High       |
| `testimonial-02-quote`    | `"The clinic is modern, clean and very comfortable. Highly recommended!"` | Testimonial      | High       |
| `testimonial-02-name`     | `David M.`                                                                | Patient name     | High       |
| `testimonial-02-location` | `Australia`                                                               | Patient location | High       |

---

## 4.4 Testimonial 03

| Element ID                | Visible text                                                             | Type             | Confidence |
| ------------------------- | ------------------------------------------------------------------------ | ---------------- | ---------- |
| `testimonial-03-rating`   | `★★★★★`                                                                  | Rating           | High       |
| `testimonial-03-quote`    | `"I had my implant done here and the result is beyond my expectations."` | Testimonial      | High       |
| `testimonial-03-name`     | `Sophie K.`                                                              | Patient name     | High       |
| `testimonial-03-location` | `Korea`                                                                  | Patient location | High       |

---

# 5. Layout Anatomy

## 5.1 Global geometry

| Property                  | Specification                                                  | Status              |
| ------------------------- | -------------------------------------------------------------- | ------------------- |
| Section width             | Full viewport width                                            | OBSERVED            |
| Screenshot width          | `1458 px`                                                      | OBSERVED            |
| Screenshot height         | `410 px`                                                       | OBSERVED            |
| Section composition       | Testimonial region left + patient visual right                 | OBSERVED            |
| Left region               | Approximately `68–70%` of viewport                             | INFERRED            |
| Right image region        | Approximately `30–32%`                                         | INFERRED            |
| Background                | White / pale blue with soft image/fade transition toward right | OBSERVED / INFERRED |
| Desktop testimonial count | `3` complete cards                                             | OBSERVED            |
| Cards                     | Equal or near-equal width                                      | OBSERVED            |
| Pagination                | Centered under testimonial-card region                         | OBSERVED            |
| Right visual              | Flush toward right edge                                        | OBSERVED            |

---

# 5.2 Structure tree

```text
Section: home-testimonials
├── Background / Section Surface
│
├── TestimonialsRegion
│   ├── HeadingGroup
│   │   ├── Eyebrow
│   │   └── H2
│   │
│   ├── TestimonialsViewport
│   │   └── TestimonialsTrack / Group
│   │       ├── TestimonialCard 01
│   │       │   ├── QuoteDecoration
│   │       │   ├── Rating
│   │       │   ├── Quote
│   │       │   └── PatientIdentity
│   │       │       ├── Avatar
│   │       │       ├── Name
│   │       │       └── Location
│   │       │
│   │       ├── TestimonialCard 02
│   │       └── TestimonialCard 03
│   │
│   └── PaginationDots
│       ├── Dot Active
│       ├── Dot
│       └── Dot
│
└── SectionPatientVisual
    └── Large smiling-patient image
```

---

# 5.3 Desktop topology

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  PATIENTS LOVE SMILUX                                                        │
│  What Our Patients Say                                                       │
│                                                                              │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐                   │
│  │ “  ★★★★★      │ │    ★★★★★      │ │    ★★★★★      │                   │
│  │                │ │                │ │                │                   │
│  │ Testimonial    │ │ Testimonial    │ │ Testimonial    │   LARGE PATIENT   │
│  │ quote          │ │ quote          │ │ quote          │      IMAGE        │
│  │                │ │                │ │                │                   │
│  │ ● Name         │ │ ● Name         │ │ ● Name         │                   │
│  │   Location     │ │   Location     │ │   Location     │                   │
│  └────────────────┘ └────────────────┘ └────────────────┘                   │
│                                                                              │
│                         ●  ○  ○                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 5.4 Left testimonial region

The testimonial content area contains:

1. Section heading.
2. One horizontal row of three testimonial cards.
3. Pagination underneath.

### Desktop rules

* Three cards remain fully visible.
* Cards should not intentionally expose a partial fourth card in the reference desktop layout.
* Gaps between cards are visually consistent.
* Cards share the same basic geometry.
* Pagination centers relative to testimonial area, **not** the entire viewport including right-side patient image.

---

# 5.5 Right patient visual

The large image:

* occupies the complete right portion of the section,
* starts at the top edge of the screenshot,
* extends nearly to the bottom edge,
* shows a smiling woman from chest/shoulders upward,
* uses a pale neutral/light background,
* visually blends into the left section surface.

### Important

Do not implement this as:

```text
TestimonialCard 04
```

It is a different visual role.

Recommended hierarchy:

```text
home-testimonials
├── testimonials
└── sectionImage
```

not:

```text
testimonials[]
├── Jennifer
├── David
├── Sophie
└── LargePatientImage
```

---

# 6. Testimonial Card Specification

## 6.1 Card geometry

| Property          | Specification                                                | Status              |
| ----------------- | ------------------------------------------------------------ | ------------------- |
| Surface           | White / near-white                                           | OBSERVED            |
| Border            | Very light pale-blue / gray boundary                         | OBSERVED / INFERRED |
| Radius            | Moderate rounded corners, approximately `10–14 px estimated` | INFERRED            |
| Shadow            | Soft/subtle                                                  | OBSERVED / INFERRED |
| Height            | Equal across visible cards                                   | OBSERVED            |
| Width             | Equal or near-equal                                          | OBSERVED            |
| Content alignment | Primarily left aligned                                       | OBSERVED            |
| Internal padding  | Medium                                                       | INFERRED            |

---

# 6.2 Card hierarchy

```text
TestimonialCard
├── TopArea
│   ├── OptionalLargeQuoteDecoration
│   └── StarRating
│
├── Quote
│
└── PatientIdentity
    ├── Avatar
    └── IdentityText
        ├── Name
        └── Location
```

---

# 6.3 Star rating

* Five gold/orange stars.
* Same visual size in each card.
* Arranged horizontally.
* Positioned near top.
* Rating must not be represented by image text alone.

### Important CMS/data distinction

Store:

```text
rating = 5
```

not:

```text
stars = "★★★★★"
```

Frontend owns visual star rendering.

This allows the component to represent future values such as:

* 4,
* 4.5,
* 5

if Product supports them.

However, fractional-star behavior is currently UNKNOWN.

---

# 6.4 Quote decoration

The first card contains a large blue opening quotation symbol.

It is unclear whether:

* only the first visible card uses this decoration,
* every card has the decoration but cards 2/3 place it differently,
* it is a section-level decorative element overlapping Card 1.

Status: `UNKNOWN`.

Do not create a CMS `quoteIcon` field per testimonial.

The quote symbol should remain a frontend decorative asset.

---

# 6.5 Testimonial quote

* Main content area.
* Dark navy / muted dark text.
* Quotation marks appear in text.
* Center/left region of card.
* Must support multi-line wrapping.

Do not fix card height based on one exact review length without defining content constraints.

---

# 6.6 Patient identity block

Reference anatomy:

```text
   ┌──────┐
   │AVATAR│   Jennifer L.
   └──────┘   Vietnam
```

### Avatar

* Circular.
* Small relative to card.
* Real patient portrait.
* Located at lower-left.

### Patient name

* Stronger weight than location.
* Dark navy.

### Location

* Smaller/more muted.
* Appears directly below name.

---

# 7. Visual Specification

## 7.1 Colors

| Token candidate                         | Usage                  | Description            | Status   |
| --------------------------------------- | ---------------------- | ---------------------- | -------- |
| `color/testimonial/background`          | Section                | White / pale blue      | OBSERVED |
| `color/testimonial/heading`             | H2                     | Near-black / dark navy | OBSERVED |
| `color/testimonial/eyebrow`             | Eyebrow                | Muted blue             | OBSERVED |
| `color/testimonial/card-surface`        | Cards                  | White                  | OBSERVED |
| `color/testimonial/card-text`           | Review text            | Dark navy              | OBSERVED |
| `color/testimonial/name`                | Patient name           | Dark navy              | OBSERVED |
| `color/testimonial/location`            | Location               | Muted blue/gray        | OBSERVED |
| `color/testimonial/star`                | Rating stars           | Gold/orange            | OBSERVED |
| `color/testimonial/quote-mark`          | Large quotation symbol | Bright blue            | OBSERVED |
| `color/testimonial/pagination-active`   | Active dot             | Bright/deep blue       | OBSERVED |
| `color/testimonial/pagination-inactive` | Inactive dot           | Pale blue-gray         | OBSERVED |

---

# 7.2 Typography

| Element           | Weight              | Approx. size         | Status   |
| ----------------- | ------------------- | -------------------- | -------- |
| Eyebrow           | `500–600 estimated` | `12–14 px estimated` | INFERRED |
| H2                | `600–700 estimated` | `28–32 px estimated` | INFERRED |
| Testimonial quote | `400–500 estimated` | `13–15 px estimated` | INFERRED |
| Patient name      | `600–700 estimated` | `12–14 px estimated` | INFERRED |
| Location          | `400–500 estimated` | `11–13 px estimated` | INFERRED |

---

# 8. Asset Manifest

| Asset ID                            | Visible description                   | Recommended format      |         CMS? | Status   |
| ----------------------------------- | ------------------------------------- | ----------------------- | -----------: | -------- |
| `testimonial-section-patient-image` | Large smiling female patient on right | WebP/JPG/PNG            |          Yes | OBSERVED |
| `testimonial-jennifer-avatar`       | Jennifer patient avatar               | WebP/JPG/PNG            |          Yes | OBSERVED |
| `testimonial-david-avatar`          | David patient avatar                  | WebP/JPG/PNG            |          Yes | OBSERVED |
| `testimonial-sophie-avatar`         | Sophie patient avatar                 | WebP/JPG/PNG            |          Yes | OBSERVED |
| `testimonial-star`                  | Rating star                           | SVG/design-system icon  | No preferred | OBSERVED |
| `testimonial-quote-mark`            | Large quotation symbol                | SVG/CSS/text decoration | No preferred | OBSERVED |

### Asset rules

* Large right-side patient image is independent from testimonial avatars.
* Do not use the large image as an avatar.
* Do not flatten three cards + right image into one banner.
* Testimonial copy remains editable CMS text.
* Patient avatars remain individual assets.
* Use appropriate object positioning on the large patient visual.

---

# 9. Strapi CMS Contract

## 9.1 Recommended section model

```text
Homepage
└── Customer Evaluation Section
    ├── eyebrow
    ├── heading
    ├── sectionImage
    └── testimonials[]
        ├── rating
        ├── quote
        ├── patientName
        ├── patientLocation
        ├── patientAvatar
        └── avatarAlt
```

---

# 9.2 Section-level fields

| Field             | Type                            |    Required | Example                        |
| ----------------- | ------------------------------- | ----------: | ------------------------------ |
| `eyebrow`         | Short text                      |         Yes | `PATIENTS LOVE SMILUX`         |
| `heading`         | Short text                      |         Yes | `What Our Patients Say`        |
| `sectionImage`    | Media                           |         Yes | Large right-side patient image |
| `sectionImageAlt` | Short text                      | Recommended | Accessibility                  |
| `testimonials`    | Repeatable component / relation |         Yes | Patient review records         |

---

# 9.3 Testimonial component

Recommended component name:

```text
patient-testimonial
```

Fields:

| Field              | Type              |    Required | Notes                                |
| ------------------ | ----------------- | ----------: | ------------------------------------ |
| `rating`           | Decimal / integer |         Yes | Current screenshot = `5`             |
| `quote`            | Long text         |         Yes | Review content                       |
| `patientName`      | Short text        |         Yes | e.g. `Jennifer L.`                   |
| `patientLocation`  | Short text        | Recommended | e.g. `Vietnam`                       |
| `patientAvatar`    | Media             | Recommended | Circular avatar                      |
| `patientAvatarAlt` | Short text        | Recommended | Accessibility                        |
| `sortOrder`        | Integer           |    Optional | Only if CMS ordering is insufficient |

---

# 9.4 Atomic testimonial rule

Incorrect:

```text
ratings[]
quotes[]
patientNames[]
avatars[]
locations[]
```

This can produce:

```text
Jennifer's quote
+
David's avatar
+
Sophie's location
```

Correct:

```text
testimonials[]
└── Testimonial
    ├── rating
    ├── quote
    ├── patient
    ├── location
    └── avatar
```

One patient evaluation is one CMS record.

---

# 9.5 Canonical collection option

If testimonials are also used on:

* dedicated Reviews page,
* individual service pages,
* landing pages,

prefer a canonical collection:

```text
Patient Testimonial Collection
├── Jennifer L.
├── David M.
├── Sophie K.
└── ...

Homepage Testimonials Section
└── featuredTestimonials[]
        ↓ relation
    Patient Testimonial
```

This prevents duplicated review content.

---

# 10. Carousel / Pagination Specification

## 10.1 Visible evidence

Screenshot displays:

```text
●  ○  ○
```

This indicates multiple states/pages.

However the exact model is not proven.

Potential implementations include:

### Model A — Page of three testimonials

```text
Page 1 → Testimonials 1–3
Page 2 → Testimonials 4–6
Page 3 → Testimonials 7–9
```

### Model B — Sliding window

```text
State 1 → 1,2,3
State 2 → 2,3,4
State 3 → 3,4,5
```

### Model C — Another CMS grouping

UNKNOWN.

Do not decide between these models from the screenshot alone.

---

# 10.2 Pagination visual

| Property              | Specification        | Status   |
| --------------------- | -------------------- | -------- |
| Count visible         | `3` dots             | OBSERVED |
| Active state          | First dot            | OBSERVED |
| Active color          | Blue                 | OBSERVED |
| Inactive color        | Pale blue-gray       | OBSERVED |
| Alignment             | Centered below cards | OBSERVED |
| Dot spacing           | Small/consistent     | OBSERVED |
| Outer control surface | None                 | OBSERVED |

---

# 10.3 Autoplay

UNKNOWN.

Do not automatically add autoplay simply because pagination dots are present.

If Product later requests automatic testimonial rotation:

* slow timing is recommended,
* pause/focus accessibility requirements must be handled,
* cards should not change while a keyboard user is interacting with them.

But this behavior is **not currently specified**.

---

# 10.4 Pagination source of truth

Do not hard-code:

```text
3 dots
```

unless Product confirms exactly three pages.

Frontend should derive dot count from actual carousel grouping if testimonial count is dynamic.

---

# 11. Large Right-Side Patient Visual

## 11.1 Rendering role

Recommended:

```text
Section
├── testimonial content
└── decorative/supporting patient image
```

The image can be implemented as:

* an independent `<img>`-like content/media layer,
* or a section media wrapper.

Do not treat the patient visual as part of the cards carousel unless Product explicitly confirms that it changes per testimonial page.

---

# 11.2 Geometry

| Property              | Specification                                      | Status                            |
| --------------------- | -------------------------------------------------- | --------------------------------- |
| Position              | Right edge                                         | OBSERVED                          |
| Height                | Nearly full section height                         | OBSERVED                          |
| Width                 | ~30% viewport estimated                            | INFERRED                          |
| Crop                  | Portrait-oriented crop inside broad section region | OBSERVED                          |
| Focal point           | Face/upper torso                                   | OBSERVED                          |
| Background transition | Soft blend into left section                       | OBSERVED / implementation UNKNOWN |

---

# 11.3 Background/fade

The screenshot appears to use a pale blue/white transition behind the large patient image.

Possible implementation:

* fade built into the image,
* gradient overlay,
* background image treatment.

Status: `UNKNOWN`.

Do not layer an additional strong gradient until the original source asset is inspected.

---

# 12. Component Contract

| Component                 | Responsibility                          | Reusable?        | Status   |
| ------------------------- | --------------------------------------- | ---------------- | -------- |
| `HomeTestimonialsSection` | Entire section                          | No               | INFERRED |
| `TestimonialsHeader`      | Eyebrow + heading                       | Potentially      | INFERRED |
| `TestimonialsCarousel`    | Visible testimonial grouping/pagination | Yes              | INFERRED |
| `TestimonialCard`         | One patient review                      | Yes              | OBSERVED |
| `StarRating`              | Rating rendering                        | Yes              | OBSERVED |
| `PatientIdentity`         | Avatar/name/location                    | Yes              | INFERRED |
| `PaginationDots`          | Carousel pagination                     | Yes              | OBSERVED |
| `TestimonialsHeroImage`   | Large right section media               | Section-specific | INFERRED |

---

# 13. Dynamic Data Behavior

## 13.1 Desktop visible count

Reference desktop:

```text
visibleTestimonials = 3
```

This should be a frontend layout rule.

Do not make CMS editors manually choose:

```text
cardsPerRow = 3
```

unless the site builder explicitly supports layout variants.

---

# 13.2 More than three testimonials

If there are additional records:

```text
testimonials.length > 3
```

the additional entries should participate in the confirmed carousel mechanism.

Do not shrink all cards to show every testimonial simultaneously.

---

# 13.3 Fewer than three testimonials

Behavior is currently UNKNOWN.

Recommended general principle:

* render only actual testimonials,
* do not duplicate testimonials,
* do not render empty placeholders.

Exact alignment for 1–2 cards requires design confirmation.

---

# 13.4 Rating validation

Recommended CMS constraint:

```text
0 <= rating <= 5
```

If only full stars are supported:

```text
rating = integer
```

If half-stars are required later:

```text
rating = decimal
```

Current screenshot only demonstrates:

```text
rating = 5
```

Do not assume half-star UI without product evidence.

---

# 14. Interaction States

| Element          | Default           | Hover   | Click                          | Status              |
| ---------------- | ----------------- | ------- | ------------------------------ | ------------------- |
| Testimonial card | White static card | UNKNOWN | UNKNOWN                        | OBSERVED            |
| Pagination dot   | Active/inactive   | UNKNOWN | UNKNOWN but likely interactive | OBSERVED / INFERRED |
| Patient avatar   | Static            | UNKNOWN | UNKNOWN                        | OBSERVED            |
| Right image      | Static            | N/A     | N/A                            | OBSERVED            |

### Constraints

Do not introduce:

* card hover elevation,
* review modal,
* avatar link,
* Google Review redirect,
* star animation,
* autoplay,

without further requirement.

---

# 15. Responsive Specification

## 15.1 Evidence available

| Viewport | Evidence |
| -------- | -------- |
| Desktop  | High     |
| Tablet   | UNKNOWN  |
| Mobile   | UNKNOWN  |

---

# 15.2 Required desktop behavior

* Three complete testimonial cards visible.
* Large patient image remains on right.
* Pagination stays under cards.
* Heading stays above card row.
* Cards remain equal or near-equal width/height.
* Right image does not overlap testimonial text.

---

# 15.3 Mobile possibilities

Possible responsive architecture:

```text
Heading
↓
Testimonials
↓
Pagination
↓
Patient Image
```

or:

```text
Heading
↓
1-card carousel
↓
Pagination
↓
Patient visual
```

Both are plausible but unsupported.

Do not define:

```text
mobile = 1 testimonial
tablet = 2 testimonials
```

as final requirements until mobile/tablet design exists.

---

# 15.4 CMS invariance

Do not create:

```text
desktopTestimonials[]
mobileTestimonials[]
```

Same testimonial dataset should render responsively unless Product explicitly requires different editorial selections.

---

# 16. Semantic HTML and Accessibility

## Recommended structure

* Section landmark associated with H2.
* Testimonial cards may use semantic quote/article groupings.
* Patient quote should remain real text.
* Patient identity remains accessible text.
* Star rating requires screen-reader representation.
* Pagination controls require proper button semantics if interactive.

### Star-rating accessibility

Do not rely on five star icons alone.

Screen reader should receive equivalent information such as:

```text
Rated 5 out of 5
```

Decorative stars can then be hidden from redundant announcement.

---

## Testimonial quote

If semantically appropriate, the testimonial can use quotation semantics.

Patient identity can serve as quote attribution.

---

## Pagination

If dots are clickable:

* use semantic buttons,
* give each an accessible name,
* expose active/current state.

Example conceptual label:

```text
Go to testimonial page 2
```

Do not implement pagination dots as clickable `div` elements.

---

## Large right-side image

If purely decorative/supporting:

* empty alt is acceptable.

If representing a meaningful patient story:

* provide purposeful alt.

Its exact semantic role must be determined with Product.

---

# 17. Implementation Constraints

## Section

* Position after `home-results`.
* Keep pale/light background.
* Preserve independent large right-side patient visual.
* Do not convert right image into fourth testimonial card.

## Testimonial cards

* Desktop reference displays three.
* Keep consistent geometry.
* Maintain equal visual card height.
* Use actual text/avatar fields.
* Rating must be structured data.
* Do not bake stars or patient identity into card image.

## CMS

* One testimonial = one record.
* Keep rating, quote, name, location and avatar together.
* Use relation to canonical testimonial collection if reused elsewhere.
* Section image remains a separate section-level media field.
* Frontend owns carousel grouping and card count.

## Pagination

* Three dots are visible in screenshot.
* Do not hard-code total pagination count until content model is known.
* Do not infer autoplay.
* Do not add arrows unless another design shows them.

---

# 18. Visual Acceptance Criteria

## Section-level

* [ ] Section appears after `home-results`.
* [ ] `PATIENTS LOVE SMILUX` is visible.
* [ ] `What Our Patients Say` is visible.
* [ ] Desktop uses left testimonial region + right patient visual.
* [ ] Large patient image occupies approximately right third of section.
* [ ] Section retains soft white/pale-blue treatment.

## Cards

* [ ] Exactly three complete testimonial cards visible in reference desktop state.
* [ ] Cards use white surface.
* [ ] Cards have consistent radius.
* [ ] Cards have equal/near-equal dimensions.
* [ ] Five gold stars visible in each screenshot testimonial.
* [ ] Quotes render as real text.
* [ ] Patient avatar appears at card bottom.
* [ ] Patient name appears beside avatar.
* [ ] Location appears beneath name.
* [ ] Card 1 retains the visible large blue quotation-mark treatment if confirmed as global design behavior.

## Pagination

* [ ] Pagination is positioned below testimonial cards.
* [ ] Three dots appear in screenshot state.
* [ ] First dot is active blue.
* [ ] Other dots use pale inactive state.
* [ ] Pagination aligns relative to testimonial region rather than full section width.

## Large patient image

* [ ] Large smiling patient appears independently at right.
* [ ] Face is not cropped incorrectly.
* [ ] Image spans nearly complete section height.
* [ ] Image blends naturally with section surface.
* [ ] Right visual never appears as a testimonial card.

## CMS/data

* [ ] Jennifer quote stays paired with Jennifer avatar/name/location.
* [ ] David quote stays paired with David avatar/name/location.
* [ ] Sophie quote stays paired with Sophie avatar/name/location.
* [ ] Reordering a testimonial moves all its associated fields together.
* [ ] No independent rating/avatar arrays exist.

---

# 19. Visual Risks

| Risk                                         | Why it affects fidelity/data integrity             | Mitigation                                 | Priority |
| -------------------------------------------- | -------------------------------------------------- | ------------------------------------------ | -------- |
| Treating right image as Card 4               | Completely changes section architecture            | Separate section-level media field         | High     |
| Separate quote/avatar/name arrays            | Patient data can become mismatched                 | Atomic testimonial record                  | High     |
| Hard-coded three pagination dots             | Breaks dynamic carousel                            | Derive from confirmed grouping/data        | High     |
| Assuming three dots = three testimonials     | Screenshot already displays 3 cards simultaneously | Confirm carousel model                     | High     |
| Adding autoplay without requirement          | Can reduce readability and accessibility           | Manual/static until approved               | High     |
| Partial fourth card                          | Changes desktop composition                        | Keep 3 full cards in reference viewport    | Medium   |
| Long reviews create uneven heights           | Card row becomes misaligned                        | Define content constraints / stable layout | Medium   |
| Using image-based stars                      | Rating becomes inaccessible/non-dynamic            | Store numeric rating                       | High     |
| Large patient image wrong crop               | Right visual dominates composition                 | Preserve face focal position               | High     |
| Strong artificial gradient over right visual | May double the source fade                         | Inspect original asset first               | Medium   |
| Card shadows too strong                      | Design becomes heavier than screenshot             | Keep effects subtle                        | Medium   |
| Duplicating testimonials to fill carousel    | Misrepresents customer feedback                    | Render genuine records only                | High     |

---

# 20. Open Questions

| ID  | Question                                                                                              | Blocking level                                   | Suggested owner     |
| --- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------- |
| Q1  | Do the three pagination dots represent three pages of testimonial cards or another slider model?      | Blocking for carousel implementation             | Designer / Product  |
| Q2  | How many testimonial cards belong to each pagination page?                                            | Blocking for carousel                            | Designer            |
| Q3  | Does the testimonial carousel autoplay?                                                               | Non-blocking; default should not assume autoplay | Designer            |
| Q4  | Are pagination dots clickable?                                                                        | Blocking for exact interaction                   | Designer            |
| Q5  | Is horizontal swipe supported on mobile?                                                              | Blocking for mobile interaction                  | Designer            |
| Q6  | Does the large right-side patient image stay constant while testimonial pages change?                 | Important                                        | Designer            |
| Q7  | Is the right image an independent decorative image or related to one testimonial record?              | Important CMS decision                           | Product / Designer  |
| Q8  | Is the blue quotation mark shown only on the first card or on the first card of every carousel state? | Non-blocking                                     | Designer            |
| Q9  | Can ratings be lower than 5 or use half-stars?                                                        | Data/model decision                              | Product             |
| Q10 | Are testimonials entered manually or sourced from an external review service?                         | Architecture decision                            | Product / Developer |
| Q11 | What should desktop do when fewer than three testimonials exist?                                      | Layout decision                                  | Designer            |
| Q12 | What is the tablet layout?                                                                            | Blocking for tablet                              | Designer            |
| Q13 | What is the mobile layout?                                                                            | Blocking for mobile                              | Designer            |

---

# Strapi Handoff Summary

## Recommended hierarchy

```text
Homepage
└── Customer Evaluation Section
    ├── eyebrow
    ├── heading
    │
    ├── sectionImage
    ├── sectionImageAlt
    │
    └── testimonials[]
        ├── rating
        ├── quote
        ├── patientName
        ├── patientLocation
        ├── patientAvatar
        └── patientAvatarAlt
```

---

# Atomic Testimonial Contract

```text
PatientTestimonial
│
├── rating
├── quote
│
└── patient
    ├── name
    ├── location
    └── avatar
```

One CMS record must produce one complete card.

Do not model:

```text
quotes[]
avatars[]
names[]
ratings[]
```

as separate collections.

---

# Desktop Layout Handoff

```text
                   TESTIMONIAL REGION                   PATIENT VISUAL

PATIENTS LOVE SMILUX
What Our Patients Say

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ ★ ★ ★ ★ ★       │ │ ★ ★ ★ ★ ★       │ │ ★ ★ ★ ★ ★       │
│                 │ │                 │ │                 │
│ Review          │ │ Review          │ │ Review          │      LARGE
│                 │ │                 │ │                 │      PATIENT
│ ● Name          │ │ ● Name          │ │ ● Name          │      IMAGE
│   Location      │ │   Location      │ │   Location      │
└─────────────────┘ └─────────────────┘ └─────────────────┘

                         ●  ○  ○
```

---

# CMS vs Frontend Responsibility

| Responsibility                  | Strapi | Frontend |
| ------------------------------- | :----: | :------: |
| Eyebrow                         |    ✅   |          |
| Heading                         |    ✅   |          |
| Large patient image             |    ✅   |          |
| Rating                          |    ✅   |          |
| Review copy                     |    ✅   |          |
| Patient name                    |    ✅   |          |
| Location                        |    ✅   |          |
| Avatar                          |    ✅   |          |
| Testimonial ordering            |    ✅   |          |
| Three-card desktop presentation |        |     ✅    |
| Card dimensions                 |        |     ✅    |
| Star rendering                  |        |     ✅    |
| Quote decoration                |        |     ✅    |
| Pagination dots                 |        |     ✅    |
| Active pagination state         |        |     ✅    |
| Carousel grouping               |        |     ✅    |
| Responsive behavior             |        |     ✅    |

---

# Mandatory Coding-Agent Rules

1. Create `home-testimonials` after `home-results`.
2. Desktop reference displays **3 complete testimonial cards**.
3. The large smiling-patient image on the right is **section-level media**, not Card 4.
4. One testimonial record contains:

   * rating,
   * quote,
   * patient name,
   * location,
   * avatar.
5. Render rating from structured numeric data.
6. Keep stars as frontend/design-system visuals.
7. Keep patient identity fields synchronized with their review.
8. Preserve three-dot pagination visual shown in reference, but do not assume its data model without confirmation.
9. Do not infer autoplay.
10. Do not add navigation arrows without design evidence.
11. Do not expose an intentional partial fourth card at the reference desktop viewport.
12. Strapi controls testimonial content/media/order; frontend controls card geometry, slider state, pagination and responsive behavior.
