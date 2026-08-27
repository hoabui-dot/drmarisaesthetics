# Vercel v0 UI Generator Skill

## 🎯 Purpose

This skill enables AI agents to generate production-ready UI components in the style of Vercel v0, following the established patterns and best practices of this Next.js + Strapi CMS project.

---

## 🎨 Core Capabilities

### 1. Component Generation
- Generate React components with TypeScript
- Follow Next.js 15 App Router patterns
- Use Server Components by default
- Apply Tailwind CSS 4 styling
- Integrate with shadcn/ui components

### 2. Block System Integration
- Create new content blocks for Strapi CMS
- Follow the block-based architecture
- Integrate with BlockRenderer
- Add proper TypeScript types

### 3. Design System Compliance
- Use established design tokens
- Follow spacing and typography patterns
- Maintain accessibility standards
- Apply consistent styling

---

## 🏗️ Architecture Understanding

### Tech Stack
```typescript
// Frontend
Next.js 15.4.11 (App Router)
React 19.0.0
TypeScript 5
Tailwind CSS 4
Radix UI + shadcn/ui

// Backend
Strapi v5 (Headless CMS)
PostgreSQL

// Key Libraries
React Hook Form + Zod (forms)
Framer Motion (animations)
Lucide React (icons)
```

### Component Patterns

**Server Components (Default)**
```typescript
// No 'use client' directive
export default async function Component() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

**Client Components (Opt-in)**
```typescript
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

---

## 📋 Component Generation Rules

### Rule 1: Follow Existing Patterns

**ALWAYS:**
- ✅ Check existing components for patterns
- ✅ Use same naming conventions (PascalCase)
- ✅ Follow same file structure
- ✅ Match import organization
- ✅ Use established utilities (cn, clsx)

**NEVER:**
- ❌ Introduce new patterns without justification
- ❌ Use different naming conventions
- ❌ Create duplicate functionality
- ❌ Bypass existing abstractions

### Rule 2: TypeScript First

**ALWAYS:**
- ✅ Define proper interfaces for props
- ✅ Use type inference where appropriate
- ✅ Export types for reusability
- ✅ Avoid `any` types

**Example:**
```typescript
interface HeroBlockProps {
  data: {
    heading: string;
    subheading?: string;
    image?: Media;
  };
}

export function HeroBlock({ data }: HeroBlockProps) {
  // Implementation
}
```

### Rule 3: Accessibility First

**ALWAYS:**
- ✅ Use semantic HTML
- ✅ Add ARIA labels where needed
- ✅ Support keyboard navigation
- ✅ Include alt text for images
- ✅ Maintain proper heading hierarchy

**Example:**
```typescript
<section aria-labelledby="hero-heading">
  <h1 id="hero-heading">{heading}</h1>
  <img src={image.url} alt={image.alt} />
</section>
```

### Rule 4: Responsive Design

**ALWAYS:**
- ✅ Use Tailwind responsive prefixes (sm:, md:, lg:, xl:)
- ✅ Test mobile-first approach
- ✅ Use container classes
- ✅ Apply proper spacing

**Example:**
```typescript
<div className="container mx-auto px-4 py-8 md:py-16">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Content */}
  </div>
</div>
```

### Rule 5: Performance Optimization

**ALWAYS:**
- ✅ Use Next.js Image component
- ✅ Lazy load when appropriate
- ✅ Minimize client JavaScript
- ✅ Use Server Components by default

**Example:**
```typescript
import Image from 'next/image';

<Image
  src={image.url}
  alt={image.alt}
  width={800}
  height={600}
  priority={isAboveFold}
  className="rounded-lg"
/>
```

---

## 🎨 Design System

### Color Tokens
```css
/* Primary Colors */
bg-background          /* Page background */
bg-background-secondary /* Card background */
text-foreground        /* Primary text */
text-foreground-secondary /* Secondary text */
text-primary-600       /* Brand color */
border-border          /* Border color */

/* Semantic Colors */
bg-destructive         /* Error/danger */
bg-success            /* Success */
bg-warning            /* Warning */
```

### Typography Scale
```css
text-4xl font-bold    /* Hero heading */
text-3xl font-bold    /* Section heading */
text-2xl font-semibold /* Subsection heading */
text-xl               /* Large body */
text-base             /* Body text */
text-sm               /* Small text */
```

### Spacing Scale
```css
container mx-auto px-4  /* Container */
py-16 md:py-24         /* Section padding */
gap-6 md:gap-8         /* Grid gap */
space-y-4              /* Vertical spacing */
```

---

## 🧩 Block Creation Workflow

### Step 1: Create Block Component

**File:** `src/components/blocks/[BlockName].tsx`

```typescript
import type { HomepageBlock } from '@/src/types/strapi';
import Image from 'next/image';

type FeatureBlock = Extract<
  HomepageBlock,
  { blockType: 'feature' }
>;

interface FeatureBlockProps {
  data: FeatureBlock;
}

export function FeatureBlock({ data }: FeatureBlockProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {data.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.features.map((feature) => (
            <div key={feature.id} className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-foreground-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Step 2: Add TypeScript Types

**File:** `src/types/strapi.ts`

```typescript
// Add to HomepageBlockComponent union
export interface HomepageFeatureComponent {
  __component: "homepage.feature";
  id: number;
  title: string;
  features: Array<{
    id: number;
    title: string;
    description: string;
    icon?: string;
  }>;
}

// Add to HomepageBlock union
export interface HomepageFeatureBlock {
  blockType: "feature";
  id: number;
  title: string;
  features: Array<{
    id: number;
    title: string;
    description: string;
    icon?: string;
  }>;
}
```

### Step 3: Register in BlockRenderer

**File:** `src/components/BlockRenderer.tsx`

```typescript
import { FeatureBlock } from './blocks/FeatureBlock';

// In switch statement:
case 'feature':
  return <FeatureBlock key={`feature-${blockId}`} data={block as any} />;
```

### Step 4: Add Transformer (if needed)

**File:** `src/lib/api/transformers.ts`

```typescript
case 'homepage.feature':
  return {
    blockType: 'feature',
    id: block.id,
    title: block.title || '',
    features: block.features || [],
  } as HomepageFeatureBlock;
```

---

## 🎯 Component Templates

### Template 1: Hero Section

```typescript
'use client';

import Image from 'next/image';
import { Button } from '@/src/components/ui/button';

interface HeroSectionProps {
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaLink?: string;
  image?: {
    url: string;
    alt: string;
  };
}

export function HeroSection({
  heading,
  subheading,
  ctaLabel,
  ctaLink,
  image,
}: HeroSectionProps) {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {heading}
            </h1>
            {subheading && (
              <p className="text-xl text-foreground-secondary">
                {subheading}
              </p>
            )}
            {ctaLabel && ctaLink && (
              <Button asChild size="lg">
                <a href={ctaLink}>{ctaLabel}</a>
              </Button>
            )}
          </div>
          {image && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

### Template 2: Feature Grid

```typescript
import { LucideIcon } from 'lucide-react';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

interface FeatureGridProps {
  title: string;
  subtitle?: string;
  features: Feature[];
}

export function FeatureGrid({ title, subtitle, features }: FeatureGridProps) {
  return (
    <section className="py-16 md:py-24 bg-background-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-background p-6 rounded-lg border border-border hover:border-primary-600 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-foreground-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Template 3: CTA Section

```typescript
import { Button } from '@/src/components/ui/button';

interface CTASectionProps {
  title: string;
  description?: string;
  primaryLabel: string;
  primaryLink: string;
  secondaryLabel?: string;
  secondaryLink?: string;
}

export function CTASection({
  title,
  description,
  primaryLabel,
  primaryLink,
  secondaryLabel,
  secondaryLink,
}: CTASectionProps) {
  return (
    <section className="py-16 md:py-24 bg-primary-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <a href={primaryLink}>{primaryLabel}</a>
          </Button>
          {secondaryLabel && secondaryLink && (
            <Button asChild size="lg" variant="outline">
              <a href={secondaryLink}>{secondaryLabel}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## ✅ Quality Checklist

### Before Submitting Component

- [ ] TypeScript types defined
- [ ] Props interface documented
- [ ] Responsive design implemented
- [ ] Accessibility attributes added
- [ ] Images optimized with Next.js Image
- [ ] Error handling included
- [ ] Loading states considered
- [ ] Follows existing patterns
- [ ] No console errors
- [ ] Works in both light/dark mode

---

## 🚀 Usage Examples

### Example 1: Generate Hero Block

**Prompt:**
```
Generate a hero block component with:
- Large heading and subheading
- CTA button
- Background image with overlay
- Responsive design
```

**Output:**
```typescript
// Component following all patterns and rules
```

### Example 2: Generate Feature Section

**Prompt:**
```
Create a feature section with:
- Grid of 3 features
- Icon, title, description for each
- Hover effects
- Responsive layout
```

**Output:**
```typescript
// Component following all patterns and rules
```

---

## 📚 Reference Files

### Key Files to Reference

**Component Patterns:**
- `src/components/blocks/HeroBlock.tsx`
- `src/components/blocks/ServicesBlock.tsx`
- `src/components/blocks/CTABlock.tsx`

**Type Definitions:**
- `src/types/strapi.ts`

**Utilities:**
- `src/lib/utils.ts`
- `src/lib/api/client.ts`

**UI Components:**
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`

---

## 🎓 Best Practices

### 1. Component Composition

**Good:**
```typescript
<section>
  <Container>
    <Heading>{title}</Heading>
    <Grid>
      {items.map(item => <Card key={item.id} {...item} />)}
    </Grid>
  </Container>
</section>
```

**Bad:**
```typescript
<div>
  <div>
    <h2>{title}</h2>
    <div>
      {items.map(item => <div key={item.id}>...</div>)}
    </div>
  </div>
</div>
```

### 2. Styling Approach

**Good:**
```typescript
className="container mx-auto px-4 py-16 md:py-24"
```

**Bad:**
```typescript
style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 16px' }}
```

### 3. Data Handling

**Good:**
```typescript
{data?.items?.map(item => (
  <div key={item.id}>{item.title}</div>
))}
```

**Bad:**
```typescript
{data.items.map(item => (
  <div>{item.title}</div>
))}
```

---

## 🔧 Troubleshooting

### Issue: Component Not Rendering

**Check:**
1. Is it registered in BlockRenderer?
2. Is the blockType correct?
3. Are TypeScript types defined?
4. Is data being passed correctly?

### Issue: Styling Not Applied

**Check:**
1. Are Tailwind classes correct?
2. Is the component using cn() utility?
3. Are responsive prefixes used?
4. Is dark mode considered?

### Issue: TypeScript Errors

**Check:**
1. Are all types exported?
2. Is the interface complete?
3. Are optional fields marked with `?`
4. Is the type added to union types?

---

## 📖 Additional Resources

### Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)

### Project Documentation
- `.ai/FRONTEND_GUIDE.md` - Frontend patterns
- `.ai/ARCHITECTURE.md` - System architecture
- `.ai/AI_RULES.md` - Development rules

---

**This skill enables production-ready UI component generation following Vercel v0 best practices and project-specific patterns.**
