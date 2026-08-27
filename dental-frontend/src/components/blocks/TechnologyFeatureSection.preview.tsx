import { TechnologyFeatureSection } from './TechnologyFeatureSection'

export function TechnologyFeatureSectionPreview() {
  return <TechnologyFeatureSection data={{ blockType: 'technology-feature', id: 0, eyebrow: 'SMILUX ADVANCED TECHNOLOGY', title: 'Technology', headingLine1: 'Technology That', headingLine2: 'Powers Precision', headingAccent: 'Smiles', description: 'Advanced technology supports safer, more accurate and more comfortable treatment.', features: ['3D Imaging', 'Guided Implant', 'Digital Scan', 'Laser Support', 'Comfort Care', 'Smart Appointment'].map((title, id) => ({ id, title })), technologies: [1, 2, 3, 4, 5].map((index) => ({ id: index, index, title: 'OTI® Guided Implant Technology', description: 'A screw-guided implant technique designed for precise placement and stable long-term results.' })) }} />
}
