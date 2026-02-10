"use client";
import { useEffect, useRef, useState } from "react";
import { GameLogic } from "./GameLogic";

export function useHockeyGame() {
  const logicRef = useRef<GameLogic | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const [started, setStarted] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [, setTick] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);

  // SE
  const hitPool = useRef<HTMLAudioElement[]>([]);
  const wallPool = useRef<HTMLAudioElement[]>([]);
  const hitIndex = useRef(0);
  const wallIndex = useRef(0);

  const goalHighSE = useRef<HTMLAudioElement | null>(null);
  const goalLowSE = useRef<HTMLAudioElement | null>(null);

  // BGM
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // 向きチェック
  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 音初期化
  useEffect(() => {
    hitPool.current = Array.from(
      { length: 5 },
      () => new Audio("/sounds/hockey/pim.mp3"),
    );
    wallPool.current = Array.from(
      { length: 5 },
      () => new Audio("/sounds/hockey/pom.mp3"),
    );

    goalHighSE.current = new Audio("/sounds/win.mp3");
    goalLowSE.current = new Audio("/sounds/lose.mp3");
  }, []);

  // BGM
  useEffect(() => {
    const bgm = new Audio("/sounds/.mp3");
    bgm.loop = true;
    bgm.volume = 0.5;
    bgmRef.current = bgm;
    return () => bgm.pause();
  }, []);

  // ゲーム開始
  const startGame = () => {
    const field = fieldRef.current;
    if (!field) return;

    const width = field.clientWidth;
    const height = field.clientHeight;

    logicRef.current = new GameLogic(
      width,
      height,
      4,
      1.0,
      isPortrait,
      (type) => {
        if (type === "high") goalHighSE.current?.play();
        else goalLowSE.current?.play();
        setShowReset(true);
      },
      () => {
        const audio = hitPool.current[hitIndex.current];
        audio.currentTime = 0;
        audio.play();
        hitIndex.current = (hitIndex.current + 1) % hitPool.current.length;
      },
      () => {
        const audio = wallPool.current[wallIndex.current];
        audio.currentTime = 0;
        audio.play();
        wallIndex.current = (wallIndex.current + 1) % wallPool.current.length;
      },
    );

    setStarted(true);

    let frame: number;
    const loop = () => {
      const result = logicRef.current?.update();
      if (result === "reset") setShowReset(true);

      setTick((t) => t + 1);
      frame = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(frame);
  };

  // リセット
  const resetGame = () => {
    const field = fieldRef.current;
    if (!field) return;

    const width = field.clientWidth;
    const height = field.clientHeight;

    const prevMax = logicRef.current?.maxReflectCount ?? 0;

    const newLogic = new GameLogic(
      width,
      height,
      4,
      1.0,
      isPortrait,
      (type) => {
        if (type === "high") goalHighSE.current?.play();
        else goalLowSE.current?.play();
        setShowReset(true);
      },
      () => {
        const audio = hitPool.current[hitIndex.current];
        audio.currentTime = 0;
        audio.play();
        hitIndex.current = (hitIndex.current + 1) % hitPool.current.length;
      },
      () => {
        const audio = wallPool.current[wallIndex.current];
        audio.currentTime = 0;
        audio.play();
        wallIndex.current = (wallIndex.current + 1) % wallPool.current.length;
      },
    );

    newLogic.maxReflectCount = prevMax;
    newLogic.resetRound(true);

    logicRef.current = newLogic;
    setShowReset(false);
    setTick((t) => t + 1);
  };

  // 操作
  const handleMove = (e: React.MouseEvent) => {
    const logic = logicRef.current;
    if (!logic || !fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    const pos = isPortrait ? e.clientX - rect.left : e.clientY - rect.top;
    logic.movePlayer(pos);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const logic = logicRef.current;
    if (!logic || !fieldRef.current) return;
    const touch = e.touches[0];
    const rect = fieldRef.current.getBoundingClientRect();
    const pos = isPortrait
      ? touch.clientX - rect.left
      : touch.clientY - rect.top;
    logic.movePlayer(pos);
  };

  return {
    started,
    showReset,
    logic: logicRef.current,
    fieldRef,
    startGame,
    resetGame,
    handleMove,
    handleTouchMove,
  };
}
