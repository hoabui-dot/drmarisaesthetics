# Dental Frontend - Next.js Application

Next.js 15 frontend application for the dental landing pages system. Consumes content from Strapi CMS via REST API.

## 🚀 Tech Stack

- **Framework:** Next.js 15.4.11 (App Router)
- **Runtime:** Node.js 22.x
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Deployment:** Docker

## 📋 Features

- ✅ **Server-Side Rendering** - Fast initial page loads
- ✅ **ISR (Incremental Static Regeneration)** - 60s revalidation
- ✅ **Preview Mode** - Preview draft content before publishing
- ✅ **Block-Based Rendering** - Dynamic content blocks
- ✅ **SEO Optimized** - Meta tags, OpenGraph, Twitter cards
- ✅ **Image Optimization** - Next.js Image component
- ✅ **TypeScript** - Full type safety
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Loading States** - Skeleton screens

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x
- Strapi CMS running (see ../strapi-cms/)

### Development Setup

1. **Install dependencies:**

```bash
cd dental-frontend
npm install
```

2. **Configure environment:**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
STRAPI_URL=https://guild-biblical-expectations-easily.trycloudflare.com
STRAPI_API_TOKEN=your-api-token-from-strapi
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PREVIEW_SECRET=your-secure-preview-secret-change-in-production
```

3. **Start development server:**

```bash
npm run dev
```

4. **Access:**

- Frontend: http://localhost:3000
- Homepage: http://localhost:3000
- Dynamic pages: http://localhost:3000/[slug]

### Docker Setup

From the root directory:

```bash
# Start all services
docker-compose up -d

# View frontend logs
docker-compose logs -f frontend
```

## 📁 Project Structure

```
dental-frontend/
├── src/
│   ├── app/
│   │   └── (frontend)/
│   │       ├── page.tsx          # Homepage
│   │       ├── layout.tsx        # Frontend layout
│   │       ├── not-found.tsx     # 404 page
│   │       └── [slug]/
│   │           └── page.tsx      # Dynamic pages
│   │
│   ├── components/
│   │   ├── BlockRenderer.tsx     # Block router
│   │   ├── EmptyState.tsx        # Empty state UI
│   │   ├── ErrorBoundary.tsx     # Error handling
│   │   ├── LoadingSkeleton.tsx   # Loading states
│   │   └── blocks/               # Block components
│   │       ├── HeroBlock.tsx
│   │       ├── ServicesBlock.tsx
│   │       ├── CTABlock.tsx
│   │       └── index.ts
│   │
│   ├── lib/
│   │   └── strapi/               # Strapi integration
│   │       ├── client.ts         # API client
│   │       ├── queries.ts        # Query functions
│   │       ├── transformers.ts   # Data transformation
│   │       └── debug.ts          # Debug utilities
│   │
│   └── types/
│       └── strapi.ts             # TypeScript types
│
├── public/                       # Static assets
├── Dockerfile                    # Production container
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
└── package.json                  # Dependencies
```

## 🔌 Strapi Integration

### Preview Mode

The application supports previewing draft content from Strapi before publishing.

**Quick Setup:**

1. Add preview secret to `.env`:

```env
NEXT_PREVIEW_SECRET=your-secure-preview-secret
```

2. Configure Strapi preview URL:

```
http://localhost:3000/api/preview?slug={slug}&secret=your-secure-preview-secret
```

3. Test:
   - Create draft page in Strapi
   - Click "Preview" button
   - See draft content with yellow banner

**Documentation:**

- Complete guide: `docs/PREVIEW_MODE_SETUP.md`
- Quick reference: `docs/PREVIEW_QUICK_REFERENCE.md`
- Flow diagrams: `docs/PREVIEW_FLOW_DIAGRAM.md`

### API Client

The application uses a custom Strapi client located in `src/lib/strapi/`:

- **client.ts** - Fetch wrapper with authentication
- **queries.ts** - API query functions
- **transformers.ts** - Transform Strapi response to app format
- **debug.ts** - Debug utilities

### Data Flow

```
Page Request
    ↓
getPageBySlug('home')
    ↓
strapiClient('/api/pages?filters[slug][$eq]=home&populate=deep')
    ↓
Strapi API
    ↓
transformStrapiPage()
    ↓
BlockRenderer
    ↓
HeroBlock, ServicesBlock, CTABlock
    ↓
Rendered HTML
```

### Example Usage

```typescript
import { getPageBySlug } from '@/lib/strapi/queries';

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return <BlockRenderer blocks={page.layout} />;
}
```

## 🎨 Block System

The application uses a block-based content system. Each block type has a corresponding React component:

### Available Blocks

**Hero Block** (`blocks.hero`)

- Heading
- Subheading
- Background image

**Services Block** (`blocks.services`)

- Heading
- Service items (repeatable)
  - Title
  - Description
  - Image

**CTA Block** (`blocks.cta`)

- Text
- Button label
- Link

### Adding New Blocks

1. Create component in `src/components/blocks/`
2. Add to `src/components/blocks/index.ts`
3. Update `BlockRenderer.tsx`
4. Add TypeScript types in `src/types/strapi.ts`
5. Create corresponding component in Strapi

See `src/components/blocks/README.md` for details.

## 🔧 Configuration

### Environment Variables

**Development (.env.local):**

```env
STRAPI_URL=https://guild-biblical-expectations-easily.trycloudflare.com
STRAPI_API_TOKEN=your-dev-token
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

**Docker (.env.docker):**

```env
STRAPI_URL=http://strapi:1337
STRAPI_API_TOKEN=your-token
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

**Production (.env.production):**

```env
STRAPI_URL=https://api.yourdomain.com
STRAPI_API_TOKEN=your-production-token
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
```

### Next.js Configuration

Key settings in `next.config.ts`:

```typescript
{
  output: 'standalone',           // For Docker deployment
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
}
```

## 📊 Performance

### ISR (Incremental Static Regeneration)

Pages are cached and revalidated every 60 seconds:

```typescript
export const revalidate = 60;
```

### Image Optimization

Using Next.js Image component for automatic optimization:

```typescript
<Image
  src={imageUrl}
  alt={alt}
  width={800}
  height={600}
  priority={isPriority}
/>
```

### Caching Strategy

- Static pages: Generated at build time
- Dynamic pages: ISR with 60s revalidation
- API calls: Cached by Next.js fetch
- Images: Optimized and cached

## 🧪 Testing

### Manual Testing

```bash
# Start dev server
npm run dev

# Visit pages
open http://localhost:3000
open http://localhost:3000/home
```

### Build Testing

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### Can't connect to Strapi

Check environment variables:

```bash
echo $STRAPI_URL
echo $STRAPI_API_TOKEN
```

Verify Strapi is running:

```bash
curl https://guild-biblical-expectations-easily.trycloudflare.com/_health
```

### Pages not loading

Check Strapi API:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?populate=deep
```

Verify content is published in Strapi admin.

### Build errors

Clear Next.js cache:

```bash
rm -rf .next
npm run build
```

### Image loading issues

Check Next.js image configuration in `next.config.ts`:

- Verify remote patterns match Strapi URL
- Check image URLs in Strapi response

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## 🚀 Deployment

### Docker Production

From root directory:

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f frontend
```

### Standalone Deployment

```bash
cd dental-frontend
npm run build
npm start
```

### Vercel Deployment

1. Connect repository to Vercel
2. Set environment variables:
   - `STRAPI_URL`
   - `STRAPI_API_TOKEN`
   - `NEXT_PUBLIC_SERVER_URL`
3. Deploy

## 🔒 Security

- ✅ API token stored in environment variables
- ✅ No secrets in client-side code
- ✅ CORS handled by Strapi
- ✅ Non-root user in Docker
- ✅ Multi-stage Docker build
- ✅ Input validation
- ✅ Error boundaries

## 📚 Documentation

- **ARCHITECTURE.md** - System architecture overview
- **DOCUMENTATION.md** - Documentation index
- **docs/PREVIEW_MODE_SETUP.md** - Complete preview mode setup guide
- **docs/PREVIEW_QUICK_REFERENCE.md** - Quick reference for preview mode
- **docs/PREVIEW_FLOW_DIAGRAM.md** - Visual flow diagrams
- **docs/DESIGN_SYSTEM.md** - Design system documentation
- **docs/STRAPI_CONTENT_GUIDE.md** - CMS usage guide for editors
- **src/components/blocks/README.md** - Block system details

## 🆘 Support

- **Next.js Docs:** https://nextjs.org/docs
- **Strapi Integration:** See ../strapi-cms/README.md
- **Issues:** Open GitHub issue

---

**Built with Next.js 15** ⚡
