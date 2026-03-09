"use client";

import { useRouter } from "next/navigation";
import {
  X,
  User,
  Trophy,
  MessageSquare,
  BarChart3,
  LogOut,
} from "lucide-react";

export function UserMenu({
  open,
  user,
  onClose,
  onOpenAvatar,
  onOpenScore,
  onOpenBoard,
  onOpenLogout,
}: {
  open: boolean;
  user: any;
  onClose: () => void;
  onOpenAvatar: () => void;
  onOpenScore: () => void;
  onOpenBoard: () => void;
  onOpenLogout: () => void;
}) {
  const router = useRouter();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* 背景：超ぼかし（ここをタップしても閉じれる） */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* メニューカード本体 */}
      <div className="relative w-full max-w-sm mx-4 bg-white rounded-[3rem] shadow-2xl p-8 flex flex-col items-center animate-in zoom-in slide-in-from-top-10 duration-500">
        {/* ★ 右上のバツボタン（カードの内側に配置） */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded-full transition-all active:scale-90"
        >
          <X className="w-6 h-6" />
        </button>

        {/* --- 巨大アバター表示エリア --- */}
        {user && (
          <div className="flex flex-col items-center gap-4 mb-8">
            <div
              className="w-32 h-32 rounded-[2.5rem] flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-gray-50 to-gray-200"
              style={{ backgroundColor: user.avatar?.bg ?? "#ccc" }}
            >
              {user.avatar?.mode === "image" ? (
                <img
                  src={`/avatars/${user.avatar.image}.png`}
                  className="w-full h-full object-cover"
                  alt="menu-avatar"
                />
              ) : (
                <svg width="90" height="90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="30"
                    r="20"
                    fill={user.avatar?.hair ?? "#000"}
                  />
                  <rect
                    x="30"
                    y="50"
                    width="40"
                    height="40"
                    fill={user.avatar?.clothes ?? "#fff"}
                  />
                </svg>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-gray-800 tracking-tighter">
                {user.email?.split("@")[0]}
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                Player Status
              </p>
            </div>
          </div>
        )}

        {/* --- 操作ボタン群 --- */}
        <div className="grid grid-cols-1 gap-3 w-full">
          <button
            onClick={() => {
              onOpenAvatar();
              onClose();
            }}
            className="flex items-center gap-4 w-full bg-green-500 text-white p-4 rounded-2xl font-black shadow-[0_4px_0_#16a34a] active:translate-y-1 active:shadow-none transition-all"
          >
            <User className="w-6 h-6" />
            <span>アバター設定</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onOpenScore();
                onClose();
              }}
              className="flex flex-col items-center justify-center gap-2 bg-blue-500 text-white p-4 rounded-2xl font-black shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">スコア</span>
            </button>
            <button
              onClick={() => {
                onOpenBoard();
                onClose();
              }}
              className="flex flex-col items-center justify-center gap-2 bg-indigo-500 text-white p-4 rounded-2xl font-black shadow-[0_4px_0_#4338ca] active:translate-y-1 active:shadow-none transition-all"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">掲示板</span>
            </button>
          </div>

          <button
            onClick={() => {
              router.push("/ranking");
              onClose();
            }}
            className="flex items-center gap-4 w-full bg-amber-500 text-white p-4 rounded-2xl font-black shadow-[0_4px_0_#d97706] active:translate-y-1 active:shadow-none transition-all"
          >
            <Trophy className="w-6 h-6" />
            <span>ランキング</span>
          </button>

          {user && (
            <button
              onClick={() => {
                onOpenLogout();
                onClose();
              }}
              className="flex items-center justify-center gap-2 w-full mt-4 p-3 text-red-400 font-bold hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">ログアウト</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
