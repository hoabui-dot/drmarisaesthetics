'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'

type MotionTarget = HTMLElement | null

function reveal(animations: Animation[], element: MotionTarget, options: { delay: number; duration: number; y?: number }) {
  if (!element) return
  animations.push(element.animate(
    [
      { opacity: 0, transform: `translateY(${options.y ?? 10}px)` },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    {
      delay: options.delay,
      duration: options.duration,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'both',
    },
  ))
}

export function useSignatureProceduresMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = root.current
    const section = scope?.querySelector<HTMLElement>('[data-signature-procedures]')
    if (!section) return

    const eyebrow = section.querySelector<HTMLElement>('[data-signature-eyebrow]')
    const title = section.querySelector<HTMLElement>('[data-signature-title]')
    const supportingCopy = section.querySelector<HTMLElement>('[data-signature-copy]')
    const panels = Array.from(section.querySelectorAll<HTMLElement>('[data-signature-panel]'))
    const panelParts = panels.map((panel) => ({
      image: panel.querySelector<HTMLElement>('.stitch-procedure-panel__image img'),
      curtain: panel.querySelector<HTMLElement>('[data-signature-curtain]'),
      number: panel.querySelector<HTMLElement>('[data-signature-number]'),
      title: panel.querySelector<HTMLElement>('[data-signature-panel-title]'),
      description: panel.querySelector<HTMLElement>('[data-signature-panel-description]'),
      cta: panel.querySelector<HTMLElement>('[data-signature-panel-cta]'),
    }))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      section.querySelectorAll<HTMLElement>('[data-signature-motion]').forEach((element) => {
        element.style.opacity = '1'
        element.style.transform = 'none'
      })
      panelParts.forEach(({ image, curtain }) => {
        if (image) image.style.transform = 'none'
        if (curtain) curtain.style.transform = 'scaleY(0)'
      })
      return
    }

    const animations: Animation[] = []
    const collect = (element: HTMLElement | null, keyframes: Keyframe[], duration: number, delay = 0) => {
      if (!element) return
      animations.push(element.animate(keyframes, {
        duration,
        delay,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'both',
      }))
    }

    let hasEntered = false
    const play = () => {
      if (hasEntered) return
      hasEntered = true
      reveal(animations, eyebrow, { delay: 0, duration: 340, y: 10 })
      reveal(animations, title, { delay: 180, duration: 520, y: 18 })
      reveal(animations, supportingCopy, { delay: 420, duration: 420, y: 14 })

      panelParts.forEach(({ image, curtain, number, title: panelTitle, description, cta }, index) => {
        const start = 500 + index * 65
        collect(curtain, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], 480, start)
        collect(image, [
          { transform: 'translateY(20px) scale(1.07)' },
          { transform: 'translateY(0) scale(1)' },
        ], 560, start)
        reveal(animations, number, { delay: start + 170, duration: 240, y: 8 })
        reveal(animations, panelTitle, { delay: start + 205, duration: 280, y: 10 })
        reveal(animations, description, { delay: start + 250, duration: 280, y: 8 })
        reveal(animations, cta, { delay: start + 300, duration: 240, y: 6 })
      })
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        play()
        observer.disconnect()
      }
    }, { threshold: 0.01 })
    observer.observe(section)

    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [root])
}
