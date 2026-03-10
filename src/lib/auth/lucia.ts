// lib/auth/lucia.ts
import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/lib/db/db";
import { appUsers, sessions } from "@/lib/db/schema";
import { cookies } from "next/headers";
import { cache } from "react";

// 1. アダプターの設定
const adapter = new DrizzlePostgreSQLAdapter(db, sessions, appUsers);

// 2. Lucia v3 コンストラクタ
export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      // ここに coins を追加したい場合は、あとで DatabaseUser interface にも追記
    };
  },
});

export const validateRequest = cache(async () => {
  // cookies() を await する
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await auth.validateSession(sessionId);

  // セッションが延長（fresh）された場合、新しいCookieをセットする
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = auth.createSessionCookie(result.session.id);
      // ここも await cookieStore.set にする
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    // セッションが無効な場合、クッキーを削除する
    if (!result.session) {
      const sessionCookie = auth.createBlankSessionCookie();
      // ここも await cookieStore.set にする
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {
    // Server Component内でのセットエラー対策
  }

  return result;
});

// 3. TypeScript 用の型定義
declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: DatabaseUser;
  }
}

interface DatabaseUser {
  email: string;
}
