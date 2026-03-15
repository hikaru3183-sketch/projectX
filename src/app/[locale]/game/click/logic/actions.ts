"use server";
import { db } from "@/db/db";
import { gameScores } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

export async function getClickerItemsAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return {};

  const record = await db.query.gameScores.findFirst({
    where: and(eq(gameScores.userId, session.user.id), eq(gameScores.gameType, "clicker_items")),
  });

  if (!record || !record.metadata) return {};

  try {
    let meta = record.metadata;
    // 文字列として保存されている場合に備えてパース
    if (typeof meta === "string") meta = JSON.parse(meta);
    // { stockItems: { ... } } の中身を返す。無ければmeta自体を返す。
    return (meta as any).stockItems || meta || {};
  } catch (e) {
    return {};
  }
}

export async function saveClickerItemsAction(stockItems: Record<string, number>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false };
  try {
    const payload = { stockItems };
    const existing = await db.query.gameScores.findFirst({
      where: and(eq(gameScores.userId, session.user.id), eq(gameScores.gameType, "clicker_items")),
    });

    if (existing) {
      await db.update(gameScores).set({ metadata: payload, createdAt: new Date() }).where(eq(gameScores.id, existing.id));
    } else {
      await db.insert(gameScores).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        gameType: "clicker_items",
        score: 0,
        metadata: payload,
      });
    }
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}