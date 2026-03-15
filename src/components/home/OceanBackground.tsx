"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function OceanBackground() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  // 色の定義
  const colors = {
    sky: isDark 
      ? "linear-gradient(180deg, #0B1026 0%, #1B264F 40%, #2E3A59 100%)" // 夜の空
      : "linear-gradient(180deg, #87CEEB 0%, #98D1E8 30%, #7EC8E3 60%, #5CACEE 100%)", // 昼の空
    sea: isDark
      ? "linear-gradient(180deg, #0F2027 0%, #203A43 50%, #2C5364 100%)" // 夜の海
      : "linear-gradient(180deg, #4FA8C7 0%, #3498DB 30%, #2980B9 60%, #1F618D 100%)", // 昼の海
    wave1: isDark ? "#1B264F" : "#4FA8C7",
    wave2: isDark ? "#0F2027" : "#3498DB",
    sunMoon: isDark
      ? "radial-gradient(circle, #F4F6F0 0%, #D1D5DB 50%, #9CA3AF 100%)" // 月
      : "radial-gradient(circle, #FFD700 0%, #FFA500 50%, #FF8C00 100%)", // 太陽
    sunMoonGlow: isDark
      ? "0 0 40px 10px rgba(255, 255, 255, 0.2)" // 月の光
      : "0 0 60px 20px rgba(255, 215, 0, 0.4)", // 太陽の光
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 transition-colors duration-1000">
      {/* 空 */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: colors.sky }}
      />

      {/* 雲（夜は少し暗く、透明度を下げる） */}
      <div className={`transition-opacity duration-1000 ${isDark ? "opacity-30" : "opacity-90"}`}>
        <Cloud className="top-[5%] left-[10%]" delay={0} size="lg" />
        <Cloud className="top-[8%] right-[15%]" delay={2} size="md" />
        <Cloud className="top-[15%] left-[40%]" delay={4} size="sm" />
        <Cloud className="top-[3%] right-[35%]" delay={6} size="md" />
      </div>

      {/* 海 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[45%] transition-all duration-1000"
        style={{ background: colors.sea }}
      />

      {/* 波 */}
      <div className="absolute bottom-[42%] left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-24" preserveAspectRatio="none">
          <path
            fill={colors.wave1}
            fillOpacity="0.8"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z"
            className="animate-wave transition-all duration-1000"
          />
          <path
            fill={colors.wave2}
            fillOpacity="0.6"
            d="M0,96L48,90.7C96,85,192,75,288,69.3C384,64,480,64,576,69.3C672,75,768,85,864,85.3C960,85,1056,75,1152,64C1248,53,1344,43,1392,37.3L1440,32L1440,120L0,120Z"
            className="animate-wave-slow transition-all duration-1000"
            style={{ animationDelay: "0.5s" }}
          />
        </svg>
      </div>

      {/* 太陽 / 月 */}
      <div
        className="absolute top-[8%] right-[8%] w-20 h-20 rounded-full transition-all duration-1000"
        style={{
          background: colors.sunMoon,
          boxShadow: colors.sunMoonGlow,
        }}
      />

      {/* 鳥（夜は見えなくする） */}
      <div className={`transition-opacity duration-1000 ${isDark ? "opacity-0" : "opacity-100"}`}>
        <Bird className="top-[12%] left-[20%]" delay={0} />
        <Bird className="top-[18%] left-[25%]" delay={1} />
        <Bird className="top-[10%] right-[25%]" delay={2} />
      </div>

      {/* 星（夜だけ表示） */}
      {isDark && (
        <div className="absolute inset-0 animate-pulse opacity-50">
           <Star x="20%" y="10%" />
           <Star x="40%" y="15%" />
           <Star x="70%" y="5%" />
           <Star x="85%" y="20%" />
        </div>
      )}
    </div>
  );
}

// 星コンポーネント
function Star({ x, y }: { x: string, y: string }) {
  return (
    <div 
      className="absolute bg-white rounded-full w-1 h-1" 
      style={{ top: y, left: x, boxShadow: "0 0 5px white" }} 
    />
  );
}

// Cloud と Bird の定義は元のまま（省略せずに含めてください）
function Cloud({ className, delay, size }: { className: string; delay: number; size: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-16 h-8", md: "w-24 h-12", lg: "w-32 h-16" };
  return (
    <div className={`absolute ${className} ${sizes[size]}`} style={{ animation: `drift ${20 + delay * 2}s linear infinite`, animationDelay: `${delay}s` }}>
      <svg viewBox="0 0 100 50" className="w-full h-full"><ellipse cx="25" cy="35" rx="20" ry="12" fill="white" /><ellipse cx="50" cy="30" rx="25" ry="18" fill="white" /><ellipse cx="75" cy="35" rx="20" ry="12" fill="white" /><ellipse cx="40" cy="22" rx="18" ry="14" fill="white" /><ellipse cx="60" cy="22" rx="18" ry="14" fill="white" /></svg>
    </div>
  );
}

function Bird({ className, delay }: { className: string; delay: number }) {
  return (
    <div className={`absolute ${className}`} style={{ animation: `flyBird ${8 + delay * 2}s ease-in-out infinite`, animationDelay: `${delay}s` }}>
      <svg width="20" height="10" viewBox="0 0 20 10"><path d="M0,5 Q5,0 10,5 Q15,0 20,5" fill="none" stroke="#333" strokeWidth="1.5" className="animate-flap" /></svg>
    </div>
  );
}