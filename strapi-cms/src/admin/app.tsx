import './seo-help.css'

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

export default {
  bootstrap() {
    if (typeof window === 'undefined') return

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
