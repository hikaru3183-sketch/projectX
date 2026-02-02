"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

// 共通の枠スタイルをまとめたコンポーネント
const SectionBox = ({ children }: { children: React.ReactNode }) => (
  <section className="w-full max-w-4xl mx-auto space-y-6 p-6 border-2 border-green-200 rounded-xl bg-gray-50">
    {children}
  </section>
);

export default function Home() {
  const router = useRouter();
  const user = auth.currentUser;
  const [modalType, setModalType] = useState<"reset" | "logout" | null>(null);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  return (
    <>
      <main
        className="
    min-h-screen
    w-screen
    flex items-center justify-center
    bg-gray-100
    p-0
    border-x-4 border-gray-300
  "
      >
        <div className="w-full max-w-none space-y-12 p-6 sm:p-10 border-4 border-green-300 rounded-2xl shadow-2xl bg-white">
          {/* ホーム画面タイトル */}

          <div className="relative">
            <h1 className="text-4xl font-bold text-center text-[#1f1f1f] bg-green-50 px-6 py-6 rounded-md border-2 border-green-300 shadow-[2px_2px_0_0_#90caf9] font-['VT323'] tracking-wide">
              ホーム画面
            </h1>
          </div>
          <div className="w-full flex justify-center items-center gap-2">
            <p className="text-sm font-bold text-green-700 px-1">
              {user ? `⭕ : ${user.email}` : "❌ : ログインしていません"}
            </p>
            {!user && (
              <button
                onClick={() => router.push("/login")}
                className="px-2 py-0.5 text-xs bg-green-500 text-white font-bold rounded-md shadow hover:bg-green-600 transition"
              >
                {" "}
                ログイン{" "}
              </button>
            )}{" "}
          </div>
          {/* ゲーム選択セクション */}
          <SectionBox>
            <h1 className="text-3xl font-extrabold text-center mb-6">
              ゲーム選択
              <hr className="border-t-2 border-gray-800 mx-auto mt-0.5" />
              <hr className="border-t-2 border-gray-800 mx-auto mt-0.5" />
            </h1>

            {/* スマホ：2×2 グリッド / PC：横並び */}
            <div
              className="
      grid grid-cols-2 gap-4
      md:flex md:space-x-6 md:gap-0
    "
            >
              <button className="text-1xl px-4 py-6 bg-yellow-500 text-white font-bold rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition transform">
                <Link href="/game/click">クリック</Link>
              </button>

              <button className="text-1xl px-4 py-6 bg-pink-500 text-white font-bold rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition transform">
                <Link href="/game/janken">じゃんけん</Link>
              </button>

              <button className="text-1xl px-4 py-6 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition transform">
                <Link href="/game/hockey">ホッケー</Link>
              </button>

              <button className="text-1xl px-4 py-6 bg-violet-500 text-white font-bold rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition transform">
                <Link href="/game/escape">逃げる</Link>
              </button>

              {/* 空白 or 追加ゲーム用 */}
              <div className="hidden md:block"></div>
            </div>
          </SectionBox>

          {/* 各ゲームの遊び方 */}
          <SectionBox>
            <h2 className="text-2xl font-bold text-center">📘 説明書</h2>
            <div className="text-left text-gray-700 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-yellow-500">
                  ▶ クリック ◀
                </h3>
                <ul className="list-disc">
                  <li>クリックボタンを押すとコインゲット</li>
                  <li>ガチャでアイテムを入手</li>
                  <li>コインを貯めてゲームクリアをめざそう！</li>
                </ul>

                <h3 className="font-bold text-lg text-pink-500">
                  ▶ じゃんけん ◀
                </h3>
                <ul className="list-disc ">
                  <li>CPUとじゃんけんで3勝するとステージ突破！</li>
                  <li>じゃんけん1回で1p獲得、5pで必殺技発動（必勝）！</li>
                  <li>3ステージ勝ち抜くと優勝！</li>
                </ul>

                <h3 className="font-bold text-lg text-blue-500">
                  ▶ ホッケー ◀
                </h3>
                <ul className="list-disc ">
                  <li>ゴールさせないでゴールするんだ</li>
                  <li>1回跳ね返すと1p獲得、5pで必殺技発動（高速ボール）！</li>
                  <li>必殺技はタップで発動！</li>
                </ul>

                <h3 className="font-bold text-lg text-violet-500">
                  ▶ 逃げる ◀
                </h3>
                <ul className="list-disc ">
                  <li>とにかく逃げる</li>
                </ul>

                <h3 className="font-bold text-lg text-red-500">▶ 共通 ◀</h3>
                <ul className="list-disc">
                  <li>スクロールトップでホーム＆テーマボタン表示</li>
                  <li>データ消去ボタンでゲーム初期化</li>
                  <li>ホッケー＆逃げるゲームはヘッダーなし</li>
                </ul>
              </div>
            </div>
          </SectionBox>

          {/* このゲーム集を作った理由 */}
          <SectionBox>
            <h2 className="text-2xl font-bold text-center">🎮 制作理由</h2>
            <p className="text-gray-700 leading-relaxed text-left">
              Next.js の構造理解と TSX
              の習得を目的に、「自分が遊んでいて楽しいもの」をテーマに開発しました。
              UIやアニメーション、音の演出まで細かく作り込むことで、触っていて気持ちよい体験を目指しています。
            </p>
            <p className="text-gray-700 leading-relaxed text-left">
              また、Framer Motion や Tailwind CSS
              などの外部ライブラリを積極的に活用し、「必要な機能を適切なツールで実装する」という意識も大切にしました。
              ライブラリの特性を理解しながら組み合わせることで、表現力と開発効率の両方を高めることを意識しています。
            </p>
          </SectionBox>

          <div className="flex justify-between items-center w-full">
            {/* 左側の空白（中央寄せのために必要） */}
            <div className="w-1/3"></div>

            {/* データ消去（中央） */}
            <div className="w-1/3 flex justify-center">
              <button
                onClick={() => setModalType("reset")}
                className="bg-red-500 text-white font-bold px-2 py-2 rounded-full shadow-md hover:bg-red-700 hover:scale-105 transition"
              >
                データ消去
              </button>
            </div>

            {/* ログアウト（右） */}
            <div className="w-1/3 flex justify-end">
              {user && (
                <button
                  onClick={() => setModalType("logout")}
                  className="bg-red-500 text-white font-bold px-2 py-2 rounded-full shadow-md hover:bg-gray-600 hover:scale-105 transition"
                >
                  ログアウト
                </button>
              )}
            </div>
          </div>

          {/* モーダル */}
          {modalType && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                {/* タイトル */}
                <p className="text-lg font-bold mb-4">
                  {modalType === "reset"
                    ? "初期化しますか？"
                    : "ログアウトしますか？"}
                </p>

                <div className="flex gap-4 justify-center">
                  {/* 赤い実行ボタン */}
                  <button
                    onClick={async () => {
                      if (modalType === "reset") {
                        localStorage.clear();
                        window.location.reload();
                      } else if (modalType === "logout") {
                        await auth.signOut();
                        setModalType(null); // ← 元のモーダルを閉じる
                        setLogoutSuccess(true); // ← 成功ポップアップを表示
                        router.refresh();
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded font-bold shadow-[0_4px_0_#7f1d1d] active:shadow-none active:translate-y-1 transition"
                  >
                    {modalType === "reset" ? "消去する" : "ログアウト"}
                  </button>

                  {/* キャンセル */}
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 bg-gray-300 rounded font-bold shadow-[0_4px_0_#4b5563] active:shadow-none active:translate-y-1 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}
          {logoutSuccess && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                <p className="text-lg font-bold mb-4">ログアウトしました</p>

                <button
                  onClick={() => setLogoutSuccess(false)}
                  className="px-4 py-2 bg-green-500 text-white rounded font-bold shadow-[0_4px_0_#166534] active:shadow-none active:translate-y-1 transition"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="w-full text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} hikaru3183-sketch. Released under the MIT
        License.
      </footer>
    </>
  );
}
