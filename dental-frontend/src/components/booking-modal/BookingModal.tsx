'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { contactFormSchema, type ContactFormData } from '@/src/lib/validations/contact-form'
import { useBookingModal } from './BookingModalContext'
import { CountryPicker, defaultCountry, type CountryOption } from '@/src/components/forms/CountryPicker'
import { SelectBase, type SelectOption } from '@/src/components/ui/SelectBase'
import { formatNationalPhone, normalizeNationalPhone } from '@/src/components/forms/phoneFormatting'

const fallbackBookingForm = {
  visualEyebrow: 'DIRECT SURGEON CARE', visualTitle: 'Your case is reviewed before you travel.',
  visualDescription: 'Begin with a private clinical assessment led by a surgical team in Ho Chi Minh City.',
  visualPoints: [{ id: 1, label: 'Hospital-Based Surgery' }, { id: 2, label: 'Ho Chi Minh City, Vietnam' }, { id: 3, label: 'International Patient Support' }],
  formEyebrow: 'PRIVATE CONSULTATION', formTitle: 'Tell us about your case.',
  formDescription: 'Share a few details so our team can understand your concerns and determine the appropriate next step.',
  privacyText: 'Your information is private and confidential. We will never share your case details without permission.',
  successEyebrow: 'CASE RECEIVED', successTitle: 'Your case has been received.',
  successDescription: 'Our team will review the information you provided and contact you regarding the appropriate next step.',
}

const BOOKING_FORM_UI_COPY = {
  submitLabel: 'Submit Case for Review',
  submittingLabel: 'Sending…',
  procedurePlaceholder: 'Select an area or procedure',
  messagePlaceholder: 'Tell us what you would like help understanding.',
} as const

export function BookingModal() {
  const { isOpen, close, serviceOptions, bookingForm, context } = useBookingModal()
  const copy = bookingForm || fallbackBookingForm
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isSubmitting, setIsSubmitting] = useState(false), [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({}), [phoneCountry, setPhoneCountry] = useState<CountryOption>(defaultCountry)
  const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', type: context.consultationType, procedure: context.procedure, otherService: '', message: '' })
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (!isOpen) return; setStatus('idle'); setErrors({}); setForm((current) => ({ ...current, type: context.consultationType, procedure: context.procedure })) }, [isOpen, context.consultationType, context.procedure])
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [isOpen])
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, input, textarea'); if (!focusable.length) return
      const first = focusable[0], last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  const update = (field: keyof typeof form, value: string) => { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: '' })) }
  const validateForm = () => {
    const next: Record<string, string> = {}
    if (form.fullName.trim().length < 2) next.fullName = 'Please enter your full name.'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address.'
    const parsedPhone = form.phoneNumber.trim() ? parsePhoneNumberFromString(form.phoneNumber, phoneCountry.code) : undefined
    if (!parsedPhone || !parsedPhone.isValid()) next.phoneNumber = 'Please enter a valid phone number for the selected country.'
    if (!form.procedure) next.procedure = 'Please select an area or procedure.'
    if (form.procedure === 'Other' && !form.otherService.trim()) next.otherService = 'Please specify the service you are interested in.'
    setErrors(next); return Object.keys(next).length === 0
  }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (!validateForm()) return; setIsSubmitting(true); setStatus('idle')
    try {
      const isProduction = process.env.NODE_ENV === 'production'
      if (isProduction && !executeRecaptcha) {
        console.warn('[Booking] reCAPTCHA is not ready; submission was not sent')
        toast.error('Security verification is still loading. Please try again in a moment.')
        setStatus('error')
        return
      }
      const recaptchaToken = executeRecaptcha ? await executeRecaptcha('booking_modal') : 'local-development'
      console.info('[Booking] reCAPTCHA token received', { available: Boolean(recaptchaToken), production: isProduction })
      if (!recaptchaToken) throw new Error('Missing reCAPTCHA token')
      const message = [`Consultation type: ${form.type === 'revision' ? 'Revision Surgery' : 'Cosmetic Surgery Consultation'}`, `Area / procedure: ${form.procedure}`, form.message ? `Case description: ${form.message}` : ''].filter(Boolean).join('\n')
      const parsedPhone = parsePhoneNumberFromString(form.phoneNumber, phoneCountry.code); if (!parsedPhone || !parsedPhone.isValid()) throw new Error('Invalid phone number')
      const payload: ContactFormData = { fullName: form.fullName, email: form.email, phoneNumber: parsedPhone.number, service: form.procedure || 'Consultation', otherService: form.procedure === 'Other' ? form.otherService.trim() : '', message, recaptchaToken }
      if (!contactFormSchema.safeParse(payload).success) throw new Error('Invalid form')
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        console.error('[Booking] submission rejected', { status: response.status, error: errorBody?.error || 'unknown' })
        throw new Error(errorBody?.error || 'Submission failed')
      }
      setStatus('success'); toast.success('Your case has been received.', { description: 'Our team will contact you regarding the appropriate next step.' })
    } catch { setStatus('error') } finally { setIsSubmitting(false) }
  }
  const procedureOptions: SelectOption[] = [...serviceOptions.filter((option) => option.value !== 'Other'), { label: 'Others', value: 'Other' }]
  const visualStyle = bookingForm?.visualImage?.url ? { backgroundImage: `url('${bookingForm.visualImage.url}')` } : undefined

  return <>
    <div className={`booking-modal-backdrop ${isOpen ? 'is-open' : ''}`} onClick={close} aria-hidden="true" />
    <div className={`booking-modal-shell ${isOpen ? 'is-open' : ''}`}>
      <div ref={dialogRef} className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
        <aside className="booking-modal__visual" style={visualStyle}><div className="booking-modal__visual-wash" /><div className="booking-modal__visual-copy"><span className="booking-modal__eyebrow">{copy.visualEyebrow}</span><h2>{copy.visualTitle}</h2>{copy.visualDescription ? <p>{copy.visualDescription}</p> : null}<ul>{copy.visualPoints.map((point, index) => <li key={point.id || `${point.label}-${index}`}>{point.label}</li>)}</ul></div></aside>
        <section className="booking-modal__content"><button type="button" className="booking-modal__close" onClick={close} aria-label="Close consultation form"><X size={19} /></button>
          {status === 'success' ? <div className="booking-modal__success"><span><Check size={22} /></span><span className="booking-modal__eyebrow">{copy.successEyebrow}</span><h2>{copy.successTitle}</h2>{copy.successDescription ? <p>{copy.successDescription}</p> : null}</div> : <>
            <div className="booking-modal__heading"><span className="booking-modal__eyebrow">{copy.formEyebrow}</span><h2 id="booking-modal-title">{copy.formTitle}</h2>{copy.formDescription ? <p>{copy.formDescription}</p> : null}</div>
            <form onSubmit={submit} noValidate><div className="booking-modal__step"><div className="booking-modal__fields"><Field label="Full Name" value={form.fullName} onChange={(value) => update('fullName', value)} error={errors.fullName} autoComplete="name" /><Field label="Email Address" optional type="email" value={form.email} onChange={(value) => update('email', value)} error={errors.email} autoComplete="email" /><label className="booking-modal__field booking-modal__field--phone"><span>WhatsApp / Phone</span><div className="booking-modal__phone-field"><CountryPicker label="Phone country code" value={phoneCountry} onChange={setPhoneCountry} error={errors.phoneNumber} /><span className="booking-modal__phone-prefix" aria-hidden="true">({phoneCountry.dialCode})</span><input type="tel" value={formatNationalPhone(form.phoneNumber, phoneCountry)} onChange={(event) => update('phoneNumber', normalizeNationalPhone(event.target.value, phoneCountry))} autoComplete="tel" inputMode="tel" /></div>{errors.phoneNumber ? <small>{errors.phoneNumber}</small> : null}</label><label className="booking-modal__field booking-modal__field--full"><span>Area / Procedure</span><SelectBase value={form.procedure} options={procedureOptions} onChange={(value) => update('procedure', value)} placeholder={BOOKING_FORM_UI_COPY.procedurePlaceholder} ariaLabel="Area or procedure" invalid={Boolean(errors.procedure)} />{errors.procedure ? <small>{errors.procedure}</small> : null}</label>{form.procedure === 'Other' ? <label className="booking-modal__field booking-modal__field--full"><span>Please specify the service <b>*</b></span><input type="text" value={form.otherService} onChange={(event) => update('otherService', event.target.value)} placeholder="Tell us which service you are interested in" />{errors.otherService ? <small>{errors.otherService}</small> : null}</label> : null}<label className="booking-modal__field booking-modal__field--full"><span>Brief Case Description <small className="booking-modal__optional-note">(Optional)</small></span><textarea rows={3} value={form.message} onChange={(event) => update('message', event.target.value)} placeholder={BOOKING_FORM_UI_COPY.messagePlaceholder} /></label>{status === 'error' ? <p className="booking-modal__error" role="alert">We could not send your case. Please try again or contact our team directly.</p> : null}</div></div><div className="booking-modal__actions"><span /><button type="submit" className="booking-modal__primary" disabled={isSubmitting}>{isSubmitting ? BOOKING_FORM_UI_COPY.submittingLabel : BOOKING_FORM_UI_COPY.submitLabel} <ArrowRight size={16} /></button></div></form>{copy.privacyText ? <p className="booking-modal__privacy">{copy.privacyText}</p> : null}
          </>}
        </section>
      </div>
    </div>
  </>
}

function Field({ label, value, onChange, error, type = 'text', autoComplete, optional = false }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string; autoComplete?: string; optional?: boolean }) { return <label className="booking-modal__field"><span>{label}{optional ? <small className="booking-modal__optional-note"> (Optional)</small> : null}</span><input type={type} value={value} autoComplete={autoComplete} onChange={(event) => onChange(event.target.value)} />{error ? <small>{error}</small> : null}</label> }
