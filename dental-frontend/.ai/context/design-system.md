# Design System Guidelines

## Brand Overview

**Theme**: Blue Sky Dental
**Industry**: Healthcare / Dental Clinic
**Aesthetic**: Clean, modern, trustworthy, calming

## Color Palette

### Primary Colors (Sky Blue)
Used for primary actions, highlights, and brand elements.

```css
--color-primary-50: #f0f9ff;   /* Lightest - backgrounds */
--color-primary-100: #e0f2fe;  /* Light backgrounds */
--color-primary-200: #bae6fd;  /* Hover states */
--color-primary-300: #7dd3fc;  /* Borders */
--color-primary-400: #38bdf8;  /* Active states */
--color-primary-500: #3bafda;  /* Main primary - buttons, links */
--color-primary-600: #0284c7;  /* Hover on primary */
--color-primary-700: #0369a1;  /* Active on primary */
--color-primary-800: #075985;  /* Dark accents */
--color-primary-900: #0c4a6e;  /* Darkest accents */
```

### Usage in Tailwind

```tsx
// Primary button
<Button className="bg-sky-500 hover:bg-sky-600 text-white">

// Badge/Label
<span className="text-sky-600 bg-sky-100 px-4 py-2 rounded-full">

// Icon container
<div className="bg-sky-100 p-3 rounded-xl">
    <Icon className="w-6 h-6 text-sky-600" />
</div>

// Gradient backgrounds
<div className="bg-gradient-to-b from-sky-50 to-white">
<div className="bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700">
```

### Neutral Colors
Used for text, backgrounds, and borders.

```css
--color-neutral-50: #fafafa;   /* Page background */
--color-neutral-100: #f5f5f5;  /* Card backgrounds */
--color-neutral-600: #525252;  /* Secondary text */
--color-neutral-900: #171717;  /* Primary text */
```

```tsx
// Text colors
<h1 className="text-slate-900">Primary heading</h1>
<p className="text-slate-600">Secondary text</p>
<span className="text-slate-500">Muted text</span>

// Backgrounds
<div className="bg-white">  /* Cards */
<section className="bg-slate-50">  /* Section backgrounds */
```

## Typography

### Font Scale

```tsx
// Headings
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
<h2 className="text-3xl md:text-4xl font-bold">
<h3 className="text-xl md:text-2xl font-semibold">

// Body text
<p className="text-lg leading-relaxed">  /* Primary body */
<p className="text-base">  /* Secondary body */
<p className="text-sm">  /* Small text */

// Badges/Labels
<span className="text-sm uppercase tracking-wider font-semibold">
```

### Font Weights
- **Bold (700)**: Headings, emphasis
- **Semibold (600)**: Subheadings, labels
- **Medium (500)**: Buttons, navigation
- **Regular (400)**: Body text

## Spacing System

### Section Padding

```tsx
// Full sections
<section className="px-6 py-16 md:py-24">  /* Standard */
<section className="px-6 py-20 md:py-32">  /* Large */

// Container width
<div className="max-w-7xl mx-auto">  /* Full width */
<div className="max-w-4xl mx-auto">  /* Narrow (text-focused) */
```

### Component Spacing

```tsx
// Cards
<div className="p-6">  /* Standard card padding */
<div className="p-8">  /* Large card padding */
<div className="p-10">  /* Extra large */

// Gaps
<div className="gap-4">   /* Tight */
<div className="gap-6">   /* Standard */
<div className="gap-8">   /* Relaxed */
<div className="gap-12">  /* Large sections */
```

## Border Radius

```tsx
// Standard components
<div className="rounded-xl">   /* 12px - buttons, cards */
<div className="rounded-2xl">  /* 16px - larger cards */
<div className="rounded-3xl">  /* 24px - hero images, feature cards */
<div className="rounded-full"> /* Badges, avatars */
```

## Shadows

```tsx
// Card shadows
<div className="shadow-md">   /* Subtle */
<div className="shadow-lg">   /* Standard cards */
<div className="shadow-xl">   /* Elevated cards */
<div className="shadow-2xl">  /* Hero images, modals */

// Hover states
<div className="shadow-lg hover:shadow-xl transition-shadow">
```

## Animation Guidelines

### Framer Motion Variants

```tsx
// Fade in from below (most common)
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

// Simple fade
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
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
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
}

// Slide in from sides
const slideInLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
}
```

### Section Animation Pattern

```tsx
<motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="px-6 py-20"
>
    <motion.div variants={staggerContainer}>
        <motion.h2 variants={fadeInUp}>Title</motion.h2>
        <motion.p variants={fadeInUp}>Description</motion.p>
        <motion.div variants={fadeInUp}>Content</motion.div>
    </motion.div>
</motion.section>
```

### Hover Interactions

```tsx
// Card hover
<motion.div
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl"
>

// Icon hover
<motion.div
    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
    transition={{ duration: 0.5 }}
>

// Button hover
<Button className="hover:scale-105 transition-transform">
```

### Floating Animations

```tsx
// Subtle floating effect for images
<motion.div
    animate={{
        y: [0, -15, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
>

// Background blob animations
<motion.div
    animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3]
    }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    className="absolute w-72 h-72 bg-sky-200/30 rounded-full blur-3xl"
/>
```

## Component Patterns

### Badge/Label

```tsx
<motion.div 
    variants={fadeIn} 
    className="inline-block px-5 py-2 bg-gradient-to-r from-sky-100 to-sky-200 rounded-full border border-sky-300/50"
>
    <span className="text-sky-700 font-semibold text-sm uppercase tracking-wider">
        {badge}
    </span>
</motion.div>
```

### Feature Card

```tsx
<motion.div
    variants={scaleIn}
    whileHover={{ y: -12 }}
    className="group"
>
    <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-slate-100 hover:border-sky-200 relative overflow-hidden">
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-transparent to-sky-50 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10">
            <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600">{description}</p>
        </div>
    </div>
</motion.div>
```

### CTA Section

```tsx
<section className="relative px-6 py-24 overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-sky-100 to-white" />
    
    {/* Animated blobs */}
    <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl"
    />
    
    <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {title}
        </h2>
        <p className="text-xl text-slate-600 mb-8">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-sky-500 hover:bg-sky-600 text-white px-10 py-6 rounded-xl text-lg">
                Primary Action
            </Button>
            <Button variant="outline" className="border-2 border-sky-400 text-sky-700">
                Secondary Action
            </Button>
        </div>
    </div>
</section>
```

## Responsive Design

### Breakpoints

```tsx
// Mobile first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Text sizing
<h1 className="text-4xl md:text-5xl lg:text-6xl">

// Spacing
<section className="py-16 md:py-24 lg:py-32">

// Visibility
<div className="hidden md:block">  /* Desktop only */
<div className="md:hidden">        /* Mobile only */
```

## Mobile Card Patterns

### 2-Row Standardization (Icon + Title + Description)
To optimize readability and ensure a clutter-free experience on mobile devices, all cards containing an icon, a title, and a description MUST follow a 2-row pattern on mobile viewports.

**Standard Layout**:
- **Row 1**: Icon and Title (flex-row, items-center).
- **Row 2**: Description (full width, no indentation).

**Rationale**:
- Eliminates "empty space" below the icon on narrow screens.
- Increases the line length of descriptions, improving readability.
- Consistent with a "mobile-first" approach.

**Tailwind Implementation Example**:
```tsx
<div className="flex flex-col gap-4">
  {/* Row 1: Icon + Title */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 shrink-0 bg-sky-50 flex items-center justify-center rounded-xl">
      <Icon className="w-6 h-6 text-sky-600" />
    </div>
    <h3 className="text-lg font-bold text-slate-900">Card Title</h3>
  </div>
  
  {/* Row 2: Content */}
  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
    Full-width description text that wraps naturally without being restricted by icon indentation.
  </p>
</div>
```

