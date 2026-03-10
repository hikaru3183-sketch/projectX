import { db } from "@/lib/db/db";
import { appUsers, scores } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

// 1. サーバー側でデータを取得する関数
async function getRankings() {
  const games = ["click", "janken", "hockey", "escape"] as const;
  const results: Record<string, any[]> = {};

  for (const game of games) {
    results[game] = await db
      .select({
        name: appUsers.name,
        email: appUsers.email,
        value: scores.value,
      })
      .from(scores)
      .innerJoin(appUsers, eq(scores.userId, appUsers.id))
      .where(eq(scores.game, game))
      .orderBy(desc(scores.value))
      .limit(10);
  }
  return results;
}

export default async function RankingPage() {
  // 2. 直接DBからデータを取得 (fetchは不要)
  const ranking = await getRankings();

  const gameLabels = {
    click: "クリック",
    janken: "ジャンケン",
    hockey: "ホッケー",
    escape: "エスケープ",
  } as const;

  const valueLabels = {
    click: "コイン数",
    janken: "優勝回数",
    hockey: "最大スコア",
    escape: "最大スコア",
  } as const;

  const medal = (rank: number) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return "";
  };

  return (
    <main className="mt-10 p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-center">ランキング</h1>

      {(Object.keys(gameLabels) as (keyof typeof gameLabels)[]).map((key) => (
        <div key={key} className="p-4 border rounded-xl shadow bg-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">{gameLabels[key]}</h2>
            <span className="text-gray-600 text-sm font-semibold">
              （{valueLabels[key]}）
            </span>
          </div>

          {!ranking[key] || ranking[key].length === 0 ? (
            <p className="text-gray-500">まだスコアがありません</p>
          ) : (
            ranking[key].map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b py-2 text-lg font-bold items-center"
              >
                <span className="w-16">
                  {medal(i)} {i + 1}位
                </span>
                <span className="flex-1 text-center truncate px-2">
                  {/* Better Authのnameがあれば表示、なければメールのアットマーク前を表示 */}
                  {item.name || item.email?.split("@")[0] || "名無し"}
                </span>
                <span className="w-20 text-right text-orange-600">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      ))}
    </main>
  );
}