# UI Implementation Spec — Why Choose Smilux Dental + Consultation CTA

## 1. Identity

| Field | Value |
|---|---|
| Route | `/services/:service-slug` |
| Section IDs | `why-choose-smilux`, `service-consultation-cta` |
| Section names | `Why Choose Smilux Dental`, `Ready for Your Best Smile CTA` |
| Screenshot scope | OBSERVED: hai section liên tiếp ngay sau `Smilux Implant Structure`; section trên là trust/value proposition gồm 5 lý do chọn Smilux, section dưới là CTA banner đặt lịch với ảnh phòng khám |
| Reference service | `Dental Implants`, nhưng nội dung hai section này có dấu hiệu mang tính global/shared hơn service-specific |
| Target viewport | OBSERVED: screenshot khoảng `1199 × 656 px` |
| Template behavior | INFERRED: hai section có thể dùng chung cho tất cả service detail pages gần như không đổi nội dung; chỉ cần cho phép cấu hình nếu product muốn reuse ngoài service detail |
| Primary implementation goal | Reproduce both desktop sections with maximum visual fidelity while treating them as reusable global/service-detail closing modules |
| Overall evidence quality | High cho layout và visible copy; Medium cho exact typography, colors, icon assets, background treatment và image source |

## 2. Scope Boundary

### Included in this spec
- OBSERVED: outer rounded container của trust section.
- OBSERVED: eyebrow `WHY CHOOSE SMILUX DENTAL?`.
- OBSERVED: centered heading `Trusted Care. Lasting Smiles.`.
- OBSERVED: 5 value proposition items nằm trên một hàng.
- OBSERVED: mỗi item có circular icon holder, title và short description.
- OBSERVED: CTA banner phía dưới.
- OBSERVED: banner chia hai nửa chính: blue gradient/content bên trái và clinic image bên phải.
- OBSERVED: CTA heading `Ready for Your Best Smile?`.
- OBSERVED: supporting paragraph.
- OBSERVED: white pill button `BOOK APPOINTMENT` với calendar icon.
- OBSERVED: clinic image có quầy lễ tân Smilux và khu vực chờ.
- OBSERVED: banner có rounded corners lớn.

### Excluded from this spec
- UNKNOWN: section tiếp theo phía dưới.
- UNKNOWN: booking destination/action.
- UNKNOWN: hover/active states.
- UNKNOWN: animation hoặc parallax.
- UNKNOWN: responsive/mobile design.
- UNKNOWN: whether CTA banner image changes by service.
- UNKNOWN: whether trust content is global site content or configurable per page.
- UNKNOWN: exact icon source.

### Section start and end
- `why-choose-smilux` start: OBSERVED — rounded light surface begins near top screenshot.
- `why-choose-smilux` end: OBSERVED — ends below fifth value item.
- `service-consultation-cta` start: OBSERVED — begins after a clear vertical gap.
- `service-consultation-cta` end: OBSERVED / INFERRED — banner ends near bottom screenshot.
- Cropped/partially visible content: UNKNOWN — no next section visible.

## 3. Evidence and Confidence

| Item | Status | Evidence / reason |
|---|---|---|
| Two separate modules | OBSERVED | Clear spacing and separate rounded containers |
| Trust section 5-column layout | OBSERVED | Five evenly distributed value items |
| CTA split composition | OBSERVED | Blue content left + clinic image right |
| Visible copy | OBSERVED | Readable with high confidence |
| Icon treatment | OBSERVED | Five large blue outline icons |
| Typography exact values | INFERRED | No font metadata |
| Colors | INFERRED | Blue/navy/white/light-blue visible but exact tokens unknown |
| Clinic image | OBSERVED | Reception/lounge visual |
| Asset source | UNKNOWN | Exact source file not supplied separately |
| Interaction states | UNKNOWN | Screenshot shows only default state |
| Responsive behavior | UNKNOWN | Desktop only |

## 4. OCR Content Inventory

### 4.1 Why Choose Smilux Dental

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `why-eyebrow` | WHY CHOOSE SMILUX DENTAL? | Eyebrow | High | Uppercase, centered |
| `why-title` | Trusted Care. Lasting Smiles. | Section heading | High | Centered |
| `reason-1-title` | Experienced Dentists | Card/item heading | High | |
| `reason-1-description` | Over 15 years of expertise delivering safe and effective treatments. | Paragraph | High | |
| `reason-2-title` | Advanced Technology | Card/item heading | High | |
| `reason-2-description` | State-of-the-art equipment for precise diagnosis and comfortable care. | Paragraph | High | |
| `reason-3-title` | Personalized Treatment | Card/item heading | High | |
| `reason-3-description` | Tailored solutions designed around your unique needs and goals. | Paragraph | High | |
| `reason-4-title` | Patient Comfort | Card/item heading | High | |
| `reason-4-description` | A welcoming environment with a focus on your comfort and well-being. | Paragraph | High | |
| `reason-5-title` | Proven Results | Card/item heading | High | |
| `reason-5-description` | Thousands of happy patients and beautiful smiles we're proud of. | Paragraph | High | |

### 4.2 Consultation CTA

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `cta-title` | Ready for Your Best Smile? | Heading | High | |
| `cta-description` | Book a consultation with our experts today and take the first step toward a healthier, more confident you. | Paragraph | High | |
| `cta-button` | BOOK APPOINTMENT | CTA | High | Calendar icon trước label |
| `cta-image-brand` | Smilux | Image-embedded branding | High | Reception image |
| `cta-image-subbrand` | DENTAL CLINIC | Image-embedded branding | Medium | Small text |

## 5. Layout Anatomy

### 5.1 Global geometry

| Property | Specification | Status |
|---|---|---|
| Screenshot width | ~`1199 px` | OBSERVED |
| Combined content width | ~`1118 px estimated` | INFERRED |
| Horizontal outer gutters | ~`40 px estimated` | INFERRED |
| Gap between sections | ~`38–42 px estimated` | INFERRED |
| Background | White page background | OBSERVED |
| Overall layout | Two vertically stacked modules | OBSERVED |

### 5.2 Structure tree

Section: why-choose-smilux
├── Rounded outer container
│   ├── Eyebrow
│   │   └── WHY CHOOSE SMILUX DENTAL?
│   ├── H2
│   │   └── Trusted Care. Lasting Smiles.
│   └── Reasons grid
│       ├── Reason 1
│       │   ├── Icon holder
│       │   ├── Experienced Dentists
│       │   └── Description
│       ├── Reason 2
│       ├── Reason 3
│       ├── Reason 4
│       └── Reason 5

Section: service-consultation-cta
├── Rounded split banner
│   ├── Content panel
│   │   ├── Heading
│   │   │   └── Ready for Your Best Smile?
│   │   ├── Description
│   │   └── Appointment CTA
│   │       ├── Calendar icon
│   │       └── BOOK APPOINTMENT
│   └── Clinic image
│       └── Smilux reception / waiting area

### 5.3 Spatial relationships — Why Choose

| Element | Position and dimensions | Alignment relationship | Spacing relationship | Status |
|---|---|---|---|---|
| Outer container | ~`1118 × 330 px estimated` | Centered | Rounded full-width card | INFERRED |
| Eyebrow | Top-center | Same center axis as H2 | ~`29–33 px estimated` from top | INFERRED |
| H2 | Centered | Below eyebrow | ~`14–16 px estimated` gap | INFERRED |
| Reasons grid | 5 equal columns | Centered | ~`30–35 px estimated` below H2 | INFERRED |
| Reason item | Equal-width content region | Center aligned | Uniform horizontal distribution | OBSERVED |
| Icon holder | ~`64–70 px estimated` circle | Centered above title | ~`15–18 px estimated` below icon to title | INFERRED |
| Item title | Centered | Same axis as icon | — | OBSERVED |
| Item description | Centered | Narrow max width | ~`8–10 px estimated` below title | INFERRED |

### 5.4 Spatial relationships — CTA Banner

| Element | Position and dimensions | Alignment relationship | Spacing relationship | Status |
|---|---|---|---|---|
| Banner | ~`1118 × 238 px estimated` | Centered | Rounded large rectangle | INFERRED |
| Left content region | ~`50% estimated` width | Vertically centered | Internal left padding ~`58–60 px estimated` | INFERRED |
| Right clinic image | ~`50% estimated` width | Fills right half | Edge-to-edge within banner radius | OBSERVED |
| Heading | Left aligned | Same x-axis as paragraph/button | ~`50–55 px estimated` from top | INFERRED |
| Description | ~`425 px estimated` max width | Left aligned | ~`10–12 px estimated` below heading | INFERRED |
| CTA button | Content-width | Left aligned | ~`20–24 px estimated` below paragraph | INFERRED |
| Blue/image transition | Center of banner | Soft visual blend rather than hard split | OBSERVED / INFERRED |

### 5.5 Layering and overlap

| Layer order | Element | Behavior | Status |
|---:|---|---|---|
| 1 | Page background | White | OBSERVED |
| 2 | Why Choose card background | Pale blue-white | OBSERVED |
| 3 | Reason icons/text | Foreground | OBSERVED |
| 4 | CTA banner blue base | Left/banner surface | OBSERVED |
| 5 | Clinic image | Right side | OBSERVED |
| 6 | Blue overlay/gradient transition | Blends image and content regions | OBSERVED |
| 7 | CTA copy/button | Foreground | OBSERVED |

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate | Usage | Value / description | Status |
|---|---|---|---|
| `color/surface/page` | Page background | White | OBSERVED |
| `color/surface/trust` | Why Choose container | Very pale cool blue | OBSERVED / INFERRED |
| `color/text/heading` | Main headings | Deep navy | OBSERVED / INFERRED |
| `color/text/body` | Supporting descriptions | Muted navy/slate | OBSERVED / INFERRED |
| `color/text/eyebrow` | Eyebrow | Bright medium blue | OBSERVED / INFERRED |
| `color/icon/primary` | Trust icons | Bright blue outline | OBSERVED |
| `color/icon/background` | Icon holder | Very pale blue / transparent white | OBSERVED / INFERRED |
| `color/cta/background` | CTA banner left region | Deep saturated blue | OBSERVED / INFERRED |
| `color/cta/text` | Banner title/body | White / near-white | OBSERVED |
| `color/cta/button-bg` | Appointment button | White | OBSERVED |
| `color/cta/button-text` | Button label/icon | Bright blue | OBSERVED |
| `color/border/trust` | Trust container border | Very pale blue-gray | OBSERVED / INFERRED |

Exact HEX/RGB values: UNKNOWN.

### 6.2 Typography

| Element | OCR reference | Font family | Weight | Size | Line-height | Alignment | Status |
|---|---|---|---|---|---|---|---|
| Eyebrow | `WHY CHOOSE SMILUX DENTAL?` | UNKNOWN | ~600–700 | ~`10–11 px estimated` | ~`14 px estimated` | Center | INFERRED |
| Trust H2 | `Trusted Care. Lasting Smiles.` | UNKNOWN | ~600–700 | ~`27–29 px estimated` | ~`34 px estimated` | Center | INFERRED |
| Reason title | Reason titles | UNKNOWN | ~600 | ~`13–14 px estimated` | ~`18 px estimated` | Center | INFERRED |
| Reason description | Reason descriptions | UNKNOWN | ~400 | ~`11–12 px estimated` | ~`20–21 px estimated` | Center | INFERRED |
| CTA heading | `Ready for Your Best Smile?` | UNKNOWN | ~600–700 | ~`29–31 px estimated` | ~`36 px estimated` | Left | INFERRED |
| CTA description | Supporting CTA copy | UNKNOWN | ~400 | ~`12–13 px estimated` | ~`21 px estimated` | Left | INFERRED |
| CTA button | `BOOK APPOINTMENT` | UNKNOWN | ~600 | ~`12–13 px estimated` | Centered | Left-to-right | INFERRED |

### 6.3 Borders, radius, effects

| Element | Border | Radius | Shadow / blur | Status |
|---|---|---|---|---|
| Why Choose outer card | ~`1 px estimated` pale blue-gray | ~`17–20 px estimated` | None/minimal | INFERRED |
| Reason icon holder | Very faint outline/ring | 50% circle | None | OBSERVED / INFERRED |
| CTA banner | No distinct border visible | ~`16–18 px estimated` | None/minimal | INFERRED |
| CTA button | No obvious border or very light gray | Pill / ~`18–22 px estimated` | None/minimal | INFERRED |
| Blue/image transition | No border | N/A | Gradient/overlay | OBSERVED |

### 6.4 Icons and decoration

| Element ID | Description | Asset type | Size / placement | Source required | Status |
|---|---|---|---|---|---|
| `reason-experience-icon` | Shield with check | SVG preferred | Large centered outline icon | Figma/project asset | OBSERVED |
| `reason-technology-icon` | Tooth with technology/marker symbol | SVG preferred | Large centered | Figma/project asset | OBSERVED |
| `reason-personalized-icon` | Person/profile with small star/medical marker | SVG preferred | Large centered | Figma/project asset | OBSERVED |
| `reason-comfort-icon` | Hands supporting heart | SVG preferred | Large centered | Figma/project asset | OBSERVED |
| `reason-results-icon` | Award/medal icon | SVG preferred | Large centered | Figma/project asset | OBSERVED |
| `calendar-icon` | Calendar outline | SVG preferred | Left of CTA label | Existing shared CTA icon | OBSERVED |

## 7. Asset Manifest

### 7.1 Why Choose icons

| Asset ID | Visible description | Required format | Placement | Alt requirement | Status |
|---|---|---|---|---|---|
| `icon-experienced-dentists` | Shield/check outline | SVG | Reason 1 | Decorative | OBSERVED |
| `icon-advanced-technology` | Tooth + technology symbol | SVG | Reason 2 | Decorative | OBSERVED |
| `icon-personalized-treatment` | Person/profile icon | SVG | Reason 3 | Decorative | OBSERVED |
| `icon-patient-comfort` | Hands + heart | SVG | Reason 4 | Decorative | OBSERVED |
| `icon-proven-results` | Medal/award | SVG | Reason 5 | Decorative | OBSERVED |

### 7.2 CTA assets

| Asset ID | Visible description | Required format | Aspect ratio / crop | Placement | Alt requirement | Status |
|---|---|---|---|---|---|---|
| `smilux-clinic-reception` | Bright Smilux reception desk and waiting area | JPG / WebP / PNG | Wide landscape | Right half of CTA banner | Likely decorative if text conveys action; purposeful alt only if clinic visual is meant to provide facility information | OBSERVED |
| `calendar-icon` | Calendar outline | SVG | Square | CTA button | Decorative | OBSERVED |

### Asset handling rules
- Reuse exact five icon assets if present in Figma/project.
- Keep all five icons visually consistent in stroke width and bounding box.
- Do not replace icons with emoji or unrelated library icons if exact assets are available.
- CTA clinic image should use the exact reference asset for fidelity.
- Do not reconstruct the Smilux logo in the reception image as DOM text if it is part of the photograph/render.
- Preserve image crop so reception desk, Smilux logo, blue chair and waiting area remain visible in roughly the same regions.
- CTA image may be shared globally across service pages if product confirms.

## 8. Component Contract

### 8.1 Recommended component boundary

| Component | Responsibility | Reusable? | Evidence | Status |
|---|---|---|---|---|
| `WhyChooseSmiluxSection` | Global trust/value proposition module | Yes | Content is brand-level rather than implant-specific | INFERRED |
| `TrustReasonGrid` | Render five reasons | Yes | Repeated item pattern | OBSERVED |
| `TrustReasonItem` | Icon + title + description | Yes | Repeated 5× | OBSERVED |
| `ConsultationCtaBanner` | Closing CTA banner | Yes | Generic booking message | INFERRED |
| `AppointmentButton` | Calendar + appointment CTA | Yes | Same pattern already appears elsewhere | OBSERVED / INFERRED |

### 8.2 Reusable data model

// Interface contract only, not implementation code.

interface WhyChooseSectionData {
  eyebrow: string;
  title: string;

  reasons: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

interface ConsultationCtaData {
  title: string;
  description: string;

  action: {
    label: string;
    href?: string;
  };

  image: {
    src: string;
    alt?: string;
    position?: string;
  };
}

| Field | Type | Required | Visible evidence | Notes |
|---|---|---|---|---|
| `eyebrow` | string | Yes | Visible | Likely global |
| `title` | string | Yes | Visible | Likely global |
| `reasons` | array | Yes | 5 items visible | Content may be global |
| `reasons[].title` | string | Yes | Visible | |
| `reasons[].description` | string | Yes | Visible | |
| `reasons[].icon` | asset | Yes | Visible | |
| `cta.title` | string | Yes | Visible | Global/shared candidate |
| `cta.description` | string | Yes | Visible | Global/shared candidate |
| `cta.action.label` | string | Yes | `BOOK APPOINTMENT` | |
| `cta.action.href` | string | No / UNKNOWN | Behavior not visible | Do not invent |
| `cta.image.src` | asset | Yes | Clinic image visible | Could be global |
| `cta.image.alt` | string | Conditional | Accessibility | Depends on image intent |
| `cta.image.position` | config | No | Supports crop calibration | INFERRED |

### 8.3 Content behavior
- `Why Choose Smilux Dental` appears brand-level rather than service-specific.
- `Ready for Your Best Smile?` also appears generic and suitable for reuse across all service detail pages.
- Therefore both sections should preferably be stored once as shared/global content if the codebase supports it.
- Do not duplicate the same text in every service configuration unless architecture requires it.
- However, keep content configurable rather than hard-wiring copy into presentation components.
- Exact count of five reasons is observed for this reference; if content is global, preserve this count unless product changes it.
- CTA action destination remains UNKNOWN.
- CTA image could remain global unless product supplies service-specific closing imagery.

## 9. Interaction States

| Element | Default evidence | Hover | Active | Focus | Destination | Status |
|---|---|---|---|---|---|---|
| Trust reason items | Static | N/A | N/A | N/A | None | OBSERVED |
| CTA appointment button | White pill with blue icon/text | UNKNOWN | UNKNOWN | Must be accessible | UNKNOWN | OBSERVED / UNKNOWN |
| CTA image | Static | N/A / UNKNOWN | N/A | N/A unless linked | None visible | OBSERVED |

### Interaction constraints
- Do not make reason items clickable.
- Do not add card hover effects.
- Do not add animation to trust icons.
- Do not invent booking modal/page behavior.
- Do not make CTA image clickable unless explicitly required.
- If booking action is navigation, use semantic link; if it opens a flow/modal, use semantic button according to actual behavior.

## 10. Responsive Specification

### 10.1 Evidence available
- Desktop Why Choose: OBSERVED — 5 columns in one row.
- Desktop CTA: OBSERVED — horizontal split banner.
- Tablet evidence: UNKNOWN.
- Mobile evidence: UNKNOWN.

### 10.2 Required desktop behavior

#### Why Choose
- Keep centered eyebrow and heading.
- Maintain all 5 reasons on one horizontal row at reference viewport.
- Keep icon holders equally sized.
- Maintain centered title/body alignment.
- Preserve equal visual spacing across all five columns.

#### CTA banner
- Preserve rounded single-banner composition.
- Keep text on left and clinic image on right.
- Maintain deep-blue left background.
- Preserve soft blue-to-image transition.
- Keep CTA button white with blue icon/text.
- Keep heading and body vertically centered as a group.
- Preserve reception image focal points.

### 10.3 Proposed responsive behavior

| Section | Desktop | Tablet | Mobile | Status |
|---|---|---|---|---|
| Why Choose | 5-column row | UNKNOWN | UNKNOWN | Desktop OBSERVED |
| Consultation CTA | Text left + image right | UNKNOWN | UNKNOWN | Desktop OBSERVED |

### 10.4 Responsive assumptions requiring approval
- Whether trust reasons become 2–3 columns or horizontal scroll.
- Whether CTA stacks image below text.
- Whether CTA image is hidden on mobile.
- Mobile button width.
- Mobile heading size.
- Mobile outer card radius.
- Tablet/mobile image crop.
- Vertical ordering between CTA content and image.
- Exact breakpoints.

## 11. Semantic HTML and Accessibility

### Recommended structure
- `Why Choose` should be a semantic section associated with its heading.
- Reasons should be a semantic list.
- Each reason icon should be decorative because title/body communicate meaning.
- CTA banner should be a semantic section or aside depending on page hierarchy.
- CTA heading should use the next appropriate heading level.
- Appointment action should be semantic link/button based on actual booking behavior.
- Clinic image may be decorative if its function is purely aesthetic.
- Keyboard behavior: booking action must be reachable.
- Focus visibility: booking action requires visible focus.
- Screen-reader-only content: none obvious beyond potential external-action context.

### Accessibility constraints
- Do not expose decorative icon names to assistive technology.
- Preserve logical reading order for five reason items.
- Ensure small description copy passes contrast requirements.
- If the clinic image is decorative, use empty alt.
- If image is meant to communicate the quality/location of the clinic, provide approved meaningful alt text.
- Do not rely on white button shape alone for action affordance.
- Booking button needs an accessible name equivalent to `BOOK APPOINTMENT`.

## 12. Implementation Constraints

- Treat both modules as reusable shared components.
- Prefer global/shared content configuration because the visible copy is not implant-specific.
- Do not duplicate these components for every service page.
- Use structured data for the five trust reasons.
- Reuse existing `AppointmentButton` pattern from hero/header where visually compatible.
- Use existing brand blue/navy/icon tokens.
- Preserve exact reference copy unless product updates it.
- Do not invent booking destination.
- Do not add service-specific text to these sections without supplied content.
- Do not add hover animation or interactive trust cards.
- CTA image must use controlled crop/object-position.
- If the design system already has a shared closing CTA, adapt/reuse it rather than creating another visually duplicate component.

## 13. Visual Acceptance Criteria

### 13.1 Why Choose Smilux Dental
- [ ] Outer rounded card matches reference width and height.
- [ ] Pale-blue/white surface matches.
- [ ] `WHY CHOOSE SMILUX DENTAL?` matches exact copy, position, capitalization and blue styling.
- [ ] `Trusted Care. Lasting Smiles.` matches exact copy and centered hierarchy.
- [ ] Exactly 5 trust reasons appear in one row for reference desktop.
- [ ] All icon holders have equal size.
- [ ] Exact icon concepts match screenshot.
- [ ] All reason titles match exactly.
- [ ] All reason descriptions match exactly.
- [ ] Text remains centered.
- [ ] Item spacing is visually uniform.
- [ ] No extra card surfaces appear around individual reason items.

### 13.2 Consultation CTA
- [ ] Banner aligns horizontally with the trust section.
- [ ] Banner radius matches screenshot.
- [ ] Left region uses deep blue.
- [ ] Right region uses exact Smilux clinic reception image where available.
- [ ] Transition between blue and image is soft, not a hard center split.
- [ ] `Ready for Your Best Smile?` matches exact copy.
- [ ] Supporting paragraph matches exactly.
- [ ] CTA button is white and pill-like.
- [ ] Calendar icon and `BOOK APPOINTMENT` use blue treatment.
- [ ] Button placement and dimensions match.
- [ ] Smilux reception logo remains visible in the image crop.
- [ ] No unsupported secondary CTA is added.
- [ ] No unsupported booking behavior is implied visually.

### 13.3 Reusability
- [ ] Both modules can be rendered identically across service pages without service-specific component duplication.
- [ ] Global copy/assets can be supplied from shared configuration.
- [ ] CTA booking destination can be injected separately once confirmed.
- [ ] Trust reasons remain data-driven.

## 14. Visual Risks

| Risk | Why it affects fidelity | Mitigation | Priority |
|---|---|---|---|
| Exact clinic reception image unavailable | Image occupies roughly half the CTA | Retrieve/export exact asset | High |
| Incorrect blue/image transition | Hard split materially changes CTA appearance | Reproduce soft overlay/gradient after screenshot comparison | High |
| Wrong icon set | Five large icons define trust section identity | Use exact Figma/project icons | High |
| Font mismatch | Centered card copy can wrap differently | Retrieve design-system typography | High |
| Trust content duplicated per service | Creates maintenance drift | Store globally/shared where possible | Medium |
| Existing global CTA may differ slightly | Duplicating components creates inconsistent design | Audit and reuse shared CTA primitive if available | Medium |
| CTA destination unknown | Visual implementation can finish but behavior remains incomplete | Get canonical booking behavior | Medium |
| Responsive layout unavailable | Five columns and split banner need explicit collapse behavior | Obtain tablet/mobile design | High |

## 15. Open Questions

| ID | Question | Blocking level | Suggested owner |
|---|---|---|---|
| Q1 | Hai section này có dùng nguyên vẹn cho tất cả service detail pages không? | Blocking for content architecture | Product / Designer |
| Q2 | `Why Choose Smilux Dental` content là global CMS/config hay lưu riêng trong từng service? | Blocking for architecture | Product / Developer |
| Q3 | 5 reason items có cố định globally không? | Non-blocking | Product |
| Q4 | Exact 5 trust icons nằm ở đâu trong Figma/project? | Blocking for fidelity | Designer / Developer |
| Q5 | CTA banner có dùng cùng một clinic image cho tất cả service không? | Blocking for asset architecture | Designer / Product |
| Q6 | Exact reception image nằm ở đâu? | Blocking for fidelity | Designer / Developer |
| Q7 | Blue/image fade được bake trong asset hay tạo bằng overlay/gradient? | Blocking for visual implementation | Designer |
| Q8 | `BOOK APPOINTMENT` mở modal, scroll tới form, hay navigate sang page khác? | Blocking for production behavior | Product / Developer |
| Q9 | Có thể reuse chính `AppointmentButton` từ service-detail hero không? | Non-blocking | Developer |
| Q10 | Hai module này có anchor trong hero nav hay chỉ là closing sections? | Non-blocking | Product |
| Q11 | Exact font/color/radius tokens là gì? | Non-blocking | Designer / Developer |
| Q12 | Có tablet/mobile references cho cả hai section không? | Blocking for responsive fidelity | Designer |

## 16. Handoff Summary

### Safe to implement now
- Reusable `WhyChooseSmiluxSection`.
- Centered eyebrow + H2.
- Five-column desktop reasons row.
- Icon → title → description item structure.
- Reusable `ConsultationCtaBanner`.
- Deep-blue left content region.
- Right-side clinic media region.
- Soft blue/image transition requirement.
- White pill appointment CTA.
- Exact visible reference copy.
- Shared/global data model.

### Requires asset export
- Five Why Choose icons.
- Exact Smilux reception image.
- Calendar icon if not already available globally.

### Requires design/product decision
- Whether both sections are globally shared across every service.
- Global vs per-service content source.
- Booking behavior.
- CTA image reuse strategy.
- Gradient/fade implementation.
- Responsive layouts.
- Whether modules map to any hero anchors.

### Do not assume
- Trust content differs per service.
- CTA copy differs per service.
- Reason items are clickable.
- Trust icons animate.
- Booking opens a modal.
- CTA image is clickable.
- Five-column layout survives tablet/mobile.
- Exact font family.
- Exact HEX colors.
- Hard image/content split.