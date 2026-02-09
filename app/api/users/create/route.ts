import { db } from "@/drizzle/db";
import { appUsers } from "@/drizzle/schema";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  // パスワードをハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // DB に保存
  await db.insert(appUsers).values({
    email,
    password: hashedPassword,
  });

  return Response.json({ ok: true });
}
