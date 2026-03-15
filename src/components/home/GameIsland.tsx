"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface GameIslandProps {
  label: string;
  href: string;
  color: string;
  desc: string;
  icon: React.ReactNode;
  delay?: number;
}

export function GameIsland({
  label,
  href,
  color,
  desc,
  icon,
  delay = 0,
}: GameIslandProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  const isDark = mounted && theme === "dark";

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    // 遷移前に少しタメを作る（演出のため）
    setTimeout(() => {
      router.push(href);
    }, 1000);
  };

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!mounted) return <div className="w-full aspect-square max-w-[180px]" />;

  return (
    <div
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`
        group relative flex flex-col items-center justify-center
        w-full aspect-square max-w-[180px] cursor-pointer
        transition-all duration-500 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        select-none touch-manipulation
        [-webkit-touch-callout:none]
        [-webkit-tap-highlight-color:transparent]
        ${isClicked ? "pointer-events-none" : "pointer-events-auto"}
        hover:z-50 active:z-50
      `}
    >
      {/* 島のメインビジュアル */}
      <div
        className={`
          relative w-full h-full
          transition-transform duration-300
          ${isClicked ? "scale-90" : "group-hover:scale-110 group-active:scale-95"}
        `}
        style={{
          animation: isClicked ? "none" : `float ${3 + delay * 0.2}s ease-in-out infinite`,
          animationDelay: `${delay * 0.3}s`,
        }}
      >
        {/* 島のベース（砂浜部分） */}
        <div
          className={`
            absolute inset-0 rounded-[40%] 
            transition-all duration-1000
            ${isDark 
              ? "bg-gradient-to-b from-slate-600 via-slate-500 to-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]" 
              : "bg-gradient-to-b from-amber-200 via-amber-100 to-amber-300 shadow-2xl"
            }
            ${isClicked ? "brightness-75 scale-95" : "group-hover:shadow-amber-400/50"}
          `}
          style={{
            clipPath:
              "polygon(15% 60%, 5% 75%, 10% 90%, 30% 95%, 70% 95%, 90% 90%, 95% 75%, 85% 60%, 75% 55%, 50% 50%, 25% 55%)",
          }}
        />

        {/* 島のメイン部分（芝生・カラー部分） */}
        <div
          className={`
            absolute inset-[10%] rounded-[50%]
            ${color} shadow-inner
            flex items-center justify-center
            transition-all duration-1000
            ${isDark ? "brightness-75 saturate-[0.8]" : "brightness-100"}
            ${isClicked ? "brightness-50" : "group-hover:brightness-110"}
          `}
          style={{
            clipPath:
              "polygon(20% 70%, 10% 50%, 15% 30%, 30% 15%, 50% 10%, 70% 15%, 85% 30%, 90% 50%, 80% 70%, 60% 75%, 40% 75%)",
          }}
        >
          {/* アイコン：夜はネオンのように光る */}
          <div 
            className={`
              text-white text-4xl transition-all duration-1000
              ${isDark ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "drop-shadow-lg"}
              ${isClicked ? "scale-125 opacity-0 transition-duration-500" : "scale-100"}
            `} 
            draggable="false"
          >
            {icon}
          </div>
        </div>

        {/* 夜モード専用の「波紋」のような発光エフェクト */}
        {isDark && !isClicked && (
          <div className="absolute inset-0 bg-blue-400/10 blur-2xl rounded-full -z-10 animate-pulse" />
        )}
      </div>

      {/* --- ラベルとコメントの入れ替えエリア --- */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full flex justify-center items-center h-8">
        
        {/* 名前ラベル */}
        <div className={`
          absolute px-3 py-1.5 rounded-full shadow-md border transition-all duration-300 ease-in-out
          ${isDark 
            ? "bg-slate-900/90 border-slate-700 text-slate-300" 
            : "bg-white/95 border-amber-200 text-gray-800"
          }
          ${isClicked 
            ? "opacity-0 scale-50 translate-y-4 pointer-events-none" 
            : "opacity-100 scale-100 translate-y-0"}
        `}>
          <span className="text-xs md:text-sm font-bold whitespace-nowrap">
            {label}
          </span>
        </div>

        {/* コメント（クリック時） */}
        <div className={`
          absolute px-3 py-1.5 rounded-full shadow-md border transition-all duration-300 ease-out
          ${isDark 
            ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
            : "bg-white/95 border-amber-200 text-amber-600"
          }
          ${isClicked 
            ? "opacity-100 scale-110 translate-y-0" 
            : "opacity-0 scale-50 translate-y-[-4px] pointer-events-none"}
        `}>
          <span className={`text-xs md:text-sm font-black whitespace-nowrap`}>
            {desc}
          </span>
        </div>
      </div>
    </div>
  );
}