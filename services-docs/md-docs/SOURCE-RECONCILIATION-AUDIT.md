# Service Source Reconciliation Audit

**Audit date:** 2026-09-12  
**Source of truth:** `services-docs/docx-docs/content dịch vụ/*.docx`  
**Raw conversion:** `services-docs/docx-docs/md/*.md`  
**Implementation documents:** `services-docs/md-docs/*.md`

## Executive result

The seven DOCX files were read directly, including their tables. The current
`md-docs` files contain the pricing data from the source documents; the earlier
pricing omission was in the frontend renderer, not in the current pricing
sections in `md-docs`.

The audit found two separate completeness concerns:

1. The raw DOCX-to-markdown conversion is plain text and does not preserve a
   reliable heading hierarchy. A paragraph can therefore look like body copy
   even when it is a source section heading.
2. The frontend currently renders several source sections as one condensed
   `specialty` block. This is a deliberate presentation shortcut, but it is
   **not full section parity** with the source documents.

The implementation rule is now explicit: shared semantic slots use shared
components with props; procedure-specific sections use typed service modules
and must not be silently merged into a generic component.

## Source verification matrix

| Service | DOCX tables | Pricing state | `md-docs` pricing | Raw conversion status |
| --- | ---: | --- | --- | --- |
| Blepharoplasty | 2 | 3 published procedures | Present and matched | Plain text; heading hierarchy must be reconstructed |
| Breast augmentation | 1 | 7 published procedures | Present and matched | Plain text; heading hierarchy must be reconstructed |
| Buttock augmentation | 2 | 2 published procedures | Present and matched | Plain text; heading hierarchy must be reconstructed |
| Facelift | 1 | 3 published procedures; no full-facelift line item | Present and matched | Restored after the raw file was previously empty; heading hierarchy must be reconstructed |
| Gastric sleeve | 0 | No approved price supplied | Assessment-only status present | Plain text; no price table must be invented |
| Labiaplasty | 2 | 2 published procedures | Present and matched | Plain text; one raw conversion line merged price and reference text |
| Liposuction | 1 | 8 published procedures | Present and matched | Plain text; heading hierarchy must be reconstructed |

“Matched” means the procedure names and numeric values from the DOCX tables are
present in the corresponding `md-docs` pricing section. These are indicative
starting/reference prices, not guaranteed quotations.

## Confirmed source sections that must remain visible in the content model

### Shared section slots

These are reusable layout contracts, not identical copy:

- hero and service overview
- suitability / who may consider the procedure
- surgeon-led approach
- clinical planning / procedure pathway
- hospital-based surgery
- recovery and aftercare
- risks and considerations
- results or realistic expectations
- pricing or pricing status
- international patient planning
- FAQ
- final assessment CTA

### Service-specific modules

These must be represented by service data and a dedicated module when the page
is rebuilt; do not hide them inside a generic “service-specific
considerations” card grid:

- **Blepharoplasty:** upper eyelid, lower eyelid, under-eye bags, eyebrow lift,
  brow-versus-eyelid decision, eye health/history, complex eyelid revision.
- **Breast:** Motiva options, augmentation-versus-lift, mastopexy, previous
  augmentation problems, symmastia, silicone removal, capsulectomy and complex
  revision.
- **Buttock augmentation:** BBL stages, donor-area liposuction, fat
  processing, implant surgery, BBL-versus-implant comparison and BBL safety.
- **Facelift:** mini facelift, mini-versus-full decision, neck lift, brow lift,
  face/neck combination, technique selection and full-facelift pricing status.
- **Gastric sleeve:** bariatric eligibility, obesity-related conditions,
  reflux, preoperative assessment, long-term follow-up, weight-loss expectations
  and post-weight-loss cosmetic surgery.
- **Labiaplasty:** normal anatomical variation, external contouring,
  vaginoplasty, procedure comparison, privacy, previous/complex surgery and
  separate pricing for labiaplasty and vaginal tightening.
- **Liposuction:** body-area modules, 360-degree abdomen, arm/thigh/back/chin,
  liposuction-versus-skin removal and combined body-contouring planning.

## Confirmed gaps in the current frontend implementation

The current `ServicePage` has the shared shell and pricing table, but it still
uses one `specialty` object with a small number of cards. The following should
be treated as **not yet fully implemented**, even when the information appears
in a condensed card:

- source-level sub-sections and their complete copy;
- source comparison tables and procedure decision blocks;
- service-specific recovery/risk subsections;
- all source FAQ questions (the frontend currently has a shortened FAQ set);
- explicit distinction between pricing sections and pricing clarification
  sections (for example full facelift pricing and BBL liposuction inclusion).

The pricing table added to the shared renderer is valid, but it does not replace
the service-specific pricing clarification modules.

## Rebuild rule

1. Keep shared section components responsible for layout, accessibility,
   typography, responsive behavior and animation.
2. Keep service copy in typed constants/data objects; do not hardcode service
   copy in JSX.
3. Add a typed `specialtySections` collection per service for source-only
   sections. Render it with a generic section primitive only when the content
   shape is genuinely shared; otherwise use a dedicated component.
4. Keep `PricingSection` shared, but support `published`, `assessment-only`,
   and `clarification` variants.
5. Treat the DOCX files as the authority for future audits. The raw markdown is
   a searchable working copy, not evidence that the source heading hierarchy
   was preserved.

