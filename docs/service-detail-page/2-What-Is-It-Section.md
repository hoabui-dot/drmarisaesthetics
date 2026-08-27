# UI Implementation Spec — Service Detail Overview

## 1. Identity

| Field | Value |
|---|---|
| Route | `/services/:service-slug` |
| Section ID | `service-overview` |
| Section name | `Service Detail Overview` |
| Screenshot scope | OBSERVED: section ngay sau hero của trang chi tiết dịch vụ, gồm phần giải thích dịch vụ bên trái, danh sách 3 lợi ích nổi bật và hình minh họa lớn bên phải |
| Reference service | `Dental Implants` |
| Target viewport | OBSERVED: screenshot khoảng `1401 × 414 px` |
| Template behavior | INFERRED: dùng chung cho tất cả service detail pages; copy, feature list, icon và visual thay đổi theo service |
| Primary implementation goal | Reproduce the supplied desktop screenshot with maximum visual fidelity while preserving a reusable service-detail template |
| Overall evidence quality | High cho desktop structure và copy; Medium cho exact typography, icon assets, color tokens và source image |

## 2. Scope Boundary

### Included in this spec
- OBSERVED: heading `What Are Dental Implants?`.
- OBSERVED: paragraph giải thích Dental Implants.
- OBSERVED: 3 feature/benefit rows.
- OBSERVED: mỗi feature row có circular pale-blue icon holder.
- OBSERVED: feature title đậm màu navy.
- OBSERVED: feature supporting copy nhỏ hơn.
- OBSERVED: large service visual bên phải.
- OBSERVED: image mô tả implant đặt trong xương hàm, với crown, implant screw, gum và jaw-bone cross-section.
- OBSERVED: image card có rounded corners.
- INFERRED: section này tương ứng với anchor `About Implants` trong hero navigation phía trên.
- INFERRED: nội dung phải data-driven để dùng chung cho service khác.

### Excluded from this spec
- UNKNOWN: section tiếp theo phía dưới.
- UNKNOWN: animation khi scroll.
- UNKNOWN: hover/interaction trên feature rows.
- UNKNOWN: image zoom/modal behavior.
- UNKNOWN: mobile/tablet design.
- UNKNOWN: data source/CMS.
- UNKNOWN: exact generic naming cho section tương ứng trên các service khác.

### Section start and end
- Start: OBSERVED — bắt đầu ngay tại vùng whitespace phía trên heading `What Are Dental Implants?`.
- End: INFERRED — kết thúc sau feature thứ ba và đáy hero image.
- Cropped/partially visible content: UNKNOWN — screenshot không cho thấy section kế tiếp.

## 3. Evidence and Confidence

| Item | Status | Evidence / reason |
|---|---|---|
| Desktop layout | OBSERVED | Text/features trái + image phải |
| Section purpose | OBSERVED / INFERRED | Copy giải thích service, tương ứng overview/about section |
| Copy/text content | OBSERVED | Heading, paragraph và 3 feature rows đọc được |
| Feature count | OBSERVED | 3 feature rows |
| Typography exact values | INFERRED | Không có font metadata |
| Colors | INFERRED | Navy/blue/light-blue rõ nhưng exact tokens không xác định |
| Illustration | OBSERVED | Implant cross-section image chiếm cột phải |
| Asset source | UNKNOWN | Không biết image gốc/Figma export |
| Interaction states | UNKNOWN | Không có interactive evidence |
| Responsive behavior | UNKNOWN | Chỉ desktop screenshot |

## 4. OCR Content Inventory

> Preserve all readable text exactly as shown. Values below describe the `Dental Implants` reference instance and should be configurable for other services.

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `overview-title` | What Are Dental Implants? | Heading | High | Service-specific |
| `overview-description` | Dental implants are titanium posts placed in the jawbone to replace missing teeth roots. They provide a stable foundation for crowns, bridges, or full-arch restorations that look, feel, and function like natural teeth. | Paragraph | High | Service-specific |
| `feature-1-title` | Strong & Durable | Feature heading | High | |
| `feature-1-description` | Made from biocompatible titanium for long-lasting strength. | Paragraph | High | |
| `feature-2-title` | Natural Look & Feel | Feature heading | High | |
| `feature-2-description` | Designed to match your natural teeth in function and appearance. | Paragraph | High | |
| `feature-3-title` | Preserve Bone Health | Feature heading | High | |
| `feature-3-description` | Help maintain jawbone density and prevent bone loss. | Paragraph | High | |

## 5. Layout Anatomy

### 5.1 Global geometry

| Property | Specification | Status |
|---|---|---|
| Section width | Full viewport width | OBSERVED |
| Section height | ~`414 px` screenshot height | OBSERVED |
| Background behavior | Solid white / very light cool-white | OBSERVED |
| Content container | Wide centered layout | OBSERVED / INFERRED |
| Horizontal gutters | ~`85–90 px estimated` left; ~`80 px estimated` right | INFERRED |
| Main layout model | Two-column split | OBSERVED |
| Left column width | ~`38–40% container estimated` | INFERRED |
| Right column width | ~`52–55% container estimated` | INFERRED |
| Column gap | ~`65–80 px estimated` | INFERRED |
| Vertical alignment | Heading begins above image midpoint; left content vertically distributed | OBSERVED |
| Overflow / cropping | No visible overflow | OBSERVED |

### 5.2 Structure tree

Section: service-overview
├── Content container
│   ├── Overview content
│   │   ├── H2
│   │   │   └── What Are Dental Implants?
│   │   ├── Intro paragraph
│   │   └── Feature list
│   │       ├── Feature 1
│   │       │   ├── Icon holder
│   │       │   │   └── Icon
│   │       │   └── Copy
│   │       │       ├── Strong & Durable
│   │       │       └── Description
│   │       ├── Feature 2
│   │       │   ├── Icon holder
│   │       │   └── Copy
│   │       │       ├── Natural Look & Feel
│   │       │       └── Description
│   │       └── Feature 3
│   │           ├── Icon holder
│   │           └── Copy
│   │               ├── Preserve Bone Health
│   │               └── Description
│   │
│   └── Service illustration
│       └── Dental implant cross-section image

### 5.3 Spatial relationships

| Element | Position and dimensions | Alignment relationship | Spacing relationship | Status |
|---|---|---|---|---|
| Section container | Centered horizontally | Full content bounds | ~`30 px estimated` top/bottom inset | INFERRED |
| Heading | Top-left of left column | Same left edge as paragraph | ~`10–15 px estimated` top offset | INFERRED |
| Intro paragraph | Under heading | Same max width as content column | ~`10–14 px estimated` gap | INFERRED |
| Feature list | Under paragraph | Same left content region | ~`22–28 px estimated` gap | INFERRED |
| Feature rows | Vertical stack | Icon left + copy right | ~`20–25 px estimated` between rows | INFERRED |
| Icon holder | ~`50–55 px estimated` circle | Same x-axis across rows | ~`18–20 px estimated` gap to copy | INFERRED |
| Feature title | Top of feature copy | Vertically aligned near icon upper-middle | ~`3–5 px estimated` before description | INFERRED |
| Right image | ~`683 × 343 px estimated` | Right aligned within container | Vertically centered relative to section | INFERRED |
| Image card | Wide rounded rectangle | Right column | No additional caption | OBSERVED |

### 5.4 Layering and overlap

| Layer order | Element | Behavior | Status |
|---:|---|---|---|
| 1 | Section background | Solid light surface | OBSERVED |
| 2 | Feature icon holders | Pale-blue circles | OBSERVED |
| 3 | Text content | Foreground | OBSERVED |
| 4 | Service illustration | Independent rounded image | OBSERVED |

No intentional overlap is visible.

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate | Usage | Value / description | Status |
|---|---|---|---|
| `color/surface/page` | Section background | White / near-white | OBSERVED |
| `color/text/heading` | H2 | Deep navy | OBSERVED / INFERRED |
| `color/text/body` | Intro/feature description | Muted slate/navy | OBSERVED / INFERRED |
| `color/text/feature-title` | Feature headings | Navy / medium-deep blue | OBSERVED / INFERRED |
| `color/icon/primary` | Feature icons | Medium bright blue | OBSERVED / INFERRED |
| `color/icon/background` | Circular icon holder | Very pale blue | OBSERVED / INFERRED |

Exact HEX/RGB values: UNKNOWN.

### 6.2 Typography

| Element | OCR text reference | Font family | Weight | Size | Line-height | Letter spacing | Color | Status |
|---|---|---|---|---|---|---|---|---|
| H2 | `What Are Dental Implants?` | UNKNOWN | ~600–700 | ~`31–34 px estimated` | ~`38 px estimated` | UNKNOWN | Deep navy | INFERRED |
| Intro paragraph | Overview description | UNKNOWN | ~400 | ~`13 px estimated` | ~`20 px estimated` | UNKNOWN | Muted slate/navy | INFERRED |
| Feature title | Feature titles | UNKNOWN | ~600–700 | ~`13–14 px estimated` | ~`18 px estimated` | UNKNOWN | Navy | INFERRED |
| Feature description | Feature descriptions | UNKNOWN | ~400 | ~`11–12 px estimated` | ~`17 px estimated` | UNKNOWN | Slate/navy | INFERRED |

### 6.3 Borders, radius, effects

| Element | Border | Radius | Shadow / blur | Opacity | Status |
|---|---|---|---|---|---|
| Service image | No visible border | ~`17–20 px estimated` | None visible | 100% | INFERRED |
| Feature icon holder | No visible border | 50% circle | None visible | 100% | OBSERVED |
| Section | No visible outer border | N/A | None | 100% | OBSERVED |

### 6.4 Icons and decoration

| Element ID | Description | Asset type | Size / placement | Source required | Status |
|---|---|---|---|---|---|
| `feature-strong-icon` | Implant/strength-related outline icon | SVG preferred | ~`28 px estimated` centered in circular holder | Service icon library/Figma | OBSERVED |
| `feature-natural-icon` | Tooth outline icon | SVG preferred | ~`25–28 px estimated` | Service icon library/Figma | OBSERVED |
| `feature-bone-icon` | Tooth/bone preservation outline icon | SVG preferred | ~`26–28 px estimated` | Service icon library/Figma | OBSERVED |

## 7. Asset Manifest

| Asset ID | Visible description | Required format | Aspect ratio / crop | Placement | Alt text requirement | Status |
|---|---|---|---|---|---|---|
| `service-overview-image` | Detailed cross-sectional dental implant placed between natural teeth, showing gum and jaw bone | JPG / WebP / PNG | ~`2:1 estimated` wide landscape crop | Right column | Informative if intended to explain implant structure; purposeful alt recommended | OBSERVED |
| `feature-icon-1` | Strong/durable concept icon | SVG preferred | Square | Feature 1 | Decorative if adjacent text conveys concept | OBSERVED |
| `feature-icon-2` | Natural tooth concept icon | SVG preferred | Square | Feature 2 | Decorative | OBSERVED |
| `feature-icon-3` | Bone preservation concept icon | SVG preferred | Square | Feature 3 | Decorative | OBSERVED |

### Asset handling rules
- `service-overview-image` must be configurable per service.
- Do not hard-code the implant illustration into the shared detail-page template.
- Other services may supply a photograph, clinical diagram or treatment illustration while retaining the same media slot.
- Preserve per-service crop/object-position where needed.
- Exact Dental Implants image should be used for screenshot fidelity.
- If the image contains clinically meaningful explanatory information, provide an accessible alt text based on approved content, not raw OCR assumptions.
- Feature icons should also be configurable instead of bound permanently to implant-specific concepts.

## 8. Component Contract

### 8.1 Recommended component boundary

| Component | Responsibility | Reusable? | Evidence | Status |
|---|---|---|---|---|
| `ServiceOverviewSection` | Shared section shell | Yes | Template architecture established by previous service detail hero | INFERRED |
| `ServiceOverviewContent` | Heading + intro | Yes | Service content varies | INFERRED |
| `ServiceFeatureList` | Render repeated features | Yes | Three repeated rows | OBSERVED |
| `ServiceFeatureItem` | Icon + title + description | Yes | Repeated 3× | OBSERVED |
| `ServiceOverviewMedia` | Service-specific visual | Yes | Right media slot | INFERRED |

### 8.2 Reusable data model

// Interface contract only, not implementation code.

interface ServiceOverviewSectionData {
  id: string;
  title: string;
  description: string;

  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;

  media: {
    src: string;
    alt?: string;
    position?: string;
  };
}

| Field | Type | Required | Visible evidence | Notes |
|---|---|---|---|---|
| `id` | string | Yes | Needed to connect hero anchor navigation | Reference likely `about` / equivalent; exact ID UNKNOWN |
| `title` | string | Yes | `What Are Dental Implants?` | Service-specific |
| `description` | string | Yes | Intro visible | Service-specific |
| `features` | array | Yes | 3 items in reference | Number should be configurable |
| `features[].title` | string | Yes | Visible feature heading | Service-specific |
| `features[].description` | string | Yes | Visible supporting copy | Service-specific |
| `features[].icon` | asset | Yes | Icon shown per feature | Service-specific/configurable |
| `media.src` | asset | Yes | Large right image | Service-specific |
| `media.alt` | string | Conditional | Accessibility | Depends on image meaning |
| `media.position` | config | No | Supports varying service assets | INFERRED |

### 8.3 Content behavior
- Shared structure:
  - section title;
  - intro paragraph;
  - feature list;
  - right-side media.
- Dental Implants reference uses exactly 3 features.
- Do not assume every service must have exactly 3 items unless product confirms it.
- Allow feature count to be data-driven while preserving the reference desktop geometry for 3 items.
- Service-specific content:
  - heading;
  - description;
  - features;
  - feature icons;
  - media.
- This section should be addressable from the page's service anchor navigation if anchor behavior is confirmed.
- UNKNOWN whether generic section title convention is always `What Are {Service}?` or custom copy per service.

## 9. Interaction States

| Element | Default evidence | Hover | Active | Focus | Disabled | Link/action destination | Status |
|---|---|---|---|---|---|---|---|
| Feature rows | Static informational content | N/A / UNKNOWN | N/A | N/A | N/A | None visible | OBSERVED |
| Feature icons | Static decorative/informational icons | N/A | N/A | N/A | N/A | None | OBSERVED |
| Service image | Static | UNKNOWN | UNKNOWN | N/A unless interactive | N/A | None visible | OBSERVED / UNKNOWN |

### Interaction constraints
- Do not make feature rows clickable without product evidence.
- Do not add image zoom/lightbox behavior.
- Do not add hover elevation or icon animation.
- Do not add tabs/carousel around features.
- Section itself should remain static informational content unless explicit interaction is later supplied.

## 10. Responsive Specification

### 10.1 Evidence available
- Desktop evidence: OBSERVED — content/features left and media right.
- Tablet evidence: UNKNOWN.
- Mobile evidence: UNKNOWN.

### 10.2 Required desktop behavior
- Maintain two-column composition.
- Keep text column narrower than media column.
- H2 remains a single line for reference content at target viewport.
- Intro paragraph wraps to approximately 3–4 lines.
- Three feature rows remain vertically stacked.
- All icon holders share identical dimensions.
- Feature copy aligns consistently.
- Right image remains vertically centered relative to content block.
- Image retains wide landscape crop and rounded corners.
- No internal card/background should be added around left content.

### 10.3 Proposed responsive behavior

| Breakpoint range | Layout behavior | Typography behavior | Image/asset behavior | Status and rationale |
|---|---|---|---|---|
| Desktop | Two columns, text left/media right | Match screenshot | Wide rounded image | OBSERVED |
| Tablet | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| Mobile | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

### 10.4 Responsive assumptions requiring approval
- Whether image stacks above or below text.
- Exact breakpoint where columns collapse.
- Mobile H2 size.
- Mobile icon holder size.
- Whether features retain side-by-side icon/copy arrangement.
- Mobile media ratio.
- Section horizontal padding.
- Vertical spacing between feature items.

## 11. Semantic HTML and Accessibility

### Recommended structure
- Landmark: section linked to service overview/about anchor.
- Heading hierarchy: H2 beneath service page H1.
- Intro: paragraph.
- Features: semantic list recommended.
- Feature titles: heading-like text or strong labels according to final document hierarchy.
- Icons: decorative if adjacent feature title/description conveys all meaning.
- Media: informative image if it visually explains service anatomy/treatment.
- Keyboard behavior: none required for static content.
- Focus visibility: N/A unless image or features later become interactive.
- Contrast risks: muted feature descriptions against white background should be verified.
- Screen-reader-only content required: none evident.
- Form labels, if applicable: N/A.

### Accessibility constraints
- Do not make non-interactive feature containers focusable.
- Hide purely decorative icons from assistive technology.
- If media conveys implant placement/anatomy not represented elsewhere, provide meaningful approved alt text.
- Do not use file names or service title alone as the image alt if the image communicates more specific information.
- Maintain logical reading order: heading → description → features → media.

## 12. Implementation Constraints

- Implement as part of the reusable service-detail content system.
- Do not create a Dental-Implants-only component.
- Section data must be supplied by the active service configuration.
- Do not hard-code `What Are Dental Implants?`.
- Do not hard-code the three implant feature titles.
- Do not hard-code implant-specific icon assets.
- Do not hard-code the implant cross-section image.
- Support variable text lengths while maintaining the same general visual hierarchy.
- Prefer service-level configuration for media positioning/crop.
- Use shared project typography, spacing, color and radius tokens.
- Do not invent interactions.
- If feature count or section naming differs between services, render from actual service data instead of padding with fabricated content.

## 13. Visual Acceptance Criteria

The reusable implementation is acceptable when the `Dental Implants` reference instance confirms:

- [ ] Section background matches the reference.
- [ ] Main content container alignment matches.
- [ ] Two-column proportions match.
- [ ] Heading appears at the same approximate x/y location.
- [ ] `What Are Dental Implants?` copy matches exactly.
- [ ] Heading scale, weight and color match.
- [ ] Intro paragraph copy matches exactly.
- [ ] Intro paragraph width and line wrapping closely match.
- [ ] Exactly 3 feature rows appear for the Dental Implants instance.
- [ ] Feature icon circles have consistent dimensions and pale-blue background.
- [ ] Feature icons have correct blue stroke treatment.
- [ ] Feature titles match exactly.
- [ ] Feature descriptions match exactly.
- [ ] Feature row spacing and alignment match.
- [ ] Right image dimensions and radius match.
- [ ] Exact Dental Implants reference image is used where available.
- [ ] Implant crown/screw remains centered within the visible image crop as in screenshot.
- [ ] Gum/bone cross-section remains visible.
- [ ] No unsupported CTA, badge, tabs or interaction is introduced.
- [ ] Replacing service data does not require rewriting layout markup.
- [ ] All unresolved responsive/product behavior remains documented.

## 14. Visual Risks

| Risk | Why it affects fidelity | Mitigation | Priority |
|---|---|---|---|
| Exact overview image unavailable | Right media occupies roughly half the section | Export/retrieve exact service image | High |
| Generic fixed feature count | Other services may require different content | Keep features array data-driven | High |
| Hard-coded `What Are...` naming | Some services may need different editorial phrasing | Store section title as explicit content field | High |
| Font unknown | Heading and paragraph line wrapping may drift | Retrieve global typography tokens | High |
| Different service images have different focal points | Shared object-position can crop important content | Allow per-service media positioning | High |
| Icon set unavailable | Repeated icons may visually diverge | Use original design-system icons | Medium |
| Exact left/right ratio unknown | Can alter visual balance | Calibrate against desktop screenshot | Medium |
| Responsive design unavailable | Wide image + feature list may not translate directly | Obtain tablet/mobile references | Medium |

## 15. Open Questions

| ID | Question | Blocking level | Suggested owner |
|---|---|---|---|
| Q1 | Section này có generic section type/name nào trong content schema, ví dụ `overview`, `about`, hay tên khác? | Blocking for architecture | Developer / Product |
| Q2 | Hero anchor `About Implants` sẽ trỏ trực tiếp tới section này đúng không? | Blocking for navigation | Product / Developer |
| Q3 | Với service khác, label anchor có đổi theo service (`About Crowns`, `About Orthodontics`, ...) hay dùng một label generic? | Blocking for content model | Product |
| Q4 | Section title có luôn theo pattern `What Are {Service}?` hay được nhập custom từng service? | Blocking for content model | Product |
| Q5 | Tất cả service có đúng 3 feature items không? | Blocking for reusable layout | Designer / Product |
| Q6 | Nếu feature count là 2, 4 hoặc nhiều hơn thì layout mong muốn là gì? | Blocking for reusable behavior | Designer |
| Q7 | Exact Dental Implants overview image nằm ở đâu trong Figma/project? | Blocking for fidelity | Designer / Developer |
| Q8 | Mỗi service có một overview image riêng không? | Blocking for reusable content | Product / Designer |
| Q9 | Exact feature icons có asset riêng theo từng service không? | Blocking for fidelity | Designer |
| Q10 | Image là informative clinical illustration hay chỉ decorative marketing visual về mặt accessibility? | Non-blocking | Designer / Product |
| Q11 | Exact font/color/radius tokens là gì? | Non-blocking | Designer / Developer |
| Q12 | Có responsive screenshot/spec cho section này không? | Blocking for responsive fidelity | Designer |

## 16. Handoff Summary

### Safe to implement now
- Reusable two-column service overview section.
- Left-side H2 + intro hierarchy.
- Vertical feature list.
- Circular pale-blue icon holder treatment.
- Feature title + description anatomy.
- Right-side rounded media slot.
- Dental Implants reference copy.
- Config-driven service content.
- Config-driven feature list.
- Config-driven icons.
- Config-driven media asset.

### Requires asset export
- Exact Dental Implants overview illustration.
- Exact three Dental Implants feature icons.
- Equivalent media/icons for other services if they differ.

### Requires design/product decision
- Generic section type/ID.
- Anchor mapping.
- Service-specific anchor naming.
- Whether title follows generated or custom copy.
- Allowed feature counts.
- Behavior for feature counts other than 3.
- Responsive stacking.
- Image accessibility intent.

### Do not assume
- Every service has exactly 3 features.
- Every section title starts with `What Are`.
- Every service image uses identical crop.
- `About Implants` can be hard-coded.
- Feature rows are clickable.
- Image has zoom/lightbox behavior.
- Tablet/mobile stacking order.
- Exact font family.
- Exact HEX colors.