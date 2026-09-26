'use client'
/* The exported Stitch screen uses anchor links for its in-page and legacy routes. */
/* eslint-disable @next/next/no-html-link-for-pages */

import Image from 'next/image'
import { ArrowRight, CheckCircle2, CalendarDays } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'
import { useHomepageMotion } from '@/src/hooks/useHomepageMotion'
import { useSignatureProceduresMotion } from '@/src/hooks/useSignatureProceduresMotion'
import { resultsMockData } from '@/src/data/results'
import { InternationalPatientJourneySection } from '@/src/components/homepage/InternationalPatientJourneySection'
import { PlanningProcessSection, planningSteps } from '@/src/components/homepage/PlanningProcessSection'
import { PatientResultsGallerySection } from '@/src/components/homepage/PatientResultsGallerySection'
import { MotionFaqAccordion } from '@/src/components/ui/motion-faq-accordion'
import { ConsultationCtaSection } from '@/src/components/blocks/ConsultationCtaSection'
import { useOurTeamMotion } from '@/src/hooks/useOurTeamMotion'
import { useRef } from 'react'
import type { HomepageEditorialData } from '@/src/types/homepage-editorial'
import type { ResultsData } from '@/src/data/results'
import { getMediaUrl } from '@/src/lib/api/queries'
import { HomepageYoutubeSection } from '@/src/components/homepage/HomepageYoutubeSection'

/* const legacyImages = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0',
  heroDoctor: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0',
  doctor: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0',
  clinic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxLNXCFVyLcdlfs3uKkXCF1nWzjOTlVHjbpSP07wg76cD4otnSBnmCAAt1Q57Tyj15rO6f8Z6857zzPhjjWAmXaeErAAZnwu6mADqs3tc98ftky9z2AYeSGQb0fDf_TJgY_52sEsTvavziZQJlySwrko2v_jKxGIpfSjrhbY2TDZfq64krwVmF90rBv7n4UMWEk2pyh4qcEwDImDsvTDEw7iLuJAeoRqbp3rlrmpdS1aQ7tLL7vbdw5g',
  aboutHospital: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1LCeH-Ppjwbtbg4zULKHP3OYSwQrWS6JnKRpkXMJKfp-4xvfAuEibObKn17fqXDLCQqZ35tFmBIgGFP_Cb7BXwHWQE3g35huXXerG_hLfwuFpyoDtba24X29bZ1Tu7ki0OyueVd7K1JGxneXkimaHpIVJhm8fXx9mYYvtyW5FyZ3en95kLINrU96c5hMMz991fP7-hMAfwKX2w1wBd_ry7gZ-kQ-qs3c399WfmNb4I8xBUGfCVVs3HQ',
  technology: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1800&q=85',
} */

// CMS media is the source of truth. These local proxy paths are only a safe
// fallback for the static editorial variants rendered by this component.
const images = {
  hero: '/api/strapi-media/uploads/homepage_AB_6_A_Xu_C_Teb4_K7ic_J_Oej_OC_Nmho_M1_L_97_Jimc_I6_Qtyot9_Yz_Mr51g_D3_D096_TT_551datl7elzq4_TGE_Qz_b_E_Mf8_KBA_Ua_MG_3bad945119.jpg',
  heroDoctor: '/api/strapi-media/uploads/homepage_AB_6_A_Xu_C_Teb4_K7ic_J_Oej_OC_Nmho_M1_L_97_Jimc_I6_Qtyot9_Yz_Mr51g_D3_D096_TT_551datl7elzq4_TGE_Qz_b_E_Mf8_KBA_Ua_MG_3bad945119.jpg',
  doctor: '/api/strapi-media/uploads/homepage_AB_6_A_Xu_C_Teb4_K7ic_J_Oej_OC_Nmho_M1_L_97_Jimc_I6_Qtyot9_Yz_Mr51g_D3_D096_TT_551datl7elzq4_TGE_Qz_b_E_Mf8_KBA_Ua_MG_3bad945119.jpg',
  clinic: '/api/strapi-media/uploads/clinic_b23afb0268.jpg',
  aboutHospital: '/api/strapi-media/uploads/about_clinic_reception_42f5c64fe4.jpg',
  technology: '/api/strapi-media/uploads/homepage_photo_1551076805_e1869033e561_8692844173.jpg',
}

function ConsultationButton({ children = 'REQUEST A CONSULTATION', className = 'stitch-button stitch-button--dark' }: { children?: React.ReactNode; className?: string }) {
  const { open } = useBookingModal()
  return <button type="button" onClick={open} className={`booking-inline-cta ${className}`.trim()}><CalendarDays size={16} />{children}</button>
}

const process = [
  ['01', 'Consultation', 'Discuss concerns, goals, medical history and previous procedures.'],
  ['02', 'Examination', 'Assess anatomy and individual condition.'],
  ['03', 'Surgical Planning', 'Develop the surgical plan around the patient rather than a standard package.'],
  ['04', 'Surgery', 'Dr. Maris personally performs the procedure.'],
  ['05', 'Follow-Up', 'Recovery and postoperative progress remain part of the surgical process.'],
]

const aboutPlanningSteps = planningSteps.map((step, index) => {
  const content = [
    ['Consultation', 'Discuss concerns, goals, medical history and previous procedures directly with the surgeon.'],
    ['Examination', 'Assess anatomy, tissue condition and individual suitability before discussing a procedure.'],
    ['Surgical Planning', 'Develop a plan around the patient rather than a standard package or procedure menu.'],
    ['Surgery', 'Dr. Maris personally performs the procedure in an accredited hospital environment.'],
    ['Recovery & Follow-Up', 'Recovery and postoperative progress remain part of the surgeon-led process.'],
    ['Long-Term Care', 'Follow-up remains available as your result settles and your long-term goals evolve.'],
  ][index]

  return { ...step, title: content[0], description: content[1] }
})

const revisionConcerns = ['Capsular Contracture', 'Asymmetry Correction', 'Excessive Scar Tissue', 'Implant Malposition', 'Over-resected Rhinoplasty', 'Contour Irregularities', 'Unsatisfactory Functional Outcomes']

const signatureProcedures = [
  ['01', 'Rhinoplasty', 'Refined facial balance with a plan built around your anatomy.', resultsMockData.cases[1].image || resultsMockData.cases[1].afterImage, resultsMockData.cases[1].imageAlt || resultsMockData.cases[1].afterAlt],
  ['02', 'Breast Surgery', 'Personalized proportion, implant planning and long-term support.', images.technology, 'Premium clinical consultation environment'],
  ['03', 'Body Contouring', 'Thoughtful contouring designed for natural movement and recovery.', images.clinic, 'City International Hospital facility'],
  ['04', 'Revision Surgery', 'Complex correction begins with understanding what came before.', resultsMockData.cases[0].image || resultsMockData.cases[0].afterImage, resultsMockData.cases[0].imageAlt || resultsMockData.cases[0].afterAlt],
]

function StitchImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className={`object-cover ${className}`} unoptimized />
}

function ResponsiveStitchImage({ desktopSrc, mobileSrc, alt }: { desktopSrc: string; mobileSrc?: string; alt: string }) {
  return <>
    <StitchImage src={desktopSrc} alt={alt} className={mobileSrc ? 'stitch-responsive-image--desktop' : ''} />
    {mobileSrc ? <StitchImage src={mobileSrc} alt={alt} className="stitch-responsive-image--mobile" /> : null}
  </>
}

export function StitchHomepage({ data, results }: { data?: HomepageEditorialData; results?: ResultsData | null }) {
  const homepageRef = useRef<HTMLDivElement>(null)
  useHomepageMotion(homepageRef)
  useSignatureProceduresMotion(homepageRef)
  const hero = data?.hero_content ?? {}
  const video = data?.video_section ?? {}
  const signature = data?.signature_procedures ?? {}
  const method = data?.maris_method ?? data?.surgical_care_process ?? {}
  const revision = data?.revision_surgery ?? {}
  const hospital = data?.hospital_based_surgery ?? {}
  const journey = data?.international_journey ?? {}
  const consultation = data?.consultation ?? {}
  const patientResults = data?.patient_results ?? {}
  const faqContent = data?.frequently_asked_questions
  const faq = Array.isArray(faqContent)
    ? faqContent
    : faqContent && typeof faqContent === 'object' && Array.isArray((faqContent as Record<string, unknown>).items)
      ? (faqContent as Record<string, unknown>).items
      : homepageFaq
  const heroTitle = typeof hero.title === 'string' && hero.title.trim()
    ? hero.title.trim()
    : 'Plastic Surgery in Vietnam for International Patients'
  const heroParagraphs = Array.isArray(hero.paragraphs) ? hero.paragraphs.filter((value): value is string => typeof value === 'string') : []
  const heroDescription = typeof hero.paragraph_one === 'string' && hero.paragraph_one.trim()
    ? hero.paragraph_one
    : heroParagraphs[0] || (typeof hero.description === 'string' ? hero.description : '')
  const heroSecondary = typeof hero.paragraph_two === 'string' && hero.paragraph_two.trim()
    ? hero.paragraph_two
    : heroParagraphs[1] || (typeof hero.secondary_description === 'string' ? hero.secondary_description : '')
  const heroProofItems = Array.isArray(hero.trust_labels)
    ? hero.trust_labels.map((item) => {
      if (typeof item === 'string') return item
      if (!item || typeof item !== 'object') return ''
      const text = (item as Record<string, unknown>).text
      return typeof text === 'string' ? text : ''
    }).filter(Boolean)
    : []
  const heroProof = heroProofItems.length ? heroProofItems : ['Direct Surgeon Care', 'Hospital-Based Surgery', 'International Patients', 'Revision Surgery']
  const signatureTitle = typeof signature.title === 'string' && signature.title.trim() ? signature.title.trim() : 'Designed around anatomy, not trends.'
  const signatureItems = Array.isArray(signature.items) ? signature.items : []
  const procedureItems = signatureItems.length ? signatureItems : signatureProcedures.map(([number, title, copy, image, alt]) => ({ number, title, description: copy, image, image_alt: alt }))
  const cmsImage = (value: unknown, fallback: string): string => {
    return getMediaUrl(value) || fallback
  }

  return <div ref={homepageRef} className="stitch-page stitch-homepage">
    <section className="stitch-home-hero" data-motion-section="hero"><div className="stitch-home-hero__inner">
      <div className="stitch-home-hero__mobile-heading" aria-hidden="true">
        <span className="stitch-kicker"><i /> <span>{typeof hero.eyebrow === 'string' ? hero.eyebrow : 'HOSPITAL-BASED COSMETIC SURGERY · HO CHI MINH CITY'}</span></span>
        <h2><span className="stitch-hero-line"><span>{heroTitle}</span></span></h2>
      </div>
      <div className="stitch-home-hero__copy" data-hero-copy-wrap>
        <div className="stitch-home-hero__desktop-heading">
          <span className="stitch-kicker" data-hero-kicker><i data-hero-divider /> <span data-hero-kicker-text>{typeof hero.eyebrow === 'string' ? hero.eyebrow : 'HOSPITAL-BASED COSMETIC SURGERY · HO CHI MINH CITY'}</span></span>
          <h2><span className="stitch-hero-line"><span data-hero-title-line>{heroTitle}</span></span></h2>
        </div>
        <p className="stitch-editorial-lead" data-hero-copy>{typeof hero.editorial_lead === 'string' ? hero.editorial_lead : 'Cosmetic surgery is a medical decision before it is an aesthetic one.'}</p>
        <p data-hero-copy>{heroDescription || 'At DR. MARIS AESTHETICS, your case is personally assessed and managed by Dr. Maris, with surgery performed at City International Hospital (CIH) in Ho Chi Minh City.'}</p>
        <p data-hero-copy>{heroSecondary || 'From primary cosmetic procedures to complex revision surgery, every surgical plan begins with your anatomy, medical history, previous procedures and individual goals.'}</p>
        <div className="stitch-actions" data-hero-actions><ConsultationButton className="stitch-button stitch-button--dark" /><a className="stitch-button stitch-button--outline" href="#journey">Explore Surgical Procedures <ArrowRight size={17} /></a></div>
        <div className="stitch-proof-row" data-hero-proof>{heroProof.map((item, index) => <span key={`${item}-${index}`}>{index > 0 && <b aria-hidden="true">|</b>}{item}</span>)}</div>
      </div>
      <div className="stitch-home-hero__image" data-hero-image><div data-hero-image-media className="stitch-motion-image"><StitchImage src={cmsImage(hero.image || hero.image_url || hero.doctor_image, images.heroDoctor)} alt={typeof hero.image_alt === 'string' ? hero.image_alt : 'Dr. Maris in a clinical setting'} /></div></div>
    </div></section>

    <HomepageYoutubeSection content={video} />

      <section className="stitch-section stitch-procedures" data-motion-section="procedures" data-signature-procedures><div className="stitch-container"><div className="stitch-section-heading"><span className="stitch-kicker" data-signature-motion data-signature-eyebrow>{typeof signature.eyebrow === 'string' ? signature.eyebrow : 'SIGNATURE PROCEDURES'}</span><h2><span className="stitch-hero-line"><span data-signature-motion data-signature-title>{signatureTitle}</span></span></h2><p className="stitch-lead" data-signature-motion data-signature-copy>{typeof signature.description === 'string' ? signature.description : 'Explore the procedures Dr. Maris performs with the same clinical discipline: careful assessment, transparent planning and a recovery strategy that respects the individual.'}</p></div><div className="stitch-procedure-grid">{procedureItems.map((item, index) => { const record = item as Record<string, unknown>; const number = String(record.number || `0${index + 1}`); const title = String(record.title || 'Procedure'); const copy = String(record.description || ''); const image = cmsImage(record.image_url || record.image, images.technology); const alt = String(record.image_alt || record.imageAlt || title); const fallbackHref = title === 'Rhinoplasty' ? '/services/rhinoplasty' : `/treatments#${title.toLowerCase().replaceAll(' ', '-')}`; const cmsHref = typeof record.href === 'string' ? record.href.trim() : ''; const href = cmsHref || fallbackHref; return <a className="stitch-procedure-panel" href={href} key={`${title}-${index}`} data-procedure-panel data-signature-panel data-procedure-index={index}><div className="stitch-procedure-panel__image"><StitchImage src={image} alt={alt} /><span className="stitch-procedure-panel__curtain" data-signature-curtain aria-hidden="true" /></div><div className="stitch-procedure-panel__body"><b data-signature-motion data-signature-number>{number}</b><div><h3 data-signature-motion data-signature-panel-title>{title}</h3><p data-signature-motion data-signature-panel-description>{copy}</p><span className="stitch-link" data-signature-motion data-signature-panel-cta>Explore Procedure <ArrowRight size={16} /></span></div></div></a> })}</div></div></section>

      <section className="stitch-section stitch-method" data-motion-section="process"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">{typeof method.eyebrow === 'string' ? method.eyebrow : 'THE MARIS METHOD'}</span><h2>{typeof method.title === 'string' ? method.title : 'Every case begins with the surgeon, not a procedure menu.'}</h2><p>{typeof method.description === 'string' ? method.description : 'Dr. Maris brings 6+ years of specialized cosmetic surgery experience to every case. Unlike high-volume clinics, we strictly limit our surgical schedule so that the surgeon responsible for your plan remains involved throughout your care.'}</p><blockquote>{typeof method.quote === 'string' ? method.quote : '“Good surgery begins with listening, examination and a clear plan—not with a package or a promise.”'}</blockquote><div className="stitch-process-line" data-process-line><span className="stitch-process-line__progress" aria-hidden="true" />{process.map(([n, title]) => <div key={n} data-process-step><b>{n}</b><span>{title}</span></div>)}</div><a className="stitch-link" href="/about-us">Meet Dr. Maris <ArrowRight size={17} /></a></div><div className="stitch-method__portrait stitch-portrait" data-process-image><StitchImage src={cmsImage(method.image, images.doctor)} alt={typeof method.image_alt === 'string' ? method.image_alt : 'Dr. Maris, lead surgeon'} /><div className="stitch-stat" data-process-stat><strong>Direct care</strong><span>From assessment through follow-up</span></div></div></div></section>

    <div className="stitch-swipe-chapter" data-swipe-chapter aria-label="Specialized care and hospital-based surgery">
      <section className="stitch-section stitch-dark stitch-revision" data-motion-section="revision" data-swipe-slide><div className="stitch-swipe-outer" data-swipe-outer><div className="stitch-swipe-inner" data-swipe-inner><div className="stitch-revision__image" data-swipe-visual aria-hidden="true"><ResponsiveStitchImage desktopSrc={cmsImage(revision.image, images.technology)} mobileSrc={cmsImage(revision.mobile_image, '') || undefined} alt="" /></div><div className="stitch-revision__wash" aria-hidden="true" /><span className="stitch-revision__word" aria-hidden="true">REVISION</span><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">{typeof revision.eyebrow === 'string' ? revision.eyebrow : 'SPECIALIZED CARE'}</span><h2>{typeof revision.title === 'string' ? revision.title : 'Revision Cosmetic Surgery Vietnam'}</h2><h3 className="stitch-editorial-lead">{typeof revision.editorial_lead === 'string' ? revision.editorial_lead : typeof revision.subtitle === 'string' ? revision.subtitle : 'When your first surgery did not go as planned.'}</h3><p>{typeof revision.description === 'string' ? revision.description : 'Revision surgery is not simply doing the procedure again. It requires a careful assessment of what was performed, the tissue that remains and what can be safely improved.'}</p><div className="stitch-callout"><strong>Can my previous cosmetic surgery be corrected?</strong><p>Many issues can be significantly improved, but realistic outcomes depend on each individual case.</p><a className="stitch-link stitch-link--light" href="#consultation">Request a Revision Assessment <ArrowRight size={17} /></a></div></div><div><h3 className="stitch-light-heading">Common Revision Concerns We Address</h3><ul className="stitch-check-list">{Array.isArray(revision.concerns) ? revision.concerns.map((item) => <li key={String(item)}><CheckCircle2 size={17} />{String(item)}</li>) : revisionConcerns.map(item => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></div></div></div></div></section>

      <section className="stitch-section stitch-hospital" data-motion-section="hospital" data-swipe-slide><div className="stitch-swipe-outer" data-swipe-outer><div className="stitch-swipe-inner" data-swipe-inner><div className="stitch-hospital__image" data-swipe-visual aria-hidden="true"><ResponsiveStitchImage desktopSrc={cmsImage(hospital.image, images.clinic)} mobileSrc={cmsImage(hospital.mobile_image, '') || undefined} alt="" /></div><div className="stitch-hospital__wash" aria-hidden="true" /><div className="stitch-container"><div className="stitch-hospital__content"><span className="stitch-kicker">{typeof hospital.eyebrow === 'string' ? hospital.eyebrow : 'HOSPITAL-BASED SURGERY'}</span><h2>{typeof hospital.title === 'string' ? hospital.title : 'Surgery performed at City International Hospital.'}</h2><p className="stitch-editorial-lead">{typeof hospital.editorial_lead === 'string' ? hospital.editorial_lead : 'Major cosmetic surgery requires more than a surgical suite.'}</p><p>{typeof hospital.description === 'string' ? hospital.description : 'Hospital-based surgery provides the medical infrastructure, safety systems and specialist support required for complex aesthetic procedures.'}</p><ul className="stitch-hospital__proof">{(Array.isArray(hospital.proof_items) ? hospital.proof_items : ['24/7 medical infrastructure', 'Professional nursing care', 'Advanced surgical support', 'Post-operative monitoring']).map(item => <li key={String(item.text || item)}>{String(item.text || item)}</li>)}</ul><p className="stitch-disclaimer">{typeof hospital.disclaimer === 'string' ? hospital.disclaimer : 'Disclaimer: DR. MARIS AESTHETICS and City International Hospital are separate entities. CIH is the hospital where surgical procedures are performed.'}</p><a className="stitch-link stitch-link--light" href="/about-us">Explore Hospital &amp; Facilities <ArrowRight size={17} /></a></div></div></div></div></section>
    </div>

    <InternationalPatientJourneySection data={journey as { title?: string; description?: string; steps?: unknown }} />

      <PatientResultsGallerySection content={patientResults} results={results} />

    <section className="stitch-section stitch-faq-section" data-motion-section="faq"><div className="stitch-container stitch-faq-layout"><div><span className="stitch-kicker">SURGICAL PLANNING</span><h2>Frequently asked questions about plastic surgery in Vietnam.</h2></div><MotionFaqAccordion className="stitch-faq-list" items={(faq as Array<{ question: string; answer: string }>).map(({ question, answer }) => ({ question, answer }))} /></div></section>

    <ConsultationCtaSection content={consultation} />
  </div>
}

const homepageFaq = [
  ['Is DR. MARIS AESTHETICS a spa or cosmetic surgery provider?', 'We are a specialized cosmetic surgery provider. All surgical procedures are performed in a fully accredited international hospital with comprehensive medical infrastructure.'],
  ['Who performs my cosmetic surgery?', 'Every surgery is personally performed by Dr. Maris. Your care is managed directly by the lead surgeon from planning through follow-up.'],
  ['Can I speak with Dr. Maris before travelling to Vietnam?', 'Yes. We require an online video consultation to review your medical history, photographs, and surgical goals before travel arrangements are finalized.'],
  ['Does Dr. Maris perform revision plastic surgery?', 'Dr. Maris specializes in complex revision cases, including corrective rhinoplasty, breast implant revision, and scar management.'],
  ['Can failed cosmetic surgery always be corrected?', 'Many issues can be improved, but correction depends on the healthy tissue remaining and the nature of the previous surgery.'],
  ['How long should I stay in Vietnam after plastic surgery?', 'Stay duration varies by procedure, typically ranging from 7 to 14 days to allow initial follow-up examinations before flying.'],
  ['How much does plastic surgery cost in Vietnam?', 'Quotes are provided after clinical assessment. We prioritize safety and hospital-based care over budget pricing.'],
  ['What should I send if I need revision surgery?', 'Please provide previous operative reports, the date of your last surgery, high-resolution photos, and a description of your concerns.'],
]

export function StitchDoctorAssessment() {
  return <section className="stitch-section stitch-profile" data-motion-section="assessment"><div className="stitch-container stitch-grid stitch-grid--two"><div className="stitch-portrait"><StitchImage src={images.doctor} alt="Dr. Maris, lead surgeon" /></div><div><span className="stitch-kicker">DIRECT SURGEON ASSESSMENT</span><h2>Your Case Is Personally Assessed by Dr. Maris</h2><p className="stitch-role">Dr. Maris / Dr. Tran Minh Huy · Cosmetic &amp; Plastic Surgeon</p><p>A thorough assessment considers anatomy, previous procedures, implant history, surgical goals, limitations and recovery expectations before any recommendation is made.</p><ul className="stitch-assessment-list">{['Anatomy assessment', 'Previous procedures', 'Implant history', 'Surgical goals', 'Limitations', 'Recovery expectations', 'Revision considerations'].map(item => <li key={item}><CheckCircle2 size={16} />{item}</li>)}</ul></div></div></section>
}

export function StitchHomepageFaq() {
  return <section className="stitch-section stitch-surface" data-motion-section="faq"><div className="stitch-container"><span className="stitch-kicker">SURGICAL PLANNING</span><h2>Frequently Asked Questions About Plastic Surgery in Vietnam</h2><MotionFaqAccordion className="stitch-faq-grid" items={homepageFaq.map(([question, answer]) => ({ question, answer }))} /></div></section>
}

export function StitchHomepageSupplement() {
  return <>
    <section className="stitch-section stitch-profile"><div className="stitch-container stitch-grid stitch-grid--two"><div className="stitch-portrait"><StitchImage src={images.doctor} alt="Dr. Maris, lead surgeon" /></div><div><span className="stitch-kicker">DIRECT SURGEON ASSESSMENT</span><h2>Your Case Is Personally Assessed by Dr. Maris</h2><p className="stitch-role">Dr. Maris / Dr. Tran Minh Huy · Cosmetic &amp; Plastic Surgeon</p><p>A thorough assessment considers anatomy, previous procedures, implant history, surgical goals, limitations and recovery expectations before any recommendation is made.</p><ul className="stitch-assessment-list">{['Anatomy assessment', 'Previous procedures', 'Implant history', 'Surgical goals', 'Limitations', 'Recovery expectations', 'Revision considerations'].map(item => <li key={item}><CheckCircle2 size={16} />{item}</li>)}</ul></div></div></section>
    <section className="stitch-section stitch-surface"><div className="stitch-container"><span className="stitch-kicker">SURGICAL PLANNING</span><h2>Frequently Asked Questions About Plastic Surgery in Vietnam</h2><div className="stitch-faq-grid">{homepageFaq.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></div></section>
  </>
}

function _StitchAboutUsLegacy() {
  return <div className="stitch-page stitch-about"><section className="stitch-about-intro"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">SURGEON-LED COSMETIC SURGERY · HO CHI MINH CITY</span><h2>About <em>Us</em></h2><blockquote>“Cosmetic surgery should begin with a medical assessment, a clear surgical plan and confidence in the surgeon responsible for your care.”</blockquote><p>DR. MARIS AESTHETICS is a surgeon-led cosmetic surgery practice in Ho Chi Minh City, providing personalized care for patients considering primary aesthetic procedures as well as complex revision surgery after previous operations.</p><p>Dr. Maris is directly involved from consultation and examination through surgery and postoperative follow-up.</p><div className="stitch-actions"><a className="stitch-button stitch-button--dark" href="/team">MEET DR. MARIS</a><ConsultationButton /></div></div><div className="stitch-about-image"><StitchImage src={images.doctor} alt="Dr. Maris, lead plastic surgeon" /></div></div></section><section className="stitch-section"><div className="stitch-container"><span className="stitch-kicker">DIRECT SURGEON CARE</span><h2>Cosmetic Surgery Built Around Direct Surgeon Involvement</h2><p className="stitch-lead">At Maris Aesthetics, the surgeon who consults with you should be the one who operates on you and oversees your recovery.</p><div className="stitch-process-line stitch-process-line--large">{process.map(([n, title, copy]) => <div key={n}><b>{n}</b><span>{title}</span><small>{copy}</small></div>)}</div></div></section><section className="stitch-section stitch-surface"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">OUR APPROACH</span><h2>Assessment Before Procedure</h2><blockquote>“The procedure someone initially requests is not automatically the procedure that should be recommended.”</blockquote><p>The objective is to understand the actual condition first, then build a plan around the patient.</p></div><div><h3>Surgical planning considers:</h3><ul className="stitch-assessment-list">{['Anatomy', 'Skin and tissue condition', 'Medical history', 'Previous operations', 'Existing implants', 'Scar tissue', 'Body proportions', 'Current symptoms', 'Aesthetic goals', 'Recovery expectations', 'Limitations of surgery'].map(item => <li key={item}>{item}</li>)}</ul></div></div></section><section className="stitch-section stitch-profile"><div className="stitch-container stitch-grid stitch-grid--two"><div className="stitch-portrait"><StitchImage src={images.doctor} alt="Dr. A. Maris, MD" /></div><div><span className="stitch-kicker">DR. MARIS</span><h2>Dr. A. Maris, MD</h2><p className="stitch-role">Cosmetic &amp; Plastic Surgeon | 6+ Years of Cosmetic Surgery Experience</p><p>Every consultation is an opportunity to understand the patient’s goals, concerns and expectations before discussing a procedure.</p><h3>His Consultation Philosophy</h3><p>Good surgery begins with listening, examination and a clear plan—not with a package or a promise.</p></div></div></section><section className="stitch-section stitch-dark"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">REVISION &amp; COMPLEX SURGERY</span><h2>For Patients Whose Previous Surgery Did Not Go as Planned</h2><p>Revision surgery requires an individualized assessment of anatomy, implants, scar tissue and the limits of what can safely be corrected.</p><ConsultationButton /></div><div><ul className="stitch-check-list">{revisionConcerns.slice(0, 6).map(item => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></div></div></section><section className="stitch-section stitch-surface"><div className="stitch-container stitch-international"><span className="stitch-kicker">INTERNATIONAL PATIENT STANDARDS</span><h2>Personalized Care Across Every Border</h2><div className="stitch-journey-grid">{[['Virtual Consultations', 'Begin your journey from home with an in-depth video consultation.'], ['Concierge Planning', 'Our international patient coordinator assists with logistics and scheduling.'], ['Transparent Care', 'Clear communication and medically-supervised care from consultation through follow-up.']].map(([title, copy], index) => <article key={title}><b>0{index + 1}</b><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section><section className="stitch-section stitch-consultation"><div className="stitch-container"><div><span className="stitch-kicker">BEGIN YOUR PERSONALIZED AESTHETIC JOURNEY</span><h2>Start with a conversation.</h2></div><ConsultationButton /></div></section></div>
}

export function StitchAboutUs({ heroImage, content }: { heroImage?: string | null; content?: any } = {}) {
  const aboutRef = useRef<HTMLDivElement>(null)
  useOurTeamMotion(aboutRef)
  const cmsHero = content?.hero || {}
  const aboutSections = Array.isArray(content?.aboutSections) ? content.aboutSections : []
  const sectionOf = (component: string) => aboutSections.find((section: any) => section.__component === component) || {}
  const cmsProcess = sectionOf('about.surgeon-process')
  const cmsAssessment = sectionOf('about.assessment')
  const cmsProfile = sectionOf('about.surgeon-profile')
  const cmsRevision = sectionOf('about.revision')
  const cmsInternational = sectionOf('about.international')
  const cmsConsultation = sectionOf('about.consultation')
  const cmsHospital = sectionOf('about.hospital')
  const cmsImage = (value: unknown, fallback: string) => getMediaUrl(value) || fallback
  const cmsProcessSteps = Array.isArray(cmsProcess.steps) && cmsProcess.steps.length
    ? cmsProcess.steps.map((step: any, index: number) => {
      const fallback = aboutPlanningSteps[index] || planningSteps[index]
      return {
        ...fallback,
        number: step.number || fallback?.number || String(index + 1).padStart(2, '0'),
        title: step.title || fallback?.title || '',
        description: step.description || fallback?.description || '',
        image: getMediaUrl(step.image) || fallback?.image || '',
        imageAlt: step.image_alt || fallback?.imageAlt || '',
      }
    })
    : aboutPlanningSteps
  const heroEyebrow = cmsHero.eyebrow || 'SURGEON-LED COSMETIC SURGERY · HO CHI MINH CITY'
  const heroTitle = cmsHero.title || cmsHero.headingPrimary || 'About Us'
  const heroLead = cmsHero.editorialLead || cmsHero.supportingParagraph || 'Cosmetic surgery should begin with a medical assessment, a clear surgical plan and confidence in the surgeon responsible for your care.'
  const heroDescription = cmsHero.description || 'DR. MARIS AESTHETICS is a surgeon-led cosmetic surgery practice in Ho Chi Minh City, providing personalized care for patients considering primary aesthetic procedures as well as complex revision surgery after previous operations.'
  const heroSecondaryDescription = cmsHero.secondaryDescription || 'Dr. Maris is directly involved from consultation and examination through surgery and postoperative follow-up, while surgical procedures are performed at City International Hospital (CIH).'
  const planningFactors: string[] = Array.isArray(cmsAssessment.factors) && cmsAssessment.factors.length ? cmsAssessment.factors.map((item: any) => item.title || item.label).filter(Boolean) : ['Anatomy', 'Skin and tissue condition', 'Medical history', 'Previous operations', 'Existing implants', 'Scar tissue', 'Body proportions', 'Current symptoms', 'Aesthetic goals', 'Recovery expectations', 'Limitations of surgery']
  const internationalStandards: string[][] = Array.isArray(cmsInternational.items) && cmsInternational.items.length ? cmsInternational.items.map((item: any) => [item.title || item.label, item.description || '']) : [
    ['Virtual Consultations', 'Begin your journey from home with an in-depth, secure video consultation with Dr. Maris to discuss your goals and assess initial suitability.'],
    ['Concierge Planning', 'Our dedicated international patient coordinator will assist with scheduling, accommodation recommendations, and local logistics for a stress-free stay.'],
    ['Transparent Care', 'Clear, upfront detailing of all costs, expected recovery timelines, and required stay durations, ensuring you can plan your trip with complete confidence.'],
  ]
  const surgicalScope: string[] = Array.isArray(cmsHospital.scope) && cmsHospital.scope.length ? cmsHospital.scope.map((item: any) => item.title || item.label).filter(Boolean) : ['Major body contouring', 'Breast surgery', 'Anesthesia procedures', 'Combined procedures', 'Revision surgery', 'Complex secondary operations']

  return <div ref={aboutRef} className="stitch-page stitch-about">
    <section className="stitch-about-intro" data-team-hero>
      <div className="stitch-container stitch-grid stitch-grid--two">
        <div>
          <span className="stitch-kicker" data-team-hero-eyebrow><i data-team-hero-divider />{heroEyebrow}</span>
          <h2><span className="stitch-hero-line"><span data-team-hero-title-line>{heroTitle}</span></span></h2>
          <div className="stitch-about-image stitch-about-image--mobile" aria-hidden="true"><StitchImage src={heroImage || images.heroDoctor} alt="" /></div>
          <blockquote data-team-hero-copy>“{heroLead}”</blockquote>
          <div className="our-team-profile-hero__body" data-team-hero-copy><p>{heroDescription}</p><p>{heroSecondaryDescription}</p></div>
          <div className="stitch-actions" data-team-hero-actions>
            <a className="stitch-button stitch-button--dark" href="/team">MEET DR. MARIS</a>
            <a className="stitch-button stitch-button--outline" href="/contact">REQUEST AN ONLINE CONSULTATION</a>
          </div>
        </div>
        <div className="stitch-about-image stitch-about-image--desktop" data-team-hero-image><StitchImage src={heroImage || images.heroDoctor} alt="Dr. Maris, Lead Plastic Surgeon at Maris Aesthetics" /></div>
      </div>
    </section>

    <PlanningProcessSection
      sectionId="direct-surgeon-process"
      className="about-surgeon-process"
      eyebrow="DIRECT SURGEON CARE"
      title={cmsProcess.title || 'Cosmetic Surgery Built Around Direct Surgeon Involvement'}
      description={cmsProcess.description || 'At Maris Aesthetics, the surgeon who consults with you should be the one who operates on you and oversees your recovery. Every stage is planned around the patient, not a procedure menu.'}
      steps={cmsProcessSteps}
      showStepImagesOnMobile
      showActions={false}
    />

    <section className="stitch-section stitch-surface">
      <div className="stitch-container stitch-grid stitch-grid--two">
        <div><span className="stitch-kicker">{cmsAssessment.eyebrow || 'OUR APPROACH'}</span><h2>{cmsAssessment.title || 'Assessment Before Procedure'}</h2><blockquote>“{cmsAssessment.quote || 'Patients often arrive with a procedure already in mind. But the procedure someone initially requests is not automatically the procedure that should be recommended.'}”</blockquote><p className="stitch-about-objective">{cmsAssessment.objective || 'The objective is not simply to confirm what a patient requests. It is to understand the actual condition first.'}</p></div>
        <div><h3>Surgical planning considers:</h3><div className="stitch-about-factors">{planningFactors.map(item => <div key={item}>{item}</div>)}</div></div>
      </div>
    </section>

    <section className="stitch-section stitch-about-profile">
      <div className="stitch-container stitch-grid stitch-grid--two">
        <div className="stitch-portrait stitch-about-profile__desktop-image"><StitchImage src={cmsImage(cmsProfile.image, images.doctor)} alt={cmsProfile.image_alt || 'Dr. A. Maris, MD'} /></div>
        <div className="stitch-about-profile__copy"><span className="stitch-kicker">{cmsProfile.eyebrow || 'DR. MARIS'}</span><h2>{cmsProfile.title || 'Dr. A. Maris, MD'}</h2><div className="stitch-portrait stitch-about-profile__mobile-image" aria-hidden="true"><StitchImage src={cmsImage(cmsProfile.image, images.doctor)} alt="" /></div><p className="stitch-role">{cmsProfile.role || 'Cosmetic &amp; Plastic Surgeon | 6+ Years of Cosmetic Surgery Experience'}</p><p>{cmsProfile.description || 'Dr. Maris focuses on personalized surgical planning across breast, body and facial procedures, with particular attention to patients requiring revision or corrective surgery. He remains directly involved in every step of the journey: consultation, assessment, surgical planning, surgery, and postoperative follow-up.'}</p><div className="stitch-about-philosophy"><h3>{cmsProfile.philosophy_title || 'His Consultation Philosophy'}</h3><p>{cmsProfile.philosophy_description || 'Consultation should provide clarity rather than pressure. We meticulously cover patient concerns, previous surgery, realistic possibilities, surgical suitability, potential limitations, relevant risks, recovery expectations, and international travel considerations.'}</p><a className="stitch-link" href="/team">Learn More About Dr. Maris <ArrowRight size={17} /></a></div></div>
      </div>
    </section>

    <section className="stitch-section stitch-dark stitch-about-revision" data-team-revision>
      <div className="stitch-container stitch-grid stitch-grid--two">
        <div className="stitch-about-revision__copy"><span className="stitch-kicker" data-revision-reveal>{cmsRevision.eyebrow || 'REVISION &amp; COMPLEX SURGERY'}</span><h2 data-revision-reveal>{cmsRevision.title || 'For Patients Whose Previous Surgery Did Not Go as Planned'}</h2><div className="stitch-portrait stitch-about-revision__mobile-image" aria-hidden="true"><StitchImage src={cmsImage(cmsRevision.image, images.technology)} alt="" /></div><p data-revision-reveal>{cmsRevision.description || 'Revision patients often face a unique set of challenges. Beyond the physical complications—such as compromised anatomy or excessive scar tissue—there is often a significant emotional burden of anxiety and lost confidence. We approach these cases with the specialized care they require.'}</p><div className="stitch-revision-concerns">{(Array.isArray(cmsRevision.concerns) && cmsRevision.concerns.length ? cmsRevision.concerns.map((item: any) => item.title || item.label).filter(Boolean) : ['Capsular Contracture', 'Breast Implant Rupture', 'Implant Displacement', 'Breast Asymmetry', 'Implant Removal', 'Excessive Scar Tissue', 'Free Silicone', 'Silicone Migration or Leakage', 'Cosmetic Correction']).map((item: string) => <span key={item} data-revision-reveal>{item}</span>)}</div><h3 className="stitch-editorial-lead" data-revision-reveal>{cmsRevision.lead || 'Revision Surgery Is Not Simply “Doing the Procedure Again”'}</h3><p data-revision-reveal>{cmsRevision.lead_description || 'It requires navigating altered tissue planes, managing compromised skin and muscle pockets, and meticulously addressing internal scar tissue to restore support and symmetry. Every revision plan is unique to the patient&apos;s specific anatomical history.'}</p><div data-revision-reveal><div className="stitch-actions"><ConsultationButton>REQUEST A REVISION SURGERY ASSESSMENT</ConsultationButton></div></div></div>
        <div className="stitch-portrait stitch-about-revision__desktop-image" data-revision-media><StitchImage src={cmsImage(cmsRevision.image, images.technology)} alt={cmsRevision.image_alt || 'Surgeon examining a 3D medical scan for a complex revision case'} /></div>
      </div>
    </section>

    <section className="stitch-section stitch-surface">
      <div className="stitch-container stitch-international"><div className="stitch-about-international-heading"><span className="stitch-kicker">{cmsInternational.eyebrow || 'INTERNATIONAL PATIENT STANDARDS'}</span><h2>{cmsInternational.title || 'Personalized Care Across Every Border'}</h2><p>{cmsInternational.description || 'We welcome patients from across the globe, providing comprehensive planning and transparent consultation for a seamless overseas medical journey.'}</p></div><div className="stitch-journey-grid">{internationalStandards.map(([title, copy], index) => <article key={title}><b>0{index + 1}</b><h3>{title}</h3><p>{copy}</p></article>)}</div></div>
    </section>

    <section className="stitch-section stitch-consultation"><div className="stitch-container"><div><span className="stitch-kicker">{cmsConsultation.eyebrow || 'TAKE THE FIRST STEP'}</span><h2>{cmsConsultation.title || 'Begin Your Personalized Aesthetic Journey'}</h2></div><div className="stitch-actions"><ConsultationButton>BOOK A CONSULTATION</ConsultationButton><a className="stitch-button stitch-button--outline" href="/services">EXPLORE OUR SERVICES</a></div></div></section>

    <section className="stitch-about-hospital"><div className="stitch-about-hospital-image"><StitchImage src={cmsImage(cmsHospital.image, images.aboutHospital)} alt={cmsHospital.image_alt || 'City International Hospital exterior'} /><div className="stitch-about-hospital-overlay"><div><span className="stitch-kicker">{cmsHospital.eyebrow || 'HOSPITAL-BASED SURGERY'}</span><h2>{cmsHospital.title || 'Surgery Performed at City International Hospital (CIH)'}</h2></div></div></div><div className="stitch-section"><div className="stitch-container stitch-grid stitch-grid--two"><div><p className="stitch-about-hospital-statement">{cmsHospital.statement || 'DR. MARIS AESTHETICS is a cosmetic surgery practice, not a spa or beauty center.'}</p><p>{cmsHospital.description || 'Surgical procedures are performed at City International Hospital (CIH), Ho Chi Minh City. A hospital environment provides access to broader medical infrastructure and supporting services surrounding surgery.'}</p><a className="stitch-link" href="/about-us">Explore Hospital &amp; Facilities <ArrowRight size={17} /></a></div><div className="stitch-about-scope"><span className="stitch-kicker">SURGICAL SCOPE</span><ul>{surgicalScope.map(item => <li key={item}>{item}</li>)}</ul></div><p className="stitch-disclaimer">{cmsHospital.disclaimer || 'DR. MARIS AESTHETICS and City International Hospital are separate entities. CIH is the hospital environment where surgical procedures are performed.'}</p></div></div></section>
  </div>
}
