import { CertificationSection } from './CertificationSection'

export default function CertificationSectionPreview() {
  return <CertificationSection data={{ blockType: 'certification', id: 1, eyebrow: 'CERTIFICATES & ACCREDITATIONS', heading: 'Certified. Recognized. Trusted.', bundles: [{ id: 1, organizationName: 'ADA', summary: 'American Dental Association' }, { id: 2, organizationName: 'ISO', summary: 'ISO 9001 Certification for Standardization' }, { id: 3, organizationName: 'ICOI', summary: 'International Congress of Oral Implantologists' }, { id: 4, organizationName: 'AAO', summary: 'American Association of Orthodontists' }] }} />
}
