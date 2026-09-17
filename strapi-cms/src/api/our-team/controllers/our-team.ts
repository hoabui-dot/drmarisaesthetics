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
            'our-team.professional-section': { populate: { image: true, items: true, steps: true } },
            'our-team.international-section': { populate: { image: true, steps: true } },
            'our-team.revision-section': { populate: { image: true, concerns: true } },
            'our-team.authority-section': { populate: { cards: { populate: { items: true } } } },
            'our-team.credentials-section': { populate: { rows: true } },
            'our-team.hospital-section': { populate: { image: true, proof_items: true } },
            'our-team.faq-section': { populate: { background_image: true, items: true } },
          },
        },
      },
    })
    return this.transformResponse(entity)
  },
}))
