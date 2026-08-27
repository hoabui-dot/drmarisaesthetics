# Strapi CMS Integration Guide

## Overview

This project uses **Strapi v5** as a headless CMS. Content is managed through the Strapi admin panel and consumed via REST API in the Next.js frontend.

## Content Structure

### Single Types (Global Content)

#### 1. Homepage

- **Purpose**: Landing page content with dynamic blocks
- **API Endpoint**: `/api/homepage`
- **Structure**: Dynamic Zone with multiple component types

```typescript
interface Homepage {
  title: string;
  layout: HomepageBlockComponent[]; // Dynamic Zone
}

type HomepageBlockComponent =
  | VideoHeroComponent // homepage.video-hero
  | HeroComponent // homepage.hero
  | ServicesComponent // homepage.services
  | TestimonialsComponent // homepage.testimonials
  | CTAComponent // homepage.cta
  | TrustComponent // homepage.trust
  | PricingComponent // homepage.pricing
  | DoctorComponent // homepage.doctor
  | FAQComponent; // homepage.faq
// ... more
```

#### 2. Navigation

- **Purpose**: Header menu items
- **API Endpoint**: `/api/navigation`
- **Structure**: Repeatable component with nested children

```typescript
interface Navigation {
  navigation: NavItem[];
  logo?: Media;
  ctaText?: string;
  ctaLink?: string;
}

interface NavItem {
  id: number;
  label: string;
  href: string;
  isExternal?: boolean;
  children?: NavChild[]; // For dropdown menus
}
```

#### 3. Footer

- **Purpose**: Footer content
- **API Endpoint**: `/api/footer`
- **Structure**: Contact info, links, social links

### Collection Types (Dynamic Pages)

#### 1. Pages

- **Purpose**: CMS-driven pages (about-us, customers, contact)
- **API Endpoint**: `/api/pages`
- **Key Fields**:
  - `title`: Page title
  - `slug`: URL path (unique)
  - `description`: Meta description
  - `content`: JSON field for complex page structure

```typescript
interface Page {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content?: string | object; // JSON content
  seo: { metaTitle: string; metaDescription: string };
}
```

## Content JSON Structure

Pages store complex content as JSON in the `content` field. This allows flexible page structures managed via the Strapi admin panel.

### Standard Page Sections

```json
{
  "hero": {
    "badge": "Section Badge",
    "title": "Page Title",
    "subtitle": "Subtitle text",
    "description": "Full description paragraph",
    "images": [
      {
        "type": "strapi",
        "path": "/uploads/image.jpg",
        "alt": "Image description"
      }
    ]
  },
  "features": {
    "badge": "Features",
    "title": "Features Title",
    "description": "Features description",
    "items": [
      {
        "icon": "Award",
        "title": "Feature Title",
        "description": "Feature description"
      }
    ]
  },
  "testimonials": {
    "badge": "Success Stories",
    "title": "What Our Customers Say",
    "stories": [
      {
        "name": "Customer Name",
        "location": "City, Country",
        "quote": "Testimonial text",
        "rating": 5,
        "icon": "Star"
      }
    ]
  },
  "faq": {
    "badge": "FAQ",
    "title": "Frequently Asked Questions",
    "questions": [
      {
        "question": "Question text?",
        "answer": "Answer text"
      }
    ]
  },
  "cta": {
    "badge": "Get Started",
    "title": "CTA Title",
    "description": "CTA description",
    "primaryButtonText": "Button Text",
    "primaryButtonLink": "/contact",
    "secondaryButtonText": "Learn More",
    "secondaryButtonLink": "/services"
  }
}
```

### Icon Mapping

Icons are stored as string names and mapped to Lucide React components:

```typescript
const iconMap: Record<string, any> = {
    Award, Clock, Globe, Shield, Star, Heart, Smile,
    Users, ThumbsUp, CheckCircle, Phone, Mail, Quote,
    // Add more as needed
}

// Usage in components
const Icon = iconMap[item.icon] || Award
<Icon className="w-6 h-6 text-sky-600" />
```

### Image References

Images in JSON content reference Strapi media:

```json
{
  "images": [
    {
      "type": "strapi",
      "path": "/uploads/image_hash.jpg",
      "alt": "Description"
    }
  ]
}
```

```typescript
// Render with full URL
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
<Image
    src={`${STRAPI_URL}${image.path}`}
    alt={image.alt}
    fill
    className="object-cover"
/>
```

## API Integration

### Fetching Data

```typescript
// src/lib/api/queries.ts

export async function getPageBySlug(
  slug: string,
  isDraftMode: boolean = false,
): Promise<Page | null> {
  try {
    const response = await apiClient<StrapiPages>("/api/pages", {
      params: {
        "filters[slug][$eq]": slug,
        populate: "*",
      },
      isDraftMode,
      tags: ["pages", "page"],
    });

    if (!response.data?.length) return null;
    return transformPage({ data: response.data[0], meta: response.meta });
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}
```

### Data Transformation

```typescript
// src/lib/api/transformers.ts

export function transformPage(strapiPage: StrapiPage): Page {
  const { id, attributes } = strapiPage.data;

  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    description: attributes.description,
    content: attributes.content, // JSON string or parsed object
    seo: {
      metaTitle: attributes.metaTitle || attributes.title,
      metaDescription:
        attributes.metaDescription || attributes.description || "",
    },
  };
}
```

## Migration Scripts

Migration scripts are used to create/update content in Strapi database.

### Location

```
/migration_scripts/
├── 017-create-about-us-page.js
├── 018-update-about-us-with-images.js
├── 019-create-contact-page.js
├── 024-create-customer-page.js
└── ...
```

### Script Template

```javascript
const { Client } = require("pg");

const client = new Client({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "dental_cms_strapi",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

const pageData = {
  title: "Page Title",
  slug: "page-slug",
  description: "Page description",
  content: JSON.stringify({
    hero: {
      /* ... */
    },
    sections: [
      /* ... */
    ],
    cta: {
      /* ... */
    },
  }),
};

async function createPage() {
  try {
    await client.connect();

    // Check if exists
    const existing = await client.query(
      `SELECT id FROM pages WHERE slug = $1`,
      [pageData.slug],
    );

    if (existing.rows.length > 0) {
      // Update
      await client.query(
        `UPDATE pages SET title = $1, content = $2 WHERE slug = $3`,
        [pageData.title, pageData.content, pageData.slug],
      );
    } else {
      // Insert
      await client.query(
        `INSERT INTO pages (document_id, title, slug, content, ...)
                 VALUES ($1, $2, $3, $4, ...)`,
        [
          /* values */
        ],
      );
    }
  } finally {
    await client.end();
  }
}

createPage();
```

## Common Tasks

### Adding a New Page

1. Create migration script in `/migration_scripts/`
2. Define JSON content structure
3. Run migration: `node migration_scripts/XXX-create-page.js`
4. Create page component in `/src/app/page-name/`
5. Implement client component for rendering

### Updating Page Content

1. **Via Strapi Admin**: Edit page in Content Manager
2. **Via Migration Script**: Update migration and re-run
3. **Via API**: Use Strapi REST API endpoints

### Adding Images

1. Upload to Strapi Media Library
2. Note the upload path (e.g., `/uploads/image_hash.jpg`)
3. Reference in JSON content with full path
4. Update migration script if needed

## Environment Variables

```env
# Backend URL for server-side requests
STRAPI_URL=https://guild-biblical-expectations-easily.trycloudflare.com

# API token for authenticated requests
STRAPI_API_TOKEN=your-strapi-api-token

# Public URL for client-side image references
NEXT_PUBLIC_STRAPI_URL=https://guild-biblical-expectations-easily.trycloudflare.com
```
