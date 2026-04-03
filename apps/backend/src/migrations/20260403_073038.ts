import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_publishedat_tz" AS ENUM('Asia/Kathmandu', 'Asia/Dubai');
  CREATE TYPE "public"."enum__articles_v_version_publishedat_tz" AS ENUM('Asia/Kathmandu', 'Asia/Dubai');
  ALTER TABLE "articles" ADD COLUMN "published_at" timestamp(3) with time zone;
  ALTER TABLE "articles" ADD COLUMN "publishedat_tz" "enum_articles_publishedat_tz" DEFAULT 'Asia/Kathmandu';
  ALTER TABLE "_articles_v" ADD COLUMN "version_published_at" timestamp(3) with time zone;
  ALTER TABLE "_articles_v" ADD COLUMN "version_publishedat_tz" "enum__articles_v_version_publishedat_tz" DEFAULT 'Asia/Kathmandu';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "published_at";
  ALTER TABLE "articles" DROP COLUMN "publishedat_tz";
  ALTER TABLE "_articles_v" DROP COLUMN "version_published_at";
  ALTER TABLE "_articles_v" DROP COLUMN "version_publishedat_tz";
  DROP TYPE "public"."enum_articles_publishedat_tz";
  DROP TYPE "public"."enum__articles_v_version_publishedat_tz";`)
}
