import Link from "next/link";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="fixed top-0 left-0 z-[9999] bg-black text-white px-2 py-0.5 w-full">
        <Link
          href="/"
          className="text-base font-bold hover:opacity-70 transition"
        >
          ← ホーム
        </Link>
      </header>

      <main>{children}</main>
    </>
  );
}
