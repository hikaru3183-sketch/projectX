// app/api/coins/update/route.ts
import { verifyToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db/db";
import { appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ error: "No token" }, { status: 401 });
  }

  const token = auth.replace("Bearer ", "");
  const payload = verifyToken(token);

  if (!payload) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const { coins } = await req.json();

  if (coins === undefined || isNaN(Number(coins))) {
    return Response.json({ error: "Invalid coins" }, { status: 400 });
  }

  await db
    .update(appUsers)
    .set({ coins: Number(coins) })
    .where(eq(appUsers.id, payload.userId));

  return Response.json({ ok: true });
}
