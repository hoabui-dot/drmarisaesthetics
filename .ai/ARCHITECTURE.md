# System Architecture

## 🏛️ Architecture Overview

This system follows a **decoupled headless CMS architecture** with clear separation between content management (Strapi) and content presentation (Next.js).

```
┌─────────────────────────────────────────────────────────────┐
│                         USER LAYER                          │
│  Content Editors (Strapi Admin) | End Users (Next.js App)  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                      Next.js Frontend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   App Router │  │  Components  │  │  API Routes  │     │
│  │    (Pages)   │  │   (Blocks)   │  │  (Preview)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ REST API
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│                   Strapi REST API                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Content API │  │  Webhooks    │  │  Media API   │     │
│  │  (Pages)     │  │  (Events)    │  │  (Uploads)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                               │
│                PostgreSQL Database                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Pages     │  │    Media     │  │    Users     │     │
│  │   (Content)  │  │   (Files)    │  │   (Admin)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Next.js Role (Frontend)

### Primary Responsibilities

**1. Presentation Layer**
- Render pages using data from Strapi
- Provide responsive, accessible UI
- Handle client-side interactions
- Manage routing and navigation

**2. Data Fetching & Transformation**
- Fetch content from Strapi REST API
- Transform API responses to frontend format
- Handle loading and error states
- Implement caching strategy

**3. Preview Mode**
- Enable draft content preview
- Authenticate preview requests
- Display preview banner
- Handle preview exit

**4. Cache Management**
- Implement ISR (Incremental Static Regeneration)
- Handle on-demand revalidation
- Respond to webhook triggers
- Optimize performance

**5. SEO & Metadata**
- Generate dynamic meta tags
- Create Open Graph tags
- Handle structured data
- Support social sharing

### Technology Stack

```typescript
// Core Framework
Next.js 15.4.11 (App Router)
React 19.0.0
TypeScript 5

// Styling
Tailwind CSS 4
Radix UI (headless components)
shadcn/ui (component library)

// Forms & Validation
React Hook Form 7.71.2
Zod 4.3.6

// Utilities
clsx (className management)
tailwind-merge (className merging)
```

### Folder Structure

```
dental-frontend/src/
├── app/                          # App Router (Next.js 13+)
│   ├── [slug]/                   # Dynamic page route
│   │   └── page.tsx              # Page component
│   ├── api/                      # API routes
│   │   ├── preview/              # Preview mode endpoint
│   │   ├── exit-preview/         # Exit preview endpoint
│   │   └── revalidate/           # Webhook revalidation endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── blocks/                   # Block components
│   │   ├── HeroBlock.tsx         # Hero section
│   │   ├── ServicesBlock.tsx     # Services grid
│   │   ├── CTABlock.tsx          # Call-to-action
│   │   └── index.ts              # Barrel export
│   ├── ui/                       # UI components (shadcn/ui)
│   │   ├── button.tsx            # Button component
│   │   ├── input.tsx             # Input component
│   │   └── ...                   # Other UI components
│   ├── BlockRenderer.tsx         # Block renderer
│   ├── PreviewBanner.tsx         # Preview mode banner
│   ├── EmptyState.tsx            # Empty state component
│   ├── LoadingSkeleton.tsx       # Loading skeleton
│   └── ErrorBoundary.tsx         # Error boundary
│
├── lib/                          # Utilities and helpers
│   ├── api/                      # API layer
│   │   ├── client.ts             # API client (fetch wrapper)
│   │   ├── queries.ts            # Query functions
│   │   ├── transformers.ts       # Data transformers
│   │   └── debug.ts              # Debug utilities
│   └── utils.ts                  # General utilities
│
└── types/                        # TypeScript types
    └── strapi.ts                 # Strapi API types
```

### Key Architectural Patterns

**1. Server Components (Default)**
```typescript
// app/[slug]/page.tsx
export default async function Page({ params }) {
  // Fetch data on server
  const page = await getPageBySlug(params.slug);
  
  // Render on server
  return <BlockRenderer layout={page.layout} />;
}
```

**2. API Routes (Server-Side)**
```typescript
// app/api/preview/route.ts
export async function GET(request: NextRequest) {
  // Server-side logic
  const draft = await draftMode();
  draft.enable();
  
  // Redirect to page
  redirect(`/${slug}`);
}
```

**3. Client Components (When Needed)**
```typescript
'use client'; // Opt-in to client-side

export function InteractiveComponent() {
  const [state, setState] = useState();
  // Client-side interactivity
}
```

---

## 🎯 Strapi Role (Backend)

### Primary Responsibilities

**1. Content Management**
- Provide admin interface for editors
- Store and manage content
- Handle media uploads
- Manage content relationships

**2. API Layer**
- Expose REST API endpoints
- Handle authentication
- Filter and populate data
- Support draft/published states

**3. Draft & Publish**
- Manage content lifecycle
- Store draft versions
- Publish/unpublish content
- Track publication state

**4. Webhooks**
- Trigger on content changes
- Send notifications to Next.js
- Include event metadata
- Support custom headers

**5. Media Management**
- Store uploaded files
- Generate image variants
- Serve media files
- Handle media metadata

### Technology Stack

```typescript
// Core Framework
Strapi v5
Node.js
TypeScript

// Database
PostgreSQL (production)
SQLite (development)

// Plugins
preview-button (custom preview integration)
```

### Folder Structure

```
strapi-cms/
├── src/
│   └── api/                      # API endpoints
│       └── page/                 # Page content type
│           ├── content-types/    # Schema definition
│           │   └── page/
│           │       └── schema.json
│           ├── controllers/      # Request handlers
│           │   └── page.ts
│           ├── services/         # Business logic
│           │   └── page.ts
│           └── routes/           # Route definitions
│               └── page.ts
│
├── config/                       # Configuration files
│   ├── server.ts                 # Server config
│   ├── database.ts               # Database config
│   ├── plugins.ts                # Plugin config
│   ├── middlewares.ts            # Middleware config
│   └── admin.ts                  # Admin panel config
│
├── public/                       # Static files
│   └── uploads/                  # Uploaded media
│
└── database/                     # Database files
    └── migrations/               # Database migrations
```

### Content Type Schema

```json
{
  "kind": "collectionType",
  "collectionName": "pages",
  "info": {
    "singularName": "page",
    "pluralName": "pages",
    "displayName": "Page"
  },
  "options": {
    "draftAndPublish": true        // Enable draft/publish
  },
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title" },
    "content": { "type": "richtext" },
    "cover": { "type": "media" },
    "publishDate": { "type": "datetime" },
    "description": { "type": "text" }
  }
}
```

---

## 🔄 Separation of Concerns

### Frontend Concerns (Next.js)

**What Frontend DOES:**
- ✅ Fetch data from API
- ✅ Transform data for display
- ✅ Render UI components
- ✅ Handle user interactions
- ✅ Manage client-side state
- ✅ Implement caching strategy
- ✅ Generate SEO metadata
- ✅ Handle preview mode

**What Frontend DOES NOT:**
- ❌ Store content
- ❌ Manage content lifecycle
- ❌ Handle file uploads
- ❌ Authenticate editors
- ❌ Modify content directly

### Backend Concerns (Strapi)

**What Backend DOES:**
- ✅ Store content in database
- ✅ Provide admin interface
- ✅ Handle file uploads
- ✅ Manage content lifecycle
- ✅ Authenticate editors
- ✅ Expose REST API
- ✅ Trigger webhooks
- ✅ Manage permissions

**What Backend DOES NOT:**
- ❌ Render pages
- ❌ Handle routing
- ❌ Manage frontend state
- ❌ Generate HTML
- ❌ Handle SEO directly

---

## 🔌 API Contract

### REST API Endpoints

**1. Get All Pages**
```http
GET /api/pages?status=published
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": 1,
      "title": "Home",
      "slug": "home",
      "content": "...",
      "cover": { ... },
      "publishDate": "2024-01-01",
      "description": "..."
    }
  ],
  "meta": {
    "pagination": { ... }
  }
}
```

**2. Get Page by Slug**
```http
GET /api/pages?filters[slug][$eq]=home&populate=*&status=published
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": 1,
      "title": "Home",
      "slug": "home",
      ...
    }
  ]
}
```

**3. Get Draft Content**
```http
GET /api/pages?filters[slug][$eq]=home&populate=*&status=draft
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": 1,
      "title": "Home (Draft)",
      "slug": "home",
      ...
    }
  ]
}
```

### Webhook Payload

```json
{
  "event": "entry.publish",
  "model": "page",
  "entry": {
    "id": 1,
    "slug": "home",
    "title": "Home",
    ...
  }
}
```

---

## 🚀 Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Machine                         │
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   Next.js Dev    │         │   Strapi Dev     │         │
│  │  localhost:3000  │◄───────►│  localhost:1337  │         │
│  │  (Hot Reload)    │   API   │  (Hot Reload)    │         │
│  └──────────────────┘         └──────────────────┘         │
│                                        │                     │
│                                        ▼                     │
│                                ┌──────────────────┐         │
│                                │  SQLite Database │         │
│                                │   (File-based)   │         │
│                                └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                      Production Server                       │
│                                                              │
│  ┌──────────────────┐                                       │
│  │      Nginx       │  (Reverse Proxy + SSL)               │
│  │   Port 80/443    │                                       │
│  └────────┬─────────┘                                       │
│           │                                                  │
│           ├──────────────┬──────────────────────────┐      │
│           │              │                          │       │
│           ▼              ▼                          ▼       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Next.js    │  │   Strapi     │  │  PostgreSQL  │    │
│  │  Container   │  │  Container   │  │  Container   │    │
│  │  Port 3000   │  │  Port 1337   │  │  Port 5432   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Docker Network (Internal)                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Docker Compose Structure

```yaml
services:
  # Frontend
  frontend:
    build: ./dental-frontend
    ports:
      - "3000:3000"
    environment:
      - STRAPI_URL=http://strapi:1337
      - STRAPI_API_TOKEN=${STRAPI_API_TOKEN}
    depends_on:
      - strapi

  # Backend
  strapi:
    build: ./strapi-cms
    ports:
      - "1337:1337"
    environment:
      - DATABASE_CLIENT=postgres
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres

  # Database
  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=strapi
      - POSTGRES_USER=strapi
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

volumes:
  postgres_data:
```

---

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Layers                     │
│                                                              │
│  1. Public API (No Auth)                                    │
│     └─► Published content only                              │
│                                                              │
│  2. Authenticated API (Bearer Token)                        │
│     └─► Full access (draft + published)                     │
│                                                              │
│  3. Preview Mode (Secret Token)                             │
│     └─► Draft content preview                               │
│                                                              │
│  4. Webhook (Secret Header)                                 │
│     └─► Cache revalidation                                  │
│                                                              │
│  5. Admin Panel (Username/Password)                         │
│     └─► Content management                                  │
└─────────────────────────────────────────────────────────────┘
```

### Security Layers

**1. API Token (STRAPI_API_TOKEN)**
- Full access to Strapi API
- Used by Next.js to fetch content
- Stored in environment variables
- Never exposed to client

**2. Preview Secret (NEXT_PREVIEW_SECRET)**
- Enables preview mode
- Validates preview requests
- Stored in environment variables
- Shared with Strapi for preview button

**3. Webhook Secret (STRAPI_WEBHOOK_SECRET)**
- Validates webhook requests
- Prevents unauthorized revalidation
- Stored in environment variables
- Configured in Strapi webhook settings

**4. Admin Credentials**
- Username/password for Strapi admin
- Managed by Strapi
- Not used by Next.js

---

## 📊 Performance Architecture

### Caching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      Cache Layers                            │
│                                                              │
│  1. Browser Cache                                           │
│     └─► Static assets (images, CSS, JS)                     │
│                                                              │
│  2. CDN Cache (Optional)                                    │
│     └─► Static pages and assets                             │
│                                                              │
│  3. Next.js Data Cache                                      │
│     └─► API responses (force-cache)                         │
│                                                              │
│  4. Next.js Full Route Cache                                │
│     └─► Pre-rendered pages (ISR)                            │
│                                                              │
│  5. Strapi Cache (Optional)                                 │
│     └─► Database queries                                    │
└─────────────────────────────────────────────────────────────┘
```

### Cache Invalidation

```
Content Change → Webhook → Next.js Revalidate API
                              │
                              ├─► revalidateTag('pages')
                              ├─► revalidateTag('page')
                              ├─► revalidatePath('/')
                              └─► revalidatePath('/{slug}')
                                    │
                                    ▼
                            Cache Cleared
                                    │
                                    ▼
                            Next Request Fetches Fresh Data
```

---

## 🔄 State Management

### Server State (Default)
- Data fetched on server
- No client-side state management needed
- Automatic caching by Next.js

### Client State (When Needed)
- React useState for local state
- React Hook Form for form state
- No global state management (not needed)

---

## 🎨 Component Architecture

### Component Hierarchy

```
App Layout (Root)
  │
  ├─► Page Component (Server)
  │     │
  │     ├─► Preview Banner (Client)
  │     │
  │     └─► Block Renderer (Server)
  │           │
  │           ├─► Hero Block (Server)
  │           ├─► Services Block (Server)
  │           └─► CTA Block (Server)
  │
  └─► Not Found Page (Server)
```

### Component Types

**1. Server Components (Default)**
- Fetch data on server
- No JavaScript sent to client
- Better performance
- SEO-friendly

**2. Client Components (Opt-in)**
- Interactive components
- Use React hooks
- Handle user events
- Smaller bundle size

**3. Shared Components**
- Can be used in both contexts
- No hooks or interactivity
- Pure presentation

---

## 📦 Build & Deployment Process

### Build Process

```
1. Install Dependencies
   npm install

2. Build Next.js
   npm run build
   └─► Generates .next/ directory
       ├─► Static pages
       ├─► Server functions
       └─► Client bundles

3. Build Strapi
   npm run build
   └─► Generates dist/ directory
       └─► Compiled TypeScript

4. Create Docker Images
   docker-compose build
   └─► frontend:latest
   └─► strapi:latest
```

### Deployment Process

```
1. Push Code to Repository
   git push origin main

2. Pull on Server
   git pull origin main

3. Build Images
   docker-compose build

4. Start Services
   docker-compose up -d

5. Run Migrations (if needed)
   docker-compose exec strapi npm run strapi migrate

6. Verify Deployment
   curl https://your-domain.com
```

---

## 🔍 Monitoring & Observability

### Logging Strategy

**Frontend Logs**
- API requests and responses
- Cache hits and misses
- Preview mode events
- Errors and warnings

**Backend Logs**
- API requests
- Database queries
- Webhook triggers
- Admin actions

**Infrastructure Logs**
- Docker container logs
- Nginx access logs
- Database logs

### Metrics to Monitor

**Performance Metrics**
- Page load time
- API response time
- Cache hit rate
- Build time

**Business Metrics**
- Page views
- Content updates
- Preview usage
- Error rate

---

## 🎯 Scalability Considerations

### Horizontal Scaling

**Frontend**
- Stateless Next.js instances
- Load balancer distribution
- Shared cache (Redis)

**Backend**
- Multiple Strapi instances
- Shared database
- Shared media storage (S3)

**Database**
- Read replicas
- Connection pooling
- Query optimization

### Vertical Scaling

**Frontend**
- Increase container resources
- Optimize bundle size
- Code splitting

**Backend**
- Increase container resources
- Database indexing
- Query optimization

---

**This document provides detailed architecture information. For data flow specifics, see DATA_FLOW.md.**
