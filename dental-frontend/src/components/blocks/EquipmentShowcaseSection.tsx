'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { HomepageEquipmentShowcaseBlock } from '@/src/types/strapi'

const DEFAULT_DEVICES = [
  { title: '3D Cone Beam CT', description: 'Accurate 3D imaging for precise diagnosis' },
  { title: 'Intraoral Scanner', description: 'Digital impressions for better comfort' },
  { title: 'CAD/CAM Technology', description: 'Precision smile design and restorations' },
  { title: 'Advanced Surgical Care', description: 'Hospital-based procedures supported by precise clinical planning' },
]

export function EquipmentShowcaseSection({ data }: { data: HomepageEquipmentShowcaseBlock }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const firstSetRef = useRef<HTMLDivElement>(null)
  const items = data.items.length ? data.items : DEFAULT_DEVICES.map((device, index) => ({ id: index, ...device }))

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const firstSet = firstSetRef.current
    if (!viewport || !track || !firstSet || items.length < 2) return

    let frame = 0
    let offset = 0
    let setWidth = 0
    let lastTime = 0
    const speed = 14

    const measure = () => {
      setWidth = firstSet.getBoundingClientRect().width
      offset = -setWidth
      track.style.transform = `translate3d(${offset}px, 0, 0)`
    }

    const tick = (time: number) => {
      if (!lastTime) lastTime = time
      const delta = Math.min(time - lastTime, 64)
      lastTime = time
      if (setWidth > 0) {
        offset += (speed * delta) / 1000
        if (offset >= 0) offset -= setWidth
        track.style.transform = `translate3d(${offset}px, 0, 0)`
      }
      frame = window.requestAnimationFrame(tick)
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(viewport)
    resizeObserver.observe(firstSet)
    frame = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [items.length])

  const renderCard = (item: HomepageEquipmentShowcaseBlock['items'][number], index: number) => (
    <article key={`${item.id}-${index}`} className="device-slider-card">
      <div className="device-slider-media">
        {item.image?.url && <Image src={item.image.url} alt={item.image.alt || item.imageAlt || item.title} fill sizes="(max-width: 767px) 82vw, (max-width: 1023px) 44vw, 280px" className="object-contain p-5" />}
      </div>
      <div className="device-slider-content">
        <h3>{item.title}</h3>
        {item.description && <p>{item.description}</p>}
      </div>
    </article>
  )

  return (
    <section id="home-devices" className="device-slider-section" aria-labelledby="home-devices-heading">
      <div className="mx-auto max-w-home-container px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="sr-only"><h2 id="home-devices-heading">{data.title || 'Advanced surgical technology'}</h2></div>
        <div ref={viewportRef} className="device-slider-viewport" aria-label="Surgical technology">
          <div ref={trackRef} className="device-slider-track">
            <div ref={firstSetRef} className="device-slider-set">{items.map(renderCard)}</div>
            <div className="device-slider-set" aria-hidden="true">{items.map(renderCard)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
