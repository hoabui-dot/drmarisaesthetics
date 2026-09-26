import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::result.result' as any, ({ strapi }) => ({
  async find(ctx) {
    const sanitizedQuery = await this.sanitizeQuery(ctx)
    const entity = await strapi.documents('api::result.result' as any).findFirst({
      ...sanitizedQuery,
      status: ctx.query.status === 'draft' ? 'draft' : 'published',
      populate: {
        categories: true,
        cases: { populate: { image: true } },
      },
    })
    return this.transformResponse(entity)
  },
}))
