import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // パスを src からに修正
  schema: "./src/lib/db/schema.ts", 
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Drizzle Kit が自動で .env から DATABASE_URL を探してくれます
    url: process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
});