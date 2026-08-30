'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, Mail, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { SelectBase } from '@/src/components/ui/SelectBase'
import { CheckBoxBase } from '@/src/components/ui/CheckBoxBase'

type Option = { label: string; value: string }
type Contact = { type: 'hotline' | 'zalo' | 'whatsapp' | 'email'; label: string; value: string; href?: string }
const contactMethodOptions: Option[] = [
  { label: 'Email', value: 'email' },
  { label: 'Phone Call', value: 'phone' },
  { label: 'WhatsApp', value: 'whatsapp' },
]

export type ContactConsultationData = {
  formTitle: string
  formIntro: string
  serviceOptions: Option[]
  locationOptions: Option[]
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

export function ContactConsultationSection({ data }: { data: ContactConsultationData }) {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const services = data.serviceOptions || []
  const locations = data.locationOptions || []
  const [form, setForm] = useState({ name: '', phone: '', email: '', preferredContact: contactMethodOptions[0].value, service: services[0]?.value || '', location: locations[0]?.value || '', message: '', consent: false })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const update = (field: keyof typeof form, value: string | boolean) => setForm((current) => ({ ...current, [field]: value }))
  const canSubmit = useMemo(() => form.name.trim().length >= 2 && form.phone.trim().length > 0 && form.service && form.location && form.consent, [form])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    setStatus('sending')
    try {
      const recaptchaToken = executeRecaptcha ? await executeRecaptcha('contact_consultation') : 'local-development'
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: form.name.trim(), phoneNumber: form.phone.trim(), email: form.email.trim(), service: form.service, message: `${form.location} | Preferred contact: ${form.preferredContact} | ${form.message.trim()}`, recaptchaToken }),
      })
      if (!response.ok) throw new Error('Contact request failed')
      setStatus('success')
      setForm({ name: '', phone: '', email: '', preferredContact: contactMethodOptions[0].value, service: services[0]?.value || '', location: locations[0]?.value || '', message: '', consent: false })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="form-section" className="contact-consultation-section" aria-labelledby="contact-consultation-title">
      <div className="contact-consultation-container">
        <div className="contact-consultation-form-card">
          <h2 id="contact-consultation-title">{data.formTitle}</h2>
          <p className="contact-consultation-intro">{data.formIntro}</p>
          <form className="contact-consultation-form" onSubmit={submit} noValidate>
            <div className="contact-consultation-fields contact-consultation-fields--paired">
              <label><span>Họ và tên <b>*</b></span><input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Nhập họ và tên" required /></label>
              <label><span>Số điện thoại <b>*</b></span><input value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="Nhập số điện thoại" type="tel" required /></label>
              <label><span>Email</span><input value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="Nhập email của bạn" type="email" /></label>
              <label><span>Preferred Contact</span><SelectBase value={form.preferredContact} options={contactMethodOptions} onChange={(value) => update('preferredContact', value)} ariaLabel="Preferred Contact" /></label>
              <label><span>Dịch vụ quan tâm <b>*</b></span><SelectBase value={form.service} options={services} onChange={(value) => update('service', value)} ariaLabel="Dịch vụ quan tâm" /></label>
            </div>
            <label><span>Chọn cơ sở <b>*</b></span><SelectBase value={form.location} options={locations} onChange={(value) => update('location', value)} ariaLabel="Chọn cơ sở" /></label>
            <label><span>Nội dung tư vấn</span><textarea value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Bạn đang quan tâm điều gì? Tình trạng răng hiện tại của bạn?" rows={4} /></label>
            <CheckBoxBase checked={form.consent} onChange={(checked) => update('consent', checked)} required><span>Tôi đồng ý với {data.privacyPolicyHref ? <Link href={data.privacyPolicyHref}>{data.privacyPolicyLabel}</Link> : data.privacyPolicyLabel} của DR. MARIS AESTHETICS</span></CheckBoxBase>
            <button type="submit" className="contact-consultation-submit" disabled={!canSubmit || status === 'sending'}><Check size={17} aria-hidden="true" />{status === 'sending' ? 'ĐANG GỬI...' : data.submitLabel}</button>
            {status === 'success' ? <p className="contact-consultation-status contact-consultation-status--success" role="status">Cảm ơn bạn. Chúng tôi sẽ liên hệ trong 24 giờ.</p> : null}
            {status === 'error' ? <p className="contact-consultation-status contact-consultation-status--error" role="alert">Không thể gửi yêu cầu. Vui lòng thử lại.</p> : null}
          </form>
        </div>

        <aside className="contact-consultation-info" aria-labelledby="contact-consultation-info-title">
          <h2 id="contact-consultation-info-title">{data.infoTitle}</h2>
          <p className="contact-consultation-info-description">{data.infoDescription}</p>
          <div className="contact-consultation-advisor">
            {data.advisorImage ? <Image src={data.advisorImage} alt="Dr. Maris consultation team" width={76} height={76} className="contact-consultation-advisor-image" /> : null}
            <div><h3>{data.advisorTitle}</h3><p>{data.advisorDescription}</p></div>
          </div>
          <div className="contact-consultation-contacts">{(data.contacts || []).slice(0, 4).map((contact, index) => <ContactRow contact={contact} key={`${contact.label}-${index}`} />)}</div>
          <div className="contact-consultation-trust"><span className="contact-consultation-trust-icon" aria-hidden="true"><ShieldCheck size={22} /></span><div><h3>{data.trustTitle}</h3><p>{data.trustDescription}</p></div></div>
        </aside>
      </div>
    </section>
  )
}
