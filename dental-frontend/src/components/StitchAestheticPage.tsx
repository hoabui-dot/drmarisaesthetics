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
import { PlanningProcessSection } from '@/src/components/homepage/PlanningProcessSection'
import { PatientResultsGallerySection } from '@/src/components/homepage/PatientResultsGallerySection'
import { MotionFaqAccordion } from '@/src/components/ui/motion-faq-accordion'
import { useRef } from 'react'

const images = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0',
  heroDoctor: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0',
  doctor: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0',
  clinic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxLNXCFVyLcdlfs3uKkXCF1nWzjOTlVHjbpSP07wg76cD4otnSBnmCAAt1Q57Tyj15rO6f8Z6857zzPhjjWAmXaeErAAZnwu6mADqs3tc98ftky9z2AYeSGQb0fDf_TJgY_52sEsTvavziZQJlySwrko2v_jKxGIpfSjrhbY2TDZfq64krwVmF90rBv7n4UMWEk2pyh4qcEwDImDsvTDEw7iLuJAeoRqbp3rlrmpdS1aQ7tLL7vbdw5g',
  aboutHospital: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1LCeH-Ppjwbtbg4zULKHP3OYSwQrWS6JnKRpkXMJKfp-4xvfAuEibObKn17fqXDLCQqZ35tFmBIgGFP_Cb7BXwHWQE3g35huXXerG_hLfwuFpyoDtba24X29bZ1Tu7ki0OyueVd7K1JGxneXkimaHpIVJhm8fXx9mYYvtyW5FyZ3en95kLINrU96c5hMMz991fP7-hMAfwKX2w1wBd_ry7gZ-kQ-qs3c399WfmNb4I8xBUGfCVVs3HQ',
  technology: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1800&q=85',
}

function ConsultationButton({ children = 'REQUEST A CONSULTATION', className = 'stitch-button stitch-button--dark' }: { children?: React.ReactNode; className?: string }) {
  const { open } = useBookingModal()
  return <button type="button" onClick={open} className={className}><CalendarDays size={16} />{children}</button>
}

const process = [
  ['01', 'Consultation', 'Discuss concerns, goals, medical history and previous procedures.'],
  ['02', 'Examination', 'Assess anatomy and individual condition.'],
  ['03', 'Surgical Planning', 'Develop the surgical plan around the patient rather than a standard package.'],
  ['04', 'Surgery', 'Dr. Maris personally performs the procedure.'],
  ['05', 'Follow-Up', 'Recovery and postoperative progress remain part of the surgical process.'],
]

const revisionConcerns = ['Capsular Contracture', 'Asymmetry Correction', 'Excessive Scar Tissue', 'Implant Malposition', 'Over-resected Rhinoplasty', 'Contour Irregularities', 'Unsatisfactory Functional Outcomes']

const signatureProcedures = [
  ['01', 'Rhinoplasty', 'Refined facial balance with a plan built around your anatomy.', resultsMockData.cases[1].afterImage, resultsMockData.cases[1].afterAlt],
  ['02', 'Breast Surgery', 'Personalized proportion, implant planning and long-term support.', images.technology, 'Premium clinical consultation environment'],
  ['03', 'Body Contouring', 'Thoughtful contouring designed for natural movement and recovery.', images.clinic, 'City International Hospital facility'],
  ['04', 'Revision Surgery', 'Complex correction begins with understanding what came before.', resultsMockData.cases[0].afterImage, resultsMockData.cases[0].afterAlt],
]

function StitchImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className={`object-cover ${className}`} unoptimized />
}

export function StitchHomepage() {
  const homepageRef = useRef<HTMLDivElement>(null)
  useHomepageMotion(homepageRef)
  useSignatureProceduresMotion(homepageRef)

  return <div ref={homepageRef} className="stitch-page stitch-homepage">
    <section className="stitch-home-hero" data-motion-section="hero"><div className="stitch-home-hero__inner">
      <div className="stitch-home-hero__copy" data-hero-copy-wrap>
        <span className="stitch-kicker" data-hero-kicker><i data-hero-divider /> <span data-hero-kicker-text>HOSPITAL-BASED COSMETIC SURGERY · HO CHI MINH CITY</span></span>
        <h1><span className="stitch-hero-line"><span data-hero-title-line>Plastic Surgery in</span></span><span className="stitch-hero-line"><span data-hero-title-line>Vietnam for International Patients</span></span></h1>
        <p className="stitch-editorial-lead" data-hero-copy>Cosmetic surgery is a medical decision before it is an aesthetic one.</p>
        <p data-hero-copy>At DR. MARIS AESTHETICS, your case is personally assessed and managed by Dr. Maris, with surgery performed at City International Hospital (CIH) in Ho Chi Minh City.</p>
        <p data-hero-copy>From primary cosmetic procedures to complex revision surgery, every surgical plan begins with your anatomy, medical history, previous procedures and individual goals.</p>
        <div className="stitch-actions" data-hero-actions><ConsultationButton /><a className="stitch-link" href="#journey">Explore Surgical Procedures <ArrowRight size={17} /></a></div>
        <div className="stitch-proof-row" data-hero-proof><span>Direct Surgeon Care</span><b>|</b><span>Hospital-Based Surgery</span><b>|</b><span>International Patients</span><b>|</b><span>Revision Surgery</span></div>
      </div>
      <div className="stitch-home-hero__image" data-hero-image><div className="stitch-image-wash" /><div data-hero-image-media className="stitch-motion-image"><StitchImage src={images.heroDoctor} alt="Dr. Maris in a clinical setting" /></div></div>
    </div></section>

    <section className="stitch-section stitch-procedures" data-motion-section="procedures" data-signature-procedures><div className="stitch-container"><div className="stitch-section-heading"><span className="stitch-kicker" data-signature-motion data-signature-eyebrow>SIGNATURE PROCEDURES</span><h2><span className="stitch-hero-line"><span data-signature-motion data-signature-title-line>Designed around anatomy, not</span></span><span className="stitch-hero-line"><span data-signature-motion data-signature-title-line>trends.</span></span></h2><p className="stitch-lead" data-signature-motion data-signature-copy>Explore the procedures Dr. Maris performs with the same clinical discipline: careful assessment, transparent planning and a recovery strategy that respects the individual.</p></div><div className="stitch-procedure-grid">{signatureProcedures.map(([number, title, copy, image, alt], index) => <a className="stitch-procedure-panel" href={title === 'Rhinoplasty' ? '/face/rhinoplasty' : `/treatments#${title.toLowerCase().replaceAll(' ', '-')}`} key={title} data-procedure-panel data-signature-panel data-procedure-index={index}><div className="stitch-procedure-panel__image"><StitchImage src={image} alt={alt} /><span className="stitch-procedure-panel__curtain" data-signature-curtain aria-hidden="true" /></div><div className="stitch-procedure-panel__body"><b data-signature-motion data-signature-number>{number}</b><div><h3 data-signature-motion data-signature-panel-title>{title}</h3><p data-signature-motion data-signature-panel-description>{copy}</p><span className="stitch-link" data-signature-motion data-signature-panel-cta>Explore Procedure <ArrowRight size={16} /></span></div></div></a>)}</div></div></section>

    <section className="stitch-section stitch-method" data-motion-section="process"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">THE MARIS METHOD</span><h2 className="stitch-editorial-lead">Every case begins with the surgeon, not a procedure menu.</h2><p>Dr. Maris brings 6+ years of specialized cosmetic surgery experience to every case. Unlike high-volume clinics, we strictly limit our surgical schedule so that the surgeon responsible for your plan remains involved throughout your care.</p><blockquote>“Good surgery begins with listening, examination and a clear plan—not with a package or a promise.”</blockquote><div className="stitch-process-line" data-process-line><span className="stitch-process-line__progress" aria-hidden="true" />{process.map(([n, title]) => <div key={n} data-process-step><b>{n}</b><span>{title}</span></div>)}</div><a className="stitch-link" href="/about-us">Meet Dr. Maris <ArrowRight size={17} /></a></div><div className="stitch-method__portrait stitch-portrait" data-process-image><StitchImage src={images.doctor} alt="Dr. Maris, lead surgeon" /><div className="stitch-stat" data-process-stat><strong>Direct care</strong><span>From assessment through follow-up</span></div></div></div></section>

    <div className="stitch-swipe-chapter" data-swipe-chapter aria-label="Specialized care and hospital-based surgery">
      <section className="stitch-section stitch-dark stitch-revision" data-motion-section="revision" data-swipe-slide><div className="stitch-swipe-outer" data-swipe-outer><div className="stitch-swipe-inner" data-swipe-inner><div className="stitch-revision__image" data-swipe-visual aria-hidden="true"><StitchImage src={images.technology} alt="" /></div><div className="stitch-revision__wash" aria-hidden="true" /><span className="stitch-revision__word" aria-hidden="true">REVISION</span><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">SPECIALIZED CARE</span><h2>Revision Cosmetic Surgery Vietnam</h2><h3 className="stitch-editorial-lead">When your first surgery did not go as planned.</h3><p>Revision surgery is not simply doing the procedure again. It requires a careful assessment of what was performed, the tissue that remains and what can be safely improved.</p><div className="stitch-callout"><strong>Can my previous cosmetic surgery be corrected?</strong><p>Many issues can be significantly improved, but realistic outcomes depend on each individual case.</p><a className="stitch-link stitch-link--light" href="#consultation">Request a Revision Assessment <ArrowRight size={17} /></a></div></div><div><h3 className="stitch-light-heading">Common Revision Concerns We Address</h3><ul className="stitch-check-list">{revisionConcerns.map(item => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></div></div></div></div></section>

      <section className="stitch-section stitch-hospital" data-motion-section="hospital" data-swipe-slide><div className="stitch-swipe-outer" data-swipe-outer><div className="stitch-swipe-inner" data-swipe-inner><div className="stitch-hospital__image" data-swipe-visual aria-hidden="true"><StitchImage src={images.clinic} alt="" /></div><div className="stitch-hospital__wash" aria-hidden="true" /><div className="stitch-container"><div className="stitch-hospital__content"><span className="stitch-kicker">HOSPITAL-BASED SURGERY</span><h2>Surgery performed at City International Hospital.</h2><p className="stitch-editorial-lead">Major cosmetic surgery requires more than a surgical suite.</p><p>Hospital-based surgery provides the medical infrastructure, safety systems and specialist support required for complex aesthetic procedures.</p><ul className="stitch-hospital__proof"><li>24/7 medical infrastructure</li><li>Professional nursing care</li><li>Advanced surgical support</li><li>Post-operative monitoring</li></ul><p className="stitch-disclaimer">Disclaimer: DR. MARIS AESTHETICS and City International Hospital are separate entities. CIH is the hospital where surgical procedures are performed.</p><a className="stitch-link stitch-link--light" href="/about-us">Explore Hospital &amp; Facilities <ArrowRight size={17} /></a></div></div></div></div></section>
    </div>

    <PlanningProcessSection />

    <InternationalPatientJourneySection />

    <PatientResultsGallerySection />

    <section className="stitch-section stitch-faq-section" data-motion-section="faq"><div className="stitch-container stitch-faq-layout"><div><span className="stitch-kicker">SURGICAL PLANNING</span><h2>Frequently asked questions about plastic surgery in Vietnam.</h2></div><MotionFaqAccordion className="stitch-faq-list" items={homepageFaq.map(([question, answer]) => ({ question, answer }))} /></div></section>

    <section id="consultation" className="stitch-section stitch-consultation" data-motion-section="cta"><div className="stitch-consultation__image" aria-hidden="true"><StitchImage src={images.technology} alt="" /></div><div className="stitch-consultation__wash" aria-hidden="true" /><div className="stitch-container"><div className="stitch-consultation__copy"><span className="stitch-kicker">BEGIN YOUR JOURNEY</span><h2>Your case deserves a surgical plan built around you.</h2><p className="stitch-editorial-lead">Your case begins with understanding your actual condition.</p><p>Send your case for a preliminary clinical review and begin a direct conversation with Dr. Maris.</p><div className="stitch-consultation__actions"><ConsultationButton>Start Your Consultation <ArrowRight size={16} /></ConsultationButton></div></div><aside className="stitch-consultation__panel"><span className="stitch-kicker">PRIVATE CONSULTATION</span><h3>Begin with a clinical review.</h3><p>Share your case before making travel decisions.</p><ol><li><b>01</b><span>Share your case</span></li><li><b>02</b><span>Receive a preliminary review</span></li><li><b>03</b><span>Arrange your consultation</span></li></ol></aside></div></section>
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
  return <div className="stitch-page stitch-about"><section className="stitch-about-intro"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">SURGEON-LED COSMETIC SURGERY · HO CHI MINH CITY</span><h1>About <em>Us</em></h1><blockquote>“Cosmetic surgery should begin with a medical assessment, a clear surgical plan and confidence in the surgeon responsible for your care.”</blockquote><p>DR. MARIS AESTHETICS is a surgeon-led cosmetic surgery practice in Ho Chi Minh City, providing personalized care for patients considering primary aesthetic procedures as well as complex revision surgery after previous operations.</p><p>Dr. Maris is directly involved from consultation and examination through surgery and postoperative follow-up.</p><div className="stitch-actions"><a className="stitch-button stitch-button--dark" href="/team">MEET DR. MARIS</a><ConsultationButton /></div></div><div className="stitch-about-image"><StitchImage src={images.doctor} alt="Dr. Maris, lead plastic surgeon" /></div></div></section><section className="stitch-section"><div className="stitch-container"><span className="stitch-kicker">DIRECT SURGEON CARE</span><h2>Cosmetic Surgery Built Around Direct Surgeon Involvement</h2><p className="stitch-lead">At Maris Aesthetics, the surgeon who consults with you should be the one who operates on you and oversees your recovery.</p><div className="stitch-process-line stitch-process-line--large">{process.map(([n, title, copy]) => <div key={n}><b>{n}</b><span>{title}</span><small>{copy}</small></div>)}</div></div></section><section className="stitch-section stitch-surface"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">OUR APPROACH</span><h2>Assessment Before Procedure</h2><blockquote>“The procedure someone initially requests is not automatically the procedure that should be recommended.”</blockquote><p>The objective is to understand the actual condition first, then build a plan around the patient.</p></div><div><h3>Surgical planning considers:</h3><ul className="stitch-assessment-list">{['Anatomy', 'Skin and tissue condition', 'Medical history', 'Previous operations', 'Existing implants', 'Scar tissue', 'Body proportions', 'Current symptoms', 'Aesthetic goals', 'Recovery expectations', 'Limitations of surgery'].map(item => <li key={item}>{item}</li>)}</ul></div></div></section><section className="stitch-section stitch-profile"><div className="stitch-container stitch-grid stitch-grid--two"><div className="stitch-portrait"><StitchImage src={images.doctor} alt="Dr. A. Maris, MD" /></div><div><span className="stitch-kicker">DR. MARIS</span><h2>Dr. A. Maris, MD</h2><p className="stitch-role">Cosmetic &amp; Plastic Surgeon | 6+ Years of Cosmetic Surgery Experience</p><p>Every consultation is an opportunity to understand the patient’s goals, concerns and expectations before discussing a procedure.</p><h3>His Consultation Philosophy</h3><p>Good surgery begins with listening, examination and a clear plan—not with a package or a promise.</p></div></div></section><section className="stitch-section stitch-dark"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">REVISION &amp; COMPLEX SURGERY</span><h2>For Patients Whose Previous Surgery Did Not Go as Planned</h2><p>Revision surgery requires an individualized assessment of anatomy, implants, scar tissue and the limits of what can safely be corrected.</p><ConsultationButton /></div><div><ul className="stitch-check-list">{revisionConcerns.slice(0, 6).map(item => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></div></div></section><section className="stitch-section stitch-surface"><div className="stitch-container stitch-international"><span className="stitch-kicker">INTERNATIONAL PATIENT STANDARDS</span><h2>Personalized Care Across Every Border</h2><div className="stitch-journey-grid">{[['Virtual Consultations', 'Begin your journey from home with an in-depth video consultation.'], ['Concierge Planning', 'Our international patient coordinator assists with logistics and scheduling.'], ['Transparent Care', 'Clear communication and medically-supervised care from consultation through follow-up.']].map(([title, copy], index) => <article key={title}><b>0{index + 1}</b><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section><section className="stitch-section stitch-consultation"><div className="stitch-container"><div><span className="stitch-kicker">BEGIN YOUR PERSONALIZED AESTHETIC JOURNEY</span><h2>Start with a conversation.</h2></div><ConsultationButton /></div></section></div>
}

export function StitchAboutUs() {
  const planningFactors = ['Anatomy', 'Skin and tissue condition', 'Medical history', 'Previous operations', 'Existing implants', 'Scar tissue', 'Body proportions', 'Current symptoms', 'Aesthetic goals', 'Recovery expectations', 'Limitations of surgery']
  const internationalStandards = [
    ['Virtual Consultations', 'Begin your journey from home with an in-depth, secure video consultation with Dr. Maris to discuss your goals and assess initial suitability.'],
    ['Concierge Planning', 'Our dedicated international patient coordinator will assist with scheduling, accommodation recommendations, and local logistics for a stress-free stay.'],
    ['Transparent Care', 'Clear, upfront detailing of all costs, expected recovery timelines, and required stay durations, ensuring you can plan your trip with complete confidence.'],
  ]
  const surgicalScope = ['Major body contouring', 'Breast surgery', 'Anesthesia procedures', 'Combined procedures', 'Revision surgery', 'Complex secondary operations']

  return <div className="stitch-page stitch-about">
    <section className="stitch-about-intro">
      <div className="stitch-container stitch-grid stitch-grid--two">
        <div>
          <span className="stitch-kicker">SURGEON-LED COSMETIC SURGERY · HO CHI MINH CITY</span>
          <h1>About <em>Us</em></h1>
          <blockquote>“Cosmetic surgery should begin with a medical assessment, a clear surgical plan and confidence in the surgeon responsible for your care.”</blockquote>
          <p>DR. MARIS AESTHETICS is a surgeon-led cosmetic surgery practice in Ho Chi Minh City, providing personalized care for patients considering primary aesthetic procedures as well as complex revision surgery after previous operations.</p>
          <p>Dr. Maris is directly involved from consultation and examination through surgery and postoperative follow-up, while surgical procedures are performed at City International Hospital (CIH).</p>
          <div className="stitch-actions">
            <a className="stitch-button stitch-button--dark" href="/team">MEET DR. MARIS</a>
            <ConsultationButton className="stitch-button stitch-button--outline">REQUEST AN ONLINE CONSULTATION</ConsultationButton>
          </div>
        </div>
        <div className="stitch-about-image"><StitchImage src={images.heroDoctor} alt="Dr. Maris, Lead Plastic Surgeon at Maris Aesthetics" /></div>
      </div>
    </section>

    <section className="stitch-section">
      <div className="stitch-container">
        <div className="stitch-about-story-heading">
          <span className="stitch-kicker">DIRECT SURGEON CARE</span>
          <div className="stitch-grid stitch-grid--two">
            <div><h2>Cosmetic Surgery Built Around Direct Surgeon Involvement</h2></div>
            <div><p className="stitch-editorial-lead">“Who will actually be responsible for my operation?”</p><p>At Maris Aesthetics, the answer is simple: Dr. Maris. We believe that the surgeon who consults with you should be the one who operates on you and oversees your recovery.</p></div>
          </div>
        </div>
        <div className="stitch-process-line stitch-process-line--large">
          {process.map(([number, title, copy]) => <div key={number}><b>{number}</b><span>{title}</span><small>{copy}</small></div>)}
        </div>
        <p className="stitch-about-story-note">To maintain this level of direct involvement, we intentionally limit our surgical volume. This ensures that every patient receives the meticulous planning and focused attention required for exceptional aesthetic outcomes.</p>
      </div>
    </section>

    <section className="stitch-section stitch-surface">
      <div className="stitch-container stitch-grid stitch-grid--two">
        <div><span className="stitch-kicker">OUR APPROACH</span><h2>Assessment Before Procedure</h2><blockquote>“Patients often arrive with a procedure already in mind. But the procedure someone initially requests is not automatically the procedure that should be recommended.”</blockquote><p className="stitch-about-objective">The objective is not simply to confirm what a patient requests. It is to understand the actual condition first.</p></div>
        <div><h3>Surgical planning considers:</h3><div className="stitch-about-factors">{planningFactors.map(item => <div key={item}>{item}</div>)}</div></div>
      </div>
    </section>

    <section className="stitch-section">
      <div className="stitch-container stitch-grid stitch-grid--two">
        <div className="stitch-portrait"><StitchImage src={images.doctor} alt="Dr. A. Maris, MD" /></div>
        <div><span className="stitch-kicker">DR. MARIS</span><h2>Dr. A. Maris, MD</h2><p className="stitch-role">Cosmetic &amp; Plastic Surgeon | 6+ Years of Cosmetic Surgery Experience</p><p>Dr. Maris focuses on personalized surgical planning across breast, body and facial procedures, with particular attention to patients requiring revision or corrective surgery. He remains directly involved in every step of the journey: consultation, assessment, surgical planning, surgery, and postoperative follow-up.</p><div className="stitch-about-philosophy"><h3>His Consultation Philosophy</h3><p>Consultation should provide clarity rather than pressure. We meticulously cover patient concerns, previous surgery, realistic possibilities, surgical suitability, potential limitations, relevant risks, recovery expectations, and international travel considerations.</p><a className="stitch-link" href="/team">Learn More About Dr. Maris <ArrowRight size={17} /></a></div></div>
      </div>
    </section>

    <section className="stitch-section stitch-dark">
      <div className="stitch-container stitch-grid stitch-grid--two">
        <div><span className="stitch-kicker">REVISION &amp; COMPLEX SURGERY</span><h2>For Patients Whose Previous Surgery Did Not Go as Planned</h2><p>Revision patients often face a unique set of challenges. Beyond the physical complications—such as compromised anatomy or excessive scar tissue—there is often a significant emotional burden of anxiety and lost confidence. We approach these cases with the specialized care they require.</p><div className="stitch-revision-concerns">{['Capsular Contracture', 'Breast Implant Rupture', 'Implant Displacement', 'Breast Asymmetry', 'Implant Removal', 'Excessive Scar Tissue', 'Free Silicone', 'Silicone Migration or Leakage', 'Cosmetic Correction'].map(item => <span key={item}>{item}</span>)}</div><h3 className="stitch-editorial-lead">Revision Surgery Is Not Simply “Doing the Procedure Again”</h3><p>It requires navigating altered tissue planes, managing compromised skin and muscle pockets, and meticulously addressing internal scar tissue to restore support and symmetry. Every revision plan is unique to the patient&apos;s specific anatomical history.</p><div className="stitch-actions"><ConsultationButton>REQUEST A REVISION SURGERY ASSESSMENT</ConsultationButton></div></div>
        <div className="stitch-portrait"><StitchImage src={images.technology} alt="Surgeon examining a 3D medical scan for a complex revision case" /></div>
      </div>
    </section>

    <section className="stitch-section stitch-surface">
      <div className="stitch-container stitch-international"><div className="stitch-about-international-heading"><h2>International<br /><em>Patient Standards</em></h2><p>We welcome patients from across the globe, providing comprehensive planning and transparent consultation for a seamless overseas medical journey.</p></div><div className="stitch-journey-grid">{internationalStandards.map(([title, copy], index) => <article key={title}><b>0{index + 1}</b><h3>{title}</h3><p>{copy}</p></article>)}</div></div>
    </section>

    <section className="stitch-section stitch-consultation"><div className="stitch-container"><div><span className="stitch-kicker">TAKE THE FIRST STEP</span><h2>Begin Your Personalized<br /><em>Aesthetic Journey</em></h2></div><div className="stitch-actions"><ConsultationButton>BOOK A CONSULTATION</ConsultationButton><a className="stitch-button stitch-button--outline" href="/services">EXPLORE OUR SERVICES</a></div></div></section>

    <section className="stitch-about-hospital"><div className="stitch-about-hospital-image"><StitchImage src={images.aboutHospital} alt="City International Hospital exterior" /><div className="stitch-about-hospital-overlay"><div><span className="stitch-kicker">HOSPITAL-BASED SURGERY</span><h2>Surgery Performed at City International Hospital (CIH)</h2></div></div></div><div className="stitch-section"><div className="stitch-container stitch-grid stitch-grid--two"><div><p className="stitch-about-hospital-statement">DR. MARIS AESTHETICS is a cosmetic surgery practice, not a spa or beauty center.</p><p>Surgical procedures are performed at City International Hospital (CIH), Ho Chi Minh City. A hospital environment provides access to broader medical infrastructure and supporting services surrounding surgery.</p><a className="stitch-link" href="/about-us">Explore Hospital &amp; Facilities <ArrowRight size={17} /></a></div><div className="stitch-about-scope"><span className="stitch-kicker">SURGICAL SCOPE</span><ul>{surgicalScope.map(item => <li key={item}>{item}</li>)}</ul></div><p className="stitch-disclaimer">DR. MARIS AESTHETICS and City International Hospital are separate entities. CIH is the hospital environment where surgical procedures are performed.</p></div></div></section>
  </div>
}
