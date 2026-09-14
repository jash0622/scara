/**
 * seed-admin.ts
 * ─────────────
 * One-off script to create the single admin account in Supabase.
 * Run ONCE during initial setup — never via a public endpoint.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts <username> <password>
 *
 * Example:
 *   npx tsx scripts/seed-admin.ts scara-admin "MyStr0ngP@ssword!"
 *
 * The script will:
 *   1. Hash the password with bcrypt (12 rounds)
 *   2. Upsert the admin_users row (insert or update on username conflict)
 *   3. Print the generated hash — copy it into ADMIN_PASSWORD_HASH in .env
 *      if you also need it there as a fallback/reference
 */

import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const BCRYPT_ROUNDS = 12;

async function main() {
  const [, , username, password] = process.argv;

  if (!username || !password) {
    console.error("Usage: npx tsx scripts/seed-admin.ts <username> <password>");
    process.exit(1);
  }

  if (password.length < 12) {
    console.error("❌ Password must be at least 12 characters.");
    process.exit(1);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`⏳ Hashing password for admin user "${username}" ...`);
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  console.log(`✅ Hash generated: ${passwordHash}`);

  // Upsert — safe to re-run; updates the hash if the username already exists
  const { data, error } = await supabase
    .from("admin_users")
    .upsert(
      { username, password_hash: passwordHash },
      { onConflict: "username" }
    )
    .select("id, username, created_at")
    .single();

  if (error) {
    console.error("❌ Failed to upsert admin user:", error.message);
    process.exit(1);
  }

  console.log("\n✅ Admin account created/updated successfully:");
  console.log(`   ID:         ${data.id}`);
  console.log(`   Username:   ${data.username}`);
  console.log(`   Created At: ${data.created_at}`);
  console.log(
    "\n💡 Add this to your .env:\n",
    `ADMIN_USERNAME=${username}\n`,
    `ADMIN_PASSWORD_HASH=${passwordHash}`
  );

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
