export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  year: string;
  market: string;
  category: 'Gaming' | 'Sports' | 'Live' | 'Culture';
  shortDesc: string;
  fullDesc: string[];
  heroImage: string;
  previewStat: string;
  previewStatLabel: string;
  stats: { value: string; label: string }[];
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
  {
    id: 'konami-efootball-2026',
    slug: 'konami-efootball-2026',
    title: 'KONAMI eFootball™ — World Cup Momentum',
    year: '2026',
    market: 'India',
    category: 'Gaming',
    shortDesc: 'Nationwide CTV and mobile full-funnel campaign driving football gaming dominance across football-loving Indian hubs.',
    fullDesc: [
      'Ahead of major international football fever, Scara orchestrated an immersive nationwide media and creator campaign across key Indian football strongholds including Kerala, West Bengal, Tamil Nadu, and the North East.',
      'Integrating Connected TV (CTV) programmatic high-impact ads with mobile retargeting and community tournaments, the campaign established eFootball™ as the top digital football experience in South Asia.'
    ],
    heroImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
    previewStat: '28M+',
    previewStatLabel: 'Total Impressions',
    stats: [
      { value: '28M+', label: 'Total Campaign Impressions' },
      { value: '11M', label: 'Unique Users Reached' },
      { value: '4 Key Regions', label: 'Kerala, WB, TN & North East' },
      { value: '94%', label: 'Video Completion Rate on CTV' }
    ],
    services: [
      'Full-Funnel Media Strategy',
      'CTV & Programmatic Placement',
      'Regional Content Localization',
      'Community Activation'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['IGN India', 'Times of India', 'Animation Xpress', 'CNBC TV18']
  },
  {
    id: 'konami-messi-card',
    slug: 'konami-messi-card',
    title: 'KONAMI eFootball™ — Messi Card Launch',
    year: '2026',
    market: 'India',
    category: 'Gaming',
    shortDesc: 'Creator-led multi-tier influencer assault shattering engagement targets for the iconic Messi in-game card drop.',
    fullDesc: [
      'Scara orchestrated a celebrity and micro-creator hybrid launch strategy across India, pairing mainstream sporting icons with high-tier gaming influencers across Kerala and West Bengal.',
      'By turning the card drop into a cultural event with unboxing reaction videos, custom gameplay challenges, and community giveaways, Scara smashed all organic reach expectations.'
    ],
    heroImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop',
    previewStat: '15.7M',
    previewStatLabel: 'Creator Views',
    stats: [
      { value: '15.7M', label: 'Total Creator Views' },
      { value: '109M+', label: 'PR & Organic Reach' },
      { value: '2,371', label: 'UGC Submissions' },
      { value: '165%', label: 'Celebrity Target Exceeded' }
    ],
    services: [
      'Celebrity & Creator Marketing',
      'Influencer Talent Sourcing',
      'UGC Challenge System',
      'PR Amplification'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['IGN India', 'Sports Mint', 'TalkEsport']
  },
  {
    id: 'konami-celebration-spirit',
    slug: 'konami-celebration-spirit',
    title: 'KONAMI — One Celebration One Spirit',
    year: '2025',
    market: 'India',
    category: 'Live',
    shortDesc: 'Blending Independence Day & Diwali cultural moments with national icons, Discord hubs, and a viral Mumbai Meet & Greet.',
    fullDesc: [
      'Connecting festive patriotism with digital fandom, Scara onboarded Indian football legend Sunil Chhetri, cricket star KL Rahul, actor Ahan Shetty, and cricketer Nitish Kumar Reddy.',
      'The campaign bridged online community growth with physical fandom, culminating in a 380+ fan live Meet & Greet event in Mumbai.'
    ],
    heroImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
    previewStat: '32.6M',
    previewStatLabel: 'Video Views',
    stats: [
      { value: '32.6M', label: 'Campaign Views (vs 25.9M target)' },
      { value: '418.5M', label: 'Total PR Reach' },
      { value: '14,840', label: 'Tournament Registrations' },
      { value: '18,366', label: 'Discord Members Onboarded' }
    ],
    services: [
      'Mainstream Athlete & Talent Strategy',
      'Discord Community Infrastructure',
      'Physical Live Event Execution',
      'PR & National Media Outreach'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522158634071-9c9957218e79?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['The Times of India', 'The Hindu', 'exchange4media']
  },
  {
    id: 'konami-holi-2025',
    slug: 'konami-holi-2025',
    title: 'KONAMI eFootball™ — Festive Holi Campaign',
    year: '2025',
    market: 'India',
    category: 'Gaming',
    shortDesc: 'Vibrant cultural campaign featuring India football captain Gurpreet Singh Sandhu & Jonathan Gaming.',
    fullDesc: [
      'Leveraging India’s festival of colors, Scara fused gaming culture with regional pride, partnering national football captain Gurpreet Singh Sandhu alongside top-tier gaming creator Jonathan Gaming and 5 key regional influencers.',
      'The vibrant campaign resulted in explosive organic engagement and a massive spike in tournament signups.'
    ],
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1600&auto=format&fit=crop',
    previewStat: '+55%',
    previewStatLabel: 'Views Over Target',
    stats: [
      { value: '55% Higher', label: 'Views Beyond Target' },
      { value: '40x', label: 'Higher Reach Multiplier' },
      { value: '39.46%', label: 'Increase in Registrations' },
      { value: '100%', label: 'Cultural Relevance Score' }
    ],
    services: [
      'Cultural Insight & Creative Direction',
      'Gaming & Sports Talent Sourcing',
      'Social Video Production',
      'Tournament Growth'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['IGN', 'Animation Xpress', 'Adgully']
  },
  {
    id: 'konami-jersey-designs',
    slug: 'konami-jersey-designs',
    title: 'KONAMI In-Game Cultural Jersey Design',
    year: '2025',
    market: 'Global',
    category: 'Culture',
    shortDesc: 'Bridging haute couture, textile heritage (Assamese Gamusa), and in-game digital items with Shantanu Hazarika.',
    fullDesc: [
      'Scara managed the full pipeline: Cultural Insight → Creative Concept → Artist Collaboration → In-Game Digital Item Design → Global Campaign Amplification.',
      'Special editions included the Holi Jersey, Diwali Jersey, and 30th Anniversary x Shantanu Hazarika Gamusa textile design, worn virtually by millions of players worldwide.'
    ],
    heroImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1600&auto=format&fit=crop',
    previewStat: '3 In-Game',
    previewStatLabel: 'Cultural Jerseys',
    stats: [
      { value: '3 Kits', label: 'Holi, Diwali & 30th Anniversary' },
      { value: 'Artist Collab', label: 'Shantanu Hazarika' },
      { value: 'Textile Heritage', label: 'Assamese Gamusa Motif' },
      { value: 'Global', label: 'Millions of Downloads' }
    ],
    services: [
      'In-Game Brand & Item Integration',
      'Artistic Talent Collaboration',
      'Cultural Heritage Consulting',
      'Global Asset Production'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['ET BrandEquity', 'The Hindu', 'IGN India']
  },
  {
    id: 'mlbb-fanny-cosplay',
    slug: 'mlbb-fanny-cosplay',
    title: 'Mobile Legends: Bang Bang™ — Fanny Cosplay',
    year: '2025',
    market: 'India',
    category: 'Gaming',
    shortDesc: 'End-to-end cosplayer talent sourcing, custom costume fabrication, and viral Instagram Reels activation for Moonton.',
    fullDesc: [
      'To celebrate the Indian release of Mobile Legends: Bang Bang (MLBB), Scara sourced, curated, and produced custom high-detail cosplay armor for character Fanny.',
      'Accompanied by professional short-form film production and social stories, the activation dominated gaming feeds across Instagram.'
    ],
    heroImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1600&auto=format&fit=crop',
    previewStat: '100% Custom',
    previewStatLabel: 'Cosplay Activation',
    stats: [
      { value: 'End-to-End', label: 'Talent & Outfit Sourcing' },
      { value: 'Viral Reels', label: 'High Engagement Short Form' },
      { value: 'Moonton', label: 'Official Publisher Partnership' }
    ],
    services: [
      'Cosplay & Niche Talent Management',
      'Short-Form Video Production',
      'Community Activation'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['TalkEsport', 'IGN India']
  },
  {
    id: 'pwr-pickleball-league',
    slug: 'pwr-pickleball-league',
    title: 'PWR Pickleball League — Times Group',
    year: '2025',
    market: 'Global',
    category: 'Sports',
    shortDesc: 'End-to-end broadcast, talent management & live production with 9-camera setup, net cameras & EVS replays.',
    fullDesc: [
      'Scara delivered the world-class live production infrastructure for the premier PWR Pickleball League by the Times Group.',
      'Featuring a multi-angle 9-camera live broadcast setup including ultra-close net cameras, instant EVS replays, multilingual commentary teams, and international broadcast feeds.'
    ],
    heroImage: 'https://images.unsplash.com/photo-1626248801379-51a0748a5f96?q=80&w=1600&auto=format&fit=crop',
    previewStat: '9-Camera',
    previewStatLabel: 'Live Broadcast Setup',
    stats: [
      { value: '9 Cameras', label: 'Inc. Net Cameras & Slomo' },
      { value: 'EVS Replays', label: 'Instant Sports Production' },
      { value: 'Multilingual', label: 'Global Commentary Feed' },
      { value: 'End-to-End', label: 'Live Broadcast & Talent' }
    ],
    services: [
      'Live Sports Broadcast Production',
      'Multi-Camera Technical Engineering',
      'Commentary & Talent Hosting',
      'Global Distribution'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['The Times of India', 'CNBC TV18', 'Insider Sport']
  },
  {
    id: 'visit-seattle-world-cup',
    slug: 'visit-seattle-world-cup',
    title: 'Visit Seattle — FIFA World Cup 2026',
    year: '2026',
    market: 'Global',
    category: 'Sports',
    shortDesc: 'Destination marketing pairing KL Rahul & Gurpreet Sandhu to position Seattle as the ultimate World Cup host city.',
    fullDesc: [
      'Ahead of the FIFA World Cup 2026, Visit Seattle partnered with Scara to execute a high-profile destination marketing campaign in South Asia.',
      'Scara paired cricket legend KL Rahul and football captain Gurpreet Singh Sandhu with football creator storytelling and exclusive PR coverage via The Hindu.'
    ],
    heroImage: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?q=80&w=1600&auto=format&fit=crop',
    previewStat: '70M+',
    previewStatLabel: 'Total Campaign Reach',
    stats: [
      { value: '70M+', label: 'Total Reach (65M PR + 5M Social)' },
      { value: 'Star Athletes', label: 'KL Rahul & Gurpreet Sandhu' },
      { value: 'The Hindu', label: 'Exclusive PR Anchor' }
    ],
    services: [
      'Global Destination Marketing',
      'Star Athlete Strategic Partnership',
      'Editorial PR & Broadcast Outreach'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['The Hindu', 'ET BrandEquity', 'Media Infoline']
  },
  {
    id: 'supercell-turkey-expansion',
    slug: 'supercell-turkey-expansion',
    title: 'Supercell & KONAMI — Turkey Market Takeover',
    year: '2025',
    market: 'Turkey',
    category: 'Gaming',
    shortDesc: 'Supercell Brawl Stars & Clash of Clans growth (200M+ imps, CPI $0.10) + KONAMI Istanbul OOH & Ramadan drops.',
    fullDesc: [
      'Scara’s Istanbul team spearheaded publisher expansion across Türkiye and MENA, executing performance creator campaigns for Supercell’s Brawl Stars & Clash of Clans.',
      'Additionally, Scara executed KONAMI’s high-visibility Istanbul OOH billboards, a custom Ramadan creator gift-box (1M+ story views), and a June influencer battle (2M+ video views).'
    ],
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1600&auto=format&fit=crop',
    previewStat: '200M+',
    previewStatLabel: 'Impressions in Turkey',
    stats: [
      { value: '200M+', label: 'Total Impressions' },
      { value: '1M+', label: 'Users Acquired' },
      { value: '$0.10-$0.15', label: 'Ultra-efficient CPI' },
      { value: '1M+ Views', label: 'Ramadan Story Unboxings' }
    ],
    services: [
      'Publisher Growth & CPI Optimization',
      'Istanbul OOH & Billboard Takeovers',
      'MENA & Turkish Creator Network',
      'Festive Gift Box Activations'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['IGN Turkey', 'Insider Sport', 'exchange4media']
  },
  {
    id: 'emerging-ip-mandates-2026',
    slug: 'emerging-ip-mandates-2026',
    title: 'Emerging IP Mandates — Legends 90 & Tape Ball',
    year: '2026',
    market: 'Global',
    category: 'Sports',
    shortDesc: 'Building international sports ecosystems: Legends 90 (100+ cricket legends) & Tape Ball Asia Cup / World Cup.',
    fullDesc: [
      'Scara is co-building the next generation of global sports properties.',
      '1. **Legends 90 (L90) League**: 90-ball international cricket featuring 100+ legendary players across 6 franchised teams.',
      '2. **Tape Ball Global Ecosystem**: Professionalizing grassroots cricket through the Tape Ball League, Tape Ball Asia Cup (6 nations, 35 matches, Sept–Oct 2026), and Tape Ball World Cup.'
    ],
    heroImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1600&auto=format&fit=crop',
    previewStat: '100+',
    previewStatLabel: 'Cricket Legends onboarded',
    stats: [
      { value: '100+ Legends', label: 'L90 International Cricket' },
      { value: '6 Franchises', label: 'Global Team Ownership' },
      { value: '6 Nations', label: 'Tape Ball Asia Cup 2026' },
      { value: '35 Matches', label: 'Live Broadcast Schedule' }
    ],
    services: [
      'IP Conceptualization & Franchising',
      'Broadcast Rights & Operations',
      'Sponsorship & Commercialization'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['CNBC TV18', 'The Times of India', 'Insider Sport']
  },
  {
    id: 'pixelpulse-ip',
    slug: 'pixelpulse-ip',
    title: 'PixelPulse — Global Sports & Gaming Conclave',
    year: '2026',
    market: 'Global',
    category: 'Culture',
    isFeaturedIP: true,
    shortDesc: 'Proprietary IP: 15,000+ attendee festival fusing music, gaming, fashion, and culinary culture.',
    fullDesc: [
      'PixelPulse is Scara’s flagship proprietary global conclave and festival.',
      'Designed to scale across Mumbai, Istanbul, and Dubai, PixelPulse brings together 15,000+ passionate youth, featuring live esports arenas, streetwear pop-ups, music headliners, and industry visionaries.'
    ],
    heroImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop',
    previewStat: '15,000+',
    previewStatLabel: 'Festival Attendees',
    stats: [
      { value: '15,000+', label: 'Target Youth Attendees' },
      { value: '4 Verticals', label: 'Music, Gaming, Fashion, Food' },
      { value: 'Multi-City', label: 'Mumbai, Istanbul & Dubai' }
    ],
    services: [
      'Proprietary IP Ownership',
      'Festival Production & Booking',
      'Sponsor Integration',
      'Ticketing & Crowd Management'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['Outlook Respawn', 'MediaBrief', 'Adgully']
  },
  {
    id: 'beyond-the-game-ip',
    slug: 'beyond-the-game-ip',
    title: 'Beyond The Game — Flagship Culture Festival',
    year: '2026',
    market: 'Global',
    category: 'Live',
    isFeaturedIP: true,
    shortDesc: '3-day flagship festival gathering sports stars, gaming icons, global talent, and deep fan communities.',
    fullDesc: [
      'Beyond The Game is a 3-day immersive cultural gathering engineered for deep fandom.',
      'Placing fans directly in dialogue with global athletes, top gaming creators, and cultural leaders through live panels, interactive challenges, and exclusive merchandise drops.'
    ],
    heroImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop',
    previewStat: '3 Days',
    previewStatLabel: 'Immersive Culture IP',
    stats: [
      { value: '3-Day IP', label: 'Flagship Cultural Event' },
      { value: 'Global Talent', label: 'Sports & Gaming Leaders' },
      { value: 'Deep Fandom', label: 'Unrivalled Fan Participation' }
    ],
    services: [
      'Festival Experience Engineering',
      'Talent Curation & Keynotes',
      'Brand Ecosystem Partnership'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop'
    ],
    pressOutlets: ['The Times of India', 'CNBC TV18', 'ET BrandEquity']
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
  }
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
    title: 'KONAMI eFootball™ Campaign Reaches 28M+ Indian Football Fans Ahead of World Cup',
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
