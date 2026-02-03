"use client";

import { useRouter } from "next/navigation";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <html lang="ja">
      <body className="m-0 p-0 bg-white overflow-hidden">
        {/* 薄い全幅黒ヘッダー */}
        <header
          className="fixed top-0 left-0 z-50 bg-black text-white 
                     px-2 py-0.5 shadow-lg w-full"
        >
          <button
            onClick={() => router.push("/")}
            className="text-base font-bold hover:opacity-70 transition"
          >
            ← ホーム
          </button>
        </header>

        {/* ★ ヘッダー直下に children をそのまま置く（余白ゼロでくっつく） */}
        <main className="">{children}</main>
      </body>
    </html>
  );
}
