# Developer Guide: Update Section, UI, and Database Schema

This guide provides step-by-step instructions for updating a section/component in the dental app, including database migrations, schema updates, and frontend changes.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Process](#step-by-step-process)
4. [Example: Removing SupportCard from FAQ](#example-removing-supportcard-from-faq)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Overview

The dental app uses a decoupled architecture:
- **Backend**: Strapi CMS (PostgreSQL database)
- **Frontend**: Next.js (React with TypeScript)
- **Communication**: REST API with webhook-based revalidation

When updating a section, you need to:
1. Write a database migration script
2. Update Strapi schema files
3. Update frontend components
4. Update TypeScript types
5. Test the changes

---

## 🚨 CRITICAL: Strapi v5 Draft & Publish Document Storage 🚨

When writing migration scripts for Single Types or Collection Types that have **Draft & Publish** enabled, you **CANNOT** simply insert records into the baseline tables (e.g. `services_overview` and `services_overview_cmps`). 

Strapi v5 tracks document states using a unique `document_id`. If you bypass the internal Document API and use raw Postgres injections to insert published content, **the Strapi Admin Draft UI will be completely empty**.

### Best Practice for Document Hydration
Instead of writing raw PostgreSQL `INSERT` overrides for complex dynamic zones, you **must use the Strapi Bootstrap Lifecycle**:
1. Open `strapi-cms/src/index.ts`
2. Inside `bootstrap({ strapi })`, use the native Document Service API:
   ```javascript
   const doc = await strapi.documents('api::uid.uid').create({ data: myData });
   await strapi.documents('api::uid.uid').publish({ documentId: doc.documentId });
   ```
3. This guarantees Strapi internally manages the duplicate Row mapping needed for Draft mode and cleanly links all component IDs to the correct `document_id`.

---

## 🚨 CRITICAL: Preventing JSON Schema Dumps in UI 🚨

When mapping Strapi content to frontend pages (especially for Single Types like `About Page` or `Customer Page`), there is a risk that malformed CMS data or legacy content fields may contain serialized JSON strings (e.g. `{"hero":...}`) instead of the expected display text.

If the frontend renders these strings directly into `<p>` or `<span>` tags, it results in a "technical schema dump" that breaks the user experience.

### Prevention & Handling Rules:

1.  **Sanitize Descriptions in `queries.ts`**:
    Always use the `cleanDescription()` helper when mapping descriptive fields. This helper detects strings starting with `{` or `[` and suppresses them if they are valid JSON.
    ```typescript
    description: cleanDescription(data.description) || ""
    ```

2.  **Robust Component Guards**:
    In page-level components (e.g. `AboutUsContent.tsx`), implement a check for valid content structure. If the `content` prop is a string or missing critical sections, render the **Standardized Error UI** instead of the raw data.
    ```tsx
    if (typeof content === 'string' || !content.hero) {
        return <ErrorUI />; // Show specialized "Content Initialization" state
    }
    ```

3.  **Default Values**:
    Never use hardcoded placeholder text (e.g. "Learn about our mission...") as fallbacks in `queries.ts`. Use empty strings `""` or `0`. If data is missing, the component should handle it gracefully or trigger the Error UI.

---

## Prerequisites

### Required Tools
- Node.js 22+
- PostgreSQL client access
- Git

### Required Information
- Database credentials (host, port, database name, username, password)
- Strapi API URL and token (if using API approach)
- Understanding of the component structure

### Environment Variables
```bash
# Database (Direct Connection)
DATABASE_HOST=100.68.50.41
DATABASE_PORT=5437
DATABASE_NAME=dental_cms_strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# Strapi API (Alternative Approach)
STRAPI_URL=https://your-strapi-url.com
STRAPI_API_TOKEN=your_api_token_here
```

---

## Step-by-Step Process

### Step 1: Analyze Current Structure

**1.1 Identify the component**
```bash
# Find the component in Strapi
ls strapi-cms/src/components/homepage/

# Find the frontend component
ls dental-frontend/src/components/blocks/
```

**1.2 Check database schema**
```sql
-- Connect to database
psql -h 100.68.50.41 -p 5437 -U postgres -d dental_cms_strapi

-- List tables
\dt components_homepage_*

-- Describe table structure
\d components_homepage_faqs
```

**1.3 Review existing data**
```sql
-- Check existing records
SELECT * FROM components_homepage_faqs LIMIT 5;

-- Check related tables
SELECT * FROM files_related_mph WHERE related_type = 'homepage.faq';
```

---

### Step 2: Write Migration Script

**2.1 Create migration file**
```bash
# Create new migration script with sequential number
touch migration_scripts/047-remove-support-card-from-faq.js
chmod +x migration_scripts/047-remove-support-card-from-faq.js
```

**2.2 Migration script template**
```javascript
#!/usr/bin/env node

/**
 * Migration Script XXX: [Description]
 *
 * Changes:
 *  1. [Change 1]
 *  2. [Change 2]
 *
 * Run (dev):
 *   node migration_scripts/XXX-description.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/XXX-description.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION XXX: [Description]");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify prerequisites ──────────────────────────────────────
    console.log("STEP 1: Verifying prerequisites...");
    // Add verification logic here
    console.log("  [OK] Prerequisites verified\n");

    // ── STEP 2: Perform migration ─────────────────────────────────────────
    console.log("STEP 2: Performing migration...");
    // Add migration logic here
    console.log("  [OK] Migration completed\n");

    // ── STEP 3: Verify results ────────────────────────────────────────────
    console.log("STEP 3: Verifying results...");
    // Add verification logic here
    console.log("  [OK] Verification passed\n");

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION XXX COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. [Next step 1]");
    console.log("  2. [Next step 2]\n");
  } catch (err) {
    console.error("\n[ERROR]", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Connection closed");
  }
}

run();
```

**2.3 Common migration operations**

**Adding a column:**
```javascript
await client.query(`
  ALTER TABLE components_homepage_faqs 
  ADD COLUMN new_field VARCHAR(255)
`);
```

**Dropping a column:**
```javascript
await client.query(`
  ALTER TABLE components_homepage_faqs 
  DROP COLUMN old_field
`);
```

**Dropping a table:**
```javascript
await client.query(`
  DROP TABLE IF EXISTS components_homepage_faq_items CASCADE
`);
```

**Removing media relations:**
```javascript
await client.query(`
  DELETE FROM files_related_mph
  WHERE related_type = 'homepage.faq'
  AND field = 'doctor_image'
`);
```

**Creating a component table:**
```javascript
await client.query(`
  CREATE TABLE IF NOT EXISTS components_homepage_new_items (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    value TEXT
  )
`);
```

**Creating a link table:**
```javascript
await client.query(`
  CREATE TABLE IF NOT EXISTS components_homepage_faqs_items_cmps (
    id SERIAL PRIMARY KEY,
    entity_id INTEGER NOT NULL
      REFERENCES components_homepage_faqs(id)
      ON DELETE CASCADE,
    cmp_id INTEGER NOT NULL
      REFERENCES components_homepage_new_items(id)
      ON DELETE CASCADE,
    component_type VARCHAR(255) NOT NULL,
    field VARCHAR(255) NOT NULL,
    "order" DOUBLE PRECISION
  )
`);
```

---

### Step 3: Run Migration Script

**3.1 Install dependencies (if needed)**
```bash
# Install pg module if not already installed
npm install
```

**3.2 Run migration (development)**
```bash
node migration_scripts/047-remove-support-card-from-faq.js
```

**3.3 Run migration (production)**
```bash
DATABASE_HOST=100.68.50.41 \
DATABASE_PORT=5437 \
DATABASE_NAME=dental_cms_strapi \
DATABASE_USERNAME=postgres \
DATABASE_PASSWORD=postgres \
node migration_scripts/047-remove-support-card-from-faq.js
```

**3.4 Verify migration**
```sql
-- Check table structure
\d components_homepage_faqs

-- Check data
SELECT * FROM components_homepage_faqs;
```

---

### Step 4: Update Strapi Schema

**4.1 Locate schema file**
```bash
# Component schemas are in:
strapi-cms/src/components/[category]/[component].json

# Example:
strapi-cms/src/components/homepage/faq.json
```

**4.2 Update schema JSON**
```json
{
  "collectionName": "components_homepage_faqs",
  "info": {
    "displayName": "FAQ Section",
    "description": "Frequently asked questions"
  },
  "options": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "subtitle": {
      "type": "text"
    },
    "questions": {
      "type": "component",
      "repeatable": true,
      "component": "homepage.faq-item"
    }
  }
}
```

**4.3 Common attribute types**
- `string`: Short text
- `text`: Long text
- `richtext`: Rich text editor
- `email`: Email field
- `number`: Integer or float
- `boolean`: True/false
- `date`: Date only
- `datetime`: Date and time
- `media`: File upload (single or multiple)
- `component`: Nested component (repeatable or not)
- `relation`: Relation to another content type

**4.4 Restart Strapi**
```bash
# Development
cd strapi-cms
npm run develop

# Production (Docker)
docker-compose restart strapi
```

---

### Step 5: Update Frontend Component

**5.1 Locate frontend component**
```bash
dental-frontend/src/components/blocks/FAQSection.tsx
```

**5.2 Remove unused code**
- Remove unused imports
- Remove unused functions/components
- Remove unused props
- Simplify layout if needed

**5.3 Update component structure**
```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { HomepageFAQBlock } from '@/src/types/strapi'

interface FAQSectionProps {
  data: HomepageFAQBlock
}

export function FAQSection({ data }: FAQSectionProps) {
  // Component logic here
  
  return (
    <section>
      {/* Component JSX here */}
    </section>
  )
}
```

**5.4 Update layout**
- Adjust grid/flex layouts
- Update responsive breakpoints
- Adjust spacing and sizing
- Update animations if needed

---

### Step 6: Update TypeScript Types

**6.1 Locate type definitions**
```bash
dental-frontend/src/types/strapi.ts
```

**6.2 Update interface**
```typescript
export interface HomepageFAQBlock {
  blockType: "faq";
  id: number;
  title: string;
  subtitle?: string;
  questions: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
  // Remove unused fields
  // doctorImage?: Media;
  // ctaLabel?: string;
  // ctaLink?: string;
}
```

**6.3 Check for type errors**
```bash
cd dental-frontend
npm run build
```

---

### Step 7: Test Changes

**7.1 Build frontend**
```bash
cd dental-frontend
npm run build
```

**7.2 Check for errors**
- TypeScript errors
- ESLint warnings
- Build errors

**7.3 Test in browser**
- Start development server
- Navigate to the page with the updated section
- Test responsive behavior
- Test interactions (if any)

**7.4 Test with real data**
- Update content in Strapi admin
- Publish changes
- Verify webhook revalidation works
- Check that changes appear on frontend

---

## Example: Removing SupportCard from FAQ

This example demonstrates the complete process of removing the SupportCard component from the FAQ section.

### Context
The FAQ section had a 2-column layout:
- Left: FAQ accordion
- Right: SupportCard (doctor image, CTA button, contact items)

We want to simplify it to a single-column FAQ accordion.

### Step 1: Write Migration Script

**File**: `migration_scripts/047-remove-support-card-from-faq.js`

```javascript
#!/usr/bin/env node

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function run() {
  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    
    // Remove doctor_image relations
    await client.query(`
      DELETE FROM files_related_mph
      WHERE related_type = 'homepage.faq'
      AND field = 'doctor_image'
    `);
    
    // Drop contact_items link table
    await client.query(`
      DROP TABLE IF EXISTS components_homepage_faqs_contact_items_cmps CASCADE
    `);
    
    // Drop contact_items component table
    await client.query(`
      DROP TABLE IF EXISTS components_homepage_faq_contact_items CASCADE
    `);
    
    // Drop CTA columns
    await client.query(`
      ALTER TABLE components_homepage_faqs DROP COLUMN cta_label
    `);
    await client.query(`
      ALTER TABLE components_homepage_faqs DROP COLUMN cta_link
    `);
    
    console.log("Migration completed successfully");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
```

### Step 2: Run Migration

```bash
node migration_scripts/047-remove-support-card-from-faq.js
```

**Output:**
```
======================================================================
MIGRATION 047: Remove support card from homepage.faq
======================================================================

Database: 100.68.50.41:5437/dental_cms_strapi

[OK] Connected to PostgreSQL

STEP 1: Checking components_homepage_faqs table...
  [OK] Table exists

STEP 2: Removing doctor_image relations from files_related_mph...
  [OK] Deleted 20 doctor_image relations

STEP 3: Dropping contact_items link table...
  [OK] Dropped components_homepage_faqs_contact_items_cmps

STEP 4: Dropping contact_items component table...
  [OK] Dropped components_homepage_faq_contact_items

STEP 5: Dropping cta_label and cta_link columns...
  [OK] Dropped cta_label
  [OK] Dropped cta_link

STEP 6: Verifying...
  Remaining columns in components_homepage_faqs:
    - id
    - title
    - subtitle

======================================================================
MIGRATION 047 COMPLETED SUCCESSFULLY
======================================================================
```

### Step 3: Update Strapi Schema

**File**: `strapi-cms/src/components/homepage/faq.json`

**Before:**
```json
{
  "collectionName": "components_homepage_faqs",
  "info": {
    "displayName": "FAQ Section",
    "description": "Frequently asked questions"
  },
  "options": {},
  "attributes": {
    "title": { "type": "string", "required": true },
    "subtitle": { "type": "text" },
    "questions": {
      "type": "component",
      "repeatable": true,
      "component": "homepage.faq-item"
    },
    "doctor_image": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "cta_label": { "type": "string" },
    "cta_link": { "type": "string" },
    "contact_items": {
      "type": "component",
      "repeatable": true,
      "component": "homepage.faq-contact-item"
    }
  }
}
```

**After:**
```json
{
  "collectionName": "components_homepage_faqs",
  "info": {
    "displayName": "FAQ Section",
    "description": "Frequently asked questions"
  },
  "options": {},
  "attributes": {
    "title": { "type": "string", "required": true },
    "subtitle": { "type": "text" },
    "questions": {
      "type": "component",
      "repeatable": true,
      "component": "homepage.faq-item"
    }
  }
}
```

### Step 4: Update Frontend Component

**File**: `dental-frontend/src/components/blocks/FAQSection.tsx`

**Changes:**
1. Removed `SupportCard` function component
2. Removed 2-column grid layout
3. Changed to single-column centered layout
4. Updated max-width from `max-w-7xl` to `max-w-4xl`
5. Removed all SupportCard-related props and logic

**Key changes:**
```typescript
// Before: 2-column layout
<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
  <div className="flex flex-col gap-3">
    {/* FAQ items */}
  </div>
  <SupportCard data={data} />
</div>

// After: Single column
<div className="flex flex-col gap-3">
  {data.questions.map((item, index) => (
    <AccordionItem ... />
  ))}
</div>
```

### Step 5: Update TypeScript Types

**File**: `dental-frontend/src/types/strapi.ts`

**Before:**
```typescript
export interface HomepageFAQBlock {
  blockType: "faq";
  id: number;
  title: string;
  subtitle?: string;
  questions: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
  doctorImage?: Media;
  ctaLabel?: string;
  ctaLink?: string;
  contactItems: Array<{
    id: number;
    icon?: string;
    label: string;
    subLabel?: string;
  }>;
}
```

**After:**
```typescript
export interface HomepageFAQBlock {
  blockType: "faq";
  id: number;
  title: string;
  subtitle?: string;
  questions: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
}
```

### Step 6: Build and Test

```bash
cd dental-frontend
npm run build
```

**Output:**
```
✓ Compiled successfully in 5.0s
```

---

## Best Practices

### Migration Scripts

1. **Always make migrations idempotent**
   - Check if changes already exist before applying
   - Use `IF EXISTS` / `IF NOT EXISTS` clauses
   - Handle errors gracefully

2. **Add verification steps**
   - Verify prerequisites before migration
   - Verify results after migration
   - Log all operations clearly

3. **Use transactions when possible**
   ```javascript
   await client.query('BEGIN');
   try {
     // Migration operations
     await client.query('COMMIT');
   } catch (err) {
     await client.query('ROLLBACK');
     throw err;
   }
   ```

4. **Document everything**
   - Clear description at the top
   - Step-by-step comments
   - Next steps after migration

### Schema Updates

1. **Keep schema files in sync with database**
   - Update schema immediately after migration
   - Restart Strapi to pick up changes
   - Verify in Strapi admin panel

2. **Use descriptive names**
   - Clear field names
   - Helpful descriptions
   - Consistent naming conventions

3. **Set appropriate constraints**
   - Mark required fields
   - Set default values
   - Define allowed types for media

### Frontend Updates

1. **Remove unused code**
   - Delete unused imports
   - Remove unused functions
   - Clean up unused styles

2. **Maintain responsive design**
   - Test on mobile, tablet, desktop
   - Use appropriate breakpoints
   - Ensure touch-friendly interactions

3. **Keep animations smooth**
   - Use appropriate easing functions
   - Avoid janky animations
   - Test performance

4. **Update types immediately**
   - Keep TypeScript types in sync
   - Fix type errors before committing
   - Use strict type checking

### Testing

1. **Test database changes**
   - Verify schema in database
   - Check data integrity
   - Test rollback if needed

2. **Test frontend changes**
   - Build without errors
   - Test in development mode
   - Test with real data from CMS

3. **Test integration**
   - Verify API responses
   - Test webhook revalidation
   - Check cache invalidation

---

## Troubleshooting

### Migration Script Issues

**Problem**: `Cannot find module 'pg'`
```bash
# Solution: Install dependencies
npm install
```

**Problem**: Connection refused
```bash
# Solution: Check database credentials
psql -h 100.68.50.41 -p 5437 -U postgres -d dental_cms_strapi

# Or check if using correct host/port
echo $DATABASE_HOST
echo $DATABASE_PORT
```

**Problem**: Permission denied
```bash
# Solution: Check user permissions
GRANT ALL PRIVILEGES ON DATABASE dental_cms_strapi TO postgres;
```

### Strapi Issues

**Problem**: Schema not updating
```bash
# Solution: Restart Strapi
docker-compose restart strapi

# Or in development
cd strapi-cms
npm run develop
```

**Problem**: Component not showing in admin
```bash
# Solution: Clear Strapi cache
rm -rf strapi-cms/.strapi
cd strapi-cms
npm run develop
```

### Frontend Issues

**Problem**: Type errors after update
```bash
# Solution: Check type definitions
# Update dental-frontend/src/types/strapi.ts
# Rebuild
cd dental-frontend
npm run build
```

**Problem**: Component not rendering
```bash
# Solution: Check console for errors
# Verify data structure from API
# Check component props
```

**Problem**: Styles not applying
```bash
# Solution: Check Tailwind classes
# Verify responsive breakpoints
# Check for conflicting styles
```

### Webhook/Revalidation Issues

**Problem**: Changes not appearing on frontend
```bash
# Solution: Check webhook configuration in Strapi
# Verify STRAPI_WEBHOOK_SECRET matches
# Check Next.js revalidate API logs
# Manually trigger revalidation:
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-strapi-secret: your_secret" \
  -H "Content-Type: application/json" \
  -d '{"model":"homepage","event":"entry.update"}'
```

---

## Summary Checklist

- [ ] Analyze current structure (database, schema, frontend)
- [ ] Write migration script with verification steps
- [ ] Run migration script and verify results
- [ ] Update Strapi schema JSON file
- [ ] Restart Strapi to pick up schema changes
- [ ] Update frontend component (remove unused code)
- [ ] Update TypeScript type definitions
- [ ] Build frontend and fix any errors
- [ ] Test in development mode
- [ ] Test with real data from CMS
- [ ] Verify webhook revalidation works
- [ ] Document changes
- [ ] Commit and push changes

---

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Project Architecture](.ai/ARCHITECTURE.md)
- [Data Flow](.ai/DATA_FLOW.md)
- [Frontend Guide](.ai/FRONTEND_GUIDE.md)

---

**Last Updated**: 2026-04-08
**Version**: 1.0.0


## Strapi v5: Draft & Publish Database Architecture
When migrating data or injecting directly into the database on Strapi v5, note that Draft & Publish handles entries differently than Strapi v4:
1. A single document is identified by a `document_id`.
2. Do NOT simply update `published_at=NOW()` for a draft record. This will cause the Strapi CMS UI to say 'No entry yet' because the UI demands a draft row (`published_at IS NULL`).
3. You must duplicate the Draft database row, keeping the same `document_id`, and setting `published_at=NOW()` for the published one and `published_at=NULL` for the draft one.
4. When Draft & Publish is disabled, Strapi enforces a Unique Constraint on `document_id`. You must run `ALTER TABLE table_name DROP CONSTRAINT table_name_document_id_key;` if trying to support Draft/Publish entries on that table.

---

## Mobile Animation Performance — MotionDiv Pattern

**Last Updated**: 2026-05-10

### Problem

Using `<motion.div>` with `initial={{ opacity: 0 }}` hides content until JavaScript hydrates and runs. On mobile devices (low-power CPUs, slow JS parse), this causes a visible blank screen on first load — terrible for UX and Core Web Vitals (LCP).

### Solution: Use `<MotionDiv>` for All Scroll-Reveal Animations

**File**: `dental-frontend/src/components/ui/MotionDiv.tsx`

`MotionDiv` is a drop-in replacement for `<motion.div>`:

- **Mobile** (`shouldSimplify=true` via `useMobileAnimation`): renders a plain `<div>` — content **immediately visible**, zero JS animation cost
- **Desktop** (`shouldSimplify=false`): renders `<motion.div>` with `willChange: 'transform'` for GPU-accelerated 60fps animations

```tsx
// ✅ CORRECT — use MotionDiv for scroll-reveal
import { MotionDiv } from '@/src/components/ui/MotionDiv'

<MotionDiv
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  {children}
</MotionDiv>

// ❌ WRONG — raw motion.div hides content on mobile
import { motion } from 'framer-motion'
<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
  {children}
</motion.div>
```

### Use `useMobileAnimation` for Custom Animation Conditions

**File**: `dental-frontend/src/hooks/useMobileAnimation.ts`

```tsx
import { useMobileAnimation } from '@/src/hooks/useMobileAnimation'

const { shouldSimplify } = useMobileAnimation()

// Disable infinite loops on mobile
animate={shouldSimplify ? undefined : { x: [0, 4, 0] }}

// Skip expensive blur transitions on mobile
initial={shouldSimplify ? { opacity: 0 } : { opacity: 0, filter: 'blur(10px)' }}

// Disable hover on touch devices
whileHover={shouldSimplify ? undefined : { y: -8 }}
```

### SSR Hydration Safety — CRITICAL

`useMobileAnimation` MUST use `useState(false)` (desktop assumption). Never use a lazy initializer that reads `window.innerWidth` — server renders `window=undefined` while client reads the real value, causing Next.js hydration errors on mobile.

```ts
// ✅ CORRECT — SSR safe, no hydration mismatch
const [isMobile, setIsMobile] = useState(false)
useEffect(() => {
  const mql = window.matchMedia('(max-width: 767px)')
  setIsMobile(mql.matches)
  // ...
}, [])

// ❌ WRONG — causes "Hydration failed" error on mobile
const [isMobile, setIsMobile] = useState(() => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768  // Server=false, Client=true → MISMATCH
})
```

**Never** use `typeof window !== 'undefined'` directly in render — always use the `useMobileAnimation` hook.

### LCP Content Rule — Never Animate Above-Fold Headings

Hero titles (`<h1>`), hero subtitles, and any content visible on first paint must NEVER use Framer Motion with `opacity:0`. Use plain HTML:

```tsx
// ✅ CORRECT — VideoHero h1 is plain HTML, always visible
<h1 className="text-white text-5xl font-bold">
  {data.titleLines.map(line => <span key={line.id} className="block">{line.text}</span>)}
</h1>

// ❌ WRONG — AnimatedSectionHeader on hero h1 delays LCP
<AnimatedSectionHeader titleAs="h1" title={title} />
// ^ Uses motion.div with opacity:0 internally — blocks Largest Contentful Paint
```

`AnimatedSectionHeader` now uses `MotionDiv` internally (safe for below-fold sections). It must **NOT** be used for hero `h1` elements.

### Mobile Animation Checklist

When adding or modifying any animated component:

- [ ] All scroll-reveal `motion.div` → `MotionDiv`
- [ ] No infinite `animate` loops on mobile — gate with `shouldSimplify`
- [ ] No `filter: blur()` in `AnimatePresence` on mobile (GPU killer) — use opacity-only
- [ ] No `whileHover` scale/translate on mobile (touch devices don't hover)
- [ ] Hero `h1`/`p` are plain HTML — never wrapped in animation components
- [ ] `AnimatedSectionHeader` only used for **below-fold** section headers
- [ ] No `typeof window` checks in render — use `useMobileAnimation` hook
- [ ] `willChange: 'transform'` on key animating elements (handled automatically by `MotionDiv`)

### Key Files Reference

| File | Purpose |
|---|---|
| `src/components/ui/MotionDiv.tsx` | Drop-in `motion.div` replacement — plain div on mobile |
| `src/hooks/useMobileAnimation.ts` | Hook: `shouldSimplify`, `isMobile`, `prefersReduced` |
| `src/components/ui/AnimatedSectionHeader.tsx` | Section header — uses MotionDiv, safe for below-fold |
| `src/components/blocks/VideoHero.tsx` | Reference: plain h1/p for LCP content |
