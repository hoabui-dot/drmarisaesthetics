"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Globe } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CLINIC_INFO } from "@/src/lib/constants/contact";
import { formatPhoneNumber, generateMailtoLink, generateTelLink } from '@/src/lib/email/templates/helpers';
import { GoogleMapEmbed } from "@/src/components/ui/google-map-embed";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { BookingButton } from "@/src/components/ui/BookingButton";
import { getGoogleMapsUrl } from "@/src/lib/utils/maps";
import { cn } from "@/src/lib/utils";

import { SOCIAL_LINKS } from "@/src/lib/constants/social-links";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getIconFromClass = (iconClass?: string) => {
  if (!iconClass) return faCommentDots;
  const iconMap: Record<string, any> = {
    'fab fa-facebook': faFacebook,
    'fab fa-instagram': faInstagram,
    'fab fa-youtube': faYoutube,
    'fab fa-tiktok': faTiktok,
    'fas fa-comment-dots': faCommentDots,
  };
  return iconMap[iconClass] || faCommentDots;
};

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any },
  },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactItem {
  /** Lucide icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Row label shown in muted uppercase above the value */
  label: string;
  /** Row value — string or any JSX (e.g. anchor links) */
  value: React.ReactNode;
}

export interface VisitClinicSectionProps {
  /** Optional ID for scroll anchoring */
  id?: string;
  /** Optional badge label above the heading. */
  badge?: string;
  /** Section heading */
  title?: string;
  /** Booking button label. Default: "Book a Free Consultation" */
  ctaLabel?: string;
  /**
   * Contact rows rendered on the right side.
   * Defaults to address, hotlines, email, and opening hours from CLINIC_INFO.
   */
  contactItems?: ContactItem[];
  /** Whether to show social media icons at the bottom. Default: false */
  showSocials?: boolean;
  /** Optional className for the outer <section> or container */
  className?: string;
  /** Section subtitle / description paragraph */
  subtitle?: string;
  /** Whether to wrap the content in a max-width container with default padding. Default: true */
  useDefaultContainer?: boolean;
  /**
   * When true, reverses the column order so the contact panel is on the left
   * and the map is on the right. Default: false (map left, contact right).
   */
  reverseLayout?: boolean;
}

// ─── Default contact rows (pulled from CLINIC_INFO) ───────────────────────────

const defaultContactItems: ContactItem[] = [
  {
    icon: MapPin,
    label: "Address",
    value: CLINIC_INFO.address,
  },
  {
    icon: Phone,
    label: "Hotlines",
    value: (
      <>
        <a
          href={generateTelLink(CLINIC_INFO.phone1)}
          className="font-semibold text-[#165197] hover:text-primary-600 transition-colors"
        >
          {formatPhoneNumber(CLINIC_INFO.phone1)}
        </a>
        {" — "}
        <a
          href={generateTelLink(CLINIC_INFO.phone2)}
          className="font-semibold text-[#165197] hover:text-primary-600 transition-colors"
        >
          {formatPhoneNumber(CLINIC_INFO.phone2)}
        </a>
      </>
    ),
  },
  {
    icon: Mail,
    label: "Email",
    value: (
      <a
        href={generateMailtoLink()}
        className="font-semibold text-[#165197] hover:text-primary-600 transition-colors"
      >
        {CLINIC_INFO.email}
      </a>
    ),
  },
  {
    icon: Clock,
    label: "Opening Hours",
    value: `${CLINIC_INFO.days}, ${CLINIC_INFO.hours}`,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const VisitClinicSection = ({
  id,
  badge,
  title = "Book your appointment at SG International Dental Clinic",
  subtitle,
  ctaLabel = "Book a Free Consultation",
  contactItems: _contactItems = defaultContactItems,
  showSocials = false,
  className = "",
  useDefaultContainer = true,
  reverseLayout = false,
}: VisitClinicSectionProps) => {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const hour = now.getHours();
  const closeHour = 19;
  const isOpen = hour >= 8 && hour < closeHour;
  const content = (
    <div className={useDefaultContainer ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" : ""}>
      {/* Header */}
      {(badge || title || subtitle) && (
        <div className="text-center">
          <AnimatedSectionHeader
            badge={badge}
            title={title}
            subtitle={subtitle}
            titleClassName="text-foreground tracking-tight"
            className="mb-8 sm:mb-10 md:mb-12"
          />
        </div>
      )}

      {/* Body — Map | Contact info */}
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: reverseLayout ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`rounded-3xl overflow-hidden shadow-xl h-[340px] lg:h-[420px] relative ${reverseLayout ? 'order-1 lg:order-2' : ''}`}
        >
          <GoogleMapEmbed
            lat={CLINIC_INFO.coordinates.lat}
            lng={CLINIC_INFO.coordinates.lng}
            query={`${CLINIC_INFO.vietNamName || CLINIC_INFO.name} ${CLINIC_INFO.vietNamAddress || CLINIC_INFO.address}`}
            zoom={16}
            className="absolute inset-0 w-full h-full grayscale-[15%] contrast-[1.05]"
          />
        </motion.div>

        {/* RIGHT SIDE — Premium Contact Panel */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`relative flex flex-col gap-6 ${reverseLayout ? 'order-1 lg:order-1' : ''}`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              {
                icon: MapPin,
                label: "Location",
                value: CLINIC_INFO.address,
                fullWidth: true,
                href: getGoogleMapsUrl(),
              },
              {
                icon: Phone,
                label: "Hotlines",
                value: (
                  <div className="flex flex-col">
                    <a href={generateTelLink(CLINIC_INFO.phone1)} className="text-sm sm:text-base md:text-lg hover:text-primary-600 transition-colors">
                      {formatPhoneNumber(CLINIC_INFO.phone1)}
                    </a>
                    <a href={generateTelLink(CLINIC_INFO.phone2)} className="text-sm sm:text-base md:text-lg hover:text-primary-600 transition-colors">
                      {formatPhoneNumber(CLINIC_INFO.phone2)}
                    </a>
                  </div>
                ),
              },
              {
                icon: Clock,
                label: "Hours",
                value: (
                  <div className="flex flex-col">
                    <span className="text-[#165197]/70 font-normal text-xs lg:text-sm uppercase tracking-wider mb-1">
                      {CLINIC_INFO.days}
                    </span>
                    <span className="whitespace-nowrap text-sm sm:text-base md:text-lg">
                      {CLINIC_INFO.hours}
                    </span>
                    {/* Status Signal - Minimalist Animated Point */}
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      className="absolute top-0 right-0"
                    >
                      <div className={cn(
                        "relative flex items-center gap-2 px-4 py-1.5 rounded-tr-2xl rounded-bl-2xl border-l border-b backdrop-blur-sm transition-all duration-500",
                        isOpen
                          ? "bg-emerald-50/90 border-emerald-500/20 shadow-sm"
                          : "bg-rose-50/90 border-rose-500/20 shadow-sm"
                      )}>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className={cn(
                            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                            isOpen ? "bg-emerald-400" : "bg-rose-400"
                          )}></span>
                          <span className={cn(
                            "relative inline-flex rounded-full h-2.5 w-2.5 shadow-sm",
                            isOpen ? "bg-emerald-500" : "bg-rose-500"
                          )}></span>
                        </span>
                        <span className={cn(
                          "text-xs md:text-base font-bold uppercase tracking-wider",
                          isOpen ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {isOpen ? "Open" : "Closed"}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                ),
              },
              {
                icon: showSocials ? Globe : Mail,
                label: showSocials ? "Digital Channels" : "Email Support",
                value: (
                  <div className="flex items-center gap-6 w-full">
                    {!showSocials ? (
                      <a href={generateMailtoLink()} className="text-sm sm:text-base md:text-lg hover:text-primary-600 transition-colors break-all">
                        {CLINIC_INFO.email}
                      </a>
                    ) : (
                      <div className="flex flex-wrap items-center gap-5 lg:gap-6">
                        <a
                          href={generateMailtoLink()}
                          className="text-primary-600 hover:text-primary-700 hover:scale-110 transition-all duration-300"
                          title="Email Us"
                        >
                          <Mail className="w-6 h-6" />
                        </a>
                        {SOCIAL_LINKS.map((social) => (
                          <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 hover:scale-110 transition-all duration-300"
                            title={social.platform}
                          >
                            <FontAwesomeIcon
                              icon={getIconFromClass(social.iconClass)}
                              className="w-6 h-6"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ),
                fullWidth: true,
              },
            ] as { icon: any; label: string; value: React.ReactNode; fullWidth?: boolean; href?: string }[]).map((item, i) => {
              const Icon = item.icon;
              const CardContent = (
                <div className="flex items-start gap-4 m-5">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className={cn(
                    "flex-1 text-sm sm:text-base md:text-lg text-foreground leading-snug",
                    item.label === "Hours" && "whitespace-nowrap"
                  )}>
                    <p className="text-xs sm:text-sm md:text-lg font-bold text-primary-600/50 uppercase tracking-[0.15em] mb-1">
                      {item.label}
                    </p>
                    {item.value}
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`relative group bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_4px_20px_rgba(22,81,151,0.04)] hover:shadow-[0_12px_30px_rgba(22,81,151,0.08)] transition-all duration-300 ${item.fullWidth ? "sm:col-span-2" : ""} ${item.href ? "cursor-pointer" : ""}`}
                >
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                      {CardContent}
                    </a>
                  ) : (
                    CardContent
                  )}
                </motion.div>
              );
            })}
          </div>


          {/* ── CTA AREA ── */}
          <motion.div variants={fadeUp} className="space-y-4 pt-2">
            <div className="relative group">
              <BookingButton label={ctaLabel} className="relative w-full sm:w-auto min-w-[280px] h-14 text-lg hidden sm:flex" />
            </div>

            <p className="text-sm sm:text-base md:text-lg text-foreground-secondary/70 font-medium px-1 flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0 mt-[0.6em]" />
              Free dental check-up and consultation for all new international patients
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <section id={id} className={className}>
      {content}
    </section>
  );
};

export default VisitClinicSection;
