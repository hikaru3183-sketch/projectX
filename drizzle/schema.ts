import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const appUsers = pgTable("app_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(), // ハッシュ化推奨
  createdAt: timestamp("created_at").defaultNow(),
});

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  game: text("game").notNull(),
  value: integer("value").default(0),
});
