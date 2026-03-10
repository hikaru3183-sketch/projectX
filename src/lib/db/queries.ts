import { db } from "./db";
import { appUsers, scores } from "./schema";
import { eq, sql } from "drizzle-orm";

// ユーザー取得
export async function getUserById(userId: string) {
  const result = await db.select().from(appUsers).where(eq(appUsers.id, userId));
  return result[0] ?? null;
}

// スコア追加
export async function addScore(userId: string, game: string, value: number) {
  return db.insert(scores).values({
    userId,
    game,
    value,
  }).returning();
}

// コイン更新
export async function updateCoins(userId: string, amount: number) {
  return db.update(appUsers)
    .set({
      coins: sql`${appUsers.coins} + ${amount}`,
    })
    .where(eq(appUsers.id, userId))
    .returning();
}