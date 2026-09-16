import Link from 'next/link'

export default function BlogNotFound() {
  return <main className="stitch-error-page" aria-labelledby="article-not-found-title">
      <div className="stitch-error-page__inner">
        <span className="stitch-kicker">PATIENT JOURNAL</span>
        <strong className="stitch-error-page__code">404</strong>
        <h1 id="article-not-found-title">Article not found</h1>
        <p>The article you are looking for does not exist or has been removed.</p>
        <div className="stitch-error-page__actions"><Link className="stitch-button stitch-button--dark" href="/news">View journal</Link><Link className="stitch-button stitch-button--outline" href="/">Return home</Link></div>
      </div>
    </main>
}
