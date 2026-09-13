'use strict';

/**
 * Service metadata is intentionally smaller than Blog metadata. Services use
 * coverImage as their single editorial/meta image and keep SEO copy in the
 * seo component/metaDescription fields.
 */
module.exports = {
  async up(knex) {
    if (!(await knex.schema.hasTable('services'))) return;

    const removableColumns = ['excerpt', 'author_name', 'reading_time'];
    const existingColumns = [];
    for (const column of removableColumns) {
      if (await knex.schema.hasColumn('services', column)) existingColumns.push(column);
    }

    if (existingColumns.length) {
      await knex.schema.alterTable('services', (table) => {
        existingColumns.forEach((column) => table.dropColumn(column));
      });
    }

    // Older installations may have created a media relation for metaImage.
    // Drop only the exact Strapi-generated relation names when present; never
    // touch upload files or unrelated media relations.
    for (const tableName of ['services_meta_image_lnk', 'service_meta_image_lnk']) {
      if (await knex.schema.hasTable(tableName)) await knex.schema.dropTable(tableName);
    }
  },

  async down(knex) {
    if (!(await knex.schema.hasTable('services'))) return;

    await knex.schema.alterTable('services', (table) => {
      table.text('excerpt');
      table.string('author_name');
      table.string('reading_time');
    });
  },
};
