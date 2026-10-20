'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function useAboutHospitalEnvironmentsMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const scope = root.current?.querySelector<HTMLElement>('[data-about-hospitals]')
    if (!scope || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const media = gsap.matchMedia(scope)
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const header = scope.querySelectorAll<HTMLElement>('[data-hospital-header] > *')
      if (header.length) {
        gsap.from(header, {
          y: 18,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: scope, start: 'top 82%', once: true },
        })
      }

      scope.querySelectorAll<HTMLElement>('[data-hospital-chapter]').forEach((chapter) => {
        const frame = chapter.querySelector<HTMLElement>('[data-hospital-main-image]')
        const inset = chapter.querySelector<HTMLElement>('[data-hospital-inset]')
        const copy = chapter.querySelectorAll<HTMLElement>('[data-hospital-copy] > *')
        if (frame) {
          gsap.fromTo(frame, { clipPath: 'inset(8% 6% 8% 6%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.95,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: chapter, start: 'top 78%', once: true },
          })
        }
        if (inset) {
          gsap.from(inset, {
            y: 28,
            scale: 0.98,
            autoAlpha: 0,
            duration: 0.75,
            delay: 0.18,
            ease: 'power3.out',
            scrollTrigger: { trigger: chapter, start: 'top 78%', once: true },
          })
        }
        if (copy.length) {
          gsap.from(copy, {
            y: 18,
            autoAlpha: 0,
            duration: 0.55,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: { trigger: chapter, start: 'top 78%', once: true },
          })
        }
      })
    })

    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      scope.querySelectorAll<HTMLElement>('[data-hospital-chapter]').forEach((chapter) => {
        const mainImage = chapter.querySelector('[data-hospital-main-image] img')
        const inset = chapter.querySelector('[data-hospital-inset]')
        if (mainImage) {
          // Overscan the photo before parallax so its edges remain behind the
          // clipped frame throughout the full 24px travel.
          gsap.set(mainImage, { y: 0, scale: 1.16, transformOrigin: 'center center' })
          gsap.to(mainImage, { y: 24, scale: 1.16, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: 0.7 } })
        }
        if (inset) gsap.to(inset, { y: -34, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: 0.7 } })
      })
    })

    return () => media.revert()
  }, { scope: root })
}
