'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, ChevronLeft, Paperclip, X } from 'lucide-react'
import { toast } from 'sonner'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { contactFormSchema, type ContactFormData } from '@/src/lib/validations/contact-form'
import { useBookingModal } from './BookingModalContext'

const consultationImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0'
type Step = 1 | 2 | 3
const steps = ['YOUR DETAILS', 'YOUR CASE', 'SUPPORTING INFORMATION']

export function BookingModal() {
  const { isOpen, close, serviceOptions, context } = useBookingModal()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [step, setStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<string[]>([])
  const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', country: '', type: context.consultationType, procedure: context.procedure, message: '', previousProcedure: '', previousDate: '', previousLocation: '', primaryConcern: '' })
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    setStep(1); setStatus('idle'); setErrors({}); setFiles([])
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

  const validateStep = () => {
    const next: Record<string, string> = {}
    if (step === 1) {
      if (form.fullName.trim().length < 2) next.fullName = 'Please enter your full name.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address.'
      if (!form.phoneNumber.trim()) next.phoneNumber = 'Please enter a WhatsApp number.'
      if (!form.country.trim()) next.country = 'Please enter your country of residence.'
    }
    if (step === 2) {
      if (!form.type) next.type = 'Please select the consultation type.'
      if (!form.procedure) next.procedure = 'Please select an area or procedure.'
      if (form.type === 'revision' && !form.primaryConcern.trim()) next.primaryConcern = 'Please describe your primary concern.'
    }
    setErrors(next); return Object.keys(next).length === 0
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (!validateStep()) return
    setIsSubmitting(true); setStatus('idle')
    try {
      const recaptchaToken = executeRecaptcha ? await executeRecaptcha('booking_modal') : 'local-development'
      const message = [`Country of residence: ${form.country}`, `Consultation type: ${form.type === 'revision' ? 'Revision Surgery' : 'Primary Cosmetic Surgery'}`, `Area / procedure: ${form.procedure}`, form.message ? `Case description: ${form.message}` : '', form.previousProcedure ? `Previous procedure: ${form.previousProcedure}` : '', form.previousDate ? `Previous surgery date: ${form.previousDate}` : '', form.previousLocation ? `Previous surgery location: ${form.previousLocation}` : '', form.primaryConcern ? `Primary concern: ${form.primaryConcern}` : '', files.length ? `Supporting files: ${files.join(', ')}` : ''].filter(Boolean).join('\n')
      const payload: ContactFormData = { fullName: form.fullName, email: form.email, phoneNumber: form.phoneNumber, service: form.procedure || 'Consultation', otherService: '', message, recaptchaToken }
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
            <div className="booking-modal__progress" aria-label={`Step ${step} of 3`}><div><b>0{step} / 03</b><span>{steps[step - 1]}</span></div><div className="booking-modal__progress-line">{steps.map((label, index) => <i className={index + 1 <= step ? 'is-active' : ''} key={label} />)}</div></div>
            <form onSubmit={submit} noValidate><div className="booking-modal__step" key={step}><h3>{steps[step - 1]}</h3>
              {step === 1 ? <div className="booking-modal__fields"><Field label="Full Name" value={form.fullName} onChange={(value) => update('fullName', value)} error={errors.fullName} /><Field label="Email Address" type="email" value={form.email} onChange={(value) => update('email', value)} error={errors.email} /><Field label="WhatsApp / Phone" type="tel" value={form.phoneNumber} onChange={(value) => update('phoneNumber', value)} error={errors.phoneNumber} /><Field label="Country of Residence" value={form.country} onChange={(value) => update('country', value)} error={errors.country} /></div> : null}
              {step === 2 ? <div className="booking-modal__fields"><fieldset><legend>What are you considering?</legend><div className="booking-modal__choices"><Choice label="Primary Cosmetic Surgery" checked={form.type === 'primary'} onChange={() => update('type', 'primary')} /><Choice label="Revision Surgery" checked={form.type === 'revision'} onChange={() => update('type', 'revision')} /><Choice label="Not Sure Yet" checked={!form.type} onChange={() => update('type', '')} /></div>{errors.type ? <small>{errors.type}</small> : null}</fieldset><label className="booking-modal__field booking-modal__field--full"><span>Area / Procedure</span><select value={form.procedure} onChange={(event) => update('procedure', event.target.value)}><option value="">Select an area or procedure</option>{serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}<option value="Other">Other</option></select>{errors.procedure ? <small>{errors.procedure}</small> : null}</label><label className="booking-modal__field booking-modal__field--full"><span>Brief Case Description</span><textarea rows={3} value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Tell us what you would like help understanding." /></label>{form.type === 'revision' ? <div className="booking-modal__revision"><Field label="Previous Procedure" value={form.previousProcedure} onChange={(value) => update('previousProcedure', value)} /><Field label="Date of Previous Surgery" type="date" value={form.previousDate} onChange={(value) => update('previousDate', value)} /><Field label="Country / Clinic" value={form.previousLocation} onChange={(value) => update('previousLocation', value)} /><Field label="Primary Concern" value={form.primaryConcern} onChange={(value) => update('primaryConcern', value)} error={errors.primaryConcern} /></div> : null}</div> : null}
              {step === 3 ? <div className="booking-modal__fields"><label className="booking-modal__upload"><Paperclip size={20} /><strong>Upload files</strong><span>Clinical photographs, operative reports or relevant medical documents</span><input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={(event) => setFiles(Array.from(event.target.files || []).map((file) => file.name))} /><em>Files are optional and used only to support your preliminary clinical review.</em></label>{files.length ? <p className="booking-modal__file-list">{files.join(' · ')}</p> : null}<label className="booking-modal__field booking-modal__field--full"><span>Anything else we should know?</span><textarea rows={4} value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Optional additional context" /></label>{status === 'error' ? <p className="booking-modal__error" role="alert">We could not send your case. Please try again or contact our team directly.</p> : null}</div> : null}
            </div><div className="booking-modal__actions">{step > 1 ? <button type="button" className="booking-modal__back" onClick={() => setStep((current) => Math.max(1, current - 1) as Step)}><ChevronLeft size={16} />Back</button> : <span />}{step < 3 ? <button type="button" className="booking-modal__primary" onClick={() => validateStep() && setStep((current) => Math.min(3, current + 1) as Step)}>Continue <ArrowRight size={16} /></button> : <button type="submit" className="booking-modal__primary" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Submit Case for Review'} <ArrowRight size={16} /></button>}</div></form><p className="booking-modal__privacy">Your information is private and confidential. We will never share your case details without permission.</p>
          </>}
        </section>
      </div>
    </div>
  </>
}

function Field({ label, value, onChange, error, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string }) { return <label className="booking-modal__field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} />{error ? <small>{error}</small> : null}</label> }
function Choice({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) { return <label className={`booking-modal__choice ${checked ? 'is-selected' : ''}`}><input type="radio" checked={checked} onChange={onChange} />{label}</label> }
