"use client";

import { useState, useEffect, useRef } from "react";

export function useJankenGame() {
  const hands = ["✊", "✌️", "🖐️"];

  const [skillPoints, setSkillPoints] = useState(0);
  const [playerWin, setPlayerWin] = useState(0);
  const [cpuWin, setCpuWin] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const [resultText, setResultText] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [resultState, setResultState] = useState<"none" | "win" | "lose">(
    "none",
  );

  const [showBracketModal, setShowBracketModal] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const [endMessage, setEndMessage] = useState("");

  const [isAnimating, setIsAnimating] = useState(false);
  const [winner, setWinner] = useState<"player" | "cpu" | "draw" | null>(null);

  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const playBGM = () => {
    if (!bgmRef.current) {
      const bgm = new Audio("/sounds/click/clickbgm.mp3");
      bgm.loop = true;
      bgm.volume = 0.5;
      bgmRef.current = bgm;
    }
    bgmRef.current.currentTime = 0;
    bgmRef.current.play().catch(() => {});
  };

  useEffect(() => {
    playBGM();
    return () => bgmRef.current?.pause();
  }, []);

  const judge = (p: string, c: string) => {
    if (p === c) return "あいこ";
    if (
      (p === "✊" && c === "✌️") ||
      (p === "✌️" && c === "🖐️") ||
      (p === "🖐️" && c === "✊")
    )
      return "勝ち";
    return "負け";
  };

  const play = (player: string) => {
    if (showBracketModal || resultState !== "none") return;

    const cpu = hands[Math.floor(Math.random() * 3)];
    const result = judge(player, cpu);

    setResultText(`${player} ${result} ${cpu}`);

    if (result === "勝ち") setWinner("player");
    else if (result === "負け") setWinner("cpu");
    else setWinner("draw");

    setSkillPoints((prev) => prev + 1);
  };

  const useSkill = () => {
    if (showBracketModal || resultState !== "none") return;

    if (skillPoints < 5) {
      setResultText("スキルポイントが足りません！");
      return;
    }

    setSkillPoints((prev) => prev - 5);
    setResultText(`必殺技!! 勝ち！_${Date.now()}`);
    setScrambled("必殺技!! 勝ち！");
    setWinner("player");
  };

  const resetForNextMatch = () => {
    setPlayerWin(0);
    setCpuWin(0);
    setResultText("");
  };

  const resetAll = () => {
    setPlayerWin(0);
    setCpuWin(0);
    setCurrentStage(0);
    setResultText("");
    setEndMessage("");
    setResultState("none");
    playBGM();
  };

  const onFinalStageEnter = () => {
    const audio = new Audio("/sounds/clear.mp3");
    audio.volume = 0.8;
    audio.play();
  };

  return {
    hands,
    skillPoints,
    playerWin,
    cpuWin,
    currentStage,
    resultText,
    scrambled,
    resultState,
    showBracketModal,
    showClear,
    endMessage,
    isAnimating,
    winner,

    play,
    useSkill,
    resetForNextMatch,
    resetAll,
    onFinalStageEnter,

    setScrambled,
    setPlayerWin,
    setCpuWin,
    setShowBracketModal,
    setCurrentStage,
    setShowClear,
    setEndMessage,
    setResultState,
    setIsAnimating,
  };
}
