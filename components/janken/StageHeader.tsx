"use client";

type Props = {
  currentStage: number;
};

const stageLabels = ["初戦", "準決", "決勝", "🙌"];

export function StageHeader({ currentStage }: Props) {
  return (
    <p className="text-3xl mb-2 text-center font-bold">
      🤛{stageLabels[currentStage]}🤜
    </p>
  );
}
