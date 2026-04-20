import pool from "./index.js";

const migrate = async () => {
  try {
    console.log("Running migration...");

    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP;
    `);
    console.log("✅ Added last_active_at column");

    await pool.query(`
      INSERT INTO users (username, password, role)
      VALUES
        ('user1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.ucrm3f0ZO', 'user'),
        ('user2', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.ucrm3f0ZO', 'user')
      ON CONFLICT (username) DO NOTHING;
    `);
    console.log("✅ Created user1 and user2");

    const result = await pool.query(
      "SELECT id, username, role, last_active_at FROM users"
    );
    console.log("✅ Current users:", result.rows);

    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

migrate();