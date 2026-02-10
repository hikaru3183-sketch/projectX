"use client";

type Props = {
  hands: string[];
  play: (hand: string) => void;
  isAnimating: boolean;
};

export function HandButtons({ hands, play, isAnimating }: Props) {
  return (
    <div className="flex gap-5 justify-center mt-4">
      {hands.map((h) => (
        <button
          key={h}
          disabled={isAnimating}
          onClick={() => {
            new Audio("/sounds/janken/pon.mp3").play();
            play(h);
          }}
          className={`text-6xl p-3 rounded-full border-2 transition
            ${
              isAnimating
                ? "bg-gray-600 border-gray-400 opacity-50 cursor-not-allowed"
                : "bg-gray-800 border-pink-500 hover:scale-125"
            }
          `}
        >
          {h}
        </button>
      ))}
    </div>
  );
}
