"use client";

import { useRouter } from "next/navigation";

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <>
      <header
        className="fixed top-0 left-0 z-[9999] bg-black text-white 
             px-2 py-0.5 w-full"
      >
        <button
          onClick={() => router.push("/")}
          className="text-base font-bold hover:opacity-70 transition"
        >
          ← ホーム
        </button>
      </header>

      <main>{children}</main>
    </>
  );
}
