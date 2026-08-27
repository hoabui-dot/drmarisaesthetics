# Agent Skill: Adding Homepage Sections (Strapi v5 + Next.js 15)

This document outlines the standard process for adding a new content block (section) to the homepage. Use this as a checklist for all end-to-end integration tasks.

## 📋 End-to-End Checklist

### Phase 1: Strapi Schema (Filesystem)
1. [ ] **Define Component**: Create `strapi-cms/src/components/homepage/[name].json`.
2. [ ] **Update Dynamic Zone**: Add the component to `layout` in `strapi-cms/src/api/homepage/content-types/homepage/schema.json`.
3. [ ] **Sync Database**: Run `npm run build` and `npm run develop` to ensure tables are created correctly.

### Phase 2: Strapi Controller (API Population)
**CRITICAL**: Strapi v5 does not populate nested media or repeatable components by default.
1. [ ] **Modify Controller**: Edit `strapi-cms/src/api/homepage/controllers/homepage.ts`.
2. [ ] **Update Populate Map**: Add an `on` fragment for your new component inside the `populate` object.
   ```typescript
   'homepage.your-component': {
     populate: {
       items: { populate: { image: '*' } } // Populate nested media/components
     }
   }
   ```

### Phase 3: Database Seeding (Optional)
1. [ ] **Create Seed Script**: Write a Node.js script using `axios` to `PUT` data to `/api/homepage`.
2. [ ] **Verify Blocks**: Use `curl` to check that the API returns the correct number of blocks.

### Phase 4: Frontend Implementation
1. [ ] **Create React Component**: Define the visual layout in `dental-frontend/src/components/blocks/[Name]Block.tsx`.
2. [ ] **Map in BlockRenderer**: Add a case to the switch statement in `dental-frontend/src/components/BlockRenderer.tsx`.
3. [ ] **Map in Queries**: Add a case in `dental-frontend/src/lib/api/queries.ts` to transform the API data (especially media URLs).

---

## 🔍 Diagnostic Patterns

### Checking API Response
Use this command to see the active blocks on the homepage:
```bash
curl -s -H "Authorization: Bearer <TOKEN>" "<URL>/api/homepage" | jq -r '.data.layout[].__component'
```

### Database Cleanup (Emergency Only)
If Strapi fails to start due to "Cannot drop table because other objects depend on it", use a custom script to drop legacy tables with `CASCADE`:
```javascript
// fix_db_drop.js
const { Client } = require('pg');
// Connect and run:
// DROP TABLE IF EXISTS "public"."components_homepage_legacy" CASCADE;
```

### Strapi v5 API Caveats
- **Single Types**: Use `findFirst` in the Document Service instead of `findMany`.
- **Media**: Access media via `item.image.url` (transformed) or `item.image.data.attributes.url` (raw Strapi).
