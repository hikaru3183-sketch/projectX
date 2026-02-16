import { db } from "./db";
import { appUsers, scores } from "./schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid"; // ID生成用に必要

// 1. ユーザー作成の修正
export async function createUser(email: string, passwordHash: string) {
  return db
    .insert(appUsers)
    .values({
      id: nanoid(), // ★ id が必須なので追加
      email,
      password: passwordHash,
    })
    .returning();
}

export async function findUserByEmail(email: string) {
  return db.select().from(appUsers).where(eq(appUsers.email, email));
}

// 2. スコア追加の修正
// userId の型を number から string に変更
export async function addScore(userId: string, game: string, value: number) {
  return db
    .insert(scores)
    .values({
      userId, // スキーマが string を期待しているため、引数の型と合わせる
      game,
      value,
    })
    .returning();
}
