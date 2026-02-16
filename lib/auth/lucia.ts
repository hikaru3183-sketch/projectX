// lib/auth/lucia.ts
import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/lib/db/db";
import { appUsers, sessions } from "@/lib/db/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, appUsers);

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

// Lucia v3 の型拡張
declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: {
      email: string;
    };
  }
}
