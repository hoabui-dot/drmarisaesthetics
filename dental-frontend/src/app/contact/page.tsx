import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager';
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data';
import { getContactPage, getWebsiteSetting } from '@/src/lib/api/queries';

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({ path: '/contact', title: 'Contact | Dr. Maris Aesthetics', description: 'Begin a private consultation with Dr. Maris Aesthetics in Ho Chi Minh City.' });
}

export default async function ContactPage() {
  const [content, websiteSetting] = await Promise.all([
    getContactPage(true),
    getWebsiteSetting(true),
  ]);
  const structuredData = await resolveStructuredData({
    pageType: 'contact', path: '/contact',
    title: 'Contact | Dr. Maris Aesthetics',
    description: 'Begin a private consultation with Dr. Maris Aesthetics in Ho Chi Minh City.',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Contact Us', path: '/contact' }],
  });
  return <><StructuredDataScript data={structuredData} /><ContactPageClient content={content} websiteSettings={{
    address: websiteSetting?.address,
    phonePrimary: websiteSetting?.phonePrimary,
    mapLatitude: websiteSetting?.mapLatitude,
    mapLongitude: websiteSetting?.mapLongitude,
    mapZoom: websiteSetting?.mapZoom,
  }} /></>;
}

// Disable all caching for this page to guarantee instant updates from CMS
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
