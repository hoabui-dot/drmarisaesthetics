# Strapi V5 Polymorphic Media Serialization Bug & Caching Fixes

## Critical Bug: `strapi.documents().create(...)` strips deeply nested Media elements
When migrating the backend seeding (e.g. `index.ts` bootstrap pipeline), it was discovered that Strapi V5's Document API strictly strips `plugin::upload.file` Media mappings when they are attached to a Repeatable Component nested inside a Dynamic Zone block, EVEN if provided the correct `documentId` or Integer `id`.

**The Fix / Pattern**:
1. Run the normal `strapi.documents(UID).create({ data: ... })` method to instantiate the complex components schema correctly.
2. Immediately intercept the auto-generated relationship arrays by pulling `strapi.db.query(UID).findOne({ populate: ['your_deep_nested_target'] })` utilizing native ORM hooks.
3. Stitch the `documentId` map back onto the newly generated repeating items manually using `strapi.db.query('component_namespace').update(...)`. 

## Critical Bug: Next.js Fetch API failing on deep `populate: '*'` wildcard mappings
1. Using the standard `URLSearchParams.append` inside a custom fetch wrapper flattens deep Object definitions to `[object Object]` when Strapi explicitly requires strict qs parsing (e.g., `populate[layout][on][hero][populate]=*`).
   **Fix**: Employ the `qs` library directly: `url.search = qs.stringify(params, { encodeValuesOnly: true })`.
2. Even with `qs`, Strapi V5 nested object resolvers **do not include Media relations by default** under `populate: '*'`.
   **Fix**: Inside explicitly requested Component layouts, you must explicitly declare `populate: 'image'` (or the field name) to force Strapi's payload serialization algorithms to mount the relation mapping.

## Important Note regarding Next.js Cache
Ensure to manually verify cached iterations (or wipe `rm -rf .next`) if developing actively because `force-cache` will permanently hold empty `null` objects of older configurations even if Strapi backend resolves the DB serialization!
