"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { Popup } from "@/components/auth/Popup";
import { AuthCard } from "@/components/auth/AuthCard";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<"success" | "error" | null>(null);
  const router = useRouter();

  const login = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setPopup("error");
      return;
    }

    // 必要ならユーザー情報を保存
    localStorage.setItem("user", JSON.stringify(data.user));

    setPopup("success");

    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1200);
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center bg-green-50">
      <AuthCard title="ログイン">
        <AuthInput
          type="email"
          placeholder="アカウント名"
          value={email}
          onChange={setEmail}
        />
        <AuthInput
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={setPassword}
        />
        <AuthButton label="ログイン" onClick={login} />
      </AuthCard>
      <button
        onClick={() => router.push("/register")}
        className=" mt-5 px-5 py-3 text-base bg-sky-500 text-white font-bold rounded-lg shadow hover:bg-sky-600 transition"
      >
        アカウント作成
      </button>
      {popup === "success" && (
        <Popup
          type="success"
          message="ログイン成功！"
          color="green"
          onClose={() => setPopup(null)}
        />
      )}
      {popup === "error" && (
        <Popup
          type="error"
          message="ログイン失敗…"
          color="red"
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}
