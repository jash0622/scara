// ─────────────────────────────────────────────────────────────────────────────
// scaraData.ts — STATIC content only
//
// Dynamic data (case studies, insights) is now fully served from the backend API.
//   → Types:   src/lib/types.ts
//   → Fetching: src/lib/api.ts  (fetchCaseStudies, fetchInsights, submitEnquiry)
//
// This file contains only data that does NOT come from the database:
//   services, team members, client logos, press outlets, advisors.
// ─────────────────────────────────────────────────────────────────────────────

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  bgImage: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image: string;
  linkedinUrl?: string;
}

// ── Services ──────────────────────────────────────────────────────────────────

export const SCARA_SERVICES: ServiceItem[] = [
  {
    number: '01',
    title: 'Brand Strategy',
    description: 'Cultural positioning, audience intelligence, loadout planning, and combat-ready brand systems.',
    bgImage: '/Services/Brand Strategy.jpg',
  },
  {
    number: '02',
    title: 'Influencer Partnerships',
    description: 'Hyper-localized creator networks across India, Turkey & MENA for authentic engagement.',
    bgImage: '/Services/Influencers.jpg',
  },
  {
    number: '03',
    title: 'Gaming Campaigns',
    description: 'Publisher growth campaigns, CPI performance marketing, community Discord hubs, and viral drops.',
    bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '04',
    title: 'Sports Events',
    description: 'Star athlete partnerships, destination marketing, fan engagement, and emerging league IP creation.',
    bgImage: '/Services/Sports Events.jpg',
  },
  {
    number: '05',
    title: 'Live Experiences',
    description: 'Stadium and arena-scale physical activations, ticketed festivals, end-to-end execution.',
    bgImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '06',
    title: 'PR & Communications',
    description: 'High-impact media relations, press distribution across top global sports, tech, and entertainment outlets.',
    bgImage: '/Services/PR & Comms.jpg',
  },
  {
    number: '07',
    title: 'Esports',
    description: 'Grassroots to pro-circuit tournament operations, broadcast production, and multi-cam live streams.',
    bgImage: '/Services/Esports.jpg',
  },
  {
    number: '08',
    title: 'In-Game Integrations',
    description: 'Designing custom in-game skins, festive jerseys, artist collaborations, and native virtual assets.',
    bgImage: '/Services/Ingame Integration.jpg',
  },
];

// ── Team ──────────────────────────────────────────────────────────────────────

export const SCARA_TEAM: TeamMember[] = [
  {
    name: 'Manoj George',
    role: 'Founder',
    bio: '20+ years across sports, gaming and entertainment.',
    image: '/team member/Manoj George.png',
    linkedinUrl: 'https://www.linkedin.com/in/manoj-g-95b80810',
  },
  {
    name: 'Zerah Gonsalves',
    role: 'Creative Strategy & Business Operations, Scara',
    bio: 'Esports veteran blending creative strategy, gaming and business.',
    image: '/team member/Zerah Gonsalves.png',
    linkedinUrl: 'https://www.linkedin.com/in/zerahangelagonsalves',
  },
  {
    name: 'Mazher Ramzanali',
    role: 'Business Head, Scara Live',
    bio: '15+ years in branding, culture and sponsorship.',
    image: '/team member/Mazher .png',
    linkedinUrl: 'https://www.linkedin.com/in/mazherramzanali',
  },
  {
    name: 'Santosh P',
    role: 'Co-founder, Scara Live',
    bio: '16+ years building live experiences and entertainment.',
    image: '/team member/santosh.png',
    linkedinUrl: 'https://www.linkedin.com/in/santoshp0',
  },
  {
    name: 'Vikas Chand',
    role: 'Sports Business Head, Scara Live',
    bio: '20+ years in sports marketing and fan engagement.',
    image: '/team member/Vikas Chand.png',
    linkedinUrl: 'https://www.linkedin.com/in/vikas-chand-6873b010',
  },
  {
    name: 'Karan Khurana',
    role: 'Head of Publisher Business, Scara',
    bio: '10+ years in publisher partnerships and business development.',
    image: '/team member/Karan Khurana.png',
    linkedinUrl: 'https://www.linkedin.com/in/karan-khurana-5701b6214',
  },
  {
    name: 'Arun Sadasivan',
    role: 'Head of IP Business, Scara',
    bio: '15 years across sports, media and entertainment.',
    image: '/team member/arun.png',
    linkedinUrl: 'https://www.linkedin.com/in/arun-sadasivan-271b8056',
  },
  {
    name: 'Nathaneal Slabbert',
    role: 'Head of Global Operations, Scara',
    bio: '16+ years in esports production and management.',
    image: '/team member/Nathaneal Slabbert.png',
    linkedinUrl: undefined,
  },
  {
    name: 'Akhil Gokul',
    role: 'Head of PR & Social Media, Scara',
    bio: 'PR, social and digital content specialist shaping brand conversations.',
    image: '/team member/akhil .png',
    linkedinUrl: 'https://www.linkedin.com/in/akhilgokul0i3',
  },
  {
    name: 'Ranjit Dhoran',
    role: 'Project Manager, Scara',
    bio: 'Campaign planning, project management and client servicing specialist.',
    image: '/team member/scara team4.png',
    linkedinUrl: 'https://www.linkedin.com/in/ranjit-dhoran17',
  },
  {
    name: 'Hariharan Sunder',
    role: 'India Ops Head, Scara',
    bio: 'Live events specialist across culture, gaming and music.',
    image: '/team member/Hariharan.png',
    linkedinUrl: 'https://www.linkedin.com/in/hariharan-sunder-89846457',
  },
  {
    name: 'Laurent Dumeau',
    role: 'Senior Advisor',
    bio: 'International media and sports leader in strategy and growth.',
    image: '/team member/Laurent Dumeau.png',
    linkedinUrl: 'https://www.linkedin.com/in/laurentdumeau',
  },
  {
    name: 'Harry T',
    role: 'Strategic Advisor',
    bio: 'Partnerships and growth strategist across sports, gaming and entertainment.',
    image: '/team member/Harry t.png',
    linkedinUrl: 'https://www.linkedin.com/in/harryteper007',
  },
  {
    name: 'Jayaganesh Sabapathy',
    role: 'Advisor',
    bio: 'Sports broadcasting and distribution expert across global markets.',
    image: '/team member/Jayaganesh.png',
    linkedinUrl: 'https://www.linkedin.com/in/jayaganesh-sabapathy-5bbb50a',
  },
];

// ── Advisors ──────────────────────────────────────────────────────────────────

export const SCARA_ADVISORS = [
  { name: 'Laurent Dumeau', title: 'Senior Advisor' },
  { name: 'Harry T', title: 'Strategic Advisor' },
  { name: 'Jayaganesh Sabapathy', title: 'Advisor' },
];

// ── Clients ───────────────────────────────────────────────────────────────────

export const SCARA_CLIENTS = [
  { name: 'Samsung', category: 'Technology' },
  { name: 'Konami', category: 'Gaming Publisher' },
  { name: 'Unilever', category: 'FMCG' },
  { name: 'WPP', category: 'Agency Network' },
  { name: 'Supercell', category: 'Gaming Publisher' },
  { name: 'Epic Games', category: 'Gaming Engine & Publisher' },
  { name: 'Armani Exchange', category: 'Fashion & Luxury' },
  { name: 'Visit Seattle', category: 'Destination Marketing' },
  { name: 'The Times of India', category: 'Media Conglomerate' },
  { name: 'Fossil', category: 'Lifestyle' },
  { name: 'ITP Media Group', category: 'Media Network' },
  { name: 'Fairbreak', category: 'Sports IP' },
  { name: 'ETPL', category: 'Entertainment' },
  { name: 'PlaySide', category: 'Game Studio' },
  { name: 'Vizta Games', category: 'Gaming Publisher' },
];

// ── Client logos (logo loop) ──────────────────────────────────────────────────

export const SCARA_CLIENT_LOGOS = [
  { src: '/clients/brand logos 1.png', alt: 'Scara Client Brand 1' },
  { src: '/clients/brand logos 2.png', alt: 'Scara Client Brand 2' },
  { src: '/clients/brand logos 3.png', alt: 'Scara Client Brand 3' },
  { src: '/clients/brand logos 4.png', alt: 'Scara Client Brand 4' },
  { src: '/clients/brand logos 5.png', alt: 'Scara Client Brand 5' },
  { src: '/clients/brand logos 6.png', alt: 'Scara Client Brand 6' },
  { src: '/clients/brand logos 7.png', alt: 'Scara Client Brand 7' },
  { src: '/clients/brand logos 8.png', alt: 'Scara Client Brand 8' },
  { src: '/clients/brand logos 9.png', alt: 'Scara Client Brand 9' },
  { src: '/clients/Armani_Exchange_white_transparent_16x9.png', alt: 'Armani Exchange' },
  { src: '/clients/KONAMI_white_transparent_16x9.png', alt: 'KONAMI' },
  { src: '/clients/Layer 10.png', alt: 'Scara Global Partner' },
  { src: '/clients/PlaySide_Studios_white_transparent_16x9.png', alt: 'PlaySide Studios' },
  { src: '/clients/Visit_Seattle_white_transparent_16x9.png', alt: 'Visit Seattle' },
  { src: '/clients/Vizta_Games_white_transparent_16x9.png', alt: 'Vizta Games' },
];

// ── Press outlets ─────────────────────────────────────────────────────────────

export const SCARA_PRESS = [
  'IGN',
  'The Times of India',
  'The Hindu',
  'Dailyhunt',
  'TalkEsport',
  'Insider Sport',
  'CNBC TV18',
  'exchange4media',
  'India TV',
  'Dainik Bhaskar',
  'Animation Xpress',
  'Adgully',
  'Malayalam Express News',
  'ET BrandEquity',
];
