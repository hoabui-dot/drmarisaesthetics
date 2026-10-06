"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { MarketingPublicConfig } from "@/src/lib/seo/seo-manager";

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string };
    oaiq?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

const providers = {
  google_tag_manager: (id: string) => /^GTM-[A-Z0-9]+$/i.test(id),
  google_analytics_4: (id: string) => /^G-[A-Z0-9]+$/i.test(id),
  google_ads: (id: string) => /^AW-[0-9]+$/i.test(id),
  meta_pixel: (id: string) => /^[0-9]{5,20}$/.test(id),
  openai_ads: (id: string) => /^[A-Za-z0-9_-]{8,128}$/.test(id),
  openai_ads_pixel: (id: string) => /^[A-Za-z0-9_-]{8,128}$/.test(id),
} as const;

function addScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function MarketingIntegrations({ integrations }: { integrations: MarketingPublicConfig["integrations"] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const active = integrations.filter((item) => providers[item.provider]?.(item.publicId));
    if (!active.length) return;
    const ids = (provider: string) => [...new Set(active.filter((item) => item.provider === provider).map((item) => item.publicId))];
    const gtm = ids("google_tag_manager");
    const ga4 = ids("google_analytics_4");
    const ads = ids("google_ads");
    const meta = ids("meta_pixel");
    const openai = [...ids("openai_ads"), ...ids("openai_ads_pixel")];

    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: unknown[]) => window.dataLayer!.push(args);
    (window as Window & { gtag?: typeof gtag }).gtag = gtag;
    gtm.forEach((id) => {
      window.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
      addScript(`drmaris-gtm-${id}`, `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`);
    });
    const googleIds = [...new Set([...ga4, ...ads])];
    if (googleIds.length) {
      addScript("drmaris-google-tag", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleIds[0])}`);
      gtag("js", new Date());
      googleIds.forEach((id) => gtag("config", id, ga4.includes(id) ? { send_page_view: false } : {}));
    }
    if (meta.length && !window.fbq) {
      const fbq = function (...args: unknown[]) {
        if (fbq.callMethod) fbq.callMethod(...args);
        else (fbq.queue ||= []).push(args);
      } as NonNullable<Window["fbq"]>;
      fbq.queue = [];
      fbq.loaded = true;
      fbq.version = "2.0";
      window.fbq = fbq;
      addScript("drmaris-meta-pixel-sdk", "https://connect.facebook.net/en_US/fbevents.js");
    }
    meta.forEach((id) => window.fbq?.("init", id));
    if (openai.length && !window.oaiq) {
      const oaiq = ((...args: unknown[]) => { (oaiq.q ||= []).push(args); }) as NonNullable<Window["oaiq"]>;
      window.oaiq = oaiq;
      addScript("drmaris-openai-pixel-sdk", "https://bzrcdn.openai.com/sdk/oaiq.min.js");
    }
    [...new Set(openai)].forEach((pixelId) => window.oaiq?.("init", { pixelId }));
  }, [integrations]);

  useEffect(() => {
    const pagePath = `${pathname}${query ? `?${query}` : ""}`;
    const active = integrations.filter((item) => providers[item.provider]?.(item.publicId));
    const googleIds = [...new Set(active.filter((item) => item.provider === "google_analytics_4" || item.provider === "google_ads").map((item) => item.publicId))];
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    googleIds.forEach((id) => gtag?.("event", "page_view", { send_to: id, page_path: pagePath, page_title: document.title }));
    active.filter((item) => item.provider === "meta_pixel").forEach(() => window.fbq?.("track", "PageView"));
    const onMarketingEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ name: string; params?: Record<string, unknown> }>).detail;
      if (!detail?.name) return;
      const eventName = detail.name === "lead_submission_success" ? "generate_lead" : detail.name;
      googleIds.forEach((id) => gtag?.("event", eventName, { ...detail.params, send_to: id }));
      active.filter((item) => item.provider === "meta_pixel").forEach(() => window.fbq?.("track", detail.name === "lead_submission_success" ? "Lead" : "CompleteRegistration", detail.params));
      if (detail.name === "lead_submission_success") window.dataLayer?.push({ event: "lead_submission_success", ...detail.params });
      if (detail.name === "lead_submission_success") window.oaiq?.("measure", "lead_created");
    };
    window.addEventListener("drmaris:marketing-event", onMarketingEvent);
    return () => window.removeEventListener("drmaris:marketing-event", onMarketingEvent);
  }, [integrations, pathname, query]);

  return null;
}
