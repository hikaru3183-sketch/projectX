"use server";

import { db } from "@/db/db"; // パスを修正 (@/lib/db -> @/db)
import { user as userTable, gameScores as scores } from "@/db/schema"; // schemaのテーブル名に合わせる
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Better Auth をインポート
import { headers } from "next/headers";

// アバターの型定義
interface AvatarData {
  mode: "image";
  image: string;
}

export async function saveGameData(
  coins: number,
  currentStreak: number,
  activeGame: string,
  gameBestScores: Record<string, number>,
  avatar?: AvatarData,
) {
  // ✅ Better Auth で認証チェック
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) throw new Error("Unauthorized");
  const userId = session.user.id;

  try {
    // 1. ユーザーの所持コインとアバターを更新
    await db
      .update(userTable)
      .set({
        coins,
        ...(avatar && { avatar }),
      })
      .where(eq(userTable.id, userId));

    // 2. 全ゲームのハイスコアを更新
    const gameEntries = Object.entries(gameBestScores);

    for (const [gameName, bestValue] of gameEntries) {
      if (gameName === "none" || bestValue === 0) continue;

      const results = await db
        .select()
        .from(scores)
        .where(and(eq(scores.userId, userId), eq(scores.gameType, gameName))) // game -> gameType (schemaに合わせる)
        .limit(1);

      const existingScore = results[0];

      if (!existingScore) {
        await db.insert(scores).values({
          id: crypto.randomUUID(), // ID生成が必要な場合
          userId,
          gameType: gameName,
          score: bestValue,
        });
      } else if (bestValue > (existingScore.score ?? 0)) {
        await db
          .update(scores)
          .set({ score: bestValue })
          .where(eq(scores.id, existingScore.id));
      }
    }

    return { ok: true };
  } catch (error) {
    console.error("Save Error:", error);
    return { ok: false };
  }
}

export async function getGameStats() {
  // ✅ Better Auth で認証チェック
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");
  const userId = session.user.id;

  try {
    // ユーザーデータを取得
    const userData = await db.query.user.findFirst({
      where: eq(userTable.id, userId),
    });

    // スコアデータを取得
    const userScores = await db
      .select({
        game: scores.gameType,
        value: scores.score,
      })
      .from(scores)
      .where(eq(scores.userId, userId));

    return {
      ok: true,
      coins: userData?.coins ?? 0,
      avatar: userData?.avatar, 
      scores: userScores,
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { ok: false, coins: 0, scores: [], avatar: null };
  }
}