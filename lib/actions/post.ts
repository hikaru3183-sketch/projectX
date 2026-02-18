"use server";

import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createPostAction(content: string) {
  // セッション確認
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;
  if (!sessionId) return { error: "Unauthorized" };

  const { session, user } = await auth.validateSession(sessionId);
  if (!session) return { error: "Unauthorized" };

  // DB保存
  try {
    await db.insert(posts).values({
      userId: user.id,
      content: content,
    });
  } catch (e) {
    return { error: "Failed to create post" };
  }

  // 保存後にリダイレクト
  redirect("/board");
}
