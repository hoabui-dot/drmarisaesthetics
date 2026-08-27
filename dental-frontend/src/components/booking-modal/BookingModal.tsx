"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Gift,
  User,
  Phone,
  ChevronDown,
  MessageSquare,
  Shield,
  Users,
  Star,
  Lock,
  ArrowRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  contactFormSchema,
  type ContactFormData,
} from "@/src/lib/validations/contact-form";
import { useBookingModal } from "./BookingModalContext";

const DENTAL_CLINIC_BG =
  "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=900";

// ── Small icon-prefixed input wrapper ────────────────────────────────────────
function IconInput({
  id,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#165197]/40 pointer-events-none" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm text-foreground-secondary placeholder:text-[#165197]/40 bg-white transition-all outline-none focus:ring-2 ${
            error
              ? "border-red-300 focus:ring-red-300/30"
              : "border-slate-200 focus:border-[#165197] focus:ring-[#165197]/15 hover:border-slate-300"
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

// ── Service custom dropdown — CSS-only panel ──────────────────────────────────
function ServiceSelect({
  value,
  options,
  onChange,
  error,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const allOptions = [...options, "Other"];

  return (
    <div ref={ref} className={`relative ${isOpen ? "z-40" : "z-0"}`}>
      <button
        type="button"
        id="bm-service"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm text-left flex items-center justify-between gap-2 bg-white transition-all outline-none ${
          error
            ? "border-red-300 ring-2 ring-red-300/30"
            : isOpen
              ? "border-[#165197] ring-2 ring-[#165197]/15 shadow-sm"
              : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#165197]/40 pointer-events-none flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c-2 0-4.5 1-4.5 4 0 1.5.5 3 .5 5s-1 5-1 6.5a1.5 1.5 0 003 0c0-1 .5-3 1.5-3s1.5 2 1.5 3a1.5 1.5 0 003 0c0-1.5-1-5-1-6.5s.5-3.5.5-5C16.5 4 14 3 12 3z"
          />
        </svg>
        <span
          className={`truncate ${value ? "text-foreground-secondary" : "text-[#165197]/40"}`}
        >
          {value || "Service of Interest"}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#165197]" : "text-[#165197]/40"}`}
        />
      </button>

      {/* CSS-only panel — no JS animation library */}
      <div
        className={`absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_16px_48px_rgba(22,81,151,0.14)] z-[100] overflow-hidden transition-all duration-150 origin-top ${isOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}`}
      >
        <div className="p-1.5 max-h-[220px] overflow-y-auto">
          {allOptions.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${isSelected ? "bg-[#eff6ff] text-[#165197]" : "text-slate-700 hover:bg-slate-50 hover:text-[#165197]"}`}
              >
                <span>{opt}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#165197] flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function BookingModal() {
  const { isOpen, close, serviceOptions } = useBookingModal();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    phoneNumber: "",
    service: "",
    otherService: "",
    message: "",
    recaptchaToken: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "error">("idle");
  const [showOtherService, setShowOtherService] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) close();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, close]);

  const resetForm = useCallback(() => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      service: "",
      otherService: "",
      message: "",
      recaptchaToken: "",
    });
    setErrors({});
    setSubmitStatus("idle");
    setShowOtherService(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(resetForm, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, resetForm]);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "service") {
      setShowOtherService(value === "Other");
      if (value !== "Other")
        setFormData((prev) => ({ ...prev, otherService: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitStatus("idle");

    if (!executeRecaptcha) {
      setSubmitStatus("error");
      return;
    }

    let recaptchaToken: string;
    try {
      recaptchaToken = await executeRecaptcha("booking_modal");
    } catch (err) {
      setSubmitStatus("error");
      return;
    }

    const dataWithToken = { ...formData, recaptchaToken };
    const result = contactFormSchema.safeParse(dataWithToken);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach((i) => {
        if (i.path[0])
          fieldErrors[i.path[0] as keyof ContactFormData] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit to our own Next.js API route which securely handles reCAPTCHA, Strapi communication, and emails
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataWithToken),
      });

      const data = await res.json();

      if (res.ok) {

        toast.success("Booking request sent!", {
          description: "Our team will contact you within 24 hours.",
          duration: 6000,
          position: window.innerWidth < 768 ? "top-center" : "bottom-right",
        });
        close();
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop — CSS opacity transition, no JS animation library */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-[200] bg-slate-900/65 backdrop-blur-sm transition-opacity duration-280 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Centering shell — Added visibility: hidden when closed to prevent invisible overlays from blocking underlying content */}
      <div
        className={`fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}
      >
        {/* Modal — CSS transform+opacity, will-change:transform for GPU compositing */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Exclusive Offer – Book Consultation"
          style={{ willChange: "transform" }}
          className={`relative w-full max-w-[900px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[92dvh] transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-8 scale-[0.96] pointer-events-none"}`}
        >
          {/* ── LEFT PANEL ─────────────────────────────────── */}
          <div
            className="relative hidden lg:flex flex-col justify-end w-[47%] shrink-0 overflow-hidden"
            style={{
              backgroundImage: `url('${DENTAL_CLINIC_BG}')`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            <div className="absolute top-6 left-6 grid grid-cols-4 gap-1.5 opacity-20">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#165197]"
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/80 to-[#f0f7ff]" />
            <div className="relative z-10 p-8 pb-9">
              <div className="inline-flex items-center gap-1.5 bg-[#1e6fdf] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                <Gift className="w-3 h-3" /> Limited Time Offer
              </div>
              <h2 className="text-[1.75rem] leading-tight font-bold text-[#165197] mb-3">
                Brighten Your Smile,
                <br />
                Boost Your Confidence
              </h2>
              <p className="text-sm text-[#165197]/70 mb-6 font-medium">
                Exclusive discount for new patients
              </p>
              <div className="flex items-end gap-4 mb-8">
                <div>
                  <p className="text-[#165197]/50 text-xs font-bold uppercase tracking-wider mb-0.5">
                    Up to
                  </p>
                  <p className="text-[#165197] font-bold leading-none">
                    <span className="text-5xl">30%</span>
                    <span className="text-xl ml-1">OFF</span>
                  </p>
                </div>
                <div className="border-l border-[#165197]/20 pl-4 pb-1">
                  <p className="text-foreground-secondary text-sm font-bold leading-snug">
                    On Selected
                    <br />
                    Dental Treatments
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5 border-t border-[#165197]/10 pt-5">
                {[
                  { icon: Shield, label: "Safe & Sterile\nEnvironment" },
                  { icon: Users, label: "Experienced\nSpecialists" },
                  { icon: Star, label: "International\nStandards" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 text-center"
                  >
                    <Icon className="w-5 h-5 text-[#165197]/60" />
                    <p className="text-[#165197]/50 text-[11px] font-bold leading-tight whitespace-pre-line">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-9 py-8 scrollbar-hide">
            <button
              onClick={close}
              id="booking-modal-close"
              aria-label="Close booking modal"
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-slate-200 bg-white/80 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors z-20 shadow-sm"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="mb-6 pr-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#165197] leading-tight mb-2">
                Exclusive Offer
                <br />
                for New Patients<span className="text-[#1e6fdf] ml-1">✦</span>
              </h2>
              <p className="text-sm text-[#165197]/70 leading-relaxed font-medium">
                Enjoy special pricing on selected treatments.
                <br />
                Leave your details and our team will assist you.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl px-4 py-3.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#dbeafe] flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4 text-[#1e6fdf]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1e6fdf]">
                  Up to 30% off
                </p>
                <p className="text-xs text-[#165197]/60 font-medium">
                  Limited time only
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              <IconInput
                id="bm-fullName"
                icon={User}
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(v) => handleChange("fullName", v)}
                error={errors.fullName}
              />
              <IconInput
                id="bm-phone"
                icon={Phone}
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(v) => handleChange("phoneNumber", v)}
                error={errors.phoneNumber}
              />
              <ServiceSelect
                value={formData.service}
                options={serviceOptions}
                onChange={(v) => handleChange("service", v)}
                error={errors.service}
              />

              {/* CSS grid collapse for "Other service" — no JS animation */}
              <div
                className={`grid transition-all duration-220 ${showOtherService ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <IconInput
                    id="bm-otherService"
                    icon={MessageSquare}
                    placeholder="Please describe the service"
                    value={formData.otherService ?? ""}
                    onChange={(v) => handleChange("otherService", v)}
                    error={errors.otherService}
                  />
                </div>
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-[#165197]/40 pointer-events-none" />
                <textarea
                  id="bm-message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Optional Note"
                  rows={3}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-foreground-secondary placeholder:text-[#165197]/40 bg-white transition-all outline-none focus:ring-2 focus:border-[#165197] focus:ring-[#165197]/15 hover:border-slate-300 resize-none"
                />
              </div>

              {/* Error message — CSS transition */}
              <div
                className={`transition-all duration-200 ${submitStatus === "error" ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}
              >
                <p className="text-xs text-red-600 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  Something went wrong. Please try again or call us directly.
                </p>
              </div>

              <button
                type="submit"
                id="booking-modal-submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#165197] hover:bg-[#1260b0] active:scale-[0.98] text-white font-bold text-[15px] shadow-lg shadow-[#165197]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    Claim Your Offer
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#165197]/40 font-medium pt-1">
                <Lock className="w-3 h-3" />
                Your information is secure and confidential.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
