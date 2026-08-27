# UI Implementation Spec — Address / Clinic Location

## 1. Identity

| Field | Value |
|---|---|
| Route | `/` |
| Section ID | `address` |
| Section name | `Address / Clinic Location` |
| Screenshot scope | OBSERVED: section vị trí phòng khám gồm bản đồ ở bên trái và card thông tin địa chỉ ở bên phải |
| Target viewport | OBSERVED: screenshot `1354 × 302 px`; section desktop hiển thị trọn theo chiều ngang |
| Primary implementation goal | Reproduce the supplied desktop screenshot with maximum visual fidelity |
| Overall evidence quality | High cho desktop layout và copy; Medium cho typography, màu sắc và map asset |

## 2. Scope Boundary

### Included in this spec
- OBSERVED: bản đồ vị trí phòng khám ở cột trái.
- OBSERVED: location marker/pin màu xanh trên bản đồ.
- OBSERVED: floating clinic information popup nằm trên bản đồ.
- OBSERVED: card `Vị trí phòng khám` ở cột phải.
- OBSERVED: địa chỉ phòng khám.
- OBSERVED: ba dòng thông tin tiện ích/vị trí kèm icon.
- OBSERVED: CTA `CHỈ ĐƯỜNG TRÊN GOOGLE MAPS` kèm arrow icon.
- OBSERVED: border, radius và khoảng cách giữa hai card.

### Excluded from this spec
- UNKNOWN: section phía trên.
- UNKNOWN: section phía dưới.
- UNKNOWN: Google Maps embed/API implementation.
- UNKNOWN: interaction khi click/drag/zoom bản đồ.
- UNKNOWN: URL Google Maps chính xác.
- UNKNOWN: hover/active state của CTA.
- UNKNOWN: responsive/mobile layout.
- UNKNOWN: behavior khi map không load được.

### Section start and end
- Start: INFERRED — bắt đầu tại vùng whitespace phía trên hai card, khoảng `13 px estimated` từ mép screenshot.
- End: INFERRED — kết thúc sau hai card, trước đường phân cách/mép dưới screenshot.
- Cropped/partially visible content: UNKNOWN — không có section kế tiếp đủ rõ để phân tích.

## 3. Evidence and Confidence

| Item | Status | Evidence / reason |
|---|---|---|
| Section boundary | INFERRED | Screenshot crop tập trung vào riêng section nhưng không cho thấy neighboring sections đầy đủ |
| Desktop layout | OBSERVED | Hai card nằm ngang trong centered container |
| Copy/text content | OBSERVED | Nội dung card phải đọc được rõ |
| Map composition | OBSERVED | Map, marker và clinic popup hiển thị trực tiếp |
| Typography values | INFERRED | Có thể ước lượng hierarchy nhưng không xác định font metadata |
| Colors | INFERRED | Màu có thể ước lượng từ screenshot nhưng không có design token |
| Assets | OBSERVED / UNKNOWN | Map và icons nhìn thấy nhưng source asset/provider chưa xác định |
| Interaction states | UNKNOWN | Chỉ có default state |
| Responsive behavior | UNKNOWN | Không có tablet/mobile screenshot |

## 4. OCR Content Inventory

> Preserve all readable text exactly as shown. Mark uncertainty explicitly.

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `location-title` | Vị trí phòng khám | Heading | High | Heading card phải |
| `location-address` | 233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam | Address / paragraph | High | Dòng đầu tiên kèm pin icon |
| `location-benefit-1` | Thuận tiện di chuyển từ Phường Phú Nhuận | Paragraph / feature | High | Kèm location icon |
| `location-benefit-2` | Cách Nhà hát Thành phố 5 phút đi bộ | Paragraph / feature | High | Kèm building/landmark icon |
| `location-benefit-3` | Có bãi đậu xe ô tô và xe máy | Paragraph / feature | High | Kèm vehicle/parking icon |
| `location-cta` | CHỈ ĐƯỜNG TRÊN GOOGLE MAPS | CTA | High | Outline button |
| `map-popup-title` | Smilux Dental Clinic | Map label | Medium | Text nhỏ trong popup |
| `map-popup-address-line-1` | 233 – 233A Nguyễn Trọng Tuyển, | Map label | Medium | Text nhỏ |
| `map-popup-address-line-2` | Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam | Map label | Medium | Text nhỏ |

## 5. Layout Anatomy

### 5.1 Global geometry

| Property | Specification | Status |
|---|---|---|
| Section width | Full screenshot width `1354 px`; centered content ~`1115 px estimated` | OBSERVED / INFERRED |
| Section height | Screenshot `302 px`; cards ~`259 px estimated` | OBSERVED / INFERRED |
| Background behavior | Full-bleed solid white / very light cool-white | OBSERVED |
| Content container | Centered horizontal container | OBSERVED / INFERRED |
| Horizontal gutters | ~`120 px estimated` left and right | INFERRED |
| Main layout model | Two-column layout | OBSERVED |
| Left/right ratio | ~`56% / 44% estimated` | INFERRED |
| Column gap | ~`13 px estimated` | INFERRED |
| Vertical alignment | Both cards top- and bottom-aligned | OBSERVED |
| Overflow / cropping | No visible overflow | OBSERVED |

### 5.2 Structure tree

Section: address
├── Centered container
│   ├── Map card
│   │   ├── Map surface
│   │   ├── Clinic location marker
│   │   └── Clinic information popup
│   │       ├── Location icon
│   │       ├── Clinic name
│   │       └── Address
│   │
│   └── Location information card
│       ├── Heading
│       ├── Address row
│       │   ├── Pin icon
│       │   └── Address
│       ├── Location benefits
│       │   ├── Benefit row 1
│       │   ├── Benefit row 2
│       │   └── Benefit row 3
│       └── Google Maps CTA
│           ├── Label
│           └── Arrow icon

### 5.3 Spatial relationships

| Element | Position and dimensions | Alignment relationship | Spacing relationship | Status |
|---|---|---|---|---|
| Main container | ~`1115 px estimated` wide | Centered horizontally | ~`120 px estimated` outer gutters | INFERRED |
| Map card | ~`617 × 259 px estimated` | Left edge of container | ~`13 px estimated` gap to info card | INFERRED |
| Info card | ~`485 × 259 px estimated` | Right edge of container | Same vertical bounds as map | INFERRED |
| Map | Fills complete left card | Clipped to card radius | No internal outer padding | OBSERVED |
| Map popup | Near center-right of map | Floating above marker | Marker extends below popup | OBSERVED |
| Info content | Internal padding ~`25 px estimated` | Consistent left alignment | Repeated vertical rhythm | INFERRED |
| Heading | Top-left of info card | Aligns with content rows | ~`12–15 px estimated` before address | INFERRED |
| Address row | Below heading | Icon left, copy right | Compact icon/text gap | OBSERVED |
| Benefits | Vertical list below address | All icons share same x-axis | ~`20–25 px estimated` row rhythm | INFERRED |
| CTA | Bottom-left region of info card | Aligned with main text content | Clear whitespace above | OBSERVED |
| CTA width | ~`287 px estimated` | Content-sized, not full-width | Left-aligned | INFERRED |

### 5.4 Layering and overlap

| Layer order | Element | Behavior | Status |
|---:|---|---|---|
| 1 | Section background | Static white surface | OBSERVED |
| 2 | Map and info cards | Main section surfaces | OBSERVED |
| 3 | Map visual | Fills map card | OBSERVED |
| 4 | Map marker | Overlay above map | OBSERVED |
| 5 | Clinic popup | Overlay above map and marker | OBSERVED |
| 6 | Card text/icons/CTA | Foreground content | OBSERVED |

Map popup and marker are the only clearly visible overlapping elements.

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate | Usage | Value / description | Status |
|---|---|---|---|
| `color/surface/page` | Section background | White / near-white | OBSERVED / INFERRED |
| `color/surface/card` | Location info card | White | OBSERVED |
| `color/text/primary` | Heading | Dark navy | OBSERVED / INFERRED |
| `color/text/secondary` | Address and benefit copy | Muted navy/slate | OBSERVED / INFERRED |
| `color/action/primary` | CTA border/text/arrow | Saturated royal blue | OBSERVED / INFERRED |
| `color/icon/default` | Benefit icons | Muted blue/navy | OBSERVED / INFERRED |
| `color/map/pin` | Main location marker | Saturated blue | OBSERVED |
| `color/border/card` | Both cards | Very light blue-gray | OBSERVED / INFERRED |
| `color/surface/map-popup` | Clinic popup | White | OBSERVED |

Exact HEX/RGB values: UNKNOWN.

### 6.2 Typography

| Element | OCR text reference | Font family | Weight | Size | Line-height | Letter spacing | Color | Status |
|---|---|---|---|---|---|---|---|---|
| H2 | `location-title` | UNKNOWN | ~700 | ~`20 px estimated` | ~`26 px estimated` | UNKNOWN | Dark navy | INFERRED |
| Address | `location-address` | UNKNOWN | ~400–500 | ~`12–13 px estimated` | ~`18 px estimated` | UNKNOWN | Navy/slate | INFERRED |
| Benefit | `location-benefit-*` | UNKNOWN | ~400–500 | ~`12–13 px estimated` | ~`18 px estimated` | UNKNOWN | Navy/slate | INFERRED |
| Primary CTA | `location-cta` | UNKNOWN | ~600–700 | ~`12–13 px estimated` | Centered vertically | UNKNOWN | Blue | INFERRED |
| Map popup title | `map-popup-title` | UNKNOWN | ~600 | ~`10–11 px estimated` | UNKNOWN | UNKNOWN | Blue/navy | INFERRED |
| Map popup address | `map-popup-address-*` | UNKNOWN | ~400 | ~`8–9 px estimated` | UNKNOWN | UNKNOWN | Navy/slate | INFERRED |

### 6.3 Borders, radius, effects

| Element | Border | Radius | Shadow / blur | Opacity | Status |
|---|---|---|---|---|---|
| Map card | ~`1 px estimated` light blue-gray | ~`11–12 px estimated` | Very subtle/no visible shadow | 100% | INFERRED |
| Info card | ~`1 px estimated` light blue-gray | ~`11–12 px estimated` | Very subtle/no visible shadow | 100% | INFERRED |
| Map popup | Thin light-gray border | ~`9 px estimated` | Soft drop shadow | 100% | OBSERVED / INFERRED |
| CTA | ~`1.5–2 px estimated` blue outline | Pill radius, ~`18–20 px estimated` | None visible | 100% | INFERRED |

### 6.4 Icons and decoration

| Element ID | Description | Asset type | Size / placement | Source required | Status |
|---|---|---|---|---|---|
| `address-pin-icon` | Outline location pin | SVG / UNKNOWN | ~`14 px estimated`, before address | Existing icon library preferred | OBSERVED |
| `benefit-location-icon` | Outline location pin | SVG / UNKNOWN | ~`14 px estimated` | Existing icon library preferred | OBSERVED |
| `benefit-landmark-icon` | Building/landmark outline | SVG / UNKNOWN | ~`14 px estimated` | Existing icon library preferred | OBSERVED |
| `benefit-parking-icon` | Vehicle/parking-style outline | SVG / UNKNOWN | ~`14 px estimated` | Existing icon library preferred | OBSERVED |
| `cta-arrow-icon` | Right-pointing arrow | SVG / UNKNOWN | ~`14 px estimated`, right of CTA label | Existing icon library preferred | OBSERVED |
| `map-marker` | Solid blue map pin | SVG / map-provider marker / UNKNOWN | Center-right map region | Map asset/provider | OBSERVED |

## 7. Asset Manifest

| Asset ID | Visible description | Required format | Aspect ratio / crop | Placement | Alt text requirement | Status |
|---|---|---|---|---|---|---|
| `clinic-map` | Street map centered around Smilux Dental Clinic / Phường Phú Nhuận | Map embed / raster / UNKNOWN | Wide landscape ~`2.38:1 estimated` | Full map card | Informative map requires accessible location equivalent | OBSERVED |
| `clinic-map-marker` | Blue clinic pin | SVG / provider marker / UNKNOWN | Vertical pin | Overlay on map | Decorative if accessible address is adjacent | OBSERVED |
| `icon-location` | Location pin outline | SVG preferred | Square | Info rows | Decorative when text conveys meaning | OBSERVED |
| `icon-landmark` | Landmark/building outline | SVG preferred | Square | Benefit row | Decorative | OBSERVED |
| `icon-parking` | Parking/vehicle outline | SVG preferred | Square | Benefit row | Decorative | OBSERVED |
| `icon-arrow-right` | Right arrow | SVG preferred | Square | CTA | Decorative | OBSERVED |

### Asset handling rules
- Do not substitute the map with an unrelated generic map screenshot.
- Exact map center, zoom and visible streets are part of desktop visual fidelity.
- Prefer existing project icon assets when their geometry/stroke matches.
- If screenshot map is a static design asset, use the exact exported asset rather than rebuilding an interactive map solely from visual inference.
- If the intended product uses Google Maps dynamically, exact provider/configuration must be confirmed before implementation.
- Do not infer API keys, map IDs, coordinates or provider configuration from the bitmap.

## 8. Component Contract

### 8.1 Recommended component boundary

| Component | Responsibility | Reusable? | Evidence | Status |
|---|---|---|---|---|
| `ClinicLocationSection` | Overall two-column composition | Yes / Unknown | Entire section | INFERRED |
| `ClinicMapCard` | Render map surface, marker and clinic popup | Yes | Distinct left card | INFERRED |
| `ClinicLocationCard` | Heading, address, benefits and CTA | Yes | Distinct right card | INFERRED |
| `LocationInfoRow` | Icon + text row | Yes | Four visually related rows | INFERRED |
| `DirectionsButton` | Google Maps CTA | Yes | Distinct action element | INFERRED |

### 8.2 Data model

// This is an interface contract only, not implementation code.
// Include only properties supported by visible evidence.

interface ClinicLocationSectionData {
  title: string;
  address: string;

  benefits: Array<{
    icon: string;
    text: string;
  }>;

  map: {
    clinicName: string;
    address: string;
    visual: string;
  };

  directionsLabel: string;
  directionsUrl?: string;
}

| Field | Type | Required | Visible evidence | Notes |
|---|---|---|---|---|
| `title` | string | Yes | `Vị trí phòng khám` | Configurable |
| `address` | string | Yes | Address visible | Configurable |
| `benefits` | array | Yes | Three benefit rows | Configurable |
| `map.clinicName` | string | Yes | Popup title visible | Configurable |
| `map.address` | string | Yes | Popup address visible | Configurable |
| `map.visual` | string | Yes | Map visible | Implementation source UNKNOWN |
| `directionsLabel` | string | Yes | CTA visible | Configurable |
| `directionsUrl` | string | No / Unknown | Behavior not visible | Must not be invented |

### 8.3 Content behavior
- Static content: OBSERVED — one clinic/location is shown.
- Configurable content: INFERRED — address, benefits, map configuration and CTA should be data-driven if project architecture supports it.
- Unknown data/API behavior: map provider, coordinates, zoom level, map API, external navigation URL and multi-location behavior are UNKNOWN.

## 9. Interaction States

| Element | Default evidence | Hover | Active | Focus | Disabled | Link/action destination | Status |
|---|---|---|---|---|---|---|---|
| Map | Static-looking map visible | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | OBSERVED / UNKNOWN |
| Map marker | Blue marker | UNKNOWN | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OBSERVED / UNKNOWN |
| Map popup | Visible by default | UNKNOWN | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OBSERVED / UNKNOWN |
| Directions CTA | Blue outlined pill | UNKNOWN | UNKNOWN | Must be accessible | UNKNOWN | Google Maps implied by visible label; exact URL UNKNOWN | OBSERVED / UNKNOWN |

### Interaction constraints
- Do not invent map pan, zoom, marker-click, popup-toggle or geolocation behavior.
- Do not assume the map is interactive solely because it visually resembles Google Maps.
- Do not invent Google Maps URL.
- CTA behavior should remain `destination UNKNOWN` until supplied.
- If CTA opens an external destination, accessible handling and external-link behavior must follow project conventions.

## 10. Responsive Specification

### 10.1 Evidence available
- Desktop evidence: OBSERVED — two-column layout with map left and location information right.
- Tablet evidence: UNKNOWN.
- Mobile evidence: UNKNOWN.

### 10.2 Required desktop behavior
- Maintain centered container.
- Keep map and info card side-by-side.
- Map remains wider than info card.
- Both cards maintain identical visible height.
- Map fills its card edge-to-edge.
- Preserve map crop/center/zoom matching screenshot.
- Keep information card content left-aligned.
- CTA remains content-width rather than full-width.
- Preserve compact spacing and vertical rhythm shown in reference.

### 10.3 Proposed responsive behavior

| Breakpoint range | Layout behavior | Typography behavior | Image/asset behavior | Status and rationale |
|---|---|---|---|---|
| Desktop | Two columns, map wider than information card | Match screenshot hierarchy | Map fills left card | OBSERVED |
| Tablet | UNKNOWN; possible stacked or adjusted two-column layout | UNKNOWN | UNKNOWN | UNKNOWN — no evidence |
| Mobile | UNKNOWN; possible single-column map + info stack | UNKNOWN | UNKNOWN | UNKNOWN — no evidence |

### 10.4 Responsive assumptions requiring approval
- Whether map and info card stack on mobile/tablet.
- Stack order if stacking is required.
- Exact breakpoints.
- Mobile map height/aspect ratio.
- Mobile CTA width.
- Whether map popup remains visible on small screens.
- Whether benefit rows wrap.
- Mobile outer/card padding.

## 11. Semantic HTML and Accessibility

### Recommended structure
- Landmark: section associated with a location heading.
- Heading hierarchy: `Vị trí phòng khám` uses the appropriate heading level according to surrounding page structure; exact level UNKNOWN.
- Interactive elements: directions CTA should be semantic link if it navigates to Google Maps.
- Image semantics: if map is static imagery, provide an accessible textual equivalent via the visible address.
- Keyboard behavior: CTA must be keyboard accessible.
- Focus visibility: CTA requires visible high-contrast focus state.
- Contrast risks: muted body text/icons against white should be verified.
- Screen-reader-only content required: UNKNOWN.
- Form labels, if applicable: N/A.

### Accessibility constraints
- Use semantic HTML; do not use clickable `div` elements.
- All interactive elements require visible keyboard focus.
- Decorative icons should not duplicate adjacent text for screen readers.
- Do not rely on the visual map as the only mechanism for communicating clinic location.
- Preserve the full textual address in accessible content.
- If an embedded third-party map is used, provide an accessible title/label according to provider and project conventions.

## 12. Implementation Constraints

- Use existing semantic design tokens if the codebase provides them.
- Do not hard-code colors, arbitrary spacing, font sizes, radius, shadows, or image URLs when a project token/asset exists.
- Do not invent missing UI states.
- Keep section-specific styles scoped to this section.
- Build reusable primitives only where repeated evidence exists.
- Preserve copy exactly as recorded in the OCR inventory unless a product owner provides corrected copy.
- If an item is marked `UNKNOWN`, stop and request clarification rather than silently deciding.
- Do not infer Google Maps API implementation from the screenshot.
- Do not add map controls that are absent from the screenshot solely because a map provider normally includes them.
- Do not invent latitude/longitude.
- Exact font family must come from existing project/Figma assets rather than visual guessing.

## 13. Visual Acceptance Criteria

The implementation is acceptable only if screenshot comparison at the target desktop viewport confirms:

- [ ] Section boundary matches the reference screenshot.
- [ ] Centered container and horizontal gutters match.
- [ ] Map/info-card column proportions match.
- [ ] Both cards align at top and bottom.
- [ ] Gap between cards matches.
- [ ] Map fills the complete left card without unintended internal padding.
- [ ] Map center, visible streets and zoom visually match the supplied reference as closely as the selected map implementation permits.
- [ ] Clinic popup position, dimensions and visual hierarchy match.
- [ ] Blue map marker is positioned correctly beneath the popup.
- [ ] All OCR-confirmed copy matches exactly.
- [ ] `Vị trí phòng khám` typography and placement match.
- [ ] Address and three benefit rows preserve icon/text alignment.
- [ ] Benefit row spacing matches.
- [ ] CTA remains left-aligned and content-width.
- [ ] CTA outline, pill radius, label and arrow placement match.
- [ ] Both card borders and corner radii match.
- [ ] Background and whitespace match.
- [ ] No unsupported map controls, UI, text or interactions have been invented.
- [ ] All unresolved items remain documented under Open Questions.

## 14. Visual Risks

| Risk | Why it affects fidelity | Mitigation | Priority |
|---|---|---|---|
| Exact map source unavailable | Dynamic map output may differ significantly in labels, colors and visible POIs | Identify whether design uses static exported map or configured provider | High |
| Unknown map coordinates/zoom | Small differences materially change left half of screenshot | Obtain exact coordinates, center and zoom from implementation/design | High |
| Map popup may be custom | Default provider popup is unlikely to reproduce screenshot exactly | Confirm whether popup is custom overlay | High |
| Original font unavailable | Text widths and vertical rhythm may differ | Retrieve font/design tokens from project | High |
| Icon set unknown | Stroke geometry can visibly diverge | Reuse exact project/Figma icons | Medium |
| Exact colors unavailable | Blue CTA/marker and navy typography are prominent | Use existing design tokens or sample from design source | Medium |
| Google Maps CTA URL unknown | Production action cannot be implemented reliably | Obtain canonical destination from product/data | Medium |
| Responsive layout unavailable | Cannot guarantee fidelity outside desktop | Obtain responsive references | Medium |

## 15. Open Questions

| ID | Question | Blocking level | Suggested owner |
|---|---|---|---|
| Q1 | Section ID chính xác trong codebase là `address`, `clinic-location` hay tên khác? | Non-blocking | Developer |
| Q2 | Map trong thiết kế là static image, Google Maps embed hay custom Google Maps implementation? | Blocking | Designer / Developer |
| Q3 | Tọa độ, center và zoom level chính xác của map là gì? | Blocking for dynamic map | Product / Developer |
| Q4 | Popup `Smilux Dental Clinic` là custom overlay hay popup của map provider? | Blocking for fidelity | Designer / Developer |
| Q5 | URL chính xác của CTA `CHỈ ĐƯỜNG TRÊN GOOGLE MAPS` là gì? | Blocking for production behavior | Product |
| Q6 | Font family, weights và typography tokens chính xác là gì? | Blocking for fidelity | Designer / Developer |
| Q7 | Exact icon assets cho location, landmark, parking và arrow nằm ở đâu? | Non-blocking | Designer / Developer |
| Q8 | Exact blue/navy/border color tokens là gì? | Non-blocking | Designer / Developer |
| Q9 | Có tablet/mobile design reference cho section này không? | Blocking for responsive fidelity | Designer |
| Q10 | Map có yêu cầu pan/zoom/click marker hay chỉ dùng để minh họa vị trí? | Blocking for interaction | Product |
| Q11 | Có nhiều cơ sở cần section này support bằng data/config hay hiện tại chỉ có một địa chỉ? | Non-blocking | Product / Developer |

## 16. Handoff Summary

### Safe to implement now
- Desktop two-column composition.
- Map card ở trái và location information card ở phải.
- Map card rộng hơn info card.
- Equal-height card geometry.
- Heading, address và ba benefit rows.
- Icon/text alignment.
- Outlined pill CTA.
- Toàn bộ high-confidence OCR copy.
- Card border/radius hierarchy.
- Map popup và marker như visual elements nếu exact assets/configuration đã có trong project.

### Requires asset export
- Exact map visual nếu thiết kế sử dụng static map.
- Exact location/landmark/parking icons nếu project chưa có.
- Exact CTA arrow icon nếu project chưa có.
- Custom clinic marker/popup assets nếu chúng không đến từ map provider.

### Requires design/product decision
- Static vs dynamic map.
- Map coordinates/center/zoom.
- Google Maps destination URL.
- Map interactions.
- Font/design tokens.
- Responsive behavior.
- Multi-location requirements.

### Do not assume
- Google Maps API implementation.
- API key hoặc Map ID.
- Latitude/longitude.
- Map pan/zoom controls.
- Marker click behavior.
- Popup interaction.
- CTA destination URL.
- Mobile/tablet breakpoint.
- Mobile stack order.
- Multiple clinic support.
- Hover/animation behavior.
- Exact font family.
- Exact HEX colors.
