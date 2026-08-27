'use client';

import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { useMobileAnimation } from '@/src/hooks/useMobileAnimation';

/**
 * PerformanceAnimation Component
 * 
 * A high-performance, CSS-only alternative to Framer Motion for common animations.
 * 
 * DESIGN RATIONALE:
 * Framer Motion is powerful but can be heavy for simple entrance animations on 
 * low-end devices due to its JS-driven animation loop. This component uses
 * pure CSS Keyframes which run on the browser's compositor thread, ensuring
 * 60fps even when the main thread is busy with hydration or logic.
 * 
 * FEATURES:
 * - Zero dependency (uses native CSS)
 * - GPU-accelerated (only touches opacity/transform)
 * - Automatic mobile simplification via useMobileAnimation
 * - Instant feedback on low-resource machines
 * - Optional IntersectionObserver support for scroll-reveal
 */

export type AnimationPreset = 
  | 'fade-in'         // Simple opacity: 0 -> 1
  | 'scale-in'        // Opacity + Scale: 0.9 -> 1
  | 'slide-up'        // Opacity + TranslateY: 100% -> 0
  | 'slide-up-subtle' // Opacity + TranslateY: 20px -> 0
  | 'slide-left'      // Opacity + TranslateX: 20px -> 0
  | 'slide-right'     // Opacity + TranslateX: -20px -> 0
  | 'menu-open'       // Optimized mobile nav drawer entrance
  | 'float-slow'      // Infinite floating animation (slow)
  | 'float-slower'    // Infinite floating animation (slower)
  | 'slide-x'         // Infinite horizontal slide animation
  | 'none';           // No animation (immediate visibility)

interface PerformanceAnimationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** The preset animation key defined in globals.css or the internal map */
  preset: AnimationPreset;
  /** Duration in seconds (e.g., 0.3) */
  duration?: number;
  /** Delay in seconds (e.g., 0.1) */
  delay?: number;
  /** Timing function (e.g., 'ease-out', 'cubic-bezier(...)') */
  easing?: string;
  /** Tailwind classes */
  className?: string;
  /** Inner content, supports render prop for inView status */
  children: ReactNode | ((props: { inView: boolean }) => ReactNode);
  /** If true, skips animation entirely for performance */
  disabled?: boolean;
  /** The HTML element to render as (default: 'div') */
  as?: any;
  /** If true, triggers animation only when element enters viewport */
  whileInView?: boolean;
}

/**
 * PerformanceAnimation
 * 
 * Usage:
 * <PerformanceAnimation preset="scale-in" delay={0.2}>
 *   <div>Animated content</div>
 * </PerformanceAnimation>
 */
export const PerformanceAnimation = ({
  preset,
  duration = 0.3,
  delay = 0,
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
  className = '',
  children,
  disabled = false,
  as: Component = 'div',
  whileInView = false,
  ...props
}: PerformanceAnimationProps) => {
  const { shouldSimplify } = useMobileAnimation();
  const [hasEntered, setHasEntered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  // If whileInView is true, observe the element
  useEffect(() => {
    if (!whileInView) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [whileInView]);

  // If disabled or we're on a low-resource device and the preset isn't critical
  const isSimplified = disabled || shouldSimplify;

  if (preset === 'none') {
    return <Component className={className}>{children}</Component>;
  }

  // Map presets to their keyframes defined in globals.css
  const keyframesMap: Record<AnimationPreset, string> = {
    'fade-in': 'kf-fade-in',
    'scale-in': 'kf-scale-in',
    'slide-up': 'kf-slide-up',
    'slide-up-subtle': 'kf-slide-up-subtle',
    'slide-left': 'kf-slide-left',
    'slide-right': 'kf-slide-right',
    'menu-open': 'kf-menu-open',
    'float-slow': 'kf-float-slow',
    'float-slower': 'kf-float-slower',
    'slide-x': 'kf-slide-x',
    'none': '',
  };

  const animationName = keyframesMap[preset];

  // Check if this is an infinite animation
  const isInfiniteAnimation = ['float-slow', 'float-slower', 'slide-x'].includes(preset);

  // Inline style for dynamic values (duration, delay)
  const animationStyle: React.CSSProperties = {
    // For infinite animations, always apply the animation name (don't wait for hasEntered)
    // For regular animations, wait for hasEntered
    animationName: (isInfiniteAnimation || (hasEntered && (!isSimplified || delay !== 0))) ? animationName : 'none',
    animationDuration: isSimplified ? '0s' : isInfiniteAnimation ? (preset === 'float-slow' ? '2.5s' : preset === 'float-slower' ? '3s' : '1.2s') : `${duration}s`,
    animationDelay: isSimplified ? '0s' : `${delay}s`,
    animationTimingFunction: easing,
    animationFillMode: isInfiniteAnimation ? 'none' : 'both',
    animationIterationCount: isInfiniteAnimation ? 'infinite' : 1,
    // Only set willChange during animation, not permanently (performance optimization)
    willChange: (hasEntered || isInfiniteAnimation) && !isSimplified ? 'transform, opacity' : 'auto',
    // For infinite animations, always visible (no opacity fade-in)
    // For regular animations, hidden until hasEntered
    opacity: (hasEntered || isInfiniteAnimation) ? undefined : 0,
  };

  return (
    <Component 
      ref={elementRef} 
      className={className} 
      style={animationStyle}
      {...props}
    >
      {typeof children === 'function' ? children({ inView: hasEntered }) : children}
    </Component>
  );
};
