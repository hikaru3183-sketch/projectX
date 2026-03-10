"use client";

export function LogoutSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <p className="text-lg font-bold mb-4">ログアウトしました</p>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-500 text-white rounded font-bold shadow-[0_4px_0_#166534] active:shadow-none active:translate-y-1 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}
