import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager';
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data';
import { getContactMethods, getContactPage, getWebsiteSetting } from '@/src/lib/api/queries';

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({ path: '/contact', title: 'Contact | Dr. Maris Aesthetics', description: 'Begin a private consultation with Dr. Maris Aesthetics in Ho Chi Minh City.' });
}

export default async function ContactPage() {
  const [contactMethods, content, websiteSetting] = await Promise.all([
    getContactMethods(true),
    getContactPage(true),
    getWebsiteSetting(true),
  ]);
  const structuredData = await resolveStructuredData({
    pageType: 'contact', path: '/contact',
    title: 'Contact | Dr. Maris Aesthetics',
    description: 'Begin a private consultation with Dr. Maris Aesthetics in Ho Chi Minh City.',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Contact Us', path: '/contact' }],
  });
  const settingsMethods = websiteSetting?.contactMethods?.map((method) => ({
    id: method.id || 0,
    type: method.type,
    label: method.label,
    href: method.href,
    order: method.order || 0,
    isActive: method.isActive !== false,
  })) || [];
  return <><StructuredDataScript data={structuredData} /><ContactPageClient contactMethods={settingsMethods.length ? settingsMethods : contactMethods} content={content} /></>;
}

// Disable all caching for this page to guarantee instant updates from CMS
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
