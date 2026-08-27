# UI Implementation Spec — Dental Implant Services + Benefits

## 1. Identity

| Field | Value |
|---|---|
| Route | `/services/:service-slug` |
| Section IDs | `service-variants`, `service-benefits` |
| Section names | `Dental Implant Services`, `Benefits of Dental Implants` |
| Screenshot scope | OBSERVED: hai section nhỏ liên tiếp ngay sau Service Detail Overview, gồm một grid 4 loại dịch vụ implant và một grid 5 lợi ích |
| Reference service | `Dental Implants` |
| Target viewport | OBSERVED: screenshot khoảng `1201 × 567 px` |
| Template behavior | INFERRED: hai section thuộc reusable service-detail template; title, item list, copy, icons và media thay đổi theo service |
| Primary implementation goal | Reproduce both desktop sections with maximum visual fidelity while keeping all service-specific content configurable |
| Overall evidence quality | High cho layout và visible copy; Medium cho exact typography, colors, spacing và source assets |

## 2. Scope Boundary

### Included in this spec
- OBSERVED: outer bordered container của `Dental Implant Services`.
- OBSERVED: section title nằm top-left.
- OBSERVED: grid 4 service-type cards.
- OBSERVED: mỗi service card có icon badge, image, title và description.
- OBSERVED: outer bordered container của `Benefits of Dental Implants`.
- OBSERVED: benefits title centered.
- OBSERVED: grid 5 benefit cards.
- OBSERVED: mỗi benefit card có large outline icon, title và short description.
- OBSERVED: hai section có cùng hệ visual: white surface, pale-blue border, navy text, blue iconography.

### Excluded from this spec
- UNKNOWN: section trước/sau ngoài phạm vi screenshot.
- UNKNOWN: click behavior của service cards.
- UNKNOWN: hover/active states.
- UNKNOWN: routes cho từng implant service subtype.
- UNKNOWN: mobile/tablet layout.
- UNKNOWN: CMS/API.
- UNKNOWN: animation.
- UNKNOWN: generic content mapping cho các service khác.

### Section start and end
- `service-variants` start: OBSERVED — outer rounded container bắt đầu gần top screenshot.
- `service-variants` end: OBSERVED — kết thúc ngay sau 4-card row.
- `service-benefits` start: OBSERVED — second rounded container bắt đầu sau một khoảng vertical gap nhỏ.
- `service-benefits` end: INFERRED — kết thúc tại bottom edge screenshot sau 5 benefit cards.
- Cropped/partially visible content: UNKNOWN.

## 3. Evidence and Confidence

| Item | Status | Evidence / reason |
|---|---|---|
| Two distinct sections | OBSERVED | Hai outer containers riêng biệt |
| First section 4-column layout | OBSERVED | 4 cards trên một hàng |
| Second section 5-column layout | OBSERVED | 5 cards trên một hàng |
| Visible copy | OBSERVED | Title/item copy đọc được |
| Card structure | OBSERVED | Image/icon/title/body hierarchy rõ |
| Typography values | INFERRED | Không có font metadata |
| Colors | INFERRED | Có thể xác định hệ màu nhưng không exact token |
| Service images | OBSERVED | 4 implant subtype images |
| Benefit icons | OBSERVED | 5 line icons |
| Interaction behavior | UNKNOWN | Không có evidence |
| Responsive behavior | UNKNOWN | Chỉ desktop |

## 4. OCR Content Inventory

### 4.1 Service variants

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `variants-title` | Dental Implant Services | Section heading | High | Top-left |
| `variant-1-title` | Single Tooth Implant | Card heading | High | |
| `variant-1-description` | Replace a single missing tooth with a natural-looking implant and crown. | Paragraph | High | |
| `variant-2-title` | Multiple Tooth Implants | Card heading | High | |
| `variant-2-description` | Replace several missing teeth with implant-supported restorations. | Paragraph | High | |
| `variant-3-title` | Full-Arch Implants | Card heading | High | |
| `variant-3-description` | Restore an entire arch with secure, fixed implant solutions. | Paragraph | High | |
| `variant-4-title` | Implant-Supported Crown/Bridge | Card heading | High | Wraps to 2 lines |
| `variant-4-description` | Strong, durable restorations for long-term stability and chewing comfort. | Paragraph | High | |

### 4.2 Benefits

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `benefits-title` | Benefits of Dental Implants | Section heading | High | Centered |
| `benefit-1-title` | Restore Chewing Function | Card heading | High | |
| `benefit-1-description` | Enjoy your favorite foods with confidence. | Paragraph | High | |
| `benefit-2-title` | Natural Appearance | Card heading | High | |
| `benefit-2-description` | Look and feel like your real teeth. | Paragraph | High | |
| `benefit-3-title` | Bone Preservation | Card heading | High | |
| `benefit-3-description` | Prevent bone loss and maintain facial structure. | Paragraph | High | |
| `benefit-4-title` | Long-Term Stability | Card heading | High | |
| `benefit-4-description` | Built to last with proper care and maintenance. | Paragraph | High | |
| `benefit-5-title` | Comfort & Confidence | Card heading | High | |
| `benefit-5-description` | No slipping, no adhesives—just a confident smile. | Paragraph | High | |

## 5. Layout Anatomy

### 5.1 Global geometry

| Property | Specification | Status |
|---|---|---|
| Screenshot width | ~`1201 px` | OBSERVED |
| Combined section height | ~`567 px` | OBSERVED |
| Page background | White / near-white | OBSERVED |
| Content container | Centered, ~`1080 px estimated` | INFERRED |
| Horizontal outer gutter | ~`61 px estimated` | INFERRED |
| Gap between sections | ~`13–16 px estimated` | INFERRED |
| Section outer radius | ~`14–16 px estimated` | INFERRED |
| Section outer border | ~`1 px estimated` pale blue-gray | INFERRED |

### 5.2 Structure tree

Section: service-variants
├── Outer bordered container
│   ├── Section heading
│   │   └── Dental Implant Services
│   └── Variant grid
│       ├── Variant card 1
│       │   ├── Small icon badge
│       │   ├── Service image
│       │   ├── Title
│       │   └── Description
│       ├── Variant card 2
│       ├── Variant card 3
│       └── Variant card 4

Section: service-benefits
├── Outer bordered container
│   ├── Centered heading
│   │   └── Benefits of Dental Implants
│   └── Benefits grid
│       ├── Benefit card 1
│       │   ├── Large outline icon
│       │   ├── Title
│       │   └── Description
│       ├── Benefit card 2
│       ├── Benefit card 3
│       ├── Benefit card 4
│       └── Benefit card 5

### 5.3 Spatial relationships — Service variants

| Element | Position and dimensions | Alignment relationship | Spacing relationship | Status |
|---|---|---|---|---|
| Outer container | ~`1080 × 318 px estimated` | Centered | ~`15 px estimated` internal top padding | INFERRED |
| Section title | Top-left | Aligns with grid left edge | ~`18 px estimated` left inset | INFERRED |
| Grid | 4 equal columns | Full inner width | ~`15–18 px estimated` gaps | INFERRED |
| Variant card | ~`247 × 249 px estimated` | Equal widths | Same row baseline | INFERRED |
| Icon badge | Top-left inside card | Overlay/foreground above media | ~`14 px estimated` inset | OBSERVED / INFERRED |
| Media | Top half of card | Centered | Occupies ~`130 px estimated` height | INFERRED |
| Title | Below image | Left aligned | ~`8–12 px estimated` gap | INFERRED |
| Description | Below title | Left aligned | ~`5–8 px estimated` gap | INFERRED |

### 5.4 Spatial relationships — Benefits

| Element | Position and dimensions | Alignment relationship | Spacing relationship | Status |
|---|---|---|---|---|
| Outer container | ~`1080 × 205 px estimated` | Centered | Below variants section | INFERRED |
| Section heading | Top-center | Container center axis | ~`10–15 px estimated` from top | INFERRED |
| Benefits grid | 5 equal columns | Centered | ~`22–24 px estimated` gap | INFERRED |
| Benefit card | ~`182 × 150 px estimated` | Equal row alignment | Same height | INFERRED |
| Benefit icon | Top-center | Centered in card | ~`12 px estimated` top inset | INFERRED |
| Benefit title | Centered | Same axis as icon | ~`8–10 px estimated` below icon | INFERRED |
| Benefit description | Centered | Same axis as title | ~`6 px estimated` below title | INFERRED |

### 5.5 Layering and overlap

| Layer order | Element | Behavior | Status |
|---:|---|---|---|
| 1 | Page background | White | OBSERVED |
| 2 | Section outer containers | White with pale border | OBSERVED |
| 3 | Inner cards | White bordered surfaces | OBSERVED |
| 4 | Images/icons | Foreground | OBSERVED |
| 5 | Copy | Foreground | OBSERVED |
| 6 | Variant icon badges | Visually top layer inside card | OBSERVED |

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate | Usage | Value / description | Status |
|---|---|---|---|
| `color/surface/page` | Page | White | OBSERVED |
| `color/surface/section` | Outer containers | White | OBSERVED |
| `color/surface/card` | Inner cards | White | OBSERVED |
| `color/text/heading` | Section/card titles | Deep navy | OBSERVED / INFERRED |
| `color/text/body` | Descriptions | Muted navy/slate | OBSERVED / INFERRED |
| `color/icon/primary` | Icons | Bright medium blue | OBSERVED / INFERRED |
| `color/icon/background` | Variant badge background | Pale blue | OBSERVED / INFERRED |
| `color/border/section` | Outer container | Pale blue-gray | OBSERVED / INFERRED |
| `color/border/card` | Inner card | Pale blue-gray | OBSERVED / INFERRED |

Exact HEX/RGB values: UNKNOWN.

### 6.2 Typography

| Element | OCR reference | Font family | Weight | Size | Line-height | Alignment | Status |
|---|---|---|---|---|---|---|---|
| Variants heading | `Dental Implant Services` | UNKNOWN | ~600–700 | ~`24–25 px estimated` | ~`30 px estimated` | Left | INFERRED |
| Benefits heading | `Benefits of Dental Implants` | UNKNOWN | ~600–700 | ~`23–25 px estimated` | ~`30 px estimated` | Center | INFERRED |
| Variant title | Variant titles | UNKNOWN | ~600–700 | ~`13–14 px estimated` | ~`17 px estimated` | Left | INFERRED |
| Variant body | Variant descriptions | UNKNOWN | ~400 | ~`11 px estimated` | ~`17 px estimated` | Left | INFERRED |
| Benefit title | Benefit titles | UNKNOWN | ~600 | ~`12–13 px estimated` | ~`16 px estimated` | Center | INFERRED |
| Benefit body | Benefit descriptions | UNKNOWN | ~400 | ~`10–11 px estimated` | ~`15–16 px estimated` | Center | INFERRED |

### 6.3 Borders, radius, effects

| Element | Border | Radius | Shadow / blur | Status |
|---|---|---|---|---|
| Outer section container | ~`1 px estimated` pale blue-gray | ~`14–16 px estimated` | None/minimal | INFERRED |
| Variant card | ~`1 px estimated` pale blue-gray | ~`14 px estimated` | None/minimal | INFERRED |
| Benefit card | ~`1 px estimated` pale blue-gray | ~`12–14 px estimated` | None/minimal | INFERRED |
| Icon badge | Pale-blue circular/rounded holder | 50% / circular | None | OBSERVED |
| Images | No visible border | No independent obvious radius beyond clipping/container | None | OBSERVED / UNKNOWN |

### 6.4 Icons and decoration

| Element ID | Description | Asset type | Size / placement | Source required | Status |
|---|---|---|---|---|---|
| `variant-icon-1` | Tooth outline | SVG preferred | Small circular badge top-left | Figma/project asset | OBSERVED |
| `variant-icon-2` | Multi-implant / bridge concept | SVG preferred | Small badge | Figma/project asset | OBSERVED |
| `variant-icon-3` | Full-arch concept icon | SVG preferred | Small badge | Figma/project asset | OBSERVED |
| `variant-icon-4` | Implant/crown support icon | SVG preferred | Small badge | Figma/project asset | OBSERVED |
| `benefit-chewing-icon` | Tooth/chewing outline | SVG preferred | Large centered icon | Figma/project asset | OBSERVED |
| `benefit-natural-icon` | Tooth pair / natural appearance outline | SVG preferred | Large centered icon | Figma/project asset | OBSERVED |
| `benefit-bone-icon` | Bone/implant preservation icon | SVG preferred | Large centered icon | Figma/project asset | OBSERVED |
| `benefit-stability-icon` | Shield/check style icon | SVG preferred | Large centered icon | Figma/project asset | OBSERVED |
| `benefit-confidence-icon` | Tooth/heart-like outline | SVG preferred | Large centered icon | Figma/project asset | OBSERVED |

## 7. Asset Manifest

### 7.1 Service variant images

| Asset ID | Visible description | Required format | Placement | Alt requirement | Status |
|---|---|---|---|---|---|
| `single-tooth-implant` | Một implant đơn kèm crown nằm giữa gum/bone cross-section | PNG / WebP / JPG | Variant card 1 | Purposeful alt if informative | OBSERVED |
| `multiple-tooth-implants` | Ba implant posts / crowns trên cùng gum segment | PNG / WebP / JPG | Variant card 2 | Same | OBSERVED |
| `full-arch-implants` | Full upper arch + implant-supported lower arch visualization | PNG / WebP / JPG | Variant card 3 | Same | OBSERVED |
| `implant-supported-bridge` | Bridge/crown restoration supported by two implants | PNG / WebP / JPG | Variant card 4 | Same | OBSERVED |

### 7.2 Icon assets
- 4 service-type badge icons.
- 5 benefit icons.

### Asset handling rules
- Variant images must be configurable per service-detail page.
- Do not hard-code implant-specific images into reusable section shell.
- Preserve white/light image backgrounds; do not introduce dark image cards.
- Exact reference assets should be reused for Dental Implants fidelity.
- Variant images should use consistent visual bounds but may require per-item object positioning.
- Benefit icons should use a shared stroke system and consistent visual size.
- Do not substitute generic emoji or unrelated icon sets.

## 8. Component Contract

### 8.1 Recommended component boundary

| Component | Responsibility | Reusable? | Evidence | Status |
|---|---|---|---|---|
| `ServiceVariantsSection` | Outer shell + service subtype grid | Yes | Distinct reusable pattern | INFERRED |
| `ServiceVariantCard` | Badge icon + image + title + description | Yes | Repeated 4× | OBSERVED |
| `ServiceBenefitsSection` | Outer shell + benefit grid | Yes | Distinct reusable pattern | INFERRED |
| `ServiceBenefitCard` | Icon + title + description | Yes | Repeated 5× | OBSERVED |

### 8.2 Reusable data model

// Interface contract only, not implementation code.

interface ServiceVariantsSectionData {
  id: string;
  title: string;
  items: Array<{
    title: string;
    description: string;
    icon: string;
    image: string;
    href?: string;
  }>;
}

interface ServiceBenefitsSectionData {
  id: string;
  title: string;
  items: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

| Field | Type | Required | Visible evidence | Notes |
|---|---|---|---|---|
| `title` | string | Yes | Both section titles visible | Service-specific |
| `items` | array | Yes | 4 + 5 items in reference | Count should be configurable |
| `items[].title` | string | Yes | All cards have titles | Service-specific |
| `items[].description` | string | Yes | All cards have descriptions | Service-specific |
| `items[].icon` | asset | Yes | Every card has icon | Configurable |
| `variants.items[].image` | asset | Yes | Each variant has image | Configurable |
| `variants.items[].href` | string | No / UNKNOWN | Click behavior not visible | Do not invent |

### 8.3 Content behavior
- Dental Implants reference:
  - 4 service variant items.
  - 5 benefit items.
- Do not assume all services use 4 variants and 5 benefits.
- Section rendering should derive grid content from service configuration.
- If another service has no meaningful sub-services/variants, `service-variants` may need to be optional; product decision required.
- `service-benefits` is more likely generic across service pages, but exact item count remains UNKNOWN.
- Titles must be explicit content fields rather than automatically generated from service name unless product confirms naming convention.
- These sections should map to corresponding hero anchor items where configured.

## 9. Interaction States

| Element | Default evidence | Hover | Active | Focus | Destination | Status |
|---|---|---|---|---|---|---|
| Variant card | Static bordered card | UNKNOWN | UNKNOWN | UNKNOWN unless interactive | UNKNOWN | OBSERVED / UNKNOWN |
| Variant image | Static | UNKNOWN | UNKNOWN | N/A unless linked | UNKNOWN | OBSERVED |
| Benefit card | Static informational card | N/A / UNKNOWN | N/A | N/A | None visible | OBSERVED |
| Benefit icon | Static | N/A | N/A | N/A | None | OBSERVED |

### Interaction constraints
- Do not make subtype cards clickable without confirmation.
- Do not invent Learn More links.
- Do not add hover elevation, image zoom or card scale.
- Benefit cards should remain informational unless design/product adds interaction.
- Do not invent carousel behavior for either grid.

## 10. Responsive Specification

### 10.1 Evidence available
- Desktop service variants: OBSERVED — 4 columns.
- Desktop benefits: OBSERVED — 5 columns.
- Tablet evidence: UNKNOWN.
- Mobile evidence: UNKNOWN.

### 10.2 Required desktop behavior

#### Service variants
- Maintain one horizontal row of 4 equal-width cards.
- Keep title top-left.
- Keep image area visually dominant within each card.
- Preserve left-aligned card copy.
- Ensure cards share equal height.

#### Benefits
- Maintain one horizontal row of 5 equal-width cards.
- Keep section heading centered.
- Keep icon/title/body centered.
- Maintain equal card heights.
- Keep large consistent gaps/padding around icons.

### 10.3 Proposed responsive behavior

| Section | Desktop | Tablet | Mobile | Status |
|---|---|---|---|---|
| Service variants | 4 columns | UNKNOWN | UNKNOWN | Desktop OBSERVED |
| Benefits | 5 columns | UNKNOWN | UNKNOWN | Desktop OBSERVED |

### 10.4 Responsive assumptions requiring approval
- Tablet/mobile column counts.
- Whether cards become horizontal-scroll carousels.
- Whether benefits use 2-column or single-column layout.
- Whether section outer containers retain visible border on mobile.
- Mobile typography reduction.
- Image aspect ratio changes.
- Mobile card min-height.
- Section horizontal padding.
- Whether card titles/descriptions are truncated.

## 11. Semantic HTML and Accessibility

### Recommended structure
- Each outer block should be a semantic section associated with its heading.
- Variant collections: semantic list/grid.
- Variant titles: child headings beneath section heading.
- Benefit collections: semantic list/grid.
- Benefit titles: child headings or strong labels according to hierarchy.
- Images: meaningful alt if they explain treatment type.
- Icons: decorative if adjacent title conveys meaning.
- Keyboard behavior: only required if subtype cards become links.
- Focus visibility: required for any clickable variant.
- Screen-reader order: section heading → cards in visual order.

### Accessibility constraints
- Do not make static benefit cards focusable.
- Decorative icons should not duplicate visible titles for screen readers.
- Variant images that explain distinct treatment types should have purposeful alt text.
- Do not use OCR copy automatically as alt text.
- If subtype cards become links, link accessible names should identify the exact treatment subtype.
- Ensure centered benefit body text remains readable and not overly narrow.

## 12. Implementation Constraints

- Both sections must be part of the reusable service-detail content system.
- Do not create Dental-Implants-only structural components.
- Drive all titles, cards, icons, images and descriptions from service configuration.
- Do not hard-code 4 or 5 as universal item counts.
- Preserve the Dental Implants screenshot grid for its reference data.
- Outer section containers should share design tokens for border/radius.
- Inner card components should use common card tokens where possible.
- Do not invent click behavior.
- Do not invent missing subtype cards for another service just to fill the grid.
- If a service has no variant section, omission/alternate behavior requires product schema rather than fabricated content.
- Prefer per-item image positioning where exact crop differs.
- Reuse common icon stroke style.

## 13. Visual Acceptance Criteria

### 13.1 Dental Implant Services
- [ ] Outer rounded container aligns with reference.
- [ ] `Dental Implant Services` is left-aligned at the correct inset.
- [ ] Exactly 4 cards display for the Dental Implants reference.
- [ ] Card widths/gaps are uniform.
- [ ] All cards align at top/bottom.
- [ ] Badge icons appear top-left consistently.
- [ ] Images use the correct reference asset and crop.
- [ ] Card titles match exactly.
- [ ] Card descriptions match exactly.
- [ ] `Implant-Supported Crown/Bridge` wraps similarly to screenshot.
- [ ] Card borders/radii match.

### 13.2 Benefits of Dental Implants
- [ ] Second outer container aligns with first.
- [ ] Heading is horizontally centered.
- [ ] Exactly 5 benefit cards display for reference.
- [ ] All card widths/heights match.
- [ ] Icons use consistent size/stroke.
- [ ] Benefit titles match exactly.
- [ ] Benefit descriptions match exactly.
- [ ] All text remains centered.
- [ ] No unsupported buttons or links are added.

### 13.3 Reusability
- [ ] Both sections render from structured service data.
- [ ] Different services can replace item arrays without component duplication.
- [ ] Images/icons can vary per item.
- [ ] Sections can support different valid item counts once approved.
- [ ] No implant-specific copy is embedded in shared components.

## 14. Visual Risks

| Risk | Why it affects fidelity | Mitigation | Priority |
|---|---|---|---|
| Exact 4 variant images unavailable | Images dominate first section | Export/retrieve exact Figma assets | High |
| Hard-coding item counts | Breaks reusable service template | Use array-driven rendering | High |
| Generic image sizing | Different item visuals may appear misaligned | Support per-image object-position/contain rules | High |
| Unknown typography | Long titles such as `Implant-Supported Crown/Bridge` may wrap differently | Retrieve exact typography tokens | High |
| Incorrect outer/inner borders | Repeated bordered structure defines section visual | Use project design tokens or calibrate carefully | Medium |
| Benefit icon set mismatch | Five large icons are visually prominent | Use exact project/Figma icons | Medium |
| Other services may not have variants | Forcing this section would invent taxonomy | Make section optional based on content schema | High |
| Responsive behavior unknown | 4- and 5-column rows will not fit narrow screens | Obtain responsive design | High |

## 15. Open Questions

| ID | Question | Blocking level | Suggested owner |
|---|---|---|---|
| Q1 | `Dental Implant Services` tương ứng với generic section type nào trên các service khác: `services`, `treatments`, `options`, `types` hay custom? | Blocking for content architecture | Product / Designer |
| Q2 | Mọi service detail có section variants/options này không? | Blocking | Product |
| Q3 | Nếu một service không có subtype/variant thì section này được ẩn hoàn toàn hay dùng nội dung khác? | Blocking | Product / Designer |
| Q4 | 4 variant cards có clickable không? | Blocking for interaction | Product |
| Q5 | Nếu clickable, destination của từng card là in-page anchor, service child page hay action khác? | Blocking | Product / Developer |
| Q6 | Exact 4 Dental Implant service images nằm ở đâu? | Blocking for fidelity | Designer / Developer |
| Q7 | Exact 4 variant badge icons nằm ở đâu? | Non-blocking | Designer / Developer |
| Q8 | `Benefits of Dental Implants` có phải generic `Benefits of {Service}` hay title custom? | Blocking for content schema | Product |
| Q9 | Mọi service có 5 benefits hay count thay đổi? | Blocking for reusable layout | Product / Designer |
| Q10 | Benefit card count khác 5 sẽ dùng grid behavior nào? | Blocking for responsive/flexible layout | Designer |
| Q11 | Exact 5 benefit icons nằm ở đâu? | Non-blocking | Designer / Developer |
| Q12 | Hai section này map trực tiếp tới anchor `Services` và `Benefits` trong hero nav đúng không? | Blocking for anchor navigation | Product / Developer |
| Q13 | Có tablet/mobile references cho cả hai section không? | Blocking for responsive fidelity | Designer |
| Q14 | Exact border/radius/spacing/font tokens dùng chung cho card system là gì? | Non-blocking | Designer / Developer |

## 16. Handoff Summary

### Safe to implement now
- Hai section riêng liên tiếp.
- Shared rounded/bordered section-container treatment.
- `Dental Implant Services` với 4-column desktop grid cho reference.
- Service variant card anatomy: badge icon → image → title → description.
- `Benefits of Dental Implants` với centered heading.
- 5-column desktop benefits grid cho reference.
- Benefit card anatomy: icon → centered title → centered description.
- Exact high-confidence Dental Implants copy.
- Array-driven card rendering.
- Config-driven icons/images/copy.

### Requires asset export
- 4 implant service variant images.
- 4 variant badge icons.
- 5 benefit icons.

### Requires design/product decision
- Generic type/name của service variants section.
- Whether section is optional across services.
- Card click behavior.
- Generic benefits title convention.
- Allowed item counts.
- Grid behavior for non-reference item counts.
- Anchor mapping to `Services` / `Benefits`.
- Responsive layouts.

### Do not assume
- Tất cả service có 4 variants.
- Tất cả service có variants section.
- Tất cả service có 5 benefits.
- Variant cards are clickable.
- Variant cards have child-detail routes.
- Benefits are clickable.
- Carousel behavior.
- Hover animation.
- Fixed desktop counts on tablet/mobile.
- Exact font family.
- Exact HEX colors.