'use client'

import Image from 'next/image'
import { ArrowRight, CalendarDays, CheckCircle2, FlaskConical } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'

const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0'
const consultationImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuArn0y7N8fJlLVRaHYgNvoEBhl5s-SuWW_AHixZAFLyR4sYAqohnvzbdBf4_okLKdxtROJ0zdEC4uS-Xh-MlXo122zOoCfG3UJIIv5XywvTVR-dPKLg5_Rz50k9f0D5gX86ma0FtjRvhMp6HEq_o_05qkWULno-dnCeDsR2Rydnw_FInrMlPVP4JBtVc53Sj8vKWW4K0LZtD2QODlyGB1RmDmea5dQMkOLD-sH4ArbsUY-3kMSOnm9QFg'

function ReferenceImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill unoptimized sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" />
}

function ConsultationButton() {
  const { open } = useBookingModal()
  return <button type="button" className="stitch-button stitch-button--dark" onClick={open}><CalendarDays size={16} aria-hidden="true" />Request an Online Consultation</button>
}

const concerns = [
  ['Dorsal Hump', 'Smoothing bumps on the bridge of the nose for a straighter, more refined profile.'],
  ['Bulbous Tip', 'Refining a rounded or disproportionate nasal tip to create elegant definition.'],
  ['Asymmetry', 'Correcting deviation or unevenness to achieve balanced facial proportions.'],
  ['Breathing Issues', 'Addressing functional impairments, such as a deviated septum, to improve airflow.'],
]

export function StitchTreatmentPage() {
  return <main className="stitch-page stitch-treatment-page">
    <section className="stitch-treatment-hero"><div className="stitch-treatment-hero__copy"><span className="stitch-kicker">SPECIALIZED FACIAL SURGERY · HO CHI MINH CITY</span><h1>Rhinoplasty Surgery in Vietnam</h1><p>Rhinoplasty at DR. MARIS AESTHETICS is planned around your anatomy, facial proportions, functional needs and individual goals.</p><div className="stitch-actions"><ConsultationButton /><a className="stitch-link" href="#overview">Explore the Procedure <ArrowRight size={17} /></a></div></div><div className="stitch-treatment-hero__media"><ReferenceImage src={heroImage} alt="Editorial portrait representing rhinoplasty surgery consultation" /></div></section>
    <nav className="stitch-treatment-guide" aria-label="Treatment guide"><span>IN THIS GUIDE</span><a href="#overview">What is Rhinoplasty?</a><a href="#concerns">Your Concerns</a><a href="#methodology">The Science</a></nav>
    <section id="overview" className="stitch-section stitch-treatment-section"><div className="stitch-container"><span className="stitch-kicker">OVERVIEW</span><h2>What is Rhinoplasty?</h2><div className="stitch-treatment-copy"><p>Rhinoplasty, commonly referred to as a nose job, is a highly refined surgical procedure designed to alter the shape, size, or proportions of the nose. At Maris Aesthetics, we approach rhinoplasty not just as an aesthetic enhancement, but as a meticulous restructuring that honors your foundational facial architecture.</p><p>Our philosophy is rooted in sterile warmth—combining surgical precision with a deep understanding of natural aesthetic harmony. Whether addressing cosmetic concerns or functional breathing issues, our goal is to create a result that looks entirely native to your face, enhancing your features without looking operated on.</p></div><div className="stitch-treatment-image"><ReferenceImage src={consultationImage} alt="Patient discussing rhinoplasty with a surgeon in a premium medical consultation room" /></div></div></section>
    <section id="concerns" className="stitch-section stitch-surface stitch-treatment-section"><div className="stitch-container"><span className="stitch-kicker">PATIENT-CENTERED PLANNING</span><h2>Designed Around Your Concerns</h2><div className="stitch-treatment-concerns">{concerns.map(([title, description]) => <article key={title}><h3><CheckCircle2 size={18} aria-hidden="true" />{title}</h3><p>{description}</p></article>)}</div></div></section>
    <section id="methodology" className="stitch-section stitch-treatment-section"><div className="stitch-container"><span className="stitch-kicker">SURGICAL METHODOLOGY</span><h2>The Science of Rhinoplasty</h2><p className="stitch-lead">Understanding the structural approach is key to achieving optimal results. Depending on your specific anatomical needs, we employ either an open or closed technique.</p><div className="stitch-treatment-method"><div className="stitch-treatment-method__visual" aria-label="Medical illustration of nasal surgical planning"><FlaskConical size={72} strokeWidth={1.2} aria-hidden="true" /><span>Structural planning and surgical precision</span></div><div><article><h3>Open Rhinoplasty</h3><p>Involves a small incision across the columella, providing full visibility of the nasal framework for intricate restructuring and precise modifications.</p></article><article><h3>Closed Rhinoplasty</h3><p>All incisions are hidden inside the nostrils, resulting in no visible scarring and generally a faster initial recovery time, ideal for minor refinements.</p></article></div></div></div></section>
    <section className="stitch-section stitch-consultation"><div className="stitch-container"><div><span className="stitch-kicker">BEGIN YOUR JOURNEY</span><h2>Your case deserves a surgical plan built around you.</h2><p>Send your case for a preliminary clinical review and begin a direct conversation with Dr. Maris.</p></div><ConsultationButton /></div></section>
  </main>
}
