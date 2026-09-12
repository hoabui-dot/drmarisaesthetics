'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useInternationalPatientJourneyMotion } from '@/src/hooks/useInternationalPatientJourneyMotion'

const doctorImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0'
/* const defaultSteps = [
  ['Send Your Case', 'Submit your medical history, goals, and high-resolution photos for a preliminary clinical review.', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85', 'International patient preparing medical information for remote surgical review'],
  ['Video Consultation', 'A direct 1-on-1 video call with Dr. Maris to discuss your surgical plan, expectations, and safety.', doctorImage, 'Video consultation with Dr. Maris in a private clinical setting'],
  ['Travel Planning', 'Receive a detailed itinerary, including hospital booking and recommended recovery accommodation.', 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=85', 'International patient preparing for planned medical travel to Vietnam'],
  ['In-Person Exam', 'Final clinical examination and pre-operative testing at City International Hospital (CIH).', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85', 'Plastic surgeon conducting an in-person clinical examination'],
  ['Your Procedure', 'Surgery performed by Dr. Maris in a fully accredited international hospital setting.', 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=85', 'Plastic surgery team inside a modern operating theatre'],
  ['Recovery & Follow-Up', 'Post-operative care and long-term follow-up schedule to ensure optimal healing results.', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85', 'Patient receiving calm post-operative follow-up care'],
] as const */

const defaultSteps = [
  ['Send Your Case', 'Submit your medical history, goals, and high-resolution photos for a preliminary clinical review.', '/api/strapi-media/uploads/homepage_photo_1556761175_b413da4baf72_3ab54583a6.jpg', 'International patient preparing medical information for remote surgical review'],
  ['Video Consultation', 'A direct 1-on-1 video call with Dr. Maris to discuss your surgical plan, expectations, and safety.', '/api/strapi-media/uploads/homepage_AB_6_A_Xu_C_Teb4_K7ic_J_Oej_OC_Nmho_M1_L_97_Jimc_I6_Qtyot9_Yz_Mr51g_D3_D096_TT_551datl7elzq4_TGE_Qz_b_E_Mf8_KBA_Ua_MG_3bad945119.jpg', 'Video consultation with Dr. Maris in a private clinical setting'],
  ['Travel Planning', 'Receive a detailed itinerary, including hospital booking and recommended recovery accommodation.', '/api/strapi-media/uploads/homepage_photo_1527631746610_bca00a040d60_034b4d38c7.jpg', 'International patient preparing for planned medical travel to Vietnam'],
  ['In-Person Exam', 'Final clinical examination and pre-operative testing at City International Hospital (CIH).', '/api/strapi-media/uploads/homepage_photo_1576091160399_112ba8d25d1d_e08b866192.jpg', 'Plastic surgeon conducting an in-person clinical examination'],
  ['Your Procedure', 'Surgery performed by Dr. Maris in a fully accredited international hospital setting.', '/api/strapi-media/uploads/homepage_photo_1551076805_e1869033e561_8692844173.jpg', 'Plastic surgery team inside a modern operating theatre'],
  ['Recovery & Follow-Up', 'Post-operative care and long-term follow-up schedule to ensure optimal healing results.', '/api/strapi-media/uploads/homepage_photo_1579684385127_1ef15d508118_b8a808228d.jpg', 'Patient receiving calm post-operative follow-up care'],
] as const

type JourneyStep = { title: string; description: string; image?: unknown; image_url?: string; image_alt?: string; imageAlt?: string }

function resolveJourneyImage(value: unknown, fallback: string): string {
  const resolve = (url: string) => url.startsWith('/') ? `/api/strapi-media${url}` : url
  if (typeof value === 'string' && value) return resolve(value)
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const data = record.data && typeof record.data === 'object' ? record.data as Record<string, unknown> : record
    const attributes = data.attributes && typeof data.attributes === 'object' ? data.attributes as Record<string, unknown> : data
    if (typeof attributes.url === 'string') return resolve(attributes.url)
  }
  return fallback
}

type InternationalPatientJourneySectionProps = {
  data?: { title?: string; description?: string; steps?: unknown }
}

export function InternationalPatientJourneySection({ data }: InternationalPatientJourneySectionProps) {
  const ref = useRef<HTMLElement>(null)
  useInternationalPatientJourneyMotion(ref)
  const steps: readonly [string, string, string, string][] = Array.isArray(data?.steps) && data.steps.every((step) => typeof step === 'object')
    ? (data.steps as JourneyStep[]).map((step, index) => [
      step.title || defaultSteps[index]?.[0] || '',
      step.description || defaultSteps[index]?.[1] || '',
      resolveJourneyImage(step.image || step.image_url, defaultSteps[index]?.[2] || ''),
      step.image_alt || step.imageAlt || defaultSteps[index]?.[3] || '',
    ])
    : defaultSteps.map(([title, description, image, alt]) => [title, description, image, alt])
  const journeyTitle = data?.title || 'Your International Patient Journey'
  const journeyDescription = data?.description || 'A seamless, medically-supervised experience from your first inquiry to your final recovery.'
  return <section ref={ref} id="journey" className="stitch-section stitch-surface stitch-journey" data-journey-module>
    <div className="stitch-journey-pin" data-journey-pin><div className="stitch-journey-intro"><span className="stitch-journey-intro__eyebrow">The Process</span><h2 data-journey-intro>{journeyTitle}</h2><p className="stitch-journey-intro__subtitle">{journeyDescription}</p></div><div className="stitch-journey-layout"><aside className="stitch-journey-indicator" aria-label="International patient journey progress"><div className="stitch-journey-indicator__rail"><span className="stitch-journey-indicator__track" aria-hidden="true" /><span className="stitch-journey-indicator__progress" data-journey-progress aria-hidden="true" />{steps.map(([title], index) => <span className="stitch-journey-indicator__step" data-journey-indicator key={title}><b>0{index + 1}</b><span>{title}</span></span>)}</div></aside><div className="stitch-journey-content"><div className="stitch-journey-copy">{steps.map(([title, copy, image, alt], index) => <article key={title} data-journey-step><span className="stitch-journey-number" aria-hidden="true">0{index + 1}</span><div className="stitch-journey-mobile-image"><Image src={image} alt={alt} fill sizes="100vw" className="object-cover" unoptimized /></div><h3>{title}</h3><p>{copy}</p></article>)}</div></div><div className="stitch-journey-visual"><div className="stitch-journey-visual__frame">{steps.map(([title, , image, alt]) => <div className="stitch-journey-visual__image" data-journey-visual key={title}><Image src={image} alt={alt} fill sizes="(max-width: 900px) 100vw, 48vw" className="object-cover" unoptimized /></div>)}</div><span className="stitch-journey-visual__caption">DR. MARIS AESTHETICS / HO CHI MINH CITY</span></div></div></div>
  </section>
}
