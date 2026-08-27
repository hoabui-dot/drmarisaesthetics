# 03 — Figma Homepage → Existing Code Section Matrix

## Target order

```text
Global Header
1. Hero
2. Trusted Care / Proof
3. Comprehensive Care / Services
4. Technology
5. Equipment Showcase
6. Expert Dentists
7. Certifications / Awards
8. Real Stories / Results
9. Testimonials + Press
10. Featured Articles
11. Consultation
Global Footer
```

## Migration matrix

| Target section | Existing implementation | Action | CMS action | Frontend action |
|---|---|---|---|---|
| Header | `layout/Header.tsx` | Rewrite visuals | keep Navigation | simplify styles/motion |
| Hero | `HeroBlock.tsx` | Rewrite | extend hero fields | make LCP-critical |
| Trusted Care / Proof | `TrustSection.tsx` partially | New semantic block | add `proof-showcase` | add `HomeProofSection.tsx` |
| Services | `ServicesBlock.tsx` | Rewrite | align services schema | compact 5-col target |
| Technology | none | Add | `technology-feature` | new section |
| Equipment | none | Add | `equipment-showcase` | new section |
| Doctors | `DoctorSection.tsx` | Rewrite | minor optional fields | equal 4-card layout |
| Certifications | `CertificationSection.tsx` | Rewrite | mostly keep | compact strip/cards |
| Real Stories / Results | `CombinedTestimonialResult.tsx` | Refactor/rewrite | existing result data can seed | accessible before-after |
| Testimonials + Press | no exact block | Add | `social-proof` | new review + logo section |
| Featured Articles | `BlogCollectionSection.tsx` | Rewrite | keep/extend featured semantics | editorial mixed grid |
| Consultation | booking infra + generic CTA | Add section | `consultation` presentational content | reuse booking submission/form logic |
| Footer | `layout/Footer.tsx` | Major rewrite | keep Footer content type | deep navy multi-column |

---

# Detailed target specifications

## Header

### Desktop
- 72–84px visual height.
- Clean white surface.
- Logo ~100–120px visual width.
- Nav occupies center/right.
- Primary solid blue booking CTA.
- Active nav: blue text and/or 2px underline.
- Scroll state: only subtle divider/shadow.

### Mobile
- 56–64px.
- Logo left, hamburger right.
- Booking available in drawer and/or persistent compact CTA depending on existing business behavior.
- Preserve keyboard/focus behavior.

### Remove from current visual language
- logo card shadow;
- header glassmorphism as default;
- shimmer/ping CTA;
- unnecessary logo scale animation.

---

## Hero

### Desktop
- recommended section min-height: 620–720px on large desktop;
- inner 2-column ratio ~46–48 / 52–54;
- copy vertically centered;
- image can visually bleed right but must retain dental equipment/brand focal points;
- H1 56–64px, line-height 1.05–1.1;
- body 16–18px;
- CTA height 44–48px.

### Mobile
- one column;
- copy first, image second;
- H1 38–44px;
- image ratio ~4:3 or 5:4;
- primary CTA visible without relying on `sm:` visibility;
- no decorative whitespace that pushes CTA excessively below fold.

### Motion
- eyebrow, heading, copy, CTA stagger 60–90ms;
- image opacity + slight scale 1.03→1 over 550–650ms;
- no perpetual floating.

---

## Trusted Care / Proof

### Desktop
- editorial 35–40%; media/stat area 60–65%;
- team/clinic image plus compact proof metrics;
- asymmetric magazine-like composition, not equal stat cards only.

### Mobile
- headline → copy → primary image → 2×2 metrics.

### Motion
- optional once-only count up;
- no looping number animation.

---

## Services

### Desktop
- 5 compact service cards at wide desktop;
- 16–20px gaps;
- each card about 18–19% inner width;
- icon/image ~20–25% of card height;
- short title, short copy, clear link.

### Responsive
- wide: 5;
- desktop/tablet: 3;
- smaller tablet/mobile: 2;
- mobile: 1 or horizontal rail only if content/UX chooses it intentionally.

### Interaction
- translateY(-3px);
- subtle shadow increase;
- no cursor-following light or 3D effect.

---

## Technology

### Desktop
- ~40/60 text-to-visual;
- technology media occupies ~55–60% section width;
- OTI/guided implant technology card/photo is dominant;
- feature icons wrap below copy.

### Mobile
- copy first;
- large full-width technology visual;
- features 2–3 column wrap, not microscopic single row.

### Motion
- opacity/clip reveal only;
- no dramatic 3D.

---

## Equipment Showcase

### Desktop
- full-width deep navy band;
- 4 equipment cards;
- consistent device media ratio ~4:3;
- short text labels.

### Mobile
- horizontal snap, approximately 1.1 cards visible;
- visible scroll affordance;
- accessible previous/next controls only if carousel behavior is added.

---

## Doctors

### Desktop
- 4 equal profile cards;
- portraits ~3:4;
- name, specialty/credentials, compact action;
- optional view-all.

### Mobile
- single card per view carousel or one-column list;
- credentials never below 14px;
- keep faces/hands safely within crop.

---

## Certifications

### Desktop
- accreditation logos first;
- certificate cards second;
- ~5 compact certificate cards across at wide desktop;
- normalize optical logo height, not raw width/height.

### Mobile
- logos wrap 3–4 per row;
- certificates 2 → 1.

---

## Real Stories / Results

### Desktop
- copy ~35–45%; media ~55–65%;
- before/after result media + patient story;
- existing range slider interaction can be reused if accessible.

### Accessibility for slider
- native range semantics are acceptable;
- label Before/After;
- keyboard arrows must work;
- do not require dragging only.

---

## Testimonials + Press

### Desktop
- compact review cards with stars + short quote;
- portrait/accent image where design requires;
- press/logo strip below.

### Mobile
- swipeable reviews with pagination;
- press logos wrapped in grid;
- no auto-rotation unless pause control exists.

---

## Featured Articles

### Desktop
- one larger feature article;
- secondary article list/cards;
- feature image ~16:10;
- secondary thumbs ~4:3 or square.

### Mobile
- feature first;
- then article rows;
- 2–3 line excerpts maximum;
- preserve title readability.

---

## Consultation

### Desktop
- large rounded 50/50 container;
- form left;
- clinic/expert information right;
- 44–48px controls minimum.

### Mobile
- form first;
- contact/expert block second;
- full-width inputs;
- input font >=16px to prevent mobile zoom.

### Business logic
- reuse existing booking submission API/form validation;
- do not duplicate validation rules or create a parallel endpoint.

---

## Footer

### Desktop
- deep navy;
- brand block + 3–4 link/contact groups;
- social links;
- booking CTA;
- copyright bar;
- optional accessible back-to-top.

### Mobile
- stacked/accordion only if content density requires;
- touch targets >=44px;
- contact actions use tel/mailto/map links.
