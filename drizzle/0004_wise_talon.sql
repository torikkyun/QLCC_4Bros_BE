ALTER TABLE "rooms" DROP CONSTRAINT "rooms_userId_unique";--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_room_number_unique" UNIQUE("room_number");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");