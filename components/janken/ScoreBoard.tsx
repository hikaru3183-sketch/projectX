"use client";

type Props = {
  playerWin: number;
  cpuWin: number;
};

export function ScoreBoard({ playerWin, cpuWin }: Props) {
  return (
    <div className="flex justify-between px-2 mb-4">
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
  );
}
