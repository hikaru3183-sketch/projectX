import { db } from "./db";
import { appUsers, scores } from "./schema";
import { eq } from "drizzle-orm";

export async function createUser(email: string, passwordHash: string) {
  return db
    .insert(appUsers)
    .values({
      email,
      password: passwordHash,
    })
    .returning();
}

export async function findUserByEmail(email: string) {
  return db.select().from(appUsers).where(eq(appUsers.email, email));
}

export async function addScore(userId: number, game: string, value: number) {
  return db
    .insert(scores)
    .values({
      userId,
      game,
      value,
    })
    .returning();
}
