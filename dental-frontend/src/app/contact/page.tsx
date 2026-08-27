import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import ContactPageClient from './ContactPageClient';
import { getContactPage, getContactMethods, getServiceOptions } from '@/src/lib/api/queries';
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager';
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactPage();
  return buildSeoMetadata({ path: '/contact', pageSeo: content?.seo, title: 'Contact Us - Saigon International Dental Clinic', description: 'Get in touch with Saigon International Dental Clinic. Visit our locations, call us, or send us a message.' });
}

export default async function ContactPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  const [contactData, contactMethods, serviceOptions] = await Promise.all([
    getContactPage(isDraftMode),
    getContactMethods(),
    getServiceOptions(),
  ]);

  if (!contactData || !contactData.blocks || contactData.blocks.length === 0) {
    notFound();
  }

  const structuredData = await resolveStructuredData({
    pageType: 'contact', path: '/contact', pageSeo: contactData.seo,
    title: 'Contact Us - Saigon International Dental Clinic',
    description: 'Get in touch with Saigon International Dental Clinic. Visit our locations, call us, or send us a message.',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Contact Us', path: '/contact' }],
  });
  return <><StructuredDataScript data={structuredData} /><ContactPageClient content={contactData} contactMethods={contactMethods} serviceOptions={serviceOptions} /></>;
}

// Disable all caching for this page to guarantee instant updates from CMS
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
