import { pgTable, text, timestamp, integer, json } from "drizzle-orm/pg-core";

// --- Users（ユーザー情報とアバター設定） ---
export const appUsers = pgTable("app_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  coins: integer("coins").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  items: text("items"),
  stockItems: text("stockItems"),
  avatar: json("avatar")
    .$type<{
      mode: "color" | "image";
      hair?: string;
      clothes?: string;
      bg?: string;
      image?: string;
    }>()
    .notNull()
    .default({
      mode: "color",
      hair: "#000000",
      clothes: "#ffffff",
      bg: "#cccccc",
    }),
});

// --- Sessions（Lucia Auth用） ---
export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// --- Scores（ゲーム別の最大連勝記録） ---
export const scores = pgTable("scores", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id),
  game: text("game").notNull(), // "highlow", "clash", "bj"
  value: integer("value").default(0).notNull(), // 最大連勝数
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- Posts（掲示板・ボード投稿用） ---
// これを追加することで "Export posts doesn't exist" エラーが消えます
export const posts = pgTable("posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
