import {
  Box,
  Field,
  Flex,
  SingleSelect,
  SingleSelectOption,
  Typography,
} from '@strapi/design-system'
import { useFetchClient, useNotification } from '@strapi/admin/strapi-admin'
import { useCallback, useEffect, useMemo, useState } from 'react'

type ServiceEntry = {
  documentId?: string
  id?: number
  title?: string
  navigationLabel?: string
  navigationOrder?: number | null
}

type NavigationOrderInputProps = {
  name: string
  value?: number | null
  onChange: (event: { target: { name: string; type: string; value: number | null } }) => void
  disabled?: boolean
  error?: string
  hint?: string
  label?: string
  required?: boolean
  document?: { documentId?: string }
}

const MODEL = 'api::service.service'

const getLocale = () => {
  if (typeof window === 'undefined') return undefined
  return new URLSearchParams(window.location.search).get('plugins[i18n][locale]') || undefined
}

const getServiceId = (document?: { documentId?: string }) => {
  if (document?.documentId) return document.documentId
  if (typeof window === 'undefined') return undefined
  return window.location.pathname.split('/').filter(Boolean).pop()
}

const extractServices = (payload: any): ServiceEntry[] => {
  const results = payload?.data?.results || payload?.results || payload?.data?.data || payload?.data
  return Array.isArray(results) ? results : []
}

export default function ServiceNavigationOrderInput({
  name,
  value,
  onChange,
  disabled,
  error,
  hint,
  label,
  required,
  document,
}: NavigationOrderInputProps) {
  const { get, post, put } = useFetchClient()
  const { toggleNotification } = useNotification()
  const [services, setServices] = useState<ServiceEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const currentDocumentId = getServiceId(document)

  const loadServices = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: '1',
        pageSize: '100',
        sort: 'title:asc',
        _t: String(Date.now()),
      })
      const locale = getLocale()
      if (locale) params.set('plugins[i18n][locale]', locale)
      const response = await get(`/content-manager/collection-types/${MODEL}?${params.toString()}`)
      setServices(extractServices(response?.data))
    } catch {
      toggleNotification({ type: 'warning', message: 'Could not load the service menu positions.' })
    } finally {
      setLoading(false)
    }
  }, [get, toggleNotification])

  useEffect(() => {
    void loadServices()
  }, [currentDocumentId, loadServices, value])

  const orderedServices = useMemo(() => {
    const map = new Map<number, ServiceEntry>()
    services.forEach((service) => {
      const order = Number(service.navigationOrder)
      if (Number.isInteger(order) && order > 0) map.set(order, service)
    })
    return map
  }, [services])

  const emitValue = (nextValue: number | null) => {
    onChange({ target: { name, type: 'integer', value: nextValue } })
  }

  const handleChange = async (rawValue: string) => {
    if (!rawValue || saving) return
    const nextOrder = Number(rawValue)
    const occupyingServices = services.filter((service) => {
      const serviceOrder = Number(service.navigationOrder)
      return service.documentId !== currentDocumentId && serviceOrder === nextOrder
    })

    if (occupyingServices.length > 0) {
      const occupyingLabel = occupyingServices[0].navigationLabel || occupyingServices[0].title || 'another service'
      const confirmed = window.confirm(
        `Position ${nextOrder} is currently used by “${occupyingLabel}”${occupyingServices.length > 1 ? ` and ${occupyingServices.length - 1} other service(s)` : ''}. Replace it with this service?\n\nThe existing service(s) will lose their menu position.`,
      )
      if (!confirmed) return

      if (occupyingServices.some((service) => !service.documentId)) {
        toggleNotification({ type: 'warning', message: 'The selected service could not be identified.' })
        return
      }

      setSaving(true)
      try {
        const locale = getLocale()
        const localeQuery = locale ? `?plugins[i18n][locale]=${encodeURIComponent(locale)}` : ''
        for (const service of occupyingServices) {
          await put(`/content-manager/collection-types/${MODEL}/${service.documentId}${localeQuery}`, {
            data: { navigationOrder: null },
          })
          await post(`/content-manager/collection-types/${MODEL}/${service.documentId}/actions/publish${localeQuery}`, {})
        }
        const occupyingIds = new Set(occupyingServices.map((service) => service.documentId))
        setServices((current) => current.map((service) => occupyingIds.has(service.documentId) ? { ...service, navigationOrder: null } : service))
        toggleNotification({ type: 'success', message: `${occupyingLabel} was moved out of position ${nextOrder}.` })
      } catch {
        toggleNotification({ type: 'warning', message: 'The existing service could not be moved. No position was changed.' })
        return
      } finally {
        setSaving(false)
      }
    }

    emitValue(nextOrder)
    setServices((current) => current.map((service) => service.documentId === currentDocumentId ? { ...service, navigationOrder: nextOrder } : service))
  }

  const currentValue = value == null ? '' : String(value)
  const optionCount = Math.max(services.length, 1)

  return (
    <Field.Root name={name} error={error} hint={hint} required={required} disabled={disabled}>
      <Field.Label>{label || 'Header Menu Order'}</Field.Label>
      <SingleSelect
        value={currentValue}
        disabled={disabled || loading || saving}
        onChange={handleChange}
        placeholder={loading ? 'Loading service positions…' : 'Select a menu position'}
        aria-label={label || 'Header Menu Order'}
      >
        {Array.from({ length: optionCount }, (_, index) => {
          const order = index + 1
          const occupant = orderedServices.get(order)
          const occupantLabel = occupant?.navigationLabel || occupant?.title
          return (
            <SingleSelectOption key={order} value={String(order)}>
              <Flex justifyContent="space-between" gap={4} width="100%">
                <Typography
                  textColor={
                    !occupant
                      ? 'success600'
                      : occupant.documentId === currentDocumentId
                        ? 'neutral800'
                        : 'danger600'
                  }
                >
                  {order} - {occupantLabel || 'Empty'}
                </Typography>
              </Flex>
            </SingleSelectOption>
          )
        })}
      </SingleSelect>
      <Box paddingTop={1}>
        <Field.Hint />
        <Field.Error />
      </Box>
    </Field.Root>
  )
}
