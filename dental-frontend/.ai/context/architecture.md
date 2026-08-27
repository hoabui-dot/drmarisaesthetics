# Project Architecture

## Overview

This is a dental clinic website built with **Next.js 15** (App Router) frontend and **Strapi v5** headless CMS.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS FRONTEND                            │
│                        (Port 3000)                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  App Router                                             │     │
│  │  ├── page.tsx          (Homepage - Single Type)         │     │
│  │  ├── about-us/         (About Us page)                  │     │
│  │  ├── customers/        (Customer testimonials)          │     │
│  │  ├── contact/          (Contact page)                   │     │
│  │  ├── services/         (Services listing & detail)      │     │
│  │  ├── news/             (Blog/News pages)                │     │
│  │  └── [slug]/           (Dynamic CMS pages)              │     │
│  └────────────────────────────────────────────────────────┘     │
│                             │                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Components                                             │     │
│  │  ├── blocks/           (CMS-driven content blocks)      │     │
│  │  ├── layout/           (Header, Footer, NavLink)        │     │
│  │  ├── ui/               (shadcn/ui base components)      │     │
│  │  └── forms/            (Form components)                │     │
│  └────────────────────────────────────────────────────────┘     │
│                             │                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Data Layer (src/lib/api/)                              │     │
│  │  ├── client.ts         (Fetch wrapper with auth)        │     │
│  │  ├── queries.ts        (API query functions)            │     │
│  │  └── transformers.ts   (Strapi → Frontend mapping)      │     │
│  └────────────────────────────────────────────────────────┘     │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              │ HTTP Request (REST API)
                              │ Authorization: Bearer TOKEN
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       STRAPI CMS                                 │
│                      (Port 1337)                                 │
│                                                                  │
│  Content Types:                                                  │
│  ├── Single Types                                                │
│  │   ├── Homepage         (Dynamic Zone layout)                  │
│  │   ├── Navigation       (Menu items with children)             │
│  │   └── Footer           (Contact info, links, social)          │
│  │                                                               │
│  └── Collection Types                                            │
│      ├── Pages            (Dynamic pages with JSON content)      │
│      ├── Services         (Service detail pages)                 │
│      └── Blog Posts       (News articles)                        │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
dental-frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout with Header/Footer
│   │   ├── page.tsx             # Homepage
│   │   ├── globals.css          # Global styles & design tokens
│   │   ├── about-us/            # About Us page
│   │   │   ├── page.tsx         # Server component (data fetching)
│   │   │   └── AboutUsContent.tsx # Client component (UI/animations)
│   │   ├── customers/           # Customer testimonials page
│   │   ├── contact/             # Contact page
│   │   ├── services/            # Services pages
│   │   ├── news/                # Blog/News pages
│   │   ├── [slug]/              # Dynamic pages from CMS
│   │   └── api/                 # API routes (preview, revalidate)
│   │
│   ├── components/
│   │   ├── blocks/              # CMS-driven content blocks
│   │   │   ├── HeroBlock.tsx
│   │   │   ├── ServicesBlock.tsx
│   │   │   ├── CTABlock.tsx
│   │   │   └── ...
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── NavLink.tsx
│   │   ├── ui/                  # shadcn/ui components
│   │   └── forms/               # Form components
│   │
│   ├── lib/
│   │   ├── api/                 # API layer
│   │   │   ├── client.ts        # HTTP client with auth
│   │   │   ├── queries.ts       # Data fetching functions
│   │   │   └── transformers.ts  # Data transformation
│   │   └── utils.ts             # Utility functions
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── useScrollAnimation.ts
│   │
│   └── types/
│       └── strapi.ts            # TypeScript type definitions
│
├── public/                      # Static assets
├── .ai/                        # AI agent skills (this folder)
└── next.config.ts              # Next.js configuration
```

## Data Flow

### 1. Page Request Flow

```
User visits /customers
    ↓
Next.js customers/page.tsx (Server Component)
    ↓
getPageBySlug('customers')
    ↓
apiClient('/api/pages?filters[slug][$eq]=customers')
    ↓
Strapi API returns JSON
    ↓
transformPage() normalizes data
    ↓
CustomerContent.tsx (Client Component)
    ↓
Framer Motion animations render
    ↓
HTML sent to browser
```

### 2. Content Structure Pattern

Pages store complex content as JSON in the `content` field:

```json
{
  "hero": {
    "badge": "Section Badge",
    "title": "Main Title",
    "subtitle": "Subtitle text",
    "description": "Full description",
    "images": [
      { "type": "strapi", "path": "/uploads/image.jpg", "alt": "Description" }
    ]
  },
  "sections": [...],
  "cta": {
    "title": "CTA Title",
    "primaryButtonText": "Button",
    "primaryButtonLink": "/contact"
  }
}
```

## Key Patterns

### Server vs Client Components

- **Server Components** (page.tsx): Data fetching, SEO metadata
- **Client Components** (Content.tsx): Interactive UI, animations

### Image Handling

- Images stored in Strapi Media Library
- Referenced by path in JSON content
- Rendered via Next.js Image component
- Base URL from `NEXT_PUBLIC_STRAPI_URL` env var

### Animation Pattern

All pages use Framer Motion with consistent variants:

- `fadeInUp`: Content entering from below
- `fadeIn`: Simple opacity fade
- `staggerContainer`: Sequential child animations
- `scaleIn`: Scale up entrance

### Error Handling

- Graceful degradation on API failures
- Loading skeletons during data fetch
- Not found pages for missing content
- Error boundaries for runtime errors

## Environment Variables

```env
# Required
STRAPI_URL=https://guild-biblical-expectations-easily.trycloudflare.com
STRAPI_API_TOKEN=your-api-token
NEXT_PUBLIC_STRAPI_URL=https://guild-biblical-expectations-easily.trycloudflare.com
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Optional
REVALIDATION_SECRET=your-secret-for-webhooks
```

## Important Files to Understand

1. **`src/lib/api/queries.ts`** - All data fetching logic
2. **`src/types/strapi.ts`** - TypeScript definitions
3. **`src/app/globals.css`** - Design tokens and themes
4. **`src/components/blocks/`** - Reusable content blocks
