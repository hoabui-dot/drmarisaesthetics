'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null)
  const [menuAnchorLeft, setMenuAnchorLeft] = useState(0)

  const motionTransition = reduceMotion ? { duration: 0 } : indicatorTransition
  const activeItem = items.find((item) => String(item.id) === activeMenu)

  // Anchor the shared surface to the active trigger, not to the centre of the
  // complete navigation row. This keeps the dropdown visually attached when
  // the active item changes or when the header has uneven item widths.
  const updateMenuAnchor = useCallback(() => {
    if (!activeMenu || !regionRef.current) return
    const trigger = triggerRefs.current[activeMenu]
    if (!trigger) return
    const navigationRect = regionRef.current.getBoundingClientRect()
    const triggerRect = trigger.getBoundingClientRect()
    setMenuAnchorLeft(triggerRect.left - navigationRect.left)
  }, [activeMenu])

  useLayoutEffect(() => {
    updateMenuAnchor()
  }, [updateMenuAnchor])

  useEffect(() => {
    window.addEventListener('resize', updateMenuAnchor)
    return () => window.removeEventListener('resize', updateMenuAnchor)
  }, [updateMenuAnchor])

  const clearCloseTimer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => {
      setActiveMenu(null)
      setHoveredNavItem(null)
    }, 120)
  }

  const openMenu = (item: NavItem) => {
    clearCloseTimer()
    setActiveMenu(String(item.id))
    setHoveredNavItem(String(item.id))
    router.prefetch(item.href)
    item.children?.forEach((child) => router.prefetch(child.href))
  }

  const closeMenu = (restoreFocus = false) => {
    clearCloseTimer()
    const current = activeMenu
    setActiveMenu(null)
    setHoveredNavItem(null)
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
      <nav ref={regionRef} className="desktop-mega-navigation relative flex items-center gap-1" aria-label="Primary navigation" onMouseLeave={scheduleClose} onFocusCapture={clearCloseTimer} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleClose() }}>
        {items.map((item) => {
          const key = String(item.id)
          const hasChildren = Boolean(item.children?.length)
          const active = activeMenu === key || hoveredNavItem === key || (!activeMenu && !hoveredNavItem && (activeSection === item.href.replace('#', '') || isCurrent(item.href)))

          if (!hasChildren) {
            const directLinkClass = `desktop-mega-navigation__link relative flex items-center gap-1 rounded-lg px-3 py-2 transition-colors ${active ? '' : 'after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:transition-transform after:duration-200 hover:after:scale-x-100'}`

            return <Link key={item.id} href={item.href} data-active={active || undefined} onClick={() => onNavigate?.(item.href)} onMouseEnter={() => { clearCloseTimer(); setActiveMenu(null); setHoveredNavItem(key); router.prefetch(item.href) }} onFocus={() => { clearCloseTimer(); setActiveMenu(null); setHoveredNavItem(key) }} className={directLinkClass}>
              <span className="relative z-10">{item.label}</span>
              {active && <motion.span layoutId="desktop-navigation-indicator" className="desktop-mega-navigation__indicator absolute bottom-1 left-3 right-3 h-0.5" transition={motionTransition} />}
            </Link>
          }

          const dropdownTriggerClass = `desktop-mega-navigation__trigger group relative flex items-center gap-1 rounded-lg px-3 py-2 transition-colors ${active ? '' : 'after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:transition-transform after:duration-200 hover:after:scale-x-100'}`

          return <button key={item.id} ref={(node) => { triggerRefs.current[key] = node }} type="button" aria-expanded={activeMenu === key} aria-controls={`mega-menu-${key}`} data-active={active || undefined} onMouseEnter={() => openMenu(item)} onFocus={() => openMenu(item)} onClick={() => { if (activeMenu === key) onNavigate?.(item.href); else openMenu(item) }} className={dropdownTriggerClass}>
            <span className="relative z-10">{item.label}</span>
            <motion.span className="relative z-10" animate={{ rotate: activeMenu === key ? 180 : 0 }} transition={motionTransition}><ChevronDown size={15} aria-hidden="true" /></motion.span>
            {active && <motion.span layoutId="desktop-navigation-indicator" className="desktop-mega-navigation__indicator absolute bottom-1 left-3 right-3 h-0.5" transition={motionTransition} />}
          </button>
        })}

        <AnimatePresence>
          {activeItem?.children?.length ? <motion.div id={`mega-menu-${activeMenu}`} key="mega-menu-surface" initial="closed" animate="open" exit="closed" variants={{ closed: { opacity: 0, y: -8, scale: 0.985 }, open: { opacity: 1, y: 0, scale: 1 } }} transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} className="absolute top-full z-50 w-max max-w-[calc(100vw-2rem)] pt-1" style={{ left: menuAnchorLeft }} onMouseEnter={clearCloseTimer} onMouseLeave={scheduleClose}>
            <motion.div layout className="desktop-mega-navigation__surface w-max max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border p-1.5 shadow-2xl backdrop-blur-xl" transition={{ layout: reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 } }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={activeMenu} initial="hidden" animate="visible" exit="exit" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delayChildren: reduceMotion ? 0 : 0.04, staggerChildren: reduceMotion ? 0 : 0.045 } }, exit: { opacity: 0, transition: { duration: reduceMotion ? 0 : 0.12 } } }} className="inline-grid w-max max-w-[calc(100vw-2.5rem)] grid-cols-[max-content] gap-0.5">
                  {activeItem.children.map((child) => <motion.div key={child.id} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: reduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] } }, exit: { opacity: 0, y: -4 } }}>
                    <Link href={child.href} data-current={isCurrent(child.href) || undefined} onClick={() => { onNavigate?.(child.href); closeMenu() }} className={`desktop-mega-navigation__item group/mega relative block w-max max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-md px-3.5 py-2.5 whitespace-nowrap transition-colors ${isCurrent(child.href) ? 'bg-[var(--smilux-primary)]' : ''}`}>
                      <span aria-hidden="true" className="desktop-mega-navigation__item-highlight pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 group-hover/mega:opacity-100" />
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
