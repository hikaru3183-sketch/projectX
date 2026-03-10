import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { userId, coins, items, stockItems } = data;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await db
      .update(appUsers)
      .set({
        coins,
        items: JSON.stringify(items),
        stockItems: JSON.stringify(stockItems),
      })
      .where(eq(appUsers.id, userId));

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
