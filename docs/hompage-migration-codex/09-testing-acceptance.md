# 09 — Homepage Acceptance Criteria

Codex should not consider the homepage migration complete only because it compiles. The following conditions are required.

## A. Architecture

- [ ] `/` still obtains homepage data through `getHomepage()`.
- [ ] Homepage remains dynamic-zone driven.
- [ ] New CMS block types have schema + controller population + types + query mapping + renderer + frontend component.
- [ ] No page-sized hard-coded replacement JSX in `src/app/page.tsx`.
- [ ] No raw Strapi response shapes consumed directly by presentation components.

## B. Section order

- [ ] Hero
- [ ] Trusted Care / Proof
- [ ] Services
- [ ] Technology
- [ ] Equipment
- [ ] Doctors
- [ ] Certifications
- [ ] Results
- [ ] Testimonials + Press
- [ ] Articles
- [ ] Consultation
- [ ] Footer

## C. Header

- [ ] Clean white default visual.
- [ ] Navigation is CMS-driven.
- [ ] Booking action still opens existing booking flow.
- [ ] Mobile menu works by keyboard/touch.
- [ ] Focus is visible.
- [ ] Scroll state does not use distracting animation.

## D. Hero

- [ ] Exactly one page H1.
- [ ] Primary CTA visible at 360px wide.
- [ ] Desktop ratio visually close to 48/52.
- [ ] Hero media preserves focal point.
- [ ] Hero image is LCP-optimized and not lazy component-loaded.
- [ ] No perpetual floating/blob effects.

## E. Services

- [ ] Five compact cards at wide target viewport where content count permits.
- [ ] Responsive collapse is readable.
- [ ] Navigation does not depend on hover-only hidden controls.
- [ ] Hover motion <= about 3–4px.

## F. Technology

- [ ] 40/60 intent on desktop.
- [ ] Large technical visual remains dominant.
- [ ] Features wrap cleanly on mobile.

## G. Equipment

- [ ] Deep navy section.
- [ ] Four cards at wide viewport.
- [ ] Mobile rail has clear scroll affordance.
- [ ] No WebGL/Three.js dependency added.

## H. Doctors

- [ ] Four equal cards at wide desktop where four doctors are available.
- [ ] 3:4 portrait target.
- [ ] No forced lead-card hierarchy.
- [ ] Credentials >=14px mobile.

## I. Certifications

- [ ] Logo strip and certificate row are visually distinct.
- [ ] Certificate cards are compact, not 400–450px poster cards by default.
- [ ] Logos use normalized optical height.

## J. Results

- [ ] No external stock-image fallback.
- [ ] Before/after control works via keyboard.
- [ ] Before/After labels readable.
- [ ] No drag-only interaction.

## K. Testimonials + Press

- [ ] Reviews and press logos have separate visual hierarchy.
- [ ] Mobile reviews are usable by touch and keyboard.
- [ ] No autoplay unless pause control is present.

## L. Articles

- [ ] Desktop uses a featured editorial composition, not only uniform carousel cards.
- [ ] Mobile stacks featured article first.
- [ ] Article links preserve current routing convention.

## M. Consultation

- [ ] Reuses existing booking submission/validation logic.
- [ ] Does not create duplicate endpoint or duplicate business validation rules.
- [ ] All inputs have labels.
- [ ] Inputs >=44px; mobile input text >=16px.
- [ ] Success/error states work.

## N. Footer

- [ ] Deep navy visual target.
- [ ] Contact tel/mail/map actions work.
- [ ] CMS data is preferred over duplicated hard-coded brand/contact content.
- [ ] Global change is smoke-tested on non-home pages.

## O. Theme

- [ ] New homepage uses semantic design tokens.
- [ ] Arbitrary hex usage is exceptional, not normal.
- [ ] Premium Clinical Blue hierarchy is consistent.
- [ ] Typography is internally consistent.

## P. Responsive

Screenshots checked at:

- [ ] 360×800
- [ ] 390×844
- [ ] 430×932
- [ ] 768×1024
- [ ] 1024×768
- [ ] 1280×800
- [ ] 1440×900
- [ ] 1920×1080

At all widths:

- [ ] no accidental horizontal page scroll;
- [ ] no clipped focus rings;
- [ ] no overlapping header/hero;
- [ ] no unreadably small text;
- [ ] no CTA disappearing due to responsive utility logic.

## Q. Performance/accessibility

- [ ] `prefers-reduced-motion` reduces/removes non-essential motion.
- [ ] hero image is the only intentional above-fold `priority` media where appropriate.
- [ ] below-fold images lazy load normally.
- [ ] no unnecessary new `'use client'` boundaries.
- [ ] keyboard-only navigation works.
- [ ] meaningful images have alt text.
- [ ] form error messages are associated with fields.

## R. Repository gates

From `dental-frontend`:

```bash
npm run type-check
npm run lint
npm run build
```

From `strapi-cms`:

```bash
npm run type-check
npm run build
```

Any pre-existing baseline failures must be documented. New failures introduced by the migration are blockers.
