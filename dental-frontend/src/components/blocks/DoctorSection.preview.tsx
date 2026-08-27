import { DoctorSection } from './DoctorSection'

export default function DoctorSectionPreview() {
  return <DoctorSection data={{ blockType: 'doctor', id: 1, title: 'Meet Our Expert Dentists', doctors: [{ id: 1, name: 'DR. ETHAN SANTOS', specialization: 'Implantology & Surgery', bio: 'Specialized in advanced dental implants and surgical procedures with a focus on precision and longevity.', badges: ['10+ years of experience in implantology and oral surgery', 'International Implant Association Member', 'Certified in Advanced Bone Augmentation'], stats: [] }, { id: 2, name: 'DR. MICHELLE JIN', specialization: 'Cosmetic Dentistry', bio: 'Expert in smile design, veneers, and aesthetic makeovers.', badges: ['Member of the American Dental Association', 'Certified in Advanced Aesthetic Restorations'], stats: [] }] }} />
}
