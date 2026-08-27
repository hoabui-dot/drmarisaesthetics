import { ServicesBlock } from './ServicesBlock'

export function ServicesBlockPreview() {
  return <ServicesBlock data={{ blockType: 'services', id: 0, eyebrow: 'OUR DENTAL SERVICES', title: 'Comprehensive Care For Your Perfect Smile', viewMoreLabel: 'VIEW ALL SERVICES', items: ['Dental Implants', 'Teeth Whitening', 'Orthodontics', 'Teeth Fillings', 'Root Canal Therapy'].map((title, id) => ({ id, title, description: 'Safe and effective care for a healthier, more confident smile.', link: '/services' })) }} />
}
