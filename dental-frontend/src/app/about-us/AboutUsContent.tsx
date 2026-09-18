import { PageSkeleton } from '@/src/components/LoadingSkeleton'
import { AboutHero } from '@/src/components/blocks/AboutHero'
import { AboutMissionVision } from '@/src/components/blocks/AboutMissionVision'
import { AboutCoreValuesSection } from '@/src/components/blocks/AboutCoreValuesSection'
import { AboutDoctorsSlider } from '@/src/components/blocks/AboutDoctorsSlider'
import { AboutFeaturedServices } from '@/src/components/blocks/AboutFeaturedServices'
import { AboutWhyChooseSection } from '@/src/components/blocks/AboutWhyChooseSection'
import { AboutBookingSection } from '@/src/components/blocks/AboutBookingSection'

interface AboutUsContentProps {
  content: any
  page: any
}

/**
 * About Us is ordered by CMS dynamic-zone references. Each reference maps to
 * an existing section component and keeps its editable content in Strapi.
 */
export function AboutUsContent({ content }: AboutUsContentProps) {
  if (!content || typeof content === 'string') return <PageSkeleton />

  const sections: string[] = content.sections || []
  const featuredServices = content.featuredServices
  const serviceOptions = (featuredServices?.services || []).map((service: any) => ({
    value: service.slug,
    label: service.navigationLabel || service.title,
  }))

  const renderSection = (section: string) => {
    switch (section) {
      case 'hero':
        return content.hero ? <AboutHero data={content.hero} /> : null
      case 'mission-vision':
        return <AboutMissionVision data={content.missionVision} />
      case 'core-values':
        return <AboutCoreValuesSection data={content.coreValues} />
      case 'doctors':
        return <AboutDoctorsSlider data={content.doctorsSlider} />
      case 'featured-services':
        return <AboutFeaturedServices data={featuredServices} />
      case 'why-choose':
        return <AboutWhyChooseSection data={content.whyChooseUs} />
      case 'booking':
        return <AboutBookingSection data={content.booking} serviceOptions={serviceOptions} />
      default:
        return null
    }
  }

  return (
    <div className="w-full bg-white">
      {sections.map((section, index) => {
        const rendered = renderSection(section)
        return rendered ? <div key={`${section}-${index}`}>{rendered}</div> : null
      })}
    </div>
  )
}
