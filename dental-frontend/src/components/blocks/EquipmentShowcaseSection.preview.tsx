import { EquipmentShowcaseSection } from './EquipmentShowcaseSection'

export default function EquipmentShowcaseSectionPreview() {
  return (
    <EquipmentShowcaseSection
      data={{
        blockType: 'equipment-showcase',
        id: 1,
        title: 'Advanced Technology for Better Care',
        items: [
          { id: 1, title: '3D Cone Beam CT', description: 'Accurate 3D imaging for precise diagnosis' },
          { id: 2, title: 'Intraoral Scanner', description: 'Digital impressions for better comfort' },
          { id: 3, title: 'CAD/CAM Technology', description: 'Precision smile design and restorations' },
          { id: 4, title: 'Laser Dental Care', description: 'Treatments with advanced laser technology' },
        ],
      }}
    />
  )
}
