"use client";

import { useRouter } from "next/navigation";

export function UserStatusBar({ user }: { user: any }) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col justify-center items-center gap-0 py-0">
      {user ? (
        <p className="text-base font-bold text-green-700">⭕ : {user.email}</p>
      ) : (
        <>
          {/* テキスト（余白ゼロ） */}
          <p className="text-base font-bold text-green-700 mb-2">
            ❌ : ログインしていません
          </p>

          {/* ボタンだけ gap をつける */}
          <div className="flex gap-4 mt-0">
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-3 text-base bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 transition"
            >
              ログイン
            </button>

            <button
              onClick={() => router.push("/register")}
              className="px-5 py-3 text-base bg-sky-500 text-white font-bold rounded-lg shadow hover:bg-sky-600 transition"
            >
              アカウント作成
            </button>
          </div>
        </>
      )}
    </div>
  );
}
