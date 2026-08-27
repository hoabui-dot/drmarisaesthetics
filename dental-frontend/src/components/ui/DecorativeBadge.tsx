/**
 * DecorativeBadge Component
 * 
 * A reusable badge component with decorative lines on both sides.
 * Used across homepage and service pages for consistent branding.
 * 
 * Features:
 * - Decorative gradient lines on both sides
 * - Responsive text sizing
 * - Customizable colors for light/dark backgrounds
 * - Centered on mobile, left-aligned on desktop (optional)
 * 
 * Usage:
 * <DecorativeBadge text="Our Services" />
 * <DecorativeBadge text="International Standard" variant="light" />
 * <DecorativeBadge text="World-Class Care" align="center" />
 */

import { cn } from '@/src/lib/utils'

interface DecorativeBadgeProps {
  /** Badge text content */
  text: string
  /** 
   * Color variant:
   * - 'dark': White text/lines for dark backgrounds (VideoHero)
   * - 'primary': Primary blue text/lines for light backgrounds (default)
   */
  variant?: 'dark' | 'primary'
  /**
   * Alignment behavior:
   * - 'responsive': Centered on mobile, left-aligned on desktop (default)
   * - 'center': Always centered
   * - 'left': Always left-aligned
   */
  align?: 'responsive' | 'center' | 'left'
  /** Additional className for the container */
  className?: string
}

export function DecorativeBadge({ 
  text, 
  variant = 'primary',
  align = 'responsive',
  className 
}: DecorativeBadgeProps) {
  // Determine alignment classes
  const alignmentClass = {
    responsive: 'justify-center md:justify-start',
    center: 'justify-center',
    left: 'justify-start',
  }[align]

  // Determine color styles based on variant
  const colorStyles = variant === 'dark' 
    ? {
        lineGradientLeft: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.6))',
        lineGradientRight: 'linear-gradient(90deg,rgba(255,255,255,0.6),transparent)',
        textColor: 'text-white',
      }
    : {
        lineGradientLeft: 'linear-gradient(90deg,transparent,var(--smilux-badge))',
        lineGradientRight: 'linear-gradient(90deg,var(--smilux-badge),transparent)',
        textColor: 'text-smilux-badge',
      }

  return (
    <div className={cn('flex items-center gap-3', alignmentClass, className)}>
      {/* Left decorative line */}
      <span 
        className="h-px w-8 sm:w-10" 
        style={{ background: colorStyles.lineGradientLeft }} 
      />
      
      {/* Badge text */}
      <span 
        className={cn(
          'text-[10px] sm:text-[11px] md:text-xs font-bold tracking-badge uppercase',
          colorStyles.textColor
        )}
      >
        {text}
      </span>
      
      {/* Right decorative line */}
      <span 
        className="h-px w-8 sm:w-10" 
        style={{ background: colorStyles.lineGradientRight }} 
      />
    </div>
  )
}
