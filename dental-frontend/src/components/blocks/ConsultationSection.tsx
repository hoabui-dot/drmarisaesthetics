import { Clock3, Globe2, MapPin, Phone } from "lucide-react";
import { HomeBookingForm } from "@/src/components/forms/HomeBookingForm";
import type { HomepageConsultationBlock } from "@/src/types/strapi";

export function ConsultationSection({ data }: { data: HomepageConsultationBlock }) {
  const rows = [
    data.address ? { label: "Address", value: data.address, icon: MapPin } : null,
    data.phone ? { label: "Phone", value: data.phone, icon: Phone, href: `tel:${data.phone.replace(/[^+\d]/g, "")}` } : null,
    data.openingHours ? { label: "Opening Hours", value: data.openingHours, icon: Clock3 } : null,
    data.internationalPatients ? { label: "International Patients", value: data.internationalPatients, icon: Globe2 } : null,
  ].filter(Boolean) as Array<{ label: string; value: string; icon: typeof MapPin; href?: string }>;

  return <section id="home-booking" className="home-booking-section">
    <div className="home-booking-container">
      <div className="home-booking-column home-booking-form-column">
        <p className="eyebrow">{data.formHeading || data.title}</p>
        <span className="home-booking-rule" aria-hidden="true" />
        <HomeBookingForm serviceOptions={data.serviceOptions} submitLabel={data.submitLabel} />
      </div>
      <aside className="home-booking-column home-booking-info">
        <p className="eyebrow">{data.clinicEyebrow || "SMILUX DENTAL CLINIC"}</p>
        <h2>{data.contactHeading || "Consult With Our Experts"}</h2>
        {data.description ? <p className="home-booking-description">{data.description}</p> : null}
        <div className="home-booking-details">
          {rows.map(({ label, value, icon: Icon, href }) => <div className="home-booking-detail" key={label}><span className="home-booking-detail-icon"><Icon size={19} aria-hidden="true" /></span><div><strong>{label}</strong>{href ? <a href={href}>{value}</a> : <span>{value}</span>}</div></div>)}
        </div>
      </aside>
    </div>
  </section>;
}
