"use client";

import { create } from "zustand";
import { useGlobalStore } from "../useGlobalStore";
import { Suit } from "@/components/x/PlayingCard";

interface ClashState {
  playerCard: { num: number; suit: Suit };
  cpuCard: { num: number; suit: Suit };
  isCpuFaceUp: boolean;
  canSwap: boolean;
  gameMsg: string;
  isProcessing: boolean;
  startRound: () => void;
  swapCard: () => void;
  battle: () => void;
}

const getRandomCard = () => {
  const suits: Suit[] = ["spades", "hearts", "diamonds", "clubs"];
  return {
    num: Math.floor(Math.random() * 13) + 1,
    suit: suits[Math.floor(Math.random() * suits.length)],
  };
};

export const useClashStore = create<ClashState>((set, get) => ({
  playerCard: getRandomCard(),
  cpuCard: getRandomCard(),
  isCpuFaceUp: false,
  canSwap: true,
  gameMsg: "BATTLE OR SWAP?", // 英語にして文字化け回避
  isProcessing: false,

  startRound: () =>
    set({
      playerCard: getRandomCard(),
      cpuCard: getRandomCard(),
      isCpuFaceUp: false,
      canSwap: true,
      gameMsg: "WATCH THE SUIT...",
      isProcessing: false,
    }),

  swapCard: () => {
    if (!get().canSwap || get().isProcessing) return;
    set({
      playerCard: getRandomCard(),
      canSwap: false,
      gameMsg: "SWAPPED!",
    });
  },

  battle: () => {
    if (get().isProcessing) return;

    // CPUのカードをオープンし、処理中に設定
    set({ isProcessing: true, isCpuFaceUp: true });

    const { playerCard, cpuCard } = get();
    const isWin = playerCard.num >= cpuCard.num;
    const global = useGlobalStore.getState();

    if (isWin) {
      // --- 勝利演出 ---
      set({ gameMsg: "WINNER!" });
      window.dispatchEvent(
        new CustomEvent("game-visual-effect", { detail: { type: "win" } }),
      );

      // ★ 2秒待機してから「配当加算」と「次ラウンド準備」
      setTimeout(() => {
        global.addStreak();
        global.resolveWin(2.0); // ここで初めて配当が確定
        get().startRound();
      }, 2000);
    } else {
      // --- 敗北演出 ---
      set({ gameMsg: "LOSER..." });
      window.dispatchEvent(
        new CustomEvent("game-visual-effect", { detail: { type: "lose" } }),
      );

      // ★ 2秒待機してから「チップ没収 ＝ ベット画面へ」
      setTimeout(() => {
        global.resolveLoss(); // currentBetが0になり、UIが自動でチップ選択へ戻る
        get().startRound();
      }, 2000);
    }
  },
}));
