# Refactoring Prompts

## Overview
Prompts for refactoring and improving existing code.

---

## Prompt: Extract Reusable Component

### When to Use
Identifying and extracting repeated UI patterns into reusable components.

### Prompt Template

```
Extract a reusable component from the repeated pattern in [FILE_PATH].

Pattern to extract: [DESCRIBE_PATTERN]

Requirements:
1. Create component in appropriate location:
   - UI primitives: src/components/ui/
   - Section blocks: src/components/blocks/
   - Layout: src/components/layout/
   - Page-specific: src/app/[page]/components/

2. Define TypeScript props interface
3. Support all variations of the pattern
4. Maintain existing animations and styling
5. Document component usage

Template:

// ComponentName.tsx
'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ComponentNameProps {
    title: string
    description?: string
    children?: ReactNode
    variant?: 'default' | 'outlined' | 'filled'
    className?: string
}

export function ComponentName({
    title,
    description,
    children,
    variant = 'default',
    className
}: ComponentNameProps) {
    return (
        // Implementation
    )
}

// Usage:
<ComponentName 
    title="Section Title"
    description="Optional description"
    variant="filled"
>
    {children}
</ComponentName>
```

---

## Prompt: Optimize Performance

### When to Use
Improving page load time and runtime performance.

### Prompt Template

```
Optimize performance for [PAGE/COMPONENT].

Check and apply these optimizations:

1. **Memoization**
   - useMemo for expensive calculations
   - useCallback for stable function references
   
   const computedValue = useMemo(() => {
       return expensiveCalculation(data)
   }, [data])
   
   const handleClick = useCallback(() => {
       // handler logic
   }, [dependencies])

2. **Code Splitting**
   - Dynamic imports for heavy components
   - Lazy loading below-fold content
   
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
       loading: () => <Skeleton />
   })

3. **Image Optimization**
   - Use Next.js Image component
   - Proper sizing and srcset
   - Lazy loading with priority for above-fold
   
   <Image
       src={url}
       alt="description"
       width={800}
       height={600}
       sizes="(max-width: 768px) 100vw, 50vw"
       priority={isHero}
   />

4. **Animation Optimization**
   - viewport={{ once: true }} for scroll animations
   - Use transform/opacity instead of layout properties
   - Debounce/throttle heavy animations

5. **State Management**
   - Lift state only when needed
   - Use local state when possible
   - Avoid unnecessary re-renders

6. **Data Fetching**
   - Server Components for static data
   - Proper cache tags for revalidation
   - Parallel fetching where possible
```

---

## Prompt: Improve Type Safety

### When to Use
Adding or improving TypeScript types for better safety.

### Prompt Template

```
Improve TypeScript type safety in [FILE_PATH].

Tasks:
1. Replace 'any' types with specific types
2. Add interfaces for component props
3. Use type guards for runtime checks
4. Add return types to functions

Example transformations:

// Before
const data: any = response
const handleClick = (item) => { ... }
function processData(input) { ... }

// After
interface ResponseData {
    id: number
    title: string
    items: DataItem[]
}

const data: ResponseData = response

const handleClick = (item: DataItem): void => { ... }

function processData(input: InputType): OutputType {
    // ...
}

// Type guard
function isValidContent(content: unknown): content is ContentType {
    return (
        typeof content === 'object' &&
        content !== null &&
        'title' in content &&
        typeof (content as ContentType).title === 'string'
    )
}

// Usage
if (isValidContent(data)) {
    // TypeScript knows data is ContentType here
}
```

---

## Prompt: Standardize Animation Patterns

### When to Use
Ensuring consistent animations across the project.

### Prompt Template

```
Standardize animations in [COMPONENT/PAGE] to match project patterns.

Use these standard animation variants from the design system:

// Standard variants (define once, reuse everywhere)
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
}

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

// Standard section pattern
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

// Standard hover patterns
whileHover={{ y: -8, transition: { duration: 0.3 } }}  // Cards
whileHover={{ scale: 1.05 }}  // Buttons/icons
whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}  // Icons with wiggle
```

---

## Prompt: Consolidate Duplicate Code

### When to Use
Finding and consolidating duplicate code patterns.

### Prompt Template

```
Find and consolidate duplicate code in [SCOPE].

Process:
1. Identify duplicated patterns
2. Determine appropriate abstraction level
3. Create shared utility/component
4. Replace all instances
5. Test functionality preserved

Common consolidation patterns:

// Helper functions -> lib/utils.ts
export function formatDate(date: string): string { ... }
export function truncateText(text: string, length: number): string { ... }

// Shared constants -> lib/constants.ts
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || '...'
export const ANIMATION_DURATION = 0.6

// Icon mapping -> components/IconMap.tsx
export const iconMap: Record<string, LucideIcon> = {
    Award, Star, Heart, // ...
}

// Section header pattern -> components/SectionHeader.tsx
export function SectionHeader({ badge, title, description }: Props) {
    return (
        <motion.div className="text-center mb-16" variants={staggerContainer}>
            {badge && <Badge>{badge}</Badge>}
            <motion.h2 variants={fadeInUp}>{title}</motion.h2>
            {description && <motion.p variants={fadeInUp}>{description}</motion.p>}
        </motion.div>
    )
}
```

---

## Prompt: Improve Error Handling

### When to Use
Adding or improving error handling and user feedback.

### Prompt Template

```
Improve error handling in [FILE/COMPONENT].

Implement these patterns:

1. **API Error Handling**
   try {
       const data = await fetchData()
       return data
   } catch (error) {
       console.error('[FunctionName] Error:', error)
       return null  // Or throw for error boundary
   }

2. **Component Error States**
   if (!content) {
       return (
           <div className="min-h-[400px] flex items-center justify-center">
               <div className="text-center">
                   <p className="text-slate-500">Content not available</p>
               </div>
           </div>
       )
   }

3. **Form Validation Errors**
   {errors.fieldName && (
       <p className="text-red-500 text-sm mt-1">
           {errors.fieldName.message}
       </p>
   )}

4. **Loading States**
   {isLoading ? (
       <div className="animate-pulse">
           <div className="h-8 bg-slate-200 rounded w-3/4 mb-4" />
           <div className="h-4 bg-slate-200 rounded w-full" />
       </div>
   ) : (
       <Content data={data} />
   )}

5. **Fallback Values**
   const title = page?.title || content?.hero?.title || 'Default Title'
   const imageUrl = getImageUrl(image) || '/images/fallback.jpg'
```
