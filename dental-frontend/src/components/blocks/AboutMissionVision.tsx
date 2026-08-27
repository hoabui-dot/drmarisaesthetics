import Image from 'next/image'
import { Eye, Target } from 'lucide-react'

type MissionVisionData = {
  backgroundImage?: string | null
  missionIcon?: string | null
  visionIcon?: string | null
  missionTitle: string
  missionDescription: string
  visionTitle: string
  visionDescription: string
}

function MissionVisionItem({ title, description, kind, iconImage }: { title: string; description: string; kind: 'mission' | 'vision'; iconImage?: string | null }) {
  const Icon = kind === 'mission' ? Target : Eye
  return (
    <div className="relative z-10 flex items-start gap-5 px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-smilux-hero-primary text-white shadow-sm sm:h-16 sm:w-16">
        {iconImage ? <Image src={iconImage} alt="" width={32} height={32} className="h-7 w-7 object-contain brightness-0 invert sm:h-8 sm:w-8" /> : <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.8} aria-hidden="true" />}
      </div>
      <div>
        <h2 className="text-size-about-subtitle font-bold leading-tight text-smilux-navy">{title}</h2>
        <p className="home-content mt-3 max-w-xl text-smilux-navy/80">{description}</p>
      </div>
    </div>
  )
}

export function AboutMissionVision({ data }: { data?: MissionVisionData | null }) {
  if (!data) return null
  const content = data
  return (
    <section id="about-mission-vision" aria-labelledby="about-mission-vision-heading" className="bg-white px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <h2 id="about-mission-vision-heading" className="sr-only">Mission and Vision</h2>
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-smilux-border bg-white">
        {content.backgroundImage && (
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image src={content.backgroundImage} alt="" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover object-right" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/35" />
          </div>
        )}
        <div className="relative grid md:grid-cols-2">
          <div className="border-b border-smilux-border md:border-b-0 md:border-r">
            <MissionVisionItem kind="mission" title={content.missionTitle} description={content.missionDescription} iconImage={content.missionIcon} />
          </div>
          <div>
            <MissionVisionItem kind="vision" title={content.visionTitle} description={content.visionDescription} iconImage={content.visionIcon} />
          </div>
        </div>
      </div>
    </section>
  )
}
