# Strapi CMS - Headless CMS Backend

Strapi 5 headless CMS backend for the dental landing pages application.

## 🚀 Tech Stack

- **CMS:** Strapi 5.40.0
- **Database:** PostgreSQL 16
- **Runtime:** Node.js 22.x
- **Deployment:** Docker

## 📋 Features

- ✅ **Block-Based Content** - Hero, Services, CTA blocks
- ✅ **REST API** - Auto-generated endpoints
- ✅ **Media Library** - Image upload and management
- ✅ **Role-Based Access** - Public and authenticated permissions
- ✅ **API Tokens** - Secure frontend integration
- ✅ **Docker Ready** - Production-optimized container

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x
- PostgreSQL 16 (or use Docker from root)

### Development Setup

1. **Install dependencies:**

```bash
cd strapi-cms
npm install
```

2. **Configure environment:**

```bash
cp .env.example .env
```

Edit `.env` and update database credentials and generate secure keys.

3. **Start Strapi:**

```bash
# Development mode with auto-reload
npm run develop

# Production mode
npm run build
npm run start
```

4. **Access admin panel:**

- Open https://guild-biblical-expectations-easily.trycloudflare.com/admin
- Create your first admin user

### Docker Setup

From the root directory:

```bash
# Start all services (PostgreSQL + Strapi + Frontend)
docker-compose up -d

# View Strapi logs
docker-compose logs -f strapi

# Access admin panel
# https://guild-biblical-expectations-easily.trycloudflare.com/admin
```

## 📚 Content Types Setup

See the documentation files for detailed setup guides:

- **QUICKSTART_STRAPI.md** - 15-minute quick setup
- **STRAPI_SETUP_GUIDE.md** - Complete reference guide
- **COMPONENT_CREATION_GUIDE.md** - Visual component guide
- **SETUP_CHECKLIST.md** - Interactive checklist

### Content Structure

**Page Collection:**

- title (text)
- slug (UID)
- metaTitle (text)
- metaDescription (text)
- layout (Dynamic Zone)

**Components:**

- blocks.hero - Hero section with heading, subheading, image
- blocks.services - Services list with repeatable items
- blocks.service-item - Individual service (title, description, image)
- blocks.cta - Call-to-action with text, button, link

## 🔌 API Endpoints

Once content types are created:

**Get all pages:**

```
GET /api/pages?populate=deep
```

**Get page by slug:**

```
GET /api/pages?filters[slug][$eq]=home&populate=deep
```

**Media files:**

```
GET /api/upload/files
```

### Example Response

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Home",
      "slug": "home",
      "layout": [
        {
          "__component": "blocks.hero",
          "heading": "Welcome",
          "subheading": "Professional care"
        }
      ]
    }
  }
}
```

## 🔐 Permissions & API Tokens

### Configure Public Permissions

1. Go to Settings → Roles → Public
2. Enable Page permissions: `find`, `findOne`
3. Save

### Generate API Token

1. Go to Settings → API Tokens
2. Create new token:
   - Name: `Next.js Frontend`
   - Type: `Full access`
   - Duration: `Unlimited`
3. Copy token immediately (shown only once)
4. Add to frontend `.env.local`:
   ```env
   STRAPI_API_TOKEN=your-token-here
   ```

## 🔧 Environment Variables

Required variables in `.env`:

```env
# Server
HOST=0.0.0.0
PORT=1337

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=dental_cms_strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false

# Secrets (generate secure values)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-salt
ADMIN_JWT_SECRET=your-secret
TRANSFER_TOKEN_SALT=your-salt
JWT_SECRET=your-secret

# URLs
PUBLIC_URL=https://guild-biblical-expectations-easily.trycloudflare.com
```

### Generate Secure Keys

```bash
# Generate random keys
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🐛 Troubleshooting

### Strapi won't start

```bash
cd strapi-cms
rm -rf node_modules .cache
npm install
npm run develop
```

### Database connection error

- Check PostgreSQL is running
- Verify `.env` database credentials
- Ensure database `dental_cms_strapi` exists

### Components not showing

```bash
npm run strapi build --clean
npm run develop
```

## 📦 Scripts

```bash
npm run develop    # Start dev server with auto-reload
npm run build      # Build admin panel
npm run start      # Start production server
npm run strapi     # Strapi CLI commands
```

## 🚀 Deployment

### Docker Production

From root directory:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f strapi
```

### Standalone Deployment

```bash
cd strapi-cms
npm run build
NODE_ENV=production npm start
```

## 📁 Project Structure

```
strapi-cms/
├── config/              # Configuration files
│   ├── admin.ts         # Admin panel config
│   ├── api.ts           # API config
│   ├── database.ts      # Database config
│   ├── middlewares.ts   # CORS, etc.
│   └── server.ts        # Server config
├── database/
│   └── migrations/      # Database migrations
├── public/
│   └── uploads/         # Uploaded media files
├── types/
│   └── generated/       # Auto-generated types
├── .env                 # Environment variables
├── Dockerfile           # Production container
└── package.json         # Dependencies
```

## 🔒 Security

- ✅ Non-root user in Docker container
- ✅ Multi-stage Docker build
- ✅ Environment-based secrets
- ✅ CORS configuration
- ✅ Role-based access control
- ✅ API token authentication

## 📝 Next Steps

After Strapi is running:

1. Create content types (see QUICKSTART_STRAPI.md)
2. Configure permissions
3. Generate API token
4. Create test content
5. Integrate with Next.js frontend

## 📚 Documentation

- **QUICKSTART_STRAPI.md** - Fast 15-minute setup
- **STRAPI_SETUP_GUIDE.md** - Complete reference
- **COMPONENT_CREATION_GUIDE.md** - Visual guide
- **SETUP_CHECKLIST.md** - Step-by-step checklist
- **CREATE_TEST_PAGE.md** - Create first page

## 🆘 Support

- **Strapi Documentation:** https://docs.strapi.io
- **API Reference:** https://guild-biblical-expectations-easily.trycloudflare.com/admin/settings/api-tokens
- **Health Check:** https://guild-biblical-expectations-easily.trycloudflare.com/_health

---

**Built with Strapi 5** 🚀
