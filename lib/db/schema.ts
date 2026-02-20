import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

// -----------------------------
// Users（Lucia 用）
// -----------------------------
export const appUsers = pgTable("app_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  coins: integer("coins").default(0), // ← 追加！
  createdAt: timestamp("created_at").defaultNow(),
  items: text("items"), // ← 追加
  stockItems: text("stockItems"),
});

// -----------------------------
// Sessions（Lucia 必須）
// -----------------------------
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// -----------------------------
// Scores（アプリ独自）
// -----------------------------
export const scores = pgTable("scores", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id),
  game: text("game").notNull(),
  value: integer("value").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// -----------------------------
// Posts（掲示板）
// -----------------------------
export const posts = pgTable("posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// -----------------------------
// Drills（ランキング用）
// -----------------------------
export const drills = pgTable("drills", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id),
  value: integer("value").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
