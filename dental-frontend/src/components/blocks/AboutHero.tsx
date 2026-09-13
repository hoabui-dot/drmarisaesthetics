import Image from 'next/image'
import Link from 'next/link'
import { Award, Heart, Users } from 'lucide-react'

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
  subtitle?: string
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
  const stats = (data.statistics || []).slice(0, 3)
  const editorialLead = data.subtitle || '“Cosmetic surgery should begin with a medical assessment, a clear surgical plan and confidence in the surgeon responsible for your care.”'

  if (!data.supportingParagraph) return null

  return (
    <section id="about-hero" aria-labelledby="about-hero-heading" className="about-editorial-hero">
      <div className="about-editorial-hero__inner">
        <div className="about-editorial-hero__grid">
          <div className="about-editorial-hero__copy">
            <p className="about-editorial-hero__eyebrow">{data.eyebrow || 'SURGEON-LED COSMETIC SURGERY · HO CHI MINH CITY'}</p>
            <h2 id="about-hero-heading">About&nbsp;Us</h2>
            <div className="about-editorial-hero__body">
              <p className="about-editorial-hero__lead">{editorialLead}</p>
              <p>{data.supportingParagraph}</p>
              <p>Dr. Maris is directly involved from consultation and examination through surgery and postoperative follow-up, while surgical procedures are performed at City International Hospital (CIH).</p>
            </div>
            <div className="about-editorial-hero__actions">
              <Link href="/our-team" className="about-editorial-hero__button about-editorial-hero__button--primary">Meet Dr. Maris</Link>
              <Link href="/contact" className="about-editorial-hero__button about-editorial-hero__button--secondary">Request an Online Consultation</Link>
            </div>
          </div>
          <div className="about-editorial-hero__media">
            {data.backgroundImage && <Image src={data.backgroundImage} alt="Dr. Maris, Lead Plastic Surgeon at DR. MARIS AESTHETICS" fill priority sizes="(max-width: 1023px) 100vw, 42vw" className="object-cover" />}
          </div>
        </div>
        {stats.length > 0 && <div className="about-editorial-hero__stats" aria-label="DR. MARIS AESTHETICS statistics">
          {stats.map((stat, index) => <AboutHeroStatItem key={`${stat.label}-${index}`} stat={stat} />)}
        </div>}
      </div>
    </section>
  )
}
