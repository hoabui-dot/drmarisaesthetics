'use client'

import Image from 'next/image'
import { useCallback, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { MapPin } from 'lucide-react'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { GoogleMapEmbed } from '@/src/components/ui/google-map-embed'

gsap.registerPlugin(Flip, ScrollTrigger, useGSAP)

export interface ContactHospitalLocation {
  id?: string | number
  chapter?: string
  abbreviation: string
  name: string
  short_name?: string
  address: string
  description?: string
  website?: string
  source_url?: string
  maps_directions_url?: string
  maps_embed_url?: string
  exterior_image_url: string
  exterior_image_alt: string
}

interface ClinicLocationData {
  eyebrow?: string
  title: string
  description?: string
}

export interface ContactMapSettings {
  phonePrimary?: string
  openingHours?: string
  hospitalLocations?: Array<{ locationKey: 'HIU' | 'CIH'; name: string; address: string; latitude?: number; longitude?: number; mapsEmbedUrl?: string; mapsPlaceUrl?: string; mapsSearchQuery?: string }>
  contactMethods?: Array<{ type: string; label: string; href: string; color?: string; order?: number }>
}

function hospitalId(hospital: ContactHospitalLocation) {
  return hospital.abbreviation.toLowerCase()
}

export function ContactClinicLocationSection({
  data,
  hospitals: hospitalData,
  websiteSettings,
}: {
  data: ClinicLocationData
  hospitals: ContactHospitalLocation[]
  websiteSettings?: ContactMapSettings
}) {
  const rootRef = useRef<HTMLElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const activeIdRef = useRef<string | null>(null)
  const [activeId, setActiveId] = useState('hiu')
  const [outgoingHospital, setOutgoingHospital] = useState<ContactHospitalLocation | null>(null)

  const hospitals = useMemo(() => [...(hospitalData || [])]
    .map((hospital) => {
      const location = websiteSettings?.hospitalLocations?.find((entry) => entry.locationKey === hospital.abbreviation)
      return location ? { ...hospital, name: location.name, address: location.address } : hospital
    })
    .filter((hospital) => ['hiu', 'cih'].includes(hospitalId(hospital)) && hospital.name && hospital.address && hospital.exterior_image_url)
    .sort((a, b) => {
      const order = ['hiu', 'cih']
      return order.indexOf(hospitalId(a)) - order.indexOf(hospitalId(b))
    })
    .slice(0, 2), [hospitalData, websiteSettings?.hospitalLocations])
  const activeHospital = hospitals.find((hospital) => hospitalId(hospital) === activeId) || hospitals[0]
  const activeHospitalId = activeHospital ? hospitalId(activeHospital) : ''
  const activeHospitalMap = activeHospital
    ? websiteSettings?.hospitalLocations?.find((location) => location.locationKey === activeHospital.abbreviation)
    : undefined

  useGSAP(() => {
    const section = rootRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const targets = section.querySelectorAll<HTMLElement>(
      '[data-location-heading], [data-location-tabs], [data-location-visual], [data-location-information]',
    )
    gsap.from(targets, {
      autoAlpha: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 82%', once: true },
    })
  }, { scope: rootRef })

  useLayoutEffect(() => {
    const indicator = indicatorRef.current
    const tab = tabRefs.current[activeHospitalId]
    const tabs = tabsRef.current
    if (!indicator || !tab || !tabs) return
    const x = tab.offsetLeft - tabs.clientLeft
    const width = tab.offsetWidth
    if (activeIdRef.current === null) {
      gsap.set(indicator, { x, width })
    } else {
      const state = Flip.getState(indicator)
      gsap.set(indicator, { x, width })
      Flip.from(state, { duration: 0.4, ease: 'power3.out', absolute: true })
    }
    activeIdRef.current = activeHospitalId
  }, [activeHospitalId])

  useLayoutEffect(() => {
    if (!activeHospital || !outgoingHospital) return
    const section = rootRef.current
    const incoming = section?.querySelector<HTMLElement>('[data-location-active-image]')
    const outgoing = section?.querySelector<HTMLElement>('[data-location-outgoing-image]')
    const information = section?.querySelector<HTMLElement>('[data-location-information-content]')
    if (!section || !incoming) return

    timelineRef.current?.kill()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([incoming, information].filter(Boolean), { clearProps: 'all' })
      setOutgoingHospital(null)
      return
    }

    const transitionId = activeHospitalId
    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        if (activeIdRef.current === transitionId) setOutgoingHospital(null)
      },
    })
    timelineRef.current = timeline
    if (outgoing) timeline.to(outgoing, { autoAlpha: 0, scale: 1, duration: 0.68, ease: 'power3.inOut' }, 0)
    timeline.fromTo(incoming,
      { autoAlpha: 0, scale: 1.06, clipPath: 'inset(0 0 0 7%)' },
      { autoAlpha: 1, scale: 1, clipPath: 'inset(0 0 0 0%)', duration: 0.72, ease: 'power3.inOut' },
      0,
    )
    if (information) timeline.fromTo(information, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power3.out' }, 0.22)
    return () => { timeline.kill() }
  }, [activeHospital, activeHospitalId, outgoingHospital])

  const selectHospital = useCallback((hospital: ContactHospitalLocation) => {
    const nextId = hospitalId(hospital)
    if (nextId === activeIdRef.current) return
    const current = hospitals.find((item) => hospitalId(item) === activeIdRef.current) || activeHospital
    timelineRef.current?.kill()
    setOutgoingHospital(current || null)
    activeIdRef.current = nextId
    setActiveId(nextId)
  }, [activeHospital, hospitals])

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = hospitals.findIndex((hospital) => hospitalId(hospital) === activeHospitalId)
    let nextIndex = currentIndex
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % hospitals.length
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + hospitals.length) % hospitals.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = hospitals.length - 1
    else return
    event.preventDefault()
    const next = hospitals[nextIndex]
    selectHospital(next)
    tabRefs.current[hospitalId(next)]?.focus()
  }

  const animateImageHover = (entering: boolean) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(max-width: 1023px)').matches) return
    const image = rootRef.current?.querySelector<HTMLElement>('[data-location-active-image]')
    if (image) gsap.to(image, { scale: entering ? 1.035 : 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
  }

  if (!activeHospital || hospitals.length === 0) return null

  // Search by the hospital's known place text so Google can load its place
  // preview card. Raw coordinates draw a pin but often produce "Place info
  // couldn't load" because they do not identify a Google place. HIU can use a
  // Vietnamese search string from Website Settings; CIH falls back to English.
  const activeMapQuery = activeHospitalMap?.mapsSearchQuery?.trim()
    || `${activeHospitalMap?.name || activeHospital.name}, ${activeHospitalMap?.address || activeHospital.address}`
  const activeImage = (hospital: ContactHospitalLocation, kind: 'active' | 'outgoing') => (
    <Image
      key={`${kind}-${hospitalId(hospital)}`}
      data-location-active-image={kind === 'active' ? '' : undefined}
      data-location-outgoing-image={kind === 'outgoing' ? '' : undefined}
      src={hospital.exterior_image_url}
      alt={hospital.exterior_image_alt || `${hospital.name} exterior`}
      fill
      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 55vw, 52vw"
      unoptimized
      loading="lazy"
      priority={false}
    />
  )

  return (
    <section ref={rootRef} className="contact-clinic-location" aria-labelledby="contact-clinic-location-title">
      <div className="contact-clinic-location__container">
        <header className="contact-clinic-location__heading" data-location-heading>
          <span className="stitch-kicker">{data.eyebrow || 'HOSPITAL LOCATIONS'}</span>
          <h2 id="contact-clinic-location-title">{data.title}</h2>
          {data.description ? <p>{data.description}</p> : null}
        </header>

        <div ref={tabsRef} className="contact-clinic-location__tabs" role="tablist" aria-label="Select a hospital location" data-location-tabs>
          <span ref={indicatorRef} className="contact-clinic-location__tab-indicator" aria-hidden="true" />
          {hospitals.map((hospital, index) => {
            const id = hospitalId(hospital)
            const selected = id === activeHospitalId
            return (
              <button
                key={id}
                ref={(node) => { tabRefs.current[id] = node }}
                id={`contact-hospital-tab-${id}`}
                className={`contact-clinic-location__tab${selected ? ' is-active' : ''}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="contact-hospital-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => selectHospital(hospital)}
                onKeyDown={handleTabKeyDown}
              >
                <span className="contact-clinic-location__tab-index">0{index + 1}</span>
                <span className="contact-clinic-location__tab-name">{hospital.short_name || hospital.name}</span>
              </button>
            )
          })}
        </div>

        <div className="contact-clinic-location__layout">
          <div className="contact-clinic-location__visual" data-location-visual onMouseEnter={() => animateImageHover(true)} onMouseLeave={() => animateImageHover(false)}>
            <div className="contact-clinic-location__image-stage">
              {outgoingHospital && hospitalId(outgoingHospital) !== activeHospitalId ? activeImage(outgoingHospital, 'outgoing') : null}
              {activeImage(activeHospital, 'active')}
              <div className="contact-clinic-location__image-caption" aria-live="polite">
                <MapPin size={16} aria-hidden="true" />
                <span>{activeHospital.short_name || activeHospital.name}</span>
              </div>
            </div>
          </div>

          <div
            id="contact-hospital-panel"
            className="contact-clinic-location__information"
            role="tabpanel"
            aria-labelledby={`contact-hospital-tab-${activeHospitalId}`}
            tabIndex={0}
            data-location-information
          >
            <div className="contact-clinic-location__information-content" data-location-information-content key={activeHospitalId}>
              <div className="contact-clinic-location__map-preview" aria-label={`Map preview for ${activeHospital.name}`}>
                <GoogleMapEmbed
                  key={activeHospitalId}
                  lat={activeHospitalMap?.latitude ?? 0}
                  lng={activeHospitalMap?.longitude ?? 0}
                  zoom={17}
                  query={activeMapQuery}
                  embedUrl={activeHospitalMap?.mapsEmbedUrl}
                  placeUrl={activeHospitalMap?.mapsPlaceUrl}
                  title={`Google Maps preview for ${activeHospitalMap?.name || activeHospital.name}`}
                  className="contact-clinic-location__map"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
