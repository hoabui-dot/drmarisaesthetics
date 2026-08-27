# Strapi Integration Prompts

## Overview

Prompts for integrating with Strapi CMS - creating content types, fetching data, and handling transformations.

---

## Prompt: Create New Page Data Fetching

### When to Use

Setting up data fetching for a new CMS-driven page.

### Prompt Template

```
Create data fetching for a new page at /[PAGE_SLUG].

Requirements:
1. Create page.tsx with Server Component for data fetching
2. Create [PageName]Content.tsx as Client Component for rendering
3. Use getPageBySlug from lib/api/queries.ts
4. Parse JSON content field
5. Generate SEO metadata
6. Handle draft mode preview

Follow this structure:

// page.tsx (Server Component)
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPageBySlug } from '@/src/lib/api/queries'
import { PreviewBanner } from '@/src/components/PreviewBanner'
import { PageContent } from './PageContent'

export async function generateMetadata(): Promise<Metadata> {
    const { isEnabled: isDraftMode } = await draftMode()
    const page = await getPageBySlug('[PAGE_SLUG]', isDraftMode)

    return {
        title: page?.seo?.metaTitle || page?.title || 'Default Title',
        description: page?.seo?.metaDescription || page?.description
    }
}

export default async function Page() {
    const { isEnabled: isDraftMode } = await draftMode()
    const page = await getPageBySlug('[PAGE_SLUG]', isDraftMode)

    if (!page) notFound()

    let parsedContent = null
    if (typeof page.content === 'string') {
        try { parsedContent = JSON.parse(page.content) } catch (e) {}
    } else {
        parsedContent = page.content
    }

    return (
        <>
            {isDraftMode && <PreviewBanner />}
            <main className="min-h-screen bg-background">
                <PageContent content={parsedContent} page={page} />
            </main>
        </>
    )
}

export const revalidate = false
export const dynamicParams = true
```

---

## Prompt: Create Migration Script for New Page

### When to Use

Creating a migration script to add new page content to Strapi.

### Prompt Template

```
Create a migration script to add a new page with slug "[PAGE_SLUG]".

Follow the pattern in migration_scripts/024-create-customer-page.js:

const { Client } = require('pg')

const client = new Client({
    host: process.env.DB_HOST || '100.68.50.41',
    port: process.env.DB_PORT || 5437,
    database: process.env.DB_NAME || 'dental_cms_strapi',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
})

const pageData = {
    title: '[PAGE_TITLE]',
    slug: '[PAGE_SLUG]',
    description: '[PAGE_DESCRIPTION]',
    content: JSON.stringify({
        hero: {
            badge: '[BADGE]',
            title: '[TITLE]',
            subtitle: '[SUBTITLE]',
            description: '[DESCRIPTION]',
            images: [
                { type: 'strapi', path: '/uploads/image.jpg', alt: 'Description' }
            ]
        },
        // Add more sections as needed
        cta: {
            badge: 'Get Started',
            title: 'Ready to Start?',
            primaryButtonText: 'Contact Us',
            primaryButtonLink: '/contact'
        }
    })
}

async function createPage() {
    try {
        await client.connect()

        const existing = await client.query(
            `SELECT id FROM pages WHERE slug = $1`,
            [pageData.slug]
        )

        if (existing.rows.length > 0) {
            await client.query(
                `UPDATE pages SET title = $1, description = $2, content = $3, updated_at = NOW()
                 WHERE slug = $4`,
                [pageData.title, pageData.description, pageData.content, pageData.slug]
            )
        } else {
            const documentId = `${pageData.slug}-${Date.now()}`
            await client.query(
                `INSERT INTO pages (document_id, title, slug, description, content,
                 published_at, created_at, updated_at, created_by_id, updated_by_id)
                 VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW(), 1, 1)`,
                [documentId, pageData.title, pageData.slug, pageData.description, pageData.content]
            )
        }
    } finally {
        await client.end()
    }
}

createPage()
```

---

## Prompt: Add Image Upload to Migration

### When to Use

Extending migration script to upload images to Strapi.

### Prompt Template

```
Add image upload functionality to migration script.

Use axios with FormData to upload to Strapi:

const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const https = require('https')

const STRAPI_URL = process.env.STRAPI_URL || 'https://your-strapi-url'
const API_TOKEN = process.env.STRAPI_API_TOKEN

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: { Authorization: `Bearer ${API_TOKEN}` }
})

async function uploadImage(filepath, name, alt) {
    const formData = new FormData()
    formData.append('files', fs.createReadStream(filepath), name)

    const response = await axiosInstance.post(
        `${STRAPI_URL}/api/upload`,
        formData,
        { headers: formData.getHeaders() }
    )

    return response.data[0]
}

// In JSON content, reference uploaded images:
{
    "images": [
        { "type": "strapi", "path": "/uploads/uploaded_image.jpg", "alt": "Alt text" }
    ]
}
```

---

## Prompt: Create New Content Block Type

### When to Use

Adding a new reusable content block for the homepage Dynamic Zone.

### Prompt Template

```
Add a new content block type "[BLOCK_NAME]" for the homepage.

1. Add TypeScript types in src/types/strapi.ts:

export interface Homepage[BlockName]Component {
    __component: 'homepage.[block-name]'
    id: number
    title: string
    // Add other fields
}

export interface Homepage[BlockName]Block {
    blockType: '[block-name]'
    id: number
    title: string
    // Normalized fields
}

// Add to union types:
export type HomepageBlockComponent =
    | ... existing
    | Homepage[BlockName]Component

export type HomepageBlock =
    | ... existing
    | Homepage[BlockName]Block

2. Add transformation in src/lib/api/queries.ts getHomepage():

case '[block-name]':
    return {
        blockType: '[block-name]' as const,
        id: block.id,
        title: (block as Homepage[BlockName]Component).title,
        // Transform other fields
    }

3. Create block component in src/components/blocks/[BlockName]Block.tsx

4. Register in BlockRenderer.tsx
```

---

## Prompt: Handle Strapi Media in Components

### When to Use

Rendering images from Strapi in React components.

### Prompt Template

```
Handle Strapi media rendering pattern:

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://guild-biblical-expectations-easily.trycloudflare.com'

// For images in JSON content:
const getImageUrl = (image: any) => {
    if (!image) return null
    if (image.type === 'strapi' && image.path) {
        return `${STRAPI_URL}${image.path}`
    }
    return image.url || null
}

// Usage in component:
<Image
    src={getImageUrl(hero.images?.[0]) || `${STRAPI_URL}/uploads/fallback.jpg`}
    alt={hero.images?.[0]?.alt || 'Default alt text'}
    fill
    className="object-cover"
/>

// For media from Strapi populate (with data.attributes):
const getMediaUrl = (media: any): string => {
    if (!media) return ''
    if (media.url) return media.url.startsWith('/') ? `${STRAPI_URL}${media.url}` : media.url
    if (media.data?.attributes?.url) return `${STRAPI_URL}${media.data.attributes.url}`
    return ''
}
```

---

## Prompt: Add API Query for New Content Type

### When to Use

Creating a new query function for fetching specific content.

### Prompt Template

```
Create a query function for fetching [CONTENT_TYPE].

Add to src/lib/api/queries.ts:

export async function get[ContentType](): Promise<[ContentType] | null> {
    try {
        const response = await apiClient<Strapi[ContentType]>('/api/[content-type]', {
            params: {
                populate: '*',  // Or specific fields
                // For nested: 'populate[field][populate]': '*'
            },
            tags: ['[content-type]'],
        })

        if (!response.data) {
            console.warn('[get[ContentType]] No data found')
            return null
        }

        // Transform response
        return {
            id: response.data.id,
            // Map other fields
        }
    } catch (error) {
        console.error('[get[ContentType]] Error:', error)
        return null
    }
}
```
