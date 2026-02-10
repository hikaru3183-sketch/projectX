export function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <button
        onClick={onReset}
        className="px-6 py-3 bg-yellow-300 text-black font-bold rounded-lg shadow-lg active:scale-95 -mt-6"
      >
        GAME RESET
      </button>
    </div>
  );
}
