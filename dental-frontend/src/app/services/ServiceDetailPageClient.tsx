"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { CalendarDays, Check, CirclePlay, Heart, ShieldCheck, Sparkles, Star, Users, Wrench, Bone, Crown, Cpu, ScanLine, MonitorCog, Crosshair, Clock3, Workflow, ClipboardList, HeartPulse, MapPin, Phone, Mail, Clock } from "lucide-react";
import { NavigationLink } from "@/src/components/ui/NavigationLink";
import { SelectBase } from "@/src/components/ui/SelectBase";
import { useBookingModal } from "@/src/components/booking-modal/BookingModalContext";
import { MotionFaqAccordion } from "@/src/components/ui/motion-faq-accordion";

function mediaUrl(media: any): string {
  const url = media?.url || media?.data?.attributes?.url || "";
  return url.startsWith("/") ? `/api/strapi-media${url}` : url;
}

function iconFor(name: string) {
  switch (name) {
    case "ShieldCheck": return ShieldCheck;
    case "Sparkles": return Sparkles;
    case "Heart": return Heart;
    case "Users": return Users;
    case "Wrench": return Wrench;
    case "Bone": return Bone;
    case "Crown": return Crown;
    case "Cpu": return Cpu;
    case "ScanLine": return ScanLine;
    case "MonitorCog": return MonitorCog;
    case "Crosshair": return Crosshair;
    case "Clock3": return Clock3;
    case "Workflow": return Workflow;
    case "ClipboardList": return ClipboardList;
    case "HeartPulse": return HeartPulse;
    default: return Sparkles;
  }
}

function DetailImage({ media, alt, className = "" }: { media: any; alt: string; className?: string }) {
  const src = mediaUrl(media);
  return src ? <Image src={src} alt={alt} fill unoptimized className={className || "object-cover"} /> : null;
}

function sectionNavIcon(target: string) {
  switch (target) {
    case "overview": return ShieldCheck;
    case "benefits": return Sparkles;
    case "candidates": return Users;
    case "structure": return Bone;
    case "technology": return Cpu;
    case "procedure": return Workflow;
    case "specialists": return Users;
    case "patient-results": return Heart;
    case "pricing": return Crown;
    case "faq": return ClipboardList;
    case "consultation": return CalendarDays;
    default: return Sparkles;
  }
}

function Hero({ data }: { data: any }) {
  const { open } = useBookingModal();
  const avatars = Array.isArray(data.trust_avatars) ? data.trust_avatars : [];
  return (
    <section className="service-detail-hero" aria-labelledby="service-detail-title">
      <div className="service-detail-hero__content">
        <p className="service-detail-breadcrumb"><NavigationLink href="/services">SERVICES</NavigationLink><span aria-hidden="true">/</span>{data.breadcrumb_label}</p>
        <h1 id="service-detail-title">{data.title}</h1>
        <p className="service-detail-hero__description">{data.description}</p>
        <div className="service-detail-hero__actions">
          <button type="button" className="service-detail-primary" onClick={open}><CalendarDays size={15} aria-hidden="true" />{data.primary_cta_label}</button>
          <NavigationLink href={data.secondary_cta_link || "#technology"} className="service-detail-secondary"><CirclePlay size={17} aria-hidden="true" />{data.secondary_cta_label}</NavigationLink>
        </div>
        <div className="service-detail-trust">
          <div className="service-detail-avatars" aria-hidden="true">
            {avatars.slice(0, 4).map((avatar: any, index: number) => <span key={avatar.id || index}><DetailImage media={avatar} alt="" /></span>)}
          </div>
          <div><strong>{data.trust_label}</strong><div className="service-detail-rating"><span aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((star) => <Star key={star} size={12} fill="currentColor" aria-hidden="true" />)}</span><b>{data.trust_rating}</b></div></div>
        </div>
      </div>
      <div className="service-detail-hero__media"><DetailImage media={data.hero_image} alt={`${data.title} cosmetic surgery`} /></div>
      <AnchorNav sections={data.sections} />
    </section>
  );
}

function AnchorNav({ sections }: { sections: any[] }) {
  const items = sections.map((section: any) => { const target = section.__component.split(".").pop(); return { id: section.id, label: section.anchor_label || section.title || section.variants_title || target, target }; });
  return <nav className="service-detail-anchor-nav" aria-label="Service sections">{items.map((item) => { const Icon = sectionNavIcon(item.target); return <a key={item.id} href={`#service-detail-${item.target}-${item.id}`}><Icon size={14} aria-hidden="true" />{item.label}</a>; })}</nav>;
}

function Overview({ section }: { section: any }) {
  return <section id={`service-detail-overview-${section.id}`} className="service-detail-overview service-detail-container">
    <div><p className="service-detail-eyebrow">ABOUT THIS TREATMENT</p><h2>{section.title}</h2><p className="service-detail-copy">{section.description}</p><ul className="service-detail-feature-list">{(section.features || []).map((feature: any) => { const Icon = iconFor(feature.icon); return <li key={feature.id}><span><Icon size={21} aria-hidden="true" /></span><div><h3>{feature.title}</h3><p>{feature.description}</p></div></li>; })}</ul></div>
    <div className="service-detail-overview__media"><DetailImage media={section.image} alt={section.title} /></div>
  </section>;
}

function Benefits({ section, serviceList = [] }: { section: any; serviceList?: any[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const cards = serviceList.length ? serviceList : section.variants || [];
  const moveSlider = (direction: number) => {
    sliderRef.current?.scrollBy({ left: direction * sliderRef.current.clientWidth, behavior: "smooth" });
  };
  return <div id={`service-detail-benefits-${section.id}`} className="service-detail-benefits-wrap service-detail-container">
    <section className="service-detail-panel"><div className="service-detail-slider-heading"><h2>{section.variants_title}</h2>{cards.length > 4 && <div className="service-detail-slider-controls"><button type="button" onClick={() => moveSlider(-1)} aria-label="Previous services"><span aria-hidden="true">←</span></button><button type="button" onClick={() => moveSlider(1)} aria-label="Next services"><span aria-hidden="true">→</span></button></div>}</div><div ref={sliderRef} className="service-detail-variant-slider"><div className="service-detail-variant-grid">{cards.map((item: any) => { const Icon = iconFor(item.icon || "Sparkles"); return <article key={item.id || item.slug}><span className="service-detail-icon-badge"><Icon size={20} aria-hidden="true" /></span><div className="service-detail-variant-image"><DetailImage media={item.image || section.image} alt={item.title} /></div><h3>{item.title}</h3><p>{item.description}</p></article>; })}</div></div></section>
    <section id={`service-detail-benefits-list-${section.id}`} className="service-detail-panel service-detail-benefits"><h2>{section.benefits_title}</h2><div className="service-detail-benefit-grid">{(section.benefits || []).map((item: any) => { const Icon = iconFor(item.icon); return <article key={item.id}><span className="service-detail-benefit-icon"><Icon size={28} aria-hidden="true" /></span><h3>{item.title}</h3><p>{item.description}</p></article>; })}</div></section>
  </div>;
}

function Candidates({ section }: { section: any }) {
  return <section id={`service-detail-candidates-${section.id}`} className="service-detail-candidates service-detail-container"><div><p className="service-detail-eyebrow">WHO IT&apos;S FOR</p><h2>{section.title}</h2><ul>{(section.items || []).map((item: any) => <li key={item.id}><span><Check size={12} aria-hidden="true" /></span>{item.text}</li>)}</ul></div><div className="service-detail-candidates__media"><DetailImage media={section.image} alt={section.title} /></div></section>;
}

function TechnologySection({ section }: { section: any }) {
  return <section id={`service-detail-technology-${section.id}`} className="service-detail-technology service-detail-container" aria-labelledby="service-detail-technology-title">
    <h2 id="service-detail-technology-title">{section.title}</h2>
    <div className="service-detail-technology-grid">
      <article className="service-detail-technology-feature">
        <div><h3>{section.featured_title}</h3><p>{section.featured_description}</p><span className="service-detail-technology-cta">{section.featured_cta}</span></div>
        <div className="service-detail-technology-feature-image"><DetailImage media={section.featured_image} alt="Advanced surgical planning and clinical imaging" /></div>
      </article>
      {(section.technologies || []).map((item: any) => { const Icon = iconFor(item.icon); return <article className="service-detail-technology-card" key={item.id || item.title}><Icon size={44} strokeWidth={1.5} aria-hidden="true" /><h3>{item.title}</h3><p>{item.description}</p></article>; })}
    </div>
  </section>;
}

function ProcedureSection({ section }: { section: any }) {
  return <section id={`service-detail-procedure-${section.id}`} className="service-detail-procedure service-detail-container" aria-labelledby="service-detail-procedure-title">
    <h2 id="service-detail-procedure-title">{section.title}</h2>
    <ol className="service-detail-procedure-timeline">
      {(section.steps || []).map((step: any) => { const Icon = iconFor(step.icon); return <li key={step.id || step.number}><span className="service-detail-procedure-number">{step.number}</span><Icon className="service-detail-procedure-icon" size={38} strokeWidth={1.5} aria-hidden="true" /><h3>{step.title}</h3><p>{step.description}</p></li>; })}
    </ol>
  </section>;
}

function SpecialistsSection({ section }: { section: any }) {
  return <section id={`service-detail-specialists-${section.id}`} className="service-detail-specialists service-detail-container" aria-labelledby="service-detail-specialists-title">
    <h2 id="service-detail-specialists-title">{section.title}</h2>
    <div className="service-detail-specialist-grid">{(section.doctors || []).map((doctor: any) => <article className="service-detail-specialist-card" key={doctor.id || doctor.name}>
      <div className="service-detail-specialist-portrait"><DetailImage media={doctor.portrait} alt={`${doctor.name} portrait`} /></div>
      <h3>{doctor.name}</h3><p className="service-detail-specialist-specialty">{doctor.specialty}</p>
      <ul><li><Check size={13} aria-hidden="true" />{doctor.credential_one}</li><li><Check size={13} aria-hidden="true" />{doctor.credential_two}</li></ul>
      <NavigationLink href={doctor.profile_link || "/contact"} className="service-detail-specialist-link" aria-label={`View profile for ${doctor.name}`}>{doctor.profile_label}</NavigationLink>
    </article>)}</div>
  </section>;
}

function BeforeAfterComparison({ patient }: { patient: any }) {
  const [position, setPosition] = useState(50);
  return <div className="service-detail-comparison" aria-label="Before and after treatment comparison">
    <div className="service-detail-comparison__after"><DetailImage media={patient.after_image} alt={patient.after_alt} /></div>
    <div className="service-detail-comparison__before" style={{ width: `${position}%` }}><DetailImage media={patient.before_image} alt={patient.before_alt} /></div>
    <span className="service-detail-comparison__label service-detail-comparison__label--before">Before</span><span className="service-detail-comparison__label service-detail-comparison__label--after">After</span>
    <span className="service-detail-comparison__divider" style={{ left: `${position}%` }} aria-hidden="true"><span /></span>
    <input className="service-detail-comparison__range" type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Adjust before and after comparison" />
  </div>;
}

function PatientResultsSection({ section }: { section: any }) {
  const patients = section.patients || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const patient = patients[activeIndex];
  const changePatient = (direction: number) => setActiveIndex((current) => (current + direction + patients.length) % patients.length);
  if (!patient) return null;
  return <section id={`service-detail-patient-results-${section.id}`} className="service-detail-results service-detail-container" aria-labelledby="service-detail-results-title">
    <h2 id="service-detail-results-title">{section.title}</h2>
    <div className="service-detail-results-layout"><BeforeAfterComparison key={patient.id || activeIndex} patient={patient} /><article className="service-detail-testimonial"><div className="service-detail-testimonial-head"><div className="service-detail-testimonial-portrait"><DetailImage media={patient.portrait} alt={`${patient.name} portrait`} /></div><div><div className="service-detail-testimonial-stars" aria-label={`${patient.rating} out of 5 stars`}>{Array.from({ length: patient.rating }, (_, index) => <Star key={index} size={16} fill="currentColor" aria-hidden="true" />)}</div><strong>{patient.name}</strong><span>{patient.treatment}</span></div></div><blockquote>“{patient.testimonial}”</blockquote><div className="service-detail-results-controls"><button type="button" onClick={() => changePatient(-1)} aria-label="Previous patient result">←</button><span>{activeIndex + 1} / {patients.length}</span><button type="button" onClick={() => changePatient(1)} aria-label="Next patient result">→</button></div></article></div>
  </section>;
}

function PricingSection({ section }: { section: any }) {
  return <section id={`service-detail-pricing-${section.id}`} className="service-detail-pricing service-detail-container" aria-labelledby="service-detail-pricing-title">
    <h2 id="service-detail-pricing-title">{section.title}</h2>
    <div className="service-detail-pricing-grid">{(section.plans || []).map((plan: any) => <article className={`service-detail-pricing-card${plan.is_popular ? " is-popular" : ""}`} key={plan.id || plan.name}>
      {plan.is_popular ? <span className="service-detail-pricing-popular">MOST POPULAR</span> : null}
      <h3>{plan.name}</h3><p className="service-detail-pricing-subtitle">{plan.subtitle}</p><strong className="service-detail-pricing-price">{plan.price}</strong>{plan.qualifier ? <span className="service-detail-pricing-qualifier">{plan.qualifier}</span> : null}
      <ul>{(plan.features || []).map((feature: string, index: number) => <li key={`${feature}-${index}`}><Check size={14} aria-hidden="true" />{feature}</li>)}</ul>
      <NavigationLink href={plan.cta_link || "/contact"} className="service-detail-pricing-cta">{plan.cta_label}</NavigationLink>
    </article>)}</div>
    <p className="service-detail-pricing-note">{section.footer_note}</p>
  </section>;
}

function FaqSection({ section }: { section: any }) {
  return <section id={`service-detail-faq-${section.id}`} className="service-detail-faq service-detail-container" aria-labelledby="service-detail-faq-title">
    <h2 id="service-detail-faq-title">{section.title}</h2><MotionFaqAccordion allowMultiple className="service-detail-faq-grid" itemClassName="service-detail-faq-item" triggerClassName="service-detail-faq-trigger" contentClassName="service-detail-faq-answer" items={(section.items || []).map((item: any) => ({ id: item.id, question: item.question, answer: item.answer }))} />
  </section>;
}

function ConsultationSection({ section, serviceList = [] }: { section: any; serviceList?: any[] }) {
  const options = serviceList.map((service: any) => ({ value: service.slug, label: service.title }));
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: options.find((item) => item.value === "dental-implants")?.value || options[0]?.value || "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setStatus("sending"); try { const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: form.name.trim(), phoneNumber: form.phone.trim(), email: form.email.trim(), service: form.service, message: form.message.trim(), recaptchaToken: "local-development" }) }); if (!response.ok) throw new Error("Contact request failed"); setStatus("success"); setForm((current) => ({ ...current, name: "", phone: "", email: "", message: "" })); } catch { setStatus("error"); } }
  return <section id={`service-detail-consultation-${section.id}`} className="service-detail-consultation service-detail-container" aria-labelledby="service-detail-consultation-title">
    <div className="service-detail-consultation-form"><div className="service-detail-consultation-heading"><span>{section.step_number}</span><div><h2 id="service-detail-consultation-title">{section.title}</h2><p>{section.subtitle}</p></div></div><form onSubmit={submit}><div className="service-detail-consultation-fields"><label>Full Name<input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your full name" required /></label><label>Phone Number<input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Enter your phone number" type="tel" required /></label><label>Email Address<input value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="Enter your email" type="email" /></label><label>Preferred Service<SelectBase value={form.service} options={options} onChange={(value) => update("service", value)} ariaLabel="Preferred Service" placeholder="Select a service" /></label><label className="service-detail-consultation-message">Your Message<textarea value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell us about your concerns or any questions you have." rows={4} /></label></div><button className="service-detail-consultation-submit" type="submit" disabled={status === "sending"}><CalendarDays size={16} aria-hidden="true" />{status === "sending" ? "SENDING..." : "BOOK CONSULTATION →"}</button>{status === "success" ? <p className="service-detail-form-status is-success" role="status">Thank you. We&apos;ll contact you within 24 hours.</p> : null}{status === "error" ? <p className="service-detail-form-status is-error" role="alert">Unable to send your request. Please try again.</p> : null}</form></div>
    <aside className="service-detail-consultation-info" aria-label="Clinic contact information"><div className="service-detail-contact-row"><MapPin size={18} aria-hidden="true" /><div><strong>Visit Us</strong><span>{section.address}</span></div></div><div className="service-detail-contact-row"><Phone size={18} aria-hidden="true" /><div><strong>Hotline</strong><a href={`tel:${section.hotline.replace(/[^\d+]/g, "")}`}>{section.hotline}</a></div></div><div className="service-detail-contact-row"><Mail size={18} aria-hidden="true" /><div><strong>Email</strong><a href={`mailto:${section.email}`}>{section.email}</a></div></div><div className="service-detail-contact-row"><Clock size={18} aria-hidden="true" /><div><strong>Working Hours</strong><span>{section.working_hours}</span></div></div></aside>
    <div className="service-detail-consultation-map"><iframe title="DR. MARIS AESTHETICS hospital map" src={section.map_embed_url} loading="lazy" /></div>
  </section>;
}

function Structure({ section }: { section: any }) {
  const left = (section.callouts || []).filter((item: any) => item.side === "left");
  const right = (section.callouts || []).filter((item: any) => item.side === "right");
  const callout = (item: any) => <article key={item.id}><span className="service-detail-connector" aria-hidden="true" /><h3>{item.title}</h3><p>{item.description}</p></article>;
  return <section id={`service-detail-structure-${section.id}`} className="service-detail-structure"><div className="service-detail-container"><p className="service-detail-eyebrow">ANATOMY & EDUCATION</p><h2>{section.title}</h2><div className="service-detail-structure__layout"><div className="service-detail-callouts">{left.map(callout)}</div><div className="service-detail-structure__diagram"><DetailImage media={section.diagram} alt={`${section.title} educational diagram`} /></div><div className="service-detail-callouts">{right.map(callout)}</div><aside><h3>{section.supporting_title}</h3><ul>{(section.supporting_items || []).map((item: any) => <li key={item.id}><Check size={14} aria-hidden="true" />{item.text}</li>)}</ul></aside></div></div></section>;
}

export default function ServiceDetailPageClient({ data }: { data: any }) {
  return <main className="service-detail-page"><Hero data={data} />{(data.sections || []).map((section: any) => { if (section.__component === "service-detail.overview") return <Overview key={section.id} section={section} />; if (section.__component === "service-detail.benefits") return <Benefits key={section.id} section={section} serviceList={data.serviceList} />; if (section.__component === "service-detail.candidates") return <Candidates key={section.id} section={section} />; if (section.__component === "service-detail.structure") return <Structure key={section.id} section={section} />; if (section.__component === "service-detail.technology") return <TechnologySection key={section.id} section={section} />; if (section.__component === "service-detail.procedure") return <ProcedureSection key={section.id} section={section} />; if (section.__component === "service-detail.specialists") return <SpecialistsSection key={section.id} section={section} />; if (section.__component === "service-detail.patient-results") return <PatientResultsSection key={section.id} section={section} />; if (section.__component === "service-detail.pricing") return <PricingSection key={section.id} section={section} />; if (section.__component === "service-detail.faq") return <FaqSection key={section.id} section={section} />; if (section.__component === "service-detail.consultation") return <ConsultationSection key={section.id} section={section} serviceList={data.serviceList} />; return null; })}</main>;
}
