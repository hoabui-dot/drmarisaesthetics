# IMPLEMENTATION PROMPT — DR. MARIS / TWO HOSPITAL ENVIRONMENTS

## Role and assignment
You are a senior frontend engineer, visual designer, and motion specialist. Implement **one production-ready homepage/website section** presenting two independent hospital settings associated with DR. MARIS AESTHETICS: **City International Hospital (CIH)** and **Hong Bang International University Hospital (HIU)**.

**First inspect the actual project** (framework, routes, existing section components, design tokens, fonts, styling conventions, asset pipeline, installed animation libraries, accessibility patterns, and page order). Follow the codebase's rules. Do not redesign other sections, install redundant frameworks, or disrupt existing SEO metadata. Implement in the user's current architecture, whether WordPress, React/Next.js, or another existing stack.

## Creative direction — ONE chosen concept
**Cinematic Editorial Chapters / Dual-Hospital Architectural Showcase**. Premium restraint, high-impact real-estate-grade photography, hospital-grade clarity. Take editorial visual hierarchy from premium hotels (Capella/Six Senses) but practical wayfinding, accessibility, and clinical credibility from hospital websites (Mayo Clinic/Cleveland Clinic).

**Section information architecture**:
1. Eyebrow: `HOSPITAL-BASED SURGICAL CARE`
2. H2: `Where Surgical Care Takes Place.`
3. Supporting copy: `Explore the independent hospital environments associated with DR. MARIS AESTHETICS in Ho Chi Minh City. The hospital for any individual procedure is confirmed as part of your clinical assessment and treatment plan.`
4. Two large, sequential editorial hospital chapters, visually equal in importance. CHAPTER 01: CIH; CHAPTER 02: HIU. Do NOT hide the second behind an optional carousel interaction.
5. Small, legible disclaimer beneath both: `DR. MARIS AESTHETICS and the hospitals shown are separate entities. Surgical locations, arrangements, and suitability are confirmed individually before treatment.`
6. CTA `Discuss Your Care Plan` -> `https://drmarisaesthetics.com/contact` (internal route preferred when available).

### Visual structure — desktop 1200px+
- Page container matches site grid, approximately 1200–1360px maximum; generous vertical padding without excessive blank scroll.
- Chapter 01: dominant building photograph LEFT (~60–65% of row), text editorial column RIGHT (~35–40%), with smaller inset patient-room photo overlapping the lower right of the major image INSIDE the visual zone, not text. Chapter number `01 / 02` visible as an editorial index.
- Chapter 02: reverse composition; text LEFT, dominant building photograph RIGHT. Small inset interior/consultation photograph overlaps the lower left of the photo zone. Use symmetric prominence for both hospitals.
- Each chapter's visible media contains (a) large exterior, (b) small facility/interior. Keep the third photo as an optional supplementary image in the component data model or an accessible details link; do not create noisy thumbnail carousels.
- Titles, one short factual description, city/location, and 2 CTAs: primary text link `Explore Hospital Website` (opens hospital official site in a new tab with rel=noopener noreferrer), secondary `Discuss Your Care Plan` (internal contact route). Keep CTA labels explicit.
- Optional thin vertical chapter-progress line and `01 / 02` labels; the line tracks visibility but never becomes the only way to navigate.
- Use existing site's established brand colors and font families. If no reusable palette exists, fallback to warm off-white `#F7F5F0`, ink `#182222`, muted `#65706C`, understated warm accent `#A68D73`; avoid a generic bright-blue clinic card template.
- No ornamental medical crosses, fake achievement seals, fake doctor portraits, invented accreditations, or generic operating room stock disguised as a hospital.

### Copy / hospital data (editable structured model)
```ts
const hospitals = [
  {
    id: 'cih', index: '01',
    name: 'City International Hospital', abbreviation: 'CIH',
    shortLabel: 'Established multidisciplinary hospital environment',
    address: 'No. 3, Street 17A, An Lac Ward, Ho Chi Minh City, Vietnam',
    website: 'https://cih.com.vn/',
    description: 'An established multidisciplinary hospital setting in Ho Chi Minh City, with clinical facilities and supporting medical services.',
    images: { exterior: 'CIH_EXTERIOR_URL', interior: 'CIH_INTERIOR_URL', detail: 'CIH_DETAIL_URL' }
  },
  {
    id: 'hiu', index: '02',
    name: 'Hong Bang International University Hospital', abbreviation: 'HIU',
    shortLabel: 'Modern university hospital environment',
    address: 'No. 1, Street 10, Van Phuc Urban Area, Hiep Binh Ward, Ho Chi Minh City, Vietnam',
    website: 'https://hiuhospital.com/',
    description: 'A multidisciplinary university hospital in Ho Chi Minh City with modern patient-care and clinical facilities.',
    images: { exterior: 'HIU_EXTERIOR_URL', interior: 'HIU_INTERIOR_URL', detail: 'HIU_DETAIL_URL' }
  }
];
```
Use the literal URLs listed below instead of `*_URL` tokens. Keep image objects replaceable from a single data/config file. Treat claims, numbers, accreditation, partnerships, and service availability as content requiring approval, not as creative filler.

## Real hospital imagery — TEMPORARY EXTERNAL URLS
These URLs are research-identified visuals of the named hospitals, not generic Unsplash photos. **Temporary development references only**: rights, accuracy, current building appearance, hospital approval, and third-party hotlink permission must be confirmed before public launch. Some HIU source-site media may be promotional renderings; do not claim they are documentary photographs. Respect licensing and attribution requirements. Do not silently use broken images or substitute unrelated buildings.

**CIH exterior — MAIN (Wikimedia Commons CC0 image; source photographed 2019)**
`https://upload.wikimedia.org/wikipedia/commons/8/8e/City_International_Hospital_Vietnam.jpg`
License/details: `https://commons.wikimedia.org/wiki/File:City_International_Hospital_Vietnam.jpg` (CC0 1.0; publisher should still verify hospital image is accurate/current).

**CIH alternate exterior framing — optional development-only fallback; third-party rights unverified**
`https://a24hkhvn.com/upload/news/benh-vien-quoc-te-city-1-2491.jpg`

**CIH patient room — INSET**
`https://isofhcare-backup.s3-ap-southeast-1.amazonaws.com/images/dia-chi-benh-vien-quoc-te-city-binh-tan-tp-ho-chi-minh-ivie-4_7e208d37_c47f_4769_9f33_4cde2ab911ef.jpg`

**CIH lobby — OPTIONAL DETAIL**
`https://cdn.medpro.vn/medpro-production/medpro/topics/bv-quoc-te-city-cih.jpg`

**HIU exterior — MAIN (verified official site's Next image endpoint)**
`https://hiuhospital.com/_next/image?q=75&url=https%3A%2F%2Fstorage.googleapis.com%2Fhiuh-public-media-production%2Fuploads%2Fcms%2Fcollections%2Ffacilities%2Fkhoi-nha-sanh-chinh.jpg&w=3840`

**HIU inpatient room — INSET (verified official site's Next image endpoint)**
`https://hiuhospital.com/_next/image?q=75&url=https%3A%2F%2Fstorage.googleapis.com%2Fhiuh-public-media-production%2Fuploads%2Fcms%2Fcollections%2Ffacilities%2Fkhu-noi-tru-tien-nghi.jpg&w=3840`

**HIU consultation room — OPTIONAL DETAIL (verified official site's Next image endpoint)**
`https://hiuhospital.com/_next/image?q=75&url=https%3A%2F%2Fstorage.googleapis.com%2Fhiuh-public-media-production%2Fuploads%2Fcms%2Fcollections%2Ffacilities%2Fphong-kham-tieu-chuan.jpg&w=3840`

Source pages: `https://cih.com.vn/`, `https://hiuhospital.com/co-so-vat-chat`. The HIU endpoints above are public-site image optimization URLs, not permanent media contracts. Prefer source-approved locally hosted or CMS-managed assets at release time. If Next Image is used, configure exact allowed remote hosts; do not disable image optimization globally. Main image aspect ratio desktop ~16:10 or 4:3; inset ~3:4. Use `object-fit: cover` and per-image object-position. Provide explicit dimensions and meaningful, not misleading, alt texts.

## Mandatory GSAP motion sequence
**Primary animation engine: GSAP + ScrollTrigger**, reusing the existing installation where possible. Motion.dev may be used only for pre-existing site patterns, not a redundant competing scroll controller.

1. **Section header entrance**: stagger the eyebrow, title, and description with `y: 18 → 0` and `opacity: 0 → 1`, ~0.55–0.9 s, calm ease.
2. **Architectural image reveal**: at each chapter viewport entry, animate a carefully framed `clip-path: inset(8% 6% 8% 6%)` (or a transform-mask wrapper) to full frame; image scale ~1.07 → 1. Use a GSAP ScrollTrigger with moderate `scrub: 0.6` where useful. Avoid heavy filter/blur effects.
3. **Layered parallax**: on wide screens only, media content shifts subtly (main image <= 32 px; inset <= 50 px) relative to its frame as the user scrolls. Parallax should add depth but never change reading order or hide information.
4. **Supporting card reveal**: inset image enters from `y: 28` / scale `.98`, with a slight delay relative to the primary mask. Keep within overflow-safe frame.
5. **Text choreography**: hospital index, heading, address, description, and links stagger in by ~0.08–0.12 s; preserve readable final state if JS fails.
6. **Microinteraction**: hover/focus-within gently scales the image (~1.02–1.04), shifts the small detail photograph slightly, and moves a CTA arrow up-right by 3–5 px. Keyboard focus must trigger the same legible disclosure.
7. **Progress**: animate a slender line's scaleY or progress fill based on the section's local scroll range, not global page. Purely decorative.

**DO NOT** use giant pinned 300vh sections, mandatory horizontal scrolling, scroll-jacking, snap-to-panel, autoplay motion, autoplay videos, exaggerated 3D rotations, or any animation that conceals HIU or CIH from natural browsing. Only use sticky positioning if it demonstrably improves this site's actual layout without extending the scroll artificially.

Implementation: register ScrollTrigger once; scope selectors with `gsap.context()` or the equivalent component instance; use `gsap.matchMedia()` for `(min-width: 1024px)` and `(prefers-reduced-motion: reduce)`; clean up all timelines/triggers on unmount/navigation. Build a no-JS CSS-visible default. Refresh measurements after necessary image loading rather than calling refresh in a loop. Restrict `will-change` to active animated elements. Avoid layout thrashing and uncontrolled external animation dependencies.

## Responsive + accessibility
- Tablet 768–1023px: simpler two-column or single-column layouts based on real text constraints; maintain both hospitals visible in document flow.
- Mobile <768px: stack each chapter as `main photo → small secondary photo or inset → hospital text → CTAs`; no photo overlapping text or covering buttons. Keep 16–24px gutters, >=44x44px interactive targets.
- Reduced motion: remove scrub, parallax, mask movement, and hover transforms; show all images and text immediately or with minimal opacity-only fades. Respect OS preference on initial load and on change.
- Use semantic `<section aria-labelledby>`, chapter `<article>`, heading order, `<figure>` for meaningful images, actual anchors, visible focus states, high contrast and descriptive alt tags, meaningful link destinations, and no title text baked into images.
- Avoid CLS by reserving intrinsic media dimensions; lazy-load offscreen secondary photos; avoid loading all 6 high-resolution images at once; optimize WebP/AVIF only when lawful/local assets are available.

## Medical copy and cross-site consistency — REQUIRED
Live-site pages currently contain inconsistent surgical-location references: the homepage says CIH while About Us and Contact emphasize HIU. **Do not assert both locations are always active or owned**, and do not globally rewrite this content without approval. Implement neutral copy as specified; report the inconsistent pages and exact URLs to the site owner before publishing any final partner/operating claims.

Official hospital pages for name/address verification:
- `https://cih.com.vn/`
- `https://hiuhospital.com/`
- `https://hiuhospital.com/co-so-vat-chat`
Do not invent credentials, claims of safety, outcome promises, ownership, accreditation badges, or procedures available at a particular hospital. DR. MARIS is a separate surgeon-led practice.

## Delivery workflow
1. Inspect current page and styles, identify the correct section placement, check package lockfile and existing animation patterns.
2. Implement the semantic/static two-hospital section with the exact data schema and placeholder images; ensure both hospitals display in the no-JS state.
3. Apply coherent responsive styling that follows current DR. MARIS design tokens.
4. Add GSAP timeline with scoped selectors, breakpoints, prefers-reduced-motion, and thorough cleanup.
5. Test in browser and fix issues; do not report success based on source code alone.
6. Summarize changed files, implementation approach, image attribution/replacement needs, content approvals, unresolved issues, and tested breakpoints.

## Definition of done — verify, not assume
- Two hospitals are present, correctly named, equal in prominence and visible without interaction.
- 4 core photos load and can later be replaced by changing one data/config file; optional photos do not damage performance.
- Links work: official CIH, official HIU, DR. MARIS `/contact`.
- Scroll animations work smoothly and are scoped; no trigger leaks on rerender/navigation, no overflow or stuck scrolling.
- Tested at 375px, 768px, 1024px, 1440px; keyboard navigation, focus, slow connection, no-JS, and reduced-motion paths pass.
- No invented medical claims or implied hospital ownership; conflicting hospital references elsewhere flagged explicitly.
- No console errors; layout shift and performance are acceptable; responsive imagery and fallback states verified.

## Motion engineering references
- `https://gsap.com/docs/v3/Plugins/ScrollTrigger/`
- `https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/`
- `https://motion.dev/docs/react-scroll-animations`
- `https://motion.dev/docs/react-accessibility`
