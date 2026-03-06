ALTER TABLE "app_users" ALTER COLUMN "coins" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app_users" ADD COLUMN "max_streak" integer DEFAULT 0 NOT NULL;