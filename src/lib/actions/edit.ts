"use server";

import { auth } from "@/lib/auth/auth"; // Better Auth インスタンス
import { db } from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function editPostAction(postId: number, content: string) {
  // 1. Better Auth でセッションを取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. 認証チェック
  if (!session || !session.user) {
    return { error: "認証が必要です" };
  }

  try {
    // 3. 更新処理 (IDと投稿者IDが一致することを確認)
    // session.user.id は Better Auth のユーザーIDです
    await db
      .update(posts)
      .set({ 
        content,
        // 必要であれば updatedAt カラムも更新
      })
      .where(
        and(
          eq(posts.id, postId), 
          eq(posts.userId, session.user.id)
        )
      );

    // 4. キャッシュのクリア（一覧と編集画面の両方を更新）
    revalidatePath("/board");
    revalidatePath(`/board/edit/${postId}`);
  } catch (e) {
    console.error(e);
    return { error: "更新に失敗しました" };
  }

  // 5. 成功したら一覧へ
  redirect("/board");
}