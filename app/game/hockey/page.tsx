"use client";

import { useEffect, useState } from "react";
import { useHockeyGame } from "@/app/game/hockey/logic/useHockeyGame";
import { ScoreHeader } from "@/components/hockey/ScoreHeader";
import { StartButton } from "@/components/hockey/StartButton";
import { ResetButton } from "@/components/hockey/ResetButton";
import { GameField } from "@/components/hockey/GameField";
import { useRouter } from "next/navigation";

export default function HockeyPage() {
  const router = useRouter();

  const {
    started,
    showReset,
    logic,
    fieldRef,
    startGame,
    resetGame,
    backGame,
    handleMove,
    handleTouchMove,
  } = useHockeyGame();

  const handleBack = () => {
    backGame(); // ★ スコア保存
    router.back(); // ★ 前のページに戻る
  };

  const [dbMaxScore, setDbMaxScore] = useState(0);

  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const res = await fetch("/api/highscore?game=hockey");
        if (res.ok) {
          const data = await res.json();
          if (data && data.value) {
            setDbMaxScore(data.value);
          }
        }
      } catch (e) {
        console.error("ハイスコアの取得に失敗しました", e);
      }
    };

    fetchHighScore();
  }, []);

  const displayMaxScore = Math.max(dbMaxScore, logic?.maxReflectCount ?? 0);

  return (
    <main
      className={`
        w-full min-h-[100dvh] bg-[#080812]
        flex flex-col relative overflow-hidden touch-none
        pt-8 p-4 border-4 border-sky-300 rounded-2xl shadow-2xl
        ${started && !showReset ? "md:cursor-none" : "md:cursor-auto"}
      `}
    >
      <ScoreHeader
        score={logic?.reflectCount ?? 0}
        maxScore={displayMaxScore}
      />

      {!started && <StartButton onStart={startGame} />}

      {showReset && (
        <ResetButton
          onReset={resetGame}
          onBack={handleBack} // ← ここで戻る
        />
      )}

      <GameField
        fieldRef={fieldRef}
        logic={logic}
        onMove={handleMove}
        onTouchMove={handleTouchMove}
      />

      <div className="h-10"></div>
    </main>
  );
}
