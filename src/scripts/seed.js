import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../../.env.local') });

// Now import db functions after env vars are loaded
const { ensureProjectsTable, seedProjectsTable } = await import("../lib/db.js");

async function seed() {
  console.log("Creating tables...");
  await ensureProjectsTable();

  console.log("Seeding projects...");
  await seedProjectsTable();

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});