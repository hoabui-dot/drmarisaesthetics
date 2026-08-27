# UI Implementation Spec — Global Site Footer

## 1. Identity

| Field                       | Value                                                                                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | Global / shared across website                                                                                                                                                            |
| Section ID                  | `site-footer`                                                                                                                                                                             |
| Section name                | `Global Site Footer`                                                                                                                                                                      |
| Position                    | Final element after homepage content; visually follows `home-booking` on Homepage                                                                                                         |
| Component type              | Global persistent site component                                                                                                                                                          |
| CMS integration             | Strapi Global / Site Settings recommended                                                                                                                                                 |
| Primary implementation goal | Reproduce the supplied desktop footer while centralizing navigation, services, social links and clinic contact information so the same footer can be reused consistently across all pages |
| Overall evidence quality    | High for desktop layout/content hierarchy; Medium for exact colors/spacing; Low for mobile behavior                                                                                       |

> **Critical architecture rule:** This footer should **not** be stored as a Homepage-only section. It is a global website component and should preferably be driven by a Strapi singleton/global configuration such as `Site Settings`, `Footer Settings`, or equivalent.

> **Critical data rule:** Contact information such as address, phone and email should ideally come from the same canonical `Clinic Settings` / `Site Settings` source used elsewhere on the website. Do not independently hard-code another copy inside the footer.

> **Important content conflict requiring confirmation:** This screenshot shows a Jakarta, Indonesia address, while the previously supplied Booking section shows a Ho Chi Minh City, Vietnam address. Do not silently reconcile these two values. A single approved production clinic-information source must be confirmed.

---

# 2. Scope Boundary

## Included in this spec

* OBSERVED — Dark navy full-width footer background.
* OBSERVED — Smilux Dental Clinic logo/wordmark.
* OBSERVED — Introductory brand paragraph.
* OBSERVED — Four social-media icons:

  * Facebook,
  * Instagram,
  * YouTube,
  * TikTok.
* OBSERVED — `QUICK LINKS` navigation column.
* OBSERVED — `OUR SERVICES` navigation column.
* OBSERVED — `PATIENT INFO` navigation column.
* OBSERVED — `CONTACT US` information column.
* OBSERVED — Address row with location icon.
* OBSERVED — Phone row with phone icon.
* OBSERVED — Email row with mail icon.
* OBSERVED — `BOOK APPOINTMENT` CTA.
* OBSERVED — Horizontal divider above footer-bottom area.
* OBSERVED — Copyright text.
* OBSERVED — Right-side footer tagline:

  * `Designed with care for your smile.`
* OBSERVED — Circular back-to-top button with upward arrow.
* INFERRED — Navigation items should map to canonical routes rather than use free text only.
* INFERRED — Service links should preferably reference Strapi Service records.
* INFERRED — Contact information should be reused from global Clinic/Site settings.
* INFERRED — Social icon graphics should be frontend/design-system icons while URLs remain CMS-editable.

## Excluded from this spec

* UNKNOWN — exact hover animations.
* UNKNOWN — mobile accordion behavior.
* UNKNOWN — whether social links open new tabs.
* UNKNOWN — exact footer background token.
* UNKNOWN — exact back-to-top animation.
* UNKNOWN — whether `BOOK APPOINTMENT` scrolls to booking section or opens another route/modal.
* UNKNOWN — route targets for several navigation items.
* UNKNOWN — whether Patient Info pages currently exist.
* UNKNOWN — whether `All Services` links to a dedicated listing page.
* UNKNOWN — legal-content ownership for Privacy Policy / Terms of Service.

---

# 3. Evidence and Confidence

| Item                     | Status   | Evidence / reason                              |
| ------------------------ | -------- | ---------------------------------------------- |
| Footer background        | OBSERVED | Dark navy surface spans full width             |
| Desktop column structure | OBSERVED | Five visible information regions               |
| Logo/social region       | OBSERVED | Branding and four social icons clearly visible |
| Quick Links              | OBSERVED | Seven navigation items visible                 |
| Services links           | OBSERVED | Seven service-related items visible            |
| Patient Info             | OBSERVED | Five links visible                             |
| Contact information      | OBSERVED | Address, phone, email visible                  |
| Appointment CTA          | OBSERVED | Outlined large CTA visible                     |
| Footer divider           | OBSERVED | Horizontal separator visible                   |
| Copyright                | OBSERVED | Bottom-left text visible                       |
| Footer tagline           | OBSERVED | Bottom-center/right text visible               |
| Back-to-top control      | OBSERVED | Circular upward-arrow button visible           |
| Routes/URLs              | UNKNOWN  | Screenshot does not define destinations        |
| Exact color tokens       | INFERRED | Visual palette clear, exact values unavailable |
| Mobile layout            | UNKNOWN  | Desktop screenshot only                        |

---

# 4. OCR Content Inventory

## 4.1 Brand area

| Element ID              | Visible text                                                                                  | Type           | Confidence |
| ----------------------- | --------------------------------------------------------------------------------------------- | -------------- | ---------- |
| `footer-brand`          | `Smilux`                                                                                      | Logo / brand   | High       |
| `footer-brand-subtitle` | `DENTAL CLINIC`                                                                               | Brand subtitle | High       |
| `footer-description`    | `We're here to help you achieve a healthy, confident smile with advanced care you can trust.` | Paragraph      | High       |

---

## 4.2 Quick Links

Heading:

`QUICK LINKS`

Visible links:

1. `Home`
2. `About Us`
3. `Services`
4. `Technology`
5. `Smile Transformations`
6. `Blog`
7. `Contact`

Confidence: High.

---

## 4.3 Our Services

Heading:

`OUR SERVICES`

Visible links:

1. `Dental Implants`
2. `Teeth Whitening`
3. `Orthodontics`
4. `Dental Fillings`
5. `Root Canal Therapy`
6. `Cosmetic Dentistry`
7. `All Services`

Confidence: High.

---

## 4.4 Patient Info

Heading:

`PATIENT INFO`

Visible links:

1. `New Patients`
2. `Payment Options`
3. `Insurance`
4. `FAQs`
5. `Privacy Policy`
6. `Terms of Service`

Confidence: High.

---

## 4.5 Contact Us

Heading:

`CONTACT US`

### Address

```text
123 Sudirman No.123,
Jakarta 10220, Indonesia
```

Confidence: High.

### Phone

`+62 21 1234 5678`

Confidence: High.

### Email

`info@smiluxdental.com`

Confidence: High.

### CTA

`BOOK APPOINTMENT`

Confidence: High.

---

## 4.6 Bottom bar

Left:

`© 2024 Smilux Dental Clinic. All Rights Reserved.`

Right:

`Designed with care for your smile.`

Confidence: High.

---

# 5. Global Layout Anatomy

## 5.1 Main geometry

| Property              | Specification                                                 | Status   |
| --------------------- | ------------------------------------------------------------- | -------- |
| Width                 | Full viewport                                                 | OBSERVED |
| Background            | Deep navy blue                                                | OBSERVED |
| Desktop main layout   | Five logical columns/regions                                  | OBSERVED |
| Content container     | Centered with large horizontal gutters                        | INFERRED |
| Main vertical padding | Large                                                         | OBSERVED |
| Bottom divider        | Full/near-full container width                                | OBSERVED |
| Footer bottom row     | Copyright left + tagline right/center + back-to-top far-right | OBSERVED |

---

# 5.2 Structure tree

```text
Footer: site-footer
├── FooterMain
│   ├── BrandColumn
│   │   ├── Logo
│   │   ├── Description
│   │   └── SocialLinks
│   │       ├── Facebook
│   │       ├── Instagram
│   │       ├── YouTube
│   │       └── TikTok
│   │
│   ├── QuickLinksColumn
│   │   ├── Heading
│   │   └── Links[]
│   │
│   ├── ServicesColumn
│   │   ├── Heading
│   │   └── ServiceLinks[]
│   │
│   ├── PatientInfoColumn
│   │   ├── Heading
│   │   └── Links[]
│   │
│   └── ContactColumn
│       ├── Heading
│       ├── AddressItem
│       ├── PhoneItem
│       ├── EmailItem
│       └── BookAppointmentCTA
│
├── Divider
│
└── FooterBottom
    ├── Copyright
    ├── Tagline
    └── BackToTopButton
```

---

# 5.3 Desktop topology

```text
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│ SMILUX          QUICK LINKS       OUR SERVICES      PATIENT INFO    CONTACT US │
│ DENTAL CLINIC                                                                  │
│                 Home              Dental Implants   New Patients    📍 Address │
│ Brand text...   About Us          Teeth Whitening   Payment Options            │
│                 Services          Orthodontics      Insurance       ☎ Phone    │
│ ○ ○ ○ ○         Technology        Dental Fillings   FAQs                       │
│                 Smile Transform.  Root Canal        Privacy Policy  ✉ Email    │
│                 Blog              Cosmetic Dent.    Terms of Service            │
│                 Contact           All Services                    [BOOK APPT →] │
│                                                                               │
│ ───────────────────────────────────────────────────────────────────────────── │
│                                                                               │
│ © 2024 Smilux Dental Clinic...                Designed with care...       ↑    │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

# 6. Column Proportions

Approximate desktop distribution:

| Region         | Relative width | Status   |
| -------------- | -------------: | -------- |
| Brand / Social |      `~22–24%` | INFERRED |
| Quick Links    |      `~15–17%` | INFERRED |
| Our Services   |      `~17–18%` | INFERRED |
| Patient Info   |      `~15–17%` | INFERRED |
| Contact Us     |      `~22–25%` | INFERRED |

Do not force all five columns to identical widths.

The brand and contact columns visibly need more width than simple navigation columns.

---

# 7. Brand Column

## 7.1 Logo

* White/light Smilux wordmark.
* `DENTAL CLINIC` subtitle underneath.
* Positioned at upper-left.
* Must use approved logo asset rather than recreated plain text if source vector exists.

Recommended asset:

```text
footerLogoVariant = light / white
```

---

## 7.2 Description

Visible:

`We're here to help you achieve a healthy, confident smile with advanced care you can trust.`

* White/light text.
* Reduced opacity relative to headings.
* Multi-line.
* Limited width.

---

# 7.3 Social media

Visible:

```text
Facebook  Instagram  YouTube  TikTok
```

Each appears inside a small circular dark/translucent surface.

### Structure

```text
SocialLinks
├── SocialLink: facebook
├── SocialLink: instagram
├── SocialLink: youtube
└── SocialLink: tiktok
```

### CMS recommendation

Store:

```text
platform
url
```

Do not require editors to upload arbitrary social icons if the frontend already has a controlled icon library.

Preferred:

```text
platform = facebook
→ frontend resolves Facebook icon
```

This prevents inconsistent icon design.

---

# 8. Footer Navigation Columns

## 8.1 Shared column anatomy

```text
FooterLinkGroup
├── GroupHeading
├── DecorativeAccent / divider if applicable
└── Links[]
```

### Headings

* uppercase,
* white/light,
* stronger than links.

### Links

* softer white/gray.
* vertically stacked.
* consistent spacing.
* no visible bullets.

---

# 8.2 Quick Links

Recommended conceptual route mapping:

| Label                 | Destination | Status                  |
| --------------------- | ----------- | ----------------------- |
| Home                  | `/`         | INFERRED                |
| About Us              | UNKNOWN     | Route must be confirmed |
| Services              | UNKNOWN     | Route must be confirmed |
| Technology            | UNKNOWN     | Route must be confirmed |
| Smile Transformations | UNKNOWN     | Route must be confirmed |
| Blog                  | UNKNOWN     | Route must be confirmed |
| Contact               | UNKNOWN     | Route must be confirmed |

Do not hard-code route conventions without confirming existing application routing.

---

# 8.3 Our Services

This column should preferably derive from canonical Service entities.

Recommended:

```text
Footer Services
└── serviceLinks[]
      ↓ relation
    Service Collection
```

rather than repeating labels manually.

Visible items:

```text
Dental Implants
Teeth Whitening
Orthodontics
Dental Fillings
Root Canal Therapy
Cosmetic Dentistry
All Services
```

### Recommended architecture

First six:

* relations to individual Service records.

`All Services`:

* generic navigation link to services index.

---

# 8.4 Patient Info

These links are generic navigation/content pages and can be modeled as reusable link entries:

```text
New Patients
Payment Options
Insurance
FAQs
Privacy Policy
Terms of Service
```

Legal pages should preferably point to canonical CMS pages rather than store full legal copy in Footer settings.

---

# 9. Contact Column

## 9.1 Structure

```text
ContactColumn
├── Heading
├── Address
├── Phone
├── Email
└── AppointmentCTA
```

Each contact row uses:

```text
Icon + text
```

---

## 9.2 Address

Screenshot value:

```text
123 Sudirman No.123,
Jakarta 10220, Indonesia
```

### Important conflict

The earlier Homepage Booking screenshot showed:

```text
233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam
Ward 8,
Phu Nhuan District,
Ho Chi Minh City,
Vietnam
```

These conflict.

Therefore footer implementation must **not** hard-code the screenshot Jakarta address until Product confirms which clinic location is correct.

Preferred architecture:

```text
Global Clinic Settings.address
```

used by both:

* Booking section,
* Footer,
* Contact page,
* other location displays.

---

# 9.3 Phone

Screenshot:

`+62 21 1234 5678`

This also differs from the Booking-section screenshot phone:

`0866 251 379`

Requires the same single-source-of-truth confirmation.

If clickable behavior is approved:

```text
tel:
```

may be used.

---

# 9.4 Email

Screenshot:

`info@smiluxdental.com`

If clickable:

```text
mailto:
```

is appropriate.

Behavior is INFERRED, not directly evidenced by static screenshot.

---

# 9.5 Book Appointment CTA

Visible structure:

```text
[ BOOK APPOINTMENT            → ]
```

### Appearance

* large horizontal outlined button,
* transparent/dark footer background visible inside,
* pale blue/white border,
* white text,
* arrow at far-right,
* moderately rounded corners.

### Destination

UNKNOWN.

Possible destinations:

* booking form anchor on homepage,
* dedicated booking page,
* external scheduling system.

Do not assume.

---

# 10. Footer Bottom Bar

## 10.1 Divider

Thin horizontal line separates main footer content from bottom copyright region.

* low-contrast blue.
* nearly full container width.

---

# 10.2 Copyright

Visible:

`© 2024 Smilux Dental Clinic. All Rights Reserved.`

### Dynamic-year recommendation

The screenshot contains `2024`, but production should confirm whether year is intended to remain literal CMS text or update dynamically.

Preferred frontend approach:

```text
© {currentYear} Smilux Dental Clinic. All Rights Reserved.
```

if Product wants current-year behavior.

Do not silently change screenshot copy without approval for pixel comparison.

---

# 10.3 Tagline

Visible:

`Designed with care for your smile.`

* centered/right of copyright.
* smaller light text.
* visually secondary.

---

# 10.4 Back-to-top button

Visible:

```text
   ○
   ↑
```

### Appearance

* circular white/light button.
* dark/blue upward arrow.
* positioned at far-right of footer bottom.
* stands out strongly from dark background.

### Behavior

INFERRED:

```text
scroll page to top
```

Likely target:

```text
document top / header
```

Do not make this a normal route link.

---

# 11. Back-To-Top Interaction

Recommended behavior:

```text
Click
↓
Scroll to top
```

Smooth scrolling may be used if consistent with project behavior.

However exact animation is UNKNOWN.

Accessibility:

* semantic button,
* accessible name:

  * `Back to top`
* keyboard accessible.
* visible focus state.

Do not use only an unlabeled icon for assistive technologies.

---

# 12. Visual Specification

## 12.1 Colors

| Token candidate                 | Usage                | Description                 | Status   |
| ------------------------------- | -------------------- | --------------------------- | -------- |
| `color/footer/background`       | Footer surface       | Deep navy blue              | OBSERVED |
| `color/footer/heading`          | Column headings      | White / very light          | OBSERVED |
| `color/footer/text-primary`     | Main text            | Light gray/white            | OBSERVED |
| `color/footer/text-secondary`   | Body/link text       | Slightly muted white        | OBSERVED |
| `color/footer/divider`          | Horizontal separator | Dark/light blue low-opacity | OBSERVED |
| `color/footer/social-surface`   | Social icon circles  | Lighter/translucent navy    | OBSERVED |
| `color/footer/social-icon`      | Social icons         | White                       | OBSERVED |
| `color/footer/cta-border`       | Appointment CTA      | Pale blue/white             | OBSERVED |
| `color/footer/back-top-surface` | Back-to-top          | White                       | OBSERVED |
| `color/footer/back-top-icon`    | Arrow                | Blue/navy                   | OBSERVED |

Exact hex/RGB values are UNKNOWN.

---

# 12.2 Typography

| Element           | Weight              | Approx. size         | Status   |
| ----------------- | ------------------- | -------------------- | -------- |
| Brand logo        | Asset-defined       | N/A                  | OBSERVED |
| Column heading    | `500–600 estimated` | `14–16 px estimated` | INFERRED |
| Footer link       | `400–500 estimated` | `13–15 px estimated` | INFERRED |
| Brand description | `400 estimated`     | `13–15 px estimated` | INFERRED |
| Contact text      | `400–500 estimated` | `13–15 px estimated` | INFERRED |
| CTA               | `500–600 estimated` | `13–15 px estimated` | INFERRED |
| Bottom text       | `400 estimated`     | `12–14 px estimated` | INFERRED |

---

# 13. Asset Manifest

| Asset ID             | Description                         | Format        | Source                 | Status   |
| -------------------- | ----------------------------------- | ------------- | ---------------------- | -------- |
| `logo-smilux-footer` | White Smilux Dental Clinic wordmark | SVG preferred | Figma / official asset | OBSERVED |
| `icon-facebook`      | Facebook mark                       | SVG           | frontend icon library  | OBSERVED |
| `icon-instagram`     | Instagram mark                      | SVG           | frontend icon library  | OBSERVED |
| `icon-youtube`       | YouTube mark                        | SVG           | frontend icon library  | OBSERVED |
| `icon-tiktok`        | TikTok mark                         | SVG           | frontend icon library  | OBSERVED |
| `icon-location`      | Pin                                 | SVG           | frontend icon library  | OBSERVED |
| `icon-phone`         | Phone                               | SVG           | frontend icon library  | OBSERVED |
| `icon-email`         | Envelope                            | SVG           | frontend icon library  | OBSERVED |
| `icon-arrow-right`   | CTA arrow                           | SVG           | shared design system   | OBSERVED |
| `icon-arrow-up`      | Back-to-top arrow                   | SVG           | shared design system   | OBSERVED |

---

# 14. Component Contract

| Component             | Responsibility                  | Reusable? | Status                       |
| --------------------- | ------------------------------- | --------- | ---------------------------- |
| `SiteFooter`          | Full global footer              | Global    | OBSERVED / INFERRED          |
| `FooterBrand`         | Logo + description              | Yes       | INFERRED                     |
| `FooterSocialLinks`   | Social icons/URLs               | Yes       | INFERRED                     |
| `FooterLinkGroup`     | Generic heading + list of links | Yes       | OBSERVED                     |
| `FooterServicesGroup` | Service relations               | Yes       | INFERRED                     |
| `FooterContact`       | Contact information + CTA       | Yes       | OBSERVED                     |
| `FooterBottomBar`     | Copyright/tagline/back-to-top   | Yes       | INFERRED                     |
| `BackToTopButton`     | Scroll-to-top control           | Yes       | OBSERVED / INFERRED behavior |

---

# 15. Recommended Strapi Architecture

## 15.1 Global configuration

Preferred:

```text
Global Site Settings
├── branding
│   ├── footerLogo
│   └── footerDescription
│
├── socialLinks[]
│   ├── platform
│   └── url
│
├── contact
│   ├── address
│   ├── phone
│   ├── email
│   └── openingHours?
│
└── footer
    ├── quickLinks[]
    ├── serviceLinks[]
    ├── patientInfoLinks[]
    ├── appointmentCTA
    ├── copyrightText
    └── tagline
```

---

# 15.2 Better separation of shared data

Recommended architecture:

```text
Site Settings
├── Brand
├── Social Links
└── Clinic Contact


Footer Settings
├── Quick Links
├── Service Links
├── Patient Info Links
├── CTA
├── Copyright
└── Tagline
```

This avoids putting every global field into one oversized Footer component.

---

# 15.3 Generic Footer Link component

Recommended structure:

```text
navigation-link
├── label
├── linkType
├── internalPage/reference?
└── externalUrl?
```

If project architecture supports unified link components, reuse them.

Do not store only:

```text
label
urlString
```

if internal route references can be resolved safely from CMS entities.

---

# 15.4 Social-link component

Recommended:

| Field      | Type        | Required |
| ---------- | ----------- | -------: |
| `platform` | Enumeration |      Yes |
| `url`      | URL         |      Yes |

Allowed platform examples:

```text
facebook
instagram
youtube
tiktok
```

Frontend resolves the icon.

---

# 15.5 Footer services

Preferred:

```text
serviceLinks[]
    ↓ relation
Service Collection
```

This ensures:

```text
Dental Implants
Teeth Whitening
...
```

stay aligned with canonical service names/routes.

For `All Services`, use a generic navigation link.

---

# 16. CMS vs Frontend Responsibility

| Responsibility              |       Strapi       |      Frontend      |
| --------------------------- | :----------------: | :----------------: |
| Footer logo/media           |          ✅         |                    |
| Brand description           |          ✅         |                    |
| Social URLs                 |          ✅         |                    |
| Quick links                 |          ✅         |                    |
| Service selection           |          ✅         |                    |
| Patient info links          |          ✅         |                    |
| Contact data                | ✅ preferred global |                    |
| CTA label/destination       |          ✅         |                    |
| Copyright copy              | ✅ / dynamic option | ✅ year if approved |
| Tagline                     |          ✅         |                    |
| Column geometry             |                    |          ✅         |
| Background color            |                    |          ✅         |
| Typography                  |                    |          ✅         |
| Social icons                |                    |          ✅         |
| Contact icons               |                    |          ✅         |
| Arrow icons                 |                    |          ✅         |
| Responsive behavior         |                    |          ✅         |
| Back-to-top scroll behavior |                    |          ✅         |

---

# 17. Data Integrity Rules

## 17.1 Contact information

Do not maintain:

```text
BookingSection.address
Footer.address
ContactPage.address
Header.address
```

as independent values.

Preferred:

```text
ClinicSettings.address
      ↓
Booking
Footer
Contact Page
```

Same for:

* phone,
* email,
* opening hours.

---

# 17.2 Service links

Do not manually duplicate canonical service slugs.

Preferred:

```text
Service entity
├── title
└── slug

Footer
└── relation → Service
```

---

# 17.3 Legal links

Privacy Policy and Terms of Service should point to canonical legal-page records/routes.

Footer should not contain the legal body copy itself.

---

# 18. Interaction Specification

## Footer links

* normal navigation behavior.
* clear hover/focus state required.
* exact visual hover state UNKNOWN.

## Social links

If external:

* safe external-link behavior.
* exact new-tab policy must follow site convention.

## Appointment CTA

* semantic link/button based on confirmed destination.
* not a clickable `div`.

## Back to top

* semantic button.
* scrolls to page top.
* keyboard accessible.

---

# 19. Responsive Specification

## 19.1 Evidence

| Viewport | Evidence |
| -------- | -------- |
| Desktop  | High     |
| Tablet   | UNKNOWN  |
| Mobile   | UNKNOWN  |

---

# 19.2 Desktop required behavior

* five logical columns/regions.
* brand column widest on left.
* contact region wide enough for multi-line address.
* footer links stack vertically.
* social icons remain horizontal.
* bottom row stays separated by divider.

---

# 19.3 Proposed structural fallback

A plausible tablet/mobile layout could become:

```text
Brand

Quick Links
Our Services
Patient Info
Contact

Copyright / Tagline
```

or two-column groups.

Status: `UNKNOWN / INFERRED`.

Do not treat this as approved mobile design.

---

# 19.4 Mobile accordion

Footer accordion navigation is common, but there is **no evidence** for accordion behavior here.

Do not automatically introduce collapsible sections unless mobile design requires them.

---

# 20. Semantic HTML and Accessibility

## Footer landmark

Use semantic site footer landmark.

---

## Navigation columns

Quick Links, Services and Patient Info should use navigation/list semantics.

Where multiple nav landmarks exist, provide useful accessible labels conceptually such as:

* Footer quick links,
* Footer services,
* Patient information.

---

## Contact information

Use structured address/contact semantics where appropriate.

Phone/email can become semantic links if clickable behavior is approved.

---

## Social links

Every icon-only social link requires accessible naming:

```text
Facebook
Instagram
YouTube
TikTok
```

Do not expose only unlabeled SVG icons.

---

## Back to top

Accessible name:

```text
Back to top
```

Do not rely only on visual upward arrow.

---

## Contrast

All light text on dark navy must maintain adequate contrast.

Muted footer links must not become so low-opacity that readability fails.

---

# 21. Implementation Constraints

## Global architecture

* Footer is a shared global component.
* Do not duplicate footer configuration per page.
* Render footer after page content.
* Homepage should not own contact/service/social data exclusively.

## Layout

* Preserve dark navy full-width surface.
* Maintain five desktop regions.
* Do not force equal-width columns.
* Keep Brand and Contact columns wider.
* Preserve horizontal footer divider.
* Keep Back-to-top at far-right lower region.

## CMS

* Use global/site settings where possible.
* Reuse canonical Service records.
* Reuse global Clinic contact information.
* Social URLs are editable; icon styling remains frontend-owned.
* Do not expose CSS/layout properties to standard CMS editors.

## Content

* Do not silently replace Jakarta contact info with Vietnam or vice versa.
* Confirm approved production location first.
* Preserve visible link labels until Product provides route/content changes.

---

# 22. Visual Acceptance Criteria

## Overall

* [ ] Footer spans entire viewport width.
* [ ] Deep navy background matches reference.
* [ ] Footer appears as final page component.
* [ ] Main content aligns inside consistent site container.

## Brand

* [ ] White Smilux Dental Clinic logo appears.
* [ ] Brand description matches.
* [ ] Four social icons appear:

  * Facebook,
  * Instagram,
  * YouTube,
  * TikTok.
* [ ] Social icons use consistent circular treatment.

## Quick Links

* [ ] Heading reads `QUICK LINKS`.
* [ ] `Home` appears.
* [ ] `About Us` appears.
* [ ] `Services` appears.
* [ ] `Technology` appears.
* [ ] `Smile Transformations` appears.
* [ ] `Blog` appears.
* [ ] `Contact` appears.

## Services

* [ ] Heading reads `OUR SERVICES`.
* [ ] Dental Implants.
* [ ] Teeth Whitening.
* [ ] Orthodontics.
* [ ] Dental Fillings.
* [ ] Root Canal Therapy.
* [ ] Cosmetic Dentistry.
* [ ] All Services.

## Patient Info

* [ ] Heading reads `PATIENT INFO`.
* [ ] New Patients.
* [ ] Payment Options.
* [ ] Insurance.
* [ ] FAQs.
* [ ] Privacy Policy.
* [ ] Terms of Service.

## Contact

* [ ] Heading reads `CONTACT US`.
* [ ] Address icon/text row present.
* [ ] Phone icon/text row present.
* [ ] Email icon/text row present.
* [ ] Appointment CTA present.
* [ ] CTA reads `BOOK APPOINTMENT`.
* [ ] CTA includes right arrow.

## Footer bottom

* [ ] Horizontal separator appears.
* [ ] Copyright appears at bottom-left.
* [ ] `Designed with care for your smile.` appears.
* [ ] Circular Back-to-top button appears at far-right.
* [ ] Back-to-top button uses upward arrow.

---

# 23. Visual / Architecture Risks

| Risk                                          | Why it affects fidelity/maintenance          | Mitigation                            | Priority |
| --------------------------------------------- | -------------------------------------------- | ------------------------------------- | -------- |
| Footer implemented per page                   | Content becomes duplicated/inconsistent      | Global shared Footer component        | High     |
| Contact info duplicated in Footer             | Conflicts with Booking/Contact page          | Canonical Clinic Settings             | High     |
| Jakarta vs Ho Chi Minh City data conflict     | Production may show contradictory locations  | Product must confirm source of truth  | High     |
| Phone values differ between sections          | Reduces trust                                | Centralized clinic contact data       | High     |
| Service names manually duplicated             | Footer can diverge from Services page        | Use Service relations                 | High     |
| Social icons uploaded arbitrarily             | Visual inconsistency                         | Enum + frontend icon library          | Medium   |
| Equal-width grid                              | Brand/contact columns become too narrow      | Explicit column proportions           | High     |
| Logo recreated as text                        | Branding mismatch                            | Use official light logo asset         | High     |
| Mobile accordion invented                     | Unsupported interaction                      | Wait for mobile design                | Medium   |
| Low-opacity footer links                      | Accessibility issue                          | Check contrast                        | High     |
| Back-to-top implemented as link with `#` only | Potential focus/URL behavior issues          | Proper semantic button/scroll control | Medium   |
| Legal URLs hard-coded                         | Future CMS/legal route changes become harder | Canonical page references             | Medium   |

---

# 24. Open Questions

| ID  | Question                                                                              | Blocking level                         | Suggested owner     |
| --- | ------------------------------------------------------------------------------------- | -------------------------------------- | ------------------- |
| Q1  | Is the production clinic location Jakarta or Ho Chi Minh City?                        | **Blocking**                           | Product             |
| Q2  | Which phone number is canonical?                                                      | **Blocking**                           | Product             |
| Q3  | Should footer contact information be sourced from a global Clinic Settings singleton? | Architecture decision                  | Developer           |
| Q4  | What are exact internal routes for Quick Links?                                       | Blocking for navigation                | Developer / Product |
| Q5  | Should service links use direct relations to Strapi Service records?                  | Architecture decision                  | Developer           |
| Q6  | Where does `BOOK APPOINTMENT` navigate?                                               | Blocking for functionality             | Product             |
| Q7  | Should social links open in new tabs?                                                 | Non-blocking                           | Product             |
| Q8  | Are Privacy Policy and Terms of Service managed as Strapi pages?                      | Architecture/content decision          | Product / Developer |
| Q9  | Should copyright year stay literal or update automatically?                           | Non-blocking                           | Product             |
| Q10 | Does back-to-top use smooth scrolling?                                                | Non-blocking                           | Designer            |
| Q11 | What is the approved tablet layout?                                                   | Blocking for tablet                    | Designer            |
| Q12 | What is the approved mobile footer layout?                                            | Blocking for mobile                    | Designer            |
| Q13 | Should footer link columns collapse into accordions on mobile?                        | Blocking only if accordion is intended | Designer            |

---

# 25. Strapi Handoff Summary

## Recommended global data hierarchy

```text
Site Settings
├── Branding
│   ├── footerLogo
│   └── footerDescription
│
├── Clinic Contact
│   ├── address
│   ├── phone
│   └── email
│
├── Social Links[]
│   ├── platform
│   └── url
│
└── Footer Settings
    ├── quickLinks[]
    ├── services[]
    ├── patientInfoLinks[]
    │
    ├── appointmentCTA
    │   ├── label
    │   └── destination
    │
    ├── copyrightText
    └── tagline
```

---

# 26. Preferred Shared-Data Architecture

```text
                    GLOBAL DATA
                        │
        ┌───────────────┼─────────────────┐
        │               │                 │
        ▼               ▼                 ▼
 Clinic Settings    Service Collection  Site Settings
        │               │                 │
        │               │                 │
  address/phone     service names      social links
        │             + slugs            branding
        │               │
        └───────┐       │
                ▼       ▼
              FOOTER
```

The footer consumes canonical global content.

It should not become another independent content island.

---

# 27. Footer Desktop Handoff

```text
DARK NAVY BACKGROUND

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│ SMILUX       QUICK LINKS     OUR SERVICES      PATIENT INFO   CONTACT US │
│ DENTAL       Home            Dental Implants   New Patients   📍 Address │
│ CLINIC       About Us        Whitening         Payments                   │
│              Services        Orthodontics      Insurance      ☎ Phone    │
│ Brand text   Technology      Fillings          FAQs                       │
│              Transformations Root Canal        Privacy        ✉ Email    │
│ ○ ○ ○ ○      Blog            Cosmetic          Terms                      │
│              Contact         All Services                [BOOK APPT →]    │
│                                                                          │
│ ──────────────────────────────────────────────────────────────────────── │
│                                                                          │
│ © Smilux Dental Clinic                 Designed with care...         (↑) │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# 28. CMS vs Frontend Responsibility

| Responsibility       |       Strapi       | Frontend |
| -------------------- | :----------------: | :------: |
| Logo asset           |          ✅         |          |
| Brand description    |          ✅         |          |
| Quick-link content   |          ✅         |          |
| Service selection    |          ✅         |          |
| Patient info links   |          ✅         |          |
| Contact data         | ✅ preferred global |          |
| Social URLs          |          ✅         |          |
| CTA content          |          ✅         |          |
| Copyright/tagline    |          ✅         |          |
| Footer background    |                    |     ✅    |
| Column sizing        |                    |     ✅    |
| Link typography      |                    |     ✅    |
| Social/contact icons |                    |     ✅    |
| Responsive layout    |                    |     ✅    |
| Hover/focus states   |                    |     ✅    |
| Back-to-top behavior |                    |     ✅    |

---

# 29. Mandatory Coding-Agent Rules

1. Implement this as global `SiteFooter`, not a Homepage-only content section.
2. Footer renders after `home-booking` on Homepage.
3. Use one full-width deep navy surface.
4. Desktop structure contains:

   * Brand/Social,
   * Quick Links,
   * Our Services,
   * Patient Info,
   * Contact Us.
5. Do not force equal-width columns.
6. Use official white/light Smilux logo.
7. Social icons:

   * Facebook,
   * Instagram,
   * YouTube,
   * TikTok.
8. Prefer CMS social URLs + frontend-controlled icons.
9. Prefer canonical Service relations for service footer links.
10. Prefer global Clinic Settings for address, phone and email.
11. **Do not hard-code the Jakarta address until the conflict with the previously supplied Ho Chi Minh City booking data is resolved.**
12. Preserve `BOOK APPOINTMENT` outlined CTA.
13. Preserve horizontal divider above bottom bar.
14. Preserve copyright + footer tagline.
15. Implement the circular upward-arrow control as an accessible Back-to-top button.
16. Do not invent mobile accordion behavior.
17. Strapi controls editable global content; frontend controls geometry, styling, icons and scroll behavior.
