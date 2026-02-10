"use client";

import { useRouter } from "next/navigation";
import { useJankenGame } from "@/lib/game/janken/useJankenGame";

import { BracketUI } from "@/components/janken/BracketUI";
import { StageHeader } from "@/components/janken/StageHeader";
import { ScoreBoard } from "@/components/janken/ScoreBoard";
import { HandButtons } from "@/components/janken/HandButtons";
import { SkillButton } from "@/components/janken/SkillButton";
import { ResultModal } from "@/components/janken/ResultModal";

export default function JankenPage() {
  const router = useRouter();
  const game = useJankenGame();

  return (
    <div className="relative">
      {/* ステージ演出 */}
      <BracketUI
        show={game.showBracketModal}
        currentStage={game.currentStage}
        onFinalStageEnter={game.onFinalStageEnter}
      />

      <main
        className={`
          w-full min-h-[100dvh] p-6 border-4 border-pink-300 rounded-2xl 
          bg-gradient-to-b from-black to-gray-900
          text-white font-mono pt-[32px]
          flex flex-col justify-center items-center
          ${game.resultState !== "none" ? "pointer-events-none" : ""}
        `}
      >
        {/* ステージ名 */}
        <StageHeader currentStage={game.currentStage} />

        {/* スコア */}
        <ScoreBoard playerWin={game.playerWin} cpuWin={game.cpuWin} />

        {/* 結果テキスト（じゃん…けん…ぽん！） */}
        <p className="text-center text-xl h-8 flex items-center justify-center">
          {game.scrambled.replace(/_.+$/, "")}
        </p>

        {/* じゃんけんボタン */}
        <HandButtons
          hands={game.hands}
          play={game.play}
          isAnimating={game.isAnimating}
        />

        {/* 必殺技ボタン */}
        <SkillButton
          skillPoints={game.skillPoints}
          useSkill={game.useSkill}
          isAnimating={game.isAnimating}
        />
      </main>

      {/* 勝敗モーダル */}
      <ResultModal
        resultState={game.resultState}
        showClear={game.showClear}
        endMessage={game.endMessage}
        onHome={() => router.push("/")}
        onReset={game.resetAll}
      />
    </div>
  );
}
