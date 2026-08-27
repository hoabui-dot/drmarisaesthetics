# Page Spec — Home

**Figma:** frame `9:46`  
**Visible source composition:** 549 × 2696 raster-based reference  
**Recommended production desktop:** 1280–1440 viewport, centered content container 1180–1240 px.

## Page goal
Introduce the clinic, establish trust, present services/technology/doctors/results/social proof, and convert visitors into consultation bookings.

## Section inventory
Header and footer are global chrome. The Home page contains **11 primary content sections** between them.

| # | Section | Main layout | Primary content |
|---|---|---|---|
| 0 | Global header | horizontal nav | logo, menu, booking CTA |
| 1 | Hero | 2 columns ~48/52 | value proposition + chair/clinic image |
| 2 | Trust / clinic proof | split editorial + media/stat cards | trust message, metrics, team/clinic imagery |
| 3 | Comprehensive care | service-card row/grid | 5 service highlights |
| 4 | Technology | 2 columns | technology copy + OTI guided implant visual |
| 5 | Equipment showcase | dark band + cards | clinical equipment cards |
| 6 | Expert dentists | 4-card grid | doctor profiles |
| 7 | Certification / awards | logo strip + certificate cards | accreditations |
| 8 | Real stories / results | split content + before/after/patient media | smile transformations |
| 9 | Testimonials + press | review row + portrait + press logos | social proof |
| 10 | Featured articles | editorial cards/list | dental knowledge content |
| 11 | Consultation | 2-column conversion block | form + contact/expert info |
| 12 | Global footer | multi-column dark footer | links, contact, social, CTA |

---

## 0. Global Header
### Desktop
- Height target: 72–84 px.
- White background with subtle bottom divider or shadow only after scroll.
- Left: Smilux logo, about 100–120 px wide.
- Center/right: Home, About Us, Services, Technology, Pricing, Blog/Knowledge, Contact.
- Far right: primary blue `BOOK APPOINTMENT` button.
- Active item indicated by blue text and/or 2 px underline.

### Mobile
- 56–64 px header.
- Logo left, hamburger right.
- Booking CTA moves into drawer or remains as a compact icon/button if width permits.
- Sticky header recommended.

### Interaction
- Nav underline: 160–200 ms ease-out.
- Sticky header can fade in a soft shadow after 16–24 px scroll.

---

## 1. Hero
### Desktop layout
- Full-width light clinical background.
- 2-column grid: copy ~46–48%, hero imagery ~52–54%.
- Left content vertically centered.
- Right image uses a bright dental-chair / clinic scene and visually bleeds toward the right edge.
- Image should occupy roughly half the hero visual area without clipping key equipment/brand marks.

### Content hierarchy
1. small blue eyebrow;
2. H1: “Your Smile, Our Passion” style message;
3. short supporting paragraph;
4. CTA group: primary appointment + secondary watch/video or learn action;
5. small reassurance/social-proof line and/or metrics.

### Sizing recommendation
- H1: 56–64 px / 1.05–1.1 desktop.
- Body: 16–18 px / 1.6.
- Hero min-height: 620–720 px on large desktop.
- CTA height: 44–48 px.

### Mobile
- Single column.
- Copy first, image second.
- H1 38–44 px.
- CTA buttons either full width stacked or 2-column only above ~420 px.
- Hero image width 100%; recommended ratio around 4:3 or 5:4.
- Avoid preserving desktop decorative whitespace if it pushes CTA below the first screen.

### Motion
- Eyebrow → H1 → copy → CTA stagger: 60–90 ms gap.
- Hero image: opacity 0→1 + scale 1.03→1 over 550–650 ms.
- Respect reduced-motion.

---

## 2. Trusted Care / Proof Block
### Desktop
- Left editorial column around 35–40%.
- Right visual/stat composition around 60–65%.
- Visible design mixes team imagery and metric cards, giving this section a magazine-like layout instead of a plain equal-card grid.
- Maintain large whitespace and light-blue accents.

### Content units
- trust headline;
- explanatory paragraph/bullets;
- clinic/team visual;
- metric cards such as years, patients, procedures or satisfaction indicators.

### Mobile
- Reorder: headline → copy → primary team image → metrics 2×2.
- Keep metric cards compact; avoid complex masonry on narrow screens.

### Motion
- Count-up only for meaningful numeric metrics; stop at final values and do not loop.

---

## 3. Comprehensive Care for Your Perfect Smile
### Desktop
- Centered section title.
- 5 compact service cards across at large desktop.
- Each card: circular/line icon, short title, short description, subtle link/arrow.
- Cards are white with pale-blue border/shadow.

### Ratios
- Card width: ~18–19% of inner container with 16–20 px gaps.
- Icon area: ~20–25% of card height.

### Tablet / mobile
- 5 → 3 → 2 → 1 columns.
- On mobile, cards can become horizontally scrollable only if product requirements favor fast browsing; otherwise stack 1 column for accessibility.

### Hover
- translateY(-3 px), stronger soft shadow, icon accent intensifies.

---

## 4. Technology That Powers Precision Smiles
### Desktop
- Two-column layout ~40/60.
- Left: section label, heading, descriptive content, CTA, small feature/icon row.
- Right: large OTI guided implant technology card/photo inside a rounded light-blue container.
- Technology visual should remain dominant and occupy ~55–60% of the section width.

### Mobile
- Copy first; visual full width underneath.
- Keep technical feature icons in 2–3 column wrap.
- Do not shrink tiny labels to fit a single row.

### Motion
- Use subtle clip/opacity reveal on the technology visual.
- Avoid dramatic 3D motion in a medical context.

---

## 5. Equipment Showcase
### Desktop
- Deep navy full-width band.
- Four equipment cards in a row.
- White/light device photos against cards, with short labels underneath.
- High visual contrast separates this section from the light content around it.

### Mobile
- Horizontal snap carousel recommended: 1.1 cards visible to communicate scrollability.
- Keep device image ratio consistent, approximately 4:3.

---

## 6. Meet Our Expert Dentists
### Desktop
- Section heading + optional small “view all” action.
- 4 doctor profile cards.
- Portraits are tall/vertical, around 3:4 crop.
- Text includes doctor name, role/specialty, short credentials and a small CTA/social/contact icon.

### Mobile
- 1 card per view carousel or 1-column cards.
- Keep doctor portrait uncropped at face/hands.
- Do not reduce credential text below 14 px.

### Motion
- Carousel slide 280–360 ms.
- Card hover should remain restrained.

---

## 7. Certified. Recognized. Trusted.
### Desktop
- Accreditation logo row followed by certificate/award cards.
- Use consistent optical height rather than forcing every logo to the same raw dimensions.
- Certificate cards appear in a 5-column row in the reference.

### Mobile
- Logo rail can wrap 3–4 per row.
- Certificates: 2 columns then 1.

---

## 8. Real Stories. Real Smiles.
### Desktop
- Left: heading, copy, review/testimonial details and CTA.
- Right: before/after smile imagery and patient portrait.
- Media-heavy area should use ~55–65% of horizontal space.

### Recommended enhancement
Use an accessible before/after slider if approved by content/legal teams. Provide keyboard control and labels; do not rely only on drag.

### Mobile
- Text → before/after → patient story.
- Keep clinical image labels readable.

---

## 9. Testimonials + Press
### Desktop
- Testimonial cards in a row with star ratings and short quotes.
- Large patient portrait on the right or as a backdrop accent.
- Press-logo strip follows beneath.

### Mobile
- Reviews become a swipe carousel with visible pagination dots.
- Press logos wrap into a compact grid.
- Avoid auto-rotating reviews unless pause controls are provided.

---

## 10. Featured Articles
### Desktop
- Mixed editorial layout: one larger feature card + secondary list/cards.
- Images are dental/clinical portraits and smile imagery.
- Main article image recommendation: 16:10.
- Secondary thumbnails: 4:3 or square depending on list treatment.

### Mobile
- Stack feature card first, then article rows.
- Truncate descriptions to 2–3 lines, but keep full titles if possible.

---

## 11. Book a Consultation / Consult With Our Experts
### Desktop
- One large rounded container, approximately 50/50.
- Left: consultation form.
- Right: contact/expert information list.
- Primary form CTA anchors the lower-left portion.

### Form fields
- name;
- phone/email;
- service selector;
- optional message;
- primary booking/consultation action.

### Mobile
- Stack form first, contact details second.
- Inputs full width, min 44–48 px height.
- Keep 16 px minimum input font to prevent unwanted mobile browser zoom.

---

## 12. Footer
- Deep navy background.
- Logo and clinic statement left.
- 3–4 navigation/contact columns.
- Social icons.
- Appointment CTA.
- Copyright bar and optional back-to-top button.

### Mobile
- Use accordion groups for link columns if content becomes long.
- Social links remain visible without opening accordions.
