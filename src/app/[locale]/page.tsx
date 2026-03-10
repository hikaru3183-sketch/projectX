"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// ★ Better Auth のクライアントをインポート
import { authClient } from "@/lib/auth/auth-client";

import { GameIsland } from "@/components/home/GameIsland";
import { OceanBackground } from "@/components/home/OceanBackground";
import { ScoreModal } from "@/components/home/ScoreModal";
import { LogoutSuccessModal } from "@/components/home/LogoutSuccessModal";
import { AvatarButton } from "@/components/home/AvatarButton";
import { UserMenu } from "@/components/home/UserMenu";
import { AvatarModal } from "@/components/home/AvatarModal";
import { ConfirmModal } from "@/components/home/ConfirmModal";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Hand, Gamepad2, Target, Zap, Dice1, LogIn } from "lucide-react";

export default function Home() {
  const t = useTranslations("Home");
  const router = useRouter();

  // 1. Better Auth でログイン状態を監視
  // session があればログイン中、null なら未ログイン、isPending は読み込み中
  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const user = session?.user; 

  const [scores, setScores] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [modalType, setModalType] = useState<"menu" | "avatar" | "logout" | null>(null);

  // 2. ログアウト処理の修正
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setModalType(null);
          setLogoutSuccess(true);
          router.refresh();
        },
      },
    });
  };

  const games = useMemo(() => [
    { key: "click", label: t("games.click.label"), href: "/game/click", color: "bg-gradient-to-br from-yellow-400 to-orange-500", desc: t("games.click.desc"), icon: <Hand className="w-10 h-10" /> },
    { key: "janken", label: t("games.janken.label"), href: "/game/janken", color: "bg-gradient-to-br from-pink-400 to-red-500", desc: t("games.janken.desc"), icon: <Gamepad2 className="w-10 h-10" /> },
    { key: "hockey", label: t("games.hockey.label"), href: "/game/hockey", color: "bg-gradient-to-br from-indigo-400 to-cyan-500", desc: t("games.hockey.desc"), icon: <Target className="w-10 h-10" /> },
    { key: "escape", label: t("games.escape.label"), href: "/game/escape", color: "bg-gradient-to-br from-violet-400 to-purple-500", desc: t("games.escape.desc"), icon: <Zap className="w-10 h-10" /> },
    { key: "casino", label: t("games.casino.label"), href: "/game/x", color: "bg-gradient-to-br from-gray-500 to-zinc-700", desc: t("games.casino.desc"), icon: <Dice1 className="w-10 h-10" /> },
  ], [t]);

  return (
    <main className="fixed inset-0 w-full h-dvh bg-background overflow-hidden touch-none flex flex-col transition-colors duration-300">
      <div className="absolute inset-0 -z-10">
        <OceanBackground />
      </div>

      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <ModeToggle />
      </div>

      {/* ログイン成功・失敗等のモーダル */}
      {logoutSuccess && <LogoutSuccessModal onClose={() => setLogoutSuccess(false)} />}
      
      {modalType === "menu" && <ScoreModal scores={scores} onClose={() => setModalType(null)} />}
      
      <AvatarModal
        open={modalType === "avatar"}
        user={user}
        onClose={() => setModalType(null)}
        onSave={async () => {
          // アバター更新後のリロード処理など
          setModalType(null);
          router.refresh();
        }}
      />
      
      {modalType === "logout" && (
        <ConfirmModal
          type="logout"
          onConfirm={handleLogout}
          onCancel={() => setModalType(null)}
        />
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-20 pb-12">
            
            {/* ★ ログイン判定による出し分けエリア */}
            <div className="relative min-w-[56px] min-h-[56px] flex items-center justify-center">
              {isAuthLoading ? (
                // 読み込み中（チラつき防止）
                <div className="w-14 h-14 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                // ログイン中：アバターボタンを表示
                <AvatarButton user={user} onClick={() => setMenuOpen(!menuOpen)} />
              ) : (
                // 未ログイン：ログインボタンを表示
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="w-14 h-14 rounded-full shadow-xl transition-transform active:scale-95"
                  onClick={() => router.push("/login")}
                >
                  <LogIn className="w-6 h-6" />
                </Button>
              )}
            </div>

            <h1 className="text-foreground text-4xl sm:text-6xl font-black drop-shadow-sm m-0 text-center">
              {t("title")}
            </h1>
          </div>

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
        onOpenAvatar={() => { setModalType("avatar"); setMenuOpen(false); }}
        onOpenScore={() => { setModalType("menu"); setMenuOpen(false); }}
        onOpenBoard={() => { router.push("/board"); setMenuOpen(false); }}
        onOpenLogout={() => { setModalType("logout"); setMenuOpen(false); }}
      />

      <footer className="absolute bottom-4 left-0 right-0 z-10 text-center text-muted-foreground text-xs pointer-events-none">
        © {new Date().getFullYear()} {t("footer")}
      </footer>
    </main>
  );
}