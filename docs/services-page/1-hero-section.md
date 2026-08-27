# UI Implementation Spec — Services Hero

## 1. Identity

| Field | Value |
|---|---|
| Route | `/services` |
| Section ID | `services-hero` |
| Section name | `Services Hero` |
| Screenshot scope | OBSERVED: desktop hero của trang Services, bao gồm header/navigation nằm overlay phía trên hero, hero copy/CTA bên trái và ảnh phòng khám nha khoa bên phải |
| Target viewport | OBSERVED: screenshot `1421 × 683 px` |
| Primary implementation goal | Reproduce the supplied desktop screenshot with maximum visual fidelity |
| Overall evidence quality | High cho desktop composition/copy; Medium cho typography, exact colors và source assets |

## 2. Scope Boundary

### Included in this spec
- OBSERVED: top navigation/header xuất hiện bên trong visual boundary của hero.
- OBSERVED: logo `Smilux` ở góc trên trái.
- OBSERVED: navigation gồm `HOME`, `ABOUT US`, `SERVICES`, `TECHNOLOGY`, `PRICING`, `BLOG`, `CONTACT`.
- OBSERVED: `SERVICES` là navigation item active.
- OBSERVED: header CTA `BOOK APPOINTMENT`.
- OBSERVED: hero eyebrow `OUR SERVICES`.
- OBSERVED: hero heading `Comprehensive Dental Care for Every Smile`.
- OBSERVED: supporting paragraph.
- OBSERVED: primary CTA `BOOK APPOINTMENT`.
- OBSERVED: secondary CTA `WATCH VIDEO`.
- OBSERVED: hero visual là phòng điều trị nha khoa với ghế nha khoa, đèn, màn hình và thiết bị.
- OBSERVED: màn hình trong hero image hiển thị branding `Smilux DENTAL CLINIC`.
- OBSERVED: background hero chuyển từ vùng trắng bên trái sang ảnh phòng khám bên phải bằng transition/fade mềm.

### Excluded from this spec
- UNKNOWN: section tiếp theo phía dưới.
- UNKNOWN: header có sticky/fixed behavior hay không.
- UNKNOWN: URL của từng navigation item.
- UNKNOWN: appointment flow/modal/page.
- UNKNOWN: video source và video behavior.
- UNKNOWN: hover/active/focus visual ngoài state nhìn thấy.
- UNKNOWN: tablet/mobile design.
- UNKNOWN: animation hoặc image transition.
- UNKNOWN: business/API logic.

### Section start and end
- Start: OBSERVED — hero bắt đầu tại top edge screenshot, bao gồm header/navigation.
- End: INFERRED — hero tiếp tục tới bottom edge screenshot; không có section kế tiếp nhìn thấy.
- Cropped/partially visible content: INFERRED — phần dưới hero có thể bị crop đúng tại viewport fold.

## 3. Evidence and Confidence

| Item | Status | Evidence / reason |
|---|---|---|
| Section boundary | INFERRED | Top boundary rõ; bottom boundary trùng screenshot edge nên exact section height chưa xác nhận |
| Header inclusion | OBSERVED | Header nằm trực tiếp trên hero background/image |
| Desktop layout | OBSERVED | Copy trái + clinic image phải |
| Copy/text content | OBSERVED | Hero và navigation copy đọc được rõ |
| Typography values | INFERRED | Size/weight có thể ước lượng nhưng font metadata không có |
| Colors | INFERRED | Navy/blue/white rõ về hệ màu nhưng exact tokens không xác định |
| Hero image | OBSERVED | Clinic treatment-room image chiếm phần phải |
| Hero image source | UNKNOWN | Không có original image/Figma asset |
| Interaction states | UNKNOWN | Ngoại trừ active nav item |
| Responsive behavior | UNKNOWN | Chỉ có desktop screenshot |

## 4. OCR Content Inventory

> Preserve all readable text exactly as shown. Mark uncertainty explicitly.

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `brand-logo` | Smilux | Logo / brand | High | Top-left |
| `nav-home` | HOME | Navigation | High | |
| `nav-about` | ABOUT US | Navigation | High | |
| `nav-services` | SERVICES | Navigation | High | Active state |
| `nav-technology` | TECHNOLOGY | Navigation | High | |
| `nav-pricing` | PRICING | Navigation | High | |
| `nav-blog` | BLOG | Navigation | High | |
| `nav-contact` | CONTACT | Navigation | High | |
| `header-cta` | BOOK APPOINTMENT | CTA | High | Calendar icon trước label |
| `hero-eyebrow` | OUR SERVICES | Eyebrow | High | Blue uppercase |
| `hero-title` | Comprehensive Dental Care for Every Smile | H1 | High | Hiển thị thành 2 dòng |
| `hero-description` | From advanced treatments to cosmetic enhancements, Smilux Dental provides personalized care using modern technology and a patient-first approach. | Paragraph | High | Hiển thị khoảng 3 dòng |
| `hero-primary-cta` | BOOK APPOINTMENT | CTA | High | Filled blue |
| `hero-secondary-cta` | WATCH VIDEO | CTA / action | High | Play icon trước label |
| `hero-monitor-brand` | Smilux | Image-embedded branding | High | Nằm trong monitor của hero image |
| `hero-monitor-subbrand` | DENTAL CLINIC | Image-embedded branding | Medium | Text nhỏ bên dưới `Smilux` |

## 5. Layout Anatomy

### 5.1 Global geometry

| Property | Specification | Status |
|---|---|---|
| Section width | Full viewport width `1421 px` | OBSERVED |
| Section height | At least `683 px`; screenshot ends while hero image remains visible | OBSERVED / INFERRED |
| Background behavior | Full-bleed composition: white/light surface left blending into clinic image right | OBSERVED |
| Content container | Main header/hero content uses wide centered horizontal bounds with ~`48–75 px estimated` outer gutters | INFERRED |
| Main layout model | Hero copy left + image/background visual right | OBSERVED |
| Hero text region | Roughly left `45–50%` of viewport | INFERRED |
| Hero image region | Roughly right `50–55%`, extending full height and toward center behind fade | INFERRED |
| Header layout | Horizontal logo + centered/right navigation + CTA | OBSERVED |
| Vertical alignment | Hero copy vertically centered below header | OBSERVED / INFERRED |
| Overflow / cropping | Hero image cropped at right and bottom viewport edges | OBSERVED |

### 5.2 Structure tree

Section: services-hero
├── Hero visual/background layer
│   ├── White/light left surface
│   ├── Clinic treatment-room image
│   └── Soft white-to-image transition
│
├── Header
│   ├── Brand
│   │   └── Smilux logo
│   ├── Primary navigation
│   │   ├── HOME
│   │   ├── ABOUT US
│   │   ├── SERVICES [active]
│   │   ├── TECHNOLOGY
│   │   ├── PRICING
│   │   ├── BLOG
│   │   └── CONTACT
│   └── Header appointment CTA
│       ├── Calendar icon
│       └── BOOK APPOINTMENT
│
└── Hero content
    ├── Eyebrow
    │   └── OUR SERVICES
    ├── H1
    │   └── Comprehensive Dental Care for Every Smile
    ├── Supporting paragraph
    └── Hero actions
        ├── Primary appointment CTA
        │   ├── Calendar icon
        │   └── BOOK APPOINTMENT
        └── Secondary video action
            ├── Play-circle icon
            └── WATCH VIDEO

### 5.3 Spatial relationships

| Element | Position and dimensions | Alignment relationship | Spacing relationship | Status |
|---|---|---|---|---|
| Header | Full-width horizontal row near top | Vertically centered items | ~`20–25 px estimated` top offset | INFERRED |
| Logo | Top-left | Independent left anchor | ~`48 px estimated` from viewport left | INFERRED |
| Navigation | Upper center/right | Single horizontal row | Regular ~`35–40 px estimated` item spacing | INFERRED |
| Header CTA | Top-right | Same vertical center as navigation | ~`47 px estimated` from right edge | INFERRED |
| Hero copy block | Left-middle | Left aligned | Starts ~`73 px estimated` from left | INFERRED |
| Eyebrow | Above H1 | Same left edge as H1 | ~`27–30 px estimated` before H1 | INFERRED |
| H1 | ~`570 px estimated` maximum visual width | Same left edge as paragraph/actions | Two lines | OBSERVED / INFERRED |
| Description | ~`500 px estimated` max width | Same left alignment | ~`23–28 px estimated` below H1 | INFERRED |
| Actions | Horizontal row | Same left edge as content | ~`30–35 px estimated` below paragraph | INFERRED |
| Primary CTA | ~`242 × 61 px estimated` | First action | — | INFERRED |
| Secondary CTA | Content-width | Right of primary CTA | ~`24 px estimated` horizontal gap | INFERRED |
| Clinic chair | Lower center-right | Dominant foreground image object | Cropped at bottom | OBSERVED |
| Monitor | Center-right | Behind/above chair | Visible branding centered on display | OBSERVED |
| Dental lamp | Upper-right | Extends inward from right/top | No overlap with hero text | OBSERVED |

### 5.4 Layering and overlap

| Layer order | Element | Behavior | Status |
|---:|---|---|---|
| 1 | White/light hero base | Full section background | OBSERVED |
| 2 | Clinic room image | Anchored to right, full-height visual | OBSERVED |
| 3 | White/fade transition | Softens image toward hero copy region | OBSERVED |
| 4 | Header/navigation | Foreground above hero visual | OBSERVED |
| 5 | Hero copy/actions | Foreground on clean left region | OBSERVED |

No visible content card surrounds the hero copy.

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate | Usage | Value / description | Status |
|---|---|---|---|
| `color/surface/hero` | Hero left background | White / very pale cool-white | OBSERVED / INFERRED |
| `color/text/heading` | H1 | Deep navy blue | OBSERVED / INFERRED |
| `color/text/body` | Description | Muted blue-gray/slate | OBSERVED / INFERRED |
| `color/text/navigation` | Navigation | Dark navy | OBSERVED / INFERRED |
| `color/action/primary` | Filled CTAs | Saturated vivid blue | OBSERVED / INFERRED |
| `color/action/text` | CTA label | White | OBSERVED |
| `color/action/secondary` | Eyebrow, Watch Video, active nav | Medium/vivid blue | OBSERVED / INFERRED |
| `color/navigation/active` | Active underline | Blue | OBSERVED |
| `color/icon/action` | Calendar/play icons | White for primary CTA; blue for secondary action | OBSERVED |
| `color/hero/fade` | Transition into clinic image | White translucent gradient/mask | OBSERVED / INFERRED |

Exact HEX/RGB values: UNKNOWN.

### 6.2 Typography

| Element | OCR text reference | Font family | Weight | Size | Line-height | Letter spacing | Color | Status |
|---|---|---|---|---|---|---|---|---|
| Brand | `Smilux` | UNKNOWN | ~700 | ~`45 px estimated` | ~`50 px estimated` | UNKNOWN | Dark navy | INFERRED |
| Navigation | Navigation items | UNKNOWN | ~500–600 | ~`12–13 px estimated` | ~`18 px estimated` | UNKNOWN | Navy | INFERRED |
| Eyebrow | `OUR SERVICES` | UNKNOWN | ~600–700 | ~`14 px estimated` | ~`18 px estimated` | UNKNOWN | Blue | INFERRED |
| H1 | `hero-title` | UNKNOWN | ~600–700 | ~`54–58 px estimated` | ~`62–66 px estimated` | Slight/tight UNKNOWN | Deep navy | INFERRED |
| Body | `hero-description` | UNKNOWN | ~400 | ~`16 px estimated` | ~`30–32 px estimated` | UNKNOWN | Muted slate | INFERRED |
| Primary CTA | `BOOK APPOINTMENT` | UNKNOWN | ~600 | ~`13 px estimated` | Centered | UNKNOWN | White | INFERRED |
| Secondary CTA | `WATCH VIDEO` | UNKNOWN | ~600 | ~`13 px estimated` | Centered | UNKNOWN | Blue | INFERRED |

### 6.3 Borders, radius, effects

| Element | Border | Radius | Shadow / blur | Opacity | Status |
|---|---|---|---|---|---|
| Header CTA | No distinct border visible | Pill, ~`28–30 px estimated` | Very subtle/UNKNOWN | 100% | INFERRED |
| Hero primary CTA | No distinct border visible | Pill, ~`30 px estimated` | Very subtle/UNKNOWN | 100% | INFERRED |
| Secondary play icon holder | Thin blue circular outline | 50% circle | None visible | 100% | OBSERVED |
| Active nav underline | Blue line ~`2 px estimated` | None | None | 100% | INFERRED |
| Hero image fade | No border | N/A | Soft gradient/mask | Variable | OBSERVED / INFERRED |

### 6.4 Icons and decoration

| Element ID | Description | Asset type | Size / placement | Source required | Status |
|---|---|---|---|---|---|
| `logo-smilux` | Smilux wordmark | SVG / text / UNKNOWN | Top-left, ~`143 × 45 px estimated` visual bounds | Figma/project asset preferred | OBSERVED |
| `calendar-icon-header` | Outline calendar icon | SVG preferred | Left inside header CTA, ~`18 px estimated` | Asset library | OBSERVED |
| `calendar-icon-hero` | Same/similar calendar icon | SVG preferred | Left inside hero primary CTA | Asset library | OBSERVED |
| `play-icon` | Right-pointing play triangle inside outlined circle | SVG preferred | Before `WATCH VIDEO`, ~`24 px estimated` circle | Asset library | OBSERVED |
| `active-underline` | Horizontal blue indicator below `SERVICES` | CSS shape / border | ~`64 px estimated` width | Recreate | OBSERVED |

## 7. Asset Manifest

| Asset ID | Visible description | Required format | Aspect ratio / crop | Placement | Alt text requirement | Status |
|---|---|---|---|---|---|---|
| `services-hero-clinic` | Bright modern dental treatment room with dental chair, monitor, overhead lamp and dental equipment | JPG / WebP / PNG / UNKNOWN | Large landscape image; cropped by viewport | Right side/background of hero | Informative/decorative decision depends on product intent; likely decorative if hero copy conveys page purpose | OBSERVED |
| `smilux-logo` | Smilux wordmark | SVG preferred | Horizontal | Header top-left | Accessible brand name required if image-based | OBSERVED |
| `calendar-icon` | Outline calendar | SVG preferred | Square | Header and hero appointment CTAs | Decorative when adjacent label exists | OBSERVED |
| `play-icon` | Circular play control | SVG preferred | Square | Watch Video action | Decorative when adjacent label exists | OBSERVED |

### Asset handling rules
- Exact hero clinic image is a high-priority asset; do not substitute with a generic dental stock image when targeting 95% screenshot fidelity.
- Preserve the image crop so chair, monitor, lamp and equipment occupy the same visual regions.
- Preserve the visible `Smilux Dental Clinic` branding inside the monitor if it is part of the supplied original asset.
- Do not recreate the monitor branding as separate DOM content unless design/project evidence confirms it is an overlay.
- Prefer the project's existing Smilux logo asset over approximating the wordmark with ordinary text.
- Prefer shared calendar icon for both appointment CTAs if project assets confirm they are identical.
- Do not infer image animation/parallax behavior.

## 8. Component Contract

### 8.1 Recommended component boundary

| Component | Responsibility | Reusable? | Evidence | Status |
|---|---|---|---|---|
| `ServicesHero` | Overall hero composition | No / page-specific | Entire screenshot | INFERRED |
| `SiteHeader` | Brand, navigation and header CTA | Yes | Clearly independent repeated-site pattern | INFERRED |
| `PrimaryNavigation` | Navigation links and active state | Yes | Seven repeated navigation items | INFERRED |
| `AppointmentButton` | Calendar + appointment CTA | Yes | Same action appears twice | OBSERVED / INFERRED |
| `HeroContent` | Eyebrow, H1, description, actions | Reusable pattern | Distinct content block | INFERRED |
| `VideoAction` | Play icon + video label | Yes | Distinct secondary action | INFERRED |
| `HeroMedia` | Clinic image and crop/fade behavior | Page-specific | Right visual region | INFERRED |

### 8.2 Data model

// This is an interface contract only, not implementation code.
// Include only properties supported by visible evidence.

interface ServicesHeroData {
  eyebrow: string;
  title: string;
  description: string;

  primaryAction: {
    label: string;
  };

  secondaryAction: {
    label: string;
  };

  heroImage: string;
}

interface HeaderData {
  logo: string;

  navigation: Array<{
    label: string;
    active?: boolean;
  }>;

  appointmentLabel: string;
}

| Field | Type | Required | Visible evidence | Notes |
|---|---|---|---|---|
| `eyebrow` | string | Yes | `OUR SERVICES` | Configurable |
| `title` | string | Yes | Hero H1 visible | Preserve exact copy |
| `description` | string | Yes | Paragraph visible | Preserve exact copy |
| `primaryAction.label` | string | Yes | `BOOK APPOINTMENT` | Destination UNKNOWN |
| `secondaryAction.label` | string | Yes | `WATCH VIDEO` | Video/source UNKNOWN |
| `heroImage` | asset reference | Yes | Clinic visual visible | Exact asset required for fidelity |
| `logo` | asset reference | Yes | Smilux logo visible | Prefer shared site asset |
| `navigation` | array | Yes | Seven navigation entries | Destinations UNKNOWN |
| `navigation.active` | boolean | Yes | `SERVICES` active | Active visual confirmed |
| `appointmentLabel` | string | Yes | Header CTA visible | Destination UNKNOWN |

### 8.3 Content behavior
- Static content: OBSERVED — screenshot displays one fixed hero state.
- Configurable content: INFERRED — hero copy, image, navigation and action labels should use existing site/page configuration where available.
- Unknown data/API behavior: appointment action, video source, navigation URLs, CMS source and tracking behavior are UNKNOWN.

## 9. Interaction States

| Element | Default evidence | Hover | Active | Focus | Disabled | Link/action destination | Status |
|---|---|---|---|---|---|---|---|
| Navigation links | Navy text | UNKNOWN | `SERVICES` shows blue text + underline | Must be accessible | N/A | UNKNOWN | OBSERVED / UNKNOWN |
| Header appointment CTA | Filled blue pill | UNKNOWN | UNKNOWN | Must be accessible | UNKNOWN | UNKNOWN | OBSERVED / UNKNOWN |
| Hero appointment CTA | Filled blue pill | UNKNOWN | UNKNOWN | Must be accessible | UNKNOWN | UNKNOWN | OBSERVED / UNKNOWN |
| Watch Video | Blue icon + blue label | UNKNOWN | UNKNOWN | Must be accessible | UNKNOWN | Video destination/action UNKNOWN | OBSERVED / UNKNOWN |

### Interaction constraints
- Do not invent appointment modal behavior.
- Do not invent video modal, autoplay, inline player or external destination.
- Do not invent header sticky behavior.
- Do not invent navigation destinations.
- Preserve `SERVICES` as the active navigation state for this screenshot/page.
- If an action visually resembles a button but destination/behavior is unknown, classify its destination as UNKNOWN.

## 10. Responsive Specification

### 10.1 Evidence available
- Desktop evidence: OBSERVED — `1421 × 683 px` screenshot.
- Tablet evidence: UNKNOWN.
- Mobile evidence: UNKNOWN.

### 10.2 Required desktop behavior
- Hero spans the complete viewport width.
- Header remains over the hero rather than appearing inside a separate visually bounded card.
- Logo stays top-left.
- Navigation remains horizontal.
- Appointment CTA remains top-right.
- Hero copy remains left-aligned and vertically positioned below navigation.
- H1 remains two lines at target viewport:
  - `Comprehensive Dental`
  - `Care for Every Smile`
- Description remains approximately three lines at target viewport.
- Hero CTAs remain horizontally aligned.
- Clinic image dominates the right half.
- Dental chair remains a major foreground anchor in lower center-right.
- Monitor remains around center-right.
- Dental lamp remains in upper-right.
- White-to-image fade prevents visual noise behind the hero copy.
- Hero image must not visibly tile or stretch.

### 10.3 Proposed responsive behavior

| Breakpoint range | Layout behavior | Typography behavior | Image/asset behavior | Status and rationale |
|---|---|---|---|---|
| Desktop | Copy left + image right; horizontal full navigation | Match screenshot | Image fills right region with controlled crop | OBSERVED |
| Tablet | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN — no screenshot evidence |
| Mobile | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN — no screenshot evidence |

### 10.4 Responsive assumptions requiring approval
- Mobile/tablet header navigation behavior.
- Whether hamburger navigation exists.
- Exact responsive breakpoints.
- Whether hero image moves below content on mobile.
- Whether image remains background or becomes standalone media.
- Mobile H1 size and line wrapping.
- CTA stacking behavior.
- Header CTA visibility on smaller screens.
- Hero minimum height.
- Mobile image crop/object position.

## 11. Semantic HTML and Accessibility

### Recommended structure
- Landmark: page header followed by hero section.
- Heading hierarchy: `Comprehensive Dental Care for Every Smile` should be the page H1 if no preceding H1 exists.
- Navigation: semantic primary navigation landmark containing links.
- Interactive elements: semantic links/buttons according to actual destinations/actions.
- Image semantics: hero treatment-room image may use empty alt if purely decorative; if it communicates meaningful facility information, provide purposeful alt.
- Keyboard behavior: navigation and all three visible actions must be keyboard reachable.
- Focus visibility: explicit high-contrast focus state required.
- Contrast risks: muted paragraph text over light/faded image region should be verified.
- Screen-reader-only content required: UNKNOWN.
- Form labels, if applicable: N/A.

### Accessibility constraints
- Use semantic HTML; do not use clickable `div` elements.
- Logo linking behavior is UNKNOWN; do not invent destination without project convention/evidence.
- Navigation active state should be programmatically identifiable, not communicated solely through blue underline/color.
- All interactive elements require visible keyboard focus.
- Decorative calendar/play icons should not duplicate adjacent text to screen readers.
- Do not place essential text inside the hero image.
- Preserve sufficient text/background contrast if the image/fade changes responsively.
- If `WATCH VIDEO` opens a dialog/player, accessibility requirements for that behavior must be specified once the interaction is confirmed.

## 12. Implementation Constraints

- Use existing global `SiteHeader` if the codebase already provides one rather than creating a visually duplicate header specifically for Services.
- Use existing semantic design tokens if the codebase provides them.
- Use the project's existing logo asset.
- Use the exact hero clinic asset when available.
- Do not hard-code colors, arbitrary spacing, typography, radius or image URLs when equivalent project tokens/assets exist.
- Do not invent missing UI states.
- Do not invent navigation URLs.
- Do not invent appointment or video behavior.
- Keep page-specific hero styling scoped appropriately.
- Preserve hero copy exactly as recorded in OCR inventory.
- Maintain active navigation state for `SERVICES`.
- Avoid implementing the white-to-image transition as a hard vertical split; screenshot evidence requires a soft transition.
- Do not use a generic stock clinic image as final production asset if screenshot fidelity remains a requirement.
- If an item is marked `UNKNOWN`, request clarification rather than silently deciding.

## 13. Visual Acceptance Criteria

The implementation is acceptable only if screenshot comparison at the target desktop viewport confirms:

- [ ] Hero fills the supplied desktop viewport composition correctly.
- [ ] Header placement matches the screenshot.
- [ ] Smilux logo dimensions and position match.
- [ ] Navigation item order and spacing match.
- [ ] `SERVICES` uses the correct blue active state and underline.
- [ ] Header appointment CTA dimensions, placement, radius, icon and label match.
- [ ] Hero content begins at the correct horizontal position.
- [ ] `OUR SERVICES` placement, color and weight match.
- [ ] H1 copy matches exactly.
- [ ] H1 remains visually two lines with the same line-break structure.
- [ ] H1 scale, weight and line-height closely match.
- [ ] Description copy and line wrapping closely match.
- [ ] Primary CTA position, size, blue fill, radius, calendar icon and label match.
- [ ] `WATCH VIDEO` icon, label and spacing match.
- [ ] Hero actions remain on one horizontal row at target viewport.
- [ ] Exact clinic image is used where available.
- [ ] Image crop places dental chair, monitor and lamp in the same major visual positions.
- [ ] Monitor branding remains correctly positioned as part of the image.
- [ ] White-to-image transition is gradual rather than a hard boundary.
- [ ] Hero copy remains readable against the image transition.
- [ ] No unsupported text, controls, badges or interactions have been added.
- [ ] All unresolved items remain documented under Open Questions.

## 14. Visual Risks

| Risk | Why it affects fidelity | Mitigation | Priority |
|---|---|---|---|
| Exact hero clinic image unavailable | Image represents roughly half the screenshot and determines overall composition | Export/retrieve exact Services hero asset | High |
| Incorrect image crop/object-position | Chair, monitor and lamp positions strongly define visual match | Calibrate crop against `1421 × 683` reference | High |
| White/image transition implemented incorrectly | Hard split or excessive overlay changes the entire hero composition | Reproduce soft fade based on screenshot comparison | High |
| Font family unavailable | H1 width and exact two-line wrapping can change significantly | Retrieve project/Figma typography | High |
| Incorrect H1 width | Can produce different line break than screenshot | Calibrate content width after font is confirmed | High |
| Header implementation differs from global site header | Services page may become inconsistent with rest of site | Reuse existing header where available | High |
| Exact logo asset unavailable | Wordmark is visually prominent | Use original project/Figma logo | Medium |
| Icon set unknown | Calendar/play geometry may differ | Reuse project icon library | Medium |
| Exact blue/navy tokens unknown | Branding consistency may drift | Retrieve design tokens before final visual pass | Medium |
| Appointment/video behavior unknown | UI can be visually completed but not production-functional | Obtain product requirements separately | Medium |
| Responsive design unavailable | Cannot claim fidelity outside desktop | Obtain tablet/mobile references | Medium |

## 15. Open Questions

| ID | Question | Blocking level | Suggested owner |
|---|---|---|---|
| Q1 | Exact hero clinic image asset nằm ở đâu trong Figma/project? | Blocking for fidelity | Designer / Developer |
| Q2 | Hero image được render như background image hay standalone image layer trong design system hiện tại? | Non-blocking | Designer / Developer |
| Q3 | White-to-image fade là một phần của source image hay overlay/gradient riêng? | Blocking for fidelity | Designer |
| Q4 | Font family, exact H1 weight và typography tokens là gì? | Blocking for fidelity | Designer / Developer |
| Q5 | Smilux wordmark có SVG/logo asset chính thức nào trong project? | Blocking for fidelity | Designer / Developer |
| Q6 | Exact blue/navy design tokens cho heading, CTA và active navigation là gì? | Non-blocking | Designer / Developer |
| Q7 | `BOOK APPOINTMENT` dẫn tới page, anchor hay mở appointment flow/modal? | Blocking for production behavior | Product |
| Q8 | `WATCH VIDEO` mở modal, inline player hay external video? | Blocking for production behavior | Product |
| Q9 | Video source chính xác là gì? | Blocking for production behavior | Product |
| Q10 | Navigation destinations chính xác là gì? | Blocking for production behavior | Product / Developer |
| Q11 | Header có sticky/fixed behavior hay chỉ static trên hero? | Blocking for complete interaction | Designer / Developer |
| Q12 | Có tablet/mobile screenshots cho Services hero không? | Blocking for responsive fidelity | Designer |
| Q13 | Header trên screenshot là global shared header hiện có hay implementation riêng cho Services? | Blocking for architecture | Developer |
| Q14 | Calendar icon ở hai CTA có sử dụng cùng một asset/component không? | Non-blocking | Designer / Developer |

## 16. Handoff Summary

### Safe to implement now
- Desktop hero composition.
- Header visual placement.
- Navigation ordering.
- `SERVICES` active state.
- Hero left/right visual hierarchy.
- Eyebrow + H1 + description hierarchy.
- Exact high-confidence OCR copy.
- Horizontal hero action layout.
- Filled pill appointment CTA.
- Secondary `WATCH VIDEO` treatment.
- General right-aligned clinic image composition.
- Soft white-to-image visual transition requirement.

### Requires asset export
- Exact Services clinic hero image.
- Official Smilux logo if not already present.
- Calendar icon if not available in existing icon library.
- Play-circle icon if not available in existing icon library.

### Requires design/product decision
- Exact typography tokens.
- Exact color tokens.
- Hero image implementation strategy.
- Fade implementation/source.
- Navigation destinations.
- Appointment behavior.
- Video behavior/source.
- Header sticky behavior.
- Responsive behavior.

### Do not assume
- Appointment modal/page behavior.
- Video modal/autoplay behavior.
- Navigation URLs.
- Sticky header.
- Hamburger navigation.
- Mobile/tablet layout.
- Hero animation or parallax.
- Exact font family.
- Exact HEX colors.
- Hero image coordinates beyond screenshot-relative crop.
- Monitor branding as separate DOM content.
- Image fade implementation technique.