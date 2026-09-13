'use client'

import { Building2, CarFront, ExternalLink, MapPin } from 'lucide-react'
import { GoogleMapEmbed } from '@/src/components/ui/google-map-embed'
import { CLINIC_INFO } from '@/src/lib/constants/contact'

type Benefit = { icon?: 'location' | 'landmark' | 'parking'; text: string }

interface ClinicLocationData {
  title: string
  address: string
  benefits: Benefit[]
  clinicName: string
  directionsLabel: string
  directionsUrl?: string
}

export interface ContactMapSettings {
  address?: string
  phonePrimary?: string
  phoneSecondary?: string
  email?: string
  mapLatitude?: number
  mapLongitude?: number
  mapZoom?: number
  mapUrl?: string
}

const benefitIcons = { location: MapPin, landmark: Building2, parking: CarFront }

export function ContactClinicLocationSection({ data, websiteSettings }: { data: ClinicLocationData; websiteSettings?: ContactMapSettings }) {
  const clinicAddress = websiteSettings?.address || data.address || CLINIC_INFO.vietNamAddress || CLINIC_INFO.address
  const latitude = websiteSettings?.mapLatitude ?? CLINIC_INFO.coordinates.lat
  const longitude = websiteSettings?.mapLongitude ?? CLINIC_INFO.coordinates.lng
  const zoom = websiteSettings?.mapZoom ?? 16
  const clinicQuery = `${data.clinicName || CLINIC_INFO.vietNamName || CLINIC_INFO.name} ${clinicAddress}`

  return (
    <section className="contact-clinic-location" aria-labelledby="contact-clinic-location-title">
      <div className="contact-clinic-location__grid">
        <div className="contact-clinic-location__map-card">
          <GoogleMapEmbed
            lat={latitude}
            lng={longitude}
            query={clinicQuery}
            zoom={zoom}
            title={`${data.clinicName || CLINIC_INFO.name} location map`}
            className="absolute inset-0 w-full h-full grayscale-[15%] contrast-[1.05]"
          />
        </div>

        <div className="contact-clinic-location__info-card">
          <h2 id="contact-clinic-location-title">{data.title}</h2>
          <div className="contact-clinic-location__address">
            <MapPin size={17} aria-hidden="true" />
            <span>{clinicAddress}</span>
          </div>
          <div className="contact-clinic-location__benefits">
            {data.benefits.map((benefit, index) => {
              const Icon = benefitIcons[benefit.icon || 'location']
              return (
                <div className="contact-clinic-location__benefit" key={`${benefit.text}-${index}`}>
                  <Icon size={17} aria-hidden="true" />
                  <span>{benefit.text}</span>
                </div>
              )
            })}
          </div>
          {data.directionsUrl && (
            <a className="contact-clinic-location__directions" href={data.directionsUrl} target="_blank" rel="noreferrer">
              <span>{data.directionsLabel}</span>
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
