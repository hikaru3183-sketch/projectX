import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["ja", "en"],
  defaultLocale: "ja",
  localeDetection: true,
});

// ✅ 関数名を middleware から proxy に変更し、default export にします
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Better Auth のセッションクッキーを確認
  const sessionCookie = request.cookies.get("better-auth.session_token") || 
                        request.cookies.get("__Secure-better-auth.session_token");

  // 言語プレフィックスを除去したパスの判定用
  const purePathname = pathname.replace(/^\/(ja|en)/, "") || "/";
  const segments = pathname.split("/");
  const locale = ["ja", "en"].includes(segments[1]) ? segments[1] : "ja";

  // 1. 認証が必要な範囲
  const isProtectedPage = 
    purePathname === "/" || 
    purePathname.startsWith("/dashboard") || 
    purePathname.startsWith("/game") ||
    purePathname.startsWith("/ranking"); // ランキングも追加しておくと安心です

  // 2. 認証済みなら表示させない範囲
  const isAuthPage = 
    purePathname.startsWith("/login") || 
    purePathname.startsWith("/register") || 
    purePathname.startsWith("/signup");

  // --- 判定ロジック ---

  // 【A】未ログインで保護ページへアクセス → ログイン画面へ
  if (!sessionCookie && isProtectedPage) {
    // 無限ループ防止のためログインページ自身でないことを確認
    if (!isAuthPage) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  // 【B】ログイン済みでログイン画面へアクセス → トップ（ゲーム島）へ
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  }

  // 多言語対応のミドルウェアを実行
  return intlMiddleware(request);
}

export const config = {
  // 静的ファイルやAPI、Vercelの内部パスを除外
  matcher: ["/((?!api|_next|_vercel|[\\w-]+\\.\\w+).*)"],
};