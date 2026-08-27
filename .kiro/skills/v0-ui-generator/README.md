# Vercel v0 UI Generator Skill

## 📖 Overview

This skill enables AI agents to generate production-ready UI components following Vercel v0 best practices, specifically tailored for this Next.js 15 + Strapi v5 headless CMS project.

---

## 🎯 What This Skill Does

### Core Capabilities

1. **Component Generation**
   - React components with TypeScript
   - Next.js 15 App Router patterns
   - Server Components by default
   - Tailwind CSS 4 styling
   - shadcn/ui integration

2. **Block System Integration**
   - CMS content blocks
   - BlockRenderer integration
   - Type-safe implementations
   - Data transformation

3. **Design System Compliance**
   - Established design tokens
   - Consistent spacing/typography
   - Accessibility standards
   - Responsive design

---

## 🚀 Quick Start

### Activating the Skill

```typescript
// In Kiro, reference this skill:
#v0-ui-generator

// Or load it in context:
"Read the v0-ui-generator skill documentation"
```

### Basic Usage

**Generate a Hero Section:**
```
Using the v0-ui-generator skill, create a hero section with:
- Large heading and subheading
- CTA button
- Background image
- Responsive design
```

**Generate a Feature Grid:**
```
Using the v0-ui-generator skill, create a feature grid with:
- 3 columns on desktop
- Icon, title, description per feature
- Hover effects
- Mobile responsive
```

---

## 📋 Component Templates

### Available Templates

1. **Hero Section** - Large header with CTA
2. **Feature Grid** - Grid of features/services
3. **CTA Section** - Call-to-action banner
4. **Testimonial Carousel** - Customer testimonials
5. **Pricing Table** - Pricing plans
6. **FAQ Accordion** - Frequently asked questions
7. **Stats Section** - Statistics/metrics
8. **Team Grid** - Team member cards

---

## 🎨 Design System

### Color Palette

```css
/* Backgrounds */
bg-background           /* #FFFFFF (light) / #0A0A0A (dark) */
bg-background-secondary /* #F9FAFB (light) / #1A1A1A (dark) */

/* Text */
text-foreground         /* #111827 (light) / #F9FAFB (dark) */
text-foreground-secondary /* #6B7280 (light) / #9CA3AF (dark) */

/* Brand */
text-primary-600        /* #2563EB */
bg-primary-600          /* #2563EB */
border-primary-600      /* #2563EB */
```

### Typography

```css
/* Headings */
text-4xl font-bold      /* 36px / 2.25rem */
text-3xl font-bold      /* 30px / 1.875rem */
text-2xl font-semibold  /* 24px / 1.5rem */
text-xl font-semibold   /* 20px / 1.25rem */

/* Body */
text-base               /* 16px / 1rem */
text-sm                 /* 14px / 0.875rem */
```

### Spacing

```css
/* Container */
container mx-auto px-4

/* Section Padding */
py-16 md:py-24         /* 64px / 96px */

/* Grid Gap */
gap-6 md:gap-8         /* 24px / 32px */
```

---

## 🧩 Block Creation Guide

### Step-by-Step Process

#### 1. Create Component File

**Location:** `src/components/blocks/[BlockName].tsx`

```typescript
import type { HomepageBlock } from '@/src/types/strapi';

type MyBlock = Extract<HomepageBlock, { blockType: 'my-block' }>;

interface MyBlockProps {
  data: MyBlock;
}

export function MyBlock({ data }: MyBlockProps) {
  return (
    <section className="py-16 md:py-24">
      {/* Implementation */}
    </section>
  );
}
```

#### 2. Add TypeScript Types

**Location:** `src/types/strapi.ts`

```typescript
// Add to component union
export interface HomepageMyBlockComponent {
  __component: "homepage.my-block";
  id: number;
  title: string;
  // ... other fields
}

// Add to block union
export interface HomepageMyBlock {
  blockType: "my-block";
  id: number;
  title: string;
  // ... other fields
}
```

#### 3. Register in BlockRenderer

**Location:** `src/components/BlockRenderer.tsx`

```typescript
import { MyBlock } from './blocks/MyBlock';

// In switch statement:
case 'my-block':
  return <MyBlock key={`my-block-${blockId}`} data={block as any} />;
```

#### 4. Test the Component

```bash
# Start dev server
npm run dev

# Visit page with the block
http://localhost:3000/your-page
```

---

## 📚 Example Prompts

### Prompt 1: Hero with Video Background

```
Using the v0-ui-generator skill, create a hero section with:
- Video background with overlay
- Large heading and subheading
- Two CTA buttons (primary and secondary)
- Scroll indicator
- Responsive design
- Accessibility features
```

### Prompt 2: Service Cards

```
Using the v0-ui-generator skill, create a services section with:
- Grid of service cards (3 columns)
- Icon, title, description per card
- Hover animation (lift effect)
- Link to service detail page
- Mobile responsive (1 column on mobile)
```

### Prompt 3: Testimonial Slider

```
Using the v0-ui-generator skill, create a testimonial section with:
- Carousel/slider of testimonials
- Customer name, photo, rating
- Navigation arrows
- Auto-play with pause on hover
- Responsive design
```

### Prompt 4: Pricing Table

```
Using the v0-ui-generator skill, create a pricing section with:
- 3 pricing tiers
- Feature list with checkmarks
- Highlight popular plan
- CTA button per plan
- Monthly/yearly toggle
- Responsive design
```

### Prompt 5: FAQ Accordion

```
Using the v0-ui-generator skill, create an FAQ section with:
- Accordion for questions/answers
- Smooth expand/collapse animation
- Search/filter functionality
- Category tabs
- Responsive design
```

---

## ✅ Quality Standards

### Every Component Must Have

- [ ] TypeScript types defined
- [ ] Props interface with JSDoc
- [ ] Responsive design (mobile-first)
- [ ] Accessibility attributes (ARIA)
- [ ] Error handling
- [ ] Loading states (if async)
- [ ] Dark mode support
- [ ] Semantic HTML
- [ ] Optimized images (Next.js Image)
- [ ] No console errors

### Code Quality

- [ ] Follows existing patterns
- [ ] Uses established utilities
- [ ] Proper naming conventions
- [ ] Clean, readable code
- [ ] Commented complex logic
- [ ] No duplicate code
- [ ] Performance optimized

---

## 🎓 Learning Resources

### Project Documentation

- `.ai/README.md` - AI knowledge base overview
- `.ai/FRONTEND_GUIDE.md` - Frontend development guide
- `.ai/ARCHITECTURE.md` - System architecture
- `.ai/AI_RULES.md` - Development rules

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [Vercel v0](https://v0.dev)

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Component not rendering**
- Check BlockRenderer registration
- Verify blockType matches
- Check TypeScript types
- Inspect data structure

**Issue: Styling not applied**
- Verify Tailwind classes
- Check responsive prefixes
- Test dark mode
- Clear Next.js cache

**Issue: TypeScript errors**
- Check type exports
- Verify interface completeness
- Check union type inclusion
- Run type check: `npx tsc --noEmit`

---

## 📊 Skill Metadata

**Version:** 1.0.0  
**Last Updated:** March 31, 2026  
**Compatibility:** Next.js 15, React 19, TypeScript 5  
**Status:** Production Ready

---

## 🤝 Contributing

### Adding New Templates

1. Create template in SKILL.md
2. Add example usage
3. Document props interface
4. Include accessibility notes
5. Test on multiple devices

### Improving Documentation

1. Identify gaps or unclear sections
2. Add examples and code snippets
3. Update troubleshooting guide
4. Keep consistent with project docs

---

**This skill enables rapid, production-ready UI component generation following industry best practices and project-specific patterns.**
