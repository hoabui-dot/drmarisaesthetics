# Changelog

## [1.1.0] - 2026-03-19

### Refactored: Separated Services Architecture

#### Changed
- **Separated strapi-cms into independent service** - Moved from dental-frontend/strapi-cms to root-level strapi-cms/
- **Reorganized documentation** - Moved Strapi-specific docs to strapi-cms directory
- **Updated docker-compose.yml** - Already at root level, updated build contexts
- **Moved deployment scripts** - deploy.sh moved to root directory
- **Created service-specific READMEs** - Separate documentation for frontend and CMS
- **Updated all documentation references** - Fixed paths to reflect new structure

#### Added
- Root-level README.md - Main project documentation
- dental-frontend/README.md - Frontend-specific documentation
- strapi-cms/README.md - Enhanced CMS documentation
- .env.example at root - Centralized environment configuration
- docker-compose.prod.yml at root - Production overrides

#### Moved Files
- strapi-cms/ → Root level (from dental-frontend/)
- deploy.sh → Root level (from dental-frontend/)
- QUICKSTART_STRAPI.md → strapi-cms/ (from dental-frontend/)
- STRAPI_SETUP_GUIDE.md → strapi-cms/ (from dental-frontend/)
- COMPONENT_CREATION_GUIDE.md → strapi-cms/ (from dental-frontend/)
- CREATE_TEST_PAGE.md → strapi-cms/ (from dental-frontend/)
- SETUP_CHECKLIST.md → strapi-cms/ (from dental-frontend/)
- docker-compose.prod.yml → Root level (from dental-frontend/)
- docker-compose.dozzle.yml → Root level (from dental-frontend/)

#### Project Structure
```
dental-cms/                    # Root directory
├── README.md                  # Main documentation
├── deploy.sh                  # Deployment automation
├── docker-compose.yml         # Service orchestration
├── docker-compose.prod.yml    # Production overrides
├── .env.example               # Environment template
│
├── dental-frontend/           # Frontend service
│   ├── README.md              # Frontend docs
│   ├── src/                   # Source code
│   └── Dockerfile             # Frontend container
│
└── strapi-cms/                # CMS service
    ├── README.md              # CMS docs
    ├── config/                # Configuration
    ├── QUICKSTART_STRAPI.md   # Setup guides
    └── Dockerfile             # CMS container
```

#### Benefits
- **Clear separation of concerns** - Each service is independent
- **Easier deployment** - Services can be deployed separately
- **Better documentation** - Service-specific docs in their directories
- **Improved maintainability** - Clearer project structure
- **Independent scaling** - Services can scale independently

---

## [1.0.0] - 2026-03-19

### Migration Complete: Payload CMS → Strapi 5.40.0

#### Added
- Complete Strapi 5.40.0 integration
- Block-based content management system
- Docker production deployment setup
- Comprehensive documentation suite
- Automated verification scripts
- ISR (Incremental Static Regeneration)
- SEO optimization with metadata
- Image optimization with Next.js Image
- Error handling and loading states
- Health checks for all services

#### Changed
- Migrated from Payload CMS to Strapi headless CMS
- Updated all frontend components to use Strapi API
- Restructured data layer with transformers
- Improved architecture with service separation
- Enhanced documentation structure

#### Removed
- All Payload CMS dependencies and code
- Obsolete migration documentation files:
  - MIGRATION_PLAN.md
  - START_HERE.md
  - STEP_1_COMPLETE.md
  - STEP_2_COMPLETE.md
  - STEP_2_PART_2_IMPLEMENTATION.md
  - STEP_2_SUMMARY.md
  - STEP_3_COMPLETE.md
  - STEP_4_COMPLETE.md
  - STEP_5_COMPLETE.md

#### Technical Stack
- **Frontend:** Next.js 15.4.11 (App Router)
- **Backend:** Strapi 5.40.0 (Headless CMS)
- **Database:** PostgreSQL 16
- **Styling:** Tailwind CSS 4
- **Deployment:** Docker + Docker Compose
- **Language:** TypeScript

#### Architecture
```
Next.js Frontend (Port 3000)
    ↓
Strapi CMS API (Port 1337)
    ↓
PostgreSQL Database (Port 5432)
```

#### Content Types
- **Page Collection** - Dynamic pages with SEO
- **Hero Block** - Large heading with image
- **Services Block** - Grid of service cards
- **CTA Block** - Call-to-action with button

#### Performance
- ISR with 60-second revalidation
- Optimized Docker images (~350MB total)
- Automatic request caching
- Image optimization and lazy loading
- Health checks and auto-restart

#### Security
- Non-root users in containers
- Multi-stage Docker builds
- Environment-based secrets
- CORS configuration
- API token authentication

#### Documentation
- README.md - Complete project guide
- DOCUMENTATION.md - Documentation index
- QUICKSTART_STRAPI.md - 15-minute setup
- COMPONENT_CREATION_GUIDE.md - Visual guide
- ARCHITECTURE.md - System design
- STRAPI_SETUP_GUIDE.md - Complete reference

#### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run docker:build` - Build Docker images
- `npm run docker:up` - Start services
- `./verify-integration.sh` - Full verification
- `./check-strapi-ready.sh` - Strapi status

---

## Migration Summary

### What Was Accomplished
1. ✅ Complete removal of Payload CMS
2. ✅ Full Strapi 5.40.0 integration
3. ✅ Block-based rendering system
4. ✅ Docker production setup
5. ✅ Comprehensive documentation
6. ✅ Automated verification tools
7. ✅ SEO and performance optimization
8. ✅ Type-safe implementation

### Files Created
- 15+ new implementation files
- 10+ documentation files
- 2 verification scripts
- 3 Docker configurations

### Files Removed
- All Payload-related code
- 9 obsolete documentation files
- Migration tracking documents

### Status
**Production Ready** ✅

The system is fully functional and ready for:
- Content creation in Strapi
- Production deployment
- Scaling and optimization
- Feature additions

---

**For detailed information, see README.md**
