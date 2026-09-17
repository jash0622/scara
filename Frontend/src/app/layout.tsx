import type { Metadata } from 'next';
import './globals.css';
import LenisProvider from '@/components/smooth-scroll/LenisProvider';
import CustomCursor from '@/components/hud/CustomCursor';
import Navbar from '@/components/hud/Navbar';
import { JsonLd } from '@/components/seo/JsonLd';

const SITE_URL = 'https://scara.gg';
const SITE_NAME = 'SCARA';
const TITLE = 'SCARA — Global Creative Agency | Sports, Gaming, Music & Culture';
const DESCRIPTION =
  'Scara is a global culture-first creative agency operating across India, Turkey, Dubai & MENA and Africa — building brand strategy, gaming campaigns, influencer partnerships, sports events, live experiences and esports for brands like Konami, Samsung, Unilever, WPP, Supercell and Epic Games.';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | SCARA',
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'Scara',
    'SCARA Gaming',
    'Creative Agency',
    'Global Creative Agency',
    'Gaming Marketing Agency',
    'Sports Marketing',
    'Influencer Partnerships',
    'Live Events Agency',
    'Esports Agency',
    'Brand Strategy',
    'In-Game Integrations',
    'Culture Marketing',
    'India',
    'Turkey',
    'Dubai',
    'MENA',
    'Africa',
    'Mumbai',
    'Istanbul',
    'Konami',
    'Supercell',
    'Epic Games',
    'Samsung',
    'Unilever',
    'WPP',
  ],
  authors: [{ name: 'SCARA Gaming Private Limited', url: SITE_URL }],
  creator: 'SCARA Gaming Private Limited',
  publisher: 'SCARA Gaming Private Limited',
  category: 'Marketing & Advertising',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/community_hero.jpg',
        width: 1200,
        height: 630,
        alt: 'SCARA — Global culture-first creative agency across gaming, sports, music and live experiences',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/community_hero.jpg'],
    creator: '@scara_social',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/logo-scara.png', type: 'image/png' }],
    shortcut: ['/logo-scara.png'],
    apple: [{ url: '/logo-scara.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-scara-black text-scara-white antialiased selection:bg-scara-green selection:text-scara-black">
        {/* Structured data for SEO / AEO / GEO — no visual output */}
        <JsonLd />
        <LenisProvider>
          <CustomCursor />
          <Navbar />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
