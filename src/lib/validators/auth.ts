import { z } from "zod";

// -----------------------------
// Login
// -----------------------------
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("正しいメール形式で入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

// -----------------------------
// Register
// -----------------------------
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("正しいメール形式で入力してください"),
  // ★ min(1) になったので、1文字から送信可能！
  password: z.string().min(1, "パスワードを入力してください"), 
});