import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_privacy_policy_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__privacy_policy_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_terms_of_service_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__terms_of_service_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "privacy_policy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_status" "enum_privacy_policy_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_privacy_policy_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_content" jsonb,
  	"version__status" "enum__privacy_policy_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "terms_of_service" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_status" "enum_terms_of_service_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_terms_of_service_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_content" jsonb,
  	"version__status" "enum__terms_of_service_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE INDEX "privacy_policy__status_idx" ON "privacy_policy" USING btree ("_status");
  CREATE INDEX "_privacy_policy_v_version_version__status_idx" ON "_privacy_policy_v" USING btree ("version__status");
  CREATE INDEX "_privacy_policy_v_created_at_idx" ON "_privacy_policy_v" USING btree ("created_at");
  CREATE INDEX "_privacy_policy_v_updated_at_idx" ON "_privacy_policy_v" USING btree ("updated_at");
  CREATE INDEX "_privacy_policy_v_latest_idx" ON "_privacy_policy_v" USING btree ("latest");
  CREATE INDEX "_privacy_policy_v_autosave_idx" ON "_privacy_policy_v" USING btree ("autosave");
  CREATE INDEX "terms_of_service__status_idx" ON "terms_of_service" USING btree ("_status");
  CREATE INDEX "_terms_of_service_v_version_version__status_idx" ON "_terms_of_service_v" USING btree ("version__status");
  CREATE INDEX "_terms_of_service_v_created_at_idx" ON "_terms_of_service_v" USING btree ("created_at");
  CREATE INDEX "_terms_of_service_v_updated_at_idx" ON "_terms_of_service_v" USING btree ("updated_at");
  CREATE INDEX "_terms_of_service_v_latest_idx" ON "_terms_of_service_v" USING btree ("latest");
  CREATE INDEX "_terms_of_service_v_autosave_idx" ON "_terms_of_service_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "privacy_policy" CASCADE;
  DROP TABLE "_privacy_policy_v" CASCADE;
  DROP TABLE "terms_of_service" CASCADE;
  DROP TABLE "_terms_of_service_v" CASCADE;
  DROP TYPE "public"."enum_privacy_policy_status";
  DROP TYPE "public"."enum__privacy_policy_v_version_status";
  DROP TYPE "public"."enum_terms_of_service_status";
  DROP TYPE "public"."enum__terms_of_service_v_version_status";`)
}
