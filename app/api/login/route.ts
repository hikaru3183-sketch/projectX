import { loginUser } from "@/lib/auth/login";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // バリデーション
    if (!email || !password) {
      return NextResponse.json(
        { error: "メールアドレスとパスワードを入力してください" },
        { status: 400 },
      );
    }

    // auth.ts で作った loginUser を実行
    const result = await loginUser(email, password);

    if (!result.ok) {
      // エラー内容に応じたメッセージを返す
      const errorMessage =
        result.error === "not_found"
          ? "ユーザーが見つかりません"
          : "パスワードが正しくありません";

      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    // 成功時
    return NextResponse.json({
      message: "ログインに成功しました",
      user: result.user,
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}
