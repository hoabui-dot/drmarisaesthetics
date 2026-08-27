# UI Implementation Prompt — Dental Implant Pricing + FAQ + Consultation / Contact

## 1. Task Context

Continue implementing the final **three sections** of the reusable Dental Implants service-detail page:

1. `Dental Implant Pricing`
2. `Frequently Asked Questions`
3. `Ready to Restore Your Smile?` consultation/contact section

Use the supplied screenshot as the primary source of truth for:

* desktop layout;
* card proportions;
* section spacing;
* typography hierarchy;
* pale-blue borders;
* rounded corners;
* blue/navy Smilux visual language;
* CTA placement;
* FAQ accordion layout;
* form/contact/map proportions.

Where small text cannot be read reliably, use the content supplied below.

All content should remain configurable and must not be hard-coded into presentation components.

---

# 2. Section A — Dental Implant Pricing

## Section Layout

Heading:

**Dental Implant Pricing**

Desktop structure:

* One large rounded outer container.
* White background.
* Pale-blue `1px estimated` border.
* Approximately `14–16px estimated` outer radius.
* Heading horizontally centered.
* Directly below heading, render **4 pricing cards in one row**.
* Cards should have equal visible height.
* The second card is visually emphasized as **MOST POPULAR**.
* Add one centered financing note below the card row.

Reference:

`Single Implant | Implant + Crown | Full-Arch Implant | Consultation`

Use approximately `20–26px estimated` gaps between cards.

---

# 3. Pricing Card 1 — Single Implant

**Title**

Single Implant

**Subtitle**

Implant + Abutment + Crown

**Price**

$1,450

**Price qualifier**

Starting from

### Included features

* 3D Scan & Planning
* Implant Placement
* Custom Crown

**CTA**

Book Consultation →

### Visual requirements

* White card.
* Pale-blue border.
* Rounded corners approximately `12–14px estimated`.
* Center-aligned heading/pricing.
* Feature list left-aligned in lower card area.
* Small blue check icon before every feature.
* Blue filled CTA button at bottom.
* Button nearly full card width with horizontal inset.

---

# 4. Pricing Card 2 — Most Popular

This is the visually featured card.

### Badge

**MOST POPULAR**

Render the badge as a solid blue strip attached to or visually overlapping the top edge of the card.

### Content

**Title**

Implant + Crown

**Subtitle**

Complete Tooth Replacement

**Price**

$1,850

**Price qualifier**

Starting from

### Included features

* Everything in Single Implant
* Abutment & Crown
* 1-Year Restoration Warranty

**CTA**

Book Consultation →

### Visual requirements

* Slightly stronger blue border than other cards.
* Blue `MOST POPULAR` top badge.
* Same width/height family as neighboring cards.
* Do not dramatically enlarge the card.
* Use the same internal structure as the other pricing cards.
* Keep the CTA aligned with the CTA row of the remaining cards.

### Production note

The warranty wording is inferred/seed content from the reference. Keep it configurable and do not publish a warranty claim until approved by product/clinic operations.

---

# 5. Pricing Card 3 — Full-Arch Implant

**Title**

Full-Arch Implant

**Subtitle**

All-on-4 / All-on-6

**Price**

$14,900

**Price qualifier**

Starting from

### Included features

* Full-Arch Restoration
* Premium Materials
* 5-Year Restoration Warranty

**CTA**

Book Consultation →

Again, treat warranty and price as configurable design seed data until approved.

---

# 6. Pricing Card 4 — Consultation

**Title**

Consultation

**Subtitle**

Comprehensive Evaluation

**Price**

FREE

### Included features

* 3D Scan Assessment
* Personalized Treatment Plan
* No Obligation

**CTA**

Book Now

### Visual treatment

* Same card style as the first/third cards.
* `FREE` should have strong visual weight similar to numerical pricing.
* CTA uses the same blue style.
* Do not introduce another price or hidden fee into the UI.

---

# 7. Pricing Footer Note

Centered immediately under the four pricing cards:

**Flexible financing options available. Ask our team for details.**

Use:

* small muted navy/slate text;
* centered alignment;
* compact top/bottom spacing.

Do not add financing logos or loan-provider branding unless they already exist in the project.

---

# 8. Pricing Data Rules

Pricing must be rendered from structured configuration such as:

* plan name;
* subtitle;
* price;
* qualifier;
* features;
* CTA label;
* popular state;
* warranty/content labels.

Do not embed `$1,450`, `$1,850`, or `$14,900` directly inside reusable components.

These values should be treated as **design/reference seed pricing** until confirmed.

If a CMS/config already contains current pricing, use the canonical current values instead.

---

# 9. Section B — Frequently Asked Questions

## Layout

Heading:

**Frequently Asked Questions**

Desktop:

* Large rounded outer container.
* Same width as pricing section.
* Pale-blue border.
* White background.
* Approximately `14–16px estimated` radius.
* Heading aligned top-left.
* FAQ items arranged as **2 columns × 3 rows**.

Reference:

| Left                                    | Right                             |
| --------------------------------------- | --------------------------------- |
| Do dental implants hurt?                | Am I too old for dental implants? |
| How long does the implant process take? | What is the recovery time?        |
| How long do dental implants last?       | How much do dental implants cost? |

Each FAQ item:

* white/light surface;
* thin pale-blue border;
* rounded rectangle;
* question aligned left;
* small blue `+` icon aligned right;
* compact height.

---

# 10. FAQ Interaction

Implement a real accordion.

Default screenshot state:

* all questions collapsed.

Interaction:

* clicking a row toggles that answer;
* `+` becomes `−` or rotates according to the existing project accordion pattern;
* expanded answer appears directly below the question within the same item;
* animation should only use an existing project accordion transition if available.

Preferred behavior:

* multiple items may remain open unless the project's existing accordion convention enforces one-at-a-time behavior.

Do not navigate away from the page.

Use semantic buttons for accordion triggers.

---

# 11. FAQ Seed Answers

The screenshot only clearly establishes the questions. Use the following concise research-backed answers.

Do **not render the research citations inside the website UI**; they are provided here only to support the content direction.

---

## FAQ 1 — Do dental implants hurt?

**Answer**

Implant placement is performed with local anesthesia, so the treatment area is numb during the procedure. Some soreness, swelling, or tenderness can occur afterward and varies from patient to patient. Your dentist will provide aftercare instructions and appropriate pain-management guidance.

Cleveland Clinic describes anesthesia during placement and notes that postoperative discomfort may occur after the procedure.

---

## FAQ 2 — How long does the implant process take?

**Answer**

The timeline depends on your oral health, number of implants, and whether procedures such as bone grafting are needed. Implant integration with the jawbone commonly takes several months before the final restoration can be completed.

The ADA notes that osseointegration can take up to several months, while Cleveland Clinic describes a healing period that may range from roughly three to nine months depending on the individual case.

---

## FAQ 3 — How long do dental implants last?

**Answer**

With good oral hygiene, regular dental visits, and appropriate maintenance, the implant itself can last for many years and may last a lifetime. The crown, bridge, or other restoration attached to the implant may eventually require replacement.

Cleveland Clinic distinguishes between the long lifespan of the implant and the potentially shorter lifespan of the restoration.

---

## FAQ 4 — Am I too old for dental implants?

**Answer**

Age alone does not determine whether someone can receive dental implants. Overall health, gum health, bone condition, medications, and healing ability are usually more important factors. A clinical evaluation is required to determine suitability.

The ADA specifically notes that general health is more important than age when determining implant suitability.

---

## FAQ 5 — What is the recovery time?

**Answer**

Initial soft-tissue recovery often takes around a week, while the implant continues integrating with the jawbone for several months. Recovery varies depending on the procedure and individual healing response.

Cleveland Clinic describes an initial healing period of about one week followed by a longer osseointegration phase.

---

## FAQ 6 — How much do dental implants cost?

**Answer**

Cost depends on the number of implants, restoration type, diagnostic imaging, materials, and whether additional procedures such as bone grafting are required. The pricing above provides starting reference amounts; a consultation is required for an individualized treatment estimate.

Do not promise a final treatment price from the accordion.

---

# 12. FAQ Accessibility

Each FAQ item should use:

* semantic button trigger;
* `aria-expanded`;
* relationship between trigger and answer panel;
* keyboard activation;
* visible focus state.

Do not use a clickable `div`.

The plus/minus icon is decorative and should not be the only mechanism communicating accordion state.

---

# 13. Section C — Ready to Restore Your Smile?

This is the final consultation/contact section.

## Overall Layout

Use one large rounded bordered container.

Desktop composition:

`Consultation Form | Contact Information | Map`

Approximate proportions:

* form region: `~50%`;
* contact details: `~20%`;
* map: `~27–30%`.

Keep all three regions in one horizontal composition at the reference desktop viewport.

---

# 14. Section Heading

At the upper-left of the form region, reproduce the small blue square section indicator visible in the reference.

**Indicator**

`12`

Immediately to its right:

**Heading**

Ready to Restore Your Smile?

**Subtitle**

Book a consultation with our implant specialists today.

### Styling

Indicator:

* solid Smilux blue;
* white `12`;
* small rounded-square shape.

Heading:

* bold deep navy;
* approximately `25–28px estimated`.

Subtitle:

* smaller muted navy/slate.

---

# 15. Consultation Form

Use a compact two-column form.

### Row 1

**Full Name**

Placeholder:

`Your full name`

**Phone Number**

Placeholder:

`Enter your phone number`

### Row 2

**Email Address**

Placeholder:

`Enter your email`

**Preferred Service**

Default placeholder:

`Select a service`

### Row 3

Full-width textarea.

**Your Message**

Placeholder:

`Tell us about your concerns or any questions you have.`

### CTA

**BOOK CONSULTATION →**

Use a small consultation/calendar/medical icon before the text if a matching existing project icon exists.

---

# 16. Form Visual Requirements

* Inputs use white background.
* Thin pale-gray / pale-blue borders.
* Approximately `7–9px estimated` input radius.
* Compact labels above fields.
* Two equal-width fields per desktop row.
* Textarea spans the complete form width.
* CTA is blue.
* CTA is content-width / medium width, not necessarily full form width.
* Preserve compact spacing from the screenshot.

Do not add extra fields such as:

* date picker;
* insurance;
* address;
* age;
* medical history

unless they already exist in the product requirements.

---

# 17. Preferred Service Options

Seed the dropdown using existing service-detail data rather than a hard-coded isolated list.

Possible options:

* Dental Implants
* Cosmetic Crowns
* Orthodontics
* Teeth Cleaning
* Tooth Extraction
* Root Canal Treatment
* Tooth Filling
* Teeth Whitening
* Pediatric Dentistry

When this form appears on the Dental Implants detail page, pre-selecting or prioritizing `Dental Implants` is acceptable if that matches the existing form architecture.

---

# 18. Contact Information Region

Display four vertically stacked information groups.

## Visit Us

For the screenshot/reference seed:

**233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam**

If the existing Smilux project already has a canonical clinic address, **reuse the canonical global contact data instead of introducing conflicting duplicated data**.

## Hotline

Prefer the site's canonical hotline.

If none is configured yet, use the existing Smilux project seed value rather than inventing a new number.

## Email

Prefer the site's canonical email.

Recommended project fallback based on the existing Smilux content:

**[info@smiluxdental.vn](mailto:info@smiluxdental.vn)**

## Working Hours

**Mon – Sun: 8:30 AM – 7:00 PM**

### Styling

Labels:

* blue;
* semi-bold/bold.

Values:

* dark navy/slate;
* smaller body size;
* multiline where needed.

Use generous separation between each contact group.

---

# 19. Map Panel

The right side contains a simplified map card.

Visual requirements:

* landscape rectangle;
* rounded corners approximately `12–14px estimated`;
* pale/light street map;
* large blue Smilux location pin near center;
* text label `Smilux Dental` below or near the pin;
* no excessive map controls visible in the screenshot.

---

# 20. Internet Map / Image Research

Research a real internet map source rather than leaving a blank placeholder.

### Preferred development source

Use **OpenStreetMap standard raster map imagery** or an exported OpenStreetMap static map.

OpenStreetMap documents both raster tile providers and static image export capabilities.

Internet source references:

[OpenStreetMap raster tile provider reference](https://wiki.openstreetmap.org/wiki/Raster_tile_providers?utm_source=chatgpt.com)

[OpenStreetMap map export reference](https://wiki.openstreetmap.org/wiki/Export?utm_source=chatgpt.com)

For a production implementation using live OSM tiles, respect their usage policy and attribution requirements.

### Development map center

For the screenshot's Bùi Viện address, use the **Bùi Viện / Phạm Ngũ Lão area** as a temporary visual map center.

A public source places Bùi Viện Walking Street around:

* latitude: `10.7674`
* longitude: `106.6940`

This coordinate is for the **Bùi Viện vicinity**, not a verified Smilux clinic coordinate.

Do not present it as the exact clinic location in production.

Before production:

1. retrieve the clinic's canonical coordinates from the project/CMS/business data;
2. update the map center;
3. update the marker;
4. verify address/coordinates match.

---

# 21. Map Asset Strategy

Preferred implementation order:

### Option A — Existing project map component

Use it if already available.

### Option B — OpenStreetMap / Leaflet

Use a light map style with:

* custom blue Smilux pin;
* correct attribution;
* no unnecessary controls.

### Option C — Static internet map image

Export a PNG/WebP map from OpenStreetMap with the clinic area and add the branded pin as an overlay.

This option is closest to the visually static map shown in the screenshot.

Do not use:

* unrelated city maps;
* generic map placeholder boxes;
* a screenshot with another business pin;
* watermarked map imagery;
* fabricated exact coordinates.

---

# 22. Map Pin

Create/reuse a branded location marker:

* vivid Smilux blue;
* standard map-pin silhouette;
* white center/inner circle if matching the reference;
* label `Smilux Dental`.

Prefer SVG for the pin.

The label can be rendered as UI text overlay rather than baked into the map image.

---

# 23. Form Behavior

Keep form behavior compatible with the existing project consultation/contact system.

Required fields should be based on existing backend validation.

Do not invent:

* API endpoints;
* CRM integrations;
* email-delivery logic;
* success modals;
* CAPTCHA

unless they already exist.

If an existing consultation form API is available in the codebase, reuse it.

---

# 24. Reusable Component Structure

Recommended conceptual components:

### Pricing

* `ServicePricingSection`
* `PricingCard`
* `PricingFeatureList`

### FAQ

* `ServiceFaqSection`
* `FaqAccordion`
* `FaqItem`

### Consultation / Contact

* `ServiceConsultationSection`
* `ConsultationForm`
* `ClinicContactInfo`
* `ClinicMap`

All three should be reusable across service-detail pages.

---

# 25. Data Architecture

## Pricing

Configure:

* title;
* subtitle;
* price;
* price qualifier;
* features;
* popular flag;
* badge text;
* CTA.

## FAQ

Configure:

* question;
* answer.

FAQ content may be:

* global implant FAQ;
* service-specific FAQ.

## Contact

Prefer global/shared clinic data:

* address;
* phone;
* email;
* working hours;
* latitude;
* longitude.

Do not duplicate contact information separately across every service page.

---

# 26. Responsive Behavior

Only desktop is evidenced directly by the screenshot.

## Desktop — Required

### Pricing

* 4 cards in one row.
* Second card retains `MOST POPULAR` treatment.

### FAQ

* 2 columns × 3 rows.

### Contact

* form + contact information + map remain in one horizontal section.

---

## Tablet — Inferred

### Pricing

Prefer:

`2 columns × 2 rows`

### FAQ

Keep 2 columns if space permits; otherwise one column.

### Contact

Possible:

`Form`
then
`Contact info | Map`

---

## Mobile — Inferred

### Pricing

* one pricing card per row.

### FAQ

* one full-width accordion column.

### Contact

Stack:

1. heading;
2. form;
3. contact information;
4. map.

Do not use tiny side-by-side form fields if readability suffers.

---

# 27. Accessibility

## Pricing

* Pricing plans should use semantic headings.
* Feature check icons are decorative.
* `MOST POPULAR` must also exist as readable text, not color alone.

## FAQ

* Semantic accordion buttons.
* Keyboard accessible.
* Expose expanded/collapsed state.

## Form

* Every input needs a visible and programmatically connected label.
* Do not rely on placeholder as the only label.
* Errors must be linked to affected inputs when validation exists.

## Map

* Do not rely on map imagery as the only source of location information.
* Keep full textual address visible beside the map.
* Decorative pin icon can be hidden from screen readers when address is already supplied.

---

# 28. Visual Acceptance Criteria — Pricing

* [ ] `Dental Implant Pricing` is centered like the reference.
* [ ] One rounded outer container wraps the complete pricing module.
* [ ] Exactly 4 pricing cards appear in the desktop row.
* [ ] All cards have equal visible height.
* [ ] Second card has a blue `MOST POPULAR` strip.
* [ ] `$1,450`, `$1,850`, `$14,900`, and `FREE` use strong visual hierarchy.
* [ ] Feature lists use consistent blue checks.
* [ ] CTA buttons align across cards.
* [ ] Financing message is centered below the row.
* [ ] No unsupported pricing package is introduced.

---

# 29. Visual Acceptance Criteria — FAQ

* [ ] `Frequently Asked Questions` aligns top-left.
* [ ] Six FAQ questions render.
* [ ] Desktop layout uses exactly 2 columns × 3 rows.
* [ ] All items use equal visual height while collapsed.
* [ ] Blue `+` controls align to the right edge.
* [ ] Answers expand inside their corresponding item.
* [ ] No page navigation occurs when opening an FAQ.
* [ ] FAQ content remains editable from data/config.

---

# 30. Visual Acceptance Criteria — Consultation / Contact

* [ ] Final section aligns horizontally with pricing/FAQ containers.
* [ ] Blue `12` marker appears beside the heading.
* [ ] `Ready to Restore Your Smile?` matches reference hierarchy.
* [ ] Form uses two-column desktop rows.
* [ ] Textarea spans full form width.
* [ ] `BOOK CONSULTATION →` CTA appears below the form.
* [ ] Contact information is positioned between form and map.
* [ ] Visit Us, Hotline, Email, and Working Hours appear as four clear groups.
* [ ] Map occupies the right side.
* [ ] Map uses actual internet map imagery rather than an empty placeholder.
* [ ] Custom blue Smilux pin appears near the center.
* [ ] Map card radius matches the design.
* [ ] Contact data is sourced from shared/canonical configuration where available.
* [ ] No fabricated clinic coordinates are shipped to production.

---

# 31. Important Implementation Constraints

Do not:

* hard-code current pricing into reusable UI components;
* treat design prices as permanently approved prices;
* publish inferred warranty terms without approval;
* invent additional pricing cards;
* add a pricing toggle/monthly billing UI;
* convert FAQ into separate pages;
* add FAQ questions not requested;
* introduce new form fields;
* fabricate clinic contact details when shared project data exists;
* leave the map as a blank placeholder;
* claim the temporary Bùi Viện coordinate is the verified Smilux clinic location;
* use an unrelated map screenshot;
* add unsupported booking/payment functionality.

The final page sequence should remain:

`Dental Implant Pricing`
→ `Frequently Asked Questions`
→ `Ready to Restore Your Smile?`

These are the **final three sections** of the Dental Implants service-detail page.
