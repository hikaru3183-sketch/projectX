// lib/auth/lucia.ts
import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/lib/db/db";
import { appUsers, sessions } from "@/lib/db/schema";

// 1. Ensure the adapter is instantiated correctly
const adapter = new DrizzlePostgreSQLAdapter(db, sessions, appUsers);

// 2. Lucia v3 constructor
export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: DatabaseUser;
  }
}

interface DatabaseUser {
  email: string;
}
