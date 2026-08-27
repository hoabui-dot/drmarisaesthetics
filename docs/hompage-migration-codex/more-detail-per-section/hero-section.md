# UI Implementation Spec — Homepage Hero

## 1. Identity

| Field                       | Value                                                                         |
| --------------------------- | ----------------------------------------------------------------------------- |
| Route                       | `/`                                                                           |
| Section ID                  | `home-hero`                                                                   |
| Section name                | `Homepage Hero`                                                               |
| Screenshot scope            | Header/navigation + complete desktop hero area visible in supplied screenshot |
| Target viewport             | `1034 × 666 px` screenshot raster                                             |
| Primary implementation goal | Reproduce the supplied desktop screenshot with maximum visual fidelity        |
| Overall evidence quality    | High for desktop composition; Low for responsive and interaction behavior     |

> **Critical implementation note:** The header must **not have its own visible background surface**. It visually sits directly on top of the hero composition. Do not introduce a white header bar, translucent backdrop, blur, border, divider, or shadow unless another design source explicitly requires it.

---

## 2. Scope Boundary

### Included in this spec

* OBSERVED — Global header as it appears inside the supplied hero screenshot.
* OBSERVED — Smilux brand/logo at top-left.
* OBSERVED — Desktop navigation items:

  * `HOME`
  * `ABOUT US`
  * `SERVICES`
  * `TECHNOLOGY`
  * `PRICING`
  * `BLOG`
  * `CONTACT`
* OBSERVED — Header CTA `BOOK APPOINTMENT`.
* OBSERVED — Active `HOME` navigation treatment.
* OBSERVED — Hero eyebrow.
* OBSERVED — Two-line hero heading.
* OBSERVED — Introductory paragraph.
* OBSERVED — Primary and secondary hero CTAs.
* OBSERVED — Patient avatar/social-proof group.
* OBSERVED — Five-star rating and `4.9/5`.
* OBSERVED — Dental clinic hero visual covering the right side and extending behind the composition.
* OBSERVED — Dental chair, dental light, monitor, dental instruments, counter and surrounding clinic environment visible in the hero asset.
* OBSERVED — Smilux branding visible on the right-side clinic wall.
* OBSERVED — Large rounded lower-right section boundary.

### Excluded from this spec

* UNKNOWN — Sections below the supplied screenshot.
* UNKNOWN — Sticky-header behavior.
* UNKNOWN — Header appearance after scrolling.
* UNKNOWN — Mobile navigation implementation.
* UNKNOWN — Appointment booking destination or workflow.
* UNKNOWN — Video destination, modal, player or embedded-video behavior.
* UNKNOWN — Hover/pressed animation.
* UNKNOWN — Page transition behavior.
* UNKNOWN — API/business logic.
* UNKNOWN — Exact implementation technology.

### Section start and end

* Start: OBSERVED — At the top edge of the supplied screenshot, including the transparent/no-background header.
* End: OBSERVED — At the bottom edge of the hero visual where the large rounded lower-right boundary is visible.
* Cropped/partially visible content: OBSERVED — No next-page section is clearly visible; only the hero boundary is shown.

---

## 3. Evidence and Confidence

| Item                    | Status   | Evidence / reason                                                                                                        |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| Section boundary        | OBSERVED | Entire screenshot represents the header + hero composition; lower-right rounded ending is visible.                       |
| Desktop layout          | OBSERVED | Desktop screenshot provides direct spatial evidence.                                                                     |
| Copy/text content       | OBSERVED | Main copy and navigation labels are readable.                                                                            |
| Typography values       | INFERRED | Visual hierarchy is clear, but font family and exact design-token values cannot be extracted from the raster screenshot. |
| Colors                  | INFERRED | Blue/navy/white system is directly visible, but exact source hex tokens are unavailable.                                 |
| Assets                  | OBSERVED | Logo, clinic visual, icons, avatars and stars are visible. Exact source files are unavailable.                           |
| Interaction states      | UNKNOWN  | Screenshot only shows default state plus active `HOME` navigation state.                                                 |
| Responsive behavior     | UNKNOWN  | Only one desktop viewport is supplied.                                                                                   |
| Header transparency     | OBSERVED | No independent header-colored rectangle, divider, border, blur or shadow is visible.                                     |
| Active navigation state | OBSERVED | `HOME` is blue and has a short blue underline.                                                                           |

---

## 4. OCR Content Inventory

> Preserve all readable text exactly as shown. Mark uncertainty explicitly.

| Element ID                | Visible text                                                                                                                                                                            | Text type                | OCR confidence | Notes                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------- | ------------------------------------------------------------------------------------ |
| `brand-logo-header`       | `Smilux`                                                                                                                                                                                | Brand                    | High           | Stylized logo; should use original vector asset rather than recreating as text.      |
| `nav-home`                | `HOME`                                                                                                                                                                                  | Navigation               | High           | Active item.                                                                         |
| `nav-about`               | `ABOUT US`                                                                                                                                                                              | Navigation               | High           | Desktop navigation.                                                                  |
| `nav-services`            | `SERVICES`                                                                                                                                                                              | Navigation               | High           | Desktop navigation.                                                                  |
| `nav-technology`          | `TECHNOLOGY`                                                                                                                                                                            | Navigation               | High           | Desktop navigation.                                                                  |
| `nav-pricing`             | `PRICING`                                                                                                                                                                               | Navigation               | High           | Desktop navigation.                                                                  |
| `nav-blog`                | `BLOG`                                                                                                                                                                                  | Navigation               | High           | Desktop navigation.                                                                  |
| `nav-contact`             | `CONTACT`                                                                                                                                                                               | Navigation               | High           | Desktop navigation.                                                                  |
| `header-book-appointment` | `BOOK APPOINTMENT`                                                                                                                                                                      | CTA                      | High           | Calendar icon precedes label.                                                        |
| `hero-eyebrow`            | `PREMIUM DENTAL CARE & SERVICES`                                                                                                                                                        | Label                    | High           | Uppercase blue text.                                                                 |
| `hero-h1-line-1`          | `Your Smile,`                                                                                                                                                                           | Heading                  | High           | Navy/dark blue.                                                                      |
| `hero-h1-line-2`          | `Our Passion`                                                                                                                                                                           | Heading                  | High           | Bright blue.                                                                         |
| `hero-body`               | `At Smilux Dental, we combine advanced technology, experienced professionals, and a patient-first approach to deliver safe, lasting, and beautiful smiles for you and your loved ones.` | Paragraph                | High           | Visually rendered as four lines in supplied desktop screenshot.                      |
| `hero-primary-cta`        | `BOOK APPOINTMENT`                                                                                                                                                                      | CTA                      | High           | Calendar icon precedes label.                                                        |
| `hero-secondary-cta`      | `WATCH VIDEO`                                                                                                                                                                           | CTA                      | High           | Circular play icon precedes label.                                                   |
| `social-proof-label`      | `Trusted by 10,000+ Patients`                                                                                                                                                           | Label                    | High           | Positioned beside avatar group.                                                      |
| `social-proof-rating`     | `4.9/5`                                                                                                                                                                                 | Label                    | High           | Displayed beside five blue stars.                                                    |
| `wall-logo`               | `Smilux`                                                                                                                                                                                | Brand inside hero visual | High           | UNKNOWN whether this branding is baked into the clinic image or separately overlaid. |

---

## 5. Layout Anatomy

### 5.1 Global geometry

| Property            | Specification                                                                                                                 | Status   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------- |
| Section width       | Full supplied viewport: `1034 px`                                                                                             | OBSERVED |
| Section height      | Full supplied screenshot: `666 px`                                                                                            | OBSERVED |
| Background behavior | Light clinic visual with strong white/light treatment on left and primary photographic detail on right                        | OBSERVED |
| Content container   | Main content aligned to a consistent left gutter; header spans almost full width                                              | OBSERVED |
| Horizontal gutters  | Left content begins at approximately `42–44 px estimated`; header logo approximately `35–38 px estimated` from left           | INFERRED |
| Main layout model   | Hero copy occupies left region while clinic visual dominates right region; visual overlap/fade prevents a hard column divider | OBSERVED |
| Vertical alignment  | Header occupies top area; hero copy begins well below header and is vertically centered in left-middle region                 | OBSERVED |
| Overflow / cropping | Right-side visual reaches viewport edge; lower-right edge uses a large rounded clipping treatment                             | OBSERVED |
| Header background   | Transparent/no independent surface                                                                                            | OBSERVED |
| Header height       | Approximately `80–88 px estimated` visual zone                                                                                | INFERRED |

### 5.2 Structure tree

```text
Section: home-hero
├── Header / desktop navigation
│   ├── Smilux logo
│   ├── Primary navigation
│   │   ├── HOME — active
│   │   ├── ABOUT US
│   │   ├── SERVICES
│   │   ├── TECHNOLOGY
│   │   ├── PRICING
│   │   ├── BLOG
│   │   └── CONTACT
│   └── BOOK APPOINTMENT CTA
│
├── Hero visual layer
│   ├── Dental clinic / chair visual
│   └── Smilux branding visible inside clinic scene
│
└── Hero content
    ├── Eyebrow
    ├── H1
    │   ├── Your Smile,
    │   └── Our Passion
    ├── Body copy
    ├── CTA row
    │   ├── BOOK APPOINTMENT
    │   └── WATCH VIDEO
    └── Social proof
        ├── Four overlapping patient avatars
        ├── Trusted by 10,000+ Patients
        ├── Five star icons
        └── 4.9/5
```

### 5.3 Spatial relationships

| Element             | Position and dimensions                                     | Alignment relationship                                          | Spacing relationship                                                      | Status   |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| Header              | Top of hero; almost full viewport width                     | Logo left, navigation center/right, CTA far right               | Header content vertically centered in top region                          | OBSERVED |
| Header logo         | Approximately `130 × 40 px estimated` visible footprint     | Aligned near left page gutter                                   | Clear gap before first navigation item                                    | INFERRED |
| Navigation          | Horizontal row                                              | Located between logo and appointment CTA                        | Items use visually consistent horizontal gaps                             | OBSERVED |
| Navigation item gap | Approximately `28–36 px estimated` depending on label width | Baseline-aligned                                                | Repeated horizontal rhythm                                                | INFERRED |
| Header CTA          | Approximately `168 × 42 px estimated`                       | Right-aligned within header                                     | Small margin from right viewport edge                                     | INFERRED |
| Hero content block  | Left ~40–42% of viewport                                    | Shares left alignment with eyebrow, H1, paragraph and CTA group | Begins below header with substantial whitespace                           | INFERRED |
| Eyebrow             | Starts around x=`43 px estimated`                           | Same left edge as H1 and body                                   | Positioned above H1                                                       | INFERRED |
| H1                  | Roughly `300–370 px estimated` content width                | Same left anchor as eyebrow                                     | Tight gap after eyebrow; two deliberate lines                             | INFERRED |
| Body                | Roughly `350–390 px estimated` width                        | Same left anchor as heading                                     | Medium vertical gap below H1                                              | INFERRED |
| CTA row             | Horizontal                                                  | Same left anchor as body                                        | Primary and secondary CTA separated by approximately `18–22 px estimated` | INFERRED |
| Social proof        | Horizontal composition below CTA row                        | Same left region                                                | Noticeably larger gap from CTAs than CTA-to-CTA gap                       | OBSERVED |
| Avatar group        | Four circular overlapping portraits                         | Left side of social-proof row                                   | Each subsequent avatar partially overlaps preceding avatar                | OBSERVED |
| Social text         | Immediately right of avatar group                           | Two visual rows                                                 | First row patient count; second row stars + rating                        | OBSERVED |
| Clinic visual       | Dominates right ~55–60% of screenshot                       | Dental chair forms main visual anchor                           | Extends beneath header and to bottom edge                                 | INFERRED |
| Dental monitor      | Upper-middle/right visual region                            | Above dental chair                                              | Part of hero visual composition                                           | OBSERVED |

### 5.4 Layering and overlap

| Layer order | Element                                        | Behavior                                                             | Status                                                                         |
| ----------: | ---------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
|           1 | Hero clinic visual / light background          | Fills hero visual area                                               | OBSERVED                                                                       |
|           2 | White/light fade or equivalent image treatment | Creates sufficient low-detail area behind left-side copy             | INFERRED — cannot determine whether baked into the image or created separately |
|           3 | Hero content                                   | Appears above background visual                                      | OBSERVED                                                                       |
|           4 | Header/navigation                              | Sits above the hero visual without an independent background surface | OBSERVED                                                                       |
|           5 | CTA icons/text and active navigation underline | Foreground detail                                                    | OBSERVED                                                                       |

**Header-specific rule:** the header should visually behave as an overlay/integrated top region of the hero. A separate white rectangle behind the navigation would materially diverge from the reference.

---

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate                  | Usage                    | Value / description                                          | Status                      |
| -------------------------------- | ------------------------ | ------------------------------------------------------------ | --------------------------- |
| `color/surface/hero`             | Hero base                | White to very pale blue/gray photographic environment        | OBSERVED                    |
| `color/surface/header`           | Header                   | Transparent; hero background remains visible underneath      | OBSERVED                    |
| `color/text/heading-primary`     | `Your Smile,`            | Very dark navy                                               | OBSERVED; exact hex UNKNOWN |
| `color/text/heading-accent`      | `Our Passion`            | Saturated royal/medical blue                                 | OBSERVED; exact hex UNKNOWN |
| `color/text/body`                | Hero paragraph           | Muted dark blue/navy                                         | OBSERVED; exact hex UNKNOWN |
| `color/text/navigation`          | Inactive nav items       | Dark navy                                                    | OBSERVED                    |
| `color/action/navigation-active` | `HOME` + underline       | Bright blue                                                  | OBSERVED                    |
| `color/action/primary`           | CTA backgrounds          | Strong blue; raster suggests slight tonal variation/gradient | INFERRED                    |
| `color/action/secondary`         | Watch Video              | White/light surface with blue outline                        | OBSERVED                    |
| `color/border/secondary-action`  | Watch Video border       | Bright blue                                                  | OBSERVED                    |
| `color/rating/star`              | Five stars               | Bright blue                                                  | OBSERVED                    |
| `color/text/on-action`           | Primary CTA labels/icons | White                                                        | OBSERVED                    |

### 6.2 Typography

| Element            | OCR text reference               | Font family | Weight              | Size                 | Line-height          | Letter spacing                    | Color              | Status   |
| ------------------ | -------------------------------- | ----------- | ------------------- | -------------------- | -------------------- | --------------------------------- | ------------------ | -------- |
| Header navigation  | `HOME`, etc.                     | UNKNOWN     | `600–700 estimated` | `10–11 px estimated` | `14–16 px estimated` | Slight positive spacing estimated | Navy / active blue | INFERRED |
| Header CTA         | `BOOK APPOINTMENT`               | UNKNOWN     | `600–700 estimated` | `10–11 px estimated` | UNKNOWN              | UNKNOWN                           | White              | INFERRED |
| Eyebrow            | `PREMIUM DENTAL CARE & SERVICES` | UNKNOWN     | `600–700 estimated` | `12–13 px estimated` | `16–18 px estimated` | Positive tracking visible         | Bright blue        | INFERRED |
| H1 line 1          | `Your Smile,`                    | UNKNOWN     | `700 estimated`     | `58–64 px estimated` | `62–68 px estimated` | Tight/neutral                     | Dark navy          | INFERRED |
| H1 line 2          | `Our Passion`                    | UNKNOWN     | `700 estimated`     | Same as line 1       | Same as line 1       | Tight/neutral                     | Bright blue        | INFERRED |
| Body               | Hero paragraph                   | UNKNOWN     | `400–500 estimated` | `13–15 px estimated` | `26–28 px estimated` | Neutral                           | Muted navy         | INFERRED |
| Primary CTA        | `BOOK APPOINTMENT`               | UNKNOWN     | `600 estimated`     | `10–12 px estimated` | UNKNOWN              | UNKNOWN                           | White              | INFERRED |
| Secondary CTA      | `WATCH VIDEO`                    | UNKNOWN     | `600 estimated`     | `10–12 px estimated` | UNKNOWN              | UNKNOWN                           | Bright blue/navy   | INFERRED |
| Social proof label | `Trusted by 10,000+ Patients`    | UNKNOWN     | `500–600 estimated` | `12–13 px estimated` | UNKNOWN              | UNKNOWN                           | Muted navy         | INFERRED |
| Rating             | `4.9/5`                          | UNKNOWN     | `600 estimated`     | `12–13 px estimated` | UNKNOWN              | UNKNOWN                           | Navy               | INFERRED |

**Typography constraint:** Do not substitute a guessed font such as Inter, Poppins, Manrope, Montserrat or similar purely based on visual resemblance. The actual project/Figma font must be confirmed.

### 6.3 Borders, radius, effects

| Element                | Border                                 | Radius                                                      | Shadow / blur        | Opacity                | Status              |
| ---------------------- | -------------------------------------- | ----------------------------------------------------------- | -------------------- | ---------------------- | ------------------- |
| Header                 | None visible                           | None visible as a separate container                        | None visible         | Transparent background | OBSERVED            |
| Active HOME            | Short bottom blue rule                 | N/A                                                         | None visible         | 100%                   | OBSERVED            |
| Header appointment CTA | No visible border                      | Fully rounded / pill-like, approximately half button height | Very subtle or none  | 100%                   | OBSERVED / INFERRED |
| Hero primary CTA       | No visible border                      | Fully rounded / pill-like                                   | Very subtle or none  | 100%                   | OBSERVED / INFERRED |
| Hero secondary CTA     | Thin blue outline                      | Fully rounded / pill-like                                   | None visible         | 100%                   | OBSERVED            |
| Play-icon circle       | Thin blue outline                      | Circular                                                    | None visible         | 100%                   | OBSERVED            |
| Avatar portraits       | Light edge separation between overlaps | Circular                                                    | None clearly visible | 100%                   | OBSERVED            |
| Hero lower-right       | N/A                                    | Large corner radius, approximately `60–80 px estimated`     | None visible         | 100%                   | INFERRED            |

### 6.4 Icons and decoration

| Element ID              | Description                                                    | Asset type    | Size / placement              | Source required                                   | Status   |
| ----------------------- | -------------------------------------------------------------- | ------------- | ----------------------------- | ------------------------------------------------- | -------- |
| `header-logo`           | Stylized Smilux wordmark                                       | SVG preferred | Top-left                      | Figma export / official asset                     | OBSERVED |
| `calendar-icon-header`  | Small calendar icon before appointment text                    | SVG preferred | Left side inside header CTA   | Existing icon asset / Figma export                | OBSERVED |
| `calendar-icon-hero`    | Calendar icon before hero appointment label                    | SVG preferred | Left side inside primary CTA  | Existing icon asset / Figma export                | OBSERVED |
| `play-icon`             | Play triangle inside circular outline                          | SVG preferred | Left side of `WATCH VIDEO`    | Existing icon asset / recreate if source confirms | OBSERVED |
| `rating-stars`          | Five blue stars                                                | SVG preferred | Below social-proof label      | Existing icon asset                               | OBSERVED |
| `patient-avatar-01..04` | Four small overlapping patient headshots                       | Raster        | Lower-left social proof       | Figma export / provided images                    | OBSERVED |
| `hero-clinic-visual`    | Bright dental clinic scene with chair, display and instruments | Raster        | Right/background area         | Original Figma asset required                     | OBSERVED |
| `wall-logo`             | Smilux branding inside clinic visual                           | UNKNOWN       | Upper-right/right-center wall | Determine whether embedded in hero asset          | UNKNOWN  |

---

## 7. Asset Manifest

| Asset ID                   | Visible description             | Required format                       | Aspect ratio / crop                   | Placement                    | Alt text requirement                                                             | Status   |
| -------------------------- | ------------------------------- | ------------------------------------- | ------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------- | -------- |
| `asset-logo-smilux`        | Header Smilux wordmark          | SVG preferred                         | Preserve original aspect ratio        | Header top-left              | `Smilux` if logo is an informative link                                          | OBSERVED |
| `asset-hero-dental-clinic` | Full dental clinic/chair visual | WebP/JPG/PNG based on original source | Landscape; preserve exact source crop | Hero background/right visual | Empty alt if purely decorative; purposeful alt if treated as informative content | OBSERVED |
| `asset-avatar-01`          | Patient portrait                | WebP/PNG/JPG                          | Square → circular crop                | Social proof                 | Empty alt if purely decorative proof imagery                                     | OBSERVED |
| `asset-avatar-02`          | Patient portrait                | WebP/PNG/JPG                          | Square → circular crop                | Social proof                 | Same rule                                                                        | OBSERVED |
| `asset-avatar-03`          | Patient portrait                | WebP/PNG/JPG                          | Square → circular crop                | Social proof                 | Same rule                                                                        | OBSERVED |
| `asset-avatar-04`          | Patient portrait                | WebP/PNG/JPG                          | Square → circular crop                | Social proof                 | Same rule                                                                        | OBSERVED |
| `asset-icon-calendar`      | Calendar line icon              | SVG                                   | Square                                | Appointment CTAs             | Decorative if adjacent label fully describes action                              | OBSERVED |
| `asset-icon-play`          | Circular/play icon              | SVG                                   | Square/circular                       | Watch Video CTA              | Decorative if adjacent label describes action                                    | OBSERVED |
| `asset-icon-star`          | Rating star                     | SVG                                   | Square                                | Social proof rating          | Decorative when rating has accessible text                                       | OBSERVED |

### Asset handling rules

* Do not recreate the dental clinic scene from individual generic stock images.
* Obtain the exact hero asset from Figma/source files before attempting final 95% screenshot matching.
* Verify whether the white/light left-side fade is:

  * baked into the hero image,
  * a separate gradient overlay,
  * or generated by another compositing layer.
* Do not duplicate the wall `Smilux` logo if it already exists inside the exported clinic image.
* Use the original Smilux logo vector; do not approximate the wordmark with normal text.
* Preserve the original hero asset focal position: dental chair and monitor must remain in the same visual region.
* Avoid arbitrary crop changes that shift the chair, monitor or dental lamp relative to the copy.

---

## 8. Component Contract

### 8.1 Recommended component boundary

| Component           | Responsibility                                                   | Reusable?             | Evidence                                      | Status   |
| ------------------- | ---------------------------------------------------------------- | --------------------- | --------------------------------------------- | -------- |
| `SiteHeader`        | Logo, desktop navigation, active item and header appointment CTA | Yes                   | Distinct header UI visible above hero content | INFERRED |
| `PrimaryNavigation` | Render the seven visible navigation items                        | Yes                   | Repeated nav-link structure                   | INFERRED |
| `AppointmentCTA`    | Calendar icon + `BOOK APPOINTMENT` action treatment              | Yes                   | Same action appears in header and hero        | INFERRED |
| `HeroContent`       | Eyebrow, H1, body copy and CTA row                               | No / section-specific | Directly visible hero content group           | INFERRED |
| `VideoCTA`          | Play icon + `WATCH VIDEO`                                        | Potentially           | Distinct secondary action                     | INFERRED |
| `SocialProof`       | Avatars, trust text, stars and rating                            | Potentially           | Visually grouped unit                         | INFERRED |
| `HeroVisual`        | Hero dental-clinic media composition                             | No / section-specific | Dominant right-side asset                     | INFERRED |

**Header architecture note:** Even if `SiteHeader` is a reusable/global component outside the hero's semantic DOM, its **visual mode for this route must be transparent/no-background** to reproduce the screenshot.

### 8.2 Data model

| Field                     | Type                     | Required | Visible evidence               | Notes                                                         |
| ------------------------- | ------------------------ | -------- | ------------------------------ | ------------------------------------------------------------- |
| `logoAsset`               | Asset reference          | Yes      | Header logo visible            | Use official Smilux logo.                                     |
| `navigationItems`         | Collection               | Yes      | Seven navigation items visible | Labels must preserve OCR content.                             |
| `navigationItem.label`    | Text                     | Yes      | Visible nav copy               | HOME, ABOUT US, SERVICES, TECHNOLOGY, PRICING, BLOG, CONTACT. |
| `navigationItem.isActive` | Boolean-like state       | Yes      | HOME is visibly active         | Destination itself UNKNOWN.                                   |
| `headerAppointmentLabel`  | Text                     | Yes      | Header CTA visible             | `BOOK APPOINTMENT`.                                           |
| `eyebrow`                 | Text                     | Yes      | Visible                        | Preserve exact copy.                                          |
| `headingLine1`            | Text                     | Yes      | Visible                        | `Your Smile,`.                                                |
| `headingLine2`            | Text                     | Yes      | Visible                        | `Our Passion`.                                                |
| `bodyCopy`                | Text                     | Yes      | Visible                        | Preserve exact copy.                                          |
| `primaryCtaLabel`         | Text                     | Yes      | Visible                        | `BOOK APPOINTMENT`.                                           |
| `secondaryCtaLabel`       | Text                     | Yes      | Visible                        | `WATCH VIDEO`.                                                |
| `socialProofLabel`        | Text                     | Yes      | Visible                        | `Trusted by 10,000+ Patients`.                                |
| `ratingValue`             | Text/number presentation | Yes      | Visible                        | `4.9/5`.                                                      |
| `ratingStars`             | Count                    | Yes      | Five visible stars             | Visually 5.                                                   |
| `patientAvatars`          | Asset collection         | Yes      | Four portraits visible         | Four assets required for exact match.                         |
| `heroVisualAsset`         | Asset reference          | Yes      | Clinic visual visible          | Exact Figma export required.                                  |

### 8.3 Content behavior

* Static content:

  * OBSERVED — All supplied copy appears static in the screenshot.
  * OBSERVED — Header has seven text navigation items plus one appointment CTA.
  * OBSERVED — Active navigation item is `HOME`.

* Configurable content:

  * INFERRED — Navigation labels and destinations should be data-driven rather than duplicated in markup.
  * INFERRED — Appointment label/action may be shared by the header and hero.
  * INFERRED — Hero copy, rating and patient assets should be configurable if the project architecture already supports content configuration.

* Unknown data/API behavior:

  * UNKNOWN — CMS source.
  * UNKNOWN — API source.
  * UNKNOWN — Appointment booking mechanism.
  * UNKNOWN — Video source.
  * UNKNOWN — Whether rating/patient count is dynamic.

---

## 9. Interaction States

| Element                   | Default evidence          | Hover   | Active                            | Focus              | Disabled | Link/action destination | Status                      |
| ------------------------- | ------------------------- | ------- | --------------------------------- | ------------------ | -------- | ----------------------- | --------------------------- |
| Header logo               | Visible                   | UNKNOWN | UNKNOWN                           | Must be accessible | UNKNOWN  | UNKNOWN                 | OBSERVED / UNKNOWN behavior |
| `HOME`                    | Blue text + underline     | UNKNOWN | Active state visible              | Must be accessible | UNKNOWN  | UNKNOWN                 | OBSERVED                    |
| Other navigation items    | Dark/navy text            | UNKNOWN | Active styling inferred from HOME | Must be accessible | UNKNOWN  | UNKNOWN                 | OBSERVED / INFERRED         |
| Header `BOOK APPOINTMENT` | Filled blue pill          | UNKNOWN | UNKNOWN                           | Must be accessible | UNKNOWN  | UNKNOWN                 | OBSERVED                    |
| Hero `BOOK APPOINTMENT`   | Filled blue pill          | UNKNOWN | UNKNOWN                           | Must be accessible | UNKNOWN  | UNKNOWN                 | OBSERVED                    |
| `WATCH VIDEO`             | White/light outlined pill | UNKNOWN | UNKNOWN                           | Must be accessible | UNKNOWN  | UNKNOWN                 | OBSERVED                    |

### Interaction constraints

* Do not invent animation, carousel behavior, modal behavior, form submission, or navigation destination.
* If an element visually resembles a button but behavior is not known, classify it as `action destination UNKNOWN`.
* Do not invent a sticky-header transition.
* Do not change the transparent header to an opaque background on initial load without separate evidence.
* Do not invent hover transformations, scaling, glow or underline animations.
* `HOME` active state must remain visibly distinct from inactive navigation items.

---

## 10. Responsive Specification

### 10.1 Evidence available

* Desktop evidence: OBSERVED — One screenshot at `1034 × 666 px`.
* Tablet evidence: UNKNOWN.
* Mobile evidence: UNKNOWN.

### 10.2 Required desktop behavior

* Header remains visually integrated into the hero with **no separate background**.
* Header logo stays at the left.
* Navigation remains a single horizontal row.
* Navigation ordering must remain:
  `HOME → ABOUT US → SERVICES → TECHNOLOGY → PRICING → BLOG → CONTACT`.
* Header appointment CTA remains on the far right.
* `HOME` remains blue and underlined.
* Hero content maintains a left-side composition.
* `Your Smile,` and `Our Passion` stay on separate lines.
* Clinic chair/monitor composition remains dominant on the right.
* Body copy must not extend far enough right to visually collide with the chair/monitor area.
* CTA buttons remain side-by-side.
* Social proof stays below the CTA row.
* The lower-right hero rounding must remain visible.

### 10.3 Proposed responsive behavior

| Breakpoint range                     | Layout behavior                                                    | Typography behavior        | Image/asset behavior                   | Status and rationale      |
| ------------------------------------ | ------------------------------------------------------------------ | -------------------------- | -------------------------------------- | ------------------------- |
| Desktop matching supplied screenshot | Horizontal header; left hero content; right-dominant clinic visual | Match screenshot hierarchy | Preserve supplied crop and focal point | OBSERVED                  |
| Tablet                               | UNKNOWN                                                            | UNKNOWN                    | UNKNOWN                                | No tablet design evidence |
| Mobile                               | UNKNOWN                                                            | UNKNOWN                    | UNKNOWN                                | No mobile design evidence |

### 10.4 Responsive assumptions requiring approval

* Whether desktop navigation collapses at narrower widths is UNKNOWN.
* Exact breakpoint values are UNKNOWN.
* Do not introduce a hamburger/menu icon without mobile/tablet design evidence.
* Do not assume the header becomes opaque on mobile.
* Do not assume the hero image moves below the text.
* Do not assume CTAs stack vertically.
* Do not assume H1 scale values.
* Do not remove patient social proof merely to save space.
* Do not use the desktop screenshot as evidence for a mobile crop.

---

## 11. Semantic HTML and Accessibility

### Recommended structure

* Landmark:

  * Header should use a semantic site-header landmark if implemented as the global header.
  * Navigation links should live inside a navigation landmark.
  * Hero should be a semantic section associated with its H1.

* Heading hierarchy:

  * `Your Smile, Our Passion` represents one H1 despite the visual color/line split.
  * Do not expose the two visual lines as two separate headings to assistive technology.

* Interactive elements:

  * Navigation destinations should use semantic links when they navigate.
  * Appointment and Watch Video controls should use the semantic element appropriate to their confirmed action.

* Image semantics:

  * Header logo should have meaningful accessible naming.
  * Hero clinic image may be decorative if it conveys no essential information.
  * Patient avatar images may use empty alt text if they serve only decorative social-proof presentation.

* Keyboard behavior:

  * All navigation links and CTA controls must be keyboard reachable.

* Focus visibility:

  * All interactive elements require visible focus indication.
  * Focus style must not depend solely on subtle color changes.

* Contrast risks:

  * Header is transparent over a photographic hero background.
  * Ensure dark navigation remains readable where background detail appears behind the header.
  * Do not solve contrast by adding a visible opaque header background unless approved, because that would alter the reference design.
  * Prefer preserving the reference background composition/asset so the navigation sits over sufficiently light pixels.

* Screen-reader-only content required:

  * Rating should expose meaningful rating information rather than relying only on five decorative star icons.

* Form labels, if applicable:

  * Not applicable; no form appears in the supplied screenshot.

### Accessibility constraints

* Use semantic HTML; do not use clickable `div` elements.
* All interactive elements require visible keyboard focus.
* Decorative images must use empty alt text; informative images require purposeful alt text.
* Do not use OCR-derived text as alt text unless it describes the image accurately.
* Do not create seven visually separate navigation controls that lack a navigation landmark.
* Preserve one logical H1 even though the two lines use different colors.

---

## 12. Implementation Constraints

* Use existing semantic design tokens if the codebase provides them.
* Do not hard-code colors, arbitrary spacing, font sizes, radius, shadows, or image URLs when a project token/asset exists.
* Do not invent missing UI states.
* Keep section-specific styles scoped to this section.
* Build reusable primitives only where repeated evidence exists.
* Preserve copy exactly as recorded in the OCR inventory unless a product owner provides corrected copy.
* If an item is marked `UNKNOWN`, stop and request clarification rather than silently deciding.
* **Header initial state must be transparent/no-background.**
* Do not add:

  * white header surface,
  * translucent header surface,
  * backdrop blur,
  * glassmorphism,
  * bottom border,
  * separator,
  * drop shadow.
* Do not remove or reorder header items.
* Do not replace the active `HOME` underline with a pill/tab background.
* Do not vertically detach the header from the hero by introducing an extra top section.
* Header and hero must visually read as **one continuous composition**.
* Do not approximate the hero dental scene using unrelated stock images.
* Do not add decorative gradients until it is established whether the fade visible in the screenshot is part of the original asset.
* Preserve explicit H1 line break:

  * `Your Smile,`
  * `Our Passion`
* Maintain the visual distinction between dark-navy first line and blue second line.
* Keep both `BOOK APPOINTMENT` CTAs visually related, but do not assume their dimensions are exactly identical.
* Do not alter `WATCH VIDEO` into a filled primary-style button.
* Do not introduce extra hero badges, statistics, labels or floating cards.

---

## 13. Visual Acceptance Criteria

The implementation is acceptable only if screenshot comparison at the target desktop viewport confirms:

* [ ] Section boundary matches the `1034 × 666 px` reference screenshot.
* [ ] Container alignment and horizontal gutters match.
* [ ] Header begins directly over the hero composition.
* [ ] **Header has no visible background panel.**
* [ ] **Header has no blur, border, divider or drop shadow.**
* [ ] Smilux logo placement and scale closely match.
* [ ] Header navigation contains exactly the visible items in the supplied order.
* [ ] `HOME` is visually active using blue text and a short blue underline.
* [ ] Header `BOOK APPOINTMENT` CTA position, size and pill geometry match.
* [ ] Navigation spacing is visually consistent with the reference.
* [ ] Header content remains vertically centered within the top visual zone.
* [ ] Hero copy starts at the same visual left edge as the reference.
* [ ] Eyebrow position and capitalization match.
* [ ] H1 line break matches exactly.
* [ ] `Your Smile,` uses the dark navy treatment.
* [ ] `Our Passion` uses the brighter blue treatment.
* [ ] H1 scale and visual weight match as closely as the verified font allows.
* [ ] Body paragraph maintains the same approximate width and four-line desktop flow.
* [ ] Primary and secondary CTA positions and proportions match.
* [ ] `WATCH VIDEO` remains outlined with a circular play treatment.
* [ ] Four patient avatars are present and overlap in the same visual direction.
* [ ] `Trusted by 10,000+ Patients` matches exactly.
* [ ] Five blue stars are visible.
* [ ] `4.9/5` matches exactly.
* [ ] Dental chair remains the dominant lower-right visual anchor.
* [ ] Dental monitor remains above/behind the chair in approximately the same position.
* [ ] Dental lamp remains visible in the upper-right composition.
* [ ] Hero image crop matches the supplied screenshot.
* [ ] Light/white left-side visual treatment provides the same text readability without creating a visible hard image boundary.
* [ ] Lower-right corner rounding matches the reference silhouette.
* [ ] No unsupported UI, text, asset, navigation item or interaction has been invented.
* [ ] All unresolved items remain listed under Open Questions.

---

## 14. Visual Risks

| Risk                                                          | Why it affects fidelity                                                             | Mitigation                                                                        | Priority |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------- |
| Incorrect hero image asset                                    | Chair, monitor, lamp and clinic geometry dominate more than half of the composition | Export exact hero asset from Figma/source                                         | High     |
| Adding a header background                                    | Immediately changes the top-level composition and contradicts screenshot evidence   | Force transparent/no-surface initial header mode                                  | High     |
| Incorrect font                                                | Large H1 makes font differences highly visible                                      | Obtain exact font family/weights from Figma or existing project tokens            | High     |
| Incorrect hero crop                                           | Changes chair/monitor position relative to text                                     | Match source asset dimensions and object positioning using screenshot comparison  | High     |
| Recreating wall logo separately when already baked into image | Produces duplicated branding                                                        | Inspect original hero asset before implementation                                 | High     |
| Wrong navigation spacing                                      | Header is dense and visually precise                                                | Measure against screenshot/Figma rather than generic nav spacing tokens           | Medium   |
| Header text over unintended image detail                      | Transparent header can lose readability                                             | Preserve exact hero asset positioning rather than adding opaque header background | High     |
| Incorrect H1 wrapping                                         | Changes hero height and whitespace                                                  | Preserve the two explicit visual lines                                            | High     |
| Generic CTA icon substitutions                                | Small but visible deviation in both appointment buttons                             | Export or identify exact icon source                                              | Medium   |
| Missing/incorrect avatars                                     | Social proof composition no longer matches                                          | Export all four avatar assets                                                     | Medium   |
| Arbitrary tablet/mobile decisions                             | No supporting screenshots                                                           | Require responsive design confirmation                                            | Medium   |
| Guessing gradient implementation                              | Could create double-fade if fade is already embedded in asset                       | Inspect source asset first                                                        | High     |
| Sticky header assumption                                      | Could introduce a background/state not represented in reference                     | Keep behavior UNKNOWN until supplied                                              | Medium   |

---

## 15. Open Questions

| ID  | Question                                                                                               | Blocking level                                                    | Suggested owner      |
| --- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | -------------------- |
| Q1  | What is the exact font family and font-weight mapping used for navigation, eyebrow, H1, body and CTAs? | Blocking for final visual fidelity                                | Designer             |
| Q2  | Can the original dental-clinic hero asset be exported from Figma at source resolution?                 | Blocking                                                          | Designer             |
| Q3  | Is the white/light fade on the left baked into the hero image or implemented as a separate overlay?    | Blocking                                                          | Designer / Developer |
| Q4  | Is the `Smilux` wall logo part of the clinic image or a separate asset/layer?                          | Blocking                                                          | Designer             |
| Q5  | What are the exact SVG assets for the Smilux logo, calendar, play and star icons?                      | Blocking for final fidelity                                       | Designer             |
| Q6  | What destinations correspond to HOME, ABOUT US, SERVICES, TECHNOLOGY, PRICING, BLOG and CONTACT?       | Blocking for functionality only                                   | Product / Developer  |
| Q7  | What is the destination/behavior of both `BOOK APPOINTMENT` controls?                                  | Blocking for functionality only                                   | Product              |
| Q8  | What is the behavior of `WATCH VIDEO` — navigation, modal, embedded player or external URL?            | Blocking for functionality only                                   | Product              |
| Q9  | Does the header remain transparent while scrolling, or does it have a separate sticky/scrolled state?  | Blocking if sticky behavior is required                           | Designer / Product   |
| Q10 | Are exact desktop design dimensions available from Figma rather than raster measurement?               | Non-blocking for initial implementation; important for 95% target | Designer             |
| Q11 | What are the tablet/mobile layouts?                                                                    | Blocking for responsive implementation                            | Designer             |
| Q12 | What responsive navigation behavior is intended when seven links no longer fit horizontally?           | Blocking for tablet/mobile                                        | Designer             |
| Q13 | Are the four patient portraits individual assets or one composited image?                              | Non-blocking                                                      | Designer             |
| Q14 | Is `Trusted by 10,000+ Patients` static marketing copy or dynamic data?                                | Non-blocking for desktop reproduction                             | Product              |
| Q15 | Is `4.9/5` static or sourced from a review provider/API?                                               | Non-blocking for desktop reproduction                             | Product              |

---

## 16. Handoff Summary

### Safe to implement now

* Desktop header + hero overall composition.
* Transparent/no-background header initial appearance.
* Header logo placement region.
* Seven desktop navigation labels and ordering.
* `HOME` active treatment.
* Header appointment CTA.
* Hero eyebrow.
* Two-line H1 with separate dark-navy and blue treatments.
* Hero body copy.
* Two hero CTA treatments.
* Social-proof layout.
* Four-avatar overlap composition.
* Five-star rating presentation.
* Right-dominant clinic visual composition.
* Large lower-right rounded hero boundary.
* Semantic and accessibility foundations.

### Requires asset export

* Original Smilux logo.
* Dental clinic hero visual.
* Calendar icon.
* Play icon.
* Rating star icon if not already available in the project.
* Four patient avatar assets.
* Confirmation of whether the right-side wall logo is embedded in the hero image.
* Exact font files/reference from the approved design system; do not substitute based solely on screenshot resemblance.

### Requires design/product decision

* Responsive navigation mechanism.
* Tablet layout.
* Mobile layout.
* Scroll/sticky header behavior.
* Appointment destination.
* Watch Video destination/behavior.
* Navigation destinations.
* Exact typography tokens.
* Exact color tokens.
* Whether the hero fade is image-based or implemented separately.

### Do not assume

* Do not assume the header has a white background.
* Do not assume the header has any background at all.
* Do not assume backdrop blur/glassmorphism.
* Do not assume a sticky-header state.
* Do not assume a hamburger menu.
* Do not assume breakpoint values.
* Do not assume the dental image should be reconstructed.
* Do not assume the wall logo is a separate DOM element.
* Do not assume a CSS gradient until the original hero asset has been inspected.
* Do not assume the font family from visual similarity.
* Do not assume CTA destinations.
* Do not assume a video modal.
* Do not assume hover animations.
* Do not alter navigation item order.
* Do not add navigation items that are absent from the screenshot.
* Do not replace the `HOME` underline with a different active-control pattern.
* Do not create a visual gap between header and hero; they must remain one continuous visual composition.
