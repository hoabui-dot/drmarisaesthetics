"use client";

export type MarketingEventName = "lead_submission_success" | "newsletter_signup" | "promotion_claim";

export function trackMarketingEvent(name: MarketingEventName, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("drmaris:marketing-event", { detail: { name, params } }));
}
