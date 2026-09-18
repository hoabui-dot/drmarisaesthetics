'use strict';

/**
 * Converts the Deep Plane single type from eight fixed component fields to
 * one ordered dynamic zone. Existing component rows are retained; only their
 * relation metadata changes from the old field names to `sections`.
 */
module.exports = {
  async up(knex) {
    const relationTable = 'deep_plane_facelift_specialists_cmps';
    if (!(await knex.schema.hasTable(relationTable))) return;

    const componentOrder = {
      'deep-plane.hero': 1,
      'deep-plane.journey': 2,
      'deep-plane.recovery': 3,
      'deep-plane.certifications': 4,
      'deep-plane.safety': 5,
      'deep-plane.credentials': 6,
      'deep-plane.faq': 7,
      'deep-plane.consultation': 8,
    };

    await knex.transaction(async (trx) => {
      const rows = await trx(relationTable)
        .select('id', 'entity_id', 'component_type')
        .whereIn('component_type', Object.keys(componentOrder))
        .orderBy(['entity_id', 'id']);

      const counters = new Map();
      for (const row of rows) {
        const order = componentOrder[row.component_type];
        if (!order) continue;
        const key = `${row.entity_id}:${order}`;
        const duplicateIndex = counters.get(key) || 0;
        counters.set(key, duplicateIndex + 1);

        await trx(relationTable)
          .where({ id: row.id })
          .update({
            field: 'sections',
            order: order + duplicateIndex,
          });
      }
    });
  },

  async down() {
    // The old fixed-field relation cannot be restored safely without knowing
    // whether an editor reordered or removed a section after this migration.
    // Content rows remain intact, so rollback is intentionally non-destructive.
  },
};
