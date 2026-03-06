"use client";

import { useGlobalStore } from "../useGlobalStore";
import { useClashStore } from "./useClashStore";
import { GameLayout } from "@/components/x/GameLayout";
import { GameButton } from "@/components/x/GameButton";
import { PlayingCard } from "@/components/x/PlayingCard";
import { BetSelectionView } from "@/components/x/BetSelectionView";

export function ClashUI({ onQuit }: { onQuit: () => void }) {
  // グローバルストアから取得
  const streak = useGlobalStore((s) => s.streak);
  const currentBet = useGlobalStore((s) => s.currentBet);
  const placeBet = useGlobalStore((s) => s.placeBet);

  const {
    playerCard,
    cpuCard,
    isCpuFaceUp,
    canSwap,
    battle,
    swapCard,
    gameMsg,
    isProcessing,
  } = useClashStore();

  // --- 1. BET 選択画面 ---
  if (currentBet === 0) {
    return (
      <GameLayout score={streak} onQuit={onQuit}>
        <BetSelectionView
          gameTitle="Card Clash"
          description="Select a chip to start Card Clash"
          themeColor="purple"
          onPlaceBet={placeBet}
          // bestScoreはGameLayout側で表示するため削除
        />
      </GameLayout>
    );
  }

  // --- 2. メインゲーム画面 ---
  return (
    <GameLayout score={streak} onQuit={onQuit}>
      {/* ここに表示していた「Best Streak」や「Current Bet」などのHUDパーツは
        すべて GameLayout 側に集約されたため削除しました。
      */}

      <div className="flex-1 w-full flex flex-col items-center justify-around py-4 relative pointer-events-auto">
        {/* 敵のカード */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-bold opacity-60 tracking-[0.2em] uppercase text-white">
            Enemy Deck
          </p>
          <div className="h-[24vh] aspect-2/3">
            {isCpuFaceUp ? (
              <PlayingCard rank={cpuCard.num} suit={cpuCard.suit} />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-indigo-900 to-black border-4 border-white/20 rounded-[7%] flex items-center justify-center shadow-2xl">
                <span className="text-4xl opacity-20 text-white font-black">
                  ?
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 自分のカード */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-[28vh] aspect-2/3">
            <PlayingCard rank={playerCard.num} suit={playerCard.suit} />
          </div>
          <p className="text-xs font-bold text-blue-400 tracking-[0.2em] uppercase">
            Your Hand
          </p>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="w-full max-w-md flex gap-4 shrink-0 pb-6 px-4 relative z-30 pointer-events-auto">
        <GameButton
          onClick={swapCard}
          disabled={!canSwap || isProcessing}
          variant="secondary"
        >
          SWAP
        </GameButton>
        <GameButton onClick={battle} disabled={isProcessing} variant="primary">
          BATTLE
        </GameButton>
      </div>
    </GameLayout>
  );
}
