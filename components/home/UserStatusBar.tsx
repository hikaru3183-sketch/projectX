"use client";

import { useRouter } from "next/navigation";

type Props = {
  user?: any; // ← optional に変更
};

export function UserStatusBar({ user }: Props) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col justify-center items-center gap-0 py-0">
      {user ? null : (
        <>
          <div className="flex gap-4 mt-0">
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-3 text-base bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 transition"
            >
              ログイン
            </button>
          </div>
        </>
      )}
    </div>
  );
}
