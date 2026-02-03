"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    const { error } = await supabase.from("users").insert({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("登録完了！");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>ユーザー登録</h1>

      <input
        type="email"
        placeholder="メール（架空でもOK）"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignUp}>登録</button>

      <p>{message}</p>
    </div>
  );
}
