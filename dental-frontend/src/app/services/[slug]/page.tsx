import type { Metadata } from "next";
import { buildSeoMetadata } from "@/src/lib/seo/seo-manager";
import { resolveStructuredData, StructuredDataScript } from "@/src/lib/seo/structured-data";
import { StitchTreatmentPage } from "@/src/components/StitchTreatmentPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return buildSeoMetadata({ path: `/services/${slug}`, title: 'Rhinoplasty Surgery in Vietnam | Dr. Maris Aesthetics', description: 'Learn about anatomy-led rhinoplasty surgery in Vietnam with Dr. Maris Aesthetics.' });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const structuredData = await resolveStructuredData({
    pageType: 'service', path: '/services/rhinoplasty', title: 'Rhinoplasty Surgery in Vietnam', description: 'Learn about anatomy-led rhinoplasty surgery in Vietnam with Dr. Maris Aesthetics.', serviceType: 'Rhinoplasty Surgery', areaServed: 'Ho Chi Minh City, Vietnam',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: 'Rhinoplasty', path: '/services/rhinoplasty' }],
  });
  return <><StructuredDataScript data={structuredData} /><StitchTreatmentPage /></>;
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
