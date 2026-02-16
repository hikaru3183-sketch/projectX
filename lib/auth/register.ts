import { db } from "@/lib/db/db";
import { appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/lucia";
import { hashPassword } from "./hash";
import { nanoid } from "nanoid";

export async function registerUser(email: string, password: string) {
  const exists = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, email))
    .limit(1);

  if (exists.length > 0) {
    return {
      ok: false,
      error: "duplicate",
      user: null,
      sessionCookie: null,
    };
  }

  const hashed = await hashPassword(password);
  const userId = nanoid();

  const [user] = await db
    .insert(appUsers)
    .values({
      id: userId,
      email,
      password: hashed,
    })
    .returning();

  const session = await auth.createSession(user.id, {});
  const sessionCookie = auth.createSessionCookie(session.id);

  return {
    ok: true,
    error: null,
    user: { id: user.id, email: user.email },
    sessionCookie,
  };
}
