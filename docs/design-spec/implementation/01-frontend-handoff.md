# Page Spec — Contact

**Figma node:** `32:87`  
**Visible source:** 563 × 613 cropped raster screenshot.

## Important source note
The Contact reference is visibly cropped compared with the other full-page references. The supplied node ends after the location block; a footer is **not visible in this source crop**. For production consistency, reuse the global footer, but treat that as a normalization decision rather than a directly visible Contact-page element.

## Page goal
Make consultation contact frictionless and give users multiple contact channels, clinic details and map/location support.

## Section inventory
**4 visible content sections** plus header.

| # | Section | Layout |
|---|---|---|
| 0 | Header | Vietnamese nav in this screenshot |
| 1 | Contact hero | copy left, dentist/patient image right |
| 2 | Contact channels | 4 compact cards |
| 3 | Appointment / consultation | form left, clinic information right |
| 4 | Location | map left, address/directions right |

## 1. Contact Hero
### Desktop
- Left ~42%; right ~58%.
- Heading “Liên hệ Smilux”.
- Short line around consultation / booking / implant support.
- Supporting paragraph.
- Right uses rounded clinic consultation photo.

### Mobile
- Text first; image second.
- Hero image 16:10 or 4:3.

## 2. Contact Channels
Visible four cards:
1. Hotline
2. Address
3. Email
4. Working hours

### Desktop
- 4 equal cards in one row.
- Icon circle left/top, primary value in blue, supporting line below.

### Mobile
- 2×2 grid; 1 column below ~390 px.
- Phone and email values must be clickable.

## 3. Appointment / Consultation Block
### Desktop
- Large bordered rounded container.
- Left form ~55–60%; right clinic information card ~40–45%.

### Form fields visible
- name;
- phone number;
- email;
- service selector;
- clinic selector;
- consultation details textarea;
- consent/check option;
- strong full-width blue submit button.

### Clinic information side
- intro text;
- doctor/contact advisor card;
- hotline 24/7;
- Zalo;
- WhatsApp;
- email;
- small reassurance/implant consultation note.

### Mobile
- Single column: form first, clinic information second.
- Keep all labels visible; placeholders do not replace labels.
- Buttons and fields ≥44–48 px height.

## 4. Location
### Desktop
- Map ~56%; textual location card ~44%.
- Map marker labels clinic.
- Right side: address, transport/parking notes and Google Maps directions CTA.

### Mobile
- Textual address first so the location remains understandable before the embedded map loads.
- Map 16:9.

## Language issue
This reference uses Vietnamese navigation/content while other supplied screens are primarily English. See `architecture/03-open-issues.md` for the recommended localization decision.

## Motion
- Map marker can use one subtle entrance pulse only; do not loop continuously.
- Form success/error states use short 160–240 ms transitions.
- No animation should delay form submission feedback.
