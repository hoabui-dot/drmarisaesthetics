import './seo-help.css'
import vietnameseTranslations from './i18n/vi.json'

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

export default {
  // Admin interface languages are independent from content locales. English
  // remains Strapi's fallback; Vietnamese is exposed in Profile → Experience.
  config: {
    locales: ['vi'],
    translations: {
      vi: vietnameseTranslations,
    },
  },

  bootstrap() {
    if (typeof window === 'undefined') return

    installClipboardFallback()

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
