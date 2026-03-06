"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import kaplay, { KAPLAYCtx } from "kaplay";
import { setupGameVisual } from "../../../components/x/visualLogic";
import { useGlobalStore } from "./useGlobalStore";
import { useHighLowStore } from "./highlow/useHighLowStore";
import { useClashStore } from "./clash/useClashStore";
import { useBjStore } from "./bj/useBjStore";
import { HighLowUI } from "./highlow/HighLowUI";
import { ClashUI } from "./clash/ClashUI";
import { BjUI } from "./bj/BjUI";
import { saveGameData } from "./actions";
import { GameOverlayEffect } from "@/components/x/GameOverlayEffect"; // ★追加

interface InitialScore {
  game: string;
  value: number;
}

export default function GamePageClient({
  initialCoins,
  initialScores,
}: {
  initialCoins: number;
  initialScores: InitialScore[];
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const kRef = useRef<KAPLAYCtx | null>(null);
  const isInitializing = useRef(false);

  const [scene, setScene] = useState<"title" | "menu" | "game">("title");
  const [isKaplayReady, setIsKaplayReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuSaving, setIsMenuSaving] = useState(false);

  const {
    activeGame,
    setGame,
    resetStreak,
    streak,
    coins,
    gameBestScores,
    syncData,
  } = useGlobalStore();

  const resetHighLow = useHighLowStore((s) => s.resetGame);
  const startClashRound = useClashStore((s) => s.startRound);
  const resetBj = useBjStore((s) => s.resetGame);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      syncData(initialCoins, initialScores);
    }
  }, [mounted, initialCoins, initialScores, syncData]);

  const handleStartMission = () => {
    if (wrapperRef.current && !document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch(() => {});
    }
    setScene("menu");
  };

  const startHighLow = () => {
    setGame("highlow");
    resetHighLow();
    setScene("game");
  };

  const startClash = () => {
    setGame("clash");
    startClashRound();
    setScene("game");
  };

  const startBj = () => {
    setGame("bj");
    resetBj();
    setScene("game");
  };

  const handleQuit = async () => {
    try {
      await saveGameData(coins, streak, activeGame, gameBestScores);
      setGame("none");
      setScene("menu");
      resetStreak();
    } catch (err) {
      console.error("Save Error:", err);
      setGame("none");
      setScene("menu");
    }
  };

  const handleExit = async () => {
    if (isMenuSaving) return;
    setIsMenuSaving(true);
    try {
      await saveGameData(coins, streak, activeGame, gameBestScores);
      router.push("/");
    } catch (err) {
      router.push("/");
    } finally {
      setIsMenuSaving(false);
    }
  };

  // --- KAPLAY初期化 ---
  useEffect(() => {
    if (
      !mounted ||
      isInitializing.current ||
      kRef.current ||
      !containerRef.current
    )
      return;
    isInitializing.current = true;

    containerRef.current.innerHTML = "";
    const canvas = document.createElement("canvas");
    containerRef.current.appendChild(canvas);

    const kInstance = kaplay({
      canvas,
      width: 640,
      height: 480,
      background: [20, 80, 20],
      letterbox: true,
      global: false,
      loadingScreen: false,
    });

    setupGameVisual(kInstance);
    kRef.current = kInstance;
    setIsKaplayReady(true);
    kInstance.go(scene === "game" ? "game_active" : "blank");

    return () => {
      kRef.current?.quit();
      kRef.current = null;
      isInitializing.current = false;
    };
  }, [mounted]);

  useEffect(() => {
    if (kRef.current && isKaplayReady) {
      const targetScene = scene === "game" ? "game_active" : "blank";
      if (kRef.current.getSceneName() !== targetScene) {
        kRef.current.go(targetScene);
      }
    }
  }, [scene, isKaplayReady]);

  if (!mounted) return null;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full bg-black flex items-center justify-center font-sans text-white select-none overflow-hidden"
    >
      <div className="relative w-full h-full max-w-[calc(100vh*4/3)] aspect-4/3 flex items-center justify-center overflow-hidden bg-[#145014]">
        {/* 1. 背景演出 (Canvas) */}
        <div
          ref={containerRef}
          className={`absolute inset-0 z-0 transition-opacity duration-700 ${
            isKaplayReady ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* 2. UIレイヤー (React) */}
        <div className="absolute inset-0 z-10 flex flex-col items-center pointer-events-none">
          {scene === "title" && (
            <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto">
              <h1 className="text-5xl sm:text-7xl font-black mb-12 italic drop-shadow-2xl text-center tracking-tighter text-white">
                PROJECT X
              </h1>
              <button
                onClick={handleStartMission}
                className="px-12 py-5 bg-white text-black text-xl font-black rounded-full hover:scale-110 transition-transform shadow-xl active:scale-95"
              >
                START MISSION
              </button>
            </div>
          )}

          {scene === "menu" && (
            <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto gap-4 w-full max-w-sm px-6">
              <div className="mb-4 flex flex-col items-center gap-2">
                <p className="text-[10px] font-bold tracking-[0.3em] opacity-50 uppercase mb-1 text-yellow-500">
                  Total Balance
                </p>
                <div className="flex items-center gap-3 px-6 py-3 bg-black/40 border-2 border-yellow-500/50 rounded-2xl backdrop-blur-xl">
                  <span className="text-2xl">🪙</span>
                  <span className="text-3xl font-black text-white tabular-nums">
                    {coins.toLocaleString()}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-[0.3em] mb-2 uppercase opacity-60">
                Select Mission
              </h2>
              <div className="grid w-full gap-3">
                {/* ゲーム選択ボタン群（省略なし） */}
                <button
                  onClick={startHighLow}
                  className="w-full py-5 border-4 border-blue-400 bg-blue-900/40 rounded-2xl text-xl font-black hover:bg-blue-600 transition-all"
                >
                  HIGH & LOW
                </button>
                <button
                  onClick={startClash}
                  className="w-full py-5 border-4 border-purple-400 bg-purple-900/40 rounded-2xl text-xl font-black hover:bg-purple-600 transition-all"
                >
                  CARD CLASH
                </button>
                <button
                  onClick={startBj}
                  className="w-full py-5 border-4 border-orange-400 bg-orange-900/40 rounded-2xl text-xl font-black hover:bg-orange-600 transition-all"
                >
                  BLACKJACK 21
                </button>
              </div>
              <button
                onClick={handleExit}
                className="w-full py-3 bg-red-950/40 rounded-xl text-xs font-bold mt-2 border border-red-500/30"
              >
                EXIT TO HOME
              </button>
            </div>
          )}

          {scene === "game" && (
            <div className="w-full h-full pointer-events-auto">
              {activeGame === "highlow" && <HighLowUI onQuit={handleQuit} />}
              {activeGame === "clash" && <ClashUI onQuit={handleQuit} />}
              {activeGame === "bj" && <BjUI onQuit={handleQuit} />}
            </div>
          )}
        </div>

        {/* 3. ★最前面：勝敗演出レイヤー (React + Framer Motion) */}
        <GameOverlayEffect />
      </div>
    </div>
  );
}
