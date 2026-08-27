# Architecture Overview - Next.js + Strapi

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
│  ┌────────────────────────────────────────────────────────┐    │
│  │  App Router                                             │    │
│  │  ├── (frontend)/                                        │    │
│  │  │   ├── page.tsx          (Homepage)                   │    │
│  │  │   └── [slug]/page.tsx   (Dynamic pages)             │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                    │
│                             │ Import                             │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Components                                             │    │
│  │  ├── BlockRenderer.tsx                                  │    │
│  │  └── blocks/                                            │    │
│  │      ├── HeroBlock.tsx                                  │    │
│  │      ├── ServicesBlock.tsx                              │    │
│  │      └── CTABlock.tsx                                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                    │
│                             │ Import                             │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Data Layer (src/lib/strapi/)                          │    │
│  │  ├── client.ts        (Fetch wrapper)                  │    │
│  │  ├── queries.ts       (API functions)                  │    │
│  │  └── transformers.ts  (Data mapping)                   │    │
│  └────────────────────────────────────────────────────────┘    │
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
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Admin Panel                                            │    │
│  │  https://guild-biblical-expectations-easily.trycloudflare.com/admin                           │    │
│  │  - Content management                                   │    │
│  │  - User management                                      │    │
│  │  - Media library                                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  REST API                                               │    │
│  │  /api/pages                                             │    │
│  │  /api/upload                                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Content Types                                          │    │
│  │  ├── Page (collection)                                  │    │
│  │  └── Components:                                        │    │
│  │      ├── blocks.hero                                    │    │
│  │      ├── blocks.services                                │    │
│  │      └── blocks.cta                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              │ SQL Queries
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      POSTGRESQL                                  │
│                      (Port 5432)                                 │
│                                                                  │
│  Databases:                                                      │
│  └── dental_cms_strapi                                          │
│      ├── pages                                                   │
│      ├── components_blocks_hero                                 │
│      ├── components_blocks_services                             │
│      ├── components_blocks_cta                                  │
│      ├── files (media)                                          │
│      └── users                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Page Request Flow

```
User visits /home
    ↓
Next.js [slug]/page.tsx
    ↓
getPageBySlug('home')
    ↓
strapiClient('/api/pages?filters[slug][$eq]=home&populate=deep')
    ↓
Strapi API
    ↓
PostgreSQL Query
    ↓
Strapi Response (JSON)
    ↓
transformStrapiPage() - Transform data
    ↓
BlockRenderer - Render blocks
    ↓
HeroBlock, ServicesBlock, CTABlock
    ↓
HTML sent to browser
```

### 2. Content Creation Flow

```
Admin logs into Strapi
    ↓
Creates new Page
    ↓
Adds Hero block
    ↓
Adds Services block
    ↓
Adds CTA block
    ↓
Publishes page
    ↓
Data saved to PostgreSQL
    ↓
Available via API
    ↓
Next.js fetches on next request
    ↓
Cached for 60 seconds (ISR)
```

---

## File Structure

```
dental-cms/                           # Root directory
├── dental-frontend/                  # Next.js frontend service
│   ├── src/
│   │   ├── app/
│   │   │   └── (frontend)/
│   │   │       ├── page.tsx          # Homepage
│   │   │       ├── layout.tsx        # Frontend layout
│   │   │       └── [slug]/
│   │   │           └── page.tsx      # Dynamic pages
│   │   │
│   │   ├── components/
│   │   │   ├── BlockRenderer.tsx     # Block router
│   │   │   └── blocks/
│   │   │       ├── HeroBlock.tsx     # Hero component
│   │   │       ├── ServicesBlock.tsx # Services component
│   │   │       └── CTABlock.tsx      # CTA component
│   │   │
│   │   ├── lib/
│   │   │   └── strapi/
│   │   │       ├── client.ts         # Fetch wrapper
│   │   │       ├── queries.ts        # API functions
│   │   │       └── transformers.ts   # Data mapping
│   │   │
│   │   └── types/
│   │       └── strapi.ts             # TypeScript types
│   │
│   ├── Dockerfile                    # Frontend container
│   └── package.json                  # Frontend dependencies
│
├── strapi-cms/                       # Strapi CMS service
│   ├── config/
│   │   ├── database.ts               # PostgreSQL config
│   │   ├── server.ts                 # Server config
│   │   ├── admin.ts                  # Admin panel config
│   │   └── middlewares.ts            # CORS, etc.
│   │
│   ├── public/
│   │   └── uploads/                  # Media uploads
│   │
│   ├── Dockerfile                    # Strapi container
│   └── package.json                  # Strapi dependencies
│
├── docker-compose.yml                # Service orchestration
├── deploy.sh                         # Deployment script
└── README.md                         # Main documentation
```

---

## API Endpoints

### Strapi REST API

**Get all pages:**

```
GET /api/pages?populate=deep
```

**Get page by slug:**

```
GET /api/pages?filters[slug][$eq]=home&populate=deep
```

**Get page by ID:**

```
GET /api/pages/1?populate=deep
```

**Response format:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Home",
      "slug": "home",
      "metaTitle": "Welcome",
      "metaDescription": "Description",
      "layout": [
        {
          "__component": "blocks.hero",
          "id": 1,
          "heading": "Welcome",
          "subheading": "Text",
          "image": {
            "data": {
              "id": 1,
              "attributes": {
                "url": "/uploads/image.jpg",
                "alternativeText": "Hero"
              }
            }
          }
        }
      ]
    }
  }
}
```

---

## Environment Variables

### Next.js (.env.local)

```env
# Strapi API
STRAPI_URL=https://guild-biblical-expectations-easily.trycloudflare.com
STRAPI_API_TOKEN=your-api-token-here

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Strapi (strapi-cms/.env)

```env
# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS=generated-key-1,generated-key-2
API_TOKEN_SALT=generated-salt
ADMIN_JWT_SECRET=generated-secret
TRANSFER_TOKEN_SALT=generated-salt
JWT_SECRET=generated-secret

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=dental_cms_strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false
```

---

## Key Differences: Payload vs Strapi

| Feature         | Payload CMS            | Strapi                   |
| --------------- | ---------------------- | ------------------------ |
| **Integration** | Embedded in Next.js    | Separate service         |
| **Port**        | Same as Next.js (3000) | Separate (1337)          |
| **Admin UI**    | /admin route           | Separate app             |
| **API**         | Built-in               | REST/GraphQL             |
| **Data Format** | Flat structure         | Nested (data.attributes) |
| **Block Type**  | `blockType`            | `__component`            |
| **Media**       | ID reference           | Full object              |
| **Database**    | Shared tables          | Separate tables          |

---

## Performance Considerations

### Next.js ISR (Incremental Static Regeneration)

- Pages cached for 60 seconds
- Stale content served while revalidating
- Optimal balance between performance and freshness

### Strapi Caching

- Built-in REST cache
- Can add Redis for production
- Media files served directly

### Database

- PostgreSQL connection pooling
- Indexed slug field for fast lookups
- Separate databases for isolation

---

## Security

### Authentication

- Strapi handles user authentication
- JWT tokens for API access
- Role-based access control (RBAC)

### API Security

- API tokens for Next.js → Strapi communication
- Public permissions for read-only access
- Authenticated permissions for content management

### CORS

- Strapi configured to allow Next.js origin
- Prevents unauthorized access from other domains

---

## Deployment

### Development

```bash
# Terminal 1: Strapi
cd strapi-cms
npm run develop

# Terminal 2: Next.js
npm run dev
```

### Production

```bash
# Build Strapi
cd strapi-cms
npm run build
npm start

# Build Next.js
npm run build
npm start
```

### Docker

```bash
# Start all services
docker-compose -f docker-compose.strapi.yml up -d

# View logs
docker-compose -f docker-compose.strapi.yml logs -f
```

---

## Next Steps

1. ✅ Complete Strapi content types setup (see STRAPI_SETUP_GUIDE.md)
2. ⏳ Implement query functions in `src/lib/strapi/queries.ts`
3. ⏳ Test API integration
4. ⏳ Verify frontend rendering
5. ⏳ Deploy to production
