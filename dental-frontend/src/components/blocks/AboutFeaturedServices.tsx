import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Service = {
  id: number | string
  title: string
  description?: string
  link?: string
  image?: { url: string; alt?: string }
}

type FeaturedServicesData = {
  title?: string
  services?: Service[]
}

function FeaturedServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex h-full min-h-52 overflow-hidden rounded-xl border border-smilux-border bg-white shadow-card">
      <div className="about-service-media relative w-[40%] min-w-[40%] shrink-0 bg-surface-subtle">
        {service.image?.url ? <Image src={service.image.url} alt={service.image.alt || service.title} fill sizes="(max-width: 767px) 40vw, (max-width: 1023px) 18vw, 12vw" className="object-cover" /> : <span className="sr-only">{service.title} illustration</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-size-about-card-title font-bold leading-tight text-smilux-navy">{service.title}</h3>
        <p className="home-content mt-2 text-smilux-navy/75">{service.description}</p>
        <Link href={service.link || '/services'} className="mt-auto inline-flex items-center gap-2 pt-4 text-size-small font-bold uppercase tracking-wide text-smilux-badge">
          <span>LEARN MORE</span><ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export function AboutFeaturedServices({ data }: { data?: FeaturedServicesData | null }) {
  if (!data) return null
  const services = (data.services || []).slice(0, 6)

  return (
    <section id="about-featured-services" aria-labelledby="about-featured-services-heading" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <header className="text-center">
          <h2 id="about-featured-services-heading" className="text-size-about-title font-bold leading-tight text-smilux-navy">{data.title}</h2>
          <span className="mx-auto mt-4 block h-0.5 w-12 bg-smilux-hero-primary" aria-hidden="true" />
        </header>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => <FeaturedServiceCard key={service.id} service={service} />)}
        </div>
      </div>
    </section>
  )
}
