import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { apiClient } from "@/src/lib/api/client";
import ServiceDetailPageClient from "../ServiceDetailPageClient";
import { buildSeoMetadata } from "@/src/lib/seo/seo-manager";
import { resolveStructuredData, StructuredDataScript } from "@/src/lib/seo/structured-data";

async function getServiceDetail(slug: string, isDraftMode: boolean = false) {
  try {
    const response = await apiClient<any>("/api/service-details", {
      params: {
        filters: { slug: { $eq: slug } },
        populate: {
          hero_image: true,
          seo: { populate: "*" },
          trust_avatars: true,
          sections: {
            on: {
              "service-detail.overview": { populate: "*" },
              "service-detail.benefits": { populate: "*" },
              "service-detail.candidates": { populate: "*" },
              "service-detail.structure": { populate: "*" },
              "service-detail.technology": { populate: "*" },
              "service-detail.procedure": { populate: "*" },
              "service-detail.specialists": { populate: { doctors: { populate: "*" } } },
              "service-detail.patient-results": { populate: { patients: { populate: "*" } } },
              "service-detail.pricing": { populate: "*" },
              "service-detail.faq": { populate: "*" },
              "service-detail.consultation": { populate: "*" },
            },
          },
        }
      },
      tags: [`service-detail-${slug}`],
      isDraftMode,
    });
    return response.data?.[0] || null;
  } catch { return null; }
}

async function getServiceList(isDraftMode: boolean = false) {
  try {
    const response = await apiClient<any>("/api/service-details", {
      params: {
        pagination: { pageSize: 100 },
        sort: ["title:asc"],
        populate: { hero_image: true },
      },
      tags: ["service-details"],
      isDraftMode,
    });
    return response.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getServiceDetail(slug);
  return data
    ? buildSeoMetadata({ path: `/services/${slug}`, pageSeo: data.seo, title: data.title, description: data.description, image: data.hero_image })
    : { title: "Dental Service | Smilux Dental" };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const [data, serviceList] = await Promise.all([getServiceDetail(slug, isDraftMode), getServiceList(isDraftMode)]);
  if (!data) notFound();
  const faqSection = data.sections?.find((section: any) => section.__component === "service-detail.faq");
  const rawFaqs = faqSection?.items || faqSection?.faqs || faqSection?.questions || [];
  const faqItems = Array.isArray(rawFaqs) ? rawFaqs.map((item: any) => ({ question: item.question || item.title, answer: item.answer || item.description })).filter((item: any) => item.question && item.answer) : [];
  const structuredData = await resolveStructuredData({
    pageType: 'service', path: `/services/${slug}`, pageSeo: data.seo, title: data.title, description: data.description,
    image: data.hero_image, serviceType: data.title, areaServed: 'Ho Chi Minh City, Vietnam', faqItems,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: data.breadcrumb_label || data.title, path: `/services/${slug}` }],
  });
  return <><StructuredDataScript data={structuredData} /><ServiceDetailPageClient data={{ ...data, serviceList }} /></>;
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
