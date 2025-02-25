CREATE TABLE IF NOT EXISTS "departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"department_name" varchar NOT NULL,
	"project_type" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "funding_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_name" varchar NOT NULL,
	"source_type" varchar,
	"contact_details" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_editors" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"editor_id" integer NOT NULL,
	"added_at" timestamp DEFAULT now(),
	"added_by" integer NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"file_name" varchar NOT NULL,
	"file_path" text NOT NULL,
	"file_size" integer NOT NULL,
	"file_type" varchar NOT NULL,
	"uploaded_by" integer NOT NULL,
	"upload_date" timestamp DEFAULT now(),
	"description" text,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_funding_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"funding_source_id" integer NOT NULL,
	"allocated_amount" numeric(10, 2),
	"allocation_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"action_type" varchar NOT NULL,
	"module" varchar NOT NULL,
	"description" text NOT NULL,
	"previous_state" jsonb,
	"new_state" jsonb,
	"created_at" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_settlements" (
	"project_id" integer NOT NULL,
	"settlement_id" integer NOT NULL,
	"is_main_settlement" boolean DEFAULT false,
	"budget_allocation" numeric(10, 2),
	"specific_goals" jsonb,
	"settlement_status" varchar,
	"milestones" jsonb,
	"start_date" timestamp,
	"end_date" timestamp,
	"timeline_status" varchar,
	"actual_completion_date" timestamp,
	"milestone_progress" jsonb,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_name" varchar NOT NULL,
	"owner_id" integer NOT NULL,
	"description" text,
	"budget" numeric(10, 2),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"status" varchar NOT NULL,
	"priority" integer,
	"department_id" integer NOT NULL,
	"contact_email" varchar,
	"contact_phone" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settlement_statistics" (
	"id" serial NOT NULL,
	"settlement_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"house_holds" integer NOT NULL,
	"population" integer NOT NULL,
	"population_2030" integer NOT NULL,
	"growth_rate" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settlements" (
	"settlement_id" serial PRIMARY KEY NOT NULL,
	"settlement_name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"kinde_id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"picture" text,
	"role" varchar DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_login" timestamp,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "users_kinde_id_unique" UNIQUE("kinde_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_editors" ADD CONSTRAINT "project_editors_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_editors" ADD CONSTRAINT "project_editors_editor_id_users_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_editors" ADD CONSTRAINT "project_editors_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_files" ADD CONSTRAINT "project_files_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_files" ADD CONSTRAINT "project_files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_funding_sources" ADD CONSTRAINT "project_funding_sources_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_funding_sources" ADD CONSTRAINT "project_funding_sources_funding_source_id_funding_sources_id_fk" FOREIGN KEY ("funding_source_id") REFERENCES "public"."funding_sources"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_logs" ADD CONSTRAINT "project_logs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_logs" ADD CONSTRAINT "project_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_settlements" ADD CONSTRAINT "project_settlements_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_settlements" ADD CONSTRAINT "project_settlements_settlement_id_settlements_settlement_id_fk" FOREIGN KEY ("settlement_id") REFERENCES "public"."settlements"("settlement_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "settlement_statistics" ADD CONSTRAINT "settlement_statistics_settlement_id_settlements_settlement_id_fk" FOREIGN KEY ("settlement_id") REFERENCES "public"."settlements"("settlement_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
