"use server";

import { auth } from "@/lib/auth/auth"; // Better Auth インスタンス
import { db } from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * 共通のセッション確認関数（コードをスッキリさせるため）
 */
async function getAuthSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) return null;
  return session.user;
}

// ★ 新規投稿
export async function createPostAction(content: string) {
  const user = await getAuthSession();
  if (!user) return { error: "Unauthorized" };

  try {
    await db.insert(posts).values({
      userId: user.id, // Better Auth のユーザーID
      content,
      createdAt: new Date(),
    });
  } catch (e) {
    return { error: "Failed to create post" };
  }

  // 掲示板のデータを最新にする
  revalidatePath("/board");
  redirect("/board");
}

// ★ 投稿編集
export async function editPostAction(postId: number, content: string) {
  const user = await getAuthSession();
  if (!user) return { error: "Unauthorized" };

  try {
    // 自分の投稿であることも条件に含めて更新
    await db
      .update(posts)
      .set({ content })
      .where(
        and(
          eq(posts.id, postId), 
          eq(posts.userId, user.id)
        )
      );
  } catch (e) {
    return { error: "Failed to update post" };
  }

  revalidatePath("/board");
  redirect("/board");
}