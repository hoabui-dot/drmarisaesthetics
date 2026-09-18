'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { type CSSProperties, useRef, useState } from 'react'

type Doctor = {
  id: number | string
  name: string
  specialization?: string
  image?: { url: string; alt?: string }
  profileLink?: string
  linkedinUrl?: string
  highlights?: string[]
}

type DoctorsData = {
  title?: string
  viewAllLabel?: string
  viewAllLink?: string
  doctors?: Doctor[]
}

function formatDoctorName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part === 'dr.' || part === 'dr' ? 'Dr.' : `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="about-doctor-card group relative z-0 flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-smilux-border bg-white shadow-card transition-transform duration-300 hover:z-10 hover:scale-[1.03]">
      <div className="relative h-64 shrink-0 bg-surface-subtle sm:h-72">
        {doctor.image?.url ? (
          <Image src={doctor.image.url} alt={doctor.image.alt || doctor.name} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" className="object-contain object-bottom" />
        ) : (
          <div className="flex h-full items-center justify-center text-smilux-muted" aria-label={`${doctor.name} portrait unavailable`}>Portrait unavailable</div>
        )}
      </div>
      <div className="flex min-h-64 flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-size-about-card-title font-bold leading-tight text-smilux-navy">{formatDoctorName(doctor.name)}</h3>
        {doctor.specialization && <p className="mt-2 text-size-body font-semibold text-smilux-hero-primary">{doctor.specialization}</p>}
        {!!doctor.highlights?.length && (
          <ul className="mt-4 space-y-2 text-size-body text-smilux-navy/75">
            {doctor.highlights.slice(0, 3).map((highlight) => <li key={highlight} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-smilux-hero-primary" aria-hidden="true" /><span>{highlight}</span></li>)}
          </ul>
        )}
        {doctor.linkedinUrl && (
          <a href={doctor.linkedinUrl} target="_blank" rel="noreferrer" aria-label={`${doctor.name} on LinkedIn`} className="mt-auto flex h-8 w-8 items-center justify-center rounded-full bg-smilux-hero-primary text-white transition-colors hover:bg-smilux-primary-hover">
            <span className="text-size-small font-bold leading-none" aria-hidden="true">in</span>
          </a>
        )}
      </div>
    </article>
  )
}

export function AboutDoctorsSlider({ data }: { data?: DoctorsData | null }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [canGoPrevious, setCanGoPrevious] = useState(false)
  const [canGoNext, setCanGoNext] = useState(true)
  const doctors = data?.doctors || []

  const updateArrowState = () => {
    const viewport = viewportRef.current
    if (!viewport) return
    setCanGoPrevious(viewport.scrollLeft > 2)
    setCanGoNext(viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 2)
  }

  const move = (direction: -1 | 1) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const card = viewport.querySelector<HTMLElement>('[data-about-doctor-card]')
    const gap = Number.parseFloat(getComputedStyle(viewport).getPropertyValue('--about-doctors-gap')) || 20
    viewport.scrollBy({ left: direction * ((card?.offsetWidth || viewport.clientWidth) + gap), behavior: 'smooth' })
    window.setTimeout(updateArrowState, 350)
  }

  return (
    <section id="about-doctors" aria-labelledby="about-doctors-heading" className="about-doctors-section">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <header className="text-center">
          <h2 id="about-doctors-heading" className="text-size-about-title font-bold leading-tight text-smilux-navy">{data?.title || 'Meet Our Doctors'}</h2>
          <span className="mx-auto mt-4 block h-0.5 w-12 bg-smilux-hero-primary" aria-hidden="true" />
        </header>

        <div className="relative mt-10 flex items-center gap-3 sm:gap-5">
          <button type="button" onClick={() => move(-1)} disabled={!canGoPrevious} aria-label="Previous doctors" className="about-doctors-arrow" aria-disabled={!canGoPrevious}><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
          <div ref={viewportRef} onScroll={updateArrowState} className="about-doctors-viewport min-w-0 flex-1" style={{ '--about-doctors-gap': '20px' } as CSSProperties}>
            <div className="about-doctors-track">
            {doctors.map((doctor) => <div key={doctor.id} data-about-doctor-card className="about-doctors-slide"><DoctorCard doctor={doctor} /></div>)}
            </div>
          </div>
          <button type="button" onClick={() => move(1)} disabled={!canGoNext} aria-label="Next doctors" className="about-doctors-arrow" aria-disabled={!canGoNext}><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
        </div>

        <div className="mt-10 text-center">
          <Link href={data?.viewAllLink || '/our-team'} className="inline-flex items-center justify-center rounded-full border border-smilux-hero-primary bg-white px-7 py-3 text-size-body font-bold tracking-wide text-smilux-hero-primary transition-colors hover:bg-smilux-hero-primary hover:text-white">
            {data?.viewAllLabel || 'VIEW ALL DOCTORS'}
          </Link>
        </div>
      </div>
    </section>
  )
}
