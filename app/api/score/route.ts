import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { db } from "@/lib/db/db";
import { scores, appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/lucia";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) return NextResponse.json([]);

  const { user } = await auth.validateSession(sessionId);
  if (!user) return NextResponse.json([]);

  // --- ① 通常ゲームのスコア
  const gameScores = await db
    .select()
    .from(scores)
    .where(eq(scores.userId, user.id));

  // --- ② クリック（coins）を取得
  const [userData] = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.id, user.id));

  const clickScore = userData?.coins ?? 0;

  // --- ③ クリックを先頭に追加して返す
  return NextResponse.json([
    { game: "クリック", value: clickScore },
    ...gameScores,
  ]);
}
