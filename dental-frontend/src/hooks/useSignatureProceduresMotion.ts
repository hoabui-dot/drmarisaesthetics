'use client'

import { useEffect } from 'react'
import { animate, createTimeline, onScroll, stagger } from 'animejs'
import type { RefObject } from 'react'

export function useSignatureProceduresMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = root.current
    const section = scope?.querySelector<HTMLElement>('[data-signature-procedures]')
    if (!section) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const eyebrow = section.querySelector<HTMLElement>('[data-signature-eyebrow]')
    const titleLines = Array.from(section.querySelectorAll<HTMLElement>('[data-signature-title-line]'))
    const supportingCopy = section.querySelector<HTMLElement>('[data-signature-copy]')
    const panels = Array.from(section.querySelectorAll<HTMLElement>('[data-signature-panel]'))

    const panelParts = panels.map((panel) => ({
      panel,
      image: panel.querySelector<HTMLElement>('.stitch-procedure-panel__image img'),
      curtain: panel.querySelector<HTMLElement>('[data-signature-curtain]'),
      number: panel.querySelector<HTMLElement>('[data-signature-number]'),
      title: panel.querySelector<HTMLElement>('[data-signature-panel-title]'),
      description: panel.querySelector<HTMLElement>('[data-signature-panel-description]'),
      cta: panel.querySelector<HTMLElement>('[data-signature-panel-cta]'),
    }))

    if (reduceMotion) {
      section.querySelectorAll<HTMLElement>('[data-signature-motion]').forEach((element) => {
        element.style.opacity = '1'
        element.style.transform = 'none'
      })
      panelParts.forEach(({ curtain }) => {
        if (curtain) curtain.style.transform = 'scaleY(0)'
      })
      return
    }

    const content = [eyebrow, ...titleLines, supportingCopy].filter(Boolean) as HTMLElement[]
    const panelContent = panelParts.flatMap(({ number, title, description, cta }) => [number, title, description, cta]).filter(Boolean) as HTMLElement[]

    animate(content, { opacity: 0, y: 10, duration: 0 })
    animate(panelContent, { opacity: 0, y: 10, duration: 0 })
    panelParts.forEach(({ image, curtain }) => {
      if (image) animate(image, { opacity: 1, scale: 1.07, y: 20, duration: 0 })
      if (curtain) animate(curtain, { scaleY: 1, duration: 0 })
    })

    const timeline = createTimeline({ autoplay: false })
    if (eyebrow) timeline.add(eyebrow, { opacity: [0, 1], y: [10, 0], duration: 340, ease: 'outCubic' }, 0)
    if (titleLines.length) timeline.add(titleLines, { opacity: [0, 1], y: [18, 0], duration: 520, delay: stagger(75), ease: 'outCubic' }, 180)
    if (supportingCopy) timeline.add(supportingCopy, { opacity: [0, 1], y: [14, 0], duration: 420, ease: 'outCubic' }, 420)

    panelParts.forEach(({ image, curtain, number, title, description, cta }, index) => {
      const start = 500 + index * 65
      if (curtain) timeline.add(curtain, { scaleY: [1, 0], duration: 480, ease: 'outCubic' }, start)
      if (image) timeline.add(image, { scale: [1.07, 1], y: [20, 0], duration: 560, ease: 'outCubic' }, start)
      if (number) timeline.add(number, { opacity: [0, 1], y: [8, 0], duration: 240, ease: 'outCubic' }, start + 170)
      if (title) timeline.add(title, { opacity: [0, 1], y: [10, 0], duration: 280, ease: 'outCubic' }, start + 205)
      if (description) timeline.add(description, { opacity: [0, 1], y: [8, 0], duration: 280, ease: 'outCubic' }, start + 250)
      if (cta) timeline.add(cta, { opacity: [0, 1], y: [6, 0], duration: 240, ease: 'outCubic' }, start + 300)
    })

    let hasEntered = false
    const reveal = () => {
      if (hasEntered) return
      hasEntered = true
      timeline.play()
    }

    // Anime.js v4 uses container-boundary first, target-boundary second.
    // This starts the choreography once roughly the first third of the
    // section has entered the viewport, without scrubbing the entrance.
    const scrollObserver = onScroll({
      target: section,
      enter: { container: 'bottom', target: '30%' },
      leave: 'top bottom',
      repeat: true,
      onEnter: reveal,
      onEnterBackward: reveal,
    })

    // Protect against route-entry frames or smooth-scroll jumps that skip the
    // exact Anime.js threshold. Anime.js remains the sole animation owner.
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
      timeline.pause().revert()
    }
  }, [root])
}
