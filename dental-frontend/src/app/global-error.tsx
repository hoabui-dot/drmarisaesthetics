'use client'

import Link from 'next/link'

export default function GlobalError() {
  return <html lang="en"><body><main className="stitch-error-page" aria-labelledby="global-error-title"><div className="stitch-error-page__inner"><span className="stitch-kicker">DR. MARIS AESTHETICS</span><strong className="stitch-error-page__code">500</strong><h1 id="global-error-title">The site needs a moment</h1><p>Please return home and try again.</p><Link className="stitch-button stitch-button--dark" href="/">Return home</Link></div></main></body></html>
}

