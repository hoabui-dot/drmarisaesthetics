'use client'

import { useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animate, onScroll, stagger } from 'animejs'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function useOurTeamMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const scope = root.current
    if (!scope) return

    const hero = scope.querySelector<HTMLElement>('[data-team-hero]')
    if (!hero) return

    const divider = hero.querySelector<HTMLElement>('[data-team-hero-divider]')
    const eyebrow = hero.querySelector<HTMLElement>('[data-team-hero-eyebrow]')
    const titleLines = hero.querySelectorAll<HTMLElement>('[data-team-hero-title-line]')
    const copy = hero.querySelectorAll<HTMLElement>('[data-team-hero-copy]')
    const actions = hero.querySelectorAll<HTMLElement>('[data-team-hero-actions] a, [data-team-hero-actions] button')
    const image = hero.querySelector<HTMLElement>('[data-team-hero-image]')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    if (divider) intro.from(divider, { scaleX: 0, transformOrigin: 'left center', duration: 0.3 }, 0)
    if (eyebrow) intro.from(eyebrow, { autoAlpha: 0, y: 10, duration: 0.4 }, 0.12)
    if (titleLines.length) intro.from(titleLines, { autoAlpha: 0, yPercent: 100, duration: 0.65, stagger: 0.08 }, 0.38)
    if (copy.length) intro.from(copy, { autoAlpha: 0, y: 20, duration: 0.42, stagger: 0.1 }, 0.92)
    if (actions.length) intro.from(actions, { autoAlpha: 0, y: 14, duration: 0.35, stagger: 0.08 }, 1.2)
    if (image) intro.from(image, { autoAlpha: 0, clipPath: 'inset(0 0 0 100%)', scale: 1.06, duration: 0.9, ease: 'power3.inOut' }, 0.35)

    if (image) {
      gsap.to(image.querySelector('img'), {
        y: 36,
        scale: 1.035,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.9 },
      })
    }
  }, { scope: root })

  useEffect(() => {
    const scope = root.current
    const section = scope?.querySelector<HTMLElement>('[data-team-revision]')
    if (!section) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = Array.from(section.querySelectorAll<HTMLElement>('[data-revision-reveal]'))
    const media = section.querySelector<HTMLElement>('[data-revision-media]')

    if (reduceMotion) {
      elements.forEach((element) => {
        element.style.opacity = '1'
        element.style.transform = 'none'
      })
      return
    }

    elements.forEach((element) => {
      element.style.opacity = '0'
      element.style.transform = 'translateY(18px)'
    })
    if (media) {
      media.style.opacity = '0'
      media.style.transform = 'scale(1.035)'
    }

    let hasEntered = false
    let revealAnimation: ReturnType<typeof animate> | undefined
    let mediaAnimation: ReturnType<typeof animate> | undefined

    const reveal = () => {
      if (hasEntered) return
      hasEntered = true

      // Anime.js owns the motion; the initial state is only applied above so
      // the section remains deterministic before its first viewport entry.
      revealAnimation = animate(elements, {
        opacity: [0, 1],
        y: [18, 0],
        duration: 620,
        delay: stagger(65),
        ease: 'outCubic',
      })
      if (media) {
        mediaAnimation = animate(media, {
          opacity: [0, 1],
          scale: [1.035, 1],
          duration: 820,
          ease: 'outCubic',
        })
      }
    }

    const scrollObserver = onScroll({
      target: section,
      // Anime.js v4 parses this as container-boundary first, target-boundary
      // second. The section therefore reveals as its top reaches the bottom
      // of the viewport, instead of waiting until it is almost gone.
      enter: 'bottom top',
      leave: 'top bottom',
      repeat: true,
      onEnter: reveal,
      onEnterBackward: reveal,
    })

    // Keep the reveal reliable when the route is entered while the section is
    // already visible, or when a smooth-scroll frame skips the exact Anime
    // threshold. This is only a one-time activation gate; Anime.js still
    // performs every visual transition.
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal()
      },
      { threshold: 0.01 },
    )
    visibilityObserver.observe(section)

    return () => {
      scrollObserver.revert()
      visibilityObserver.disconnect()
      revealAnimation?.pause()
      mediaAnimation?.pause()
    }
  }, [root])

  useEffect(() => {
    const scope = root.current
    if (!scope) return

    const sections = Array.from(scope.querySelectorAll<HTMLElement>('section:not([data-team-hero]):not([data-team-revision])'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups: Array<() => void> = []

    sections.forEach((section) => {
      const elements = Array.from(section.querySelectorAll<HTMLElement>(
        '.stitch-kicker, h2, h3, p, li, blockquote, [class*="__media"], .our-team-timeline > div, .our-team-credential-list > div',
      ))

      if (!elements.length) return

      if (reduceMotion) {
        elements.forEach((element) => {
          element.style.opacity = '1'
          element.style.transform = 'none'
        })
        return
      }

      elements.forEach((element) => {
        element.style.opacity = '0'
        element.style.transform = 'translateY(18px)'
      })

      let hasEntered = false
      const reveal = () => {
        if (hasEntered) return
        hasEntered = true
        animate(elements, {
          opacity: [0, 1],
          y: [18, 0],
          duration: 560,
          delay: stagger(45),
          ease: 'outCubic',
        })
      }

      const scrollObserver = onScroll({
        target: section,
        enter: 'bottom top',
        leave: 'top bottom',
        repeat: true,
        onEnter: reveal,
        onEnterBackward: reveal,
      })

      const visibilityObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) reveal()
        },
        { threshold: 0.01 },
      )
      visibilityObserver.observe(section)

      cleanups.push(() => {
        scrollObserver.revert()
        visibilityObserver.disconnect()
      })
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [root])
}
