# Services Section Inventory

> **Source audit required:** This inventory is a semantic implementation map,
> not a replacement for the source documents. Read
> `SOURCE-RECONCILIATION-AUDIT.md` before adding or removing a service section.
> The raw markdown in `services-docs/docx-docs/md` does not preserve DOCX
> heading styles reliably. Pricing must be verified against the DOCX table.

## Scope

This inventory covers the seven service documents currently in `services-docs`:

1. Blepharoplasty & Eye Rejuvenation
2. Breast Augmentation & Revision Surgery
3. Buttock Augmentation
4. Facelift & Facial Rejuvenation
5. Gastric Sleeve Surgery
6. Labiaplasty & Intimate Cosmetic Surgery
7. Liposuction & Body Contouring

The documents contain **161 numbered sections** in total. The count includes the
hero, FAQ and final CTA sections, but excludes the later implementation notes,
AI generation rules, decision logic and verification notes.

The numbered count is a component-planning count. DOCX heading counts are
higher because many headings are nested procedure, concern and FAQ items. A
nested source heading must not be treated as missing merely because it is
represented as a child block; it must, however, remain present in the service's
typed content data.

| Service | Numbered sections |
| --- | ---: |
| Blepharoplasty | 24 |
| Breast augmentation | 24 |
| Buttock augmentation | 22 |
| Facelift | 24 |
| Gastric sleeve | 19 |
| Labiaplasty | 26 |
| Liposuction | 22 |
| **Total** | **161** |

## Common Section Slots

These are semantic slots, not exact title matches. They appear in all seven
documents and should become shared components with service-specific data.

| Common slot | Coverage | Recommended component | Notes |
| --- | ---: | --- | --- |
| Hero | 7/7 | `ServiceHero` | Same shell: eyebrow, H1, supporting copy, trust points and CTA intents. Use service-specific image and procedure paths. |
| Procedure overview / understanding | 7/7 | `ServiceOverviewSection` | Educational introduction; content length and supporting blocks vary. |
| Candidate / suitability assessment | 7/7 | `SuitabilitySection` | “Who may consider” is not a diagnosis. Supports concerns, indications and assessment caveats. |
| Surgeon-led approach | 7/7 | `SurgeonApproachSection` | Common trust/philosophy pattern; body questions differ by specialty. |
| Clinical planning / procedure pathway | 7/7 | `ClinicalPlanningSection` | Shared structure, but variants include implant planning, BBL planning, bariatric pre-op and body-contouring planning. |
| Hospital surgery | 7/7 | `HospitalBasedSurgerySection` | Shared CIH explanation, safety infrastructure and international-patient context. |
| Recovery / aftercare | 7/7 | `RecoverySection` | Shared recovery shell; timelines, restrictions and travel rules are service-specific. |
| Risks / considerations | 7/7 | `RisksSection` | Shared disclaimer and risk hierarchy; risk groups are procedure-specific. |
| Results / realistic expectations | 7/7* | `RealisticExpectationsSection` | Gastric sleeve uses “weight loss & realistic expectations”, but is the same semantic slot. |
| Pricing / cost status | 7/7 | `PricingSection` | Should support published ranges, assessment-only pricing and “not responsibly published” states. |
| International patient pathway | 7/7 | `InternationalPatientSection` | Shared remote consultation, information-to-send and travel planning structure. |
| FAQ | 7/7 | `ServiceFaqSection` | Same accordion component/data contract; 5–10 questions per service. |
| Final conversion / assessment CTA | 7/7 | `ServiceCtaSection` | Six use consultation CTA; gastric sleeve uses assessment CTA. Same component with `intent` variant. |

\* Gastric sleeve does not use the literal word “results”; it uses weight-loss
expectations and long-term outcome language.

### Common does not mean identical

The common components should own layout, accessibility, typography, responsive
behavior and animation. They should receive structured content and a variant,
for example:

```ts
type ClinicalPlanningVariant =
  | 'generic-surgical-planning'
  | 'implant-selection'
  | 'fat-transfer-vs-implant'
  | 'facial-rejuvenation'
  | 'bariatric-preoperative'
  | 'intimate-surgery'
  | 'body-contouring'
```

Do not build one component by checking the service slug in JSX. Use a typed
section contract and variant-specific data.

## Shared Optional Section Families

These are not present in all seven documents, but recur often enough to justify
reusable components or composable primitives.

| Section family | Coverage | Services | Recommendation |
| --- | ---: | --- | --- |
| Common concerns / concern cards | 4/7 as an explicit heading | Blepharoplasty, Breast, Buttock, Facelift | `ConcernGrid`; Labiaplasty and Liposuction can use it through the suitability slot when needed. |
| Revision / complex surgery | 4/7 as an explicit heading | Blepharoplasty, Breast, Facelift, Labiaplasty | `RevisionAssessmentSection`; do not show by default on services where revision is not a primary pathway. |
| Combined procedure or pricing logic | 6/7 in some form | All except Gastric Sleeve, with different meanings | Use `CombinationPlanningSection` and `PricingInclusionNotice`, not one generic pricing block. |
| Separate length-of-stay section | 3/7 | Buttock, Gastric Sleeve, Labiaplasty | `TravelDurationSection`; other services place stay guidance inside the international-patient slot. |
| Procedure comparison | 5/7 | Breast, Buttock, Facelift, Labiaplasty, Liposuction | `ProcedureComparisonSection`; comparison axes must be data-driven. |
| “Why patients consider Dr. Maris” | 6/7 | All aesthetic services except Gastric Sleeve | `WhyDrMarisSection`; gastric sleeve needs a medically appropriate assessment/trust variant instead. |

## Service-Specific Sections

> **Important:** A service-specific section is not considered implemented when
> its topic is only mentioned in a two-card `specialty` summary. The source
> topic needs either a dedicated component or a typed section rendered through a
> proven shared primitive. See `SOURCE-RECONCILIATION-AUDIT.md` for the
> complete list.

These are section families that occur only in one service document and should be
implemented as special-purpose components or specialty modules.

### Blepharoplasty — eye-specific modules

Approx. **6 exclusive section families**:

- Upper blepharoplasty
- Lower blepharoplasty
- Under-eye bags are not always the same problem
- Eyebrow lift
- Upper blepharoplasty vs eyebrow lift
- Eye health & medical history
- Eye-health and eyelid-specific assessment

Recommended special components:

- `EyelidProcedureSection`
- `EyelidConcernComparison`
- `EyeHealthAssessmentSection`
- `BrowVsEyelidDecisionSection`

Revision surgery itself is not exclusive to Blepharoplasty; it belongs to the
reusable `RevisionAssessmentSection` family shared with Breast, Facelift and
Labiaplasty.

### Breast Augmentation — implant and revision modules

Approx. **7 exclusive section families**:

- Motiva implant options
- Breast augmentation vs breast lift
- Breast lift / mastopexy
- Problems after previous breast augmentation
- Symmastia correction
- Free silicone removal
- Implant removal & capsulectomy
- Implant removal and capsule assessment

Recommended special components:

- `ImplantOptionsSection`
- `AugmentationVsLiftSection`
- `BreastRevisionConcernSection`
- `ImplantRemovalAssessmentSection`

### Buttock Augmentation — BBL and implant safety modules

Approx. **6 exclusive section families**:

- BBL fat transfer
- How BBL works
- Buttock implants
- BBL vs buttock implants
- BBL safety requires special attention
- Does BBL pricing include liposuction?
- BBL pricing inclusion logic

Recommended special components:

- `BblProcessSection`
- `FatTransferVsImplantSection`
- `BblSafetySection`
- `BblPricingInclusionSection`

### Facelift — facial rejuvenation decision modules

Approx. **7 exclusive section families**:

- Mini facelift
- Mini facelift vs full facelift
- Neck lift surgery
- Facelift and neck lift decision
- Forehead / brow lift
- No single facelift technique for everyone
- Full facelift pricing clarification

Recommended special components:

- `FacialRejuvenationOptionsSection`
- `LiftCombinationDecisionSection`
- `TechniqueSelectionSection`
- `FacialRevisionSection`

### Gastric Sleeve — bariatric medical pathway modules

Approx. **12 exclusive/medical-specialty section families**; this is the largest structural outlier:

- Metabolic and bariatric surgery explanation
- Bariatric candidacy and guideline context (specialty variant of the shared suitability slot)
- Obesity-related health conditions
- Gastric sleeve vs liposuction/body contouring
- Sleeve gastrectomy procedure pathway
- Preoperative assessment
- Acid reflux considerations
- Long-term follow-up
- Weight-loss expectations and weight regain
- Cosmetic surgery after major weight loss
- Pricing status / not automatically published
- Bariatric assessment CTA

Recommended special components:

- `BariatricOverviewSection`
- `BariatricEligibilitySection`
- `SleeveVsBodyContouringSection`
- `BariatricPreoperativeAssessment`
- `BariatricLongTermCareSection`
- `BariatricPricingStatusSection`

Gastric sleeve should not be forced into cosmetic-surgery-only components. It
can reuse the global shell, hospital, international pathway, risks, FAQ and CTA
infrastructure, but the medical content model must remain separate.

### Labiaplasty — intimate surgery and privacy modules

Approx. **9 exclusive section families**:

- Natural variation of female genital anatomy
- Labiaplasty / external genital contouring
- What labiaplasty does and does not do
- Vaginal tightening / vaginoplasty
- Labiaplasty vs vaginal tightening
- Combined labiaplasty and vaginoplasty
- Labiaplasty procedure
- Vaginoplasty planning
- Privacy during consultation and recovery

Recommended special components:

- `IntimateAnatomyVariationSection`
- `LabiaplastyVsVaginoplastySection`
- `IntimateProcedureSection`
- `PrivacyAndConfidentialitySection`
- `IntimateRevisionSection`

This service requires stronger privacy/accessibility handling and should not
reuse a generic image-heavy cosmetic procedure component without review.

### Liposuction — body-area and contour decision modules

Approx. **9 exclusive section families**:

- Body areas addressed
- 360° abdomen liposuction
- Liposuction vs tummy tuck
- Arm liposuction vs arm lift
- Thigh liposuction vs thigh lift
- Back liposuction
- Double chin liposuction
- Liposuction procedure pathway
- Combined body-contouring procedures

Recommended special components:

- `BodyAreaGridSection`
- `LiposuctionVsSkinRemovalSection`
- `BodyAreaProcedureSection`
- `CombinedBodyContouringSection`

## Proposed Component Architecture

```text
ServiceDetailPage
├── ServiceHero                         shared
├── ServiceNavigation                   shared
├── ServiceSectionRenderer              shared orchestration
│   ├── ServiceOverviewSection          shared
│   ├── SuitabilitySection              shared
│   ├── SpecialtySection                registry-driven
│   ├── SurgeonApproachSection          shared
│   ├── ClinicalPlanningSection         shared + variant
│   ├── HospitalBasedSurgerySection    shared
│   ├── RecoverySection                 shared + variant
│   ├── RisksSection                    shared + variant
│   ├── RealisticExpectationsSection    shared + variant
│   ├── PricingSection                  shared + status variant
│   ├── InternationalPatientSection     shared + variant
│   ├── ServiceFaqSection               shared
│   └── ServiceCtaSection               shared + intent variant
└── Specialty registry
    ├── blepharoplasty
    ├── breast
    ├── buttock
    ├── facelift
    ├── gastric-sleeve
    ├── labiaplasty
    └── liposuction
```

## Recommended Data Contract

The service page should be driven by a normalized section union rather than
raw Markdown headings:

```ts
type ServiceSection =
  | { type: 'overview'; data: OverviewData }
  | { type: 'suitability'; data: SuitabilityData }
  | { type: 'specialty'; key: SpecialtySectionKey; data: unknown }
  | { type: 'surgeon-approach'; data: SurgeonApproachData }
  | { type: 'planning'; variant: PlanningVariant; data: PlanningData }
  | { type: 'hospital'; data: HospitalData }
  | { type: 'recovery'; variant?: string; data: RecoveryData }
  | { type: 'risks'; data: RisksData }
  | { type: 'expectations'; data: ExpectationsData }
  | { type: 'pricing'; status: PricingStatus; data: PricingData }
  | { type: 'international'; data: InternationalData }
  | { type: 'faq'; items: FaqItem[] }
  | { type: 'cta'; intent: 'consultation' | 'assessment'; data: CtaData }
```

## Implementation Order

1. Build and validate the normalized section contract.
2. Implement the 12 common section components and the shared FAQ/CTA.
3. Implement specialty registry and render one special section per service.
4. Add content adapters from each document/CMS payload into the normalized contract.
5. Migrate the services one at a time, starting with Facelift or Liposuction.
6. Handle Gastric Sleeve and Labiaplasty as explicit specialty variants, not as
   cosmetic-page clones.
7. Add visual regression checks for section ordering, missing content and CTA/
   FAQ consistency.

## Important Decisions

- Reuse **layout and behavior**, not medical copy, between services.
- Do not infer diagnosis or eligibility from a generic component.
- Keep pricing stateful: published, assessment-only, or unavailable.
- Keep hospital and surgeon trust sections reusable but data-driven.
- Treat FAQ as a common interaction component with service-specific questions.
- Treat the final CTA as common UI with consultation vs assessment intent.
- Keep section ordering in data, not hardcoded in a large service page JSX file.
