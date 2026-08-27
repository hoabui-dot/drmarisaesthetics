# Component Templates

## 🎨 Ready-to-Use Component Templates

This file contains production-ready component templates that follow all project patterns and best practices.

---

## Template 1: Hero Section with Image

### Use Case
Large hero section with heading, subheading, CTA, and image.

### Code

```typescript
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
    width: number;
    height: number;
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
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {heading}
            </h1>
            {subheading && (
              <p className="text-xl text-foreground-secondary leading-relaxed">
                {subheading}
              </p>
            )}
            {ctaLabel && ctaLink && (
              <div>
                <Button asChild size="lg">
                  <a href={ctaLink}>{ctaLabel}</a>
                </Button>
              </div>
            )}
          </div>

          {/* Image */}
          {image && (
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={image.url}
                alt={image.alt}
                width={image.width}
                height={image.height}
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

---

## Template 2: Feature Grid with Icons

### Use Case
Grid of features with icons, titles, and descriptions.

### Code

```typescript
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

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
  const getIcon = (iconName?: string): LucideIcon => {
    if (!iconName) return Icons.Star;
    return (Icons as any)[iconName] || Icons.Star;
  };

  return (
    <section className="py-16 md:py-24 bg-background-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-foreground-secondary">
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = getIcon(feature.icon);
            return (
              <div
                key={feature.id}
                className="bg-background p-6 rounded-xl border border-border hover:border-primary-600 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-600/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground-secondary">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

---

## Template 3: CTA Banner

### Use Case
Full-width call-to-action banner with gradient background.

### Code

```typescript
import { Button } from '@/src/components/ui/button';

interface CTABannerProps {
  title: string;
  description?: string;
  primaryLabel: string;
  primaryLink: string;
  secondaryLabel?: string;
  secondaryLink?: string;
}

export function CTABanner({
  title,
  description,
  primaryLabel,
  primaryLink,
  secondaryLabel,
  secondaryLink,
}: CTABannerProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <a href={primaryLink}>{primaryLabel}</a>
          </Button>
          {secondaryLabel && secondaryLink && (
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
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

## Template 4: Testimonial Cards

### Use Case
Grid of customer testimonials with ratings.

### Code

```typescript
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role?: string;
  content: string;
  rating: number;
  avatar?: {
    url: string;
    alt: string;
  };
}

interface TestimonialGridProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

export function TestimonialGrid({ title, subtitle, testimonials }: TestimonialGridProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-foreground-secondary">
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-background-secondary p-6 rounded-xl border border-border"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground-secondary mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {testimonial.avatar && (
                  <div className="w-12 h-12 rounded-full bg-primary-600/10 flex items-center justify-center text-primary-600 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold">
                    {testimonial.name}
                  </div>
                  {testimonial.role && (
                    <div className="text-sm text-foreground-secondary">
                      {testimonial.role}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Template 5: Stats Section

### Use Case
Display key statistics or metrics.

### Code

```typescript
interface Stat {
  id: number;
  number: string;
  label: string;
  suffix?: string;
}

interface StatsProps {
  title?: string;
  stats: Stat[];
}

export function StatsSection({ title, stats }: StatsProps) {
  return (
    <section className="py-16 md:py-24 bg-primary-600 text-white">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.number}
                {stat.suffix && (
                  <span className="text-3xl">{stat.suffix}</span>
                )}
              </div>
              <div className="text-lg opacity-90">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Template 6: FAQ Accordion

### Use Case
Frequently asked questions with accordion.

### Code

```typescript
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  subtitle?: string;
  faqs: FAQ[];
}

export function FAQSection({ title, subtitle, faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-foreground-secondary">
              {subtitle}
            </p>
          )}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-background-secondary transition-colors"
              >
                <span className="font-semibold pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-foreground-secondary transition-transform ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openId === faq.id && (
                <div className="px-6 py-4 bg-background-secondary border-t border-border">
                  <p className="text-foreground-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Template 7: Pricing Table

### Use Case
Pricing plans with features and CTAs.

### Code

```typescript
import { Check, X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface PricingFeature {
  id: number;
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: PricingFeature[];
  isPopular: boolean;
  ctaLabel?: string;
  ctaLink?: string;
}

interface PricingSectionProps {
  title: string;
  subtitle?: string;
  plans: PricingPlan[];
}

export function PricingSection({ title, subtitle, plans }: PricingSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-background-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-foreground-secondary">
              {subtitle}
            </p>
          )}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-background rounded-2xl p-8 border-2 ${
                plan.isPopular
                  ? 'border-primary-600 shadow-xl scale-105'
                  : 'border-border'
              } relative`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  {plan.name}
                </h3>
                {plan.description && (
                  <p className="text-foreground-secondary text-sm">
                    {plan.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold">
                  {plan.price}
                </div>
                {plan.period && (
                  <div className="text-foreground-secondary">
                    {plan.period}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.id} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? '' : 'text-foreground-secondary'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                variant={plan.isPopular ? 'default' : 'outline'}
                className="w-full"
                size="lg"
              >
                <a href={plan.ctaLink || '#'}>
                  {plan.ctaLabel || 'Get Started'}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Template 8: Team Grid

### Use Case
Display team members with photos and info.

### Code

```typescript
import Image from 'next/image';
import { Linkedin, Twitter, Mail } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  image?: {
    url: string;
    alt: string;
  };
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

interface TeamGridProps {
  title: string;
  subtitle?: string;
  members: TeamMember[];
}

export function TeamGrid({ title, subtitle, members }: TeamGridProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-foreground-secondary">
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-background-secondary rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              {member.image && (
                <div className="relative aspect-square">
                  <Image
                    src={member.image.url}
                    alt={member.image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">
                  {member.name}
                </h3>
                <div className="text-primary-600 font-medium mb-3">
                  {member.role}
                </div>
                {member.bio && (
                  <p className="text-foreground-secondary text-sm mb-4">
                    {member.bio}
                  </p>
                )}

                {/* Social Links */}
                {member.social && (
                  <div className="flex gap-3">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-secondary hover:text-primary-600 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-secondary hover:text-primary-600 transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.email && (
                      <a
                        href={`mailto:${member.social.email}`}
                        className="text-foreground-secondary hover:text-primary-600 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 🎯 Usage Notes

### Customization

All templates are fully customizable:
- Adjust colors using Tailwind classes
- Modify spacing and sizing
- Add/remove features
- Change layouts

### Integration

To use a template:
1. Copy the code
2. Adjust props interface
3. Add to your project
4. Import and use

### Best Practices

- Always use TypeScript
- Follow responsive design
- Add accessibility attributes
- Optimize images
- Handle edge cases

---

**These templates provide a solid foundation for rapid UI development while maintaining code quality and consistency.**
