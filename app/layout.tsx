"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // ホームだけヘッダー非表示
  const isHome = pathname === "/";
  const hideHeader = isHome;

  const [showHeader, setShowHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (hideHeader) return;

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < lastScrollY - 10) {
        setShowHeader(true);
      } else if (currentY > lastScrollY + 10) {
        setShowHeader(false);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, hideHeader]);

  return (
    <html lang="ja">
      <body>
        {/* ホーム以外はヘッダー表示 */}
        {!hideHeader && (
          <div
            className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
              showHeader ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            {/* ★ 黒背景のヘッダー */}
            <header className="w-full bg-gray-700 text-white p-4 flex items-center">
              {/* ★ 左側の戻るボタン */}
              <button
                onClick={() => router.push("/")}
                className="text-lg font-bold hover:opacity-70 transition"
              >
                ← ホーム
              </button>
            </header>
          </div>
        )}

        {/* ホーム以外はヘッダー分の余白を追加 */}
        <div className={hideHeader ? "" : "pt-16"}>{children}</div>
      </body>
    </html>
  );
}
