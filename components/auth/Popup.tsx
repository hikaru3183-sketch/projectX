"use client";

type Props = {
  type: "success" | "error" | "duplicate";
  message: string;
  color: string;
  onClose: () => void;
};

export function Popup({ type, message, color, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div
        className={`bg-white p-6 rounded-xl shadow-xl text-center border-2 border-${color}-400`}
      >
        <p className={`text-xl font-bold text-${color}-600 mb-4`}>{message}</p>
        <button
          onClick={onClose}
          className={`px-4 py-2 bg-${color}-500 text-white rounded font-bold shadow hover:bg-${color}-600 transition`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
