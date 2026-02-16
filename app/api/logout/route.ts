import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "ログアウトしました" });

  // Cookie を削除
  response.cookies.set("auth_session", "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}
