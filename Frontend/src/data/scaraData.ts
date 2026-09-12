export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  market: string;
  category: 'Gaming' | 'Sports' | 'Live' | 'Culture';
  shortDesc: string;
  fullDesc: string[];
  heroImage: string;
  talent: string[];           // shown as pills under "Talent Used" on card
  services: string[];
  gallery: string[];
  pressOutlets: string[];
  isFeaturedIP?: boolean;
}

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

export interface InsightArticle {
  title: string;
  outlet: string;
  category: 'Interview' | 'Authored Article' | 'Campaign Coverage';
  url: string;
  date: string;
}

export const SCARA_CASE_STUDIES: CaseStudy[] = [

  // ── GAMING — INDIA ───────────────────────────────────────────────────────────

  {
    id: 'efootball-holi-25',
    slug: 'efootball-holi-25',
    title: "eFootball Holi '25",
    client: 'KONAMI',
    year: '2025',
    market: 'India',
    category: 'Gaming',
    shortDesc: 'Cultural Holi campaign with Indian football captain Gurpreet Singh Sandhu and top gaming creator Jonathan Gaming, driving downloads, UGC and tournament engagement.',
    fullDesc: [
      "To celebrate Holi, we partnered with Indian football captain Gurpreet Singh Sandhu and leading gaming creator Jonathan Gaming, amplified by 5 additional gaming influencers through localized content, social storytelling and community participation, driving awareness, downloads, UGC and tournament engagement."
    ],
    heroImage: '/Cover Photos Case Studies/eFootball Holi _25.jpg',
    talent: ['Gurpreet Singh Sandhu', 'Jonathan Gaming'],
    services: [
      'In-Game Cosmetics',
      'Localization Strategy',
      'Influencer Management',
      'Offline Community Engagement'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
    ],
    pressOutlets: ['IGN India', 'Animation Xpress', 'Adgully']
  },

  {
    id: 'moba-legends-cosplay',
    slug: 'moba-legends-cosplay',
    title: 'MOBA Legends 5V5 Cosplay',
    client: 'Vizta Games',
    year: '2025',
    market: 'India',
    category: 'Gaming',
    shortDesc: "End-to-end cosplay activation bringing MLBB's Fanny to life — from talent sourcing to publishing across Instagram for the 2025 anniversary campaign.",
    fullDesc: [
      "To bring MLBB's Fanny to life, Scara activated a curated network of cosplay creators, managing the end-to-end activation from talent sourcing and shortlisting to briefing, negotiations, content coordination and publishing across Instagram. The campaign delivered character-led, authentic content that extended the 2025 anniversary campaign beyond the game."
    ],
    heroImage: '/Cover Photos Case Studies/Mobalegends Cosplay.jpg',
    talent: ['Cosplay Creators Network'],
    services: [
      'Cosplayer Sourcing',
      'Talent Management',
      'Content Coordination',
      'Social Amplification'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    ],
    pressOutlets: ['TalkEsport', 'IGN India']
  },

  {
    id: 'efootball-independence-diwali-25',
    slug: 'efootball-independence-diwali-25',
    title: "eFootball Independence Day & Diwali '25",
    client: 'KONAMI',
    year: '2025',
    market: 'India',
    category: 'Gaming',
    shortDesc: 'Integrated Independence Day & Diwali campaign blending celebrity content, nationwide tournaments, Discord community building, PR and a large-scale offline Meet & Greet.',
    fullDesc: [
      "We led the expansion of eFootball™ in India by tapping into high-impact cultural moments — Independence Day and Diwali — to move beyond a core gaming audience and engage mainstream football fans and casual sports viewers.",
      "The campaign blended celebrity-led content, nationwide online tournaments, Discord-first community building, PR amplification, and a large-scale offline Meet & Greet. This integrated approach drove scale, participation, and long-term community retention."
    ],
    heroImage: '/Cover Photos Case Studies/eFootball Independence Day & Diwali _25.png',
    talent: ['Sunil Chhetri', 'KL Rahul', 'Ahan Shetty', 'Nitish Kumar Reddy'],
    services: [
      'In-Game Marketing',
      'Community Building',
      'Celebrity Management',
      'PR and Offline Activation',
      'In-game Jersey Design'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522158634071-9c9957218e79?q=80&w=800&auto=format&fit=crop',
    ],
    pressOutlets: ['The Times of India', 'The Hindu', 'exchange4media']
  },

  {
    id: 'efootball-messi-26',
    slug: 'efootball-messi-26',
    title: "eFootball Lionel Messi Campaign '26",
    client: 'KONAMI',
    year: '2026',
    market: 'India',
    category: 'Gaming',
    shortDesc: 'Creator-led launch of the Lionel Messi Card combining celebrity awareness with micro-influencers across Kerala and West Bengal, UGC challenges and regional PR.',
    fullDesc: [
      "To launch the Lionel Messi Card in eFootball™, we built a creator-led campaign to drive downloads, gameplay and participation. The campaign combined celebrity-led awareness with micro-influencers across Kerala and West Bengal, driving audiences to play with the Messi card and participate in a UGC challenge.",
      "Regional PR, digital media and creator content further amplified the launch across mainstream football communities."
    ],
    heroImage: '/Cover Photos Case Studies/eFootball Leo Messi Campaign _26.png',
    talent: ['Regional Micro-Influencers'],
    services: [
      'Celebrity & Influencer Marketing',
      'Regional Content & Localization',
      'PR & Media Amplification',
      'UGC & Community Engagement',
      'Campaign Strategy & Execution'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
    ],
    pressOutlets: ['IGN India', 'Sports Mint', 'TalkEsport']
  },

  {
    id: 'efootball-world-cup-26',
    slug: 'efootball-world-cup-26',
    title: "eFootball FIFA World Cup Campaign '26",
    client: 'KONAMI',
    year: '2026',
    market: 'India',
    category: 'Gaming',
    shortDesc: 'Nationwide CTV + mobile full-funnel campaign for eFootball™ across Kerala, West Bengal, Tamil Nadu and the North East ahead of FIFA World Cup 2026.',
    fullDesc: [
      "To build momentum for the FIFA World Cup 2026, we executed a nationwide CTV + mobile campaign for KONAMI eFootball™, using a full-funnel strategy across key football markets.",
      "Through regional targeting and continuous creative, media and performance optimisation, the campaign drove strong reach, engagement and video completion across Kerala, West Bengal, Tamil Nadu and the North East."
    ],
    heroImage: '/Cover Photos Case Studies/eFootball WC Campaign _26.png',
    talent: [],
    services: [
      'Nationwide Performance Media',
      'Content Localization',
      'Media Advisory',
      'Campaign Strategy & Execution',
      'Measurement & Reporting'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop',
    ],
    pressOutlets: ['IGN India', 'Times of India', 'Animation Xpress', 'CNBC TV18']
  },

  // ── GAMING — TURKEY ──────────────────────────────────────────────────────────

  {
    id: 'supercell-brawlstars-turkey-25',
    slug: 'supercell-brawlstars-turkey-25',
    title: "Supercell Brawl Stars Turkey '25",
    client: 'Supercell',
    year: '2025',
    market: 'Turkey',
    category: 'Gaming',
    shortDesc: 'Always-on influencer and Brand Ambassador Programs for Supercell Brawl Stars across Turkey.',
    fullDesc: [
      "Always on influencer & Brand Ambassador Programs — a sustained, performance-driven creator strategy that kept Brawl Stars consistently top-of-mind across Turkish gaming communities."
    ],
    heroImage: '/Cover Photos Case Studies/Turkey Brawl Stars.png',
    talent: ['Turkish Brand Ambassadors'],
    services: [
      'Celebrity & Influencer Marketing',
      'Campaign Strategy & Execution',
      'Sustained Community Engagement'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop',
    ],
    pressOutlets: ['IGN Turkey', 'Insider Sport']
  },

  {
    id: 'efootball-influencer-turkey-25',
    slug: 'efootball-influencer-turkey-25',
    title: "eFootball Influencer Campaign Turkey '25",
    client: 'KONAMI',
    year: '2025',
    market: 'Turkey',
    category: 'Gaming',
    shortDesc: 'OOH & influencer campaigns across Istanbul, driving eFootball brand visibility in key urban gaming hubs.',
    fullDesc: [
      "OOH & influencer campaigns across Istanbul — combining high-impact out-of-home placements with a curated network of Turkish gaming influencers to drive eFootball brand visibility and player acquisition across the city's key urban hubs."
    ],
    heroImage: '/Cover Photos Case Studies/Turkey eFootball Influencer 2.png',
    talent: ['Istanbul Gaming Influencers'],
    services: [
      'Celebrity & Influencer Marketing',
      'Campaign Strategy & Execution'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop',
    ],
    pressOutlets: ['IGN Turkey', 'exchange4media']
  },

  {
    id: 'efootball-ramadan-turkey-25',
    slug: 'efootball-ramadan-turkey-25',
    title: "eFootball Ramadan Campaign Turkey '25",
    client: 'KONAMI',
    year: '2025',
    market: 'Turkey',
    category: 'Gaming',
    shortDesc: 'Limited-edition eFootball Ramadan gift box — Ramadan jersey, signed team kit and personalised codes — created with Turkish designers for the community.',
    fullDesc: [
      "For Ramadan, we collaborated with Turkish designers to create a special, limited-edition eFootball™ Ramadan box. Each box included a Ramadan jersey, a signed team kit, and personalized notes featuring unique codes tailored for each recipient.",
      "The campaign resonated deeply with the community, generating strong organic unboxing content and story views across Turkish social platforms."
    ],
    heroImage: '/Cover Photos Case Studies/efootball Ramadan _25.webp',
    talent: ['Turkish Designers', 'Community Creators'],
    services: [
      'Special Gift Box',
      'Content Production'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['IGN Turkey', 'Insider Sport']
  },

  {
    id: 'supercell-coc-brawlstars-turkey-25',
    slug: 'supercell-coc-brawlstars-turkey-25',
    title: "Supercell Clash of Clans & Brawl Stars Growth Campaign Turkey '25",
    client: 'Supercell',
    year: '2025',
    market: 'Turkey',
    category: 'Gaming',
    shortDesc: 'Performance-driven gaming growth at scale for Clash of Clans and Brawl Stars across Turkey.',
    fullDesc: [
      "Performance driven gaming growth at scale — a data-first user acquisition strategy for Supercell's Clash of Clans and Brawl Stars, optimising CPI and reaching high-intent players across Turkey through targeted performance marketing."
    ],
    heroImage: '/Cover Photos Case Studies/Turkey Brawl Stars & COC.jpg',
    talent: [],
    services: [
      'User Acquisition',
      'Performance Marketing'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['IGN Turkey', 'Insider Sport']
  },

  {
    id: 'efootball-influencer-vs-influencer-turkey-25',
    slug: 'efootball-influencer-vs-influencer-turkey-25',
    title: "eFootball Influencer vs Influencer Campaign Turkey '25",
    client: 'KONAMI',
    year: '2025',
    market: 'Turkey',
    category: 'Gaming',
    shortDesc: 'Unique competitive format — three influencers battling through in-game challenges, with participant counts determining prize pools for their followers.',
    fullDesc: [
      "For our June eFootball™ campaign, we created a unique competitive format where three influencers battled it out through in-game challenges, with each creator's participant count directly determining the number of prizes they could unlock and give back to their followers.",
      "The format drove intense community participation, fostering rival fan bases and generating millions of video views across Turkish platforms."
    ],
    heroImage: '/Cover Photos Case Studies/eFootball Turkey influencer vs Influencer.png',
    talent: ['3 Turkish Gaming Influencers'],
    services: [
      'In-Game Advisory',
      'Influencer Marketing'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['IGN Turkey', 'exchange4media']
  },

  // ── LIVE ─────────────────────────────────────────────────────────────────────

  {
    id: 'pwr-pickleball-league',
    slug: 'pwr-pickleball-league',
    title: 'PWR Pickleball League',
    client: 'Times Group',
    year: '2025',
    market: 'Global',
    category: 'Live',
    shortDesc: 'Seamlessly executed the end-to-end broadcast and production for the PWR Pickleball League for Times Group.',
    fullDesc: [
      "Scara seamlessly executed the end-to-end broadcast and production for the Pickleball League for Times Group.",
      "Featuring a multi-angle live broadcast setup, instant replays, multilingual commentary teams, and international broadcast feeds — delivering a world-class viewer experience."
    ],
    heroImage: '/Cover Photos Case Studies/PWR Pickleball.png',
    talent: [],
    services: [
      'Digital Broadcast',
      'Broadcast Production'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['The Times of India', 'CNBC TV18', 'Insider Sport']
  },

  {
    id: 'run-for-fun-red-fort',
    slug: 'run-for-fun-red-fort',
    title: 'Run For Fun — Red Fort Terriers Silver Jubilee',
    client: 'ADGPI - Indian Army',
    year: '2025',
    market: 'India',
    category: 'Live',
    shortDesc: 'Conceptualised and executed a special marathon event celebrating the Silver Jubilee of the Red Fort Terriers Regiment, bringing together regiment personnel and families.',
    fullDesc: [
      "Scara conceptualised and executed the Run for Fun, a special marathon event celebrating the Silver Jubilee of the Red Fort Terriers Regiment.",
      "Designed as a celebration of camaraderie and family, the event brought together regiment personnel and their families for a fun, engaging fitness experience, honouring 25 years of service while creating memorable moments of togetherness."
    ],
    heroImage: '/Cover Photos Case Studies/Run for Fun.jpg',
    talent: [],
    services: [
      'End-to-end Event Execution'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['India TV', 'Dainik Bhaskar']
  }

];

export const SCARA_SERVICES: ServiceItem[] = [
  {
    number: '01',
    title: 'Brand Strategy',
    description: 'Cultural positioning, audience intelligence, loadout planning, and combat-ready brand systems.',
    bgImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop'
  },
  {
    number: '02',
    title: 'Influencer Partnerships',
    description: 'Hyper-localized creator networks across India, Turkey & MENA for authentic engagement.',
    bgImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop'
  },
  {
    number: '03',
    title: 'Gaming Campaigns',
    description: 'Publisher growth campaigns, CPI performance marketing, community Discord hubs, and viral drops.',
    bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    number: '04',
    title: 'Sports Events',
    description: 'Star athlete partnerships, destination marketing, fan engagement, and emerging league IP creation.',
    bgImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop'
  },
  {
    number: '05',
    title: 'Live Experiences',
    description: 'Stadium and arena-scale physical activations, ticketed festivals, end-to-end execution.',
    bgImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop'
  },
  {
    number: '06',
    title: 'PR & Communications',
    description: 'High-impact media relations, press distribution across top global sports, tech, and entertainment outlets.',
    bgImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    number: '07',
    title: 'Esports',
    description: 'Grassroots to pro-circuit tournament operations, broadcast production, and multi-cam live streams.',
    bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop'
  },
  {
    number: '08',
    title: 'In-Game Integrations',
    description: 'Designing custom in-game skins, festive jerseys, artist collaborations, and native virtual assets.',
    bgImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop'
  }
];

export const SCARA_TEAM: TeamMember[] = [
  {
    name: 'Manoj George',
    role: 'Founder',
    bio: '20+ years across sports, gaming and entertainment.',
    image: '/team member/Manoj George.png',
    linkedinUrl: 'https://www.linkedin.com/in/manoj-g-95b80810'
  },
  {
    name: 'Mazher Ramzanali',
    role: 'Business Head, Scara Live',
    bio: '15+ years in branding, culture and sponsorship.',
    image: '/team member/Mazher .png',
    linkedinUrl: 'https://www.linkedin.com/in/mazherramzanali'
  },
  {
    name: 'Santosh P',
    role: 'Co-founder, Scara Live',
    bio: '16+ years building live experiences and entertainment.',
    image: '/team member/santosh.png',
    linkedinUrl: 'https://www.linkedin.com/in/santoshp0'
  },
  {
    name: 'Vikas Chand',
    role: 'Sports Business Head, Scara Live',
    bio: '20+ years in sports marketing and fan engagement.',
    image: '/team member/Vikas Chand.png',
    linkedinUrl: 'https://www.linkedin.com/in/vikas-chand-6873b010'
  },
  {
    name: 'Karan Khurana',
    role: 'Head of Publisher Business, Scara',
    bio: '10+ years in publisher partnerships and business development.',
    image: '/team member/Karan Khurana.png',
    linkedinUrl: 'https://www.linkedin.com/in/karan-khurana-5701b6214'
  },
  {
    name: 'Arun Sadasivan',
    role: 'Head of IP Business, Scara',
    bio: '15 years across sports, media and entertainment.',
    image: '/team member/arun.png',
    linkedinUrl: 'https://www.linkedin.com/in/arun-sadasivan-271b8056'
  },
  {
    name: 'Nathaneal Slabbert',
    role: 'Head of Global Operations, Scara',
    bio: '16+ years in esports production and management.',
    image: '/team member/Nathaneal Slabbert.png',
    linkedinUrl: undefined
  },
  {
    name: 'Zerah Gonsalves',
    role: 'Creative Strategy & Business Operations, Scara',
    bio: 'Esports veteran blending creative strategy, gaming and business.',
    image: '/team member/Zerah Gonsalves.png',
    linkedinUrl: 'https://www.linkedin.com/in/zerahangelagonsalves'
  },
  {
    name: 'Akhil Gokul',
    role: 'Head of PR & Social Media, Scara',
    bio: 'PR, social and digital content specialist shaping brand conversations.',
    image: '/team member/akhil .png',
    linkedinUrl: 'https://www.linkedin.com/in/akhilgokul0i3'
  },
  {
    name: 'Ranjit Dhoran',
    role: 'Project Manager, Scara',
    bio: 'Campaign planning, project management and client servicing specialist.',
    image: '/team member/scara team4.png',
    linkedinUrl: 'https://www.linkedin.com/in/ranjit-dhoran17'
  },
  {
    name: 'Hariharan Sunder',
    role: 'India Ops Head, Scara',
    bio: 'Live events specialist across culture, gaming and music.',
    image: '/team member/Hariharan.png',
    linkedinUrl: 'https://www.linkedin.com/in/hariharan-sunder-89846457'
  },
  {
    name: 'Laurent Dumeau',
    role: 'Senior Advisor',
    bio: 'International media and sports leader in strategy and growth.',
    image: '/team member/Laurent Dumeau.png',
    linkedinUrl: 'https://www.linkedin.com/in/laurentdumeau'
  },
  {
    name: 'Harry T',
    role: 'Strategic Advisor',
    bio: 'Partnerships and growth strategist across sports, gaming and entertainment.',
    image: '/team member/Harry t.png',
    linkedinUrl: 'https://www.linkedin.com/in/harryteper007'
  },
  {
    name: 'Jayaganesh Sabapathy',
    role: 'Advisor',
    bio: 'Sports broadcasting and distribution expert across global markets.',
    image: '/team member/Jayaganesh.png',
    linkedinUrl: 'https://www.linkedin.com/in/jayaganesh-sabapathy-5bbb50a'
  },
];

export const SCARA_ADVISORS = [
  { name: 'Laurent Dumeau', title: 'Senior Advisor' },
  { name: 'Harry T', title: 'Strategic Advisor' },
  { name: 'Jayaganesh Sabapathy', title: 'Advisor' }
];

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
  { name: 'Vizta Games', category: 'Gaming Publisher' }
];

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

export const SCARA_PRESS = [
  'IGN', 'The Times of India', 'The Hindu', 'Dailyhunt', 'TalkEsport',
  'Insider Sport', 'CNBC TV18', 'exchange4media', 'India TV',
  'Dainik Bhaskar', 'Animation Xpress', 'Adgully', 'Malayalam Express News', 'ET BrandEquity'
];

export const SCARA_INSIGHTS: InsightArticle[] = [
  {
    title: "Inside India's Esports Boom: Why Leagues, Careers, and Homegrown IP Matter More Than Ever",
    outlet: 'Times of India',
    category: 'Interview',
    url: 'https://timesofindia.indiatimes.com/sports/esports/news/inside-indias-esports-boom-why-leagues-careers-and-homegrown-ip-matter-more-than-ever/articleshow/132414039.cms',
    date: 'Manoj George'
  },
  {
    title: 'AI, Live Entertainment, Ticketing — The Next Frontier of Event Technology',
    outlet: 'Live Mint',
    category: 'Interview',
    url: 'https://www.livemint.com/industry/media/ai-live-entertainment-ticketing-bookmyshow-concerts-events-bot-detection-event-technology/amp-11783234582436.html',
    date: 'Mazher Ramzanali'
  },
  {
    title: 'The New Playbook of Sports: Why Emerging Formats Are Winning India\'s Attention',
    outlet: 'Marketing Mind',
    category: 'Authored Article',
    url: 'https://marketingmind.in/the-new-playbook-of-sports-why-emerging-formats-are-winning-indias-attention/',
    date: 'Arun Sadasivan'
  },
  {
    title: "Zee's FIFA 2026 Deal Sparks Debate on Football's Commercial Future in India",
    outlet: 'Ad Mirror',
    category: 'Authored Article',
    url: 'https://ad-mirror.com/media/zees-fifa-2026-deal-sparks-debate-on-footballs-commercial-future-in-india',
    date: 'Manoj George'
  },
  {
    title: 'Inside Scara: Building India\'s Next Gaming & Culture Powerhouse',
    outlet: 'Inside Sport',
    category: 'Interview',
    url: 'https://www.insidesport.in/gaming/scara/',
    date: 'Karan Khurana'
  },
  {
    title: 'From Spectators to Participants: The Rise of Interactive Marketing in Sports and Gaming',
    outlet: 'Media News 4U',
    category: 'Authored Article',
    url: 'https://www.medianews4u.com/from-spectators-to-participants-the-rise-of-interactive-marketing-in-sports-and-gaming/',
    date: 'Arun Sadasivan'
  },
  {
    title: "Anticipate Significant Growth and Continued Investment in Future",
    outlet: 'Media Info Line',
    category: 'Interview',
    url: 'https://www.mediainfoline.com/interview/anticipate-significant-growth-and-continued-investment-in-future-nathaneal-slabbert-head-of-global-operations-of-scara',
    date: 'Nathaneal Slabbert'
  },
  {
    title: 'Why BFSI and FMCG Are Missing the Esports Opportunity in India',
    outlet: 'Adgully',
    category: 'Authored Article',
    url: 'https://adgully.com/post/12954/manoj-george-on-why-bfsi-and-fmcg-are-missing-the-esports-opportunity-in-india',
    date: 'Manoj George'
  },
];
