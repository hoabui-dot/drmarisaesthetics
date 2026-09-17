'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { CalendarDays, CheckCircle2 } from 'lucide-react'
import { animate, createTimeline, onScroll } from 'animejs'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'
import { ConsultationCtaSection } from '@/src/components/blocks/ConsultationCtaSection'
import { useLazySectionMotion } from '@/src/hooks/useLazySectionMotion'
import type { TreatmentPageData } from '@/src/types/treatments-page'
import { TreatmentEditorialSection } from '@/src/components/TreatmentEditorialSection'

const images = {
  hero: '/api/strapi-media/uploads/aec6099c_fa9c_4a93_9158_e3d6baed5fa5_1b2cfb60ff.png',
  consultation: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArn0y7N8fJlLVRaHYgNvoEBhl5s-SuWW_AHixZAFLyR4sYAqohnvzbdBf4_okLKdxtROJ0zdEC4uS-Xh-MlXo122zOoCfG3UJIIv5XywvTVR-dPKLg5_Rz50k9f0D5gX86ma0FtjRvhMp6HEq_o_05qkWULno-dnCeDsR2Rydnw_FInrMlPVP4JBtVc53Sj8vKWW4K0LZtD2QODlyGB1RmDmea5dQMkOLD-sH4ArbsUY-3kMSOnm9QFg',
}

const concerns = [
  ['Dorsal Hump', 'Smoothing bumps on the bridge of the nose for a straighter, more refined profile.'],
  ['Bulbous Tip', 'Refining a rounded or disproportionate nasal tip to create elegant definition.'],
  ['Asymmetry', 'Correcting deviation or unevenness to achieve balanced facial proportions.'],
  ['Breathing Issues', 'Addressing functional impairments, such as a deviated septum, to improve airflow.'],
]

const guide = [
  ['overview', 'Overview'],
  ['concerns', 'Designed Around Your Concerns'],
  ['methodology', 'The Science of Rhinoplasty'],
]

function ReferenceImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill priority sizes="(max-width: 1023px) 100vw, 42vw" className="object-cover" unoptimized />
}

function ConsultationButton() {
  const { open } = useBookingModal()
  return <button type="button" className="booking-inline-cta stitch-button stitch-button--dark" onClick={open}><CalendarDays size={16} aria-hidden="true" />Request a Consultation</button>
}

function useSurgicalAtlasMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = root.current
    if (!section) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const entranceItems = Array.from(section.querySelectorAll<HTMLElement>('[data-atlas-entrance]'))
    const image = section.querySelector<HTMLElement>('[data-atlas-image]')
    const curtain = section.querySelector<HTMLElement>('[data-atlas-curtain]')
    const chapters = Array.from(section.querySelectorAll<HTMLElement>('[data-atlas-technique]'))
    const openOverlay = section.querySelector<HTMLElement>('[data-atlas-overlay="open"]')
    const closedOverlay = section.querySelector<HTMLElement>('[data-atlas-overlay="closed"]')
    const openPath = section.querySelector<SVGPathElement>('[data-atlas-trace="open"]')
    const closedPath = section.querySelector<SVGPathElement>('[data-atlas-trace="closed"]')
    const activeTechniqueRef = { current: 'open' }
    const runningAnimations: Array<{ pause: () => void; revert?: () => void }> = []

    const setTechnique = (technique: 'open' | 'closed') => {
      if (activeTechniqueRef.current === technique && openOverlay?.style.opacity) return
      activeTechniqueRef.current = technique
      chapters.forEach((chapter) => chapter.classList.toggle('is-active', chapter.dataset.atlasTechnique === technique))
      if (reduceMotion) {
        if (openOverlay) openOverlay.style.opacity = technique === 'open' ? '1' : '0'
        if (closedOverlay) closedOverlay.style.opacity = technique === 'closed' ? '1' : '0'
        return
      }
      if (openOverlay) runningAnimations.push(animate(openOverlay, { opacity: technique === 'open' ? [0.35, 1] : [1, 0], y: technique === 'open' ? [4, 0] : [0, -4], duration: 420, ease: 'outCubic' }))
      if (closedOverlay) runningAnimations.push(animate(closedOverlay, { opacity: technique === 'closed' ? [0, 1] : [1, 0], y: technique === 'closed' ? [4, 0] : [0, -4], duration: 420, ease: 'outCubic' }))
      const path = technique === 'open' ? openPath : closedPath
      if (path) runningAnimations.push(animate(path, { strokeDashoffset: [1000, 0], duration: 820, ease: 'outCubic' }))
    }

    if (reduceMotion) {
      entranceItems.forEach((item) => { item.style.opacity = '1'; item.style.transform = 'none' })
      if (image) image.style.transform = 'none'
      if (curtain) curtain.style.transform = 'scaleY(0)'
      setTechnique('open')
      return
    }

    entranceItems.forEach((item) => { item.style.opacity = '0'; item.style.transform = 'translateY(16px)' })
    if (image) image.style.transform = 'scale(1.04) translateY(16px)'
    if (curtain) curtain.style.transform = 'scaleY(1)'
    if (openOverlay) openOverlay.style.opacity = '1'
    if (closedOverlay) closedOverlay.style.opacity = '0'
    chapters.forEach((chapter) => chapter.classList.toggle('is-active', chapter.dataset.atlasTechnique === 'open'))
    if (openPath) openPath.style.strokeDashoffset = '1000'
    if (closedPath) closedPath.style.strokeDashoffset = '1000'

    let entered = false
    const reveal = () => {
      if (entered) return
      entered = true
      const timeline = createTimeline({ autoplay: false })
        .add(entranceItems, { opacity: [0, 1], y: [16, 0], duration: 520, delay: 70, ease: 'outCubic' }, 0)
      if (image) timeline.add(image, { scale: [1.04, 1], y: [16, 0], duration: 760, ease: 'outCubic' }, 120)
      if (curtain) timeline.add(curtain, { scaleY: [1, 0], duration: 680, ease: 'outCubic' }, 120)
      if (openPath) timeline.add(openPath, { strokeDashoffset: [1000, 0], duration: 820, ease: 'outCubic' }, 460)
      timeline.play()
      runningAnimations.push(timeline)
    }

    const entranceObserver = onScroll({ target: section, enter: 'bottom top', leave: 'top bottom', repeat: true, onEnter: reveal, onEnterBackward: reveal })
    const visibilityObserver = new IntersectionObserver((entries) => { if (entries.some((entry) => entry.isIntersecting)) reveal() }, { threshold: 0.01 })
    visibilityObserver.observe(section)
    const chapterObservers = chapters.map((chapter) => new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setTechnique(chapter.dataset.atlasTechnique === 'closed' ? 'closed' : 'open')
    }, { threshold: 0.55 }))
    chapterObservers.forEach((observer, index) => observer.observe(chapters[index]))
    const interactionCleanups = chapters.map((chapter) => {
      const activate = () => setTechnique(chapter.dataset.atlasTechnique === 'closed' ? 'closed' : 'open')
      chapter.addEventListener('mouseenter', activate)
      chapter.addEventListener('focusin', activate)
      return () => { chapter.removeEventListener('mouseenter', activate); chapter.removeEventListener('focusin', activate) }
    })

    return () => {
      entranceObserver.revert()
      visibilityObserver.disconnect()
      chapterObservers.forEach((observer) => observer.disconnect())
      interactionCleanups.forEach((cleanup) => cleanup())
      runningAnimations.forEach((animation) => { animation.pause(); animation.revert?.() })
    }
  }, [root])
}

export function TreatmentLandingPage({ data }: { data?: TreatmentPageData }) {
  const pageRef = useRef<HTMLElement>(null)
  const atlasRef = useRef<HTMLElement>(null)
  useLazySectionMotion(pageRef)
  useSurgicalAtlasMotion(atlasRef)

  const editorialSections = data?.sections || []
  const overview = editorialSections.find((section) => section.sectionKey.trim().toLowerCase() === 'overview')
  const concernsSection = editorialSections.find((section) => section.sectionKey.trim().toLowerCase() === 'concerns')
  const methodology = editorialSections.find((section) => section.sectionKey.trim().toLowerCase() === 'methodology')
  const consumedKeys = new Set<string>()
  const additionalSections = editorialSections.flatMap((section, index) => {
    const key = section.sectionKey.trim().toLowerCase()
    if (['overview', 'concerns', 'methodology'].includes(key) && !consumedKeys.has(key)) {
      consumedKeys.add(key)
      return []
    }
    const slug = key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section'
    return [{ section, index, anchorId: `${slug}-${index + 1}` }]
  })
  const heroImage = data?.hero.image || images.hero
  const overviewImage = overview?.image || images.consultation
  const methodologyImage = methodology?.image || images.consultation
  const concernItems = concernsSection?.items.length ? concernsSection.items : concerns.map(([title, description]) => ({ title, description }))
  const guideItems = [
    ['overview', overview?.title || guide[0][1]],
    ['concerns', concernsSection?.title || guide[1][1]],
    ['methodology', methodology?.title || guide[2][1]],
    ...additionalSections.map(({ anchorId, section }) => [anchorId, section.title] as [string, string]),
  ]

  return <main ref={pageRef} className="stitch-page stitch-treatment-landing">
    <section className="stitch-treatment-hero stitch-treatment-landing__hero">
      <div className="stitch-treatment-hero__copy stitch-treatment-landing__hero-copy">
        <span className="stitch-kicker stitch-treatment-landing__eyebrow"><i aria-hidden="true" /> <span>{data?.hero.eyebrow || 'DR. MARIS AESTHETICS · FACIAL PROCEDURES'}</span></span>
        <h2>{data?.hero.title || 'Rhinoplasty Surgery in Vietnam'}</h2>
        <p>{data?.hero.description || 'At DR. MARIS AESTHETICS, we redefine nasal harmony through a meticulous structural approach that honors your unique facial architecture. Our surgical philosophy combines clinical precision with natural, balanced results that enhance your features without looking operated on, ensuring both aesthetic beauty and functional integrity.'}</p>
        <div className="stitch-treatment-review stitch-treatment-landing__review"><CheckCircle2 size={18} aria-hidden="true" />{data?.hero.reviewLabel || 'Reviewed by Dr. Maris · Ho Chi Minh City, Vietnam'}</div>
        <ConsultationButton />
      </div>
      <div className="stitch-treatment-hero__media stitch-treatment-landing__hero-media"><ReferenceImage src={heroImage} alt={data?.hero.imageAlt || 'Rhinoplasty procedure at DR. MARIS AESTHETICS'} /></div>
    </section>

    <section className="stitch-section stitch-treatment-landing__content">
      <div className="stitch-container stitch-treatment-content-grid">
        <aside className="stitch-treatment-toc" aria-label="Treatment index"><span>Contents</span>{guideItems.map(([id, label], index) => <a href={`#${id}`} key={id}><b>{String(index + 1).padStart(2, '0')}</b><span>{label}</span></a>)}<div className="stitch-treatment-toc-card"><h4>Ready to discuss your goals?</h4><p>Schedule a private consultation with Dr. Maris.</p><ConsultationButton /></div></aside>
        <div className="stitch-treatment-landing__article">
          <article id="overview" className="stitch-treatment-landing__block"><span className="stitch-kicker">{overview?.eyebrow || 'OVERVIEW'}</span><h2>{overview?.title || 'What is Rhinoplasty?'}</h2><div className="stitch-treatment-landing__copy"><p>{overview?.paragraphOne || 'Rhinoplasty, commonly referred to as a nose job, is a highly refined surgical procedure designed to alter the shape, size, or proportions of the nose. At DR. MARIS AESTHETICS, we approach rhinoplasty not just as an aesthetic enhancement, but as a meticulous restructuring that honors your foundational facial architecture.'}</p><p>{overview?.paragraphTwo || 'Our philosophy is rooted in sterile warmth—combining surgical precision with a deep understanding of natural aesthetic harmony. Whether addressing cosmetic concerns or functional breathing issues, our goal is to create a result that looks entirely native to your face, enhancing your features without looking operated on.'}</p></div><div className="stitch-treatment-landing__image"><ReferenceImage src={overviewImage} alt={overview?.imageAlt || 'Patient consulting with a plastic surgeon in a premium medical consultation room'} /></div></article>
          <article id="concerns" className="stitch-treatment-landing__block"><span className="stitch-kicker">{concernsSection?.eyebrow || 'PATIENT-CENTRED PLANNING'}</span><h2>{concernsSection?.title || 'Designed Around Your Concerns'}</h2><div className="stitch-treatment-landing__concerns">{concernItems.map((item) => <div key={item.title}><h3><CheckCircle2 size={17} aria-hidden="true" />{item.title}</h3><p>{item.description}</p></div>)}</div></article>
          <article ref={atlasRef} id="methodology" className="stitch-treatment-landing__block stitch-surgical-atlas"><header className="stitch-surgical-atlas__heading" data-atlas-entrance><span className="stitch-kicker">{methodology?.eyebrow || 'SURGICAL METHODOLOGY'}</span><h2>{methodology?.title || 'The Science of Rhinoplasty'}</h2><p className="stitch-treatment-landing__lead">{methodology?.lead || 'Understanding the structural approach is key to achieving optimal results. Depending on your specific anatomical needs, we employ either an open or closed technique.'}</p></header><div className="stitch-surgical-atlas__layout"><div className="stitch-surgical-atlas__visual-wrap" data-atlas-entrance><div className="stitch-surgical-atlas__visual"><div className="stitch-surgical-atlas__image"><ReferenceImage src={methodologyImage} alt={methodology?.imageAlt || 'Clinical consultation supporting rhinoplasty structural planning'} /></div></div></div><div className="stitch-surgical-atlas__chapters">{(methodology?.items.length ? methodology.items : [{ number: '01', title: 'Open Rhinoplasty', description: 'Involves a small incision across the columella, providing full visibility of the nasal framework for intricate restructuring and precise modifications.' }, { number: '02', title: 'Closed Rhinoplasty', description: 'All incisions are hidden inside the nostrils, resulting in no visible scarring and generally a faster initial recovery time, ideal for minor refinements.' }]).map((item, index) => <article key={item.title} tabIndex={0} data-atlas-technique={index === 1 ? 'closed' : 'open'} data-atlas-entrance><span className="stitch-surgical-atlas__chapter-number">{item.number || String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.description}</p><span className="stitch-surgical-atlas__rule" aria-hidden="true" /></article>)}</div></div></article>
          {additionalSections.map(({ section, index, anchorId }) => <TreatmentEditorialSection key={anchorId} section={section} anchorId={anchorId} index={index} />)}
        </div>
      </div>
    </section>
    <ConsultationCtaSection id="consultation-cta" />
  </main>
}
