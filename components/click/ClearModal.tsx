"use client";

import { useEffect, useRef } from "react";

export function ClearModal({ onHome }: { onHome: () => void }) {
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 初回表示時に音を鳴らす
    if (!soundRef.current) {
      soundRef.current = new Audio("/sounds/win.mp3"); // ← 好きな音を入れる
    }

    soundRef.current.currentTime = 0;
    soundRef.current.play();
  }, []);

  return (
    <div className="fixed inset-0 z-999 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-sm"></div>
      <div className="relative z-10 text-white text-3xl font-bold mb-4">
        🎉 クリアおめでとう！ 🎉
      </div>
      <button
        onClick={onHome}
        className="relative px-6 py-3 bg-green-400 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
      >
        ホーム画面
      </button>
    </div>
  );
}
