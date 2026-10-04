import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1791112112136 implements MigrationInterface {
    name = 'Init1791112112136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."sources_mediatype_enum" AS ENUM('movie', 'episode')`);
        await queryRunner.query(`CREATE TYPE "public"."sources_type_enum" AS ENUM('streaming', 'rent', 'buy', 'free', 'ads', 'download', 'torrent', 'embed')`);
        await queryRunner.query(`CREATE TABLE "sources" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "databaseId" integer NOT NULL, "mediaType" "public"."sources_mediatype_enum" NOT NULL, "tvId" integer, "seasonNumber" integer, "episodeNumber" integer, "type" "public"."sources_type_enum" NOT NULL, "url" text NOT NULL, "provider" character varying(100) NOT NULL, "providerId" integer, "country" character(2), "language" character(2), "subtitles" text array NOT NULL DEFAULT '{}', "quality" character varying(10), "price" numeric(8,2), "currency" character(3), "isActive" boolean NOT NULL DEFAULT true, "lastCheckedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "CHK_bc781e9443ca7af9529f102f3b" CHECK (("mediaType" = 'movie' AND "episodeNumber" IS NULL) OR ("mediaType" = 'episode' AND "tvId" IS NOT NULL)), CONSTRAINT "PK_85523beafe5a2a6b90b02096443" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1d79eb1d28811c033a8aac5343" ON "sources"  ("mediaType", "databaseId", "url") `);
        await queryRunner.query(`CREATE INDEX "IDX_aee5cf930ac9d5389a15253958" ON "sources"  ("mediaType", "databaseId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_aee5cf930ac9d5389a15253958"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d79eb1d28811c033a8aac5343"`);
        await queryRunner.query(`DROP TABLE "sources"`);
        await queryRunner.query(`DROP TYPE "public"."sources_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."sources_mediatype_enum"`);
    }

}
