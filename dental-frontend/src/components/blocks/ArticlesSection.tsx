import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { NavigationLink } from '@/src/components/ui/NavigationLink'

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string | null;
  imageAlt?: string;
}

interface ArticlesSectionData {
  title?: string;
  subtitle?: string;
  posts: Article[];
  isActive?: boolean;
}

const resolveImage = (url?: string | null) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `/api/strapi-media${url}`
}

function ArticleImage({ article, featured = false }: { article: Article; featured?: boolean }) {
  const src = resolveImage(article.imageUrl)
  if (!src) return <div className={featured ? 'articles-featured-image articles-image-fallback' : 'articles-compact-image articles-image-fallback'} aria-label={article.title} />
  return <div className={featured ? 'articles-featured-image' : 'articles-compact-image'}><Image src={src} alt={article.imageAlt || article.title} fill className="object-cover" sizes={featured ? '(max-width: 1023px) 100vw, 43vw' : '(max-width: 1023px) 100vw, 15vw'} /></div>
}

function ReadMore() {
  return <span className="articles-read-more">READ MORE <ArrowRight aria-hidden="true" /></span>
}

export function ArticlesSection({ data }: { data: ArticlesSectionData }) {
  if (data.isActive === false || data.posts.length === 0) return null
  const [featured, ...compact] = data.posts.slice(0, 4)

  return (
    <section id="home-articles" className="articles-section">
      <div className="articles-container">
        <header className="articles-header">
          <p className="eyebrow">DENTAL INSIGHTS</p>
          <h2>{data.title || 'Featured Articles'}</h2>
          <span className="articles-heading-line" aria-hidden="true" />
        </header>
        <div className="articles-layout">
          <NavigationLink href={`/news/${featured.slug}`} className="articles-featured-card">
            <ArticleImage article={featured} featured />
            <div className="articles-featured-content">
              <h3>{featured.title}</h3>
              {featured.excerpt && <p>{featured.excerpt}</p>}
              <ReadMore />
            </div>
          </NavigationLink>
          <div className="articles-compact-list">
            {compact.map((article) => (
              <NavigationLink key={article.id} href={`/news/${article.slug}`} className="articles-compact-card">
                <ArticleImage article={article} />
                <div className="articles-compact-content">
                  <h3>{article.title}</h3>
                  {article.excerpt && <p>{article.excerpt}</p>}
                  <ReadMore />
                </div>
              </NavigationLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
