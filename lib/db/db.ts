// lib/db/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// 開発中のホットリロードで接続が増えすぎないようにグローバルに保存する
const globalForDb = global as unknown as {
  conn: postgres.Sql | undefined;
};

// 接続オプションに max: 1 を指定（サーバーレス環境では推奨）
const conn =
  globalForDb.conn ??
  postgres(connectionString, {
    max: 10, // 最大接続数を制限
    idle_timeout: 20, // アイドル状態のコネクションを早く解放
    connect_timeout: 30, // タイムアウトを少し長めに設定
  });

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
