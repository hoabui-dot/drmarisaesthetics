import {
  Armchair,
  ClipboardCheck,
  Globe,
  MessageCircle,
  Monitor,
  Users,
} from 'lucide-react'
import Image from 'next/image'

type Benefit = {
  title: string
  description: string
  iconImage?: string | null
}

type Statistic = { value: string; label: string }
type Accreditation = { shortName: string; description: string; logo?: string | null }

export type AboutWhyChooseData = {
  title?: string
  features?: Benefit[]
  toothImage?: string | null
  statistics?: Statistic[]
  accreditations?: Accreditation[]
}

const fallbackIcons = [Users, Monitor, ClipboardCheck, MessageCircle, Globe, Armchair]

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const Icon = fallbackIcons[index % fallbackIcons.length]
  return (
    <article className="flex h-full min-h-56 flex-col items-center rounded-xl border border-smilux-border bg-white px-4 py-7 text-center shadow-card">
      <div className="flex h-12 shrink-0 items-center justify-center text-smilux-hero-primary" aria-hidden="true">
        {benefit.iconImage ? <Image src={benefit.iconImage} alt="" width={40} height={40} className="h-10 w-10 object-contain" /> : <Icon className="h-10 w-10" strokeWidth={1.7} />}
      </div>
      <h3 className="mt-5 flex min-h-[3rem] items-start justify-center text-size-about-card-title font-bold leading-tight text-smilux-navy">{benefit.title}</h3>
      <p className="home-content mt-3 max-w-[12rem] text-smilux-navy/75">{benefit.description}</p>
    </article>
  )
}

function TrustBanner({ toothImage, statistics, accreditations }: { toothImage?: string | null; statistics: Statistic[]; accreditations: Accreditation[] }) {
  return (
    <div className="about-why-trust-banner">
      <div className="about-why-statistics">
        <div className="about-why-statistic about-why-statistic--tooth">
          {toothImage ? <Image src={toothImage} alt="" width={64} height={80} className="h-16 w-14 object-contain" /> : (
            <svg viewBox="0 0 64 80" role="presentation">
              <path d="M16 9c5-5 10-4 16-1 6-3 11-4 16 1 8 7 6 19 2 28-3 7-5 17-8 25-2 5-7 5-10 0l-4-10-4 10c-3 5-8 5-10 0-3-8-5-18-8-25C10 28 8 16 16 9Z" />
            </svg>
          )}
        </div>
        {statistics.slice(0, 3).map((stat, index) => (
          <div key={`${stat.label}-${index}`} className="about-why-statistic">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
      <div className="about-why-accreditations">
        {accreditations.slice(0, 4).map((accreditation, index) => (
          <div key={`${accreditation.shortName}-${index}`} className="about-why-accreditation">
            {accreditation.logo ? <img src={accreditation.logo} alt="" aria-hidden="true" /> : <strong>{accreditation.shortName}</strong>}
            <span>{accreditation.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AboutWhyChooseSection({ data }: { data?: AboutWhyChooseData | null }) {
  if (!data) return null
  const benefits = data.features || []
  const statistics = data.statistics || []
  const accreditations = data.accreditations || []

  return (
    <section id="about-why-choose" aria-labelledby="about-why-choose-heading" className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <h2 id="about-why-choose-heading" className="text-size-about-title font-bold leading-tight text-smilux-navy">{data.title}</h2>
          <span className="mx-auto mt-4 block h-0.5 w-12 bg-smilux-hero-primary" aria-hidden="true" />
        </header>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {benefits.map((benefit, index) => <BenefitCard key={`${benefit.title}-${index}`} benefit={benefit} index={index} />)}
        </div>
        <div className="mt-10">
          <TrustBanner toothImage={data.toothImage} statistics={statistics} accreditations={accreditations} />
        </div>
      </div>
    </section>
  )
}
