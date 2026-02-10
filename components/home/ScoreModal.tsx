"use client";

export function ScoreModal({
  scores,
  onClose,
}: {
  scores: any[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center space-y-4">
        <h2 className="text-xl font-bold text-green-700">スコア一覧</h2>

        {scores.length === 0 && (
          <p className="text-gray-500 text-sm">スコアがありません</p>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {scores.map((s) => (
            <div
              key={s.id}
              className="p-2 border rounded-lg bg-gray-50 text-left"
            >
              <p className="font-bold">{s.game}</p>
              <p className="text-sm text-gray-600">スコア: {s.value}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-300 rounded font-bold shadow hover:bg-gray-400 transition"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
