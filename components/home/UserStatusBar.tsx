"use client";

import { useRouter } from "next/navigation";

export function UserStatusBar({ user }: { user: any }) {
  const router = useRouter();

  return (
    <div className="w-full flex justify-center items-center gap-2">
      {user ? (
        <p className="text-sm font-bold text-green-700 px-1">
          ⭕ : {user.email}
        </p>
      ) : (
        <>
          <p className="text-sm font-bold text-green-700 px-1">
            ❌ : ログインしていません
          </p>

          <button
            onClick={() => router.push("/login")}
            className="px-2 py-0.5 text-xs bg-green-500 text-white font-bold rounded-md shadow hover:bg-green-600 transition"
          >
            ログイン
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="px-2 py-0.5 text-xs bg-sky-500 text-white font-bold rounded-md shadow hover:bg-sky-600 transition"
          >
            アカウント作成
          </button>
        </>
      )}
    </div>
  );
}
