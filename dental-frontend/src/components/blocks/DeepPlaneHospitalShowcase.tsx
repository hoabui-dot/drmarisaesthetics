'use client'

import Image from 'next/image'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { GoogleMapEmbed } from '@/src/components/ui/google-map-embed'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export interface HospitalShowcaseItem {
  abbreviation: string
  name: string
  short_name?: string
  address: string
  maps_directions_url?: string
  exterior_image_url: string
  exterior_image_alt?: string
}

interface HospitalMapLocation {
  locationKey: 'HIU' | 'CIH'
  name: string
  address: string
  latitude?: number
  longitude?: number
  mapsEmbedUrl?: string
  mapsPlaceUrl?: string
  mapsSearchQuery?: string
}

export function DeepPlaneHospitalShowcase({
  hospitals: sourceHospitals,
  locations = [],
}: {
  hospitals: HospitalShowcaseItem[]
  locations?: HospitalMapLocation[]
}) {
  const rootRef = useRef<HTMLElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const activeIdRef = useRef('HIU')
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [activeId, setActiveId] = useState('HIU')
  const [outgoing, setOutgoing] = useState<HospitalShowcaseItem | null>(null)
  const [imageReady, setImageReady] = useState(true)

  const hospitals = useMemo(() => sourceHospitals
    .map((hospital) => {
      const location = locations.find((item) => item.locationKey === hospital.abbreviation)
      return location
        ? {
          ...hospital,
          name: location.name,
          address: location.address,
          mapsUrl: location.mapsPlaceUrl || hospital.maps_directions_url || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`,
          mapLocation: location,
        }
        : {
          ...hospital,
          mapsUrl: hospital.maps_directions_url || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.address)}`,
          mapLocation: undefined,
        }
    })
    .filter((hospital) => ['HIU', 'CIH'].includes(hospital.abbreviation) && hospital.name && hospital.address && hospital.exterior_image_url)
    .sort((a, b) => ['HIU', 'CIH'].indexOf(a.abbreviation) - ['HIU', 'CIH'].indexOf(b.abbreviation))
    .slice(0, 2), [locations, sourceHospitals])
  const active = hospitals.find((hospital) => hospital.abbreviation === activeId) || hospitals[0]
  const activeMapQuery = active?.mapLocation?.latitude != null && active.mapLocation.longitude != null
    ? `${active.mapLocation.latitude},${active.mapLocation.longitude}`
    : active?.mapLocation?.mapsSearchQuery || `${active?.name || ''}, ${active?.address || ''}`

  useEffect(() => {
    hospitals.forEach((hospital) => {
      const preload = new window.Image()
      preload.src = hospital.exterior_image_url
    })
  }, [hospitals])

  useGSAP(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const targets = root.querySelectorAll<HTMLElement>('[data-hospital-showcase-entrance]')
    gsap.from(targets, {
      autoAlpha: 0,
      y: 16,
      duration: 0.65,
      stagger: 0.07,
      ease: 'power3.out',
      scrollTrigger: { trigger: root, start: 'top 82%', once: true },
    })
  }, { scope: rootRef })

  useLayoutEffect(() => {
    if (!active || !outgoing || !imageReady) return
    const root = rootRef.current
    const incomingImage = root?.querySelector<HTMLElement>('[data-hospital-showcase-image="active"]')
    const outgoingImage = root?.querySelector<HTMLElement>('[data-hospital-showcase-image="outgoing"]')
    const content = root?.querySelectorAll<HTMLElement>('[data-hospital-showcase-content]')
    if (!root || !incomingImage) return

    timelineRef.current?.kill()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOutgoing(null)
      return
    }

    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        if (activeIdRef.current === active.abbreviation) setOutgoing(null)
      },
    })
    timelineRef.current = timeline
    if (outgoingImage) timeline.to(outgoingImage, { autoAlpha: 0, scale: 1, duration: 0.55, ease: 'power3.inOut' }, 0)
    timeline.fromTo(incomingImage,
      { autoAlpha: 0, scale: 1.07, clipPath: 'inset(0 0 0 8%)' },
      { autoAlpha: 1, scale: 1, clipPath: 'inset(0 0 0 0%)', duration: 0.72, ease: 'power3.inOut' },
      0,
    )
    if (content?.length) timeline.fromTo(content,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power3.out' },
      0.16,
    )
    return () => { timeline.kill() }
  }, [active, imageReady, outgoing])

  const selectHospital = useCallback((next: HospitalShowcaseItem) => {
    if (next.abbreviation === activeIdRef.current) return
    const current = hospitals.find((hospital) => hospital.abbreviation === activeIdRef.current)
    timelineRef.current?.kill()
    setOutgoing(current || null)
    setImageReady(false)
    activeIdRef.current = next.abbreviation
    setActiveId(next.abbreviation)
  }, [hospitals])

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!hospitals.length) return
    const activeIndex = active ? hospitals.indexOf(active) : 0
    let index = activeIndex
    if (event.key === 'ArrowRight') index = (activeIndex + 1) % hospitals.length
    else if (event.key === 'ArrowLeft') index = (activeIndex - 1 + hospitals.length) % hospitals.length
    else if (event.key === 'Home') index = 0
    else if (event.key === 'End') index = hospitals.length - 1
    else return
    event.preventDefault()
    const next = hospitals[index]
    selectHospital(next)
    tabRefs.current[next.abbreviation]?.focus()
  }

  const animateImageHover = (entering: boolean) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(max-width: 900px)').matches) return
    const image = rootRef.current?.querySelector<HTMLElement>('[data-hospital-showcase-image="active"]')
    if (image) gsap.to(image, { scale: entering ? 1.035 : 1, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })
  }

  if (!active || hospitals.length < 2) return null

  return (
    <section ref={rootRef} className="deep-plane-hospital-showcase" aria-labelledby="deep-plane-hospital-showcase-title">
      <span className="deep-plane-facelift__eyebrow" data-hospital-showcase-entrance>SURGICAL PRACTICE &amp; FACILITIES</span>
      <h2 id="deep-plane-hospital-showcase-title" data-hospital-showcase-entrance>Our Hospital Facilities</h2>

      <div className="deep-plane-hospital-showcase__tabs" data-active-index={Math.max(0, hospitals.findIndex((hospital) => hospital.abbreviation === active.abbreviation))} role="tablist" aria-label="Choose hospital" data-hospital-showcase-entrance>
        <span className="deep-plane-hospital-showcase__indicator" aria-hidden="true" />
        {hospitals.map((hospital) => {
          const selected = hospital.abbreviation === active.abbreviation
          return <button
            key={hospital.abbreviation}
            ref={(node) => { tabRefs.current[hospital.abbreviation] = node }}
            id={`deep-plane-hospital-tab-${hospital.abbreviation.toLowerCase()}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="deep-plane-hospital-panel"
            tabIndex={selected ? 0 : -1}
            className={`deep-plane-hospital-showcase__tab${selected ? ' is-active' : ''}`}
            onClick={() => selectHospital(hospital)}
            onKeyDown={handleTabKeyDown}
          >{hospital.short_name || (hospital.abbreviation === 'HIU' ? 'HIU Hospital' : 'CIH Hospital')}</button>
        })}
      </div>

      <div className="deep-plane-hospital-showcase__image-stage" data-hospital-showcase-entrance onMouseEnter={() => animateImageHover(true)} onMouseLeave={() => animateImageHover(false)}>
        {outgoing && outgoing.abbreviation !== active.abbreviation && <Image
          key={`outgoing-${outgoing.abbreviation}`}
          data-hospital-showcase-image="outgoing"
          className="deep-plane-hospital-showcase__image deep-plane-hospital-showcase__image--outgoing"
          src={outgoing.exterior_image_url}
          alt={outgoing.exterior_image_alt || `${outgoing.name} exterior`}
          fill
          sizes="(max-width: 900px) 100vw, 40vw"
          unoptimized
          aria-hidden="true"
        />}
        <Image
          key={`active-${active.abbreviation}`}
          data-hospital-showcase-image="active"
          className={`deep-plane-hospital-showcase__image${outgoing ? ' deep-plane-hospital-showcase__image--incoming' : ''}`}
          src={active.exterior_image_url}
          alt={active.exterior_image_alt || `${active.name} exterior`}
          fill
          sizes="(max-width: 900px) 100vw, 40vw"
          unoptimized
          onLoad={() => setImageReady(true)}
          priority={false}
        />
        <span className="deep-plane-hospital-showcase__image-name" aria-live="polite">{active.name}</span>
      </div>

      <div id="deep-plane-hospital-panel" className="deep-plane-hospital-showcase__map" role="tabpanel" aria-labelledby={`deep-plane-hospital-tab-${active.abbreviation.toLowerCase()}`}>
        <GoogleMapEmbed
          key={`${active.abbreviation}-${active.mapLocation?.mapsEmbedUrl || active.address}`}
          lat={Number(active.mapLocation?.latitude) || 0}
          lng={Number(active.mapLocation?.longitude) || 0}
          zoom={17}
          query={activeMapQuery}
          embedUrl={active.mapLocation?.mapsEmbedUrl}
          placeUrl={active.mapLocation?.mapsPlaceUrl}
          title={`Google Maps preview for ${active.name}`}
          className="deep-plane-hospital-showcase__map-frame"
        />
      </div>
    </section>
  )
}
