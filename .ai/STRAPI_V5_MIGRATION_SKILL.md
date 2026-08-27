# Strapi v5 Draft & Publish Data Migration Skill

Handling data seeding directly onto PostgreSQL or through the Strapi Admin API has fundamentally changed from Strapi v4 to Strapi v5 because of the new Draft & Publish Document architecture.

### Problem: Strapi CMS UI showing "No entry yet"
If your database displays records under the proper schema mapping but the CMS UI continues to prompt `"No entry yet. Click to add one."`, it is almost certainly a **Draft & Publish Document ID** tracking error. 

### Cause
In Strapi v5, every piece of content in the Content Manager UI revolves around the **Draft state**. 
- Even if a document is fully published and displaying on the frontend via API (`?status=published`), if there is no corresponding Draft entry row (`published_at IS NULL`) sharing the exact same string `document_id`, the Strapi UI will completely fail to load the state and will present a blank form.
- You **cannot** simply `UPDATE table SET published_at = NOW()` to publish a draft. Updating the draft directly to published deletes the draft conceptually from Strapi's dashboard view.

### The Solution: Duplicating DB State
When migrating or forcefully pushing data into Strapi v5:
1. Ensure the Strapi Table **does not** hold a unique constraint on `document_id` (this is often generated during misconfigured boot-ups).
   * Run: `ALTER TABLE your_pages DROP CONSTRAINT your_pages_document_id_key;`
2. Duplicate your published row.
3. Keep the same `document_id` string for the duplicate.
4. Set the duplicate's `published_at` to `NULL` (This makes it the Draft).
5. If the component has repeatable or non-repeatable components mapped in `your_pages_cmps`, you **must** strictly duplicate those `_cmps` mappings. **CRITICAL:** Do NOT just point the Draft `entity_id` and Published `entity_id` to the SAME `cmp_id`! If they share the exact same `cmp_id`, when the user clicks "Publish", Strapi's internal Garbage Collection (GC) will destroy the old Published components which wipes out everything the Draft is looking at.
   * You must physically execute `INSERT INTO sub_components ... SELECT` to clone an entirely separate set of component rows in `$component_table` for the Draft to utilize exclusively!

### Example Postgres Migration Script
```javascript
const p = await client.query('SELECT * FROM about_pages WHERE id = 8');
const pub = p.rows[0];

// Step 1: Duplicate into exact Draft state
const draftRes = await client.query(
  'INSERT INTO about_pages (document_id, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) VALUES ($1, $2, $3, NULL, $4, $5, $6) RETURNING id',
  [pub.document_id, pub.created_at, pub.updated_at, pub.created_by_id, pub.updated_by_id, pub.locale]
);
const draftId = draftRes.rows[0].id;

// Step 2: Remap Polymorphic Links (CRITICAL: Must duplicate physically, NOT share IDs!)
const cmps = await client.query('SELECT * FROM about_pages_cmps WHERE entity_id = 8');
for (const cmp of cmps.rows) {
  // DO NOT DO THIS: 
  // await client.query('INSERT INTO about_pages_cmps (entity_id, cmp_id, ...) VALUES ($1, $2, ...)', [draftId, cmp.cmp_id]);
  
  // INSTEAD: You MUST fetch from the respective component table and execute a fresh INSERT.
  // Example for 'hero' component:
  if (cmp.field === 'hero') {
     const oldHero = await client.query('SELECT * FROM components_about_heroes WHERE id = $1', [cmp.cmp_id]);
     const res = await client.query('INSERT INTO components_about_heroes (title) VALUES ($1) RETURNING id', [oldHero.rows[0].title]);
     const newCmpId = res.rows[0].id;
     
     await client.query(
       'INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field) VALUES ($1, $2, $3, $4)',
       [draftId, newCmpId, cmp.component_type, cmp.field]
     );
  }
}
```
