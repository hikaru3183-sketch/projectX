import { db } from "@/drizzle/db";
import { appUsers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, coins } = body;

  if (isNaN(Number(userId)) || coins === undefined) {
    return Response.json({ error: "Invalid params" }, { status: 400 });
  }

  await db
    .update(appUsers)
    .set({ coins })
    .where(eq(appUsers.id, Number(userId)));

  return Response.json({ ok: true });
}
