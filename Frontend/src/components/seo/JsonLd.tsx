/**
 * Structured data (JSON-LD) for SEO, AEO (answer engines) and GEO (generative
 * engines). Rendered as inline <script type="application/ld+json"> tags — this
 * produces NO visual output and does not affect layout or functionality.
 *
 * All values are derived from existing on-page content (services, locations,
 * clients, contact details) — nothing new is invented for the UI.
 */

const SITE_URL = 'https://scara.gg';
const LOGO_URL = `${SITE_URL}/logo-scara.png`;

const SERVICES = [
  'Brand Strategy',
  'Influencer Partnerships',
  'Gaming Campaigns',
  'Sports Events',
  'Live Experiences',
  'PR & Comms',
  'Esports',
  'In-Game Integrations',
];

const AREA_SERVED = ['India', 'Turkey', 'United Arab Emirates', 'MENA', 'Africa'];

// ── Organization ──────────────────────────────────────────────────────────────
const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'SCARA',
  legalName: 'SCARA Gaming Private Limited',
  url: SITE_URL,
  logo: LOGO_URL,
  image: `${SITE_URL}/community_hero.jpg`,
  description:
    'A global culture-first creative agency building brand strategy, gaming campaigns, influencer partnerships, sports events, live experiences and esports across India, Turkey, Dubai & MENA and Africa.',
  email: 'contact@scara.gg',
  foundingLocation: 'Mumbai, India',
  address: {
    '@type': 'PostalAddress',
    streetAddress:
      'Office Number HD-648, C-20, WeWork Enam Sambhav, G-Block Road, Bandra East',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    postalCode: '400051',
    addressCountry: 'IN',
  },
  areaServed: AREA_SERVED.map((name) => ({ '@type': 'Place', name })),
  sameAs: [
    'https://in.linkedin.com/company/druidscara',
    'https://www.instagram.com/scara_social',
  ],
};

// ── WebSite (with sitelinks search action) ────────────────────────────────────
const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'SCARA',
  description:
    'Global creative agency across sports, gaming, music and culture.',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en',
};

// ── ProfessionalService (offer catalog) ───────────────────────────────────────
const professionalService = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#service`,
  name: 'SCARA',
  image: `${SITE_URL}/community_hero.jpg`,
  url: SITE_URL,
  email: 'contact@scara.gg',
  parentOrganization: { '@id': `${SITE_URL}/#organization` },
  areaServed: AREA_SERVED.map((name) => ({ '@type': 'Place', name })),
  serviceType: SERVICES,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'SCARA Capabilities & Loadouts',
    itemListElement: SERVICES.map((service) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: service },
    })),
  },
};

// ── BreadcrumbList (primary sections) ─────────────────────────────────────────
const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/#about` },
    { '@type': 'ListItem', position: 3, name: 'Services', item: `${SITE_URL}/#services` },
    { '@type': 'ListItem', position: 4, name: 'Work', item: `${SITE_URL}/#work` },
    { '@type': 'ListItem', position: 5, name: 'Team', item: `${SITE_URL}/#team` },
    { '@type': 'ListItem', position: 6, name: 'Insights', item: `${SITE_URL}/#insights` },
    { '@type': 'ListItem', position: 7, name: 'Contact', item: `${SITE_URL}/#contact` },
  ],
};

// ── FAQPage (for AEO / GEO answer surfacing) ──────────────────────────────────
// Answers summarise existing on-page content — no new claims.
const faq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does SCARA do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SCARA is a global culture-first creative agency working across sports, gaming, music and live experiences. Its capabilities include brand strategy, influencer partnerships, gaming campaigns, sports events, live experiences, PR & communications, esports and in-game integrations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where does SCARA operate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SCARA operates across India, Turkey, Dubai & MENA and Africa, with its office in Mumbai, India.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which brands has SCARA worked with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SCARA has partnered with brands and publishers including Konami, Samsung, Unilever, WPP, Supercell, Epic Games, Armani Exchange, Visit Seattle, The Times of India, Fossil, PlaySide and Vizta Games.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I contact SCARA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can reach SCARA by email at contact@scara.gg or through the contact form on scara.gg.',
      },
    },
  ],
};

export function JsonLd() {
  const graph = [organization, website, professionalService, breadcrumb, faq];
  return (
    <>
      {graph.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Structured data is static and trusted (authored here, not user input).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
