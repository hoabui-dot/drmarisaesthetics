# UI Implementation Spec — About Us Book a Consultation Section

## 1. Identity

| Field                       | Value                                                                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | Existing **About Us route in current codebase**                                                                                                                           |
| Section ID                  | `about-booking`                                                                                                                                                           |
| Section name                | `About Us — Book a Consultation`                                                                                                                                          |
| Position in page            | **Final content section of About Us page, immediately after `about-why-choose`**                                                                                          |
| Section type                | Consultation/appointment form + clinic information + clinic image                                                                                                         |
| Desktop composition         | **Left form + center clinic information panel + right clinic image**                                                                                                      |
| Form CTA                    | `REQUEST APPOINTMENT`                                                                                                                                                     |
| CMS integration             | Strapi for editable section/clinic content; backend/API for form submission                                                                                               |
| Primary implementation goal | Reproduce the supplied three-part booking composition while reusing canonical Service and Clinic information and keeping form-processing logic outside visual CMS content |
| Overall evidence quality    | High for desktop layout and visible form fields; Medium for exact clinic contact text due to screenshot resolution; Low for responsive/submission-state behavior          |

> **Critical position rule:** This is the **last About Us content section**, immediately after `about-why-choose`. The global `SiteFooter` follows this section.

> **Critical layout rule:** The supplied design is **not the same layout as `home-booking`**. The Homepage booking section uses approximately `form / informational-content` columns, while About Us uses a **three-region composition**:
>
> 1. consultation form on the left,
> 2. dark-blue clinic contact panel in the center-right,
> 3. clinic reception image on the far-right.

> **Critical data-reuse rule:** Service options and clinic information should reuse canonical data already available in Strapi/codebase wherever possible. Do not maintain separate About-specific copies of service names, address, phone, email and opening hours unless the business explicitly requires different clinic/location data.

---

# 2. Relationship to Homepage Booking Section

The website has two booking-section presentations.

## Homepage

```text
home-booking

┌─────────────────────────┬─────────────────────────┐
│ Consultation Form       │ Marketing / Clinic Info │
│                         │                         │
└─────────────────────────┴─────────────────────────┘
```

## About Us

```text
about-booking

┌──────────────────────────┬──────────────────┬──────────────────┐
│ Consultation Form        │ Clinic Info      │ Clinic Image     │
│                          │ Dark Blue Panel  │ Reception        │
└──────────────────────────┴──────────────────┴──────────────────┘
```

Therefore:

```text
SHARED DATA / LOGIC
├── Service list
├── Clinic information
├── Booking API
├── Validation logic
└── Submission state

DIFFERENT PRESENTATION
├── home-booking
└── about-booking
```

Do not duplicate backend submission logic merely because the two sections have different UI layouts.

---

# 3. Scope Boundary

## Included

* USER-SPECIFIED — Final About Us section.
* OBSERVED — One large rounded parent container.
* OBSERVED — Pale-blue outer border.
* OBSERVED — Left booking form.
* OBSERVED — Heading:

  * `Book a Consultation`
* OBSERVED — Short blue underline beneath form heading.
* OBSERVED — Form fields:

  * Full Name
  * Phone Number
  * Email Address
  * Service selection
  * Message
* OBSERVED — Full Name + Phone Number appear in one two-column row.
* OBSERVED — Email field spans full form width.
* OBSERVED — Service select spans full form width.
* OBSERVED — Message textarea spans full form width.
* OBSERVED — Filled blue CTA:

  * `REQUEST APPOINTMENT`
* OBSERVED — CTA contains right arrow.
* OBSERVED — Dark-blue clinic-information panel.
* OBSERVED — Panel heading:

  * `Smilux Dental Clinic`
* OBSERVED — Contact rows:

  * Address
  * Phone
  * Email
  * Opening Hours
* OBSERVED — One circular/outline icon for each contact row.
* OBSERVED — Far-right clinic/reception image.
* OBSERVED — Smilux branding appears in reception image.
* INFERRED — Service options should reuse canonical `Service` records.
* INFERRED — Form submission can reuse the same booking/consultation API used by Homepage booking.
* INFERRED — Contact data should preferably reuse global `Clinic Settings`.

## Excluded

* UNKNOWN — exact backend endpoint.
* UNKNOWN — exact required-field rules.
* UNKNOWN — success-state design.
* UNKNOWN — error-state design.
* UNKNOWN — CAPTCHA.
* UNKNOWN — CRM integration.
* UNKNOWN — email notification workflow.
* UNKNOWN — appointment date/time picker.
* UNKNOWN — OTP.
* UNKNOWN — mobile layout.
* UNKNOWN — tablet layout.
* UNKNOWN — whether clinic image changes with selected location.
* UNKNOWN — whether there are multiple clinics.

---

# 4. Evidence and Confidence

| Item                            | Status         | Evidence                             |
| ------------------------------- | -------------- | ------------------------------------ |
| Final About content section     | USER-SPECIFIED | Explicit                             |
| Parent rounded card             | OBSERVED       | Screenshot                           |
| Three-region composition        | OBSERVED       | Form + blue panel + image            |
| Form fields                     | OBSERVED       | Five input areas visible             |
| Form CTA                        | OBSERVED       | `REQUEST APPOINTMENT`                |
| Clinic contact panel            | OBSERVED       | Dark-blue middle panel               |
| Contact row icons               | OBSERVED       | Address/phone/email/time icons       |
| Clinic image                    | OBSERVED       | Reception image on far-right         |
| Canonical Service reuse         | INFERRED       | Existing site architecture           |
| Canonical Clinic Settings reuse | INFERRED       | Avoid duplicated business data       |
| Required fields                 | UNKNOWN        | No reliable required markers visible |
| Submission behavior             | UNKNOWN        | Static design only                   |
| Responsive behavior             | UNKNOWN        | Desktop only                         |

---

# 5. Section Structure

```text
Section: about-booking
└── BookingConsultationCard
    ├── BookingFormRegion
    │   ├── Heading
    │   ├── DecorativeUnderline
    │   │
    │   └── ConsultationForm
    │       ├── TwoColumnRow
    │       │   ├── FullName
    │       │   └── PhoneNumber
    │       │
    │       ├── Email
    │       ├── ServiceSelect
    │       ├── Message
    │       └── SubmitButton
    │
    ├── ClinicInfoPanel
    │   ├── Heading
    │   └── ContactList
    │       ├── Address
    │       ├── Phone
    │       ├── Email
    │       └── OpeningHours
    │
    └── ClinicImageRegion
        └── ReceptionImage
```

---

# 6. Desktop Topology

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│ Book a Consultation       │ Smilux Dental Clinic     │                               │
│ ───                       │                          │                               │
│                           │  ◉ Address               │                               │
│ Full Name    Phone Number │     clinic address       │                               │
│ [_______]    [__________] │                          │                               │
│                           │  ◉ Phone                 │       CLINIC RECEPTION        │
│ [ Email Address         ] │     phone number         │            IMAGE              │
│                           │                          │                               │
│ [ Select a Service    ▼ ] │  ◉ Email                 │        Smilux branding        │
│                           │     email address         │                               │
│ [                       ] │                          │                               │
│ [ Your message...       ] │  ◉ Opening Hours         │                               │
│ [_______________________] │     Mon–Sat ...          │                               │
│                           │     Sunday ...            │                               │
│ [ REQUEST APPOINTMENT → ] │                          │                               │
│                           │                          │                               │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

# 7. Outer Container

## 7.1 Visual Style

| Property         | Specification                             | Status              |
| ---------------- | ----------------------------------------- | ------------------- |
| Surface          | White / near-white                        | OBSERVED            |
| Border           | Thin pale blue                            | OBSERVED            |
| Radius           | Large, approximately `18–24 px estimated` | INFERRED            |
| Shadow           | Extremely subtle / none                   | OBSERVED / INFERRED |
| Overflow         | Hidden                                    | REQUIRED            |
| Main orientation | Horizontal                                | OBSERVED            |

The far-right image must remain clipped by the parent card's rounded top-right/bottom-right corners.

---

# 7.2 Approximate Desktop Width Distribution

```text
FORM                 CLINIC INFO           IMAGE
~50%                 ~25%                  ~25%
```

The screenshot suggests approximately:

| Region       | Approximate share |
| ------------ | ----------------: |
| Booking form |          `47–50%` |
| Clinic info  |          `24–26%` |
| Clinic image |          `24–27%` |

Exact dimensions require Figma/source measurement.

---

# 8. Booking Form Region

## 8.1 Heading

```text
Book a Consultation
```

Appearance:

* dark navy,
* bold/semibold,
* left aligned,
* approximately `26–31 px estimated`.

---

## 8.2 Decorative Underline

A short blue line appears below the heading.

This differs from the centered About section headers because this form heading is left aligned.

```text
Book a Consultation
────
```

Do not center this underline.

---

# 9. Form Layout

## 9.1 Desktop Structure

```text
ROW 1
[ Full Name        ] [ Phone Number      ]

ROW 2
[ Email Address                         ]

ROW 3
[ Select a Service                   ▼ ]

ROW 4
[                                      ]
[ Tell us about your needs...          ]
[                                      ]

ROW 5
[ REQUEST APPOINTMENT → ]
```

This structure must be preserved on full desktop.

---

# 9.2 Important Difference From Homepage Form

Homepage booking uses:

```text
Full Name        | Phone
Email            | Preferred Service
Message full width
```

About booking uses:

```text
Full Name        | Phone
Email full width
Service full width
Message full width
```

Do not blindly reuse the Homepage desktop form grid.

Reuse shared input components and form logic, but implement the About-specific layout.

---

# 10. Full Name Field

Visible placeholder:

```text
Full Name
```

* plain text input,
* top-left of form row.

No persistent external label is visible in this screenshot.

### Accessibility

Even though the visual design uses placeholder-style labels, the implementation must still expose an accessible form label.

This may be visually hidden if required to preserve screenshot fidelity.

---

# 11. Phone Number Field

Visible placeholder:

```text
Phone Number
```

* top-right in first row.

Unlike the Homepage booking screenshot, there is **no clearly visible country-flag selector** in this About design.

Therefore do not force the Homepage phone-control presentation into this section unless the shared phone implementation requires it.

Possible architecture:

```text
Shared phone normalization / validation
+
About-specific compact visual presentation
```

If international country selection is required product-wide, it can still be supported without visually changing the reference unnecessarily.

---

# 12. Email Field

Visible:

```text
Email Address
```

* full-width,
* second row.

Email required/optional status is not reliably visible.

Do not infer required status from the Homepage booking section because this About design may intentionally use another validation requirement.

Backend/product contract remains the source of truth.

---

# 13. Service Selector

Visible:

```text
Select a Service
```

with dropdown arrow on right.

Required UI behavior:

* select/dropdown,
* not free text,
* full width.

---

# 13.1 Service Data Source

Preferred:

```text
Service Collection
        ↓
About Booking ServiceSelect
```

Do not maintain:

```text
aboutBookingServices = [
 "Implants",
 "Whitening",
 ...
]
```

separately from the canonical Service records unless Product needs an explicitly curated booking-service subset.

---

# 13.2 Recommended Booking Eligibility

If the canonical Service model supports booking state:

```text
Service
├── title
├── slug
└── bookingEnabled
```

then:

```text
bookingEnabled = true
```

can determine dropdown options.

This is an architectural recommendation, not visible screenshot behavior.

---

# 14. Message Field

Visible placeholder approximately:

```text
Tell us about your needs or any questions you have
```

Properties:

* multiline textarea,
* full width,
* significantly taller than regular fields.

Do not replace this with a single-line input.

---

# 15. Submit CTA

Visible:

```text
REQUEST APPOINTMENT →
```

## Appearance

* strong blue filled background,
* white uppercase text,
* right arrow,
* rounded pill/rounded rectangle,
* positioned left,
* not full form width.

---

## Semantic Role

Must be:

```text
type="submit"
```

or equivalent semantic form submission control.

Do not implement it as a static navigation link if it actually submits appointment data.

---

# 16. Clinic Information Panel

## 16.1 Visual Role

The center-right region is a strong dark-blue information panel.

It provides contrast between:

```text
white form
→
blue clinic info
→
bright clinic photo
```

This three-surface composition is a defining characteristic of the section.

---

# 16.2 Panel Background

Reference:

* deep royal/navy blue,
* possibly subtle horizontal/vertical tonal variation,
* white text.

Do not use a white information panel like the Homepage booking section.

---

# 16.3 Heading

```text
Smilux Dental Clinic
```

* white,
* semibold/bold,
* larger than information labels,
* positioned near top-left of blue panel.

---

# 17. Contact Information Items

Four rows are visible.

```text
ClinicInfo
├── Address
├── Phone
├── Email
└── Opening Hours
```

Each row:

```text
[ICON] Label
       Value
```

---

# 17.1 Address

Screenshot visibly contains an address in Hanoi, Vietnam.

The exact raster copy should be sourced from approved Strapi/Figma content rather than hard-coded from OCR.

Structure:

```text
Address
<street>
<district>
Hanoi, Vietnam
```

### Important

The website's previous screenshots have shown different addresses in:

* Homepage booking,
* Footer,
* this About section.

Therefore do **not** assume all screenshots represent the same production clinic address.

Use canonical location data after Product confirms the intended clinic/location model.

---

# 17.2 Phone

Structure:

```text
Phone
+84 ...
```

The screenshot uses a Vietnam `+84` number.

Exact number should come from canonical CMS data.

---

# 17.3 Email

Visible structure:

```text
Email
info@...
```

Exact email should come from approved CMS data.

---

# 17.4 Opening Hours

Visible approximately:

```text
Opening Hours

Mon - Sat: 8:00 AM - 7:00 PM
Sunday: 9:00 AM - 5:00 PM
```

The screenshot clearly presents two schedule lines.

Exact hours must come from approved Strapi content rather than assuming they match Homepage booking.

---

# 18. Clinic Info Icons

Visible icon concepts:

| Item          | Icon             |
| ------------- | ---------------- |
| Address       | Map pin          |
| Phone         | Phone            |
| Email         | Envelope/contact |
| Opening Hours | Clock            |

Style:

* light/white line icon,
* small circular outline/container,
* consistent diameter.

These icons should remain frontend/design-system assets.

Do not require editors to upload four different arbitrary icons.

---

# 19. Clinic Image Region

## 19.1 Visual

The far-right media shows:

* clean premium dental reception,
* white curved reception counter,
* light modern ceiling,
* indoor plant,
* Smilux wall logo,
* bright white/blue interior.

---

# 19.2 Role

This is a real standalone image/media region:

```text
ClinicImageRegion
└── image
```

It is not a background for clinic-information text.

---

# 19.3 Image Fit

Recommended:

```text
object-fit: cover
```

because the image fills the entire right region.

Use focal positioning to keep visible:

* Smilux branding,
* reception counter,
* core clinic environment.

---

# 19.4 Image Edge Behavior

The image should:

* touch the blue clinic panel directly,
* fill the parent card vertically,
* reach the right edge of the card,
* inherit/clipped by outer top-right and bottom-right radius.

Do not add an internal gap between the blue panel and image.

---

# 20. Strapi Architecture

## 20.1 Recommended Reuse

Avoid a giant page-specific structure with duplicate clinic/service data.

Preferred:

```text
About Page
└── Booking Section
    ├── heading
    ├── buttonLabel
    └── clinicImage
```

with reusable data:

```text
Clinic / Location Settings
├── clinicName
├── address
├── phone
├── email
├── openingHours
└── ...
```

and:

```text
Service Collection
└── booking-enabled services
```

---

# 20.2 If Multiple Clinic Locations Exist

Given that supplied screenshots contain different locations, a cleaner long-term model may be:

```text
ClinicLocation
├── name
├── address
├── phone
├── email
├── openingHours
├── image
└── active
```

Then:

```text
About Booking Section
└── clinicLocation
      ↓ relation
    ClinicLocation
```

This is preferable if the business intentionally operates several branches.

Do not create multiple independent unstructured copies of contact information in each page.

---

# 20.3 About Booking Fields

Recommended page-specific component:

```text
AboutBookingSection
├── heading
├── submitLabel
├── clinicLocation
├── clinicImageOverride?
└── optional serviceSelectionConfig
```

Form field semantics remain frontend/backend contract.

---

# 21. Booking Submission Data Contract

The section collects approximately:

```text
AppointmentRequest
├── fullName
├── phone
├── email
├── service
└── message
```

Recommended payload:

```text
fullName
phone
email
serviceId
message
source = "about-page"
```

`source` is technical metadata and should not be visible/editable CMS content.

---

# 21.1 Reuse Submission Endpoint

If Homepage already uses:

```text
POST booking / consultation
```

the About form should preferably call the same endpoint.

Example:

```text
home-booking ───┐
                ├──→ Booking API
about-booking ──┘
```

Do not create two independent lead-processing pipelines without a business reason.

---

# 22. Validation

Unlike the Homepage screenshot, the About design does not clearly expose red required markers.

Therefore this design spec should **not invent visual required-state rules**.

Validation should follow the backend/Product contract.

At minimum:

* normalize/validate phone,
* validate email when applicable,
* validate selected Service,
* sanitize message,
* server-side validate all incoming values.

---

# 23. Submission States

The screenshot provides only the default state.

Implementation still requires:

```text
idle
submitting
success
error
```

## Submitting

* prevent repeated submissions,
* communicate busy state,
* do not erase entered values prematurely.

## Success

UNKNOWN design.

Could use inline confirmation, toast, or other approved pattern.

## Error

UNKNOWN design.

Must preserve user input and allow retry.

---

# 24. Security / Privacy

This section collects contact data.

Minimum architecture requirements:

* server-side validation,
* rate limiting / spam consideration,
* no privileged Strapi credentials in client,
* no public read permission for lead submissions,
* no raw personal-data logging into analytics,
* sanitize free-text message.

Do not add CAPTCHA visually until Security/Product requires it.

---

# 25. Component Contract

Recommended frontend architecture:

```text
AboutBookingSection
└── AboutBookingCard
    ├── ConsultationForm
    │   ├── NameInput
    │   ├── PhoneInput
    │   ├── EmailInput
    │   ├── ServiceSelect
    │   ├── MessageTextarea
    │   └── SubmitButton
    │
    ├── ClinicInfoPanel
    │   └── ClinicInfoItem[]
    │
    └── ClinicImage
```

Reuse where possible:

```text
shared/
├── FormInput
├── PhoneInput
├── ServiceSelect
├── FormTextarea
├── ClinicInfoItem
└── booking submission hook/service
```

but preserve About-specific composition.

---

# 26. CMS vs Frontend vs Backend Responsibility

| Responsibility                  |         Strapi        | Frontend |   Backend/API  |
| ------------------------------- | :-------------------: | :------: | :------------: |
| Section heading                 |           ✅           |          |                |
| Clinic/location information     | ✅ preferred canonical |          |                |
| Clinic image                    |           ✅           |          |                |
| Service data                    |  ✅ canonical Service  |          |                |
| Form fields rendering           |                       |     ✅    |                |
| About-specific field geometry   |                       |     ✅    |                |
| Validation feedback             |                       |     ✅    | ✅ source rules |
| Service dropdown                |                       |     ✅    |                |
| Form submission                 |                       |     ✅    |        ✅       |
| Save/send lead                  |                       |          |        ✅       |
| Duplicate submission protection |                       |     ✅    |        ✅       |
| Spam/rate-limit                 |                       |          |        ✅       |
| Notification/CRM                |                       |          |        ✅       |

---

# 27. Responsive Specification

## 27.1 Desktop

Required:

```text
FORM | BLUE INFO | IMAGE
```

One horizontal parent card.

---

# 27.2 Tablet

Exact design not supplied.

A potential structural layout:

```text
FORM
────────────
BLUE INFO | IMAGE
```

or another approved stacking strategy.

Status: `UNKNOWN`.

---

# 27.3 Mobile

A logical content order would be:

```text
Book a Consultation
↓
Form
↓
Clinic Info
↓
Clinic Image
```

but this is not yet an approved visual specification.

---

# 27.4 First Form Row on Narrow Screens

Desktop:

```text
Full Name | Phone
```

On sufficiently narrow screens it will likely need:

```text
Full Name
Phone
```

to preserve usable input widths.

Exact breakpoint belongs to frontend responsive implementation/design approval.

---

# 28. Semantic HTML and Accessibility

## Form

Use a semantic `<form>` equivalent.

Although labels are not visibly displayed in the screenshot, each input still requires an accessible label.

Do not rely solely on placeholder text.

---

## Service Selector

Must support keyboard navigation and proper select/combobox semantics.

---

## Submit Button

Must be a semantic submit control.

---

## Clinic Contact

Contact rows remain real text.

If interaction is enabled:

* Phone → telephone link.
* Email → email link.

No click behavior should be invented solely from the screenshot.

---

## Image

If the clinic image is primarily supporting/decorative, alt may be concise.

If meaningful, use description such as:

```text
Smilux Dental Clinic reception area
```

Do not use the filename as alt text.

---

# 29. Visual Specification

## Colors

| Token                                 | Usage                |
| ------------------------------------- | -------------------- |
| `color/about-booking/background`      | Page section white   |
| `color/about-booking/card`            | Parent white         |
| `color/about-booking/border`          | Pale blue            |
| `color/about-booking/heading`         | Deep navy            |
| `color/about-booking/underline`       | Bright blue          |
| `color/about-booking/input-border`    | Pale gray-blue       |
| `color/about-booking/input-text`      | Navy/gray            |
| `color/about-booking/action`          | Bright/royal blue    |
| `color/about-booking/info-background` | Deep royal/navy blue |
| `color/about-booking/info-text`       | White/light          |
| `color/about-booking/info-icon`       | White/light          |

---

# 29.1 Typography

| Element        | Approximate specification |
| -------------- | ------------------------- |
| Form heading   | `26–31 px`, semibold/bold |
| Input text     | `12–14 px`                |
| Submit CTA     | `11–13 px`, semibold      |
| Clinic heading | `19–23 px`, semibold/bold |
| Contact label  | `11–13 px`, semibold      |
| Contact value  | `11–13 px`, regular       |

Use global site typography tokens.

---

# 30. Implementation Constraints

1. Create `about-booking` as the **last About content section**.
2. Render it immediately after `about-why-choose`.
3. Global `SiteFooter` follows it.
4. Use **one shared rounded parent card**.
5. Desktop composition is:

   * form,
   * blue clinic information panel,
   * clinic image.
6. Do not replace the About composition with the Homepage booking layout.
7. First form row contains Full Name + Phone Number.
8. Email spans full width.
9. Service selector spans full width.
10. Message textarea spans full width.
11. CTA reads `REQUEST APPOINTMENT`.
12. Reuse canonical Service data for Service selection.
13. Reuse canonical Clinic/Location data where possible.
14. If multiple branches exist, use a `ClinicLocation` relation rather than page-specific duplicated fields.
15. Blue information panel contains Address, Phone, Email and Opening Hours.
16. Keep contact icons frontend-controlled.
17. Clinic reception image fills the far-right region.
18. Image must be clipped by parent right-side radius.
19. Prefer shared booking submission API with Homepage.
20. Do not invent required-field markers not present in the design.
21. Do not add date/time booking controls.
22. Do not add CAPTCHA unless requested.
23. CMS manages editable content; frontend manages form/layout; backend manages submission/security.

---

# 31. Visual Acceptance Criteria

## Placement

* [ ] Section appears after `about-why-choose`.
* [ ] No other About content section follows it.
* [ ] SiteFooter follows this section.

## Outer Card

* [ ] One rounded parent container.
* [ ] Pale-blue border.
* [ ] White/light surface.
* [ ] Three desktop regions remain visually connected.
* [ ] Right-side image clips cleanly to card radius.

## Form

* [ ] `Book a Consultation` appears.
* [ ] Short left-aligned blue underline appears.
* [ ] Full Name appears.
* [ ] Phone Number appears.
* [ ] Both share first desktop row.
* [ ] Email Address appears full width.
* [ ] `Select a Service` dropdown appears full width.
* [ ] Message textarea appears full width.
* [ ] `REQUEST APPOINTMENT →` appears.
* [ ] CTA is blue with white text.

## Clinic Information Panel

* [ ] Uses dark/deep blue background.
* [ ] Heading reads `Smilux Dental Clinic`.
* [ ] Address row exists.
* [ ] Phone row exists.
* [ ] Email row exists.
* [ ] Opening Hours row exists.
* [ ] All icons use consistent white/light outline styling.
* [ ] Contact information remains readable against blue background.

## Clinic Image

* [ ] Reception image occupies far-right region.
* [ ] Image fills panel height.
* [ ] Smilux wall branding remains visible.
* [ ] Reception desk remains visible.
* [ ] No internal white gutter appears between blue panel and image.

---

# 32. Form Acceptance Scenarios

## Valid Submission

```text
Full Name
Phone Number
Email
Service
Message
        ↓
validation
        ↓
REQUEST APPOINTMENT
        ↓
Booking API
```

* [ ] Button enters loading state.
* [ ] Duplicate click is prevented.
* [ ] API receives stable Service ID/reference.

---

## Submission Error

* [ ] User input remains intact.
* [ ] Error is communicated.
* [ ] User can retry.
* [ ] No duplicate lead is silently created.

---

## Service CMS Update

Example:

```text
Service renamed:
"Implants"
→
"Dental Implants"
```

* [ ] Booking dropdown automatically reflects canonical Service data.
* [ ] No About-page code change is required.

---

# 33. Data Integrity Note — Clinic Information

Multiple supplied designs have shown different clinic addresses/phone numbers.

Therefore the coding agent must **not** infer that every screenshot value should be independently hard-coded.

Preferred model if one clinic exists:

```text
ClinicSettings
        ↓
Homepage Booking
About Booking
Footer
Contact Page
```

Preferred model if multiple clinics exist:

```text
ClinicLocation Collection
├── Ho Chi Minh City
├── Hanoi
└── other branches

Each section
→ selects appropriate ClinicLocation
```

This is important for preventing contradictory production contact information.

---

# 34. Strapi Handoff Summary

## Preferred single-clinic architecture

```text
Clinic Settings
├── clinicName
├── address
├── phone
├── email
├── openingHours
└── receptionImage


Service Collection
└── Services...


About Page
└── Booking Section
    ├── heading
    ├── submitLabel
    └── uses global Clinic Settings
```

## Preferred multi-clinic architecture

```text
ClinicLocation
├── name
├── address
├── phone
├── email
├── openingHours
└── image


About Page
└── Booking Section
    ├── heading
    ├── clinicLocation → relation
    └── submitLabel
```

---

# 35. Desktop Handoff

```text
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│ BOOKING FORM                 CLINIC INFORMATION            CLINIC IMAGE        │
│                                                                               │
│ Book a Consultation          Smilux Dental Clinic                              │
│ ───                                                                           │
│                              ◉ Address                                         │
│ [Full Name][Phone Number]       ...                                            │
│                              ◉ Phone                                           │
│ [Email Address           ]       ...                      RECEPTION             │
│                                                          PHOTO                 │
│ [Select a Service      ▼ ]    ◉ Email                                           │
│                                ...                                             │
│ [                         ]  ◉ Opening Hours                                   │
│ [Message                  ]     ...                                             │
│ [_________________________]                                                    │
│                                                                               │
│ [REQUEST APPOINTMENT →]                                                       │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

# 36. About Us Page Final Section Order

With this addition, the currently specified About page flow is:

```text
SiteHeader
↓
about-hero
↓
about-mission-vision
↓
about-core-values
↓
about-doctors
↓
about-featured-services
↓
about-why-choose
↓
about-booking
↓
SiteFooter
```

---

# 37. Mandatory Coding-Agent Rules

1. Create `about-booking` as the **final About Us content section**.
2. Position it directly after `about-why-choose`.
3. `SiteFooter` renders immediately after it.
4. Use **one outer rounded container**.
5. Desktop layout is **Form / Blue Clinic Info / Clinic Image**.
6. Do not reuse Homepage booking geometry unchanged.
7. First form row is `Full Name | Phone Number`.
8. Email is full-width.
9. Service dropdown is full-width.
10. Message textarea is full-width.
11. Submit action is `REQUEST APPOINTMENT →`.
12. Service options must prefer canonical Strapi Service records.
13. Blue clinic panel contains Address, Phone, Email and Opening Hours.
14. Contact icons remain frontend/design-system assets.
15. Far-right image is an actual clinic/reception media field, not a CSS illustration.
16. Preserve the image's Smilux/reception focal composition.
17. Prefer shared booking submission logic/API with `home-booking`.
18. Do not create duplicate backend booking flows purely for UI variants.
19. Prefer canonical `ClinicSettings` or `ClinicLocation` relation for contact information.
20. Do not hard-code conflicting clinic addresses from screenshots without confirming the actual branch/source of truth.
21. Do not infer required-field markers that are not visible in this design.
22. Do not add appointment date/time fields, OTP or CAPTCHA without a separate requirement.
23. Strapi controls content/data; frontend controls the three-region visual layout; backend controls validation, security and lead submission.
