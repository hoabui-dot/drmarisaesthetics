# Create Test Page in Strapi

Quick guide to create your first test page.

---

## 📝 Create Home Page

### Step 1: Go to Content Manager

- Click **"Content Manager"** in left sidebar
- Click **"Page"** under "COLLECTION TYPES"
- Click **"Create new entry"** button

### Step 2: Fill Basic Info

**Title:**

```
Home
```

**Slug:** (auto-generated)

```
home
```

**Meta Title:**

```
Welcome to Our Dental Clinic
```

**Meta Description:**

```
Professional dental care services for the whole family. Expert dentists, modern technology, and compassionate care.
```

---

### Step 3: Add Layout Blocks

#### Block 1: Hero

Click **"Add a component to layout"** → Select **"Hero"**

**Heading:**

```
Welcome to Our Dental Clinic
```

**Subheading:**

```
Professional care for your smile with state-of-the-art technology and experienced dentists
```

**Image:** (optional - upload or skip for now)

---

#### Block 2: Services

Click **"Add a component to layout"** → Select **"Services"**

**Heading:**

```
Our Services
```

**Items:** Click **"Add an entry to items"** (repeat 3 times)

**Item 1:**

- Title: `Dental Implants`
- Description: `Permanent solution for missing teeth with natural-looking results that last a lifetime`
- Image: (optional)

**Item 2:**

- Title: `Teeth Whitening`
- Description: `Brighten your smile safely with professional whitening treatments in just one visit`
- Image: (optional)

**Item 3:**

- Title: `Orthodontics`
- Description: `Straighten teeth with modern braces and clear aligners for a perfect smile`
- Image: (optional)

---

#### Block 3: CTA

Click **"Add a component to layout"** → Select **"CTA"**

**Text:**

```
Ready to Transform Your Smile?
```

**Button Label:**

```
Book Appointment
```

**Link:**

```
/contact
```

---

### Step 4: Save & Publish

1. Click **"Save"** button (top right)
2. Click **"Publish"** button (top right)
3. ✅ Page created and published!

---

## 🧪 Test the API

### Test in Browser

Open: https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?populate=deep

You should see your page data in JSON format.

### Test Specific Page

Open: https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?filters[slug][$eq]=home&populate=deep

You should see only the home page.

---

## 📝 Create More Pages (Optional)

### About Page

- Title: `About`
- Slug: `about`
- Meta Title: `About Our Dental Practice`
- Layout: Hero + CTA

### Services Page

- Title: `Services`
- Slug: `services`
- Meta Title: `Our Dental Services`
- Layout: Hero + Services + CTA

### Contact Page

- Title: `Contact`
- Slug: `contact`
- Meta Title: `Contact Us`
- Layout: Hero + CTA

---

## ✅ Verification

After creating pages:

1. **Check Content Manager:**

   - Go to Content Manager → Page
   - You should see your pages listed
   - Status should be "Published"

2. **Check API:**

   ```
   https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?populate=deep
   ```

   Should return all pages with full data

3. **Check Specific Page:**
   ```
   https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?filters[slug][$eq]=home&populate=deep
   ```
   Should return home page data

---

## 🎉 Ready for Next.js!

Once you have at least one published page, you're ready to:

1. Implement query functions in Next.js
2. Test the frontend
3. See your pages render!

See `STEP_3_IMPLEMENTATION.md` for next steps.
