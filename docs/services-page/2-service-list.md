# UI Implementation Spec — Explore Our Services

## 1. Identity

| Field | Value |
|---|---|
| Route | `/services` |
| Section ID | `services-grid` |
| Section name | `Explore Our Services` |
| Screenshot scope | OBSERVED: section danh sách dịch vụ nha khoa ngay sau Services Hero, gồm heading centered và grid 10 service cards |
| Target viewport | OBSERVED: screenshot `982 × 789 px` |
| Primary implementation goal | Reproduce the supplied desktop screenshot with maximum visual fidelity |
| Overall evidence quality | High cho desktop layout, card structure và copy; Medium cho exact typography, spacing, colors và source assets |

## 2. Scope Boundary

### Included in this spec
- OBSERVED: eyebrow `OUR DENTAL SERVICES`.
- OBSERVED: heading `Explore Our Services`.
- OBSERVED: decorative divider có tooth icon ở giữa.
- OBSERVED: grid 10 service cards.
- OBSERVED: mỗi card gồm image, service title, description và `LEARN MORE` action.
- OBSERVED: desktop grid 5 cột × 2 hàng.
- OBSERVED: card có border mảnh, radius lớn vừa và nền trắng.
- OBSERVED: image nằm trong vùng top card, có rounded corners riêng.
- OBSERVED: các card có chiều cao gần đồng nhất theo từng hàng.

### Excluded from this spec
- UNKNOWN: section tiếp theo phía dưới.
- UNKNOWN: animation khi scroll.
- UNKNOWN: hover state của card/action.
- UNKNOWN: URL chi tiết từng service.
- UNKNOWN: dữ liệu CMS/API.
- UNKNOWN: responsive/tablet/mobile design.
- UNKNOWN: image loading/fallback behavior.
- UNKNOWN: interaction khi click toàn card hay chỉ click `LEARN MORE`.

### Section start and end
- Start: OBSERVED — section bắt đầu ở vùng whitespace phía trên eyebrow.
- End: INFERRED — section kết thúc sau hàng card thứ hai; screenshot crop sát phần dưới card.
- Cropped/partially visible content: UNKNOWN — không nhìn thấy section kế tiếp.

## 3. Evidence and Confidence

| Item | Status | Evidence / reason |
|---|---|---|
| Section boundary | INFERRED | Top boundary rõ, bottom boundary không có neighboring section |
| Desktop layout | OBSERVED | 5-column × 2-row card grid |
| Copy/text content | OBSERVED | Hầu hết title/description/action đọc rõ |
| Typography values | INFERRED | Có thể ước lượng hierarchy nhưng không có font metadata |
| Colors | INFERRED | Navy/blue/white/light-border rõ nhưng exact token không có |
| Card assets | OBSERVED | Mỗi dịch vụ có một image riêng |
| Asset source | UNKNOWN | Không có file nguồn/Figma asset |
| Interaction states | UNKNOWN | Chỉ default visual state |
| Responsive behavior | UNKNOWN | Chỉ có desktop screenshot |

## 4. OCR Content Inventory

> Preserve all readable text exactly as shown. Mark uncertainty explicitly.

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `services-eyebrow` | OUR DENTAL SERVICES | Eyebrow | High | Uppercase, centered |
| `services-heading` | Explore Our Services | Heading | High | Centered |
| `service-1-title` | Dental Implants | Card heading | High | |
| `service-1-description` | Replace missing teeth with strong, natural-looking implants that last a lifetime. | Paragraph | High | |
| `service-1-action` | LEARN MORE | CTA / link | High | Arrow icon bên phải |
| `service-2-title` | Cosmetic Crowns | Card heading | High | |
| `service-2-description` | Enhance the shape, color, and strength of your teeth with custom-crafted crowns. | Paragraph | High | |
| `service-2-action` | LEARN MORE | CTA / link | High | |
| `service-3-title` | Orthodontics | Card heading | High | |
| `service-3-description` | Straighten your teeth and improve your bite with advanced braces or clear aligners. | Paragraph | High | |
| `service-3-action` | LEARN MORE | CTA / link | High | |
| `service-4-title` | Teeth Cleaning | Card heading | High | |
| `service-4-description` | Remove plaque and tartar buildup for healthier gums and a brighter smile. | Paragraph | High | |
| `service-4-action` | LEARN MORE | CTA / link | High | |
| `service-5-title` | Tooth Extraction | Card heading | High | |
| `service-5-description` | Safe and comfortable removal of damaged or problematic teeth when necessary. | Paragraph | High | |
| `service-5-action` | LEARN MORE | CTA / link | High | |
| `service-6-title` | Root Canal Treatment | Card heading | High | |
| `service-6-description` | Relieve pain and save damaged teeth with gentle and effective root canal therapy. | Paragraph | High | |
| `service-6-action` | LEARN MORE | CTA / link | High | |
| `service-7-title` | Tooth Filling | Card heading | High | |
| `service-7-description` | Restore cavities with tooth-colored fillings that blend seamlessly with your smile. | Paragraph | High | |
| `service-7-action` | LEARN MORE | CTA / link | High | |
| `service-8-title` | Dental Jewelry | Card heading | High | |
| `service-8-description` | Add a touch of sparkle to your smile with safe and stylish dental gems. | Paragraph | High | |
| `service-8-action` | LEARN MORE | CTA / link | High | |
| `service-9-title` | Teeth Whitening | Card heading | High | |
| `service-9-description` | Brighten stained or discolored teeth and achieve a noticeably whiter smile. | Paragraph | High | |
| `service-9-action` | LEARN MORE | CTA / link | High | |
| `service-10-title` | Pediatric Dentistry | Card heading | High | |
| `service-10-description` | Gentle, compassionate care designed to keep children's smiles healthy and happy. | Paragraph | High | |
| `service-10-action` | LEARN MORE | CTA / link | High | |

## 5. Layout Anatomy

### 5.1 Global geometry

| Property | Specification | Status |
|---|---|---|
| Section width | Full screenshot width `982 px` | OBSERVED |
| Section height | At least `789 px` | OBSERVED |
| Background behavior | Solid white / near-white full-width background | OBSERVED |
| Content container | Centered container ~`918 px estimated` wide | INFERRED |
| Horizontal gutters | ~`31–33 px estimated` | INFERRED |
| Main layout model | Heading block + 5-column card grid | OBSERVED |
| Grid columns | `5` | OBSERVED |
| Grid rows | `2` | OBSERVED |
| Column gap | ~`12–14 px estimated` | INFERRED |
| Row gap | ~`17–19 px estimated` | INFERRED |
| Card width | ~`173 px estimated` | INFERRED |
| Card height | ~`307 px estimated` | INFERRED |
| Vertical alignment | Cards aligned consistently by row | OBSERVED |
| Overflow / cropping | No card overflow visible | OBSERVED |

### 5.2 Structure tree

Section: services-grid
├── Section heading
│   ├── Eyebrow
│   │   └── OUR DENTAL SERVICES
│   ├── H2
│   │   └── Explore Our Services
│   └── Decorative divider
│       ├── Left line
│       ├── Tooth icon
│       └── Right line
│
└── Services grid
    ├── Service card: Dental Implants
    │   ├── Image
    │   ├── Title
    │   ├── Description
    │   └── Learn More action
    ├── Service card: Cosmetic Crowns
    ├── Service card: Orthodontics
    ├── Service card: Teeth Cleaning
    ├── Service card: Tooth Extraction
    ├── Service card: Root Canal Treatment
    ├── Service card: Tooth Filling
    ├── Service card: Dental Jewelry
    ├── Service card: Teeth Whitening
    └── Service card: Pediatric Dentistry

### 5.3 Spatial relationships

| Element | Position and dimensions | Alignment relationship | Spacing relationship | Status |
|---|---|---|---|---|
| Section heading block | Centered horizontally | Above grid | ~`25–30 px estimated` top offset | INFERRED |
| Eyebrow | Centered | Same axis as H2 | ~`10–12 px estimated` above H2 | INFERRED |
| H2 | Centered | Main section axis | ~`14–18 px estimated` above divider | INFERRED |
| Divider | ~`200 px estimated` total width | Centered under H2 | Tooth icon in middle | INFERRED |
| Grid | ~`918 px estimated` | Centered | ~`25–28 px estimated` below divider | INFERRED |
| Cards | Equal width | Five per row | Uniform horizontal gaps | OBSERVED |
| Card image | Nearly full inner width | Top of card | ~`14–15 px estimated` inner margin | INFERRED |
| Card image height | ~`139 px estimated` | Same height pattern across cards | — | INFERRED |
| Card title | Below image | Left aligned | ~`15–18 px estimated` below image | INFERRED |
| Description | Below title | Left aligned | ~`7–9 px estimated` below title | INFERRED |
| Learn More | Near card bottom | Left aligned | Consistent bottom offset across cards | OBSERVED / INFERRED |

### 5.4 Layering and overlap

| Layer order | Element | Behavior | Status |
|---:|---|---|---|
| 1 | Section background | White surface | OBSERVED |
| 2 | Service cards | Individual bordered surfaces | OBSERVED |
| 3 | Card images | Contained inside cards | OBSERVED |
| 4 | Card text/actions | Foreground | OBSERVED |
| 5 | Divider tooth icon | Foreground decorative symbol | OBSERVED |

No intentional overlap is visible.

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate | Usage | Value / description | Status |
|---|---|---|---|
| `color/surface/page` | Section background | White / near-white | OBSERVED |
| `color/surface/card` | Service cards | White | OBSERVED |
| `color/text/heading` | H2/card titles | Deep navy | OBSERVED / INFERRED |
| `color/text/body` | Descriptions | Dark gray/slate | OBSERVED / INFERRED |
| `color/text/eyebrow` | Eyebrow | Bright blue | OBSERVED / INFERRED |
| `color/action/link` | `LEARN MORE`, arrows | Bright blue | OBSERVED / INFERRED |
| `color/border/card` | Card borders | Very pale blue-gray | OBSERVED / INFERRED |
| `color/decorative/divider` | Divider line | Pale blue | OBSERVED / INFERRED |
| `color/decorative/tooth` | Tooth icon | Bright blue outline | OBSERVED / INFERRED |

Exact HEX/RGB values: UNKNOWN.

### 6.2 Typography

| Element | OCR text reference | Font family | Weight | Size | Line-height | Letter spacing | Color | Status |
|---|---|---|---|---|---|---|---|---|
| Eyebrow | `OUR DENTAL SERVICES` | UNKNOWN | ~600–700 | ~`10–11 px estimated` | ~`14 px estimated` | UNKNOWN | Blue | INFERRED |
| H2 | `Explore Our Services` | UNKNOWN | ~600–700 | ~`28–30 px estimated` | ~`34 px estimated` | UNKNOWN | Deep navy | INFERRED |
| Card title | Service titles | UNKNOWN | ~600–700 | ~`13–14 px estimated` | ~`18 px estimated` | UNKNOWN | Navy | INFERRED |
| Card body | Descriptions | UNKNOWN | ~400 | ~`10–11 px estimated` | ~`18–19 px estimated` | UNKNOWN | Slate | INFERRED |
| Card action | `LEARN MORE` | UNKNOWN | ~600–700 | ~`9–10 px estimated` | ~`14 px estimated` | UNKNOWN | Blue | INFERRED |

### 6.3 Borders, radius, effects

| Element | Border | Radius | Shadow / blur | Opacity | Status |
|---|---|---|---|---|---|
| Service card | ~`1 px estimated` pale blue-gray | ~`12–14 px estimated` | Very subtle soft shadow or none | 100% | INFERRED |
| Card image | None visible | ~`10–11 px estimated` | None visible | 100% | INFERRED |
| Divider | Thin ~`1 px estimated` line | N/A | None | 100% | INFERRED |
| Tooth icon | Blue outline | N/A | None | 100% | OBSERVED |

### 6.4 Icons and decoration

| Element ID | Description | Asset type | Size / placement | Source required | Status |
|---|---|---|---|---|---|
| `section-tooth-icon` | Small outlined tooth symbol | SVG preferred | ~`17–20 px estimated`, centered between divider lines | Existing project/Figma asset | OBSERVED |
| `learn-more-arrow` | Thin arrow pointing right | SVG / icon font / UNKNOWN | ~`10–12 px estimated`, immediately right of label | Existing icon library | OBSERVED |
| `divider-left` | Horizontal pale-blue line | CSS shape | ~`75–80 px estimated` | Recreate | OBSERVED |
| `divider-right` | Horizontal pale-blue line | CSS shape | Symmetrical with left line | Recreate | OBSERVED |

## 7. Asset Manifest

| Asset ID | Visible description | Required format | Aspect ratio / crop | Placement | Alt text requirement | Status |
|---|---|---|---|---|---|---|
| `service-dental-implants` | Two dental implant models | JPG / WebP / PNG | Near-square / slightly landscape crop | Card 1 | Purposeful alt if informative; otherwise service title may provide equivalent context | OBSERVED |
| `service-cosmetic-crowns` | White dental crowns / prosthetic teeth | JPG / WebP / PNG | Near-square / landscape | Card 2 | Same rule | OBSERVED |
| `service-orthodontics` | Close-up teeth with braces | JPG / WebP / PNG | Landscape | Card 3 | Same rule | OBSERVED |
| `service-teeth-cleaning` | Dental cleaning/scaler tool near tooth model | JPG / WebP / PNG | Landscape | Card 4 | Same rule | OBSERVED |
| `service-tooth-extraction` | Dental extraction forceps and tooth model | JPG / WebP / PNG | Landscape | Card 5 | Same rule | OBSERVED |
| `service-root-canal` | Tooth cross-section undergoing root canal treatment | JPG / WebP / PNG | Landscape | Card 6 | Same rule | OBSERVED |
| `service-filling` | White teeth/molar restoration visual | JPG / WebP / PNG | Landscape | Card 7 | Same rule | OBSERVED |
| `service-dental-jewelry` | Tooth with gem/jewelry visual | JPG / WebP / PNG | Landscape | Card 8 | Same rule | OBSERVED |
| `service-whitening` | Tooth shade guide / whitening lamp visual | JPG / WebP / PNG | Landscape | Card 9 | Same rule | OBSERVED |
| `service-pediatric` | Smiling child in dental chair | JPG / WebP / PNG | Landscape | Card 10 | Informative image; purposeful alt if image adds meaning | OBSERVED |
| `icon-tooth-divider` | Blue outline tooth | SVG preferred | Square | Section heading divider | Decorative | OBSERVED |
| `icon-arrow-right` | Blue right arrow | SVG preferred | Square | Every card action | Decorative | OBSERVED |

### Asset handling rules
- Exact service images are high-impact visual assets and should be exported/reused from Figma/project when targeting 95% fidelity.
- Do not replace the 10 images with generic stock alternatives unless exact assets are unavailable and substitution is explicitly approved.
- Preserve image crop/object-position separately per service.
- Use a consistent image container ratio across all cards even if source image dimensions differ.
- Images should not stretch.
- Divider tooth icon should use the existing project asset if available.
- `LEARN MORE` arrow should use one shared icon asset/component across cards.

## 8. Component Contract

### 8.1 Recommended component boundary

| Component | Responsibility | Reusable? | Evidence | Status |
|---|---|---|---|---|
| `ServicesGridSection` | Entire heading + grid composition | Yes | Distinct page section | INFERRED |
| `SectionHeading` | Eyebrow, title and decorative divider | Yes | Generic repeated design pattern potential | INFERRED |
| `ServiceGrid` | Grid layout over service dataset | Yes | 10 repeated items | OBSERVED / INFERRED |
| `ServiceCard` | Image, title, description and action | Yes | Same structure repeated 10 times | OBSERVED |
| `TextLinkWithArrow` | `LEARN MORE` + right arrow | Yes | Repeated 10 times | OBSERVED |

### 8.2 Data model

// This is an interface contract only, not implementation code.
// Include only properties supported by visible evidence.

interface ServicesGridSectionData {
  eyebrow: string;
  title: string;

  services: Array<{
    title: string;
    description: string;
    image: string;
    actionLabel: string;
    href?: string;
  }>;
}

| Field | Type | Required | Visible evidence | Notes |
|---|---|---|---|---|
| `eyebrow` | string | Yes | `OUR DENTAL SERVICES` | Configurable |
| `title` | string | Yes | `Explore Our Services` | Configurable |
| `services` | array | Yes | 10 service cards visible | Preserve screenshot order |
| `services[].title` | string | Yes | Every card title visible | Configurable |
| `services[].description` | string | Yes | Every card description visible | Configurable |
| `services[].image` | asset reference | Yes | Every card has an image | Exact assets preferred |
| `services[].actionLabel` | string | Yes | `LEARN MORE` repeated | Could be shared default |
| `services[].href` | string | No / Unknown | Destination not visible | Do not invent |

### 8.3 Content behavior
- Static content: OBSERVED — screenshot contains exactly 10 service cards.
- Configurable content: INFERRED — service title, description, image and destination should be data-driven.
- Grid order must preserve screenshot ordering:
  1. Dental Implants
  2. Cosmetic Crowns
  3. Orthodontics
  4. Teeth Cleaning
  5. Tooth Extraction
  6. Root Canal Treatment
  7. Tooth Filling
  8. Dental Jewelry
  9. Teeth Whitening
  10. Pediatric Dentistry
- Unknown data/API behavior: CMS source, pagination, filtering, ordering rules and service-detail routing are UNKNOWN.

## 9. Interaction States

| Element | Default evidence | Hover | Active | Focus | Disabled | Link/action destination | Status |
|---|---|---|---|---|---|---|---|
| Service card | White bordered card | UNKNOWN | UNKNOWN | UNKNOWN unless card is interactive | N/A | UNKNOWN | OBSERVED / UNKNOWN |
| `LEARN MORE` | Blue text + arrow | UNKNOWN | UNKNOWN | Must be accessible | N/A | UNKNOWN | OBSERVED / UNKNOWN |
| Service image | Static | UNKNOWN | UNKNOWN | N/A unless linked | N/A | UNKNOWN | OBSERVED / UNKNOWN |

### Interaction constraints
- Do not invent whole-card click behavior.
- Do not invent hover lift, scale, image zoom or border-color transition.
- Do not invent service detail URLs.
- Do not assume card image/title are links unless project conventions confirm it.
- If only `LEARN MORE` is actionable, implement as semantic link.
- Do not invent carousel or pagination behavior; screenshot clearly shows a static desktop grid.

## 10. Responsive Specification

### 10.1 Evidence available
- Desktop evidence: OBSERVED — 5 cards per row, 2 rows.
- Tablet evidence: UNKNOWN.
- Mobile evidence: UNKNOWN.

### 10.2 Required desktop behavior
- Heading remains centered.
- Eyebrow remains directly above H2.
- Divider/tooth decoration remains centered below H2.
- Grid displays exactly 5 columns at supplied desktop viewport.
- Card widths remain equal.
- Grid gaps remain uniform.
- Second row aligns with first row column edges.
- Images use equal visual dimensions across all cards.
- Titles, descriptions and action links use consistent left alignment.
- `LEARN MORE` actions remain visually near the lower portion of each card.
- Cards maintain consistent height rather than shrinking based solely on content length.

### 10.3 Proposed responsive behavior

| Breakpoint range | Layout behavior | Typography behavior | Image/asset behavior | Status and rationale |
|---|---|---|---|---|
| Desktop | 5-column grid | Match screenshot hierarchy | Uniform card image containers | OBSERVED |
| Tablet | UNKNOWN; likely fewer columns | UNKNOWN | UNKNOWN | UNKNOWN — no screenshot evidence |
| Mobile | UNKNOWN; likely 1–2 columns | UNKNOWN | UNKNOWN | UNKNOWN — no screenshot evidence |

### 10.4 Responsive assumptions requiring approval
- Exact column counts for tablet/mobile.
- Exact breakpoint values.
- Whether horizontal scrolling is allowed.
- Whether cards retain fixed/equal heights.
- Image aspect ratio on mobile.
- Heading font-size reduction.
- Horizontal section padding on smaller screens.
- Whether descriptions are truncated on small screens.

## 11. Semantic HTML and Accessibility

### Recommended structure
- Landmark: section associated with `Explore Our Services`.
- Heading hierarchy: `Explore Our Services` should typically be H2 because Services Hero already contains the page H1; exact hierarchy must follow page DOM.
- Eyebrow: non-heading supporting text unless site semantics require otherwise.
- Services: semantic list/grid structure is recommended because the items form a collection.
- Service titles: headings beneath the section heading, e.g. H3 if hierarchy permits.
- Interactive elements: semantic anchors for service-detail navigation.
- Image semantics: use meaningful alt if image communicates the service; avoid duplicating adjacent title verbatim when unnecessary.
- Keyboard behavior: every Learn More action must be reachable.
- Focus visibility: clearly visible focus state required.
- Contrast risks: small blue action labels and small gray descriptions should be contrast checked.
- Screen-reader-only content required: UNKNOWN.
- Form labels, if applicable: N/A.

### Accessibility constraints
- Use semantic HTML; do not use clickable `div` elements.
- Maintain logical reading order identical to visual grid order.
- Do not use image filenames as alt text.
- Decorative divider lines/tooth icon should be hidden from assistive technology.
- Arrow icon should be decorative when adjacent `LEARN MORE` text conveys the action.
- If multiple links use identical `LEARN MORE` labels, each link should have an accessible name/context that identifies its associated service.
- Do not communicate service identity solely through imagery.

## 12. Implementation Constraints

- Reuse existing global typography/design tokens where available.
- Reuse a shared `ServiceCard` rather than duplicating markup/styling 10 times.
- Render cards from structured service data.
- Preserve service order exactly as shown unless product data explicitly changes it.
- Do not hard-code arbitrary colors, spacing, fonts, radius or image paths when project tokens/assets exist.
- Preserve all confirmed copy exactly.
- Do not invent destinations for `LEARN MORE`.
- Do not invent card hover/animation states.
- Do not add pagination, tabs, filters, category chips or carousel controls.
- Ensure card description lengths do not cause inconsistent action alignment at target desktop viewport.
- Avoid stretching service images to enforce card dimensions; use crop/object-position behavior.
- If an item is `UNKNOWN`, request clarification rather than silently making a product decision.

## 13. Visual Acceptance Criteria

The implementation is acceptable only if screenshot comparison at the target desktop viewport confirms:

- [ ] Section width/background matches reference.
- [ ] Heading block is horizontally centered.
- [ ] `OUR DENTAL SERVICES` matches capitalization, position, blue color and visual weight.
- [ ] `Explore Our Services` matches copy, scale and weight.
- [ ] Divider lines are symmetrical around the tooth icon.
- [ ] Tooth icon size and vertical position match.
- [ ] Grid displays exactly 5 columns × 2 rows.
- [ ] All 10 cards appear in the correct order.
- [ ] Grid outer gutters match.
- [ ] Horizontal and vertical card gaps match.
- [ ] Card width, height, border and radius match.
- [ ] Card image dimensions and inner margins match.
- [ ] Exact service images/crops are used where available.
- [ ] All service titles match exactly.
- [ ] All service descriptions match exactly.
- [ ] Titles/descriptions maintain the screenshot line wrapping as closely as font evidence permits.
- [ ] `LEARN MORE` links use consistent position, typography and arrow spacing.
- [ ] Cards within each row maintain equal visual height.
- [ ] Card content does not overflow or clip.
- [ ] No unsupported filter, carousel, badge or additional CTA has been added.
- [ ] All unresolved items remain documented under Open Questions.

## 14. Visual Risks

| Risk | Why it affects fidelity | Mitigation | Priority |
|---|---|---|---|
| Exact 10 service images unavailable | Images occupy a major percentage of the section and strongly affect visual match | Export/retrieve exact assets from project/Figma | High |
| Font family unknown | Card title/body wrapping can change card height and visual rhythm | Retrieve project typography before final calibration | High |
| Card dimensions slightly incorrect | Five-column grid amplifies small width/gap errors across viewport | Calibrate container, card width and gap against `982 px` reference | High |
| Variable text heights | Can misalign `LEARN MORE` actions | Use consistent internal card layout while preserving visible copy | High |
| Image crop mismatch | Several assets contain centered dental objects with specific framing | Configure per-image object position if needed | Medium |
| Exact border/radius tokens unknown | Repeated 10 times, small differences become visually noticeable | Reuse design tokens/Figma values | Medium |
| Exact blue/navy colors unknown | Strong brand consistency across heading/actions | Retrieve global design tokens | Medium |
| Responsive grid unavailable | Cannot guarantee behavior outside supplied screenshot | Obtain tablet/mobile references | Medium |
| Unknown service URLs | Visual implementation can be complete but navigation remains incomplete | Get canonical service routes from product/codebase | Medium |

## 15. Open Questions

| ID | Question | Blocking level | Suggested owner |
|---|---|---|---|
| Q1 | Exact 10 service image assets nằm ở đâu trong Figma/project? | Blocking for fidelity | Designer / Developer |
| Q2 | Font family và exact typography tokens cho section/card là gì? | Blocking for fidelity | Designer / Developer |
| Q3 | Exact container width, grid gap và card radius tokens có sẵn trong design system không? | Non-blocking | Designer / Developer |
| Q4 | `LEARN MORE` của từng service dẫn tới route nào? | Blocking for production behavior | Product / Developer |
| Q5 | Chỉ `LEARN MORE` clickable hay toàn bộ card/title/image đều là link? | Blocking for interaction | Product / Designer |
| Q6 | Có hover state cho service card hoặc `LEARN MORE` không? | Blocking for complete interaction | Designer |
| Q7 | Có tablet/mobile screenshots hoặc grid specification không? | Blocking for responsive fidelity | Designer |
| Q8 | 10 services này là hard-defined cho page hay được lấy từ CMS? | Non-blocking | Product / Developer |
| Q9 | Thứ tự service có thể được CMS thay đổi hay phải cố định như screenshot? | Non-blocking | Product |
| Q10 | Exact tooth divider icon có asset trong project không? | Non-blocking | Designer / Developer |

## 16. Handoff Summary

### Safe to implement now
- Centered section heading structure.
- Eyebrow + H2 hierarchy.
- Tooth-icon divider composition.
- Desktop 5-column × 2-row grid.
- Exactly 10 visible service cards.
- Service ordering from screenshot.
- Reusable card anatomy: image → title → description → Learn More.
- Exact high-confidence OCR copy.
- Consistent card border/radius hierarchy.
- Consistent image container sizing.
- Blue Learn More action with right arrow.

### Requires asset export
- Dental Implants image.
- Cosmetic Crowns image.
- Orthodontics image.
- Teeth Cleaning image.
- Tooth Extraction image.
- Root Canal Treatment image.
- Tooth Filling image.
- Dental Jewelry image.
- Teeth Whitening image.
- Pediatric Dentistry image.
- Tooth divider icon if not already in project assets.
- Learn More arrow icon if not already available.

### Requires design/product decision
- Exact typography tokens.
- Exact colors/border/radius.
- Service detail destinations.
- Whole-card vs action-only click behavior.
- Hover/focus visual states.
- CMS/static data strategy.
- Tablet/mobile grid behavior.

### Do not assume
- Carousel behavior.
- Pagination.
- Filtering/categories.
- Service badges.
- Hover elevation/image zoom.
- Whole-card clickability.
- Service detail URLs.
- Responsive column counts.
- Exact font family.
- Exact HEX colors.
- CMS schema/API.
- Text truncation.