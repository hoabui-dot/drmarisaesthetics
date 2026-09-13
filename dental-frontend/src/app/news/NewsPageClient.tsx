'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { BookOpen, CalendarDays, ChevronRight, CircleHelp, Clock3, Grid2X2, HeartPulse, Search, ShieldCheck, Sparkles, Wrench, ArrowRight, ChevronDown, Mail, Send } from 'lucide-react';
import { NavigationLink } from '@/src/components/ui/NavigationLink';
import { BLOG_CATEGORY_TAGS, getBlogCategoryLabel, STATIC_CATEGORIES } from '@/src/lib/constants/news';
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext';

interface BlogPost { id: number; documentId: string; title: string; slug: string; excerpt?: string; category?: string; imageUrl?: string | null; imageAlt?: string; publishedAt: string; readingTime?: string; featured?: boolean; }
interface NewsPageClientProps { initialBlogs: BlogPost[]; featuredBlog?: BlogPost; popularBlogs: BlogPost[]; strapiUrl: string; }

const CATEGORY_ICONS = { grid: Grid2X2, implant: HeartPulse, sparkle: Sparkles, braces: CircleHelp, shield: ShieldCheck, technology: Wrench, book: BookOpen };
const normalize = (value?: string) => (value || '').trim().toLowerCase();
const matchesCategory = (blog: BlogPost, id: string) => id === 'all' || (BLOG_CATEGORY_TAGS[id] || []).some((tag) => normalize(blog.category).includes(normalize(tag)));
const resolveImage = (blog: BlogPost, strapiUrl: string) => {
  if (!blog.imageUrl) return 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=900&auto=format&fit=crop';
  if (blog.imageUrl.startsWith('/api/')) return blog.imageUrl;
  if (blog.imageUrl.startsWith('/uploads/')) return `/api/strapi-media${blog.imageUrl}`;
  return blog.imageUrl.startsWith('http') ? blog.imageUrl : `${strapiUrl}${blog.imageUrl}`;
};
const formatDate = (value: string) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

export function NewsPageClient({ initialBlogs, strapiUrl }: NewsPageClientProps) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(() => {
    const category = searchParams.get('category')?.trim().toLowerCase();
    return category === 'plastic surgery' ? 'plastic-surgery' : 'all';
  });
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const { open: openBookingModal } = useBookingModal();
  const filteredBlogs = useMemo(() => initialBlogs.filter((blog) => matchesCategory(blog, activeCategory) && (!searchQuery.trim() || [blog.title, blog.excerpt, blog.category].some((value) => normalize(value).includes(normalize(searchQuery))))), [activeCategory, initialBlogs, searchQuery]);
  const sortedBlogs = useMemo(() => [...filteredBlogs].sort((a, b) => {
    if (sortOrder === 'oldest') return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  }), [filteredBlogs, sortOrder]);
  const latestPageSize = 5;
  const pageCount = Math.max(1, Math.ceil(sortedBlogs.length / latestPageSize));
  const latestBlogs = sortedBlogs.slice((currentPage - 1) * latestPageSize, currentPage * latestPageSize);
  useEffect(() => setCurrentPage(1), [activeCategory, searchQuery, sortOrder]);
  const featuredBlogs = useMemo(() => {
    const filteredConfigured = filteredBlogs.filter((blog) => blog.featured);
    const source = filteredConfigured.length ? filteredConfigured : filteredBlogs;
    return source.filter((blog, index, list) => list.findIndex((item) => item.id === blog.id) === index).slice(0, 3);
  }, [filteredBlogs]);

  return <div className="knowledge-center-page">
    <section className="knowledge-center-hero" aria-labelledby="knowledge-center-title">
      <div className="knowledge-center-container">
        <nav className="knowledge-center-breadcrumb" aria-label="Breadcrumb"><NavigationLink href="/" className="knowledge-center-breadcrumb-link">Home</NavigationLink><ChevronRight aria-hidden="true" /><span aria-current="page">Knowledge Center</span></nav>
        <div className="knowledge-center-hero-grid">
          <div><h2 id="knowledge-center-title">Surgical Knowledge Center</h2><p>Clear, clinically grounded guidance to help you understand cosmetic surgery, recovery and revision care.</p></div>
          <form className="knowledge-center-search" onSubmit={(event) => event.preventDefault()} role="search"><Search aria-hidden="true" /><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search articles..." aria-label="Search articles" /><button type="submit" aria-label="Search articles"><Search aria-hidden="true" /></button></form>
        </div>
        <div className="knowledge-center-category-nav" role="tablist" aria-label="Article categories">
          {STATIC_CATEGORIES.map((category) => { const Icon = CATEGORY_ICONS[category.icon as keyof typeof CATEGORY_ICONS]; const active = activeCategory === category.id; return <button key={category.id} type="button" role="tab" aria-selected={active} className={`knowledge-center-category${active ? ' is-active' : ''}`} onClick={() => setActiveCategory(category.id)}><Icon aria-hidden="true" /><span>{category.label}</span></button>; })}
        </div>
      </div>
    </section>
    <section className="knowledge-center-featured knowledge-center-container" aria-labelledby="featured-articles-title">
      <div className="knowledge-center-section-heading"><h2 id="featured-articles-title">Featured Articles</h2><NavigationLink href="/news" className="knowledge-center-view-all">View All Articles <ArrowRight aria-hidden="true" /></NavigationLink></div>
      {featuredBlogs.length > 0 ? <div className="knowledge-center-featured-grid">{featuredBlogs.map((blog) => <ArticleCard key={blog.id} blog={blog} strapiUrl={strapiUrl} />)}</div> : <p className="knowledge-center-empty">No featured articles are available yet.</p>}
    </section>
    <section className="knowledge-center-latest knowledge-center-container" aria-labelledby="latest-articles-title">
      <div className="knowledge-center-latest-layout">
        <div className="knowledge-center-latest-main">
          <div className="knowledge-center-section-heading"><h2 id="latest-articles-title">Latest Articles</h2><label className="knowledge-center-sort"> <span>Sort</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Sort articles"><option value="newest">Newest First</option><option value="oldest">Oldest First</option><option value="popular">Most Read</option></select><ChevronDown aria-hidden="true" /></label></div>
          {latestBlogs.length > 0 ? <div className="knowledge-center-latest-list">{latestBlogs.map((blog) => <LatestArticleRow key={blog.id} blog={blog} strapiUrl={strapiUrl} />)}</div> : <p className="knowledge-center-empty">No articles match your search.</p>}
          {pageCount > 1 ? <nav className="knowledge-center-pagination" aria-label="Article pages">{Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <button key={page} type="button" aria-current={currentPage === page ? 'page' : undefined} className={currentPage === page ? 'is-active' : ''} onClick={() => setCurrentPage(page)}>{page}</button>)}</nav> : null}
        </div>
        <aside className="knowledge-center-sidebar">
          <div className="knowledge-center-topics"><h2>Popular Topics</h2><div>{STATIC_CATEGORIES.filter((category) => category.id !== 'all').map((category) => { const count = initialBlogs.filter((blog) => matchesCategory(blog, category.id)).length; return <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)}><span>{category.label}</span><strong>{count}</strong></button>; })}</div><button type="button" className="knowledge-center-topic-link" onClick={() => setActiveCategory('all')}>View All Topics <ArrowRight aria-hidden="true" /></button></div>
          <div className="knowledge-center-question"><div><h2>Have a Question?</h2><p>Our surgical team is here to help you understand your options.</p><button type="button" onClick={openBookingModal}>Start a Consultation <ArrowRight aria-hidden="true" /></button></div><div className="knowledge-center-doctors" aria-hidden="true"><Image src="/api/strapi-media/uploads/doctor_new_4622af55c6.jpg" alt="" fill sizes="150px" /><Image src="/api/strapi-media/uploads/michelle_jin_07462af8b2.jpg" alt="" fill sizes="150px" /></div></div>
        </aside>
      </div>
    </section>
    <section className="knowledge-center-newsletter knowledge-center-container" aria-labelledby="newsletter-title"><div className="knowledge-center-newsletter-copy"><span className="knowledge-center-mail-icon"><Mail aria-hidden="true" /></span><div><h2 id="newsletter-title">Stay Informed, Stay Prepared</h2><p>Subscribe for surgical planning guidance, recovery updates and patient resources.</p></div></div><form className="knowledge-center-newsletter-form" onSubmit={(event) => { event.preventDefault(); if (!email.includes('@')) { setNewsletterStatus('Please enter a valid email address.'); return; } setNewsletterStatus('Thank you for subscribing.'); setEmail(''); }}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" required /><button type="submit">Subscribe <Send aria-hidden="true" /></button>{newsletterStatus ? <span role="status">{newsletterStatus}</span> : null}</form></section>
  </div>;
}

function LatestArticleRow({ blog, strapiUrl }: { blog: BlogPost; strapiUrl: string }) {
  return <article className="knowledge-center-latest-row"><NavigationLink href={`/news/${blog.slug}`} className="knowledge-center-latest-link"><div className="knowledge-center-latest-image"><Image src={resolveImage(blog, strapiUrl)} alt={blog.imageAlt || blog.title} fill sizes="165px" /></div><div className="knowledge-center-latest-copy"><span className="knowledge-center-latest-category">{getBlogCategoryLabel(blog.category)}</span><h3>{blog.title}</h3>{blog.excerpt ? <p>{blog.excerpt}</p> : null}<span className="knowledge-center-latest-meta">{formatDate(blog.publishedAt)} · {blog.readingTime || '5 min read'}</span></div><span className="knowledge-center-latest-arrow" aria-hidden="true"><ArrowRight /></span></NavigationLink></article>;
}

function ArticleCard({ blog, strapiUrl }: { blog: BlogPost; strapiUrl: string }) {
  return <article className="knowledge-center-article-card"><NavigationLink href={`/news/${blog.slug}`} className="knowledge-center-article-link">
    <div className="knowledge-center-article-image"><Image src={resolveImage(blog, strapiUrl)} alt={blog.imageAlt || blog.title} fill sizes="(max-width: 767px) 100vw, (max-width: 1199px) 33vw, 380px" />{blog.category ? <span className="knowledge-center-article-badge">{getBlogCategoryLabel(blog.category)}</span> : null}</div>
    <div className="knowledge-center-article-content"><h3>{blog.title}</h3>{blog.excerpt ? <p>{blog.excerpt}</p> : null}<div className="knowledge-center-article-meta"><span><CalendarDays aria-hidden="true" />{formatDate(blog.publishedAt)}</span><span aria-hidden="true">·</span><span><Clock3 aria-hidden="true" />{blog.readingTime || '5 min read'}</span></div></div>
  </NavigationLink></article>;
}
