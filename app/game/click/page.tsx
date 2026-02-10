"use client";

import { useClickGame } from "@/lib/game/click/useClickGame";
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

  const ORDER = ["💡ノーマル", "✨レア", "🎇ウルトラ", "🎆レジェンド"];

  const sortedItems: [string, number][] = ORDER.filter(
    (name) => stockItems[name] !== undefined,
  ).map((name) => [name, stockItems[name] as number]);

  return (
    <div className="overflow-auto h-screen">
      <main className="w-full min-h-[100dvh] p-4 border-4 border-yellow-300 rounded-2xl shadow-2xl">
        <AnimatePresence>
          {showSuperFormal && <ClearAnimation />}
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

        <GachaPanel currentCoins={coins ?? 0} handleGacha={handleGacha} />

        <div className="text-[10px] px-6 max-w-md mx-auto mt-2">
          <ClearButton safeCoins={coins ?? 0} onClear={handleClear} />
        </div>

        <div className="text-center text-xs text-gray-700 mt-4 h-16">
          <MessageBox message={message} visible={true} duration={3} />
        </div>

        {showClearButton && <ClearModal onHome={() => router.back()} />}
      </main>
    </div>
  );
}
