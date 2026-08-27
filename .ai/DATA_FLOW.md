# Data Flow Documentation

## 🔄 Complete Data Flow Overview

This document explains how data flows through the system in different scenarios.

---

## 📊 Core Data Flow: Strapi → Next.js

### Basic Flow (Published Content)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER REQUEST                                             │
│    User visits: https://example.com/dental-implants         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. NEXT.JS ROUTING                                          │
│    App Router matches: app/[slug]/page.tsx                  │
│    Params: { slug: 'dental-implants' }                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CHECK DRAFT MODE                                         │
│    const { isEnabled } = await draftMode()                  │
│    Result: false (not in preview mode)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. FETCH DATA FROM STRAPI                                   │
│    getPageBySlug('dental-implants', isDraftMode: false)     │
│                                                              │
│    API Call:                                                │
│    GET /api/pages?filters[slug][$eq]=dental-implants        │
│                  &populate=*                                 │
│                  &status=published                           │
│    Headers:                                                  │
│    Authorization: Bearer {STRAPI_API_TOKEN}                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. STRAPI PROCESSES REQUEST                                 │
│    - Validates API token                                    │
│    - Filters by slug                                        │
│    - Filters by status=published                            │
│    - Populates relations                                    │
│    - Returns JSON response                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. STRAPI RESPONSE                                          │
│    {                                                         │
│      "data": [{                                             │
│        "id": 1,                                             │
│        "title": "Dental Implants",                          │
│        "slug": "dental-implants",                           │
│        "content": "...",                                    │
│        "cover": { "url": "/uploads/..." },                  │
│        "publishDate": "2024-01-01",                         │
│        "description": "..."                                 │
│      }],                                                    │
│      "meta": { "pagination": {...} }                        │
│    }                                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. TRANSFORM DATA                                           │
│    transformPage(strapiResponse)                            │
│                                                              │
│    - Flatten data.attributes structure                      │
│    - Convert __component to blockType                       │
│    - Extract media URLs                                     │
│    - Map SEO fields                                         │
│                                                              │
│    Result: Page object (frontend format)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. CACHE DATA                                               │
│    Next.js caches response with:                            │
│    - cache: 'force-cache'                                   │
│    - tags: ['pages', 'page']                                │
│    - revalidate: false (webhook-based)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. RENDER PAGE                                              │
│    <BlockRenderer layout={page.layout} />                   │
│                                                              │
│    - Maps over blocks                                       │
│    - Renders appropriate component for each block           │
│    - Generates HTML on server                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. SEND RESPONSE TO USER                                   │
│     HTML page with content                                  │
│     Status: 200 OK                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Preview Flow (Draft Content)

### Complete Preview Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. EDITOR CLICKS "PREVIEW" IN STRAPI                        │
│    Button configured in Strapi preview-button plugin        │
│    URL: /api/preview?slug={slug}&secret={secret}            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. NEXT.JS PREVIEW API ROUTE                                │
│    GET /api/preview?slug=dental-implants&secret=xxx         │
│                                                              │
│    File: app/api/preview/route.ts                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. VALIDATE SECRET                                          │
│    if (secret !== process.env.NEXT_PREVIEW_SECRET) {        │
│      return 401 Unauthorized                                │
│    }                                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. ENABLE DRAFT MODE                                        │
│    const draft = await draftMode()                          │
│    draft.enable()                                           │
│                                                              │
│    Sets cookie: __prerender_bypass                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. REDIRECT TO PAGE                                         │
│    redirect(`/${slug}?preview=true&_t=${Date.now()}`)       │
│                                                              │
│    URL: /dental-implants?preview=true&_t=1234567890         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. PAGE COMPONENT DETECTS DRAFT MODE                        │
│    const { isEnabled } = await draftMode()                  │
│    Result: true (preview mode enabled)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. FETCH DRAFT DATA                                         │
│    getPageBySlug('dental-implants', isDraftMode: true)      │
│                                                              │
│    API Call:                                                │
│    GET /api/pages?filters[slug][$eq]=dental-implants        │
│                  &populate=*                                 │
│                  &status=draft                               │
│                  &_t=1234567890                              │
│    Headers:                                                  │
│    Authorization: Bearer {STRAPI_API_TOKEN}                 │
│                                                              │
│    Cache: no-store (no caching for draft)                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. STRAPI RETURNS DRAFT CONTENT                             │
│    Returns latest draft version (not published)             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. TRANSFORM & RENDER                                       │
│    - Transform data                                         │
│    - Render page                                            │
│    - Add preview banner                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. DISPLAY TO EDITOR                                       │
│     Yellow preview banner at top                            │
│     Draft content visible                                   │
│     "Exit Preview" button available                         │
└─────────────────────────────────────────────────────────────┘
```

### Preview Mode Key Points

**1. Draft Mode Cookie**

- Cookie name: `__prerender_bypass`
- Set by `draftMode().enable()`
- Persists across page navigations
- Cleared by `draftMode().disable()`

**2. API Parameter Difference**

```typescript
// Published content
status = published;

// Draft content
status = draft;
```

**3. Cache Behavior**

```typescript
// Published: Cached
cache: 'force-cache'
next: { tags: ['pages'], revalidate: false }

// Draft: Not cached
cache: 'no-store'
next: undefined
```

**4. Security**

- Preview requires secret token
- Token validated before enabling draft mode
- Unauthorized requests return 401

---

## 📢 Publish Flow (Content Update)

### Complete Publish & Revalidation Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. EDITOR PUBLISHES CONTENT IN STRAPI                       │
│    - Opens page in Strapi admin                             │
│    - Makes changes                                          │
│    - Clicks "Publish" button                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. STRAPI UPDATES DATABASE                                  │
│    - Saves content to database                              │
│    - Sets publishedAt timestamp                             │
│    - Updates status to "published"                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. STRAPI TRIGGERS WEBHOOK                                  │
│    Event: entry.publish                                     │
│    URL: https://example.com/api/revalidate                  │
│    Method: POST                                             │
│    Headers:                                                  │
│      x-strapi-secret: {STRAPI_WEBHOOK_SECRET}               │
│    Body:                                                     │
│      {                                                       │
│        "event": "entry.publish",                            │
│        "model": "page",                                     │
│        "entry": {                                           │
│          "id": 1,                                           │
│          "slug": "dental-implants",                         │
│          "title": "Dental Implants"                         │
│        }                                                     │
│      }                                                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. NEXT.JS REVALIDATE API RECEIVES WEBHOOK                  │
│    File: app/api/revalidate/route.ts                        │
│    POST /api/revalidate                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. VALIDATE WEBHOOK SECRET                                  │
│    const secret = request.headers.get('x-strapi-secret')    │
│    if (secret !== WEBHOOK_SECRET) {                         │
│      return 401 Unauthorized                                │
│    }                                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. PARSE WEBHOOK PAYLOAD                                    │
│    const payload = await request.json()                     │
│    Extract: model, event, entry (id, slug)                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. REVALIDATE CACHE TAGS                                    │
│    Model: "page" → Tags: ["pages", "page"]                  │
│                                                              │
│    revalidateTag("pages")  // All page queries              │
│    revalidateTag("page")   // Single page queries           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. REVALIDATE PATHS                                         │
│    revalidatePath("/")                    // Homepage        │
│    revalidatePath("/dental-implants")     // Specific page  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. CACHE INVALIDATED                                        │
│    Next.js marks cached data as stale                       │
│    Next request will fetch fresh data                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. RETURN SUCCESS RESPONSE                                 │
│     {                                                        │
│       "revalidated": true,                                  │
│       "tags": ["pages", "page"],                            │
│       "paths": ["/", "/dental-implants"],                   │
│       "executionTime": "15ms"                               │
│     }                                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 11. NEXT USER REQUEST                                       │
│     User visits: /dental-implants                           │
│     Cache: MISS (invalidated)                               │
│     Fetches fresh data from Strapi                          │
│     Caches new data                                         │
│     Serves updated content                                  │
└─────────────────────────────────────────────────────────────┘
```

### Revalidation Timing

```
Content Change → Webhook Trigger → Cache Invalidation → Fresh Data
     0ms              ~50ms              ~100ms           ~200ms

Total time from publish to live: < 1 second
```

---

## 🔄 Data Transformation

### Strapi Response → Frontend Format

**Strapi API Response (Raw)**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Dental Implants",
      "slug": "dental-implants",
      "content": "Rich text content...",
      "cover": {
        "url": "/uploads/image.jpg",
        "alternativeText": "Dental implant",
        "width": 1920,
        "height": 1080
      },
      "publishDate": "2024-01-01T00:00:00.000Z",
      "description": "Professional dental implants"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

**Transformed Frontend Format**

```typescript
{
  id: 1,
  title: "Dental Implants",
  slug: "dental-implants",
  content: "Rich text content...",
  cover: {
    url: "https://guild-biblical-expectations-easily.trycloudflare.com/uploads/image.jpg",
    alt: "Dental implant",
    width: 1920,
    height: 1080
  },
  publishDate: "2024-01-01T00:00:00.000Z",
  description: "Professional dental implants",
  seo: {
    metaTitle: "Dental Implants",
    metaDescription: "Professional dental implants"
  },
  layout: []
}
```

### Transformation Steps

**1. Extract Data**

```typescript
const pageData = strapiPage.data;
const attributes = pageData.attributes || pageData;
const id = pageData.id;
```

**2. Transform Media**

```typescript
// Before
cover: { url: "/uploads/image.jpg", ... }

// After
cover: { url: "https://guild-biblical-expectations-easily.trycloudflare.com/uploads/image.jpg", ... }
```

**3. Map SEO Fields**

```typescript
seo: {
  metaTitle: attributes.metaTitle || attributes.title,
  metaDescription: attributes.metaDescription || attributes.description
}
```

**4. Transform Blocks**

```typescript
// Before
{ __component: "blocks.hero", heading: "...", ... }

// After
{ blockType: "hero", heading: "...", ... }
```

---

## 🎯 API Client Layer

### API Client Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      API CLIENT LAYER                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  apiClient(endpoint, options)                        │  │
│  │  - Handles authentication                            │  │
│  │  - Manages caching                                   │  │
│  │  - Adds status parameter                            │  │
│  │  - Logs requests                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Query Functions                                     │  │
│  │  - getPageBySlug()                                   │  │
│  │  - getAllPages()                                     │  │
│  │  - getAllPageSlugs()                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Transformers                                        │  │
│  │  - transformPage()                                   │  │
│  │  - transformBlock()                                  │  │
│  │  - transformMedia()                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### API Client Flow

```typescript
// 1. Component calls query function
const page = await getPageBySlug("dental-implants", isDraftMode);

// 2. Query function calls API client
const response = await apiClient<StrapiPages>("/api/pages", {
  params: { "filters[slug][$eq]": slug, populate: "*" },
  isDraftMode,
  tags: ["pages", "page"],
});

// 3. API client builds URL
const url = new URL("/api/pages", STRAPI_URL);
url.searchParams.append("filters[slug][$eq]", slug);
url.searchParams.append("populate", "*");
url.searchParams.append("status", isDraftMode ? "draft" : "published");

// 4. API client makes request
const response = await fetch(url, {
  headers: { Authorization: `Bearer ${API_TOKEN}` },
  cache: isDraftMode ? "no-store" : "force-cache",
  next: isDraftMode ? undefined : { tags, revalidate: false },
});

// 5. API client returns data
return await response.json();

// 6. Query function transforms data
return transformPage(response);
```

---

## 🔐 Authentication Flow

### API Token Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. NEXT.JS LOADS ENVIRONMENT VARIABLES                      │
│    STRAPI_API_TOKEN=abc123...                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. API CLIENT ADDS TOKEN TO HEADERS                         │
│    headers: {                                               │
│      Authorization: `Bearer ${API_TOKEN}`                   │
│    }                                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. STRAPI VALIDATES TOKEN                                   │
│    - Checks token exists                                    │
│    - Validates token format                                 │
│    - Checks token permissions                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. STRAPI RETURNS DATA                                      │
│    - If valid: Returns requested data                       │
│    - If invalid: Returns 401 Unauthorized                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Cache Strategy

### Cache Decision Tree

```
Request Received
    │
    ├─► Is Draft Mode? ──YES──► cache: 'no-store'
    │                            next: undefined
    │                            Always fetch fresh
    │
    └─► NO (Published)
            │
            └─► cache: 'force-cache'
                next: {
                  tags: ['pages', 'page'],
                  revalidate: false
                }
                │
                ├─► Cache Hit? ──YES──► Serve from cache
                │
                └─► Cache Miss? ──YES──► Fetch from Strapi
                                         Cache response
                                         Serve to user
```

### Cache Tags Strategy

```
Model: "page"
    │
    ├─► Tag: "pages" (plural)
    │   Used for: List queries (getAllPages, getAllPageSlugs)
    │   Revalidates: All page list queries
    │
    └─► Tag: "page" (singular)
        Used for: Single page queries (getPageBySlug)
        Revalidates: All single page queries
```

---

## 🎯 Error Handling Flow

### Error Scenarios

**1. Page Not Found**

```
Request → Fetch Data → Empty Response → Return null → notFound()
```

**2. API Error**

```
Request → Fetch Data → 500 Error → Catch Error → Log Error → Return null
```

**3. Network Error**

```
Request → Fetch Data → Network Timeout → Catch Error → Log Error → Return null
```

**4. Invalid Token**

```
Request → Fetch Data → 401 Unauthorized → Catch Error → Log Error → Return null
```

---

## 📈 Performance Optimization

### Data Fetching Optimization

**1. Parallel Fetching**

```typescript
// Bad: Sequential
const page = await getPageBySlug(slug);
const pages = await getAllPages();

// Good: Parallel
const [page, pages] = await Promise.all([getPageBySlug(slug), getAllPages()]);
```

**2. Selective Population**

```typescript
// Bad: Populate everything
populate: "deep";

// Good: Populate only what's needed
populate: "*"; // First level only
```

**3. Field Selection**

```typescript
// Bad: Fetch all fields
GET /api/pages

// Good: Fetch only needed fields
GET /api/pages?fields[0]=slug&fields[1]=title
```

---

**This document provides complete data flow information. For implementation details, see FRONTEND_GUIDE.md and CMS_GUIDE.md.**
