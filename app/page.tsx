"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// デザイン・コンポーネント
import { GameIsland } from "@/components/home/GameIsland";
import { OceanBackground } from "@/components/home/OceanBackground";
import { ScoreModal } from "@/components/home/ScoreModal";
import { LogoutSuccessModal } from "@/components/home/LogoutSuccessModal";
import { DeleteAccountSuccessModal } from "@/components/home/DeleteAccountSuccessModal";
import { AvatarButton } from "@/components/home/AvatarButton";
import { UserMenu } from "@/components/home/UserMenu";
import { AvatarModal } from "@/components/home/AvatarModal";
import { ConfirmModal } from "@/components/home/ConfirmModal";

// アイコン
import { Hand, Gamepad2, Target, Zap, Dice1, LogIn } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<
    "reset" | "logout" | "menu" | "avatar" | "deleteAccount" | null
  >(null);

  const router = useRouter();

  // 1. データのフェッチ
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        const [userRes, scoreRes] = await Promise.all([
          fetch("/api/me"),
          fetch("/api/score"),
        ]);
        const userData = await userRes.json();
        if (isMounted) {
          setUser(userData.user);
          if (scoreRes.ok) setScores(await scoreRes.json());
        }
      } catch (e) {
        console.error("取得失敗:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- 修正箇所: 足りなかったハンドラー関数を追加 ---
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        setModalType(null);
        setLogoutSuccess(true);
        router.refresh();
      }
    } catch (err) {
      console.error("ログアウト失敗:", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/delete-account", { method: "POST" });
      if (res.ok) {
        setUser(null);
        setModalType(null);
        setDeleteSuccess(true);
      }
    } catch (err) {
      console.error("アカウント削除失敗:", err);
    }
  };
  // ----------------------------------------------

  const games = useMemo(
    () => [
      {
        key: "click",
        label: "クリック島",
        href: "/game/click",
        color: "bg-gradient-to-br from-yellow-400 to-orange-500",
        desc: "押して、当てて、貯めて。",
        icon: <Hand className="w-10 h-10" />,
      },
      {
        key: "janken",
        label: "ジャンケン島",
        href: "/game/janken",
        color: "bg-gradient-to-br from-pink-400 to-red-500",
        desc: "勝ち進んで、優勝。",
        icon: <Gamepad2 className="w-10 h-10" />,
      },
      {
        key: "hockey",
        label: "ホッケー島",
        href: "/game/hockey",
        color: "bg-gradient-to-br from-indigo-400 to-cyan-500",
        desc: "自分を超えろ。",
        icon: <Target className="w-10 h-10" />,
      },
      {
        key: "escape",
        label: "エスケープ島",
        href: "/game/escape",
        color: "bg-gradient-to-br from-violet-400 to-purple-500",
        desc: "集めて逃げろ。",
        icon: <Zap className="w-10 h-10" />,
      },
      {
        key: "casino",
        label: "カジノ島",
        href: "/game/x",
        color: "bg-gradient-to-br from-gray-500 to-zinc-700",
        desc: "運も実力、ギャンブル。",
        icon: <Dice1 className="w-10 h-10" />,
      },
    ],
    [],
  );

  return (
    <main className="fixed inset-0 w-full h-dvh bg-[#080812] overflow-hidden touch-none flex flex-col">
      {/* 背景を最背面に固定 */}
      <div className="absolute inset-0 -z-10">
        <OceanBackground />
      </div>

      {/* モーダル群 (変更なし) */}
      {logoutSuccess && (
        <LogoutSuccessModal onClose={() => setLogoutSuccess(false)} />
      )}
      {deleteSuccess && (
        <DeleteAccountSuccessModal
          onClose={() => {
            setDeleteSuccess(false);
            router.push("/");
          }}
        />
      )}
      {modalType === "menu" && (
        <ScoreModal scores={scores} onClose={() => setModalType(null)} />
      )}
      <AvatarModal
        open={modalType === "avatar"}
        user={user}
        onClose={() => setModalType(null)}
        onSave={async (newAvatar: any) => {
          await fetch("/api/avatar", {
            method: "POST",
            body: JSON.stringify(newAvatar),
          });
          const res = await fetch("/api/me");
          const data = await res.json();
          setUser(data.user);
          setModalType(null);
        }}
      />
      {["logout", "deleteAccount"].includes(modalType ?? "") && (
        <ConfirmModal
          type={modalType as any}
          onConfirm={() => {
            if (modalType === "logout") handleLogout();
            if (modalType === "deleteAccount") handleDeleteAccount();
          }}
          onCancel={() => setModalType(null)}
        />
      )}

      {/* メインスクロール領域 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* タイトルエリア：ボタンとテキストを横に並べる */}
          <div className="flex items-center justify-center gap-4 pt-24 pb-12">
            {/* ログイン・メニューボタン（タイトルの左に配置） */}
            <div className="shrink-0">
              {user ? (
                <AvatarButton
                  user={user}
                  onClick={() => setMenuOpen(!menuOpen)}
                />
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="
                    p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg font-bold 
                    flex items-center justify-center w-14 h-14 transition-transform active:scale-95 
                    border-2 border-white/50 text-blue-600
                  "
                >
                  <LogIn className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* ホーム画面テキスト */}
            <p className="text-white text-4xl sm:text-5xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] m-0">
              ホーム画面
            </p>
          </div>

          {/* ゲームの島々 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10 justify-items-center">
            {games.map(({ key, ...game }, index) => (
              <GameIsland key={key} {...game} delay={index} />
            ))}
          </div>
        </div>
      </div>
      {/* ユーザーメニュー */}
      <UserMenu
        open={menuOpen}
        user={user}
        onClose={() => setMenuOpen(false)}
        onOpenAvatar={() => {
          setModalType("avatar");
          setMenuOpen(false);
        }}
        onOpenScore={() => {
          setModalType("menu");
          setMenuOpen(false);
        }}
        onOpenBoard={() => {
          router.push("/board");
          setMenuOpen(false);
        }}
        onOpenLogout={() => {
          setModalType("logout");
          setMenuOpen(false);
        }}
      />

      {/* フッター */}
      <footer className="absolute bottom-4 left-0 right-0 z-10 text-center text-white/40 text-xs pointer-events-none">
        © {new Date().getFullYear()} HiNaTaKu-Px.
      </footer>
    </main>
  );
}
