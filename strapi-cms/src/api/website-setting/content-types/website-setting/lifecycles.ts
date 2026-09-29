import { randomUUID } from 'node:crypto'

type Category = { category_id?: string | null; [key: string]: unknown }
type LifecycleData = {
  blog_categories?: Category[]
  service_categories?: Category[]
}

const ensureCategoryIds = (data?: LifecycleData, existing?: LifecycleData) => {
  if (!data) return
  for (const key of ['blog_categories', 'service_categories'] as const) {
    const items = data[key]
    if (!Array.isArray(items)) continue
    const previousByComponentId = new Map(
      (Array.isArray(existing?.[key]) ? existing[key] : [])
        .filter((item) => item?.id != null && item.category_id)
        .map((item) => [String(item.id), item.category_id as string]),
    )
    const usedIds = new Set<string>()
    data[key] = items.map((item) => {
      const preservedId = typeof item.category_id === 'string' && item.category_id.trim()
        ? item.category_id.trim()
        : item.id != null ? previousByComponentId.get(String(item.id)) : undefined
      const categoryId = preservedId && !usedIds.has(preservedId) ? preservedId : randomUUID()
      usedIds.add(categoryId)
      return { ...item, category_id: categoryId }
    })
  }
}

const getExistingCategories = async (): Promise<LifecycleData | undefined> => {
  const runtimeStrapi = (globalThis as typeof globalThis & { strapi?: any }).strapi
  if (!runtimeStrapi) return undefined
  const setting = await runtimeStrapi.documents('api::website-setting.website-setting').findFirst({
    status: 'draft',
    populate: { blog_categories: true, service_categories: true },
  })
  return setting || undefined
}

export default {
  beforeCreate(event: { params: { data?: LifecycleData } }) {
    ensureCategoryIds(event.params.data)
  },
  async beforeUpdate(event: { params: { data?: LifecycleData } }) {
    const existing = await getExistingCategories()
    const data = event.params.data
    const state = (event as typeof event & { state?: Record<string, string[]> }).state || {}
    for (const key of ['blog_categories', 'service_categories'] as const) {
      if (!Array.isArray(data?.[key]) || !Array.isArray(existing?.[key])) continue
      const previousByComponentId = new Map(existing[key]
        .filter((item) => item?.id != null && item.category_id)
        .map((item) => [String(item.id), item.category_id as string]))
      const retainedIds = new Set(data[key].map((item) =>
        item.category_id || (item.id != null ? previousByComponentId.get(String(item.id)) : undefined),
      ).filter((id): id is string => Boolean(id)))
      state[key] = existing[key]
        .map((item) => item.category_id)
        .filter((id): id is string => Boolean(id) && !retainedIds.has(id))
    }
    ;(event as any).state = state
    ensureCategoryIds(data, existing)
  },
  async afterUpdate(event: { state?: Record<string, string[]> }) {
    const runtimeStrapi = (globalThis as typeof globalThis & { strapi?: any }).strapi
    if (!runtimeStrapi) return
    const removedBlogIds = event.state?.blog_categories || []
    const removedServiceIds = event.state?.service_categories || []
    if (removedBlogIds.length) {
      await runtimeStrapi.db.query('api::blog.blog').updateMany({
        where: { blog_category_id: { $in: removedBlogIds } },
        data: { blog_category_id: null },
      })
    }
    if (removedServiceIds.length) {
      await runtimeStrapi.db.query('api::service.service').updateMany({
        where: { service_category_id: { $in: removedServiceIds } },
        data: { service_category_id: null },
      })
    }
  },
}
