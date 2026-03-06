"use client";

import { create } from "zustand";
import { Suit } from "@/components/x/PlayingCard";
import { useGlobalStore } from "../useGlobalStore";

interface Card {
  num: number;
  suit: Suit;
}

interface BjState {
  hand: Card[];
  total: number;
  status: "playing" | "bust" | "stand";
  isProcessing: boolean; // 連打防止用に追加
  drawCard: () => void;
  stand: () => void;
  resetGame: () => void;
}

export const useBjStore = create<BjState>((set, get) => ({
  hand: [],
  total: 0,
  status: "playing",
  isProcessing: false,

  resetGame: () =>
    set({ hand: [], total: 0, status: "playing", isProcessing: false }),

  drawCard: () => {
    const { status, hand, total, isProcessing } = get();
    if (status !== "playing" || isProcessing) return;

    const num = Math.floor(Math.random() * 13) + 1;
    const suit = (["spades", "hearts", "diamonds", "clubs"] as Suit[])[
      Math.floor(Math.random() * 4)
    ];
    const newCard = { num, suit };

    const val = num > 10 ? 10 : num;
    const newTotal = total + val;
    const newHand = [...hand, newCard];

    if (newTotal > 21) {
      // --- BUST (敗北) ---
      set({
        hand: newHand,
        total: newTotal,
        status: "bust",
        isProcessing: true,
      });

      // KAPLAYのLOSEエフェクト
      window.dispatchEvent(
        new CustomEvent("game-visual-effect", { detail: { type: "lose" } }),
      );

      // 2秒待ってからベット画面へ
      setTimeout(() => {
        const global = useGlobalStore.getState();
        global.resolveLoss();
        get().resetGame();
      }, 2000);
    } else {
      set({ hand: newHand, total: newTotal });
    }
  },

  stand: () => {
    const { total, status, isProcessing } = get();
    if (status !== "playing" || total === 0 || isProcessing) return;

    set({ status: "stand", isProcessing: true });
    const global = useGlobalStore.getState();

    // 判定ロジック
    if (total === 21) {
      // PERFECT BLACKJACK
      window.dispatchEvent(
        new CustomEvent("game-visual-effect", { detail: { type: "win" } }),
      );
      setTimeout(() => {
        global.addStreak();
        global.resolveWin(3.0);
        get().resetGame();
      }, 2000);
    } else if (total >= 17) {
      // SAFE WIN
      window.dispatchEvent(
        new CustomEvent("game-visual-effect", { detail: { type: "win" } }),
      );
      setTimeout(() => {
        global.addStreak();
        global.resolveWin(2.0);
        get().resetGame();
      }, 2000);
    } else {
      // TOO WEAK (LOSE)
      window.dispatchEvent(
        new CustomEvent("game-visual-effect", { detail: { type: "lose" } }),
      );
      setTimeout(() => {
        global.resolveLoss();
        get().resetGame();
      }, 2000);
    }
  },
}));
