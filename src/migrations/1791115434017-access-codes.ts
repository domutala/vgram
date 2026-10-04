import { MigrationInterface, QueryRunner } from "typeorm";

export class AccessCodes1791115434017 implements MigrationInterface {
    name = 'AccessCodes1791115434017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "access_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying(100) NOT NULL, "codeHash" character(64) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "expiresAt" TIMESTAMP WITH TIME ZONE, "lastUsedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_702e128569c0cdfeb9cea561cdb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8c6cbb60637b596c28b09e4a1c" ON "access_codes"  ("codeHash") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8c6cbb60637b596c28b09e4a1c"`);
        await queryRunner.query(`DROP TABLE "access_codes"`);
    }

}
