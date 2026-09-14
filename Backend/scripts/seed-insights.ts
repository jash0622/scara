/**
 * seed-insights.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds the `insight_articles` table with all SCARA mock insight/media data.
 *
 * Safe to re-run — uses upsert on (title, outlet) composite uniqueness check.
 * If a row with the same title already exists it will be updated, not duplicated.
 *
 * Usage:
 *   npx tsx scripts/seed-insights.ts
 *
 * Requirements:
 *   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env
 * ─────────────────────────────────────────────────────────────────────────────
 */

import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── All 8 mock insights from scaraData.ts ─────────────────────────────────────
// author field = the person quoted/credited (was stored as `date` in old mock)
// publish_date = approximate publish date in YYYY-MM-DD format

const INSIGHTS = [
  {
    title: "Inside India's Esports Boom: Why Leagues, Careers, and Homegrown IP Matter More Than Ever",
    outlet: "Times of India",
    author: "Manoj George",
    category: "Interview",
    url: "https://timesofindia.indiatimes.com/sports/esports/news/inside-indias-esports-boom-why-leagues-careers-and-homegrown-ip-matter-more-than-ever/articleshow/132414039.cms",
    publish_date: "2025-06-10",
    display_order: 1,
  },
  {
    title: "AI, Live Entertainment, Ticketing — The Next Frontier of Event Technology",
    outlet: "Live Mint",
    author: "Mazher Ramzanali",
    category: "Interview",
    url: "https://www.livemint.com/industry/media/ai-live-entertainment-ticketing-bookmyshow-concerts-events-bot-detection-event-technology/amp-11783234582436.html",
    publish_date: "2025-05-20",
    display_order: 2,
  },
  {
    title: "The New Playbook of Sports: Why Emerging Formats Are Winning India's Attention",
    outlet: "Marketing Mind",
    author: "Arun Sadasivan",
    category: "Authored Article",
    url: "https://marketingmind.in/the-new-playbook-of-sports-why-emerging-formats-are-winning-indias-attention/",
    publish_date: "2025-04-15",
    display_order: 3,
  },
  {
    title: "Zee's FIFA 2026 Deal Sparks Debate on Football's Commercial Future in India",
    outlet: "Ad Mirror",
    author: "Manoj George",
    category: "Authored Article",
    url: "https://ad-mirror.com/media/zees-fifa-2026-deal-sparks-debate-on-footballs-commercial-future-in-india",
    publish_date: "2025-07-01",
    display_order: 4,
  },
  {
    title: "Inside Scara: Building India's Next Gaming & Culture Powerhouse",
    outlet: "Inside Sport",
    author: "Karan Khurana",
    category: "Interview",
    url: "https://www.insidesport.in/gaming/scara/",
    publish_date: "2025-03-22",
    display_order: 5,
  },
  {
    title: "From Spectators to Participants: The Rise of Interactive Marketing in Sports and Gaming",
    outlet: "Media News 4U",
    author: "Arun Sadasivan",
    category: "Authored Article",
    url: "https://www.medianews4u.com/from-spectators-to-participants-the-rise-of-interactive-marketing-in-sports-and-gaming/",
    publish_date: "2025-02-18",
    display_order: 6,
  },
  {
    title: "Anticipate Significant Growth and Continued Investment in Future",
    outlet: "Media Info Line",
    author: "Nathaneal Slabbert",
    category: "Interview",
    url: "https://www.mediainfoline.com/interview/anticipate-significant-growth-and-continued-investment-in-future-nathaneal-slabbert-head-of-global-operations-of-scara",
    publish_date: "2025-01-30",
    display_order: 7,
  },
  {
    title: "Why BFSI and FMCG Are Missing the Esports Opportunity in India",
    outlet: "Adgully",
    author: "Manoj George",
    category: "Authored Article",
    url: "https://adgully.com/post/12954/manoj-george-on-why-bfsi-and-fmcg-are-missing-the-esports-opportunity-in-india",
    publish_date: "2024-12-10",
    display_order: 8,
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Starting SCARA insights seed...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const insight of INSIGHTS) {
    // Check if title already exists — upsert by deleting + inserting
    const { data: existing } = await supabase
      .from("insight_articles")
      .select("id")
      .eq("title", insight.title)
      .maybeSingle();

    let result;

    if (existing?.id) {
      // Update existing row
      result = await supabase
        .from("insight_articles")
        .update(insight)
        .eq("id", existing.id)
        .select("id, title")
        .single();
    } else {
      // Insert new row
      result = await supabase
        .from("insight_articles")
        .insert(insight)
        .select("id, title")
        .single();
    }

    const { data, error } = result;

    if (error) {
      console.error(`  ❌  ${insight.outlet} — ${insight.title.slice(0, 60)}...`);
      console.error(`      ${error.message}`);
      errorCount++;
    } else {
      const action = existing?.id ? "updated" : "inserted";
      console.log(`  ✅  [${data.id.slice(0, 8)}] (${action}) ${data.title.slice(0, 65)}`);
      successCount++;
    }
  }

  console.log(`\n──────────────────────────────────────────`);
  console.log(`  Total:   ${INSIGHTS.length}`);
  console.log(`  Seeded:  ${successCount} ✅`);

  if (errorCount > 0) {
    console.log(`  Failed:  ${errorCount} ❌`);
    process.exit(1);
  } else {
    console.log(`\n🎉  All insights seeded successfully!`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("❌  Unexpected error:", err);
  process.exit(1);
});
