require('dotenv').config();
const { createStrapi } = require('@strapi/strapi');
(async () => {
  const app = createStrapi();
  await app.load();

  try {
    const published = await app.documents('api::about-page.about-page').findFirst({
      status: 'published',
      populate: ['hero', 'excellence', 'why_choose_us', 'philosophy', 'core_values', 'commitment', 'cta']
    });

    if (published) {
      console.log('Found published doc:', published.documentId);
      const updated = await app.documents('api::about-page.about-page').update({
        documentId: published.documentId,
        status: 'draft',
        data: {
          hero: published.hero,
          excellence: published.excellence,
          why_choose_us: published.why_choose_us,
          philosophy: published.philosophy,
          core_values: published.core_values,
          commitment: published.commitment,
          cta: published.cta
        }
      });
      console.log('Successfully cloned published to draft!');
    } else {
      console.log('No published doc found?!');
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    process.exit(0);
  }
})();
