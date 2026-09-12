"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, Mail, Search, UserRound } from "lucide-react";
import { countries } from "country-flag-icons";
import { getCountryCallingCode, type CountryCode } from "libphonenumber-js";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { SelectBase } from '@/src/components/ui/SelectBase';
import { CountryFlag } from '@/src/components/forms/CountryPicker';

type ServiceOption = { value: string; label: string };

const countryNames = new Intl.DisplayNames(["vi", "en"], { type: "region" });
const countryOptions = countries
  .filter((code): code is CountryCode => /^[A-Z]{2}$/.test(code))
  .map((code) => {
    try {
      return { code, name: countryNames.of(code) || code, dialCode: `+${getCountryCallingCode(code)}` };
    } catch {
      return null;
    }
  })
  .filter((country): country is { code: CountryCode; name: string; dialCode: string; flag: string } => country !== null)
  .sort((a, b) => a.name.localeCompare(b.name));

const defaultCountry = (countryOptions.find((country) => country.code === "VN") || countryOptions[0])!;

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <label className="home-booking-field">
      <span className="home-booking-label">{label}{required ? <span aria-hidden="true"> *</span> : null}</span>
      {children}
      {error ? <span className="home-booking-error">{error}</span> : null}
    </label>
  );
}

function CountryPicker({ value, onChange, error }: { value: typeof defaultCountry; onChange: (country: typeof defaultCountry) => void; error?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return countryOptions;
    return countryOptions.filter((country) => `${country.name} ${country.code} ${country.dialCode}`.toLowerCase().includes(normalized));
  }, [query]);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  return (
    <div ref={pickerRef} className="home-phone-picker">
      <button type="button" className={`home-phone-trigger${error ? " is-invalid" : ""}`} onClick={() => setOpen((current) => !current)} aria-haspopup="listbox" aria-expanded={open}>
        <CountryFlag code={value.code} label={value.name} /><ChevronDown size={15} aria-hidden="true" />
      </button>
      {open ? <div className="home-phone-menu" role="listbox" aria-label="Select country">
        <div className="home-phone-search"><Search size={15} aria-hidden="true" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search country" aria-label="Search country" /></div>
        <div className="home-phone-options">
          {matches.map((country) => <button type="button" role="option" aria-selected={country.code === value.code} key={country.code} className="home-phone-option" onClick={() => { onChange(country); setOpen(false); setQuery(""); }}><span className="home-phone-option-flag" aria-hidden="true">{country.flag}</span><span className="home-phone-option-name">{country.name}</span><span className="home-phone-option-code">{country.dialCode}</span>{country.code === value.code ? <Check size={14} aria-hidden="true" /> : null}</button>)}
          {!matches.length ? <p className="home-phone-empty">No countries found</p> : null}
        </div>
      </div> : null}
    </div>
  );
}

export function HomeBookingForm({ serviceOptions, submitLabel = "REQUEST CONSULTATION" }: { serviceOptions?: ServiceOption[]; submitLabel?: string }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [country, setCountry] = useState(defaultCountry);
  const [values, setValues] = useState({ fullName: "", phone: "", email: "", service: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const options = serviceOptions?.length ? serviceOptions : [{ value: "general-consultation", label: "General Consultation" }];
  const update = (field: keyof typeof values, value: string) => setValues((current) => ({ ...current, [field]: value }));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (values.fullName.trim().length < 2) nextErrors.fullName = "Please enter your full name";
    if (!values.phone.trim()) nextErrors.phone = "Please enter your phone number";
    if (!values.service) nextErrors.service = "Please select a service";
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Please enter a valid email";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStatus("sending");
    try {
      const recaptchaToken = executeRecaptcha ? await executeRecaptcha("booking_consultation") : "local-development";
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: values.fullName.trim(), phoneNumber: `${country.dialCode}${values.phone.replace(/\D/g, "")}`, email: values.email.trim(), service: values.service, message: values.message.trim(), recaptchaToken }) });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
      setValues({ fullName: "", phone: "", email: "", service: "", message: "" });
    } catch { setStatus("error"); }
  }

  return <form className="home-booking-form" onSubmit={submit} noValidate>
    <div className="home-booking-grid">
      <Field label="Full Name" required error={errors.fullName}><div className="home-booking-input-wrap"><UserRound size={17} aria-hidden="true" /><input value={values.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Enter your full name" autoComplete="name" /></div></Field>
      <Field label="Phone Number" required error={errors.phone}><div className="home-booking-phone"><CountryPicker value={country} onChange={setCountry} error={errors.phone} /><input value={values.phone} onChange={(event) => update("phone", event.target.value)} placeholder="0866 251 379" type="tel" autoComplete="tel-national" /></div></Field>
      <Field label="Email"><div className="home-booking-input-wrap"><Mail size={17} aria-hidden="true" /><input value={values.email} onChange={(event) => update("email", event.target.value)} placeholder="Enter your email" type="email" autoComplete="email" /></div></Field>
      <Field label="Preferred Service" required error={errors.service}><SelectBase value={values.service} options={options} onChange={(value) => update("service", value)} ariaLabel="Preferred Service" invalid={Boolean(errors.service)} /></Field>
      <Field label="Your Message"><textarea value={values.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell us about your needs or any questions you have" rows={4} /></Field>
    </div>
    <button type="submit" className="home-booking-submit" disabled={status === "sending"}>{status === "sending" ? "SENDING..." : submitLabel}<ArrowRight size={17} aria-hidden="true" /></button>
    {status === "success" ? <p className="home-booking-success" role="status">Thank you. We&apos;ll contact you within 24 hours.</p> : null}
    {status === "error" ? <p className="home-booking-error" role="alert">We couldn&apos;t send your request. Please try again or call us directly.</p> : null}
  </form>;
}
