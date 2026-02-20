import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params; // ← ★ Promise を await する

  if (!id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const user = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.id, id))
    .limit(1);

  if (!user.length) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user[0]);
}
