const { Client } = require('pg');
const client = new Client({ host: '100.68.50.41', port: 5437, database: 'dental_cms_strapi', user: 'postgres', password: 'postgres' });

async function cloneComponents() {
  await client.connect();

  try {
    const pubId = 14;
    const draftId = 11;

    // Fetch all components linked to Published
    const { rows: pubCmps } = await client.query('SELECT * FROM about_pages_cmps WHERE entity_id = $1', [pubId]);

    // Clear old Draft links just in case
    await client.query('DELETE FROM about_pages_cmps WHERE entity_id = $1', [draftId]);

    for (const cmp of pubCmps) {
      if (cmp.field === 'hero') {
        const { rows } = await client.query('SELECT * FROM components_about_heroes WHERE id = $1', [cmp.cmp_id]);
        if (rows.length === 0) continue;
        const o = rows[0];
        const res = await client.query(
          'INSERT INTO components_about_heroes (badge, title, subtitle, description, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id',
          [o.badge, o.title, o.subtitle, o.description]
        );
        const newId = res.rows[0].id;
        await client.query('INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field) VALUES ($1, $2, $3, $4)', [draftId, newId, cmp.component_type, cmp.field]);
      } 
      else if (cmp.field === 'cta') {
        const { rows } = await client.query('SELECT * FROM components_about_ctas WHERE id = $1', [cmp.cmp_id]);
        if (rows.length === 0) continue;
        const o = rows[0];
        const res = await client.query(
          'INSERT INTO components_about_ctas (badge, title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING id',
          [o.badge, o.title, o.description, o.primary_button_text, o.primary_button_link, o.secondary_button_text, o.secondary_button_link]
        );
        const newId = res.rows[0].id;
        await client.query('INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field) VALUES ($1, $2, $3, $4)', [draftId, newId, cmp.component_type, cmp.field]);
      }
      else if (cmp.field === 'excellence') {
        const { rows } = await client.query('SELECT * FROM components_about_excellences WHERE id = $1', [cmp.cmp_id]);
        if (rows.length === 0) continue;
        const o = rows[0];
        const res = await client.query(
          'INSERT INTO components_about_excellences (badge, title, description, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
          [o.badge, o.title, o.description]
        );
        const newId = res.rows[0].id;
        await client.query('INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field) VALUES ($1, $2, $3, $4)', [draftId, newId, cmp.component_type, cmp.field]);
        
        // Clone subcomponents
        const sub = await client.query("SELECT * FROM components_about_excellences_cmps WHERE entity_id = $1", [cmp.cmp_id]);
        for (const s of sub.rows) {
           const { rows: stats } = await client.query('SELECT * FROM components_about_excellence_stats WHERE id = $1', [s.cmp_id]);
           const stat = stats[0];
           const r = await client.query('INSERT INTO components_about_excellence_stats (value, label, icon, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id', [stat.value, stat.label, stat.icon]);
           await client.query('INSERT INTO components_about_excellences_cmps (entity_id, cmp_id, component_type, field) VALUES ($1, $2, $3, $4)', [newId, r.rows[0].id, s.component_type, s.field]);
        }
      }
      else if (cmp.field === 'why_choose_us') {
        const { rows } = await client.query('SELECT * FROM components_about_why_choose_us WHERE id = $1', [cmp.cmp_id]);
        if (rows.length === 0) continue;
        const o = rows[0];
        const res = await client.query(
          'INSERT INTO components_about_why_choose_us (badge, title, description, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
          [o.badge, o.title, o.description]
        );
        const newId = res.rows[0].id;
        await client.query('INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field) VALUES ($1, $2, $3, $4)', [draftId, newId, cmp.component_type, cmp.field]);
        
        // Clone subcomponents features
        const sub = await client.query("SELECT * FROM components_about_why_choose_us_cmps WHERE entity_id = $1", [cmp.cmp_id]);
        for (const s of sub.rows) {
           const { rows: stats } = await client.query('SELECT * FROM components_about_feature_items WHERE id = $1', [s.cmp_id]);
           const stat = stats[0];
           const r = await client.query('INSERT INTO components_about_feature_items (icon, title, description, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id', [stat.icon, stat.title, stat.description]);
           await client.query('INSERT INTO components_about_why_choose_us_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, $4, $5)', [newId, r.rows[0].id, s.component_type, s.field, s.order]);
        }
      }
      else if (cmp.field === 'philosophy') {
        const { rows } = await client.query('SELECT * FROM components_about_philosophies WHERE id = $1', [cmp.cmp_id]);
        if (rows.length === 0) continue;
        const o = rows[0];
        const res = await client.query(
          'INSERT INTO components_about_philosophies (badge, title, quote, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
          [o.badge, o.title, o.quote]
        );
        const newId = res.rows[0].id;
        await client.query('INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field) VALUES ($1, $2, $3, $4)', [draftId, newId, cmp.component_type, cmp.field]);
        
        // clone tabs
        const sub = await client.query("SELECT * FROM components_about_philosophies_cmps WHERE entity_id = $1", [cmp.cmp_id]);
        for (const s of sub.rows) {
           const { rows: stats } = await client.query('SELECT * FROM components_about_philosophy_tabs WHERE id = $1', [s.cmp_id]);
           const stat = stats[0];
           const r = await client.query('INSERT INTO components_about_philosophy_tabs (key, label, icon, title, description, highlight, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id', [stat.key, stat.label, stat.icon, stat.title, stat.description, stat.highlight]);
           await client.query('INSERT INTO components_about_philosophies_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, $4, $5)', [newId, r.rows[0].id, s.component_type, s.field, s.order]);
        }
      }
      else if (cmp.field === 'core_values') {
        const { rows } = await client.query('SELECT * FROM components_about_core_values WHERE id = $1', [cmp.cmp_id]);
        if (rows.length === 0) continue;
        const o = rows[0];
        const res = await client.query(
          'INSERT INTO components_about_core_values (badge, title, description, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
          [o.badge, o.title, o.description]
        );
        const newId = res.rows[0].id;
        await client.query('INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field) VALUES ($1, $2, $3, $4)', [draftId, newId, cmp.component_type, cmp.field]);
        
        const sub = await client.query("SELECT * FROM components_about_core_values_cmps WHERE entity_id = $1", [cmp.cmp_id]);
        for (const s of sub.rows) {
           const { rows: stats } = await client.query('SELECT * FROM components_about_feature_items WHERE id = $1', [s.cmp_id]);
           const stat = stats[0];
           const r = await client.query('INSERT INTO components_about_feature_items (icon, title, description, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id', [stat.icon, stat.title, stat.description]);
           await client.query('INSERT INTO components_about_core_values_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, $4, $5)', [newId, r.rows[0].id, s.component_type, s.field, s.order]);
        }
      }
      else if (cmp.field === 'commitment') {
        const { rows } = await client.query('SELECT * FROM components_about_commitments WHERE id = $1', [cmp.cmp_id]);
        if (rows.length === 0) continue;
        const o = rows[0];
        const res = await client.query(
          'INSERT INTO components_about_commitments (badge, title, description, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
          [o.badge, o.title, o.description]
        );
        const newId = res.rows[0].id;
        await client.query('INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field) VALUES ($1, $2, $3, $4)', [draftId, newId, cmp.component_type, cmp.field]);
        
        const sub = await client.query("SELECT * FROM components_about_commitments_cmps WHERE entity_id = $1", [cmp.cmp_id]);
        for (const s of sub.rows) {
           const { rows: stats } = await client.query('SELECT * FROM components_about_commitment_items WHERE id = $1', [s.cmp_id]);
           const stat = stats[0];
           const r = await client.query('INSERT INTO components_about_commitment_items (icon, title, subtitle, description, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id', [stat.icon, stat.title, stat.subtitle, stat.description]);
           await client.query('INSERT INTO components_about_commitments_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, $4, $5)', [newId, r.rows[0].id, s.component_type, s.field, s.order]);
        }
      }
    }
    console.log("Successfully duplicated all components explicitly for Draft.");
  } finally {
    await client.end();
  }
}

cloneComponents();
