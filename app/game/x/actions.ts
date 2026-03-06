// app/game/x/actions.ts
"use server";

import { db } from "@/lib/db/db";
import { appUsers, scores } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { validateRequest } from "@/lib/auth/lucia";

export async function saveGameData(
  coins: number,
  currentStreak: number, // 念のため受け取るが、主にコインと全スコアを優先
  activeGame: string,
  gameBestScores: Record<string, number>, // 追加：全ゲームのベスト記録を受け取る
) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  try {
    // 1. ユーザーの所持コインを更新
    await db.update(appUsers).set({ coins }).where(eq(appUsers.id, user.id));

    // 2. 全ゲームのハイスコアをループで更新
    const gameEntries = Object.entries(gameBestScores); // [["highlow", 10], ["bj", 5]]

    for (const [gameName, bestValue] of gameEntries) {
      if (gameName === "none" || bestValue === 0) continue;

      // DBに既存のスコアがあるか確認
      const results = await db
        .select()
        .from(scores)
        .where(and(eq(scores.userId, user.id), eq(scores.game, gameName)))
        .limit(1);

      const existingScore = results[0];

      if (!existingScore) {
        // 新規登録
        await db.insert(scores).values({
          userId: user.id,
          game: gameName,
          value: bestValue,
        });
      } else if (bestValue > (existingScore.value ?? 0)) {
        // 既存スコアより高ければ更新
        await db
          .update(scores)
          .set({ value: bestValue })
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
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  try {
    // 1. ユーザーのコイン情報を取得
    const userData = await db.query.appUsers.findFirst({
      where: eq(appUsers.id, user.id),
    });

    // 2. 全ゲームのハイスコアを取得
    const userScores = await db
      .select({
        game: scores.game,
        value: scores.value,
      })
      .from(scores)
      .where(eq(scores.userId, user.id));

    return {
      ok: true,
      coins: userData?.coins ?? 0,
      scores: userScores, // [{ game: "highlow", value: 10 }, ...]
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { ok: false, coins: 0, scores: [] };
  }
}
