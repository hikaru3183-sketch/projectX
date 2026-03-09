"use client";

import { Menu } from "lucide-react";

export function AvatarButton({
  user,
  onClick,
}: {
  user: any;
  onClick: () => void;
}) {
  if (!user) return null;

  return (
    <button
      onClick={onClick}
      className="
        fixed mt-4 left-5 z-50 
        w-14 h-14 
        flex items-center justify-center 
        bg-white/90 backdrop-blur-md 
        border-2 border-green-500 
        rounded-full 
        shadow-[0_4px_0_#22c55e] 
        hover:translate-y-[1px] hover:shadow-[0_3px_0_#22c55e]
        active:translate-y-[4px] active:shadow-none 
        transition-all group
      "
    >
      {/* 中央のメニューアイコン */}
      <div className="relative">
        <Menu className="w-7 h-7 text-green-600 group-hover:scale-110 transition-transform duration-200" />
      </div>

      {/* モバイルで押しやすくするための透明なタッチ領域拡大（隠し要素） */}
      <span className="sr-only">Menu</span>
    </button>
  );
}
