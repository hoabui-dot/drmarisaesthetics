import './seo-help.css'
import './website-settings.css'
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
const WEBSITE_SETTINGS_UID = 'api::website-setting.website-setting'
const WEBSITE_SETTINGS_FULL_WIDTH_FIELDS = new Set([
  'hospital_locations', 'header_navigation', 'footer_link_groups', 'contact_methods',
  'social_links', 'global_cta', 'booking_form', 'blog_categories', 'service_categories',
])

type WebsiteSettingsSection = {
  key: string
  fields: string[]
  title: { en: string; vi: string }
  description: { en: string; vi: string }
  defaultOpen?: boolean
}

const WEBSITE_SETTINGS_SECTIONS: WebsiteSettingsSection[] = [
  { key: 'identity', fields: ['site_name', 'logo', 'default_open_graph_image'], title: { en: 'Website identity & SEO', vi: 'Nhận diện website & SEO' }, description: { en: 'Brand identity and the default image used for social sharing.', vi: 'Nhận diện thương hiệu và hình ảnh mặc định khi chia sẻ website.' }, defaultOpen: true },
  { key: 'contact', fields: ['phone_primary', 'opening_hours', 'contact_methods', 'hospital_locations'], title: { en: 'Contact & hospital locations', vi: 'Liên hệ & địa điểm bệnh viện' }, description: { en: 'Primary contact details, contact methods, and hospital map locations.', vi: 'Thông tin liên hệ chính, phương thức liên hệ và địa điểm bệnh viện.' } },
  { key: 'navigation', fields: ['header_navigation'], title: { en: 'Header navigation', vi: 'Điều hướng Header' }, description: { en: 'Manage the header menu and its nested items.', vi: 'Quản lý menu Header và các mục menu con.' } },
  { key: 'footer', fields: ['footer_description', 'footer_link_groups', 'footer_copyright_text', 'footer_tagline'], title: { en: 'Footer', vi: 'Footer' }, description: { en: 'Footer description, navigation groups, and supporting text.', vi: 'Mô tả, nhóm liên kết và nội dung hiển thị ở footer.' } },
  { key: 'social', fields: ['social_links'], title: { en: 'Social links', vi: 'Liên kết mạng xã hội' }, description: { en: 'Social profiles displayed across the website.', vi: 'Các trang mạng xã hội được hiển thị trên website.' } },
  { key: 'cta', fields: ['global_cta'], title: { en: 'Global call to action', vi: 'CTA toàn cục' }, description: { en: 'Shared call-to-action content used across pages.', vi: 'Nội dung kêu gọi hành động dùng chung trên các trang.' } },
  { key: 'booking', fields: ['booking_form'], title: { en: 'Booking form', vi: 'Biểu mẫu đặt lịch' }, description: { en: 'Shared booking form configuration and content.', vi: 'Cấu hình và nội dung biểu mẫu đặt lịch dùng chung.' } },
  { key: 'categories', fields: ['blog_categories', 'service_categories'], title: { en: 'Blog & service categories', vi: 'Danh mục bài viết & dịch vụ' }, description: { en: 'Manage the categories used by News and Services filters.', vi: 'Quản lý danh mục dùng cho bộ lọc Tin tức và Dịch vụ.' }, defaultOpen: true },
]

type EditViewLayoutPayload = {
  layout?: { layout?: unknown[][]; [key: string]: unknown } | unknown[][]
  model?: string
  [key: string]: unknown
}

const isWebsiteSettingsEditView = (model?: string) => model === WEBSITE_SETTINGS_UID || (
  typeof window !== 'undefined' && decodeURIComponent(window.location.pathname).includes(`/content-manager/single-types/${WEBSITE_SETTINGS_UID}`)
)

const organizeWebsiteSettingsLayout = (payload: EditViewLayoutPayload) => {
  if (!isWebsiteSettingsEditView(payload.model) || !payload.layout) return payload
  const editLayout = payload.layout
  const panels = Array.isArray(editLayout) ? editLayout : editLayout.layout
  if (!Array.isArray(panels)) return payload

  const fieldsByName = new Map<string, any>()
  panels.flat(2).forEach((field: any) => {
    if (field && typeof field.name === 'string') fieldsByName.set(field.name, field)
  })
  const fullWidth = (name: string, field: any) => WEBSITE_SETTINGS_FULL_WIDTH_FIELDS.has(name) || ['component', 'dynamiczone', 'blocks'].includes(field?.type)
  const isMedia = (name: string, field: any) => name === 'logo' || name.endsWith('_image') || field?.type === 'media'
  const buildRows = (names: string[]) => {
    const rows: unknown[][] = []
    let compact: unknown[] = []
    const flush = () => { if (compact.length) rows.push(compact); compact = [] }
    ;[...names].sort((a, b) => Number(isMedia(b, fieldsByName.get(b))) - Number(isMedia(a, fieldsByName.get(a)))).forEach((name) => {
      const field = fieldsByName.get(name)
      if (!field) return
      if (fullWidth(name, field)) { flush(); rows.push([{ ...field, size: 12 }]); return }
      compact.push({ ...field, size: 6 })
      if (compact.length === 2) flush()
    })
    flush()
    return rows
  }
  const assigned = new Set(WEBSITE_SETTINGS_SECTIONS.flatMap((section) => section.fields))
  const unassigned = [...fieldsByName.keys()].filter((name) => !assigned.has(name))
  const layout = WEBSITE_SETTINGS_SECTIONS.map((section, index) => [
    ...buildRows(section.fields),
    ...(index === 0 ? buildRows(unassigned) : []),
  ]).filter((panel) => panel.length)

  return { ...payload, layout: Array.isArray(editLayout) ? layout : { ...editLayout, layout } }
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

const websiteSettingsLocale = (): 'en' | 'vi' => {
  if (typeof document !== 'undefined' && document.documentElement.lang.toLowerCase().startsWith('vi')) return 'vi'
  try {
    const localeKey = Object.keys(localStorage).find((key) => /locale|language/i.test(key))
    if (localeKey && (localStorage.getItem(localeKey) || '').toLowerCase().startsWith('vi')) return 'vi'
  } catch { /* localStorage may be unavailable */ }
  return 'en'
}

const findWebsiteSettingsField = (name: string) => {
  const root: ParentNode = document.querySelector('form') || document
  const escaped = name.replace(/["\\]/g, '\\$&')
  const exact = root.querySelector<HTMLElement>([
    `[name="${escaped}"]`, `[name$="[${escaped}]"]`, `[name$=".${escaped}"]`,
    `[data-strapi-field="${escaped}"]`, `[data-field-name="${escaped}"]`, `[data-field="${escaped}"]`,
    `#${escaped}`, `[id$="-${escaped}"]`, `[id$=".${escaped}"]`,
  ].join(','))
  if (exact) return exact.closest<HTMLElement>('[data-strapi-field],[data-field-name],[data-name],[role="group"]') || exact
  const normalized = name.replaceAll('_', ' ').toLowerCase()
  return Array.from(root.querySelectorAll<HTMLElement>('label,legend,h2,h3,h4,[data-strapi-field],[data-field-name]')).find((el) =>
    el.textContent?.replace(/[:*]/g, '').replace(/\s+/g, ' ').trim().toLowerCase() === normalized,
  ) || null
}

const isWebsiteSettingsSurface = (element: HTMLElement) => {
  const style = window.getComputedStyle(element)
  return Number.parseFloat(style.borderRadius) > 0 && (
    (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') || style.boxShadow !== 'none'
  )
}

const findWebsiteSettingsPanel = (fieldNames: string[]) => {
  const anchors = fieldNames.map(findWebsiteSettingsField).filter((item): item is HTMLElement => Boolean(item))
  if (!anchors.length) return null
  const form = anchors[0].closest('form') || document.body
  const chains = anchors.map((anchor) => {
    const chain: HTMLElement[] = []
    let node: HTMLElement | null = anchor
    while (node && node !== form) {
      if (isWebsiteSettingsSurface(node)) chain.push(node)
      node = node.parentElement
    }
    return chain
  })
  const shared = chains[0].find((candidate) => chains.every((chain) => chain.includes(candidate)))
  if (shared) return shared
  const counts = new Map<HTMLElement, number>()
  chains.flat().forEach((surface) => counts.set(surface, (counts.get(surface) || 0) + 1))
  return [...counts.keys()].sort((a, b) => (counts.get(b) || 0) - (counts.get(a) || 0))[0] || null
}

const enhanceWebsiteSettingsAccordions = () => {
  if (!isWebsiteSettingsEditView()) return
  const locale = websiteSettingsLocale()
  WEBSITE_SETTINGS_SECTIONS.forEach((section) => {
    const panel = findWebsiteSettingsPanel(section.fields)
    if (!panel) return
    const id = `drmaris-website-settings-${section.key}`
    panel.classList.add('drmaris-settings-section')
    panel.dataset.drmarisSettingsSection = section.key
    panel.id = id
    const open = panel.dataset.drmarisSettingsOpen
      ? panel.dataset.drmarisSettingsOpen === 'true'
      : Boolean(section.defaultOpen)

    let toggle = panel.querySelector<HTMLButtonElement>(':scope > .drmaris-settings-toggle')
    if (!toggle) {
      toggle = document.createElement('button')
      toggle.type = 'button'
      toggle.className = 'drmaris-settings-toggle'
      const heading = document.createElement('span')
      heading.className = 'drmaris-settings-heading'
      heading.textContent = section.title[locale]
      const description = document.createElement('small')
      description.textContent = section.description[locale]
      const copy = document.createElement('span')
      copy.className = 'drmaris-settings-copy'
      copy.append(heading, description)
      const icon = document.createElement('span')
      icon.className = 'drmaris-settings-icon'
      icon.setAttribute('aria-hidden', 'true')
      toggle.append(copy, icon)
      panel.prepend(toggle)
    }

    const contentNodes = () => Array.from(panel.children).filter((child) => child !== toggle) as HTMLElement[]
    const applyState = (expanded: boolean) => {
      panel.dataset.drmarisSettingsOpen = String(expanded)
      panel.classList.toggle('is-open', expanded)
      toggle!.setAttribute('aria-expanded', String(expanded))
      toggle!.setAttribute('aria-controls', `${id}-content`)
      toggle!.setAttribute('aria-label', `${expanded ? (locale === 'vi' ? 'Thu gọn' : 'Collapse') : (locale === 'vi' ? 'Mở rộng' : 'Expand')} ${section.title[locale]}`)
      const icon = toggle!.querySelector('.drmaris-settings-icon')
      if (icon) icon.textContent = expanded ? '−' : '+'
      contentNodes().forEach((node, index) => {
        if (index === 0) node.id = `${id}-content`
        node.hidden = !expanded
        node.setAttribute('aria-hidden', String(!expanded))
      })
    }
    if (!toggle.dataset.bound) {
      toggle.dataset.bound = 'true'
      toggle.addEventListener('click', () => applyState(panel.dataset.drmarisSettingsOpen !== 'true'))
    }
    applyState(open)
  })
}

const startWebsiteSettingsAccordionObserver = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const appWindow = window as typeof window & { __drmarisWebsiteSettingsAccordionObserver?: boolean }
  if (appWindow.__drmarisWebsiteSettingsAccordionObserver) return
  if (!document.body) { window.setTimeout(startWebsiteSettingsAccordionObserver, 50); return }
  appWindow.__drmarisWebsiteSettingsAccordionObserver = true
  let scheduled = false
  const schedule = () => {
    if (scheduled) return
    scheduled = true
    window.requestAnimationFrame(() => {
      scheduled = false
      try { enhanceWebsiteSettingsAccordions() }
      catch (error) { console.error('[DrMaris Admin] Website Settings accordion enhancement failed', error) }
    })
  }
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true })
  window.addEventListener('popstate', schedule)
  schedule()
  ;[100, 400, 1000, 2000].forEach((delay) => window.setTimeout(schedule, delay))
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
      organizeWebsiteSettingsLayout(moveServiceCategoryBeforeBetterBlocks(payload))
    ))
  },

  bootstrap() {
    if (typeof window === 'undefined') return

    installClipboardFallback()
    startWebsiteCategoryIdInputHider()
    startWebsiteSettingsAccordionObserver()

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
