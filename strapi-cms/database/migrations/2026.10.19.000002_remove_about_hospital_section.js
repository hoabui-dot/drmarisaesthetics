'use strict';

/**
 * Remove the retired About Page hospital section from the dynamic zone and
 * drop only its component-owned storage. Uploaded media files are untouched.
 */
module.exports = {
  async up(knex) {
    const aboutRelations = 'about_pages_cmps';
    if (await knex.schema.hasTable(aboutRelations)) {
      const hasComponentType = await knex.schema.hasColumn(aboutRelations, 'component_type');
      if (hasComponentType) {
        await knex(aboutRelations).where({ component_type: 'about.hospital' }).del();
      }
    }

    for (const tableName of [
      'components_about_hospitals_cmps',
      'components_about_hospitals_image_lnk',
      'components_about_hospitals',
    ]) {
      if (await knex.schema.hasTable(tableName)) {
        await knex.schema.dropTable(tableName);
      }
    }
  },

  async down() {
    // Removed editorial content is not recreated automatically on rollback.
    // The component schema can be restored from source control if required.
  },
};
