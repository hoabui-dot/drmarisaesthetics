import {
  Checkbox,
  Field,
  Flex,
  Typography,
  TextInput,
} from '@strapi/design-system'
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/content-manager/strapi-admin'
import { useEffect, useMemo } from 'react'

type ResultCategoryInputProps = {
  name: string
  value?: string | string[] | null
  onChange: (event: { target: { name: string; type: string; value: string | string[] | null } }) => void
  disabled?: boolean
  error?: string
  hint?: string
  label?: string
  required?: boolean
}

type Category = { category_id?: string; label?: string }

const emit = (
  name: string,
  onChange: ResultCategoryInputProps['onChange'],
  value: string | string[] | null,
  type = 'string',
) => {
  onChange({ target: { name, type, value } })
}

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `result-category-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export default function ResultCategoryInput({
  name,
  value,
  onChange,
  disabled,
  error,
  hint,
  label,
  required,
}: ResultCategoryInputProps) {
  const { form } = useContentManagerContext()
  const isCategoryDefinition = /(^|\.)categories\.\d+\.category_id$/.test(name)
  const isCaseCategory = /(^|\.)cases\.\d+\.category_ids$/.test(name)
  const categories = useMemo<Category[]>(() => {
    const values = form?.values as { categories?: Category[] } | undefined
    return Array.isArray(values?.categories) ? values.categories : []
  }, [form?.values])

  useEffect(() => {
    if (!isCaseCategory || value != null) return
    const match = name.match(/cases\.(\d+)\.category_ids$/)
    const caseIndex = match ? Number(match[1]) : -1
    const values = form?.values as { cases?: Array<{ category?: string; category_id?: string; category_ids?: string[] }> } | undefined
    const caseValue = caseIndex >= 0 ? values?.cases?.[caseIndex] : undefined
    const existingIds = Array.isArray(caseValue?.category_ids)
      ? caseValue.category_ids.filter((id): id is string => typeof id === 'string' && Boolean(id.trim()))
      : caseValue?.category_id ? [caseValue.category_id] : []
    const legacyLabel = caseIndex >= 0 ? values?.cases?.[caseIndex]?.category?.trim() : ''
    if (existingIds.length) {
      emit(name, onChange, existingIds, 'json')
      return
    }
    if (!legacyLabel) return

    // Legacy text can be linked to a category that the editor has already
    // added. Do not create category definitions from this input: doing so
    // races with edits to the repeatable Categories field and produced
    // duplicate rows for matching legacy labels.
    const existing = categories.find((category) =>
      category.category_id && category.label?.trim().toLocaleLowerCase() === legacyLabel.toLocaleLowerCase(),
    )
    if (existing?.category_id) emit(name, onChange, [existing.category_id], 'json')
  }, [categories, form, isCaseCategory, name, onChange, value])

  useEffect(() => {
    if (isCategoryDefinition && !value) emit(name, onChange, createId())
  }, [isCategoryDefinition, name, onChange, value])

  useEffect(() => {
    if (!isCaseCategory || !Array.isArray(value) || !categories.length) return
    const validIds = new Set(categories.map((category) => category.category_id).filter(Boolean))
    const nextValue = value.filter((categoryId) => validIds.has(categoryId))
    if (nextValue.length !== value.length) emit(name, onChange, nextValue, 'json')
  }, [categories, isCaseCategory, name, onChange, value])

  if (isCategoryDefinition) {
    return (
      <Field.Root name={name} error={error} hint={hint || 'Generated automatically. Do not edit this value.'} required={required} disabled>
        <Field.Label>{label || 'Category ID'}</Field.Label>
        <TextInput value={value || 'Generating…'} readOnly disabled />
      </Field.Root>
    )
  }

  if (isCaseCategory) {
    const selectedIds = Array.isArray(value) ? value : typeof value === 'string' && value ? [value] : []
    const validIds = new Set(categories.map((category) => category.category_id).filter(Boolean))
    const hasMissingCategory = selectedIds.some((categoryId) => !validIds.has(categoryId))
    return (
      <Field.Root name={name} error={error} hint={hint || 'Optional. Select every category that applies to this case.'} disabled={disabled}>
        <Field.Label>{label || 'Categories'}</Field.Label>
        {categories.length ? (
          <Flex direction="column" alignItems="stretch" gap={2} role="group" aria-label={label || 'Categories'}>
            {categories
              .filter((category) => category.category_id && category.label?.trim())
              .map((category) => {
                const categoryId = category.category_id as string
                const checked = selectedIds.includes(categoryId)

                return (
                  <Flex
                    key={categoryId}
                    as="label"
                    alignItems="center"
                    gap={3}
                    padding={3}
                    hasRadius
                    background="neutral0"
                    borderColor="neutral200"
                    borderWidth="1px"
                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={disabled}
                      onCheckedChange={(nextChecked) => {
                        const nextIds = nextChecked === true
                          ? [...new Set([...selectedIds, categoryId])]
                          : selectedIds.filter((selectedId) => selectedId !== categoryId)
                        emit(name, onChange, nextIds, 'json')
                      }}
                      aria-label={category.label}
                    />
                    <Typography variant="omega">{category.label}</Typography>
                  </Flex>
                )
              })}
          </Flex>
        ) : (
          <Typography variant="omega" textColor="neutral600">Create a category above before assigning it to this case.</Typography>
        )}
        <Field.Hint textColor="neutral600">{selectedIds.length} categor{selectedIds.length === 1 ? 'y' : 'ies'} selected</Field.Hint>
        {hasMissingCategory ? <Field.Hint textColor="danger600">One or more selected categories no longer exist. Remove them and choose valid categories.</Field.Hint> : null}
      </Field.Root>
    )
  }

  return null
}
