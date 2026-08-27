# UI Implementation Spec — Homepage Press / Featured In Section

## 1. Identity

| Field                       | Value                                                                                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | `/`                                                                                                                                                             |
| Section ID                  | `home-press`                                                                                                                                                    |
| Section name                | `Homepage Press / Featured In`                                                                                                                                  |
| Position in page            | Immediately after `home-testimonials`                                                                                                                           |
| Screenshot scope            | Complete desktop press/logo section visible in supplied screenshot                                                                                              |
| Section type                | Auto-scrolling horizontal press-logo slider                                                                                                                     |
| CMS content type            | **Image-only logo collection**                                                                                                                                  |
| Autoplay                    | **Required**                                                                                                                                                    |
| Slide speed                 | **Slow**                                                                                                                                                        |
| Slide direction             | **Left → Right**                                                                                                                                                |
| Preferred motion            | Smooth continuous / seamless                                                                                                                                    |
| Background                  | White / near-white                                                                                                                                              |
| Primary implementation goal | Reproduce the press-logo presentation and continuously auto-scroll uploaded publication logos from left to right without exposing unnecessary CMS configuration |
| Overall evidence quality    | High for desktop visual composition and explicit autoplay requirement; Medium for exact dimensions; Low for responsive behavior                                 |

> **Critical CMS rule:** Each press item is **only an uploaded logo image**. Do not create unnecessary CMS fields for publication title, description, URL, card content, text, animation settings or layout.

> **Critical motion rule:** The publication logos automatically move **slowly from left to right**.

> **Critical rendering rule:** Logos must keep their own original aspect ratios. Do not force all logos into an identical stretched width/height.

---

# 2. Scope Boundary

## Included in this spec

* OBSERVED — Section eyebrow:

  * `AS FEATURED IN`
* OBSERVED — Main heading:

  * `Smilux Dental In The Press`
* OBSERVED — Horizontal publication-logo row.
* OBSERVED — Logos visible in screenshot include:

  * VNExpress
  * Tuổi Trẻ
  * Dân Trí
  * Zing News
  * HTV
  * CafeBiz
* OBSERVED — Left navigation chevron.
* OBSERVED — Right navigation chevron.
* USER-SPECIFIED — Automatic slide behavior.
* USER-SPECIFIED — Slow movement.
* USER-SPECIFIED — Direction:

  * **Left → Right**
* USER-SPECIFIED — CMS items consist only of uploaded logo images.
* INFERRED — Slider should support arbitrary number of uploaded logos.
* INFERRED — Seamless/infinite track is appropriate so automatic movement does not visibly reset.

## Excluded from this spec

* No publication description.
* No news/article headline.
* No publication date.
* No press article content.
* No per-logo CTA.
* No publication category.
* No card content.
* No publication metadata fields unless separately requested.
* UNKNOWN — Whether logos are clickable.
* UNKNOWN — Whether left/right chevrons support manual navigation.
* UNKNOWN — Exact animation speed.
* UNKNOWN — pause-on-hover behavior.
* UNKNOWN — tablet layout.
* UNKNOWN — mobile layout.
* UNKNOWN — minimum/maximum number of logos.

---

# 3. Evidence and Confidence

| Item                        | Status              | Evidence / reason                         |
| --------------------------- | ------------------- | ----------------------------------------- |
| Section heading             | OBSERVED            | Clearly visible                           |
| Horizontal logo arrangement | OBSERVED            | Six logos visible in one row              |
| Logo-only content           | USER-SPECIFIED      | Explicit requirement                      |
| Autoplay                    | USER-SPECIFIED      | Explicit requirement                      |
| Slow animation              | USER-SPECIFIED      | Explicit requirement                      |
| Left → Right direction      | USER-SPECIFIED      | Explicit requirement                      |
| Seamless/infinite behavior  | INFERRED            | Best fit for continuous slow autoplay     |
| Left/right chevrons         | OBSERVED            | Both visible in screenshot                |
| Chevron click behavior      | UNKNOWN             | Screenshot alone cannot prove interaction |
| Logo click behavior         | UNKNOWN             | No evidence                               |
| Logo dimensions             | OBSERVED / INFERRED | Different intrinsic proportions           |
| Responsive behavior         | UNKNOWN             | Desktop screenshot only                   |

---

# 4. OCR Content Inventory

## Section-level text

| Element ID      | Visible text                 | Type    | Confidence |
| --------------- | ---------------------------- | ------- | ---------- |
| `press-eyebrow` | `AS FEATURED IN`             | Eyebrow | High       |
| `press-heading` | `Smilux Dental In The Press` | H2      | High       |

## Visible logo assets

| Order | Visible logo | Type             | Confidence |
| ----: | ------------ | ---------------- | ---------- |
|     1 | `VNEXPRESS`  | Publication logo | High       |
|     2 | `tuổi trẻ`   | Publication logo | High       |
|     3 | `DÂN TRÍ`    | Publication logo | High       |
|     4 | `Zing news`  | Publication logo | High       |
|     5 | `HTV`        | Publication logo | High       |
|     6 | `cafebiz`    | Publication logo | High       |

These are visual assets.

Do **not** recreate publication brands using normal HTML text.

---

# 5. Layout Anatomy

## 5.1 Global geometry

| Property                | Specification                         | Status   |
| ----------------------- | ------------------------------------- | -------- |
| Width                   | Full viewport                         | OBSERVED |
| Internal container      | Centered                              | INFERRED |
| Background              | White / near-white                    | OBSERVED |
| Main structure          | Heading block above horizontal slider | OBSERVED |
| Slider orientation      | Horizontal                            | OBSERVED |
| Desktop logos visible   | Approximately 6 in screenshot         | OBSERVED |
| Logo sizing             | Different intrinsic dimensions        | OBSERVED |
| Logo vertical alignment | Centered                              | OBSERVED |
| Overflow                | Hidden at viewport/container boundary | REQUIRED |
| Section height          | Compact relative to previous sections | OBSERVED |

---

# 5.2 Structure tree

```text
Section: home-press
├── SectionHeader
│   ├── Eyebrow
│   └── H2
│
└── PressSlider
    ├── PreviousControl
    │
    ├── SliderViewport
    │   └── SliderTrack
    │       ├── LogoItem
    │       │   └── LogoImage
    │       ├── LogoItem
    │       ├── LogoItem
    │       ├── LogoItem
    │       ├── LogoItem
    │       ├── LogoItem
    │       └── AdditionalLogoItems...
    │
    └── NextControl
```

---

# 5.3 Desktop topology

```text
AS FEATURED IN

Smilux Dental In The Press


  ‹     [ VNEXPRESS ]   [ TUỔI TRẺ ]   [ DÂN TRÍ ]   [ ZING ]   [ HTV ]   [ CAFEBIZ ]     ›


                                      →
                                      →
                              SLOW LEFT → RIGHT
```

---

# 5.4 Header

### Eyebrow

* Uppercase.
* Muted blue/gray.
* Small.
* Positioned above H2.
* Left aligned.

### H2

`Smilux Dental In The Press`

* Dark navy.
* Strong visual weight.
* Left aligned.
* One desktop line.

---

# 5.5 Slider viewport

The slider must have an explicit viewport:

```text
PressSlider
└── Viewport
    └── MovingTrack
```

Required:

* horizontal overflow hidden,
* logo track may be wider than container,
* the entire track moves,
* page itself must **not** develop horizontal scrolling.

Incorrect:

```text
body
└── overflowing logo row
```

Correct:

```text
slider viewport
├── overflow hidden
└── internal moving track
```

---

# 6. Logo Item Specification

## 6.1 Each CMS item

Each item contains:

```text
PressLogo
└── image
```

That is the primary CMS contract.

Do not require:

```text
title
description
url
publicationName
category
articleTitle
articleDate
sortLabel
animationType
```

unless future product requirements explicitly introduce them.

---

# 6.2 Image dimensions

Publication logos naturally use different aspect ratios.

Example visual differences:

* VNExpress = wide horizontal logo.
* Tuổi Trẻ = medium/wide.
* Dân Trí = medium/wide.
* Zing News = horizontal with secondary text.
* HTV = medium.
* CafeBiz = wide.

Therefore:

```text
logoWidth = auto
logoHeight = constrained
```

rather than:

```text
all logos width = 180px
all logos height = 80px
```

if that stretches the asset.

---

# 6.3 Preferred image behavior

Use:

```text
object-fit: contain
```

conceptually.

Do not crop publication logos.

Do not use `cover`.

Do not stretch.

Do not change publication brand colors.

---

# 6.4 Visual logo slot

Although logo intrinsic widths differ, each may live inside a predictable alignment slot:

```text
LogoSlot
├── width / flex basis controlled by frontend
├── vertical center
└── LogoImage
    ├── max width
    ├── max height
    └── contain
```

This allows spacing to remain visually regular without distorting the actual logo.

---

# 7. Slider Behavior Specification

## 7.1 Autoplay

Mandatory:

```text
autoplay = true
```

Slider should begin moving automatically.

No user action is required to initiate movement.

---

# 7.2 Direction

Mandatory:

```text
LEFT → RIGHT
```

The logo track moves toward the **right side** of the screen.

Conceptual frames:

```text
FRAME A

[1] [2] [3] [4] [5] [6]


FRAME B

   [1] [2] [3] [4] [5] [6]


FRAME C

      [1] [2] [3] [4] [5] [6]

               →
               →
```

Do not accidentally implement the more common right-to-left marquee direction.

---

# 7.3 Speed

USER-SPECIFIED:

**Slow.**

Desired feel:

* calm,
* premium,
* non-distracting,
* enough time to recognize each press logo.

Avoid:

```text
logo logo logo → fast → disappear
```

Preferred:

```text
smooth────────────────────────────→
```

Exact speed remains UNKNOWN.

---

# 7.4 Motion model

Preferred:

**Continuous slow movement.**

Not:

```text
wait 3 sec
↓
jump 1 logo
↓
wait
↓
jump 1 logo
```

unless Designer later confirms snap-based behavior.

Because the user describes it as an auto slide running slowly, the intended motion should visually approximate a slow marquee/logo ticker.

---

# 7.5 Looping

Recommended:

```text
infinite = true
```

The track should loop seamlessly.

Example:

```text
Original CMS data

[A] [B] [C] [D] [E] [F]
```

Frontend may render internally:

```text
[A] [B] [C] [D] [E] [F] | [A] [B] [C] [D] [E] [F]
```

to create a continuous loop.

This duplication is **render-only**.

Do not create duplicated entries in Strapi.

---

# 7.6 Loop boundary

Not acceptable:

```text
[A][B][C][D][E][F]

              end

FLASH

[A][B][C][D][E][F]
```

Expected:

```text
[D][E][F][A][B][C][D][E][F]
               →
```

No obvious reset jump.

---

# 7.7 Left / right arrows

The screenshot visibly contains:

```text
‹                                         ›
```

### Visual requirement

Keep both arrow controls in the desktop composition unless updated design removes them.

### Behavior

`UNKNOWN`.

Most likely interpretation:

* left arrow = manual previous direction,
* right arrow = manual next direction.

But this behavior is not explicitly supplied.

Therefore:

* render control visual for screenshot fidelity,
* frontend interaction behavior should be confirmed before final functional acceptance.

If they become interactive:

* they remain frontend components,
* no arrow configuration belongs in Strapi.

---

# 7.8 Interaction between manual controls and autoplay

If manual arrows are confirmed:

Recommended behavior:

```text
user clicks arrow
↓
perform manual movement
↓
resume slow autoplay
```

Do not permanently stop slider unless Product requires it.

Exact resume delay remains UNKNOWN.

---

# 8. Strapi CMS Contract

## 8.1 Minimal required model

Because the requirement is specifically **image-logo upload only**, keep CMS extremely simple.

Recommended structure:

```text
Homepage
└── Press Section
    └── logos[]
        └── image
```

---

# 8.2 Recommended Strapi component

Conceptually:

```text
press-logo
└── image: Media
```

Or, if the page-builder supports repeatable media directly:

```text
logos: Media[]
```

A direct multiple-media field is preferable if no per-logo metadata is necessary.

---

# 8.3 Do not over-model

Avoid:

```text
press-logo
├── image
├── name
├── slug
├── subtitle
├── description
├── website
├── externalLink
├── article
├── date
├── position
├── animationSpeed
└── animationDirection
```

for the current requirement.

This introduces CMS complexity without visible product value.

---

# 8.4 Alt text

Accessibility metadata can use the media asset's standard Strapi alternative-text metadata.

That does not require a separate custom logo component field.

Example media metadata:

```text
Alternative text:
VNExpress logo
```

Frontend uses standard media metadata where available.

---

# 8.5 Ordering

Editors must be able to control logo order using the order of uploaded media/items.

Example:

```text
logos[0] = VNExpress
logos[1] = Tuổi Trẻ
logos[2] = Dân Trí
logos[3] = Zing
logos[4] = HTV
logos[5] = CafeBiz
```

Frontend preserves this order in the repeating track.

---

# 8.6 No duplicated CMS data for infinite slider

CMS:

```text
VNExpress
Tuổi Trẻ
Dân Trí
Zing
HTV
CafeBiz
```

Correct frontend render:

```text
VNExpress
Tuổi Trẻ
Dân Trí
Zing
HTV
CafeBiz
|
VNExpress
Tuổi Trẻ
Dân Trí
Zing
HTV
CafeBiz
```

Incorrect CMS:

```text
VNExpress
Tuổi Trẻ
Dân Trí
Zing
HTV
CafeBiz
VNExpress copy
Tuổi Trẻ copy
...
```

---

# 9. Component Contract

| Component            | Responsibility          | Reusable?   | Status         |
| -------------------- | ----------------------- | ----------- | -------------- |
| `HomePressSection`   | Entire homepage section | No          | INFERRED       |
| `PressSectionHeader` | Eyebrow + H2            | Potentially | INFERRED       |
| `PressLogoSlider`    | Autoplay/viewport/loop  | Yes         | USER-SPECIFIED |
| `PressLogoTrack`     | Moving horizontal track | Yes         | INFERRED       |
| `PressLogoItem`      | Render one logo         | Yes         | OBSERVED       |
| `PressSliderArrow`   | Left/right control      | Yes         | OBSERVED       |

---

# 10. CMS vs Frontend Responsibility

| Responsibility            | Strapi | Frontend |
| ------------------------- | :----: | :------: |
| Logo upload               |    ✅   |          |
| Logo order                |    ✅   |          |
| Standard media alt        |    ✅   |          |
| Logo image rendering      |        |     ✅    |
| Logo max dimensions       |        |     ✅    |
| Aspect-ratio preservation |        |     ✅    |
| Slider viewport           |        |     ✅    |
| Slider direction          |        |     ✅    |
| Left → Right rule         |        |     ✅    |
| Slow speed                |        |     ✅    |
| Autoplay                  |        |     ✅    |
| Infinite loop             |        |     ✅    |
| Track duplication         |        |     ✅    |
| Arrow UI                  |        |     ✅    |
| Manual navigation logic   |        |     ✅    |
| Responsive layout         |        |     ✅    |
| Gaps between logos        |        |     ✅    |

### CMS principle

**Strapi answers:**

> Which logos appear, and in which order?

**Frontend answers:**

> How they move and how they look.

---

# 11. Visual Specification

## 11.1 Colors

| Token candidate          | Usage             | Description        | Status   |
| ------------------------ | ----------------- | ------------------ | -------- |
| `color/press/background` | Section surface   | White / near-white | OBSERVED |
| `color/press/eyebrow`    | Eyebrow           | Muted blue-gray    | OBSERVED |
| `color/press/heading`    | H2                | Dark navy          | OBSERVED |
| `color/press/arrow`      | Slider navigation | Blue               | OBSERVED |

Publication logo colors must come directly from uploaded assets.

Do not recolor logos to fit theme.

---

# 11.2 Typography

| Element | Weight              | Approx. size         | Status   |
| ------- | ------------------- | -------------------- | -------- |
| Eyebrow | `500–600 estimated` | `11–13 px estimated` | INFERRED |
| H2      | `600–700 estimated` | `27–31 px estimated` | INFERRED |

---

# 11.3 Separating line

A subtle horizontal visual boundary appears around the heading/logo transition region.

Status:

`OBSERVED / exact implementation INFERRED`

If reproduced:

* use subtle light border,
* do not introduce a strong divider.

---

# 12. Logo Layout Rules

## 12.1 Visual spacing

The six visible logos are distributed across the horizontal space with substantial breathing room.

Do not pack them together as:

```text
[VN][TUOI][DANTRI][ZING][HTV][CAFE]
```

Expected:

```text
[ VNEXPRESS ]    [ TUỔI TRẺ ]    [ DÂN TRÍ ]    [ ZING ]    [ HTV ]    [ CAFEBIZ ]
```

---

# 12.2 Different logo sizes

Do not normalize logo width by distortion.

The goal is **similar visual weight**, not identical pixel dimensions.

For example:

```text
VNExpress   → relatively wide
Tuổi Trẻ    → moderate width
HTV         → narrower
```

All should feel approximately balanced vertically.

---

# 12.3 Logo quality

Use:

* SVG when source allows,
* high-resolution transparent PNG/WebP otherwise.

Avoid:

* low-resolution raster logos,
* white box baked around logos,
* screenshots of logos where clean asset exists.

---

# 13. Responsive Specification

## 13.1 Evidence

| Viewport     | Evidence |
| ------------ | -------- |
| Full desktop | High     |
| Tablet       | UNKNOWN  |
| Mobile       | UNKNOWN  |

---

# 13.2 Desktop requirements

* Heading stays at upper-left.
* Logo slider occupies full usable section width.
* Both arrows remain near horizontal edges if retained.
* Multiple logos are visible simultaneously.
* Automatic movement remains slow.
* No logos are cropped vertically.
* Section stays compact.

---

# 13.3 Responsive slider architecture

The same logo collection is used at all breakpoints:

```text
logos[]
```

Frontend may reduce:

* number simultaneously visible,
* gap,
* logo maximum dimensions.

Do not create:

```text
desktopLogos[]
mobileLogos[]
```

---

# 13.4 Mobile behavior

Exact mobile design is UNKNOWN.

However the auto-scrolling track architecture is naturally adaptable.

Potential behavior:

```text
2–3 logos visible
slow continuous movement
```

but exact count requires design approval.

Do not hard-code this as an approved requirement.

---

# 14. Motion Accessibility

Automatic animation must support:

```text
prefers-reduced-motion
```

When reduced motion is requested:

* continuous animation may stop,
* display logos statically,
* manual access should remain possible where controls exist.

Do not force a permanently moving marquee for reduced-motion users.

---

# 14.1 Browser visibility

Recommended operational behavior:

Pause animation when the page/tab is not visible.

Benefits:

* avoids unnecessary work,
* avoids track-state drift,
* reduces browser resource usage.

This is an implementation optimization, not a CMS feature.

---

# 15. Interaction States

| Element     | Default                          | Hover              | Click                    | Status                      |
| ----------- | -------------------------------- | ------------------ | ------------------------ | --------------------------- |
| Logo        | Static image within moving track | No required effect | UNKNOWN                  | OBSERVED                    |
| Left arrow  | Visible blue chevron             | UNKNOWN            | Likely manual navigation | OBSERVED / behavior UNKNOWN |
| Right arrow | Visible blue chevron             | UNKNOWN            | Likely manual navigation | OBSERVED / behavior UNKNOWN |
| Slider      | Slow autoplay                    | N/A                | N/A                      | USER-SPECIFIED              |

### Do not invent

* logo hover zoom,
* grayscale → color,
* opacity transition,
* tooltips,
* article preview,
* publication URLs,
* modal,
* card borders.

The screenshot supports a clean logo-only presentation.

---

# 16. Implementation Constraints

## CMS

* Press entries consist only of logo image uploads.
* Prefer simple multiple-media field if architecture supports it.
* No unnecessary metadata fields.
* Preserve upload/order sequence.
* Do not duplicate CMS entries for infinite looping.

## Slider

* Auto-start.
* Horizontal.
* Slow.
* **Left → Right.**
* Prefer continuous movement.
* Prefer seamless loop.
* No visible hard reset.
* Overflow stays inside slider.
* Do not generate horizontal page scroll.

## Logos

* Preserve intrinsic aspect ratio.
* Do not crop.
* Do not recolor.
* Do not stretch.
* Keep logo visual sizes balanced using frontend constraints.

## Arrows

* Preserve visual arrows because they are present in the screenshot.
* Keep arrow configuration frontend-only.
* Do not create CMS fields for arrow icon/color/direction.
* Functional arrow behavior remains pending confirmation.

---

# 17. Visual Acceptance Criteria

## Section

* [ ] Section appears after `home-testimonials`.
* [ ] Background remains white / near-white.
* [ ] `AS FEATURED IN` appears at upper-left.
* [ ] `Smilux Dental In The Press` appears beneath.
* [ ] Spacing around header matches reference.

## Logos

* [ ] VNExpress logo appears.
* [ ] Tuổi Trẻ logo appears.
* [ ] Dân Trí logo appears.
* [ ] Zing News logo appears.
* [ ] HTV logo appears.
* [ ] CafeBiz logo appears.
* [ ] Logos are rendered from separate uploaded assets.
* [ ] Logos preserve original aspect ratios.
* [ ] No logo is visibly stretched.
* [ ] No logo is aggressively cropped.
* [ ] Brand colors remain unchanged.
* [ ] Horizontal spacing is balanced.

## Slider

* [ ] Slider starts automatically.
* [ ] Logo track moves **left → right**.
* [ ] Movement is deliberately slow.
* [ ] Movement is smooth.
* [ ] No hard reset is visible during loop.
* [ ] Overflow is clipped to slider viewport.
* [ ] Section never causes page-level horizontal scrolling.
* [ ] Additional uploaded logos automatically participate in the track.
* [ ] CMS records are not duplicated to implement the loop.

## Controls

* [ ] Left chevron is visible.
* [ ] Right chevron is visible.
* [ ] Controls remain outside/at edges of primary logo display region.
* [ ] Controls do not overlap publication logos.

## Accessibility

* [ ] Logo alt comes from appropriate media metadata.
* [ ] Reduced-motion mode does not force continuous animation.
* [ ] Interactive arrows, if enabled, use proper button semantics.
* [ ] Keyboard focus is visible on interactive controls.

---

# 18. Visual Risks

| Risk                              | Why it affects fidelity/maintenance    | Mitigation                               | Priority |
| --------------------------------- | -------------------------------------- | ---------------------------------------- | -------- |
| Track moves right → left          | Contradicts explicit requirement       | Lock animation direction to left → right | High     |
| Slider too fast                   | Logos become difficult to recognize    | Use slow continuous motion               | High     |
| Hard loop reset                   | Makes slider feel broken               | Seamless duplicate-render strategy       | High     |
| Duplicating logos in Strapi       | CMS becomes polluted                   | Duplicate track nodes only frontend-side | High     |
| Over-modeling CMS                 | Unnecessary admin complexity           | Image-only media collection              | High     |
| Fixed identical logo width/height | Distorts publication logos             | Preserve intrinsic ratios                | High     |
| Using `cover`                     | Crops logo marks/text                  | Use contain-style sizing                 | High     |
| Logo hover effects invented       | Diverges from simple screenshot        | No unsupported interaction               | Medium   |
| Hard-coding visible logo count    | Breaks responsive behavior             | Responsive viewport-based sizing         | Medium   |
| Too-small uploaded assets         | Visible blur                           | Use original/vector assets               | Medium   |
| Page overflow from track          | Creates horizontal scrollbar           | Dedicated clipped viewport               | High     |
| Strong divider/shadow             | Section becomes heavier than reference | Keep surface minimal                     | Medium   |
| Autoplay ignores reduced motion   | Accessibility problem                  | Stop/minimize motion                     | High     |

---

# 19. Open Questions

| ID  | Question                                                                            | Blocking level                                   | Suggested owner      |
| --- | ----------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------- |
| Q1  | What exact autoplay speed should be used?                                           | Non-blocking for first implementation            | Designer             |
| Q2  | Should motion be fully continuous or advance one logo/group at a time slowly?       | Important for exact animation                    | Designer             |
| Q3  | Should the visible left/right arrows actually control the slider?                   | Blocking for manual interaction                  | Designer / Product   |
| Q4  | If arrows are clickable, should autoplay pause temporarily after manual navigation? | Non-blocking                                     | Designer             |
| Q5  | Are publication logos clickable?                                                    | Non-blocking                                     | Product              |
| Q6  | If clickable, do they link to press articles or publisher websites?                 | Blocking only if linking is required             | Product              |
| Q7  | Is there a minimum logo count required to activate autoplay?                        | Data behavior decision                           | Product / Developer  |
| Q8  | What should happen if only one logo is uploaded?                                    | Data/layout decision                             | Designer             |
| Q9  | What should happen if uploaded logos have very different dimensions?                | Non-blocking; frontend normalization recommended | Designer / Developer |
| Q10 | What is the tablet visual density?                                                  | Blocking for exact tablet fidelity               | Designer             |
| Q11 | What is the mobile visual density?                                                  | Blocking for exact mobile fidelity               | Designer             |

---

# Strapi Handoff Summary

## Minimal model

```text
Homepage
└── Press Section
    └── logos[]
        └── image
```

Prefer, if supported:

```text
logos: multiple Media
```

rather than a complex custom component.

---

# Do Not Over-Model

Do **not** create this unless requirements expand:

```text
PressLogo
├── publicationName
├── title
├── description
├── url
├── category
├── publishedDate
├── image
└── animation
```

Current requirement is simply:

```text
PressLogo
└── image
```

---

# Slider Handoff

```text
AS FEATURED IN
Smilux Dental In The Press


 ‹     [LOGO 1]   [LOGO 2]   [LOGO 3]   [LOGO 4]   [LOGO 5]   [LOGO 6]     ›

                                      →
                                      →
                              SLOW LEFT → RIGHT
```

For seamless looping:

```text
CMS DATA

[A] [B] [C] [D] [E] [F]

              ↓

FRONTEND TRACK

[A] [B] [C] [D] [E] [F] | [A] [B] [C] [D] [E] [F]
                       →→→
```

The second set is **not CMS data**.

---

# CMS vs Frontend Responsibility

| Responsibility              | Strapi | Frontend |
| --------------------------- | :----: | :------: |
| Upload logo                 |    ✅   |          |
| Logo ordering               |    ✅   |          |
| Standard media alt metadata |    ✅   |          |
| Autoplay                    |        |     ✅    |
| Slow speed                  |        |     ✅    |
| Left → Right motion         |        |     ✅    |
| Infinite loop               |        |     ✅    |
| Logo track duplication      |        |     ✅    |
| Logo sizing                 |        |     ✅    |
| Aspect-ratio preservation   |        |     ✅    |
| Horizontal gaps             |        |     ✅    |
| Arrow UI                    |        |     ✅    |
| Arrow interaction           |        |     ✅    |
| Responsive layout           |        |     ✅    |
| Reduced-motion handling     |        |     ✅    |

---

# Mandatory Coding-Agent Rules

1. Create `home-press` immediately after `home-testimonials`.
2. Section content is an ordered collection of **uploaded logo images only**.
3. Do not add unnecessary per-logo content fields in Strapi.
4. Autoplay starts automatically.
5. Motion must be **slow**.
6. Track moves **left → right**.
7. Prefer smooth continuous movement instead of aggressive slide snapping.
8. Implement seamless looping without requiring duplicate Strapi entries.
9. Preserve every logo's original aspect ratio.
10. Never use `cover` cropping for publication logos.
11. Do not recolor brand logos.
12. Keep left/right chevron visuals shown in the reference; manual behavior requires confirmation.
13. Prevent page-level horizontal overflow.
14. Respect `prefers-reduced-motion`.
15. Strapi controls which logos appear and their order; frontend controls all slider behavior and geometry.
