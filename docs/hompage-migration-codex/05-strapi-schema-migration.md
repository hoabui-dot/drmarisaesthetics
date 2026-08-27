# 05 — Strapi Homepage Schema Migration

## Goal

Preserve the Strapi v5 dynamic-zone architecture while adding only the content structures required by the new Figma homepage.

---

# 1. Keep existing block types for compatible concepts

Keep and update where required:

- `homepage.hero`
- `homepage.services`
- `homepage.doctor`
- `homepage.certification`
- `homepage.combined-testimonial-result`
- `homepage.blog-collection-section`

Keep legacy components in the dynamic zone during the first release for rollback/backward compatibility:

- `homepage.video-hero`
- `homepage.process`
- `homepage.about`
- `homepage.faq`
- `homepage.cta`
- `homepage.trust`
- `homepage.papers-section`

The new homepage record simply should not include legacy blocks that are absent in the Figma target.

---

# 2. Extend `homepage.hero`

Current fields already provide:

- heading;
- subheading;
- image;
- one CTA;
- user avatars.

Recommended optional additions:

```json
{
  "eyebrow": { "type": "string" },
  "secondary_cta_label": { "type": "string" },
  "secondary_cta_link": { "type": "string" },
  "trust_label": { "type": "string" },
  "trust_value": { "type": "string" }
}
```

Do not make optional presentation text required if existing published homepage content must remain valid during deployment.

---

# 3. Align `homepage.services`

Current schema does not fully match current frontend expectations.

Recommended additions:

```json
{
  "eyebrow": { "type": "string" },
  "subtitle": { "type": "text" },
  "view_more_label": { "type": "string" },
  "view_more_link": { "type": "string" }
}
```

Keep `items` repeatable with title/description/image/link.

---

# 4. Add `homepage.proof-showcase`

Recommended top-level fields:

- `eyebrow: string`
- `title: string required`
- `description: text`
- `primary_image: media image`
- `secondary_image: media image optional`
- `metrics: repeatable homepage.proof-metric`

`homepage.proof-metric`:

- `value: string required`
- `suffix: string`
- `label: string required`
- `icon: media image optional`

Why new semantic block: current Trust schema only models stats + certifications and cannot faithfully represent the editorial/media mosaic.

---

# 5. Add `homepage.technology-feature`

Fields:

- `eyebrow: string`
- `title: string required`
- `description: text`
- `image: media image required`
- `cta_label: string`
- `cta_link: string`
- `features: repeatable homepage.feature-item` or a new narrow technology item.

If existing `homepage.feature-item` semantics match title/description/icon, reuse it. Do not duplicate schemas with identical semantics just for naming aesthetics.

---

# 6. Add `homepage.equipment-showcase`

Top-level:

- `eyebrow`
- `title`
- `subtitle`
- `items: repeatable homepage.equipment-item`

Equipment item:

- `title required`
- `description optional`
- `image required`
- `link optional`

Keep data presentation-neutral; do not store “4 columns” in CMS unless editors truly need layout variants.

---

# 7. Results / Real Stories

Short-term safe option:

Continue using `homepage.combined-testimonial-result` for result stories because it already contains:

- customer name;
- content;
- rating;
- before image;
- after image;
- avatar.

Frontend can visually refactor this into the Real Stories section.

Longer term, rename/version only if content editors need clearer semantics. Avoid schema churn during a visual migration unless necessary.

---

# 8. Add `homepage.social-proof`

Top-level:

- `eyebrow`
- `title required`
- `subtitle`
- `reviews: repeatable homepage.review-item`
- `press_logos: repeatable homepage.press-logo`
- `portrait: media image optional`

Review item:

- `author_name required`
- `quote required`
- `rating integer 1..5`
- `author_meta optional`
- `avatar optional`

Press logo:

- `name required`
- `image required`
- `url optional`

Do not repurpose scientific `papers-section` data as press proof unless an actual content audit confirms those records are press mentions.

---

# 9. Featured Articles

Keep `homepage.blog-collection-section`.

If editors need explicit feature selection, add one of:

- `featured_post` relation; or
- `showFeatured` + ordered posts where index 0 is feature.

Choose one source of truth. Avoid two competing featured mechanisms.

---

# 10. Add `homepage.consultation`

CMS should store presentational content only:

- title;
- subtitle/description;
- form heading;
- contact heading;
- expert image/name/role optional;
- clinic address/phone/email optional references/strings;
- submit label;
- consent/help text.

Do **not** store submission endpoint, secrets or validation rules in the component. Reuse the application's booking flow.

---

# 11. Update homepage dynamic zone

Add:

```text
homepage.proof-showcase
homepage.technology-feature
homepage.equipment-showcase
homepage.social-proof
homepage.consultation
```

Do not remove legacy components in the same release unless there is a separately verified cleanup plan.

---

# 12. Update custom homepage controller population

The current controller uses an explicit `layout.on` population map. Every new block must be added.

Conceptual example:

```ts
'homepage.proof-showcase': {
  populate: {
    primary_image: true,
    secondary_image: true,
    metrics: { populate: ['icon'] },
  },
},
'homepage.technology-feature': {
  populate: {
    image: true,
    features: { populate: ['icon'] },
  },
},
'homepage.equipment-showcase': {
  populate: {
    items: { populate: ['image'] },
  },
},
'homepage.social-proof': {
  populate: {
    portrait: true,
    reviews: { populate: ['avatar'] },
    press_logos: { populate: ['image'] },
  },
},
'homepage.consultation': {
  populate: {
    expert_image: true,
  },
},
```

Use actual schema attribute names chosen during implementation.

---

# 13. Migration safety sequence

1. Export current homepage API payload from the target environment.
2. Backup DB before schema/migration scripts if production-like data matters.
3. Add component schemas.
4. Update dynamic zone.
5. Update controller population.
6. Start Strapi and confirm schema boot succeeds.
7. Update frontend types/query/renderer.
8. Create/seed a draft/new homepage composition where possible.
9. Verify API payload block types and nested media.
10. Publish only after frontend accepts every block.

Never seed the new block order before the deployed backend/frontend understand the new block types.

---

# 14. Important repository-document conflict

`AGENT_SKILL.md` recommends `findFirst` for Strapi single types, but the actual current homepage controller intentionally uses `findMany(... status: 'published')` and selects the first document.

For this migration, **follow the working current controller implementation unless a separate verified bug requires changing it**. Do not “correct” the controller solely because an older guide says otherwise.
