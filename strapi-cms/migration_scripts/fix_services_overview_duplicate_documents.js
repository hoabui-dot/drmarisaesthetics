/**
 * fix_services_overview_duplicate_documents.js
 *
 * ROOT CAUSE: The `services_overview` single type has TWO different document_id
 * entries in the database. Strapi single types should have exactly ONE document.
 * Having two causes:
 *   1. "Some of the provided components in layout are not related to the entity"
 *   2. CTA section data lost on Strapi restart
 *   3. 404 on the services page (Strapi returns ambiguous data)
 *
 * This script:
 *   1. Identifies the canonical document (most recently published + has real CTA data)
 *   2. Deletes all rows belonging to the duplicate document
 *   3. Cleans up orphaned component records
 *   4. Verifies final state
 */

'use strict';

const knex = require('knex');
require('dotenv').config();

const db = knex({
  client: 'pg',
  connection: {
    host:     process.env.DATABASE_HOST     || '100.68.50.41',
    port:     Number(process.env.DATABASE_PORT) || 5437,
    database: process.env.DATABASE_NAME     || 'dental_cms_strapi',
    user:     process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    ssl:      false,
  },
});

async function run() {
  console.log('\n🔍  Step 1: Auditing services_overview documents...\n');

  const allDocs = await db('services_overview')
    .select('id', 'document_id', 'title', 'published_at', 'updated_at')
    .orderBy('id');

  console.log('All services_overview rows:');
  allDocs.forEach(r => console.log(`  id=${r.id}  doc=${r.document_id}  title="${r.title}"  published=${r.published_at || 'DRAFT'}  updated=${r.updated_at}`));

  // Group by document_id
  const byDoc = {};
  for (const row of allDocs) {
    if (!byDoc[row.document_id]) byDoc[row.document_id] = [];
    byDoc[row.document_id].push(row);
  }

  const docIds = Object.keys(byDoc);
  if (docIds.length <= 1) {
    console.log('\n✅  Only one document_id found — no duplicate to clean up.');
    await db.destroy();
    return;
  }

  console.log(`\n⚠️  Found ${docIds.length} document_ids — this is incorrect for a single type!`);

  // Pick the canonical document: prefer the one with a real CTA (cmp_id 14 or 15 = real data)
  // and prefer the more recently published one.
  // From our audit: uyz49dn68ek6kvp0s7m8u2xv has cta_ids 14+15 (real data)
  //                 ywsr8v5qqpwlhjz4qp0ikpun has cta_ids 16+17 (test/garbage data)
  
  // Find which document has CTA with real content
  let canonicalDocId = null;
  let duplicateDocIds = [];

  for (const docId of docIds) {
    const rows = byDoc[docId];
    const entityIds = rows.map(r => r.id);
    
    // Get CTA component IDs for this document's entities
    const ctaCmps = await db('services_overview_cmps')
      .whereIn('entity_id', entityIds)
      .where('component_type', 'services-overview.cta')
      .select('cmp_id');
    
    const ctaIds = ctaCmps.map(c => c.cmp_id);
    if (ctaIds.length > 0) {
      const ctaData = await db('components_services_overview_ctas')
        .whereIn('id', ctaIds)
        .select('id', 'heading', 'button_label');
      
      console.log(`\n  Document ${docId}:`);
      ctaData.forEach(c => console.log(`    CTA id=${c.id}: heading="${c.heading}" button="${c.button_label}"`));
      
      // Pick the one with a meaningful heading (not test data)
      const hasRealData = ctaData.some(c => 
        c.heading && c.heading.length > 5 && !['dasd', 'asd', 'test'].includes(c.heading.toLowerCase())
      );
      
      if (hasRealData && !canonicalDocId) {
        canonicalDocId = docId;
      }
    } else {
      console.log(`\n  Document ${docId}: no CTA found`);
    }
  }

  // Fallback: pick the one with the highest published_at
  if (!canonicalDocId) {
    const sorted = allDocs
      .filter(r => r.published_at)
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    canonicalDocId = sorted[0]?.document_id || docIds[0];
  }

  duplicateDocIds = docIds.filter(d => d !== canonicalDocId);

  console.log(`\n✅  Canonical document: ${canonicalDocId}`);
  console.log(`🗑️  Duplicate documents to remove: ${duplicateDocIds.join(', ')}`);

  // Get all entity IDs to delete
  const entitiesToDelete = allDocs
    .filter(r => duplicateDocIds.includes(r.document_id))
    .map(r => r.id);

  console.log(`\n📋  Entity IDs to delete: ${entitiesToDelete.join(', ')}`);

  if (entitiesToDelete.length === 0) {
    console.log('Nothing to delete.');
    await db.destroy();
    return;
  }

  // Step 2: Get all component references for the duplicate entities
  console.log('\n🔍  Step 2: Finding orphaned components...\n');
  
  const orphanedCmps = await db('services_overview_cmps')
    .whereIn('entity_id', entitiesToDelete)
    .select('cmp_id', 'component_type');

  console.log('Orphaned component references:');
  orphanedCmps.forEach(c => console.log(`  ${c.component_type} cmp_id=${c.cmp_id}`));

  // Step 3: Delete in the correct order (joins first, then parents)
  console.log('\n🗑️  Step 3: Cleaning up database...\n');

  // 3a. Delete join table entries for duplicate entities
  const deletedJoins = await db('services_overview_cmps')
    .whereIn('entity_id', entitiesToDelete)
    .delete();
  console.log(`   ✅  Deleted ${deletedJoins} rows from services_overview_cmps`);

  // 3b. Delete the duplicate services_overview entity rows
  const deletedEntities = await db('services_overview')
    .whereIn('id', entitiesToDelete)
    .delete();
  console.log(`   ✅  Deleted ${deletedEntities} rows from services_overview`);

  // 3c. Delete orphaned CTA component rows (only those not used by canonical entities)
  const canonicalEntityIds = allDocs
    .filter(r => r.document_id === canonicalDocId)
    .map(r => r.id);
  
  const canonicalCmpIds = await db('services_overview_cmps')
    .whereIn('entity_id', canonicalEntityIds)
    .where('component_type', 'services-overview.cta')
    .pluck('cmp_id');

  const orphanedCtaIds = orphanedCmps
    .filter(c => c.component_type === 'services-overview.cta')
    .map(c => c.cmp_id)
    .filter(id => !canonicalCmpIds.includes(id));

  if (orphanedCtaIds.length > 0) {
    // Delete media links for orphaned CTAs first
    await db('components_services_overview_ctas_background_image_lnk')
      .whereIn('cta_id', orphanedCtaIds)
      .delete();
    
    const deletedCtas = await db('components_services_overview_ctas')
      .whereIn('id', orphanedCtaIds)
      .delete();
    console.log(`   ✅  Deleted ${deletedCtas} orphaned CTA rows (ids: ${orphanedCtaIds.join(', ')})`);
  }

  // Step 4: Verify final state
  console.log('\n🔍  Step 4: Verifying final state...\n');

  const finalDocs = await db('services_overview')
    .select('id', 'document_id', 'title', 'published_at')
    .orderBy('id');

  console.log('Remaining services_overview rows:');
  finalDocs.forEach(r => 
    console.log(`  id=${r.id}  doc=${r.document_id}  title="${r.title}"  status=${r.published_at ? 'PUBLISHED' : 'DRAFT'}`)
  );

  const finalComponents = await db('services_overview_cmps')
    .orderBy('entity_id')
    .orderBy('order');

  console.log('\nRemaining component references:');
  finalComponents.forEach(c => 
    console.log(`  entity=${c.entity_id} | ${c.component_type} | cmp_id=${c.cmp_id} | order=${c.order}`)
  );

  const uniqueDocIds = [...new Set(finalDocs.map(r => r.document_id))];
  if (uniqueDocIds.length === 1) {
    console.log('\n✅  SUCCESS: services_overview now has exactly 1 document_id');
  } else {
    console.log(`\n⚠️  Still ${uniqueDocIds.length} document_ids — manual review needed`);
  }

  console.log('\n✅  Migration complete. Please restart Strapi CMS to reload schema.\n');
  await db.destroy();
}

run().catch(async (err) => {
  console.error('\n❌  Migration failed:', err.message);
  console.error(err.stack);
  await db.destroy();
  process.exit(1);
});
