"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { Popup } from "@/components/auth/Popup";
import { AuthCard } from "@/components/auth/AuthCard";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<"success" | "error" | "duplicate" | null>(
    null,
  );
  const router = useRouter();

  async function handleRegister() {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "duplicate") {
          setPopup("duplicate");
        } else {
          setPopup("error");
        }
        return;
      }

      // 必要ならユーザー情報を保存
      localStorage.setItem("user", JSON.stringify(data.user));
      setPopup("success");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1200);
    } catch (err) {
      console.error(err);
      setPopup("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <AuthCard title="アカウント作成">
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

        <AuthButton label="登録" color="sky" onClick={handleRegister} />
      </AuthCard>

      {popup === "success" && (
        <Popup
          type="success"
          message="アカウント作成成功！"
          color="green"
          onClose={() => setPopup(null)}
        />
      )}
      {popup === "error" && (
        <Popup
          type="error"
          message="登録に失敗しました…"
          color="red"
          onClose={() => setPopup(null)}
        />
      )}
      {popup === "duplicate" && (
        <Popup
          type="duplicate"
          message="このアカウントは既に使われています"
          color="yellow"
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}
