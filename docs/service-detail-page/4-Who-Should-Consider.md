# UI Implementation Spec — Who Should Consider

## 1. Identity

| Field | Value |
|---|---|
| Route | `/services/:service-slug` |
| Section ID | `service-candidates` |
| Section name | `Who Should Consider` |
| Screenshot scope | OBSERVED: compact two-column section immediately after the previous service-detail sections, with eligibility/candidate checklist on the left and a lifestyle/patient image on the right |
| Reference service | `Dental Implants` |
| Target viewport | OBSERVED: screenshot approximately `1210 × 227 px` |
| Template behavior | INFERRED: reusable across all service-detail pages; title, checklist items, and supporting image vary per service |
| Primary implementation goal | Reproduce the supplied desktop screenshot with maximum visual fidelity while keeping all content configurable per service |
| Overall evidence quality | High for layout and visible copy; Medium for exact typography, icon geometry, colors, and source image |

## 2. Scope Boundary

### Included in this spec
- OBSERVED: outer rounded bordered container.
- OBSERVED: left content region with section heading.
- OBSERVED: heading `Who Should Consider Dental Implants?`.
- OBSERVED: 5 checklist rows.
- OBSERVED: each checklist row uses a blue circular check icon.
- OBSERVED: large rounded patient/lifestyle image on the right.
- OBSERVED: image shows a smiling older adult couple.
- OBSERVED: white/light section surface with pale blue border.
- INFERRED: section maps to the `Who Should Consider` anchor shown in the service-detail hero navigation.

### Excluded from this spec
- UNKNOWN: section immediately below.
- UNKNOWN: click/hover behavior.
- UNKNOWN: whether checklist items are interactive.
- UNKNOWN: exact service-specific candidate rules for other services.
- UNKNOWN: tablet/mobile design.
- UNKNOWN: CMS/API source.
- UNKNOWN: image loading/fallback behavior.
- UNKNOWN: whether this section is mandatory for every service.

### Section start and end
- Start: OBSERVED — outer rounded container begins near the top edge of screenshot.
- End: OBSERVED / INFERRED — container ends just below the fifth checklist item and right image.
- Cropped/partially visible content: UNKNOWN — no neighboring section visible.

## 3. Evidence and Confidence

| Item | Status | Evidence / reason |
|---|---|---|
| Section boundary | OBSERVED | Complete bordered container is visible |
| Desktop layout | OBSERVED | Text/checklist left, image right |
| Heading copy | OBSERVED | Readable directly |
| Checklist count | OBSERVED | 5 items |
| Checklist icon treatment | OBSERVED | Repeated blue circular checks |
| Typography values | INFERRED | No design metadata |
| Colors | INFERRED | Navy/blue/light-border visible but exact values unknown |
| Patient image | OBSERVED | Large lifestyle photo |
| Asset source | UNKNOWN | Original image not supplied separately |
| Interaction states | UNKNOWN | Static screenshot |
| Responsive behavior | UNKNOWN | Desktop only |

## 4. OCR Content Inventory

> Preserve all readable text exactly as shown. The following values describe the `Dental Implants` reference instance and should be configurable for other services.

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `candidates-title` | Who Should Consider Dental Implants? | Section heading | High | Service-specific |
| `candidate-1` | Patients missing one or multiple teeth | Checklist item | High | |
| `candidate-2` | Patients with failing teeth beyond repair | Checklist item | High | |
| `candidate-3` | Those who want a fixed, permanent solution | Checklist item | High | |
| `candidate-4` | Patients with healthy gums and sufficient bone | Checklist item | High | |
| `candidate-5` | Patients eligible for bone grafting if needed | Checklist item | High | |

## 5. Layout Anatomy

### 5.1 Global geometry

| Property | Specification | Status |
|---|---|---|
| Section width | Full screenshot width approximately `1210 px` | OBSERVED |
| Outer container width | ~`1080 px estimated` | INFERRED |
| Section height | ~`205–210 px estimated` inside screenshot | INFERRED |
| Horizontal outer gutters | ~`63–65 px estimated` | INFERRED |
| Background behavior | White / near-white | OBSERVED |
| Main layout model | Two-column split | OBSERVED |
| Left column width | ~`47–49% estimated` | INFERRED |
| Right column width | ~`51–53% estimated` | INFERRED |
| Column gap | Minimal because image occupies right half directly | INFERRED |
| Vertical alignment | Left content and right image vertically centered inside outer container | OBSERVED |
| Overflow / cropping | No visible overflow | OBSERVED |

### 5.2 Structure tree

Section: service-candidates
├── Outer bordered container
│   ├── Candidate content
│   │   ├── H2
│   │   │   └── Who Should Consider Dental Implants?
│   │   └── Checklist
│   │       ├── Checklist item 1
│   │       │   ├── Check icon
│   │       │   └── Text
│   │       ├── Checklist item 2
│   │       ├── Checklist item 3
│   │       ├── Checklist item 4
│   │       └── Checklist item 5
│   │
│   └── Candidate media
│       └── Smiling older adult couple image

### 5.3 Spatial relationships

| Element | Position and dimensions | Alignment relationship | Spacing relationship | Status |
|---|---|---|---|---|
| Outer container | ~`1080 px estimated` wide | Centered | ~`10–12 px estimated` top/bottom outer spacing | INFERRED |
| Left content | Occupies left ~half | Internal left padding ~`18 px estimated` | Vertically centered | INFERRED |
| Heading | Top-left | Aligns with checklist text region | ~`10–12 px estimated` top inset | INFERRED |
| Checklist | Below heading | Same text alignment | ~`10–12 px estimated` gap | INFERRED |
| Checklist rows | Vertical stack | Icon column aligned consistently | ~`12–14 px estimated` row spacing | INFERRED |
| Check icon | ~`16–18 px estimated` circle | Fixed left icon column | ~`10–12 px estimated` gap to text | INFERRED |
| Right image | ~`550 × 190 px estimated` | Right side of container | Minimal inner margin to top/right/bottom | INFERRED |
| Image corner radius | ~`14–16 px estimated` | Matches container system visually | — | INFERRED |

### 5.4 Layering and overlap

| Layer order | Element | Behavior | Status |
|---:|---|---|---|
| 1 | Page background | White | OBSERVED |
| 2 | Outer section container | White with pale border | OBSERVED |
| 3 | Checklist icon/text | Foreground left | OBSERVED |
| 4 | Patient image | Foreground right | OBSERVED |

No intentional overlap is visible.

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate | Usage | Value / description | Status |
|---|---|---|---|
| `color/surface/section` | Outer container | White | OBSERVED |
| `color/text/heading` | Section heading | Deep navy | OBSERVED / INFERRED |
| `color/text/body` | Checklist labels | Muted navy/slate | OBSERVED / INFERRED |
| `color/icon/check` | Check icon | Saturated blue | OBSERVED / INFERRED |
| `color/icon/check-mark` | Check glyph | White | OBSERVED / INFERRED |
| `color/border/section` | Outer border | Very pale blue-gray | OBSERVED / INFERRED |

Exact HEX/RGB values: UNKNOWN.

### 6.2 Typography

| Element | OCR reference | Font family | Weight | Size | Line-height | Alignment | Status |
|---|---|---|---|---|---|---|---|
| Section heading | `Who Should Consider Dental Implants?` | UNKNOWN | ~600–700 | ~`24–26 px estimated` | ~`30 px estimated` | Left | INFERRED |
| Checklist item | Candidate rows | UNKNOWN | ~400–500 | ~`12–13 px estimated` | ~`17–18 px estimated` | Left | INFERRED |

### 6.3 Borders, radius, effects

| Element | Border | Radius | Shadow / blur | Status |
|---|---|---|---|---|
| Outer container | ~`1 px estimated` pale blue-gray | ~`14–16 px estimated` | None / minimal | INFERRED |
| Right image | No visible border | ~`14–16 px estimated` | None | INFERRED |
| Check icon | None | Circle | None | OBSERVED |

### 6.4 Icons and decoration

| Element ID | Description | Asset type | Size / placement | Source required | Status |
|---|---|---|---|---|---|
| `candidate-check-icon` | Blue filled circular icon with white check | SVG preferred | ~`16–18 px estimated`, repeated 5× | Existing project icon library / recreate | OBSERVED |

## 7. Asset Manifest

| Asset ID | Visible description | Required format | Aspect ratio / crop | Placement | Alt text requirement | Status |
|---|---|---|---|---|---|---|
| `service-candidates-image` | Smiling older adult man and woman in a bright indoor setting | JPG / WebP / PNG | Wide landscape crop | Right half | Could be decorative if candidate content is fully conveyed by text; meaningful alt only if image carries approved content | OBSERVED |
| `candidate-check` | Circular blue checkmark | SVG preferred | Square | Checklist rows | Decorative because text conveys meaning | OBSERVED |

### Asset handling rules
- Candidate image must be configurable per service.
- Do not hard-code the Dental Implants couple image into the reusable template.
- Use the exact supplied/project asset for screenshot fidelity.
- Preserve crop so both faces remain fully visible and positioned similarly to the screenshot.
- Do not infer the identities, medical status, or relationship of people shown in the image.
- Check icon should be shared across all checklist rows.
- Do not replace the check icon with browser-native checkbox UI; this is informational checklist styling, not a form control.

## 8. Component Contract

### 8.1 Recommended component boundary

| Component | Responsibility | Reusable? | Evidence | Status |
|---|---|---|---|---|
| `ServiceCandidatesSection` | Shared section shell | Yes | Service-detail template context | INFERRED |
| `CandidateChecklist` | Render list of eligibility/candidate statements | Yes | 5 repeated rows | OBSERVED |
| `CandidateChecklistItem` | Check icon + text | Yes | Repeated pattern | OBSERVED |
| `ServiceCandidatesMedia` | Service-specific supporting image | Yes | Distinct right media region | INFERRED |

### 8.2 Reusable data model

// Interface contract only, not implementation code.

interface ServiceCandidatesSectionData {
  id: string;
  title: string;

  items: Array<{
    text: string;
  }>;

  media: {
    src: string;
    alt?: string;
    position?: string;
  };
}

| Field | Type | Required | Visible evidence | Notes |
|---|---|---|---|---|
| `id` | string | Yes | Needed for anchor navigation | Likely maps to `Who Should Consider` |
| `title` | string | Yes | Reference heading visible | Service-specific |
| `items` | array | Yes | 5 rows in reference | Count should remain configurable |
| `items[].text` | string | Yes | Each checklist row visible | Service-specific |
| `media.src` | asset | Yes | Right image visible | Service-specific |
| `media.alt` | string | Conditional | Accessibility | Depends on image meaning |
| `media.position` | config | No | Allows service-specific crop | INFERRED |

### 8.3 Content behavior
- Reference instance uses 5 checklist items.
- Do not assume every service requires exactly 5 items.
- Title should be stored as content rather than generated automatically unless product explicitly establishes a naming convention.
- Candidate criteria must be provided per service; do not infer medical eligibility from another service.
- Right-side image should be configurable independently.
- Section should be optional if a service has no approved candidate/eligibility content.
- If mapped to hero anchor navigation, omit the anchor when this section is not present.

## 9. Interaction States

| Element | Default evidence | Hover | Active | Focus | Destination | Status |
|---|---|---|---|---|---|---|
| Checklist rows | Static informational rows | N/A | N/A | N/A | None | OBSERVED |
| Check icons | Static | N/A | N/A | N/A | None | OBSERVED |
| Candidate image | Static | UNKNOWN | UNKNOWN | N/A unless interactive | None visible | OBSERVED / UNKNOWN |

### Interaction constraints
- Do not implement checklist items as checkbox inputs.
- Do not make checklist rows clickable.
- Do not add image lightbox/zoom behavior.
- Do not add hover animation or card elevation.
- This section should remain informational unless explicit product behavior is supplied.

## 10. Responsive Specification

### 10.1 Evidence available
- Desktop evidence: OBSERVED — checklist left, image right.
- Tablet evidence: UNKNOWN.
- Mobile evidence: UNKNOWN.

### 10.2 Required desktop behavior
- Maintain a single outer rounded container.
- Preserve two-column horizontal arrangement.
- Heading remains left-aligned.
- Checklist stays a compact 5-row vertical list for the Dental Implants reference.
- Check icons align to one consistent vertical column.
- Right image remains approximately half the section width.
- Image height matches the section content closely.
- Do not add extra card surfaces around individual checklist rows.

### 10.3 Proposed responsive behavior

| Breakpoint range | Layout behavior | Typography behavior | Image behavior | Status |
|---|---|---|---|---|
| Desktop | Two columns | Match reference | Wide landscape image right | OBSERVED |
| Tablet | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| Mobile | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

### 10.4 Responsive assumptions requiring approval
- Whether image stacks above or below checklist.
- Exact collapse breakpoint.
- Whether image remains full-width on mobile.
- Mobile section padding.
- Mobile heading size.
- Checklist row spacing.
- Whether outer border/radius remains unchanged.
- Whether media can be omitted on narrow screens.

## 11. Semantic HTML and Accessibility

### Recommended structure
- Landmark: semantic section connected to its heading.
- Heading hierarchy: H2/H3 according to final page hierarchy; likely H2-level section beneath page H1.
- Checklist: semantic unordered list.
- Each criterion: list item.
- Check icon: decorative because visible text communicates the criterion.
- Media: decorative or informative depending on approved content intent.
- Keyboard behavior: none required for static content.
- Focus visibility: N/A unless future interaction is added.
- Screen-reader-only content required: none evident.
- Form labels: N/A.

### Accessibility constraints
- Do not use actual checkbox controls for static qualification statements.
- Hide decorative check icons from assistive technology.
- Maintain list semantics so screen readers announce item count naturally.
- Do not infer or encode medical eligibility beyond the approved visible copy.
- If the patient image is decorative, use empty alt text.
- If image meaning is intentionally informational, use approved descriptive alt rather than assumptions about age, diagnosis, or patient status.

## 12. Implementation Constraints

- Implement as part of the shared service-detail template.
- Do not create Dental-Implants-only markup.
- Candidate title, item list, and media must come from service configuration.
- Do not hard-code 5 items as a global rule.
- Do not copy Dental Implants eligibility criteria into another service.
- Do not turn informational rows into interactive checkboxes.
- Use shared border/radius/typography tokens from the existing service-detail card system.
- Support per-service image crop/position if needed.
- If this section is absent for a service, its anchor navigation item should also be absent.
- Preserve exact reference copy for the Dental Implants screenshot instance.

## 13. Visual Acceptance Criteria

The reusable implementation is acceptable when the `Dental Implants` reference instance confirms:

- [ ] Outer container width and horizontal position match the reference.
- [ ] Outer border and radius match previous service-detail bordered sections.
- [ ] `Who Should Consider Dental Implants?` matches exact copy.
- [ ] Heading position, size, weight, and navy color match.
- [ ] Exactly 5 checklist rows appear for the reference instance.
- [ ] Checklist copy matches exactly.
- [ ] Blue circular check icons have consistent size and alignment.
- [ ] Row spacing matches the screenshot.
- [ ] No checkbox boxes, toggles, or interactive affordances are added.
- [ ] Right image occupies approximately half the section.
- [ ] Exact reference image is used where available.
- [ ] Couple positioning/crop matches closely.
- [ ] Right image corner radius matches the section's card system.
- [ ] Section remains compact in height.
- [ ] No unsupported CTA or additional descriptive copy is added.
- [ ] Swapping service configuration can replace title, checklist, and media without component duplication.

## 14. Visual Risks

| Risk | Why it affects fidelity | Mitigation | Priority |
|---|---|---|---|
| Exact patient image unavailable | Image occupies about half the section | Export/retrieve exact asset | High |
| Treating list as interactive checklist | Would materially change semantics and visual appearance | Use static list + decorative check icons | High |
| Candidate criteria hard-coded globally | Eligibility differs by treatment | Make all items service-specific content | High |
| Fixed 5-item assumption | Other services may need different list length | Render from array | High |
| Different image aspect ratios across services | Could change section height/crop | Support per-service media positioning and controlled aspect ratio | Medium |
| Font/token mismatch | Compact section can visibly shift with small typography differences | Reuse project design system | Medium |
| Responsive design missing | Side-by-side composition will not fit narrow screens | Obtain mobile/tablet design | Medium |

## 15. Open Questions

| ID | Question | Blocking level | Suggested owner |
|---|---|---|---|
| Q1 | Section này map trực tiếp với hero anchor `Who Should Consider` đúng không? | Blocking for navigation | Product / Developer |
| Q2 | Generic section ID trong schema sẽ là `candidates`, `eligibility`, `who-should-consider` hay tên khác? | Blocking for architecture | Developer |
| Q3 | Mọi service đều có section này hay section có thể optional? | Blocking for reusable template | Product |
| Q4 | Title có theo pattern `Who Should Consider {Service}?` hay custom hoàn toàn từng service? | Blocking for content model | Product |
| Q5 | Số lượng criteria có thể thay đổi theo service không? | Blocking for flexible layout | Product / Designer |
| Q6 | Exact Dental Implants patient image nằm ở đâu trong Figma/project? | Blocking for fidelity | Designer / Developer |
| Q7 | Mỗi service có supporting image riêng cho section này không? | Blocking for content model | Designer / Product |
| Q8 | Có yêu cầu disclaimer hoặc clinical qualification copy bổ sung ngoài screenshot không? | Blocking if required | Product / Clinical content owner |
| Q9 | Exact check icon có asset trong project không? | Non-blocking | Designer / Developer |
| Q10 | Có tablet/mobile design reference cho section này không? | Blocking for responsive fidelity | Designer |
| Q11 | Image được xem là decorative hay informative cho accessibility? | Non-blocking | Designer / Product |

## 16. Handoff Summary

### Safe to implement now
- Reusable compact two-column candidate section.
- Single rounded outer container.
- Left-aligned service-specific heading.
- Static criteria list with blue circular check icons.
- Dental Implants reference with 5 items.
- Right-side landscape media slot.
- Config-driven title.
- Config-driven checklist.
- Config-driven media.
- Optional section support in the reusable service schema.

### Requires asset export
- Exact Dental Implants candidate/patient image.
- Exact circular check icon if not already available in the project icon system.

### Requires design/product decision
- Generic schema/section ID.
- Whether section is mandatory or optional.
- Title generation convention.
- Allowed checklist item counts.
- Per-service image strategy.
- Anchor mapping.
- Responsive stacking.
- Accessibility intent of patient imagery.

### Do not assume
- Every service has 5 candidate criteria.
- Every service has this section.
- Candidate rows are form controls.
- Candidate rows are clickable.
- Candidate image represents actual patients or specific medical eligibility.
- Title can always be auto-generated.
- Image zoom/lightbox behavior.
- Mobile stacking order.
- Exact font family.
- Exact HEX colors.