'use client'

import { CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'

type ServiceIndexItem = { id: string; label: string }

export function ServiceDetailSidebar({ items }: { items: ServiceIndexItem[] }) {
  const { open } = useBookingModal()
  const [activeId, setActiveId] = useState(items[0]?.id || '')

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    const frame = window.requestAnimationFrame(() => {
      const targets = items.map((item) => document.getElementById(item.id)).filter((target): target is HTMLElement => Boolean(target))
      if (!targets.length) return

      observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target instanceof HTMLElement) setActiveId(visible[0].target.id)
      }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.1] })
      targets.forEach((target) => observer?.observe(target))
    })

    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [items])

  return (
    <aside className="service-detail-index" aria-label="Service index">
      <div className="service-detail-index__scroll">
        <span>CONTENTS</span>
        <nav aria-label="Sections in this service">
          {items.map((item, index) => (
            <a href={`#${item.id}`} className={activeId === item.id ? 'is-active' : undefined} aria-current={activeId === item.id ? 'location' : undefined} key={item.id}>
              <b>{String(index + 1).padStart(2, '0')}</b>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="service-detail-index__cta">
        <h3>Ready to discuss your goals?</h3>
        <p>Schedule a private consultation with Dr. Maris.</p>
        <button type="button" onClick={open}>
          <CalendarDays size={15} aria-hidden="true" />
          Request a Consultation
        </button>
      </div>
    </aside>
  )
}
