import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::website-setting.website-setting' as any, ({ strapi }) => ({
  async find(ctx) {
    const sanitizedQuery = await this.sanitizeQuery(ctx)
    const entity = await strapi.documents('api::website-setting.website-setting' as any).findFirst({
      ...sanitizedQuery,
      status: ctx.query.status === 'draft' ? 'draft' : 'published',
      populate: {
        logo: true,
        default_open_graph_image: true,
        header_navigation: { populate: { children: true } },
        footer_link_groups: { populate: { links: true } },
        contact_methods: { populate: { icon: true } },
        social_links: true,
        global_cta: { populate: { background_image: true, steps: true } },
        booking_form: { populate: { visual_image: true, visual_points: true } },
      },
    })
    return this.transformResponse(entity)
  },
}))
