"use client";

import { ClearAnimation } from "@/components/animation/ClearAnimation";

type Props = {
  resultState: "none" | "win" | "lose";
  showClear: boolean;
  endMessage: string;
  onHome: () => void;
  onReset: () => void;
};

export function ResultModal({
  resultState,
  showClear,
  endMessage,
  onHome,
  onReset,
}: Props) {
  if (resultState === "none") return null;

  return (
    <div className="absolute inset-0 min-h-[100dvh] pointer-events-auto">
      <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] gap-6">
        {resultState === "win" && showClear && <ClearAnimation />}

        <p className="text-3xl font-bold text-white drop-shadow mb-4">
          {endMessage}
        </p>

        <div className="flex flex-row gap-6">
          {resultState === "win" && (
            <button
              onClick={onHome}
              className="px-7 py-3 bg-green-400 rounded-xl font-bold hover:scale-105 transition"
            >
              ホーム
            </button>
          )}

          {resultState === "lose" && (
            <button
              onClick={onReset}
              className="px-6 py-3 bg-pink-300 rounded-xl font-bold text-black hover:scale-105 transition"
            >
              リセット
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
