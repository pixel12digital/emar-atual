import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { DB_DEV_LOGGER } from "~/app";

import * as schema from "./schema";

/**
 * Caches the database connection in development to
 * prevent creating a new connection on every HMR update.
 */
type DbConnection = ReturnType<typeof postgres>;
const globalForDb = globalThis as unknown as {
  conn?: DbConnection;
};

// Only create connection if DATABASE_URL is available
let conn: DbConnection | undefined;
if (process.env.DATABASE_URL) {
  conn = globalForDb.conn ?? postgres(process.env.DATABASE_URL);
  if (process.env.NODE_ENV !== "production") {
    globalForDb.conn = conn;
  }
}

// Database connection instance (only if connection exists)
export const db = conn
  ? drizzle(conn, {
      logger: DB_DEV_LOGGER && process.env.NODE_ENV !== "production",
      schema,
    })
  : null;
