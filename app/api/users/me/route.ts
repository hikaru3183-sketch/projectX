import { db } from "@/drizzle/db";
import { appUsers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));

  if (isNaN(userId)) {
    return Response.json({ error: "Invalid userId" }, { status: 400 });
  }

  const user = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.id, userId))
    .limit(1);

  return Response.json(user[0] ?? null);
}
