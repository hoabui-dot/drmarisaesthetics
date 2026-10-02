import type { Schema, Struct } from '@strapi/strapi';

export interface AboutAccreditation extends Struct.ComponentSchema {
  collectionName: 'components_about_accreditations';
  info: {
    description: 'Compact accreditation entry for the About Us trust banner.';
    displayName: 'About Accreditation';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    logo: Schema.Attribute.Media<'images'>;
    short_name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutAssessment extends Struct.ComponentSchema {
  collectionName: 'components_about_assessments';
  info: {
    displayName: 'Assessment Before Procedure';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    factors: Schema.Attribute.Component<'about.item', true>;
    objective: Schema.Attribute.Text;
    quote: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutBooking extends Struct.ComponentSchema {
  collectionName: 'components_about_bookings';
  info: {
    description: 'Final About Us consultation form, clinic contact details and reception image.';
    displayName: 'About Booking Consultation';
  };
  attributes: {
    address: Schema.Attribute.Text & Schema.Attribute.Required;
    clinic_image: Schema.Attribute.Media<'images'>;
    clinic_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Smilux Dental Clinic'>;
    email: Schema.Attribute.String & Schema.Attribute.Required;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Book a Consultation'>;
    opening_hours: Schema.Attribute.Text & Schema.Attribute.Required;
    phone: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutConsultation extends Struct.ComponentSchema {
  collectionName: 'components_about_consultations';
  info: {
    displayName: 'About Consultation CTA';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutCoreValueItem extends Struct.ComponentSchema {
  collectionName: 'components_about_core_value_items';
  info: {
    displayName: 'Core Value Item';
    icon: 'heart';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon_image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutCoreValues extends Struct.ComponentSchema {
  collectionName: 'components_about_core_values';
  info: {
    displayName: 'Core Values Section';
    icon: 'heart';
  };
  attributes: {
    badge: Schema.Attribute.String;
    center_icon: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    values: Schema.Attribute.Component<'about.core-value-item', true>;
  };
}

export interface AboutDoctors extends Struct.ComponentSchema {
  collectionName: 'components_about_doctors';
  info: {
    description: 'About Us doctor section configuration. Doctor records remain canonical in Homepage Doctor content.';
    displayName: 'Doctors Section';
  };
  attributes: {
    doctors: Schema.Attribute.Component<'homepage.doctor-profile', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Meet Our Doctors'>;
    view_all_label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'VIEW ALL DOCTORS'>;
    view_all_link: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'/our-team'>;
  };
}

export interface AboutFeaturedServices extends Struct.ComponentSchema {
  collectionName: 'components_about_featured_services';
  info: {
    description: 'About Us service section presentation configuration. Cards are loaded from the blog collection.';
    displayName: 'Featured Services Section';
  };
  attributes: {
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Featured Services'>;
  };
}

export interface AboutHero extends Struct.ComponentSchema {
  collectionName: 'components_about_heroes';
  info: {
    displayName: 'About Hero';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    editorial_lead: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    secondary_description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutHeroStat extends Struct.ComponentSchema {
  collectionName: 'components_about_hero_stats';
  info: {
    displayName: 'About Hero Statistic';
    icon: 'chart-bar';
  };
  attributes: {
    icon: Schema.Attribute.String;
    icon_image: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutHospital extends Struct.ComponentSchema {
  collectionName: 'components_about_hospitals';
  info: {
    displayName: 'Hospital-Based Surgery';
  };
  attributes: {
    description: Schema.Attribute.Text;
    disclaimer: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    scope: Schema.Attribute.Component<'about.item', true>;
    statement: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutInternational extends Struct.ComponentSchema {
  collectionName: 'components_about_internationals';
  info: {
    displayName: 'International Patient Standards';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'about.item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutItem extends Struct.ComponentSchema {
  collectionName: 'components_about_items';
  info: {
    displayName: 'About Content Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    label: Schema.Attribute.String;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface AboutMissionVision extends Struct.ComponentSchema {
  collectionName: 'components_about_mission_visions';
  info: {
    displayName: 'Mission and Vision';
    icon: 'pin';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    missionDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    missionIcon: Schema.Attribute.Media<'images'>;
    missionTitle: Schema.Attribute.String & Schema.Attribute.Required;
    visionDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    visionIcon: Schema.Attribute.Media<'images'>;
    visionTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutRevision extends Struct.ComponentSchema {
  collectionName: 'components_about_revisions';
  info: {
    displayName: 'Revision and Complex Surgery';
  };
  attributes: {
    concerns: Schema.Attribute.Component<'about.item', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    lead: Schema.Attribute.Text;
    lead_description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutSurgeonProcess extends Struct.ComponentSchema {
  collectionName: 'components_about_surgeon_processes';
  info: {
    displayName: 'Direct Surgeon Care Process';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'homepage.process-step', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutSurgeonProfile extends Struct.ComponentSchema {
  collectionName: 'components_about_surgeon_profiles';
  info: {
    displayName: 'Surgeon Profile';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    philosophy_description: Schema.Attribute.Text;
    philosophy_title: Schema.Attribute.String;
    role: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutWhyChooseBenefit extends Struct.ComponentSchema {
  collectionName: 'components_about_why_choose_benefits';
  info: {
    displayName: 'Why Choose Benefit';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon_image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutWhyChooseStatistic extends Struct.ComponentSchema {
  collectionName: 'components_about_why_choose_statistics';
  info: {
    description: 'CMS-managed trust statistic shown beside the tooth image.';
    displayName: 'Why Choose Statistic';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutWhyChooseUs extends Struct.ComponentSchema {
  collectionName: 'components_about_why_choose_us';
  info: {
    displayName: 'Why Choose Us';
    icon: 'question-mark-circle';
  };
  attributes: {
    accreditations: Schema.Attribute.Component<'about.accreditation', true>;
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    features: Schema.Attribute.Component<'about.why-choose-benefit', true>;
    statistics: Schema.Attribute.Component<'about.why-choose-statistic', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    toothImage: Schema.Attribute.Media<'images'>;
  };
}

export interface ContactAddressTile extends Struct.ComponentSchema {
  collectionName: 'components_contact_address_tiles';
  info: {
    description: 'Address tracking component';
    displayName: 'Address Tile';
  };
  attributes: {
    address_text: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images'>;
    location_lat: Schema.Attribute.Decimal;
    location_lng: Schema.Attribute.Decimal;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Heritage Address'>;
  };
}

export interface ContactConsultationContact extends Struct.ComponentSchema {
  collectionName: 'components_contact_consultation_contacts';
  info: {
    description: 'Structured contact row in the consultation information card.';
    displayName: 'Consultation Contact';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['hotline', 'zalo', 'whatsapp', 'email']
    > &
      Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactConsultationSection extends Struct.ComponentSchema {
  collectionName: 'components_contact_consultation_sections';
  info: {
    description: 'Appointment form and Smilux contact information section below the Contact Hero.';
    displayName: 'Consultation Form Section';
  };
  attributes: {
    advisor_description: Schema.Attribute.Text & Schema.Attribute.Required;
    advisor_image: Schema.Attribute.Media<'images'>;
    advisor_title: Schema.Attribute.String & Schema.Attribute.Required;
    form_intro: Schema.Attribute.Text & Schema.Attribute.Required;
    form_title: Schema.Attribute.String & Schema.Attribute.Required;
    info_description: Schema.Attribute.Text & Schema.Attribute.Required;
    info_title: Schema.Attribute.String & Schema.Attribute.Required;
    location_options: Schema.Attribute.Component<'contact.select-option', true>;
    privacy_policy_href: Schema.Attribute.String;
    privacy_policy_label: Schema.Attribute.String & Schema.Attribute.Required;
    submit_label: Schema.Attribute.String & Schema.Attribute.Required;
    trust_description: Schema.Attribute.String & Schema.Attribute.Required;
    trust_title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_contact_contact_infos';
  info: {
    description: 'High-Conversion Contact Suite with interactive tiles';
    displayName: 'Contact Info Suite';
  };
  attributes: {
    address: Schema.Attribute.Component<'contact.address-tile', false>;
    hotline: Schema.Attribute.Component<'contact.hotline-tile', false>;
    operating_hours: Schema.Attribute.Component<'contact.hours-tile', false>;
    quick_action: Schema.Attribute.Component<
      'contact.quick-action-banner',
      false
    >;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    website: Schema.Attribute.Component<'contact.website-tile', false>;
  };
}

export interface ContactCtaStat extends Struct.ComponentSchema {
  collectionName: 'components_contact_cta_stats';
  info: {
    description: 'CTA statistics item';
    displayName: 'CTA Stat';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
  };
}

export interface ContactEliteStack extends Struct.ComponentSchema {
  collectionName: 'components_contact_elite_stacks';
  info: {
    description: '50/50 Info Section for Contact Page';
    displayName: 'Elite Stack';
  };
  attributes: {
    cards: Schema.Attribute.Component<'contact.elite-stack-card', true>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactEliteStackCard extends Struct.ComponentSchema {
  collectionName: 'components_contact_elite_stack_cards';
  info: {
    description: 'Refractive glass cards for the Elite Stack';
    displayName: 'Elite Stack Card';
  };
  attributes: {
    cta_label: Schema.Attribute.String;
    cta_link: Schema.Attribute.String;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon_image: Schema.Attribute.Media<'images'>;
    show_cta: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ContactExpectation extends Struct.ComponentSchema {
  collectionName: 'components_contact_expectations';
  info: {
    description: 'Three-step consultation journey';
    displayName: 'Consultation Process';
  };
  attributes: {
    items: Schema.Attribute.Component<'contact.expectation-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'What to Expect'>;
  };
}

export interface ContactExpectationItem extends Struct.ComponentSchema {
  collectionName: 'components_contact_expectation_items';
  info: {
    displayName: 'Consultation Process Step';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    step: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactFaq extends Struct.ComponentSchema {
  collectionName: 'components_contact_faqs';
  info: {
    description: 'Dedicated FAQ section for contact page';
    displayName: 'Contact FAQ Section';
  };
  attributes: {
    questions: Schema.Attribute.Component<'contact.faq-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_contact_faq_items';
  info: {
    description: 'Isolated FAQ item for contact page';
    displayName: 'Contact FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactHero extends Struct.ComponentSchema {
  collectionName: 'components_contact_heroes';
  info: {
    description: 'Contact page hero with editable introduction, clinic image, and four structured contact cards';
    displayName: 'Hero';
  };
  attributes: {
    contact_cards: Schema.Attribute.Component<
      'contact.quick-contact-card',
      true
    >;
    description: Schema.Attribute.Text;
    hero_image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactHotlineTile extends Struct.ComponentSchema {
  collectionName: 'components_contact_hotline_tiles';
  info: {
    description: 'Hotline tracking component';
    displayName: 'Hotline Tile';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'24/7 Hotline'>;
    whatsapp_icon: Schema.Attribute.Media<'images'>;
    whatsapp_number: Schema.Attribute.String & Schema.Attribute.Required;
    zalo_icon: Schema.Attribute.Media<'images'>;
    zalo_number: Schema.Attribute.String;
  };
}

export interface ContactHoursTile extends Struct.ComponentSchema {
  collectionName: 'components_contact_hours_tiles';
  info: {
    description: 'Operating hours tracking component';
    displayName: 'Hours Tile';
  };
  attributes: {
    hours_text: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Operating Hours'>;
  };
}

export interface ContactLocationBenefit extends Struct.ComponentSchema {
  collectionName: 'components_contact_location_benefits';
  info: {
    description: 'Icon and text row shown in the clinic location card';
    displayName: 'Clinic Location Benefit';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<['location', 'landmark', 'parking']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'location'>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactMapSection extends Struct.ComponentSchema {
  collectionName: 'components_contact_map_sections';
  info: {
    description: 'Data-driven clinic map and location information section';
    displayName: 'Clinic Location Section';
  };
  attributes: {
    address: Schema.Attribute.Text & Schema.Attribute.Required;
    benefits: Schema.Attribute.Component<'contact.location-benefit', true>;
    clinic_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Smilux Dental Clinic'>;
    directions_label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'CH\u1EC8 \u0110\u01AF\u1EDCNG TR\u00CAN GOOGLE MAPS'>;
    directions_url: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'V\u1ECB tr\u00ED ph\u00F2ng kh\u00E1m'>;
  };
}

export interface ContactQuickActionBanner extends Struct.ComponentSchema {
  collectionName: 'components_contact_quick_action_banners';
  info: {
    description: 'Strategic Call-to-Action Ribbon';
    displayName: 'Quick-Action Banner';
  };
  attributes: {
    desktop_link: Schema.Attribute.String;
    mobile_link: Schema.Attribute.String;
    text_prefix: Schema.Attribute.String & Schema.Attribute.Required;
    text_suffix: Schema.Attribute.String;
    whatsapp_text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactQuickContactCard extends Struct.ComponentSchema {
  collectionName: 'components_contact_quick_contact_cards';
  info: {
    description: 'Structured contact information card displayed below the Contact hero.';
    displayName: 'Quick Contact Card';
  };
  attributes: {
    href: Schema.Attribute.String;
    icon: Schema.Attribute.Enumeration<
      ['phone', 'location', 'email', 'clock']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'phone'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    supporting_text: Schema.Attribute.String;
    value: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ContactSelectOption extends Struct.ComponentSchema {
  collectionName: 'components_contact_select_options';
  info: {
    description: 'Structured option for a consultation form select.';
    displayName: 'Select Option';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactWebsiteTile extends Struct.ComponentSchema {
  collectionName: 'components_contact_website_tiles';
  info: {
    description: 'Website tracking component';
    displayName: 'Website Tile';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Visit Our Website'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CustomerBeforeAfterGallery extends Struct.ComponentSchema {
  collectionName: 'components_customer_before_after_galleries';
  info: {
    description: 'Gallery of before and after dental transformation images';
    displayName: 'Before After Gallery';
  };
  attributes: {
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'customer.gallery-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CustomerBenefitItem extends Struct.ComponentSchema {
  collectionName: 'components_customer_benefit_items';
  info: {
    displayName: 'Benefit Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CustomerBenefits extends Struct.ComponentSchema {
  collectionName: 'components_customer_benefits';
  info: {
    displayName: 'Benefits';
  };
  attributes: {
    badge: Schema.Attribute.String;
    benefits: Schema.Attribute.Component<'customer.benefit-item', true>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface CustomerChecklistItem extends Struct.ComponentSchema {
  collectionName: 'components_customer_checklist_items';
  info: {
    description: 'Single checklist item with text';
    displayName: 'Checklist Item';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CustomerCombinedTestimonialResult
  extends Struct.ComponentSchema {
  collectionName: 'components_customer_combined_testimonial_results';
  info: {
    description: 'Unified section displaying customer stories alongside their before/after treatment results';
    displayName: 'Combined Testimonial Result Section';
  };
  attributes: {
    items: Schema.Attribute.Component<
      'customer.combined-testimonial-result-item',
      true
    >;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CustomerCombinedTestimonialResultItem
  extends Struct.ComponentSchema {
  collectionName: 'components_customer_combined_testimonial_result_items';
  info: {
    description: 'A single item containing both a customer testimonial and their before/after images';
    displayName: 'Combined Testimonial Result Item';
  };
  attributes: {
    afterImage: Schema.Attribute.Media<'images'>;
    avatar: Schema.Attribute.Media<'images'>;
    beforeImage: Schema.Attribute.Media<'images'>;
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    country: Schema.Attribute.String;
    customerName: Schema.Attribute.String & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
  };
}

export interface CustomerContactInfoItem extends Struct.ComponentSchema {
  collectionName: 'components_customer_contact_info_items';
  info: {
    displayName: 'Contact Info Item';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface CustomerCta extends Struct.ComponentSchema {
  collectionName: 'components_customer_cta';
  info: {
    description: 'Call to action section with optional inline form';
    displayName: 'CTA';
  };
  attributes: {
    badge: Schema.Attribute.String;
    contact_info: Schema.Attribute.Component<
      'customer.contact-info-item',
      true
    >;
    description: Schema.Attribute.Text;
    form_instruction: Schema.Attribute.String;
    primary_button_link: Schema.Attribute.String;
    primary_button_text: Schema.Attribute.String;
    secondary_button_link: Schema.Attribute.String;
    secondary_button_text: Schema.Attribute.String;
    show_inline_form: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
  };
}

export interface CustomerFaq extends Struct.ComponentSchema {
  collectionName: 'components_customer_faq';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    questions: Schema.Attribute.Component<'customer.faq-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface CustomerFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_customer_faq_items';
  info: {
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.Text;
  };
}

export interface CustomerFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_customer_feature_items';
  info: {
    description: 'Feature card with icon and description';
    displayName: 'Feature Item';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CustomerGalleryItem extends Struct.ComponentSchema {
  collectionName: 'components_customer_gallery_items';
  info: {
    description: 'Before and after dental transformation images';
    displayName: 'Gallery Item';
  };
  attributes: {
    after_image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    before_image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    treatment_type: Schema.Attribute.String;
  };
}

export interface CustomerHero extends Struct.ComponentSchema {
  collectionName: 'components_customer_hero';
  info: {
    description: 'Customer page hero section';
    displayName: 'Hero';
  };
  attributes: {
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image1: Schema.Attribute.Media<'images'>;
    image2: Schema.Attribute.Media<'images'>;
    image3: Schema.Attribute.Media<'images'>;
    image4: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface CustomerReviewChecklistItem extends Struct.ComponentSchema {
  collectionName: 'components_customer_review_checklist_items';
  info: {
    description: 'Checklist item with icon for reviews section';
    displayName: 'Review Checklist Item';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CustomerReviews extends Struct.ComponentSchema {
  collectionName: 'components_customer_reviews';
  info: {
    description: '5-Star Dental Clinic with Verified Patient Reviews section';
    displayName: 'Reviews';
  };
  attributes: {
    badge: Schema.Attribute.String;
    checklist: Schema.Attribute.Component<
      'customer.review-checklist-item',
      true
    >;
    rating: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<4.9>;
    rating_subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'rating from over 400 reviews on Google Maps'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'5-Star Dental Clinic with Verified Patient Reviews'>;
    total_reviews: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<400>;
  };
}

export interface CustomerStatItem extends Struct.ComponentSchema {
  collectionName: 'components_customer_stat_items';
  info: {
    displayName: 'Stat Item';
  };
  attributes: {
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String;
    number: Schema.Attribute.String;
    suffix: Schema.Attribute.String;
  };
}

export interface CustomerStatistics extends Struct.ComponentSchema {
  collectionName: 'components_customer_statistics';
  info: {
    description: 'Statistics section with rating, description and checklist';
    displayName: 'Statistics';
  };
  attributes: {
    badge: Schema.Attribute.String;
    checklist: Schema.Attribute.Component<'customer.checklist-item', true>;
    description: Schema.Attribute.Text;
    rating: Schema.Attribute.String;
    stats: Schema.Attribute.Component<'customer.stat-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface CustomerStoryItem extends Struct.ComponentSchema {
  collectionName: 'components_customer_story_items';
  info: {
    description: 'Customer testimonial with avatar';
    displayName: 'Story Item';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String;
    quote: Schema.Attribute.Text;
    rating: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<5>;
    treatment: Schema.Attribute.String;
  };
}

export interface CustomerSuccessStories extends Struct.ComponentSchema {
  collectionName: 'components_customer_success_stories';
  info: {
    displayName: 'Success Stories';
  };
  attributes: {
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    stories: Schema.Attribute.Component<'customer.story-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface CustomerWhyChooseUs extends Struct.ComponentSchema {
  collectionName: 'components_customer_why_choose_us';
  info: {
    description: 'Why International Patients Choose Our Dental Clinic section';
    displayName: 'Why Choose Us';
  };
  attributes: {
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    features: Schema.Attribute.Component<'customer.feature-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Why International Patients Choose Our Dental Clinic'>;
  };
}

export interface DeepPlaneCertificationCard extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_certification_cards';
  info: {
    displayName: 'Deep Plane certification card';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    image_issuer: Schema.Attribute.String;
    image_label: Schema.Attribute.String;
  };
}

export interface DeepPlaneCertifications extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_certifications';
  info: {
    displayName: 'Deep Plane certifications';
  };
  attributes: {
    cards: Schema.Attribute.Component<'deep-plane.certification-card', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneChecklistItem extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_checklist_items';
  info: {
    displayName: 'Deep Plane checklist item';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneConsultation extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_consultations';
  info: {
    displayName: 'Deep Plane consultation';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    form_description: Schema.Attribute.Text;
    form_title: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneCredentialCard extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_credential_cards';
  info: {
    displayName: 'Deep Plane credential card';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneCredentials extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_credentials';
  info: {
    displayName: 'Deep Plane surgeon credentials';
  };
  attributes: {
    cards: Schema.Attribute.Component<'deep-plane.credential-card', true>;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    paragraphs: Schema.Attribute.Component<'deep-plane.paragraph', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneFaq extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_faqs';
  info: {
    displayName: 'Deep Plane FAQ';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'deep-plane.faq-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_faq_items';
  info: {
    displayName: 'Deep Plane FAQ item';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneHero extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_heroes';
  info: {
    displayName: 'Deep Plane hero';
  };
  attributes: {
    checklist: Schema.Attribute.Component<'deep-plane.checklist-item', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    metrics: Schema.Attribute.Component<'deep-plane.metric', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    verified_label: Schema.Attribute.String;
    verified_meta: Schema.Attribute.String;
    verified_title: Schema.Attribute.String;
  };
}

export interface DeepPlaneJourney extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_journeys';
  info: {
    displayName: 'Deep Plane surgical journey';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'deep-plane.journey-step', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneJourneyStep extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_journey_steps';
  info: {
    displayName: 'Deep Plane journey step';
  };
  attributes: {
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    phase: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneMetric extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_metrics';
  info: {
    displayName: 'Deep Plane metric';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneParagraph extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_paragraphs';
  info: {
    displayName: 'Deep Plane paragraph';
  };
  attributes: {
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface DeepPlaneRecovery extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_recoveries';
  info: {
    displayName: 'Deep Plane recovery protocol';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    note: Schema.Attribute.Text;
    stages: Schema.Attribute.Component<'deep-plane.recovery-stage', true>;
    steps: Schema.Attribute.Component<'deep-plane.recovery-step', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneRecoveryStage extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_recovery_stages';
  info: {
    displayName: 'Deep Plane recovery stage';
  };
  attributes: {
    description: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'deep-plane.checklist-item', true>;
    stage_label: Schema.Attribute.String & Schema.Attribute.Required;
    summary: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneRecoveryStep extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_recovery_steps';
  info: {
    displayName: 'Deep Plane recovery step';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    items: Schema.Attribute.Component<'deep-plane.checklist-item', true>;
    number: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneSafety extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_safeties';
  info: {
    displayName: 'Deep Plane facility safety';
  };
  attributes: {
    cards: Schema.Attribute.Component<'deep-plane.safety-card', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    note: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DeepPlaneSafetyCard extends Struct.ComponentSchema {
  collectionName: 'components_deep_plane_safety_cards';
  info: {
    displayName: 'Deep Plane safety card';
  };
  attributes: {
    alt: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    items: Schema.Attribute.Component<'deep-plane.checklist-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_footer_contact_infos';
  info: {
    description: 'Contact information for footer';
    displayName: 'Contact Info';
  };
  attributes: {
    address: Schema.Attribute.String;
    address_icon: Schema.Attribute.Media<'images'>;
    email: Schema.Attribute.Email;
    email_icon: Schema.Attribute.Media<'images'>;
    phone: Schema.Attribute.String;
    phone_icon: Schema.Attribute.Media<'images'>;
  };
}

export interface FooterLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_links';
  info: {
    description: 'Link for footer navigation';
    displayName: 'Footer Link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterLinkGroup extends Struct.ComponentSchema {
  collectionName: 'components_footer_link_groups';
  info: {
    displayName: 'Footer Link Group';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    links: Schema.Attribute.Component<'footer.link', true>;
  };
}

export interface FooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    description: 'Social media link for footer';
    displayName: 'Social Link';
  };
  attributes: {
    icon_class: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'fab fa-link'>;
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'instagram', 'youtube', 'tiktok']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageAboutBenefit extends Struct.ComponentSchema {
  collectionName: 'components_homepage_about_benefits';
  info: {
    displayName: 'About benefit';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageBlogCollectionSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_blog_collection_sections';
  info: {
    description: 'Blog collection grid section';
    displayName: 'BlogCollectionSection';
  };
  attributes: {
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    posts: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'>;
    showFeatured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageCertificateBundle extends Struct.ComponentSchema {
  collectionName: 'components_homepage_certificate_bundles';
  info: {
    description: 'Paired accreditation summary and certificate image';
    displayName: 'Certificate Bundle';
  };
  attributes: {
    certificate_alt: Schema.Attribute.String;
    certificate_image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    organization_logo: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    organization_name: Schema.Attribute.String & Schema.Attribute.Required;
    summary: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageCertificateItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_certificate_items';
  info: {
    description: 'Individual certificate for carousel';
    displayName: 'Certificate Item';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    organization: Schema.Attribute.String;
  };
}

export interface HomepageCertification extends Struct.ComponentSchema {
  collectionName: 'components_homepage_certifications';
  info: {
    description: 'Certification section with 3D carousel';
    displayName: 'Certification Section';
  };
  attributes: {
    bundles: Schema.Attribute.Component<'homepage.certificate-bundle', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
          min: 1;
        },
        number
      >;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageCertificationItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_certification_items';
  info: {
    description: 'Certification or award badge';
    displayName: 'Certification Item';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    organization: Schema.Attribute.String;
  };
}

export interface HomepageCombinedTestimonialResultItem
  extends Struct.ComponentSchema {
  collectionName: 'components_homepage_combined_testimonial_result_items';
  info: {
    description: 'A single item containing both a customer testimonial and their before/after images';
    displayName: 'Combined Testimonial Result Item';
  };
  attributes: {
    afterImage: Schema.Attribute.Media<'images'>;
    avatar: Schema.Attribute.Media<'images'>;
    beforeImage: Schema.Attribute.Media<'images'>;
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    country: Schema.Attribute.String;
    customerName: Schema.Attribute.String & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
  };
}

export interface HomepageConsultation extends Struct.ComponentSchema {
  collectionName: 'components_homepage_consultations';
  info: {
    displayName: 'Consultation';
  };
  attributes: {
    address: Schema.Attribute.String;
    clinic_eyebrow: Schema.Attribute.String;
    contact_heading: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    email: Schema.Attribute.String;
    expert_image: Schema.Attribute.Media<'images'>;
    expert_name: Schema.Attribute.String;
    expert_role: Schema.Attribute.String;
    form_heading: Schema.Attribute.String;
    help_text: Schema.Attribute.String;
    international_patients: Schema.Attribute.Text;
    opening_hours: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    submit_label: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageConsultationSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_consultation_sections';
  info: {
    displayName: 'Consultation section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    editorial_lead: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageCta extends Struct.ComponentSchema {
  collectionName: 'components_homepage_ctas';
  info: {
    description: 'Shared CTA component used by service content';
    displayName: 'CTA';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    button_label: Schema.Attribute.String & Schema.Attribute.Required;
    button_link: Schema.Attribute.String & Schema.Attribute.Required;
    heading: Schema.Attribute.Text & Schema.Attribute.Required;
    highlight_text: Schema.Attribute.String;
    human_image: Schema.Attribute.Media<'images'>;
  };
}

export interface HomepageDoctor extends Struct.ComponentSchema {
  collectionName: 'components_homepage_doctors';
  info: {
    description: 'Doctor team showcase';
    displayName: 'Doctor Section';
  };
  attributes: {
    doctors: Schema.Attribute.Component<'homepage.doctor-profile', true>;
    eyebrow: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    view_all_label: Schema.Attribute.String;
    view_all_link: Schema.Attribute.String;
  };
}

export interface HomepageDoctorAssessmentSection
  extends Struct.ComponentSchema {
  collectionName: 'components_homepage_doctor_assessment_sections';
  info: {
    displayName: 'Doctor assessment section';
  };
  attributes: {
    considerations: Schema.Attribute.Component<'homepage.text-item', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    role: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageDoctorBadge extends Struct.ComponentSchema {
  collectionName: 'components_homepage_doctor_badges';
  info: {
    description: 'Credential badge for a doctor profile';
    displayName: 'Doctor Badge';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageDoctorProfile extends Struct.ComponentSchema {
  collectionName: 'components_homepage_doctor_profiles';
  info: {
    description: 'Individual doctor profile';
    displayName: 'Doctor Profile';
  };
  attributes: {
    badges: Schema.Attribute.Component<'homepage.doctor-badge', true>;
    bio: Schema.Attribute.Text;
    experience_years: Schema.Attribute.Integer;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    linkedin_url: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    profile_link: Schema.Attribute.String;
    specialization: Schema.Attribute.String;
    stats: Schema.Attribute.Component<'homepage.doctor-stat', true>;
  };
}

export interface HomepageDoctorStat extends Struct.ComponentSchema {
  collectionName: 'components_homepage_doctor_stats';
  info: {
    description: 'Individual stat item for a doctor profile (e.g. 15+ years)';
    displayName: 'Doctor Stat';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageEquipmentItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_equipment_items';
  info: {
    displayName: 'Equipment item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageEquipmentShowcase extends Struct.ComponentSchema {
  collectionName: 'components_homepage_equipment_showcases';
  info: {
    displayName: 'Equipment showcase';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'homepage.equipment-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageFaqContactItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_faq_contact_items';
  info: {
    description: 'Contact method item for FAQ support card (icon as text, label, sub-label)';
    displayName: 'FAQ Contact Item';
  };
  attributes: {
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    sub_label: Schema.Attribute.String;
  };
}

export interface HomepageFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_faq_items';
  info: {
    displayName: 'Homepage FAQ item';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_feature_items';
  info: {
    displayName: 'Feature item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageFrequentlyAskedQuestionsSection
  extends Struct.ComponentSchema {
  collectionName: 'components_homepage_frequently_asked_questions_sections';
  info: {
    displayName: 'Frequently asked questions section';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'homepage.faq-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageHero extends Struct.ComponentSchema {
  collectionName: 'components_homepage_heroes';
  info: {
    description: 'Clinical-blue hero section with heading, subheading, CTA, trust proof, and image';
    displayName: 'Hero';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    cta_label: Schema.Attribute.String;
    cta_link: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    heading_line_1: Schema.Attribute.String;
    heading_line_2: Schema.Attribute.String;
    patient_avatars: Schema.Attribute.Media<'images', true>;
    secondary_cta_action: Schema.Attribute.Enumeration<
      ['video-dialog', 'internal-route', 'external-url']
    > &
      Schema.Attribute.DefaultTo<'video-dialog'>;
    secondary_cta_label: Schema.Attribute.String;
    secondary_cta_link: Schema.Attribute.String;
    secondary_cta_video_url: Schema.Attribute.String;
    subheading: Schema.Attribute.Text;
    trust_label: Schema.Attribute.String;
    trust_rating: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      >;
    trust_value: Schema.Attribute.String;
  };
}

export interface HomepageHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_hero_sections';
  info: {
    displayName: 'Hero section';
  };
  attributes: {
    editorial_lead: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    paragraph_one: Schema.Attribute.Text;
    paragraph_two: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    trust_labels: Schema.Attribute.Component<'homepage.text-item', true>;
  };
}

export interface HomepageHospitalBasedSurgerySection
  extends Struct.ComponentSchema {
  collectionName: 'components_homepage_hospital_based_surgery_sections';
  info: {
    displayName: 'Hospital based surgery section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    disclaimer: Schema.Attribute.Text;
    editorial_lead: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    mobile_image: Schema.Attribute.Media<'images'>;
    proof_items: Schema.Attribute.Component<'homepage.text-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageInternationalJourneySection
  extends Struct.ComponentSchema {
  collectionName: 'components_homepage_international_journey_sections';
  info: {
    displayName: 'International patient journey section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'homepage.journey-step', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageInternationalPatientsSection
  extends Struct.ComponentSchema {
  collectionName: 'components_homepage_international_patients_sections';
  info: {
    displayName: 'International patients section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    note: Schema.Attribute.Text;
    review_items: Schema.Attribute.Component<'homepage.text-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageJourneyStep extends Struct.ComponentSchema {
  collectionName: 'components_homepage_journey_steps';
  info: {
    displayName: 'International journey step';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageMarisMethodSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_maris_method_sections';
  info: {
    displayName: 'The Maris Method section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    quote: Schema.Attribute.Text;
    stat_description: Schema.Attribute.String;
    stat_title: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'homepage.process-step', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepagePaperItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_paper_items';
  info: {
    description: 'Individual scientific paper for carousel';
    displayName: 'Paper Item';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepagePatientResultsSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_patient_results_sections';
  info: {
    displayName: 'Patient results section';
  };
  attributes: {
    badge: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepagePatientTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_homepage_patient_testimonials';
  info: {
    description: 'Atomic patient evaluation record';
    displayName: 'Patient Testimonial';
  };
  attributes: {
    patient_avatar: Schema.Attribute.Media<'images'>;
    patient_avatar_alt: Schema.Attribute.String;
    patient_location: Schema.Attribute.String;
    patient_name: Schema.Attribute.String & Schema.Attribute.Required;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
  };
}

export interface HomepagePressLogo extends Struct.ComponentSchema {
  collectionName: 'components_homepage_press_logos';
  info: {
    displayName: 'Press logo';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface HomepagePressSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_press_sections';
  info: {
    description: 'Image-only publication logo collection';
    displayName: 'Homepage Press / Featured In';
  };
  attributes: {
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    logos: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
  };
}

export interface HomepageProcedureItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_procedure_items';
  info: {
    displayName: 'Signature procedure';
  };
  attributes: {
    description: Schema.Attribute.Text;
    href: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_homepage_process_steps';
  info: {
    displayName: 'Process step';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageProofMetric extends Struct.ComponentSchema {
  collectionName: 'components_homepage_proof_metrics';
  info: {
    displayName: 'Proof metric';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    suffix: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageProofShowcase extends Struct.ComponentSchema {
  collectionName: 'components_homepage_proof_showcases';
  info: {
    displayName: 'About / Trust mosaic';
  };
  attributes: {
    benefits: Schema.Attribute.Component<'homepage.about-benefit', true>;
    cta_label: Schema.Attribute.String;
    cta_link: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    experience_label: Schema.Attribute.String;
    experience_value: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    heading_line_1: Schema.Attribute.String;
    heading_line_2: Schema.Attribute.String;
    metrics: Schema.Attribute.Component<'homepage.proof-metric', true>;
    patient_stat_image: Schema.Attribute.Media<'images'>;
    patient_stat_label: Schema.Attribute.String;
    patient_stat_value: Schema.Attribute.String;
    patient_story_image: Schema.Attribute.Media<'images'>;
    primary_image: Schema.Attribute.Media<'images'>;
    primary_team_image: Schema.Attribute.Media<'images'>;
    secondary_image: Schema.Attribute.Media<'images'>;
    technology_image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageResultStory extends Struct.ComponentSchema {
  collectionName: 'components_homepage_result_stories';
  info: {
    description: 'A single composite before-and-after result story';
    displayName: 'Result Story';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    image_alt: Schema.Attribute.String;
    patient_portrait: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    portrait_alt: Schema.Attribute.String;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    treatments: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface HomepageResultsSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_results_sections';
  info: {
    description: 'Homepage result-story carousel using one composite image per case';
    displayName: 'Smile Transformations / Results';
  };
  attributes: {
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    stories: Schema.Attribute.Component<'homepage.result-story', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
          min: 1;
        },
        number
      >;
  };
}

export interface HomepageReviewItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_review_items';
  info: {
    displayName: 'Review item';
  };
  attributes: {
    author_meta: Schema.Attribute.String;
    author_name: Schema.Attribute.String & Schema.Attribute.Required;
    avatar: Schema.Attribute.Media<'images'>;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
  };
}

export interface HomepageRevisionSurgerySection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_revision_surgery_sections';
  info: {
    displayName: 'Revision surgery section';
  };
  attributes: {
    concerns: Schema.Attribute.Component<'homepage.text-item', true>;
    description: Schema.Attribute.Text;
    editorial_lead: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    mobile_image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageServiceItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_service_items';
  info: {
    description: 'Individual service with title, description, and icon/image';
    displayName: 'Service Item';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageServices extends Struct.ComponentSchema {
  collectionName: 'components_homepage_services';
  info: {
    description: 'Services section with title and repeatable service items';
    displayName: 'Services';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'homepage.service-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    view_more_label: Schema.Attribute.String;
    view_more_link: Schema.Attribute.String;
  };
}

export interface HomepageSignatureProceduresSection
  extends Struct.ComponentSchema {
  collectionName: 'components_homepage_signature_procedures_sections';
  info: {
    displayName: 'Signature procedures section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'homepage.procedure-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageStatItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_stat_items';
  info: {
    description: 'Individual statistic with number and label';
    displayName: 'Stat Item';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    number: Schema.Attribute.String & Schema.Attribute.Required;
    suffix: Schema.Attribute.String;
  };
}

export interface HomepageSurgicalCareProcessSection
  extends Struct.ComponentSchema {
  collectionName: 'components_homepage_surgical_care_process_sections';
  info: {
    displayName: 'Surgical care process section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    quote: Schema.Attribute.Text;
    steps: Schema.Attribute.Component<'homepage.process-step', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageTechnologyCard extends Struct.ComponentSchema {
  collectionName: 'components_homepage_technology_cards';
  info: {
    displayName: 'Technology card';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    index: Schema.Attribute.Integer & Schema.Attribute.Required;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageTechnologyFeature extends Struct.ComponentSchema {
  collectionName: 'components_homepage_technology_features';
  info: {
    displayName: 'Advanced technology';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    cta_label: Schema.Attribute.String;
    cta_link: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    features: Schema.Attribute.Component<'homepage.feature-item', true>;
    heading_accent: Schema.Attribute.String;
    heading_line_1: Schema.Attribute.String;
    heading_line_2: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    technologies: Schema.Attribute.Component<'homepage.technology-card', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageTestimonialsSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_testimonials_sections';
  info: {
    description: 'Homepage testimonials with independent patient visual';
    displayName: 'Customer Evaluation / Testimonials';
  };
  attributes: {
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    section_image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    section_image_alt: Schema.Attribute.String;
    testimonials: Schema.Attribute.Component<
      'homepage.patient-testimonial',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      >;
  };
}

export interface HomepageTextItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_text_items';
  info: {
    displayName: 'Homepage text item';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageTitleLine extends Struct.ComponentSchema {
  collectionName: 'components_homepage_title_lines';
  info: {
    description: 'Individual line of text for multi-line titles';
    displayName: 'Title Line';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageVideoSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_video_sections';
  info: {
    description: 'Customer video testimonial displayed directly below the homepage hero.';
    displayName: 'Homepage video section';
  };
  attributes: {
    customer_description: Schema.Attribute.Text;
    customer_name: Schema.Attribute.String;
    quote: Schema.Attribute.Text;
    thumbnail_url: Schema.Attribute.Text;
    youtube_url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MenuLink extends Struct.ComponentSchema {
  collectionName: 'components_menu_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

export interface MenuNavChild extends Struct.ComponentSchema {
  collectionName: 'components_menu_nav_children';
  info: {
    description: 'Child navigation item for dropdown menus';
    displayName: 'NavChild';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MenuNavItem extends Struct.ComponentSchema {
  collectionName: 'components_menu_nav_items';
  info: {
    description: 'Navigation item with support for nested children (dropdown)';
    displayName: 'NavItem';
  };
  attributes: {
    children: Schema.Attribute.Component<'menu.nav-child', true>;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isClickable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamAuthorityCard extends Struct.ComponentSchema {
  collectionName: 'components_our_team_authority_cards';
  info: {
    displayName: 'Our Team authority card';
  };
  attributes: {
    items: Schema.Attribute.Component<'our-team.item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamAuthoritySection extends Struct.ComponentSchema {
  collectionName: 'components_our_team_authority_sections';
  info: {
    displayName: 'Our Team medical authority';
  };
  attributes: {
    cards: Schema.Attribute.Component<'our-team.authority-card', true>;
    certificate_image: Schema.Attribute.Media<'images'>;
    certificate_image_alt: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamCredentialRow extends Struct.ComponentSchema {
  collectionName: 'components_our_team_credential_rows';
  info: {
    displayName: 'Our Team credential row';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamCredentialsSection extends Struct.ComponentSchema {
  collectionName: 'components_our_team_credentials_sections';
  info: {
    displayName: 'Our Team credentials';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    rows: Schema.Attribute.Component<'our-team.credential-row', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamEditorialSection extends Struct.ComponentSchema {
  collectionName: 'components_our_team_editorial_sections';
  info: {
    displayName: 'Our Team editorial section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    items: Schema.Attribute.Component<'our-team.item', true>;
    lead: Schema.Attribute.Text;
    steps: Schema.Attribute.Component<'our-team.step', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_our_team_faq_items';
  info: {
    displayName: 'Our Team FAQ item';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_our_team_faq_sections';
  info: {
    displayName: 'Our Team FAQ section';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'our-team.faq-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_our_team_hero_sections';
  info: {
    displayName: 'Our Team hero';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    paragraph_one: Schema.Attribute.Text;
    paragraph_two: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamHospitalSection extends Struct.ComponentSchema {
  collectionName: 'components_our_team_hospital_sections';
  info: {
    displayName: 'Our Team hospital-based surgery';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    proof_items: Schema.Attribute.Component<'our-team.item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamInternationalSection extends Struct.ComponentSchema {
  collectionName: 'components_our_team_international_sections';
  info: {
    displayName: 'Our Team international patients';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    lead: Schema.Attribute.Text;
    steps: Schema.Attribute.Component<'our-team.international-step', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamInternationalStep extends Struct.ComponentSchema {
  collectionName: 'components_our_team_international_steps';
  info: {
    displayName: 'Our Team international patient step';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamItem extends Struct.ComponentSchema {
  collectionName: 'components_our_team_items';
  info: {
    displayName: 'Our Team list item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamProfessionalSection extends Struct.ComponentSchema {
  collectionName: 'components_our_team_professional_sections';
  info: {
    displayName: 'Our Team professional journey';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    items: Schema.Attribute.Component<'our-team.item', true>;
    lead: Schema.Attribute.Text;
    steps: Schema.Attribute.Component<'our-team.step', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamRevisionSection extends Struct.ComponentSchema {
  collectionName: 'components_our_team_revision_sections';
  info: {
    displayName: 'Our Team revision section';
  };
  attributes: {
    callout_description: Schema.Attribute.Text;
    callout_title: Schema.Attribute.String;
    concerns: Schema.Attribute.Component<'our-team.item', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OurTeamStep extends Struct.ComponentSchema {
  collectionName: 'components_our_team_steps';
  info: {
    displayName: 'Our Team process step';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    number: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ResultCase extends Struct.ComponentSchema {
  collectionName: 'components_result_cases';
  info: {
    displayName: 'Patient result case';
  };
  attributes: {
    case_number: Schema.Attribute.String & Schema.Attribute.Required;
    category: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    category_id: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    category_ids: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<'global::result-category-multi-select'>;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.Text;
    profile: Schema.Attribute.String;
    recovery: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ResultCategory extends Struct.ComponentSchema {
  collectionName: 'components_result_categories';
  info: {
    displayName: 'Patient result category';
  };
  attributes: {
    category_id: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<'global::result-category-id'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SeoPageSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_page_seos';
  info: {
    description: 'Optional page-level SEO overrides. Leave blank to use derived and global defaults.';
    displayName: 'Page SEO';
  };
  attributes: {
    canonical_url: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2048;
      }>;
    include_in_sitemap: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    meta_description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    meta_image: Schema.Attribute.Media<'images'>;
    meta_title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    no_follow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    no_index: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    open_graph_description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    open_graph_title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    structured_data_enabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    structured_data_json: Schema.Attribute.JSON;
  };
}

export interface SeoRobotsRule extends Struct.ComponentSchema {
  collectionName: 'components_seo_robots_rules';
  info: {
    description: 'A user-agent rule for robots.txt. Enter one path per line.';
    displayName: 'Robots Rule';
  };
  attributes: {
    allow: Schema.Attribute.Text;
    disallow: Schema.Attribute.Text;
    user_agent: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'*'>;
  };
}

export interface ServiceFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_service_faq_items';
  info: {
    displayName: 'Service FAQ item';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ServiceFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_service_faq_sections';
  info: {
    description: 'Centered FAQ accordion displayed after the service Better Blocks content';
    displayName: 'Service FAQ section';
  };
  attributes: {
    items: Schema.Attribute.Component<'service.faq-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface TreatmentsPageEditorialSection extends Struct.ComponentSchema {
  collectionName: 'components_treatments_page_editorial_sections';
  info: {
    displayName: 'Treatments editorial section';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    items: Schema.Attribute.Component<'treatments-page.item', true>;
    lead: Schema.Attribute.Text;
    paragraph_one: Schema.Attribute.Text;
    paragraph_two: Schema.Attribute.Text;
    section_key: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface TreatmentsPageHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_treatments_page_hero_sections';
  info: {
    displayName: 'Treatments hero';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    review_label: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface TreatmentsPageItem extends Struct.ComponentSchema {
  collectionName: 'components_treatments_page_items';
  info: {
    displayName: 'Treatments page item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WebsiteSettingBlogCategory extends Struct.ComponentSchema {
  collectionName: 'components_website_setting_blog_categories';
  info: {
    displayName: 'Blog category';
  };
  attributes: {
    category_id: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WebsiteSettingBookingForm extends Struct.ComponentSchema {
  collectionName: 'components_website_setting_booking_forms';
  info: {
    displayName: 'Booking Form';
  };
  attributes: {
    form_description: Schema.Attribute.Text;
    form_eyebrow: Schema.Attribute.String;
    form_title: Schema.Attribute.String;
    privacy_text: Schema.Attribute.Text;
    success_description: Schema.Attribute.Text;
    success_eyebrow: Schema.Attribute.String;
    success_title: Schema.Attribute.String;
    visual_description: Schema.Attribute.Text;
    visual_eyebrow: Schema.Attribute.String;
    visual_image: Schema.Attribute.Media<'images'>;
    visual_points: Schema.Attribute.Component<
      'website-setting.booking-form-point',
      true
    >;
    visual_title: Schema.Attribute.String;
  };
}

export interface WebsiteSettingBookingFormPoint extends Struct.ComponentSchema {
  collectionName: 'components_website_setting_booking_form_points';
  info: {
    displayName: 'Booking Form Point';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WebsiteSettingContactMethod extends Struct.ComponentSchema {
  collectionName: 'components_website_setting_contact_methods';
  info: {
    displayName: 'Website contact method';
  };
  attributes: {
    color: Schema.Attribute.String;
    href: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images'>;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    type: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WebsiteSettingGlobalCta extends Struct.ComponentSchema {
  collectionName: 'components_website_setting_global_ctas';
  info: {
    displayName: 'Global CTA Section';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    editorial_lead: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    panel_description: Schema.Attribute.Text;
    panel_eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    panel_title: Schema.Attribute.String & Schema.Attribute.Required;
    steps: Schema.Attribute.Component<'website-setting.global-cta-step', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WebsiteSettingGlobalCtaStep extends Struct.ComponentSchema {
  collectionName: 'components_website_setting_global_cta_steps';
  info: {
    displayName: 'Global CTA step';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    number: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WebsiteSettingServiceCategory extends Struct.ComponentSchema {
  collectionName: 'components_website_setting_service_categories';
  info: {
    displayName: 'Service category';
  };
  attributes: {
    category_id: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WebsiteSettingSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_website_setting_social_links';
  info: {
    displayName: 'Website social link';
  };
  attributes: {
    icon_class: Schema.Attribute.String;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    platform: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.accreditation': AboutAccreditation;
      'about.assessment': AboutAssessment;
      'about.booking': AboutBooking;
      'about.consultation': AboutConsultation;
      'about.core-value-item': AboutCoreValueItem;
      'about.core-values': AboutCoreValues;
      'about.doctors': AboutDoctors;
      'about.featured-services': AboutFeaturedServices;
      'about.hero': AboutHero;
      'about.hero-stat': AboutHeroStat;
      'about.hospital': AboutHospital;
      'about.international': AboutInternational;
      'about.item': AboutItem;
      'about.mission-vision': AboutMissionVision;
      'about.revision': AboutRevision;
      'about.surgeon-process': AboutSurgeonProcess;
      'about.surgeon-profile': AboutSurgeonProfile;
      'about.why-choose-benefit': AboutWhyChooseBenefit;
      'about.why-choose-statistic': AboutWhyChooseStatistic;
      'about.why-choose-us': AboutWhyChooseUs;
      'contact.address-tile': ContactAddressTile;
      'contact.consultation-contact': ContactConsultationContact;
      'contact.consultation-section': ContactConsultationSection;
      'contact.contact-info': ContactContactInfo;
      'contact.cta-stat': ContactCtaStat;
      'contact.elite-stack': ContactEliteStack;
      'contact.elite-stack-card': ContactEliteStackCard;
      'contact.expectation': ContactExpectation;
      'contact.expectation-item': ContactExpectationItem;
      'contact.faq': ContactFaq;
      'contact.faq-item': ContactFaqItem;
      'contact.hero': ContactHero;
      'contact.hotline-tile': ContactHotlineTile;
      'contact.hours-tile': ContactHoursTile;
      'contact.location-benefit': ContactLocationBenefit;
      'contact.map-section': ContactMapSection;
      'contact.quick-action-banner': ContactQuickActionBanner;
      'contact.quick-contact-card': ContactQuickContactCard;
      'contact.select-option': ContactSelectOption;
      'contact.website-tile': ContactWebsiteTile;
      'customer.before-after-gallery': CustomerBeforeAfterGallery;
      'customer.benefit-item': CustomerBenefitItem;
      'customer.benefits': CustomerBenefits;
      'customer.checklist-item': CustomerChecklistItem;
      'customer.combined-testimonial-result': CustomerCombinedTestimonialResult;
      'customer.combined-testimonial-result-item': CustomerCombinedTestimonialResultItem;
      'customer.contact-info-item': CustomerContactInfoItem;
      'customer.cta': CustomerCta;
      'customer.faq': CustomerFaq;
      'customer.faq-item': CustomerFaqItem;
      'customer.feature-item': CustomerFeatureItem;
      'customer.gallery-item': CustomerGalleryItem;
      'customer.hero': CustomerHero;
      'customer.review-checklist-item': CustomerReviewChecklistItem;
      'customer.reviews': CustomerReviews;
      'customer.stat-item': CustomerStatItem;
      'customer.statistics': CustomerStatistics;
      'customer.story-item': CustomerStoryItem;
      'customer.success-stories': CustomerSuccessStories;
      'customer.why-choose-us': CustomerWhyChooseUs;
      'deep-plane.certification-card': DeepPlaneCertificationCard;
      'deep-plane.certifications': DeepPlaneCertifications;
      'deep-plane.checklist-item': DeepPlaneChecklistItem;
      'deep-plane.consultation': DeepPlaneConsultation;
      'deep-plane.credential-card': DeepPlaneCredentialCard;
      'deep-plane.credentials': DeepPlaneCredentials;
      'deep-plane.faq': DeepPlaneFaq;
      'deep-plane.faq-item': DeepPlaneFaqItem;
      'deep-plane.hero': DeepPlaneHero;
      'deep-plane.journey': DeepPlaneJourney;
      'deep-plane.journey-step': DeepPlaneJourneyStep;
      'deep-plane.metric': DeepPlaneMetric;
      'deep-plane.paragraph': DeepPlaneParagraph;
      'deep-plane.recovery': DeepPlaneRecovery;
      'deep-plane.recovery-stage': DeepPlaneRecoveryStage;
      'deep-plane.recovery-step': DeepPlaneRecoveryStep;
      'deep-plane.safety': DeepPlaneSafety;
      'deep-plane.safety-card': DeepPlaneSafetyCard;
      'footer.contact-info': FooterContactInfo;
      'footer.link': FooterLink;
      'footer.link-group': FooterLinkGroup;
      'footer.social-link': FooterSocialLink;
      'homepage.about-benefit': HomepageAboutBenefit;
      'homepage.blog-collection-section': HomepageBlogCollectionSection;
      'homepage.certificate-bundle': HomepageCertificateBundle;
      'homepage.certificate-item': HomepageCertificateItem;
      'homepage.certification': HomepageCertification;
      'homepage.certification-item': HomepageCertificationItem;
      'homepage.combined-testimonial-result-item': HomepageCombinedTestimonialResultItem;
      'homepage.consultation': HomepageConsultation;
      'homepage.consultation-section': HomepageConsultationSection;
      'homepage.cta': HomepageCta;
      'homepage.doctor': HomepageDoctor;
      'homepage.doctor-assessment-section': HomepageDoctorAssessmentSection;
      'homepage.doctor-badge': HomepageDoctorBadge;
      'homepage.doctor-profile': HomepageDoctorProfile;
      'homepage.doctor-stat': HomepageDoctorStat;
      'homepage.equipment-item': HomepageEquipmentItem;
      'homepage.equipment-showcase': HomepageEquipmentShowcase;
      'homepage.faq-contact-item': HomepageFaqContactItem;
      'homepage.faq-item': HomepageFaqItem;
      'homepage.feature-item': HomepageFeatureItem;
      'homepage.frequently-asked-questions-section': HomepageFrequentlyAskedQuestionsSection;
      'homepage.hero': HomepageHero;
      'homepage.hero-section': HomepageHeroSection;
      'homepage.hospital-based-surgery-section': HomepageHospitalBasedSurgerySection;
      'homepage.international-journey-section': HomepageInternationalJourneySection;
      'homepage.international-patients-section': HomepageInternationalPatientsSection;
      'homepage.journey-step': HomepageJourneyStep;
      'homepage.maris-method-section': HomepageMarisMethodSection;
      'homepage.paper-item': HomepagePaperItem;
      'homepage.patient-results-section': HomepagePatientResultsSection;
      'homepage.patient-testimonial': HomepagePatientTestimonial;
      'homepage.press-logo': HomepagePressLogo;
      'homepage.press-section': HomepagePressSection;
      'homepage.procedure-item': HomepageProcedureItem;
      'homepage.process-step': HomepageProcessStep;
      'homepage.proof-metric': HomepageProofMetric;
      'homepage.proof-showcase': HomepageProofShowcase;
      'homepage.result-story': HomepageResultStory;
      'homepage.results-section': HomepageResultsSection;
      'homepage.review-item': HomepageReviewItem;
      'homepage.revision-surgery-section': HomepageRevisionSurgerySection;
      'homepage.service-item': HomepageServiceItem;
      'homepage.services': HomepageServices;
      'homepage.signature-procedures-section': HomepageSignatureProceduresSection;
      'homepage.stat-item': HomepageStatItem;
      'homepage.surgical-care-process-section': HomepageSurgicalCareProcessSection;
      'homepage.technology-card': HomepageTechnologyCard;
      'homepage.technology-feature': HomepageTechnologyFeature;
      'homepage.testimonials-section': HomepageTestimonialsSection;
      'homepage.text-item': HomepageTextItem;
      'homepage.title-line': HomepageTitleLine;
      'homepage.video-section': HomepageVideoSection;
      'menu.link': MenuLink;
      'menu.nav-child': MenuNavChild;
      'menu.nav-item': MenuNavItem;
      'our-team.authority-card': OurTeamAuthorityCard;
      'our-team.authority-section': OurTeamAuthoritySection;
      'our-team.credential-row': OurTeamCredentialRow;
      'our-team.credentials-section': OurTeamCredentialsSection;
      'our-team.editorial-section': OurTeamEditorialSection;
      'our-team.faq-item': OurTeamFaqItem;
      'our-team.faq-section': OurTeamFaqSection;
      'our-team.hero-section': OurTeamHeroSection;
      'our-team.hospital-section': OurTeamHospitalSection;
      'our-team.international-section': OurTeamInternationalSection;
      'our-team.international-step': OurTeamInternationalStep;
      'our-team.item': OurTeamItem;
      'our-team.professional-section': OurTeamProfessionalSection;
      'our-team.revision-section': OurTeamRevisionSection;
      'our-team.step': OurTeamStep;
      'result.case': ResultCase;
      'result.category': ResultCategory;
      'seo.page-seo': SeoPageSeo;
      'seo.robots-rule': SeoRobotsRule;
      'service.faq-item': ServiceFaqItem;
      'service.faq-section': ServiceFaqSection;
      'treatments-page.editorial-section': TreatmentsPageEditorialSection;
      'treatments-page.hero-section': TreatmentsPageHeroSection;
      'treatments-page.item': TreatmentsPageItem;
      'website-setting.blog-category': WebsiteSettingBlogCategory;
      'website-setting.booking-form': WebsiteSettingBookingForm;
      'website-setting.booking-form-point': WebsiteSettingBookingFormPoint;
      'website-setting.contact-method': WebsiteSettingContactMethod;
      'website-setting.global-cta': WebsiteSettingGlobalCta;
      'website-setting.global-cta-step': WebsiteSettingGlobalCtaStep;
      'website-setting.service-category': WebsiteSettingServiceCategory;
      'website-setting.social-link': WebsiteSettingSocialLink;
    }
  }
}
