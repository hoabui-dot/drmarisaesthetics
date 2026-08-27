# Page Spec — Services Overview

**Figma node:** `35:7`  
**Visible source:** 549 × 1167 raster screenshot.

## Page goal
Give visitors an overview of dental services, explain quality differentiators and drive appointment booking.

## Section inventory
**4 primary content sections** plus header/footer.

| # | Section | Layout | Notes |
|---|---|---|---|
| 0 | Header | global | Services active |
| 1 | Hero | 2 columns | headline/CTA + dental room |
| 2 | Explore Our Services | card grid | 10 service cards |
| 3 | Why Choose Smilux | 5 icon columns | trust factors |
| 4 | Ready For Your Best Smile? | banner | booking CTA + reception image |
| 5 | Footer | global | dark navy |

## 1. Hero
### Desktop
- Copy side ~48–52%, image side ~48–52%.
- Large headline: comprehensive dental care.
- Supporting paragraph 2–4 lines.
- Two actions: primary `BOOK APPOINTMENT`, secondary `WATCH VIDEO`.
- Right image: bright modern dental chair and instruments.
- Hero visual should touch/bleed toward right boundary while copy aligns to content grid.

### Mobile
- Copy first.
- CTA group stacks below 400–420 px.
- Image below copy, 4:3 recommended.

## 2. Explore Our Services
### Content
The design shows **10 cards**:
1. Dental Implants
2. Cosmetic Crowns
3. Orthodontics
4. Teeth Cleaning
5. Tooth Extraction
6. Root Canal Treatment
7. Tooth Filling
8. Dental Jewelry
9. Teeth Whitening
10. Pediatric Dentistry

### Desktop
- 5 columns × 2 rows.
- Image occupies around 55–60% of card top area.
- Card text: title, compact description, `LEARN MORE` link.
- Card radius ~14–18 px; light border/shadow.

### Responsive
- ≥1280: 5 columns.
- 1024–1279: 4/3 columns depending container.
- 768–1023: 2 columns.
- <600: 1 column, or 2 only if cards become compact horizontal cards.

### Image ratio
- Treatment thumbnails: 4:3 or 1:1 crop.
- Use `object-fit: cover` and protect focal medical detail from cropping.

## 3. Why Choose Smilux
### Desktop
- Pale blue rounded section.
- 5 evenly distributed feature items:
  - experienced dentists;
  - advanced technology;
  - personalized treatment;
  - patient comfort;
  - proven results.
- Icon circle above title.

### Mobile
- 2 columns → 1 below ~400 px.
- Do not center long paragraphs if they exceed 3 lines; left-align body text on mobile.

## 4. Conversion Banner
### Desktop
- Deep blue gradient/photo banner.
- Left: `Ready for Your Best Smile?`, short supportive copy, white CTA button.
- Right: clinic reception image.
- Text side ~48%, image side ~52%.
- Banner ratio roughly 16:4.5–16:5.

### Mobile
- Stack with text first; image can become 16:9 below or be used as low-opacity background.
- CTA full width if viewport <420 px.

## Motion proposal
- Hero image: gentle fade/scale.
- Service cards: viewport stagger, 40–60 ms between cards.
- Card hover: translateY(-3 px), image scale 1.02 maximum.
- CTA banner: no parallax on mobile; optional subtle background position shift on large desktop only.
