import { redirect } from "next/navigation";

export default function RootPage() {
  // アクセスが来たら即座に /ja へ飛ばす
  redirect("/ja");
}