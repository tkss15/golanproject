ALTER TABLE "project_settlements" ALTER COLUMN "is_main_settlement" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "settlement_statistics" ADD COLUMN "topics_of_interest" text[];--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_suspended" boolean DEFAULT false;