import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    ssl: { rejectUnauthorized: false },
    url: process.env.DATABASE_URL!,
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
  schemaFilter: ["emar_perfumaria"],
});
