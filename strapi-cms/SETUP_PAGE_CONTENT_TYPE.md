# Setup Page Content Type - Step by Step

## What I Did

I created a new "Page" content type in Strapi with the following files:

- `src/api/page/content-types/page/schema.json` - Content type schema
- `src/api/page/controllers/page.ts` - Controller
- `src/api/page/services/page.ts` - Service
- `src/api/page/routes/page.ts` - Routes

## What You Need to Do

### Step 1: Restart Strapi

```bash
# Stop Strapi if running (Ctrl+C)
cd strapi-cms
npm run develop
```

Strapi will detect the new content type and register it automatically.

### Step 2: Set Permissions for Page API

1. Open Strapi admin: https://guild-biblical-expectations-easily.trycloudflare.com/admin
2. Go to **Settings** (left sidebar, gear icon)
3. Click **Users & Permissions Plugin** → **Roles**
4. Click **Public** role
5. Scroll down to **Page** section
6. Check these permissions:
   - ✅ `find` (get all pages)
   - ✅ `findOne` (get single page)
7. Click **Save**

### Step 3: Create a Test Page

1. Go to **Content Manager** (left sidebar)
2. You should see **Page** in the collection types
3. Click **Page** → **Create new entry**
4. Fill in:
   - **Title:** Test Page
   - **Slug:** test-page (will auto-generate from title)
   - **Content:** Add some test content
5. **Save as draft** (don't publish yet)

### Step 4: Test Preview

Open this URL in your browser:

```
http://localhost:3000/api/preview?slug=test-page&secret=your-secure-preview-secret-change-in-production
```

You should see:

- ✅ Yellow banner: "Preview Mode Enabled"
- ✅ Your draft content
- ✅ "Exit Preview" button

### Step 5: Verify API Endpoint

Test the Strapi API directly:

```bash
# Get all pages (should work after setting permissions)
curl https://guild-biblical-expectations-easily.trycloudflare.com/api/pages

# Get specific page with draft content
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?filters[slug][\$eq]=test-page&publicationState=preview&populate=deep"
```

Replace `YOUR_TOKEN` with your `STRAPI_API_TOKEN` from `.env`.

## Troubleshooting

### Error: "Page content type not found"

**Solution:** Restart Strapi to register the new content type.

### Error: "403 Forbidden"

**Solution:** Set permissions for Public role (Step 2 above).

### Error: "404 Not Found"

**Possible causes:**

1. No pages created yet → Create a test page
2. Slug doesn't match → Check the slug value in your page entry
3. API permissions not set → Check Step 2

### Preview Button Still Not Showing

The preview button configuration in `admin.ts` may not work in Strapi v5. Use manual preview URLs:

**Manual Preview URL:**

```
http://localhost:3000/api/preview?slug=YOUR-SLUG&secret=your-secure-preview-secret-change-in-production
```

**Create a bookmark for easy access:**

1. Create new bookmark
2. Name: "Preview Strapi Page"
3. URL:

```javascript
javascript: (function () {
  const slug = prompt("Enter page slug:");
  if (slug) {
    window.open(
      `http://localhost:3000/api/preview?slug=${slug}&secret=your-secure-preview-secret-change-in-production`,
      "_blank",
    );
  }
})();
```

## Next Steps

Once preview is working with the simple Page content type:

1. **Add more fields** to Page content type:

   - SEO component (metaTitle, metaDescription)
   - Featured image
   - Excerpt

2. **Add dynamic zones** for blocks:

   - Hero block
   - Services block
   - CTA block

3. **Update frontend** to render the blocks properly

## Summary

- ✅ Page content type created
- ✅ Schema, controller, service, routes configured
- ⏳ Need to restart Strapi
- ⏳ Need to set API permissions
- ⏳ Need to create test page
- ⏳ Need to test preview

After completing these steps, the preview system will be fully functional!
