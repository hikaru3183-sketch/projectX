import { auth } from "@/lib/auth/lucia";

export async function logoutUser(sessionId: string) {
  await auth.invalidateSession(sessionId);
  const blank = auth.createBlankSessionCookie();

  return {
    ok: true,
    blankCookie: blank,
  };
}
