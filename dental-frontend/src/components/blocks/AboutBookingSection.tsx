'use client'

import Image from 'next/image'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { HomeBookingForm } from '@/src/components/forms/HomeBookingForm'
import { CLINIC_INFO } from '@/src/lib/constants/contact'

type ServiceOption = { value: string; label: string }

export type AboutBookingData = {
  heading?: string
  clinicName?: string
  address?: string
  phone?: string
  email?: string
  openingHours?: string
  clinicImage?: { url: string; alt?: string }
}

function ContactRow({ icon: Icon, label, value, href }: { icon: typeof MapPin; label: string; value: string; href?: string }) {
  return (
    <div className="about-booking-contact-row">
      <span className="about-booking-contact-icon" aria-hidden="true"><Icon size={17} /></span>
      <div>
        <strong>{label}</strong>
        {href ? <a href={href}>{value}</a> : <span>{value}</span>}
      </div>
    </div>
  )
}

export function AboutBookingSection({ data, serviceOptions = [] }: { data?: AboutBookingData | null; serviceOptions?: ServiceOption[] }) {
  const clinicName = data?.clinicName || 'Smilux Dental Clinic'
  const address = data?.address || CLINIC_INFO.address
  const phone = data?.phone || CLINIC_INFO.phone1
  const email = data?.email || CLINIC_INFO.email
  const openingHours = data?.openingHours || `${CLINIC_INFO.days}: ${CLINIC_INFO.hours}`

  return (
    <section id="about-booking" className="about-booking-section" aria-labelledby="about-booking-heading">
      <div className="about-booking-card">
        <div className="about-booking-form-region">
          <h2 id="about-booking-heading">{data?.heading || 'Book a Consultation'}</h2>
          <span className="about-booking-rule" aria-hidden="true" />
          <HomeBookingForm serviceOptions={serviceOptions} submitLabel="REQUEST APPOINTMENT" />
        </div>
        <aside className="about-booking-clinic" aria-label="Clinic contact information">
          <h3>{clinicName}</h3>
          <div className="about-booking-contact-list">
            <ContactRow icon={MapPin} label="Address" value={address} />
            <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone.replace(/\s/g, '')}`} />
            <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
            <ContactRow icon={Clock3} label="Opening Hours" value={openingHours} />
          </div>
        </aside>
        <div className="about-booking-image">
          {data?.clinicImage?.url ? <Image src={data.clinicImage.url} alt={data.clinicImage.alt || `${clinicName} reception`} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw" className="object-cover" /> : <div aria-hidden="true" />}
        </div>
      </div>
    </section>
  )
}
