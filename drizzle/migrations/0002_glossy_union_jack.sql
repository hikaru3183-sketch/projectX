ALTER TABLE "scores" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "app_users" ADD COLUMN "coins" integer DEFAULT 10000;--> statement-breakpoint
ALTER TABLE "scores" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_user_id_app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_users" ADD CONSTRAINT "app_users_email_unique" UNIQUE("email");