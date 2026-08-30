'use client'

import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

function getYouTubeEmbedUrl(source: string): string | null {
  try {
    const url = new URL(source)
    const hostname = url.hostname.replace(/^www\./, '').toLowerCase()
    let videoId = ''

    if (hostname === 'youtu.be') {
      videoId = url.pathname.slice(1)
    } else if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (url.pathname === '/watch') videoId = url.searchParams.get('v') || ''
      if (url.pathname.startsWith('/shorts/')) videoId = url.pathname.split('/')[2] || ''
      if (url.pathname.startsWith('/embed/')) videoId = url.pathname.split('/')[2] || ''
    }

    if (!/^[\w-]{11}$/.test(videoId)) return null
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
  } catch {
    return null
  }
}

export function VideoDialog({ open, source, onClose }: { open: boolean; source?: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null
  const youtubeEmbedUrl = source ? getYouTubeEmbedUrl(source) : null
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-smilux-navy-dark/85 p-3 sm:p-6 lg:p-8" role="dialog" aria-modal="true" aria-label="Video player" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="relative w-full max-w-6xl">
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Close video" className="absolute -top-11 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white focus-ring">
        <X className="h-6 w-6" aria-hidden="true" />
      </button>
      {youtubeEmbedUrl ? (
        <iframe
          className="aspect-video w-full rounded-lg bg-black"
          src={youtubeEmbedUrl}
          title="DR. MARIS AESTHETICS video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : source ? (
        <video className="aspect-video w-full rounded-lg bg-black" controls autoPlay src={source} />
      ) : (
          <p className="aspect-video rounded-lg bg-black p-8 text-center text-smilux-body">The clinical video is not configured yet.</p>
      )}
    </div>
  </div>
}
