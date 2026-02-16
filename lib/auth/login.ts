import { db } from "@/lib/db/db";
import { appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/lucia";
import { verify } from "@node-rs/argon2";

export async function loginUser(email: string, password: string) {
  const [user] = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, email))
    .limit(1);

  if (!user)
    return { ok: false, error: "not_found", user: null, sessionCookie: null };

  const ok = await verify(user.password, password);
  if (!ok)
    return {
      ok: false,
      error: "wrong_password",
      user: null,
      sessionCookie: null,
    };

  const session = await auth.createSession(user.id, {});
  const sessionCookie = auth.createSessionCookie(session.id);

  return {
    ok: true,
    error: null,
    user: { id: user.id, email: user.email },
    sessionCookie,
  };
}
