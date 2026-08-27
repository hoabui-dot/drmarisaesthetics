# UI Implementation Spec — Service Detail Hero

## 1. Identity

| Field | Value |
|---|---|
| Route | `/services/:service-slug` |
| Section ID | `service-detail-hero` |
| Section name | `Service Detail Hero` |
| Screenshot scope | OBSERVED: hero của trang chi tiết dịch vụ nha khoa, gồm breadcrumb, service title, description, 2 CTA, social-proof rating, hero visual bên phải và anchor navigation phía dưới |
| Page architecture | INFERRED: template dùng chung cho tất cả service detail pages; chỉ thay đổi nội dung/data theo từng service |
| Reference service | `Dental Implants` |
| Target viewport | OBSERVED: screenshot khoảng `1116 × 405 px` |
| Primary implementation goal | Build one reusable service-detail hero template that reproduces this desktop screenshot while allowing service-specific content/assets to be replaced through configuration |
| Overall evidence quality | High cho desktop composition và visible content; Medium cho typography, exact color, image source và interaction |

## 2. Scope Boundary

### Included in this spec
- OBSERVED: breadcrumb phía trên hero copy.
- OBSERVED: service heading `Dental Implants`.
- OBSERVED: service description.
- OBSERVED: primary CTA `Book Consultation`.
- OBSERVED: secondary CTA `View Technology`.
- OBSERVED: social-proof block gồm 4 avatar, trust copy, 5 star icons và rating.
- OBSERVED: large service-specific hero visual bên phải.
- OBSERVED: dental implant model làm foreground focal object.
- OBSERVED: transparent jaw/teeth model.
- OBSERVED: clinic/interior background.
- OBSERVED: monitor với dental X-ray / implant-planning visual.
- OBSERVED: Smilux Dental Clinic branding trong background.
- OBSERVED: horizontal anchor navigation nằm tại bottom edge của hero.
- INFERRED: hero là một reusable service detail template, vì user xác nhận trang này dùng chung cho tất cả service và chỉ thay nội dung bên trong.

### Excluded from this spec
- UNKNOWN: global site header phía trên screenshot.
- UNKNOWN: nội dung chi tiết các section sau hero.
- UNKNOWN: behavior chính xác khi click anchor items.
- UNKNOWN: consultation booking flow.
- UNKNOWN: technology video/page/modal behavior.
- UNKNOWN: exact service routes.
- UNKNOWN: responsive/mobile design.
- UNKNOWN: hover/active/focus states ngoài default screenshot.
- UNKNOWN: animation/parallax.
- UNKNOWN: CMS/API implementation.

### Section start and end
- Start: OBSERVED — top edge screenshot bắt đầu trực tiếp tại hero content; global header không xuất hiện.
- End: OBSERVED / INFERRED — hero visual kết thúc phía trên anchor navigation; anchor navigation là phần cuối cùng nằm trong screenshot và có thể là sticky/in-page navigation độc lập.
- Cropped/partially visible content: UNKNOWN — không thấy section tiếp theo bên dưới anchor navigation.

## 3. Evidence and Confidence

| Item | Status | Evidence / reason |
|---|---|---|
| Reusable service-detail template | INFERRED | User xác nhận tất cả service dùng chung page và chỉ đổi nội dung |
| Desktop hero layout | OBSERVED | Copy trái, service visual phải |
| Breadcrumb | OBSERVED | `SERVICES / DENTAL IMPLANTS` |
| Copy/text content | OBSERVED | Hero text đọc được |
| CTA structure | OBSERVED | Hai action nằm cùng hàng |
| Social proof | OBSERVED | Avatar + trust copy + stars + rating |
| Hero visual composition | OBSERVED | Implant foreground + jaw + clinic + monitor |
| Anchor navigation | OBSERVED | 11 navigation entries |
| Typography exact values | INFERRED | Chỉ đoán từ bitmap |
| Colors exact values | INFERRED | Không có design token |
| Asset implementation | UNKNOWN | Không rõ composite image hay nhiều image layers |
| Anchor interaction | UNKNOWN | Không xác nhận scroll, routing hay sticky behavior |
| Responsive behavior | UNKNOWN | Chỉ desktop screenshot |

## 4. OCR Content Inventory

> Preserve all readable text exactly as shown. The values below describe the `Dental Implants` reference instance. For other service pages, equivalent fields are configurable.

| Element ID | Visible text | Text type | OCR confidence | Notes |
|---|---|---|---|---|
| `breadcrumb-parent` | SERVICES | Breadcrumb | High | Uppercase |
| `breadcrumb-current` | DENTAL IMPLANTS | Breadcrumb | High | Uppercase |
| `service-title` | Dental Implants | H1 | High | Service-specific |
| `service-description` | Replace missing teeth with strong, natural-looking dental implants that restore your smile, confidence, and quality of life. Precision care using advanced technology for predictable, lasting results. | Paragraph | High | Service-specific |
| `primary-cta` | Book Consultation | CTA | High | Calendar icon |
| `secondary-cta` | View Technology | CTA | High | Play-circle icon |
| `trust-copy` | Trusted by 10,000+ Patients | Social proof | High | |
| `rating-value` | 4.9/5 | Rating | High | Preceded by 5 blue stars |
| `brand-monitor` | Smilux | Image-embedded branding | High | Right hero visual |
| `brand-monitor-subline` | DENTAL CLINIC | Image-embedded branding | Medium | Small text |
| `anchor-about` | About Implants | Navigation | High | Service-specific wording |
| `anchor-services` | Services | Navigation | High | |
| `anchor-benefits` | Benefits | Navigation | High | |
| `anchor-candidate` | Who Should Consider | Navigation | High | |
| `anchor-structure` | Implant Structure | Navigation | High | Implant-specific |
| `anchor-technology` | Technology | Navigation | High | |
| `anchor-procedure` | Procedure | Navigation | High | |
| `anchor-results` | Results | Navigation | High | |
| `anchor-pricing` | Pricing | Navigation | High | |
| `anchor-faq` | FAQ | Navigation | High | |
| `anchor-contact` | Contact | Navigation | High | |

## 5. Layout Anatomy

### 5.1 Global geometry

| Property | Specification | Status |
|---|---|---|
| Hero width | Full viewport width | OBSERVED |
| Hero height excluding anchor nav | ~`356 px estimated` | INFERRED |
| Anchor nav height | ~`49 px estimated` | INFERRED |
| Total screenshot height | ~`405 px` | OBSERVED |
| Background behavior | White/light left area transitioning into bright dental-clinic visual on right | OBSERVED |
| Main layout model | Two-region hero: content left + media right | OBSERVED |
| Left content width | ~`43–46% viewport estimated` | INFERRED |
| Right visual width | ~`54–57% viewport estimated` | INFERRED |
| Main horizontal gutter | ~`55 px estimated` left | INFERRED |
| Hero vertical alignment | Main copy vertically centered with slight upper bias | OBSERVED / INFERRED |
| Anchor navigation | Full-width horizontal navigation below hero content | OBSERVED |
| Overflow / cropping | Hero image cropped at right/top/bottom according to composition | OBSERVED |

### 5.2 Structure tree

Section: service-detail-hero
├── Hero main
│   ├── Content region
│   │   ├── Breadcrumb
│   │   │   ├── SERVICES
│   │   │   ├── separator
│   │   │   └── DENTAL IMPLANTS
│   │   ├── H1
│   │   │   └── Dental Implants
│   │   ├── Description
│   │   ├── Actions
│   │   │   ├── Primary CTA
│   │   │   │   ├── Calendar icon
│   │   │   │   └── Book Consultation
│   │   │   └── Secondary CTA
│   │   │       ├── Play-circle icon
│   │   │       └── View Technology
│   │   └── Social proof
│   │       ├── Avatar group ×4
│   │       └── Trust content
│   │           ├── Trusted by 10,000+ Patients
│   │           └── Rating row
│   │               ├── Stars ×5
│   │               └── 4.9/5
│   │
│   └── Service media region
│       ├── Clinic background
│       ├── Smilux branding
│       ├── X-ray monitor
│       ├── Transparent jaw model
│       └── Large implant model
│
└── Service anchor navigation
    ├── About Implants
    ├── Services
    ├── Benefits
    ├── Who Should Consider
    ├── Implant Structure
    ├── Technology
    ├── Procedure
    ├── Results
    ├── Pricing
    ├── FAQ
    └── Contact

### 5.3 Spatial relationships

| Element | Position and dimensions | Alignment relationship | Spacing relationship | Status |
|---|---|---|---|---|
| Breadcrumb | Top-left hero content | Same left edge as H1 | ~`37 px estimated` from top | INFERRED |
| H1 | Left hero region | Same axis as breadcrumb/body | ~`15–18 px estimated` below breadcrumb | INFERRED |
| Description | ~`390–410 px estimated` max width | Same left edge as H1 | ~`14 px estimated` below title | INFERRED |
| CTA row | Horizontal | Same left edge as content | ~`25–30 px estimated` below description | INFERRED |
| Primary CTA | ~`154 × 38 px estimated` | First action | — | INFERRED |
| Secondary CTA | ~`155 × 38 px estimated` | Right of primary | ~`30 px estimated` gap | INFERRED |
| Social proof | Lower-left | Same left edge as hero content | ~`35–40 px estimated` below CTA row | INFERRED |
| Avatar group | 4 overlapping circles | Left side of trust block | Small negative overlap | OBSERVED |
| Trust text | Right of avatars | Vertically centered to avatar group | ~`8–12 px estimated` gap | INFERRED |
| Implant model | Center-right | Foreground focal object | Extends vertically through much of hero | OBSERVED |
| Jaw model | Right/lower middle | Behind implant model | Overlaps media foreground | OBSERVED |
| X-ray monitor | Upper-right | Anchored near right edge | Visible above jaw | OBSERVED |
| Anchor nav | Full width bottom row | Items distributed horizontally | Uniform compact spacing | OBSERVED |

### 5.4 Layering and overlap

| Layer order | Element | Behavior | Status |
|---:|---|---|---|
| 1 | White/light hero base | Full width | OBSERVED |
| 2 | Dental clinic background | Right-side visual region | OBSERVED |
| 3 | Smilux branding + monitor | Embedded/background visual elements | OBSERVED |
| 4 | Transparent jaw | Mid-foreground | OBSERVED |
| 5 | Implant model | Dominant foreground object | OBSERVED |
| 6 | Hero text/actions | Foreground left | OBSERVED |
| 7 | Social proof | Foreground left-bottom | OBSERVED |
| 8 | Anchor navigation | Separate foreground bar at hero bottom | OBSERVED |

## 6. Visual Specification

### 6.1 Color and surface

| Token candidate | Usage | Value / description | Status |
|---|---|---|---|
| `color/surface/hero` | Hero base | White / very pale blue-white | OBSERVED / INFERRED |
| `color/text/heading` | H1 | Deep navy | OBSERVED / INFERRED |
| `color/text/body` | Description | Muted navy/slate | OBSERVED / INFERRED |
| `color/text/breadcrumb` | Breadcrumb | Bright medium blue | OBSERVED / INFERRED |
| `color/action/primary` | Primary CTA | Saturated bright blue | OBSERVED / INFERRED |
| `color/action/secondary` | Secondary CTA border/text | Blue | OBSERVED / INFERRED |
| `color/rating/star` | Rating stars | Blue | OBSERVED |
| `color/nav/icon` | Anchor icons | Pale/medium blue | OBSERVED / INFERRED |
| `color/nav/text` | Anchor labels | Dark muted blue | OBSERVED / INFERRED |
| `color/border/nav` | Anchor nav separator/boundary | Pale blue-gray | OBSERVED / INFERRED |
| `color/media/fade` | Left-to-right hero media transition | White translucent gradient | OBSERVED / INFERRED |

Exact HEX/RGB values: UNKNOWN.

### 6.2 Typography

| Element | OCR text reference | Font family | Weight | Size | Line-height | Letter spacing | Color | Status |
|---|---|---|---|---|---|---|---|---|
| Breadcrumb | `SERVICES / DENTAL IMPLANTS` | UNKNOWN | ~600 | ~`10 px estimated` | ~`14 px estimated` | Slight positive UNKNOWN | Blue | INFERRED |
| H1 | `Dental Implants` | UNKNOWN | ~600–700 | ~`46–48 px estimated` | ~`54 px estimated` | Tight/UNKNOWN | Deep navy | INFERRED |
| Description | Service description | UNKNOWN | ~400 | ~`12 px estimated` | ~`20 px estimated` | UNKNOWN | Slate/navy | INFERRED |
| Primary CTA | `Book Consultation` | UNKNOWN | ~500–600 | ~`11 px estimated` | Centered | UNKNOWN | White | INFERRED |
| Secondary CTA | `View Technology` | UNKNOWN | ~500–600 | ~`11 px estimated` | Centered | UNKNOWN | Blue | INFERRED |
| Trust copy | `Trusted by 10,000+ Patients` | UNKNOWN | ~400–500 | ~`10 px estimated` | ~`14 px estimated` | UNKNOWN | Slate | INFERRED |
| Rating | `4.9/5` | UNKNOWN | ~600 | ~`10 px estimated` | ~`14 px estimated` | UNKNOWN | Navy | INFERRED |
| Anchor labels | Bottom navigation | UNKNOWN | ~400–500 | ~`8–9 px estimated` | ~`12 px estimated` | UNKNOWN | Muted navy | INFERRED |

### 6.3 Borders, radius, effects

| Element | Border | Radius | Shadow / blur | Opacity | Status |
|---|---|---|---|---|---|
| Primary CTA | None visible | ~`5–6 px estimated` | Subtle blue shadow possible | 100% | INFERRED |
| Secondary CTA | ~`1 px estimated` blue | ~`5–6 px estimated` | None visible | 100% | INFERRED |
| Avatar | White separator/border possible | Circle | None visible | 100% | OBSERVED / INFERRED |
| Anchor nav | Top border ~`1 px estimated` pale blue-gray | None | None | 100% | INFERRED |
| Hero media fade | No border | N/A | Soft blending | Variable | OBSERVED |

### 6.4 Icons and decoration

| Element ID | Description | Asset type | Size / placement | Source required | Status |
|---|---|---|---|---|---|
| `calendar-icon` | Calendar outline | SVG preferred | ~`14 px estimated` inside primary CTA | Existing library | OBSERVED |
| `play-icon` | Play triangle inside circle | SVG preferred | ~`17 px estimated` inside secondary CTA | Existing library | OBSERVED |
| `rating-star` | Five filled stars | SVG preferred | Small horizontal row | Existing library | OBSERVED |
| `anchor-about-icon` | Tooth/service-style outline | SVG preferred | Before label | Existing service nav icon set | OBSERVED |
| `anchor-services-icon` | Medical/service symbol | SVG preferred | Before label | Existing icon set | OBSERVED |
| `anchor-benefits-icon` | Shield-style icon | SVG preferred | Before label | Existing icon set | OBSERVED |
| `anchor-candidate-icon` | Person/group icon | SVG preferred | Before label | Existing icon set | OBSERVED |
| `anchor-structure-icon` | Implant/tooth structure icon | SVG preferred | Before label | Service-specific/configurable | OBSERVED |
| `anchor-technology-icon` | Technology/device icon | SVG preferred | Before label | Existing icon set | OBSERVED |
| `anchor-procedure-icon` | Dental/procedure icon | SVG preferred | Before label | Existing icon set | OBSERVED |
| `anchor-results-icon` | Document/result icon | SVG preferred | Before label | Existing icon set | OBSERVED |
| `anchor-pricing-icon` | Pricing/document icon | SVG preferred | Before label | Existing icon set | OBSERVED |
| `anchor-faq-icon` | Information/question icon | SVG preferred | Before label | Existing icon set | OBSERVED |
| `anchor-contact-icon` | Phone/contact icon | SVG preferred | Before label | Existing icon set | OBSERVED |

## 7. Asset Manifest

| Asset ID | Visible description | Required format | Aspect ratio / crop | Placement | Alt text requirement | Status |
|---|---|---|---|---|---|---|
| `service-hero-media` | Dental implant hero composition inside a modern dental clinic | WebP / PNG / JPG / UNKNOWN | Wide composition | Right half of hero | Likely decorative if title/description convey service; exact semantics depend on asset strategy | OBSERVED |
| `implant-model` | Large white crown + metallic implant screw | PNG/WebP with transparency if separate | Tall portrait object | Center-right foreground | Decorative if service already named | OBSERVED |
| `jaw-model` | Transparent jaw with teeth | PNG/WebP if separate | Wide | Lower-right | Decorative | OBSERVED |
| `clinic-background` | Bright Smilux treatment room | JPG/WebP if separate | Landscape | Right background | Decorative | OBSERVED |
| `xray-monitor` | Monitor displaying dental CT/implant planning scan | Part of composite or separate raster | Landscape | Upper-right | Decorative unless conveying specific technology | OBSERVED |
| `trust-avatar-1` | Patient portrait avatar | PNG/WebP | Circle crop | Social-proof group | Alt requirement UNKNOWN; often decorative if names are not supplied | OBSERVED |
| `trust-avatar-2` | Patient portrait avatar | PNG/WebP | Circle crop | Social-proof group | Same | OBSERVED |
| `trust-avatar-3` | Patient portrait avatar | PNG/WebP | Circle crop | Social-proof group | Same | OBSERVED |
| `trust-avatar-4` | Patient portrait avatar | PNG/WebP | Circle crop | Social-proof group | Same | OBSERVED |
| `service-nav-icons` | Icon set for in-page anchor navigation | SVG preferred | Square | Bottom nav | Decorative when adjacent labels exist | OBSERVED |

### Asset handling rules
- Service media must be configurable per service.
- Do not hard-code the Dental Implants illustration into the reusable template.
- Each service should provide its own `heroMedia` asset or media composition.
- Preserve consistent hero media bounds/crop across service pages while allowing per-service object positioning.
- If screenshot visual is one precomposed raster asset, prefer using that exact asset rather than rebuilding individual visual layers.
- If original design exposes separate layers, maintain configurable layering rather than assuming all service hero visuals use identical composition.
- Social-proof avatars may be globally reused only if they represent site-level trust proof rather than service-specific proof; source behavior is UNKNOWN.
- Do not invent patient names or testimonials.
- Embedded Smilux monitor branding should not be reconstructed as DOM text unless source evidence confirms it is independent.

## 8. Component Contract

### 8.1 Recommended component boundary

| Component | Responsibility | Reusable? | Evidence | Status |
|---|---|---|---|---|
| `ServiceDetailHero` | Reusable hero shell for every service detail page | Yes | User explicitly states page is shared across services | INFERRED |
| `ServiceBreadcrumb` | Parent/current service breadcrumb | Yes | Stable hero pattern | INFERRED |
| `ServiceHeroContent` | H1 + description | Yes | Service data varies | INFERRED |
| `ServiceHeroActions` | Primary + secondary CTA | Yes | Stable visual pattern | INFERRED |
| `PatientTrustProof` | Avatars + trust copy + rating | Yes | Independent reusable block | INFERRED |
| `ServiceHeroMedia` | Render service-specific visual | Yes | Content should change per service | INFERRED |
| `ServiceAnchorNav` | In-page section navigation | Yes | Bottom nav structurally independent | OBSERVED / INFERRED |
| `ServiceAnchorItem` | Icon + label + destination | Yes | Repeated 11 times | OBSERVED |

### 8.2 Reusable data model

// This is an interface contract only, not implementation code.
// It describes page data required to reuse the same template for different services.

interface ServiceDetailPageData {
  slug: string;
  title: string;
  breadcrumbLabel: string;
  description: string;

  hero: {
    media: string;
    mediaAlt?: string;
    mediaPosition?: string;

    primaryAction: {
      label: string;
    };

    secondaryAction?: {
      label: string;
    };
  };

  trustProof?: {
    label: string;
    rating: string;
    avatars: string[];
  };

  sections: Array<{
    id: string;
    navLabel: string;
    icon: string;
  }>;
}

| Field | Type | Required | Visible evidence | Notes |
|---|---|---|---|---|
| `slug` | string | Yes | Shared dynamic service detail route implied | Route value not visible |
| `title` | string | Yes | `Dental Implants` | Must change per service |
| `breadcrumbLabel` | string | Yes | `DENTAL IMPLANTS` | Could derive from service metadata |
| `description` | string | Yes | Service-specific paragraph | Must change per service |
| `hero.media` | asset | Yes | Implant-specific visual | Must change per service |
| `hero.mediaAlt` | string | No / conditional | Accessibility requirement | Depends on image meaning |
| `hero.mediaPosition` | config | No / likely | Different service media may need different crop | INFERRED |
| `hero.primaryAction.label` | string | Yes | `Book Consultation` | Could remain shared globally |
| `hero.secondaryAction` | object | No / Unknown | `View Technology` shown for reference | Whether all services have technology CTA UNKNOWN |
| `trustProof.label` | string | No / likely shared | `Trusted by 10,000+ Patients` | Could be global site data |
| `trustProof.rating` | string | No / likely shared | `4.9/5` | Data source UNKNOWN |
| `trustProof.avatars` | string[] | No / likely shared | Four avatars visible | Source UNKNOWN |
| `sections` | array | Yes | Bottom service anchor nav | Must support service-specific labels/sections |
| `sections[].id` | string | Yes | Required for anchor mapping if scroll-nav | Actual IDs UNKNOWN |
| `sections[].navLabel` | string | Yes | 11 labels visible | Some labels service-specific |
| `sections[].icon` | asset | Yes | Icon per item | Prefer shared icon mapping |

### 8.3 Content behavior
- Template shell: shared across all service detail pages.
- Service-specific content:
  - breadcrumb current label;
  - H1;
  - description;
  - hero visual;
  - potentially media crop/position;
  - service-specific anchor labels such as `About Implants` and `Implant Structure`;
  - section content following the hero.
- Likely shared content:
  - breadcrumb parent `SERVICES`;
  - CTA style;
  - `Book Consultation` label;
  - trust-proof presentation;
  - anchor nav visual treatment.
- UNKNOWN whether `View Technology` exists for every service.
- UNKNOWN whether every service uses exactly 11 sections.
- UNKNOWN whether `Pricing`, `FAQ`, `Contact`, `Benefits`, etc. are globally guaranteed for every service.
- Therefore navigation must be data-driven rather than hard-coded to the Dental Implants section list.

## 9. Interaction States

| Element | Default evidence | Hover | Active | Focus | Disabled | Link/action destination | Status |
|---|---|---|---|---|---|---|---|
| Breadcrumb parent | Blue text | UNKNOWN | UNKNOWN | Must be accessible if linked | N/A | Likely Services index, exact route UNKNOWN | OBSERVED / UNKNOWN |
| Book Consultation | Filled blue | UNKNOWN | UNKNOWN | Must be accessible | UNKNOWN | Booking behavior UNKNOWN | OBSERVED / UNKNOWN |
| View Technology | White + blue outline | UNKNOWN | UNKNOWN | Must be accessible | UNKNOWN | Technology destination UNKNOWN | OBSERVED / UNKNOWN |
| Anchor navigation items | Icon + label | UNKNOWN | No active item visibly distinguished | Must be accessible | N/A | In-page anchor implied; exact behavior UNKNOWN | OBSERVED / UNKNOWN |
| Social-proof avatars | Static | N/A | N/A | N/A unless interactive | N/A | No destination visible | OBSERVED |

### Interaction constraints
- Do not invent booking modal behavior.
- Do not invent video playback from the play-like icon in `View Technology`; visible label indicates technology, not necessarily video.
- Do not assume anchor nav is sticky.
- Do not assume active-section highlighting unless a design state is provided.
- Do not hard-code section hash IDs without matching actual sections in the template.
- Anchor items whose corresponding section is absent for a service must not be fabricated merely to preserve 11 items.

## 10. Responsive Specification

### 10.1 Evidence available
- Desktop evidence: OBSERVED — horizontal hero with content left, media right, anchor nav in one horizontal row.
- Tablet evidence: UNKNOWN.
- Mobile evidence: UNKNOWN.

### 10.2 Required desktop behavior
- Hero main area preserves approximately left/right split shown in reference.
- Service H1 remains a single line for `Dental Implants` at target viewport.
- Description stays constrained enough to produce approximately three lines.
- CTA buttons remain horizontally aligned.
- Social proof remains beneath CTA row.
- Service media covers right region without interfering with hero copy.
- Foreground service object remains the dominant right-side focal point.
- Anchor navigation remains a single horizontal row at target viewport.
- Anchor items are distributed across available width.
- Bottom navigation visually separates hero from subsequent content.

### 10.3 Proposed responsive behavior

| Breakpoint range | Layout behavior | Typography behavior | Image/asset behavior | Status and rationale |
|---|---|---|---|---|
| Desktop | Content left + media right; horizontal anchor nav | Match screenshot | Controlled per-service crop | OBSERVED |
| Tablet | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN — no evidence |
| Mobile | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN — no evidence |

### 10.4 Responsive assumptions requiring approval
- Whether hero media stacks below content.
- Whether CTAs stack vertically.
- Whether social proof wraps.
- How service-specific media is cropped on narrow screens.
- Whether anchor navigation wraps, scrolls horizontally, collapses, or becomes a dropdown.
- Whether anchor nav becomes sticky on mobile/desktop.
- Exact breakpoints.
- H1 responsive sizing.
- Whether secondary CTA remains visible for all services/mobile states.

## 11. Semantic HTML and Accessibility

### Recommended structure
- Landmark: hero section associated with page H1.
- Breadcrumb: semantic breadcrumb navigation.
- Heading hierarchy: service name is page-level H1.
- Description: normal paragraph.
- Primary/secondary actions: semantic link or button based on actual behavior.
- Social proof: supporting content, not heading.
- Rating: provide accessible text equivalent to visual stars.
- Hero media: decorative if it only illustrates the named service; meaningful alt if it conveys additional information.
- Anchor navigation: semantic navigation landmark with descriptive accessible label.
- Anchor items: semantic links if they navigate to page sections.
- Keyboard behavior: breadcrumb, CTAs and all anchor links must be reachable.
- Focus visibility: explicit visible focus indicator required.
- Screen-reader-only content required: star rating may need text such as equivalent `4.9 out of 5`.
- Form labels, if applicable: N/A.

### Accessibility constraints
- Do not encode section navigation only through icons.
- Anchor labels must remain readable text.
- Decorative icons should be hidden from assistive technology.
- If avatars do not correspond to named users/testimonials, they should generally be decorative.
- Do not fabricate patient identities for avatar alt text.
- Rating information must not rely solely on visual stars.
- Breadcrumb current item should be exposed appropriately as current page.
- If anchor nav becomes sticky, keyboard focus must not cause anchored content to be obscured behind it.
- If service hero image is decorative, avoid redundant alt text such as repeating the H1.

## 12. Implementation Constraints

- Build a single reusable `ServiceDetailPage` / `ServiceDetailHero` architecture rather than separate hard-coded page implementations per service.
- All service-specific hero copy and assets must come from structured configuration/content data.
- Do not branch styling by service unless required for asset crop/position or documented service-specific variation.
- Preserve a common spacing/typography/action system across all service detail pages.
- The Dental Implants screenshot is the reference for template geometry, not a reason to hard-code implant-specific text.
- Anchor navigation must derive from the service's actual section configuration.
- Do not hard-code `About Implants` or `Implant Structure` into the shared component.
- Do not assume every service has all 11 reference sections.
- Shared sections such as Benefits, Procedure, Results, Pricing, FAQ and Contact may be reused only if supplied in that service's content schema.
- Use exact service hero assets whenever available.
- Prefer project design tokens and shared CTA/icon components.
- Do not invent booking, technology or anchor behavior.
- If an item is UNKNOWN, request clarification before implementing product behavior.

## 13. Visual Acceptance Criteria

The reusable implementation is acceptable only if the `Dental Implants` reference instance at the target desktop viewport confirms:

- [ ] Hero main area matches the reference proportions.
- [ ] Breadcrumb position, case and blue styling match.
- [ ] H1 reads exactly `Dental Implants`.
- [ ] H1 scale, weight and baseline match.
- [ ] Description matches the supplied copy and approximate line wrapping.
- [ ] Primary `Book Consultation` CTA dimensions, blue fill, icon and alignment match.
- [ ] Secondary `View Technology` CTA dimensions, outline, icon and alignment match.
- [ ] CTA gap matches.
- [ ] Social-proof block sits at the correct lower-left position.
- [ ] Four avatars overlap/align like the reference.
- [ ] `Trusted by 10,000+ Patients` matches.
- [ ] Five stars and `4.9/5` match visually.
- [ ] Hero media begins at the correct center/right region.
- [ ] Implant model occupies the correct dominant foreground position.
- [ ] Jaw model, clinic visual and monitor align closely with screenshot.
- [ ] White-to-media transition remains soft.
- [ ] Anchor navigation spans the bottom width.
- [ ] All 11 reference items appear in the correct order for the Dental Implants instance.
- [ ] Anchor icons and labels remain vertically aligned.
- [ ] No unsupported sticky state or active anchor styling is added.
- [ ] Swapping service data does not require duplicating the hero component.
- [ ] Other services can replace title, description, hero media and section nav without layout rewrite.
- [ ] All unresolved behavior remains documented.

## 14. Visual Risks

| Risk | Why it affects fidelity | Mitigation | Priority |
|---|---|---|---|
| Hero media may be a single precomposed asset | Rebuilding it from separate layers may produce substantial visual mismatch | Inspect/export exact Figma/project asset first | High |
| Using one media crop for all services | Different service objects may clip or shift incorrectly | Support configurable media positioning per service | High |
| Template hard-coded around Implant content | Prevents correct reuse for other services | Drive breadcrumb, hero content and section nav from service data | High |
| Fixed 11-item nav | Other services may have different section composition | Generate nav from actual page section schema | High |
| Font unavailable | H1/description wrapping may diverge | Retrieve global service-detail typography tokens | High |
| Anchor nav interaction unknown | Sticky/scrollspy assumptions could produce unsupported UI | Implement only confirmed anchor behavior | Medium |
| Trust proof data source unknown | Could accidentally hard-code stale/non-global metrics | Make trust-proof content configurable | Medium |
| Secondary CTA may not apply to every service | Empty or irrelevant action could appear | Allow optional secondary action | Medium |
| Exact hero colors/fade unknown | Changes left/right integration | Use project token/design source | Medium |
| Responsive behavior unavailable | Bottom nav is especially risky on narrow screens | Obtain responsive design before final implementation | High |

## 15. Open Questions

| ID | Question | Blocking level | Suggested owner |
|---|---|---|---|
| Q1 | Route pattern chính xác cho service detail là `/services/:slug` hay cấu trúc khác? | Blocking for routing | Developer |
| Q2 | Có danh sách tất cả service và content schema tương ứng không? | Blocking for reusable implementation | Product / Developer |
| Q3 | Hero visual của từng service là một precomposed image hay nhiều layer/assets riêng? | Blocking for fidelity | Designer |
| Q4 | Mỗi service có hero image riêng và object-position riêng không? | Blocking for reusable media behavior | Designer |
| Q5 | `Book Consultation` là action dùng chung cho tất cả service hay có service-specific booking behavior? | Blocking for production behavior | Product |
| Q6 | `View Technology` có xuất hiện ở tất cả service không? | Blocking for reusable schema | Product / Designer |
| Q7 | Nếu service không có Technology section thì secondary CTA phải ẩn hay đổi nội dung? | Blocking for reusable behavior | Product |
| Q8 | Trust proof `Trusted by 10,000+ Patients`, avatars và `4.9/5` là global data hay service-specific? | Blocking for data model | Product |
| Q9 | Bottom navigation có sticky behavior không? | Blocking for interaction | Designer / Developer |
| Q10 | Bottom navigation có scrollspy/active state theo section hiện tại không? | Blocking for interaction | Designer / Developer |
| Q11 | Click bottom navigation thực hiện smooth-scroll tới anchor, native jump, hay route khác? | Blocking for interaction | Product / Developer |
| Q12 | Tất cả service có cùng số section không? | Blocking for reusable template | Product |
| Q13 | Những section nào là mandatory globally và section nào optional/service-specific? | Blocking for reusable template | Product / Designer |
| Q14 | Label dạng `About Implants` có được tự động đổi theo service, ví dụ `About Crowns`, `About Orthodontics`, hay có copy riêng từng trang? | Blocking for content model | Product |
| Q15 | `Implant Structure` tương ứng với một generic section type nào trên các service khác? | Blocking for reusable content architecture | Product / Designer |
| Q16 | Có desktop/tablet/mobile design references cho service detail template không? | Blocking for responsive fidelity | Designer |
| Q17 | Exact font, blue/navy tokens và CTA dimensions lấy từ global design system nào? | Non-blocking | Designer / Developer |
| Q18 | Exact avatar assets và icon set nằm ở đâu? | Non-blocking | Designer / Developer |

## 16. Handoff Summary

### Safe to implement now
- Một reusable service-detail hero shell.
- Breadcrumb + H1 + description hierarchy.
- Two-CTA desktop composition.
- Social-proof layout.
- Hero media region bên phải.
- White-to-media transition.
- Bottom service anchor navigation.
- Config-driven service title.
- Config-driven service description.
- Config-driven breadcrumb current label.
- Config-driven hero image.
- Optional/configurable secondary action.
- Config-driven section navigation.
- Dental Implants reference copy và nav ordering để screenshot-test template.

### Requires asset export
- Exact Dental Implants hero media.
- Hero assets tương ứng cho từng service khác.
- Patient avatars.
- Calendar icon.
- Play/technology icon.
- 5-star icon treatment.
- Full bottom navigation icon set.

### Requires design/product decision
- Service detail route structure.
- Complete service content schema.
- Mandatory vs optional page sections.
- Generic mapping cho service-specific sections.
- Whether `View Technology` is universal.
- Trust-proof data ownership.
- Anchor scroll behavior.
- Sticky/scrollspy behavior.
- Responsive navigation behavior.
- Hero media composition strategy.

### Do not assume
- Mỗi service có đúng 11 sections.
- Mỗi service có `Technology`.
- Mỗi service có `Pricing`.
- `About Implants` có thể hard-code.
- `Implant Structure` là section dùng chung tên này cho service khác.
- Bottom nav sticky.
- Scrollspy.
- Smooth scrolling.
- Booking modal.
- Technology video.
- Trust metrics là static.
- Hero assets có cùng crop.
- Exact service routes.
- Exact font family.
- Exact HEX colors.