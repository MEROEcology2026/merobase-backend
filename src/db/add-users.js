// src/db/add-users.js — TEMPORARY. Run once, then delete.
import bcrypt from "bcryptjs";
import pool from "./index.js";

// ─── EDIT THIS LIST ───
// username = login name (no spaces). role is "user" or "admin".
const USERS = [
  { username: "pingkan",  password: "mero2026", role: "user" }, // Pingkan
  { username: "ayu",      password: "mero2026", role: "user" }, // Ayu
  { username: "emir",     password: "mero2026", role: "user" }, // Emir
  { username: "alvan",    password: "mero2026", role: "user" }, // Alvan
  { username: "chris",    password: "mero2026", role: "user" }, // Chris
  { username: "nurul",    password: "mero2026", role: "user" }, // Nurul
  { username: "rhesi",    password: "mero2026", role: "user" }, // Bu Rhesi
  { username: "dita",     password: "mero2026", role: "user" }, // Bu Dita
  { username: "ocky",     password: "mero2026", role: "user" }, // Pak Ocky
  { username: "pras",     password: "mero2026", role: "user" }, // Pak Pras
  { username: "wayan",    password: "mero2026", role: "user" }, // Pak Wayan
  { username: "rahul",    password: "mero2026", role: "user" }, // Rahul
];
// ──────────────────────

async function addUsers() {
  let created = 0;
  let skipped = 0;

  try {
    for (const u of USERS) {
      const existing = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [u.username]
      );

      if (existing.rows.length > 0) {
        console.log(`⏭️  "${u.username}" already exists — skipped.`);
        skipped++;
        continue;
      }

      const hashedPassword = await bcrypt.hash(u.password, 10);

      const result = await pool.query(
        `INSERT INTO users (username, password, role)
         VALUES ($1, $2, $3)
         RETURNING id, username, role`,
        [u.username, hashedPassword, u.role]
      );

      console.log(`✅ Created: ${result.rows[0].username} (${result.rows[0].role}, id ${result.rows[0].id})`);
      created++;
    }

    console.log(`\n─── Done: ${created} created, ${skipped} skipped ───`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await pool.end();
  }
}

addUsers();