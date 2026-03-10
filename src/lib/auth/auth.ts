import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/db";
import * as schema from "@/lib/db/schema";
import { username } from "better-auth/plugins";

// lib/auth/auth.ts
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      // ★ ここを「appUsers」という変数名に合わせて明示的に指定します
      user: schema.appUsers, 
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verification,
    },
  }),
  
  // 以降の設定（user.additionalFields, plugins, password 等）は今のままでOK
  password: {
    minLength: 1, 
  },
  // ...
});