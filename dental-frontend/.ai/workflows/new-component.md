# Workflow: Creating a New Reusable Component

## Overview
Step-by-step guide for creating reusable UI components.

## Prerequisites
- Understanding of component requirements
- Knowledge of design system patterns
- Familiarity with existing component library

---

## Step 1: Analyze Requirements

### 1.1 Define Component Purpose
```
Component: [COMPONENT_NAME]
Purpose: [What does it do?]
Location: src/components/[category]/[ComponentName].tsx

Categories:
- ui/       - Base UI primitives (buttons, inputs, cards)
- blocks/   - CMS content blocks (HeroBlock, CTABlock)
- layout/   - Layout components (Header, Footer)
- forms/    - Form-related components
```

### 1.2 Define Props Interface
```typescript
interface ComponentNameProps {
    // Required props
    title: string
    
    // Optional props with defaults
    variant?: 'default' | 'outlined' | 'filled'
    size?: 'sm' | 'md' | 'lg'
    
    // Event handlers
    onClick?: () => void
    
    // Styling customization
    className?: string
    
    // Children for composition
    children?: React.ReactNode
}
```

### 1.3 Check Existing Patterns
Search for similar components:
```bash
# Find related components
grep -r "interface.*Props" src/components/
```

---

## Step 2: Create Component File

### 2.1 File Structure
```
src/components/[category]/
├── ComponentName.tsx      # Main component
├── ComponentName.test.tsx # Tests (optional)
└── index.ts              # Re-export (optional)
```

### 2.2 Component Template

```tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/src/lib/utils'
import type { ReactNode } from 'react'

// Props interface
interface ComponentNameProps {
    title: string
    description?: string
    variant?: 'default' | 'outlined' | 'filled'
    className?: string
    children?: ReactNode
}

// Animation variants (if needed)
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

/**
 * ComponentName
 * 
 * Brief description of what the component does.
 * 
 * @example
 * <ComponentName title="Hello" variant="filled">
 *   <p>Content</p>
 * </ComponentName>
 */
export function ComponentName({
    title,
    description,
    variant = 'default',
    className,
    children
}: ComponentNameProps) {
    // Variant styles
    const variantStyles = {
        default: 'bg-white border border-slate-200',
        outlined: 'bg-transparent border-2 border-sky-400',
        filled: 'bg-sky-500 text-white'
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className={cn(
                'rounded-2xl p-6',
                variantStyles[variant],
                className
            )}
        >
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            {description && (
                <p className="text-slate-600 mb-4">{description}</p>
            )}
            {children}
        </motion.div>
    )
}
```

---

## Step 3: Style the Component

### 3.1 Follow Design System
Reference `.ai/context/design-system.md` for:
- Color palette (sky-500 primary, slate-900 text)
- Spacing scale (p-6, gap-4, etc.)
- Border radius (rounded-xl, rounded-2xl)
- Shadow levels (shadow-lg, shadow-xl)

### 3.2 Add Hover States
```tsx
<motion.div
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    className="hover:shadow-xl hover:border-sky-200 transition-all"
>
```

### 3.3 Add Responsive Styles
```tsx
<div className="p-4 md:p-6 lg:p-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<h2 className="text-2xl md:text-3xl lg:text-4xl">
```

---

## Step 4: Add Animations

### 4.1 Standard Animation Patterns
```tsx
// Fade in from below
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

// Scale in
const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

// Stagger children
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
}
```

### 4.2 Apply to Component
```tsx
<motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeInUp}
>
```

---

## Step 5: Handle Data from CMS

### 5.1 For CMS Content Blocks
```tsx
interface BlockProps {
    badge?: string
    title: string
    description?: string
    items?: Array<{
        icon?: string
        title: string
        description: string
    }>
}

// Map icon strings to components
const iconMap: Record<string, LucideIcon> = {
    Award, Star, Heart, Shield
}

export function Block({ badge, title, description, items }: BlockProps) {
    return (
        <section>
            {badge && <Badge>{badge}</Badge>}
            <h2>{title}</h2>
            {items?.map((item, i) => {
                const Icon = iconMap[item.icon || 'Star']
                return <ItemCard key={i} icon={Icon} {...item} />
            })}
        </section>
    )
}
```

### 5.2 Handle Images
```tsx
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

const getImageUrl = (image: any) => {
    if (image?.type === 'strapi' && image.path) {
        return `${STRAPI_URL}${image.path}`
    }
    return image?.url || '/images/fallback.jpg'
}

<Image
    src={getImageUrl(image)}
    alt={image?.alt || 'Default alt text'}
    fill
    className="object-cover"
/>
```

---

## Step 6: Export and Document

### 6.1 Add to Index (if using barrel exports)
```tsx
// src/components/blocks/index.ts
export { ComponentName } from './ComponentName'
```

### 6.2 Document Usage
Add JSDoc comments to component:
```tsx
/**
 * FeatureCard - Displays a feature with icon, title, and description
 * 
 * @param icon - Lucide icon name (e.g., 'Award', 'Star')
 * @param title - Feature title
 * @param description - Feature description
 * @param variant - Visual variant ('default' | 'outlined' | 'filled')
 * 
 * @example
 * <FeatureCard
 *   icon="Award"
 *   title="Quality Care"
 *   description="We provide top-notch dental services"
 *   variant="filled"
 * />
 */
```

---

## Step 7: Test Component

### 7.1 Visual Testing
1. Render component in isolation
2. Test all variants
3. Test with different data
4. Test responsive breakpoints
5. Verify animations

### 7.2 Integration Testing
1. Use component in actual page
2. Test with CMS data
3. Verify no console errors
4. Check accessibility

---

## Checklist

- [ ] Props interface defined
- [ ] Component file created
- [ ] Design system styles applied
- [ ] Hover states added
- [ ] Responsive design implemented
- [ ] Animations configured
- [ ] CMS data handling (if applicable)
- [ ] Exported from index
- [ ] JSDoc documentation added
- [ ] Tested in isolation
- [ ] Tested in page context
