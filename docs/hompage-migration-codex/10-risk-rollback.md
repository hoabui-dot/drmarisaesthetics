# 10 — Risks, Migration Traps & Rollback

## 1. Global Header/Footer blast radius

Risk: Header and Footer live in root layout, so visual changes affect every page immediately.

Mitigation:

- smoke-test About, Services, Contact and article pages after shared-chrome changes;
- avoid homepage-scoped hacks inside global components;
- keep behavior/API props backward compatible.

---

## 2. CMS schema migration before frontend support

Risk: published homepage contains new dynamic-zone components but older frontend renderer does not understand them.

Mitigation:

- deploy backend schema + frontend support before publishing/reseeding new block order;
- keep unknown-block diagnostics in non-production validation;
- verify API block names exactly.

---

## 3. Removing legacy components too early

Risk: rollback becomes difficult and old content references break.

Mitigation:

- retain legacy block schemas in first release;
- omit them from new homepage composition rather than deleting them;
- cleanup in a later migration after stable release.

---

## 4. Theme token blast radius

Risk: changing canonical `primary` variables globally restyles every existing page before those pages migrate.

Mitigation:

- use scoped/alias v2 tokens during homepage-first phase;
- converge globally when later pages are migrated.

---

## 5. Client-side animation weight

Risk: current blocks are animation-heavy and many are client components. Recreating that style on every new section increases JS and hurts mobile.

Mitigation:

- static server-compatible sections by default;
- client islands only for actual interaction;
- CSS scroll snap where JS carousel is unnecessary;
- remove WebGL/continuous effects.

---

## 6. Hero LCP regression

Risk: current renderer treatment can lazy-load static Hero while video hero is favored.

Mitigation:

- eager import/render for target static Hero;
- Next Image priority/sizes;
- no large decorative layers blocking paint.

---

## 7. Booking-flow duplication

Risk: new embedded consultation form creates a second validation/submission implementation that drifts from booking modal.

Mitigation:

- extract/reuse common booking form logic if needed;
- one API submission path;
- one validation schema/source.

---

## 8. Raster design false precision

Risk: developers invent “exact” measurements/colors from screenshots and overfit a single 549px Figma raster.

Mitigation:

- use relative layout ratios and normalized tokens;
- validate at multiple desktop/mobile viewports;
- do not absolute-position the whole page.

---

## 9. Live CMS data unknown

Risk: source schemas are audited but current production content records are not.

Mitigation:

Before data migration:

```bash
curl -s -H "Authorization: Bearer $TOKEN" "$STRAPI_URL/api/homepage" > homepage-before.json
```

Also create DB/content backup according to environment operations policy.

---

# Rollback plan

## Code rollback

- feature branch/PR contains migration;
- keep one known-good pre-migration commit SHA;
- avoid unrelated refactors in the same PR.

## CMS rollback

- save pre-migration homepage JSON;
- do not delete old dynamic-zone component schemas in first release;
- restore previous block order/content if frontend rollback occurs.

## Token rollback

- scoped v2 tokens allow homepage visual rollback without reversing global legacy theme.

---

# Stop conditions

Pause implementation and investigate instead of guessing when:

- actual Strapi payload differs materially from repository types;
- a required Figma asset is missing;
- a new field name conflicts with existing migration/database state;
- build begins dropping/removing Strapi tables unexpectedly;
- booking submit behavior cannot be reused without understanding its current API contract;
- global Header/Footer change breaks unrelated pages.
