// app/game/x/page.tsx
import { getGameStats } from "./actions";
import GamePageClient from "./GamePageClient";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/lucia";

export default async function GamePage() {
  // 認証チェック
  const { user } = await validateRequest();
  if (!user) {
    redirect("/login"); // ログインしていない場合は飛ばす（任意）
  }

  // actions.ts で定義した関数を呼び出して、コインとスコアを一括取得
  const stats = await getGameStats();

  // 万が一取得に失敗した場合のフォールバック
  const initialCoins = stats.ok ? stats.coins : 0;
  const initialScores = stats.ok ? stats.scores : [];

  // クライアント側へ「コイン」と「全ゲームのハイスコアリスト」を渡す
  return (
    <GamePageClient initialCoins={initialCoins} initialScores={initialScores} />
  );
}
