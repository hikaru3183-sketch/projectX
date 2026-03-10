"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { Popup } from "@/components/auth/Popup";
import { AuthCard } from "@/components/auth/AuthCard";
import { authClient } from "@/lib/auth/auth-client";

export default function RegisterPage() {
  // メールアドレス形式にするため、変数名を email に戻します
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<"success" | "error" | "duplicate" | null>(
    null,
  );
  const router = useRouter();

  const handleRegister = async () => {
    // 標準の signUp.email を使用。これで型エラーは完全に消えます。
    const { data, error } = await authClient.signUp.email({
      email: email, // 入力されたメールアドレス
      password: password, // 入力されたパスワード
      name: email.split("@")[0], // 名前の入力欄がないので、とりあえずメアドの前半を名前に
    });

    if (error) {
      // Better Auth の標準エラーコードで重複チェック
      if (error.code === "USER_ALREADY_EXISTS") {
        setPopup("duplicate");
      } else {
        console.error("SignUp Error:", error);
        setPopup("error");
      }
      return;
    }

    setPopup("success");

    setTimeout(() => {
      // 登録と同時にログインされる設定（autoSignIn: true）なので、そのままトップへ
      window.location.href = "/";
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <AuthCard title="アカウント作成">
        <AuthInput
          type="email" // 正しく email に設定
          placeholder="メールアドレス (test@example.com等)"
          value={email}
          onChange={setEmail}
        />
        <AuthInput
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={setPassword}
        />
        <AuthButton label="登録" color="sky" onClick={handleRegister} />
      </AuthCard>

      {/* ポップアップ */}
      {popup === "success" && (
        <Popup
          type="success"
          message="作成成功！"
          color="green"
          onClose={() => setPopup(null)}
        />
      )}
      {popup === "error" && (
        <Popup
          type="error"
          message="作成失敗…形式を確認してください"
          color="red"
          onClose={() => setPopup(null)}
        />
      )}
      {popup === "duplicate" && (
        <Popup
          type="error"
          message="既に登録されているメールアドレスです"
          color="yellow"
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}
