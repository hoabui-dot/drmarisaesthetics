import type { WebsiteCategory } from '@/src/types/strapi'

export function normalizeNewsRouteName(value: string): string {
  return value.trim().toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function blogArticlePath(slug: string, categoryId?: string | null, categories: WebsiteCategory[] = []): string {
  const routeName = categories.find((category) => category.id === categoryId)?.routeName
  return routeName ? `/news/${encodeURIComponent(routeName)}/${encodeURIComponent(slug)}` : `/news/${encodeURIComponent(slug)}`
}
