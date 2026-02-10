import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const appUsers = pgTable("app_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(), // 重複禁止
  password: text("password").notNull(), // bcrypt ハッシュ
  coins: integer("coins").default(10000), // ★ 初期コインを DB に保持
  createdAt: timestamp("created_at").defaultNow(),
});

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => appUsers.id), // 外部キー
  game: text("game").notNull(),
  value: integer("value").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
