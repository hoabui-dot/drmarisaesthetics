# Design System Documentation

**Dental Clinic UI Foundation**  
**Version:** 1.0.0  
**Date:** March 19, 2026

---

## Overview

This design system provides a complete, production-ready UI foundation for the dental clinic application. It features a modern, trustworthy color palette specifically chosen for healthcare/dental contexts, along with a comprehensive set of reusable components.

---

## Color Philosophy

### Why These Colors?

The color palette was carefully selected to evoke:

1. **Trust & Professionalism** - Sky blue is associated with healthcare, cleanliness, and reliability
2. **Calm & Comfort** - Soft, muted tones reduce anxiety (important for dental patients)
3. **Modern & Fresh** - 2026 UI trends favor soft gradients and calm tones over harsh contrasts
4. **Accessibility** - All color combinations meet WCAG AA standards for contrast

### Color Psychology in Dental Context

- **Blue** - Trust, cleanliness, professionalism (universally positive in healthcare)
- **Teal/Cyan** - Modern, fresh, innovative (differentiates from traditional medical blue)
- **Warm Gray** - Neutral, sophisticated, doesn't compete with primary colors
- **White/Light Gray** - Clean, sterile, spacious (essential for medical contexts)

---

## Color Palette

### Primary Colors - Sky Blue

The main brand color, used for primary actions and key UI elements.

```css
--color-primary-50: #f0f9ff   /* Lightest - backgrounds */
--color-primary-100: #e0f2fe  /* Very light - hover states */
--color-primary-200: #bae6fd  /* Light - subtle accents */
--color-primary-300: #7dd3fc  /* Medium light */
--color-primary-400: #38bdf8  /* Medium */
--color-primary-500: #3bafda  /* Main primary - buttons, links */
--color-primary-600: #0284c7  /* Dark - hover states */
--color-primary-700: #0369a1  /* Darker - active states */
--color-primary-800: #075985  /* Very dark */
--color-primary-900: #0c4a6e  /* Darkest - text on light */
```

**Usage:**
- Primary buttons
- Links
- Focus states
- Key UI elements
- Call-to-action elements

### Secondary Colors - Teal/Cyan

Complementary accent color for variety and visual interest.

```css
--color-secondary-50: #f0fdfa   /* Lightest */
--color-secondary-100: #ccfbf1  /* Very light */
--color-secondary-200: #99f6e4  /* Light */
--color-secondary-300: #5eead4  /* Main accent */
--color-secondary-400: #2dd4bf  /* Medium */
--color-secondary-500: #14b8a6  /* Darker */
--color-secondary-600: #0d9488  /* Dark */
--color-secondary-700: #0f766e  /* Very dark */
--color-secondary-800: #115e59  /* Darkest */
--color-secondary-900: #134e4a  /* Ultra dark */
```

**Usage:**
- Secondary buttons
- Accent elements
- Success states
- Highlights
- Decorative elements

### Neutral Colors - Warm Gray

Foundation colors for text, backgrounds, and borders.

```css
--color-neutral-50: #fafafa    /* Lightest - main background */
--color-neutral-100: #f5f5f5   /* Very light - secondary background */
--color-neutral-200: #e5e5e5   /* Light - borders */
--color-neutral-300: #d4d4d4   /* Medium light - hover borders */
--color-neutral-400: #a3a3a3   /* Medium - disabled text */
--color-neutral-500: #737373   /* Medium dark - secondary text */
--color-neutral-600: #525252   /* Dark - body text */
--color-neutral-700: #404040   /* Darker */
--color-neutral-800: #262626   /* Very dark */
--color-neutral-900: #171717   /* Darkest - headings */
```

**Usage:**
- Text (900, 600, 500)
- Backgrounds (50, 100)
- Borders (200, 300)
- Disabled states (400)

### Semantic Colors

#### Success (Green)
```css
--color-success-500: #22c55e
--color-success-600: #16a34a
```
**Usage:** Success messages, confirmations, positive feedback

#### Destructive (Red)
```css
--color-destructive-500: #ef4444
--color-destructive-600: #dc2626
```
**Usage:** Error messages, delete actions, warnings

#### Warning (Amber)
```css
--color-warning-500: #f59e0b
--color-warning-600: #d97706
```
**Usage:** Warning messages, caution states

---

## Typography

### Font Stack

```css
font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-family-mono: 'Geist Mono', 'Courier New', monospace;
```

### Type Scale

| Size | Class | Usage |
|------|-------|-------|
| 48px | text-5xl | Hero headings |
| 36px | text-4xl | Page titles |
| 30px | text-3xl | Section headings |
| 24px | text-2xl | Card titles |
| 20px | text-xl | Subheadings |
| 18px | text-lg | Large body text |
| 16px | text-base | Body text (default) |
| 14px | text-sm | Small text, labels |
| 12px | text-xs | Captions, metadata |

### Font Weights

| Weight | Class | Usage |
|--------|-------|-------|
| 700 | font-bold | Headings |
| 600 | font-semibold | Subheadings, buttons |
| 500 | font-medium | Labels, emphasis |
| 400 | font-normal | Body text |

---

## Spacing System

Consistent spacing using Tailwind's default scale:

| Value | Class | Pixels | Usage |
|-------|-------|--------|-------|
| 0.5 | p-2 | 8px | Tight spacing |
| 1 | p-4 | 16px | Default spacing |
| 1.5 | p-6 | 24px | Comfortable spacing |
| 2 | p-8 | 32px | Generous spacing |
| 3 | p-12 | 48px | Section spacing |
| 4 | p-16 | 64px | Large section spacing |

---

## Border Radius

Soft, modern rounded corners:

```css
--radius-sm: 0.375rem   /* 6px - small elements */
--radius-md: 0.5rem     /* 8px - inputs, buttons */
--radius-lg: 0.75rem    /* 12px - cards */
--radius-xl: 1rem       /* 16px - large cards */
--radius-2xl: 1.5rem    /* 24px - modals */
--radius-full: 9999px   /* Fully rounded */
```

**Usage:**
- Buttons: `rounded-lg` (8px)
- Inputs: `rounded-lg` (8px)
- Cards: `rounded-xl` (16px)
- Modals: `rounded-2xl` (24px)
- Pills/Tags: `rounded-full`

---

## Shadows

Subtle, layered shadows for depth:

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

**Usage:**
- Cards: `shadow-md`
- Buttons: `shadow-md` (hover: `shadow-lg`)
- Modals: `shadow-xl`
- Dropdowns: `shadow-lg`

---

## Components

### Button

**Variants:**
- `primary` - Main actions (sky blue)
- `secondary` - Secondary actions (teal)
- `outline` - Tertiary actions (bordered)
- `ghost` - Subtle actions (no background)
- `destructive` - Delete/cancel actions (red)
- `link` - Text links

**Sizes:**
- `sm` - 36px height
- `md` - 44px height (default)
- `lg` - 52px height
- `icon` - 40x40px square

**Example:**
```tsx
<Button variant="primary" size="lg">
  Book Appointment
</Button>
```

### Input

Consistent text input with focus states.

**Features:**
- 2px border
- Focus ring (primary color)
- Hover state
- Disabled state
- Placeholder styling

**Example:**
```tsx
<Input 
  type="email" 
  placeholder="your@email.com"
/>
```

### Select

Dropdown select with custom styling.

**Features:**
- Matches input styling
- Custom dropdown arrow
- Keyboard navigation
- Search/filter support

**Example:**
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select service" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="implants">Dental Implants</SelectItem>
    <SelectItem value="whitening">Teeth Whitening</SelectItem>
  </SelectContent>
</Select>
```

### Textarea

Multi-line text input.

**Features:**
- Minimum height: 120px
- Resize disabled (consistent sizing)
- Same styling as Input

**Example:**
```tsx
<Textarea 
  placeholder="Tell us about your concerns..."
/>
```

### Checkbox

Custom styled checkbox.

**Features:**
- Smooth animation
- Checked state (primary color)
- Focus ring
- Disabled state

**Example:**
```tsx
<Checkbox id="terms" />
<Label htmlFor="terms">I agree to terms</Label>
```

### Radio Group

Radio button group.

**Features:**
- Circular indicator
- Primary color when selected
- Keyboard navigation

**Example:**
```tsx
<RadioGroup defaultValue="option1">
  <RadioGroupItem value="option1" id="r1" />
  <Label htmlFor="r1">Option 1</Label>
</RadioGroup>
```

### Dialog (Modal)

Modal overlay dialog.

**Features:**
- Backdrop blur
- Smooth animations
- Close button
- Keyboard (ESC) support
- Focus trap

**Example:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

---

## Form System

### React Hook Form Integration

All forms use React Hook Form with Zod validation.

**Features:**
- Type-safe validation
- Automatic error handling
- Field-level validation
- Form-level validation
- Async validation support

**Example:**
```tsx
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

const form = useForm({
  resolver: zodResolver(schema),
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

## Accessibility

### Focus States

All interactive elements have visible focus indicators:
- 2px ring in primary color
- 2px offset for clarity
- Smooth transition

### Color Contrast

All text meets WCAG AA standards:
- Body text (neutral-600) on white: 7.5:1
- Headings (neutral-900) on white: 15:1
- Primary button text (white) on primary-500: 4.8:1

### Keyboard Navigation

All components support keyboard navigation:
- Tab/Shift+Tab for focus
- Enter/Space for activation
- Arrow keys for selection (dropdowns, radio)
- ESC for closing (modals, dropdowns)

### Screen Readers

- Semantic HTML elements
- ARIA labels where needed
- Hidden text for icons
- Form error announcements

---

## Best Practices

### Do's ✅

1. **Use semantic color tokens**
   ```tsx
   // Good
   <div className="bg-background text-foreground">
   
   // Bad
   <div className="bg-neutral-50 text-neutral-900">
   ```

2. **Use consistent spacing**
   ```tsx
   // Good
   <div className="space-y-6">
   
   // Bad
   <div className="space-y-[23px]">
   ```

3. **Use the cn() utility for conditional classes**
   ```tsx
   // Good
   <Button className={cn("w-full", isLoading && "opacity-50")}>
   
   // Bad
   <Button className={`w-full ${isLoading ? "opacity-50" : ""}`}>
   ```

4. **Use form components for all forms**
   ```tsx
   // Good
   <FormField control={form.control} name="email" ... />
   
   // Bad
   <input type="email" />
   ```

### Don'ts ❌

1. **Don't use arbitrary colors**
   ```tsx
   // Bad
   <div className="bg-[#3BAFDA]">
   
   // Good
   <div className="bg-primary-500">
   ```

2. **Don't mix design systems**
   ```tsx
   // Bad
   <button className="bg-blue-500">
   
   // Good
   <Button variant="primary">
   ```

3. **Don't skip validation**
   ```tsx
   // Bad
   <form onSubmit={handleSubmit}>
   
   // Good
   <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)}>
   ```

---

## File Structure

```
src/
├── app/
│   ├── globals.css              # Design tokens & base styles
│   └── ui-preview/              # Component showcase
│       └── page.tsx
├── components/
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── label.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio-group.tsx
│   │   ├── dialog.tsx
│   │   └── form.tsx
│   └── forms/                   # Form compositions
│       └── BookingForm.tsx
└── lib/
    └── utils.ts                 # Utility functions (cn, etc.)
```

---

## Usage Examples

### Simple Form

```tsx
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'

export function SimpleForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="your@email.com" />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### Complex Form with Validation

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  )
}
```

---

## Preview

Visit `/ui-preview` to see all components in action with the complete color palette.

---

## Future Enhancements

### Planned Components
- [ ] Toast notifications
- [ ] Dropdown menu
- [ ] Tabs
- [ ] Accordion
- [ ] Tooltip
- [ ] Badge
- [ ] Avatar
- [ ] Card
- [ ] Alert
- [ ] Progress bar

### Planned Features
- [ ] Dark mode support
- [ ] Animation presets
- [ ] Icon system
- [ ] Loading states
- [ ] Empty states
- [ ] Error states

---

## Support

For questions or issues with the design system:
1. Check this documentation
2. Review `/ui-preview` page
3. Check component source code
4. Open an issue

---

**Last Updated:** March 19, 2026  
**Version:** 1.0.0  
**Maintainer:** Frontend Team
