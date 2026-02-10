"use client";

type Props = {
  skillPoints: number;
  useSkill: () => void;
  isAnimating: boolean;
};

export function SkillButton({ skillPoints, useSkill, isAnimating }: Props) {
  return (
    <div className="flex justify-center items-center gap-10 mt-4">
      <button
        onClick={() => {
          new Audio("/sounds/janken/vvv.mp3").play();
          useSkill();
        }}
        disabled={skillPoints < 5 || isAnimating}
        className={`px-6 py-3 rounded-xl font-bold border-4 transition
          ${
            skillPoints < 5 || isAnimating
              ? "bg-gray-400 border-gray-500 text-gray-700"
              : "bg-yellow-300 border-yellow-500 text-black hover:scale-105"
          }
        `}
      >
        必殺技
        <p>スキルポイント: {skillPoints}</p>
      </button>
    </div>
  );
}
