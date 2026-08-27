'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, HeartPulse, ScanLine, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { HomepageTechnologyFeatureBlock } from '@/src/types/strapi'

const capabilityIcons = [ScanLine, Stethoscope, Sparkles, ShieldCheck, HeartPulse, CalendarDays]

function TechnologyCard({ card, position, total }: { card: HomepageTechnologyFeatureBlock['technologies'][number]; position: number; total: number }) {
  return (
    <article className="absolute inset-y-0 left-5 right-0 overflow-visible sm:left-7" style={{ zIndex: position }} aria-label={`${card.index} ${card.title}`}>
      <div className="relative flex h-full flex-col overflow-visible rounded-[2rem] border border-blue-200 bg-white p-6 shadow-card sm:p-8 lg:p-10">
        <span className="absolute -left-6 top-[22%] z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-smilux-badge bg-white text-xl font-bold text-smilux-badge shadow-card sm:-left-7 sm:h-14 sm:w-14">{card.index}</span>
        {card.thumbnail?.url && <div className="absolute right-6 top-6 h-10 w-10 overflow-hidden rounded-full border border-blue-100"><Image src={card.thumbnail.url} alt="" fill sizes="40px" className="object-cover" /></div>}
        <p className="home-technology-card-title max-w-[85%] font-bold leading-tight text-smilux-badge">{card.title}</p>
        <p className="home-content mt-5 max-w-2xl text-smilux-navy">{card.description}</p>
        {card.image?.url && <div className="relative mt-7 min-h-0 flex-1 overflow-hidden rounded-2xl bg-surface-blue"><Image src={card.image.url} alt={card.image.alt || card.title} fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" /></div>}
        <span className="sr-only">Technology {position + 1} of {total}</span>
      </div>
    </article>
  )
}

export function TechnologyFeatureSection({ data }: { data: HomepageTechnologyFeatureBlock }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const technologies = data.technologies?.length ? data.technologies : data.image ? [{ id: 0, index: 1, title: data.title, description: data.description || '', image: data.image }] : []
  const cardCount = Math.max(technologies.length, 1)

  useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current
      if (!section) return
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const travelled = Math.min(Math.max(-section.getBoundingClientRect().top, 0), distance)
      setScrollProgress((travelled / distance) * Math.max(cardCount - 1, 0))
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => { window.removeEventListener('scroll', updateProgress); window.removeEventListener('resize', updateProgress) }
  }, [cardCount])

  const activeIndex = Math.min(Math.floor(scrollProgress), cardCount - 1)
  const localProgress = Math.min(scrollProgress - activeIndex, 1)

  return (
    <section ref={sectionRef} id="home-technology" aria-labelledby="home-technology-heading" className="relative" style={{ minHeight: `${cardCount * 100}vh` }}>
      <div className="sticky top-0 z-10 mx-auto grid min-h-screen max-w-home-container items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[.44fr_.56fr] lg:gap-14 lg:px-8 lg:py-20">
        <div className="flex min-h-[calc(100vh-10rem)] flex-col justify-center">
          <p className="eyebrow">{data.eyebrow || 'SMILUX ADVANCED TECHNOLOGY'}</p>
          <div className="mt-4 h-1 w-12 rounded-full bg-smilux-badge" aria-hidden="true" />
          <h2 id="home-technology-heading" className="home-technology-title mt-6 font-bold leading-tight tracking-tight text-smilux-navy">
            <span className="block">{data.headingLine1 || 'Technology That'}</span>
            <span className="block">{data.headingLine2 || 'Powers Precision'}</span>
            <span className="block text-smilux-badge">{data.headingAccent || 'Smiles'}</span>
          </h2>
          <p className="home-content mt-6 max-w-xl text-smilux-navy">{data.description}</p>
          <Link href={data.ctaLink || '/services'} className="technology-cta mt-8 inline-flex w-fit items-center gap-3 rounded-xl bg-technology-button px-6 py-3 font-semibold text-white shadow-card focus-ring">
            {data.ctaLabel || 'Explore Our Technology'} <ArrowRight className="technology-cta-arrow h-4 w-4" aria-hidden="true" />
          </Link>
          <ul className="mt-10 grid grid-cols-6 overflow-hidden rounded-2xl border border-blue-100 bg-white/85" aria-label="Technology capabilities">
            {(data.features || []).slice(0, 6).map((feature, index) => { const Icon = capabilityIcons[index % capabilityIcons.length]; return <li key={feature.id || index} className="flex min-w-0 flex-col items-center justify-center gap-1 border-r border-blue-100 px-1 py-3 text-center last:border-r-0"><Icon className="h-4 w-4 shrink-0 text-smilux-badge" aria-hidden="true" /><span className="home-technology-feature-label break-words font-semibold leading-4 text-smilux-navy">{feature.title}</span></li> })}
          </ul>
        </div>
        <div className="relative h-[70vh] min-h-[520px] lg:h-[min(78vh,700px)]">
          {technologies.map((card, index) => {
            const translate = index === 0 || index <= activeIndex ? 0 : index === activeIndex + 1 ? (1 - localProgress) * 100 : 100
            return <div key={card.id || index} className="technology-card-layer absolute inset-0" style={{ transform: `translateY(${translate}%)` }}><TechnologyCard card={card} position={index} total={technologies.length} /></div>
          })}
        </div>
      </div>
    </section>
  )
}
