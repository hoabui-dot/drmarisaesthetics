'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'
import { useGlobalCta } from '@/src/components/providers/GlobalCtaProvider'

const consultationImage = 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1800&q=85'

export function ConsultationCtaSection({ id = 'consultation', content = {} }: { id?: string; content?: Record<string, unknown> }) {
  const { open } = useBookingModal()
  const globalCta = useGlobalCta()
  const text = (key: string, fallback: string) => {
    const values: Record<string, unknown> = {
      eyebrow: globalCta?.eyebrow,
      title: globalCta?.title,
      editorial_lead: globalCta?.editorialLead,
      description: globalCta?.description,
    }
    return typeof content[key] === 'string' ? content[key] as string : typeof values[key] === 'string' ? values[key] as string : fallback
  }
  const steps = globalCta?.steps?.length ? globalCta.steps : [
    { number: '01', label: 'Share your case' },
    { number: '02', label: 'Receive a preliminary review' },
    { number: '03', label: 'Arrange your consultation' },
  ]

  return <section id={id} className="stitch-section stitch-consultation" data-motion-section="cta">
    <div className="stitch-consultation__image" aria-hidden="true"><Image src={globalCta?.backgroundImage || consultationImage} alt="" fill sizes="100vw" className="object-cover" unoptimized /></div>
    <div className="stitch-consultation__wash" aria-hidden="true" />
    <div className="stitch-container">
      <div className="stitch-consultation__copy">
        <span className="stitch-kicker">{text('eyebrow', 'BEGIN YOUR JOURNEY')}</span>
        <h2>{text('title', 'Your case deserves a surgical plan built around you.')}</h2>
        <p className="stitch-editorial-lead">{text('editorial_lead', 'Your case begins with understanding your actual condition.')}</p>
        <p>{text('description', 'Send your case for a preliminary clinical review and begin a direct conversation with Dr. Maris.')}</p>
        <div className="stitch-consultation__actions"><button type="button" className="stitch-button stitch-button--dark" onClick={open}>{globalCta?.buttonLabel || 'Start Your Consultation'} <ArrowRight size={16} /></button></div>
      </div>
      <aside className="stitch-consultation__panel"><span className="stitch-kicker">{globalCta?.panelEyebrow || 'PRIVATE CONSULTATION'}</span><h3>{globalCta?.panelTitle || 'Begin with a clinical review.'}</h3><p>{globalCta?.panelDescription || 'Share your case before making travel decisions.'}</p><ol>{steps.map((step) => <li key={`${step.number}-${step.label}`}><b>{step.number}</b><span>{step.label}</span></li>)}</ol></aside>
    </div>
  </section>
}
