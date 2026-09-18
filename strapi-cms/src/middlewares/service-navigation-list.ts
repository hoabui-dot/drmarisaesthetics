type ServiceListRow = {
  navigationOrder?: number | null
  [key: string]: unknown
}

const SERVICE_MODEL = 'api::service.service'

const isNavigationOrderSort = (sort: unknown) => {
  const values = Array.isArray(sort) ? sort : [sort]
  return values.some((value) => {
    if (typeof value === 'string') return value.split(':')[0] === 'navigationOrder'
    if (value && typeof value === 'object') return Object.prototype.hasOwnProperty.call(value, 'navigationOrder')
    return false
  })
}

const compareNavigationOrder = (left: ServiceListRow, right: ServiceListRow) => {
  const leftOrder = Number(left.navigationOrder)
  const rightOrder = Number(right.navigationOrder)
  const leftIsAssigned = Number.isInteger(leftOrder) && leftOrder > 0
  const rightIsAssigned = Number.isInteger(rightOrder) && rightOrder > 0

  if (leftIsAssigned && rightIsAssigned) return leftOrder - rightOrder
  if (leftIsAssigned) return -1
  if (rightIsAssigned) return 1
  return 0
}

export default () => {
  return async (ctx: any, next: () => Promise<void>) => {
    const isServiceList =
      ctx.method === 'GET' &&
      ctx.path === `/content-manager/collection-types/${SERVICE_MODEL}` &&
      isNavigationOrderSort(ctx.query?.sort)

    if (!isServiceList) {
      await next()
      return
    }

    const requestedPage = Math.max(Number(ctx.query.page) || 1, 1)
    const requestedPageSize = Math.min(Math.max(Number(ctx.query.pageSize) || 10, 1), 100)

    // Fetch enough rows for the service collection before applying NULLS LAST
    // ordering and the requested Content Manager page locally.
    ctx.query.page = '1'
    ctx.query.pageSize = '100'
    await next()

    if (!ctx.body || !Array.isArray(ctx.body.results)) return

    const results = [...(ctx.body.results as ServiceListRow[])].sort(compareNavigationOrder)
    const start = (requestedPage - 1) * requestedPageSize
    const total = Number(ctx.body.pagination?.total) || results.length

    ctx.body.results = results.slice(start, start + requestedPageSize)
    ctx.body.pagination = {
      ...(ctx.body.pagination || {}),
      page: requestedPage,
      pageSize: requestedPageSize,
      pageCount: Math.max(Math.ceil(total / requestedPageSize), 1),
      total,
    }
  }
}
