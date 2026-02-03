import { db } from "@/drizzle/db";
import { appUsers } from "@/drizzle/schema";

export async function POST(req: Request) {
  const body = await req.json();

  await db.insert(appUsers).values({
    email: body.email,
    password: body.password,
  });

  return Response.json({ ok: true });
}
