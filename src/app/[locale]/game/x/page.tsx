import { getGameStats } from "@/app/[locale]/game/x/logic/actions";
import GamePageClient from "./GamePageClient";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function GamePage() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (!session) {
    redirect("/login");
  }

  // ログインユーザー情報の取得（必要であれば）
  // const user = session.user;

  // actions.ts からコイン、スコア、そしてアバター情報を取得
  const stats = await getGameStats();

  // 万が一取得に失敗した場合のフォールバック
  const initialCoins = stats.ok ? stats.coins : 0;
  const initialScores = stats.ok ? stats.scores : [];

  // DBから取得したアバター情報を取得
  const initialAvatar = stats.ok ? stats.avatar : null;

  // クライアント側へ渡す
  return (
    <GamePageClient
      initialCoins={initialCoins}
      initialScores={initialScores}
      initialAvatar={initialAvatar}
    />
  );
}