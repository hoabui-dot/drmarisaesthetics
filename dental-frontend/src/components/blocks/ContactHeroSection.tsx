import Image from 'next/image'
import Link from 'next/link'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'

type ContactCard = {
  label: string
  value: string
  supportingText?: string
  icon: 'phone' | 'location' | 'email' | 'clock'
  href?: string
}

export type ContactHeroData = {
  title?: string
  subtitle?: string
  description?: string
  heroImageUrl?: string
  contactCards?: ContactCard[]
}

const iconMap = { phone: Phone, location: MapPin, email: Mail, clock: Clock3 }

function ContactCardItem({ card }: { card: ContactCard }) {
  const Icon = iconMap[card.icon] || Phone
  const value = card.href ? <Link href={card.href}>{card.value}</Link> : <span>{card.value}</span>

  return (
    <article className="contact-hero-card">
      <span className="contact-hero-card-icon" aria-hidden="true"><Icon size={21} strokeWidth={1.8} /></span>
      <div className="min-w-0">
        <h2>{card.label}</h2>
        <div className="contact-hero-card-value">{value}</div>
        {card.supportingText ? <p>{card.supportingText}</p> : null}
      </div>
    </article>
  )
}

export function ContactHeroSection({ data }: { data: ContactHeroData }) {
  const cards = (data.contactCards || []).slice(0, 4)

  return (
    <section id="contact-hero" className="contact-hero-section" aria-labelledby="contact-hero-heading">
      <div className="contact-hero-container">
        <nav className="contact-hero-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Liên hệ</span>
        </nav>

        <div className="contact-hero-top">
          <div className="contact-hero-intro">
            <h1 id="contact-hero-heading">{data.title || 'Liên hệ Smilux'}</h1>
            <p className="contact-hero-subtitle">{data.subtitle || 'Tư vấn – Đặt lịch – Hỗ trợ điều trị Implant'}</p>
            <p className="contact-hero-description">{data.description || 'Đội ngũ chuyên gia của Smilux luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên hành trình kiến tạo nụ cười khỏe đẹp. Liên hệ với chúng tôi để được tư vấn và đặt lịch khám nhanh chóng.'}</p>
          </div>

          {data.heroImageUrl ? (
            <div className="contact-hero-image">
              <Image src={data.heroImageUrl} alt="Bác sĩ Smilux tư vấn điều trị nha khoa cho bệnh nhân" fill priority sizes="(max-width: 1023px) 100vw, 55vw" className="object-cover" />
            </div>
          ) : null}
        </div>

        <div className="contact-hero-cards">
          {cards.map((card, index) => <ContactCardItem card={card} key={`${card.label}-${index}`} />)}
        </div>
      </div>
    </section>
  )
}
