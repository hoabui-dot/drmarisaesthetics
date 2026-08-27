# 05 — Figma Parity Acceptance Gates

These gates supplement the existing `09-testing-acceptance.md`.

## P0 — Content parity

For every section:

- exact required heading text is mapped;
- exact visible eyebrow/label text is mapped;
- exact supporting copy is mapped when legible/provided;
- exact CTA count matches Figma;
- exact CTA labels match Figma;
- trust/metric labels and values match Figma;
- target nav labels/order match Figma.

No generic replacement copy is allowed for a required target element.

## P1 — Action parity

For every interactive Figma control:

- action type is declared;
- existing business action is reused where applicable;
- internal route is verified to exist;
- modal/dialog action is implemented and keyboard accessible;
- missing action configuration is a blocker, not a reason to hide the control.

## P2 — CMS parity

For all CMS-driven target values:

- schema field exists;
- controller populates nested content/media;
- query normalization maps it;
- TypeScript type exposes it;
- component consumes it;
- migration/seed writes it;
- API verification confirms the saved value.

## P3 — No silent fallback

Run a code check against migrated Homepage/Header/Footer files for migration-critical fallbacks such as:

```text
|| 'Learn more'
|| 'Premium dental care'
|| 'Trusted care for every smile'
```

Required content should come from the target contract/CMS, not invented presentation defaults.

## P4 — Figma screenshot parity

At minimum compare:

- 1440 desktop;
- 390 mobile.

For each section report:

- missing elements;
- extra elements;
- incorrect text;
- incorrect CTA/action;
- major geometry differences;
- blocked media.

A section cannot be marked PASS with any missing content/action item.

## P5 — Hero hard gate

Before proceeding past Hero:

- H1 = `Your Smile, Our Passion`;
- eyebrow = `PREMIUM DENTAL CARE & SERVICES`;
- supporting paragraph matches target contract;
- primary CTA = `BOOK APPOINTMENT` and opens booking flow;
- secondary CTA = `WATCH VIDEO` and has resolved video action, or is explicitly marked `BLOCKED_FUNCTIONAL` (task is not complete);
- trust label = `Trusted by 10,000+ Patients`;
- five-star presentation visible;
- `4.9/5` visible;
- image can be temporarily `BLOCKED_MEDIA` by current user instruction.

## P6 — Completion report format

Codex must end each section with:

```text
SECTION: Hero
Content parity: PASS/FAIL
Action parity: PASS/FAIL
Visual parity desktop: PASS/FAIL
Visual parity mobile: PASS/FAIL
Blocked media: [...]
Blocked functional: [...]
Missing target elements: [...]
Extra non-Figma elements: [...]
Files changed: [...]
```

If `Missing target elements` or `Blocked functional` is non-empty, the section is not complete.
