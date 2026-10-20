'use strict';

module.exports = {
  async up(knex) {
    const tableName = 'components_contact_consultation_sections';
    if (!(await knex.schema.hasTable(tableName))) return;
    if (!(await knex.schema.hasColumn(tableName, 'privacy_policy_href'))) return;

    await knex.schema.alterTable(tableName, (table) => {
      table.dropColumn('privacy_policy_href');
    });
  },

  async down(knex) {
    const tableName = 'components_contact_consultation_sections';
    if (!(await knex.schema.hasTable(tableName))) return;
    if (await knex.schema.hasColumn(tableName, 'privacy_policy_href')) return;

    await knex.schema.alterTable(tableName, (table) => {
      table.string('privacy_policy_href');
    });
  },
};
