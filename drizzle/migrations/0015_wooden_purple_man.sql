DROP TABLE "account" CASCADE;--> statement-breakpoint
DROP TABLE "verification" CASCADE;--> statement-breakpoint
ALTER TABLE "app_users" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "app_users" DROP COLUMN "email_verified";--> statement-breakpoint
ALTER TABLE "app_users" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "app_users" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "token";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "ip_address";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "user_agent";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "updated_at";