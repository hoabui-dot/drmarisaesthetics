const { Client } = require('pg');
require('dotenv').config({ path: './strapi-cms/.env' });
const c = new Client({ host: '100.68.50.41', port: 5437, database: 'dental_cms_strapi', user: 'postgres', password: 'postgres' });
c.connect().then(async () => {
  const exist = await c.query("SELECT * FROM contact_pages_components WHERE entity_id=$1 AND field=$2", [39, 'contact_info']);
  if(exist.rows.length === 0){
    await c.query('INSERT INTO contact_pages_components (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, $3, $4, $5)', [39, 1, 'contact.contact-info', 'contact_info', 3]);
  }
  const exist2 = await c.query("SELECT * FROM contact_pages_components WHERE entity_id=$1 AND field=$2", [39, 'elite_stack']);
  if(exist2.rows.length === 0){
    await c.query('INSERT INTO contact_pages_components (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, $3, $4, $5)', [39, 1, 'contact.elite-stack', 'elite_stack', 1]);
  }
  await c.end();
  console.log('Linked published document ID 39');
});
