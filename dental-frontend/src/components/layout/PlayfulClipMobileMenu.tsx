'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from 'motion/react'
import type { Navigation, NavItem } from '@/src/types/strapi'
import { HEADER_CTA } from '@/src/lib/constants/site-navigation'

type PlayfulClipMobileMenuProps = {
  open: boolean
  navigation: Navigation
  onClose: () => void
  onBook: () => void
}

function MenuLink({ href, label, open, onClose, child = false, clickable = true, onToggle }: { href: string; label: string; open: boolean; onClose: () => void; child?: boolean; clickable?: boolean; onToggle?: () => void }) {
  if (!clickable) return <button type="button" onClick={onToggle} className="playful-clip-menu__link"><span>{label}</span></button>
  return <Link href={href} tabIndex={open ? 0 : -1} onClick={onClose} className={child ? 'playful-clip-menu__child-link' : 'playful-clip-menu__link'}>
    <span>{label}</span><ArrowUpRight aria-hidden="true" />
  </Link>
}

function MenuGroup({ item, open, onClose }: { item: NavItem; open: boolean; onClose: () => void }) {
  const hasChildren = Boolean(item.children?.length)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!open) setExpanded(false)
  }, [open])

  if (!hasChildren) return <MenuLink href={item.href} label={item.label} open={open} onClose={onClose} />

  return <div className="playful-clip-menu__group">
    <div className="playful-clip-menu__group-heading">
      <MenuLink href={item.href} label={item.label} open={open} onClose={onClose} clickable={item.isClickable !== false} onToggle={() => setExpanded((value) => !value)} />
      <button type="button" className="playful-clip-menu__group-toggle" aria-label={`${expanded ? 'Collapse' : 'Expand'} ${item.label} menu`} aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
        <ChevronDown aria-hidden="true" />
      </button>
    </div>
    <div className={`playful-clip-menu__children${expanded ? ' is-expanded' : ''}`} aria-hidden={!expanded}>
      {item.children?.map((child) => <MenuLink key={child.id} href={child.href} label={child.label} open={open && expanded} onClose={onClose} child />)}
    </div>
  </div>
}

export function PlayfulClipMobileMenu({ open, navigation, onClose, onBook }: PlayfulClipMobileMenuProps) {
  const rootRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const reduceMotion = useReducedMotion()

  useGSAP(() => {
    if (!panelRef.current) return
    const panel = panelRef.current
    const links = panel.querySelectorAll<HTMLElement>('[data-clip-menu-item]')
    const eyebrow = panel.querySelector<HTMLElement>('[data-clip-menu-eyebrow]')
    const footer = panel.querySelector<HTMLElement>('[data-clip-menu-footer]')
    timelineRef.current?.kill()

    if (reduceMotion) {
      gsap.set(panel, { autoAlpha: open ? 1 : 0, clipPath: open ? 'circle(150% at calc(100% - 2rem) 2rem)' : 'circle(0% at calc(100% - 2rem) 2rem)', pointerEvents: open ? 'auto' : 'none' })
      gsap.set([eyebrow, ...Array.from(links), footer].filter(Boolean), { clearProps: 'transform,opacity' })
      return
    }

    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
    if (open) {
      timeline.set(panel, { autoAlpha: 1, pointerEvents: 'auto' })
        .to(panel, { clipPath: 'circle(150% at calc(100% - 2rem) 2rem)', duration: .72, ease: 'power3.inOut' })
        .fromTo(eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .25 }, '-=.28')
        .fromTo(links, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .42, stagger: .045 }, '-=.12')
        .fromTo(footer, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .3 }, '-=.18')
    } else {
      timeline.to([footer, ...Array.from(links), eyebrow].filter(Boolean), { opacity: 0, y: -8, duration: .16, stagger: .012, ease: 'power2.in' })
        .to(panel, { clipPath: 'circle(0% at calc(100% - 2rem) 2rem)', duration: .42, ease: 'power3.in' }, '-=.04')
        .set(panel, { autoAlpha: 0, pointerEvents: 'none' })
    }
    timeline.play()
    timelineRef.current = timeline

    return () => timeline.kill()
  }, { scope: rootRef, dependencies: [open, reduceMotion] })

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown) }
  }, [open, onClose])

  return <nav ref={rootRef} className="playful-clip-menu" aria-label="Mobile primary navigation" aria-hidden={!open}>
    <div ref={panelRef} className="playful-clip-menu__panel">
      <div className="playful-clip-menu__inner">
        <div className="playful-clip-menu__eyebrow" data-clip-menu-eyebrow>DR. MARIS AESTHETICS <span>·</span> PRIVATE SURGICAL CARE</div>
        <div className="playful-clip-menu__list">
          {navigation.navigation.map((item) => <div key={item.id} data-clip-menu-item><MenuGroup item={item} open={open} onClose={onClose} /></div>)}
        </div>
        <div ref={footer => { if (footer) footer.dataset.clipMenuFooter = 'true' }} data-clip-menu-footer className="playful-clip-menu__footer">
          <button type="button" tabIndex={open ? 0 : -1} onClick={() => { onBook(); onClose() }} className="booking-inline-cta playful-clip-menu__cta">{HEADER_CTA.label}<ArrowUpRight aria-hidden="true" /></button>
          <span>Ho Chi Minh City · Vietnam</span>
        </div>
      </div>
    </div>
  </nav>
}
