// app/api/users/create/route.ts
import { registerUser } from "@/lib/auth/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const result = await registerUser(email, password);

  return Response.json(result);
}
