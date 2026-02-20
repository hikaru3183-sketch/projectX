import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { scores, appUsers } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const games = ["janken", "hockey", "escape"];
    const result: any = {};

    // -----------------------------
    // ★ click は coins ランキングにする
    // -----------------------------
    const clickRanking = await db
      .select({
        email: appUsers.email,
        value: appUsers.coins, // ← coins を click の value として扱う
      })
      .from(appUsers)
      .orderBy(desc(appUsers.coins))
      .limit(3);

    result["click"] = clickRanking;

    // -----------------------------
    // ★ 他のゲームは scores テーブルから取得
    // -----------------------------
    for (const game of games) {
      const top3 = await db
        .select({
          value: scores.value,
          email: appUsers.email,
        })
        .from(scores)
        .leftJoin(appUsers, eq(scores.userId, appUsers.id))
        .where(eq(scores.game, game))
        .orderBy(desc(scores.value))
        .limit(3);

      result[game] = top3;
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
