import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // sendBeacon からの Blob データも json() で解析可能です
    const data = await req.json();
    const { userId, coins } = data;

    if (!userId || coins === undefined) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await db.update(appUsers).set({ coins }).where(eq(appUsers.id, userId));

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
