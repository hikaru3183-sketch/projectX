"use client";

import { useEffect } from "react";
import { ClearAnimation } from "@/components/animation/ClearAnimation";
import { ResultButtons } from "@/components/janken/ResultButtons";
import { playSound } from "@/components/sound/Sound";

type Props = {
  resultState: "win" | "lose";
  showClear: boolean;
  endMessage: string;
  onHome: () => void;
  onReset: () => void;
};

export function ResultOverlay({
  resultState,
  showClear,
  endMessage,
  onHome,
  onReset,
}: Props) {
  // ★ 勝ち音
  useEffect(() => {
    if (resultState === "win" && showClear) {
      playSound("/sounds/win.mp3");
    }
  }, [resultState, showClear]);

  // ★ 負け音（追加）
  useEffect(() => {
    if (resultState === "lose") {
      playSound("/sounds/lose.mp3");
    }
  }, [resultState]);

  return (
    <div className="absolute inset-0 min-h-[100dvh] pointer-events-auto">
      <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] gap-6">
        {resultState === "win" && showClear && (
          <ClearAnimation enableSound={false} />
        )}

        <p className="text-3xl font-bold text-white drop-shadow mb-4">
          {endMessage}
        </p>

        <ResultButtons
          resultState={resultState}
          onHome={onHome}
          onReset={onReset}
        />
      </div>
    </div>
  );
}
