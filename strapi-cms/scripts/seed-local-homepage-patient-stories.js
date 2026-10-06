const path = require('node:path')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true })

const { Client } = require('pg')

// Public videos are used only as clearly identified local layout/demo content.
// These patients are not represented as Dr. Maris patients.
const patientStories = [
  {
    youtube_url: 'https://www.youtube.com/shorts/BkbcjZuqk3k',
    title: 'Diana’s rhinoplasty journey',
    quote: 'Diana shares her rhinoplasty experience, recovery advice and before-and-after perspective.',
    source: 'External reference · Dra. Lina M. Vanegas',
    description:
      'A vertical patient testimonial covering the rhinoplasty journey from consultation through recovery. Demo content only; Diana is not a Dr. Maris patient.',
    thumbnail_url: 'https://i.ytimg.com/vi/BkbcjZuqk3k/hqdefault.jpg',
  },
  {
    youtube_url: 'https://www.youtube.com/shorts/iF8MsQ6PMLA',
    title: 'Beatriz’s rhinoplasty experience',
    quote: 'Beatriz describes the breathing and appearance concerns behind her nose surgery.',
    source: 'External reference · Clínicas Diego de León',
    description:
      'The clinic describes Beatriz’s septal deviation, breathing difficulty and rhinoseptoplasty experience. Demo content only; Beatriz is not a Dr. Maris patient.',
    thumbnail_url: 'https://i.ytimg.com/vi/iF8MsQ6PMLA/hqdefault.jpg',
  },
  {
    youtube_url: 'https://www.youtube.com/shorts/8YGbjpVxI8Y',
    title: 'A happy patient after rhinoplasty',
    quote: 'A short patient-perspective clip following rhinoplasty surgery.',
    source: 'External reference · Richardsons Face Hospitals',
    description:
      'Published as “Happy patient after Rhinoplasty surgery” by Richardsons Face Hospitals. Demo content only; this is not a Dr. Maris patient testimonial.',
    thumbnail_url: 'https://i.ytimg.com/vi/8YGbjpVxI8Y/hqdefault.jpg',
  },
  {
    youtube_url: 'https://www.youtube.com/shorts/kEHigpBbDK8',
    title: 'Rhinoplasty patient story',
    quote: 'A patient story documenting a rhinoplasty journey.',
    source: 'External reference · Dr. Mehmet Nurettin Kiral',
    description:
      'One of the vertical patient-story videos featured by Dr. Kiral’s rhinoplasty patient stories page. Demo content only; this is not a Dr. Maris patient testimonial.',
    thumbnail_url: 'https://i.ytimg.com/vi/kEHigpBbDK8/hqdefault.jpg',
  },
]

const homepageDocumentId = 'lz78tguouxtpwkdt69hummo6'
const videoComponentType = 'homepage.video-section'
const storyComponentType = 'homepage.video-story'
const storyUrls = patientStories.map((story) => story.youtube_url)
const previousSeedVideoIds = ['vM-0UpMoDAw', 'HOtP-XD5fj8', 'o5qRKEQeV9A', 'yKFSBg9vu20']
const managedStoryUrls = [
  ...storyUrls,
  ...previousSeedVideoIds.map((id) => `https://www.youtube.com/watch?v=${id}`),
]

function writeMode() {
  return process.argv.includes('--write')
}

async function main() {
  if (process.env.DATABASE_NAME !== 'drmaris_local_strapi') {
    throw new Error(
      `Refusing to run: expected local database drmaris_local_strapi, got ${process.env.DATABASE_NAME || '(unset)'}.`,
    )
  }

  const client = new Client({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 15432),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  })

  await client.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query(
      `SELECT h.id AS homepage_id, h.published_at, l.cmp_id AS video_section_id
       FROM homepages h
       JOIN homepages_cmps l ON l.entity_id = h.id
       WHERE h.document_id = $1
         AND l.component_type = $2
         AND l.field = 'sections'
       ORDER BY h.published_at NULLS FIRST, h.id`,
      [homepageDocumentId, videoComponentType],
    )
    const videoSections = result.rows
    if (!videoSections.some((section) => section.published_at)) {
      throw new Error('Published Homepage video section was not found in the local database.')
    }

    const sectionIds = videoSections.map((section) => section.video_section_id)
    const existing = await client.query(
      `SELECT link.entity_id AS video_section_id, story.id, story.youtube_url
       FROM components_homepage_video_sections_cmps link
       JOIN components_homepage_video_stories story ON story.id = link.cmp_id
       WHERE link.entity_id = ANY($1::int[])
         AND link.component_type = $2
         AND link.field = 'stories'
       ORDER BY link.entity_id, link."order"`,
      [sectionIds, storyComponentType],
    )

    const unknownStories = existing.rows.filter((story) => !managedStoryUrls.includes(story.youtube_url))
    if (unknownStories.length) {
      throw new Error(
        'The video section already contains non-seed stories. No data was changed; review the existing stories before seeding.',
      )
    }

    const completeForEveryVersion = videoSections.every((section) => {
      const urls = existing.rows
        .filter((story) => story.video_section_id === section.video_section_id)
        .map((story) => story.youtube_url)
      return storyUrls.every((url) => urls.includes(url))
    })

    console.log(`Target database: ${process.env.DATABASE_NAME}`)
    console.log(`Homepage versions: ${videoSections.length} (including published)`)
    console.log(`Existing linked Patient stories: ${existing.rowCount}`)
    console.log(`Sample stories: ${patientStories.length}`)

    if (completeForEveryVersion) {
      await client.query('ROLLBACK')
      console.log('All four sample stories are already present; no changes made.')
      return
    }

    if (!writeMode()) {
      await client.query('ROLLBACK')
      console.log('Dry run only. Re-run with --write to seed the local Homepage.')
      for (const story of patientStories) console.log(`- ${story.title} (${story.youtube_url})`)
      return
    }

    for (const section of videoSections) {
      const oldSeedRows = existing.rows.filter(
        (story) => story.video_section_id === section.video_section_id,
      )
      if (oldSeedRows.length) {
        const oldIds = oldSeedRows.map((story) => story.id)
        await client.query(
          `DELETE FROM components_homepage_video_sections_cmps
           WHERE entity_id = $1 AND component_type = $2 AND field = 'stories' AND cmp_id = ANY($3::int[])`,
          [section.video_section_id, storyComponentType, oldIds],
        )
        await client.query(
          'DELETE FROM components_homepage_video_stories WHERE id = ANY($1::int[])',
          [oldIds],
        )
      }

      for (const [index, story] of patientStories.entries()) {
        const inserted = await client.query(
          `INSERT INTO components_homepage_video_stories
             (youtube_url, title, quote, source, description, thumbnail_url)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [
            story.youtube_url,
            story.title,
            story.quote,
            story.source,
            story.description,
            story.thumbnail_url,
          ],
        )
        await client.query(
          `INSERT INTO components_homepage_video_sections_cmps
             (entity_id, cmp_id, component_type, field, "order")
           VALUES ($1, $2, $3, 'stories', $4)`,
          [section.video_section_id, inserted.rows[0].id, storyComponentType, index + 1],
        )
      }
    }

    await client.query('COMMIT')

    const verification = await client.query(
      `SELECT link.entity_id AS video_section_id, story.title, story.youtube_url, story.thumbnail_url
       FROM components_homepage_video_sections_cmps link
       JOIN components_homepage_video_stories story ON story.id = link.cmp_id
       WHERE link.entity_id = ANY($1::int[])
         AND link.component_type = $2
         AND link.field = 'stories'
       ORDER BY link.entity_id, link."order"`,
      [sectionIds, storyComponentType],
    )
    const verified = videoSections.every((section) => {
      const stories = verification.rows.filter(
        (story) => story.video_section_id === section.video_section_id,
      )
      return (
        stories.length === patientStories.length &&
        stories.every((story) => story.thumbnail_url && storyUrls.includes(story.youtube_url))
      )
    })
    if (!verified) throw new Error('Post-seed verification failed for one or more Homepage versions.')

    const publishedSection = videoSections.find((section) => section.published_at)
    const publishedStories = verification.rows.filter(
      (story) => story.video_section_id === publishedSection.video_section_id,
    )
    console.log(`Seeded and verified ${publishedStories.length} stories in published Homepage.`)
    for (const story of publishedStories) console.log(`- ${story.title} · ${story.youtube_url}`)
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
