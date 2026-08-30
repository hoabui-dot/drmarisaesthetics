"use client";

import { useState } from "react";
import Image from "next/image";
import { NavigationLink } from "@/src/components/ui/NavigationLink";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import {
  Shield,
  ShieldCheck,
  Cpu,
  UserRound,
  HeartHandshake,
  Award,
  CalendarDays,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

import { notFound } from "next/navigation";
import { useBookingModal } from "@/src/components/booking-modal/BookingModalContext";
import { VideoDialog } from "@/src/components/ui/VideoDialog";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type ServiceItem = {
  slug: string;
  title: string;
  description: string;
  image: string;
};
type FeatureItem = { icon: LucideIcon; title: string; description: string };

type PageData = {
  hero: {
    badge: string;
    title: string;
    description: string;
    image?: string;
    videoUrl?: string;
  };
  services: ServiceItem[];
  servicesTitle: string;
  features: { eyebrow: string; title: string; items: FeatureItem[] };
};

/** Keep CMS uploads on the frontend origin; the Next route proxies them to Strapi. */
function resolveMediaUrl(url: string | undefined): string {
  if (!url) return "";
  return url.startsWith("/") ? `/api/strapi-media${url}` : url;
}

// ─── ICON MAPPING (FROM STRAPI STRING TO LUCIDE COMPONENT) ───────────────────
function getIconForString(name: string): LucideIcon {
  switch (name) {
    case "Shield":
      return Shield;
    case "ShieldCheck":
      return ShieldCheck;
    case "Cpu":
      return Cpu;
    case "UserRound":
      return UserRound;
    case "HeartHandshake":
      return HeartHandshake;
    case "Award":
      return Award;
    default:
      return Shield;
  }
}

// ─── HERO SECTION ────────────────────────────────────────────────────────────

function HeroSection({ data, onBook }: { data: PageData["hero"]; onBook: () => void }) {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
    <section className="services-page-hero">
      {data.image ? <Image src={data.image} alt="Modern cosmetic surgery consultation room" fill priority sizes="(max-width: 1023px) 100vw, 58vw" className="services-page-hero__image" /> : null}
      <div className="services-page-hero__fade" aria-hidden="true" />
      <div className="services-page-hero__content">
        <p className="services-page-hero__eyebrow">{data.badge}</p>
        <h1>{data.title}</h1>
        {data.description ? <p className="services-page-hero__description">{data.description}</p> : null}
        <div className="services-page-hero__actions">
          <button type="button" className="services-page-hero__primary" onClick={onBook}>BOOK APPOINTMENT</button>
          <button type="button" className="services-page-hero__secondary" aria-label="Watch video" onClick={() => setVideoOpen(true)}> <span aria-hidden="true">▶</span> WATCH VIDEO</button>
        </div>
      </div>
    </section>
    <VideoDialog open={videoOpen} source={data.videoUrl} onClose={() => setVideoOpen(false)} />
    </>
  );
}

// ─── SERVICES GRID WITH FILTER ─────────────────────────────────────────────

function ServicesGridSection({ data, title }: { data: PageData["services"]; title: string }) {
  return (
    <section className="services-list-section" aria-labelledby="services-list-title">
      <div className="services-list-container">
        <div className="services-list-heading">
          <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
            <p className="services-list-eyebrow">OUR SURGICAL SERVICES</p>
            <h2 id="services-list-title">{title}</h2>
            <div className="services-list-divider" aria-hidden="true">
              <span />
              <svg viewBox="0 0 24 24" role="presentation"><path d="M8.1 5.2c.3-1.2 1.3-2 2.6-2 .6 0 1 .2 1.3.5.4-.3.8-.5 1.3-.5 1.3 0 2.3.8 2.6 2 .7.2 1.2.8 1.2 1.6 0 1-.5 1.8-1.1 2.5.3 1.8.1 4-.6 6.2-.3 1-.8 1.5-1.4 1.5-.7 0-.9-1-1.3-2.1-.2-.6-.4-1.2-.7-1.2s-.5.6-.7 1.2c-.4 1.1-.6 2.1-1.3 2.1-.6 0-1.1-.5-1.4-1.5-.7-2.2-.9-4.4-.6-6.2-.6-.7-1.1-1.5-1.1-2.5 0-.8.5-1.4 1.2-1.6Z" /></svg>
              <span />
            </div>
          </PerformanceAnimation>
        </div>

        <div className="services-list-grid">
          {data.map((service, i) => (
            <PerformanceAnimation
              key={service.slug}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.05}
            >
              <ServiceCard service={service} />
            </PerformanceAnimation>
          ))}
        </div>

      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  const [imgError, setImgError] = useState(false);
  const showImage = service.image && !imgError;

  return (
    <article className="services-list-card">
        <div className="services-list-card__image">
          {showImage ? (
            <Image
              src={service.image}
              alt={service.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              onError={() => {
                setImgError(true);
              }}
            />
          ) : (
            <div className="services-list-card__image-fallback" aria-hidden="true">
              <svg
                className="h-16 w-16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

        </div>

        <div className="services-list-card__content">
          <h3>{service.title}</h3>
          <p>
            {service.description}
          </p>
          <NavigationLink href={`/services/${service.slug}`} className="services-list-card__link">LEARN MORE <ArrowRight size={13} aria-hidden="true" /></NavigationLink>
        </div>
    </article>
  );
}

// ─── CTA SECTION ──────────────────────────────────────────────────────────────

function CTASection({ ctaData }: { ctaData?: any }) {
  const image = ctaData?.background_image;
  const imageUrl = resolveMediaUrl(image?.url);
  const imageAlt = image?.alternativeText || image?.name || "DR. MARIS AESTHETICS clinical environment";

  return (
    <section className="services-consultation-cta" aria-labelledby="services-consultation-cta-title">
      <div className="services-consultation-cta__content">
        <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
          <h2 id="services-consultation-cta-title">{ctaData?.heading || "Ready to Begin Your Assessment?"}</h2>
          <p>{ctaData?.description || "Book a consultation with our experts today and take the first step toward a healthier, more confident you."}</p>
          <NavigationLink href={ctaData?.button_link || "/contact"} className="services-consultation-cta__button">
            <CalendarDays size={16} aria-hidden="true" />
            {ctaData?.button_label || "BOOK APPOINTMENT"}
          </NavigationLink>
        </PerformanceAnimation>
      </div>
      <div className="services-consultation-cta__media" aria-hidden={imageUrl ? undefined : true}>
        {imageUrl ? <Image src={imageUrl} alt={imageAlt} fill unoptimized sizes="(max-width: 767px) 100vw, 50vw" className="services-consultation-cta__image" /> : null}
      </div>
    </section>
  );
}

// ─── WHY CHOOSE US ────────────────────────────────────────────────────────────

function WhyChooseSection({ data }: { data: PageData["features"] }) {
  return (
    <section className="services-why-choose" aria-labelledby="services-why-choose-title">
      <div className="services-why-choose__inner">
        <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
          <p className="services-why-choose__eyebrow">{data.eyebrow}</p>
          <h2 id="services-why-choose-title">{data.title}</h2>
        </PerformanceAnimation>
        <ul className="services-why-choose__grid">
          {data.items.map((feature, i) => (
            <PerformanceAnimation
              key={`${feature.title}-${i}`}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.08}
            >
              <li className="services-why-choose__item">
                <span className="services-why-choose__icon" aria-hidden="true"><feature.icon size={30} strokeWidth={1.7} /></span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </li>
            </PerformanceAnimation>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function ServicesPageClient({ data, serviceDetails = [] }: { data?: any; serviceDetails?: any[] }) {
  const { open: openBookingModal } = useBookingModal();

  if (!data?.layout) {
    notFound();
  }

  const heroBlock = data.layout.find(
    (b: any) => b.__component === "services-overview.hero",
  );
  const cardsBlock = data.layout.find(
    (b: any) => b.__component === "services-overview.service-cards",
  );
  const featuresBlock = data.layout.find(
    (b: any) => b.__component === "services-overview.features",
  );
  const ctaBlock = data.layout.find(
    (b: any) => b.__component === "services-overview.cta",
  );

  if (!heroBlock || !featuresBlock) {
    notFound();
  }

  const activeData: PageData = {
    hero: {
      badge: heroBlock.badge || "OUR SERVICES",
      title: heroBlock.title || "Cosmetic Surgery Planned Around You",
      description: heroBlock.description || "From facial procedures to complex revision surgery, DR. MARIS AESTHETICS provides personalized, hospital-based care with direct surgeon involvement.",
      image: (() => {
        const image = heroBlock.hero_image;
        const url = image?.formats?.large?.url || image?.formats?.medium?.url || image?.url;
        return resolveMediaUrl(url);
      })(),
      videoUrl: heroBlock.secondary_cta_video_url,
    },
    servicesTitle: cardsBlock?.title || "Explore Our Services",
    services: serviceDetails.map((s: any) => ({
        slug: s.slug,
        title: s.title,
        description: s.description,
        image: (() => {
          const imgObj = s.hero_image;
          if (!imgObj) return "";
          // Prefer medium format for card thumbnails, fall back to original
          const rawUrl =
            imgObj.formats?.medium?.url || imgObj.formats?.small?.url || imgObj.url;
          if (!rawUrl) return "";
          return resolveMediaUrl(rawUrl);
        })(),
      })),
    features: {
      eyebrow: featuresBlock.eyebrow || "WHY CHOOSE DR. MARIS AESTHETICS?",
      title: featuresBlock.title || "Precise Planning. Personal Care.",
      items: (featuresBlock.features || []).map((f: any) => ({
        icon: getIconForString(f.icon),
        title: f.title,
        description: f.description,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <HeroSection data={activeData.hero} onBook={openBookingModal} />
      <ServicesGridSection data={activeData.services} title={activeData.servicesTitle} />
      <WhyChooseSection data={activeData.features} />
      <CTASection ctaData={ctaBlock} />
    </main>
  );
}
