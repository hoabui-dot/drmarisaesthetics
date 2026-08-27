# Migrating a Page to Reorderable CMS Sections

## Purpose

Use this pattern when a Strapi page currently stores each section as a separate top-level field and the CMS editor must be able to reorder sections.

The final model must have one dynamic zone containing the complete section components. Do not create a dynamic zone containing only section keys or references while keeping duplicate top-level section fields.

## Target architecture

The page schema should contain only the dynamic zone for editable page sections:

```json
{
  "sections": {
    "type": "dynamiczone",
    "components": ["about.hero", "about.mission-vision", "about.core-values", "about.doctors", "about.featured-services", "about.why-choose-us", "about.booking"]
  }
}
```

Each component listed in `components` contains its complete editable content. The order is stored by Strapi in `about_pages_cmps.field = 'sections'` and its `order` column.

## Migration workflow

### 1. Audit before editing

Inspect the page schema, section component definitions, controller populate configuration, frontend API query and renderer, draft/published `*_cmps` links, legacy component tables, and media relations.

Look specifically for duplicate patterns:

- Top-level fields such as `hero`, `mission_vision`, or `booking`.
- A `sections` dynamic zone containing only `section-reference`.
- Frontend code that reads both `data.hero` and `data.sections`.

### 2. Replace the schema

Remove the old top-level section attributes from the page schema. Replace the reference-only dynamic zone with the real section component names.

Remove the reference component definition, for example:

```text
strapi-cms/src/components/about/section-reference.json
```

Do not keep duplicate top-level attributes as a fallback. They cause Strapi Admin to show two editing locations.

### 3. Update the controller

Populate the dynamic zone with component-specific nested media and repeatable components. Use `sections.on` entries such as:

```ts
sections: {
  on: {
    "about.hero": { populate: ["backgroundImage", "statistics", "statistics.icon_image"] },
    "about.mission-vision": { populate: ["backgroundImage"] },
    "about.core-values": { populate: "*" },
    "about.doctors": { populate: "*" },
    "about.featured-services": { populate: "*" },
    "about.why-choose-us": { populate: "*" },
    "about.booking": { populate: "*" },
  },
},
```

### 4. Move existing component links

For each page record:

1. Read the existing top-level links from `about_pages_cmps`.
2. Remove existing `sections` reference links.
3. Remove the old top-level section links.
4. Insert each existing component into `field = 'sections'` using its `cmp_id` and `component_type`.
5. Set the desired order with the `order` column.
6. Remove all `about.section-reference` links.
7. Drop the reference component table.

The migration must process both draft and published records. In Strapi v5 these are normally separate rows with the same `document_id`.

The About Us implementation is:

```text
migration_scripts/139-migrate-about-content-into-sections.js
```

### 5. Cleanup legacy data

After moving content, remove unused legacy component tables and media relation tables. Only drop tables after confirming they are not referenced by any active schema. Preserve media files still used by the new component fields; move the relation before deleting the legacy relation.

### 6. Normalize frontend data

The API returns full dynamic-zone blocks:

```ts
data.sections = [
  { __component: "about.hero", ... },
  { __component: "about.mission-vision", ... },
]
```

The frontend query should find blocks by `__component`, transform their content, and derive the ordered renderer keys from the same array. The renderer then maps keys to existing section components. The key list is only a frontend rendering abstraction; it must not be stored as a separate Strapi reference component.

## Verification checklist

```bash
node -e "JSON.parse(require('fs').readFileSync('strapi-cms/src/api/about-page/content-types/about-page/schema.json'))"
npm --prefix dental-frontend run type-check
docker compose build smilux-strapi
docker compose up -d --force-recreate smilux-strapi
docker compose build smilux-frontend
docker compose up -d --force-recreate smilux-frontend
```

Verify the API:

- `data.sections` contains full section objects.
- Every expected block has a `__component` value.
- No direct section fields remain in `data`.
- No `section-reference` or `section_key` appears.

Verify the UI:

- `/about-us` returns HTTP 200.
- The page renders all CMS sections.
- Reordering `sections` in Strapi changes frontend order after publish.
- Strapi Admin shows one editable section list, not duplicate top-level sections.

## Common failure modes

- **Reference-only dynamic zone:** the editor can reorder keys, but content remains in a second set of fields. Replace references with full components.
- **Only published row migrated:** draft and published content diverge. Always migrate both rows sharing the same `document_id`.
- **Nested media missing:** add component-specific `populate` rules in the controller.
- **Frontend still reads old fields:** normalize dynamic-zone blocks in the API query and remove old fallback data.
- **Schema rebuilt before legacy data migration:** Strapi may drop removed columns. Seed the new fields before schema cleanup or provide explicit migration values.
- **Old component files left active:** unreferenced JSON definitions can still appear in Admin. Delete retired component definitions after data migration.
