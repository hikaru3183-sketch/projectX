"use client";

import { useGlobalStore } from "../useGlobalStore";
import { useHighLowStore } from "./useHighLowStore";
import { GameLayout } from "@/components/x/GameLayout";
import { GameButton } from "@/components/x/GameButton";
import { PlayingCard } from "@/components/x/PlayingCard";
import { BetSelectionView } from "@/components/x/BetSelectionView";

export function HighLowUI({ onQuit }: { onQuit: () => void }) {
  const streak = useGlobalStore((state) => state.streak);
  const currentBet = useGlobalStore((state) => state.currentBet);
  const placeBet = useGlobalStore((state) => state.placeBet);

  const { currentNum, currentSuit, gameMsg, isProcessing, handleGuess } =
    useHighLowStore();

  // --- 1. BET 選択画面 ---
  if (currentBet === 0) {
    return (
      <GameLayout score={streak} onQuit={onQuit}>
        <BetSelectionView
          gameTitle="High & Low"
          description="Select a chip to start High & Low"
          themeColor="blue"
          onPlaceBet={placeBet}
          // bestScoreはGameLayoutが表示するので、ここからは削除しました
        />
      </GameLayout>
    );
  }

  // --- 2. メインゲーム画面 ---
  return (
    <GameLayout score={streak} onQuit={onQuit}>
      {/* 重複していた「Best記録」と「Current Bet」の表示パーツを削除しました。
         これらはすべて GameLayout 側で表示されます。
      */}

      <div className="flex-1 flex items-center justify-center w-full relative py-8 sm:py-12">
        <div className="relative h-full aspect-[2/3] max-h-[60vh]">
          <PlayingCard rank={currentNum} suit={currentSuit} />
        </div>
      </div>

      {/* アクションボタン */}
      <div className="w-full max-w-md flex gap-4 pointer-events-auto shrink-0 pb-6 px-2">
        <GameButton
          onClick={() => handleGuess("high")}
          disabled={isProcessing}
          variant="primary"
        >
          HIGH
        </GameButton>
        <GameButton
          onClick={() => handleGuess("low")}
          disabled={isProcessing}
          variant="danger"
        >
          LOW
        </GameButton>
      </div>
    </GameLayout>
  );
}
