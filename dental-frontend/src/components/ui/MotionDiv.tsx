'use client'

import React, { forwardRef } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { useMobileAnimation } from '@/src/hooks/useMobileAnimation'

type MotionDivProps = Omit<MotionProps, "ref"> & {
  className?: string
  style?: React.CSSProperties
  id?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>
  role?: React.AriaRole | string
  children?: React.ReactNode
}

/**
 * MotionDiv — drop-in replacement for <motion.div> with mobile-first optimization.
 *
 * On mobile (< 768px) or prefers-reduced-motion:
 *   → Renders a plain <div> — content is IMMEDIATELY visible, zero JS animation cost.
 *
 * On desktop:
 *   → Renders a <motion.div> with GPU-hinted `willChange: transform` for all
 *     transform/opacity animations to stay on the compositor thread (no layout/paint).
 *
 * Per the performance guide:
 *   - willChange: 'transform' pre-allocates a compositor layer for smooth 60fps
 *   - Only opacity/transform animations stay off the main thread
 *   - initial={false} can be added by callers for above-fold content
 *
 * Usage: drop-in replacement for <motion.div> on any scroll-reveal element.
 */
export const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(({
  children,
  className,
  style,
  id,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  role,
  // motion-only props (ignored on mobile)
  initial,
  animate,
  whileInView,
  whileHover,
  whileTap,
  exit,
  variants,
  transition,
  viewport,
  ...rest
}, ref) => {
  const { shouldSimplify } = useMobileAnimation()

  if (shouldSimplify) {
    // Plain div — content visible immediately, zero JS animation cost
    return (
      <div
        ref={ref}
        className={className}
        style={style}
        id={id}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        role={role}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      // Merge caller style with willChange hint for GPU compositor layer.
      // This ensures transform/opacity animations never trigger layout/paint.
      style={{ willChange: 'transform', ...style }}
      id={id}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      role={role}
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      whileHover={whileHover}
      whileTap={whileTap}
      exit={exit}
      variants={variants}
      transition={transition}
      viewport={viewport}
      {...rest}
    >
      {children}
    </motion.div>
  )
})

MotionDiv.displayName = "MotionDiv"
