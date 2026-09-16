#!/usr/bin/env node

const { Client } = require('pg');
const { transformHtml } = require('../src/lib/docx-better-blocks');

const CONTENT = {
  'dental-implants': `# Dental Implants – The Complete Solution for Missing Teeth

## Planning Your Implant Journey

Every implant plan begins with a consultation, a clinical examination, and digital imaging. Your dentist reviews bone volume, gum health, bite alignment, and your wider medical history before recommending the most suitable approach.

## Recovery and Long-Term Care

Most patients return to light daily activities quickly while the implant continues to integrate with the jawbone. Good brushing, interdental cleaning, regular reviews, and avoiding tobacco support a healthy long-term result.`,
  'invisalign-clear-aligners': `# Invisalign Clear Aligners – A Modern Orthodontic Solution

## A More Comfortable Way to Straighten Teeth

Clear aligner treatment uses a sequence of custom-made trays to guide teeth gradually. Each set is designed for a specific stage, so progress can be reviewed and adjusted during scheduled appointments.

## Making Treatment Predictable

Wearing aligners for the recommended hours each day and changing them as instructed helps maintain steady progress. A retainer plan after treatment helps protect the result.`,
  'cosmetic-dental-crowns': `# Cosmetic Dental Crowns – Your Perfect Smile

## Designing a Natural Result

A beautiful crown is planned around facial proportions, natural tooth shade, gum line, and bite. During consultation, your dentist discusses the desired shape and brightness, then checks the fit and appearance before the final restoration is made.

## How to Protect Your Crowns

Brush twice a day with a soft-bristled toothbrush, clean between teeth daily, and attend routine dental examinations. Crowns are strong, but they should not be used to open packaging or bite very hard objects.`,
  'professional-teeth-whitening': `# Professional Teeth Whitening – Safe and Effective

## A Brighter Smile With Professional Guidance

Whitening works by lifting suitable surface and internal stains from natural teeth. Before treatment, your dentist checks for cavities, gum inflammation, existing restorations, and sensitivity so the plan is safe and realistic.

## Keeping Your New Shade Looking Fresh

Limiting strongly coloured foods and drinks after treatment can help reduce new staining. Continue regular brushing and interdental cleaning, and use sensitivity products if recommended.`,
  'pediatric-oral-care': `# Pediatric Oral Care

## Building Positive Dental Habits Early

Children learn best when dental care feels familiar and encouraging. A child-focused visit introduces the room, explains each step in age-appropriate language, and gives parents practical guidance for brushing, snacks, fluoride, and habits.

## What Parents Can Do at Home

Help your child brush twice daily with a suitable fluoride toothpaste and supervise until they can clean effectively. Encourage water between meals and arrange a dental review promptly for pain, swelling, trauma, or unusual sensitivity.`,
  'safe-wisdom-tooth-extraction': `# Safe and Painless Wisdom Tooth Extraction

## Personalised Planning for Wisdom Teeth

An examination and appropriate imaging show the position of each wisdom tooth and its relationship to nearby roots, nerves, bone, and gum. Your dentist uses this information to explain whether monitoring, a simple extraction, or a surgical approach is most appropriate.

## Supporting a Smooth Recovery

Rest, follow the written aftercare instructions, and avoid smoking during the initial healing period. Contact the clinic if pain or swelling becomes worse rather than gradually improving, or if you have any concern about healing.`,
};

async function run() {
  const client = new Client({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 15432),
    database: process.env.DATABASE_NAME || 'dental_cms_strapi',
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
  });
  await client.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT id, slug, content_better_blocks FROM blogs WHERE slug = ANY($1::text[])', [Object.keys(CONTENT)]);
    for (const row of rows) {
      if (row.content_better_blocks && Array.isArray(row.content_better_blocks) && row.content_better_blocks.length) continue;
      const transformed = transformHtml(CONTENT[row.slug]);
      await client.query('UPDATE blogs SET content_better_blocks = $1::jsonb, updated_at = NOW() WHERE id = $2', [JSON.stringify(transformed.blocks), row.id]);
      console.log(`[OK] ${row.slug} (${row.id}): ${transformed.blocks.length} blocks`);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => { console.error('[FAIL] Blog backfill:', error); process.exitCode = 1; });
