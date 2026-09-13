import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::treatments-page.treatments-page' as any, ({ strapi }) => ({
  async find(ctx) {
    const sanitizedQuery = await this.sanitizeQuery(ctx)
    const entity = await strapi.documents('api::treatments-page.treatments-page' as any).findFirst({
      ...sanitizedQuery,
      status: ctx.query.status === 'draft' ? 'draft' : 'published',
      populate: {
        seo: { populate: ['meta_image'] },
        sections: { on: {
          'treatments-page.hero-section': { populate: ['image'] },
          'treatments-page.editorial-section': { populate: { image: true, items: true } },
        } },
      },
    } as any)
    return this.transformResponse(entity)
  },
}))
