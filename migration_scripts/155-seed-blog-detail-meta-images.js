#!/usr/bin/env node

/** Add structured blog-detail metadata and seed local CMS meta images from approved remote sources. */
const { Client } = require('pg');

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const client = new Client({
  host: process.env.DATABASE_HOST || 'dental-postgres',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

const imageSources = {
  'dental-implants': ['dental-implants-meta.jpg', 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=85&w=1400'],
  'invisalign-clear-aligners': ['invisalign-meta.jpg', 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=85&w=1400'],
  'cosmetic-dental-crowns': ['dental-crowns-meta.jpg', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=85&w=1400'],
  'professional-teeth-whitening': ['teeth-whitening-meta.jpg', 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=85&w=1400'],
  'pediatric-oral-care': ['pediatric-oral-care-meta.jpg', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=85&w=1400'],
  'safe-wisdom-tooth-extraction': ['wisdom-tooth-meta.jpg', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=85&w=1400'],
};

const contentImageSources = {
  'dental-implants': ['dental-implants-content.jpg', 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=85&w=1400'],
  'invisalign-clear-aligners': ['invisalign-content.jpg', 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=85&w=1400'],
  'cosmetic-dental-crowns': ['dental-crowns-content.jpg', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=85&w=1400'],
  'professional-teeth-whitening': ['teeth-whitening-content.jpg', 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=85&w=1400'],
  'pediatric-oral-care': ['pediatric-oral-care-content.jpg', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=85&w=1400'],
  'safe-wisdom-tooth-extraction': ['wisdom-tooth-content.jpg', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=85&w=1400'],
};

const contentAdditions = {
  'dental-implants': `<!-- smilux-content-image:dental-implants -->

## Planning Your Implant Journey

![Dental implant consultation and treatment planning]({IMAGE_URL})

Every implant plan begins with a consultation, a clinical examination, and digital imaging. Your dentist reviews bone volume, gum health, bite alignment, and your wider medical history before recommending the most suitable approach. This planning stage helps create a restoration that is comfortable, stable, and natural-looking.

## Recovery and Long-Term Care

Most patients return to light daily activities quickly, while the implant continues to integrate with the jawbone over the following months. Good brushing, interdental cleaning, regular reviews, and avoiding tobacco all support a healthy long-term result. Your Smilux care team will provide an individual aftercare plan and monitor every stage.` ,
  'cosmetic-dental-crowns': `<!-- smilux-content-image:cosmetic-dental-crowns -->

## Designing a Natural Result

![Cosmetic dental crown consultation]({IMAGE_URL})

A beautiful crown is planned around your facial proportions, natural tooth shade, gum line, and bite. During the consultation, your dentist discusses the desired shape and brightness, then checks the fit and appearance before the final restoration is made. This collaborative process keeps the result personal rather than one-size-fits-all.

## How to Protect Your Crowns

Brush twice a day with a soft-bristled toothbrush, clean between teeth daily, and attend routine dental examinations. Crowns are strong, but they should not be used to open packaging or bite very hard objects. A night guard may be recommended if you grind or clench your teeth.` ,
  'invisalign-clear-aligners': `<!-- smilux-content-image:invisalign-clear-aligners -->

## A More Comfortable Way to Straighten Teeth

![Clear aligner treatment consultation]({IMAGE_URL})

Clear aligner treatment uses a sequence of custom-made trays to guide teeth gradually. Each set is designed for a specific stage, so progress can be reviewed and adjusted during scheduled appointments. The trays are removable for meals and daily cleaning, making them a discreet option for many adults and teens.

## Making Treatment Predictable

Wearing aligners for the recommended hours each day and changing them as instructed helps maintain steady progress. Your dentist will explain which movements are realistic for your smile and whether attachments or other supporting steps are needed. A retainer plan after treatment helps protect the result.` ,
  'professional-teeth-whitening': `<!-- smilux-content-image:professional-teeth-whitening -->

## A Brighter Smile With Professional Guidance

![Professional teeth whitening consultation]({IMAGE_URL})

Whitening works by lifting suitable surface and internal stains from natural teeth. Before treatment, your dentist checks for cavities, gum inflammation, existing restorations, and sensitivity so the plan is safe and realistic. The shade goal is selected with your facial features and the colour of any crowns or fillings in mind.

## Keeping Your New Shade Looking Fresh

For the first few days, limiting strongly coloured foods and drinks can help reduce new staining. Continue regular brushing and interdental cleaning, and use sensitivity products if recommended. Whitening does not change the colour of crowns, veneers, or fillings, so a consultation is important when restorations are visible.` ,
  'pediatric-oral-care': `<!-- smilux-content-image:pediatric-oral-care -->

## Building Positive Dental Habits Early

![Child-friendly dental care visit]({IMAGE_URL})

Children learn best when dental care feels familiar and encouraging. A child-focused visit introduces the room, explains each step in age-appropriate language, and gives parents practical guidance for brushing, snacks, fluoride, and habits such as thumb sucking. Early visits also allow small concerns to be noticed before they become urgent.

## What Parents Can Do at Home

Help your child brush twice daily with a suitable fluoride toothpaste and supervise until they can clean effectively. Encourage water between meals and keep sweet drinks and snacks to mealtimes. If your child has tooth pain, swelling, trauma, or unusual sensitivity, arrange a dental review promptly.` ,
  'safe-wisdom-tooth-extraction': `<!-- smilux-content-image:safe-wisdom-tooth-extraction -->

## Personalised Planning for Wisdom Teeth

![Wisdom tooth assessment and dental imaging]({IMAGE_URL})

An examination and appropriate imaging show the position of each wisdom tooth and its relationship to nearby roots, nerves, bone, and the gum. Your dentist uses this information to explain whether monitoring, a simple extraction, or a surgical approach is most appropriate. You will also receive clear instructions about medicines, eating, and arranging transport if sedation is planned.

## Supporting a Smooth Recovery

Rest, follow the written aftercare instructions, and avoid smoking during the initial healing period. Gentle cleaning around the area helps keep it comfortable, while strenuous exercise may need to wait briefly. Contact the clinic if pain or swelling becomes worse rather than gradually improving, or if you have any concern about healing.` ,
};

async function api(endpoint, options = {}) {
  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    ...options,
    headers: { Authorization: `Bearer ${API_TOKEN}`, ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${endpoint} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function uploadImage(name, sourceUrl, slug = name.replace(/\.[^.]+$/, '')) {
  const existing = await api(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(name)}&pagination[pageSize]=1`);
  if (existing?.[0]) return existing[0].id;
  const source = await fetch(sourceUrl);
  if (!source.ok) throw new Error(`Image download failed: ${source.status} ${sourceUrl}`);
  const form = new FormData();
  form.append('files', await source.blob(), name);
  form.append('fileInfo', JSON.stringify({ name, alternativeText: `${slug.replaceAll('-', ' ')} article image` }));
  const uploaded = await api('/api/upload', { method: 'POST', body: form });
  return uploaded[0].id;
}

async function uploadMetaImage(slug) {
  const [name, sourceUrl] = imageSources[slug];
  return uploadImage(name, sourceUrl, slug);
}

async function uploadContentImage(slug) {
  const [name, sourceUrl] = contentImageSources[slug];
  const fileId = await uploadImage(name, sourceUrl, slug);
  const files = await api(`/api/upload/files?filters[id][$eq]=${fileId}&pagination[pageSize]=1`);
  return files?.[0]?.url || `/uploads/${name}`;
}

function readingTime(content = '') {
  return `${Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 180))} min read`;
}

async function run() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query('ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_description text');
    await client.query('ALTER TABLE blogs ADD COLUMN IF NOT EXISTS author_name varchar(255)');
    await client.query('ALTER TABLE blogs ADD COLUMN IF NOT EXISTS reading_time varchar(255)');
    const blogs = await client.query('SELECT id, slug, excerpt, content FROM blogs WHERE slug IS NOT NULL');
    const contentUrls = {};
    for (const slug of Object.keys(contentAdditions)) {
      contentUrls[slug] = await uploadContentImage(slug);
    }
    let updated = 0;
    for (const blog of blogs.rows) {
      const source = imageSources[blog.slug];
      const fileId = source ? await uploadMetaImage(blog.slug) : null;
      const addition = contentAdditions[blog.slug]?.replace('{IMAGE_URL}', contentUrls[blog.slug] || '');
      await client.query(`UPDATE blogs SET
        meta_description = COALESCE(NULLIF(meta_description, ''), excerpt),
        author_name = COALESCE(NULLIF(author_name, ''), 'Smilux Dental Team'),
        reading_time = $1,
        content = CASE WHEN $3::text IS NULL OR content LIKE $4 THEN content ELSE trim(COALESCE(content, '')) || E'\\n\\n' || $3::text END,
        updated_at = NOW()
        WHERE id = $2`, [readingTime((blog.content || '') + (addition || '')), blog.id, addition || null, addition ? `%${addition.match(/<!-- smilux-content-image:[^>]+ -->/)?.[0] || 'never-match'}%` : '%never-match%']);
      if (fileId) {
        await client.query('DELETE FROM files_related_mph WHERE related_type = $1 AND related_id = $2 AND field = $3', ['api::blog.blog', blog.id, 'metaImage']);
        await client.query('INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order") VALUES ($1, $2, $3, $4, 1)', [fileId, blog.id, 'api::blog.blog', 'metaImage']);
      }
      updated += 1;
    }
    await client.query('COMMIT');
    console.log(`[BLOG DETAIL] updated ${updated} blog records with metadata and meta images`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => { console.error(`[BLOG DETAIL] failed: ${error.message}`); process.exitCode = 1; });
