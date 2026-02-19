"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { SectionBox } from "@/components/home/SectionBox";
import { ScoreModal } from "@/components/home/ScoreModal";
import { ConfirmModal } from "@/components/home/ConfirmModal";
import { LogoutSuccessModal } from "@/components/home/LogoutSuccessModal";
import { GameCard } from "@/components/home/GameCard";
import { UserStatusBar } from "@/components/home/UserStatusBar";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [modalType, setModalType] = useState<
    "reset" | "logout" | "menu" | null
  >(null);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [scores, setScores] = useState<any[]>([]);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ★ APIを叩く方式のログアウト処理
  const handleLogout = async () => {
    try {
      // 1. APIルートを叩いてサーバー側のセッションを消す
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        // 2. ローカルの情報をクリア
        localStorage.removeItem("user");
        setUser(null);
        setModalType(null);
        setLogoutSuccess(true);

        // 3. 画面を最新状態にする
        router.refresh();
      }
    } catch (err) {
      console.error("ログアウト失敗:", err);
    }
  };
  const games = [
    {
      key: "click",
      label: "クリック",
      href: "/game/click",
      color: "bg-yellow-500",
      desc: "押して、当てて、貯めて。",
    },
    {
      key: "janken",
      label: "ジャンケン",
      href: "/game/janken",
      color: "bg-pink-500",
      desc: "勝ち進んで、優勝。",
    },
    {
      key: "hockey",
      label: "ホッケー",
      href: "/game/hockey",
      color: "bg-indigo-500",
      desc: "自分を超えろ。",
    },
    {
      key: "escape",
      label: "エスケープ",
      href: "/game/escape",
      color: "bg-violet-500",
      desc: "集めて逃げろ。",
    },
    {
      key: "x",
      label: "開発中",
      href: "/game/x",
      color: "bg-gray-500",
      desc: "待っててね。",
    },
  ];

  return (
    <>
      {user && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="fixed mt-1  left-1 z-50 bg-gray-800 text-white px-3 py-2 rounded-lg shadow font-bold hover:bg-gray-700 "
        >
          ☰
        </button>
      )}

      {menuOpen && (
        <div className="fixed top-14 left-1 z-50 bg-white border shadow-lg rounded-lg p-2 w-40">
          <div className="flex flex-col gap-2">
            {user && (
              <p className="text-xl font-bold text-center text-green-700 px-2 py-1 border-b">
                {user.email}
              </p>
            )}
            <button
              onClick={() => {
                setModalType("menu");
                setMenuOpen(false);
              }}
              className="w-full block bg-green-500 text-white px-3 py-2 rounded-md font-bold hover:bg-green-600"
            >
              スコア
            </button>

            <button
              onClick={() => {
                router.push("/board");
                setMenuOpen(false);
              }}
              className="w-full block bg-green-500 text-white px-3 py-2 rounded-md font-bold hover:bg-green-600"
            >
              掲示板
            </button>

            {user && (
              <button
                onClick={() => {
                  setModalType("logout");
                  setMenuOpen(false);
                }}
                className="w-full block bg-red-500 text-white px-3 py-2 rounded-md font-bold hover:bg-red-600"
              >
                ログアウト
              </button>
            )}
          </div>
        </div>
      )}
      {modalType === "reset" && (
        <ConfirmModal
          type="reset"
          onConfirm={() => {
            localStorage.clear();
            window.location.reload();
          }}
          onCancel={() => setModalType(null)}
        />
      )}

      {modalType === "logout" && (
        <ConfirmModal
          type="logout"
          onConfirm={handleLogout} // ここで handleLogout を呼ぶ
          onCancel={() => setModalType(null)}
        />
      )}

      {logoutSuccess && (
        <LogoutSuccessModal onClose={() => setLogoutSuccess(false)} />
      )}
      <main className="min-h-dvh w-full overflow-x-hidden flex items-center justify-center bg-gray-100">
        <div className="w-full p-2 border-4 border-green-300 rounded-2xl shadow-2xl bg-white space-y-2">
          {modalType === "menu" && (
            <ScoreModal scores={scores} onClose={() => setModalType(null)} />
          )}

          <div className="relative w-full ">
            {/* 左側に固定配置 */}
            <div className="absolute left-2 ">
              <UserStatusBar user={user} />
            </div>

            {/* 中央タイトル */}
            <h1 className="text-5xl font-bold text-center mt-2 rounded-md">
              ホーム
            </h1>
          </div>

          <SectionBox>
            <h1 className="text-3xl font-extrabold text-center mb-2">
              ゲーム選択
              <hr className="border-t-2 border-gray-800 mx-auto mt-0.5" />
              <hr className="border-t-2 border-gray-800 mx-auto mt-0.5" />
            </h1>

            <div className="flex flex-col gap-2">
              {games.map(({ key, ...rest }) => (
                <GameCard key={key} {...rest} />
              ))}

              <div className="flex flex-col gap-2 p-4 border rounded-xl bg-white shadow">
                <div className="text-lg font-bold text-gray-700">共通</div>

                <p className="text-sm text-gray-700">
                  ▶ データ消去ボタンでゲーム初期化
                </p>

                <button
                  onClick={() => setModalType("reset")}
                  className="px-3 py-2 bg-red-500 text-white font-bold rounded-md shadow hover:bg-red-700 transition"
                >
                  データ消去
                </button>
              </div>
            </div>
          </SectionBox>
        </div>
      </main>
      <footer className="w-full text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} HiNaTaKu-Px. Released under the MIT
        License.
      </footer>
    </>
  );
}
