import { TestimonialsSection } from './TestimonialsSection'

export default function TestimonialsSectionPreview() {
  return <TestimonialsSection data={{
    blockType: 'testimonials-section', id: 1, eyebrow: 'PATIENTS LOVE SMILUX', heading: 'What Our Patients Say',
    sectionImage: { url: '', alt: 'Smiling patient', width: 1200, height: 630 },
    testimonials: [
      ['Jennifer L.', 'Vietnam', "The doctors and staff are very professional and caring. I'm so happy with my new smile!"],
      ['David M.', 'Australia', 'The clinic is modern, clean and very comfortable. Highly recommended!'],
      ['Sophie K.', 'Korea', 'I had my implant done here and the result is beyond my expectations.'],
    ].map(([patientName, patientLocation, quote], index) => ({ id: index + 1, rating: 5, patientName, patientLocation, quote, patientAvatar: { url: '', alt: patientName, width: 48, height: 48 } })),
  }} />
}
