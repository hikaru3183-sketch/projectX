import { create } from "zustand";

export type GameType = "none" | "highlow" | "clash" | "bj";

interface GlobalState {
  streak: number;
  coins: number;
  currentBet: number;
  activeGame: GameType;
  // 各ゲームごとのベストスコアを保持するオブジェクト
  gameBestScores: Record<string, number>;

  // アクション
  addStreak: () => void;
  resetStreak: () => void;
  setGame: (game: GameType) => void;
  syncData: (coins: number, scores: { game: string; value: number }[]) => void;
  placeBet: (amount: number) => boolean;
  resolveWin: (multiplier: number) => void;
  resolveLoss: () => void;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  streak: 0,
  coins: 0,
  currentBet: 0,
  activeGame: "none",
  gameBestScores: {
    highlow: 0,
    clash: 0,
    bj: 0,
  },

  // 連勝を1増やす + ベスト記録の更新チェック
  addStreak: () =>
    set((s) => {
      if (s.activeGame === "none") return {};

      const newStreak = s.streak + 1;
      const currentBest = s.gameBestScores[s.activeGame] || 0;
      const isNewRecord = newStreak > currentBest;

      return {
        streak: newStreak,
        gameBestScores: {
          ...s.gameBestScores,
          [s.activeGame]: isNewRecord ? newStreak : currentBest,
        },
      };
    }),

  resetStreak: () => set({ streak: 0 }),

  setGame: (game) =>
    set({
      activeGame: game,
      streak: 0, // ゲームを切り替えたら現在の連勝はリセット
    }),

  // DBからのデータ読み込み用
  syncData: (coins, scoresList) => {
    const scoresMap: Record<string, number> = {
      highlow: 0,
      clash: 0,
      bj: 0,
    };
    scoresList.forEach((s) => {
      scoresMap[s.game] = s.value;
    });
    set({
      coins,
      gameBestScores: scoresMap,
    });
  },

  // チップを賭ける
  placeBet: (amount) => {
    const { coins } = get();
    if (coins < amount) return false;

    set((s) => ({
      coins: s.coins - amount,
      currentBet: amount,
    }));
    return true;
  },

  // 勝利処理（配当を渡す）
  resolveWin: (multiplier) => {
    const { currentBet, coins } = get();
    // 倍率に応じた配当を計算 (例: 100ベットで2倍なら200コイン戻る)
    const payout = Math.floor(currentBet * multiplier);

    set({
      coins: coins + payout,
      currentBet: 0,
    });
  },

  // 敗北処理
  resolveLoss: () => {
    set({
      currentBet: 0,
      streak: 0, // 連勝ストップ
    });
  },
}));
