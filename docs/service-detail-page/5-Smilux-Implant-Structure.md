# UI Implementation Spec — Smilux Implant Structure

## 1. Identity

| Field | Value |
|---|---|
| Route | `/services/:service-slug` |
| Section ID | `implant-structure` |
| Section name | `Smilux Implant Structure` |
| Screenshot scope | OBSERVED: anatomy/structure explanation section for the Dental Implants service, with a central implant cutaway diagram, labeled callouts on both sides, and a supporting “Why This Matters” card on the right |
| Reference service | `Dental Implants` |
| Target viewport | OBSERVED: screenshot approximately `1483 × 386 px` |
| Template behavior | INFERRED: this is service-specific structured educational content; for other services the section may use a different diagram, labels, title, or may be omitted entirely |
| Primary implementation goal | Reproduce the supplied desktop screenshot with maximum visual fidelity while keeping the section content configurable within the shared service-detail page architecture |
| Overall evidence quality | High for desktop composition and visible copy; Medium for exact typography, colors, icon assets, connector styling, and source illustration |

## 2. Scope Boundary

### Included in this spec
- OBSERVED: heading `Smilux Implant Structure`.
- OBSERVED: large central implant cross-section illustration.
- OBSERVED: left-side callouts:
  - Crown
  - Abutment
  - Implant Fixture
- OBSERVED: right-side callouts:
  - Retention Screw
  - Gum Line
  - Jawbone
- OBSERVED: dotted/dashed connector lines with square/point endpoints connecting labels to the illustration.
- OBSERVED: implant structure is visually split into crown, abutment, screw/fixture, gum, and bone.
- OBSERVED: right-side supporting card titled `Why This Matters`.
- OBSERVED: four checklist points inside the supporting card.
- OBSERVED: pale blue section background.
- OBSERVED: white supporting card with rounded corners.
- INFERRED: section maps directly to the `Implant Structure` anchor shown in the service-detail hero navigation.

### Excluded from this spec
- UNKNOWN: section immediately before/after.
- UNKNOWN: interactive hotspot behavior.
- UNKNOWN: tooltip behavior.
- UNKNOWN: animation of callout lines or implant parts.
- UNKNOWN: zoom/exploded-view interaction.
- UNKNOWN: mobile/tablet design.
- UNKNOWN: whether equivalent structure sections exist for all other services.
- UNKNOWN: CMS/API source.
- UNKNOWN: clinical source/approval workflow for anatomical copy.

### Section start and end
- Start: OBSERVED — section begins at the top screenshot edge with pale-blue background and heading.
- End: OBSERVED / INFERRED — section ends at bottom edge after implant illustration and `Why This Matters` card.
- Cropped/partially visible content: no neighboring section is visibly present.

## 3. Evidence and Confidence

| Item | Status | Evidence / reason |
|---|---|---|
| Section composition | OBSERVED | Diagram-centered educational layout clearly visible |
| Central implant illustration | OBSERVED | Dominant central visual |
| Six structure labels | OBSERVED | Three left + three right |
| Connector lines | OBSERVED | Dotted/dashed horizontal/angled connectors |
| Why This Matters card | OBSERVED | Independent card on right |
| Checklist count | OBSERVED | Four items |
| Typography exact values | INFERRED | No font metadata |
| Exact connector geometry | INFERRED | Can be approximated from screenshot only |
| Exact illustration asset | UNKNOWN | Original source not separately supplied |
| Interaction | UNKNOWN | Static screenshot |
| Responsive behavior | UNKNOWN | Desktop only |

## 4. OCR Content Inventory

> Preserve all readable text exactly as shown. The following content describes the Dental Implants reference instance.

### 4.1 Main section

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `structure-title` | Smilux Implant Structure | Section heading | High | Top-left |

### 4.2 Left callouts

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `part-crown-title` | Crown | Callout heading | High | |
| `part-crown-description` | Natural-looking cap that blends with your surrounding teeth. | Paragraph | High | |
| `part-abutment-title` | Abutment | Callout heading | High | |
| `part-abutment-description` | Connector that holds the crown securely in place. | Paragraph | High | |
| `part-fixture-title` | Implant Fixture | Callout heading | High | |
| `part-fixture-description` | Titanium post that integrates with the jawbone. | Paragraph | High | |

### 4.3 Right callouts

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `part-screw-title` | Retention Screw | Callout heading | High | |
| `part-screw-description` | Screw that secures the abutment to the implant fixture. | Paragraph | High | |
| `part-gum-title` | Gum Line | Callout heading | High | |
| `part-gum-description` | Healthy gum tissue surrounding the implant. | Paragraph | High | |
| `part-jawbone-title` | Jawbone | Callout heading | High | |
| `part-jawbone-description` | Natural bone that fuses with the implant for stability. | Paragraph | High | |

### 4.4 Why This Matters card

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `why-title` | Why This Matters | Card heading | High | |
| `why-item-1` | Stable foundation for long-lasting results. | Checklist item | High | |
| `why-item-2` | Protects bone and facial structure. | Checklist item | High | |
| `why-item-3` | Designed for strength, comfort, and aesthetics. | Checklist item | High | |
| `why-item-4` | Precision-placed for optimal success. | Checklist item | High | |

## 5. Layout Anatomy

### 5.1 Global geometry

| Property | Specification | Status |
|---|---|---|
| Section width | Full screenshot width ~`1483 px` | OBSERVED |
| Section height | ~`386 px` | OBSERVED |
| Background behavior | Full-width very pale cool-blue surface | OBSERVED |
| Content container | Wide centered composition | OBSERVED / INFERRED |
| Left heading gutter | ~`110 px estimated` | INFERRED |
| Main layout model | Diagram-centered multi-column educational layout | OBSERVED |
| Primary regions | Left labels / central diagram / right labels / supporting card | OBSERVED |
| Central diagram width | ~`440–500 px estimated` | INFERRED |
| Supporting card width | ~`320–330 px estimated` | INFERRED |
| Vertical alignment | All content fits within one compact horizontal band | OBSERVED |
| Overflow | None visible | OBSERVED |

### 5.2 Structure tree

Section: implant-structure
├── Section heading
│   └── Smilux Implant Structure
│
└── Structure content
    ├── Left callouts
    │   ├── Crown
    │   │   ├── Title
    │   │   ├── Description
    │   │   └── Connector
    │   ├── Abutment
    │   │   ├── Title
    │   │   ├── Description
    │   │   └── Connector
    │   └── Implant Fixture
    │       ├── Title
    │       ├── Description
    │       └── Connector
    │
    ├── Implant structure illustration
    │   ├── Crown
    │   ├── Abutment
    │   ├── Retention screw
    │   ├── Implant fixture
    │   ├── Gum
    │   └── Jawbone
    │
    ├── Right callouts
    │   ├── Retention Screw
    │   ├── Gum Line
    │   └── Jawbone
    │
    └── Why This Matters card
        ├── Heading
        └── Checklist
            ├── Item 1
            ├── Item 2
            ├── Item 3
            └── Item 4

### 5.3 Spatial relationships

| Element | Position and dimensions | Alignment relationship | Spacing relationship | Status |
|---|---|---|---|---|
| Section heading | Top-left | Above left callout block | ~`18–20 px estimated` from top | INFERRED |
| Left callouts | Left of illustration | Three vertically distributed groups | Similar vertical spacing | OBSERVED |
| Central illustration | Middle-left/center | Main focal visual | Occupies most section height | OBSERVED |
| Right callouts | Immediately right of illustration | Three vertically distributed groups | Mirrors left-side rhythm | OBSERVED |
| Why card | Far right | Vertically centered | ~`50–60 px estimated` gap from callout region | INFERRED |
| Crown callout | Upper-left | Connector targets crown region | Dotted line nearly horizontal | OBSERVED |
| Abutment callout | Mid-left | Connector targets abutment | Dotted line horizontal | OBSERVED |
| Fixture callout | Lower-left | Connector targets implant screw body | Dotted line horizontal | OBSERVED |
| Retention screw callout | Upper-right | Connector bends/steps toward screw | More complex connector path | OBSERVED |
| Gum line callout | Mid-right | Connector targets gingival boundary | Horizontal/short line | OBSERVED |
| Jawbone callout | Lower-right | Connector targets bone region | Horizontal line | OBSERVED |

### 5.4 Layering and overlap

| Layer order | Element | Behavior | Status |
|---:|---|---|---|
| 1 | Pale-blue section background | Full section | OBSERVED |
| 2 | Implant illustration | Central visual | OBSERVED |
| 3 | Connector lines | Overlay between callout text and anatomical targets | OBSERVED |
| 4 | Connector endpoints | Small blue points/squares | OBSERVED |
| 5 | Callout text | Foreground | OBSERVED |
| 6 | Why This Matters card | Independent foreground card | OBSERVED |

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate | Usage | Value / description | Status |
|---|---|---|---|
| `color/surface/structure` | Section background | Very pale blue / blue-white | OBSERVED / INFERRED |
| `color/surface/card` | Why card | White | OBSERVED |
| `color/text/heading` | Main/card headings | Deep navy | OBSERVED / INFERRED |
| `color/text/callout-title` | Structure part names | Medium/deep navy-blue | OBSERVED / INFERRED |
| `color/text/body` | Explanatory copy | Muted slate/navy | OBSERVED / INFERRED |
| `color/connector` | Dotted lines/endpoints | Medium blue | OBSERVED / INFERRED |
| `color/icon/check` | Why card check icons | Bright blue | OBSERVED |
| `color/border/card` | Why card outline | Very pale blue-gray | OBSERVED / INFERRED |

Exact HEX/RGB values: UNKNOWN.

### 6.2 Typography

| Element | OCR reference | Font family | Weight | Size | Line-height | Alignment | Status |
|---|---|---|---|---|---|---|---|
| Main heading | `Smilux Implant Structure` | UNKNOWN | ~600–700 | ~`25–28 px estimated` | ~`32 px estimated` | Left | INFERRED |
| Callout heading | Crown, Abutment, etc. | UNKNOWN | ~600–700 | ~`15–16 px estimated` | ~`20 px estimated` | Left | INFERRED |
| Callout body | Structure descriptions | UNKNOWN | ~400 | ~`12–13 px estimated` | ~`17–18 px estimated` | Left | INFERRED |
| Why card heading | `Why This Matters` | UNKNOWN | ~600–700 | ~`20–21 px estimated` | ~`26 px estimated` | Left | INFERRED |
| Why checklist | Four items | UNKNOWN | ~400–500 | ~`13–14 px estimated` | ~`19–20 px estimated` | Left | INFERRED |

### 6.3 Borders, radius, effects

| Element | Border | Radius | Shadow / blur | Status |
|---|---|---|---|---|
| Why card | ~`1 px estimated` pale blue-gray | ~`18–20 px estimated` | Very subtle/none | INFERRED |
| Connector lines | Dotted/dashed blue stroke | N/A | None | OBSERVED |
| Connector endpoints | Solid blue point/square | Small | None | OBSERVED |
| Central illustration | No visible frame | N/A | Soft natural illustration shadow only | OBSERVED |

### 6.4 Icons and decoration

| Element ID | Description | Asset type | Size / placement | Source required | Status |
|---|---|---|---|---|---|
| `why-check-icon` | Blue outlined/filled circular check | SVG preferred | ~`20–22 px estimated` | Existing icon library | OBSERVED |
| `connector-dot` | Small blue square/circular anchor | CSS/SVG | Endpoints of callout lines | Recreate | OBSERVED |
| `connector-line` | Blue dotted/dashed line | CSS/SVG | Links text to diagram | Recreate / SVG recommended | OBSERVED |

## 7. Asset Manifest

| Asset ID | Visible description | Required format | Aspect ratio / crop | Placement | Alt text requirement | Status |
|---|---|---|---|---|---|---|
| `implant-structure-diagram` | Central cutaway illustration showing dental crown, abutment, implant fixture, gum and jawbone | PNG / WebP / SVG / UNKNOWN | Tall centered composition | Center | Informative; meaningful alt or textual equivalent required | OBSERVED |
| `why-check-icon` | Blue check icon | SVG preferred | Square | Supporting card | Decorative when adjacent text exists | OBSERVED |

### Asset handling rules
- Exact implant diagram is a high-priority asset for fidelity.
- Prefer a transparent PNG/WebP or SVG if the source illustration is available separately.
- Do not attempt to recreate the anatomical artwork using CSS primitives.
- If the source is a single composite illustration with all implant anatomy, retain that asset.
- Connector lines should remain separate layout/decorative elements unless they are already baked into the source asset.
- Do not hard-code implant-specific diagram into a generic service-detail component without making the entire section optional/configurable.
- For other services, a different educational diagram or a different section type may be required.

## 8. Component Contract

### 8.1 Recommended component boundary

| Component | Responsibility | Reusable? | Evidence | Status |
|---|---|---|---|---|
| `ServiceStructureSection` | Educational service structure/anatomy section shell | Yes / Optional | Fits shared detail architecture but content is highly service-specific | INFERRED |
| `StructureDiagram` | Central media + anchor coordinates | Yes with config | Diagram is focal visual | INFERRED |
| `StructureCallout` | Label + description + connector | Yes | Repeated 6× | OBSERVED |
| `StructureCalloutLayer` | Coordinate/layout system for connectors | Yes | Shared connector behavior | INFERRED |
| `WhyItMattersCard` | Supporting checklist card | Yes | Independent reusable pattern | OBSERVED / INFERRED |

### 8.2 Reusable data model

// Interface contract only, not implementation code.

interface ServiceStructureSectionData {
  id: string;
  title: string;

  diagram: {
    src: string;
    alt: string;
  };

  callouts: Array<{
    id: string;
    title: string;
    description: string;
    side: 'left' | 'right';
    targetKey: string;
  }>;

  supportingCard?: {
    title: string;
    items: string[];
  };
}

| Field | Type | Required | Visible evidence | Notes |
|---|---|---|---|---|
| `id` | string | Yes | Needed for hero anchor navigation | Reference maps to `Implant Structure` |
| `title` | string | Yes | `Smilux Implant Structure` | Service-specific |
| `diagram.src` | asset | Yes | Central diagram visible | Service-specific |
| `diagram.alt` | string | Yes | Diagram is educational/informative | Approved descriptive text required |
| `callouts` | array | Yes | 6 items in reference | Count should be configurable |
| `callouts[].title` | string | Yes | Part names visible | |
| `callouts[].description` | string | Yes | Definitions visible | |
| `callouts[].side` | enum | Yes | Left/right distribution visible | |
| `callouts[].targetKey` | string | Yes | Needed to map connector to diagram location | Implementation detail inferred from visual need |
| `supportingCard` | object | No | `Why This Matters` shown in reference | Could be optional |
| `supportingCard.title` | string | Yes when card exists | Visible | |
| `supportingCard.items` | string[] | Yes when card exists | 4 items | Count configurable |

### 8.3 Content behavior
- Dental Implants reference uses:
  - 6 anatomical callouts.
  - 3 callouts left.
  - 3 callouts right.
  - 1 supporting card with 4 bullets.
- Do not assume every service uses six callouts.
- Do not assume every service has a meaningful “structure” section.
- The entire section should be optional in the shared service-detail schema.
- If present, it should map to the corresponding service-specific hero anchor.
- Connector locations must be tied to diagram-specific target metadata rather than hard-coded globally.
- Section title should remain explicit content; do not generate `Smilux {Service} Structure` automatically unless product confirms that pattern.

## 9. Interaction States

| Element | Default evidence | Hover | Active | Focus | Destination | Status |
|---|---|---|---|---|---|---|
| Structure callouts | Static text | N/A | N/A | N/A | None | OBSERVED |
| Connector lines | Static | N/A | N/A | N/A | None | OBSERVED |
| Central diagram | Static | UNKNOWN | UNKNOWN | N/A unless interactive | None visible | OBSERVED / UNKNOWN |
| Why checklist | Static | N/A | N/A | N/A | None | OBSERVED |

### Interaction constraints
- Do not add hover hotspots.
- Do not add animated callout lines.
- Do not make implant parts clickable.
- Do not add image zoom/exploded view.
- Do not add tooltips.
- Do not add accordion behavior to labels.
- Keep section static unless explicit interaction design is provided.

## 10. Responsive Specification

### 10.1 Evidence available
- Desktop evidence: OBSERVED — four-part horizontal composition.
- Tablet evidence: UNKNOWN.
- Mobile evidence: UNKNOWN.

### 10.2 Required desktop behavior
- Preserve central implant diagram as primary focal object.
- Keep three left and three right callouts positioned around the corresponding anatomical regions.
- Maintain connector lines without crossing unrelated labels where possible.
- Keep main heading top-left.
- Keep `Why This Matters` card at far right.
- Why card remains vertically centered relative to central structure area.
- Section remains relatively compact in height.
- Connector labels must remain readable and must not overlap the diagram.

### 10.3 Proposed responsive behavior

| Breakpoint range | Layout behavior | Connector behavior | Supporting card behavior | Status |
|---|---|---|---|---|
| Desktop | Left labels + diagram + right labels + support card | Visible | Right-side card | OBSERVED |
| Tablet | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| Mobile | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

### 10.4 Responsive assumptions requiring approval
- Whether connector layout survives tablet widths.
- Whether callouts stack beneath the diagram on mobile.
- Whether connectors are hidden on mobile.
- Whether callouts become numbered legend items.
- Placement/order of `Why This Matters` card on narrow screens.
- Mobile diagram width.
- Exact breakpoints.
- Whether section uses horizontal overflow.
- Whether diagram needs alternate mobile asset.

## 11. Semantic HTML and Accessibility

### Recommended structure
- Landmark: semantic section associated with `Smilux Implant Structure`.
- Heading: H2 or appropriate page-level subsection heading.
- Diagram: informative image.
- Callouts: semantic list or definition-list structure is recommended.
- Part names: terms/headings.
- Definitions: corresponding descriptions.
- Why card: complementary supporting content within the section.
- Why items: semantic unordered list.
- Check icons: decorative.
- Keyboard behavior: none needed for static content.
- Focus visibility: N/A unless future interaction is introduced.
- Screen-reader content: diagram and visual connectors must have a text-equivalent structure.

### Accessibility constraints
- Do not rely on connector line position alone to explain which text belongs to which anatomical part.
- DOM order must explicitly associate each title with its description.
- Diagram needs meaningful alt text because it conveys implant anatomy.
- If alt text would become excessively long, provide a concise image alt plus accessible textual callouts adjacent to it.
- Connector lines and endpoint dots should be hidden from assistive technology.
- `Why This Matters` check icons should be decorative.
- Reading order should remain logical even if visual labels are positioned on both sides of the illustration.

## 12. Implementation Constraints

- Implement as an optional section in the shared service-detail content schema.
- Do not create this as a mandatory block for every service.
- Do not hard-code implant anatomy labels into the generic section shell.
- Drive title, diagram, callouts, side placement and supporting-card content from configuration.
- Keep connector rendering separate from textual semantic structure.
- Do not use arbitrary absolute positions without a defined diagram coordinate system if the implementation needs to support different diagrams.
- For the Dental Implants reference, exact screenshot fidelity may require fixed desktop anchor coordinates tied to this particular diagram.
- If other services use structurally different media, allow a different callout configuration or omit this section.
- Use existing design-system typography and color tokens.
- Do not invent interaction.
- Preserve exact OCR-confirmed copy for this reference instance.

## 13. Visual Acceptance Criteria

The Dental Implants reference implementation is acceptable only if:

- [ ] Section uses the same pale-blue background treatment.
- [ ] `Smilux Implant Structure` matches exact copy and top-left placement.
- [ ] Central implant illustration matches the reference asset and scale.
- [ ] Crown remains visually centered above the metallic implant body.
- [ ] Gum/bone cutaway remains visible around the fixture.
- [ ] Three left callouts appear in correct top-to-bottom order:
  - Crown
  - Abutment
  - Implant Fixture
- [ ] Three right callouts appear in correct top-to-bottom order:
  - Retention Screw
  - Gum Line
  - Jawbone
- [ ] All six callout descriptions match exactly.
- [ ] Connector lines point toward the correct corresponding structure region.
- [ ] Dotted line styling and blue endpoints visually match.
- [ ] Callout text does not overlap lines or illustration.
- [ ] `Why This Matters` card occupies the far-right region.
- [ ] Supporting card has correct white surface, radius, and inset.
- [ ] Exactly 4 checklist items appear for the reference instance.
- [ ] Checklist icons and text align consistently.
- [ ] No unsupported animation, hotspot, zoom, or tooltip is added.
- [ ] Section can be omitted or reconfigured for other services without duplicating the service-detail page.

## 14. Visual Risks

| Risk | Why it affects fidelity | Mitigation | Priority |
|---|---|---|---|
| Exact implant diagram unavailable | Central diagram is the dominant visual | Retrieve/export exact asset | High |
| Connector placement inaccurate | Incorrect lines make anatomy mapping visually wrong | Calibrate against reference using diagram-relative coordinates | High |
| Absolute positioning not tied to diagram | Layout breaks when container width changes | Use a controlled diagram coordinate/reference system | High |
| Genericizing this section too aggressively | Other services may not have equivalent structure anatomy | Make section optional and content-type specific | High |
| Font mismatch | Callout wrapping changes connector alignment | Retrieve global typography tokens | High |
| Different diagram aspect ratio | Existing callout layout would no longer align | Store per-diagram callout anchor configuration | High |
| Supporting card dimensions drift | Far-right visual balance changes significantly | Calibrate card width/spacing against reference | Medium |
| Mobile design unknown | Connector-heavy layout is difficult to collapse safely | Obtain responsive design before implementation | High |

## 15. Open Questions

| ID | Question | Blocking level | Suggested owner |
|---|---|---|---|
| Q1 | Section này map trực tiếp tới anchor `Implant Structure` trong hero nav đúng không? | Blocking for navigation | Product / Developer |
| Q2 | `Implant Structure` là một section riêng chỉ dành cho implant hay có generic equivalent cho các service khác? | Blocking for architecture | Product / Designer |
| Q3 | Nếu service khác không có anatomy/structure diagram thì section này được bỏ hoàn toàn đúng không? | Blocking for reusable schema | Product |
| Q4 | Exact implant diagram asset nằm ở đâu trong Figma/project? | Blocking for fidelity | Designer / Developer |
| Q5 | Connector lines được bake sẵn trong Figma asset hay là layout elements riêng? | Blocking for implementation strategy | Designer |
| Q6 | Có exact coordinates/hotspot metadata cho 6 anatomical parts không? | Non-blocking but high-value | Designer |
| Q7 | Title `Smilux Implant Structure` là fixed branding pattern hay custom copy? | Blocking for content model | Product |
| Q8 | `Why This Matters` card có bắt buộc trong mọi structure section không? | Blocking for reusable schema | Product / Designer |
| Q9 | Supporting checklist item count có thể thay đổi không? | Non-blocking | Product |
| Q10 | Diagram được coi là clinical/informative content hay decorative marketing illustration? | Blocking for accessibility | Product / Designer |
| Q11 | Có mobile/tablet version của section với connector treatment khác không? | Blocking for responsive fidelity | Designer |
| Q12 | Exact line stroke, dash pattern, endpoint geometry, font và color tokens là gì? | Non-blocking | Designer / Developer |

## 16. Handoff Summary

### Safe to implement now
- Optional reusable `ServiceStructureSection`.
- Pale-blue section background.
- Top-left section heading.
- Central service-specific educational diagram.
- Configurable callouts on left/right.
- Dental Implants reference with 6 callouts.
- Diagram-relative connector concept.
- Far-right supporting `Why This Matters` card.
- Configurable checklist.
- Exact Dental Implants reference copy.

### Requires asset export
- Exact implant structure diagram.
- Exact check icon if not already available.
- Any connector geometry asset if connectors are embedded/vector-exported from Figma.

### Requires design/product decision
- Whether section is implant-only or generic.
- Anchor mapping.
- Optionality across service pages.
- Connector implementation strategy.
- Diagram hotspot/anchor metadata.
- Title naming convention.
- Supporting-card optionality.
- Responsive treatment.
- Diagram accessibility intent.

### Do not assume
- Every service has a structure section.
- Every service has 6 callouts.
- Every diagram uses the same anchor coordinates.
- `Why This Matters` always exists.
- Connectors are interactive.
- Implant parts are clickable.
- Hover tooltips.
- Exploded-view animation.
- Image zoom.
- Mobile connector layout.
- Exact font family.
- Exact HEX colors.