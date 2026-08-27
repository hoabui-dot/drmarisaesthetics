# Workflow: Deployment and CI/CD

## Overview
Step-by-step guide for deploying the dental clinic application.

---

## Step 1: Pre-Deployment Checklist

### 1.1 Code Quality
```
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] No console.log statements (except intentional)
- [ ] No commented-out code
- [ ] All imports used
```

### 1.2 Environment Variables
```
Verify all required env vars are set in production:

Required:
- [ ] STRAPI_URL
- [ ] STRAPI_API_TOKEN
- [ ] NEXT_PUBLIC_STRAPI_URL
- [ ] NEXT_PUBLIC_SERVER_URL

Optional:
- [ ] REVALIDATION_SECRET (for webhooks)
```

### 1.3 Build Test
```bash
cd dental-frontend
npm run build

# Verify:
- [ ] Build completes without errors
- [ ] No type errors
- [ ] No missing dependencies
```

---

## Step 2: Local Production Test

### 2.1 Run Production Build Locally
```bash
npm run build
npm start
```

### 2.2 Verify Production Behavior
```
Test locally at http://localhost:3000:
- [ ] All pages load
- [ ] Images display
- [ ] API calls succeed
- [ ] No 500 errors
- [ ] Performance acceptable
```

---

## Step 3: Deploy to Vercel

### 3.1 Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 3.2 Using Git Integration
```bash
# Push to main branch
git add .
git commit -m "feat: add customer page"
git push origin main

# Vercel auto-deploys from main branch
```

### 3.3 Environment Variables in Vercel
```
In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add all required variables
4. Ensure variables are set for Production environment
```

---

## Step 4: Strapi CMS Deployment

### 4.1 Using Docker
```bash
# Build and start containers
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose logs -f strapi-cms
```

### 4.2 Environment Configuration
```env
# Production Strapi .env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_HOST=your-production-db-host
DATABASE_PORT=5432
DATABASE_NAME=dental_cms_strapi
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-secure-password
DATABASE_SSL=true
```

### 4.3 Run Migrations in Production
```bash
# Connect to production server
ssh user@production-server

# Run migration scripts
node migration_scripts/024-create-customer-page.js
```

---

## Step 5: Post-Deployment Verification

### 5.1 Smoke Testing
```
Test critical paths:
- [ ] Homepage loads
- [ ] Navigation works
- [ ] All pages accessible
- [ ] Contact form submits
- [ ] Images load from Strapi
```

### 5.2 API Verification
```bash
# Test production API
curl "https://your-strapi-url/api/pages?filters[slug][$eq]=customers" \
  -H "Authorization: Bearer PROD_TOKEN"
```

### 5.3 Performance Check
```
Run Lighthouse on production:
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90
```

---

## Step 6: Configure Webhooks (Optional)

### 6.1 Strapi Webhook Setup
In Strapi Admin:
1. Settings > Webhooks
2. Add new webhook
3. URL: `https://your-frontend.vercel.app/api/revalidate`
4. Events: entry.create, entry.update, entry.delete

### 6.2 Revalidation Endpoint
```tsx
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const secret = request.headers.get('x-webhook-secret')
    
    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }
    
    const body = await request.json()
    const model = body.model
    
    // Revalidate based on model
    if (model === 'page') {
        revalidateTag('pages')
    } else if (model === 'homepage') {
        revalidateTag('homepage')
    }
    
    return NextResponse.json({ revalidated: true })
}
```

---

## Step 7: Monitoring and Rollback

### 7.1 Monitor Deployment
```
Check Vercel Dashboard:
- [ ] Deployment successful
- [ ] No build errors
- [ ] No runtime errors in logs
```

### 7.2 Rollback if Needed
```bash
# Via Vercel CLI
vercel rollback

# Or in Vercel Dashboard:
# Deployments > Find previous deployment > Promote to Production
```

### 7.3 Error Monitoring
```
Set up error tracking:
- Vercel Analytics (built-in)
- Sentry (optional)
- LogRocket (optional)
```

---

## Deployment Checklist

```markdown
## Deployment: [DATE]

### Pre-Deployment
- [ ] Code review completed
- [ ] All tests passing
- [ ] Build successful locally
- [ ] Environment variables verified

### Deployment
- [ ] Deployed to preview environment
- [ ] Smoke tests passed on preview
- [ ] Deployed to production
- [ ] DNS/domain verified

### Post-Deployment
- [ ] All pages load correctly
- [ ] API integration working
- [ ] Images loading from CMS
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Analytics tracking

### Documentation
- [ ] CHANGELOG updated
- [ ] Team notified
- [ ] Rollback plan ready

### Sign-off
Deployed by: [NAME]
Verified by: [NAME]
```

---

## Common Deployment Issues

### Build Fails
```
Check:
1. All dependencies installed (npm ci)
2. TypeScript errors resolved
3. Environment variables set
4. No missing imports
```

### Images Not Loading
```
Check:
1. NEXT_PUBLIC_STRAPI_URL correct for production
2. Strapi server accessible
3. next.config.ts domains configured
4. CORS settings on Strapi
```

### API Connection Failed
```
Check:
1. STRAPI_URL points to production server
2. API token valid for production
3. Strapi server running
4. Firewall allows connection
```

### Slow Performance
```
Check:
1. Images optimized
2. Proper caching headers
3. CDN configured
4. Database query performance
```
