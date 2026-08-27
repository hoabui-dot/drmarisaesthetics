# UI Implementation Spec — Homepage Dental Devices Slider Section

## 1. Identity

| Field                       | Value                                                                                                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | `/`                                                                                                                                                                         |
| Section ID                  | `home-devices`                                                                                                                                                              |
| Section name                | `Homepage Dental Devices Slider`                                                                                                                                            |
| Position in page            | Immediately after `home-technology`                                                                                                                                         |
| Screenshot scope            | Device-card carousel/slider section shown in supplied desktop screenshot                                                                                                    |
| Target viewport             | Desktop reference screenshot approximately `1519 × 465 px`                                                                                                                  |
| Section type                | Auto-playing horizontal device slider                                                                                                                                       |
| Desktop visible cards       | **4 complete cards simultaneously**                                                                                                                                         |
| Slide direction             | **Left → Right**                                                                                                                                                            |
| Autoplay speed              | Slow / continuous-feeling movement                                                                                                                                          |
| Background color            | **`rgb(3, 28, 80)`**                                                                                                                                                        |
| Background hex equivalent   | `#031C50`                                                                                                                                                                   |
| Primary implementation goal | Reproduce the four-card desktop presentation while supporting an automatically moving, CMS-driven, seamless device slider                                                   |
| Overall evidence quality    | High for card anatomy and desktop display count; High for user-specified slider behavior/background; Medium for exact typography/card measurements; Low for mobile behavior |

> **Critical slider rule:** On a fully sized desktop viewport, the section must display **exactly four complete cards in the visible slider area by default**.

> **Critical motion rule:** The device track automatically moves **slowly from left to right**. Motion should appear smooth and continuous rather than jumping aggressively between cards.

> **Critical CMS rule:** The cards are repeatable device entries managed in Strapi. Card content belongs to the CMS; autoplay behavior, visible-card count, responsive rules, geometry, movement direction and animation remain frontend responsibilities.

---

## 2. Scope Boundary

### Included in this spec

* USER-SPECIFIED — New homepage section directly after the Technology section.
* USER-SPECIFIED — Dark navy background:

  * `rgb(3, 28, 80)`
  * `#031C50`
* USER-SPECIFIED — Horizontal auto-slider.
* USER-SPECIFIED — Slow automatic movement.
* USER-SPECIFIED — Direction: left to right.
* USER-SPECIFIED — Four fully visible cards on full desktop.
* OBSERVED — Four device cards visible in reference:

  1. `3D Cone Beam CT`
  2. `Intraoral Scanner`
  3. `CAD/CAM Technology`
  4. `Laser Dental Care`
* OBSERVED — Every device card contains:

  * device image,
  * title,
  * short description.
* OBSERVED — White card surface.
* OBSERVED — Large rounded card corners.
* OBSERVED — Device media occupies approximately upper half of card.
* OBSERVED — Text occupies lower portion.
* INFERRED — Additional devices may exist outside the viewport and participate in slider loop.
* INFERRED — Cards should be rendered from an ordered CMS collection rather than hard-coded.

### Excluded from this spec

* UNKNOWN — Exact number of devices in production.
* UNKNOWN — Exact autoplay speed in seconds/pixels.
* UNKNOWN — Pause-on-hover behavior.
* UNKNOWN — Manual drag/swipe behavior.
* UNKNOWN — Navigation arrows.
* UNKNOWN — pagination dots.
* UNKNOWN — clickable device-card behavior.
* UNKNOWN — device-detail routes.
* UNKNOWN — mobile visible-card count.
* UNKNOWN — tablet visible-card count.
* UNKNOWN — whether slider pauses while page is not visible.
* UNKNOWN — whether movement should snap from card to card or behave as a continuous marquee.

---

## 3. Evidence and Confidence

| Item                      | Status                          | Evidence / reason                                                                         |
| ------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------- |
| Section background color  | USER-SPECIFIED                  | Exact RGB supplied by user.                                                               |
| Desktop four-card display | USER-SPECIFIED / OBSERVED       | Four full cards visible in supplied reference.                                            |
| Horizontal slider         | USER-SPECIFIED                  | Explicitly described as slide section.                                                    |
| Autoplay                  | USER-SPECIFIED                  | Explicit requirement.                                                                     |
| Slow speed                | USER-SPECIFIED                  | Explicit requirement.                                                                     |
| Direction                 | USER-SPECIFIED                  | Left → Right.                                                                             |
| Card anatomy              | OBSERVED                        | Repeated image/title/description structure.                                               |
| Card radius               | OBSERVED / INFERRED exact value | Clearly rounded; exact radius unavailable.                                                |
| Typography                | INFERRED                        | Hierarchy visible but exact tokens unavailable.                                           |
| Looping behavior          | INFERRED                        | Recommended for uninterrupted autoplay, but exact product behavior not explicitly stated. |
| Manual navigation         | UNKNOWN                         | No evidence in screenshot.                                                                |
| Responsive layout         | UNKNOWN                         | Only desktop screenshot supplied.                                                         |

---

## 4. OCR Content Inventory

### Device 01

| Element ID              | Visible text                                | Type             | OCR confidence |
| ----------------------- | ------------------------------------------- | ---------------- | -------------- |
| `device-01-title`       | `3D Cone Beam CT`                           | Card heading     | High           |
| `device-01-description` | `Accurate 3D imaging for precise diagnosis` | Card description | High           |

### Device 02

| Element ID              | Visible text                             | Type             | OCR confidence |
| ----------------------- | ---------------------------------------- | ---------------- | -------------- |
| `device-02-title`       | `Intraoral Scanner`                      | Card heading     | High           |
| `device-02-description` | `Digital impressions for better comfort` | Card description | High           |

### Device 03

| Element ID              | Visible text                              | Type             | OCR confidence |
| ----------------------- | ----------------------------------------- | ---------------- | -------------- |
| `device-03-title`       | `CAD/CAM Technology`                      | Card heading     | High           |
| `device-03-description` | `Precision smile design and restorations` | Card description | High           |

### Device 04

| Element ID              | Visible text                                | Type             | OCR confidence |
| ----------------------- | ------------------------------------------- | ---------------- | -------------- |
| `device-04-title`       | `Laser Dental Care`                         | Card heading     | High           |
| `device-04-description` | `Treatments with advanced laser technology` | Card description | High           |

---

## 5. Layout Anatomy

### 5.1 Global section geometry

| Property                      | Specification                     | Status                          |
| ----------------------------- | --------------------------------- | ------------------------------- |
| Section width                 | Full viewport width               | OBSERVED                        |
| Section background            | `rgb(3,28,80)` / `#031C50`        | USER-SPECIFIED                  |
| Main content                  | Horizontal card slider            | USER-SPECIFIED                  |
| Default desktop visible count | `4` complete cards                | USER-SPECIFIED                  |
| Slider overflow               | Hidden outside viewport/container | REQUIRED                        |
| Card alignment                | One horizontal track              | OBSERVED / USER-SPECIFIED       |
| Inter-card gap                | Consistent                        | OBSERVED                        |
| Top/bottom section padding    | Medium                            | OBSERVED / exact value INFERRED |
| Card heights                  | Equal                             | OBSERVED                        |
| Card widths                   | Equal                             | OBSERVED                        |

---

### 5.2 Structure tree

```text
Section: home-devices
├── SliderViewport
│   └── SliderTrack
│       ├── DeviceCard 01
│       │   ├── DeviceImage
│       │   └── DeviceContent
│       │       ├── Title
│       │       └── Description
│       │
│       ├── DeviceCard 02
│       ├── DeviceCard 03
│       ├── DeviceCard 04
│       └── Additional DeviceCards...
```

---

### 5.3 Desktop topology

```text
FULL WIDTH DEVICE SECTION
Background: rgb(3, 28, 80)

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────┐ │
│  │                │ │                │ │                │ │            │ │
│  │ DEVICE IMAGE   │ │ DEVICE IMAGE   │ │ DEVICE IMAGE   │ │ DEVICE     │ │
│  │                │ │                │ │                │ │ IMAGE      │ │
│  │                │ │                │ │                │ │            │ │
│  ├────────────────┤ ├────────────────┤ ├────────────────┤ ├────────────┤ │
│  │ TITLE          │ │ TITLE          │ │ TITLE          │ │ TITLE      │ │
│  │                │ │                │ │                │ │            │ │
│  │ DESCRIPTION    │ │ DESCRIPTION    │ │ DESCRIPTION    │ │ DESCRIPTION│ │
│  │                │ │                │ │                │ │            │ │
│  └────────────────┘ └────────────────┘ └────────────────┘ └────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

                     AUTO MOVEMENT →→→
                        LEFT → RIGHT
```

---

## 5.4 Four-card desktop calculation rule

The implementation should not rely on arbitrary fixed card widths that accidentally show four cards.

Use the relationship:

```text
availableSliderWidth
=
4 × cardWidth
+
3 × cardGap
```

Therefore:

```text
cardWidth
=
(availableSliderWidth - 3 × cardGap) / 4
```

### Required consequence

At the approved full desktop viewport:

* Card 1 = fully visible.
* Card 2 = fully visible.
* Card 3 = fully visible.
* Card 4 = fully visible.
* Card 5 = outside the normal visible region until the track moves.

Do not intentionally show:

* `3.5` cards,
* `4.5` cards,
* a partial fifth preview,

unless another design explicitly requires it.

---

## 5.5 Individual device card

### Geometry

| Property       | Specification                                             | Status   |
| -------------- | --------------------------------------------------------- | -------- |
| Surface        | White / near-white                                        | OBSERVED |
| Width          | Equal across all cards                                    | OBSERVED |
| Height         | Equal across all cards                                    | OBSERVED |
| Radius         | Large rounded corners, approximately `14–18 px estimated` | INFERRED |
| Overflow       | Hidden/clipped to card radius                             | REQUIRED |
| Layout         | Vertical                                                  | OBSERVED |
| Image region   | Upper portion                                             | OBSERVED |
| Content region | Lower portion                                             | OBSERVED |
| Text alignment | Center                                                    | OBSERVED |

---

### Device image region

* Occupies approximately `50–60%` of card height.
* White/light image background.
* Device centered horizontally.
* Asset should not touch card edges.
* Device object scales proportionally.
* Original equipment photography/illustration should remain uncropped where possible.

Preferred image behavior:

```text
contain
```

rather than aggressive `cover`.

This is particularly important for medical equipment because the full device silhouette is part of the card's visual identity.

---

### Text region

Structure:

```text
DeviceContent
├── Title
└── Description
```

* Center aligned.
* Title uses darker/bolder navy.
* Description uses softer blue/gray.
* No visible CTA appears in supplied screenshot.
* Do not add `Learn More` without supporting design evidence.

---

## 6. Visual Specification

### 6.1 Section surface

| Token candidate                       | Usage            | Value                | Status         |
| ------------------------------------- | ---------------- | -------------------- | -------------- |
| `color/device-section/background`     | Complete section | `rgb(3, 28, 80)`     | USER-SPECIFIED |
| `color/device-section/background-hex` | Equivalent       | `#031C50`            | Derived        |
| `color/device-card/surface`           | Card background  | White / near-white   | OBSERVED       |
| `color/device-card/title`             | Device title     | Deep navy            | OBSERVED       |
| `color/device-card/body`              | Description      | Muted navy/blue-gray | OBSERVED       |
| `color/device-card/border`            | Card boundary    | Very subtle / light  | INFERRED       |

### Important

Do not substitute the section background with:

* generic black,
* generic navy,
* gradient,
* background image,

unless additional design evidence explicitly changes this requirement.

The required baseline background is:

`RGB(3, 28, 80)`.

---

## 6.2 Typography

| Element            | Weight              | Approx. size         | Alignment | Status   |
| ------------------ | ------------------- | -------------------- | --------- | -------- |
| Device title       | `600–700 estimated` | `18–21 px estimated` | Center    | INFERRED |
| Device description | `400–500 estimated` | `14–16 px estimated` | Center    | INFERRED |

Card title hierarchy must remain clearly stronger than body copy.

---

## 6.3 Card effects

| Element      | Border                     | Radius                                         | Shadow                 | Status   |
| ------------ | -------------------------- | ---------------------------------------------- | ---------------------- | -------- |
| Device card  | Very subtle light boundary | Large rounded corners                          | Minimal / none visible | INFERRED |
| Device media | None                       | Inherits card upper geometry where appropriate | None                   | OBSERVED |

Avoid heavy box shadows against the dark navy section background unless Figma confirms them.

---

## 7. Asset Manifest

| Asset ID                   | Visible description                 | Format recommendation | Crop behavior | Status   |
| -------------------------- | ----------------------------------- | --------------------- | ------------- | -------- |
| `device-cone-beam-ct`      | Cone Beam CT scanner                | PNG/WebP              | Contain       | OBSERVED |
| `device-intraoral-scanner` | Intraoral scanner / scanning system | PNG/WebP              | Contain       | OBSERVED |
| `device-cad-cam`           | CAD/CAM dental system               | PNG/WebP              | Contain       | OBSERVED |
| `device-laser-care`        | Dental laser system                 | PNG/WebP              | Contain       | OBSERVED |

### Asset rules

* Each device must be a separate CMS media asset.
* Do not flatten all four cards into one screenshot/banner.
* Preserve device silhouette.
* Prefer transparent or clean white-background exports.
* Do not crop off equipment parts unless source design explicitly does so.
* Do not place text inside image assets.
* Device title and description remain actual CMS text.

---

## 8. Component Contract

### Recommended component boundaries

| Component           | Responsibility                 | Reusable? | Status                    |
| ------------------- | ------------------------------ | --------- | ------------------------- |
| `HomeDeviceSection` | Section wrapper/background     | No        | INFERRED                  |
| `DeviceSlider`      | Autoplay/loop/viewport logic   | Yes       | USER-SPECIFIED / INFERRED |
| `DeviceSliderTrack` | Horizontal moving content      | Yes       | INFERRED                  |
| `DeviceCard`        | Device image/title/description | Yes       | OBSERVED                  |
| `DeviceImage`       | Media containment              | Yes       | INFERRED                  |

---

## 9. Strapi CMS Contract

## 9.1 Recommended model

This section is a straightforward repeatable content slider.

Recommended structure:

```text
Homepage
└── Device Section
    └── devices[]
        ├── title
        ├── description
        ├── image
        └── optional alt text
```

### Recommended section-level fields

| Field          | Type                                | Required | Notes                                 |
| -------------- | ----------------------------------- | -------: | ------------------------------------- |
| `devices`      | Repeatable component / relationship |      Yes | Ordered list                          |
| `enabled`      | Boolean                             | Optional | Existing page-builder convention only |
| `internalName` | Short text                          | Optional | Admin identification only             |

The following should **not** normally be editable through Strapi:

* background color,
* desktop visible-card count,
* autoplay duration,
* movement direction,
* card radius,
* gap,
* slider easing,
* card width.

These are design-system/frontend behavior.

---

## 9.2 Recommended Device entry

| Field           | Type              |    Required | Example                                       |
| --------------- | ----------------- | ----------: | --------------------------------------------- |
| `title`         | Short text        |         Yes | `3D Cone Beam CT`                             |
| `description`   | Short / long text |         Yes | `Accurate 3D imaging for precise diagnosis`   |
| `image`         | Media             |         Yes | Device asset                                  |
| `imageAlt`      | Short text        | Recommended | Accessible image description                  |
| `sortOrder`     | Integer           |    Optional | Only if CMS relation ordering is insufficient |
| `slug` / `link` | Optional          | No evidence | Add only if cards become navigable            |

---

## 9.3 Recommended initial CMS entries

### Device 01

```text
Title:
3D Cone Beam CT

Description:
Accurate 3D imaging for precise diagnosis
```

### Device 02

```text
Title:
Intraoral Scanner

Description:
Digital impressions for better comfort
```

### Device 03

```text
Title:
CAD/CAM Technology

Description:
Precision smile design and restorations
```

### Device 04

```text
Title:
Laser Dental Care

Description:
Treatments with advanced laser technology
```

---

# 10. Slider Behavior Specification

## 10.1 Required autoplay behavior

The slider must start automatically without requiring user interaction.

Required motion:

```text
LEFT → RIGHT
```

Conceptually:

```text
Frame A

[1] [2] [3] [4]       [5] [6]


Frame B

   [1] [2] [3] [4]       [5] [6]


Frame C

      [1] [2] [3] [4]       [5] [6]

             →
             →
         slow motion
```

The cards/track themselves move toward the **right**.

Do not reverse the interpretation and move the content right-to-left unless the design owner changes the requirement.

---

## 10.2 Motion character

USER-SPECIFIED — movement should be **slow**.

Desired visual character:

* calm,
* predictable,
* smooth,
* non-distracting,
* no rapid card changes,
* no abrupt jump every 1–2 seconds.

Avoid aggressive slideshow behavior such as:

```text
wait → snap one card → wait → snap one card
```

unless product later specifies discrete sliding.

Preferred visual character:

```text
continuous slow horizontal movement
```

or a sufficiently smooth long-duration translation that appears continuous.

---

## 10.3 Seamless looping

INFERRED recommended behavior:

When the final device passes through the loop, the slider should continue without a visible hard reset.

Desired:

```text
... [3] [4] [5] [6] [1] [2] ...
```

not:

```text
... [5] [6]

FLASH / JUMP

[1] [2] [3] [4]
```

A duplicated internal render set may be used by the frontend for seamless looping, but duplicate CMS entries must **not** be required.

Example:

```text
CMS DATA

1
2
3
4
5
6

        ↓ frontend render strategy

1 2 3 4 5 6 | 1 2 3 4 5 6
```

This duplication is a rendering implementation detail only.

---

## 10.4 Do not duplicate records in Strapi

Incorrect:

```text
Device 1
Device 2
Device 3
Device 4
Device 1 Copy
Device 2 Copy
Device 3 Copy
Device 4 Copy
```

Correct:

```text
Strapi:
Device 1
Device 2
Device 3
Device 4

Frontend:
duplicates track nodes internally only if required
```

---

## 10.5 Slider timing

Exact timing has not been supplied.

| Property             | Requirement                      |
| -------------------- | -------------------------------- |
| Autoplay             | Yes                              |
| Speed                | Slow                             |
| Direction            | Left → Right                     |
| Loop                 | Recommended seamless             |
| Exact pixels/sec     | UNKNOWN                          |
| Exact cycle duration | UNKNOWN                          |
| Easing               | Smooth / near-linear recommended |
| Initial delay        | UNKNOWN                          |

For continuous movement, a near-linear motion curve is generally more appropriate than obvious acceleration/deceleration at each card.

Final timing must be checked visually against approved design behavior.

---

## 10.6 Four-card desktop invariant

At normal full desktop:

```text
visibleSlides = 4
```

This is a layout requirement, not CMS data.

If Strapi contains:

```text
8 devices
```

the desktop still shows:

```text
4 visible
4 outside viewport / progressing through track
```

If Strapi contains more devices, do **not** shrink every card merely to fit all devices simultaneously.

---

## 10.7 Insufficient device count

Potential edge case:

If there are fewer than four devices in Strapi:

```text
devices.length < 4
```

desired behavior is currently UNKNOWN.

Do not arbitrarily duplicate editorial content unless required for looping.

Product/developer must decide whether to:

* disable autoplay,
* repeat entries visually,
* center fewer cards,
* require at least four CMS records.

Recommended content validation:

**minimum 4 devices for this section** if the design guarantees four full desktop cards.

---

## 10.8 Pause behavior

No requirement has been supplied for:

* mouse hover pause,
* touch pause,
* browser tab hidden state,
* focus pause.

Recommended accessibility/UX consideration:

* movement should pause or become controllable when the user is interacting with slider content if cards later become interactive.
* automatic movement should not interfere with reading.

However, do not invent visible pause controls unless requested.

---

# 11. Responsive Specification

## 11.1 Evidence available

| Device          | Evidence |
| --------------- | -------- |
| Full desktop    | High     |
| Smaller desktop | UNKNOWN  |
| Tablet          | UNKNOWN  |
| Mobile          | UNKNOWN  |

---

## 11.2 Desktop behavior

Required:

```text
4 full cards visible
```

* same card width,
* same card height,
* no partial fifth card intentionally exposed,
* consistent horizontal gaps,
* automatic left-to-right movement.

---

## 11.3 Proposed responsive architecture

The data model remains unchanged:

```text
devices[]
```

Frontend determines cards per viewport.

Possible model:

| Viewport      | Visible cards | Status                                    |
| ------------- | ------------: | ----------------------------------------- |
| Large desktop |           `4` | USER-SPECIFIED                            |
| Desktop       |           `4` | Recommended based on supplied requirement |
| Tablet        |       UNKNOWN | Requires design                           |
| Mobile        |       UNKNOWN | Requires design                           |

Do not automatically decide:

```text
tablet = 2
mobile = 1
```

without design approval, even though that would be a common implementation.

---

## 11.4 Mobile motion

If autoplay remains enabled on mobile:

* track direction should remain logically consistent unless mobile design says otherwise,
* cards must not interfere with native vertical scrolling,
* manual horizontal swipe behavior requires separate confirmation.

If swipe is implemented later, autoplay and swipe state must not fight each other.

---

# 12. Semantic HTML and Accessibility

### Recommended structure

* Section wrapper.
* Semantic list for device collection.
* Each device card can use an article/list-item grouping.
* Device name should be exposed as heading/text.
* Device description must remain text.
* Device image should have appropriate alt text.

### Motion accessibility

Automatic movement introduces accessibility considerations.

Required:

* respect `prefers-reduced-motion`,
* do not force continuous movement for users requesting reduced motion,
* reduced-motion mode may render a static four-card viewport,
* slider must not cause horizontal page overflow,
* card movement must not alter page layout dimensions.

### If cards become interactive

* use actual link/button semantics,
* ensure focus state remains visible,
* avoid slider movement moving a focused card unexpectedly,
* consider pausing the track while focus is inside the carousel.

---

# 13. Implementation Constraints

## Section

* Must be positioned after `home-technology`.
* Background is exactly `rgb(3, 28, 80)` unless tokenized equivalent exists.
* No background image is required from current evidence.
* Keep consistent dark surface across full section.

## Cards

* Desktop shows four full cards.
* Equal widths.
* Equal heights.
* White surfaces.
* Large rounded corners.
* Images use controlled containment.
* Device text must remain editable.
* Do not add unconfirmed CTA buttons.
* Do not add hover color effects without new evidence.

## Slider

* Horizontal.
* Autoplay enabled.
* Slow.
* Left → right.
* Prefer seamless looping.
* No visible hard reset.
* Do not duplicate CMS data to support loop.
* Do not cause layout shifts.
* Track overflow must remain clipped.
* Do not expose part of fifth card on full desktop unless design changes.
* Do not compress all devices into one row based on collection length.

## CMS

* Use ordered repeatable devices.
* Strapi owns:

  * image,
  * title,
  * description,
  * optional alt.
* Frontend owns:

  * four-card desktop rule,
  * autoplay,
  * slide direction,
  * loop,
  * speed,
  * gaps,
  * background color,
  * responsive behavior.

---

# 14. Visual Acceptance Criteria

## Section

* [ ] Device section appears directly after Advanced Technology.
* [ ] Background is `rgb(3, 28, 80)`.
* [ ] Background covers full width.
* [ ] Section does not accidentally inherit the Technology background cover image.

## Desktop cards

* [ ] Exactly four complete cards are visible simultaneously.
* [ ] No deliberate partial fifth card is visible.
* [ ] All cards have equal width.
* [ ] All cards have equal height.
* [ ] Horizontal gaps are visually consistent.
* [ ] Cards use white/light background.
* [ ] Corners are strongly rounded.
* [ ] Device media occupies upper card region.
* [ ] Device title is centered.
* [ ] Device description is centered.
* [ ] Device images preserve equipment silhouette.

## Copy

* [ ] `3D Cone Beam CT`
* [ ] `Accurate 3D imaging for precise diagnosis`
* [ ] `Intraoral Scanner`
* [ ] `Digital impressions for better comfort`
* [ ] `CAD/CAM Technology`
* [ ] `Precision smile design and restorations`
* [ ] `Laser Dental Care`
* [ ] `Treatments with advanced laser technology`

## Slider

* [ ] Slider starts automatically.
* [ ] Movement is horizontal.
* [ ] Cards move **left → right**.
* [ ] Speed feels deliberately slow.
* [ ] Motion is smooth.
* [ ] Track does not visibly jump at loop boundary.
* [ ] Slider does not change section height while moving.
* [ ] Cards do not resize during movement.
* [ ] Additional CMS devices enter the visible viewport naturally.
* [ ] Reduced-motion mode avoids forced continuous movement.

---

# 15. Visual Risks

| Risk                                        | Why it affects fidelity / UX            | Mitigation                                     | Priority |
| ------------------------------------------- | --------------------------------------- | ---------------------------------------------- | -------- |
| Moving track right-to-left                  | Contradicts explicit requirement        | Lock direction to left → right                 | High     |
| Showing partial fifth card                  | Violates desktop 4-card composition     | Calculate card width from viewport and gaps    | High     |
| Slider moves too quickly                    | Section becomes distracting             | Use slow continuous motion                     | High     |
| Hard reset after final item                 | Makes autoplay appear broken            | Implement seamless loop                        | High     |
| Duplicating devices in Strapi               | CMS becomes difficult to maintain       | Duplicate rendering internally only            | High     |
| Using `cover` on device imagery             | Medical equipment gets cropped          | Prefer contain-style presentation              | Medium   |
| Unequal card heights                        | Slider looks unstable                   | Use consistent card dimensions                 | High     |
| Dynamic text changes card size              | Track alignment breaks                  | Constrain internal layout                      | High     |
| Background color approximated incorrectly   | Large section color mismatch is obvious | Use exact RGB `3,28,80`                        | High     |
| Continuous animation ignores reduced motion | Accessibility problem                   | Provide static/reduced-motion mode             | High     |
| Swipe + autoplay conflict                   | Poor touch UX                           | Coordinate interaction if swipe is later added | Medium   |
| Fewer than four CMS items                   | Desktop composition becomes unclear     | Require minimum 4 or define fallback           | Medium   |

---

# 16. Open Questions

| ID  | Question                                                                                        | Blocking level                        | Suggested owner     |
| --- | ----------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------- |
| Q1  | What exact autoplay speed/duration should be used?                                              | Non-blocking for first implementation | Designer            |
| Q2  | Should the movement be continuously scrolling like a marquee or slowly snap one card at a time? | Blocking for exact motion             | Designer            |
| Q3  | Should the slider pause on desktop hover?                                                       | Non-blocking                          | Designer / Product  |
| Q4  | Should the slider pause when keyboard focus enters a card?                                      | Non-blocking                          | Developer / Product |
| Q5  | Can users manually drag/swipe the slider?                                                       | Blocking if manual gesture required   | Designer            |
| Q6  | Are arrows or pagination dots ever displayed?                                                   | Non-blocking                          | Designer            |
| Q7  | How many devices will normally exist in Strapi?                                                 | Non-blocking                          | Product             |
| Q8  | What should happen when fewer than four devices are available?                                  | Important data rule                   | Product / Developer |
| Q9  | Are device cards clickable?                                                                     | Blocking for interaction              | Product             |
| Q10 | If clickable, what destination does each device use?                                            | Blocking for functionality            | Product             |
| Q11 | What is the tablet visible-card count?                                                          | Blocking for tablet                   | Designer            |
| Q12 | What is the mobile visible-card count?                                                          | Blocking for mobile                   | Designer            |
| Q13 | Should autoplay remain active on mobile?                                                        | Blocking for mobile behavior          | Designer / Product  |
| Q14 | Should direction remain left → right on every breakpoint?                                       | Non-blocking but should be confirmed  | Designer            |

---

# Strapi Handoff Summary

## Recommended hierarchy

```text
Homepage
└── Device Slider Section
    └── devices[]
        ├── image
        ├── imageAlt
        ├── title
        └── description
```

Potential canonical architecture if devices also have detail content elsewhere:

```text
Device Collection
├── 3D Cone Beam CT
├── Intraoral Scanner
├── CAD/CAM Technology
├── Laser Dental Care
└── ...

Homepage Device Slider
└── featuredDevices[]
        ↓ relation
    Device Collection
```

This is preferred over duplicating full device records inside Homepage if these devices are reused elsewhere.

---

# CMS vs Frontend Responsibility

| Responsibility                | Strapi | Frontend |
| ----------------------------- | :----: | :------: |
| Device image                  |    ✅   |          |
| Device title                  |    ✅   |          |
| Device description            |    ✅   |          |
| Device ordering               |    ✅   |          |
| Image alt                     |    ✅   |          |
| Desktop visible-card count    |        |     ✅    |
| `4 cards` rule                |        |     ✅    |
| Background `rgb(3,28,80)`     |        |     ✅    |
| Slider direction              |        |     ✅    |
| Left → right movement         |        |     ✅    |
| Autoplay                      |        |     ✅    |
| Autoplay speed                |        |     ✅    |
| Seamless loop                 |        |     ✅    |
| Responsive visible-card count |        |     ✅    |
| Card geometry                 |        |     ✅    |
| Card radius/gap               |        |     ✅    |

---

# Slider Handoff Summary

```text
SECTION BACKGROUND
rgb(3, 28, 80)
#031C50

┌───────────────────────────────────────────────────────────────┐
│                                                               │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│    │ CARD 1  │  │ CARD 2  │  │ CARD 3  │  │ CARD 4  │        │
│    │         │  │         │  │         │  │         │        │
│    └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                               │
│                          →                                    │
│                          →                                    │
│                  SLOW LEFT → RIGHT                            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Mandatory rules

1. New section immediately after `home-technology`.
2. Background = **RGB `(3, 28, 80)` / `#031C50`**.
3. Slider autoplay starts automatically.
4. Motion is deliberately slow.
5. Track direction = **left → right**.
6. Full desktop = **exactly four complete visible cards**.
7. Additional device cards remain outside viewport and move through the track.
8. Do not expose an intentional partial fifth card.
9. Prefer seamless/infinite looping.
10. Device entries remain a Strapi repeatable/relation collection.
11. Do not duplicate CMS entries merely to implement infinite movement.
12. Respect reduced-motion accessibility.
