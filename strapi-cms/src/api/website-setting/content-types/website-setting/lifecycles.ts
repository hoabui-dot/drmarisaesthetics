import { randomUUID } from 'node:crypto'
import { errors } from '@strapi/utils'

const { ValidationError } = errors

type Category = { category_id?: string | null; route_name?: string | null; label?: string; [key: string]: unknown }
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
        .filter((item) => item?.id != null)
        .map((item) => [String(item.id), item]),
    )
    const usedIds = new Set<string>()
    const usedRouteNames = new Set<string>()
    data[key] = items.flatMap((item) => {
      if (!item || typeof item !== 'object') return []
      const previous = item.id != null ? previousByComponentId.get(String(item.id)) : undefined
      const label = typeof item.label === 'string' && item.label.trim()
        ? item.label.trim()
        : typeof previous?.label === 'string' ? previous.label.trim() : ''
      const submittedRouteName = typeof item.route_name === 'string' ? item.route_name.trim() : ''
      const previousRouteName = typeof previous?.route_name === 'string' ? previous.route_name.trim() : ''
      const hasCategoryData = Boolean(
        label || submittedRouteName || previousRouteName || item.category_id || previous?.category_id || item.icon,
      )

      // Strapi's repeatable-component editor can include an empty placeholder row.
      // It is not a category and should not make an otherwise valid publish fail.
      if (!hasCategoryData) return []

      const preservedId = typeof item.category_id === 'string' && item.category_id.trim()
        ? item.category_id.trim()
        : previous?.category_id
      const categoryId = preservedId && !usedIds.has(preservedId) ? preservedId : randomUUID()
      usedIds.add(categoryId)

      if (!label) {
        throw new ValidationError(`Every ${key === 'blog_categories' ? 'blog' : 'service'} category needs a label.`)
      }

      if (key === 'blog_categories') {
        const routeName = normalizeRouteName(submittedRouteName || previousRouteName || label)
        if (!routeName) throw new ValidationError(`Blog category "${label}" needs a route name or a usable label.`)
        if (usedRouteNames.has(routeName)) throw new ValidationError(`Blog category route name "${routeName}" must be unique.`)
        usedRouteNames.add(routeName)
        return [{ ...item, label, category_id: categoryId, route_name: routeName }]
      }
      return [{ ...item, label, category_id: categoryId }]
    })
  }
}

function normalizeRouteName(value: string): string {
  return value.trim().toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
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
  async beforeCreate(event: { params: { data?: LifecycleData } }) {
    const existing = await getExistingCategories()
    ensureCategoryIds(event.params.data, existing)
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
