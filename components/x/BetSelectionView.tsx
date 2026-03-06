"use client";

import { useGlobalStore } from "@/app/game/x/useGlobalStore";

interface BetSelectionViewProps {
  gameTitle: string;
  description: string;
  themeColor: "blue" | "purple" | "orange";
  onPlaceBet: (amount: number) => void;
}

export function BetSelectionView({
  gameTitle,
  description,
  themeColor,
  onPlaceBet,
}: BetSelectionViewProps) {
  const coins = useGlobalStore((s) => s.coins);

  const colorConfig = {
    blue: "bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-blue-400",
    purple:
      "bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.4)] text-purple-400",
    orange:
      "bg-orange-600 border-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.4)] text-orange-400",
  };

  const textColor = colorConfig[themeColor].split(" ")[2];

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full animate-in fade-in zoom-in duration-300">
      <div className="text-center">
        <h2
          className={`text-3xl font-black italic mb-2 uppercase ${textColor}`}
        >
          {gameTitle}
        </h2>
        <p className="text-white/50 text-xs font-bold tracking-widest uppercase">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 pointer-events-auto">
        {[1000, 5000, 10000, 100000].map((amount) => (
          <button
            key={amount}
            disabled={coins < amount}
            onClick={() => onPlaceBet(amount)}
            className={`
              w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 flex flex-col items-center justify-center font-black transition-all relative overflow-hidden group
              ${
                coins >= amount
                  ? `${colorConfig[themeColor].split(" ").slice(0, 2).join(" ")} text-white hover:scale-110 active:scale-95 ${textColor}`
                  : "bg-gray-800 border-gray-900 text-gray-600 opacity-50 cursor-not-allowed"
              }
            `}
          >
            <span className="text-[10px] sm:text-xs opacity-70 mb-1">CHIP</span>
            {/* ここを修正しました！ </span> で閉じるようにしています */}
            <span
              className={`
              tracking-tighter leading-none
              ${amount >= 100000 ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}
            `}
            >
              {amount.toLocaleString()}
            </span>

            {coins >= amount && (
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        ))}
      </div>

      <div className="bg-black/40 px-6 py-2 rounded-full border border-white/10 text-white font-bold text-sm">
        Balance:{" "}
        <span className="text-yellow-400">{coins.toLocaleString()}</span> 🪙
      </div>
    </div>
  );
}
