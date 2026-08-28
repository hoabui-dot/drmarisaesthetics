'use client'
/* The exported Stitch screen uses anchor links for its in-page and legacy routes. */
/* eslint-disable @next/next/no-html-link-for-pages */

import Image from 'next/image'
import { ArrowRight, CheckCircle2, CalendarDays } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'

const media = (name: string) => `/api/strapi-media/uploads/${name}`

const images = {
  hero: media('hero_background_image_4966664b0d.png'),
  heroDoctor: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0',
  doctor: media('doctor_new_4622af55c6.jpg'),
  clinic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxLNXCFVyLcdlfs3uKkXCF1nWzjOTlVHjbpSP07wg76cD4otnSBnmCAAt1Q57Tyj15rO6f8Z6857zzPhjjWAmXaeErAAZnwu6mADqs3tc98ftky9z2AYeSGQb0fDf_TJgY_52sEsTvavziZQJlySwrko2v_jKxGIpfSjrhbY2TDZfq64krwVmF90rBv7n4UMWEk2pyh4qcEwDImDsvTDEw7iLuJAeoRqbp3rlrmpdS1aQ7tLL7vbdw5g',
  technology: media('large_technology_background_6c9f11b3cb.png'),
  logo: media('logo_6b8bffd915.png'),
}

function ConsultationButton({ children = 'REQUEST A CONSULTATION' }: { children?: React.ReactNode }) {
  const { open } = useBookingModal()
  return <button type="button" onClick={open} className="stitch-button stitch-button--dark"><CalendarDays size={16} />{children}</button>
}

const process = [
  ['01', 'Consultation', 'Discuss concerns, goals, medical history and previous procedures.'],
  ['02', 'Examination', 'Assess anatomy and individual condition.'],
  ['03', 'Surgical Planning', 'Develop the surgical plan around the patient rather than a standard package.'],
  ['04', 'Surgery', 'Dr. Maris personally performs the procedure.'],
  ['05', 'Follow-Up', 'Recovery and postoperative progress remain part of the surgical process.'],
]

const journey = [
  ['Send Your Case', 'Submit your medical history, goals, and high-resolution photos for a preliminary clinical review.'],
  ['Video Consultation', 'A direct 1-on-1 video call with Dr. Maris to discuss your surgical plan, expectations, and safety.'],
  ['Travel Planning', 'Receive a detailed itinerary, including hospital booking and recommended recovery accommodation.'],
  ['In-Person Exam', 'Final clinical examination and pre-operative testing at City International Hospital (CIH).'],
  ['Your Procedure', 'Surgery performed by Dr. Maris in a fully accredited international hospital setting.'],
  ['Recovery & Follow-Up', 'Post-operative care and long-term follow-up schedule to ensure optimal healing results.'],
]

const revisionConcerns = ['Capsular Contracture', 'Asymmetry Correction', 'Excessive Scar Tissue', 'Implant Malposition', 'Over-resected Rhinoplasty', 'Contour Irregularities', 'Unsatisfactory Functional Outcomes']

function StitchImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className={`object-cover ${className}`} unoptimized />
}

export function StitchHomepage() {
  return <div className="stitch-page stitch-homepage">
    <section className="stitch-home-hero"><div className="stitch-home-hero__inner">
      <div className="stitch-home-hero__copy">
        <span className="stitch-kicker"><i /> HOSPITAL-BASED COSMETIC SURGERY · HO CHI MINH CITY</span>
        <h1>Plastic Surgery in Vietnam for <em>International Patients</em></h1>
        <p>Cosmetic surgery is a medical decision before it is an aesthetic one. At DR. MARIS AESTHETICS, your case is personally assessed and managed by Dr. Maris, with surgery performed at City International Hospital (CIH) in Ho Chi Minh City.</p>
        <p>From primary cosmetic procedures to complex revision surgery, every surgical plan begins with your anatomy, medical history, previous procedures and individual goals.</p>
        <div className="stitch-actions"><ConsultationButton /><a className="stitch-link" href="#journey">Explore Surgical Procedures <ArrowRight size={17} /></a></div>
        <div className="stitch-proof-row"><span>Direct Surgeon Care</span><b>|</b><span>Hospital-Based Surgery</span><b>|</b><span>International Patients</span><b>|</b><span>Revision Surgery</span></div>
      </div>
      <div className="stitch-home-hero__image"><div className="stitch-image-wash" /><StitchImage src={images.heroDoctor} alt="Dr. Maris in a clinical setting" /></div>
    </div></section>

    <section className="stitch-section stitch-process"><div className="stitch-container"><div className="stitch-grid stitch-grid--two"><div><span className="stitch-kicker">YOUR SURGICAL CARE PROCESS</span><h2>Who will actually perform my surgery?</h2><p>Dr. Maris brings 6+ years of specialized cosmetic surgery experience to every case. Unlike high-volume clinics, we strictly limit our surgical schedule so that Dr. Maris is personally involved in every critical step of your journey.</p><div className="stitch-process-line">{process.map(([n, title]) => <div key={n}><b>{n}</b><span>{title}</span></div>)}</div><a className="stitch-link" href="/about-us">Meet Dr. Maris <ArrowRight size={17} /></a></div><div className="stitch-portrait"><StitchImage src={images.doctor} alt="Dr. Maris, lead surgeon" /><div className="stitch-stat"><strong>6+ Years</strong><span>Specialized Cosmetic Surgery</span></div></div></div></div></section>

    <section className="stitch-section stitch-dark"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">SPECIALIZED CARE</span><h2>Revision Cosmetic Surgery Vietnam</h2><h3>When Your First Surgery Did Not Go as Planned</h3><p>Revision surgery is not simply doing the procedure again. It requires a careful assessment of what was performed, the tissue that remains and what can be safely improved.</p><div className="stitch-callout"><strong>Can My Previous Cosmetic Surgery Be Corrected?</strong><p>Many issues can be significantly improved, but realistic outcomes depend on each individual case.</p><a className="stitch-link stitch-link--light" href="#consultation">Request a Revision Assessment <ArrowRight size={17} /></a></div></div><div><h3 className="stitch-light-heading">Common Revision Concerns We Address</h3><ul className="stitch-check-list">{revisionConcerns.map(item => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></div></div></section>

    <StitchDoctorAssessment />
    <section className="stitch-section"><div className="stitch-container"><div className="stitch-section-heading"><span className="stitch-kicker">HOSPITAL-BASED SURGERY</span><h2>Surgery Performed at City International Hospital (CIH)</h2><p>Hospital-based surgery provides the medical infrastructure, safety systems and specialist support required for complex aesthetic procedures.</p></div><div className="stitch-clinic-grid"><div><p>Major cosmetic and reconstructive procedures require more than just a surgical suite. We operate within a comprehensive medical infrastructure that provides 24/7 emergency support, advanced resuscitation capabilities, and specialized nursing care.</p><p>This hospital-based environment is critical for patient safety, particularly for complex revision cases and multi-procedure surgeries that require intensive monitoring and professional medical oversight.</p><p className="stitch-disclaimer">Disclaimer: DR. MARIS AESTHETICS and City International Hospital are separate entities. CIH is the hospital where surgical procedures are performed.</p><a className="stitch-link" href="/about-us">Explore Hospital &amp; Facilities <ArrowRight size={17} /></a></div><div className="stitch-clinic-image"><StitchImage src={images.clinic} alt="City International Hospital facility" /></div></div></div></section>

    <section id="journey" className="stitch-section stitch-surface"><div className="stitch-container"><span className="stitch-kicker">INTERNATIONAL PATIENTS</span><h2>Planning Plastic Surgery in Vietnam From Overseas</h2><p className="stitch-lead">A seamless, medically-supervised experience from your first inquiry to your final recovery.</p><div className="stitch-journey-grid">{journey.map(([title, copy], index) => <article key={title}><b>0{index + 1}</b><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section id="consultation" className="stitch-section stitch-consultation"><div className="stitch-container"><div><span className="stitch-kicker">BEGIN YOUR JOURNEY</span><h2>Your case deserves a surgical plan built around you.</h2><p>Send your case for a preliminary clinical review and begin a direct conversation with Dr. Maris.</p></div><ConsultationButton>Send Your Case</ConsultationButton></div></section>
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
  return <section className="stitch-section stitch-profile"><div className="stitch-container stitch-grid stitch-grid--two"><div className="stitch-portrait"><StitchImage src={images.doctor} alt="Dr. Maris, lead surgeon" /></div><div><span className="stitch-kicker">DIRECT SURGEON ASSESSMENT</span><h2>Your Case Is Personally Assessed by Dr. Maris</h2><p className="stitch-role">Dr. Maris / Dr. Tran Minh Huy · Cosmetic &amp; Plastic Surgeon</p><p>A thorough assessment considers anatomy, previous procedures, implant history, surgical goals, limitations and recovery expectations before any recommendation is made.</p><ul className="stitch-assessment-list">{['Anatomy assessment', 'Previous procedures', 'Implant history', 'Surgical goals', 'Limitations', 'Recovery expectations', 'Revision considerations'].map(item => <li key={item}><CheckCircle2 size={16} />{item}</li>)}</ul></div></div></section>
}

export function StitchHomepageFaq() {
  return <section className="stitch-section stitch-surface"><div className="stitch-container"><span className="stitch-kicker">SURGICAL PLANNING</span><h2>Frequently Asked Questions About Plastic Surgery in Vietnam</h2><div className="stitch-faq-grid">{homepageFaq.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></div></section>
}

export function StitchHomepageSupplement() {
  return <>
    <section className="stitch-section stitch-profile"><div className="stitch-container stitch-grid stitch-grid--two"><div className="stitch-portrait"><StitchImage src={images.doctor} alt="Dr. Maris, lead surgeon" /></div><div><span className="stitch-kicker">DIRECT SURGEON ASSESSMENT</span><h2>Your Case Is Personally Assessed by Dr. Maris</h2><p className="stitch-role">Dr. Maris / Dr. Tran Minh Huy · Cosmetic &amp; Plastic Surgeon</p><p>A thorough assessment considers anatomy, previous procedures, implant history, surgical goals, limitations and recovery expectations before any recommendation is made.</p><ul className="stitch-assessment-list">{['Anatomy assessment', 'Previous procedures', 'Implant history', 'Surgical goals', 'Limitations', 'Recovery expectations', 'Revision considerations'].map(item => <li key={item}><CheckCircle2 size={16} />{item}</li>)}</ul></div></div></section>
    <section className="stitch-section stitch-surface"><div className="stitch-container"><span className="stitch-kicker">SURGICAL PLANNING</span><h2>Frequently Asked Questions About Plastic Surgery in Vietnam</h2><div className="stitch-faq-grid">{homepageFaq.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></div></section>
  </>
}

export function StitchAboutUs() {
  return <div className="stitch-page stitch-about"><section className="stitch-about-intro"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">SURGEON-LED COSMETIC SURGERY · HO CHI MINH CITY</span><h1>About <em>Us</em></h1><blockquote>“Cosmetic surgery should begin with a medical assessment, a clear surgical plan and confidence in the surgeon responsible for your care.”</blockquote><p>DR. MARIS AESTHETICS is a surgeon-led cosmetic surgery practice in Ho Chi Minh City, providing personalized care for patients considering primary aesthetic procedures as well as complex revision surgery after previous operations.</p><p>Dr. Maris is directly involved from consultation and examination through surgery and postoperative follow-up.</p><div className="stitch-actions"><a className="stitch-button stitch-button--dark" href="/team">MEET DR. MARIS</a><ConsultationButton /></div></div><div className="stitch-about-image"><StitchImage src={images.doctor} alt="Dr. Maris, lead plastic surgeon" /></div></div></section><section className="stitch-section"><div className="stitch-container"><span className="stitch-kicker">DIRECT SURGEON CARE</span><h2>Cosmetic Surgery Built Around Direct Surgeon Involvement</h2><p className="stitch-lead">At Maris Aesthetics, the surgeon who consults with you should be the one who operates on you and oversees your recovery.</p><div className="stitch-process-line stitch-process-line--large">{process.map(([n, title, copy]) => <div key={n}><b>{n}</b><span>{title}</span><small>{copy}</small></div>)}</div></div></section><section className="stitch-section stitch-surface"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">OUR APPROACH</span><h2>Assessment Before Procedure</h2><blockquote>“The procedure someone initially requests is not automatically the procedure that should be recommended.”</blockquote><p>The objective is to understand the actual condition first, then build a plan around the patient.</p></div><div><h3>Surgical planning considers:</h3><ul className="stitch-assessment-list">{['Anatomy', 'Skin and tissue condition', 'Medical history', 'Previous operations', 'Existing implants', 'Scar tissue', 'Body proportions', 'Current symptoms', 'Aesthetic goals', 'Recovery expectations', 'Limitations of surgery'].map(item => <li key={item}>{item}</li>)}</ul></div></div></section><section className="stitch-section stitch-profile"><div className="stitch-container stitch-grid stitch-grid--two"><div className="stitch-portrait"><StitchImage src={images.doctor} alt="Dr. A. Maris, MD" /></div><div><span className="stitch-kicker">DR. MARIS</span><h2>Dr. A. Maris, MD</h2><p className="stitch-role">Cosmetic &amp; Plastic Surgeon | 6+ Years of Cosmetic Surgery Experience</p><p>Every consultation is an opportunity to understand the patient’s goals, concerns and expectations before discussing a procedure.</p><h3>His Consultation Philosophy</h3><p>Good surgery begins with listening, examination and a clear plan—not with a package or a promise.</p></div></div></section><section className="stitch-section stitch-dark"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">REVISION &amp; COMPLEX SURGERY</span><h2>For Patients Whose Previous Surgery Did Not Go as Planned</h2><p>Revision surgery requires an individualized assessment of anatomy, implants, scar tissue and the limits of what can safely be corrected.</p><ConsultationButton /></div><div><ul className="stitch-check-list">{revisionConcerns.slice(0, 6).map(item => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></div></div></section><section className="stitch-section stitch-surface"><div className="stitch-container stitch-international"><span className="stitch-kicker">INTERNATIONAL PATIENT STANDARDS</span><h2>Personalized Care Across Every Border</h2><div className="stitch-journey-grid">{[['Virtual Consultations', 'Begin your journey from home with an in-depth video consultation.'], ['Concierge Planning', 'Our international patient coordinator assists with logistics and scheduling.'], ['Transparent Care', 'Clear communication and medically-supervised care from consultation through follow-up.']].map(([title, copy], index) => <article key={title}><b>0{index + 1}</b><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section><section className="stitch-section stitch-consultation"><div className="stitch-container"><div><span className="stitch-kicker">BEGIN YOUR PERSONALIZED AESTHETIC JOURNEY</span><h2>Start with a conversation.</h2></div><ConsultationButton /></div></section></div>
}
