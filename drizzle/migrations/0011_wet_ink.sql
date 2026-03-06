ALTER TABLE "drills" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "drills" CASCADE;--> statement-breakpoint
DROP TABLE "posts" CASCADE;--> statement-breakpoint
DROP TABLE "sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "scores" ALTER COLUMN "value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "scores" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "app_users" DROP COLUMN "max_streak";--> statement-breakpoint
ALTER TABLE "scores" DROP COLUMN "created_at";