import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { HomepageProofShowcaseBlock, Media } from '@/src/types/strapi'

function ImageCard({ image, className = '', sizes }: { image?: Media; className?: string; sizes: string }) {
  if (!image?.url) return <div className={`bg-surface-blue ${className}`} aria-hidden="true" />
  return <div className={`relative overflow-hidden ${className}`}><Image src={image.url} alt={image.alt || ''} fill sizes={sizes} className="object-cover" /></div>
}

export function HomeProofSection({ data }: { data: HomepageProofShowcaseBlock }) {
  const benefits = data.benefits?.length ? data.benefits : [
    { id: 1, label: 'Experienced & Certified Surgical Team' },
    { id: 2, label: 'State-of-the-Art Technology & Equipment' },
    { id: 3, label: 'Painless & Patient-Friendly Procedures' },
    { id: 4, label: 'Personalized Treatment Plans' },
  ]

  return (
    <section id="home-about" aria-labelledby="home-about-heading" className="bg-white py-16 text-smilux-navy sm:py-20 lg:py-28">
      <div className="mx-auto grid max-w-home-container gap-10 px-4 sm:px-6 lg:grid-cols-[.36fr_.64fr] lg:items-start lg:gap-12 lg:px-8">
        <div className="pt-1">
          <p className="eyebrow text-smilux-navy">{data.eyebrow || 'ABOUT DR. MARIS AESTHETICS'}</p>
          <h2 id="home-about-heading" className="home-about-title mt-4 font-bold leading-tight tracking-tight text-smilux-navy">
            <span className="block">{data.headingLine1 || 'Trusted Care.'}</span>
            <span className="block">{data.headingLine2 || 'Lasting Smiles.'}</span>
          </h2>
          <div className="mt-5 h-1 w-12 rounded-full bg-smilux-primary" aria-hidden="true" />
          <p className="home-content mt-6 max-w-lg text-smilux-navy">{data.description}</p>
          <ul className="mt-7 space-y-3" aria-label="DR. MARIS AESTHETICS benefits">
            {benefits.slice(0, 4).map((benefit) => <li key={benefit.id} className="home-content flex items-center gap-3 text-smilux-navy"><CheckCircle2 className="h-5 w-5 shrink-0 text-smilux-primary" aria-hidden="true" /><span>{benefit.label}</span></li>)}
          </ul>
          <Link href={data.ctaLink || '/about-us'} className="mt-8 inline-flex items-center gap-3 rounded-md bg-smilux-primary px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-smilux-primary-hover focus-ring">
            {data.ctaLabel || 'LEARN MORE ABOUT US'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-[1.1fr_1fr] gap-3 sm:gap-4">
          <div className="grid gap-3 sm:gap-4">
            <ImageCard image={data.primaryTeamImage || data.primaryImage} className="aspect-[1.35] rounded-xl" sizes="(max-width: 1024px) 50vw, 34vw" />
            <div className="grid aspect-[1.35] grid-cols-2 overflow-hidden rounded-xl bg-surface-blue">
              <ImageCard image={data.patientStatImage || data.secondaryImage} className="min-h-full" sizes="(max-width: 1024px) 25vw, 17vw" />
              <div className="flex flex-col justify-center px-4 py-5 sm:px-7"><strong className="home-about-stat-value font-bold leading-none text-smilux-navy">{data.patientStatValue || '10,000+'}</strong><span className="home-content mt-2 font-semibold text-smilux-navy">{data.patientStatLabel || 'Happy Patients'}</span></div>
            </div>
          </div>
          <div className="grid gap-3 sm:gap-4">
            <div className="flex min-h-24 items-center justify-center rounded-xl bg-surface-blue px-4 py-4 text-center sm:min-h-28"><div><strong className="home-about-stat-value block font-bold leading-none text-smilux-navy">{data.experienceValue || '15+'}</strong><span className="home-content mt-2 block font-semibold text-smilux-navy">{data.experienceLabel || 'Years of Experience'}</span></div></div>
            <ImageCard image={data.technologyImage} className="aspect-[1.38] rounded-xl" sizes="(max-width: 1024px) 45vw, 28vw" />
            <ImageCard image={data.patientStoryImage} className="aspect-[1.38] rounded-xl" sizes="(max-width: 1024px) 45vw, 28vw" />
          </div>
        </div>
      </div>
    </section>
  )
}
