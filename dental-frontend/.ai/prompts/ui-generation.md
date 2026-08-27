# UI Generation Prompts

## Overview
Prompts for generating UI components that match the project's design system.

---

## Prompt: Create New Section Component

### When to Use
Creating a new content section for a CMS-driven page.

### Prompt Template

```
Create a new [SECTION_TYPE] section component for the [PAGE_NAME] page.

Requirements:
1. Follow the existing AboutUsContent.tsx and CustomerContent.tsx patterns
2. Use Framer Motion animations (fadeInUp, staggerContainer, scaleIn)
3. Apply the Blue Sky theme (sky-500 primary, slate-900 text)
4. Support CMS data structure with badge, title, description, items
5. Include hover interactions and responsive design
6. Use Lucide icons with iconMap pattern

Content structure:
{
  "badge": "Section Badge",
  "title": "Section Title",
  "description": "Section description",
  "items": [
    {
      "icon": "IconName",
      "title": "Item Title",
      "description": "Item description"
    }
  ]
}

Reference files:
- dental-frontend/src/app/customers/CustomerContent.tsx
- dental-frontend/src/app/about-us/AboutUsContent.tsx
- dental-frontend/.ai/context/design-system.md
```

---

## Prompt: Create Feature Card Grid

### When to Use
Building a grid of feature cards with icons.

### Prompt Template

```
Create a feature card grid component with:
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Card hover animations (lift up, shadow increase)
- Icon container with gradient background
- Title, description, optional link

Follow this pattern:

<motion.div 
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    variants={staggerContainer}
>
    {items.map((item, index) => (
        <motion.div
            key={index}
            variants={scaleIn}
            whileHover={{ y: -12 }}
            className="group"
        >
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-slate-100 hover:border-sky-200 relative overflow-hidden">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-10 h-10 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
            </div>
        </motion.div>
    ))}
</motion.div>
```

---

## Prompt: Create Statistics Section

### When to Use
Building a statistics/metrics display section.

### Prompt Template

```
Create a statistics section with:
- Gradient background (sky-500 to sky-700)
- 4-column grid (2 on mobile)
- Animated number counters
- Icon for each stat
- White text on colored background

Data structure:
{
  "stats": [
    { "number": "15,000+", "label": "Happy Patients", "icon": "Users" },
    { "number": "98%", "label": "Satisfaction Rate", "icon": "ThumbsUp" }
  ]
}

Apply this styling pattern:
- Section: bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700
- Cards: bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30
- Text: text-white for numbers, text-sky-100 for labels
- Icons: text-white in semi-transparent container
```

---

## Prompt: Create Testimonial Cards

### When to Use
Building customer testimonials/reviews section.

### Prompt Template

```
Create a testimonial card component with:
- Quote icon decoration
- Star rating display
- Customer name, location, treatment
- Hover animation with gradient accent
- Optional "Before & After" badge

Pattern:
<motion.div
    variants={slideInLeft}
    whileHover={{ y: -8 }}
    className="group"
>
    <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-slate-100">
        {/* Quote decoration */}
        <div className="absolute top-6 right-6 opacity-10">
            <Quote className="w-16 h-16 text-sky-500" />
        </div>
        
        {/* Rating */}
        <div className="flex gap-1 mb-4">
            {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
        </div>
        
        {/* Quote text */}
        <p className="text-lg text-slate-700 italic mb-6">"{quote}"</p>
        
        {/* Customer info */}
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center">
                <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
                <h4 className="font-bold text-slate-900">{name}</h4>
                <p className="text-sm text-slate-500">{location}</p>
            </div>
        </div>
    </div>
</motion.div>
```

---

## Prompt: Create Hero Section

### When to Use
Building the top hero section of a page.

### Prompt Template

```
Create a hero section with:
- Two-column layout (content left, images right)
- Badge, title, subtitle, description
- CTA buttons (primary + secondary)
- Image grid with floating animations
- Background decorative elements

Structure:
- Left column: Badge -> Title -> Subtitle -> Description -> CTAs
- Right column: 2x2 image grid with staggered floating animations
- Background: Animated gradient blobs

Key classes:
- Section: relative px-6 py-20 md:py-32 max-w-7xl mx-auto overflow-hidden
- Title: text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900
- Subtitle: text-xl md:text-2xl text-sky-600 font-medium
- Primary CTA: bg-sky-500 hover:bg-sky-600 text-white px-8 py-6 rounded-xl
- Secondary CTA: border-2 border-sky-300 text-sky-700 hover:bg-sky-50
```

---

## Prompt: Create FAQ Accordion

### When to Use
Building an FAQ section with expandable items.

### Prompt Template

```
Create an FAQ accordion component with:
- Expandable question/answer items
- Smooth height animation
- Chevron rotation on expand
- Hover state on question row

Use useState for expanded state management:

const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
}

<motion.div className="space-y-4">
    {questions.map((item, index) => (
        <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
            <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex justify-between hover:bg-sky-50/50"
            >
                <span className="font-semibold text-slate-900">{item.question}</span>
                <motion.div animate={{ rotate: expandedFaq === index ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-sky-500" />
                </motion.div>
            </button>
            <motion.div
                animate={{
                    height: expandedFaq === index ? "auto" : 0,
                    opacity: expandedFaq === index ? 1 : 0
                }}
                className="overflow-hidden"
            >
                <div className="px-6 pb-5 text-slate-600 border-t pt-4">
                    {item.answer}
                </div>
            </motion.div>
        </div>
    ))}
</motion.div>
```

---

## Prompt: Create CTA Section

### When to Use
Building a call-to-action section at the end of a page.

### Prompt Template

```
Create a CTA section with:
- Gradient background with animated blobs
- Centered content layout
- Badge, title, description
- Primary and secondary buttons
- Contact info display

Background pattern:
<div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-sky-100 to-white" />

<motion.div
    animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
    transition={{ duration: 20, repeat: Infinity }}
    className="absolute top-0 right-0 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl"
/>

Content structure:
- Badge in sky-500 pill
- Large heading: text-4xl md:text-5xl lg:text-6xl font-bold
- Description: text-xl text-slate-600
- Buttons row with gap-4
- Contact info with icons
```
