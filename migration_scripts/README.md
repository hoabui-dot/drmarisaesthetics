# Migration Scripts

## Overview

This directory contains migration and seed scripts for the Strapi CMS.

## Scripts

### `seed-dental-data.js`

Seeds the database with initial data for a dental clinic website.

**What it does:**

- Creates/updates Navigation menu (header)
- Creates/updates Footer content
- Publishes both
- Verifies data

**Usage:**

```bash
# Set API token (get from Strapi admin)
export STRAPI_API_TOKEN=your-token-here

# Run script
node migration_scripts/seed-dental-data.js
```

**Requirements:**

- Strapi must be running
- API token with full access
- Content types must exist (navigation, footer)

**Idempotent:**

- Safe to run multiple times
- Updates existing data instead of creating duplicates

## Setup Instructions

### 1. Start Strapi

```bash
cd strapi-cms
npm run develop
```

### 2. Get API Token

1. Open Strapi admin: `https://guild-biblical-expectations-easily.trycloudflare.com/admin`
2. Go to Settings → API Tokens
3. Create new token:
   - Name: "Migration Script"
   - Token type: Full access
   - Token duration: Unlimited
4. Copy the token

### 3. Set Environment Variable

```bash
# In your terminal
export STRAPI_API_TOKEN=your-token-here

# Or add to .env file
echo "STRAPI_API_TOKEN=your-token-here" >> .env
```

### 4. Run Seed Script

```bash
node migration_scripts/seed-dental-data.js
```

**Expected output:**

```
🚀 Starting data seeding for Dental Clinic...
   Strapi URL: https://guild-biblical-expectations-easily.trycloudflare.com

📋 Seeding Navigation...
   ℹ️  Creating navigation...
   ✅ Navigation created
   ✅ Navigation published

🦶 Seeding Footer...
   ℹ️  Creating footer...
   ✅ Footer created
   ✅ Footer published

🔍 Verifying seeded data...
   ✅ Navigation: 3 menu items
   ✅ Footer: Description present
   ✅ Footer: 4 footer links
   ✅ Footer: 3 social links

✅ Data seeding completed successfully!
```

## Verification

### Check in Strapi Admin

1. **Navigation:**

   ```
   Content Manager → Navigation (Single Type)
   Should see: Trang chủ, Dịch vụ, Liên hệ
   ```

2. **Footer:**
   ```
   Content Manager → Footer (Single Type)
   Should see: Description, Contact Info, Links, Social Links
   ```

### Check via API

```bash
# Get navigation
curl "https://guild-biblical-expectations-easily.trycloudflare.com/api/navigation?populate=*" \
  -H "Authorization: Bearer $STRAPI_API_TOKEN"

# Get footer
curl "https://guild-biblical-expectations-easily.trycloudflare.com/api/footer?populate=*" \
  -H "Authorization: Bearer $STRAPI_API_TOKEN"
```

## Troubleshooting

### Error: STRAPI_API_TOKEN is required

**Solution:**

```bash
export STRAPI_API_TOKEN=your-token-here
```

### Error: API Error: 401

**Cause:** Invalid or expired token

**Solution:**

1. Generate new token in Strapi admin
2. Update environment variable
3. Run script again

### Error: API Error: 404

**Cause:** Content type doesn't exist

**Solution:**

1. Restart Strapi to load new content types
2. Check that schema files exist in `strapi-cms/src/api/`
3. Run script again

### Error: Connection refused

**Cause:** Strapi is not running

**Solution:**

```bash
cd strapi-cms
npm run develop
```

## Production Deployment

### 1. Prepare Production Environment

```bash
# Set production API token
export STRAPI_API_TOKEN=production-token-here
export STRAPI_URL=https://cms.your-domain.com
```

### 2. Run Migration

```bash
node migration_scripts/seed-dental-data.js
```

### 3. Verify

```bash
# Check navigation
curl "https://cms.your-domain.com/api/navigation?populate=*" \
  -H "Authorization: Bearer $STRAPI_API_TOKEN"

# Check footer
curl "https://cms.your-domain.com/api/footer?populate=*" \
  -H "Authorization: Bearer $STRAPI_API_TOKEN"
```

## Best Practices

1. **Always backup database before running migrations**
2. **Test in development first**
3. **Use version control for migration scripts**
4. **Document any manual steps required**
5. **Keep scripts idempotent (safe to run multiple times)**

## Adding New Migrations

When creating new migration scripts:

1. **Name clearly:** `seed-{feature}-data.js`
2. **Make idempotent:** Check if data exists before creating
3. **Add error handling:** Try-catch blocks
4. **Log progress:** Console output for debugging
5. **Verify data:** Check that data was created correctly
6. **Document:** Add to this README

## Example: Custom Migration

```javascript
// migration_scripts/seed-custom-data.js
const { apiRequest } = require("./seed-dental-data");

async function seedCustomData() {
  console.log("Seeding custom data...");

  const data = {
    data: {
      // Your data here
    },
  };

  try {
    await apiRequest("/api/your-endpoint", "POST", data);
    console.log("✅ Custom data seeded");
  } catch (error) {
    console.error("❌ Failed:", error.message);
    throw error;
  }
}

seedCustomData();
```

---

## Migration 003: Animated Hero 3D Section

### File: `003-add-animated-hero-3d.js`

Adds a premium 3D animated hero section with Spline integration.

**What it does:**

- Creates new Animated Hero 3D component
- Inserts section as FIRST block in homepage
- Preserves existing Hero section (pushes it down)
- Uses Spline for 3D animation

**Features:**

- Title: "Công nghệ nha khoa chuẩn quốc tế"
- Spline 3D scene with floating tooth
- Gradient background (Sky Blue)
- CTA button to booking page

**Usage:**

```bash
# Set API token
export STRAPI_API_TOKEN=your-token-here

# Run migration
node migration_scripts/003-add-animated-hero-3d.js
```

**Post-Migration Steps:**

1. **Restart Strapi** (required to load new component):

   ```bash
   cd strapi-cms
   npm run develop
   ```

2. **Publish in Admin:**
   - Go to: https://guild-biblical-expectations-easily.trycloudflare.com/admin
   - Navigate to: Content Manager → Homepage
   - Verify Animated Hero 3D is first block
   - Click "Publish"

3. **Verify Order:**
   - Block 1: Animated Hero 3D (NEW)
   - Block 2: Hero (existing, pushed down)
   - Block 3+: Other sections

**Idempotent:** Safe to run multiple times. Skips if section already exists.

**Expected Output:**

```
🚀 Adding Animated Hero 3D Section to Homepage...
📥 Fetching current homepage...
✓ Homepage found (ID: 2)
✓ Current layout blocks: 10
📝 Animated Hero 3D section not found. Adding it...
📊 New layout structure:
   Total blocks: 11
   Block order:
     1. homepage.animated-hero-3d
     2. homepage.hero
     3. homepage.trust
     ...
💾 Updating homepage...
✓ Homepage updated successfully!
🔍 Verifying update...
✓ Animated Hero 3D section verified in database
✅ MIGRATION COMPLETED SUCCESSFULLY
```

## Migration Order

Run migrations in this order:

1. `seed-dental-data.js` - Initial navigation and footer
2. `002-enhance-homepage-2026.js` - Enhanced homepage sections
3. `003-add-animated-hero-3d.js` - 3D animated hero section
