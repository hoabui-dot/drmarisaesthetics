import {
  GraduationCap,
  HandHeart,
  Lightbulb,
  ShieldCheck,
  Trophy,
  UserRound,
} from 'lucide-react'
import Image from 'next/image'

type CoreValue = {
  title: string
  description: string
  iconImage?: string | null
}

type CoreValuesData = {
  title?: string
  values?: CoreValue[]
}

const fallbackIcons = [ShieldCheck, GraduationCap, HandHeart, Lightbulb, UserRound, Trophy]

function CoreValueCard({ value, index }: { value: CoreValue; index: number }) {
  const Icon = fallbackIcons[index % fallbackIcons.length]

  return (
    <article className="flex h-full min-h-56 flex-col items-center rounded-xl border border-smilux-border bg-white px-4 py-7 text-center shadow-card">
      <div className="flex h-12 shrink-0 items-center justify-center text-smilux-hero-primary" aria-hidden="true">
        {value.iconImage ? <Image src={value.iconImage} alt="" width={40} height={40} className="h-16 w-16 object-contain" /> : <Icon className="h-10 w-10" strokeWidth={1.7} />}
      </div>
      <h3 className="mt-5 text-size-about-card-title font-bold leading-tight text-smilux-navy">{value.title}</h3>
      <p className="home-content mt-3 max-w-[12rem] text-smilux-navy/75">{value.description}</p>
    </article>
  )
}

export function AboutCoreValuesSection({ data }: { data?: CoreValuesData | null }) {
  if (!data) return null
  const values = data.values || []
  const title = data.title || ''

  return (
    <section id="about-core-values" aria-labelledby="about-core-values-heading" className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 id="about-core-values-heading" className="text-size-about-title font-bold leading-tight text-smilux-navy">
            {title}
          </h2>
          <span className="mx-auto mt-4 block h-0.5 w-12 bg-smilux-hero-primary" aria-hidden="true" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {values.map((value, index) => <CoreValueCard key={`${value.title}-${index}`} value={value} index={index} />)}
        </div>
      </div>
    </section>
  )
}
