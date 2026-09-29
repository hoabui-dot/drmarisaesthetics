import {
  Box,
  Field,
  SingleSelect,
  SingleSelectOption,
  Typography,
} from '@strapi/design-system'
import { useFetchClient, useNotification } from '@strapi/admin/strapi-admin'
import { useCallback, useEffect, useMemo, useState } from 'react'

type Category = { id?: string | number; category_id?: string; label?: string }
type Props = {
  name: string
  value?: string | null
  attribute?: { options?: { categoryType?: 'blog' | 'service' } }
  onChange: (event: { target: { name: string; type: string; value: string | null } }) => void
  disabled?: boolean
  error?: string
  hint?: string
  label?: string
  required?: boolean
}

const NO_CATEGORY = '__website_category_none__'

const extractCategories = (payload: any, key: 'blog_categories' | 'service_categories'): Category[] => {
  const root = payload?.data?.data?.attributes || payload?.data?.attributes || payload?.data?.data || payload?.data || payload || {}
  const settings = root?.attributes || root
  const value = settings?.[key]
  const items = Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : []
  return items.map((entry: any) => {
    const item = entry?.attributes || entry?.data?.attributes || entry?.data || entry || {}
    return { id: item.id, category_id: item.category_id, label: item.label }
  }).filter((item: Category) => Boolean(item.category_id?.trim()) && Boolean(item.label?.trim()))
}

export default function WebsiteCategoryInput({
  name,
  value,
  attribute,
  onChange,
  disabled,
  error,
  hint,
  label,
  required,
}: Props) {
  const { get } = useFetchClient()
  const { toggleNotification } = useNotification()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const categoryType = attribute?.options?.categoryType
    || (name.includes('blog') ? 'blog' : 'service')
  const fieldName = categoryType === 'service' ? 'service_categories' : 'blog_categories'

  const loadCategories = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ populate: '*' })
      const locale = new URLSearchParams(window.location.search).get('plugins[i18n][locale]')
      if (locale) params.set('plugins[i18n][locale]', locale)
      const response = await get(`/content-manager/single-types/api::website-setting.website-setting?${params.toString()}`)
      setCategories(extractCategories(response?.data ?? response, fieldName))
    } catch {
      setCategories([])
      toggleNotification({ type: 'warning', message: 'Could not load categories from Website Settings. Check Website Settings read permission and save/publish the category list.' })
    } finally {
      setLoading(false)
    }
  }, [fieldName, get, toggleNotification])

  useEffect(() => { void loadCategories() }, [loadCategories])

  const options = useMemo(() => {
    return categories.filter((item) => item.category_id && item.label?.trim())
  }, [categories])

  return (
    <Field.Root name={name} error={error} hint={hint} required={required} disabled={disabled}>
      <Field.Label>{label || 'Website category'}</Field.Label>
      <SingleSelect
        value={value || NO_CATEGORY}
        disabled={disabled || loading}
        onChange={(nextValue: string) => onChange({ target: { name, type: 'string', value: nextValue === NO_CATEGORY ? null : nextValue } })}
        placeholder={loading ? 'Loading Website Settings…' : 'Uncategorized'}
        aria-label={label || 'Website category'}
      >
        <SingleSelectOption value={NO_CATEGORY}>Uncategorized</SingleSelectOption>
        {options.map((category) => (
          <SingleSelectOption key={category.category_id} value={category.category_id as string}>
            {category.label}
          </SingleSelectOption>
        ))}
        {value && !options.some((category) => category.category_id === value) ? (
          <SingleSelectOption value={value}>Missing category ({value})</SingleSelectOption>
        ) : null}
      </SingleSelect>
      <Box paddingTop={1}><Field.Hint /><Field.Error /></Box>
      {!loading && options.length === 0 ? <Typography variant="pi" textColor="neutral600">Add categories in Website Settings to classify this entry.</Typography> : null}
      {value && !options.some((category) => category.category_id === value) ? <Typography variant="pi" textColor="warning600">The assigned category is no longer in Website Settings. Select a replacement or clear it.</Typography> : null}
    </Field.Root>
  )
}
