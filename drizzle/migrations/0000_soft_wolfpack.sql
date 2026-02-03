CREATE TABLE "scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"game" text NOT NULL,
	"value" integer DEFAULT 0
);
