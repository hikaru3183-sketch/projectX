import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { z } from "zod";
import { cookies } from "next/headers"; // Next.js standard

const schema = z.object({
  content: z.string().min(1).max(500),
});

export async function POST(req: Request) {
  // 1. Await the cookies() promise
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Validate the session with Lucia
  const { session, user } = await auth.validateSession(sessionId);
  // 3. Handle invalid sessions/CSRF
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return new Response("Invalid content", { status: 400 });
  }

  await db.insert(posts).values({
    // In v3, the ID is just 'user.id', not 'user.userId'
    userId: user.id,
    content: parsed.data.content,
  });

  return new Response("OK");
}
