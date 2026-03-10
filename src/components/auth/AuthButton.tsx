"use client";

type Props = {
  label: string;
  color?: "green" | "sky";
  onClick: () => void;
};

export function AuthButton({ label, color = "green", onClick }: Props) {
  const base =
    color === "green"
      ? "bg-green-500 hover:bg-green-600"
      : "bg-sky-500 hover:bg-sky-600";

  return (
    <button
      onClick={onClick}
      className={`w-full py-3 text-white font-bold rounded-lg shadow-md ${base} hover:shadow-lg transition`}
    >
      {label}
    </button>
  );
}
