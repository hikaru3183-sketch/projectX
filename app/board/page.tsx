import { db } from "@/lib/db/db";
import { posts, appUsers } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";

export default async function BoardPage() {
  const allPosts = await db
    .select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      userEmail: appUsers.email, // ← ここで JOIN した email を取得
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

      <div className="space-y-6">
        {allPosts.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-300 rounded-lg shadow p-4 relative"
          >
            {/* 🔵 投稿者名（メールアドレス） */}
            <p className="text-sm text-green-700 font-bold mb-2">
              投稿者: {p.userEmail ?? "不明なユーザー"}
            </p>

            {/* 投稿内容 */}
            <p className="text-gray-800 text-lg whitespace-pre-wrap">
              {p.content}
            </p>

            {/* 日付 */}
            <div className="text-right mt-3">
              <span className="text-sm text-gray-500">
                {p.createdAt?.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
