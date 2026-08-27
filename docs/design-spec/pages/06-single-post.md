# Page Spec — About

**Figma node:** `10:48`  
**Visible source:** 550 × 1649 raster screenshot.

## Page goal
Build institutional trust: explain who Smilux is, mission/vision, values, team, featured services, differentiators and clinic credentials.

## Section inventory
**8 primary content sections** plus header/footer.

| # | Section | Layout | Key content |
|---|---|---|---|
| 0 | Header | global nav | logo, links, booking CTA |
| 1 | About hero | 2 columns | intro + dentist/patient clinic image |
| 2 | Mission & Vision | 2 cards | purpose + long-term vision |
| 3 | Core Values | 6 cards | integrity, expertise, compassion, innovation, personalization, excellence |
| 4 | Meet Our Doctors | 4-card carousel/grid | doctor profiles |
| 5 | Featured Services | 6 cards, 3×2 | major treatment categories |
| 6 | Why Choose Smilux | 6 icon cards | differentiators |
| 7 | Trust metric/accreditation band | horizontal | patients, years, satisfaction, bodies |
| 8 | Book a Consultation | 2 columns | form + clinic/contact card/image |
| 9 | Footer | global dark footer | links + contact |

## 1. Hero
### Desktop
- Left copy ~42–45%; right image ~55–58%.
- Large “About Smilux” / trust statement.
- Supporting paragraph kept narrow for readability.
- Three numeric metrics sit below the copy area.
- Right-side clinic image has rounded lower geometry and bright white-blue clinical lighting.

### Mobile
- Text/metrics first; image below.
- Metrics arranged 3 across if each label remains readable; otherwise 2+1.
- Hero image full width, ratio ~4:3.

## 2. Our Mission / Our Vision
### Desktop
- Two equal cards in one row.
- Each card contains a circular blue icon, label/headline and paragraph.
- Pale blue background or subtle clinic texture.
- Cards around 48–49% each with 20–24 px gap.

### Mobile
- Stack 1 column with 16 px gap.
- Preserve minimum 24 px internal padding.

## 3. Core Values
### Desktop
- 6 compact cards in one row in the reference.
- Consistent icon circle at top.
- Strong value title, short 2–3 line explanation.

### Recommended responsive grid
- ≥1280: 6 columns.
- 1024–1279: 3 columns × 2.
- 768–1023: 3 columns.
- <768: 2 columns; <420: 1 column.

## 4. Meet Our Doctors
### Desktop
- 4 doctor cards visible, with left/right carousel arrows.
- Portrait + name + specialty + credential bullets.
- Small circular CTA/icon at card bottom.

### Mobile
- 1.1 card carousel with CSS scroll snap.
- Keep arrows optional on touch, pagination dots preferred.

## 5. Featured Services
### Desktop
- 6 treatment cards arranged 3×2.
- Cards mix dental illustration/photo on left/top with title, short text and learn-more action.
- Approximately equal card widths.

### Mobile
- 2 columns down to 1 below ~480 px.
- Image thumbnail should not exceed ~35% of card visual weight on narrow screens.

## 6. Why Choose Smilux
### Desktop
- Light-blue section background.
- 6 icon feature cards/columns in one row.
- Emphasis is informational rather than promotional.

### Mobile
- 2-column grid; icon left + text right can be used below 420 px to reduce vertical length.

## 7. Trust Metrics / Accreditation Band
### Desktop
- Deep navy rounded rectangle.
- Left: tooth/brand visual.
- Middle: 3 headline metrics such as patients/years/satisfaction.
- Right: accreditation logos/abbreviations.
- High contrast white text and blue detail.

### Mobile
- Stack brand icon → metrics 3-column → accreditation logos.
- Avoid compressing all logos into one unreadable line.

## 8. Book a Consultation
### Desktop
- One rounded outer panel.
- Left form ~55–60%.
- Right clinic/contact information ~40–45%, with photo/background treatment.
- Primary button placed at bottom of the form.

### Mobile
- Single column.
- Clinic information follows form.

## Motion proposal
The Figma source has no native motion. Recommended:
- hero copy/image reveal on first load;
- value/service cards fade-up once per session as they enter viewport;
- doctor carousel uses 300 ms ease-out;
- stats may count up once;
- no continuous floating effects around medical imagery.
