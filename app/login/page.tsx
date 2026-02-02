"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<"success" | "error" | null>(null);
  const router = useRouter();

  // ★ Firestore にユーザーデータを作成
  const createUserDocIfNotExists = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email,
        coins: 30000, // 初期値
        updatedAt: Date.now(),
      },
      { merge: true },
    );
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // ★ Firestore にユーザーデータ作成
      await createUserDocIfNotExists();

      setPopup("success");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (error) {
      console.error(error);
      setPopup("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 relative">
      <ul className="text-sm font-bold text-gray-600 mb-2 space-y-1 text-center">
        <li>h@projectx.com / password1</li>
        <li>n@projectx.com / password2</li>
        <li>t@projectx.com / password3</li>
        <li>k@projectx.com / password4</li>
      </ul>

      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-green-200">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8 font-['VT323'] tracking-wide">
          ログイン
        </h1>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={login}
          className="w-full py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg transition"
        >
          ログイン
        </button>
      </div>

      {popup === "success" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center border-2 border-green-400">
            <p className="text-xl font-bold text-green-600 mb-4">
              ログイン成功！
            </p>
            <button
              onClick={() => setPopup(null)}
              className="px-4 py-2 bg-green-500 text-white rounded font-bold shadow hover:bg-green-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {popup === "error" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center border-2 border-red-400">
            <p className="text-xl font-bold text-red-600 mb-4">ログイン失敗…</p>
            <button
              onClick={() => setPopup(null)}
              className="px-4 py-2 bg-red-500 text-white rounded font-bold shadow hover:bg-red-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
