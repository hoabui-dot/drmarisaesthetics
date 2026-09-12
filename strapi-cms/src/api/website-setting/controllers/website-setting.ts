import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::website-setting.website-setting' as any, ({ strapi }) => ({
  async find(ctx) {
    const sanitizedQuery = await this.sanitizeQuery(ctx)
    const entity = await strapi.documents('api::website-setting.website-setting' as any).findFirst({
      ...sanitizedQuery,
      status: ctx.query.status === 'draft' ? 'draft' : 'published',
      populate: {
        logo: true,
        favicon: true,
        contact_methods: { populate: { icon: true } },
        social_links: true,
      },
    })
    return this.transformResponse(entity)
  },
}))
