"use client";

import { create } from "zustand";
import { useGlobalStore } from "../useGlobalStore";

export type Suit = "spades" | "hearts" | "diamonds" | "clubs";

interface HighLowState {
  currentNum: number;
  currentSuit: Suit;
  gameMsg: string;
  isProcessing: boolean;
  handleGuess: (type: "high" | "low") => void;
  resetGame: () => void;
}

const getRandomSuit = (): Suit => {
  const suits: Suit[] = ["spades", "hearts", "diamonds", "clubs"];
  return suits[Math.floor(Math.random() * suits.length)];
};

export const useHighLowStore = create<HighLowState>((set, get) => ({
  currentNum: Math.floor(Math.random() * 13) + 1,
  currentSuit: getRandomSuit(),
  gameMsg: "HIGH OR LOW?",
  isProcessing: false,

  resetGame: () => {
    set({
      currentNum: Math.floor(Math.random() * 13) + 1,
      currentSuit: getRandomSuit(),
      gameMsg: "HIGH OR LOW?",
      isProcessing: false,
    });
  },

  handleGuess: (type) => {
    const state = get();
    if (state.isProcessing) return;

    // 1. 処理開始（ボタン連打防止）
    set({ isProcessing: true });

    const nextNum = Math.floor(Math.random() * 13) + 1;
    const nextSuit = getRandomSuit();

    // 判定
    const isWin =
      type === "high"
        ? nextNum >= state.currentNum
        : nextNum <= state.currentNum;

    const globalStore = useGlobalStore.getState();

    if (isWin) {
      // --- 【勝利演出フェーズ】 ---
      // カードをめくり、WINNER表示
      set({
        currentNum: nextNum,
        currentSuit: nextSuit,
        gameMsg: "WINNER!",
      });

      // KAPLAYのエフェクト発火
      window.dispatchEvent(
        new CustomEvent("game-visual-effect", { detail: { type: "win" } }),
      );

      // ★ 2秒待機してからコイン加算と次ラウンドへ
      setTimeout(() => {
        globalStore.addStreak();
        globalStore.resolveWin(2);
        const newStreak = useGlobalStore.getState().streak;

        set({
          gameMsg: `${newStreak} STREAK!`,
          isProcessing: false,
        });
      }, 2000);
    } else {
      // --- 【敗北演出フェーズ】 ---
      // カードをめくり、LOSER表示
      set({
        currentNum: nextNum,
        currentSuit: nextSuit,
        gameMsg: "LOSER...",
      });

      // KAPLAYのエフェクト発火
      window.dispatchEvent(
        new CustomEvent("game-visual-effect", { detail: { type: "lose" } }),
      );

      // ★ 2秒待機してからベット画面へ戻す
      setTimeout(() => {
        // ここで初めてresolveLossを呼ぶことで、ベット画面への遷移を遅らせる
        globalStore.resolveLoss();
        get().resetGame();
        // globalStoreのcurrentBetが0になるため、自動でチップ選択に戻ります
      }, 2000);
    }
  },
}));
