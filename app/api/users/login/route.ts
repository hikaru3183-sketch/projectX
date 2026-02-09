import { db } from "@/drizzle/db";
import { appUsers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const user = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, email))
    .limit(1);

  if (user.length === 0) {
    return Response.json({ ok: false, error: "not_found" });
  }

  const ok = await bcrypt.compare(password, user[0].password);
  if (!ok) {
    return Response.json({ ok: false, error: "wrong_password" });
  }

  return Response.json({
    ok: true,
    user: {
      id: user[0].id,
      email: user[0].email,
      coins: user[0].coins,
    },
  });
}
