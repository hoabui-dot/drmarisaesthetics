'use client'

import React, { useState, useEffect } from 'react'
import { List, ChevronDown, X } from 'lucide-react'

interface IndexItem {
    id: string
    label: string
    num: string
}

interface ServiceIndexMenuProps {
    serviceName: string
    items: IndexItem[]
}

export const ServiceIndexMenu = ({ serviceName, items }: ServiceIndexMenuProps) => {
    const [isVisible, setIsVisible] = useState(false)
    const [activeSection, setActiveSection] = useState('')
    const [isExpanded, setIsExpanded] = useState(true)
    // Mobile bottom-drawer state
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 600)

            const sectionOffsets = items.map(item => {
                const el = document.getElementById(item.id)
                if (el) return { id: item.id, top: el.offsetTop - 120 }
                return null
            }).filter(Boolean)

            const scrollPos = window.scrollY
            const current = [...(sectionOffsets as any[])].reverse().find(s => s && scrollPos >= s.top)
            if (current) setActiveSection(current.id)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [items])

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id)
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
    }

    // Mobile: scroll to section AND close the drawer
    const handleMobileSelect = (id: string) => {
        scrollToSection(id)
        setMobileOpen(false)
    }

    if (!isVisible) return null

    return (
        <>
            {/* ── DESKTOP: Fixed left sidebar (xl+) ─────────────────────────────── */}
            <div className="fixed left-6 top-[20%] z-[100] hidden xl:block">
                <div
                    className={`bg-white/95 backdrop-blur-2xl border border-smilux-navy/15 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col w-max ${
                        isExpanded 
                            ? 'max-w-[450px] rounded-3xl shadow-lg'
                            : 'max-w-[56px] rounded-[28px] shadow-lg hover:shadow-xl hover:shadow-primary-900/10'
                    }`}
                >
                    {/* Toggle */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`w-full flex items-center transition-all duration-500 ${isExpanded ? 'px-5 py-4 border-b border-smilux-navy/5' : 'p-2 justify-center'} group`}
                    >
                        <div className={`flex items-center justify-center shrink-0 transition-all duration-500 ${isExpanded ? 'w-8 h-8 rounded-xl bg-smilux-navy' : 'w-10 h-10 rounded-full bg-smilux-navy shadow-md group-hover:scale-105'}`}>
                            <List className={`transition-all duration-500 text-white ${isExpanded ? 'w-4 h-4' : 'w-5 h-5'}`} />
                        </div>
                        
                        <div className={`flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isExpanded ? 'max-w-[300px] opacity-100 ml-3 pr-4' : 'max-w-0 opacity-0 ml-0 pr-0'}`}>
                            <span className="text-size-service-index-label font-black uppercase tracking-[0.15em] text-smilux-navy leading-none whitespace-nowrap">
                                {serviceName}
                            </span>
                        <ChevronDown className={`ml-6 shrink-0 w-4 h-4 text-smilux-navy/30 transition-transform duration-500 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                        </div>
                    </button>

                    {/* Nav items — CSS grid-rows collapse */}
                    <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="px-3 pb-4 pt-2 flex flex-col gap-1 pr-5 max-h-[60vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                {items.map((item) => {
                                    const isActive = activeSection === item.id
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`relative group w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${isActive ? 'bg-smilux-navy/5' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className={`w-1 rounded-full self-stretch shrink-0 transition-all duration-300 ${isActive ? 'bg-smilux-navy scale-y-100' : 'bg-transparent scale-y-50'}`} />
                                            <div className="flex items-center gap-3">
                                                <span className={`text-size-service-index-label font-black tabular-nums transition-colors ${isActive ? 'text-smilux-navy/60' : 'text-slate-300'}`}>{item.num}</span>
                                                <span className={`text-size-service-index-title font-bold whitespace-nowrap transition-colors ${isActive ? 'text-smilux-navy' : 'text-slate-500 group-hover:text-smilux-navy'}`}>{item.label}</span>
                                            </div>
                                            {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-smilux-navy shadow-md" />}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE: Floating trigger button (below xl) — HIDDEN as requested ── */}
            <div className="hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-smilux-navy text-white shadow-lg shadow-smilux-navy/30 text-size-body font-bold"
                >
                    <List className="w-4 h-4" />
                    <span>{serviceName} — Jump to section</span>
                </button>
            </div>

            {/* ── MOBILE: Bottom drawer ──────────────────────────────────────────── */}
            {/* Backdrop */}
            <div
                onClick={() => setMobileOpen(false)}
                className={`hidden fixed inset-0 z-[150] bg-slate-900/50 transition-opacity duration-250 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />
            {/* Drawer panel */}
            <div
                className={`hidden fixed bottom-0 left-0 right-0 z-[151] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${mobileOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
                    <span className="text-size-small font-black uppercase tracking-widest text-smilux-navy">{serviceName}</span>
                    <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="px-4 py-3 pb-safe space-y-1 max-h-[60dvh] overflow-y-auto">
                    {items.map((item) => {
                        const isActive = activeSection === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleMobileSelect(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-colors ${isActive ? 'bg-smilux-navy/5 text-smilux-navy' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <span className={`text-size-service-index-label font-black tabular-nums w-6 shrink-0 ${isActive ? 'text-smilux-navy/60' : 'text-slate-300'}`}>{item.num}</span>
                                <span className={`text-size-service-index-title font-bold flex-1 ${isActive ? 'text-smilux-navy' : ''}`}>{item.label}</span>
                                {isActive && <div className="w-2 h-2 rounded-full bg-smilux-navy" />}
                            </button>
                        )
                    })}
                    {/* Safe area padding for home indicator */}
                    <div className="h-6" />
                </div>
            </div>
        </>
    )
}
