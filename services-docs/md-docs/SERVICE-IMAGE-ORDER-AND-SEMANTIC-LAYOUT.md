# Service Image Order & Semantic Layout Brief

**Audit date:** 2026-09-12  
**Scope:** seven records in `api::service-detail.service-detail` and the
`services-docs/docx-docs/content dịch vụ` source documents.

## Purpose

This document is the image-order brief for the Service Detail Content Manager.
It explains what each section means, what the image must communicate, and how
the image should be placed in the UI. Image selection must follow the clinical
context of the section, not simply the service name.

Do not use a generic doctor portrait repeatedly across a page. Do not use
before/after patient imagery as decorative hero art. Patient images require
documented consent and must remain in the Results system.

## Source and image rules

The content authority is the DOCX source in `services-docs/docx-docs/content
dịch vụ`. The converted markdown is used for search and section mapping, but
pricing and clinical claims must remain reconciled against the DOCX tables.

New image candidates should be:

- editorial clinical photography, not beauty-advertising imagery;
- free of identifiable patient information, unapproved logos and unsupported
  clinical claims;
- composed with a safe text area when used as a background;
- supplied with a focal-point note for mobile cropping;
- stored in the Strapi Upload Library with an alt text describing the clinical
  action, not an invented patient outcome.

The research set for the first replacement pass uses Unsplash-hosted medical
photography URLs. The URLs below are candidates only until the team confirms
the license, crop and medical appropriateness before upload:

| Image key | Intended meaning | Candidate source |
| --- | --- | --- |
| `clinical-consultation` | Surgeon and patient discussing an individualized plan | `https://images.unsplash.com/photo-1576091160399-112ba8d25d1d` |
| `facial-assessment` | Focused facial examination and anatomy assessment | `https://images.unsplash.com/photo-1559757175-0eb30cd8c063` |
| `medical-planning` | Clinical review, records and preoperative planning | `https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7` |
| `hospital-care` | Sterile hospital environment and perioperative safety | `https://images.unsplash.com/photo-1538108149393-fbbd81895907` |
| `recovery-follow-up` | Calm postoperative review and continuity of care | `https://images.unsplash.com/photo-1579684385127-1ef15d508118` |
| `surgical-team` | Surgical team preparation; no graphic operative field | `https://images.unsplash.com/photo-1551076805-e1869033e561` |
| `anatomy-education` | Non-graphic medical education and body/anatomy discussion | `https://images.unsplash.com/photo-1584982751601-97dcc096659c` |
| `nutrition-bariatric` | Bariatric consultation combining medical and nutrition planning | `https://images.unsplash.com/photo-1551601651-2a8555f1a136` |
| `facial-rejuvenation` | Face/neck consultation with a quiet editorial crop | `https://images.unsplash.com/photo-1542884748-2b87b36c6b90` |
| `body-contouring` | Body-contouring consultation or non-identifying silhouette | `https://images.unsplash.com/photo-1559757148-5c350d0d3c56` |
| `intimate-care` | Privacy-led consultation environment; never explicit anatomy | `https://images.unsplash.com/photo-1576091160550-2173dba999ef` |

## Semantic component naming

The Strapi technical UIDs remain unchanged so existing records and frontend
adapters remain safe. Their Content Manager display names are now semantic:

| UID | Content Manager name | Meaning |
| --- | --- | --- |
| `service-detail.editorial-section` | Clinical Education — Assessment, Planning & Recovery | Reusable clinical explanation with optional supporting image and points |
| `service-detail.specialty-section` | Procedure-Specific Clinical Module | Service-only or variant-specific content that needs a distinct visual |
| `service-detail.pricing-table` | Procedure Pricing & Assessment | Published reference pricing or an assessment-only pricing state |
| `service-detail.price-item` | Procedure Price Reference | One procedure and its currency references |
| `service-detail.faq` | Frequently Asked Questions — Service | Service-specific patient FAQ accordion |
| `service-detail.faq-item` | Patient FAQ Question | One accessible question/answer pair |
| `service-detail.consultation` | Consultation & Hospital Contact | Final contact/form/map section |
| `service-detail.content-item` | Clinical Content Point | Supporting point inside a clinical module |

The labels deliberately avoid vague names such as “common section” or
“service-specific section”. The UID is an implementation identifier; the
display name explains the editorial purpose to an administrator.

## Layout decision matrix

| Section meaning | Recommended image treatment | Why |
| --- | --- | --- |
| Hero | Full-bleed image with dark/white editorial overlay; subject on the right | Establishes the procedure while protecting readable title space |
| Understanding / overview | 50/50 editorial split, image on the right | Supports education without turning the section into an advertisement |
| Suitability / candidate assessment | 50/50 split, image on the left or right based on rhythm | Makes assessment feel personal; use consultation imagery, not result imagery |
| Surgeon-led approach | Portrait or consultation image on the side | Communicates responsibility and direct clinician involvement |
| Procedure planning | Three-step image sequence or horizontal step cards | Planning is sequential; each image should represent a stage, not a random procedure |
| Hospital-based surgery | Full-width background cover with gradient wash or controlled split | Hospital infrastructure is a trust environment and benefits from cinematic scale |
| Recovery / aftercare | Quiet side image or two/three-image timeline | Recovery is progressive and should feel calm, supervised and non-graphic |
| Specialty module | Dedicated image per module; comparison modules may use two-image cards | The image must explain the decision, e.g. implant vs fat transfer |
| Pricing | No decorative image by default; optional narrow contextual image | Pricing must remain legible and credible; avoid luxury stock photography |
| FAQ | No image or low-contrast background cover only when readability is guaranteed | Questions need attention and accessible contrast |
| International pathway | Three-step horizontal/vertical journey with one image per stage | Communicates remote consultation, travel preparation and follow-up |
| Consultation | Background cover of calm clinic/hospital reception with readable form panel | Supports conversion without competing with form fields |

## Service-by-service image order

The order below follows the exact “Page Structure” headings in each service
document. A repeated semantic slot still receives service-specific image
direction; it must not receive the same uploaded file by default.

### 1. Blepharoplasty & Eye Rejuvenation

| Order / source content | Image meaning and brief | Layout |
| --- | --- | --- |
| Hero — Blepharoplasty in Vietnam | Calm facial/eye consultation; no dramatic close-up or promised result | Full-bleed right-weighted hero |
| Understanding Blepharoplasty | Surgeon discussing eyelid anatomy or assessment | Right editorial image |
| Upper Blepharoplasty | Non-graphic upper eyelid planning; use face crop with eyes visible but no identifiable claim | Specialty image card |
| Who May Consider Upper Eyelid Surgery? | Consultation and concern discussion | Split section |
| Lower Blepharoplasty | Lower-eye assessment, ideally with medical diagram or neutral consultation | Split section |
| Under-Eye Bags Are Not Always the Same Problem | Anatomy education; distinguish skin, fat and support without patient result | Diagram/education panel |
| Eyebrow Lift | Upper-face assessment showing brow position and forehead relationship | Right image with focal point high-center |
| Upper Blepharoplasty or Eyebrow Lift? | Two-option comparison visual; two cards are preferable to one generic photo | Two-image comparison |
| Common Concerns We Address | Four quiet concern cards; avoid repeated faces | Card grid with small thumbnails |
| Dr. Maris’s Approach | Surgeon-patient conversation | Left/right editorial split |
| How Eyelid Surgery Is Planned | Sequential assessment: markings, examination, planning | Three-step image row |
| Eye Health & Medical History | Clinical eye assessment / records, not a cosmetic close-up | Right image |
| Revision or Complex Eyelid Surgery | Revision consultation with anatomy/history emphasis | Navy split with controlled image |
| Surgery at City International Hospital | Sterile operating theatre or hospital corridor | Full-width cover |
| Recovery & Aftercare | Calm postoperative review, no swelling/blood imagery | Two/three-stage timeline |
| International Travel After Eyelid Surgery | Patient coordinator / travel planning conversation | Horizontal journey card |
| Risks & Considerations | No image or restrained clinical texture | Text-first |
| Results & Realistic Expectations | Use approved composite result only if consented; otherwise no decorative image | Result component only |
| Blepharoplasty Cost / Combined Procedure Pricing | No image; table must dominate | Pricing table |
| International Patients Planning Eyelid Surgery | Remote consultation and itinerary planning | Three-step journey |
| Why International Patients Consider Dr. Maris | Surgeon-led consultation / hospital trust | Editorial split |
| FAQ | No image | Accordion |
| Final Consultation CTA | Calm clinic consultation background | Background cover CTA |

### 2. Breast Augmentation & Revision Surgery

| Order / source content | Image meaning and brief | Layout |
| --- | --- | --- |
| Hero — Breast Augmentation | Respectful torso/consultation composition; no exposed or sexualized stock imagery | Full-bleed right-weighted hero |
| Understanding Breast Augmentation | Implant planning consultation and proportion discussion | Right editorial image |
| Who May Consider Breast Augmentation? | Surgeon reviewing goals and anatomy | Split section |
| Common Breast Concerns | Three concern cards: volume, asymmetry, sagging | Image-led card grid |
| Motiva Implants | Implant selection/measurement context; do not imply a specific brand result | Specialty image + option cards |
| Augmentation vs Breast Lift | Two-option decision layout with two supporting images | Two-image comparison |
| Breast Lift — Mastopexy | Surgical planning, lift concept and skin envelope | Right image |
| Problems After Previous Augmentation | Revision consultation with implant history | Navy split |
| Symmastia Correction | Anatomy education / revision planning, not graphic surgery | Diagram or clinical illustration |
| Free Silicone Removal | Medical assessment and safe removal planning | Split image, text protected |
| Implant Removal & Capsulectomy | Surgeon reviewing implant/capsule history | Side image |
| Dr. Maris’s Approach | Direct surgeon consultation | Editorial split |
| How Breast Augmentation Is Planned | Consultation → sizing → hospital plan | Three-step image sequence |
| Revision & Complex Breast Surgery | Calm revision assessment | Navy split / background wash |
| Surgery at City International Hospital | Operating theatre and anaesthesia support | Full-width cover |
| Recovery & Aftercare | Follow-up examination and supportive recovery environment | Timeline |
| Risks & Considerations | No decorative image | Text-first |
| Results & Realistic Expectations | Approved composite result only | Results component |
| Breast Surgery Cost / Combined Pricing | No image | Pricing table |
| International Patients Travelling to Vietnam | Coordinator and travel planning | Three-step journey |
| Why Patients Choose Dr. Maris | Surgeon-led trust image | Split section |
| FAQ | No image | Accordion |
| Final Consultation CTA | Calm consultation background | Background cover CTA |

### 3. Buttock Augmentation

| Order / source content | Image meaning and brief | Layout |
| --- | --- | --- |
| Hero — BBL Fat Transfer & Implants | Body-contouring consultation; no exposed or sexualized image | Full-bleed right-weighted hero |
| Understanding Buttock Augmentation | Proportion and technique consultation | Right editorial image |
| BBL Fat Transfer | Donor-area and proportion planning | Specialty image |
| How BBL Works | Three stages: donor assessment, fat processing, placement | Three-image step sequence |
| Who May Consider a BBL? | Medical suitability and donor tissue consultation | Split section |
| Buttock Implants | Implant option discussion, non-graphic | Specialty image |
| BBL vs Buttock Implants | Two technique comparison cards | Two-image comparison |
| Common Concerns | Projection, weight-loss change, asymmetry, proportion | Four-card grid |
| Dr. Maris’s Approach | Surgeon reviewing body proportions | Editorial split |
| BBL Safety Requires Special Attention | Hospital monitoring and safety planning | Navy/full-width cover |
| How the Surgical Procedure Is Planned | Marking → anaesthesia → monitoring | Step timeline with image per stage |
| Surgery at City International Hospital | Operating theatre / anaesthesia team | Full-width cover |
| Recovery & Aftercare | Positioning, mobility and follow-up; no graphic recovery | Timeline |
| Risks & Considerations | No decorative image | Text-first |
| Results & Realistic Expectations | Consent-controlled composite results only | Results component |
| Buttock Augmentation Cost / BBL Pricing Includes | No image; financial details must remain primary | Pricing table + clarification notice |
| International Patients / Length of Stay | Travel planning and postoperative coordination | Journey section |
| Why Patients Consider Dr. Maris | Surgeon-led assessment | Split section |
| FAQ | No image | Accordion |
| Final Consultation CTA | Quiet consultation background | Background cover CTA |

### 4. Facelift & Facial Rejuvenation

| Order / source content | Image meaning and brief | Layout |
| --- | --- | --- |
| Hero — Facial Rejuvenation | Mature patient consultation or facial assessment; avoid “anti-ageing” promise | Full-bleed right-weighted hero |
| Understanding Facelift Surgery | Face/neck anatomy and consultation | Right editorial image |
| Who May Consider Facelift Surgery? | Assessment discussion | Split section |
| Common Concerns | Jowls, skin laxity, neck and brow descent | Four concern cards with restrained imagery |
| Mini Facelift | Focused facial planning | Specialty image |
| Mini Facelift vs Full Facelift | Technique comparison; two-image layout | Comparison |
| Neck Lift Surgery | Neck contour assessment | Right image |
| Facelift and Neck Lift: Do I Need Both? | Face/neck decision planning | Two-panel comparison |
| Forehead / Brow Lift | Upper-face examination | Right image |
| Dr. Maris’s Approach | Surgeon consultation | Editorial split |
| How Facelift Surgery Is Planned | Incision, tissue, neck, brow and asymmetry planning | Multi-step visual sequence |
| No Single Technique for Everyone | Editorial anatomy image or subtle diagram | Background/split |
| Revision or Complex Facial Surgery | Revision assessment | Navy split |
| Surgery at City International Hospital | Theatre/hospital infrastructure | Full-width cover |
| Recovery & Aftercare | Follow-up examination and gradual recovery | Timeline |
| International Travel After Facial Surgery | Coordinator and post-op planning | Journey |
| Risks & Considerations | No decorative image | Text-first |
| Results & Realistic Expectations | Approved composite image only | Results component |
| Facelift Cost / Full Facelift Pricing | No image | Pricing table + clarification |
| International Patients / Why Patients Consider Dr. Maris | Surgeon-led planning | Split/journey |
| FAQ | No image | Accordion |
| Final Consultation CTA | Calm consultation image | Background cover CTA |

### 5. Gastric Sleeve Surgery

This page is a bariatric medical pathway, not a cosmetic surgery sales page.
Images must reinforce medical assessment, nutrition and long-term care.

| Order / source content | Image meaning and brief | Layout |
| --- | --- | --- |
| Hero — Gastric Sleeve Surgery | Bariatric consultation with space for safety message | Full-bleed right-weighted hero |
| Understanding Gastric Sleeve | Non-graphic medical consultation / anatomy education | Right editorial image |
| Metabolic & Bariatric Surgery | Multidisciplinary medical team | Full-width or split |
| Who May Consider Bariatric Surgery? | Eligibility assessment and records review | Split |
| Obesity-Related Health Conditions | Clinician reviewing health markers; never stigmatizing | Side image |
| Not Liposuction or Body Contouring | Two-path comparison: metabolic care vs contouring | Two-panel comparison |
| How Sleeve Gastrectomy Is Performed | Non-graphic laparoscopic pathway / medical diagram | Step visual |
| Why Preoperative Assessment Matters | Testing, history and multidisciplinary planning | Editorial split |
| Acid Reflux | Consultation focused on gastrointestinal history | Side image |
| Risks & Considerations | No decorative image | Text-first |
| Long-Term Follow-Up | Nutrition and clinical follow-up | Timeline with one image per stage |
| Weight Loss & Realistic Expectations | Nutrition/behavior support; no “after” body promise | Editorial split |
| Recovery After Surgery | Hospital recovery and diet progression | Full-width/split |
| International Patients / Length of Stay | Medical travel coordination | Journey |
| Cosmetic Surgery After Major Weight Loss | Separate body-contouring consultation | Split with clear separation |
| Pricing Status | No image; assessment-only state | Pricing status panel |
| FAQ | No image | Accordion |
| Final Assessment CTA | Bariatric consultation background | Background cover CTA |

### 6. Labiaplasty & Intimate Cosmetic Surgery

Use privacy-led, non-explicit imagery. Never use exposed anatomy or identifiable
patient imagery as decoration.

| Order / source content | Image meaning and brief | Layout |
| --- | --- | --- |
| Hero — Intimate Cosmetic Surgery | Private consultation environment | Full-bleed with soft overlay |
| Understanding Intimate Cosmetic Surgery | Doctor-patient conversation in private room | Right editorial image |
| Natural Anatomical Variation | Abstract medical education or neutral clinician discussion | Illustration/side image |
| Labiaplasty — External Contouring | Consultation and planning; no explicit anatomy | Split |
| Who May Consider Labiaplasty? | Private assessment | Split |
| What Labiaplasty Does / Does Not Do | Clear educational comparison | Two-column text-first |
| Vaginal Tightening — Vaginoplasty | Private consultation; avoid explicit visual | Specialty image |
| Labiaplasty vs Vaginal Tightening | Two-option comparison with abstract/clinical visuals | Comparison |
| Combined Labiaplasty & Vaginoplasty | Staged planning discussion | Step/decision layout |
| Dr. Maris’s Approach | Privacy, consent and realistic planning | Editorial split |
| Labiaplasty Procedure / Vaginoplasty Planning | Non-graphic clinical pathway | Step timeline |
| Why Assessment Matters / Previous Surgery | Confidential revision consultation | Navy split |
| Surgery at City International Hospital | Hospital environment, no operative exposure | Full-width cover |
| Recovery & Privacy During Recovery | Quiet private follow-up environment | Timeline |
| Risks & Considerations | No decorative image | Text-first |
| Results & Realistic Expectations | Only consented, anonymized composite media | Results component |
| Pricing / Combined Pricing | No image | Pricing table |
| International Patients / Length of Stay | Confidential coordinator planning | Journey |
| Why Patients Consider Dr. Maris | Private surgeon consultation | Split |
| FAQ | No image | Accordion |
| Final Consultation CTA | Private consultation room | Background cover CTA |

### 7. Liposuction & Body Contouring

| Order / source content | Image meaning and brief | Layout |
| --- | --- | --- |
| Hero — Liposuction & Body Contouring | Body-contouring consultation with non-identifying crop | Full-bleed right-weighted hero |
| Understanding Liposuction | Surgeon discussing contour and skin quality | Right editorial image |
| Body Areas We Address | Five-area visual index: abdomen, arms, thighs, back, chin | Multi-card image grid |
| 360° Abdomen Liposuction | Torso contour planning, non-sexualized | Specialty image |
| 360° Liposuction or Tummy Tuck? | Fat vs excess skin comparison | Two-image comparison |
| Arm / Thigh Liposuction & Lift | Procedure choice comparison | Two-card layout |
| Back Liposuction | Back/torso consultation, non-identifying crop | Split |
| Double Chin Liposuction | Facial/neck profile assessment | Right image |
| Who May Consider Liposuction? | Suitability and skin elasticity discussion | Split |
| Dr. Maris’s Approach | Body proportion assessment | Editorial split |
| How Liposuction Is Performed | Marking → contouring → recovery planning | Step sequence |
| Surgery at City International Hospital | Theatre/hospital infrastructure | Full-width cover |
| Recovery & Postoperative Care | Compression, mobility and follow-up | Timeline |
| Risks & Considerations | No decorative image | Text-first |
| Results & Realistic Expectations | Consent-controlled composite results | Results component |
| Cost / Combined Procedure Pricing | No image | Pricing table |
| International Patients / Why Patients Consider Dr. Maris | Travel and surgeon-led planning | Journey/split |
| FAQ | No image | Accordion |
| Final Consultation CTA | Calm clinical consultation image | Background cover CTA |

## Implementation decisions

1. `editorial-section.image` is used for one editorial image on the side. The
   frontend should choose left/right placement from semantic section key, not
   from service slug.
2. `specialty-section.image` is reserved for a procedure-specific visual. A
   comparison or staged module should be upgraded to a repeatable media list
   when one image cannot explain the decision.
3. Planning and journey sections should use a repeatable `step_image` field in
   the next schema revision. Until then, do not fake a multi-step visual by
   reusing one image.
4. Hospital sections should use a cover image only when a contrast wash keeps
   the content accessible. Otherwise use a split image.
5. Pricing, FAQ and legal/risk sections remain text-first by default.
6. Results imagery is separate from service editorial imagery and must use the
   composite one-image result model.

## Recommended next schema revision

The current `editorial-section` and `specialty-section` support only one image.
For full source parity, add a reusable `service-detail.section-media` component:

```text
media_role: hero | assessment | process-step | comparison | hospital | recovery
image: media upload
image_alt: string
caption: string
focal_point: left | center | right
display_mode: split | cover | card | timeline
step_number: string (optional)
```

This allows the Content Manager to order several contextual images without
creating vague “gallery” fields or hardcoding image positions in JSX.

## Acceptance checklist

- [ ] Every service has a distinct hero image selected for its procedure.
- [ ] Repeated `doctor-updated.png` assignments are removed from contextual
  sections.
- [ ] Specialty modules have service-appropriate imagery.
- [ ] No graphic, explicit or unconsented patient image is used.
- [ ] Pricing and FAQ remain readable without decorative media.
- [ ] Mobile crops preserve the clinical subject and text contrast.
- [ ] Alt text describes the clinical context, not a guaranteed result.
- [ ] Results continue to use the separate composite-results data model.
