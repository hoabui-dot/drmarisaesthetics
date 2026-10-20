import Link from 'next/link'

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function SiteBreadcrumbs({ items, tone = 'default' }: { items: BreadcrumbItem[]; tone?: 'default' | 'inverse' }) {
  if (items.length < 2) return null

  return (
    <nav className={`site-breadcrumbs site-breadcrumbs--${tone}`} aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`}>
              {isCurrent || !item.href
                ? <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>
                : <Link href={item.href}>{item.label}</Link>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
