# Header + Hero Figma element inventory

| Figma element | Exact content | Required | Data source | Action | Implementation file | Status |
|---|---|---:|---|---|---|---|
| Logo | Smilux | yes | GLOBAL_CMS_FIELD: navigation.logo | internal route `/` | `layout/Header.tsx` | CMS_FIELD |
| Nav item | Home | yes | GLOBAL_CMS_FIELD: navigation.navigation | internal route `/` | `layout/Header.tsx` | ROUTE |
| Nav item | About Us | yes | GLOBAL_CMS_FIELD: navigation.navigation | internal route `/about-us` | `layout/Header.tsx` | ROUTE |
| Nav item | Services | yes | GLOBAL_CMS_FIELD: navigation.navigation | internal route `/services` | `layout/Header.tsx` | ROUTE |
| Nav item | Technology | yes | GLOBAL_CMS_FIELD: navigation.navigation | `/technology` CMS page | `layout/Header.tsx` | BLOCKED_FUNCTIONAL until CMS page is confirmed |
| Nav item | Pricing | yes | GLOBAL_CMS_FIELD: navigation.navigation | `/pricing` CMS page | `layout/Header.tsx` | BLOCKED_FUNCTIONAL until CMS page is confirmed |
| Nav item | Blog | yes | GLOBAL_CMS_FIELD: navigation.navigation | internal route `/news` | `layout/Header.tsx` | ROUTE |
| Nav item | Contact | yes | GLOBAL_CMS_FIELD: navigation.navigation | internal route `/contact` | `layout/Header.tsx` | ROUTE |
| Header CTA | BOOK APPOINTMENT | yes | GLOBAL_CMS_FIELD: navigation.ctaText | booking modal | `layout/Header.tsx`, `ui/BookingButton.tsx` | EXISTING_BUSINESS_ACTION |
| Hero eyebrow | PREMIUM DENTAL CARE & SERVICES | yes | CMS_FIELD: homepage.hero.eyebrow | none | `blocks/HeroBlock.tsx` | CMS_FIELD |
| Hero H1 | Your Smile, Our Passion | yes | CMS_FIELD: homepage.hero.heading | none | `blocks/HeroBlock.tsx` | CMS_FIELD |
| Hero paragraph | At Smilux Dental, we combine advanced technology, experienced professionals, and a patient-first approach to deliver safe, lasting, and beautiful smiles for you and your loved ones. | yes | CMS_FIELD: homepage.hero.subheading | none | `blocks/HeroBlock.tsx` | CMS_FIELD |
| Primary CTA | BOOK APPOINTMENT | yes | CMS_FIELD: homepage.hero.cta_label | booking modal | `blocks/HeroBlock.tsx`, `ui/BookingButton.tsx` | EXISTING_BUSINESS_ACTION |
| Secondary CTA | WATCH VIDEO | yes | CMS_FIELD: homepage.hero.secondary_cta_label | video dialog | `blocks/HeroBlock.tsx` | BLOCKED_FUNCTIONAL until source is configured |
| Trust label | Trusted by 10,000+ Patients | yes | CMS_FIELD: homepage.hero.trust_label | none | `blocks/HeroBlock.tsx` | CMS_FIELD |
| Trust stars | 5 stars | yes | DERIVED_PRESENTATION from numeric rating | none | `blocks/HeroBlock.tsx` | DERIVED_PRESENTATION |
| Trust rating | 4.9/5 | yes | CMS_FIELD: homepage.hero.trust_rating | none | `blocks/HeroBlock.tsx` | CMS_FIELD |
| Avatar group | CMS patient avatars | yes | CMS_FIELD: homepage.hero.patient_avatars | none | `blocks/HeroBlock.tsx` | BLOCKED_MEDIA allowed for current review |
