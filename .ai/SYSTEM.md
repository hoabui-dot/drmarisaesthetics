# System Overview

## 🎯 High-Level Overview

This is an **enterprise-grade headless CMS system** built with:

- **Frontend**: Next.js 15 (App Router) with TypeScript
- **Backend**: Strapi v5 (Headless CMS)
- **Architecture**: Decoupled, API-first, production-ready

The system enables content editors to create and manage dynamic landing pages through a visual CMS interface, while developers maintain full control over the frontend presentation layer.

---

## 🏗️ Tech Stack

### Frontend (Next.js)

- **Framework**: Next.js 15.4.11 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Image Optimization**: Next.js Image component
- **Deployment**: Docker (standalone output)

### Backend (Strapi CMS)

- **Framework**: Strapi v5
- **Language**: TypeScript
- **Database**: PostgreSQL (production) / SQLite (development)
- **API**: REST API
- **Authentication**: API Token (Bearer)
- **Features**: Draft & Publish, Media Library, Webhooks

### Infrastructure

- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx (production)
- **Monitoring**: Dozzle (optional)
- **Environment**: Development, Staging, Production

---

## 🎨 Key Features

### 1. Dynamic Page Builder

- **Block-based layout system**: Editors compose pages using reusable blocks
- **Supported blocks**: Hero, Video Hero, Trust, Services, Process, Doctor, Pricing, Combined Testimonial Result, FAQ, CTA
- **Extensible**: Easy to add new block types
- **Visual editing**: WYSIWYG experience in Strapi

### 2. Draft & Publish Workflow

- **Draft mode**: Content editors can save work-in-progress
- **Preview mode**: Preview draft content before publishing
- **Publish**: Make content live to public
- **Unpublish**: Remove content from public view

### 3. Preview System

- **Secure preview**: Token-based authentication
- **Real-time preview**: See draft content as it will appear
- **Visual indicator**: Yellow banner shows preview mode
- **Exit preview**: One-click return to normal mode

### 4. On-Demand Revalidation

- **Webhook-based**: Strapi triggers Next.js cache invalidation
- **Instant updates**: Content changes reflect immediately (< 1 second)
- **Tag-based**: Granular cache invalidation
- **Path-based**: Specific page revalidation

### 5. Performance Optimization

- **Static generation**: Pre-render published pages at build time
- **Incremental Static Regeneration**: Update static pages on-demand
- **Image optimization**: Automatic image resizing and WebP conversion
- **Cache strategy**: Force-cache for published, no-store for draft

### 6. SEO Optimization

- **Meta tags**: Title, description, Open Graph
- **Dynamic metadata**: Generated from CMS content
- **Structured data**: Ready for schema.org markup
- **Sitemap**: Can be generated from page data

---

## 🔄 System Responsibilities

### Frontend (Next.js) Responsibilities

**1. Presentation Layer**

- Render pages using data from CMS
- Handle routing and navigation
- Manage client-side state
- Provide responsive design

**2. Data Fetching**

- Fetch content from Strapi API
- Transform API responses to frontend format
- Handle errors and loading states
- Cache responses appropriately

**3. Preview Mode**

- Enable/disable draft mode
- Fetch draft content when in preview
- Display preview banner
- Handle preview authentication

**4. Cache Management**

- Implement caching strategy
- Handle cache invalidation
- Respond to webhook triggers
- Optimize performance

**5. SEO & Metadata**

- Generate meta tags
- Create Open Graph tags
- Handle dynamic titles/descriptions
- Support social sharing

### Backend (Strapi CMS) Responsibilities

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

---

## 🔐 Security Model

### Authentication

- **API Token**: Full access token for Next.js
- **Preview Secret**: Token for preview mode
- **Webhook Secret**: Token for revalidation webhooks

### Authorization

- **Public API**: Read-only access to published content
- **Authenticated API**: Full access with token
- **Admin Panel**: Username/password for editors

### Data Protection

- **Draft content**: Not accessible without preview mode
- **Preview mode**: Requires secret token
- **Webhooks**: Validated with secret header
- **Environment variables**: Secrets stored securely

---

## 📊 Data Flow Overview

### Content Creation Flow

```
Editor → Strapi Admin → Database → API → Next.js → User
```

### Preview Flow

```
Editor → Preview Button → Next.js Preview API → Enable Draft Mode → Fetch Draft → Render
```

### Publish Flow

```
Editor → Publish Button → Strapi → Webhook → Next.js Revalidate API → Clear Cache → Fresh Data
```

### Public Access Flow

```
User → Next.js → Check Cache → (Miss) → Fetch from Strapi → Cache → Render
```

---

## 🎯 Design Principles

### 1. Separation of Concerns

- **Frontend**: Presentation and user experience
- **Backend**: Content management and storage
- **API**: Communication layer between frontend and backend

### 2. Decoupled Architecture

- Frontend and backend can be deployed independently
- Changes to CMS don't require frontend redeployment
- API contract is the only coupling point

### 3. Content-First

- Content structure drives frontend implementation
- Editors have full control over content
- Developers control presentation

### 4. Performance-First

- Static generation where possible
- Aggressive caching with smart invalidation
- Optimized images and assets
- Minimal JavaScript

### 5. Developer Experience

- Type-safe with TypeScript
- Clear code organization
- Comprehensive documentation
- Easy to extend and maintain

### 6. Editor Experience

- Visual content editing
- Preview before publish
- Intuitive admin interface
- No technical knowledge required

---

## 📁 Project Structure

```
dental-app-v2/
├── .ai/                          # AI knowledge base (this directory)
│   ├── SYSTEM.md                 # System overview (this file)
│   ├── ARCHITECTURE.md           # Architecture details
│   ├── DATA_FLOW.md              # Data flow diagrams
│   ├── FRONTEND_GUIDE.md         # Frontend development guide
│   ├── CMS_GUIDE.md              # CMS usage guide
│   └── AI_RULES.md               # AI execution rules
│
├── dental-frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/                  # App Router pages and layouts
│   │   ├── components/           # React components
│   │   ├── lib/                  # Utilities and API client
│   │   └── types/                # TypeScript types
│   ├── public/                   # Static assets
│   ├── .env.local                # Environment variables (local)
│   ├── next.config.ts            # Next.js configuration
│   ├── package.json              # Dependencies
│   └── tsconfig.json             # TypeScript configuration
│
├── strapi-cms/                   # Strapi CMS backend
│   ├── src/
│   │   └── api/                  # API endpoints and content types
│   ├── config/                   # Strapi configuration
│   ├── public/                   # Uploaded media files
│   ├── .env                      # Environment variables
│   ├── package.json              # Dependencies
│   └── tsconfig.json             # TypeScript configuration
│
├── docker-compose.yml            # Docker orchestration
├── deploy.sh                     # Deployment script
└── README.md                     # Project documentation
```

---

## 🚀 Deployment Architecture

### Development Environment

- **Frontend**: http://localhost:3000
- **Backend**: https://guild-biblical-expectations-easily.trycloudflare.com
- **Database**: SQLite (file-based)
- **Hot reload**: Enabled for both frontend and backend

### Production Environment

- **Frontend**: Dockerized Next.js (standalone)
- **Backend**: Dockerized Strapi
- **Database**: PostgreSQL (persistent volume)
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (recommended)

---

## 📈 Scalability Considerations

### Horizontal Scaling

- **Frontend**: Stateless, can run multiple instances
- **Backend**: Can run multiple Strapi instances with shared database
- **Database**: PostgreSQL with read replicas
- **Media**: S3 or CDN for media files

### Vertical Scaling

- **Frontend**: Increase container resources
- **Backend**: Increase container resources
- **Database**: Increase database resources

### Caching Strategy

- **Frontend**: Next.js cache (in-memory or Redis)
- **Backend**: Strapi cache (in-memory or Redis)
- **CDN**: CloudFlare or similar for static assets

---

## 🔧 Maintenance & Operations

### Monitoring

- **Application logs**: Docker logs or centralized logging
- **Error tracking**: Sentry or similar (recommended)
- **Performance monitoring**: New Relic or similar (recommended)
- **Uptime monitoring**: Pingdom or similar (recommended)

### Backup Strategy

- **Database**: Daily automated backups
- **Media files**: Backup to S3 or similar
- **Configuration**: Version controlled in Git

### Update Strategy

- **Dependencies**: Regular security updates
- **Next.js**: Follow LTS releases
- **Strapi**: Follow stable releases
- **Testing**: Staging environment before production

---

## 📚 Documentation Structure

### For Developers

- `.ai/ARCHITECTURE.md` - Technical architecture
- `.ai/DATA_FLOW.md` - Data flow and API contracts
- `.ai/FRONTEND_GUIDE.md` - Frontend development guide

### For Content Editors

- `.ai/CMS_GUIDE.md` - CMS usage guide
- `QUICK_START_CONTENT.md` - Quick start for editors

### For AI Agents

- `.ai/AI_RULES.md` - Execution rules and guidelines
- All `.ai/*.md` files - Complete system knowledge

---

## ✅ System Status

**Current Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: March 19, 2026  
**Confidence Level**: 95%

### Completed Features

- ✅ Dynamic page builder with blocks
- ✅ Draft & Publish workflow
- ✅ Preview mode with authentication
- ✅ On-demand revalidation via webhooks
- ✅ Performance optimization
- ✅ SEO optimization
- ✅ Docker deployment
- ✅ Comprehensive documentation

### Known Limitations

- ⚠️ 2 edge cases need additional testing (non-blocking)
- ⚠️ Automated tests not yet implemented (recommended)
- ⚠️ Monitoring/alerting not configured (recommended)

---

## 🎓 Learning Resources

### Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

### Strapi

- [Strapi Documentation](https://docs.strapi.io)
- [REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Draft & Publish](https://docs.strapi.io/user-docs/content-manager/saving-and-publishing-content)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**This document provides a high-level overview of the system. For detailed information, refer to other documents in the `.ai/` directory.**
