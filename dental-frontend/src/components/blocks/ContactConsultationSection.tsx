'use client'

import Image from 'next/image'
import { Check, Mail, MapPin, MessageCircle, Navigation, Phone, ShieldCheck } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { SelectBase } from '@/src/components/ui/SelectBase'
import { CheckBoxBase } from '@/src/components/ui/CheckBoxBase'
import { trackMarketingEvent } from '@/src/lib/marketing/events'
import { CountryPicker, defaultCountry, type CountryOption } from '@/src/components/forms/CountryPicker'
import { formatNationalPhone, normalizeNationalPhone } from '@/src/components/forms/phoneFormatting'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export type ServiceOption = { label: string; value: string }
type Option = ServiceOption
type Contact = { type: string; label: string; value: string; href?: string }
type ContactLocation = { label: string; address: string; latitude?: number; longitude?: number; mapsPlaceUrl?: string }
const contactMethodOptions: Option[] = [
  { label: 'Email', value: 'email' },
  { label: 'Phone Call', value: 'phone' },
  { label: 'WhatsApp', value: 'whatsapp' },
]
const otherServiceOption: ServiceOption = { label: 'Others', value: 'Other' }

export type ContactConsultationData = {
  formTitle: string
  formIntro: string
  serviceOptions: Option[]
  privacyPolicyLabel: string
  submitLabel: string
  infoTitle: string
  infoDescription: string
  advisorTitle: string
  advisorDescription: string
  advisorImage?: string
  contacts: Contact[]
  locations?: ContactLocation[]
  trustTitle: string
  trustDescription: string
}

function getContactIcon(type: string) {
  const normalized = type.toLowerCase()
  if (normalized.includes('email') || normalized.includes('mail')) return Mail
  if (normalized.includes('whatsapp') || normalized.includes('zalo') || normalized.includes('message') || normalized.includes('chat')) return MessageCircle
  return Phone
}

function formatContactValue(contact: Contact) {
  const type = contact.type.toLowerCase()
  if (!type.includes('phone') && !type.includes('call') && !type.includes('whatsapp') && !type.includes('zalo')) {
    return contact.value
  }

  const value = contact.value.trim()
  const normalized = value.startsWith('00')
    ? `+${value.slice(2)}`
    : /^84\d{8,10}$/.test(value.replace(/\D/g, ''))
      ? `+${value.replace(/\D/g, '')}`
      : value
  const parsed = parsePhoneNumberFromString(normalized, 'VN')
  return parsed?.isValid() ? parsed.formatInternational() : value
}

function getDirectionsHref(location: ContactLocation) {
  if (location.mapsPlaceUrl) {
    try {
      const url = new URL(location.mapsPlaceUrl)
      if (url.protocol === 'https:' && ['google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl'].includes(url.hostname)) return url.toString()
    } catch {
      // Fall through to a generated directions URL for malformed CMS values.
    }
  }
  const hasValidCoordinates = location.latitude != null && location.longitude != null
    && Number.isFinite(location.latitude) && Number.isFinite(location.longitude)
    && Math.abs(location.latitude) <= 90 && Math.abs(location.longitude) <= 180
  const destination = hasValidCoordinates
    ? `${location.latitude},${location.longitude}`
    : location.address
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

function ContactRow({ contact }: { contact: Contact }) {
  const Icon = getContactIcon(contact.type)
  const displayValue = formatContactValue(contact)
  const value = contact.href ? <a href={contact.href}>{displayValue}</a> : <span>{displayValue}</span>
  return (
    <div className="contact-consultation-row">
      <span className="contact-consultation-row-icon" aria-hidden="true"><Icon size={27} /></span>
      <div className="min-w-0">
        <strong>{contact.label}</strong>
        <div className="contact-consultation-row-value">{value}</div>
      </div>
    </div>
  )
}

export function ContactConsultationSection({ data, formOnly = false, submissionSource = formOnly ? 'service_detail' : 'contact' }: { data: ContactConsultationData; formOnly?: boolean; submissionSource?: 'contact' | 'service_detail' }) {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const recaptchaEnabled = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === 'true'
  const services = [...(data.serviceOptions || []).filter((option) => option.value !== 'Other'), otherServiceOption]
  const [phoneCountry, setPhoneCountry] = useState<CountryOption>(defaultCountry)
  const [form, setForm] = useState({ name: '', phone: '', email: '', preferredContact: contactMethodOptions[0].value, service: services[0]?.value || '', otherService: '', message: '', consent: false })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const update = (field: keyof typeof form, value: string | boolean) => setForm((current) => ({ ...current, [field]: value }))
  const canSubmit = useMemo(() => form.name.trim().length >= 2 && form.phone.trim().length > 0 && form.service && (form.service !== 'Other' || form.otherService.trim().length > 0) && form.consent, [form])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    setStatus('sending')
    try {
      const recaptchaToken = recaptchaEnabled && executeRecaptcha ? await executeRecaptcha('contact_consultation') : 'recaptcha-disabled'
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: form.name.trim(), phoneNumber: parsePhoneNumberFromString(form.phone, phoneCountry.code)?.number || form.phone.trim(), country: phoneCountry.name, email: form.email.trim(), service: form.service, otherService: form.service === 'Other' ? form.otherService.trim() : '', message: `Preferred contact: ${form.preferredContact} | ${form.message.trim()}`, submissionSource, recaptchaToken }),
      })
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        console.error('[Contact page] submission rejected', { status: response.status, error: errorBody?.error || 'unknown' })
        throw new Error(errorBody?.error || 'Contact request failed')
      }
      trackMarketingEvent('lead_submission_success', { submission_source: submissionSource })
      setStatus('success')
      setForm({ name: '', phone: '', email: '', preferredContact: contactMethodOptions[0].value, service: services[0]?.value || '', otherService: '', message: '', consent: false })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="form-section" className={`contact-consultation-section${formOnly ? ' contact-consultation-section--form-only' : ''}`} aria-labelledby="contact-consultation-title">
      <div className="contact-consultation-container">
        <div className="contact-consultation-form-card">
          <h2 id="contact-consultation-title">{data.formTitle}</h2>
          <p className="contact-consultation-intro">{data.formIntro}</p>
          <form className="contact-consultation-form" onSubmit={submit} noValidate>
            <div className="contact-consultation-fields contact-consultation-fields--paired">
              <label><span>Full Name <b>*</b></span><input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Enter your full name" required /></label>
              <label><span>Phone Number <b>*</b></span><div className="contact-consultation-phone-field"><CountryPicker label="Phone country code" value={phoneCountry} onChange={setPhoneCountry} /><span className="contact-consultation-phone-prefix" aria-hidden="true">({phoneCountry.dialCode})</span><input value={formatNationalPhone(form.phone, phoneCountry)} onChange={(event) => update('phone', normalizeNationalPhone(event.target.value, phoneCountry))} placeholder="Enter your phone number" type="tel" autoComplete="tel" inputMode="tel" required /></div></label>
              <label><span>Email Address <small>(Optional)</small></span><input value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="Enter your email address" type="email" /></label>
              <label><span>Preferred Contact</span><SelectBase value={form.preferredContact} options={contactMethodOptions} onChange={(value) => update('preferredContact', value)} ariaLabel="Preferred Contact" /></label>
            <label><span>Service of Interest <b>*</b></span><SelectBase value={form.service} options={services} onChange={(value) => update('service', value)} ariaLabel="Service of Interest" /></label>
            {form.service === 'Other' ? <label><span>Please specify the service <b>*</b></span><input value={form.otherService} onChange={(event) => update('otherService', event.target.value)} placeholder="Tell us which service you are interested in" required /></label> : null}
            </div>
            <label><span>Consultation Message <small>(Optional)</small></span><textarea value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Tell us what you would like to discuss." rows={4} /></label>
            <CheckBoxBase checked={form.consent} onChange={(checked) => update('consent', checked)} required><span>I agree to the {data.privacyPolicyLabel} of DR. MARIS AESTHETICS.</span></CheckBoxBase>
            <button type="submit" className="contact-consultation-submit" disabled={!canSubmit || status === 'sending'}><Check size={17} aria-hidden="true" />{status === 'sending' ? 'SENDING...' : data.submitLabel}</button>
            {status === 'success' ? <p className="contact-consultation-status contact-consultation-status--success" role="status">Thank you. We will contact you within 24 hours.</p> : null}
            {status === 'error' ? <p className="contact-consultation-status contact-consultation-status--error" role="alert">We could not send your request. Please try again.</p> : null}
          </form>
        </div>

        {!formOnly && <aside className="contact-consultation-info" aria-labelledby="contact-consultation-info-title">
          <h2 id="contact-consultation-info-title">{data.infoTitle}</h2>
          <div className="contact-consultation-advisor">
            {data.advisorImage ? <Image src={data.advisorImage} alt="Dr. Maris consultation team" width={76} height={76} className="contact-consultation-advisor-image" /> : null}
            <div><h3>{data.advisorTitle}</h3><p>{data.advisorDescription}</p></div>
          </div>
          <div className="contact-consultation-locations" aria-label="Clinic locations">
            {(data.locations || []).map((location, index) => (
              <div className="contact-consultation-location" key={`${location.label}-${index}`}>
                <span className="contact-consultation-location__icon" aria-hidden="true"><MapPin size={27} /></span>
                <div className="min-w-0">
                  <strong>{location.label}</strong>
                  <a className="contact-consultation-location__address" href={getDirectionsHref(location)} target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${location.label}`}>
                    <span>{location.address}<Navigation className="contact-consultation-location__directions-icon" size={16} aria-hidden="true" /></span>
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="contact-consultation-contacts" aria-label="Contact methods">{(data.contacts || []).map((contact, index) => <ContactRow contact={contact} key={`${contact.label}-${index}`} />)}</div>
          <div className="contact-consultation-trust"><span className="contact-consultation-trust-icon" aria-hidden="true"><ShieldCheck size={22} /></span><div><h3>{data.trustTitle}</h3><p>{data.trustDescription}</p></div></div>
        </aside>}
      </div>
    </section>
  )
}
