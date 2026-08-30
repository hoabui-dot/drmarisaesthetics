'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function useInternationalPatientJourneyMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const scope = root.current
    if (!scope) return
    const media = gsap.matchMedia(scope)
    media.add('(min-width: 901px)', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
      const steps = gsap.utils.toArray<HTMLElement>('[data-journey-step]', scope)
      const indicators = gsap.utils.toArray<HTMLElement>('[data-journey-indicator]', scope)
      const visuals = gsap.utils.toArray<HTMLElement>('[data-journey-visual]', scope)
      const pin = scope.querySelector<HTMLElement>('[data-journey-pin]')
      const progress = scope.querySelector<HTMLElement>('[data-journey-progress]')
      if (!pin || steps.length !== indicators.length || steps.length !== visuals.length || !steps.length) return undefined
      let active = 0
      const header = document.querySelector<HTMLElement>('header')
      const headerHeight = () => header?.getBoundingClientRect().height || 0
      const setHeader = () => { gsap.set(scope, { '--stitch-journey-header-height': `${headerHeight()}px` }); return headerHeight() }
      setHeader()
      const normalizeStack = (activeIndex: number) => {
        gsap.set(steps, { autoAlpha: 0, y: 24 })
        gsap.set(steps[activeIndex], { autoAlpha: 1, y: 0 })
        gsap.set(visuals, { autoAlpha: 0, clipPath: 'inset(100% 0 0 0)', scale: 1.05 })
        gsap.set(visuals[activeIndex], { autoAlpha: 1, clipPath: 'inset(0% 0 0 0)', scale: 1 })
        gsap.set(indicators, { autoAlpha: 0.3, scale: 1 })
        gsap.set(indicators[activeIndex], { autoAlpha: 1, scale: 1.05 })
      }
      normalizeStack(0)
      if (progress) gsap.set(progress, { scaleY: 0, transformOrigin: 'top center' })
      let activeTransition: gsap.core.Timeline | null = null
      const show = (next: number) => {
        if (next === active) return
        const previous = active
        active = next
        activeTransition?.kill()
        // A scrubbed trigger can cross more than one step between frames.
        // Normalize the complete stack after cancelling the previous tween so
        // a partially revealed step can never remain underneath the next one.
        normalizeStack(previous)
        const timeline = gsap.timeline({ defaults: { duration: 0.72, ease: 'power3.out', overwrite: 'auto' } })
        activeTransition = timeline
        timeline.to(steps[previous], { autoAlpha: 0, y: -16 }, 0).fromTo(steps[next], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, 0).to(visuals[previous], { autoAlpha: 0, scale: 1.03 }, 0).fromTo(visuals[next], { autoAlpha: 0.8, clipPath: 'inset(100% 0 0 0)', scale: 1.05 }, { autoAlpha: 1, clipPath: 'inset(0% 0 0 0)', scale: 1 }, 0).to(indicators[previous], { autoAlpha: 0.3, scale: 1 }, 0).to(indicators[next], { autoAlpha: 1, scale: 1.05 }, 0)
      }
      const trigger = ScrollTrigger.create({
        id: 'journey-main',
        trigger: scope,
        start: () => `top top+=${setHeader()}px`,
        end: () => `+=${Math.max(1, steps.length - 1) * Math.max(1, window.innerHeight - headerHeight())}`,
        pin,
        pinSpacing: true,
        scrub: 1.15,
        fastScrollEnd: false,
        anticipatePin: 1,
        refreshPriority: 20,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const value = Math.max(0, Math.min(1, self.progress))
          if (progress) gsap.set(progress, { scaleY: value })
          const transitionCount = steps.length - 1
          const nextStep = value >= 1 ? transitionCount : Math.min(transitionCount, Math.round(value * transitionCount))
          show(nextStep)
        },
      })
      return () => { activeTransition?.kill(); trigger.kill(); gsap.killTweensOf([...steps, ...visuals, ...indicators]) }
    })
    return () => media.revert()
  }, { scope: root, dependencies: [] })
}
