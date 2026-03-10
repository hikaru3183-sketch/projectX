// lib/db/validators.ts
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { appUsers, sessions, scores, posts } from "./schema"; // schema.tsの定義名に修正

// -----------------------------
// Users (appUsers)
// -----------------------------
// アカウント登録時やプロフィール更新のバリデーションに使用
export const insertUserSchema = createInsertSchema(appUsers);
export const selectUserSchema = createSelectSchema(appUsers);

// -----------------------------
// Scores (ゲームスコア)
// -----------------------------
// ゲーム終了時のスコア保存バリデーションに使用
export const insertScoreSchema = createInsertSchema(scores);
export const selectScoreSchema = createSelectSchema(scores);

// -----------------------------
// Posts (掲示板)
// -----------------------------
// 新規投稿や編集時の文字数チェックなどに便利
export const insertPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);

// -----------------------------
// Sessions
// -----------------------------
// 基本的に Better Auth が自動管理しますが、参照用として
export const selectSessionSchema = createSelectSchema(sessions);