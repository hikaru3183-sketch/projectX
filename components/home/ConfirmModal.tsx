"use client";

export function ConfirmModal({
  type,
  onConfirm,
  onCancel,
}: {
  type: "reset" | "logout";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <p className="text-lg font-bold mb-4">
          {type === "reset" ? "初期化しますか？" : "ログアウトしますか？"}
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded font-bold shadow-[0_4px_0_#7f1d1d] active:shadow-none active:translate-y-1 transition"
          >
            {type === "reset" ? "消去する" : "ログアウト"}
          </button>

          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded font-bold shadow-[0_4px_0_#4b5563] active:shadow-none active:translate-y-1 transition"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
