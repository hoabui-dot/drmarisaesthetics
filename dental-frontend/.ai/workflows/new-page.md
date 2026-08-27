# Workflow: Creating a New CMS-Driven Page

## Overview

Step-by-step guide for creating a new page similar to About Us or Customers pages.

## Prerequisites

- Access to Strapi database or admin panel
- Understanding of page content structure
- Knowledge of the project's design system

---

## Step 1: Plan the Page Structure

### 1.1 Define Page Sections

List all sections the page will contain:

```
Page: [PAGE_NAME]
Slug: [page-slug]

Sections:
1. Hero - Title, subtitle, description, images
2. [Section 2] - ...
3. [Section 3] - ...
4. FAQ (if applicable)
5. CTA - Call to action
```

### 1.2 Define Content Schema

For each section, define the data structure:

```json
{
  "hero": {
    "badge": "string",
    "title": "string (required)",
    "subtitle": "string",
    "description": "string",
    "images": [{ "type": "strapi", "path": "string", "alt": "string" }]
  },
  "features": {
    "badge": "string",
    "title": "string",
    "items": [{ "icon": "string", "title": "string", "description": "string" }]
  }
}
```

---

## Step 2: Create Migration Script

### 2.1 Create Script File

Create `/migration_scripts/XXX-create-[page-name]-page.js`

### 2.2 Script Template

```javascript
const { Client } = require("pg");

const client = new Client({
  host: process.env.DB_HOST || "100.68.50.41",
  port: process.env.DB_PORT || 5437,
  database: process.env.DB_NAME || "dental_cms_strapi",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

const pageData = {
  title: "Page Title - Saigon International Dental Clinic",
  slug: "page-slug",
  description: "Page meta description for SEO",
  content: JSON.stringify({
    hero: {
      /* ... */
    },
    // Other sections
    cta: {
      /* ... */
    },
  }),
};

async function createPage() {
  try {
    await client.connect();
    console.log("Connected to database");

    const existing = await client.query(
      `SELECT id, document_id FROM pages WHERE slug = $1`,
      [pageData.slug],
    );

    if (existing.rows.length > 0) {
      console.log("Page exists, updating...");
      await client.query(
        `UPDATE pages SET title = $1, description = $2, content = $3, 
                 updated_at = NOW(), published_at = NOW() WHERE slug = $4`,
        [pageData.title, pageData.description, pageData.content, pageData.slug],
      );
    } else {
      console.log("Creating new page...");
      const documentId = `${pageData.slug}-${Date.now()}`;
      await client.query(
        `INSERT INTO pages (document_id, title, slug, description, content, 
                 published_at, created_at, updated_at, created_by_id, updated_by_id)
                 VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW(), 1, 1)`,
        [
          documentId,
          pageData.title,
          pageData.slug,
          pageData.description,
          pageData.content,
        ],
      );
    }

    console.log("Page created/updated successfully!");
  } finally {
    await client.end();
  }
}

createPage();
```

### 2.3 Run Migration

```bash
node migration_scripts/XXX-create-[page-name]-page.js
```

---

## Step 3: Create Frontend Page

### 3.1 Create Page Directory

Create `/src/app/[page-slug]/`

### 3.2 Create Server Component (page.tsx)

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPageBySlug } from "@/src/lib/api/queries";
import { PreviewBanner } from "@/src/components/PreviewBanner";
import { PageNameContent } from "./PageNameContent";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { isEnabled: isDraftMode } = await draftMode();
    const page = await getPageBySlug("page-slug", isDraftMode);

    if (!page) {
      return {
        title: "Page Not Found",
        description: "The requested page could not be found.",
      };
    }

    const title = page.seo?.metaTitle || page.title;
    const description = page.seo?.metaDescription || page.description;

    return {
      title: isDraftMode ? `[PREVIEW] ${title}` : title,
      description,
      openGraph: { title, description, type: "website" },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: "Page Title", description: "Page description" };
  }
}

export default async function PageName() {
  try {
    const { isEnabled: isDraftMode } = await draftMode();
    const page = await getPageBySlug("page-slug", isDraftMode);

    if (!page) notFound();

    let parsedContent = null;
    if (typeof page.content === "string") {
      try {
        parsedContent = JSON.parse(page.content);
      } catch (e) {}
    } else {
      parsedContent = page.content;
    }

    return (
      <>
        {isDraftMode && <PreviewBanner />}
        <main className="min-h-screen bg-background">
          <PageNameContent content={parsedContent} page={page} />
        </main>
      </>
    );
  } catch (error) {
    console.error("Error rendering page:", error);
    return <ErrorFallback />;
  }
}

export const revalidate = false;
export const dynamicParams = true;
```

### 3.3 Create Client Component (PageNameContent.tsx)

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Award, Star, Heart /* ... */ } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "https://guild-biblical-expectations-easily.trycloudflare.com";

interface PageNameContentProps {
  content: any;
  page: any;
}

const iconMap: Record<string, any> = { Award, Star, Heart /* ... */ };

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export function PageNameContent({ content, page }: PageNameContentProps) {
  // Hooks first
  const [state, setState] = useState(false);

  // Early return after hooks
  if (!content) {
    return <div>No content available</div>;
  }

  const { hero, features, cta } = content;

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      {hero && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="px-6 py-20 max-w-7xl mx-auto"
        >
          {/* Section content */}
        </motion.section>
      )}

      {/* Additional Sections */}

      {/* CTA Section */}
      {cta && <CTASection cta={cta} />}
    </div>
  );
}
```

---

## Step 4: Test the Page

### 4.1 Verify API Response

```bash
curl "https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?filters[slug][$eq]=page-slug&populate=*" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4.2 Check Frontend

1. Navigate to `http://localhost:3000/page-slug`
2. Verify all sections render
3. Check console for errors
4. Test responsive layout
5. Verify animations work

### 4.3 Test Draft Mode

1. Navigate to `/api/preview?slug=page-slug&secret=YOUR_SECRET`
2. Verify preview banner shows
3. Test unpublished content displays

---

## Step 5: Add Navigation Link (Optional)

### 5.1 Update Navigation in Strapi

Add new menu item in Strapi admin:

- Label: Page Name
- Href: /page-slug
- isExternal: false

### 5.2 Or Add Static Link

In Header.tsx, add link to navigation array.

---

## Checklist

- [ ] Migration script created and run
- [ ] Page directory created (`/src/app/[slug]/`)
- [ ] Server component (page.tsx) with metadata
- [ ] Client component (Content.tsx) with sections
- [ ] All sections render correctly
- [ ] Animations work properly
- [ ] Responsive design verified
- [ ] SEO metadata configured
- [ ] Navigation link added (if needed)
- [ ] Draft mode preview works
