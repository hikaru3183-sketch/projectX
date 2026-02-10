import { verifyToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db/db";
import { appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return Response.json({ error: "No token" }, { status: 401 });
  }

  const token = auth.replace("Bearer ", "");
  const payload = verifyToken(token);

  if (!payload) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const result = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.id, payload.userId));

  if (result.length === 0) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(result[0]);
}
