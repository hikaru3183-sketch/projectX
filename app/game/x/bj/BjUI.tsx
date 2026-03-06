"use client";

import { useGlobalStore } from "../useGlobalStore";
import { useBjStore } from "./useBjStore";
import { GameLayout } from "@/components/x/GameLayout";
import { GameButton } from "@/components/x/GameButton";
import { PlayingCard } from "@/components/x/PlayingCard";
import { BetSelectionView } from "@/components/x/BetSelectionView";

export function BjUI({ onQuit }: { onQuit: () => void }) {
  const streak = useGlobalStore((s) => s.streak);
  const currentBet = useGlobalStore((s) => s.currentBet);
  const placeBet = useGlobalStore((s) => s.placeBet);

  // isProcessing も取得してボタンの無効化に利用
  const { hand, total, status, drawCard, stand, resetGame, isProcessing } =
    useBjStore();

  // --- 1. BET 選択画面 ---
  if (currentBet === 0) {
    return (
      <GameLayout score={streak} onQuit={onQuit}>
        <BetSelectionView
          gameTitle="Blackjack 21"
          description="Select a chip to deal the cards"
          themeColor="orange"
          onPlaceBet={(amount) => {
            placeBet(amount);
            resetGame();
          }}
        />
      </GameLayout>
    );
  }

  // --- 2. メインゲーム画面 ---
  return (
    <GameLayout score={streak} onQuit={onQuit}>
      <div className="flex-1 w-full flex flex-col items-center justify-center p-4 relative pointer-events-auto">
        <div className="mb-6 text-center">
          <span
            className={`text-7xl sm:text-9xl font-black drop-shadow-lg transition-all duration-500 ${
              status === "bust"
                ? "text-red-600 italic scale-110"
                : status === "stand"
                  ? "text-yellow-400"
                  : "text-white"
            }`}
          >
            {total}
          </span>
          <p className="text-xs font-bold tracking-[0.4em] opacity-40 uppercase mt-2 text-white">
            {status === "bust"
              ? "Busted"
              : status === "stand"
                ? "Result"
                : "Current Hand Value"}
          </p>
        </div>

        {/* カード手札表示 */}
        <div className="relative flex justify-center items-center h-[35vh] w-full max-w-lg">
          {hand.length > 0 ? (
            <div className="flex justify-center items-center">
              {hand.map((card, i) => (
                <div
                  key={i}
                  className="h-44 sm:h-56 aspect-2/3 transition-all duration-500 ease-out"
                  style={{
                    marginLeft: i === 0 ? "0" : "-4rem",
                    zIndex: i,
                    transform: `rotate(${(i - (hand.length - 1) / 2) * 5}deg) translateY(${Math.abs(i - (hand.length - 1) / 2) * 4}px)`,
                  }}
                >
                  <PlayingCard rank={card.num} suit={card.suit} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-44 sm:h-56 aspect-2/3 border-4 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-white/5 text-6xl font-black uppercase">
              Ready
            </div>
          )}
        </div>
      </div>

      {/* アクションボタン：status が playing の時だけ表示する */}
      <div className="w-full max-w-md flex gap-4 shrink-0 pb-8 px-6 pointer-events-auto min-h-[100px] justify-center items-center">
        {status === "playing" && !isProcessing && (
          <>
            <GameButton onClick={drawCard} variant="primary">
              HIT
            </GameButton>
            <GameButton
              onClick={stand}
              variant="secondary"
              disabled={total === 0}
            >
              STAND
            </GameButton>
          </>
        )}
      </div>
    </GameLayout>
  );
}
