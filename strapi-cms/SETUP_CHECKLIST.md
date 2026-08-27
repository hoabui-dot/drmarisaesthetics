# Strapi Setup Checklist

Use this checklist while setting up Strapi content types.

---

## 🚀 Initial Setup

- [ ] Navigate to strapi-cms directory: `cd strapi-cms`
- [ ] Install dependencies: `npm install`
- [ ] Start Strapi: `npm run develop`
- [ ] Browser opens to https://guild-biblical-expectations-easily.trycloudflare.com/admin
- [ ] Create admin user:
  - [ ] Email: ******\_\_\_******
  - [ ] Password: ******\_\_\_******
  - [ ] Confirm password
- [ ] Successfully logged into admin panel

---

## 📦 Component Creation

### 1. Service Item Component

- [ ] Go to Content-Type Builder
- [ ] Click "Create new component"
- [ ] Category: `blocks`
- [ ] Name: `service-item`
- [ ] Icon: (choose any)
- [ ] Add field: `title`
  - [ ] Type: Text
  - [ ] Required: Yes
- [ ] Add field: `description`
  - [ ] Type: Text
  - [ ] Long text: Yes
  - [ ] Required: Yes
- [ ] Add field: `image`
  - [ ] Type: Media
  - [ ] Single: Yes
  - [ ] Allowed types: Images only
- [ ] Click "Finish"
- [ ] Click "Save"
- [ ] Wait for server restart
- [ ] ✅ Component created successfully

### 2. Hero Component

- [ ] Click "Create new component"
- [ ] Category: `blocks`
- [ ] Name: `hero`
- [ ] Icon: (choose any)
- [ ] Add field: `heading`
  - [ ] Type: Text
  - [ ] Required: Yes
- [ ] Add field: `subheading`
  - [ ] Type: Text
  - [ ] Long text: Yes
  - [ ] Required: No
- [ ] Add field: `image`
  - [ ] Type: Media
  - [ ] Single: Yes
  - [ ] Allowed types: Images only
  - [ ] Required: No
- [ ] Click "Finish"
- [ ] Click "Save"
- [ ] Wait for server restart
- [ ] ✅ Component created successfully

### 3. Services Component

- [ ] Click "Create new component"
- [ ] Category: `blocks`
- [ ] Name: `services`
- [ ] Icon: (choose any)
- [ ] Add field: `heading`
  - [ ] Type: Text
  - [ ] Required: Yes
- [ ] Add field: `items`
  - [ ] Type: Component
  - [ ] Repeatable: Yes
  - [ ] Select component: `blocks.service-item`
- [ ] Click "Finish"
- [ ] Click "Save"
- [ ] Wait for server restart
- [ ] ✅ Component created successfully

### 4. CTA Component

- [ ] Click "Create new component"
- [ ] Category: `blocks`
- [ ] Name: `cta`
- [ ] Icon: (choose any)
- [ ] Add field: `text`
  - [ ] Type: Text
  - [ ] Required: Yes
- [ ] Add field: `buttonLabel`
  - [ ] Type: Text
  - [ ] Required: Yes
- [ ] Add field: `link`
  - [ ] Type: Text
  - [ ] Required: Yes
- [ ] Click "Finish"
- [ ] Click "Save"
- [ ] Wait for server restart
- [ ] ✅ Component created successfully

---

## 📄 Page Collection Type

- [ ] Click "Create new collection type"
- [ ] Display name: `Page`
- [ ] API ID (singular): `page` (auto-generated)
- [ ] API ID (plural): `pages` (auto-generated)
- [ ] Add field: `title`
  - [ ] Type: Text
  - [ ] Required: Yes
- [ ] Add field: `slug`
  - [ ] Type: UID
  - [ ] Attached field: `title`
  - [ ] Required: Yes
- [ ] Add field: `metaTitle`
  - [ ] Type: Text
  - [ ] Required: No
- [ ] Add field: `metaDescription`
  - [ ] Type: Text
  - [ ] Long text: Yes
  - [ ] Required: No
- [ ] Add field: `layout`
  - [ ] Type: Dynamic Zone
  - [ ] Required: Yes
  - [ ] Add component: `blocks.hero`
  - [ ] Add component: `blocks.services`
  - [ ] Add component: `blocks.cta`
- [ ] Click "Finish"
- [ ] Click "Save"
- [ ] Wait for server restart
- [ ] ✅ Collection type created successfully

---

## 🔐 Permissions Configuration

### Public Role

- [ ] Go to Settings → Roles → Public
- [ ] Scroll to "Page" section
- [ ] Enable permissions:
  - [ ] `find`
  - [ ] `findOne`
- [ ] Click "Save"
- [ ] ✅ Public permissions configured

### Authenticated Role (Optional)

- [ ] Go to Settings → Roles → Authenticated
- [ ] Scroll to "Page" section
- [ ] Enable permissions:
  - [ ] `find`
  - [ ] `findOne`
  - [ ] `create`
  - [ ] `update`
  - [ ] `delete`
- [ ] Click "Save"
- [ ] ✅ Authenticated permissions configured

---

## 🔑 API Token Generation

- [ ] Go to Settings → API Tokens
- [ ] Click "Create new API Token"
- [ ] Name: `Next.js Frontend`
- [ ] Token type: `Full access`
- [ ] Token duration: `Unlimited`
- [ ] Click "Save"
- [ ] **COPY TOKEN IMMEDIATELY** (shown only once)
- [ ] Token copied: **********************\_\_\_**********************
- [ ] Add to `.env.local` in Next.js root:
  ```env
  STRAPI_URL=https://guild-biblical-expectations-easily.trycloudflare.com
  STRAPI_API_TOKEN=paste-token-here
  ```
- [ ] ✅ API token configured

---

## 📝 Create Test Page

- [ ] Go to Content Manager → Page
- [ ] Click "Create new entry"

### Basic Info

- [ ] Title: `Home`
- [ ] Slug: `home` (auto-generated)
- [ ] Meta Title: `Welcome to Our Dental Clinic`
- [ ] Meta Description: `Professional dental care services for the whole family`

### Layout - Block 1: Hero

- [ ] Click "Add component to layout"
- [ ] Select "Hero"
- [ ] Heading: `Welcome to Our Dental Clinic`
- [ ] Subheading: `Professional care for your smile with state-of-the-art technology`
- [ ] Image: (upload or skip for now)

### Layout - Block 2: Services

- [ ] Click "Add component to layout"
- [ ] Select "Services"
- [ ] Heading: `Our Services`
- [ ] Click "Add an entry to items"
  - [ ] Title: `Dental Implants`
  - [ ] Description: `Permanent solution for missing teeth with natural-looking results`
  - [ ] Image: (upload or skip)
- [ ] Click "Add an entry to items"
  - [ ] Title: `Teeth Whitening`
  - [ ] Description: `Brighten your smile safely with professional whitening treatments`
  - [ ] Image: (upload or skip)
- [ ] Click "Add an entry to items"
  - [ ] Title: `Orthodontics`
  - [ ] Description: `Straighten teeth with modern braces and clear aligners`
  - [ ] Image: (upload or skip)

### Layout - Block 3: CTA

- [ ] Click "Add component to layout"
- [ ] Select "CTA"
- [ ] Text: `Ready to Transform Your Smile?`
- [ ] Button Label: `Book Appointment`
- [ ] Link: `/contact`

### Publish

- [ ] Click "Save"
- [ ] Click "Publish"
- [ ] ✅ Test page created and published

---

## 🧪 API Testing

### Test in Browser

- [ ] Open: https://guild-biblical-expectations-easily.trycloudflare.com/api/pages
- [ ] Should see JSON response with pages array
- [ ] ✅ API accessible

### Test with Populate

- [ ] Open: https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?populate=deep
- [ ] Should see full page data with layout blocks
- [ ] ✅ Populate working

### Test Specific Page

- [ ] Open: https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?filters[slug][$eq]=home&populate=deep
- [ ] Should see home page data
- [ ] ✅ Filtering working

### Test with cURL (Optional)

```bash
curl https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?populate=deep
```

- [ ] Command executed successfully
- [ ] JSON response received
- [ ] ✅ API working via command line

---

## ✅ Final Verification

- [ ] All 4 components created (hero, services, service-item, cta)
- [ ] Page collection type created
- [ ] Public permissions enabled
- [ ] API token generated and added to `.env.local`
- [ ] Test page created and published
- [ ] API returns data successfully
- [ ] No errors in Strapi console
- [ ] Strapi admin panel accessible

---

## 🎉 Setup Complete!

If all items are checked, you're ready to proceed to Step 3:

### Next Steps

1. Update `src/lib/strapi/queries.ts` with real implementations
2. Test Next.js frontend: `npm run dev`
3. Visit http://localhost:3000
4. Verify pages load from Strapi

See `STEP_2_COMPLETE.md` for detailed next steps.

---

## 🐛 Troubleshooting

### Component not showing in Dynamic Zone

- [ ] Refresh browser
- [ ] Clear cache: `npm run strapi build --clean`
- [ ] Restart Strapi: `npm run develop`

### API returns empty data

- [ ] Check page is published (not draft)
- [ ] Check public permissions enabled
- [ ] Use `populate=deep` in query

### Server won't restart

- [ ] Stop Strapi (Ctrl+C)
- [ ] Delete `.cache` folder
- [ ] Run `npm run develop` again

### Database connection error

- [ ] Check PostgreSQL is running
- [ ] Verify `.env` database credentials
- [ ] Check database `dental_cms_strapi` exists

---

**Date Completed:** ******\_\_\_******  
**Completed By:** ******\_\_\_******  
**Notes:** **********************\_\_\_**********************
