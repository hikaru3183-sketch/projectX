"use client";

import { useState, useEffect } from "react";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import {
  LayoutDashboard,
  MessageSquare,
  Trophy,
  UserCircle,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Languages,
  Lock,
  Home,
} from "lucide-react";
import { AvatarModal } from "@/components/home/AvatarModal";
import { OceanBackground } from "@/components/home/OceanBackground";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  
  const t = useTranslations("Home.dashboard");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  // ゲスト判定
  const isGuest = session?.user.email === "guest@example.com";

  const toggleLanguage = () => {
    const nextLocale = currentLocale === "ja" ? "en" : "ja";
    const newPath = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
    router.push(newPath);
  };

  if (isPending) return <div className="p-8 font-mono opacity-50 text-center uppercase tracking-widest">Loading...</div>;

  if (!session) {
    router.push(`/${currentLocale}/login`);
    return null;
  }

  return (
    <main className="fixed inset-0 w-full h-dvh bg-background overflow-hidden flex flex-col transition-colors duration-300">
      {/* Ocean Background */}
      <div className="absolute inset-0 -z-10">
        <OceanBackground />
      </div>

      {/* Bottom Navigation - Same as Home */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
        <nav className="flex flex-row items-center bg-background/80 backdrop-blur-md rounded-2xl border shadow-2xl transition-all overflow-hidden p-1">
          {/* User Info Section */}
          {session?.user && (
            <div className="flex items-center justify-center py-2 px-4 select-none border-r border-foreground/5">
              <div className="flex items-center font-mono text-[10px] tracking-[0.2em]">
                <span className="text-foreground/20 font-black">ACCOUNT</span>
                <span className="mx-3 text-foreground/10">/</span>
                <span className="text-foreground/70 font-bold uppercase">
                  {session.user.name}
                </span>
                {isGuest && (
                  <span className="ml-2 text-[8px] bg-foreground/10 px-1.5 py-0.5 rounded text-foreground/40 font-mono">
                    GUEST
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Button Section */}
          <div className="flex items-center gap-1 px-2 justify-center">
            <Button
              variant="ghost"
              className="flex flex-col gap-1 h-12 w-20 sm:w-24 rounded-xl transition-all hover:bg-primary/5 hover:text-primary"
              onClick={() => router.push(`/${currentLocale}`)}
            >
              <Home className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-tight">ホーム</span>
            </Button>
            {mounted && (
              <>
                <Button
                  variant="ghost"
                  className="flex flex-col gap-1 h-12 w-20 sm:w-24 rounded-xl transition-all hover:bg-primary/5 hover:text-primary"
                  onClick={toggleLanguage}
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-[10px] font-bold tracking-tight">
                    {currentLocale === "ja" ? "EN" : "JA"}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex flex-col gap-1 h-12 w-20 sm:w-24 rounded-xl transition-all hover:bg-primary/5 hover:text-primary"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="text-[10px] font-bold tracking-tight">テーマ</span>
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              className="flex flex-col gap-1 h-12 w-20 sm:w-24 rounded-xl transition-all hover:bg-destructive/10 hover:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-tight">ログアウト</span>
            </Button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-40 pt-10">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-foreground text-4xl sm:text-6xl font-black drop-shadow-sm mb-12 text-center uppercase tracking-tighter">
            {t("welcome")}{session.user.name}
          </h1>

          <div className="space-y-8">
          {/* Resume Game */}
          <section>
            <button onClick={() => router.push(`/${currentLocale}`)} className="group relative w-full overflow-hidden rounded-2xl bg-foreground p-[1px] transition-all hover:scale-[1.01] active:scale-[0.99]">
              <div className="relative flex items-center justify-between bg-background/90 backdrop-blur-md px-8 py-6 rounded-[15px] group-hover:bg-background/95 transition-colors text-foreground">
                <div className="flex items-center gap-6">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                      <LayoutDashboard className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-black tracking-[0.2em] uppercase">{t("resume")}</h2>
                    <p className="text-[10px] font-mono text-foreground/40 uppercase">{t("resumeSub")}</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-foreground/20 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </section>

          {/* Grid Menu */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* BOARD: ゲスト時は警告付き */}
            <div 
              onClick={() => router.push(`/${currentLocale}/board`)} 
              className="group cursor-pointer p-6 rounded-2xl border border-foreground/10 bg-background/80 backdrop-blur-md hover:border-blue-500/30 hover:bg-background/90 transition-all"
            >
              <div className="flex justify-between items-center mb-6 text-blue-500">
                <MessageSquare className="w-5 h-5" />
                {isGuest && <Lock className="w-3 h-3 text-foreground/20" />}
              </div>
              <h3 className="text-sm font-black uppercase">{t("board")}</h3>
              <p className="text-[11px] text-foreground/40">{isGuest ? "ReadOnly: 閲覧のみ可能です" : t("boardSub")}</p>
            </div>

            <div onClick={() => setModalType("menu")} className="group cursor-pointer p-6 rounded-2xl border border-foreground/10 bg-background/80 backdrop-blur-md hover:border-yellow-500/30 hover:bg-background/90 transition-all">
              <Trophy className="w-5 h-5 mb-6 text-yellow-500" />
              <h3 className="text-sm font-black uppercase">{t("score")}</h3>
              <p className="text-[11px] text-foreground/40">{t("scoreSub")}</p>
            </div>

            {/* AVATAR: ゲスト時はクリック無効化 */}
            <div 
              onClick={() => !isGuest && setModalType("avatar")} 
              className={`group p-6 rounded-2xl border border-foreground/10 bg-background/80 backdrop-blur-md transition-all ${isGuest ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-emerald-500/30 hover:bg-background/90"}`}
            >
              <div className="flex justify-between items-center mb-6 text-emerald-500">
                <UserCircle className="w-5 h-5" />
                {isGuest && <Lock className="w-3 h-3 text-foreground/20" />}
              </div>
              <h3 className="text-sm font-black uppercase">{t("profile")}</h3>
              <p className="text-[11px] text-foreground/40">{isGuest ? "Fixed: ゲスト用アバター固定" : t("profileSub")}</p>
            </div>
          </section>

          {/* Settings: ゲスト時は入力をロック */}
          <section className="bg-background/80 backdrop-blur-md p-8 rounded-3xl border border-foreground/10">
            <h2 className="text-xs font-black tracking-[0.3em] text-foreground/30 uppercase mb-6">{t("settings")}</h2>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-2">
                <label className="text-[10px] font-bold text-foreground/30 ml-1 uppercase tracking-widest flex items-center gap-2">
                  {t("displayName")}
                  {isGuest && <Lock className="w-3 h-3" />}
                </label>
                <input
                  type="text"
                  placeholder={session.user.name ?? ""}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  disabled={isGuest || isUpdating}
                  className="w-full bg-foreground/[0.03] border border-foreground/10 p-3 rounded-xl outline-none text-sm font-medium transition-all disabled:opacity-50"
                />
              </div>
              <button
                onClick={async () => {
                  if (isGuest || !newName) return;
                  setIsUpdating(true);
                  await authClient.updateUser({ name: newName });
                  setIsUpdating(false);
                  setNewName("");
                  router.refresh();
                }}
                disabled={!newName || isUpdating || isGuest}
                className="w-full md:w-auto px-8 py-3 bg-foreground text-background font-black text-xs rounded-xl hover:opacity-90 transition uppercase disabled:bg-foreground/10 disabled:text-foreground/20"
              >
                {isGuest ? "LOCKED" : (isUpdating ? "..." : t("save"))}
              </button>
            </div>
            {isGuest && (
              <p className="mt-4 text-[10px] font-mono text-amber-500/60 uppercase tracking-tighter text-center">
                Guest profile settings are managed by the system administrator.
              </p>
            )}
          </section>
        </div>

        <AvatarModal
          open={modalType === "avatar"}
          user={session.user}
          onSave={() => {}} // ゲストはここが呼ばれても何もしない
          onClose={() => setModalType(null)}
        />
      </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 z-10 text-center text-muted-foreground/50 text-[10px] pointer-events-none">
        © {new Date().getFullYear()} Project X
      </footer>
    </main>
  );
}
