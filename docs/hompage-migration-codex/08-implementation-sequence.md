# 08 — Recommended Implementation Sequence

The sequence below minimizes broken intermediate states and makes rollback easy.

## Phase 0 — Baseline capture

1. Create feature branch, e.g. `feat/homepage-figma-v2`.
2. Record current `main` SHA.
3. Run frontend `type-check`, `lint`, `build` baseline.
4. Run Strapi `type-check`/`build` baseline.
5. Capture current homepage screenshots at target viewports.
6. Export current published `/api/homepage` JSON from the target CMS environment.
7. Back up relevant CMS DB/content before schema/data migration.

**Do not start visual edits until baseline failures are distinguished from new failures.**

---

## Phase 1 — Design tokens and primitives

Implement/normalize:

- Premium Clinical Blue semantic tokens;
- canonical typography loading;
- container width utilities;
- primary/secondary button variants;
- section header primitive;
- card/border/radius conventions;
- focus/reduced-motion behavior.

Avoid global changes that unintentionally restyle every old page.

---

## Phase 2 — Shared chrome

Migrate Header and Footer to target direction while preserving business behavior.

Check all existing pages briefly because these components are global.

---

## Phase 3 — Existing compatible homepage blocks

Rewrite in this order:

1. Hero;
2. Services;
3. Doctors;
4. Certification;
5. Results/CombinedTestimonialResult;
6. Featured Articles.

At this stage, old homepage block order may still exist; visual sections can be validated independently with CMS data.

---

## Phase 4 — New CMS schemas

Add:

1. proof showcase;
2. technology feature;
3. equipment showcase;
4. social proof;
5. consultation.

Then update:

- homepage dynamic zone;
- homepage controller populate;
- TypeScript raw/normalized types;
- `getHomepage()` mappings;
- `BlockRenderer`.

Start Strapi and confirm no schema boot errors before seeding.

---

## Phase 5 — New frontend blocks

Implement each new section against fixtures or actual CMS draft payload.

Recommended order:

1. Proof;
2. Technology;
3. Equipment;
4. Social Proof;
5. Consultation.

---

## Phase 6 — CMS data migration / new block order

Create the target order:

```text
hero
proof-showcase
services
technology-feature
equipment-showcase
doctor
certification
combined-testimonial-result
social-proof
blog-collection-section
consultation
```

Global Header/Footer are outside this dynamic zone.

Legacy blocks may remain in schema but are omitted from the new homepage record.

Verify API response block order exactly before publish.

---

## Phase 7 — Responsive and interaction QA

Test every target viewport.

Focus first on:

- Hero CTA visible on small mobile;
- no horizontal overflow;
- header + fixed offsets;
- equipment/testimonial rails;
- doctor/card crop;
- certificate density;
- before/after keyboard control;
- consultation form validation and submit path;
- footer contact links.

---

## Phase 8 — Performance and accessibility

- Lighthouse / Web Vitals comparison to baseline;
- verify hero LCP request;
- reduce client boundaries;
- reduced-motion check;
- keyboard-only path;
- color contrast;
- form errors;
- image alt semantics.

---

## Phase 9 — Release safety

- run all build/type/lint commands;
- verify production-like Strapi API;
- no unknown block diagnostics;
- final screenshots diffed against Figma;
- preserve old CMS payload/export for rollback;
- merge only after visual + functional acceptance.
