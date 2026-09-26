import assert from 'node:assert/strict'
import test from 'node:test'
import lifecycle from '../src/api/result/content-types/result/lifecycles.ts'

const savedCategory = { id: 12, category_id: 'category-facelift', label: 'Facelift' }

const withSavedCategories = async (run) => {
  const originalStrapi = globalThis.strapi
  globalThis.strapi = {
    documents: () => ({
      findOne: async () => ({ categories: [savedCategory] }),
    }),
  }

  try {
    await run()
  } finally {
    if (originalStrapi === undefined) delete globalThis.strapi
    else globalThis.strapi = originalStrapi
  }
}

test('rehydrates an empty submitted label from the matching saved category on update', async () => {
  await withSavedCategories(async () => {
    const data = {
      categories: [{ id: 12, category_id: 'category-facelift', label: '' }],
      cases: [{ title: 'Case 1', category_id: 'category-facelift' }],
    }

    await lifecycle.beforeUpdate({ params: { data, where: { documentId: 'result-document' } } })

    assert.equal(data.categories[0].label, 'Facelift')
    assert.deepEqual(data.cases[0].category_ids, ['category-facelift'])
    assert.equal(data.cases[0].category_id, null)
  })
})

test('uses a non-empty edited label instead of the saved label', async () => {
  await withSavedCategories(async () => {
    const data = {
      categories: [{ id: 12, category_id: 'category-facelift', label: 'Facelift Surgery' }],
      cases: [{ title: 'Case 1', category_id: 'category-facelift' }],
    }

    await lifecycle.beforeUpdate({ params: { data, where: { documentId: 'result-document' } } })

    assert.equal(data.categories[0].label, 'Facelift Surgery')
  })
})

test('passes a new category with a missing label to Strapi component validation', () => {
  const data = {
    categories: [{ category_id: 'new-category' }],
    cases: [{ title: 'Case 1', category_ids: [] }],
  }

  assert.doesNotThrow(() => lifecycle.beforeCreate({ params: { data } }))
  assert.equal(data.categories[0].category_id, 'new-category')
  assert.equal(data.categories[0].label, undefined)
  assert.deepEqual(data.cases[0].category_ids, [])
})

test('allows a Result Case without a category', () => {
  const data = {
    categories: [{ category_id: 'category-facelift', label: 'Facelift' }],
    cases: [{ title: 'Uncategorized case', category_ids: [] }],
  }

  assert.doesNotThrow(() => lifecycle.beforeCreate({ params: { data } }))
  assert.deepEqual(data.cases[0].category_ids, [])
})

test('supports multiple categories on one case', () => {
  const data = {
    categories: [
      { category_id: 'face', label: 'Face' },
      { category_id: 'neck', label: 'Neck' },
    ],
    cases: [{ title: 'Case 1', category_ids: ['face', 'neck'] }],
  }

  assert.doesNotThrow(() => lifecycle.beforeCreate({ params: { data } }))
  assert.deepEqual(data.cases[0].category_ids, ['face', 'neck'])
})

test('still rejects category IDs that are not defined', () => {
  const data = {
    categories: [{ category_id: 'category-facelift', label: 'Facelift' }],
    cases: [{ title: 'Case 1', category_ids: ['unknown-category'] }],
  }

  assert.throws(
    () => lifecycle.beforeCreate({ params: { data } }),
    /must use valid result categories/,
  )
})
