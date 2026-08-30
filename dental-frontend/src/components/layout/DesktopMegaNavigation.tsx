'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import type { NavItem } from '@/src/types/strapi'

type DesktopMegaNavigationProps = {
  items: NavItem[]
  activeSection?: string
  onNavigate?: (href: string) => void
}

const indicatorTransition = { type: 'spring' as const, stiffness: 500, damping: 38, mass: 0.7 }

export function DesktopMegaNavigation({ items, activeSection, onNavigate }: DesktopMegaNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const regionRef = useRef<HTMLElement>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const motionTransition = reduceMotion ? { duration: 0 } : indicatorTransition
  const activeItem = items.find((item) => String(item.id) === activeMenu)

  const clearCloseTimer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120)
  }

  const openMenu = (item: NavItem) => {
    clearCloseTimer()
    setActiveMenu(String(item.id))
    router.prefetch(item.href)
    item.children?.forEach((child) => router.prefetch(child.href))
  }

  const closeMenu = (restoreFocus = false) => {
    clearCloseTimer()
    const current = activeMenu
    setActiveMenu(null)
    if (restoreFocus && current) triggerRefs.current[current]?.focus()
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeMenu) {
        event.preventDefault()
        closeMenu(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearCloseTimer()
    }
  })

  const isCurrent = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <LayoutGroup id="desktop-global-mega-navigation">
      <nav ref={regionRef} className="relative flex items-center gap-1" aria-label="Primary navigation" onMouseLeave={scheduleClose} onFocusCapture={clearCloseTimer} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleClose() }}>
        {items.map((item) => {
          const key = String(item.id)
          const hasChildren = Boolean(item.children?.length)
          const active = activeMenu === key || (!activeMenu && (activeSection === item.href.replace('#', '') || isCurrent(item.href)))

          if (!hasChildren) {
            const directLinkClass = `relative flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition-colors ${active ? 'text-primary-600' : 'text-foreground-secondary hover:text-primary-600'} ${active ? '' : 'after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[var(--smilux-primary)] after:transition-transform after:duration-200 hover:after:scale-x-100'}`

            return <Link key={item.id} href={item.href} onClick={() => onNavigate?.(item.href)} onMouseEnter={() => router.prefetch(item.href)} className={directLinkClass}>
              <span className="relative z-10">{item.label}</span>
              {active && <motion.span layoutId="desktop-navigation-indicator" className="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600" transition={motionTransition} />}
            </Link>
          }

          const dropdownTriggerClass = `group relative flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition-colors ${active ? 'text-primary-600' : 'text-foreground-secondary hover:text-primary-600'} after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[var(--smilux-primary)] after:transition-transform after:duration-200 ${active ? '' : 'hover:after:scale-x-100'}`

          return <button key={item.id} ref={(node) => { triggerRefs.current[key] = node }} type="button" aria-expanded={activeMenu === key} aria-controls={`mega-menu-${key}`} onMouseEnter={() => openMenu(item)} onFocus={() => openMenu(item)} onClick={() => { if (activeMenu === key) onNavigate?.(item.href); else openMenu(item) }} className={dropdownTriggerClass}>
            <span className="relative z-10">{item.label}</span>
            <motion.span className="relative z-10" animate={{ rotate: activeMenu === key ? 180 : 0 }} transition={motionTransition}><ChevronDown size={15} aria-hidden="true" /></motion.span>
            {active && <motion.span layoutId="desktop-navigation-indicator" className="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600" transition={motionTransition} />}
          </button>
        })}

        <AnimatePresence>
          {activeItem?.children?.length ? <motion.div id={`mega-menu-${activeMenu}`} key="mega-menu-surface" initial="closed" animate="open" exit="closed" variants={{ closed: { opacity: 0, y: -8, scale: 0.985 }, open: { opacity: 1, y: 0, scale: 1 } }} transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} className="absolute left-1/2 top-full z-50 w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-1" onMouseEnter={clearCloseTimer} onMouseLeave={scheduleClose}>
            <motion.div layout className="w-fit max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-primary-100 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl" transition={{ layout: reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 } }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={activeMenu} initial="hidden" animate="visible" exit="exit" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delayChildren: reduceMotion ? 0 : 0.04, staggerChildren: reduceMotion ? 0 : 0.045 } }, exit: { opacity: 0, transition: { duration: reduceMotion ? 0 : 0.12 } } }} className="grid w-fit max-w-[calc(100vw-2.5rem)] grid-cols-1 gap-0.5 sm:grid-cols-2">
                  {activeItem.children.map((child) => <motion.div key={child.id} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: reduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] } }, exit: { opacity: 0, y: -4 } }}>
                    <Link href={child.href} onClick={() => { onNavigate?.(child.href); closeMenu() }} className={`group/mega relative block w-fit max-w-full overflow-hidden rounded-md px-3.5 py-2.5 text-base whitespace-nowrap transition-colors ${isCurrent(child.href) ? 'bg-[var(--smilux-primary)] text-white' : 'text-foreground-secondary hover:text-white'}`}>
                      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-md bg-[var(--smilux-primary)] opacity-0 transition-opacity duration-200 group-hover/mega:opacity-100" />
                      <span className="relative z-10 flex items-center gap-2">{child.label}</span>
                    </Link>
                  </motion.div>)}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div> : null}
        </AnimatePresence>
      </nav>
    </LayoutGroup>
  )
}
