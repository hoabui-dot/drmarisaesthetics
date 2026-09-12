'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'
import { contactFormSchema, type ContactFormData } from '@/src/lib/validations/contact-form'
import { useBookingModal } from './BookingModalContext'
import { CountryPicker, defaultCountry, type CountryOption } from '@/src/components/forms/CountryPicker'

const consultationImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0'
function normalizeNationalPhone(value: string, country: CountryOption) {
  const trimmed = value.trim()
  const digits = value.replace(/\D/g, '')
  const dialCode = country.dialCode.slice(1)
  if (trimmed.startsWith('+') && digits.startsWith(dialCode)) return digits.slice(dialCode.length)
  if (trimmed.startsWith('00') && digits.startsWith(`00${dialCode}`)) return digits.slice(dialCode.length + 2)
  return digits
}

function formatNationalPhone(value: string, country: CountryOption) {
  if (!value) return ''
  const nationalFormat = new AsYouType(country.code).input(value)
  const parsed = parsePhoneNumberFromString(value, country.code)
  if (!parsed || !parsed.isValid()) return nationalFormat
  const international = parsed.formatInternational()
  const prefix = `${country.dialCode} `
  return international.startsWith(prefix) ? international.slice(prefix.length) : international
}

export function BookingModal() {
  const { isOpen, close, serviceOptions, context } = useBookingModal()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [phoneCountry, setPhoneCountry] = useState<CountryOption>(defaultCountry)
  const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', type: context.consultationType, procedure: context.procedure, message: '' })
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    setStatus('idle'); setErrors({})
    setForm((current) => ({ ...current, type: context.consultationType, procedure: context.procedure }))
  }, [isOpen, context.consultationType, context.procedure])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, input, select, textarea')
      if (!focusable.length) return
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: '' }))
  }

  const validateForm = () => {
    const next: Record<string, string> = {}
    if (form.fullName.trim().length < 2) next.fullName = 'Please enter your full name.'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address.'
    const parsedPhone = form.phoneNumber.trim() ? parsePhoneNumberFromString(form.phoneNumber, phoneCountry.code) : undefined
    if (!parsedPhone || !parsedPhone.isValid()) next.phoneNumber = 'Please enter a valid phone number for the selected country.'
    if (!form.procedure) next.procedure = 'Please select an area or procedure.'
    setErrors(next); return Object.keys(next).length === 0
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (!validateForm()) return
    setIsSubmitting(true); setStatus('idle')
    try {
      const recaptchaToken = executeRecaptcha ? await executeRecaptcha('booking_modal') : 'local-development'
      const message = [`Consultation type: ${form.type === 'revision' ? 'Revision Surgery' : 'Cosmetic Surgery Consultation'}`, `Area / procedure: ${form.procedure}`, form.message ? `Case description: ${form.message}` : ''].filter(Boolean).join('\n')
      const parsedPhone = parsePhoneNumberFromString(form.phoneNumber, phoneCountry.code)
      if (!parsedPhone || !parsedPhone.isValid()) throw new Error('Invalid phone number')
      const normalizedPhone = parsedPhone.number
      const payload: ContactFormData = { fullName: form.fullName, email: form.email, phoneNumber: normalizedPhone, service: form.procedure || 'Consultation', otherService: '', message, recaptchaToken }
      if (!contactFormSchema.safeParse(payload).success) throw new Error('Invalid form')
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) throw new Error('Submission failed')
      setStatus('success'); toast.success('Your case has been received.', { description: 'Our team will contact you regarding the appropriate next step.' })
    } catch { setStatus('error') } finally { setIsSubmitting(false) }
  }

  return <>
    <div className={`booking-modal-backdrop ${isOpen ? 'is-open' : ''}`} onClick={close} aria-hidden="true" />
    <div className={`booking-modal-shell ${isOpen ? 'is-open' : ''}`}>
      <div ref={dialogRef} className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
        <aside className="booking-modal__visual" style={{ backgroundImage: `url('${consultationImage}')` }}><div className="booking-modal__visual-wash" /><div className="booking-modal__visual-copy"><span className="booking-modal__eyebrow">DIRECT SURGEON CARE</span><h2>Your case is reviewed before you travel.</h2><p>Begin with a private clinical assessment led by a surgical team in Ho Chi Minh City.</p><ul><li>Hospital-Based Surgery</li><li>Ho Chi Minh City, Vietnam</li><li>International Patient Support</li></ul></div></aside>
        <section className="booking-modal__content"><button type="button" className="booking-modal__close" onClick={close} aria-label="Close consultation form"><X size={19} /></button>
          {status === 'success' ? <div className="booking-modal__success"><span><Check size={22} /></span><span className="booking-modal__eyebrow">CASE RECEIVED</span><h2>Your case has been received.</h2><p>Our team will review the information you provided and contact you regarding the appropriate next step.</p><a className="booking-modal__whatsapp" href="https://wa.me/842812345678" target="_blank" rel="noreferrer">Continue on WhatsApp <ArrowRight size={16} /></a></div> : <>
            <div className="booking-modal__heading"><span className="booking-modal__eyebrow">PRIVATE CONSULTATION</span><h2 id="booking-modal-title">Tell us about your case.</h2><p>Share a few details so our team can understand your concerns and determine the appropriate next step.</p></div>
            <form onSubmit={submit} noValidate><div className="booking-modal__step"><div className="booking-modal__fields"><Field label="Full Name" value={form.fullName} onChange={(value) => update('fullName', value)} error={errors.fullName} autoComplete="name" /><Field label="Email Address" optional type="email" value={form.email} onChange={(value) => update('email', value)} error={errors.email} autoComplete="email" /><label className="booking-modal__field booking-modal__field--phone"><span>WhatsApp / Phone</span><div className="booking-modal__phone-field"><CountryPicker label="Phone country code" value={phoneCountry} onChange={setPhoneCountry} error={errors.phoneNumber} /><span className="booking-modal__phone-prefix" aria-hidden="true">({phoneCountry.dialCode})</span><input type="tel" value={formatNationalPhone(form.phoneNumber, phoneCountry)} onChange={(event) => update('phoneNumber', normalizeNationalPhone(event.target.value, phoneCountry))} autoComplete="tel" inputMode="tel" /></div>{errors.phoneNumber ? <small>{errors.phoneNumber}</small> : null}</label><label className="booking-modal__field booking-modal__field--full"><span>Area / Procedure</span><select value={form.procedure} onChange={(event) => update('procedure', event.target.value)}><option value="">Select an area or procedure</option>{serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}<option value="Other">Other</option></select>{errors.procedure ? <small>{errors.procedure}</small> : null}</label><label className="booking-modal__field booking-modal__field--full"><span>Brief Case Description <small className="booking-modal__optional-note">(Optional)</small></span><textarea rows={3} value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Tell us what you would like help understanding." /></label>{status === 'error' ? <p className="booking-modal__error" role="alert">We could not send your case. Please try again or contact our team directly.</p> : null}</div></div><div className="booking-modal__actions"><span /><button type="submit" className="booking-modal__primary" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Submit Case for Review'} <ArrowRight size={16} /></button></div></form><p className="booking-modal__privacy">Your information is private and confidential. We will never share your case details without permission.</p>
          </>}
        </section>
      </div>
    </div>
  </>
}

function Field({ label, value, onChange, error, type = 'text', autoComplete, optional = false }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string; autoComplete?: string; optional?: boolean }) { return <label className="booking-modal__field"><span>{label}{optional ? <small className="booking-modal__optional-note"> (Optional)</small> : null}</span><input type={type} value={value} autoComplete={autoComplete} onChange={(event) => onChange(event.target.value)} />{error ? <small>{error}</small> : null}</label> }
