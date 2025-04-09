CREATE TABLE "project_managers" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar NOT NULL,
	"company_name" varchar,
	"position" varchar,
	"email" varchar,
	"phone" varchar,
	"is_external" boolean DEFAULT false,
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "project_editors" ADD COLUMN "role" varchar DEFAULT 'viewer' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "manager_id" integer;--> statement-breakpoint
ALTER TABLE "project_managers" ADD CONSTRAINT "project_managers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_manager_id_project_managers_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."project_managers"("id") ON DELETE no action ON UPDATE no action;