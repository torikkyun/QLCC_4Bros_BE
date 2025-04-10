CREATE TYPE "public"."election_status" AS ENUM('upcoming', 'ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."room_status" AS ENUM('occupied', 'vacant');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('user', 'manager');--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" integer PRIMARY KEY NOT NULL,
	"introduction" varchar(200),
	"description" varchar(100),
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "election_details" (
	"election_id" integer NOT NULL,
	"candidate_id" integer NOT NULL,
	CONSTRAINT "election_details_election_id_candidate_id_pk" PRIMARY KEY("election_id","candidate_id")
);
--> statement-breakpoint
CREATE TABLE "elections" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "elections_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(50) NOT NULL,
	"description" varchar(100),
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "election_status" DEFAULT 'upcoming' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" integer PRIMARY KEY NOT NULL,
	"room_number" varchar(5) NOT NULL,
	"price" integer NOT NULL,
	"status" "room_status" DEFAULT 'vacant' NOT NULL,
	"description" varchar(100),
	"userId" integer,
	CONSTRAINT "rooms_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(50) NOT NULL,
	"password" varchar(50) NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"role" "roles" DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"voteAt" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"election_id" integer NOT NULL,
	"candidate_id" integer NOT NULL,
	CONSTRAINT "votes_election_id_user_id_pk" PRIMARY KEY("election_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "election_details" ADD CONSTRAINT "election_details_election_id_elections_id_fk" FOREIGN KEY ("election_id") REFERENCES "public"."elections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "election_details" ADD CONSTRAINT "election_details_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_election_id_elections_id_fk" FOREIGN KEY ("election_id") REFERENCES "public"."elections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;