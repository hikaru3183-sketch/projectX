"use server";

import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

// ★ 新規投稿
export async function createPostAction(content: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;
  if (!sessionId) return { error: "Unauthorized" };

  const { session, user } = await auth.validateSession(sessionId);
  if (!session) return { error: "Unauthorized" };

  try {
    await db.insert(posts).values({
      userId: user.id,
      content,
    });
  } catch (e) {
    return { error: "Failed to create post" };
  }

  redirect("/board");
}

// ★ 投稿編集
export async function editPostAction(postId: number, content: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;
  if (!sessionId) return { error: "Unauthorized" };

  const { session, user } = await auth.validateSession(sessionId);
  if (!session) return { error: "Unauthorized" };

  await db
    .update(posts)
    .set({ content })
    .where(and(eq(posts.id, postId), eq(posts.userId, user.id)));

  redirect("/board");
}
