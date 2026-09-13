# Service Documentation → Frontend Section Audit

Audited on 2026-09-12.

## Finding

All seven service documents already contain their cost section. The Facelift
document contains both:

- `SECTION 19 — FACELIFT COST IN VIETNAM`
- `SECTION 20 — WHAT ABOUT FULL FACELIFT PRICING?`

The omission was in the frontend service renderer: `ServicePage` rendered the
shared overview, suitability, approach, planning, specialty, hospital,
recovery, risks, expectations, international, FAQ and CTA sections, but did not
render the shared pricing/cost slot at all.

The shared pricing slot is now rendered for all seven services from typed data
in `dental-frontend/src/data/service-details.ts`. Published values are shown
as indicative starting/reference prices. Services without an approved price do
not receive an invented estimate.

## Common section coverage

| Section slot | Markdown | Frontend before audit | Frontend after audit |
| --- | ---: | ---: | ---: |
| Hero | 7/7 | 7/7 | 7/7 |
| Procedure overview | 7/7 | 7/7 | 7/7 |
| Suitability | 7/7 | 7/7 | 7/7 |
| Surgeon-led approach | 7/7 | 7/7 | 7/7 |
| Clinical planning | 7/7 | 7/7 | 7/7 |
| Hospital surgery | 7/7 | 7/7 | 7/7 |
| Recovery / aftercare | 7/7 | 7/7 | 7/7 |
| Risks / considerations | 7/7 | 7/7 | 7/7 |
| Realistic expectations | 7/7 | 7/7 | 7/7 |
| Pricing / cost status | 7/7 | **0/7** | **7/7** |
| International patient pathway | 7/7 | 7/7 | 7/7 |
| FAQ | 7/7 | 7/7 | 7/7 |
| Final CTA | 7/7 | 7/7 | 7/7 |

## Service-specific content and current implementation status

The source documents contain additional specialty sections. They must not be
reported as fully implemented merely because an older renderer condensed them
into two `specialty` cards. The service data now exposes typed
`specialtySections`, and `ServicePage` renders these as separate modules while
keeping the layout primitive shared. The module copy is intentionally concise;
it is the structured implementation layer, not a replacement for the full
source document.

- Blepharoplasty: upper/lower eyelid, brow-vs-eyelid, eye health and revision.
- Breast: Motiva options, augmentation-vs-lift, revision, symmastia, silicone
  removal and capsulectomy.
- Buttock augmentation: BBL process, implant comparison, safety and pricing
  inclusion logic.
- Facelift: mini/full facelift, neck lift, brow lift, combination decisions and
  full-facelift pricing clarification.
- Gastric sleeve: bariatric eligibility, reflux, preoperative assessment,
  long-term care and post-weight-loss surgery.
- Labiaplasty: anatomy variation, labiaplasty-vs-vaginoplasty, privacy and
  intimate procedure planning.
- Liposuction: body-area modules, liposuction-vs-skin removal and combined
  body-contouring planning.

For the complete source reconciliation, table verification and remaining
full-copy parity notes, see `SOURCE-RECONCILIATION-AUDIT.md`.

This distinction prevents silently claiming that the frontend has 161 separate
blocks when it currently has a shared, concise service-page presentation.
