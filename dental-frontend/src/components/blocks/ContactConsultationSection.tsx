'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, Mail, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { SelectBase } from '@/src/components/ui/SelectBase'
import { CheckBoxBase } from '@/src/components/ui/CheckBoxBase'
import { CountryPicker, defaultCountry, type CountryOption } from '@/src/components/forms/CountryPicker'
import { formatNationalPhone, normalizeNationalPhone } from '@/src/components/forms/phoneFormatting'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export type ServiceOption = { label: string; value: string }
type Option = ServiceOption
type Contact = { type: 'hotline' | 'zalo' | 'whatsapp' | 'email'; label: string; value: string; href?: string }
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
  privacyPolicyHref?: string
  submitLabel: string
  infoTitle: string
  infoDescription: string
  advisorTitle: string
  advisorDescription: string
  advisorImage?: string
  contacts: Contact[]
  trustTitle: string
  trustDescription: string
}

const contactIcons = { hotline: Phone, zalo: MessageCircle, whatsapp: MessageCircle, email: Mail }

function ContactRow({ contact }: { contact: Contact }) {
  const Icon = contactIcons[contact.type] || Phone
  const value = contact.href ? <a href={contact.href}>{contact.value}</a> : <span>{contact.value}</span>
  return (
    <div className="contact-consultation-row">
      <span className="contact-consultation-row-icon" aria-hidden="true"><Icon size={18} /></span>
      <div className="min-w-0">
        <strong>{contact.label}</strong>
        <div className="contact-consultation-row-value">{value}</div>
      </div>
    </div>
  )
}

export function ContactConsultationSection({ data, formOnly = false }: { data: ContactConsultationData; formOnly?: boolean }) {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const recaptchaEnabled = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED !== 'false'
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
        body: JSON.stringify({ fullName: form.name.trim(), phoneNumber: parsePhoneNumberFromString(form.phone, phoneCountry.code)?.number || form.phone.trim(), email: form.email.trim(), service: form.service, otherService: form.service === 'Other' ? form.otherService.trim() : '', message: `Preferred contact: ${form.preferredContact} | ${form.message.trim()}`, recaptchaToken }),
      })
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        console.error('[Contact page] submission rejected', { status: response.status, error: errorBody?.error || 'unknown' })
        throw new Error(errorBody?.error || 'Contact request failed')
      }
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
            <CheckBoxBase checked={form.consent} onChange={(checked) => update('consent', checked)} required><span>I agree to the {data.privacyPolicyHref ? <Link href={data.privacyPolicyHref}>{data.privacyPolicyLabel}</Link> : data.privacyPolicyLabel} of DR. MARIS AESTHETICS.</span></CheckBoxBase>
            <button type="submit" className="contact-consultation-submit" disabled={!canSubmit || status === 'sending'}><Check size={17} aria-hidden="true" />{status === 'sending' ? 'SENDING...' : data.submitLabel}</button>
            {status === 'success' ? <p className="contact-consultation-status contact-consultation-status--success" role="status">Thank you. We will contact you within 24 hours.</p> : null}
            {status === 'error' ? <p className="contact-consultation-status contact-consultation-status--error" role="alert">We could not send your request. Please try again.</p> : null}
          </form>
        </div>

        {!formOnly && <aside className="contact-consultation-info" aria-labelledby="contact-consultation-info-title">
          <h2 id="contact-consultation-info-title">{data.infoTitle}</h2>
          <p className="contact-consultation-info-description">{data.infoDescription}</p>
          <div className="contact-consultation-advisor">
            {data.advisorImage ? <Image src={data.advisorImage} alt="Dr. Maris consultation team" width={76} height={76} className="contact-consultation-advisor-image" /> : null}
            <div><h3>{data.advisorTitle}</h3><p>{data.advisorDescription}</p></div>
          </div>
          <div className="contact-consultation-contacts">{(data.contacts || []).slice(0, 4).map((contact, index) => <ContactRow contact={contact} key={`${contact.label}-${index}`} />)}</div>
          <div className="contact-consultation-trust"><span className="contact-consultation-trust-icon" aria-hidden="true"><ShieldCheck size={22} /></span><div><h3>{data.trustTitle}</h3><p>{data.trustDescription}</p></div></div>
        </aside>}
      </div>
    </section>
  )
}
