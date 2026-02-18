import { loginUser } from "@/lib/auth/login";
import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力内容が不正です" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const result = await loginUser(email, password);

    // 1. まず認証が成功したかどうかを確認
    // 2. さらに sessionCookie が存在するかチェックすることで、後の null エラーを防ぐ
    if (!result.ok || !result.sessionCookie) {
      const errorMessage =
        result.error === "not_found"
          ? "ユーザーが見つかりません"
          : "パスワードが正しくありません";
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    // ここまで来れば、TypeScriptは「sessionCookie は絶対に null ではない」と確信します
    const { sessionCookie, user } = result;

    const response = NextResponse.json({
      message: "ログインに成功しました",
      user: user,
    });

    // Cookieをセット
    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
