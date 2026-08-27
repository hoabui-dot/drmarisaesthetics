'use strict';

module.exports = {
  async up(knex) {
    const hasTable = await knex.schema.hasTable('components_homepage_video_heroes');
    
    if (hasTable) {
      const hasCtaLink = await knex.schema.hasColumn('components_homepage_video_heroes', 'cta_link');
      const hasOverlayOpacity = await knex.schema.hasColumn('components_homepage_video_heroes', 'overlay_opacity');
      
      await knex.schema.alterTable('components_homepage_video_heroes', (table) => {
        if (hasCtaLink) {
          table.dropColumn('cta_link');
        }
        if (hasOverlayOpacity) {
          table.dropColumn('overlay_opacity');
        }
      });
    }
  },

  async down(knex) {
    const hasTable = await knex.schema.hasTable('components_homepage_video_heroes');
    
    if (hasTable) {
      await knex.schema.alterTable('components_homepage_video_heroes', (table) => {
        table.string('cta_link');
        table.decimal('overlay_opacity');
      });
    }
  },
};
