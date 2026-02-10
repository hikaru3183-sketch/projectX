"use client";

export function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      onClick={onReset}
      className="
        px-6 py-3 bg-white/80 text-black font-bold rounded-lg shadow-lg active:scale-95
        z-20 absolute
        top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2
      "
    >
      RESET
    </button>
  );
}
