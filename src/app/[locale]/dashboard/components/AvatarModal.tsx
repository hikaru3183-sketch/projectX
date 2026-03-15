"use client";

import { useState } from "react";
import { AvatarPicker } from "@/components/avatar/AvatarPicker";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useGlobalStore, Avatar } from "@/store/useGlobalStore";
import { refreshSessionAction } from "@/lib/actions/auth";
import { Loader2, X, UserCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function AvatarModal({
  open,
  user,
  onClose,
}: {
  open: boolean;
  user: any;
  onClose: () => void;
}) {
  const router = useRouter();
  const setGlobalAvatar = useGlobalStore((state) => state.setAvatar);

  const [newName, setNewName] = useState(user?.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(user?.avatar);
  const [isUpdating, setIsUpdating] = useState(false);

  const isGuest = user?.email === "guest@example.com";

  if (!open) return null;

  const handleAllUpdate = async () => {
    setIsUpdating(true);
    try {
      const { error } = await authClient.updateUser({
        name: newName,
        // @ts-ignore
        avatar: selectedAvatar,
      });

      if (error) throw new Error(error.message);

      await refreshSessionAction();
      setGlobalAvatar(selectedAvatar);

      toast.success("Profile updated!");
      router.refresh();
      onClose();
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* 修正点：bg-background/95 を bg-background にし、境界線(border-black/15)を濃く。強いシャドウを追加 */}
      <div className="bg-background border border-black/15 dark:border-white/20 backdrop-blur-2xl rounded-[3rem] p-8 w-full max-w-sm shadow-[0_30px_60px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
              <UserCircle2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tighter text-foreground">Profile</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all text-foreground/40 hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-1 custom-scrollbar">
          {/* 1. 名前入力 - ライトモード時の背景を少しだけ濃く(bg-black/[0.04])、ボーダーを強化 */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-foreground/60 dark:text-foreground/50 uppercase tracking-[0.2em] ml-1">
              Display Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isGuest}
              className="w-full bg-black/[0.04] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 p-4 rounded-2xl outline-none text-sm font-black text-foreground focus:ring-2 ring-blue-500/30 transition-all disabled:opacity-50 placeholder:text-foreground/20"
              placeholder="Your Name"
            />
          </div>

          {/* 2. アバター選択 - 背景色とボーダーを調整してカードを浮き立たせる */}
          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black text-foreground/60 dark:text-foreground/50 uppercase tracking-[0.2em]">
                Select Avatar
              </label>
              <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
            </div>
            <div className="bg-black/[0.02] dark:bg-white/5 rounded-[2rem] p-4 border border-black/10 dark:border-white/10 shadow-inner">
              <AvatarPicker
                initial={user?.avatar}
                onSelect={(a) => setSelectedAvatar(a)}
              />
            </div>
          </div>
        </div>

        {/* 保存ボタン - ライトモードでも埋もれない強い青とシャドウ */}
        <button
          onClick={handleAllUpdate}
          disabled={isUpdating || isGuest}
          className="w-full mt-8 py-5 rounded-[1.8rem] bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-[0_10px_25px_rgba(37,99,235,0.4)] disabled:grayscale disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </button>

        {isGuest && (
          <p className="mt-4 text-center text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-tighter">
            Guest account is read-only
          </p>
        )}
      </div>
    </div>
  );
}