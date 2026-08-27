import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, HeartPulse, ScanFace, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react'
import type { HomepageServicesBlock } from '@/src/types/strapi'

const serviceIcons = [HeartPulse, Sparkles, ScanFace, ShieldCheck, WandSparkles]

function ServiceCard({ service, index }: { service: HomepageServicesBlock['items'][number]; index: number }) {
  const Icon = serviceIcons[index % serviceIcons.length]
  const content = (
    <article className="service-card group relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-smilux-border bg-white p-5 shadow-card">
      <div className="service-fill pointer-events-none absolute inset-0 z-0 bg-surface-blue" aria-hidden="true" />
      <div className="relative z-20 flex items-start">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-smilux-navy">
          <Icon className="h-6 w-6 text-white" strokeWidth={2} aria-hidden="true" />
        </div>
      </div>
      {service.image?.url && <div className="absolute right-3 top-3 z-10 h-24 w-28"><Image src={service.image.url} alt={service.image.alt || service.title} fill sizes="112px" className="object-contain" /></div>}
      <div className="relative z-10 mt-5 flex flex-1 flex-col">
        <h3 className="home-services-card-title font-bold leading-tight text-smilux-navy">{service.title}</h3>
        <p className="home-content mt-3 text-smilux-navy">{service.description}</p>
        <span className="service-link mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold uppercase tracking-wide text-smilux-badge">
          <span>LEARN MORE</span><ArrowRight className="service-arrow h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </article>
  )

  return service.link ? <Link href={service.link} className="block h-full">{content}</Link> : content
}

export function ServicesBlock({ data }: { data: HomepageServicesBlock }) {
  if (!data.items?.length) return null

  return (
    <section id="home-services" aria-labelledby="home-services-heading" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-home-container px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{data.eyebrow || 'OUR DENTAL SERVICES'}</p>
            <h2 id="home-services-heading" className="home-services-title mt-3 max-w-2xl font-bold leading-tight tracking-tight text-smilux-navy">{data.title || 'Comprehensive Care For Your Perfect Smile'}</h2>
            {data.subtitle && <p className="home-content mt-3 max-w-2xl text-smilux-navy">{data.subtitle}</p>}
          </div>
          <Link href={data.viewMoreLink || '/services'} className="hidden shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wide text-smilux-badge sm:inline-flex">
            {data.viewMoreLabel || 'VIEW ALL SERVICES'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {data.items.slice(0, 5).map((service, index) => <ServiceCard key={service.id || index} service={service} index={index} />)}
        </div>
        <Link href={data.viewMoreLink || '/services'} className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-smilux-badge sm:hidden">
          {data.viewMoreLabel || 'VIEW ALL SERVICES'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
