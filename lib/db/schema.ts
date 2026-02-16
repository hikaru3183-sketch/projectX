import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

// -----------------------------
// Users（Lucia 用）
// -----------------------------
export const appUsers = pgTable("app_users", {
  id: text("id").primaryKey(), // ← OK（Lucia は text ID）
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// -----------------------------
// Sessions（Lucia 必須）
// -----------------------------
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(), // ← appUsers.id と同じ型にする
  expiresAt: timestamp("expires_at").notNull(),
});

// -----------------------------
// Scores（アプリ独自）
// -----------------------------
export const scores = pgTable("scores", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id), // ← 型を text に合わせる
  game: text("game").notNull(),
  value: integer("value").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
