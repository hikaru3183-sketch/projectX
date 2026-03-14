"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Settings,
  Globe,
  Moon,
  Sun,
  MessageSquare,
  Trophy,
  User,
  ArrowLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import { toast } from "sonner";

// ============================================
// Types
// ============================================
type Language = "en" | "ja";

interface Messages {
  settings: {
    title: string;
    systemActive: string;
    backToHome: string;
    saveChanges: string;
    saved: string;
  };
  general: {
    title: string;
    language: string;
    languageDesc: string;
    theme: string;
    themeDesc: string;
    light: string;
    dark: string;
  };
  gameOptions: {
    title: string;
    board: string;
    boardDesc: string;
    score: string;
    scoreDesc: string;
  };
  account: {
    title: string;
    profile: string;
    displayName: string;
    displayNamePlaceholder: string;
    avatar: string;
  };
}

// ============================================
// i18n Messages
// ============================================
const messages: Record<Language, Messages> = {
  en: {
    settings: {
      title: "Settings",
      systemActive: "System Active",
      backToHome: "Back to Home",
      saveChanges: "Save Changes",
      saved: "Settings saved successfully!",
    },
    general: {
      title: "General",
      language: "Language",
      languageDesc: "Select your preferred language",
      theme: "Theme",
      themeDesc: "Toggle between light and dark mode",
      light: "Light",
      dark: "Dark",
    },
    gameOptions: {
      title: "Game Options",
      board: "Bulletin Board",
      boardDesc: "Community discussions and announcements",
      score: "Score Rankings",
      scoreDesc: "View leaderboards and personal records",
    },
    account: {
      title: "Account",
      profile: "Profile Settings",
      displayName: "Display Name",
      displayNamePlaceholder: "Enter your display name",
      avatar: "Avatar",
    },
  },
  ja: {
    settings: {
      title: "設定",
      systemActive: "システム稼働中",
      backToHome: "ホームに戻る",
      saveChanges: "変更を保存",
      saved: "設定が保存されました!",
    },
    general: {
      title: "一般設定",
      language: "言語",
      languageDesc: "お好みの言語を選択",
      theme: "テーマ",
      themeDesc: "ライトモードとダークモードを切り替え",
      light: "ライト",
      dark: "ダーク",
    },
    gameOptions: {
      title: "ゲームオプション",
      board: "掲示板",
      boardDesc: "コミュニティの話題とお知らせ",
      score: "スコアランキング",
      scoreDesc: "ランキングと個人記録を確認",
    },
    account: {
      title: "アカウント",
      profile: "プロフィール設定",
      displayName: "表示名",
      displayNamePlaceholder: "表示名を入力",
      avatar: "アバター",
    },
  },
};

// ============================================
// Avatar Data
// ============================================
const avatars = [
  { id: "avatar1", emoji: "🐱", bg: "bg-amber-100" },
  { id: "avatar2", emoji: "🐶", bg: "bg-sky-100" },
  { id: "avatar3", emoji: "🦊", bg: "bg-orange-100" },
  { id: "avatar4", emoji: "🐰", bg: "bg-pink-100" },
  { id: "avatar5", emoji: "🐼", bg: "bg-emerald-100" },
  { id: "avatar6", emoji: "🦄", bg: "bg-violet-100" },
];

// ============================================
// Sub Components
// ============================================

// Animated Cloud SVG
function Cloud({ className, delay, size }: { className: string; delay: number; size: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-20 h-10",
    md: "w-32 h-16",
    lg: "w-48 h-24",
  };

  return (
    <div
      className={`absolute ${className} ${sizes[size]} opacity-40 dark:opacity-20`}
      style={{
        animation: `drift ${25 + delay * 3}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <ellipse cx="25" cy="35" rx="20" ry="12" fill="currentColor" className="text-white" />
        <ellipse cx="50" cy="30" rx="25" ry="18" fill="currentColor" className="text-white" />
        <ellipse cx="75" cy="35" rx="20" ry="12" fill="currentColor" className="text-white" />
        <ellipse cx="40" cy="22" rx="18" ry="14" fill="currentColor" className="text-white" />
        <ellipse cx="60" cy="22" rx="18" ry="14" fill="currentColor" className="text-white" />
      </svg>
    </div>
  );
}

// Settings Header
function SettingsHeader({
  lang,
  t,
  onToggleLang,
  onToggleTheme,
  mounted,
  theme,
}: {
  lang: Language;
  t: Messages;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  mounted: boolean;
  theme: string | undefined;
}) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-foreground/50 uppercase">
            {t.settings.systemActive}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-foreground">
          {t.settings.title}
        </h1>
      </div>

      {mounted && (
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 text-foreground/70 hover:text-foreground hover:bg-card transition-all shadow-lg"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {lang === "ja" ? "EN" : "JA"}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 text-foreground/70 hover:text-foreground hover:bg-card transition-all shadow-lg"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-xs font-bold uppercase tracking-wider">
              {theme === "dark" ? t.general.light : t.general.dark}
            </span>
          </button>
        </div>
      )}
    </header>
  );
}

// Floating Settings Card
function SettingsCard({
  title,
  icon,
  iconBg,
  iconColor,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative bg-card/90 backdrop-blur-md rounded-3xl border border-border/30 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 ${iconBg} ${iconColor} rounded-2xl shadow-inner`}>
            {icon}
          </div>
          <h2 className="text-lg font-black tracking-wide uppercase text-foreground">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
}

// Menu Item for Navigation
function MenuItem({
  icon,
  iconBg,
  iconColor,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] hover:bg-foreground/[0.05] border border-foreground/5 hover:border-foreground/10 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 ${iconBg} ${iconColor} rounded-xl`}>
          {icon}
        </div>
        <div className="text-left">
          <p className="font-bold text-sm text-foreground">{label}</p>
          <p className="text-xs text-foreground/50">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-foreground/30 group-hover:text-foreground/60 group-hover:translate-x-1 transition-all" />
    </button>
  );
}

// Toggle Switch Component
function ToggleSwitch({
  isOn,
  onToggle,
  labelOn,
  labelOff,
  ariaLabel,
}: {
  isOn: boolean;
  onToggle: () => void;
  labelOn: string;
  labelOff: string;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center gap-3 px-4 py-2 rounded-xl bg-foreground/[0.03] border border-foreground/10 hover:border-foreground/20 transition-all"
      role="switch"
      aria-checked={isOn}
      aria-label={ariaLabel}
    >
      <div className={`relative w-12 h-6 rounded-full transition-colors ${isOn ? "bg-sky-500" : "bg-foreground/20"}`}>
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
            isOn ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </div>
      <span className="text-sm font-medium text-foreground/70">
        {isOn ? labelOn : labelOff}
      </span>
    </button>
  );
}

// ============================================
// Main Settings Page
// ============================================
export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Language>("ja");
  const [displayName, setDisplayName] = useState("Player");
  const [selectedAvatar, setSelectedAvatar] = useState("avatar1");
  const [hasChanges, setHasChanges] = useState(false);

  // Extract current locale from pathname
  useEffect(() => {
    const pathLocale = pathname.split("/")[1] as Language;
    if (pathLocale === "en" || pathLocale === "ja") {
      setLang(pathLocale);
    }
    setMounted(true);
  }, [pathname]);

  const t = messages[lang];

  const toggleLanguage = () => {
    const nextLang = lang === "ja" ? "en" : "ja";
    setLang(nextLang);
    const newPath = pathname.replace(`/${lang}`, `/${nextLang}`);
    router.push(newPath);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSave = () => {
    // Frontend-only: simulate save
    toast.success(t.settings.saved);
    setHasChanges(false);
  };

  const handleInputChange = (value: string) => {
    setDisplayName(value);
    setHasChanges(true);
  };

  const handleAvatarChange = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    setHasChanges(true);
  };

  const navigateTo = (path: string) => {
    router.push(`/${lang}${path}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Sky & Sea Background */}
      <div className="fixed inset-0 -z-10">
        {/* Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500" />

        {/* Animated Clouds */}
        {mounted && (
          <>
            <Cloud className="top-[5%] left-[5%]" delay={0} size="lg" />
            <Cloud className="top-[15%] right-[10%]" delay={2} size="md" />
            <Cloud className="top-[8%] left-[50%]" delay={4} size="sm" />
            <Cloud className="top-[20%] left-[25%]" delay={6} size="md" />
          </>
        )}

        {/* Sea Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-sky-300/30 via-sky-200/20 to-transparent dark:from-sky-900/30 dark:via-sky-800/10 dark:to-transparent" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <SettingsHeader
          lang={lang}
          t={t}
          onToggleLang={toggleLanguage}
          onToggleTheme={toggleTheme}
          mounted={mounted}
          theme={theme}
        />

        <div className="space-y-6">
          {/* General Settings Card */}
          <SettingsCard
            title={t.general.title}
            icon={<Settings className="w-5 h-5" />}
            iconBg="bg-sky-100 dark:bg-sky-900/50"
            iconColor="text-sky-600 dark:text-sky-400"
          >
            <div className="space-y-6">
              {/* Language Setting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-foreground/50" />
                  <div>
                    <p className="font-bold text-sm text-foreground">{t.general.language}</p>
                    <p className="text-xs text-foreground/50">{t.general.languageDesc}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => lang !== "ja" && toggleLanguage()}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      lang === "ja"
                        ? "bg-sky-500 text-white shadow-lg"
                        : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                    }`}
                  >
                    日本語
                  </button>
                  <button
                    onClick={() => lang !== "en" && toggleLanguage()}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      lang === "en"
                        ? "bg-sky-500 text-white shadow-lg"
                        : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Theme Setting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5 text-foreground/50" />
                  ) : (
                    <Sun className="w-5 h-5 text-foreground/50" />
                  )}
                  <div>
                    <p className="font-bold text-sm text-foreground">{t.general.theme}</p>
                    <p className="text-xs text-foreground/50">{t.general.themeDesc}</p>
                  </div>
                </div>
                {mounted && (
                  <ToggleSwitch
                    isOn={theme === "dark"}
                    onToggle={toggleTheme}
                    labelOn={t.general.dark}
                    labelOff={t.general.light}
                    ariaLabel="Toggle dark mode"
                  />
                )}
              </div>
            </div>
          </SettingsCard>

          {/* Game Options Card */}
          <SettingsCard
            title={t.gameOptions.title}
            icon={<Trophy className="w-5 h-5" />}
            iconBg="bg-amber-100 dark:bg-amber-900/50"
            iconColor="text-amber-600 dark:text-amber-400"
          >
            <div className="space-y-3">
              <MenuItem
                icon={<MessageSquare className="w-4 h-4" />}
                iconBg="bg-blue-100 dark:bg-blue-900/50"
                iconColor="text-blue-600 dark:text-blue-400"
                label={t.gameOptions.board}
                description={t.gameOptions.boardDesc}
                onClick={() => navigateTo("/board")}
              />
              <MenuItem
                icon={<Trophy className="w-4 h-4" />}
                iconBg="bg-yellow-100 dark:bg-yellow-900/50"
                iconColor="text-yellow-600 dark:text-yellow-400"
                label={t.gameOptions.score}
                description={t.gameOptions.scoreDesc}
                onClick={() => toast.info(lang === "ja" ? "スコア機能は近日公開" : "Score feature coming soon")}
              />
            </div>
          </SettingsCard>

          {/* Account Card */}
          <SettingsCard
            title={t.account.title}
            icon={<User className="w-5 h-5" />}
            iconBg="bg-emerald-100 dark:bg-emerald-900/50"
            iconColor="text-emerald-600 dark:text-emerald-400"
          >
            <div className="space-y-6">
              {/* Display Name */}
              <div className="space-y-2">
                <label
                  htmlFor="displayName"
                  className="text-xs font-bold text-foreground/50 uppercase tracking-widest ml-1"
                >
                  {t.account.displayName}
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={t.account.displayNamePlaceholder}
                  className="w-full px-4 py-3 rounded-2xl bg-foreground/[0.03] border border-foreground/10 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-medium text-foreground placeholder:text-foreground/30 transition-all"
                  aria-label={t.account.displayName}
                />
              </div>

              {/* Avatar Selection */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest ml-1">
                  {t.account.avatar}
                </p>
                <div className="flex flex-wrap gap-3">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => handleAvatarChange(avatar.id)}
                      className={`w-14 h-14 rounded-2xl ${avatar.bg} flex items-center justify-center text-2xl transition-all hover:scale-110 ${
                        selectedAvatar === avatar.id
                          ? "ring-2 ring-sky-500 ring-offset-2 ring-offset-background shadow-lg"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`Select avatar ${avatar.emoji}`}
                      aria-pressed={selectedAvatar === avatar.id}
                    >
                      {avatar.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SettingsCard>
        </div>

        {/* Footer Actions */}
        <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigateTo("")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 text-foreground/70 hover:text-foreground hover:bg-card transition-all shadow-lg group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold">{t.settings.backToHome}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl ${
              hasChanges
                ? "bg-sky-500 text-white hover:bg-sky-600 active:scale-95"
                : "bg-foreground/10 text-foreground/30 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{t.settings.saveChanges}</span>
          </button>
        </footer>
      </main>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes drift {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(calc(100vw + 100%));
          }
        }
      `}</style>
    </div>
  );
}
