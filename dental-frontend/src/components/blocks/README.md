# Block Components

## Overview

This directory contains reusable block components for the dental landing page system. Each block represents a section of content that can be added to pages through the Payload CMS admin panel.

## Architecture

### Block-Based System

```
CMS (Payload Admin)
    ↓
Page with Layout Array
    ↓
[slug]/page.tsx fetches data
    ↓
BlockRenderer receives layout
    ↓
Switch on blockType
    ↓
Render appropriate component
```

### Data Flow

```
1. Admin creates page in CMS
   └─> Adds blocks: [Hero, Services, CTA]

2. User visits: /dental-implants
   └─> Next.js routes to [slug]/page.tsx

3. Page fetches data
   └─> getPageBySlug('dental-implants')

4. BlockRenderer receives layout
   └─> layout: [
         { blockType: 'hero', heading: '...', ... },
         { blockType: 'services', items: [...], ... },
         { blockType: 'cta', text: '...', ... }
       ]

5. BlockRenderer maps and renders
   └─> <HeroBlock data={...} />
   └─> <ServicesBlock data={...} />
   └─> <CTABlock data={...} />

6. Page displayed to user
```

## Available Blocks

### 1. Hero Block (`HeroBlock.tsx`)

**Purpose**: Main hero section at the top of pages

**Fields**:
- `heading` (text, required) - Main headline
- `subheading` (textarea) - Supporting text
- `image` (upload, required) - Hero image

**Usage**:
```typescript
{
  blockType: 'hero',
  heading: 'Transform Your Smile with Dental Implants',
  subheading: 'Professional dental implant services...',
  image: { ... } // Media object
}
```

**Styling**:
- Responsive grid layout (1 col mobile, 2 cols desktop)
- Gradient background
- Large typography
- Priority image loading

---

### 2. Services Block (`ServicesBlock.tsx`)

**Purpose**: Display grid of services/offerings

**Fields**:
- `items` (array, 1-10 items)
  - `title` (text, required) - Service name
  - `description` (textarea, required) - Service details
  - `image` (upload, required) - Service image

**Usage**:
```typescript
{
  blockType: 'services',
  items: [
    {
      title: 'Dental Implants',
      description: 'Permanent solution for missing teeth...',
      image: { ... }
    },
    {
      title: 'Teeth Whitening',
      description: 'Professional whitening services...',
      image: { ... }
    }
  ]
}
```

**Styling**:
- Responsive grid (1/2/3 columns)
- Card-based design
- Hover effects (scale, shadow)
- Optimized images

---

### 3. CTA Block (`CTABlock.tsx`)

**Purpose**: Call-to-action section for conversions

**Fields**:
- `text` (text, required) - CTA message
- `buttonLabel` (text, required) - Button text
- `link` (text, required) - URL or path

**Usage**:
```typescript
{
  blockType: 'cta',
  text: 'Ready to transform your smile?',
  buttonLabel: 'Book Consultation',
  link: '/contact' // or 'tel:+1234567890' or 'https://...'
}
```

**Link Types**:
- Internal: `/contact`, `/about`
- External: `https://example.com`
- Phone: `tel:+1234567890`
- Email: `mailto:info@example.com`

**Styling**:
- Gradient background
- Large centered text
- Prominent button
- Responsive sizing

---

## Adding New Blocks

### Step 1: Create Block Component

```typescript
// src/components/blocks/TestimonialsBlock.tsx
import type { Page } from '@/src/payload/payload-types'

type TestimonialsBlock = Extract<
  Page['layout'][number], 
  { blockType: 'testimonials' }
>

interface TestimonialsBlockProps {
  data: TestimonialsBlock
}

export function TestimonialsBlock({ data }: TestimonialsBlockProps) {
  return (
    <section className="testimonials-block">
      {/* Your component JSX */}
    </section>
  )
}
```

### Step 2: Add to Payload Collection

```typescript
// src/payload/collections/Pages.ts
{
  slug: 'testimonials',
  labels: {
    singular: 'Testimonials Block',
    plural: 'Testimonials Blocks',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'quote', type: 'textarea', required: true },
        { name: 'rating', type: 'number', required: true },
      ],
    },
  ],
}
```

### Step 3: Add to BlockRenderer

```typescript
// src/components/BlockRenderer.tsx
import { TestimonialsBlock } from './blocks/TestimonialsBlock'

// In switch statement:
case 'testimonials':
  return <TestimonialsBlock key={index} data={block} />
```

### Step 4: Export from Index

```typescript
// src/components/blocks/index.ts
export { TestimonialsBlock } from './TestimonialsBlock'
```

## Styling Guidelines

### Responsive Design
- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Test on multiple screen sizes

### Dark Mode
- Always include dark mode variants
- Use `dark:` prefix for dark mode styles
- Test in both light and dark modes

### Spacing
- Consistent padding: `py-16 md:py-24` for sections
- Container: `container mx-auto px-4`
- Gap between elements: `space-y-4`, `gap-8`

### Typography
- Headings: `text-4xl md:text-5xl lg:text-6xl`
- Body: `text-lg md:text-xl`
- Colors: `text-gray-900 dark:text-white`

### Images
- Always use Next.js `Image` component
- Set appropriate `sizes` attribute
- Use `priority` for above-the-fold images
- Optimize with `getMediaUrl(image, 'size')`

## Performance Optimization

### Image Optimization
```typescript
// Use appropriate size variant
const imageUrl = getMediaUrl(data.image, 'desktop') // Hero
const imageUrl = getMediaUrl(data.image, 'card')    // Services
const imageUrl = getMediaUrl(data.image, 'thumbnail') // Small images
```

### Lazy Loading
```typescript
// Above the fold (Hero)
<Image priority />

// Below the fold (Services, CTA)
<Image loading="lazy" />
```

### Conditional Rendering
```typescript
// Don't render empty blocks
if (!data.items || data.items.length === 0) {
  return null
}
```

## Type Safety

### Extract Block Types
```typescript
// Get specific block type from union
type HeroBlock = Extract<
  Page['layout'][number], 
  { blockType: 'hero' }
>
```

### Type-Safe Props
```typescript
interface HeroBlockProps {
  data: HeroBlock // Fully typed
}
```

### Type Guards
```typescript
// In BlockRenderer
switch (block.blockType) {
  case 'hero':
    // TypeScript knows block is HeroBlock here
    return <HeroBlock data={block} />
}
```

## Testing Blocks

### In Admin Panel
1. Go to `/admin/collections/pages`
2. Create new page
3. Add blocks to layout
4. Fill in all required fields
5. Save and publish

### View on Frontend
1. Visit `/{slug}` to see rendered page
2. Check responsive design
3. Test dark mode
4. Verify images load
5. Test CTA links

## Common Issues

### Issue: Images not loading
**Solution**: Check that media is populated with `depth: 1` in query

### Issue: Block not rendering
**Solution**: Verify blockType matches case in BlockRenderer switch

### Issue: TypeScript errors
**Solution**: Run `npm run generate:types` to regenerate Payload types

### Issue: Styling not applied
**Solution**: Check Tailwind classes are correct and not purged

## Examples

See `src/payload/examples/ServerComponentExample.tsx` for complete examples of block rendering patterns.
