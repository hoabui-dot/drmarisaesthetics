'use client'

import Image from 'next/image'
import { ArrowRight, Award, BadgeCheck, CalendarDays, CheckCircle2, GraduationCap, Hospital } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'
import { ourTeamMockData, type OurTeamData } from '@/src/data/our-team'

function TeamImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" unoptimized />
}

function ConsultationButton({ children = 'REQUEST A CONSULTATION' }: { children?: React.ReactNode }) {
  const { open } = useBookingModal()
  return <button type="button" onClick={open} className="stitch-button stitch-button--dark"><CalendarDays size={16} aria-hidden="true" />{children}</button>
}

const principles = [
  ['01', 'Medical Assessment First', "Surgery begins with understanding the patient's actual condition."],
  ['02', 'Realistic Expectations', 'Possible outcomes and limitations should be discussed honestly.'],
  ['03', 'Direct Responsibility', 'Dr. Maris remains personally involved in the surgical pathway.'],
  ['04', 'No Surgical Guarantees', 'Every operation carries potential risks and results vary according to individual factors.'],
]

const authorityCards = [
  { icon: GraduationCap, title: 'Education & Degrees', items: ['[INFORMATION TO VERIFY] Medical Degree', '[INFORMATION TO VERIFY] Residency Training'] },
  { icon: BadgeCheck, title: 'Certifications', items: ['Board Certified Plastic Surgeon', '[INFORMATION TO VERIFY] Advanced Surgical License'] },
  { icon: Award, title: 'Memberships', items: ['[INFORMATION TO VERIFY] Plastic Surgery Society', '[INFORMATION TO VERIFY] International Medical Association'] },
]

const careerTimeline = ['Koren Star Cosmetic Hospital', 'Asia International Cosmetic Hospital', 'Medika Cosmetic Hospital', 'City International Hospital (CIH)']
const credentialRows = [
  ['SPECIALTY', 'Specialist Level I in Aesthetic Surgery (Vietnam)'],
  ['TRAINING', 'University of Medicine and Pharmacy at Ho Chi Minh City'],
  ['PRACTICE CERTIFICATE', '0011736/BYT-CCHN'],
  ['ISSUED', '26.12.2013'],
  ['ISSUING AUTHORITY', 'Vietnam Ministry of Health'],
]
const revisionConcerns = ['capsular contracture', 'implant rupture', 'implant displacement', 'breast asymmetry', 'symmastia', 'implant removal', 'excessive scar tissue', 'free silicone', 'silicone migration or leakage', 'failed breast augmentation']
const reviewItems = ['current concerns', 'recent photographs', 'medical history', 'previous surgery information', 'implant details', 'previous operation reports', 'relevant investigations']

export function OurTeamPage({ data = ourTeamMockData }: { data?: OurTeamData }) {
  const { hero, revision } = data
  return <main className="stitch-page stitch-our-team">
    <section className="our-team-profile-hero"><div className="our-team-profile-hero__grid stitch-container"><div className="our-team-profile-hero__copy"><span className="stitch-kicker">COSMETIC &amp; PLASTIC SURGERY · HO CHI MINH CITY</span><h1>Team Doctor</h1><div className="our-team-profile-hero__identity"><p>Dr. Tran Minh Huy</p><span>Specialist Level I in Aesthetic Surgery, Vietnam</span></div><div className="our-team-profile-hero__body"><p>Dr. Maris is a cosmetic and plastic surgeon in Ho Chi Minh City providing individualized surgical planning for primary aesthetic procedures and patients seeking revision or corrective surgery after previous operations.</p><p>He remains directly involved from consultation and examination through surgical planning, surgery and postoperative follow-up.</p></div><div className="stitch-actions"><ConsultationButton>Request a Consultation</ConsultationButton><a className="stitch-link" href="#revision">Explore Surgical Expertise <ArrowRight size={17} /></a></div></div><div className="our-team-profile-hero__media"><TeamImage src={hero.image} alt="Professional portrait of Dr. Maris" /><span>DR. MARIS / SURGEON PROFILE</span></div></div></section>

    <section className="our-team-principles"><div className="stitch-container our-team-principles__grid"><div><span className="stitch-kicker">THE PRINCIPLES BEHIND THE PRACTICE</span><h2>Clear Advice. Individual Planning. <em>Responsible Surgery.</em></h2><p className="stitch-editorial-lead">“Aesthetic goals should never remove the need for medical judgment.”</p></div><div className="our-team-principles__list">{principles.map(([number, title, copy]) => <article key={number}><b>{number}</b><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section>

    <section className="our-team-authority"><div className="stitch-container"><div className="our-team-section-heading"><h2>Medical Authority &amp; Expertise</h2><p>Combining rigorous medical training with over 6 years of specialized surgical experience.</p></div><div className="our-team-authority__grid">{authorityCards.map(({ icon: Icon, title, items }) => <article key={title}><span className="our-team-authority__icon"><Icon size={24} aria-hidden="true" /></span><h3>{title}</h3><ul>{items.map(item => <li key={item}><CheckCircle2 size={15} aria-hidden="true" />{item}</li>)}</ul></article>)}</div></div></section>

    <section className="our-team-professional"><div className="stitch-container our-team-professional__grid"><div><span className="stitch-kicker">PROFESSIONAL JOURNEY</span><h2>Experience Across Cosmetic Surgery &amp; Hospital Environments</h2><p>Dr. Maris&apos;s professional background includes experience across cosmetic surgery institutions and a hospital environment in Ho Chi Minh City.</p><div className="our-team-timeline">{careerTimeline.map((item, index) => <div key={item}><b>0{index + 1}</b><span>{item}</span></div>)}</div></div><div className="our-team-professional__media"><TeamImage src={data.professionalImage || hero.image} alt="Modern premium clinic hallway in Ho Chi Minh City" /></div></div></section>

    <section className="our-team-credentials"><div className="stitch-container our-team-credentials__grid"><div><span className="stitch-kicker">QUALIFICATIONS</span><h2>Medical Training &amp; Professional Credentials</h2><p>Dr. Tran Minh Huy maintains a rigorous commitment to verified medical standards and continuous professional development. His credentials represent a foundation of academic excellence and clinical certification recognized by the Vietnam Ministry of Health.</p></div><div className="our-team-credential-list">{credentialRows.map(([label, value]) => <div key={label}><span>{label}</span><p>{value}</p></div>)}</div></div></section>

    <section id="revision" className="our-team-revision"><div className="stitch-container our-team-revision__grid"><div><span className="stitch-kicker">REVISION &amp; COMPLEX CASES</span><h2>A Focus on Surgery After Previous Procedures</h2><p>Revision surgery requires a different assessment from primary cosmetic surgery because previous operations may have changed tissue, anatomy, implant pockets, scar patterns and structural support.</p><div className="our-team-revision__concerns">{revisionConcerns.map(item => <span key={item}><ArrowRight size={14} aria-hidden="true" />{item}</span>)}</div><p className="our-team-revision__note">Not every previous surgical problem can be corrected in the same way. Suitability depends on individual examination, previous procedures, current anatomy and the patient&apos;s goals.</p><ConsultationButton>Request a Revision Surgery Assessment</ConsultationButton></div><div className="our-team-revision__media"><TeamImage src={revision.image || hero.image} alt="Specialist surgeon examining medical scans for revision planning" /></div></div></section>

    <section className="our-team-hospital"><div className="stitch-container our-team-hospital__grid"><div className="our-team-hospital__media"><TeamImage src={data.hospitalImage || hero.image} alt="Modern surgical theater at City International Hospital" /></div><div><Hospital size={34} aria-hidden="true" /><h2>Surgery at City International Hospital (CIH)</h2><p>Patient safety is paramount. All major surgical procedures are performed within the state-of-the-art operating theaters at City International Hospital. This ensures access to comprehensive medical infrastructure, specialized anesthesiology teams, and rigorous sterilization protocols that only a full-scale hospital can provide.</p><ul><li><CheckCircle2 size={16} aria-hidden="true" />JCI Accredited Standards</li><li><CheckCircle2 size={16} aria-hidden="true" />24/7 Intensive Care Support</li></ul></div></div></section>

    <section className="our-team-international"><div className="stitch-container our-team-international__grid"><div><span className="stitch-kicker">INTERNATIONAL PATIENTS</span><h2>Consult Dr. Maris Before Travelling to Vietnam</h2><p className="stitch-lead">“Patients from Australia, New Zealand, the United States, Europe and other international markets can begin discussing their case before travelling to Ho Chi Minh City.”</p><p className="our-team-review-label">What you can provide for preliminary review:</p><ul>{reviewItems.map(item => <li key={item}><CheckCircle2 size={16} aria-hidden="true" />{item}</li>)}</ul><blockquote>&quot;Your trip should begin with information — not uncertainty.&quot;</blockquote><p className="our-team-international__note">Note: Remote consultation supports preliminary planning but does not replace the in-person examination required before a final surgical decision.</p><div className="stitch-actions"><ConsultationButton>Request an Online Consultation</ConsultationButton><a className="stitch-link" href="#consultation">International Patient Guide <ArrowRight size={17} /></a></div></div><div className="our-team-international__media"><TeamImage src={data.internationalImage || hero.image} alt="Dr. Maris conducting a remote patient consultation" /></div></div></section>
  </main>
}
