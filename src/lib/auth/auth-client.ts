import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // 環境変数が未定義の場合のフォールバック（デバッグしやすくなります）
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  plugins: [
    usernameClient(),
  ],

  // クライアント側でも独自カラムの型を明示的に定義
  user: {
    additionalFields: {
      // usernameプラグインを使用する場合でも、フィールドとして定義しておくと安定します
      username: {
        type: "string",
      },
      avatar: {
        type: "string",
      },
      coins: {
        type: "number",
      },
      items: {
        type: "string",
      },
      stockItems: {
        type: "string",
      },
    },
  },
});