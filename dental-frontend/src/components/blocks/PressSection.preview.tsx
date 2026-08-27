import { PressSection } from './PressSection'

export default function PressSectionPreview() {
  return <PressSection data={{
    blockType: 'press-section', id: 1, eyebrow: 'AS FEATURED IN', heading: 'Smilux Dental In The Press',
    logos: [1, 2, 3, 4, 5, 6].map((id) => ({ url: '', alt: `Publication logo ${id}`, width: 180, height: 64 })),
  }} />
}
