"use client";

import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { SOCIAL_LINKS } from "@/src/lib/constants/social-links";
import type { Footer as FooterData, SocialLink } from "@/src/types/strapi";
import { BrandLogo } from "@/src/components/brand/BrandLogo";

const socialIcons = { facebook: faFacebookF, instagram: faInstagram, youtube: faYoutube, tiktok: faTiktok } as const;

function SocialIcon({ platform }: { platform: string }) {
  return <FontAwesomeIcon icon={socialIcons[platform.toLowerCase() as keyof typeof socialIcons] || faLink} aria-hidden="true" />;
}

interface FooterProps { footer?: FooterData; logoSrc?: string }

export function Footer({ footer, logoSrc }: FooterProps) {
  const socialLinks: SocialLink[] = footer?.socialLinks?.length ? footer.socialLinks : SOCIAL_LINKS.map((social) => ({ id: social.id, platform: social.platform.toLowerCase(), url: social.url, iconClass: social.iconClass }));
  const groups = footer?.linkGroups?.length ? footer.linkGroups : [{ id: 1, heading: "QUICK LINKS", links: footer?.links || [] }];
  const contact = footer?.contactInfo;

  return <footer id="site-footer" className="site-footer">
    <div className="site-footer-inner">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <div className="site-footer-wordmark"><BrandLogo size="lg" src={logoSrc} imageClassName="site-footer-logo" /></div>
          <p>{footer?.description || "Surgeon-led, hospital-based cosmetic surgery planned around each patient."}</p>
          <div className="site-footer-socials" aria-label="Social media links">{socialLinks.filter((social) => ["facebook", "instagram", "youtube", "tiktok"].includes(social.platform.toLowerCase())).map((social) => <span className="site-footer-social" key={social.id} aria-label={social.platform} title={social.platform}><SocialIcon platform={social.platform} /></span>)}</div>
        </div>
        {groups.slice(0, 3).map((group) => <nav className="site-footer-group" key={group.id} aria-label={group.heading}><h2>{group.heading}</h2><ul>{group.links.map((link) => <li key={link.id}><Link href={link.href}>{link.label}</Link></li>)}</ul></nav>)}
        <div className="site-footer-contact"><h2>CONTACT US</h2><div className="site-footer-contact-list">
          {contact?.address ? <a href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`} target="_blank" rel="noopener noreferrer"><MapPin size={17} aria-hidden="true" /><span>{contact.address}</span></a> : null}
          {contact?.phone ? <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}><Phone size={17} aria-hidden="true" /><span>{contact.phone}</span></a> : null}
          {contact?.email ? <a href={`mailto:${contact.email}`}><Mail size={17} aria-hidden="true" /><span>{contact.email}</span></a> : null}
        </div><Link className="booking-inline-cta site-footer-cta" href={footer?.appointmentHref || "/#home-booking"}>{footer?.appointmentLabel || "BOOK APPOINTMENT"}<ArrowRight size={17} aria-hidden="true" /></Link></div>
      </div>
      <div className="site-footer-bottom"><p>{footer?.copyrightText || `© ${new Date().getFullYear()} DR. MARIS AESTHETICS. ALL RIGHTS RESERVED.`}</p><p>{footer?.tagline || "Surgeon-led. Hospital-based. Individually planned."}</p></div>
    </div>
  </footer>;
}
