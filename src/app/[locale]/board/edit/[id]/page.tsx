export const dynamic = "force-dynamic";

import { db } from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth"; // Better Authのインスタンス
import EditPostForm from "@/components/board/EditPostForm";
import Link from "next/link";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. セッションを取得してログイン確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // 2. IDを取得
  const { id } = await params;
  const postId = Number(id);

  if (isNaN(postId)) {
    notFound();
  }

  // 3. 投稿データを取得
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  const post = result[0];

  if (!post) {
    notFound();
  }

  // 4. ★ 重要：権限チェック
  // 投稿の所有者とログインユーザーが一致するか確認
  if (post.userId !== session.user.id) {
    // 他人の投稿を編集しようとした場合は掲示板へ戻す（またはエラー画面）
    redirect("/board");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
        ✏️ 投稿を編集
      </h1>

      <Link
        href="/board"
        className="mb-6 bg-gray-400 text-white px-4 py-2 rounded-md font-bold shadow hover:bg-gray-500 transition"
      >
        キャンセルして戻る
      </Link>

      <div className="w-full max-w-md">
        <EditPostForm post={post} />
      </div>
    </div>
  );
}