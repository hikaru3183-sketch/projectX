import { db } from "@/drizzle/db";
import { scores } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));

  if (isNaN(userId)) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(scores)
    .where(eq(scores.userId, userId));

  return Response.json({ scores: result });
}
