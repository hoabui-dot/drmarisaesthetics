'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'

const consultationImage = 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1800&q=85'

export function ConsultationCtaSection({ id = 'consultation', content = {} }: { id?: string; content?: Record<string, unknown> }) {
  const { open } = useBookingModal()
  const text = (key: string, fallback: string) => typeof content[key] === 'string' ? content[key] as string : fallback

  return <section id={id} className="stitch-section stitch-consultation" data-motion-section="cta">
    <div className="stitch-consultation__image" aria-hidden="true"><Image src={consultationImage} alt="" fill sizes="100vw" className="object-cover" unoptimized /></div>
    <div className="stitch-consultation__wash" aria-hidden="true" />
    <div className="stitch-container">
      <div className="stitch-consultation__copy">
        <span className="stitch-kicker">{text('eyebrow', 'BEGIN YOUR JOURNEY')}</span>
        <h2>{text('title', 'Your case deserves a surgical plan built around you.')}</h2>
        <p className="stitch-editorial-lead">{text('editorial_lead', 'Your case begins with understanding your actual condition.')}</p>
        <p>{text('description', 'Send your case for a preliminary clinical review and begin a direct conversation with Dr. Maris.')}</p>
        <div className="stitch-consultation__actions"><button type="button" className="stitch-button stitch-button--dark" onClick={open}>Start Your Consultation <ArrowRight size={16} /></button></div>
      </div>
      <aside className="stitch-consultation__panel"><span className="stitch-kicker">PRIVATE CONSULTATION</span><h3>Begin with a clinical review.</h3><p>Share your case before making travel decisions.</p><ol><li><b>01</b><span>Share your case</span></li><li><b>02</b><span>Receive a preliminary review</span></li><li><b>03</b><span>Arrange your consultation</span></li></ol></aside>
    </div>
  </section>
}
