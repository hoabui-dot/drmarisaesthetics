'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for scroll-triggered animations
 * 
 * Detects when an element enters the viewport and triggers animation
 * 
 * @param threshold - Percentage of element visibility to trigger (0-1)
 * @param triggerOnce - Whether to trigger animation only once
 * @returns ref to attach to element and isVisible state
 */
export function useScrollAnimation(threshold = 0.1, triggerOnce = true) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '50px',
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold, triggerOnce])

  return { ref, isVisible }
}
