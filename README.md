# Dental CMS - Next.js + Strapi

A modern, production-ready dental landing page system with headless CMS architecture.

## 🚀 Tech Stack

- **Frontend:** Next.js 15.4.11 (App Router) - [dental-frontend/](./dental-frontend)
- **Backend:** Strapi 5.40.0 (Headless CMS) - [strapi-cms/](./strapi-cms)
- **Database:** PostgreSQL 16
- **Styling:** Tailwind CSS 4
- **Deployment:** Docker + Docker Compose

## 📋 Features

- ✅ **Headless CMS Architecture** - Separate frontend and backend services
- ✅ **Block-Based Page Builder** - Hero, Services, CTA blocks
- ✅ **SEO Optimized** - Meta tags, OpenGraph, Twitter cards
- ✅ **Image Optimization** - Next.js Image component
- ✅ **ISR (Incremental Static Regeneration)** - 60s revalidation
- ✅ **TypeScript** - Full type safety
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Docker Ready** - Production-optimized containers
- ✅ **Health Checks** - Automatic service monitoring

## 🏗️ Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Next.js    │────▶│   Strapi    │────▶│ PostgreSQL  │
│  Frontend   │     │   CMS API   │     │  Database   │
│  Port 3000  │     │  Port 1337  │     │  Port 5432  │
└─────────────┘     └─────────────┘     └─────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Option 1: Docker (Recommended)

1. **Clone and configure:**

```bash
git clone <repository>
cd dental-cms
cp .env.example .env
# Edit .env with your configuration
```

2. **Start all services:**

```bash
./deploy.sh up
```

3. **Configure Strapi:**

- Open https://guild-biblical-expectations-easily.trycloudflare.com/admin
- Create admin user
- Follow setup guides in strapi-cms/

4. **Access:**

- Frontend: http://localhost:3000
- Strapi Admin: https://guild-biblical-expectations-easily.trycloudflare.com/admin
- Strapi API: https://guild-biblical-expectations-easily.trycloudflare.com/api

### Option 2: Local Development

1. **Start PostgreSQL:**

```bash
docker-compose up -d postgres
```

2. **Start Strapi:**

```bash
cd strapi-cms
npm install
npm run develop
```

3. **Configure Strapi:**

- Open https://guild-biblical-expectations-easily.trycloudflare.com/admin
- Create admin user
- See strapi-cms/QUICKSTART_STRAPI.md

4. **Start Next.js:**

```bash
cd dental-frontend
npm install
npm run dev
```

5. **Access:**

- Frontend: http://localhost:3000
- Strapi Admin: https://guild-biblical-expectations-easily.trycloudflare.com/admin

## 📚 Documentation

### Getting Started

- **strapi-cms/QUICKSTART_STRAPI.md** - 15-minute Strapi setup
- **strapi-cms/COMPONENT_CREATION_GUIDE.md** - Visual component guide
- **strapi-cms/CREATE_TEST_PAGE.md** - Create your first page

### Architecture & Setup

- **dental-frontend/ARCHITECTURE.md** - System architecture overview
- **strapi-cms/STRAPI_SETUP_GUIDE.md** - Complete Strapi reference
- **strapi-cms/SETUP_CHECKLIST.md** - Interactive setup checklist

### Service Documentation

- **dental-frontend/README.md** - Next.js frontend documentation
- **strapi-cms/README.md** - Strapi CMS documentation

### Deployment

- **deploy.sh** - Automated deployment script
- **docker-compose.yml** - Service orchestration

## 🗂️ Project Structure

```
dental-cms/
├── dental-frontend/          # Next.js frontend service
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React components
│   │   ├── lib/              # Strapi integration
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   ├── Dockerfile            # Frontend container
│   └── package.json
│
├── strapi-cms/               # Strapi CMS service
│   ├── config/               # Strapi configuration
│   ├── database/             # Migrations
│   ├── public/               # Uploads
│   ├── types/                # Generated types
│   ├── Dockerfile            # Strapi container
│   └── package.json
│
├── docker-compose.yml        # Service orchestration
├── deploy.sh                 # Deployment automation
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables

Create `.env` in the root directory:

```env
# PostgreSQL
POSTGRES_DB=dental_cms_strapi
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Strapi
STRAPI_PORT=1337
STRAPI_APP_KEYS=generate-secure-keys
STRAPI_API_TOKEN_SALT=generate-secure-salt
STRAPI_ADMIN_JWT_SECRET=generate-secure-secret
STRAPI_TRANSFER_TOKEN_SALT=generate-secure-salt
STRAPI_JWT_SECRET=generate-secure-secret
STRAPI_PUBLIC_URL=https://guild-biblical-expectations-easily.trycloudflare.com
STRAPI_API_TOKEN=generate-after-strapi-setup

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Generate secure keys:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🧪 Testing

### Verify Integration

```bash
# Check Strapi API
curl https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?populate=deep

# Check Frontend
curl http://localhost:3000
```

### Health Checks

```bash
# Strapi health
curl https://guild-biblical-expectations-easily.trycloudflare.com/_health

# Frontend health
curl http://localhost:3000
```

## 🚀 Deployment

### Local Docker

```bash
./deploy.sh build    # Build images
./deploy.sh up       # Start services
./deploy.sh logs     # View logs
./deploy.sh down     # Stop services
```

### Production

1. Update `.env` with production values
2. Generate secure secrets
3. Deploy:

```bash
./deploy.sh rebuild
```

### Available Commands

```bash
./deploy.sh build    # Build Docker images
./deploy.sh up       # Start services
./deploy.sh down     # Stop services
./deploy.sh restart  # Restart services
./deploy.sh logs     # View logs
./deploy.sh clean    # Remove volumes
./deploy.sh rebuild  # Rebuild from scratch
./deploy.sh status   # Show service status
```

## 🔒 Security

- ✅ Separate services with isolated concerns
- ✅ Non-root users in containers
- ✅ Multi-stage Docker builds
- ✅ No secrets in images
- ✅ Internal service networking
- ✅ Health checks
- ✅ CORS configuration
- ✅ Environment-based secrets
- ✅ API token authentication

## 📊 Performance

- **ISR:** 60-second revalidation
- **Image Optimization:** Next.js Image component
- **Caching:** Automatic request caching
- **Loading States:** Skeleton screens
- **Error Boundaries:** Graceful error handling
- **Docker:** Optimized images (~350MB total)
- **Separate Services:** Independent scaling

## 🐛 Troubleshooting

### Services won't start

```bash
docker-compose down -v
docker system prune -a
./deploy.sh rebuild
```

### Strapi connection issues

- Check STRAPI_URL in frontend .env
- Verify Strapi is running: `docker-compose ps`
- Check API token is valid

### Database connection failed

- Check PostgreSQL is running
- Verify database credentials in .env
- Check port 5432 is available

### Frontend can't fetch data

- Verify Strapi API is accessible
- Check API token in frontend .env
- Ensure content is published in Strapi

## 📝 Development Workflow

1. **Start services:** `./deploy.sh up`
2. **Configure Strapi:** Create content types and permissions
3. **Create content:** Add pages in Strapi admin
4. **Develop frontend:** Frontend auto-updates from Strapi API
5. **Test:** Verify integration end-to-end
6. **Deploy:** Use Docker for production

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation:** Check service-specific READMEs
- **Issues:** Open GitHub issue
- **Strapi Docs:** https://docs.strapi.io
- **Next.js Docs:** https://nextjs.org/docs

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced SEO features
- [ ] Analytics integration
- [ ] CDN integration
- [ ] Automated backups
- [ ] CI/CD pipeline
- [ ] Kubernetes deployment
- [ ] Performance monitoring

---

**Built with ❤️ using Next.js and Strapi**
