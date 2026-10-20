'use client'

import Image from 'next/image'
import { ArrowUpRight, MapPin, Navigation } from 'lucide-react'
import type { WebsiteHospitalMapLocation } from '@/src/types/strapi'

export interface AboutHospitalChapter {
  id?: number | string
  chapter: string
  name: string
  abbreviation: string
  short_label: string
  address: string
  maps_directions_url?: string
  website: string
  description: string
  exterior_image_url: string
  exterior_image_alt: string
  interior_image_url: string
  interior_image_alt: string
  detail_image_url?: string
  detail_image_alt?: string
}

export interface AboutHospitalEnvironmentsData {
  eyebrow?: string
  title: string
  description: string
  disclaimer: string
  cta_label: string
  hospitals: AboutHospitalChapter[]
}

function safeWebsiteUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

function safeGoogleMapsUrl(value?: string) {
  if (!value) return undefined
  try {
    const url = new URL(value)
    const allowedHosts = ['google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl', 'goo.gl']
    return url.protocol === 'https:' && allowedHosts.includes(url.hostname) ? url.toString() : undefined
  } catch {
    return undefined
  }
}

function getDirectionsUrl(hospital: AboutHospitalChapter, location?: WebsiteHospitalMapLocation) {
  const configuredUrl = safeGoogleMapsUrl(location ? location.mapsPlaceUrl : hospital.maps_directions_url)
  if (configuredUrl) return configuredUrl

  const url = new URL('https://www.google.com/maps/dir/')
  url.searchParams.set('api', '1')
  url.searchParams.set('destination', `${location?.name || hospital.name}, ${location?.address || hospital.address}`)
  return url.toString()
}

function HospitalChapter({ hospital, ctaLabel, index, location }: { hospital: AboutHospitalChapter; ctaLabel: string; index: number; location?: WebsiteHospitalMapLocation }) {
  const facilityName = location?.name || hospital.name
  const website = safeWebsiteUrl(hospital.website)
  const directionsUrl = getDirectionsUrl(hospital, location)
  const reverse = index % 2 === 1

  return (
    <article className={`about-hospital-chapter${reverse ? ' about-hospital-chapter--reverse' : ''}`} data-hospital-chapter>
      <div className="about-hospital-chapter__visual" aria-label={`${facilityName} facilities`}>
        <figure className="about-hospital-chapter__main-image" data-hospital-main-image>
          <Image
            src={hospital.exterior_image_url}
            alt={hospital.exterior_image_alt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 58vw, 62vw"
            unoptimized
          />
          <figcaption>{hospital.abbreviation} · EXTERIOR</figcaption>
        </figure>
        <figure className="about-hospital-chapter__inset" data-hospital-inset>
          <Image
            src={hospital.interior_image_url}
            alt={hospital.interior_image_alt}
            fill
            sizes="(max-width: 767px) 42vw, 20vw"
            loading="lazy"
            unoptimized
          />
          <figcaption>CARE ENVIRONMENT</figcaption>
        </figure>
      </div>

      <div className="about-hospital-chapter__copy" data-hospital-copy>
        <p className="about-hospital-chapter__eyebrow">{hospital.short_label}</p>
        <h3>{facilityName}</h3>
        <a className="about-hospital-chapter__address" href={directionsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${facilityName}`}>
          <MapPin size={16} aria-hidden="true" />
          <span>
            {location?.address || hospital.address}
            <Navigation className="about-hospital-chapter__directions-icon" size={16} aria-hidden="true" />
          </span>
        </a>
        <p className="about-hospital-chapter__description">{hospital.description}</p>
        <div className="about-hospital-chapter__actions">
          {website ? <a href={website} target="_blank" rel="noopener noreferrer">Explore Hospital Website <ArrowUpRight size={16} aria-hidden="true" /></a> : null}
          <a href="/contact">{ctaLabel} <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </article>
  )
}

export function AboutHospitalEnvironmentsSection({ data, hospitalLocations = [] }: { data: AboutHospitalEnvironmentsData; hospitalLocations?: WebsiteHospitalMapLocation[] }) {
  const hospitals = Array.isArray(data.hospitals) ? data.hospitals.slice(0, 2) : []
  if (!hospitals.length) return null

  return (
    <section className="about-hospital-environments" data-about-hospitals aria-labelledby="about-hospital-environments-title">
      <div className="about-hospital-environments__container">
        <header className="about-hospital-environments__header" data-hospital-header>
          <span className="stitch-kicker">{data.eyebrow || 'HOSPITAL-BASED SURGICAL CARE'}</span>
          <h2 id="about-hospital-environments-title">{data.title}</h2>
          <p>{data.description}</p>
        </header>
        <div className="about-hospital-environments__chapters">
          {hospitals.map((hospital, index) => <HospitalChapter hospital={hospital} ctaLabel={data.cta_label || 'Discuss Your Care Plan'} index={index} key={hospital.id || hospital.abbreviation} location={hospitalLocations.find((location) => location.locationKey === hospital.abbreviation)} />)}
        </div>
        <footer className="about-hospital-environments__footer">
          <p>{data.disclaimer}</p>
          <a href="/contact">{data.cta_label || 'Discuss Your Care Plan'} <ArrowUpRight size={16} aria-hidden="true" /></a>
        </footer>
      </div>
    </section>
  )
}
