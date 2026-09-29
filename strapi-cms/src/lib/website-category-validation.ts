import { errors } from '@strapi/utils'

const { ValidationError } = errors

type CategoryType = 'blog' | 'service'

export async function validateWebsiteCategoryId(categoryType: CategoryType, value: unknown) {
  if (value == null || value === '') return
  if (typeof value !== 'string' || !value.trim()) {
    throw new ValidationError('Choose a valid Website Settings category or leave this field empty.')
  }

  const runtimeStrapi = (globalThis as typeof globalThis & { strapi?: any }).strapi
  if (!runtimeStrapi) throw new Error('Strapi runtime is unavailable while validating the category assignment.')

  const field = categoryType === 'blog' ? 'blog_categories' : 'service_categories'
  const settings = await runtimeStrapi.documents('api::website-setting.website-setting').findFirst({
    status: 'draft',
    populate: { [field]: true },
  })
  const categories = Array.isArray(settings?.[field]) ? settings[field] : []
  const valid = categories.some((category: any) => category?.category_id === value.trim() && category?.label?.trim())

  if (!valid) {
    throw new ValidationError(`The selected ${categoryType} category is missing from Website Settings. Choose a current option or clear the field.`)
  }
}
