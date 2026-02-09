import { db } from "@/drizzle/db";
import { scores } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));
  const game = searchParams.get("game");

  // userId が数値かどうかチェック
  if (isNaN(userId) || !game) {
    return Response.json({ error: "Missing params" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(scores)
    .where(and(eq(scores.userId, userId), eq(scores.game, game)))
    .limit(1);

  return Response.json(result[0] ?? { value: 0 });
}
