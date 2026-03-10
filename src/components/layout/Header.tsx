"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl"; // 現在の言語を取得
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  // /ja や /en 単体、またはそれらにスラッシュがついた状態の時はヘッダーを隠す
  const hideHeader = pathname === `/${locale}` || pathname === `/${locale}/`;

  if (hideHeader) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <header className="w-full bg-gray-700 text-white px-4 h-12 shadow-lg flex items-center justify-between">
        <button
          onClick={() => router.push(`/${locale}`)} // ホームに戻る時も言語を維持
          className="text-lg font-bold hover:opacity-70 transition flex items-center gap-2"
        >
          <span>←</span>
          <span>{locale === "ja" ? "ホーム" : "Home"}</span>
        </button>

        {/* 右側に切り替えボタンを配置 */}
        <LocaleSwitcher />
      </header>
    </div>
  );
}
