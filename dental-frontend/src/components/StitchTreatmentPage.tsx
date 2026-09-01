'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, FlaskConical } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'

const images = {
  hero: '/api/strapi-media/uploads/aec6099c_fa9c_4a93_9158_e3d6baed5fa5_1b2cfb60ff.png',
  consultation: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArn0y7N8fJlLVRaHYgNvoEBhl5s-SuWW_AHixZAFLyR4sYAqohnvzbdBf4_okLKdxtROJ0zdEC4uS-Xh-MlXo122zOoCfG3UJIIv5XywvTVR-dPKLg5_Rz50k9f0D5gX86ma0FtjRvhMp6HEq_o_05qkWULno-dnCeDsR2Rydnw_FInrMlPVP4JBtVc53Sj8vKWW4K0LZtD2QODlyGB1RmDmea5dQMkOLD-sH4ArbsUY-3kMSOnm9QFg',
  anatomy: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA45c7644wADMDN6IXLAmYmmnhM0NLBxuB-_7XS14agtuIF07OqnSbezqAbHFHQHDeZhiPnqYHWq8fZq4O_FyF6TF8RMbcJum74mnSNjMM0qZbK3Ctbgp-ZpE_ABBuBKF0KjJjkp8gnG5PNGDkB4c6XtPoyBFJH0Q9HVIggvL-o9WLLrk__O3oIpDvmFpqsUTXeYq4zMGzTGFoxbmZA2UWwoWCbD4-8rvNEmYjrIkDolZptDDoihj3l',
  resultProfile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnHjZmIOT2CULdwtLqzLFWYQuSkwpbMD_QFJMz9LPNSb0W2li2Bect_G71yyk8p9tq6iZzcyKJpca2aknEY_BZW2yxnvsRppH3xVCiKVS9xUmhCBpXtOELtJSSx4wlUhMMl_STg4uWImt6GVHU3cHhIetynrTnJtNC1gAyufztC3wqQfeNuSf7aIsLtelnsjiEoKMbeMZDXrh96fpeITBciNLW1gq-trzNgN4Iyo1zmZu65xvuvTGV',
  resultFront: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWxOF_HIYVNp1HXLJB9xdOqSn2caNXCAkrVOc7I_Di_32_vcuKilj-AhbcGkGMW0jX6M7EE8jM4duKO7MYmFFGQm2u2LXxtop_aN17XFPhMtFf-ClhZcwcYuWdmApGmrFRrriAruIJG25sFaBANMEF-O0OqgSScJmJj7fpqhCqhjn2Y9kphUbJNxaSApZjVC5BVYzpJZ4yh7OKfDVuIwwYsVesV3l9a9asABRIDFghnYgnyWom_3w5',
}

const concerns = [
  ['Dorsal Hump', 'Reduction of a prominent bump on the bridge of the nose.'],
  ['Bulbous Tip', 'Refinement of a wide, rounded, or ill-defined nasal tip.'],
  ['Asymmetry', 'Correction of a crooked nose or uneven nostrils.'],
  ['Breathing Issues', 'Septoplasty and turbinate reduction to improve airflow.'],
]
const guide = [['overview', 'Overview'], ['candidates', 'Who Is This Procedure For?'], ['anatomy', 'Nasal Anatomy'], ['consultation', 'Consultation & Planning'], ['approach', 'Surgical Approaches'], ['timeline', 'Recovery Timeline'], ['results', 'Before & After'], ['considerations', 'Risks & Considerations'], ['faq', 'Frequently Asked Questions']]

function ReferenceImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <Image src={src} alt={alt} fill unoptimized sizes="(max-width: 900px) 100vw, 50vw" className={`object-cover ${className}`} />
}
function ConsultationButton() {
  const { open } = useBookingModal()
  return <button type="button" className="stitch-button stitch-button--dark" onClick={open}><CalendarDays size={16} aria-hidden="true" />Request a Consultation</button>
}
function BeforeAfter({ src, alt, title, description }: { src: string; alt: string; title: string; description: string }) {
  return <article className="stitch-treatment-result"><div className="stitch-treatment-result__image"><ReferenceImage src={src} alt={alt} /><span>Before</span><span>After</span></div><h4>{title}</h4><p>{description}</p></article>
}

type StitchTreatmentPageProps = {
  showQuickFacts?: boolean
}

export function StitchTreatmentPage({ showQuickFacts = true }: StitchTreatmentPageProps) {
  return <main className="stitch-page stitch-treatment-page">
    <section className="stitch-treatment-hero">
      <div className="stitch-treatment-hero__copy">
        <nav className="stitch-treatment-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronDown size={14} aria-hidden="true" /><Link href="/face/rhinoplasty">Face</Link><ChevronDown size={14} aria-hidden="true" /><span>Rhinoplasty</span></nav>
        <span className="stitch-kicker">DR. MARIS AESTHETICS · FACIAL PROCEDURES</span><h1>Rhinoplasty Surgery in Vietnam</h1>
        <p>At DR. MARIS AESTHETICS, we redefine nasal harmony through a meticulous structural approach that honors your unique facial architecture. Our surgical philosophy combines clinical precision with natural, balanced results that enhance your features without looking operated on.</p>
        <div className="stitch-treatment-review"><CheckCircle2 size={18} aria-hidden="true" />Reviewed by Dr. Maris · Ho Chi Minh City, Vietnam</div><ConsultationButton />
      </div>
      <div className="stitch-treatment-hero__media"><ReferenceImage src={images.hero} alt="Rhinoplasty surgery consultation at Dr. Maris Aesthetics" /></div>
      {showQuickFacts && <aside className="stitch-treatment-facts"><h3><FlaskConical size={18} aria-hidden="true" />Quick Facts</h3><dl><div><dt>Duration</dt><dd>2–3 Hrs</dd></div><div><dt>Anesthesia</dt><dd>General</dd></div><div><dt>Recovery</dt><dd>7–10 Days</dd></div><div><dt>Longevity</dt><dd>Permanent</dd></div></dl></aside>}
    </section>

    <section className="stitch-section stitch-treatment-content"><div className="stitch-container stitch-treatment-content-grid"><aside className="stitch-treatment-toc"><span>CONTENTS</span>{guide.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}<div className="stitch-treatment-toc-card"><h4>Ready to discuss your goals?</h4><p>Schedule a private consultation with Dr. Maris.</p><ConsultationButton /></div></aside><article className="stitch-treatment-article">
      <section id="overview" className="stitch-treatment-block"><span className="stitch-kicker">OVERVIEW</span><h2>What is Rhinoplasty?</h2><p className="stitch-treatment-lead">Rhinoplasty, commonly referred to as a nose job, is a highly refined surgical procedure designed to alter the shape, size, or proportions of the nose. At Dr. Maris Aesthetics, we approach rhinoplasty as a meticulous restructuring that honors your foundational facial architecture.</p><div className="stitch-treatment-image"><ReferenceImage src={images.consultation} alt="Patient consulting with a surgeon in a premium medical consultation room" /></div></section>
      <section id="candidates" className="stitch-treatment-block"><h2>Are You a Good Candidate?</h2><div className="stitch-treatment-panel"><p>Rhinoplasty may be appropriate if you are physically healthy, have realistic goals and want to improve the balance or function of your nose.</p><ul>{['Your facial growth is complete.', 'You are physically healthy.', 'You do not smoke or are willing to quit.', 'You have realistic goals and a positive outlook.'].map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul></div></section>
      <section id="anatomy" className="stitch-treatment-block"><h2>Understanding Nasal Anatomy</h2><p className="stitch-treatment-lead">A successful rhinoplasty begins with understanding the relationship between bone, cartilage, skin and airway function.</p><div className="stitch-treatment-anatomy"><ReferenceImage src={images.anatomy} alt="Editorial medical illustration of nasal anatomy" /><span>Nasal Bone</span><span>Alar Cartilage</span></div><div className="stitch-treatment-two-col"><div><h3>The Dorsum (Bridge)</h3><p>The bridge defines the profile and influences how the nose relates to the forehead and cheeks.</p></div><div><h3>The Apex (Tip)</h3><p>The tip requires precise structural planning to create definition while preserving natural movement.</p></div></div></section>
      <section id="consultation" className="stitch-treatment-block"><h2>Consultation &amp; Planning</h2><p className="stitch-treatment-lead">Every plan begins with a detailed assessment of facial proportions, skin thickness, nasal structure and airway function.</p><div className="stitch-treatment-three-col">{[['Facial Analysis', 'Detailed assessment of your facial proportions and nasal structure.'], ['Imaging & Morphing', 'Advanced imaging helps visualize realistic potential outcomes.'], ['Functional Assessment', 'Thorough evaluation of your airway and breathing needs.']].map(([title, text]) => <article key={title}><CheckCircle2 size={24} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section id="approach" className="stitch-treatment-block"><h2>Surgical Approaches</h2><p className="stitch-treatment-lead">Depending on your specific anatomical needs, we employ either an open or closed technique.</p><div className="stitch-treatment-approaches">{[['Open Rhinoplasty', ['A discreet incision across the columella.', 'Full visibility of the nasal structures.', 'Ideal for complex or revision cases.']], ['Closed Rhinoplasty', ['All incisions concealed inside the nostrils.', 'Generally less initial swelling.', 'Best suited for straightforward refinements.']]].map(([title, points]) => <article key={title as string}><h3>{title as string}</h3><ul>{(points as string[]).map(point => <li key={point}><Check size={15} aria-hidden="true" />{point}</li>)}</ul></article>)}</div></section>
      <section id="timeline" className="stitch-treatment-block stitch-treatment-timeline"><h2>Recovery Timeline</h2>{[['Days 1–3: Initial Healing', 'Expect swelling, bruising and rest while the first phase of healing begins.'], ['Day 7: Splint Removal', 'The splint is typically removed and early changes become visible.'], ['Weeks 2–4: Subsiding Swelling', 'Most daily activities resume as swelling continues to settle.'], ['1 Year: Final Refinement', 'The final shape continues to refine as tissues fully mature.']].map(([title, text], index) => <div key={title}><b>{index + 1}</b><h3>{title}</h3><p>{text}</p></div>)}</section>
      <section id="results" className="stitch-treatment-block"><div className="stitch-treatment-results-heading"><div><h2>Before &amp; After</h2><p className="stitch-treatment-lead">Every result is individual. These examples illustrate the type of refinement careful planning can achieve.</p></div><Link className="stitch-link" href="/results">View Full Gallery <ArrowRight size={16} /></Link></div><div className="stitch-treatment-results"><BeforeAfter src={images.resultProfile} alt="Profile refinement before and after rhinoplasty" title="Profile Refinement" description="Dorsal hump reduction and tip rotation." /><BeforeAfter src={images.resultFront} alt="Tip contouring before and after rhinoplasty" title="Tip Contouring" description="Refinement of bulbous tip and alar base reduction." /></div></section>
      <section id="considerations" className="stitch-treatment-block"><h2>Risks &amp; Considerations</h2><div className="stitch-treatment-panel stitch-treatment-risks"><div><h3>Is it right for you?</h3><p>Rhinoplasty is a personal medical decision. A private consultation is the only way to determine whether surgery is appropriate for your anatomy and goals.</p></div><div><h4>Potential Risks</h4><ul><li>Infection or bleeding</li><li>Asymmetry</li><li>Temporary changes in skin sensation</li><li>Breathing difficulties (rare)</li></ul></div><div><h4>Prerequisites</h4><ul><li>Facial growth is complete</li><li>Physically healthy</li><li>Non-smoker</li><li>Positive outlook and specific goals</li></ul></div></div></section>
      <section id="faq" className="stitch-treatment-block stitch-treatment-faq"><h2>Frequently Asked Questions</h2>{[['Will rhinoplasty affect my breathing?', 'A structural approach considers both appearance and airway function. Any functional concerns are assessed during consultation.'], ['How long does recovery take?', 'Most patients return to light daily activities within 7–10 days, while refinement continues over the following months.'], ['Is rhinoplasty permanent?', 'The structural changes are long-lasting, although natural aging and injury can affect results over time.']].map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</section>
    </article></div></section>
    <section className="stitch-section stitch-consultation"><div className="stitch-container"><div><span className="stitch-kicker">BEGIN YOUR JOURNEY</span><h2>Your case deserves a surgical plan built around you.</h2><p>Send your case for a preliminary clinical review and begin a direct conversation with Dr. Maris.</p></div><ConsultationButton /></div></section>
  </main>
}
