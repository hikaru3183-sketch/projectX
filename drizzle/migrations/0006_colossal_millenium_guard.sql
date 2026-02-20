CREATE TABLE "drills" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "drills_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"value" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "app_users" ADD COLUMN "coins" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "drills" ADD CONSTRAINT "drills_user_id_app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE no action ON UPDATE no action;