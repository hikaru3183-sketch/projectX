"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Languages } from "lucide-react";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "ja" ? "en" : "ja";
    // 現在のパスから現在の言語コード（/ja や /en）を削って、新しい言語を付ける
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors border border-white/20"
    >
      <Languages className="w-4 h-4" />
      <span>{locale === "ja" ? "English" : "日本語"}</span>
    </button>
  );
}
