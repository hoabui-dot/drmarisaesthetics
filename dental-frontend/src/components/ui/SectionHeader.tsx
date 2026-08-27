/**
 * SectionHeader — Shared Section Typography System
 *
 * Provides a single source of truth for all section-level:
 *   - Badge (pill label above the title)
 *   - Title (h2 heading)
 *   - Subtitle (description paragraph)
 *
 * Usage:
 *   // Full wrapper (badge + title + subtitle + children)
 *   <SectionHeader badge="Our Services" title="What We Offer" subtitle="We provide..." align="center">
 *     <SomeExtraContent />
 *   </SectionHeader>
 *
 *   // Individual primitives when custom layout is needed
 *   <SectionBadge text="Our Services" />
 *   <SectionTitle>What We Offer</SectionTitle>
 *   <SectionSubtitle>We provide...</SectionSubtitle>
 */

import { cn } from '@/src/lib/utils'
import { ReactNode } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────

type Align = 'center' | 'left' | 'right'

/** Controls the fluid scale of the section heading. */
export type TitleSize = 'default' | 'large'

const titleSizeClass: Record<TitleSize, string> = {
  /** default: max 48px (lg:text-5xl) — used for mid-page sections */
  default: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  /** large:   max 60px (lg:text-6xl) — used for hero / video-hero */
  large:   'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
}

interface SectionBadgeProps {
  text: string
  className?: string
}

interface SectionTitleProps {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  size?: TitleSize
}

interface SectionSubtitleProps {
  children: ReactNode
  className?: string
}

interface SectionHeaderProps {
  badge?: string
  title: string
  subtitle?: string
  align?: Align
  className?: string
  /** Extra content rendered after the subtitle (e.g. a CTA button) */
  children?: ReactNode
  titleClassName?: string
  subtitleClassName?: string
}

// ── Alignment helper ───────────────────────────────────────────────────────

const alignClass: Record<Align, string> = {
  center: 'text-center items-center',
  left:   'text-left  items-start',
  right:  'text-right items-end',
}

// ── Primitives ─────────────────────────────────────────────────────────────

/**
 * SectionBadge — small pill label above the section title.
 * Canonical style: uppercase, bold, tracking-widest, primary colour.
 * Mobile: Uses "Our Specialists" design with lines on sides
 */
export function SectionBadge({ text, className }: SectionBadgeProps) {
  return (
    <>
      {/* Mobile badge - "Our Specialists" design with lines */}
      <div className="sm:hidden flex items-center justify-center gap-3 mb-4">
        <span className="h-px w-8 sm:w-10" style={{ background: 'linear-gradient(90deg,transparent,var(--smilux-badge))' }} />
        <span
          className={cn(
            'text-[10px] sm:text-[11px] font-bold tracking-badge uppercase',
            'text-smilux-badge',
            className,
          )}
        >
          {text}
        </span>
        <span className="h-px w-8 sm:w-10" style={{ background: 'linear-gradient(90deg,var(--smilux-badge),transparent)' }} />
      </div>

      {/* Desktop badge - original pill design */}
      <span
        className={cn(
          'hidden sm:inline-block px-4 py-1.5 rounded-full',
          'bg-primary-50 border border-primary-200/60',
          'text-[11px] sm:text-xs font-bold uppercase tracking-badge text-smilux-badge',
          'mb-4',
          className,
        )}
      >
        {text}
      </span>
    </>
  )
}

/**
 * SectionTitle — the primary h2 for a content section.
 * Canonical style: bold, fluid scale 2xl→5xl, tight leading & tracking.
 */
export function SectionTitle({ children, className, as: Tag = 'h2', size = 'default' }: SectionTitleProps) {
  return (
    <Tag
      className={cn(
        titleSizeClass[size],
        'font-bold text-foreground',
        'leading-[1.15] tracking-tight',
        'mb-4 sm:mb-6',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/**
 * SectionSubtitle — the descriptive paragraph below the section title.
 * Canonical style: fluid scale base→xl, normal weight, relaxed leading.
 */
export function SectionSubtitle({ children, className }: SectionSubtitleProps) {
  return (
    <p
      className={cn(
        'text-lg sm:text-lg md:text-xl m-0',
        'text-foreground-secondary font-normal leading-relaxed',
        className,
      )}
    >
      {children}
    </p>
  )
}

// ── Wrapper ────────────────────────────────────────────────────────────────

/**
 * SectionHeader — convenience wrapper that composes Badge + Title + Subtitle.
 * Pass `align` to control text alignment of all children at once.
 *
 * @example
 * <SectionHeader
 *   badge="Our Services"
 *   title="Everything Your Smile Needs"
 *   subtitle="World-class treatments tailored to you."
 *   align="center"
 * />
 */
export function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
  children,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col', alignClass[align], 'mb-10 sm:mb-12 md:mb-16', className)}>
      {badge && <SectionBadge text={badge} />}

      <SectionTitle className={titleClassName}>{title}</SectionTitle>

      {subtitle && (
        <SectionSubtitle className={cn('max-w-2xl', subtitleClassName)}>
          {subtitle}
        </SectionSubtitle>
      )}

      {children}
    </div>
  )
}
