# Design System — Shared Components

## Component inventory
The visual reference strongly supports a reusable component system rather than page-specific markup.

### Global
- `Header`
- `MobileNavDrawer`
- `Footer`
- `SectionHeading`
- `Breadcrumbs`
- `PrimaryButton`
- `SecondaryButton`
- `IconButton`
- `Card`
- `Badge`

### Medical/service
- `ServiceCard`
- `ServiceFeatureCard`
- `TechnologyCard`
- `BenefitCard`
- `DoctorCard`
- `MetricCard`
- `AccreditationLogo`
- `BeforeAfterMedia`
- `TestimonialCard`
- `PricingCard`
- `FAQAccordion`
- `ProcedureStep`

### Knowledge
- `ArticleCard`
- `ArticleListItem`
- `CategoryTab`
- `SearchField`
- `NewsletterSignup`
- `TableOfContents`
- `RelatedServiceItem`

### Conversion/contact
- `ConsultationForm`
- `ContactMethodCard`
- `ClinicInfoCard`
- `MapCard`
- `ConversionBanner`

## Button dimensions
- small: 36–40 px high;
- default: 44–48 px;
- large hero: 48–52 px;
- horizontal padding default: 18–24 px.

## Cards
### Default card
- white background;
- 1 px pale border;
- 16 px radius;
- 20–24 px padding;
- soft shadow optional.

### Interactive card
- entire card can be clickable only if semantics are preserved;
- focus ring must be visible;
- hover can translate upward max 3 px;
- image scale max 1.02.

## Forms
- label always visible;
- field height 44–48 px;
- textarea min-height 112–140 px;
- border 1 px neutral blue-gray;
- focus ring 2–3 px primary-soft + primary border;
- error text directly below field;
- success confirmation must not rely on color only.

## Icon style
The design uses thin rounded blue line icons.
Normalize icons to:
- 20–24 px default;
- 1.75–2 px stroke;
- round line caps/joins;
- primary-blue icon on pale-blue circular surface.

## Shared doctor card
- portrait 3:4 or top crop;
- name H4;
- specialty/role 14 px;
- 2–4 credential bullets max in card view;
- full profile reveals additional details.

## Shared footer
Canonical footer should be identical across all routes except locale/content values.
