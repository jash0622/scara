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
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1600&auto=format&fit=crop',
    talent: ['Gurpreet Singh Sandhu', 'Jonathan Gaming'],
    services: [
      'In-Game Cosmetics',
      'Localization Strategy',
      'Influencer Management',
      'Offline Community Engagement'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop'
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
    heroImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1600&auto=format&fit=crop',
    talent: ['Cosplay Creators Network'],
    services: [
      'Cosplayer Sourcing',
      'Talent Management',
      'Content Coordination',
      'Social Amplification'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
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
    heroImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
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
      'https://images.unsplash.com/photo-1522158634071-9c9957218e79?q=80&w=800&auto=format&fit=crop'
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
    heroImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop',
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
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop'
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
    heroImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
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
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop'
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
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1600&auto=format&fit=crop',
    talent: ['Turkish Brand Ambassadors'],
    services: [
      'Celebrity & Influencer Marketing',
      'Campaign Strategy & Execution',
      'Sustained Community Engagement'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop'
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
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1600&auto=format&fit=crop',
    talent: ['Istanbul Gaming Influencers'],
    services: [
      'Celebrity & Influencer Marketing',
      'Campaign Strategy & Execution'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop'
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
    heroImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1600&auto=format&fit=crop',
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
    heroImage: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=1600&auto=format&fit=crop',
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
    heroImage: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1600&auto=format&fit=crop',
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
    heroImage: 'https://images.unsplash.com/photo-1626248801379-51a0748a5f96?q=80&w=1600&auto=format&fit=crop',
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
    heroImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop',
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
    title: 'Creator Marketing',
    description: 'Hyper-localized creator networks across India, Turkey & MENA for authentic engagement.',
    bgImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop'
  },
  {
    number: '03',
    title: 'Gaming Marketing',
    description: 'Publisher growth campaigns, CPI performance marketing, community Discord hubs, and viral drops.',
    bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    number: '04',
    title: 'Sports Marketing',
    description: 'Star athlete partnerships, destination marketing, fan engagement, and emerging league IP creation.',
    bgImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop'
  },
  {
    number: '05',
    title: 'Live Events',
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
    title: 'Esports & Tournaments',
    description: 'Grassroots to pro-circuit tournament operations, broadcast production, and multi-cam live streams.',
    bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop'
  },
  {
    number: '08',
    title: 'In-Game Brand Integrations',
    description: 'Designing custom in-game skins, festive jerseys, artist collaborations, and native virtual assets.',
    bgImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop'
  }
];

export const SCARA_TEAM: TeamMember[] = [
  {
    name: 'Manoj George',
    role: 'Founder',
    bio: '20+ years building pioneering sports, entertainment & gaming IPs across global markets.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com/in/manojgeorge/'
  },
  {
    name: 'Mazher Ramzanal',
    role: 'Business Head, Scara Live',
    bio: 'Specialist in physical fandom, arena-scale live events, sports broadcasts & ticketed IPs.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com'
  },
  {
    name: 'Mahmoud Zeidan',
    role: 'Business Head, Gaming',
    bio: 'Global gaming leader driving AAA publisher partnerships and mobile performance campaigns.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com'
  },
  {
    name: 'Santosh P',
    role: 'Marketing & Ticketing Strategy, Scara Live',
    bio: '15+ years delivering large-scale stadium execution and ticketing revenue engines.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com'
  },
  {
    name: 'Ozgur Ozalp',
    role: 'Head of Publisher Relations',
    bio: 'Ex-Epic, Riot & Nintendo veteran connecting global game studios with emerging markets.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com'
  },
  {
    name: 'Vikas Chand',
    role: 'Business Head, Sports',
    bio: '20+ years driving sports commercialization, athlete management, and fan loyalty.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com'
  },
  {
    name: 'Karan Khurana',
    role: 'Head of Publisher Business',
    bio: 'Directing strategic publisher growth and regional monetisation systems.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com'
  },
  {
    name: 'Arun Sadasivan',
    role: 'Head of Intellectual Properties',
    bio: '15+ years creating scalable sports, music & youth culture IP ecosystems.',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com'
  },
  {
    name: 'Nathaneal Slabbert',
    role: 'Head of Global Operations',
    bio: 'Operations architect synchronizing Mumbai, Istanbul, and UAE execution teams.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com'
  },
  {
    name: 'Zerah Gonsalves',
    role: 'Talent & Host Operations',
    bio: 'Pioneering host and talent operations across broadcast esports and culture fests.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com'
  },
  {
    name: 'Laurent Dumeau',
    role: 'Senior Advisor',
    bio: 'Board advisor bringing deep expertise in global media, sports rights, and strategic growth.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    name: 'Harry T',
    role: 'Strategic Advisor',
    bio: 'Strategic counsel across brand partnerships, investor relations, and market expansion.',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    name: 'Jayaganesh Sabapathy',
    role: 'Advisor',
    bio: 'Industry advisor with a track record in technology, digital ecosystems, and emerging markets.',
    image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=600&auto=format&fit=crop',
    linkedinUrl: 'https://www.linkedin.com',
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
    title: 'How Gaming and Live Sports Are Merging into One Cultural Funnel',
    outlet: 'Outlook Respawn',
    category: 'Interview',
    url: 'https://respawn.outlookindia.com',
    date: '2026'
  },
  {
    title: 'The Shift from Digital Attention to Physical Fandom in South Asia & MENA',
    outlet: 'Times of India',
    category: 'Interview',
    url: 'https://timesofindia.indiatimes.com',
    date: '2026'
  },
  {
    title: 'Building Loadouts for Brand Growth: Why Content Must Be Combat-Ready',
    outlet: 'Marketing Mind',
    category: 'Authored Article',
    url: 'https://marketingmind.in',
    date: '2025'
  },
  {
    title: 'Unlocking 600M+ Gamers Across India, MENA & Turkey',
    outlet: 'MediaBrief',
    category: 'Authored Article',
    url: 'https://mediabrief.com',
    date: '2025'
  },
  {
    title: 'KONAMI eFootball Campaign Reaches 28M+ Indian Football Fans Ahead of World Cup',
    outlet: 'CNBC TV18',
    category: 'Campaign Coverage',
    url: 'https://cnbctv18.com',
    date: '2026'
  },
  {
    title: 'PWR Pickleball & Times Group Partner with Scara for Multi-Cam Global Broadcast',
    outlet: 'Sports Mint',
    category: 'Campaign Coverage',
    url: 'https://sportsmintmedia.com',
    date: '2025'
  }
];
