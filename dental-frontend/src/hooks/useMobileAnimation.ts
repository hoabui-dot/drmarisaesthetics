'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * useMobileAnimation
 *
 * Returns flags to simplify/disable animations on mobile devices.
 * - `isMobile`: true on screens < 768px
 * - `prefersReduced`: true if the OS has "Reduce Motion" enabled
 * - `shouldSimplify`: true if either — use this to strip expensive animations
 *
 * SSR-safe: starts with false (desktop assumption) so SSR HTML matches the
 * initial client render — avoids Next.js hydration mismatch.
 * useEffect then reads the real viewport and updates once after hydration.
 *
 * For above-fold LCP content (e.g. VideoHero h1) do NOT use this hook at all —
 * render those elements as plain HTML with no initial opacity:0.
 *
 * Usage:
 *   const { shouldSimplify } = useMobileAnimation()
 *   <MotionDiv ...> — on mobile switches to plain <div> after hydration
 */
export function useMobileAnimation() {
  const prefersReduced = useReducedMotion()
  // Must start false — SSR renders false, client first render matches → no hydration mismatch.
  // useEffect fires after hydration to set the real value.
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return {
    isMobile,
    prefersReduced: !!prefersReduced,
    shouldSimplify: isMobile || !!prefersReduced,
  }
}
