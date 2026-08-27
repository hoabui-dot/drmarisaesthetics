"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Gift,
  ArrowRight,
  Shield,
  Users,
  Star,
  Lock,
  Phone,
} from "lucide-react";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";

const DENTAL_BG =
  "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=900";

const PROMO_KEY = "promo_seen";
const PROMO_TTL_MS = 30 * 60 * 1000; // 30 minutes

function setSessionWithTTL(key: string, value: string, ttlMs: number) {
  const data = { value, expiry: Date.now() + ttlMs };
  sessionStorage.setItem(key, JSON.stringify(data));
}

function getSessionWithTTL(key: string): string | null {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    const { value, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      sessionStorage.removeItem(key);
      return null;
    }
    return value;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
}

export interface PromotionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  promotionDesc?: string;
}

export function PromotionModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  title = "Exclusive Offer\nfor New Patients",
  subtitle = "Enjoy special pricing on selected treatments. Leave your phone and our team will assist you.",
  imageUrl = DENTAL_BG,
  promotionDesc = "30% Off Dental Check-up & Cleaning",
}: PromotionModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { shouldSimplify } = useMobileAnimation();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const isModalOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    if (controlledIsOpen === undefined) {
      const hasSeen = getSessionWithTTL(PROMO_KEY);
      if (!hasSeen) {
        const timer = setTimeout(() => setInternalIsOpen(true), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [controlledIsOpen]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
      setSessionWithTTL(PROMO_KEY, "true", PROMO_TTL_MS);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.trim().length < 7) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }
    setPhoneError("");
    setIsSubmitting(true);

    let recaptchaToken = "dummy_token";
    if (executeRecaptcha) {
      try {
        recaptchaToken = await executeRecaptcha("promotion_modal");
      } catch (err) {
      }
    }

    try {
      // Submit to our own Next.js API route which securely handles reCAPTCHA, Strapi communication, and emails
      const res = await fetch("/api/promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
          promotion_name: promotionDesc.replace(/\n/g, " "),
          recaptchaToken,
        }),
      });

      const data = await res.json();

      if (res.ok) {

        toast.success("Offer Claimed!", {
          description: "Your VIP voucher will be sent to your phone shortly.",
          duration: 6000,
          position: window.innerWidth < 768 ? "top-center" : "bottom-right",
        });
        handleClose();
      } else {
        setPhoneError("Something went wrong. Please try again or call us.");
      }
    } catch (err) {
      setPhoneError("Network error. Please try again or call us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop — CSS transition, no backdrop-blur on mobile (GPU filter cost) */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[9998] bg-slate-900/65 transition-opacity duration-280 ${shouldSimplify ? "" : "backdrop-blur-sm"} ${isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Centering shell — Added visibility: hidden when closed to prevent invisible overlays from blocking underlying content */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none transition-all duration-300 ${isModalOpen ? "visible" : "invisible"}`}
      >
        {/*
         * Modal — CSS transform+opacity with will-change for GPU compositing.
         * Mobile: simpler translate-y (no scale) to avoid repaints.
         * Desktop: scale + translate for a premium spring-like feel.
         */}
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          style={{ willChange: "transform" }}
          className={`relative w-full max-w-[860px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all ${shouldSimplify ? "duration-250" : "duration-300"} ${
            isModalOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : shouldSimplify
                ? "opacity-0 translate-y-5 scale-100 pointer-events-none"
                : "opacity-0 translate-y-8 scale-[0.96] pointer-events-none"
          }`}
        >
          {/* ── LEFT PANEL ─── */}
          <div
            className="relative hidden lg:flex flex-col justify-end w-[46%] shrink-0 overflow-hidden"
            style={{
              backgroundImage: `url('${imageUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              minHeight: 520,
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
              <h2 className="text-[1.75rem] leading-tight font-bold text-[#165197] mb-3 whitespace-pre-line">
                {title}
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

          {/* ── RIGHT PANEL ── */}
          <div className="flex-1 px-7 sm:px-10 py-9 flex flex-col justify-center">
            <button
              onClick={handleClose}
              aria-label="Close promotion"
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-slate-200 bg-white/90 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shadow-sm z-20"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="relative">
              <div className="mb-6 pr-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#165197] leading-tight mb-2">
                  Exclusive Offer
                  <br />
                  for New Patients
                  <span className="text-[#1e6fdf] ml-1.5">✦</span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-[#165197]/70 leading-relaxed font-medium">
                  {subtitle}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl px-4 py-3.5 mb-7">
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
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="promo-phone"
                    className="block text-sm font-bold text-foreground-secondary mb-2"
                  >
                    Where should we text your voucher?
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center pl-4 pr-3 border-r border-slate-200 pointer-events-none">
                      <Phone className="w-4 h-4 text-[#165197]/40 mr-1" />
                      <span className="text-xs text-[#165197]/60 font-semibold">
                        +84
                      </span>
                    </div>
                    <input
                      id="promo-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneError("");
                      }}
                      placeholder="Phone number"
                      className={`w-full h-12 pl-[88px] pr-4 rounded-xl border text-sm text-foreground-secondary placeholder:text-[#165197]/40 bg-white outline-none transition-all focus:ring-2 ${isModalOpen ? "pointer-events-auto" : "pointer-events-none"} ${phoneError ? "border-red-300 focus:ring-red-300/30" : "border-slate-200 focus:border-[#165197] focus:ring-[#165197]/15 hover:border-slate-300"}`}
                    />
                  </div>
                  {phoneError && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">
                      {phoneError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#165197] hover:bg-[#1260b0] active:scale-[0.98] text-white font-bold text-[15px] shadow-lg shadow-[#165197]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
                <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#165197]/40 font-medium pt-0.5">
                  <Lock className="w-3 h-3" />
                  Your information is secure and confidential.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
