'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type HospitalImageStackProps = {
  firstImage: string
  firstAlt: string
  secondImage: string
  secondAlt: string
  animated?: boolean
  variant?: 'desktop' | 'mobile'
  className?: string
}

/** Two semantic hospital images; desktop enhancement is entirely scroll-driven. */
export function HospitalImageStack({
  firstImage,
  firstAlt,
  secondImage,
  secondAlt,
  animated = false,
  variant = 'desktop',
  className = '',
}: HospitalImageStackProps) {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!animated) return
    const story = root.current
    const stage = story?.querySelector<HTMLElement>('[data-hospital-image-stage]')
    const incoming = story?.querySelector<HTMLElement>('[data-hospital-image-second]')
    if (!story || !stage || !incoming) return

    const media = gsap.matchMedia()
    media.add('(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)', () => {
      stage.classList.add('is-scroll-stacked')
      // Keep the incoming layer at a stable scale. Animating only its vertical
      // position avoids sub-pixel resampling shimmer when scroll direction
      // changes, while GSAP's transform remains composited.
      gsap.set(incoming, { yPercent: 100, force3D: true })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: story,
          start: 'top 18%',
          end: '+=65%',
          // Directly map timeline progress to scroll position. Numeric scrub
          // intentionally lags behind the scrollbar and can feel like a small
          // jump when the visitor reverses direction.
          scrub: true,
          pin: stage,
          pinSpacing: true,
        },
      })
      timeline.to({}, { duration: 0.15 })
        .to(incoming, { yPercent: 0, duration: 0.65, ease: 'none' })
        .to({}, { duration: 0.2 })

      return () => {
        stage.classList.remove('is-scroll-stacked')
      }
    })

    media.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
      stage.classList.add('is-scroll-stacked-mobile')
      gsap.set(incoming, { yPercent: 100, force3D: true })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'center center',
          end: 'bottom 20%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      timeline.to({}, { duration: 0.15 })
        .to(incoming, { yPercent: 0, duration: 0.7, ease: 'none' })
        .to({}, { duration: 0.15 })

      return () => {
        stage.classList.remove('is-scroll-stacked-mobile')
      }
    })

    return () => media.revert()
  }, { scope: root })

  return (
    <section
      ref={root}
      className={`hospital-image-story hospital-image-story--${variant} ${className}`.trim()}
      aria-label="Hospital locations"
    >
      <div className="hospital-image-stage" data-hospital-image-stage>
        <figure className="hospital-image hospital-image--first">
          <Image src={firstImage} alt={firstAlt} fill sizes="(max-width: 767px) 100vw, 60vw" unoptimized />
        </figure>
        <figure className="hospital-image hospital-image--second" data-hospital-image-second>
          <Image src={secondImage} alt={secondAlt} fill sizes="(max-width: 767px) 100vw, 60vw" unoptimized />
        </figure>
      </div>
    </section>
  )
}
