"use client";

import { useClickGame } from "@/app/game/click/logic/useClickGame";
import { ClickButton } from "@/components/click/ClickButton";
import { CoinDisplay } from "@/components/click/CoinDisplay";
import { ItemList } from "@/components/click/ItemList";
import { GachaPanel } from "@/components/click/GachaPanel";
import { ClearButton } from "@/components/click/ClearButton";
import { ClearModal } from "@/components/click/ClearModal";
import { ClearAnimation } from "@/components/animation/ClearAnimation";
import { CoinEffect } from "@/components/click/CoinEffect";
import MessageBox from "@/components/click/MessageBox";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { BgmController } from "@/components/click/BgmController";

export default function ClickGamePage() {
  const router = useRouter();

  const {
    coins,
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
  } = useClickGame();

  // -----------------------------
  // ★ coins がまだロードされていない時の表示
  // -----------------------------
  if (coins === null || coins === undefined) {
    return (
      <main className="w-full min-h-[100dvh] flex items-center justify-center text-xl">
        読み込み中...
      </main>
    );
  }

  const ORDER = ["💡ノーマル", "✨レア", "🎇ウルトラ", "🎆レジェンド"];

  const sortedItems: [string, number][] = ORDER.filter(
    (name) => stockItems[name] !== undefined,
  ).map((name) => [name, stockItems[name] as number]);

  return (
    <main className="w-full min-h-[100dvh] p-4 border-4 border-yellow-300 rounded-2xl shadow-2xl bg-white">
      <BgmController src="/sounds/click/clickbgm.mp3" />

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

      <GachaPanel currentCoins={coins} handleGacha={handleGacha} />

      <div className="text-[10px] px-6 max-w-md mx-auto mt-2">
        <ClearButton safeCoins={coins} onClear={handleClear} />
      </div>

      <div className="text-center text-xs text-gray-700 mt-4 h-16">
        <MessageBox message={message} visible={visible} duration={3} />
      </div>

      {showClearButton && <ClearModal onHome={() => router.back()} />}
    </main>
  );
}
