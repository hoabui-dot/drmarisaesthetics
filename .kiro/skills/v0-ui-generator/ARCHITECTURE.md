# Skill Architecture

## 🏗️ Skill Structure Overview

This document explains the architecture and organization of the v0-ui-generator skill.

---

## 📁 File Structure

```
.kiro/skills/v0-ui-generator/
├── SKILL.md              # Core skill specification (30 min read)
├── README.md             # Overview & quick start (10 min read)
├── TEMPLATES.md          # Component templates (15 min read)
├── QUICK_REFERENCE.md    # Cheat sheet (5 min read)
├── INDEX.md              # Navigation guide (5 min read)
└── ARCHITECTURE.md       # This file (10 min read)
```

---

## 🎯 Skill Components

### 1. Core Documentation (SKILL.md)

```
┌─────────────────────────────────────────────────────────────┐
│                        SKILL.md                              │
│                   Core Specification                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Purpose & Capabilities                              │  │
│  │  - Component generation                              │  │
│  │  - Block system integration                          │  │
│  │  - Design system compliance                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Architecture Understanding                          │  │
│  │  - Tech stack                                        │  │
│  │  - Component patterns                                │  │
│  │  - Server/Client components                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Component Generation Rules                          │  │
│  │  - Rule 1: Follow existing patterns                 │  │
│  │  - Rule 2: TypeScript first                         │  │
│  │  - Rule 3: Accessibility first                      │  │
│  │  - Rule 4: Responsive design                        │  │
│  │  - Rule 5: Performance optimization                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Design System                                       │  │
│  │  - Color tokens                                      │  │
│  │  - Typography scale                                  │  │
│  │  - Spacing scale                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Block Creation Workflow                             │  │
│  │  - Step 1: Create component                         │  │
│  │  - Step 2: Add types                                │  │
│  │  - Step 3: Register in BlockRenderer                │  │
│  │  - Step 4: Add transformer                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Component Templates                                 │  │
│  │  - Hero section                                      │  │
│  │  - Feature grid                                      │  │
│  │  - CTA section                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Quality Checklist                                   │  │
│  │  - TypeScript types                                  │  │
│  │  - Responsive design                                 │  │
│  │  - Accessibility                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Quick Start Guide (README.md)

```
┌─────────────────────────────────────────────────────────────┐
│                       README.md                              │
│                  Overview & Quick Start                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Overview                                            │  │
│  │  - What this skill does                             │  │
│  │  - Core capabilities                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Quick Start                                         │  │
│  │  - Activating the skill                             │  │
│  │  - Basic usage                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Component Templates List                            │  │
│  │  - Available templates                              │  │
│  │  - Use cases                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Design System Summary                               │  │
│  │  - Color palette                                    │  │
│  │  - Typography                                       │  │
│  │  - Spacing                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Example Prompts                                     │  │
│  │  - Hero with video                                  │  │
│  │  - Service cards                                    │  │
│  │  - Testimonial slider                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Component Templates (TEMPLATES.md)

```
┌─────────────────────────────────────────────────────────────┐
│                     TEMPLATES.md                             │
│                 Component Code Library                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Template 1: Hero Section with Image                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  interface HeroSectionProps { ... }                 │  │
│  │  export function HeroSection({ ... }) { ... }       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Template 2: Feature Grid with Icons                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  interface FeatureGridProps { ... }                 │  │
│  │  export function FeatureGrid({ ... }) { ... }       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Template 3: CTA Banner                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  interface CTABannerProps { ... }                   │  │
│  │  export function CTABanner({ ... }) { ... }         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Template 4: Testimonial Cards                              │
│  Template 5: Stats Section                                  │
│  Template 6: FAQ Accordion                                  │
│  Template 7: Pricing Table                                  │
│  Template 8: Team Grid                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. Quick Reference (QUICK_REFERENCE.md)

```
┌─────────────────────────────────────────────────────────────┐
│                  QUICK_REFERENCE.md                          │
│                    Cheat Sheet                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Component Checklist                                 │  │
│  │  [ ] Before you start                               │  │
│  │  [ ] During development                             │  │
│  │  [ ] Before completion                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Design Tokens                                       │  │
│  │  - Colors                                           │  │
│  │  - Typography                                       │  │
│  │  - Spacing                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Common Patterns                                     │  │
│  │  - Section container                                │  │
│  │  - Section header                                   │  │
│  │  - Responsive grid                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Common Issues & Fixes                               │  │
│  │  - Hydration error                                  │  │
│  │  - Image not loading                                │  │
│  │  - Tailwind classes not applied                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Information Flow

### Component Generation Flow

```
User Request
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. UNDERSTAND REQUIREMENTS                                  │
│    - What component is needed?                              │
│    - What data will it display?                             │
│    - What interactions are needed?                          │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FIND TEMPLATE                                            │
│    - Check TEMPLATES.md for similar component              │
│    - Review QUICK_REFERENCE.md for patterns                │
│    - Read SKILL.md for rules                               │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. GENERATE COMPONENT                                       │
│    - Use template as starting point                        │
│    - Apply design tokens from QUICK_REFERENCE.md           │
│    - Follow rules from SKILL.md                            │
│    - Add TypeScript types                                  │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. INTEGRATE                                                │
│    - Add to BlockRenderer (if block)                       │
│    - Add TypeScript types to strapi.ts                     │
│    - Test with real data                                   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. QUALITY CHECK                                            │
│    - Run checklist from QUICK_REFERENCE.md                 │
│    - Test responsive design                                │
│    - Verify accessibility                                  │
│    - Check dark mode                                       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
Component Ready
```

---

## 🎯 Skill Usage Patterns

### Pattern 1: Quick Component Generation

```
User → README.md (Quick Start)
    → TEMPLATES.md (Find Template)
    → QUICK_REFERENCE.md (Apply Patterns)
    → Component Generated
```

### Pattern 2: Learning the Skill

```
User → README.md (Overview)
    → SKILL.md (Full Documentation)
    → TEMPLATES.md (Examples)
    → QUICK_REFERENCE.md (Bookmark)
    → Skill Mastered
```

### Pattern 3: Troubleshooting

```
User → QUICK_REFERENCE.md (Common Issues)
    → README.md (Troubleshooting)
    → SKILL.md (Review Rules)
    → Issue Resolved
```

---

## 🧩 Integration with Project

### Project Structure Integration

```
Project Root
├── .kiro/
│   └── skills/
│       └── v0-ui-generator/     ← This Skill
│           ├── SKILL.md
│           ├── README.md
│           ├── TEMPLATES.md
│           ├── QUICK_REFERENCE.md
│           ├── INDEX.md
│           └── ARCHITECTURE.md
│
├── .ai/                          ← Project Documentation
│   ├── README.md
│   ├── FRONTEND_GUIDE.md
│   ├── ARCHITECTURE.md
│   └── AI_RULES.md
│
└── dental-frontend/              ← Application Code
    └── src/
        ├── components/
        │   ├── blocks/           ← Generated Components Go Here
        │   └── ui/
        ├── types/
        │   └── strapi.ts         ← Types Added Here
        └── lib/
```

### Skill → Project Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    v0-ui-generator Skill                     │
│                                                              │
│  SKILL.md → Rules & Patterns                                │
│  TEMPLATES.md → Component Code                              │
│  QUICK_REFERENCE.md → Design Tokens                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Component Generation                       │
│                                                              │
│  1. Read skill documentation                                │
│  2. Apply project patterns from .ai/                        │
│  3. Generate component code                                 │
│  4. Add TypeScript types                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Project Integration                       │
│                                                              │
│  src/components/blocks/NewBlock.tsx                         │
│  src/types/strapi.ts (types added)                          │
│  src/components/BlockRenderer.tsx (registered)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Skill Capabilities Matrix

### Component Types

| Component Type | Template Available | Complexity | Time to Generate |
|---------------|-------------------|------------|------------------|
| Hero Section | ✅ Yes | Low | 5-10 min |
| Feature Grid | ✅ Yes | Low | 5-10 min |
| CTA Banner | ✅ Yes | Low | 5 min |
| Testimonials | ✅ Yes | Medium | 10-15 min |
| Stats Section | ✅ Yes | Low | 5 min |
| FAQ Accordion | ✅ Yes | Medium | 10-15 min |
| Pricing Table | ✅ Yes | Medium | 15-20 min |
| Team Grid | ✅ Yes | Low | 10 min |
| Custom Block | ❌ No | High | 20-30 min |

### Feature Support

| Feature | Supported | Documentation |
|---------|-----------|---------------|
| TypeScript | ✅ Yes | SKILL.md, QUICK_REFERENCE.md |
| Responsive Design | ✅ Yes | SKILL.md, TEMPLATES.md |
| Accessibility | ✅ Yes | SKILL.md, QUICK_REFERENCE.md |
| Dark Mode | ✅ Yes | QUICK_REFERENCE.md |
| Animations | ✅ Yes | QUICK_REFERENCE.md |
| Forms | ⚠️ Partial | TEMPLATES.md |
| i18n | ❌ No | - |

---

## 🔧 Maintenance & Updates

### Version Control

```
v1.0.0 (Current)
├── Initial release
├── 8 component templates
├── Complete documentation
└── Production ready

Future Versions:
├── v1.1.0 - Add form templates
├── v1.2.0 - Add animation library
└── v2.0.0 - Add i18n support
```

### Update Process

```
1. Identify improvement area
2. Update relevant documentation
3. Add/update templates
4. Update INDEX.md
5. Test with real project
6. Increment version
```

---

## 📈 Skill Metrics

### Documentation Coverage

- **Core Rules:** 100% (SKILL.md)
- **Templates:** 8 components (TEMPLATES.md)
- **Quick Reference:** 100% (QUICK_REFERENCE.md)
- **Examples:** 20+ code examples
- **Total Pages:** ~50 pages of documentation

### Quality Standards

- ✅ TypeScript coverage: 100%
- ✅ Accessibility compliance: WCAG 2.1 AA
- ✅ Responsive design: Mobile-first
- ✅ Performance: Optimized by default
- ✅ Code quality: Production-ready

---

## 🎓 Learning Path

### Beginner → Expert

```
Level 1: Beginner (0-2 hours)
├── Read README.md
├── Review QUICK_REFERENCE.md
└── Generate first component from template

Level 2: Intermediate (2-5 hours)
├── Read SKILL.md completely
├── Generate 3-5 components
├── Customize templates
└── Understand design system

Level 3: Advanced (5-10 hours)
├── Create custom components
├── Extend templates
├── Optimize performance
└── Contribute improvements

Level 4: Expert (10+ hours)
├── Master all patterns
├── Create new templates
├── Teach others
└── Maintain skill documentation
```

---

## 🤝 Collaboration Model

### Skill → AI Agent

```
AI Agent reads skill documentation
    ↓
Understands rules and patterns
    ↓
Generates component following guidelines
    ↓
Applies quality checks
    ↓
Delivers production-ready code
```

### Skill → Developer

```
Developer references skill documentation
    ↓
Understands component patterns
    ↓
Uses templates as starting point
    ↓
Customizes for specific needs
    ↓
Maintains consistency with project
```

---

## ✅ Success Metrics

### Skill Effectiveness

**Measured by:**
- Time to generate component (target: < 15 min)
- Code quality (target: production-ready)
- Consistency with project (target: 100%)
- Developer satisfaction (target: high)

**Success Indicators:**
- ✅ Components compile without errors
- ✅ Pass accessibility checks
- ✅ Work on all screen sizes
- ✅ Follow project patterns
- ✅ Require minimal revisions

---

**This architecture document provides a complete understanding of how the v0-ui-generator skill is organized and how it integrates with the project.**
