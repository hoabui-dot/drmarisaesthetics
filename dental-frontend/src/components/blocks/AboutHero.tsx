import Image from 'next/image'
import { Award, ChevronRight, Heart, Users } from 'lucide-react'
import { HeroShell } from './HeroShell'
import { NavigationLink } from '@/src/components/ui/NavigationLink'

type AboutHeroStat = {
  value: string
  label: string
  icon?: string
  iconImage?: string | null
}

type AboutHeroData = {
  eyebrow: string
  headingPrimary: string
  headingSecondaryLine1: string
  headingSecondaryLine2: string
  supportingParagraph: string
  backgroundImage?: string | null
  statistics?: AboutHeroStat[]
}

const statIcons = { Users, Award, Heart }

function AboutHeroStatItem({ stat }: { stat: AboutHeroStat }) {
  const Icon = statIcons[stat.icon as keyof typeof statIcons] || Heart

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-4 text-center sm:px-8 lg:px-12 lg:items-start lg:text-left">
      <div className="mb-3 flex h-8 items-center justify-center text-smilux-hero-primary" aria-hidden="true">
        {stat.iconImage ? <Image src={stat.iconImage} alt="" width={30} height={30} className="h-7 w-7 object-contain" /> : <Icon className="h-7 w-7" strokeWidth={1.8} />}
      </div>
      <p className="about-hero-stat-value font-bold leading-none text-smilux-navy">{stat.value}</p>
      <p className="mt-2 max-w-[9rem] text-size-small leading-5 text-smilux-navy/80">{stat.label}</p>
    </div>
  )
}

export function AboutHero({ data }: { data: AboutHeroData }) {
  const heading = [data.headingPrimary, data.headingSecondaryLine1, data.headingSecondaryLine2]
  const stats = (data.statistics || []).slice(0, 3)

  if (!data.eyebrow || !heading.every(Boolean) || !data.supportingParagraph) return null

  return (
    <HeroShell id="about-hero" headingId="about-hero-heading" backgroundImage={data.backgroundImage}>
      <nav className="about-hero-breadcrumb" aria-label="Breadcrumb">
        <NavigationLink href="/" className="about-hero-breadcrumb-link">Home</NavigationLink>
        <ChevronRight aria-hidden="true" />
        <span aria-current="page">About Us</span>
      </nav>
      <p className="mb-5 text-size-label font-bold uppercase tracking-[0.16em] text-smilux-hero-primary">{data.eyebrow}</p>
      <h1 id="about-hero-heading" className="max-w-2xl leading-[1.05] tracking-tight text-smilux-navy">
        <span className="about-hero-title-primary block font-bold">{heading[0]}</span>
        <span className="about-hero-title-secondary block font-medium">{heading[1]}</span>
        <span className="about-hero-title-secondary block font-medium">{heading[2]}</span>
      </h1>
      <p className="home-content mt-6 max-w-lg text-smilux-navy">
        {data.supportingParagraph}
      </p>
    <div className="mt-10 grid w-full max-w-2xl grid-cols-3 divide-x divide-smilux-border" aria-label="DR. MARIS AESTHETICS statistics">
        {stats.map((stat, index) => <AboutHeroStatItem key={`${stat.label}-${index}`} stat={stat} />)}
      </div>
    </HeroShell>
  )
}
