# Workflow: Creating a Strapi Migration Script

## Overview
Step-by-step guide for creating migration scripts to add or update content in Strapi CMS.

## Prerequisites
- Database connection credentials
- Understanding of Strapi data structure
- Knowledge of target content schema

---

## Step 1: Plan the Migration

### 1.1 Define What to Create/Update
```
Migration: [MIGRATION_NAME]
Type: [Create Page | Update Content | Add Images | Create Component]
Target: [pages | homepage | navigation | etc.]
```

### 1.2 Document the Data Schema
```json
{
  "fieldName": "field type and purpose",
  "nested": {
    "subField": "description"
  }
}
```

### 1.3 Check Existing Migrations
```bash
ls migration_scripts/
# Find the next number: 025-migration-name.js
```

---

## Step 2: Create Migration Script

### 2.1 File Location
```
/migration_scripts/XXX-[description].js
```

### 2.2 Basic Script Structure

```javascript
/**
 * Migration Script: [Description]
 * 
 * Purpose: [What this migration does]
 * Target: [Which table/content type]
 * 
 * Run: node migration_scripts/XXX-description.js
 */

const { Client } = require('pg')

// Database configuration
const client = new Client({
    host: process.env.DB_HOST || '100.68.50.41',
    port: process.env.DB_PORT || 5437,
    database: process.env.DB_NAME || 'dental_cms_strapi',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
})

// Data to insert/update
const data = {
    // Define your data structure
}

async function runMigration() {
    try {
        await client.connect()
        console.log('Connected to database')

        // Migration logic here

        console.log('Migration completed successfully!')
    } catch (error) {
        console.error('Migration failed:', error.message)
        throw error
    } finally {
        await client.end()
        console.log('Database connection closed')
    }
}

// Run
runMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
```

---

## Step 3: Implement Migration Logic

### 3.1 Create New Page
```javascript
const pageData = {
    title: 'Page Title',
    slug: 'page-slug',
    description: 'Meta description',
    content: JSON.stringify({
        hero: { badge: 'Badge', title: 'Title', description: 'Description' },
        // More sections
    })
}

async function createPage() {
    // Check if exists
    const existing = await client.query(
        `SELECT id, document_id FROM pages WHERE slug = $1`,
        [pageData.slug]
    )

    if (existing.rows.length > 0) {
        // Update existing
        await client.query(
            `UPDATE pages 
             SET title = $1, description = $2, content = $3, 
                 updated_at = NOW(), published_at = NOW()
             WHERE slug = $4`,
            [pageData.title, pageData.description, pageData.content, pageData.slug]
        )
        console.log('Updated existing page')
    } else {
        // Create new
        const documentId = `${pageData.slug}-${Date.now()}`
        await client.query(
            `INSERT INTO pages (
                document_id, title, slug, description, content,
                published_at, created_at, updated_at, 
                created_by_id, updated_by_id
            ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW(), 1, 1)`,
            [documentId, pageData.title, pageData.slug, 
             pageData.description, pageData.content]
        )
        console.log('Created new page')
    }
}
```

### 3.2 Update Existing Content
```javascript
async function updateContent() {
    // Update specific field
    await client.query(
        `UPDATE pages 
         SET content = jsonb_set(
             content::jsonb, 
             '{hero,title}', 
             '"New Title"'
         )
         WHERE slug = $1`,
        ['page-slug']
    )
}
```

### 3.3 Add Images (with Strapi API)
```javascript
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const STRAPI_URL = process.env.STRAPI_URL
const API_TOKEN = process.env.STRAPI_API_TOKEN

const axiosInstance = axios.create({
    headers: { Authorization: `Bearer ${API_TOKEN}` }
})

async function uploadImage(filepath, filename) {
    const formData = new FormData()
    formData.append('files', fs.createReadStream(filepath), filename)
    
    const response = await axiosInstance.post(
        `${STRAPI_URL}/api/upload`,
        formData,
        { headers: formData.getHeaders() }
    )
    
    return response.data[0]  // Returns uploaded file info
}

async function downloadAndUpload(imageUrl, filename) {
    // Download image
    const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
    })
    
    const tempPath = `/tmp/${filename}`
    const writer = fs.createWriteStream(tempPath)
    response.data.pipe(writer)
    
    await new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
    
    // Upload to Strapi
    const uploaded = await uploadImage(tempPath, filename)
    
    // Cleanup
    fs.unlinkSync(tempPath)
    
    return uploaded
}
```

### 3.4 Update Single Type (Homepage, Navigation, Footer)
```javascript
async function updateHomepage() {
    // Find homepage
    const homepage = await client.query(
        `SELECT id, document_id FROM homepages LIMIT 1`
    )
    
    if (homepage.rows.length === 0) {
        console.log('Homepage not found')
        return
    }
    
    // Update layout JSON
    const newLayout = [/* blocks */]
    
    await client.query(
        `UPDATE homepages SET layout = $1, updated_at = NOW() WHERE id = $2`,
        [JSON.stringify(newLayout), homepage.rows[0].id]
    )
}
```

---

## Step 4: Add Logging and Verification

### 4.1 Add Progress Logging
```javascript
async function runMigration() {
    console.log('='.repeat(50))
    console.log('Starting migration: [Name]')
    console.log('='.repeat(50))
    
    await client.connect()
    console.log('[1/3] Connected to database')
    
    await createPage()
    console.log('[2/3] Page created/updated')
    
    await verifyMigration()
    console.log('[3/3] Migration verified')
    
    console.log('='.repeat(50))
    console.log('Migration completed!')
    console.log('='.repeat(50))
}
```

### 4.2 Add Verification
```javascript
async function verifyMigration() {
    const result = await client.query(
        `SELECT id, title, slug, published_at FROM pages WHERE slug = $1`,
        ['page-slug']
    )
    
    if (result.rows.length === 0) {
        throw new Error('Verification failed: Page not found')
    }
    
    const page = result.rows[0]
    console.log('Verification results:')
    console.log(`  - ID: ${page.id}`)
    console.log(`  - Title: ${page.title}`)
    console.log(`  - Published: ${page.published_at ? 'Yes' : 'No'}`)
}
```

### 4.3 Log Content Summary
```javascript
function logContentSummary(content) {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content
    
    console.log('\nContent Summary:')
    
    if (parsed.hero) {
        console.log(`  - Hero: "${parsed.hero.title}"`)
    }
    
    if (parsed.sections) {
        console.log(`  - Sections: ${parsed.sections.length}`)
    }
    
    if (parsed.faq?.questions) {
        console.log(`  - FAQ Questions: ${parsed.faq.questions.length}`)
    }
}
```

---

## Step 5: Run and Test

### 5.1 Run Migration
```bash
# Set environment variables if needed
export DB_HOST=your-host
export DB_PORT=5432

# Run script
node migration_scripts/XXX-description.js
```

### 5.2 Verify in Strapi Admin
1. Open Strapi admin panel
2. Navigate to Content Manager
3. Find the created/updated content
4. Verify all fields are correct

### 5.3 Test in Frontend
```bash
# Start frontend
cd dental-frontend
npm run dev

# Visit the page
open http://localhost:3000/page-slug
```

---

## Common Patterns

### JSON Content Structure
```javascript
const content = JSON.stringify({
    hero: {
        badge: 'Badge Text',
        title: 'Page Title',
        subtitle: 'Subtitle',
        description: 'Full description',
        images: [
            { type: 'strapi', path: '/uploads/image.jpg', alt: 'Alt text' }
        ]
    },
    features: {
        badge: 'Features',
        title: 'Features Title',
        items: [
            { icon: 'Award', title: 'Feature 1', description: 'Description' }
        ]
    },
    cta: {
        badge: 'Get Started',
        title: 'CTA Title',
        description: 'CTA description',
        primaryButtonText: 'Contact Us',
        primaryButtonLink: '/contact'
    }
})
```

### Error Handling
```javascript
async function safeQuery(query, params) {
    try {
        return await client.query(query, params)
    } catch (error) {
        console.error('Query failed:', query)
        console.error('Error:', error.message)
        throw error
    }
}
```

---

## Checklist

- [ ] Script numbered correctly (XXX-description.js)
- [ ] Database credentials configured
- [ ] Data structure defined
- [ ] Check for existing content before insert
- [ ] UPDATE query for existing records
- [ ] INSERT query for new records
- [ ] Published_at set for immediate visibility
- [ ] Logging added for progress tracking
- [ ] Verification step included
- [ ] Script tested locally
- [ ] Content verified in Strapi admin
- [ ] Frontend rendering verified
