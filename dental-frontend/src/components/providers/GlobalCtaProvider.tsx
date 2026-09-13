'use client'

import { createContext, useContext } from 'react'
import type { WebsiteSettingGlobalCta } from '@/src/types/strapi'

const GlobalCtaContext = createContext<WebsiteSettingGlobalCta | undefined>(undefined)

export function GlobalCtaProvider({ value, children }: { value?: WebsiteSettingGlobalCta; children: React.ReactNode }) {
  return <GlobalCtaContext.Provider value={value}>{children}</GlobalCtaContext.Provider>
}

export function useGlobalCta() {
  return useContext(GlobalCtaContext)
}
