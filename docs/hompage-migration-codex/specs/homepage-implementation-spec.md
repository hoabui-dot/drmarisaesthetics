# Homepage Implementation Spec — Codex Working Contract

This file converts the Figma audit and repository audit into one implementation contract.

## Required final section order

```text
Header (global)
Hero
Proof Showcase
Services
Technology Feature
Equipment Showcase
Doctors
Certifications
Results / Real Stories
Social Proof / Press
Featured Articles
Consultation
Footer (global)
```

## Target content width

- desktop viewport design target: 1280–1440;
- main content max width: approximately 1180–1240px;
- use full-bleed background bands for Hero/Equipment/Footer where appropriate;
- internal content remains centered.

## Section spacing

Use a consistent vertical rhythm rather than copying raster heights literally.

Suggested production baseline:

- mobile: 56–80px section vertical padding;
- tablet: 72–96px;
- desktop: 88–120px;
- dense bands/cards may be tighter;
- Hero follows its own min-height rules.

## Visual density rule

The new design is information-rich but visually calm. Prefer:

- smaller number of strong accent surfaces;
- clear whitespace;
- compact cards;
- line/border hierarchy;
- bright blue reserved for actions and highlights;
- navy for trust/deep bands.

Do not reproduce the current homepage's “premium = more glow/animation” interpretation.

## Data rule

Every visible marketing string that editors are expected to change belongs in Strapi. Components may contain generic UI labels only when they are true application behavior (for example accessible `Previous`, `Next`, `Close`) or an intentionally standardized product label.

## Images

- Do not download or permanently depend on expiring Figma MCP asset URLs.
- Use actual approved CMS/public assets.
- Preserve design aspect ratio and focal point.
- No random external fallback for medical/results content.

## Implementation slicing

A practical PR can be split:

### Slice 1 — foundation/shared chrome
- tokens;
- typography;
- Header;
- Footer;
- Hero.

### Slice 2 — existing blocks
- Services;
- Doctors;
- Certifications;
- Results;
- Articles.

### Slice 3 — new CMS blocks
- Proof;
- Technology;
- Equipment;
- Social Proof;
- Consultation;
- controller/types/query/renderer.

### Slice 4 — content seed + QA
- target block order;
- media/content;
- responsive;
- accessibility;
- performance;
- final visual diff.

If implemented in one branch, still commit in slices so review and rollback remain understandable.
