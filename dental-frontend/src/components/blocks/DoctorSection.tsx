'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { HomepageDoctorBlock } from '@/src/types/strapi'

function CredentialList({ credentials }: { credentials: string[] }) {
  if (!credentials.length) return null
  return <ul className="doctor-credentials">{credentials.map((credential) => <li key={credential}><CheckCircle2 aria-hidden="true" /><span>{credential}</span></li>)}</ul>
}

function DoctorPortrait({ doctor, featured = false }: { doctor: HomepageDoctorBlock['doctors'][number]; featured?: boolean }) {
  return <div className={`doctor-portrait ${featured ? 'doctor-portrait-featured' : ''}`}>{doctor.image?.url && <Image src={doctor.image.url} alt={doctor.image.alt || doctor.imageAlt || doctor.name} fill sizes={featured ? '(max-width: 767px) 100vw, 38vw' : '(max-width: 767px) 100vw, 20vw'} className="object-cover object-top" />}</div>
}

function ProfileLink({ doctor }: { doctor: HomepageDoctorBlock['doctors'][number] }) {
  return <Link href={doctor.profileLink || '/doctors'} className="doctor-profile-link">View Profile <ArrowRight aria-hidden="true" /></Link>
}

function FeaturedDoctorCard({ doctor }: { doctor: HomepageDoctorBlock['doctors'][number] }) {
  return <article className="doctor-featured-card"><DoctorPortrait doctor={doctor} featured /><div className="doctor-featured-content"><h3>{doctor.name}</h3>{doctor.specialization && <p className="doctor-specialty">{doctor.specialization}</p>}{doctor.bio && <p className="doctor-description">{doctor.bio}</p>}<CredentialList credentials={doctor.badges} /><ProfileLink doctor={doctor} /></div></article>
}

function StandardDoctorCard({ doctor }: { doctor: HomepageDoctorBlock['doctors'][number] }) {
  return <article className="doctor-standard-card"><DoctorPortrait doctor={doctor} /><div className="doctor-standard-content"><h3>{doctor.name}</h3>{doctor.specialization && <p className="doctor-specialty">{doctor.specialization}</p>}{doctor.bio && <p className="doctor-description">{doctor.bio}</p>}<CredentialList credentials={doctor.badges} /><ProfileLink doctor={doctor} /></div></article>
}

export function DoctorSection({ data }: { data: HomepageDoctorBlock }) {
  const doctors = data.doctors.slice(0, 4)
  if (!doctors.length) return null
  const [featured, ...standardDoctors] = doctors

  return <section id="home-doctors" className="doctor-team-section" aria-labelledby="home-doctors-heading"><div className="mx-auto max-w-home-container px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><header className="doctor-team-header"><div><p className="eyebrow">{data.eyebrow || 'OUR SURGICAL TEAM'}</p><h2 id="home-doctors-heading">{data.title || 'Meet Our Surgical Specialists'}</h2></div><Link href={data.viewAllLink || '/our-team'} className="doctor-view-all">{data.viewAllLabel || 'MEET THE TEAM'} <ArrowRight aria-hidden="true" /></Link></header><div className="doctor-card-group" data-count={doctors.length}><FeaturedDoctorCard doctor={featured} />{standardDoctors.map((doctor) => <StandardDoctorCard key={doctor.id} doctor={doctor} />)}</div></div></section>
}
