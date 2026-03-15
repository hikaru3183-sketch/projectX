"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import { useGlobalStore } from "@/store/useGlobalStore"; // 追加
import { toast } from "sonner";
import {
  MessageSquare,
  Trophy,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Languages,
  Lock,
  X,
  Coins,
  ArrowLeft,
} from "lucide-react";
import { AvatarModal } from "./components/AvatarModal";
import { OceanBackground } from "@/components/home/OceanBackground";

// --- ConfirmModal (ログアウト確認) ---
function ConfirmModal({
  onConfirm,
  onCancel,
  t,
  isGuest,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  t: (key: string) => string;
  isGuest: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-background/95 dark:bg-slate-900/90 border border-black/10 dark:border-white/20 backdrop-blur-2xl rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 text-center">
          {t("logoutTitle")}
        </h2>
        <p className="text-sm text-foreground/60 mb-8 text-center leading-relaxed">
          {isGuest ? t("logoutGuestMessage") : t("logoutMessage")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-4 rounded-2xl border border-foreground/10 text-[10px] font-black uppercase hover:bg-foreground/5 transition-all"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-4 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
          >
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ScoreModal (スコア表示) ---
function ScoreModal({
  open,
  onClose,
  coins,
  t,
}: {
  open: boolean;
  onClose: () => void;
  coins: number;
  t: (key: string) => string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-background/95 dark:bg-slate-900/90 border border-black/10 dark:border-white/20 backdrop-blur-2xl rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-black uppercase tracking-widest">{t("scoreTitle")}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-foreground/5 transition-all text-foreground/40">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[2rem] p-8 text-center shadow-inner">
          <div className="flex items-center justify-center gap-3 mb-3 text-foreground">
            <Coins className="w-10 h-10 text-yellow-500 animate-bounce" />
            <span className="text-5xl font-black tracking-tighter">{coins.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-yellow-600/60 font-black uppercase tracking-[0.3em]">
            {t("totalCoins")}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 px-6 py-4 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase hover:opacity-90 transition-all shadow-xl"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}

// --- DashboardPage (メインページ) ---
export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  
  const t = useTranslations("Home.dashboard");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Zustandから最新のアバター状態を取得
  const globalAvatar = useGlobalStore((state) => state.avatar);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  if (isPending) return (
    <div className="flex h-screen items-center justify-center bg-blue-400">
      <div className="text-white font-black tracking-[0.5em] animate-pulse uppercase">Loading...</div>
    </div>
  );

  if (!session) {
    router.push(`/${currentLocale}/login`);
    return null;
  }

  const isGuest = session?.user.email === "guest@example.com";
  // 表示用アバターIDの決定（Zustandを優先、なければセッションから）
  const displayAvatarId = globalAvatar?.image || (session.user as any).avatar?.image || "1";

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-blue-500/30">
      <OceanBackground />
      <div className="fixed inset-0 bg-background/20 backdrop-blur-[2px] -z-10 transition-colors duration-1000" />

      <div className="max-w-4xl mx-auto p-4 md:p-8 pt-12 md:pt-20">
        
        {/* ヘッダーエリア */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 px-4 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black tracking-[0.3em] text-foreground/40 uppercase">
                {t("systemActive")}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase flex flex-wrap items-center gap-2 text-foreground">
              <span className="opacity-40">{t("welcome")}</span>
              <span className="text-blue-600 dark:text-blue-400">{session.user.name}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-background/60 dark:bg-background/40 backdrop-blur-md p-1.5 rounded-2xl border border-black/5 dark:border-white/10 shadow-xl">
            {mounted && (
              <>
                <button onClick={() => {
                  const nextLocale = currentLocale === "ja" ? "en" : "ja";
                  router.push(pathname.replace(`/${currentLocale}`, `/${nextLocale}`));
                }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-foreground/5 transition-all text-foreground/60">
                  <Languages className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">
                    {currentLocale === "ja" ? "EN" : "JA"}
                  </span>
                </button>
                <div className="w-[1px] h-4 bg-foreground/10" />
                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-xl hover:bg-foreground/5 transition-all text-foreground/60">
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </>
            )}
            <button 
              onClick={() => setShowLogoutConfirm(true)} 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all font-black text-[10px] uppercase shadow-lg shadow-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("exit")}</span>
            </button>
          </div>
        </header>

        <main className="space-y-6">
          {/* RESUME GAME */}
          <section>
            <button 
              onClick={() => router.push(`/${currentLocale}`)} 
              className="group relative w-full overflow-hidden rounded-[2.5rem] bg-blue-600 p-1 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xl shadow-blue-600/20"
            >
              <div className="relative flex items-center justify-between bg-blue-600 px-10 py-8 rounded-[2.3rem] text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="flex items-center gap-8 relative z-10">
                  <div className="p-4 bg-white/20 rounded-[1.5rem] backdrop-blur-md">
                    <ArrowLeft className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-black tracking-tighter uppercase leading-none mb-1">{t("resume")}</h2>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">{t("resumeSub")}</p>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-white/30 group-hover:text-white group-hover:translate-x-2 transition-all relative z-10" />
              </div>
            </button>
          </section>

          {/* 機能グリッド */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* BOARD */}
            <div 
              onClick={() => router.push(`/${currentLocale}/board`)}
              className="group relative p-4 rounded-[1.8rem] bg-background/60 dark:bg-background/40 backdrop-blur-xl border border-black/5 dark:border-white/10 transition-all shadow-lg flex items-center gap-4 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex-shrink-0 p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground truncate">{t("board")}</h3>
                <p className="text-[9px] text-foreground/40 font-bold uppercase truncate">{isGuest ? t("guestBoardOnly") : t("boardSub")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground/10 group-hover:text-foreground/30" />
            </div>

            {/* SCORE */}
            <div 
              onClick={() => !isGuest && setModalType("score")}
              className={`group relative p-4 rounded-[1.8rem] bg-background/60 dark:bg-background/40 backdrop-blur-xl border border-black/5 dark:border-white/10 transition-all shadow-lg flex items-center gap-4 ${isGuest ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"}`}
            >
              <div className="flex-shrink-0 p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground truncate">{t("score")}</h3>
                  {isGuest && <Lock className="w-3 h-3 text-foreground/20" />}
                </div>
                <p className="text-[9px] text-foreground/40 font-bold uppercase truncate">{isGuest ? t("guestScoreLocked") : t("scoreSub")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground/10 group-hover:text-foreground/30" />
            </div>

            {/* PROFILE (AVATAR) - アイコンを画像に変更 */}
            <div 
              onClick={() => !isGuest && setModalType("avatar")}
              className={`group relative p-4 rounded-[1.8rem] bg-background/60 dark:bg-background/40 backdrop-blur-xl border border-black/5 dark:border-white/10 transition-all shadow-lg flex items-center gap-4 ${isGuest ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"}`}
            >
              {/* アイコンの代わりに実際のアバター画像を表示 */}
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/10 rounded-2xl overflow-hidden border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                <img 
                  src={`/avatars/${displayAvatarId}.png`} 
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground truncate">{t("profile")}</h3>
                  {isGuest && <Lock className="w-3 h-3 text-foreground/20" />}
                </div>
                <p className="text-[9px] text-foreground/40 font-bold uppercase truncate">{isGuest ? t("guestAvatarFixed") : t("profileSub")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground/10 group-hover:text-foreground/30" />
            </div>
          </section>
        </main>

        {/* モーダル群 */}
        <ScoreModal
          open={modalType === "score"}
          onClose={() => setModalType(null)}
          coins={(session.user as any).coins ?? 0}
          t={t}
        />

        <AvatarModal
          open={modalType === "avatar"}
          user={session.user}
          onClose={() => setModalType(null)}
        />

        {showLogoutConfirm && (
          <ConfirmModal
            isGuest={isGuest}
            onConfirm={async () => {
              try {
                await signOut();
                toast.success(isGuest ? t("guestResetSuccess") : t("logoutSuccess"));
                router.push(`/${currentLocale}/login`);
              } catch (error) {
                toast.error(t("errorOccurred"));
              }
            }}
            onCancel={() => setShowLogoutConfirm(false)}
            t={t}
          />
        )}   
      </div>
    </div>
  );
}