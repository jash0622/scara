/**
 * seed-case-studies.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds the `case_studies` table in Supabase with all SCARA mock case studies.
 *
 * • Safe to re-run — uses upsert on `slug` (existing rows are updated, not duplicated).
 * • Each case study has TWO separate images:
 *     hero_image   → card thumbnail (portrait/square, shown on the work grid)
 *     banner_image → modal banner (wide landscape, shown inside the pop-up)
 *
 * Usage:
 *   npx tsx scripts/seed-case-studies.ts
 *
 * Requirements:
 *   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env
 * ─────────────────────────────────────────────────────────────────────────────
 */

import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import { slugify } from "../src/utils/slugify";

// ── Supabase client ───────────────────────────────────────────────────────────

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Seed data ─────────────────────────────────────────────────────────────────
// hero_image   = card thumbnail (original local paths from mock data)
// banner_image = wide modal banner (Unsplash landscape images, relevant to each campaign)

const CASE_STUDIES = [
  // ── GAMING — INDIA ──────────────────────────────────────────────────────────

  {
    slug: "efootball-holi-25",
    title: "eFootball Holi '25",
    client: "KONAMI",
    year: 2025,
    market: "India",
    category: "Gaming",
    short_desc:
      "Cultural Holi campaign with Indian football captain Gurpreet Singh Sandhu and top gaming creator Jonathan Gaming, driving downloads, UGC and tournament engagement.",
    full_desc: [
      "To celebrate Holi, we partnered with Indian football captain Gurpreet Singh Sandhu and leading gaming creator Jonathan Gaming, amplified by 5 additional gaming influencers through localized content, social storytelling and community participation, driving awareness, downloads, UGC and tournament engagement.",
    ],
    hero_image: "/Cover Photos Case Studies/eFootball Holi _25.jpg",
    banner_image:
      "https://images.unsplash.com/photo-1521478706270-f2e33c203d95?q=80&w=1600&auto=format&fit=crop",
    talent: ["Gurpreet Singh Sandhu", "Jonathan Gaming"],
    services: [
      "In-Game Cosmetics",
      "Localization Strategy",
      "Influencer Management",
      "Offline Community Engagement",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "IGN India", url: "https://in.ign.com" },
      { name: "Animation Xpress", url: "https://www.animationxpress.com" },
      { name: "Adgully", url: "https://www.adgully.com" },
    ],
    is_featured_ip: false,
    display_order: 1,
  },

  {
    slug: "moba-legends-cosplay",
    title: "MOBA Legends 5V5 Cosplay",
    client: "Vizta Games",
    year: 2025,
    market: "India",
    category: "Gaming",
    short_desc:
      "End-to-end cosplay activation bringing MLBB's Fanny to life — from talent sourcing to publishing across Instagram for the 2025 anniversary campaign.",
    full_desc: [
      "To bring MLBB's Fanny to life, Scara activated a curated network of cosplay creators, managing the end-to-end activation from talent sourcing and shortlisting to briefing, negotiations, content coordination and publishing across Instagram. The campaign delivered character-led, authentic content that extended the 2025 anniversary campaign beyond the game.",
    ],
    hero_image: "/Cover Photos Case Studies/Mobalegends Cosplay.jpg",
    banner_image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop",
    talent: ["Cosplay Creators Network"],
    services: [
      "Cosplayer Sourcing",
      "Talent Management",
      "Content Coordination",
      "Social Amplification",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "TalkEsport", url: "https://www.talkesport.com" },
      { name: "IGN India", url: "https://in.ign.com" },
    ],
    is_featured_ip: false,
    display_order: 2,
  },

  {
    slug: "efootball-independence-diwali-25",
    title: "eFootball Independence Day & Diwali '25",
    client: "KONAMI",
    year: 2025,
    market: "India",
    category: "Gaming",
    short_desc:
      "Integrated Independence Day & Diwali campaign blending celebrity content, nationwide tournaments, Discord community building, PR and a large-scale offline Meet & Greet.",
    full_desc: [
      "We led the expansion of eFootball™ in India by tapping into high-impact cultural moments — Independence Day and Diwali — to move beyond a core gaming audience and engage mainstream football fans and casual sports viewers.",
      "The campaign blended celebrity-led content, nationwide online tournaments, Discord-first community building, PR amplification, and a large-scale offline Meet & Greet. This integrated approach drove scale, participation, and long-term community retention.",
    ],
    hero_image:
      "/Cover Photos Case Studies/eFootball Independence Day & Diwali _25.JPG",
    banner_image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
    talent: ["Sunil Chhetri", "KL Rahul", "Ahan Shetty", "Nitish Kumar Reddy"],
    services: [
      "In-Game Marketing",
      "Community Building",
      "Celebrity Management",
      "PR and Offline Activation",
      "In-game Jersey Design",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522158634071-9c9957218e79?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "The Times of India", url: "https://timesofindia.indiatimes.com" },
      { name: "The Hindu", url: "https://www.thehindu.com" },
      { name: "exchange4media", url: "https://www.exchange4media.com" },
    ],
    is_featured_ip: false,
    display_order: 3,
  },

  {
    slug: "efootball-messi-26",
    title: "eFootball Lionel Messi Campaign '26",
    client: "KONAMI",
    year: 2026,
    market: "India",
    category: "Gaming",
    short_desc:
      "Creator-led launch of the Lionel Messi Card combining celebrity awareness with micro-influencers across Kerala and West Bengal, UGC challenges and regional PR.",
    full_desc: [
      "To launch the Lionel Messi Card in eFootball™, we built a creator-led campaign to drive downloads, gameplay and participation. The campaign combined celebrity-led awareness with micro-influencers across Kerala and West Bengal, driving audiences to play with the Messi card and participate in a UGC challenge.",
      "Regional PR, digital media and creator content further amplified the launch across mainstream football communities.",
    ],
    hero_image: "/Cover Photos Case Studies/eFootball Leo Messi Campaign _26.png",
    banner_image:
      "https://images.unsplash.com/photo-1579273166152-6275a5aeb6d6?q=80&w=1600&auto=format&fit=crop",
    talent: ["Regional Micro-Influencers"],
    services: [
      "Celebrity & Influencer Marketing",
      "Regional Content & Localization",
      "PR & Media Amplification",
      "UGC & Community Engagement",
      "Campaign Strategy & Execution",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "IGN India", url: "https://in.ign.com" },
      { name: "Sports Mint", url: "https://www.sportsmintmedia.com" },
      { name: "TalkEsport", url: "https://www.talkesport.com" },
    ],
    is_featured_ip: false,
    display_order: 4,
  },

  {
    slug: "efootball-world-cup-26",
    title: "eFootball FIFA World Cup Campaign '26",
    client: "KONAMI",
    year: 2026,
    market: "India",
    category: "Gaming",
    short_desc:
      "Nationwide CTV + mobile full-funnel campaign for eFootball™ across Kerala, West Bengal, Tamil Nadu and the North East ahead of FIFA World Cup 2026.",
    full_desc: [
      "To build momentum for the FIFA World Cup 2026, we executed a nationwide CTV + mobile campaign for KONAMI eFootball™, using a full-funnel strategy across key football markets.",
      "Through regional targeting and continuous creative, media and performance optimisation, the campaign drove strong reach, engagement and video completion across Kerala, West Bengal, Tamil Nadu and the North East.",
    ],
    hero_image: "/Cover Photos Case Studies/eFootball WC Campaign_2.png",
    banner_image:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1600&auto=format&fit=crop",
    talent: [],
    services: [
      "Nationwide Performance Media",
      "Content Localization",
      "Media Advisory",
      "Campaign Strategy & Execution",
      "Measurement & Reporting",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "IGN India", url: "https://in.ign.com" },
      { name: "Times of India", url: "https://timesofindia.indiatimes.com" },
      { name: "Animation Xpress", url: "https://www.animationxpress.com" },
      { name: "CNBC TV18", url: "https://www.cnbctv18.com" },
    ],
    is_featured_ip: false,
    display_order: 5,
  },

  // ── GAMING — TURKEY ──────────────────────────────────────────────────────────

  {
    slug: "supercell-brawlstars-turkey-25",
    title: "Supercell Brawl Stars Turkey '25",
    client: "Supercell",
    year: 2025,
    market: "Turkey",
    category: "Gaming",
    short_desc:
      "Always-on influencer and Brand Ambassador Programs for Supercell Brawl Stars across Turkey.",
    full_desc: [
      "Always on influencer & Brand Ambassador Programs — a sustained, performance-driven creator strategy that kept Brawl Stars consistently top-of-mind across Turkish gaming communities.",
    ],
    hero_image: "/Cover Photos Case Studies/Turkey Brawl Stars 2.png",
    banner_image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
    talent: ["Turkish Brand Ambassadors"],
    services: [
      "Celebrity & Influencer Marketing",
      "Campaign Strategy & Execution",
      "Sustained Community Engagement",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "IGN Turkey", url: "https://tr.ign.com" },
      { name: "Insider Sport", url: "https://www.insidesport.in" },
    ],
    is_featured_ip: false,
    display_order: 6,
  },

  {
    slug: "efootball-influencer-turkey-25",
    title: "eFootball Influencer Campaign Turkey '25",
    client: "KONAMI",
    year: 2025,
    market: "Turkey",
    category: "Gaming",
    short_desc:
      "OOH & influencer campaigns across Istanbul, driving eFootball brand visibility in key urban gaming hubs.",
    full_desc: [
      "OOH & influencer campaigns across Istanbul — combining high-impact out-of-home placements with a curated network of Turkish gaming influencers to drive eFootball brand visibility and player acquisition across the city's key urban hubs.",
    ],
    hero_image: "/Cover Photos Case Studies/Turkey eFootball Influencer 2.png",
    banner_image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1600&auto=format&fit=crop",
    talent: ["Istanbul Gaming Influencers"],
    services: [
      "Celebrity & Influencer Marketing",
      "Campaign Strategy & Execution",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "IGN Turkey", url: "https://tr.ign.com" },
      { name: "exchange4media", url: "https://www.exchange4media.com" },
    ],
    is_featured_ip: false,
    display_order: 7,
  },

  {
    slug: "efootball-ramadan-turkey-25",
    title: "eFootball Ramadan Campaign Turkey '25",
    client: "KONAMI",
    year: 2025,
    market: "Turkey",
    category: "Gaming",
    short_desc:
      "Limited-edition eFootball Ramadan gift box — Ramadan jersey, signed team kit and personalised codes — created with Turkish designers for the community.",
    full_desc: [
      "For Ramadan, we collaborated with Turkish designers to create a special, limited-edition eFootball™ Ramadan box. Each box included a Ramadan jersey, a signed team kit, and personalized notes featuring unique codes tailored for each recipient.",
      "The campaign resonated deeply with the community, generating strong organic unboxing content and story views across Turkish social platforms.",
    ],
    hero_image: "/Cover Photos Case Studies/eFootball Ramadan_2.png",
    banner_image:
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1600&auto=format&fit=crop",
    talent: ["Turkish Designers", "Community Creators"],
    services: ["Special Gift Box", "Content Production"],
    gallery: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "IGN Turkey", url: "https://tr.ign.com" },
      { name: "Insider Sport", url: "https://www.insidesport.in" },
    ],
    is_featured_ip: false,
    display_order: 8,
  },

  {
    slug: "supercell-coc-brawlstars-turkey-25",
    title: "Supercell Clash of Clans & Brawl Stars Growth Campaign Turkey '25",
    client: "Supercell",
    year: 2025,
    market: "Turkey",
    category: "Gaming",
    short_desc:
      "Performance-driven gaming growth at scale for Clash of Clans and Brawl Stars across Turkey.",
    full_desc: [
      "Performance driven gaming growth at scale — a data-first user acquisition strategy for Supercell's Clash of Clans and Brawl Stars, optimising CPI and reaching high-intent players across Turkey through targeted performance marketing.",
    ],
    hero_image: "/Cover Photos Case Studies/Turkey Brawl Stars & COC_2.png",
    banner_image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1600&auto=format&fit=crop",
    talent: [],
    services: ["User Acquisition", "Performance Marketing"],
    gallery: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "IGN Turkey", url: "https://tr.ign.com" },
      { name: "Insider Sport", url: "https://www.insidesport.in" },
    ],
    is_featured_ip: false,
    display_order: 9,
  },

  {
    slug: "efootball-influencer-vs-influencer-turkey-25",
    title: "eFootball Influencer vs Influencer Campaign Turkey '25",
    client: "KONAMI",
    year: 2025,
    market: "Turkey",
    category: "Gaming",
    short_desc:
      "Unique competitive format — three influencers battling through in-game challenges, with participant counts determining prize pools for their followers.",
    full_desc: [
      "For our June eFootball™ campaign, we created a unique competitive format where three influencers battled it out through in-game challenges, with each creator's participant count directly determining the number of prizes they could unlock and give back to their followers.",
      "The format drove intense community participation, fostering rival fan bases and generating millions of video views across Turkish platforms.",
    ],
    hero_image:
      "/Cover Photos Case Studies/eFootball Turkey Influencer vs Influencer_2.png",
    banner_image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop",
    talent: ["3 Turkish Gaming Influencers"],
    services: ["In-Game Advisory", "Influencer Marketing"],
    gallery: [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "IGN Turkey", url: "https://tr.ign.com" },
      { name: "exchange4media", url: "https://www.exchange4media.com" },
    ],
    is_featured_ip: false,
    display_order: 10,
  },

  // ── LIVE ─────────────────────────────────────────────────────────────────────

  {
    slug: "pwr-pickleball-league",
    title: "PWR Pickleball League",
    client: "Times Group",
    year: 2025,
    market: "Global",
    category: "Live",
    short_desc:
      "Seamlessly executed the end-to-end broadcast and production for the PWR Pickleball League for Times Group.",
    full_desc: [
      "Scara seamlessly executed the end-to-end broadcast and production for the Pickleball League for Times Group.",
      "Featuring a multi-angle live broadcast setup, instant replays, multilingual commentary teams, and international broadcast feeds — delivering a world-class viewer experience.",
    ],
    hero_image: "/Cover Photos Case Studies/PWR Pickleball 2.png",
    banner_image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1600&auto=format&fit=crop",
    talent: [],
    services: ["Digital Broadcast", "Broadcast Production"],
    gallery: [
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "The Times of India", url: "https://timesofindia.indiatimes.com" },
      { name: "CNBC TV18", url: "https://www.cnbctv18.com" },
      { name: "Insider Sport", url: "https://www.insidesport.in" },
    ],
    is_featured_ip: false,
    display_order: 11,
  },

  {
    slug: "run-for-fun-red-fort",
    title: "Run For Fun — Red Fort Terriers Silver Jubilee",
    client: "ADGPI - Indian Army",
    year: 2025,
    market: "India",
    category: "Live",
    short_desc:
      "Conceptualised and executed a special marathon event celebrating the Silver Jubilee of the Red Fort Terriers Regiment, bringing together regiment personnel and families.",
    full_desc: [
      "Scara conceptualised and executed the Run for Fun, a special marathon event celebrating the Silver Jubilee of the Red Fort Terriers Regiment.",
      "Designed as a celebration of camaraderie and family, the event brought together regiment personnel and their families for a fun, engaging fitness experience, honouring 25 years of service while creating memorable moments of togetherness.",
    ],
    hero_image: "/Cover Photos Case Studies/Run for Fun_2.png",
    banner_image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1600&auto=format&fit=crop",
    talent: [],
    services: ["End-to-end Event Execution"],
    gallery: [
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop",
    ],
    press_outlets: [
      { name: "India TV", url: "https://www.indiatv.in" },
      { name: "Dainik Bhaskar", url: "https://www.bhaskar.com" },
    ],
    is_featured_ip: false,
    display_order: 12,
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Starting SCARA case studies seed...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const study of CASE_STUDIES) {
    // Ensure slug is consistent with the slugify utility
    const normalizedSlug = slugify(study.title);
    const record = { ...study, slug: normalizedSlug };

    const { data, error } = await supabase
      .from("case_studies")
      .upsert(record, { onConflict: "slug" })
      .select("id, slug, title")
      .single();

    if (error) {
      console.error(`  ❌  [${study.slug}] ${study.title}`);
      console.error(`      ${error.message}`);
      errorCount++;
    } else {
      console.log(`  ✅  [${data.id.slice(0, 8)}] ${data.title}`);
      successCount++;
    }
  }

  console.log(`\n──────────────────────────────────────────`);
  console.log(`  Total:   ${CASE_STUDIES.length}`);
  console.log(`  Seeded:  ${successCount} ✅`);
  if (errorCount > 0) {
    console.log(`  Failed:  ${errorCount} ❌`);
    console.log(`\n⚠️  Some records failed. Check errors above.`);
    console.log(
      `   Common cause: the 'banner_image' column doesn't exist yet in Supabase.`
    );
    console.log(
      `   Run this SQL in the Supabase SQL Editor to add it:\n`
    );
    console.log(
      `   ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS banner_image TEXT;\n`
    );
    process.exit(1);
  } else {
    console.log(`\n🎉  All case studies seeded successfully!`);
    console.log(
      `\n💡  Next steps:`
    );
    console.log(`   1. In Supabase SQL Editor, run this migration if you haven't already:`);
    console.log(`      ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS banner_image TEXT;`);
    console.log(`   2. Connect your frontend WorkSection to the API instead of scaraData.ts`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("❌  Unexpected error:", err);
  process.exit(1);
});
