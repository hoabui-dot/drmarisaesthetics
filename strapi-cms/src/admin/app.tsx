import './seo-help.css'
import englishTranslations from './i18n/en.json'
import vietnameseTranslations from './i18n/vi.json'
import type { StrapiApp } from '@strapi/admin/strapi-admin'

const SERVICE_NAVIGATION_ORDER_FIELD = 'service-navigation-order'
const RESULT_CATEGORY_ID_FIELD = 'result-category-id'
const RESULT_CATEGORY_MULTI_SELECT_FIELD = 'result-category-multi-select'
const HOMEPAGE_RESULT_CASE_ORDER_FIELD = 'homepage-result-case-order'
const WEBSITE_CATEGORY_ID_FIELD = 'website-category-id'
const LIST_VIEW_COLUMNS_HOOK = 'Admin/CM/pages/ListView/inject-column-in-table'
const EDIT_VIEW_LAYOUT_HOOK = 'Admin/CM/pages/EditView/mutate-edit-view-layout'
const SERVICE_UID = 'api::service.service'
const BOOKING_SUBMISSION_UID = 'api::booking-submission.booking-submission'

type EditViewLayoutPayload = {
  layout?: { layout?: unknown[][]; [key: string]: unknown } | unknown[][]
  model?: string
  [key: string]: unknown
}

const moveServiceCategoryBeforeBetterBlocks = (payload: EditViewLayoutPayload) => {
  const isServiceEditView = payload.model === SERVICE_UID || (
    typeof window !== 'undefined' &&
    decodeURIComponent(window.location.pathname).includes(`/content-manager/collection-types/${SERVICE_UID}`)
  )
  if (!isServiceEditView || !payload.layout) return payload

  const editLayout = payload.layout
  const rows = (Array.isArray(editLayout) ? editLayout : editLayout.layout) as unknown[][]
  if (!Array.isArray(rows) || rows.some((row) => !Array.isArray(row))) return payload

  let categoryField: unknown
  rows.flat().forEach((field: unknown) => {
    if (
      !categoryField &&
      field &&
      typeof field === 'object' &&
      'name' in field &&
      field.name === 'service_category_id'
    ) categoryField = field
  })
  if (!categoryField) return payload

  const withoutCategory = rows
    .map((row) => row.filter((field) => field !== categoryField))
    .filter((row) => row.length > 0)

  let inserted = false
  const nextRows: unknown[][] = []
  withoutCategory.forEach((row) => {
    if (!inserted && row.some((field) => (
      field &&
      typeof field === 'object' &&
      'name' in field &&
      field.name === 'contentBetterBlocks'
    ))) {
      nextRows.push([categoryField])
      inserted = true
    }
    nextRows.push(row)
  })

  if (!inserted) return payload
  return {
    ...payload,
    layout: Array.isArray(editLayout) ? nextRows : { ...editLayout, layout: nextRows },
  }
}

type AdminResponsePayload = {
  error?: unknown
  data?: {
    error?: unknown
  }
}

const isAdminMutation = (url: string, method: string) => {
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())
  const isRelevantEndpoint = url.includes('/content-manager/') || url.includes('/api/homepage')
  return isMutation && isRelevantEndpoint
}

const hideWebsiteCategoryIdInputs = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const pathname = decodeURIComponent(window.location.pathname)
  if (!pathname.includes('website-setting')) return

  if (!document.getElementById('smilux-hidden-category-id-style')) {
    const style = document.createElement('style')
    style.id = 'smilux-hidden-category-id-style'
    style.textContent = '.smilux-hidden-category-id-field{display:none!important}'
    document.head.append(style)
  }

  const candidates = Array.from(document.querySelectorAll<HTMLElement>(
    '[name*="category_id"], [data-strapi-field*="category_id"], [data-field-name*="category_id"], [data-field*="category_id"]',
  ))
  const labels = Array.from(document.querySelectorAll<HTMLElement>('label,[aria-label]'))
    .filter((element) => /category[ _-]?id/i.test(`${element.textContent || ''} ${element.getAttribute('aria-label') || ''}`))
  candidates.push(...labels)

  candidates.forEach((candidate) => {
    let field = candidate.closest<HTMLElement>(
      '[data-strapi-field*="category_id"], [data-field-name*="category_id"], [data-field*="category_id"]',
    )
    if (!field) {
      let parent = candidate.parentElement
      while (parent && parent !== document.body) {
        const controls = parent.querySelectorAll('input,textarea,select,[role="combobox"]')
        const hasCategoryLabel = /category[ _-]?id/i.test(parent.textContent || '')
        if (controls.length === 1 && hasCategoryLabel) {
          field = parent
          break
        }
        parent = parent.parentElement
      }
    }
    if (field && !field.classList.contains('smilux-hidden-category-id-field')) {
      field.classList.add('smilux-hidden-category-id-field')
      field.setAttribute('aria-hidden', 'true')
    }
  })
}

const startWebsiteCategoryIdInputHider = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !document.body) return
  const adminWindow = window as typeof window & { __smiluxWebsiteCategoryIdHider?: boolean }
  if (adminWindow.__smiluxWebsiteCategoryIdHider) return
  adminWindow.__smiluxWebsiteCategoryIdHider = true

  let scheduled = false
  const schedule = () => {
    if (scheduled) return
    scheduled = true
    const run = () => {
      scheduled = false
      hideWebsiteCategoryIdInputs()
    }
    if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(run)
    else window.setTimeout(run, 0)
  }
  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('popstate', schedule)
  schedule()
}

const readResponsePayload = async (response: Response): Promise<AdminResponsePayload | string | null> => {
  const cloned = response.clone()
  const contentType = cloned.headers.get('content-type') || ''

  try {
    if (contentType.includes('application/json')) return await cloned.json() as AdminResponsePayload
    return await cloned.text()
  } catch {
    return null
  }
}

type ClipboardWithFallback = Clipboard & {
  __smiluxClipboardFallbackInstalled?: boolean
}

const copyWithExecCommand = (text: string) => {
  const textarea = document.createElement('textarea')
  const activeElement = document.activeElement as HTMLElement | null

  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '-9999px'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'

  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)

  let copied = false
  try {
    copied = document.execCommand('copy')
  } finally {
    textarea.remove()
    activeElement?.focus?.({ preventScroll: true })
  }

  return copied
}

const installClipboardFallback = () => {
  if (typeof navigator === 'undefined' || typeof document === 'undefined') return

  const navigatorWithClipboard = navigator as Navigator & {
    clipboard?: ClipboardWithFallback
  }
  const clipboard = navigatorWithClipboard.clipboard

  if (clipboard?.__smiluxClipboardFallbackInstalled) return

  const nativeWriteText = clipboard?.writeText?.bind(clipboard)
  const writeText = async (text: string) => {
    if (typeof text !== 'string') {
      throw new TypeError('Clipboard text must be a string')
    }

    try {
      if (nativeWriteText) {
        await nativeWriteText(text)
        return
      }
    } catch (error) {
      console.warn('[Smilux Admin] Native clipboard unavailable; using document fallback', error)
    }

    if (!copyWithExecCommand(text)) {
      throw new Error('Clipboard fallback failed')
    }
  }

  const fallbackClipboard = (clipboard || {}) as ClipboardWithFallback
  Object.defineProperty(fallbackClipboard, 'writeText', {
    configurable: true,
    value: writeText,
  })
  Object.defineProperty(fallbackClipboard, '__smiluxClipboardFallbackInstalled', {
    configurable: true,
    value: true,
  })

  if (!clipboard) {
    Object.defineProperty(navigatorWithClipboard, 'clipboard', {
      configurable: true,
      value: fallbackClipboard,
    })
  }
}

const formatAdminDateTime = (value: unknown) => {
  if (!value) return '-'

  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return '-'

  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]))

  return `${values.hour}:${values.minute} ${values.day}/${values.month}/${values.year}`
}

const formatAdminPhone = (value: unknown) => {
  const phone = String(value || '').trim()
  if (!phone) return '—'
  if (phone.startsWith('+84') && phone.length >= 10) {
    const digits = phone.slice(3)
    return `+84 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`.trim()
  }
  return phone
}

const getContentTypeUid = (payload: any) => {
  const contentType = payload?.contentType
  return typeof contentType === 'string' ? contentType : contentType?.uid || payload?.uid || payload?.contentTypeUid
}

const isBookingSubmissionList = (payload: any) => {
  const uid = getContentTypeUid(payload)
  if (uid) return uid === BOOKING_SUBMISSION_UID
  const names = (payload?.displayedHeaders || payload?.headers || []).map((header: any) => header?.name)
  return names.includes('submission_type') && names.includes('booking_status')
}

const submissionBadge = (value: unknown, colors: { background: string; text: string }) => {
  const label = String(value || '—')
  return <span style={{ display: 'inline-block', padding: '3px 8px', border: `1px solid ${colors.text}33`, borderRadius: 4, background: colors.background, color: colors.text, fontSize: 14, fontWeight: 600 }}>{label}</span>
}

const formatSubmissionType = (value: unknown) => {
  const colors: Record<string, { background: string; text: string }> = {
    booking: { background: '#EAF4FF', text: '#175CD3' },
    promotion: { background: '#FFF7E6', text: '#B54708' },
    newsletter: { background: '#ECFDF3', text: '#027A48' },
  }
  return submissionBadge(value, colors[String(value)] || { background: '#F2F4F7', text: '#475467' })
}

const formatBookingStatus = (value: unknown) => {
  const colors: Record<string, { background: string; text: string }> = {
    new: { background: '#EAF4FF', text: '#175CD3' },
    contacted: { background: '#FFF7E6', text: '#B54708' },
    scheduled: { background: '#F4F3FF', text: '#6941C6' },
    completed: { background: '#ECFDF3', text: '#027A48' },
    cancelled: { background: '#FEF3F2', text: '#B42318' },
  }
  return submissionBadge(value, colors[String(value)] || { background: '#F2F4F7', text: '#475467' })
}

const configureBookingSubmissionHeaders = (payload: any) => {
  const headers = Array.isArray(payload?.displayedHeaders) ? payload.displayedHeaders : []
  const headerByName = new Map(headers.map((header: any) => [header.name, header]))
  const fallback = (name: string, label: string) => headerByName.get(name) || { name, label, fieldSchema: { name } }
  const known = [
    { name: 'full_name', label: 'Full Name' },
    { name: 'submission_type', label: 'Submission Type' },
    { name: 'submission_source', label: 'Submitted From' },
    { name: 'phone_number', label: 'Contact Information' },
    { name: 'country', label: 'Country' },
    { name: 'createdAt', label: 'Created At' },
    { name: 'booking_status', label: 'Status' },
  ]
  const displayedHeaders = known.map(({ name, label }) => {
    const header = fallback(name, label)
    const next = { ...header, label }
    if (name === 'phone_number') next.cellFormatter = (row: any) => <div style={{ whiteSpace: 'pre-line', lineHeight: 1.45, fontSize: 14 }}>{[formatAdminPhone(row?.phone_number), row?.email ? String(row.email) : ''].filter(Boolean).join('\n')}</div>
    if (name === 'submission_type') next.cellFormatter = (row: any) => formatSubmissionType(row?.submission_type)
    if (name === 'submission_source') next.cellFormatter = (row: any) => {
      const source = String(row?.submission_source || '')
      const labels: Record<string, string> = {
        homepage: 'Homepage', about_us: 'About Us', contact: 'Contact', booking_modal: 'Booking Modal',
        service_detail: 'Service Detail', promotion_popup: 'Promotion Popup', blog_newsletter: 'Blog Newsletter',
      }
      return labels[source] || source.replace(/_/g, ' ') || '—'
    }
    if (name === 'createdAt') next.cellFormatter = (row: any) => formatAdminDateTime(row?.createdAt)
    if (name === 'booking_status') next.cellFormatter = (row: any) => formatBookingStatus(row?.booking_status)
    return next
  })
  return { ...payload, displayedHeaders }
}

export default {
  // Admin interface languages are independent from content locales. Register
  // both explicitly so English is available in Profile → Experience and
  // custom field labels do not fall back to raw translation keys.
  config: {
    locales: ['en', 'vi'],
    translations: {
      en: englishTranslations,
      vi: vietnameseTranslations,
    },
  },

  register(app: StrapiApp) {
    app.customFields.register({
      name: SERVICE_NAVIGATION_ORDER_FIELD,
      type: 'integer',
      intlLabel: {
        id: 'custom-field.service-navigation-order.label',
        defaultMessage: 'Header Menu Order',
      },
      intlDescription: {
        id: 'custom-field.service-navigation-order.description',
        defaultMessage: 'Choose the position of this service in the header Services menu.',
      },
      components: {
        Input: async () => import('./ServiceNavigationOrderInput'),
      },
    })

    app.customFields.register({
      name: RESULT_CATEGORY_ID_FIELD,
      type: 'string',
      intlLabel: {
        id: 'custom-field.result-category-id.label',
        defaultMessage: 'Category ID',
      },
      intlDescription: {
        id: 'custom-field.result-category-id.description',
        defaultMessage: 'Generated automatically from the category definition.',
      },
      components: {
        Input: async () => import('./ResultCategoryInput'),
      },
    })

    app.customFields.register({
      name: RESULT_CATEGORY_MULTI_SELECT_FIELD,
      type: 'json',
      intlLabel: {
        id: 'custom-field.result-category-multi-select.label',
        defaultMessage: 'Result categories',
      },
      intlDescription: {
        id: 'custom-field.result-category-multi-select.description',
        defaultMessage: 'Optionally select one or more categories for this case.',
      },
      components: {
        Input: async () => import('./ResultCategoryInput'),
      },
    })

    app.customFields.register({
      name: HOMEPAGE_RESULT_CASE_ORDER_FIELD,
      type: 'json',
      intlLabel: {
        id: 'custom-field.homepage-result-case-order.label',
        defaultMessage: 'Homepage patient cases',
      },
      intlDescription: {
        id: 'custom-field.homepage-result-case-order.description',
        defaultMessage: 'Choose up to six cases from Patient Results. Reorder selected cases to control their display order on the homepage.',
      },
      components: {
        Input: async () => import('./HomepageResultCaseOrderInput'),
      },
    })

    app.customFields.register({
      name: WEBSITE_CATEGORY_ID_FIELD,
      type: 'string',
      intlLabel: {
        id: 'custom-field.website-category-id.label',
        defaultMessage: 'Website category',
      },
      intlDescription: {
        id: 'custom-field.website-category-id.description',
        defaultMessage: 'Choose a category managed in Website Settings.',
      },
      components: {
        Input: async () => import('./WebsiteCategoryInput'),
      },
    })

    app.registerHook(LIST_VIEW_COLUMNS_HOOK, (payload: any) => ({
      ...(isBookingSubmissionList(payload) ? configureBookingSubmissionHeaders(payload) : payload),
      ...(isBookingSubmissionList(payload) ? {} : {
        displayedHeaders: (payload.displayedHeaders || []).map((header: any) =>
          header.name === 'updatedAt'
            ? { ...header, cellFormatter: (row: { updatedAt?: string }) => formatAdminDateTime(row.updatedAt) }
            : header,
        ),
      }),
    }))

    app.registerHook(EDIT_VIEW_LAYOUT_HOOK, (payload: EditViewLayoutPayload) => (
      moveServiceCategoryBeforeBetterBlocks(payload)
    ))
  },

  bootstrap() {
    if (typeof window === 'undefined') return

    installClipboardFallback()
    startWebsiteCategoryIdInputHider()

    const debugWindow = window as typeof window & { __smiluxAdminFetchDebug?: boolean }
    if (debugWindow.__smiluxAdminFetchDebug) return
    debugWindow.__smiluxAdminFetchDebug = true

    const nativeFetch = window.fetch.bind(window)

    window.fetch = async (input, init) => {
      const request = input instanceof Request ? input : undefined
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      const method = (init?.method || request?.method || 'GET').toUpperCase()
      const requestBody = init?.body || request?.body || null
      const shouldLog = isAdminMutation(url, method)

      console.debug('[Smilux Admin] fetch start', {
        method,
        url,
        requestBody,
        currentUrl: window.location.href,
      })

      let response: Response
      try {
        response = await nativeFetch(input, init)
      } catch (error) {
        console.error('[Smilux Admin] fetch failed before receiving a response', {
          method,
          url,
          requestBody,
          isHomepageOrContentManagerRequest: url.includes('/content-manager/') || url.includes('/api/homepage'),
          error,
        })
        throw error
      }

      if (shouldLog) {
        const payload = await readResponsePayload(response)
        const logData = {
          method,
          url,
          status: response.status,
          statusText: response.statusText,
          requestBody,
          responseBody: payload,
        }

        if (!response.ok || (payload && typeof payload === 'object' && ('error' in payload || payload.data?.error))) {
          console.error('[Smilux Admin] Homepage save/publish response', logData)
        } else {
          console.info('[Smilux Admin] Homepage save/publish response', logData)
        }
      }

      return response
    }

    window.addEventListener('unhandledrejection', (event) => {
      console.error('[Smilux Admin] unhandled promise rejection', {
        reason: event.reason,
        currentUrl: window.location.href,
      })
    })
  },
}
