"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// 共通の枠スタイルをまとめたコンポーネント
const SectionBox = ({ children }: { children: React.ReactNode }) => (
  <section className="w-full max-w-4xl mx-auto space-y-6 p-6 border-2 border-green-200 rounded-xl bg-gray-50">
    {children}
  </section>
);

export default function Home() {
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-none space-y-12 p-6 sm:p-10 border-4 border-green-300 rounded-2xl shadow-2xl bg-white">
          {/* ホーム画面タイトル */}
          <h1 className="text-5xl font-bold text-center text-[#1f1f1f] bg-green-50 px-6 py-6 rounded-md border-2 border-green-300 shadow-[2px_2px_0_0_#90caf9] font-['VT323'] tracking-wide">
            ホーム画面
          </h1>

          {/* ゲーム選択セクション */}
          <SectionBox>
            <h1 className="text-3xl font-extrabold text-center mb-6">
              ゲーム選択
              <hr className="border-t-2 border-gray-800  mx-auto mt-0.5" />{" "}
              <hr className="border-t-2 border-gray-800  mx-auto mt-0.5" />
            </h1>
            <div className="space-y-6">
              <Button
                asChild
                className="text-3xl px-12 py-8 bg-blue-600 text-white font-bold hover:scale-105 transition"
              >
                <Link href="/game/click">クリックゲーム</Link>
              </Button>

              <Button
                asChild
                className="text-3xl px-12 py-8 bg-pink-600 text-white font-bold hover:scale-105 transition"
              >
                <Link href="/game/janken">じゃんけんゲーム</Link>
              </Button>
            </div>
          </SectionBox>

          {/* 各ゲームの遊び方 */}
          <SectionBox>
            <h2 className="text-2xl font-bold text-center">
              📘 各ゲームの遊び方
            </h2>
            <div className="text-left text-gray-700 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-blue-600">
                  ▶ クリックゲーム ◀
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>「クリック」ボタンを押すとコインゲット</li>
                  <li>ガチャでアイテムを入手（1回500コイン）</li>
                  <li>コインを貯めてゲームクリアをめざそう！</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg text-pink-600">
                  ▶ じゃんけんゲーム ◀
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>CPUとじゃんけんで3勝すると勝ち上がります</li>
                  <li>3ステージ勝ち抜くと優勝！</li>
                  <li>必殺技ボタンで1回だけ即勝利できます</li>
                  <li>トーナメント表や演出も楽しんでね！</li>
                </ul>

                <h3 className="font-bold text-lg text-red-600">▶ 共通 ◀</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    スクロールで一番上に行くとホームボタン、テーマ変更ボタン
                  </li>
                  <li>データ消去ボタンでゲーム初期化</li>
                </ul>
              </div>
            </div>
          </SectionBox>

          {/* このゲーム集を作った理由 */}
          <SectionBox>
            <h2 className="text-2xl font-bold text-center">
              🎮 このゲーム集を作った理由
            </h2>
            <p className="text-gray-700 leading-relaxed text-left">
              Next.js の構造理解と TSX
              の習得を目的に、「自分が遊んでいて楽しいもの」をテーマに開発しました。
              UI
              やアニメーション、音の演出まで細かく作り込むことで、触っていて気持ちよい体験を目指しています。
            </p>
            <p className="text-gray-700 leading-relaxed text-left">
              また、Framer Motion や Tailwind CSS
              などの外部ライブラリを積極的に活用し、
              「必要な機能を適切なツールで実装する」という意識も大切にしました。
              ライブラリの特性を理解しながら組み合わせることで、表現力と開発効率の両方を高めることを意識しています。
            </p>
          </SectionBox>

          {/* データ消去ボタン */}
          <div className="flex justify-center">
            <Button
              onClick={() => setShowResetModal(true)}
              className="bg-red-600 text-white font-bold px-4 py-2 rounded-full shadow-md hover:bg-red-700 hover:scale-105 transition"
            >
              データ消去
            </Button>
          </div>

          {/* モーダル */}
          {showResetModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                <p className="text-lg font-bold mb-4">初期化しますかか？</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded font-bold shadow-[0_4px_0_#7f1d1d] active:shadow-none active:translate-y-1 transition"
                  >
                    消去する
                  </button>
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded font-bold shadow-[0_4px_0_#4b5563] active:shadow-none active:translate-y-1 transition"
                  >
                    キャンセル
                  </button>
                </div>
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
