# SEO Optimization Prompts

## Overview
Prompts for optimizing pages and content for search engines.

---

## Prompt: Generate Metadata for Page

### When to Use
Adding or improving SEO metadata for a page.

### Prompt Template

```
Generate SEO metadata for the [PAGE_NAME] page.

Requirements:
1. Descriptive, keyword-rich title (50-60 characters)
2. Compelling meta description (150-160 characters)
3. OpenGraph tags for social sharing
4. Twitter card configuration
5. Proper canonical URL

Implementation pattern:

export async function generateMetadata(): Promise<Metadata> {
    try {
        const { isEnabled: isDraftMode } = await draftMode()
        const page = await getPageBySlug('[PAGE_SLUG]', isDraftMode)
        
        if (!page) {
            return {
                title: '[PAGE_NAME] - Page Not Found',
                description: 'The requested page could not be found.'
            }
        }
        
        const title = page.seo?.metaTitle || page.title || '[Default Title] - Saigon International Dental Clinic'
        const description = page.seo?.metaDescription || page.description || '[Default description]'
        
        return {
            title: isDraftMode ? `[PREVIEW] ${title}` : title,
            description,
            keywords: ['dental clinic', 'dentist', 'dental care', 'Vietnam'],
            authors: [{ name: 'Saigon International Dental Clinic' }],
            openGraph: {
                title,
                description,
                type: 'website',
                url: `${process.env.NEXT_PUBLIC_SERVER_URL}/[PAGE_SLUG]`,
                siteName: 'Saigon International Dental Clinic',
                images: [
                    {
                        url: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/og-image.jpg`,
                        width: 1200,
                        height: 630,
                        alt: title
                    }
                ]
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [`${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/twitter-image.jpg`]
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_SERVER_URL}/[PAGE_SLUG]`
            }
        }
    } catch (error) {
        console.error('Error generating metadata:', error)
        return {
            title: '[PAGE_NAME] - Saigon International Dental Clinic',
            description: '[Fallback description]'
        }
    }
}
```

---

## Prompt: Add Structured Data (JSON-LD)

### When to Use
Adding schema.org structured data for rich search results.

### Prompt Template

```
Add structured data to the [PAGE_TYPE] page.

For a dental clinic, use these schema types:

// Medical Business (Homepage/About)
const clinicSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: 'Saigon International Dental Clinic',
    image: 'https://example.com/logo.jpg',
    url: 'https://example.com',
    telephone: '+84-28-xxxx-xxxx',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Street Address',
        addressLocality: 'Ho Chi Minh City',
        addressRegion: 'Ho Chi Minh',
        postalCode: '700000',
        addressCountry: 'VN'
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 10.xxxx,
        longitude: 106.xxxx
    },
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '20:00'
        }
    ],
    priceRange: '$$'
}

// FAQ Page
const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer
        }
    }))
}

// Service Page
const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Dental Implants',
    provider: {
        '@type': 'Dentist',
        name: 'Saigon International Dental Clinic'
    },
    description: 'High-quality dental implant services'
}

// Add to page:
<script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```

---

## Prompt: Optimize Images for SEO

### When to Use
Ensuring images are properly optimized for search engines.

### Prompt Template

```
Optimize images on the [PAGE_NAME] page for SEO.

Checklist:
1. All images have descriptive alt text
2. Image filenames are descriptive (dental-implant.jpg, not IMG_001.jpg)
3. Images use Next.js Image component for optimization
4. Lazy loading for below-fold images
5. Appropriate image dimensions

Implementation:

// Always include meaningful alt text
<Image
    src={imageUrl}
    alt="Professional dental implant procedure at Saigon International Dental Clinic"
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    priority={isAboveFold}  // Use for hero images
/>

// For CMS images, use alt from content or generate meaningful fallback
const getImageAlt = (image: any, fallback: string) => {
    return image?.alt || image?.alternativeText || fallback
}

<Image
    src={getImageUrl(image)}
    alt={getImageAlt(image, `${serviceName} dental procedure`)}
    ...
/>
```

---

## Prompt: Create Sitemap Configuration

### When to Use
Setting up or updating the sitemap for the site.

### Prompt Template

```
Configure sitemap generation for the dental clinic site.

Create or update app/sitemap.ts:

import { getAllPageSlugs } from '@/src/lib/api/queries'

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://example.com'
    
    // Static pages
    const staticPages = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
        { url: `${baseUrl}/about-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/customers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ]
    
    // Dynamic pages from CMS
    const pageSlugs = await getAllPageSlugs()
    const dynamicPages = pageSlugs.map(slug => ({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7
    }))
    
    return [...staticPages, ...dynamicPages]
}
```

---

## Prompt: Audit Page for SEO Issues

### When to Use
Reviewing a page for common SEO problems.

### Prompt Template

```
Audit the [PAGE_NAME] page for SEO issues.

Check for:

1. **Title Tag**
   - Length: 50-60 characters
   - Includes primary keyword
   - Unique across site
   
2. **Meta Description**
   - Length: 150-160 characters
   - Compelling, includes call-to-action
   - Contains target keyword
   
3. **Heading Structure**
   - Single H1 tag
   - Logical heading hierarchy (H1 > H2 > H3)
   - Keywords in headings
   
4. **Content**
   - Sufficient word count (300+ words)
   - Natural keyword usage
   - Internal links to related pages
   
5. **Images**
   - All have alt text
   - Optimized file sizes
   - Responsive sizing
   
6. **Technical**
   - Proper canonical URL
   - Mobile responsive
   - Fast loading (Next.js Image, lazy loading)
   - No duplicate content
   
7. **Schema Markup**
   - Relevant structured data
   - Valid JSON-LD

Report format:
- [PASS/FAIL] Check name: Details
- Recommendation: How to fix (if failed)
```
