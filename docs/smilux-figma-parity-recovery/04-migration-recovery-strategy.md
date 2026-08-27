# 04 — Migration Recovery Strategy

## Do not restart by visually tweaking the current Hero

The current defect is data-contract related. Fixing CSS first will preserve the wrong content model.

## Recovery order

### Phase A — Repair source-of-truth wiring

- fix misassigned design-spec files;
- fix `reference`/`references` paths;
- make the global design-system prompt part of the required read order;
- make this parity contract authoritative for content/actions.

### Phase B — Create a machine-readable target manifest

Create a repository file such as:

```text
docs/design-spec/contracts/homepage.target.json
```

It should contain canonical Figma-visible text and action semantics.

Example Hero portion:

```json
{
  "hero": {
    "eyebrow": "PREMIUM DENTAL CARE & SERVICES",
    "heading": "Your Smile, Our Passion",
    "subheading": "At Smilux Dental, we combine advanced technology, experienced professionals, and a patient-first approach to deliver safe, lasting, and beautiful smiles for you and your loved ones.",
    "primaryAction": { "label": "BOOK APPOINTMENT", "type": "booking-modal" },
    "secondaryAction": { "label": "WATCH VIDEO", "type": "video-dialog" },
    "trust": {
      "label": "Trusted by 10,000+ Patients",
      "rating": 4.9,
      "ratingLabel": "4.9/5"
    }
  }
}
```

This manifest prevents exact content from being diluted into prose instructions.

### Phase C — Fix CMS/action schema before reseeding

- retain CMS-driven architecture;
- add explicit action semantics where a link string is insufficient;
- add numeric Hero rating if needed;
- preserve media references safely;
- do not use generic marketing fallbacks for required Figma fields.

### Phase D — Replace migration 129 behavior

Do not use `first(blocks, 'hero')` as the final Hero migration result.

Instead:

- read existing block;
- preserve compatible media/reference fields;
- overwrite Figma-specified textual/action fields from the canonical manifest;
- write exact target section order/content;
- produce a migration diff before PUT;
- support dry-run;
- backup existing payload.

### Phase E — Section-by-section parity implementation

For each section:

1. fetch/inspect the Figma target;
2. create element inventory;
3. map every item to data/action/route;
4. implement;
5. render locally;
6. compare desktop/mobile screenshots;
7. run parity checker;
8. only then move to next section.

### Phase F — Update completion definition

A successful build is necessary but insufficient.

Completion requires:

- architecture gates;
- content parity;
- action parity;
- visual parity;
- responsive parity;
- accessibility;
- no unresolved non-media target elements.
