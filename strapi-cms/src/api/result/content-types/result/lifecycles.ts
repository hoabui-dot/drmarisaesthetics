import { errors } from '@strapi/utils'

const { ValidationError } = errors

const makeCategoryId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `result-category-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

const clean = (value: unknown) => typeof value === 'string' ? value.trim() : ''

/**
 * Normalizes and validates the result taxonomy at the CMS boundary.
 * The admin input generates IDs for new categories, but this server-side
 * guard remains authoritative for API imports, scripts and older admin builds.
 */
const normalizeResultTaxonomy = (data: Record<string, any>, savedCategories: any[] = []) => {
  const hasCategories = Object.prototype.hasOwnProperty.call(data, 'categories')
  const hasCases = Object.prototype.hasOwnProperty.call(data, 'cases')
  if (!hasCategories && !hasCases) return
  if (hasCategories !== hasCases) {
    throw new ValidationError('Submit categories and cases together so category assignments can be validated safely.')
  }

  const rawCategories = Array.isArray(data.categories) ? data.categories : []
  const rawCases = Array.isArray(data.cases) ? data.cases : []
  const categories: any[] = []
  const categoryByLabel = new Map<string, any>()
  const categoryIds = new Set<string>()
  const canonicalIdByCategoryId = new Map<string, string>()
  const savedByComponentId = new Map(
    savedCategories
      .filter((category) => category?.id !== undefined && category?.id !== null)
      .map((category) => [String(category.id), category]),
  )
  const savedByCategoryId = new Map(
    savedCategories
      .filter((category) => clean(category?.category_id))
      .map((category) => [clean(category.category_id), category]),
  )

  rawCategories.forEach((rawCategory: any, index: number) => {
    if (!rawCategory || typeof rawCategory !== 'object' || Array.isArray(rawCategory)) {
      throw new ValidationError(`Result category ${index + 1} is invalid. Reopen the category list and try again.`)
    }

    // Strapi may serialize an unchanged repeatable component as a reference
    // containing its component ID while omitting unchanged fields. Some Admin
    // update payloads instead include the field with an empty value. In either
    // case, recover a label only from that exact saved component/category; a
    // category without a recoverable label is passed through unchanged so
    // Strapi's required component field validator can report the real field
    // validation error rather than this lifecycle misclassifying a partial
    // component payload.
    const savedCategory = savedByComponentId.get(String(rawCategory.id))
      || savedByCategoryId.get(clean(rawCategory.category_id))
    const submittedLabel = clean(rawCategory.label)
    const label = submittedLabel || clean(savedCategory?.label)
    const category = {
      ...rawCategory,
      category_id: clean(rawCategory.category_id) || makeCategoryId(),
    }
    if (label) category.label = label
    if (categoryIds.has(category.category_id)) throw new ValidationError('Result category IDs must be unique.')
    categoryIds.add(category.category_id)
    canonicalIdByCategoryId.set(category.category_id, category.category_id)

    // Do not infer or invent labels for newly-added components. Preserve the
    // incoming component payload and let Strapi validate its required `label`.
    if (!label) {
      categories.push(category)
      return
    }

    const labelKey = category.label.toLocaleLowerCase()
    const existing = categoryByLabel.get(labelKey)
    if (existing) {
      // Collapse duplicate labels to one stable category. This also repairs
      // duplicates created by older Admin forms while preserving case links.
      canonicalIdByCategoryId.set(category.category_id, existing.category_id)
      return
    }
    categories.push(category)
    categoryByLabel.set(labelKey, category)
    canonicalIdByCategoryId.set(category.category_id, category.category_id)
  })

  // Migrate the former free-text category field when an editor saves an older entry.
  const normalizedCases = rawCases.map((item: any) => {
    const legacyLabel = clean(item.category)
    const hasCategoryIds = Array.isArray(item.category_ids)
    if (item.category_ids != null && !hasCategoryIds) {
      throw new ValidationError(`Case “${clean(item.title) || clean(item.case_number) || 'Unnamed'}” has an invalid category selection.`)
    }

    let assignedCategoryIds: string[] = hasCategoryIds
      ? [...new Set((item.category_ids as unknown[] || []).map(clean).filter(Boolean))]
      : clean(item.category_id) ? [clean(item.category_id)] : []

    // An explicit array (including []) is authoritative. If the new field is
    // absent/null, preserve an older single category_id or migrate legacy text.
    if (!hasCategoryIds && !assignedCategoryIds.length && legacyLabel) {
      const labelKey = legacyLabel.toLocaleLowerCase()
      const existing = categoryByLabel.get(labelKey)
      if (existing) assignedCategoryIds = [existing.category_id]
      else {
        const categoryId = makeCategoryId()
        const category = { category_id: categoryId, label: legacyLabel }
        categories.push(category)
        categoryIds.add(categoryId)
        categoryByLabel.set(labelKey, category)
        canonicalIdByCategoryId.set(categoryId, categoryId)
        assignedCategoryIds = [categoryId]
      }
    }

    assignedCategoryIds = [...new Set(assignedCategoryIds.map((categoryId) => canonicalIdByCategoryId.get(categoryId) || categoryId))]
    return { ...item, category_ids: assignedCategoryIds, category_id: null, category: null }
  })

  normalizedCases.forEach((item) => {
    const invalidCategoryId = item.category_ids.find((categoryId: string) => !categoryIds.has(categoryId))
    if (invalidCategoryId) {
      throw new ValidationError(`Case “${clean(item.title) || clean(item.case_number) || 'Unnamed'}” must use valid result categories.`)
    }
  })

  if (hasCategories) data.categories = categories
  if (hasCases) data.cases = normalizedCases
}

export default {
  beforeCreate(event: any) {
    normalizeResultTaxonomy(event.params.data)
  },
  async beforeUpdate(event: any) {
    const data = event.params.data as Record<string, any>
    const hasCategories = Object.prototype.hasOwnProperty.call(data, 'categories')
    const hasIncompleteLabels = hasCategories
      && Array.isArray(data.categories)
      && data.categories.some((category: any) =>
        category && typeof category === 'object' && !clean(category.label),
      )

    let savedCategories: any[] = []
    const documentId = event.params.where?.documentId
    const numericId = event.params.where?.id
    const runtimeStrapi = (globalThis as typeof globalThis & { strapi?: any }).strapi

    if (hasIncompleteLabels && runtimeStrapi) {
      const savedResult = documentId
        ? await runtimeStrapi.documents('api::result.result').findOne({
          documentId,
          status: 'draft',
          populate: { categories: true },
        })
        : numericId
          ? await runtimeStrapi.db.query('api::result.result').findOne({
            where: { id: numericId },
            populate: { categories: true },
          })
          : null

      savedCategories = Array.isArray(savedResult?.categories) ? savedResult.categories : []
    }

    normalizeResultTaxonomy(data, savedCategories)
  },
}
