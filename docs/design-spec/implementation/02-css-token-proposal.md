# Page Spec — Common Service Detail Template

**Example visible in Figma:** Dental Implants  
**Figma nodes:** `6:33`, `25:63`, `25:65`  
**Source:** 3 raster slices composing one long service-detail page.

## Template goal
Provide one reusable information architecture for all treatment pages while allowing service-specific modules to appear only when relevant.

## Section inventory
The Dental Implant example contains **13 major content sections** plus header, anchor navigation, contact conversion and footer.

| # | Section | Layout |
|---|---|---|
| 0 | Header | global nav |
| 1 | Service hero | copy + product/clinic visual |
| 2 | Service anchor nav | horizontal icon/text jump links |
| 3 | What is the service? | text + benefits/process bullets + clinical image |
| 4 | Service variants | 4 cards |
| 5 | Benefits | 5 icon cards |
| 6 | Candidate / indication section | checklist + patient photo |
| 7 | Structure / anatomy | infographic + explanatory facts |
| 8 | Advanced technology | dark tech panel + 4–5 technology cards |
| 9 | Procedure | 6-step process |
| 10 | Specialists | 4 doctor cards |
| 11 | Real patient results | before/after + testimonials |
| 12 | Pricing | 4 pricing cards |
| 13 | FAQ | two-column accordion list |
| 14 | Consultation/contact | form + location/map |
| 15 | Footer | global dark footer |

---

## 1. Service Hero
### Desktop
- Left: breadcrumb/eyebrow, service title, 2–3 line explanation, primary and secondary CTA, rating/trust indicator.
- Right: service-specific hero visualization. Dental Implant example combines large implant rendering + clinic CT/X-ray context.
- Ratio: left 44–48%, right 52–56%.
- Keep the clinical product visual large enough to communicate service specificity.

### Mobile
- Copy first, visual second.
- Keep service title 36–42 px.
- Rating row wraps instead of scaling down.

## 2. Service Anchor Navigation
### Desktop
- Thin horizontal row under hero.
- Multiple small icons/labels linking to major subsections such as About, Service, Benefits, Candidates, Structure, Technology, Procedure, Results, Pricing, FAQ, Contact.
- Sticky-on-scroll is recommended after the user passes the hero.

### Mobile
- Horizontal scroll, not multi-line wrapping.
- Active anchor indicated by blue underline/pill.

## 3. “What Are Dental Implants?” / Service Definition
### Desktop
- Left ~42%; right ~58% clinical image.
- Left contains intro text plus 3 compact evidence/feature bullets.
- Right image illustrates implant structure in jaw.

### Mobile
- Text first, image after bullets.
- Clinical diagram should be tap-to-zoom if important labels are embedded.

## 4. Service Variants
Dental implant reference shows 4 cards:
- Single Tooth Implant
- Multiple Teeth Implants
- Full-Arch Implants
- Implant-Supported Crown/Bridge style solution

### Desktop
- 4 columns.
- Each card has medical illustration, title and 2–3 lines of description.

### Responsive
- 4 → 2 → 1 columns.

## 5. Benefits
### Desktop
- 5 equal compact cards.
- Icon + short benefit title + supporting line.
- Visually lighter than service-variant cards.

### Mobile
- 2 columns; 1 below ~390 px.

## 6. Who Should Consider This Service?
### Desktop
- Checklist left ~55–60%; lifestyle/patient photo right ~40–45%.
- Checklist uses blue checks and short candidate statements.

### Mobile
- Checklist first, photo beneath.

## 7. Implant Structure / Service Anatomy
### Desktop
- Pale blue technical infographic section.
- Central annotated medical illustration.
- Supporting labels around it and a `Why This Matters` explanation card.
- This module is optional for services without a meaningful anatomy/structure diagram.

### Mobile
- Do not force annotation callouts around a tiny center image.
- Convert to vertical sequence: image → labeled parts → why-it-matters card.

## 8. Advanced Technology
### Desktop
- Strong navy technology panel on left with OTI Guided Implant positioning.
- Right side contains 4–5 small capability cards such as CT/CBCT scanning, digital implant planning, minimally invasive placement, faster recovery, precision-guided workflow.
- Section alternates dark/light blocks to create emphasis.

### Mobile
- Dark technology panel full width first.
- Capability cards 2-column → 1.

## 9. Procedure
### Desktop
- 6 numbered steps in a horizontal sequence.
- Each step: number, icon, title, one-sentence explanation.
- Connector line can run behind steps.

### Mobile
- Vertical timeline strongly preferred.
- Left rail line + numbered markers; text right.

## 10. Specialists
### Desktop
- 4 doctor cards.
- Same shared doctor-card component as Home/About.
- Service-specific specialist credentials should appear first.

### Mobile
- 1-card carousel or 1-column grid.

## 11. Real Patient Results
### Desktop
- Before/after transformation media left.
- 2 testimonial/review cards right.
- Recommended optional before/after slider enhancement.

### Mobile
- Before/after first, reviews after.

## 12. Pricing
### Desktop
- 4 plan/option cards.
- Reference includes visible strong price numbers and one emphasized/popular plan.
- Consultation card can show `FREE` instead of a numeric price.

### Requirements
- Every price must state unit/currency and whether it is “from”.
- Medical treatment pricing should not imply guaranteed suitability; keep consultation disclaimer close.

### Mobile
- Horizontal comparison becomes stacked cards.
- Avoid feature tables that require horizontal pinch zoom.

## 13. FAQ
### Desktop
- Two columns of accordion rows.
- Compact question-only state by default.

### Mobile
- One column.
- Accordion target height ≥44 px.

## 14. Consultation / Location
### Desktop
- Left ~60% consultation form.
- Middle/right contact text and map.
- Form fields: name, phone, email, service, message.

### Mobile
- Form → contact details → map.
- Map ratio ~16:9.

## 15. Footer
Use the canonical global footer from Home/About/Services.

## Template implementation rule
The service page should be data-driven. Do **not** build one hard-coded page per treatment if the page structure is shared. Use a service schema/CMS model with optional modules for:
- variants;
- anatomy;
- technology;
- procedure;
- specialists;
- pricing;
- FAQ;
- results.
