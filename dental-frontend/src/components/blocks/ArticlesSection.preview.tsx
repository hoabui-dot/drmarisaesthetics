import { ArticlesSection } from './ArticlesSection'

export default function ArticlesSectionPreview() {
  return <ArticlesSection data={{
    title: 'Featured Articles',
    posts: [
      'How Long After Tooth Extraction Can You Get an Implant?',
      'Can Tooth Whitening Damage Enamel?',
      'What Is the Best Age for Braces?',
      'Does Dental Implant Treatment Cause Bad Breath?',
    ].map((title, id) => ({ id: id + 1, title, slug: `article-${id + 1}`, excerpt: 'Discover practical guidance for a healthier, more confident smile.', imageUrl: null })),
  }} />
}
