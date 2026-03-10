// lib/validators/auth.ts
import { z } from "zod";

// -----------------------------
// Login
// -----------------------------
export const loginSchema = z.object({
  email: z.string().min(1, "メールを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

// -----------------------------
// Register
// -----------------------------
export const registerSchema = z.object({
  email: z.string().min(1, "メールを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});
