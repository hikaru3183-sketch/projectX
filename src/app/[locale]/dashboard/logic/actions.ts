"use server";

import { db } from "@/db/db";
import { gameScores, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function resetGuestDataAction(userId: string) {
  try {
    // 1. game_scoresテーブルから、このユーザーに関連する全データを削除
    // (clicker_items だけでなく、将来増える他のゲームスコアも一括で消えます)
    await db.delete(gameScores).where(eq(gameScores.userId, userId));

    // 2. userテーブルの所持金を 0 にリセット
    await db.update(user)
      .set({ 
        coins: 0,
        // 必要ならアバターも初期化する場合はここに追加
        // avatar: { mode: "default", image: "" } 
      })
      .where(eq(user.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Failed to reset guest data:", error);
    return { success: false };
  }
}

export async function getAllScoresAction(userId: string) {
  try {
    const scores = await db.query.gameScores.findMany({
      where: eq(gameScores.userId, userId),
    });
    return scores;
  } catch (error) {
    console.error("Fetch scores error:", error);
    return [];
  }
}