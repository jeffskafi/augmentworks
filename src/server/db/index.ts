import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// DATABASE_URL is optional for builds that don't need the database
// This will throw at runtime if the database is accessed without DATABASE_URL
const conn = globalForDb.conn ?? (env.DATABASE_URL ? postgres(env.DATABASE_URL) : null);
if (env.NODE_ENV !== "production" && conn) globalForDb.conn = conn;

// Export db only if connection is available
export const db = conn ? drizzle(conn, { schema }) : null;
