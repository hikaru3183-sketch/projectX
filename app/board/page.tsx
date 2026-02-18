import { db } from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import Link from "next/link";
import { desc } from "drizzle-orm";

export default async function BoardPage() {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <div className="min-h-screen   bg-green-200">
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
            {/* 吹き出しのピン */}
            <div className="absolute -top-2 left-4 w-3 h-3 bg-red-500 rounded-full shadow"></div>

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
