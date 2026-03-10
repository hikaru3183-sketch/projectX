export const dynamic = "force-dynamic";

import { db } from "@/lib/db/db";
import { posts, appUsers } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { headers } from "next/headers"; // cookieの代わりにheadersを使用
import { auth } from "@/lib/auth/auth"; // Better Authのインスタンス
import { DeleteButton } from "@/components/board/DeleteButton";

export default async function BoardPage() {
  // 1. Better Auth でセッションを取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const currentUser = session?.user ?? null;

  // 2. 投稿一覧を取得（結合先をBetter Authのユーザーテーブルに合わせる）
  const allPosts = await db
    .select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      userId: posts.userId,
      userName: appUsers.name, // emailよりnameを表示するのがBetter Auth流
      userEmail: appUsers.email,
    })
    .from(posts)
    .leftJoin(appUsers, eq(posts.userId, appUsers.id))
    .orderBy(desc(posts.createdAt));

  return (
    <div className="min-h-screen bg-green-50">
      <div className="pt-10 mb-6 flex justify-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">📝 掲示板</h1>
          <Link
            href="/board/new"
            className="bg-green-300 text-white px-4 py-2 rounded-md font-bold shadow hover:bg-green-200 transition"
          >
            新規投稿
          </Link>
        </div>
      </div>

      <div className="space-y-6 px-4 max-w-2xl mx-auto">
        {allPosts.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-300 rounded-lg shadow p-4 relative"
          >
            <p className="text-sm text-green-700 font-bold mb-2">
              投稿者: {p.userName ?? p.userEmail?.split("@")[0] ?? "名無し"}
            </p>

            <p className="text-gray-800 text-lg whitespace-pre-wrap">
              {p.content}
            </p>

            <div className="text-right mt-3">
              <span className="text-sm text-gray-500">
                {p.createdAt?.toLocaleString()}
              </span>
            </div>

            {/* 3. 自分の投稿であれば編集・削除ボタンを表示 */}
            {currentUser && p.userId === currentUser.id && (
              <div className="flex gap-3 mt-3 border-t pt-3">
                <Link
                  href={`/board/edit/${p.id}`}
                  className="text-blue-600 font-bold hover:underline"
                >
                  編集
                </Link>
                <DeleteButton postId={p.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}