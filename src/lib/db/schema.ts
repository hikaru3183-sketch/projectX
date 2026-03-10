import {
  pgTable,
  text,
  timestamp,
  integer,
  json,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; // 修正点：リレーション定義用

// 1. "user" テーブル
export const appUsers = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  username: text("username").unique(), 
  emailVerified: boolean("email_verified").notNull().default(false), 
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),

  // --- 独自カラム ---
  coins: integer("coins").default(0).notNull(),
  items: text("items"),
  stockItems: text("stockItems"),
  avatar: json("avatar")
    .$type<{ mode: "image"; image: string }>()
    .notNull()
    .default({ mode: "image", image: "1" }),
});

// 2. Session
export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id, { onDelete: "cascade" }), // 修正点：カスケード削除の明示
});

// 3. Account
export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id, { onDelete: "cascade" }), // 修正点：カスケード削除の明示
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// 4. Verification (変更なし)
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// 5. Scores (Drizzleの推奨スタイルに合わせる)
export const scores = pgTable("scores", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => appUsers.id, { onDelete: "cascade" }),
  game: text("game").notNull(),
  value: integer("value").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // null許容を外すのがベター
});