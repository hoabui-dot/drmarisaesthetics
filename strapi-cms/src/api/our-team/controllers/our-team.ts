import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::our-team.our-team' as any, ({ strapi }) => ({
  async find(ctx) {
    const sanitizedQuery = await this.sanitizeQuery(ctx)
    const entity = await strapi.documents('api::our-team.our-team' as any).findFirst({
      ...sanitizedQuery,
      status: ctx.query.status === 'draft' ? 'draft' : 'published',
      populate: <any>{
        seo: { populate: ['meta_image'] },
        sections: {
          on: {
            'our-team.hero-section': { populate: ['image'] },
            'our-team.editorial-section': { populate: { image: true, items: true, steps: true } },
            'our-team.revision-section': { populate: { image: true, concerns: true } },
            'our-team.faq-section': { populate: { items: true } },
          },
        },
      },
    })
    return this.transformResponse(entity)
  },
}))
