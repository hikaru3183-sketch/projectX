"use client";

export function ClickButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        px-20 py-25 bg-yellow-500 text-white text-6xl rounded-xl
        shadow-[4px_4px_0_#d97706]
        hover:translate-y-1 hover:shadow-[2px_2px_0_#d97706]
        active:translate-y-2 active:shadow-[0px_0px_0_#d97706]
        transition mb-4
      "
    >
      クリック
    </button>
  );
}
