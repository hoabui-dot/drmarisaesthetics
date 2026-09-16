'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { animate, createTimeline, onScroll } from 'animejs'

export type PlanningStep = {
  number: string
  title: string
  description: string
  image: string
  imageAlt: string
}

export const planningSteps: PlanningStep[] = [
  {
    number: '01',
    title: 'Send Your Case',
    description: 'Provide relevant concerns, photographs, medical history, previous surgical information, and implant details where applicable.',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Patient discussing aesthetic goals with a medical professional in a private consultation',
  },
  {
    number: '02',
    title: 'Online Consultation',
    description: 'Preliminary consultation before travel. Note: Remote consultation does not replace physical examination.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Medical professional reviewing patient information during a digital consultation',
  },
  {
    number: '03',
    title: 'Travel to Ho Chi Minh City',
    description: 'Patient arrives for in-person assessment and clinical evaluation at our facility.',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Aerial view of a Southeast Asian city representing international travel to Vietnam',
  },
  {
    number: '04',
    title: 'Final Examination & Surgical Planning',
    description: 'Dr. Maris confirms suitability and finalizes the surgical plan based on physical findings.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Doctor conducting a careful clinical examination with a patient',
  },
  {
    number: '05',
    title: 'Surgery at CIH',
    description: 'Hospital-based cosmetic surgery performed in a fully accredited international hospital setting.',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Surgical team working in a modern sterile operating theatre',
  },
  {
    number: '06',
    title: 'Recovery & Follow-Up',
    description: 'Recovery and return travel timing depend on the procedure and individual condition.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Doctor providing calm follow-up care to a recovering patient',
  },
]

type PlanningProcessSectionProps = {
  eyebrow?: string
  title?: string
  description?: string
  steps?: PlanningStep[]
  showActions?: boolean
  className?: string
  sectionId?: string
}

export function PlanningProcessSection({
  eyebrow = 'International Patients',
  title = 'Planning Plastic Surgery in Vietnam From Overseas',
  description = 'Patients from Australia, New Zealand, the United States, Europe and other international markets can begin their consultation process before traveling.',
  steps = planningSteps,
  showActions = true,
  className = '',
  sectionId = 'planning-process',
}: PlanningProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const activeIndexRef = useRef(0)
  const timelinesRef = useRef<ReturnType<typeof createTimeline>[]>([])
  const frameRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const stepElements = Array.from(section.querySelectorAll<HTMLElement>('[data-planning-step]'))
    const progress = section.querySelector<HTMLElement>('[data-planning-progress]')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const playStep = (index: number) => {
      if (reduceMotion) return
      timelinesRef.current.forEach((timeline) => timeline.pause().revert())
      const step = stepElements[index]
      if (!step) return
      const number = step.querySelector<HTMLElement>('[data-planning-number]')
      const title = step.querySelector<HTMLElement>('[data-planning-title]')
      const description = step.querySelector<HTMLElement>('[data-planning-description]')
      if (!number || !title || !description) return
      const visualMedia = section.querySelector<HTMLElement>('[data-planning-visual-media]')
      const timeline = createTimeline({ autoplay: false })
        .add(number, { opacity: [0.3, 1], scale: [0.85, 1], duration: 520, ease: 'outCubic' }, 0)
        .add(title, { opacity: [0, 1], y: [16, 0], duration: 520, ease: 'outCubic' }, 90)
        .add(description, { opacity: [0, 1], y: [12, 0], duration: 520, ease: 'outCubic' }, 180)
      if (visualMedia) {
        timeline.add(visualMedia, { opacity: [0.9, 1], scale: [1.025, 1], duration: 560, ease: 'outCubic' }, 60)
      }
      timeline.play()
      timelinesRef.current = [timeline]
    }

    const syncActiveStep = () => {
      frameRef.current = null
      const viewportLine = window.innerHeight * 0.46
      let nextIndex = 0

      stepElements.forEach((step, index) => {
        if (step.getBoundingClientRect().top <= viewportLine) nextIndex = index
      })

      if (nextIndex === activeIndexRef.current) return
      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
      playStep(nextIndex)
    }

    const syncFromDocumentScroll = () => {
      const firstStep = stepElements[0]
      const lastStep = stepElements[stepElements.length - 1]
      if (!firstStep || !lastStep) return

      // Anime's section observer is useful for the connector, but the active
      // step must follow the document scroll position itself. This keeps the
      // image/state in sync even when a fast wheel or trackpad gesture skips
      // an Anime.js observer frame.
      const firstTop = firstStep.getBoundingClientRect().top
      const lastTop = lastStep.getBoundingClientRect().top
      const range = Math.max(1, lastTop - firstTop)
      const marker = window.innerHeight * 0.46
      const progressValue = Math.max(0, Math.min(1, (marker - firstTop) / range))
      if (progress) progress.style.transform = `scaleY(${progressValue})`
      requestStepSync()
    }

    const requestStepSync = () => {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(syncActiveStep)
    }

    stepElements.forEach((step, index) => {
      const number = step.querySelector<HTMLElement>('[data-planning-number]')
      const title = step.querySelector<HTMLElement>('[data-planning-title]')
      const description = step.querySelector<HTMLElement>('[data-planning-description]')
      if (!number || !title || !description) return
      if (index !== 0 || reduceMotion) {
        animate([number, title, description], { opacity: reduceMotion ? 1 : 0.34, y: 0, scale: 1, duration: 0 })
      }
    })
    playStep(0)

    const progressObserver = onScroll({
      target: section,
      enter: 'top bottom',
      leave: 'bottom top',
      repeat: true,
      onUpdate: (self) => {
        const value = Math.max(0, Math.min(1, self.progress))
        if (progress) progress.style.transform = `scaleY(${value})`
        requestStepSync()
      },
    })

    // The section is part of the normal document flow rather than a scroll
    // container. Listen to the document as a reliable fallback/source of
    // truth for the discrete active step state.
    window.addEventListener('scroll', syncFromDocumentScroll, { passive: true })
    window.addEventListener('resize', syncFromDocumentScroll, { passive: true })

    // One section-level observer is intentionally used here. Separate
    // observers per step can fire in the same scroll frame and overwrite a
    // valid state (for example 03 -> 05 on a small trackpad movement).
    requestStepSync()

    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
      window.removeEventListener('scroll', syncFromDocumentScroll)
      window.removeEventListener('resize', syncFromDocumentScroll)
      progressObserver.revert()
      timelinesRef.current.forEach((timeline) => timeline.pause().revert())
      timelinesRef.current = []
    }
  }, [])

  return (
    <section ref={sectionRef} id={sectionId} data-planning-process className={`stitch-section planning-process ${className}`.trim()} aria-labelledby={`${sectionId}-title`}>
      <div className="stitch-container">
        <header className="planning-process__header">
          <span className="stitch-kicker">{eyebrow}</span>
          <h2 id={`${sectionId}-title`}>{title}</h2>
          <p>{description}</p>
        </header>

        <div className="planning-process__story">
          <div className="planning-process__visual-wrap">
            <div className="planning-process__visual" aria-hidden="true">
              <Image src={steps[activeIndex].image} alt={steps[activeIndex].imageAlt} fill sizes="(max-width: 900px) 100vw, 40vw" className="planning-process__visual-media" data-planning-visual-media unoptimized />
              <span className="planning-process__visual-wash" />
              <span className="planning-process__visual-kicker">DR. MARIS AESTHETICS</span>
              <span className="planning-process__visual-label">{steps[activeIndex].title}</span>
            </div>
          </div>

          <div className="planning-process__steps-wrap">
            <div className="planning-process__connector" aria-hidden="true"><span data-planning-progress /></div>
            <ol className="planning-process__steps">
              {steps.map((step, index) => (
                <li key={step.number} data-planning-step className={index === activeIndex ? 'is-active' : index < activeIndex ? 'is-complete' : ''}>
                  <div className="planning-process__step-copy">
                    <div className="planning-process__step-heading">
                      <span className="planning-process__number" data-planning-number>{step.number}</span>
                      <h3 data-planning-title>{step.title}</h3>
                    </div>
                    <p data-planning-description>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {showActions && <div className="planning-process__actions">
          <a className="stitch-button stitch-button--dark" href="#consultation">Plan Your Surgery in Vietnam</a>
          <a className="booking-inline-cta stitch-button stitch-button--outline" href="#consultation">Request an Online Consultation</a>
        </div>}
      </div>
    </section>
  )
}
