import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { buildSeoMetadata } from "@/src/lib/seo/seo-manager";
import { resolveStructuredData, StructuredDataScript } from "@/src/lib/seo/structured-data";
import { ServicePage } from '@/src/components/services/ServicePage';
import { SERVICE_DETAILS, SERVICE_DETAIL_SLUGS } from '@/src/data/service-details';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_DETAILS[slug];
  if (!service) return { title: 'Service not found' };
  return buildSeoMetadata({ path: `/services/${slug}`, title: `${service.title} | Dr. Maris Aesthetics`, description: service.description });
}

export function generateStaticParams() {
  return SERVICE_DETAIL_SLUGS.map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICE_DETAILS[slug];
  if (!service) notFound();
  const structuredData = await resolveStructuredData({
    pageType: 'service', path: `/services/${slug}`, title: service.title, description: service.description, serviceType: service.title, areaServed: 'Ho Chi Minh City, Vietnam',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: service.title, path: `/services/${slug}` }],
  });
  return <><StructuredDataScript data={structuredData} /><ServicePage data={service} /></>;
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
