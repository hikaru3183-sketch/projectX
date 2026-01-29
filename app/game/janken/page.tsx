"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BracketUI from "./BracketUI";
import { ClearAnimation } from "@/components/animation/ClearAnimation";

const hands = ["✊", "✌️", "🖐️"];

export default function JankenPage() {
  const router = useRouter();

  const [playerWin, setPlayerWin] = useState(0);
  const [cpuWin, setCpuWin] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const [resultText, setResultText] = useState("");
  const [scrambled, setScrambled] = useState("");

  const [skillUsed, setSkillUsed] = useState(false);

  const [showBracketModal, setShowBracketModal] = useState(false);

  const [resultState, setResultState] = useState<"none" | "win" | "lose">(
    "none",
  );

  const [endMessage, setEndMessage] = useState("");

  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const [showClear, setShowClear] = useState(false);
  const stageLabels = ["初戦", "準決", "決勝", "🙌"];
  const stageBackgrounds = [
    "from-blue-900 to-black",
    "from-purple-900 to-black",
    "from-red-900 to-black",
    "from-yellow-600 to-black",
  ];

  const [isAnimating, setIsAnimating] = useState(false);

  // ★ 勝敗を保存するだけ（星は増やさない）
  const [winner, setWinner] = useState<"player" | "cpu" | "draw" | null>(null);

  // BGM 再生（ゲーム中）
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

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
    };
  }, []);

  // ★ 勝ち/負け画面に入ったら BGM を止める
  useEffect(() => {
    if (resultState !== "none") {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }
    }
  }, [resultState]);

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

    // ★ 勝敗は保存するだけ（星は増やさない）
    if (result === "勝ち") setWinner("player");
    else if (result === "負け") setWinner("cpu");
    else setWinner("draw");
  };

  const useSkill = () => {
    if (showBracketModal || resultState !== "none") return;

    setResultText("必殺技!! 勝ち！");
    setWinner("player"); // ★ 勝ち扱い
  };

  // ★ じゃん…けん…ぽん！演出
  useEffect(() => {
    if (!resultText) return;

    setIsAnimating(true);

    setScrambled("じゃん…");

    const t1 = setTimeout(() => {
      const kenSE = new Audio("/sounds/janken/pon.mp3");
      kenSE.volume = 1.0;
      kenSE.play();
      setScrambled("けん…");
    }, 500);

    const t2 = setTimeout(() => {
      const ponSE = new Audio("/sounds/janken/pon.mp3");
      ponSE.volume = 1.0;
      ponSE.play();
      setScrambled(resultText); // ぽん！

      // ★ ここで初めて星を増やす
      if (winner === "player") setPlayerWin((prev) => prev + 1);
      if (winner === "cpu") setCpuWin((prev) => prev + 1);

      setIsAnimating(false); // ← ここから他の処理が動く
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [resultText]);

  // ★ トーナメント進行（ぽん！の後だけ動く）
  useEffect(() => {
    if (isAnimating) return;

    if (playerWin === 3) {
      setShowBracketModal(true);
      setCurrentStage((prev) => prev + 1);

      setTimeout(() => {
        setShowBracketModal(false);
        resetForNextMatch();
      }, 1800);
    }
  }, [playerWin, isAnimating]);

  // ★ 優勝処理（ぽん！の後だけ動く）
  useEffect(() => {
    if (isAnimating) return;

    if (currentStage === 3) {
      setTimeout(() => {
        setShowClear(true);

        setEndMessage("🎉 優勝おめでとう！ 🎉");
        setResultState("win");

        const audio = new Audio("/sounds/win.mp3");
        audio.volume = 0.8;
        audio.play();
      }, 2000);
    }
  }, [currentStage, isAnimating]);

  // ★ CPU勝利（ぽん！の後だけ動く）
  useEffect(() => {
    if (isAnimating) return;

    if (cpuWin === 3) {
      setEndMessage("CPUの勝ち…");
      setResultState("lose");
    }
  }, [cpuWin, isAnimating]);

  const resetForNextMatch = () => {
    setPlayerWin(0);
    setCpuWin(0);
    setResultText("");
    setSkillUsed(false);
  };

  const resetAll = () => {
    setPlayerWin(0);
    setCpuWin(0);
    setCurrentStage(0);
    setResultText("");
    setSkillUsed(false);
    setEndMessage("");
    setResultState("none");
    playBGM();
  };

  return (
    <div className="relative">
      {/* ★ トーナメントモーダル */}
      <BracketUI show={showBracketModal} currentStage={currentStage} />

      {/* ★ じゃんけん画面 */}
      <main
        className={`mt-4 w-full p-6 border-4 border-pink-300 rounded-2xl 
    bg-gradient-to-b ${stageBackgrounds[currentStage]} 
    text-white font-mono min-h-[450px] ${
      resultState !== "none" ? "pointer-events-none" : ""
    }`}
      >
        <h1 className="text-3xl font-bold text-center mb-4">
          じゃんけんゲーム
        </h1>

        <div className="text-center mb-4 text-lg font-bold">
          <p className="text-3xl mb-4">🤛{stageLabels[currentStage]}🤜</p>

          <div className="flex justify-between px-2">
            <div className="flex">
              <span className="text-xl">あなた:</span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="text-yellow-300 text-2xl">
                  {i < playerWin ? "★" : "☆"}
                </span>
              ))}
            </div>

            <div className="flex">
              <span className="text-xl">CPU:</span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="text-yellow-300 text-2xl">
                  {i < cpuWin ? "★" : "☆"}
                </span>
              ))}
            </div>
          </div>

          <p className="text-center text-xl mb-4 h-8 flex items-center justify-center">
            {scrambled}
          </p>

          <div className="flex gap-5 justify-center">
            {hands.map((h) => (
              <button
                onClick={() => {
                  new Audio("/sounds/janken/pon.mp3").play();
                  play(h);
                }}
                className="text-6xl p-3 rounded-full bg-gray-800 border-2 border-pink-500 hover:scale-125 transition"
              >
                {h}
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center gap-10 mt-6 mb-6">
            <button
              onClick={useSkill}
              disabled={skillUsed}
              className="px-6 py-3 rounded-xl font-bold bg-yellow-300 border-4 border-yellow-500 text-black hover:scale-105 transition"
            >
              必殺技
            </button>
          </div>
        </div>
      </main>

      {/* ★ 勝ち/負け演出（共通） */}
      {resultState !== "none" && (
        <div className="absolute inset-0 pointer-events-auto">
          <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6">
            {resultState === "win" && showClear && <ClearAnimation />}

            <p className="text-3xl font-bold text-white drop-shadow mb-4">
              {endMessage}
            </p>

            <div className="flex flex-row gap-6">
              {resultState === "win" && (
                <button
                  onClick={() => router.push("/")}
                  className="px-7 py-3 bg-green-400 rounded-xl font-bold hover:scale-105 transition"
                >
                  ホーム
                </button>
              )}

              {resultState === "lose" && (
                <button
                  onClick={resetAll}
                  className="px-6 py-3 bg-pink-300 rounded-xl font-bold text-black hover:scale-105 transition"
                >
                  リセット
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
