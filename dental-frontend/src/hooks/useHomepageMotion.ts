'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP, Observer, ScrollTrigger)

export function useHomepageMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const scope = root.current
    if (!scope) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mm = gsap.matchMedia(scope)

    if (reduceMotion) {
      gsap.set(scope.querySelectorAll('[data-motion-hidden]'), { clearProps: 'all' })
      return () => mm.revert()
    }

    const hero = scope.querySelector('.stitch-home-hero')
    const heroTitleLines = scope.querySelectorAll('[data-hero-title-line]')
    const heroCopy = scope.querySelectorAll('[data-hero-copy]')
    const heroImage = scope.querySelector('[data-hero-image]')
    const heroDivider = scope.querySelector('[data-hero-divider]')
    const heroKickerText = scope.querySelector('[data-hero-kicker-text]')
    const heroActions = scope.querySelector('[data-hero-actions]')
    const heroProof = scope.querySelector('[data-hero-proof]')
    const heroActionItems = scope.querySelectorAll('[data-hero-actions] button, [data-hero-actions] a')
    const heroProofItems = scope.querySelectorAll('[data-hero-proof] span')

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    if (heroDivider) intro.from(heroDivider, { scaleX: 0, transformOrigin: 'left center', duration: 0.3 }, 0)
    if (heroKickerText) intro.from(heroKickerText, { autoAlpha: 0, y: 10, duration: 0.4 }, 0.12)
    if (heroTitleLines.length) intro.from(heroTitleLines, { yPercent: 100, autoAlpha: 0, duration: 0.65, stagger: 0.08 }, 0.38)
    if (heroImage) intro.fromTo(heroImage, { clipPath: 'inset(0 100% 0 0)', scale: 1.08 }, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 0.9, ease: 'power3.inOut' }, 0.35)
    if (heroCopy.length) intro.from(heroCopy, { y: 20, autoAlpha: 0, duration: 0.42, stagger: 0.1 }, 0.92)
    if (heroActionItems.length) intro.from(heroActionItems, { y: 14, autoAlpha: 0, duration: 0.35, stagger: 0.08 }, 1.2)
    if (heroActions && !heroActionItems.length) intro.from(heroActions, { y: 14, autoAlpha: 0, duration: 0.35 }, 1.2)
    if (heroProofItems.length) intro.from(heroProofItems, { y: 10, autoAlpha: 0, duration: 0.3, stagger: 0.06 }, 1.32)
    if (heroProof && !heroProofItems.length) intro.from(heroProof, { y: 10, autoAlpha: 0, duration: 0.3 }, 1.32)

    if (hero) {
      gsap.to(hero.querySelector('[data-hero-image-media]'), {
        y: 45,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.9 },
      })
      gsap.to(hero.querySelector('[data-hero-copy-wrap]'), {
        y: -32,
        autoAlpha: 0.72,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '70% top', scrub: 0.9 },
      })
    }

    const process = scope.querySelector('[data-motion-section="process"]')
    if (process) {
      const timelineLine = process.querySelector('[data-process-line]')
      const steps = process.querySelectorAll('[data-process-step]')
      const processReveal = gsap.timeline({
        scrollTrigger: { trigger: process, start: 'top 78%', once: true },
      })
      if (timelineLine) processReveal.fromTo(timelineLine.querySelector('.stitch-process-line__progress'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.out' })
      if (steps.length) processReveal.from(steps, { y: 12, autoAlpha: 0.3, duration: 0.45, stagger: 0.12 }, '-=0.55')
      const portrait = process.querySelector('[data-process-image]')
      if (portrait) processReveal.from(portrait, { scale: 0.96, rotation: 2, autoAlpha: 0, duration: 0.85 }, '-=0.7')
      const stat = process.querySelector('[data-process-stat]')
      if (stat) processReveal.from(stat, { x: -20, y: 20, autoAlpha: 0, duration: 0.55 }, '-=0.35')
    }

    const procedures = scope.querySelector('[data-motion-section="procedures"]')
    if (procedures) {
      gsap.from(procedures.querySelectorAll('[data-procedure-panel]'), {
        y: 32,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: procedures, start: 'top 76%', once: true },
      })
    }

    const swipeChapter = scope.querySelector<HTMLElement>('[data-swipe-chapter]')
    if (swipeChapter) {
      mm.add('(min-width: 901px)', () => {
        const slides = gsap.utils.toArray<HTMLElement>('[data-swipe-slide]', swipeChapter)
        if (slides.length < 2) return undefined

        let activeIndex = 0
        let isAnimating = false
        let boundaryReleased = false
        let activeTransition: gsap.core.Timeline | null = null
        const header = document.querySelector<HTMLElement>('header')
        const getHeaderHeight = () => header?.offsetHeight || 0
        const setHeaderOffset = () => {
          const headerHeight = getHeaderHeight()
          gsap.set(swipeChapter, { '--stitch-swipe-header-height': `${headerHeight}px` })
          return headerHeight
        }
        setHeaderOffset()
        const normalizeSlides = (visibleIndex: number) => {
          slides.forEach((slide, index) => {
            const isVisible = index === visibleIndex
            const visual = slide.querySelector<HTMLElement>('[data-swipe-visual]')
            const outer = slide.querySelector<HTMLElement>('[data-swipe-outer]')
            const inner = slide.querySelector<HTMLElement>('[data-swipe-inner]')
            gsap.set(slide, { autoAlpha: isVisible ? 1 : 0, zIndex: isVisible ? 1 : 0, pointerEvents: isVisible ? 'auto' : 'none' })
            // The slide controls visibility. Keep its background image mounted
            // and opaque inside the nested masks so reverse swipes never show
            // the section's solid fallback color between frames.
            if (visual) gsap.set(visual, { autoAlpha: 1, clipPath: 'inset(0% 0 0 0)', yPercent: 0, scale: 1 })
            if (outer) gsap.set(outer, { yPercent: isVisible ? 0 : index < visibleIndex ? -100 : 100 })
            if (inner) gsap.set(inner, { yPercent: isVisible ? 0 : index < visibleIndex ? 100 : -100 })
          })
        }
        normalizeSlides(activeIndex)

        const goToSlide = (nextIndex: number, direction: 1 | -1) => {
          if (isAnimating || nextIndex < 0 || nextIndex >= slides.length || nextIndex === activeIndex) return
          isAnimating = true
          const current = slides[activeIndex]
          const next = slides[nextIndex]
          const currentVisual = current.querySelector<HTMLElement>('[data-swipe-visual]')
          const nextVisual = next.querySelector<HTMLElement>('[data-swipe-visual]')
          const currentOuter = current.querySelector<HTMLElement>('.stitch-swipe-outer')
          const currentInner = current.querySelector<HTMLElement>('.stitch-swipe-inner')
          const nextOuter = next.querySelector<HTMLElement>('.stitch-swipe-outer')
          const nextInner = next.querySelector<HTMLElement>('.stitch-swipe-inner')
          if (!currentOuter || !currentInner || !nextOuter || !nextInner) {
            isAnimating = false
            return
          }

          normalizeSlides(activeIndex)
          const transition = gsap.timeline({ defaults: { duration: 1.15, ease: 'power1.inOut' }, onComplete: () => { activeIndex = nextIndex; isAnimating = false; activeTransition = null } })
          activeTransition = transition
          gsap.set(next, { autoAlpha: 1, zIndex: 2, pointerEvents: 'auto' })
          gsap.set(nextOuter, { yPercent: direction * 100 })
          gsap.set(nextInner, { yPercent: direction * -100 })
          transition.to(nextOuter, { yPercent: 0 }, 0)
          transition.to(nextInner, { yPercent: 0 }, 0)
          // The nested wrappers provide the reveal mask. Keep the incoming
          // background visible while it travels through that mask; hiding it
          // here exposes the section's solid fallback color during the wipe.
          if (nextVisual) transition.fromTo(nextVisual, { autoAlpha: 1, yPercent: direction * 15, scale: 1.05 }, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 1.15 }, 0)
          if (currentVisual) transition.to(currentVisual, { yPercent: direction * -15, duration: 1.15 }, 0)
          transition.to(current, { autoAlpha: 0, zIndex: 0, duration: 0.01 }, '>-0.01')
          transition.set([currentOuter, currentInner], { yPercent: 0 })
        }

        const syncSlidesForReentry = () => {
          activeTransition?.kill()
          activeTransition = null
          isAnimating = false
          normalizeSlides(activeIndex)
        }

        const observer = Observer.create({
          // Capture wheel/touch gestures at the active zone boundary. The
          // observer is disabled outside this pinned chapter, so it never
          // becomes a global scroll hijack.
          target: window,
          type: 'wheel,touch,pointer',
          wheelSpeed: -1,
          tolerance: 24,
          preventDefault: true,
          onUp: () => {
            if (activeIndex < slides.length - 1) goToSlide(activeIndex + 1, 1)
            else {
              boundaryReleased = true
              observer.disable()
            }
          },
          onDown: () => {
            if (activeIndex > 0) goToSlide(activeIndex - 1, -1)
            else {
              boundaryReleased = true
              observer.disable()
            }
          },
        })
        observer.disable()

        const pinTrigger = ScrollTrigger.create({
          id: 'revision-hospital-main',
          trigger: swipeChapter,
          start: () => `top top+=${setHeaderOffset()}px`,
          end: '+=100%',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 30,
          invalidateOnRefresh: true,
          onEnter: () => {
            syncSlidesForReentry()
            boundaryReleased = false
            observer.enable()
          },
          onEnterBack: () => {
            syncSlidesForReentry()
            boundaryReleased = false
            observer.enable()
          },
          onLeave: () => observer.disable(),
          onLeaveBack: () => observer.disable(),
          onUpdate: (self) => {
            if (!self.isActive) observer.disable()
            else if (!boundaryReleased) observer.enable()
          },
        })

        return () => {
          observer.kill()
          pinTrigger.kill()
          activeTransition?.kill()
          gsap.killTweensOf(slides)
        }
      })
    }

    scope.querySelectorAll('[data-motion-section]').forEach((section) => {
      // Hospital is owned by the isolated Observer swipe system above. A
      // second generic reveal trigger here would fight its autoAlpha/y state
      // exactly as the slide enters or exits the pinned chapter.
      if (['process', 'revision', 'hospital'].includes(section.getAttribute('data-motion-section') || '')) return
      const elements = section.querySelectorAll('[data-reveal], .stitch-kicker, h2, h3, .stitch-clinic-image, .stitch-portrait, .stitch-faq-grid article')
      if (!elements.length) return
      gsap.from(elements, {
        y: 24,
        autoAlpha: 0,
        duration: 0.75,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 82%', once: true },
      })
    })

    let layoutReadyCancelled = false
    const imagesReady = Array.from(scope.querySelectorAll('img')).map((image) => image.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve(), { once: true })
        image.addEventListener('error', () => resolve(), { once: true })
      }))
    Promise.all([document.fonts?.ready ?? Promise.resolve(), ...imagesReady]).then(() => {
      if (!layoutReadyCancelled) {
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      }
    })

    return () => {
      layoutReadyCancelled = true
      mm.revert()
    }
  }, { scope: root, dependencies: [] })
}
