import { db } from "@/drizzle/db";
import { scores } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId, game, value } = await req.json();

  if (!userId || !game) {
    return Response.json({ ok: false });
  }

  // 既存スコアがあるか確認
  const existing = await db
    .select()
    .from(scores)
    .where(and(eq(scores.userId, userId), eq(scores.game, game)))
    .limit(1);

  if (existing.length > 0) {
    // 更新
    await db.update(scores).set({ value }).where(eq(scores.id, existing[0].id));
  } else {
    // 新規
    await db.insert(scores).values({
      userId,
      game,
      value,
    });
  }

  return Response.json({ ok: true });
}
