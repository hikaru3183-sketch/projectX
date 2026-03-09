"use client";

import { useEffect, useState } from "react";

export function OceanBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* 空のグラデーション */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #87CEEB 0%, #98D1E8 30%, #7EC8E3 60%, #5CACEE 100%)",
        }}
      />

      {/* 雲 */}
      {mounted && (
        <>
          <Cloud className="top-[5%] left-[10%]" delay={0} size="lg" />
          <Cloud className="top-[8%] right-[15%]" delay={2} size="md" />
          <Cloud className="top-[15%] left-[40%]" delay={4} size="sm" />
          <Cloud className="top-[3%] right-[35%]" delay={6} size="md" />
        </>
      )}

      {/* 海のグラデーション */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[45%]"
        style={{
          background:
            "linear-gradient(180deg, #4FA8C7 0%, #3498DB 30%, #2980B9 60%, #1F618D 100%)",
        }}
      />

      {/* 波のアニメーション */}
      <div className="absolute bottom-[42%] left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-24"
          preserveAspectRatio="none"
        >
          <path
            fill="#4FA8C7"
            fillOpacity="0.8"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z"
            className="animate-wave"
          />
          <path
            fill="#3498DB"
            fillOpacity="0.6"
            d="M0,96L48,90.7C96,85,192,75,288,69.3C384,64,480,64,576,69.3C672,75,768,85,864,85.3C960,85,1056,75,1152,64C1248,53,1344,43,1392,37.3L1440,32L1440,120L0,120Z"
            className="animate-wave-slow"
            style={{ animationDelay: "0.5s" }}
          />
        </svg>
      </div>

      {/* 太陽 */}
      <div
        className="absolute top-[8%] right-[8%] w-20 h-20 rounded-full"
        style={{
          background:
            "radial-gradient(circle, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
          boxShadow:
            "0 0 60px 20px rgba(255, 215, 0, 0.4), 0 0 100px 40px rgba(255, 165, 0, 0.2)",
        }}
      />

      {/* 鳥 */}
      {mounted && (
        <>
          <Bird className="top-[12%] left-[20%]" delay={0} />
          <Bird className="top-[18%] left-[25%]" delay={1} />
          <Bird className="top-[10%] right-[25%]" delay={2} />
        </>
      )}
    </div>
  );
}

function Cloud({
  className,
  delay,
  size,
}: {
  className: string;
  delay: number;
  size: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-16 h-8",
    md: "w-24 h-12",
    lg: "w-32 h-16",
  };

  return (
    <div
      className={`absolute ${className} ${sizes[size]} opacity-90`}
      style={{
        animation: `drift ${20 + delay * 2}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <ellipse cx="25" cy="35" rx="20" ry="12" fill="white" />
        <ellipse cx="50" cy="30" rx="25" ry="18" fill="white" />
        <ellipse cx="75" cy="35" rx="20" ry="12" fill="white" />
        <ellipse cx="40" cy="22" rx="18" ry="14" fill="white" />
        <ellipse cx="60" cy="22" rx="18" ry="14" fill="white" />
      </svg>
    </div>
  );
}

function Bird({ className, delay }: { className: string; delay: number }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        animation: `flyBird ${8 + delay * 2}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg width="20" height="10" viewBox="0 0 20 10">
        <path
          d="M0,5 Q5,0 10,5 Q15,0 20,5"
          fill="none"
          stroke="#333"
          strokeWidth="1.5"
          className="animate-flap"
        />
      </svg>
    </div>
  );
}
