'use client'

import Image from 'next/image'
import { CalendarDays, Play, Star } from 'lucide-react'
import { useState } from 'react'
import type { HomepageHeroBlock, Media } from '@/src/types/strapi'
import { HeroShell } from './HeroShell'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'
import { VideoDialog } from '@/src/components/ui/VideoDialog'

function AppointmentButton({ label, compact = false }: { label: string; compact?: boolean }) {
  const { open } = useBookingModal()
  return (
    <button type="button" onClick={open} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-hero-button px-6 font-semibold text-white transition-opacity hover:opacity-90 focus-ring ${compact ? 'min-h-10 px-5 text-xs tracking-wide' : ''}`}>
      <CalendarDays className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  )
}

function Avatar({ avatar, index }: { avatar: Media; index: number }) {
  return <Image src={avatar.url} alt="" width={40} height={40} className={`h-10 w-10 rounded-full border-2 border-white object-cover ${index > 0 ? '-ml-3' : ''}`} />
}

export function HeroBlock({ data }: { data: HomepageHeroBlock }) {
  const [videoOpen, setVideoOpen] = useState(false)
  const rating = data.trustRating ?? Number.parseFloat(data.trustValue || '0')
  const headingLine1 = data.headingLine1 || `${data.heading.split(',')[0]},`
  const headingLine2 = data.headingLine2 || data.heading.split(',').slice(1).join(',').trim()
  const avatars = (data.userAvatars || []).slice(0, 4)

  return <>
    <HeroShell id="home-hero" headingId="home-hero-heading" backgroundImage={data.backgroundImage || data.image}>
        <div className="max-w-md">
          <p className="home-hero-eyebrow mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-smilux-hero-primary"><span aria-hidden="true" />{data.eyebrow}</p>
          <h2 id="home-hero-heading" className="home-hero-title max-w-xl font-bold leading-[1.04] tracking-tight text-smilux-navy"><span className="block">{headingLine1}</span><span className="block text-smilux-hero-accent">{headingLine2}</span></h2>
          <p className="home-content mt-6 max-w-lg text-smilux-navy">{data.subheading}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <AppointmentButton label={data.ctaLabel || 'BOOK APPOINTMENT'} />
            <button type="button" onClick={() => setVideoOpen(true)} className="home-hero-video-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-smilux-hero-primary bg-white/80 px-5 font-semibold text-smilux-hero-primary transition-colors hover:bg-smilux-primary-soft focus-ring">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-current"><Play className="h-3 w-3 fill-current" aria-hidden="true" /></span>
              {data.secondaryCtaLabel || 'WATCH VIDEO'}
            </button>
          </div>
          <div className="home-hero-trust mt-8 flex items-center gap-4" aria-label={`${data.trustLabel || 'Trusted by 10,000+ Patients'}, rating ${rating} out of 5`}>
            <div className="flex items-center" aria-hidden="true">{avatars.map((avatar, index) => <Avatar key={`${avatar.url}-${index}`} avatar={avatar} index={index} />)}</div>
            <div className="home-content text-smilux-navy"><p>{data.trustLabel || 'Trusted by 10,000+ Patients'}</p><div className="mt-1 flex items-center gap-2"><span className="flex text-smilux-hero-primary" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="h-3 w-3 fill-current" />)}</span><strong className="font-semibold text-smilux-hero-primary">{data.trustValue || '4.9/5'}</strong></div></div>
          </div>
        </div>
    </HeroShell>
    <VideoDialog open={videoOpen} source={data.secondaryCtaVideoUrl} onClose={() => setVideoOpen(false)} />
  </>
}
