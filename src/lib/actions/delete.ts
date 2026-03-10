"use server";

import { auth } from "@/lib/auth/auth"; // Better Authのインスタンス
import { db } from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { headers } from "next/headers"; // cookieの代わりにheadersを使うのがBetter Auth流
import { eq, and } from "drizzle-orm";

export async function deletePostAction(postId: number) {
  // 1. 現在のリクエストからセッションを取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. ログインしていなければエラー
  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  // 3. 投稿者本人だけ削除可能
  // Better AuthのユーザーIDは session.user.id に入っています
  await db
    .delete(posts)
    .where(
      and(
        eq(posts.id, postId), 
        eq(posts.userId, session.user.id)
      )
    );

  return { success: true };
}