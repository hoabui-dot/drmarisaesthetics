import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { apiClient } from '@/src/lib/api/client';
import ServicesPageClient from './ServicesPageClient';
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager';
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data';

async function getServicesListingData(isDraftMode: boolean = false) {
  try {
    const response = await apiClient<any>('/api/services-overview', {
      params: {
        populate: {
          seo: { populate: '*' },
          layout: {
            on: {
              'services-overview.hero': { populate: '*' },
              'services-overview.service-cards': { populate: '*' },
              'services-overview.features': { populate: '*' },
              'services-overview.cta': {
                populate: {
                  background_image: { populate: '*' },
                }
              }
            }
          }
        }
      },
      isDraftMode,
      tags: ['services-overview'],
    });

    if (response.data) {
      return response.data;
    }
  } catch (error) {
  }

  // Return null if no data found (instead of fallback data)
  return null;
}

async function getServiceDetails(isDraftMode: boolean = false) {
  try {
    const response = await apiClient<any>('/api/service-details', {
      params: {
        pagination: { pageSize: 100 },
        sort: ['title:asc'],
        populate: { hero_image: true },
      },
      isDraftMode,
      tags: ['service-details'],
    });
    return response.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getServicesListingData();
  return buildSeoMetadata({ path: '/services', pageSeo: data?.seo, title: 'Cosmetic Surgery Services', description: 'Surgeon-led cosmetic surgery services in Ho Chi Minh City for international patients.' });
}

export default async function ServicesPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  // Fetch from Strapi to see if the page exists
  const [listingData, serviceDetails] = await Promise.all([getServicesListingData(isDraftMode), getServiceDetails(isDraftMode)]);

  // Navigate to 404 page not found UI if no data
  if (!listingData) {
    notFound();
  }

  // Render the new Premium UI using real CMS data inside the client component
  const structuredData = await resolveStructuredData({
    pageType: 'services', path: '/services', pageSeo: listingData.seo,
    title: 'Cosmetic Surgery Services', description: 'Surgeon-led cosmetic surgery services in Ho Chi Minh City for international patients.',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }],
  });
  return <><StructuredDataScript data={structuredData} /><ServicesPageClient data={listingData} serviceDetails={serviceDetails} /></>;
}

// Disable all caching for this page to guarantee instant updates from CMS
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
