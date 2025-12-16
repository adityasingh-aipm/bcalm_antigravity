import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is missing. Using Supabase API only. Direct DB features (drizzle) will not work.");
}

// Fallback to avoid crash on init. Connection will fail if used.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy",
});
export const db = drizzle(pool, { schema });
