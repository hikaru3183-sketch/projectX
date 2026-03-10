import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // サポートする言語（ja.json と en.json を用意したのでこの2つ）
  locales: ["ja", "en"],

  // URLに言語が含まれていない場合のデフォルト言語
  defaultLocale: "ja",

  // ブラウザの言語設定を見て自動でリダイレクトするか（trueがおすすめ）
  localeDetection: true,
});

export const config = {
  // 翻訳を適用する範囲を指定
  // 下記の書き方で、APIや画像、favicon以外のすべてのパスに適用されます
  matcher: ["/", "/(ja|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
