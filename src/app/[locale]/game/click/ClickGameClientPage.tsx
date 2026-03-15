"use client";

import { useEffect, useRef, useState } from "react";
import { updateCoinsAction } from "../../../../lib/actions/user";
import { saveClickerItemsAction } from "./logic/actions";
import { useClickGame } from "./logic/useClickGame";
import { ClickButton } from "./components/ClickButton";
import { CoinDisplay } from "./components/CoinDisplay";
import { ItemList } from "./components/ItemList";
import { GachaPanel } from "./components/GachaPanel";
import { ClearButton } from "./components/ClearButton";
import { ClearModal } from "./components/ClearModal";
import { ClearAnimation } from "../../../../components/animation/ClearAnimation";
import { CoinEffect } from "./components/CoinEffect";
import MessageBox from "./components/MessageBox";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { BgmController } from "./components/BgmController";
import { toast } from "sonner";

export default function ClickGamePage({
  initialCoins,
  initialStock = {},
}: {
  initialCoins: number;
  initialStock?: Record<string, number>;
}) {
  const router = useRouter();
  const [isSavingManual, setIsSavingManual] = useState(false);

  // useClickGame内部での自動保存を無効化（または無視）する構成
  const {
    coins,
    isDirty,
    // isAutoSaving は使用せず、手動保存（isSavingManual）の状態のみを反映させる
    stockItems,
    message,
    visible,
    coinEffect,
    showSuperFormal,
    showClearButton,
    handleClick,
    handleGacha,
    handleUseItem,
    useAllItemsAllTypes,
    handleClear,
    setCoinEffect,
  } = useClickGame(initialCoins, initialStock);

  /**
   * サーバーへの保存実行ロジック（ここを一か所に集約）
   */
  const performSave = async (currentCoins: number, currentStock: any) => {
    if (isSavingManual) return false;
    setIsSavingManual(true);
    try {
      await Promise.all([
        updateCoinsAction(currentCoins),
        saveClickerItemsAction(currentStock),
      ]);
      toast.success("データを保存しました！");
      return true;
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("保存に失敗しました");
      return false;
    } finally {
      setIsSavingManual(false);
    }
  };

  /**
   * 終了ボタン押下時の処理
   */
  const handleSaveAndExit = async () => {
    if (isDirty) {
      // 現在の状態を渡して保存
      const success = await performSave(coins, stockItems);
      if (success) router.push("/");
    } else {
      router.push("/");
    }
  };

  // 最新の値を useRef で管理（イベントリスナー内でのクロージャ対策）
  const coinsRef = useRef(coins);
  const stockRef = useRef(stockItems);
  useEffect(() => {
    coinsRef.current = coins;
    stockRef.current = stockItems;
  }, [coins, stockItems]);

  /**
   * カスタム離脱イベント（DashboardからのHomeリクエストなど）
   */
  useEffect(() => {
    const handleCustomHomeRequest = (e: Event) => {
      if (isDirty) {
        e.preventDefault();
        toast("保存されていないデータがあります", {
          description: "現在の進行状況を保存して終了しますか？",
          duration: Infinity,
          action: {
            label: "保存して終了",
            onClick: async () => {
              const success = await performSave(coinsRef.current, stockRef.current);
              if (success) router.push("/");
            },
          },
        });
      }
    };
    window.addEventListener("custom-home-request", handleCustomHomeRequest);
    return () =>
      window.removeEventListener("custom-home-request", handleCustomHomeRequest);
  }, [isDirty, router]); // 依存配列を最小限に

  /**
   * ブラウザを閉じる/リロード時のバックアップ保存
   * ガチャを回すたびではなく、最後に一回だけ実行される
   */
  useEffect(() => {
    const backupSave = () => {
      // 初期値から変更がある場合のみ実行
      if (
        coinsRef.current !== initialCoins ||
        JSON.stringify(stockRef.current) !== JSON.stringify(initialStock)
      ) {
        // 同期的に実行される必要があるため、navigator.sendBeacon 等が理想ですが、
        // 現状のアクション呼び出しを維持
        updateCoinsAction(coinsRef.current).catch(() => {});
        saveClickerItemsAction(stockRef.current).catch(() => {});
      }
    };
    window.addEventListener("beforeunload", backupSave);
    return () => window.removeEventListener("beforeunload", backupSave);
  }, [initialCoins, initialStock]);

  // アイテム表示用のソートロジック
  const ORDER = ["💡ノーマル", "✨レア", "🎇ウルトラ", "🎆レジェンド"];
  const sortedItems: [string, number][] = ORDER.filter(
    (name) => stockItems[name] !== undefined,
  ).map((name) => [name, stockItems[name] as number]);

  return (
    <main className="w-full min-h-dvh p-4 border-4 border-yellow-300 rounded-2xl shadow-2xl bg-white relative overflow-hidden">
      <BgmController src="/sounds/click/clickbgm.mp3" />

      {/* 保存中のオーバーレイ（手動保存時のみ表示） */}
      {isSavingManual && (
        <div className="fixed inset-0 bg-black/20 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white px-8 py-4 rounded-full shadow-2xl border-2 border-yellow-400 font-bold animate-bounce flex items-center gap-2">
            <span className="text-xl">💰</span> データ保存中...
          </div>
        </div>
      )}

      <AnimatePresence>
        {showSuperFormal && <ClearAnimation enableSound={true} />}
      </AnimatePresence>

      <CoinDisplay coins={coins} />

      <div className="text-center">
        <ClickButton onClick={handleClick} />
        <CoinEffect
          coinEffect={coinEffect}
          onFinish={() => setCoinEffect(null)}
        />
      </div>

      <ItemList
        sortedItems={sortedItems}
        onUseItem={handleUseItem}
        onUseAll={useAllItemsAllTypes}
      />

      {/* ガチャパネル：内部で自動保存が走らないように handleGacha をそのまま渡す */}
      <GachaPanel currentCoins={coins} handleGacha={handleGacha} />

      <div className="text-[10px] px-6 max-w-md mx-auto mt-2">
        <ClearButton safeCoins={coins} onClear={handleClear} />
      </div>

      <div className="text-center text-xs text-gray-700 mt-4 h-16">
        <MessageBox message={message} visible={visible} duration={3} />
      </div>

      {showClearButton && <ClearModal onHome={handleSaveAndExit} />}
    </main>
  );
}