// app/api/login/route.ts
import { loginUser } from "@/lib/auth/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const result = await loginUser(email, password);
  return Response.json(result);
}
