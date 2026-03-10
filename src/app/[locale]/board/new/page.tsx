"use client";

import { useState } from "react";
import { createPostAction } from "@/lib/actions/post";
import { useRouter } from "next/navigation"; // 遷移のために追加
import Link from "next/link";

export default function NewPostPage() {
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter(); // router インスタンス

  const submit = async () => {
    if (!content.trim()) return;

    setIsPending(true);

    const result = await createPostAction(content);

    if (result?.error) {
      alert(result.error);
      setIsPending(false);
      return;
    }

    // ★ サーバーアクション側で redirect("/") していても、
    // クライアント側で明示的に遷移を管理するとより確実です。
    // router.refresh() を呼ぶことで、掲示板のServer Componentが最新データを再取得します。
    router.push("/board");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
        📝 新規投稿
      </h1>

      <Link
        href="/board"
        className="mb-6 bg-green-300 text-white px-4 py-2 rounded-md font-bold shadow hover:bg-green-200 transition"
      >
        掲示板に戻る
      </Link>

      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow p-6">
        <textarea
          className="border border-gray-300 rounded-md p-3 w-full h-40 focus:ring-2 focus:ring-green-400 outline-none transition"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          placeholder="ここに投稿内容を書いてください…"
        />

        <button
          className={`mt-4 w-full py-3 rounded-md font-bold text-white transition-all ${
            isPending || !content.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 shadow-md active:scale-95"
          }`}
          onClick={submit}
          disabled={isPending || !content.trim()}
        >
          {isPending ? "投稿中..." : "投稿する"}
        </button>
      </div>
    </div>
  );
}