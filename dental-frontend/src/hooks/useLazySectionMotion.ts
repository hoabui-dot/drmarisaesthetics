'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'
import { createTimeline, stagger } from 'animejs'

/** Reveals only top-level page sections when they enter the viewport. */
export function useLazySectionMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = root.current
    if (!scope) return

    const sections = Array.from(scope.querySelectorAll<HTMLElement>('section')).filter((section) => !section.parentElement?.closest('section'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animations: Array<{ pause: () => void; revert?: () => void }> = []

    if (reduceMotion) return

    const targetsFor = (section: HTMLElement) => {
      const selectors = section.matches('.contact-hero-section')
        ? '.contact-hero-breadcrumb, .contact-hero-intro h2, .contact-hero-intro p, .contact-hero-actions > *, .contact-hero-image, .contact-hero-card'
        : section.matches('.stitch-treatment-hero')
          ? '.stitch-treatment-breadcrumb, .stitch-treatment-hero__copy > .stitch-kicker, .stitch-treatment-hero__copy h2, .stitch-treatment-hero__copy > p, .stitch-treatment-review, .stitch-treatment-hero__copy button, .stitch-treatment-hero__media'
          : '.stitch-kicker, h2, h3, h4, p, blockquote, li, button, a, [class*="__image"], [class*="__media"], img'
      return Array.from(section.querySelectorAll<HTMLElement>(selectors)).filter((element) => !element.closest('.stitch-surgical-atlas'))
    }

    const sectionTargets = new Map<HTMLElement, HTMLElement[]>()
    sections.forEach((section) => {
      if (section.classList.contains('stitch-surgical-atlas')) return
      const targets = targetsFor(section)
      sectionTargets.set(section, targets)
      targets.forEach((target) => { target.style.opacity = '0'; target.style.transform = 'translateY(18px)' })
    })

    const reveal = (section: HTMLElement) => {
      if (section.dataset.lazyMotionReady === 'true') return
      section.dataset.lazyMotionReady = 'true'
      const targets = sectionTargets.get(section) || []
      if (!targets.length) return
      const isHero = section.matches('.contact-hero-section, .stitch-treatment-hero')
      const timeline = createTimeline({ autoplay: false })
      if (isHero) {
        const eyebrow = targets.filter((target) => target.matches('.contact-hero-breadcrumb, .stitch-treatment-breadcrumb, .stitch-kicker'))
        const titles = targets.filter((target) => target.matches('h2'))
        const copy = targets.filter((target) => target.matches('p, .contact-hero-description, .stitch-treatment-review'))
        const actions = targets.filter((target) => target.matches('.contact-hero-actions > *, button'))
        const media = targets.filter((target) => target.matches('.contact-hero-image, .stitch-treatment-hero__media'))
        if (eyebrow.length) timeline.add(eyebrow, { opacity: [0, 1], y: [10, 0], duration: 360, delay: stagger(55), ease: 'outCubic' }, 0)
        if (titles.length) timeline.add(titles, { opacity: [0, 1], y: [20, 0], duration: 620, ease: 'outCubic' }, 220)
        if (media.length) timeline.add(media, { opacity: [0, 1], scale: [1.04, 1], duration: 820, ease: 'outCubic' }, 260)
        if (copy.length) timeline.add(copy, { opacity: [0, 1], y: [20, 0], duration: 440, delay: stagger(80), ease: 'outCubic' }, 560)
        if (actions.length) timeline.add(actions, { opacity: [0, 1], y: [14, 0], duration: 360, delay: stagger(70), ease: 'outCubic' }, 900)
      } else {
        timeline.add(targets, { opacity: [0, 1], y: [18, 0], duration: 520, delay: stagger(42), ease: 'outCubic' }, 0)
      }
      timeline.play()
      animations.push(timeline)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' })
    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
      animations.forEach((animation) => { animation.pause(); animation.revert?.() })
      sectionTargets.forEach((targets, section) => {
        targets.forEach((target) => { target.style.opacity = ''; target.style.transform = '' })
        delete section.dataset.lazyMotionReady
      })
    }
  }, [root])
}
