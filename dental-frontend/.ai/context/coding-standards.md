# Coding Standards & Conventions

## TypeScript Guidelines

### Type Definitions

```typescript
// ✅ Good - Explicit interfaces for props
interface CustomerContentProps {
  content: CustomerPageContent | null;
  page: Page;
}

// ✅ Good - Type imports
import type { Page, Media } from "@/src/types/strapi";

// ❌ Bad - Using 'any' without reason
const data: any = response;
```

### Naming Conventions

```typescript
// Components: PascalCase
export function CustomerContent() {}
export function HeroBlock() {}

// Functions: camelCase
export function getPageBySlug() {}
export function transformPage() {}

// Constants: SCREAMING_SNAKE_CASE
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

// Types/Interfaces: PascalCase
interface PageAttributes {}
type BlockComponent = HeroComponent | CTAComponent;

// Files:
// - Components: PascalCase.tsx (HeroBlock.tsx, CustomerContent.tsx)
// - Utilities: camelCase.ts (queries.ts, transformers.ts)
// - Pages: lowercase with hyphens (about-us/, page.tsx)
```

## React Patterns

### Component Structure

```tsx
'use client' // Only when needed for hooks/interactivity

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
// Lucide icons
import { Award, Star, Heart } from 'lucide-react'
// Local components
import { Button } from '@/src/components/ui/button'

// Constants at top
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://guild-biblical-expectations-easily.trycloudflare.com'

// Interfaces
interface ComponentProps {
    content: ContentType
    page: PageType
}

// Animation variants (reusable)
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

// Helper maps
const iconMap: Record<string, any> = {
    Award, Star, Heart
}

// Main component
export function ComponentName({ content, page }: ComponentProps) {
    // 1. Hooks first (always at top, never conditional)
    const [state, setState] = useState(false)
    const computed = useMemo(() => /* ... */, [deps])

    // 2. Early returns AFTER hooks
    if (!content) {
        return <FallbackUI />
    }

    // 3. Destructure data
    const { hero, sections, cta } = content

    // 4. Render
    return (
        <div className="w-full">
            {/* Sections */}
        </div>
    )
}
```

### Server vs Client Components

```tsx
// page.tsx - Server Component (no 'use client')
// - Data fetching
// - Metadata generation
// - Passing data to client components

import { getPageBySlug } from "@/src/lib/api/queries";
import { ClientComponent } from "./ClientComponent";

export async function generateMetadata() {
  const page = await getPageBySlug("slug");
  return {
    title: page?.title,
    description: page?.description,
  };
}

export default async function Page() {
  const page = await getPageBySlug("slug");
  return <ClientComponent content={page?.content} />;
}
```

```tsx
// ClientComponent.tsx - Client Component
"use client";

import { motion } from "framer-motion";

export function ClientComponent({ content }) {
  // Interactive logic here
}
```

## Styling Guidelines

> [!CAUTION]
>
> ## 🚫 `globals.css` — `html` & `body` Are Off-Limits for Page-Specific Fixes
>
> **Never modify the `html` or `body` selectors in `globals.css` to fix a layout issue on a single page.**
>
> These selectors are global and affect every page in the app simultaneously. Changing `overflow`, `position`, `max-width`, or any other property here to fix one page **will silently break other pages**.
>
> ### ❌ What NOT to do
>
> ```css
> /* globals.css — DO NOT do this to fix a sticky/scroll issue on one page */
> html {
>   overflow-x: hidden; /* breaks position:sticky app-wide */
> }
> body {
>   overflow-x: clip; /* affects every page's scroll container */
> }
> ```
>
> ### ✅ Correct approach — fix at the component or layout level
>
> - Apply `overflow-x-clip` directly to the section/wrapper element in the **component**.
> - Use `overflow-x-clip` (not `overflow-x-hidden`) on intermediate wrappers — `clip` does **not** create a scroll container so `position:sticky` still works.
> - If a fix is needed for all pages, discuss it explicitly before touching `globals.css`.
>
> ### Why `overflow: hidden` breaks `position: sticky`
>
> Any ancestor element with `overflow` set to `hidden`, `scroll`, or `auto` on **any axis** becomes a new scroll container. `position: sticky` children can only stick within their nearest scroll container — so if `<main>` or `<body>` has `overflow-x: hidden`, sticky stops working on all descendants.
>
> **The fix belongs in `layout.tsx` → `<main className="overflow-x-clip">` or on the section itself — never in `globals.css` html/body.**

### Tailwind CSS Patterns

```tsx
// ✅ Good - Use semantic spacing
<div className="px-6 py-16 md:py-24 max-w-7xl mx-auto">

// ✅ Good - Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// ✅ Good - Use design system colors
<span className="text-sky-600 font-medium">
<div className="bg-sky-100 p-3 rounded-xl">

// ❌ Bad - Arbitrary values
<div className="py-[47px] text-[#1a2b3c]">

// ❌ Bad - Direct colors instead of tokens
<div className="bg-blue-500 text-white">
```

### Animation Patterns

```tsx
// Reuse consistent animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
}

// Apply to sections
<motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
>
    <motion.div variants={staggerContainer}>
        <motion.h2 variants={fadeInUp}>Title</motion.h2>
        <motion.p variants={fadeInUp}>Content</motion.p>
    </motion.div>
</motion.section>
```

## File Organization

### Import Order

```tsx
// 1. Next.js imports
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

// 2. Third-party libraries
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

// 3. Icons
import { Award, Star, Heart } from "lucide-react";

// 4. Local components (absolute paths)
import { Button } from "@/src/components/ui/button";
import { HeroBlock } from "@/src/components/blocks/HeroBlock";

// 5. Types
import type { Page, Media } from "@/src/types/strapi";

// 6. Utilities
import { getPageBySlug } from "@/src/lib/api/queries";
```

### Path Aliases

```typescript
// Use @ alias for src
import { Button } from "@/src/components/ui/button";
import { getPageBySlug } from "@/src/lib/api/queries";
import type { Page } from "@/src/types/strapi";

// For relative imports within same module
import { helper } from "./helper";
import type { LocalType } from "./types";
```

## Error Handling

```tsx
// API calls with error handling
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const response = await apiClient(`/api/pages`, {
      /* params */
    });
    if (!response.data?.length) {
      console.warn(`Page not found: ${slug}`);
      return null;
    }
    return transformPage(response.data[0]);
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

// Component error handling
export default async function Page() {
  try {
    const page = await getPageBySlug("slug");
    if (!page) notFound();
    return <Content content={page.content} />;
  } catch (error) {
    console.error("Error:", error);
    return <ErrorFallback />;
  }
}
```

## Image Handling

```tsx
// Always use Next.js Image component
import Image from 'next/image'

// For CMS images
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

<Image
    src={`${STRAPI_URL}/uploads/image.jpg`}
    alt="Descriptive alt text"
    fill
    className="object-cover"
/>

// Or with explicit dimensions
<Image
    src={imageUrl}
    alt={imageAlt}
    width={400}
    height={300}
    className="rounded-2xl"
/>
```

## Comments & Documentation

```tsx
/**
 * Customer Page
 *
 * Displays customer testimonials, success stories, and benefits.
 * Content is managed via Strapi CMS.
 *
 * @see migration_scripts/024-create-customer-page.js for data structure
 */
export function CustomerContent({ content, page }: CustomerContentProps) {
    // Early return if no content
    if (!content) return <Fallback />

    // Destructure sections from CMS content
    const { hero, testimonials, benefits } = content

    return (/* ... */)
}
```
