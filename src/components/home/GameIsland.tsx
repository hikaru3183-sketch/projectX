"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Link
      ref={ref}
      href={href}
      className={`
        group relative flex flex-col items-center justify-center
        w-full aspect-square max-w-[180px]
        transition-all duration-500 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      {/* 浮遊アニメーション用ラッパー */}
      <div
        className={`
          relative w-full h-full
          transition-transform duration-700 ease-in-out
          ${isHovered ? "scale-110 -translate-y-2" : ""}
        `}
        style={{
          animation: `float ${3 + delay * 0.2}s ease-in-out infinite`,
          animationDelay: `${delay * 0.3}s`,
        }}
      >
        {/* 島のベース（砂浜） */}
        <div
          className={`
            absolute inset-0 rounded-[40%] 
            bg-gradient-to-b from-amber-200 via-amber-100 to-amber-300
            shadow-2xl
            transition-all duration-300
            ${isHovered ? "shadow-amber-400/50" : "shadow-amber-900/30"}
          `}
          style={{
            clipPath:
              "polygon(15% 60%, 5% 75%, 10% 90%, 30% 95%, 70% 95%, 90% 90%, 95% 75%, 85% 60%, 75% 55%, 50% 50%, 25% 55%)",
          }}
        />

        {/* 島のメイン部分（草・森） */}
        <div
          className={`
            absolute inset-[10%] rounded-[50%]
            ${color}
            shadow-inner
            flex items-center justify-center
            transition-all duration-300
            ${isHovered ? "brightness-110" : ""}
          `}
          style={{
            clipPath:
              "polygon(20% 70%, 10% 50%, 15% 30%, 30% 15%, 50% 10%, 70% 15%, 85% 30%, 90% 50%, 80% 70%, 60% 75%, 40% 75%)",
          }}
        >
          {/* アイコン */}
          <div
            className={`
              text-white text-4xl drop-shadow-lg
              transition-all duration-300
              ${isHovered ? "scale-125 rotate-12" : ""}
            `}
          >
            {icon}
          </div>
        </div>

        {/* ヤシの木（装飾） */}
        <div className="absolute top-[5%] right-[15%]">
          <svg
            width="24"
            height="32"
            viewBox="0 0 24 32"
            className={`
              transition-transform duration-500
              ${isHovered ? "rotate-6" : ""}
            `}
          >
            <path d="M12 32 L12 16" stroke="#8B4513" strokeWidth="2" />
            <ellipse
              cx="8"
              cy="10"
              rx="6"
              ry="3"
              fill="#228B22"
              transform="rotate(-30 8 10)"
            />
            <ellipse
              cx="16"
              cy="10"
              rx="6"
              ry="3"
              fill="#228B22"
              transform="rotate(30 16 10)"
            />
            <ellipse
              cx="12"
              cy="8"
              rx="5"
              ry="3"
              fill="#2E8B2E"
              transform="rotate(-5 12 8)"
            />
          </svg>
        </div>

        {/* 水面の反射エフェクト */}
        <div
          className={`
            absolute -bottom-2 left-1/2 -translate-x-1/2
            w-[90%] h-4
            bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent
            rounded-full blur-sm
            transition-opacity duration-300
            ${isHovered ? "opacity-100" : "opacity-50"}
          `}
        />
      </div>

      {/* ラベル */}
      <div
        className={`
          absolute -bottom-8 left-1/2 -translate-x-1/2
          bg-white/95 backdrop-blur-sm
          px-4 py-2 rounded-full
          shadow-lg border-2 border-amber-200
          transition-all duration-300
          ${isHovered ? "scale-110 shadow-xl -translate-y-1" : ""}
        `}
      >
        <span className="font-bold text-gray-800 whitespace-nowrap">
          {label}
        </span>
      </div>

      {/* ホバー時の説明 */}
      <div
        className={`
          absolute -bottom-16 left-1/2 -translate-x-1/2
          text-sm text-gray-600 font-medium
          whitespace-nowrap
          transition-all duration-300
          ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        `}
      >
        {desc}
      </div>
    </Link>
  );
}
