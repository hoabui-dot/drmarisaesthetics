# UI Implementation Spec — Homepage Booking Consultation Section

## 1. Identity

| Field                       | Value                                                                                                                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | `/`                                                                                                                                                                                                            |
| Section ID                  | `home-booking`                                                                                                                                                                                                 |
| Section name                | `Homepage Booking Consultation`                                                                                                                                                                                |
| Position in page            | Immediately after `home-articles`                                                                                                                                                                              |
| Screenshot scope            | Complete desktop consultation/booking section visible in supplied screenshot                                                                                                                                   |
| Section type                | Two-column consultation form + clinic information panel                                                                                                                                                        |
| CMS integration             | Strapi CMS for editable section copy, service options and clinic information                                                                                                                                   |
| Form integration            | Requires backend/API submission contract; exact endpoint currently UNKNOWN                                                                                                                                     |
| Primary implementation goal | Reproduce the supplied booking form layout with correct field validation, service selection, phone-country UI and clinic-information panel while keeping editable content separated from form-processing logic |
| Overall evidence quality    | High for desktop layout, field anatomy and visible copy; Medium for form behavior; Low for responsive design and backend submission contract                                                                   |

> **Critical architecture rule:** Strapi should manage **editable content/configuration**, but Strapi CMS editor data must not be confused with the actual appointment-request transaction unless the backend architecture intentionally uses Strapi as the submission datastore.

> **Critical form rule:** The screenshot visibly marks **Full Name**, **Phone Number**, and **Preferred Service** as required using a red `*`. `Email` and `Your Message` do not show a required marker and should therefore remain optional unless Product explicitly changes the rule.

> **Critical layout rule:** The desktop section is one large rounded parent container divided into **two internal columns** by a vertical separator:
>
> * left = consultation form,
> * right = clinic information.
>
> Do not implement these as two unrelated standalone cards.

---

# 2. Scope Boundary

## Included in this spec

* OBSERVED — Large bordered/rounded section container.
* OBSERVED — Left booking form area.
* OBSERVED — Right clinic-information area.
* OBSERVED — Vertical divider between both areas.
* OBSERVED — Form heading:

  * `Book a Consultation`
* OBSERVED — Small blue decorative line beneath form heading.
* OBSERVED — Form fields:

  * Full Name,
  * Phone Number,
  * Email,
  * Preferred Service,
  * Your Message.
* OBSERVED — Required indicators for:

  * Full Name,
  * Phone Number,
  * Preferred Service.
* OBSERVED — Phone input includes:

  * country flag,
  * country selector/down indicator,
  * phone value.
* OBSERVED — Preferred Service is a select/dropdown control.
* OBSERVED — Large message textarea.
* OBSERVED — Filled blue CTA:

  * `REQUEST CONSULTATION`
* OBSERVED — Right-side eyebrow:

  * `SMILUX DENTAL CLINIC`
* OBSERVED — Right-side heading:

  * `Consult With Our Experts`
* OBSERVED — Introductory paragraph.
* OBSERVED — Four clinic information rows:

  1. Address
  2. Phone
  3. Opening Hours
  4. International Patients
* OBSERVED — Each information row includes a circular icon.
* INFERRED — Preferred Service options should ideally derive from Strapi Service records or a controlled CMS configuration.
* INFERRED — Clinic information should be CMS-editable/reusable rather than duplicated in Homepage only.

## Excluded from this spec

* UNKNOWN — Submission API endpoint.
* UNKNOWN — email notification behavior.
* UNKNOWN — CRM integration.
* UNKNOWN — appointment calendar availability.
* UNKNOWN — captcha/anti-spam.
* UNKNOWN — confirmation modal.
* UNKNOWN — success page.
* UNKNOWN — error-message copy.
* UNKNOWN — backend persistence.
* UNKNOWN — SMS verification.
* UNKNOWN — phone OTP.
* UNKNOWN — actual appointment time selection.
* UNKNOWN — preferred contact method.
* UNKNOWN — tablet/mobile design.
* UNKNOWN — whether phone country defaults from locale/IP.
* UNKNOWN — exact list of supported phone countries.

---

# 3. Evidence and Confidence

| Item                        | Status   | Evidence / reason                                 |
| --------------------------- | -------- | ------------------------------------------------- |
| Desktop two-column layout   | OBSERVED | Form and clinic panel clearly separated           |
| Single outer card/container | OBSERVED | Both areas share one rounded outer boundary       |
| Vertical divider            | OBSERVED | Thin separator visible between columns            |
| Form fields                 | OBSERVED | Five visible controls                             |
| Required fields             | OBSERVED | Red star visible on 3 labels                      |
| Phone country selector      | OBSERVED | Vietnam flag + dropdown affordance visible        |
| Preferred Service dropdown  | OBSERVED | Select affordance visible                         |
| Message multiline           | OBSERVED | Large textarea                                    |
| Clinic info rows            | OBSERVED | Four icon/text rows                               |
| Form submission behavior    | UNKNOWN  | Static screenshot only                            |
| Service option source       | INFERRED | CMS relation is appropriate                       |
| Exact validation rules      | PARTIAL  | Required markers known; other constraints unknown |
| Responsive behavior         | UNKNOWN  | Desktop only                                      |

---

# 4. OCR Content Inventory

## 4.1 Form heading

| Element ID        | Visible text          | Type                 | Confidence |
| ----------------- | --------------------- | -------------------- | ---------- |
| `booking-heading` | `Book a Consultation` | H2 / section heading | High       |

---

# 4.2 Form fields

| Element ID          | Visible label       | Placeholder / visible value                          |          Required | Confidence |
| ------------------- | ------------------- | ---------------------------------------------------- | ----------------: | ---------- |
| `booking-full-name` | `Full Name`         | `Enter your full name`                               |               Yes | High       |
| `booking-phone`     | `Phone Number`      | `0912 345 678`                                       |               Yes | High       |
| `booking-email`     | `Email`             | `Enter your email`                                   | No visible marker | High       |
| `booking-service`   | `Preferred Service` | `Select a service`                                   |               Yes | High       |
| `booking-message`   | `Your Message`      | `Tell us about your needs or any questions you have` | No visible marker | High       |

---

# 4.3 Form CTA

| Element ID       | Visible text           | Type        | Confidence |
| ---------------- | ---------------------- | ----------- | ---------- |
| `booking-submit` | `REQUEST CONSULTATION` | Primary CTA | High       |

Arrow icon appears at the button's right.

---

# 4.4 Right information panel

| Element ID                 | Visible text                                                                                                                                                 | Type                 | Confidence |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- | ---------- |
| `booking-info-eyebrow`     | `SMILUX DENTAL CLINIC`                                                                                                                                       | Eyebrow              | High       |
| `booking-info-heading`     | `Consult With Our Experts`                                                                                                                                   | H2/H3 visual heading | High       |
| `booking-info-description` | `Our team of experienced dentists uses advanced technology and a personalized approach to deliver safe, effective, and beautiful results for every patient.` | Paragraph            | High       |

---

# 4.5 Address

Visible:

`Address:`

`233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam`

Confidence: High.

---

# 4.6 Phone

Visible:

`Phone:`

`0866 251 379`

Confidence: High.

---

# 4.7 Opening Hours

Visible:

`Opening Hours:`

`Mon - Sat: 8:00 AM - 7:00 PM`

Confidence: High.

---

# 4.8 International Patients

Visible:

`International Patients:`

`We provide consultation support in English and flexible scheduling for overseas patients.`

Confidence: High.

---

# 5. Layout Anatomy

## 5.1 Global geometry

| Property           | Specification                                 | Status              |
| ------------------ | --------------------------------------------- | ------------------- |
| Section width      | Full viewport with centered content container | OBSERVED / INFERRED |
| Outer container    | One large rounded bordered panel              | OBSERVED            |
| Background         | White / near-white                            | OBSERVED            |
| Outer radius       | Large, approximately `18–24 px estimated`     | INFERRED            |
| Border             | Very pale blue                                | OBSERVED            |
| Shadow             | Extremely subtle / none                       | INFERRED            |
| Main split         | Approximately `54% form / 46% clinic info`    | INFERRED            |
| Vertical separator | Thin pale line                                | OBSERVED            |
| Form layout        | Two-column controls + full-width textarea     | OBSERVED            |
| Right panel        | Single content column                         | OBSERVED            |
| Vertical alignment | Both areas start near same top baseline       | OBSERVED            |

---

# 5.2 Structure tree

```text id="vy29xm"
Section: home-booking
└── BookingContainer
    ├── BookingFormColumn
    │   ├── FormHeading
    │   ├── DecorativeLine
    │   │
    │   └── Form
    │       ├── FormGrid
    │       │   ├── FullNameField
    │       │   ├── PhoneField
    │       │   ├── EmailField
    │       │   └── PreferredServiceField
    │       │
    │       ├── MessageField
    │       └── SubmitButton
    │
    ├── VerticalDivider
    │
    └── ClinicInfoColumn
        ├── Eyebrow
        ├── Heading
        ├── Description
        │
        └── ContactInfoList
            ├── AddressItem
            │   ├── Icon
            │   └── Content
            ├── PhoneItem
            ├── OpeningHoursItem
            └── InternationalPatientsItem
```

---

# 5.3 Desktop topology

```text id="c8x6t8"
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Book a Consultation                    │   SMILUX DENTAL CLINIC             │
│  ───                                    │   Consult With Our Experts         │
│                                         │                                   │
│  Full Name *        Phone Number *      │   Intro paragraph...              │
│  [_____________]    [🇻🇳 0912 345 678] │                                   │
│                                         │   ◉ Address:                      │
│  Email              Preferred Service * │      address...                    │
│  [_____________]    [Select a service ▼]│                                   │
│                                         │   ◉ Phone:                        │
│  Your Message                          │      0866 251 379                  │
│  [                                   ] │                                   │
│  [                                   ] │   ◉ Opening Hours:                │
│  [___________________________________] │      Mon - Sat...                  │
│                                         │                                   │
│  [ REQUEST CONSULTATION → ]            │   ◉ International Patients:       │
│                                         │      supporting text...            │
│                                         │                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 6. Form Layout Specification

## 6.1 Desktop form grid

The first four controls use a two-column grid:

```text id="fk3owb"
┌────────────────────────┬────────────────────────┐
│ Full Name *            │ Phone Number *         │
│ [ input ]              │ [ phone input ]        │
├────────────────────────┼────────────────────────┤
│ Email                  │ Preferred Service *    │
│ [ input ]              │ [ select ]             │
└────────────────────────┴────────────────────────┘
```

Then:

```text id="b0uywb"
Your Message
[                                           ]
[                 textarea                  ]
[                                           ]

[ REQUEST CONSULTATION → ]
```

---

# 6.2 Horizontal relationships

| Field             | Width                       | Status   |
| ----------------- | --------------------------- | -------- |
| Full Name         | ~50% form grid minus gap    | OBSERVED |
| Phone Number      | ~50% form grid minus gap    | OBSERVED |
| Email             | ~50% form grid minus gap    | OBSERVED |
| Preferred Service | ~50% form grid minus gap    | OBSERVED |
| Your Message      | Full width                  | OBSERVED |
| Submit CTA        | Partial width, left aligned | OBSERVED |

Do not render every form control full-width on desktop.

---

# 7. Form Field Specification

## 7.1 Shared field geometry

| Property    | Requirement                        | Status   |
| ----------- | ---------------------------------- | -------- |
| Height      | Approximately `38–42 px estimated` | INFERRED |
| Background  | White / very light                 | OBSERVED |
| Border      | Pale gray/blue                     | OBSERVED |
| Radius      | Approximately `5–7 px estimated`   | INFERRED |
| Label       | Above field                        | OBSERVED |
| Label color | Dark navy/gray                     | OBSERVED |
| Placeholder | Muted gray                         | OBSERVED |
| Padding     | Horizontal internal padding        | OBSERVED |

---

# 7.2 Required marker

Visible pattern:

```text id="jnq8hl"
Full Name *
Phone Number *
Preferred Service *
```

Red star appears directly after label.

Do not use placeholder-only required indication.

---

# 7.3 Full Name

### Field

```text id="kxygf9"
Label:
Full Name *

Placeholder:
Enter your full name
```

### Minimum behavior

* text input,
* required,
* trim leading/trailing whitespace.

### UNKNOWN

* minimum length,
* maximum length,
* allowed character policy.

Do not reject Vietnamese names or Unicode characters using an overly restrictive Latin-only regex.

---

# 7.4 Email

```text id="spr620"
Email

Enter your email
```

No red required marker is visible.

Therefore current evidence:

```text id="sxzuwn"
required = false
```

If populated, frontend/backend should validate email format.

---

# 8. Phone Input Specification

## 8.1 Visual anatomy

```text id="wmtyqp"
Phone Number *

┌───────────────────────────────────┐
│ 🇻🇳  ▾   0912 345 678            │
└───────────────────────────────────┘
```

### Components

* country flag,
* country selector,
* phone-number input.

---

# 8.2 Phone data model

Frontend should not submit only the visible formatted string if a structured phone library is used.

Recommended logical representation:

```text id="c6t9b4"
countryCode
dialCode
nationalNumber
internationalNumber
```

At minimum backend should receive a normalized phone number suitable for reliable contact.

Exact normalization contract remains a backend decision.

---

# 8.3 Default country

Screenshot displays Vietnam.

Observed:

```text id="nay0h3"
🇻🇳
```

This indicates Vietnam is the reference/default visible state.

Whether default selection should always be Vietnam or derive from user locale remains `UNKNOWN`.

Do not add GeoIP country-selection behavior unless Product requires it.

---

# 8.4 International patients consideration

Because the right panel explicitly mentions international patients, the phone field should structurally support international country codes if the approved phone component/library permits it.

This is an architectural inference, not proof that every country must be enabled.

---

# 9. Preferred Service Specification

## 9.1 Visual

```text id="lq4o4e"
Preferred Service *

[ Select a service                   ▼ ]
```

This is a dropdown/select control.

Do not implement as free-text input.

---

# 9.2 CMS architecture

Preferred source:

```text id="4f8584"
Service Collection
       ↓ relation/query
Preferred Service Options
```

If the website already has a canonical Strapi `Service` collection, reuse it.

Preferred concept:

```text id="78w4ap"
Service
├── title
├── slug
├── active
└── bookingEnabled
```

Then booking options may come from:

```text id="6vi0zx"
bookingEnabled = true
```

if such filtering is part of Product requirements.

Do not duplicate service names manually in the Homepage component if canonical Service records already exist.

---

# 9.3 Dropdown option data

Frontend/backend should submit a stable identifier:

```text id="2j2clw"
serviceId
```

or canonical slug/reference,

rather than trusting only the display label:

```text id="mpvbr6"
"Teeth Whitening"
```

This avoids ambiguity if the label later changes.

---

# 10. Message Field

## Visual

```text id="js1y2q"
Your Message

┌────────────────────────────────────────────────┐
│ Tell us about your needs or any questions...  │
│                                                │
│                                                │
└────────────────────────────────────────────────┘
```

### Requirements

* multiline textarea,
* full form width,
* visibly taller than other fields,
* no required marker in screenshot.

Current evidence:

```text id="mv8ot0"
required = false
```

Exact character limit is UNKNOWN.

---

# 11. Submit CTA

## Visible treatment

```text id="7fwazf"
REQUEST CONSULTATION →
```

### Appearance

* filled royal/bright blue,
* white uppercase text,
* arrow on right,
* rounded pill/rounded rectangle,
* left aligned,
* width significantly smaller than form width.

### Semantic rule

Use an actual submit button.

Do not implement as:

* link,
* clickable div,
* static CTA disconnected from form.

---

# 12. Clinic Information Panel

## 12.1 Content anatomy

```text id="et347m"
SMILUX DENTAL CLINIC

Consult With Our Experts

Description...

[icon] Address
       address text

[icon] Phone
       phone number

[icon] Opening Hours
       hours

[icon] International Patients
       supporting text
```

---

# 12.2 Eyebrow

* uppercase,
* blue/navy,
* small,
* tracking visually increased.

---

# 12.3 Heading

`Consult With Our Experts`

* dark navy,
* strong visual weight,
* larger than body text,
* one desktop line in screenshot.

---

# 12.4 Description

* muted navy/gray,
* approximately 2–3 lines,
* constrained width.

---

# 12.5 Information item layout

Each item:

```text id="54ercg"
ContactInfoItem
├── CircularIcon
└── Content
    ├── Label
    └── Value
```

Examples:

```text id="3zmdqn"
◉  Address:
   233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam
```

---

# 12.6 Icon styles

Four visible icon concepts:

| Item                   | Icon          |
| ---------------------- | ------------- |
| Address                | Location pin  |
| Phone                  | Phone handset |
| Opening Hours          | Clock         |
| International Patients | Globe         |

### Appearance

* circular icon wrapper,
* pale/light background,
* blue line icon,
* consistent diameter.

Icons are frontend/design-system concerns rather than CMS-selectable assets unless the project already exposes icons structurally.

---

# 13. Visual Specification

## 13.1 Colors

| Token candidate              | Usage              | Description         | Status   |
| ---------------------------- | ------------------ | ------------------- | -------- |
| `color/booking/background`   | Section            | White               | OBSERVED |
| `color/booking/container`    | Main card          | White / near-white  | OBSERVED |
| `color/booking/border`       | Outer border       | Pale blue           | OBSERVED |
| `color/booking/divider`      | Vertical separator | Very pale blue-gray | OBSERVED |
| `color/booking/heading`      | Main headings      | Dark navy           | OBSERVED |
| `color/booking/body`         | Paragraphs         | Muted navy/gray     | OBSERVED |
| `color/booking/label`        | Field labels       | Dark neutral/navy   | OBSERVED |
| `color/booking/required`     | Required `*`       | Red                 | OBSERVED |
| `color/booking/action`       | Submit CTA         | Bright/royal blue   | OBSERVED |
| `color/booking/icon`         | Contact icons      | Bright blue         | OBSERVED |
| `color/booking/input-border` | Fields             | Pale gray-blue      | OBSERVED |

---

# 13.2 Typography

| Element           | Weight              | Approx. size         | Status   |
| ----------------- | ------------------- | -------------------- | -------- |
| Booking heading   | `600–700 estimated` | `29–34 px estimated` | INFERRED |
| Form labels       | `400–500 estimated` | `12–14 px estimated` | INFERRED |
| Input text        | `400 estimated`     | `12–14 px estimated` | INFERRED |
| Placeholder       | `400 estimated`     | `12–14 px estimated` | INFERRED |
| Submit CTA        | `600 estimated`     | `11–13 px estimated` | INFERRED |
| Right eyebrow     | `600 estimated`     | `11–13 px estimated` | INFERRED |
| Right heading     | `600–700 estimated` | `27–31 px estimated` | INFERRED |
| Right description | `400–500 estimated` | `12–14 px estimated` | INFERRED |
| Contact label     | `600–700 estimated` | `12–14 px estimated` | INFERRED |
| Contact value     | `400–500 estimated` | `12–14 px estimated` | INFERRED |

---

# 14. Component Contract

| Component             | Responsibility                | Reusable?   | Status              |
| --------------------- | ----------------------------- | ----------- | ------------------- |
| `HomeBookingSection`  | Entire section orchestration  | No          | INFERRED            |
| `ConsultationForm`    | Booking form state/submission | Yes         | OBSERVED / INFERRED |
| `FormField`           | Shared field primitive        | Yes         | INFERRED            |
| `PhoneInput`          | Country + phone input         | Yes         | OBSERVED            |
| `ServiceSelect`       | Preferred service selection   | Yes         | OBSERVED            |
| `BookingTextarea`     | Message control               | Yes         | OBSERVED            |
| `BookingSubmitButton` | Form action                   | Yes         | OBSERVED            |
| `ClinicInfoPanel`     | Right panel                   | Potentially | INFERRED            |
| `ClinicInfoItem`      | Icon + label + value          | Yes         | OBSERVED            |

---

# 15. Strapi CMS Contract

## 15.1 Recommended Homepage section model

```text id="n60ytx"
Homepage
└── Booking Section
    ├── formHeading
    ├── submitLabel
    │
    └── clinicInfo
        ├── eyebrow
        ├── heading
        ├── description
        ├── address
        ├── phone
        ├── openingHours
        └── internationalPatientMessage
```

Preferred Service choices should preferably come from a canonical Service collection instead of being manually embedded here.

---

# 15.2 Form labels: CMS or frontend?

There are two reasonable approaches.

### Recommended for this site

Keep stable technical field labels/frontend translation keys controlled by frontend/i18n unless Product explicitly needs editors to rewrite form semantics.

Examples:

* Full Name,
* Phone Number,
* Email,
* Preferred Service,
* Your Message.

Strapi can manage:

* section heading,
* submit button copy,
* right-side marketing/contact copy.

This reduces the chance that editors accidentally rename a field while backend validation still expects another semantic field.

---

# 15.3 Clinic information reuse

If address/phone/opening hours already exist in a global site/clinic configuration, **do not duplicate them inside Homepage**.

Preferred:

```text id="q4m3qe"
Global Clinic Settings
├── address
├── phone
├── openingHours
└── internationalPatientMessage

Homepage Booking Section
└── consumes Clinic Settings
```

Instead of:

```text id="02tuux"
Homepage.booking.address
Footer.address
ContactPage.address
Header.address
```

with different copies.

---

# 15.4 Recommended clinic fields

| Field                         | Type            | Required |
| ----------------------------- | --------------- | -------: |
| `clinicName` / eyebrow        | Short text      |      Yes |
| `bookingPanelHeading`         | Short text      |      Yes |
| `bookingPanelDescription`     | Long text       |      Yes |
| `address`                     | Structured/text |      Yes |
| `phone`                       | Short text      |      Yes |
| `openingHours`                | Structured/text |      Yes |
| `internationalPatientMessage` | Long text       |      Yes |

---

# 16. Booking Submission Data Contract

The visual form logically collects:

```text id="f68o17"
ConsultationRequest
├── fullName
├── phone
├── email?
├── preferredService
└── message?
```

Recommended conceptual payload:

```text id="ep6rnr"
fullName: required
phone: required
email: optional
preferredServiceId: required
message: optional
```

Additional technical metadata such as:

* source page,
* locale,
* submitted timestamp,

may be added by backend/frontend architecture, but is not visible design content.

---

# 16.1 Do not send presentation data

Do not submit:

* field label text,
* placeholder strings,
* button color,
* layout position,
* service display text only when a stable service ID is available.

---

# 17. Validation Contract

## 17.1 Full Name

Required.

Show validation if empty.

Exact copy is UNKNOWN.

---

## 17.2 Phone Number

Required.

Must validate according to supported international phone strategy.

Do not assume every phone is Vietnamese simply because the reference shows the Vietnam flag.

---

## 17.3 Email

Optional based on screenshot.

If entered:

* validate syntactic email format.

---

## 17.4 Preferred Service

Required.

Empty state:

```text id="v9iehf"
Select a service
```

is not a valid submitted service.

---

## 17.5 Message

Optional based on screenshot.

Character limits remain UNKNOWN.

---

# 17.6 Validation presentation

Not visible in screenshot.

Therefore `UNKNOWN`:

* error text position,
* red border,
* inline error icon,
* toast.

Do not invent a visually elaborate validation system that conflicts with the site's design system.

At minimum errors must:

* be visible,
* be associated with controls,
* be accessible to screen readers.

---

# 18. Submission State Specification

The design only shows default form state.

Required implementation should nevertheless account for:

```text id="ml6i6m"
idle
submitting
success
error
```

Exact visual designs are UNKNOWN.

### Minimum behavior

#### Submitting

* prevent duplicate submissions.
* button must communicate busy state accessibly.

#### Success

* preserve a clear confirmation to the user.
* exact copy/placement requires Product design.

#### Error

* do not silently discard input.
* communicate failure and allow retry.

Do not invent full-page navigation after submission unless approved.

---

# 19. Backend / Strapi Responsibility Boundary

Possible architectures include:

### Option A — Dedicated booking backend

```text id="lk71zz"
Homepage Form
      ↓
Booking API
      ↓
CRM / email / database
```

### Option B — Strapi custom endpoint/content type

```text id="hkekbp"
Homepage Form
      ↓
Strapi API
      ↓
Consultation Request Collection
```

### Option C — External scheduling/CRM platform

UNKNOWN.

The screenshot provides no evidence selecting one architecture.

### Important

Do not let the frontend directly expose privileged Strapi administration credentials.

If requests are stored in Strapi, use an appropriately secured public/custom endpoint with strict validation and permissions.

---

# 20. Spam and Security Requirements

Because this is a public contact/booking form:

* server-side validation is required,
* client-side validation alone is insufficient,
* rate limiting should be considered,
* inputs must be sanitized/validated,
* backend must not trust service IDs blindly,
* prevent repeated rapid submission,
* protect against automated spam.

Captcha mechanism is UNKNOWN and should not be visually added until Product/Security decides.

---

# 21. Privacy / Personal Data Note

The form collects:

* name,
* phone,
* email,
* message,
* preferred dental service.

These are user-submitted personal/contact data.

Implementation should avoid:

* logging full sensitive form payloads unnecessarily in frontend analytics,
* exposing submissions in client-visible API responses,
* exposing public Strapi read permissions for consultation-request records.

Exact privacy-policy consent UI is not visible in the screenshot.

Do not add a consent checkbox unless Product/legal requirements call for one.

---

# 22. Responsive Specification

## 22.1 Evidence

| Viewport | Evidence |
| -------- | -------- |
| Desktop  | High     |
| Tablet   | UNKNOWN  |
| Mobile   | UNKNOWN  |

---

# 22.2 Desktop requirements

* Main outer card stays one composition.
* Form left.
* Clinic information right.
* Vertical divider remains.
* First four form controls use 2-column arrangement.
* Message textarea spans full form width.
* CTA remains left aligned.

---

# 22.3 Likely narrow-screen structural fallback

A logical mobile structure would be:

```text id="ro5gjm"
Book a Consultation

Full Name
Phone
Email
Preferred Service
Message
Submit

────────

SMILUX DENTAL CLINIC
Consult With Our Experts

Address
Phone
Opening Hours
International Patients
```

This is `INFERRED`, not final approved mobile design.

---

# 22.4 Mobile form fields

On narrow screens it is structurally reasonable for:

```text id="qxyaz5"
2-column fields
→
1-column fields
```

but exact breakpoint remains UNKNOWN.

---

# 22.5 Phone input on mobile

Must preserve enough width for:

* country selector,
* international number.

Do not allow the country control to consume so much width that the actual phone input becomes unusable.

---

# 23. Semantic HTML and Accessibility

## Form

Use semantic form controls.

Required relationships:

```text id="g8rjn1"
label → input
label → select
label → textarea
```

Do not rely exclusively on placeholders as labels.

---

## Required fields

Expose required state semantically.

The red star is visual reinforcement only.

---

## Phone country selector

Must have an accessible label/name distinct from the actual phone-number input.

---

## Preferred Service

Use native/select-like accessible semantics appropriate to the chosen component library.

Keyboard users must be able to:

* open options,
* navigate options,
* select a service,
* close the popup.

---

## Error behavior

Validation messages should be programmatically associated with the corresponding field.

---

## Submit

Use semantic submit button.

---

## Clinic contact information

Phone may become a `tel:` link if product behavior supports it.

Address may remain text or become a map link only if required.

Do not infer clickable behavior from the screenshot.

---

# 24. Interaction States

| Element        | Default               | Focus    | Invalid        | Disabled                      | Status                       |
| -------------- | --------------------- | -------- | -------------- | ----------------------------- | ---------------------------- |
| Text inputs    | Light bordered        | Required | UNKNOWN design | UNKNOWN                       | Default OBSERVED             |
| Phone input    | Flag + number         | Required | UNKNOWN        | UNKNOWN                       | OBSERVED                     |
| Service select | Placeholder + chevron | Required | UNKNOWN        | UNKNOWN                       | OBSERVED                     |
| Textarea       | Light bordered        | Required | UNKNOWN        | UNKNOWN                       | OBSERVED                     |
| Submit         | Blue filled           | Required | UNKNOWN        | During submission recommended | OBSERVED / behavior INFERRED |

### Do not invent

* floating labels,
* animated underline,
* glass inputs,
* step wizard,
* calendar picker,
* appointment time selector,
* OTP.

---

# 25. Visual Acceptance Criteria

## Outer structure

* [ ] Section appears immediately after `home-articles`.
* [ ] One large rounded outer panel contains both form and clinic info.
* [ ] Outer border is pale/light blue.
* [ ] Vertical separator appears between columns.
* [ ] Form side is slightly wider than clinic side.

## Form heading

* [ ] `Book a Consultation` matches.
* [ ] Short blue decorative line appears below heading.

## Form controls

* [ ] Full Name appears top-left.
* [ ] Phone Number appears top-right.
* [ ] Email appears second row left.
* [ ] Preferred Service appears second row right.
* [ ] Message spans entire form width.
* [ ] Full Name has red required marker.
* [ ] Phone Number has red required marker.
* [ ] Preferred Service has red required marker.
* [ ] Email has no visible required marker.
* [ ] Message has no visible required marker.
* [ ] Phone field shows country flag/control.
* [ ] Service field shows dropdown indicator.
* [ ] Inputs use consistent height/radius/border.

## CTA

* [ ] CTA reads `REQUEST CONSULTATION`.
* [ ] CTA is blue with white text.
* [ ] Right arrow appears.
* [ ] CTA remains left aligned.
* [ ] CTA submits the form semantically.

## Clinic information

* [ ] `SMILUX DENTAL CLINIC` appears.
* [ ] `Consult With Our Experts` appears.
* [ ] Intro paragraph appears.
* [ ] Address row appears with pin icon.
* [ ] Phone row appears with phone icon.
* [ ] Opening Hours row appears with clock icon.
* [ ] International Patients row appears with globe icon.
* [ ] Icons use consistent circular treatment.

## Data

* [ ] Service selector uses actual configured service data.
* [ ] Required fields cannot submit empty.
* [ ] Optional email can remain empty.
* [ ] Optional message can remain empty.
* [ ] Form prevents duplicate rapid submission while submitting.
* [ ] Submission errors are visible and recoverable.

---

# 26. Visual / Technical Risks

| Risk                                                         | Why it affects fidelity/functionality            | Mitigation                                         | Priority |
| ------------------------------------------------------------ | ------------------------------------------------ | -------------------------------------------------- | -------- |
| Form and clinic info implemented as separate cards           | Breaks supplied desktop composition              | One shared outer container                         | High     |
| Making every form field required                             | Conflicts with visible markers                   | Respect screenshot required states                 | High     |
| Service options hard-coded in frontend                       | CMS/service updates require deploy               | Reuse Strapi Service collection                    | High     |
| Service labels duplicated in Homepage CMS                    | Content can diverge                              | Use canonical service references                   | High     |
| Clinic address duplicated across pages                       | Inconsistent business information                | Prefer global Clinic Settings                      | High     |
| Phone input supports Vietnam only                            | Conflicts with international-patient positioning | Use structured country-aware component if approved | Medium   |
| Direct public write access to unrestricted Strapi collection | Security/data exposure risk                      | Secure submission endpoint/permissions             | High     |
| No server validation                                         | Public form easily abused                        | Validate server-side                               | High     |
| Submit can be clicked repeatedly                             | Duplicate leads                                  | Disable/lock during pending request                | High     |
| Logging full form data to analytics                          | Privacy risk                                     | Minimize personal-data logging                     | High     |
| Adding calendar/date controls                                | Unsupported by screenshot                        | Keep current form scope                            | High     |
| Placeholder used as label                                    | Accessibility issue                              | Keep persistent labels                             | High     |
| Mobile maintains 2-column form                               | Controls become too narrow                       | Stack at approved breakpoint                       | Medium   |

---

# 27. Open Questions

| ID  | Question                                                                           | Blocking level                    | Suggested owner              |
| --- | ---------------------------------------------------------------------------------- | --------------------------------- | ---------------------------- |
| Q1  | Where should consultation requests be submitted?                                   | Blocking                          | Backend / Product            |
| Q2  | Should submissions be stored in Strapi, another database, CRM or emailed only?     | Blocking                          | Solution Architect / Product |
| Q3  | What success-state UI/copy should appear after submission?                         | Blocking for complete UX          | Designer / Product           |
| Q4  | What error-state UI/copy should appear?                                            | Important                         | Designer                     |
| Q5  | Is Email intentionally optional?                                                   | Important validation confirmation | Product                      |
| Q6  | Is Message intentionally optional?                                                 | Important validation confirmation | Product                      |
| Q7  | Should the phone selector support all countries or a controlled subset?            | Product decision                  | Product                      |
| Q8  | Should Vietnam always be the default phone country?                                | Non-blocking                      | Product                      |
| Q9  | Are Preferred Service options sourced directly from the Strapi Service collection? | Architecture decision             | Developer                    |
| Q10 | Should inactive/non-bookable services be excluded from the dropdown?               | Data behavior                     | Product                      |
| Q11 | Should clinic contact details come from a global Strapi Clinic Settings singleton? | Architecture decision             | Developer                    |
| Q12 | Is anti-spam/captcha required?                                                     | Security decision                 | Product / Developer          |
| Q13 | Should Phone or Address on the right be clickable?                                 | Non-blocking                      | Product                      |
| Q14 | What is the approved tablet layout?                                                | Blocking for tablet               | Designer                     |
| Q15 | What is the approved mobile layout?                                                | Blocking for mobile               | Designer                     |

---

# 28. Strapi Handoff Summary

## Recommended content architecture

```text id="34kzz6"
Global Clinic Settings
├── clinicName
├── address
├── phone
├── openingHours
└── internationalPatientMessage


Service Collection
├── Service 01
├── Service 02
├── Service 03
└── ...


Homepage
└── Booking Section
    ├── formHeading
    ├── submitLabel
    ├── infoEyebrow
    ├── infoHeading
    └── infoDescription
```

The frontend combines these data sources.

---

# 29. Form Submission Contract

Conceptually:

```text id="1bhgks"
USER
  │
  ▼
Consultation Form
  │
  ├── fullName *
  ├── phone *
  ├── email
  ├── preferredService *
  └── message
  │
  ▼
Validation
  │
  ▼
Booking API / Submission Endpoint
  │
  ├── persist / forward lead
  ├── notify clinic
  └── return success/error
```

Do not bind form submission directly to the visual Strapi Homepage component.

---

# 30. CMS vs Frontend vs Backend Responsibility

| Responsibility        |     Strapi CMS     | Frontend |  Backend/API  |
| --------------------- | :----------------: | :------: | :-----------: |
| Section heading       |          ✅         |          |               |
| Clinic marketing copy |          ✅         |          |               |
| Address/phone/hours   | ✅ preferred global |          |               |
| Service records       |          ✅         |          |               |
| Render inputs         |                    |     ✅    |               |
| Client validation     |                    |     ✅    |               |
| Phone country UI      |                    |     ✅    |               |
| Service dropdown      |                    |     ✅    |               |
| Submit loading state  |                    |     ✅    |               |
| Server validation     |                    |          |       ✅       |
| Save booking lead     |                    |          |       ✅       |
| Spam/rate protection  |                    |          |       ✅       |
| Notifications         |                    |          |       ✅       |
| CRM integration       |                    |          | ✅ if required |

---

# 31. Mandatory Coding-Agent Rules

1. Create `home-booking` immediately after `home-articles`.
2. Use **one outer rounded panel**, not two separate cards.
3. Preserve desktop `form-left / clinic-info-right` composition.
4. Preserve vertical center divider.
5. Desktop form uses:

   * Full Name + Phone in row 1,
   * Email + Preferred Service in row 2,
   * Message full-width.
6. Required fields according to screenshot:

   * Full Name,
   * Phone Number,
   * Preferred Service.
7. Email and Message are optional unless Product confirms otherwise.
8. Phone field includes country/flag selection UI.
9. Preferred Service must be a dropdown/select.
10. Prefer canonical Strapi Service records as service options.
11. Do not hard-code duplicate service names inside Homepage configuration.
12. Prefer global Clinic Settings for address/phone/opening hours if already available.
13. `REQUEST CONSULTATION` is a semantic form-submit button.
14. Strapi controls editable content; frontend controls presentation/form state.
15. Booking submission requires a secure backend contract.
16. Do not expose privileged Strapi credentials in frontend.
17. Perform server-side validation.
18. Prevent duplicate submissions.
19. Do not add unsupported appointment date/time/calendar fields.
20. Do not silently make optional screenshot fields mandatory.
