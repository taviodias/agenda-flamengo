CREATE TABLE "fla_sync_match" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_id" integer NOT NULL,
	"opponent" varchar(255) NOT NULL,
	"competition" varchar(255) NOT NULL,
	"is_home" boolean DEFAULT true NOT NULL,
	"match_date" timestamp,
	"status" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "fla_sync_match_api_id_unique" UNIQUE("api_id")
);
--> statement-breakpoint
CREATE TABLE "fla_sync_subscriber" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"refresh_token" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "fla_sync_subscriber_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "fla_sync_user_match" (
	"subscriberId" varchar(255) NOT NULL,
	"matchId" integer NOT NULL,
	"googleEventId" varchar(255) NOT NULL,
	CONSTRAINT "fla_sync_user_match_subscriberId_matchId_pk" PRIMARY KEY("subscriberId","matchId")
);
--> statement-breakpoint
ALTER TABLE "fla_sync_user_match" ADD CONSTRAINT "fla_sync_user_match_subscriberId_fla_sync_subscriber_id_fk" FOREIGN KEY ("subscriberId") REFERENCES "public"."fla_sync_subscriber"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fla_sync_user_match" ADD CONSTRAINT "fla_sync_user_match_matchId_fla_sync_match_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."fla_sync_match"("id") ON DELETE cascade ON UPDATE no action;