import Image from 'next/image'
import type { ReactNode } from 'react'
import type { Media } from '@/src/types/strapi'

interface HeroShellProps {
  id: string
  headingId: string
  backgroundImage?: Media | string | null
  children: ReactNode
  bottomContent?: ReactNode
}

/** Shared full-bleed hero composition used by Home and About Us. */
export function HeroShell({ id, headingId, backgroundImage, children, bottomContent }: HeroShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="relative isolate min-h-screen overflow-hidden rounded-br-hero bg-surface-subtle"
      data-parity-section="hero"
    >
      {backgroundImage && (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image src={typeof backgroundImage === 'string' ? backgroundImage : backgroundImage.url} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 bg-gradient-to-r from-white via-white/95 to-transparent" aria-hidden="true" />
      <div className="relative z-20 mx-auto flex min-h-screen max-w-home-container items-center px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-36">
        <div className="max-w-xl">{children}{bottomContent}</div>
      </div>
    </section>
  )
}
