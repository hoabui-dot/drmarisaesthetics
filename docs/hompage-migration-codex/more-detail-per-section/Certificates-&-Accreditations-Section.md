# UI Implementation Spec — Homepage Certificates & Accreditations Section

## 1. Identity

| Field                       | Value                                                                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | `/`                                                                                                                                                                     |
| Section ID                  | `home-certificates`                                                                                                                                                     |
| Section name                | `Homepage Certificates & Accreditations`                                                                                                                                |
| Position in page            | Immediately after `home-doctors`                                                                                                                                        |
| Screenshot scope            | Complete desktop certificates/accreditations section visible in supplied screenshot                                                                                     |
| Section type                | CMS-driven certificate bundle list                                                                                                                                      |
| Minimum certificate bundles | **1**                                                                                                                                                                   |
| Maximum certificate bundles | **4**                                                                                                                                                                   |
| Primary implementation goal | Reproduce the desktop certificate composition while ensuring each left-side accreditation summary and right-side framed certificate remain bound to the same CMS record |
| Overall evidence quality    | High for desktop composition and pairing rule; Medium for exact typography and spacing; Low for responsive behavior                                                     |

> **Critical CMS rule:** Each accreditation displayed on the left and its corresponding framed certificate displayed on the right belong to **one single certificate bundle/record**.

> Do **not** model the left accreditation icon/text and right certificate image as two unrelated collections.

> **Data constraint:** Minimum **1 bundle**, maximum **4 bundles**.

---

## 2. Scope Boundary

### Included in this spec

* OBSERVED — Section eyebrow:

  * `CERTIFICATES & ACCREDITATIONS`
* OBSERVED — Main heading:

  * `Certified. Recognized. Trusted.`
* OBSERVED — Left-side accreditation summary area.
* OBSERVED — Four accreditation entries visible:

  1. ADA
  2. ISO
  3. ICOI
  4. AAO
* OBSERVED — Each left-side accreditation item contains:

  * organization/logo icon,
  * short accreditation description.
* OBSERVED — Four large framed certificates on the right.
* USER-SPECIFIED — Left accreditation item and right certificate image form **one logical bundle**.
* USER-SPECIFIED — Minimum `1` bundle.
* USER-SPECIFIED — Maximum `4` bundles.
* INFERRED — Bundle order should be managed through Strapi and preserved by the frontend.
* INFERRED — The nth summary item on the left corresponds to the nth framed certificate on the right.
* INFERRED — When fewer than four bundles exist, the frontend must render only the actual entries and keep both sides synchronized.

### Excluded from this spec

* UNKNOWN — Certificate click/zoom behavior.
* UNKNOWN — Lightbox behavior.
* UNKNOWN — Certificate detail page.
* UNKNOWN — external accreditation links.
* UNKNOWN — hover effects.
* UNKNOWN — animation.
* UNKNOWN — tablet layout.
* UNKNOWN — mobile layout.
* UNKNOWN — whether certificate images need downloadable originals.
* UNKNOWN — whether expiration dates or issue dates exist in CMS.

---

## 3. Evidence and Confidence

| Item                             | Status         | Evidence / reason                                              |
| -------------------------------- | -------------- | -------------------------------------------------------------- |
| Main section layout              | OBSERVED       | Clear left text/summary area and right framed-certificate area |
| Four visible certificate bundles | OBSERVED       | Four summary items + four certificates                         |
| Summary ↔ certificate pairing    | USER-SPECIFIED | Explicit requirement                                           |
| Minimum 1                        | USER-SPECIFIED | Explicit requirement                                           |
| Maximum 4                        | USER-SPECIFIED | Explicit requirement                                           |
| Ordered relationship             | INFERRED       | Required to preserve correct mapping                           |
| Typography exact values          | INFERRED       | Visual hierarchy visible, exact design tokens unavailable      |
| Certificate frame appearance     | OBSERVED       | Gold frame around each certificate                             |
| Click/lightbox                   | UNKNOWN        | No interaction evidence                                        |
| Responsive behavior              | UNKNOWN        | Only desktop screenshot supplied                               |

---

# 4. OCR Content Inventory

## 4.1 Section-level content

| Element ID             | Visible text                      | Type    | Confidence |
| ---------------------- | --------------------------------- | ------- | ---------- |
| `certificates-eyebrow` | `CERTIFICATES & ACCREDITATIONS`   | Eyebrow | High       |
| `certificates-heading` | `Certified. Recognized. Trusted.` | H2      | High       |

---

## 4.2 Bundle 01 — ADA

### Left summary

| Element ID               | Visible text                  | Type                | Confidence |
| ------------------------ | ----------------------------- | ------------------- | ---------- |
| `certificate-01-logo`    | `ADA`                         | Organization/logo   | High       |
| `certificate-01-summary` | `American Dental Association` | Accreditation label | High       |

### Right certificate

Visible text inside certificate includes:

* `ADA`
* `American Dental Association`
* `Member`

OBSERVED — Additional small text/seal details are present but not reliably readable from screenshot.

---

## 4.3 Bundle 02 — ISO

### Left summary

| Element ID               | Visible text                                 | Type                | Confidence |
| ------------------------ | -------------------------------------------- | ------------------- | ---------- |
| `certificate-02-logo`    | `ISO`                                        | Organization/logo   | High       |
| `certificate-02-summary` | `ISO 9001 Certification for Standardization` | Accreditation label | Medium     |

### Right certificate

Visible content:

* `ISO 9001:2015`
* `Quality Management`
* `Certified`

OBSERVED — Gold accreditation seal appears in lower part of certificate.

---

## 4.4 Bundle 03 — ICOI

### Left summary

| Element ID               | Visible text                                     | Type                | Confidence |
| ------------------------ | ------------------------------------------------ | ------------------- | ---------- |
| `certificate-03-logo`    | `ICOI`                                           | Organization/logo   | High       |
| `certificate-03-summary` | `International Congress of Oral Implantologists` | Accreditation label | High       |

### Right certificate

Visible content:

* `ICOI`
* `International Congress of Oral Implantologists`
* `Fellow`

---

## 4.5 Bundle 04 — AAO

### Left summary

| Element ID               | Visible text                            | Type                | Confidence |
| ------------------------ | --------------------------------------- | ------------------- | ---------- |
| `certificate-04-logo`    | `AAO`                                   | Organization/logo   | High       |
| `certificate-04-summary` | `American Association of Orthodontists` | Accreditation label | High       |

### Right certificate

Visible content:

* `AAO`
* `American Association of Orthodontists`
* `Member`

---

# 5. Layout Anatomy

## 5.1 Global geometry

| Property                       | Specification                                 | Status         |
| ------------------------------ | --------------------------------------------- | -------------- |
| Section width                  | Full viewport with centered content container | OBSERVED       |
| Section background             | White / near-white                            | OBSERVED       |
| Primary layout                 | Two major horizontal regions                  | OBSERVED       |
| Left region                    | Heading + compact accreditation summaries     | OBSERVED       |
| Right region                   | Large framed certificates                     | OBSERVED       |
| Maximum bundles                | `4`                                           | USER-SPECIFIED |
| Minimum bundles                | `1`                                           | USER-SPECIFIED |
| Right certificate row          | Horizontal on full desktop                    | OBSERVED       |
| Left accreditation summary row | Horizontal below heading                      | OBSERVED       |

---

## 5.2 Structure tree

```text
Section: home-certificates
├── LeftColumn
│   ├── Eyebrow
│   ├── H2
│   └── AccreditationSummaryList
│       ├── AccreditationSummary 01
│       │   ├── Logo/Icon
│       │   └── Label
│       ├── AccreditationSummary 02
│       ├── AccreditationSummary 03
│       └── AccreditationSummary 04
│
└── CertificateGallery
    ├── CertificateImage 01
    ├── CertificateImage 02
    ├── CertificateImage 03
    └── CertificateImage 04
```

---

# 5.3 Critical pairing model

The visual layout separates the summary and certificate spatially, but the CMS/data model must keep them together.

Correct conceptual structure:

```text
CertificateBundle 01
├── summaryLogo
├── summaryLabel
└── certificateImage

CertificateBundle 02
├── summaryLogo
├── summaryLabel
└── certificateImage

CertificateBundle 03
├── summaryLogo
├── summaryLabel
└── certificateImage

CertificateBundle 04
├── summaryLogo
├── summaryLabel
└── certificateImage
```

Frontend then renders them in two visual zones:

```text
LEFT SUMMARY ZONE

[Bundle1.summary] [Bundle2.summary] [Bundle3.summary] [Bundle4.summary]


RIGHT CERTIFICATE ZONE

[Bundle1.certificate] [Bundle2.certificate] [Bundle3.certificate] [Bundle4.certificate]
```

The order must remain identical.

---

# 5.4 Desktop topology

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│ CERTIFICATES & ACCREDITATIONS                                                │
│ Certified. Recognized. Trusted.                                              │
│                                                                              │
│ ADA      ISO      ICOI      AAO       ┌────────┐ ┌────────┐ ┌────────┐ ┌────┐│
│ label    label    label     label     │ CERT 1 │ │ CERT 2 │ │ CERT 3 │ │C 4 ││
│                                        │        │ │        │ │        │ │    ││
│                                        │        │ │        │ │        │ │    ││
│                                        │        │ │        │ │        │ │    ││
│                                        └────────┘ └────────┘ └────────┘ └────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

OBSERVED — Left region occupies significantly less width than the right certificate gallery.

INFERRED — Approximate high-level split:

* left: `~30–33%`
* right: `~65–68%`

Exact values require Figma measurement.

---

# 5.5 Left-side heading block

## Eyebrow

* Uppercase.
* Bright blue.
* Small/medium visual weight.
* Left aligned.

## Main heading

```text
Certified. Recognized. Trusted.
```

* Dark navy.
* Large compared with accreditation labels.
* One line in supplied desktop screenshot.

---

# 5.6 Accreditation summary list

The left summary area contains one compact item per certificate bundle.

Reference:

```text
┌────────┬────────┬────────┬────────┐
│  ADA   │  ISO   │ ICOI   │  AAO   │
│        │        │        │        │
│ label  │ label  │ label  │ label  │
│ label  │ label  │ label  │ label  │
└────────┴────────┴────────┴────────┘
```

### Each item

| Property    | Specification                           | Status   |
| ----------- | --------------------------------------- | -------- |
| Alignment   | Center                                  | OBSERVED |
| Logo/icon   | Top                                     | OBSERVED |
| Description | Below logo                              | OBSERVED |
| Width       | Equal or near-equal among visible items | OBSERVED |
| Surface     | No independent card surface visible     | OBSERVED |
| Border      | None visible                            | OBSERVED |

Do not add independent white cards around summary items.

---

# 5.7 Certificate gallery

The right side contains large portrait-oriented certificate images.

### Geometry

| Property           | Specification                         | Status   |
| ------------------ | ------------------------------------- | -------- |
| Number visible     | 4                                     | OBSERVED |
| Orientation        | Portrait                              | OBSERVED |
| Width              | Equal                                 | OBSERVED |
| Height             | Equal / near-equal                    | OBSERVED |
| Gap                | Consistent horizontal spacing         | OBSERVED |
| Frame              | Gold frame                            | OBSERVED |
| Content background | White / off-white                     | OBSERVED |
| Image fit          | Contain / preserve entire certificate | INFERRED |

### Important image rule

Use `contain`-style treatment.

Do not use aggressive `cover` cropping because:

* border/frame must remain visible,
* organization logo must remain visible,
* accreditation seal must remain visible,
* full certificate document is part of the intended visual.

---

# 6. Dynamic Bundle Count Rules

## 6.1 Allowed count

```text
MIN = 1
MAX = 4
```

Recommended CMS validation:

```text
1 <= certificates.length <= 4
```

---

# 6.2 Bundle count = 4

Reference state:

```text
LEFT
[ADA] [ISO] [ICOI] [AAO]

RIGHT
[CERT 1] [CERT 2] [CERT 3] [CERT 4]
```

This directly matches the supplied screenshot.

---

# 6.3 Bundle count = 3

Required data relationship:

```text
LEFT
[Bundle 1] [Bundle 2] [Bundle 3]

RIGHT
[Certificate 1] [Certificate 2] [Certificate 3]
```

Do not render a fourth empty summary or certificate placeholder.

INFERRED recommended desktop behavior:

* keep certificate dimensions close to reference,
* center or balance the available certificate group rather than stretching all three excessively.

---

# 6.4 Bundle count = 2

```text
LEFT
[Bundle 1] [Bundle 2]

RIGHT
[Certificate 1] [Certificate 2]
```

The two sides must still represent the exact same two records.

---

# 6.5 Bundle count = 1

```text
LEFT
[Bundle 1]

RIGHT
[Certificate 1]
```

With one bundle:

* do not create four placeholder slots,
* do not duplicate the certificate,
* keep the certificate at a controlled maximum width,
* preserve clear spatial relationship between summary and full certificate.

Exact single-item desktop alignment is INFERRED and should be confirmed by Designer if pixel-perfect behavior is required.

---

# 6.6 Pair integrity rule

For all item counts:

```text
summary[i]
must correspond to
certificate[i]
```

Example:

```text
ADA summary
      ↓
ADA certificate

ISO summary
      ↓
ISO certificate
```

Incorrect:

```text
ADA summary → ISO certificate
ISO summary → ICOI certificate
```

Frontend must never independently sort the two visual groups.

---

# 7. Visual Specification

## 7.1 Colors

| Token candidate                        | Usage                 | Description        | Status   |
| -------------------------------------- | --------------------- | ------------------ | -------- |
| `color/certificate-section/background` | Section               | White / near-white | OBSERVED |
| `color/certificate/heading`            | H2                    | Dark navy          | OBSERVED |
| `color/certificate/eyebrow`            | Eyebrow               | Bright blue        | OBSERVED |
| `color/certificate/summary-text`       | Accreditation summary | Gray/navy          | OBSERVED |
| `color/certificate/frame`              | Frame                 | Gold               | OBSERVED |
| `color/certificate/document`           | Document surface      | White / ivory      | OBSERVED |

---

## 7.2 Typography

| Element                   | Weight              | Size                 | Alignment | Status        |
| ------------------------- | ------------------- | -------------------- | --------- | ------------- |
| Eyebrow                   | `600–700 estimated` | `11–13 px estimated` | Left      | INFERRED      |
| H2                        | `600–700 estimated` | `27–32 px estimated` | Left      | INFERRED      |
| Accreditation summary     | `400–500 estimated` | `11–13 px estimated` | Center    | INFERRED      |
| Certificate internal text | Asset content       | N/A                  | N/A       | Part of image |

Do not recreate certificate document typography in HTML unless the design source proves certificates are generated dynamically.

---

# 8. Asset Manifest

| Asset ID                 | Description             | Recommended format | CMS? | Status   |
| ------------------------ | ----------------------- | ------------------ | ---: | -------- |
| `certificate-ada-logo`   | ADA logo/icon           | SVG/PNG/WebP       |  Yes | OBSERVED |
| `certificate-ada-image`  | Framed ADA certificate  | PNG/WebP/JPG       |  Yes | OBSERVED |
| `certificate-iso-logo`   | ISO logo/icon           | SVG/PNG/WebP       |  Yes | OBSERVED |
| `certificate-iso-image`  | Framed ISO certificate  | PNG/WebP/JPG       |  Yes | OBSERVED |
| `certificate-icoi-logo`  | ICOI logo/icon          | SVG/PNG/WebP       |  Yes | OBSERVED |
| `certificate-icoi-image` | Framed ICOI certificate | PNG/WebP/JPG       |  Yes | OBSERVED |
| `certificate-aao-logo`   | AAO logo/icon           | SVG/PNG/WebP       |  Yes | OBSERVED |
| `certificate-aao-image`  | Framed AAO certificate  | PNG/WebP/JPG       |  Yes | OBSERVED |

### Asset handling rules

Each bundle requires at least:

```text
summaryLogo
certificateImage
```

Recommended:

```text
certificateBundle
├── summaryLogo
├── title/shortLabel
├── certificateImage
└── certificateAlt
```

Do not:

* combine all four certificates into one banner image,
* combine all four left logos into one image,
* upload summary/logo separately from its matching certificate in unrelated CMS collections.

---

# 9. Component Contract

## 9.1 Recommended component boundaries

| Component                   | Responsibility                   | Reusable?   | Status   |
| --------------------------- | -------------------------------- | ----------- | -------- |
| `HomeCertificatesSection`   | Section orchestration            | No          | INFERRED |
| `CertificateSectionHeading` | Eyebrow + heading                | Potentially | INFERRED |
| `AccreditationSummaryList`  | Left-side summary rendering      | Yes         | INFERRED |
| `AccreditationSummaryItem`  | Logo + label                     | Yes         | OBSERVED |
| `CertificateGallery`        | Right-side certificate rendering | Yes         | INFERRED |
| `CertificateImageCard`      | Single certificate image         | Yes         | OBSERVED |

The two display lists must receive the **same ordered bundle array**.

---

# 10. Strapi CMS Contract

## 10.1 Recommended section structure

```text
Homepage
└── Certificates Section
    ├── eyebrow
    ├── heading
    └── certificates[]
        ├── organizationLogo
        ├── organizationName
        ├── summary
        ├── certificateImage
        └── certificateAlt
```

---

## 10.2 Certificate bundle component

Recommended component name:

```text
certificate-bundle
```

Fields:

| Field              | Type       |    Required | Notes                                       |
| ------------------ | ---------- | ----------: | ------------------------------------------- |
| `organizationLogo` | Media      |         Yes | Left-side logo/icon                         |
| `organizationName` | Short text |         Yes | ADA / ISO / ICOI / AAO                      |
| `summary`          | Short text |         Yes | Left-side explanatory copy                  |
| `certificateImage` | Media      |         Yes | Full framed certificate                     |
| `certificateAlt`   | Short text | Recommended | Accessibility                               |
| `sortOrder`        | Integer    |    Optional | Only if component ordering is not persisted |
| `link`             | Link       |    Optional | No interaction evidence yet                 |

---

# 10.3 Required Strapi validation

For the repeatable `certificates` component:

```text
min: 1
max: 4
```

The CMS must prevent:

```text
0 certificate bundles
```

and:

```text
5+ certificate bundles
```

for this homepage component.

---

# 10.4 Why a single bundle is mandatory

Incorrect CMS model:

```text
logos[]
certificates[]
```

Problem:

```text
logos = [ADA, ISO, ICOI, AAO]
certificates = [ISO cert, ADA cert, AAO cert, ICOI cert]
```

There is no guaranteed pairing.

Correct:

```text
bundles[]
├── ADA
│   ├── logo
│   └── certificate
│
├── ISO
│   ├── logo
│   └── certificate
│
├── ICOI
│   ├── logo
│   └── certificate
│
└── AAO
    ├── logo
    └── certificate
```

This is mandatory for data integrity.

---

# 10.5 Recommended initial CMS records

### Bundle 01

```text
organizationName:
ADA

summary:
American Dental Association

organizationLogo:
ADA logo asset

certificateImage:
ADA certificate asset
```

### Bundle 02

```text
organizationName:
ISO

summary:
ISO 9001 Certification for Standardization

organizationLogo:
ISO logo asset

certificateImage:
ISO certificate asset
```

### Bundle 03

```text
organizationName:
ICOI

summary:
International Congress of Oral Implantologists

organizationLogo:
ICOI logo asset

certificateImage:
ICOI certificate asset
```

### Bundle 04

```text
organizationName:
AAO

summary:
American Association of Orthodontists

organizationLogo:
AAO logo asset

certificateImage:
AAO certificate asset
```

Exact production copy should be verified against Figma/Strapi source.

---

# 11. Layout/Data Rendering Contract

The frontend receives:

```text
certificates[]
```

One iteration should produce logically:

```text
Bundle
├── leftSummaryRepresentation
└── rightCertificateRepresentation
```

Even if the DOM groups left summaries and right certificates separately for layout, they must originate from the same array.

Conceptually:

```text
const bundles = certificates
```

Render:

```text
Left:
bundles.map(bundle => summary)

Right:
bundles.map(bundle => certificate)
```

Do **not** load or sort them independently.

---

# 11.1 Count = 4

```text
LEFT SUMMARY
[1] [2] [3] [4]

RIGHT CERTIFICATES
[1] [2] [3] [4]
```

---

# 11.2 Count = 3

```text
LEFT SUMMARY
   [1] [2] [3]

RIGHT CERTIFICATES
   [1] [2] [3]
```

INFERRED — Both groups should visually remain balanced in their available regions.

---

# 11.3 Count = 2

```text
LEFT SUMMARY
      [1] [2]

RIGHT CERTIFICATES
      [1] [2]
```

---

# 11.4 Count = 1

```text
LEFT SUMMARY
        [1]

RIGHT CERTIFICATE
        [1]
```

Do not make one certificate span the entire right half vertically/horizontally unless design explicitly requires it.

---

# 12. Interaction States

| Element               | Default | Hover   | Click   | Status   |
| --------------------- | ------- | ------- | ------- | -------- |
| Accreditation summary | Static  | UNKNOWN | UNKNOWN | OBSERVED |
| Certificate image     | Static  | UNKNOWN | UNKNOWN | OBSERVED |
| Certificate frame     | Static  | UNKNOWN | UNKNOWN | OBSERVED |

### Constraints

Do not automatically introduce:

* lightbox,
* zoom,
* download button,
* external organization link,
* hover elevation,
* 3D frame tilt,
* carousel.

These are unsupported by the supplied screenshot.

---

# 13. Responsive Specification

## 13.1 Evidence

| Viewport | Evidence |
| -------- | -------- |
| Desktop  | High     |
| Tablet   | UNKNOWN  |
| Mobile   | UNKNOWN  |

---

## 13.2 Desktop requirements

* Maintain heading and accreditation summary area on the left.
* Maintain certificate gallery on the right.
* Maximum four bundles.
* Keep certificate documents portrait-oriented.
* Preserve complete gold frames.
* Keep summary/certificate order synchronized.

---

## 13.3 Responsive CMS rule

Do not create:

```text
desktopCertificates
mobileCertificates
```

The same bundles should be rendered responsively.

Frontend owns layout adaptation.

---

## 13.4 Possible mobile architecture — requires approval

Possible structure:

```text
Bundle 1
├── Logo
├── Summary
└── Certificate

Bundle 2
├── Logo
├── Summary
└── Certificate
```

This paired vertical arrangement is structurally robust on mobile because it keeps the relationship obvious.

However, no mobile screenshot exists, therefore this remains `INFERRED` and requires design approval.

Do not independently render all logos first and all certificates much later on narrow screens if that makes correspondence unclear.

---

# 14. Semantic HTML and Accessibility

## Recommended structure

* Section associated with H2.
* Accreditation summary collection may use a semantic list.
* Certificate gallery may use figures or image groups as appropriate.
* Organization names should remain text.
* Certificate image requires meaningful alt text if informative.

### Recommended certificate alt concept

Examples:

```text
American Dental Association membership certificate
```

```text
ISO 9001:2015 Quality Management certificate
```

Do not use generic alt text such as:

```text
certificate image
```

when meaningful context is available.

### Accessibility constraints

* Do not rely only on organization logos to communicate names.
* Keep organization name/summary as accessible text.
* If certificate image contains text already represented nearby, alt should summarize purpose rather than transcribe the full certificate.
* No interaction semantics unless certificate is actually interactive.

---

# 15. Implementation Constraints

## Data

* Minimum one certificate bundle.
* Maximum four certificate bundles.
* Every bundle contains both:

  * left summary content,
  * right certificate image.
* Preserve CMS order.
* Never independently sort summaries and certificate images.
* No placeholders for missing records.
* No duplicated certificate bundles.

## Layout

* Desktop with four bundles matches supplied composition.
* Left area uses compact summary items.
* Right area uses large certificate images.
* Certificate images remain equal/near-equal in size for same layout.
* Preserve gold frame completely.
* Do not crop frame edges.
* Do not turn summary items into card surfaces without evidence.

## CMS

* Use one repeatable component/collection:

  * `certificates[]`.
* Do not create separate:

  * `certificateIcons[]`
  * `certificateImages[]`.
* Enforce min `1`.
* Enforce max `4`.
* CMS controls content/assets/order.
* Frontend controls geometry.

---

# 16. Visual Acceptance Criteria

## Section

* [ ] Section appears after Doctor Team.
* [ ] Background remains white/near-white.
* [ ] Eyebrow reads `CERTIFICATES & ACCREDITATIONS`.
* [ ] H2 reads `Certified. Recognized. Trusted.`.
* [ ] Heading region matches left-side screenshot composition.

## Left accreditation summaries

* [ ] One summary item renders for every configured bundle.
* [ ] Organization logo appears above summary.
* [ ] Summary text is centered.
* [ ] No independent card border is added.
* [ ] Bundle order matches CMS order.

## Right certificates

* [ ] One certificate image renders for every configured bundle.
* [ ] Certificate order matches the corresponding summary order.
* [ ] Certificate frame remains fully visible.
* [ ] Images use consistent dimensions.
* [ ] No aggressive image crop occurs.
* [ ] Gold frame color/appearance matches source asset.

## Data constraints

* [ ] One bundle is valid.
* [ ] Two bundles are valid.
* [ ] Three bundles are valid.
* [ ] Four bundles are valid.
* [ ] Zero bundles are rejected.
* [ ] Five or more bundles are rejected.
* [ ] Missing entries do not produce placeholders.
* [ ] Existing entries are never duplicated.

## Pairing

* [ ] Summary 1 corresponds to certificate 1.
* [ ] Summary 2 corresponds to certificate 2.
* [ ] Summary 3 corresponds to certificate 3.
* [ ] Summary 4 corresponds to certificate 4.
* [ ] Editor reordering a bundle moves both summary and certificate together.
* [ ] Changing one certificate image does not affect another organization's summary.

---

# 17. Visual Risks

| Risk                                            | Why it affects fidelity/data integrity     | Mitigation                                 | Priority |
| ----------------------------------------------- | ------------------------------------------ | ------------------------------------------ | -------- |
| Separate logo/certificate arrays                | Pairing can break                          | Single bundle component                    | High     |
| Independently sorting two visual groups         | ADA could display with wrong certificate   | Render both from same ordered list         | High     |
| More than four records                          | Desktop composition breaks                 | CMS max validation = 4                     | High     |
| Zero records                                    | Empty section renders                      | CMS min validation = 1                     | High     |
| Cropping certificate with `cover`               | Frame/certificate details disappear        | Use contain/preserved ratio                | High     |
| Flattening all certificates into one image      | CMS cannot manage individual items         | Separate media per bundle                  | High     |
| Placeholder cards                               | Creates misleading certification           | Render only actual records                 | High     |
| Duplicating certificate to fill space           | False accreditation presentation           | Never duplicate                            | High     |
| Turning summaries into styled cards             | Diverges from screenshot                   | Preserve lightweight summary layout        | Medium   |
| Arbitrary mobile separation of logo/certificate | Pairing becomes unclear                    | Keep bundle relationship visually clear    | High     |
| Incorrect organization copy                     | Certification claims are sensitive content | Source exact copy from approved CMS/design | High     |
| Lightbox invented without design                | Unsupported behavior                       | Keep static until confirmed                | Medium   |

---

# 18. Open Questions

| ID  | Question                                                                                                       | Blocking level                                                            | Suggested owner |
| --- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------- |
| Q1  | Should certificate images be clickable?                                                                        | Non-blocking                                                              | Product         |
| Q2  | If clicked, should they open a lightbox, full-size image, PDF or external verification page?                   | Blocking only if interaction required                                     | Product         |
| Q3  | Are the gold frames part of each uploaded certificate asset or should frontend render the frame?               | Blocking for exact fidelity                                               | Designer        |
| Q4  | Is the left-side logo uploaded separately from the certificate or derived from a shared accreditation record?  | Architecture decision                                                     | Developer       |
| Q5  | Are certificate organization names and descriptions editor-editable?                                           | Non-blocking                                                              | Product         |
| Q6  | Should certificates have dates, expiry dates or verification URLs in Strapi even if not shown in this section? | Data-model decision                                                       | Product         |
| Q7  | How should 1–3 bundles align on full desktop?                                                                  | Non-blocking for data model; blocking for pixel-perfect incomplete states | Designer        |
| Q8  | What is the approved tablet layout?                                                                            | Blocking for tablet                                                       | Designer        |
| Q9  | What is the approved mobile layout?                                                                            | Blocking for mobile                                                       | Designer        |
| Q10 | Should mobile pair each summary directly with its certificate?                                                 | Recommended but requires approval                                         | Designer        |

---

# Strapi Handoff Summary

## Required model

```text
Homepage
└── Certificates Section
    ├── eyebrow
    ├── heading
    │
    └── certificates[]
        ├── organizationLogo
        ├── organizationName
        ├── summary
        ├── certificateImage
        └── certificateAlt
```

Validation:

```text
certificates.min = 1
certificates.max = 4
```

---

# Pairing Contract

Each item is atomic:

```text
CertificateBundle
│
├── LEFT representation
│   ├── organizationLogo
│   └── summary
│
└── RIGHT representation
    └── certificateImage
```

Do **not** model it as:

```text
LEFT:
logos[]

RIGHT:
certificates[]
```

because the two arrays can become mismatched.

---

# Example Data-to-UI Mapping

```text
certificates[0]
├── ADA logo
├── American Dental Association
└── ADA certificate

certificates[1]
├── ISO logo
├── ISO certification summary
└── ISO certificate

certificates[2]
├── ICOI logo
├── International Congress of Oral Implantologists
└── ICOI certificate

certificates[3]
├── AAO logo
├── American Association of Orthodontists
└── AAO certificate
```

Visual rendering:

```text
LEFT SIDE
┌──────┬──────┬──────┬──────┐
│ ADA  │ ISO  │ ICOI │ AAO  │
│ text │ text │ text │ text │
└──────┴──────┴──────┴──────┘

RIGHT SIDE
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ ADA    │ │ ISO    │ │ ICOI   │ │ AAO    │
│ CERT   │ │ CERT   │ │ CERT   │ │ CERT   │
└────────┘ └────────┘ └────────┘ └────────┘
```

---

# CMS vs Frontend Responsibility

| Responsibility             | Strapi |   Frontend  |
| -------------------------- | :----: | :---------: |
| Certificate selection/data |    ✅   |             |
| Organization logo          |    ✅   |             |
| Organization name          |    ✅   |             |
| Accreditation summary      |    ✅   |             |
| Certificate image          |    ✅   |             |
| Certificate order          |    ✅   |             |
| Alt text                   |    ✅   |             |
| Min 1 / max 4 validation   |    ✅   | ✅ defensive |
| Left summary layout        |        |      ✅      |
| Right gallery layout       |        |      ✅      |
| Pair synchronization       |        |      ✅      |
| Certificate dimensions     |        |      ✅      |
| Gaps                       |        |      ✅      |
| Responsive behavior        |        |      ✅      |
| Image fit/crop             |        |      ✅      |

---

# Mandatory Coding-Agent Rules

1. Section is positioned immediately after `home-doctors`.
2. Section accepts **1–4 certificate bundles**.
3. A bundle contains both the left accreditation summary and its right certificate image.
4. Summary and certificate must never be stored as unrelated lists.
5. CMS reordering a bundle moves both sides together.
6. Desktop with four bundles reproduces the supplied:

   * four left accreditation summaries,
   * four right framed certificates.
7. Do not render placeholders for missing bundles.
8. Do not duplicate certificates to fill the row.
9. Preserve certificate aspect ratio and full gold frame.
10. Prefer `contain` rather than `cover` for certificate imagery.
11. Strapi controls certification content/assets/order.
12. Frontend controls the two-zone geometry and responsive behavior.
13. Zero bundles must not be valid.
14. More than four bundles must not be valid.
