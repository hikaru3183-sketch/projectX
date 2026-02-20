import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { scores } from "@/lib/db/schema";
import { auth } from "@/lib/auth/lucia";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";

// --- 1. ハイスコア取得 (GET) ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const game = searchParams.get("game");

  if (!game) {
    return NextResponse.json(
      { error: "Game name is required" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ value: 0 }); // 未ログイン時は0を返す
  }

  const { user } = await auth.validateSession(sessionId);
  if (!user) {
    return NextResponse.json({ value: 0 });
  }

  // DBから特定のゲームのスコアを取得
  const [existing] = await db
    .select()
    .from(scores)
    .where(and(eq(scores.userId, user.id), eq(scores.game, game)))
    .limit(1);

  return NextResponse.json({ value: existing?.value ?? 0 });
}

// --- 2. ハイスコア保存 (POST) ---
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user, session } = await auth.validateSession(sessionId);
  if (!session || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { game, value } = await req.json();

  const [existing] = await db
    .select()
    .from(scores)
    .where(and(eq(scores.userId, user.id), eq(scores.game, game)))
    .limit(1);

  if (!existing) {
    const result = await db
      .insert(scores)
      .values({
        userId: user.id,
        game,
        value,
      })
      .returning();

    return NextResponse.json(result[0]);
  }

  const currentBest = existing.value ?? 0;

  if (value <= currentBest) {
    return NextResponse.json(existing);
  }

  const [updated] = await db
    .update(scores)
    .set({ value })
    .where(eq(scores.id, existing.id))
    .returning();

  return NextResponse.json(updated);
}
