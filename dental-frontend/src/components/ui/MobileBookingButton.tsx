'use client'

import { CalendarDays } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'

/** A mobile-only persistent consultation action; desktop navigation already carries the CTA. */
export function MobileBookingButton() {
  const { open } = useBookingModal()

  return (
    <button type="button" className="mobile-booking-button" onClick={() => open({ source: 'mobile-fixed-cta' })}>
      <CalendarDays size={17} aria-hidden="true" />
      <span>Book Consultation</span>
    </button>
  )
}
