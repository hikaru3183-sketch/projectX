// @/components/x/GameLayout.tsx
import { useState } from "react"; // useStateを追加
import { useGlobalStore } from "@/app/game/x/useGlobalStore";

interface GameLayoutProps {
  score: number;
  onQuit: () => void;
  children: React.ReactNode;
}

export function GameLayout({ score, onQuit, children }: GameLayoutProps) {
  const coins = useGlobalStore((s) => s.coins);
  const activeGame = useGlobalStore((s) => s.activeGame);
  const gameBestScores = useGlobalStore((s) => s.gameBestScores);
  const currentBest = gameBestScores[activeGame] || 0;

  // ローディング状態を内部で管理
  const [isExiting, setIsExiting] = useState(false);

  // QUITボタンが押された時の共通処理
  const handleQuitClick = () => {
    setIsExiting(true);
    // 0.6秒待ってから、親から渡された本来の終了処理を呼ぶ
    setTimeout(() => {
      onQuit();
    }, 600);
  };

  return (
    <div className="flex flex-col items-center h-full w-full justify-between py-4 px-4 box-border font-sans relative overflow-hidden">
      {/* 画面全体のローディングオーバーレイ */}
      {isExiting && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-blue-400 text-xs font-black tracking-[0.3em] animate-pulse uppercase">
              Saving Data...
            </p>
          </div>
        </div>
      )}

      {/* 1. ヘッダー領域 */}
      <div className="w-full flex justify-between items-start pointer-events-auto px-2 shrink-0 z-50">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleQuitClick} // 内部の関数を呼ぶように変更
              disabled={isExiting}
              className="px-4 py-2 bg-black/40 hover:bg-red-600 rounded-lg border border-white/20 transition-all text-sm font-bold text-white shadow-lg active:scale-95 disabled:opacity-50"
            >
              QUIT
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-900/40 border border-yellow-500/50 rounded-full backdrop-blur-md shadow-lg">
              <span className="text-yellow-400 text-sm">🪙</span>
              <span className="text-white font-black text-sm tabular-nums">
                {coins.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* スコアボード */}
        <div className="flex flex-col items-end">
          <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 shadow-2xl min-w-[110px]">
            <div className="text-right border-b border-white/10 pb-1 mb-1">
              <p className="text-[9px] font-black opacity-50 uppercase text-blue-300 tracking-tighter">
                Streak
              </p>
              <p className="text-2xl font-black tabular-nums text-white leading-none">
                {score}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black opacity-40 uppercase text-white tracking-tighter">
                Best
              </p>
              <p className="text-sm font-black tabular-nums text-yellow-500 leading-none">
                {currentBest}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. メイン・コンテンツ */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative min-h-0">
        {children}
      </div>
    </div>
  );
}
