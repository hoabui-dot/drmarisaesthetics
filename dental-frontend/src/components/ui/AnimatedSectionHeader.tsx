'use client'

/**
 * AnimatedSectionHeader — Animated wrapper around SectionHeader primitives.
 *
 * Props:
 *   badge          — optional pill badge above the title
 *   title          — heading text (string) or JSX (ReactNode) for multi-line heroes
 *   subtitle       — optional description paragraph
 *   align          — 'center' (default) | 'left' | 'right'
 *   titleSize      — 'default' (48px, lg:text-5xl) | 'large' (60px, lg:text-6xl)
 *   titleAs        — heading tag: 'h1' | 'h2' (default) | 'h3'
 *   className      — outer motion.div className
 *   titleClassName — merged onto SectionTitle
 *   subtitleClassName — merged onto SectionSubtitle
 *   children       — extra JSX rendered after subtitle (e.g. CTA buttons)
 *   margin         — whileInView margin (default '-100px')
 *   duration       — animation duration in seconds (default 0.6)
 */

import { ReactNode } from 'react'
import { cn } from '@/src/lib/utils'
import { SectionTitle, SectionSubtitle } from './SectionHeader'
import { DecorativeBadge } from './DecorativeBadge'
import { PerformanceAnimation } from './PerformanceAnimation'
import type { TitleSize } from './SectionHeader'

type Align = 'center' | 'left' | 'right'

const alignClass: Record<Align, string> = {
  center: 'text-center items-center',
  left: 'text-left  items-start',
  right: 'text-right items-end',
}

interface AnimatedSectionHeaderProps {
  badge?: string
  title: string | ReactNode
  subtitle?: string
  align?: Align
  titleSize?: TitleSize
  titleAs?: 'h1' | 'h2' | 'h3'
  className?: string
  children?: ReactNode
  titleClassName?: string
  subtitleClassName?: string
  margin?: string
  duration?: number
  fullWidthSubtitle?: boolean
}

export function AnimatedSectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  titleSize = 'default',
  titleAs = 'h2',
  className,
  children,
  titleClassName,
  subtitleClassName,
  margin = '-100px',
  duration = 0.6,
  fullWidthSubtitle = true,
}: AnimatedSectionHeaderProps) {
  return (
    <PerformanceAnimation
      preset="slide-up-subtle"
      whileInView={true}
      className={cn(
        'flex flex-col',
        alignClass[align],
        className,
      )}
    >
      {badge && <DecorativeBadge text={badge} variant="primary" align={align === 'left' ? 'responsive' : align === 'right' ? 'left' : 'center'} className="mb-4" />}

      <SectionTitle
        size={titleSize}
        as={titleAs}
        className={cn(
          !subtitle && !children && !titleClassName?.includes('mb-') && 'mb-0 sm:mb-0',
          titleClassName
        )}
      >
        {title}
      </SectionTitle>

      {subtitle && (
        <SectionSubtitle className={cn(!fullWidthSubtitle && align !== 'center' && 'max-w-2xl', subtitleClassName)}>
          {subtitle}
        </SectionSubtitle>
      )}

      {children}
    </PerformanceAnimation>
  )
}
