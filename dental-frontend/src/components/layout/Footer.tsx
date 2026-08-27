"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { SOCIAL_LINKS } from "@/src/lib/constants/social-links";
import type { Footer as FooterData, SocialLink } from "@/src/types/strapi";

const socialIcons = { facebook: faFacebookF, instagram: faInstagram, youtube: faYoutube, tiktok: faTiktok } as const;

function SocialIcon({ platform }: { platform: string }) {
  return <FontAwesomeIcon icon={socialIcons[platform.toLowerCase() as keyof typeof socialIcons] || faLink} aria-hidden="true" />;
}

interface FooterProps { footer?: FooterData }

export function Footer({ footer }: FooterProps) {
  const socialLinks: SocialLink[] = footer?.socialLinks?.length ? footer.socialLinks : SOCIAL_LINKS.map((social) => ({ id: social.id, platform: social.platform.toLowerCase(), url: social.url, iconClass: social.iconClass }));
  const groups = footer?.linkGroups?.length ? footer.linkGroups : [{ id: 1, heading: "QUICK LINKS", links: footer?.links || [] }];
  const contact = footer?.contactInfo;

  return <footer id="site-footer" className="site-footer">
    <div className="site-footer-inner">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <div className="site-footer-wordmark">{footer?.logo ? <Image src={footer.logo.url} alt={footer.logo.alt || "Smilux Dental"} width={footer.logo.width || 150} height={footer.logo.height || 56} className="site-footer-logo" /> : <><strong>Smilux</strong><span>DENTAL CLINIC</span></>}</div>
          <p>{footer?.description || "We're here to help you achieve a healthy, confident smile with advanced care you can trust."}</p>
          <div className="site-footer-socials" aria-label="Social media links">{socialLinks.filter((social) => ["facebook", "instagram", "youtube", "tiktok"].includes(social.platform.toLowerCase())).map((social) => <a href={social.url} key={social.id} aria-label={social.platform} target="_blank" rel="noopener noreferrer"><SocialIcon platform={social.platform} /></a>)}</div>
        </div>
        {groups.slice(0, 3).map((group) => <nav className="site-footer-group" key={group.id} aria-label={group.heading}><h2>{group.heading}</h2><ul>{group.links.map((link) => <li key={link.id}><Link href={link.href}>{link.label}</Link></li>)}</ul></nav>)}
        <div className="site-footer-contact"><h2>CONTACT US</h2><div className="site-footer-contact-list">
          {contact?.address ? <a href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`} target="_blank" rel="noopener noreferrer"><MapPin size={17} aria-hidden="true" /><span>{contact.address}</span></a> : null}
          {contact?.phone ? <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}><Phone size={17} aria-hidden="true" /><span>{contact.phone}</span></a> : null}
          {contact?.email ? <a href={`mailto:${contact.email}`}><Mail size={17} aria-hidden="true" /><span>{contact.email}</span></a> : null}
        </div><Link className="site-footer-cta" href={footer?.appointmentHref || "/#home-booking"}>{footer?.appointmentLabel || "BOOK APPOINTMENT"}<ArrowRight size={17} aria-hidden="true" /></Link></div>
      </div>
      <div className="site-footer-bottom"><p>{footer?.copyrightText || `© ${new Date().getFullYear()} Smilux Dental Clinic. All Rights Reserved.`}</p><p>{footer?.tagline || "Designed with care for your smile."}</p></div>
    </div>
  </footer>;
}
