"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { Popup } from "@/components/auth/Popup";
import { AuthCard } from "@/components/auth/AuthCard";

// クライアント用インスタンスをインポート
import { authClient } from "@/lib/auth/auth-client"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<"success" | "error" | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    // authClientが直接ログイン処理を行い、クッキーも自動保存します
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      console.error("Login Error:", error.message);
      setPopup("error");
      return;
    }

    setPopup("success");

    // ログイン情報を反映させるため、少し待ってからトップへ
    setTimeout(() => {
      router.push("/");
      router.refresh(); 
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <AuthCard title="ログイン">
        <AuthInput
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={setEmail}
        />
        <AuthInput
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={setPassword}
        />
        <AuthButton label="ログイン" onClick={handleLogin} />
      </AuthCard>
      
      <button
        onClick={() => router.push("/register")}
        className="mt-5 px-5 py-3 text-base bg-sky-500 text-white font-bold rounded-lg shadow hover:bg-sky-600 transition"
      >
        アカウント作成
      </button>

      {popup === "success" && (
        <Popup type="success" message="ログイン成功！" color="green" onClose={() => setPopup(null)} />
      )}
      {popup === "error" && (
        <Popup type="error" message="ログイン失敗…" color="red" onClose={() => setPopup(null)} />
      )}
    </div>
  );
}