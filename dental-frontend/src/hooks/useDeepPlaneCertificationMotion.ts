'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function useDeepPlaneCertificationMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const scope = root.current
    if (!scope) return

    const media = gsap.matchMedia(scope)
    media.add('(min-width: 901px)', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

      const viewport = scope.querySelector<HTMLElement>('[data-certification-gallery]')
      const track = scope.querySelector<HTMLElement>('[data-certification-track]')
      const pin = scope.querySelector<HTMLElement>('[data-certification-pin]')
      if (!viewport || !track || !pin) return undefined

      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)
      if (!distance()) return undefined

      const header = document.querySelector<HTMLElement>('header')
      const headerHeight = () => header?.getBoundingClientRect().height || 0
      const setHeaderOffset = () => {
        const height = headerHeight()
        gsap.set(scope, { '--deep-plane-certification-header-height': `${height}px` })
        return height
      }

      setHeaderOffset()
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          id: 'deep-plane-certifications-horizontal',
          trigger: scope,
          start: () => `top top+=${setHeaderOffset()}px`,
          end: () => `+=${distance()}`,
          pin,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          refreshPriority: 10,
          invalidateOnRefresh: true,
        },
      })

      return () => tween.kill()
    })

    media.add('(max-width: 900px)', () => {
      const cards = scope.querySelectorAll<HTMLElement>('[data-certification-track] > article')
      gsap.from(cards, {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: scope, start: 'top 82%', once: true },
      })
    })

    return () => media.revert()
  }, { scope: root, dependencies: [] })
}
