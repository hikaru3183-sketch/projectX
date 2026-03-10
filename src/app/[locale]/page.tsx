"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { GameIsland } from "@/components/home/GameIsland";
import { OceanBackground } from "@/components/home/OceanBackground";
import { ScoreModal } from "@/components/home/ScoreModal";
import { LogoutSuccessModal } from "@/components/home/LogoutSuccessModal";
import { DeleteAccountSuccessModal } from "@/components/home/DeleteAccountSuccessModal";
import { AvatarButton } from "@/components/home/AvatarButton";
import { UserMenu } from "@/components/home/UserMenu";
import { AvatarModal } from "@/components/home/AvatarModal";
import { ConfirmModal } from "@/components/home/ConfirmModal";
import { ModeToggle } from "@/components/mode-toggle"; // 追加

// Shadcn UI コンポーネントを必要に応じてインポート
import { Button } from "@/components/ui/button";

import { Hand, Gamepad2, Target, Zap, Dice1, LogIn } from "lucide-react";

export default function Home() {
  const t = useTranslations("Home");
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<
    "reset" | "logout" | "menu" | "avatar" | "deleteAccount" | null
  >(null);

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
        console.error("データ取得失敗:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadInitialData();
    return () => { isMounted = false; };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        setModalType(null);
        setLogoutSuccess(true);
        router.refresh();
      }
    } catch (err) { console.error("ログアウト失敗:", err); }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/delete-account", { method: "POST" });
      if (res.ok) {
        setUser(null);
        setModalType(null);
        setDeleteSuccess(true);
      }
    } catch (err) { console.error("削除失敗:", err); }
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

      {/* 右上のコントロールエリア */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <ModeToggle />
      </div>

      {/* モーダル群 (変更なし) */}
      {logoutSuccess && <LogoutSuccessModal onClose={() => setLogoutSuccess(false)} />}
      {deleteSuccess && (
        <DeleteAccountSuccessModal onClose={() => { setDeleteSuccess(false); router.push("/"); }} />
      )}
      {modalType === "menu" && <ScoreModal scores={scores} onClose={() => setModalType(null)} />}
      <AvatarModal
        open={modalType === "avatar"}
        user={user}
        onClose={() => setModalType(null)}
        onSave={async (newAvatar: any) => {
          await fetch("/api/avatar", { method: "POST", body: JSON.stringify(newAvatar) });
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

      {/* コンテンツエリア */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-20 pb-12">
            <div className="relative">
              {user ? (
                <AvatarButton user={user} onClick={() => setMenuOpen(!menuOpen)} />
              ) : (
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

            <h1 className="text-foreground text-4xl sm:text-6xl font-black drop-shadow-sm m-0">
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