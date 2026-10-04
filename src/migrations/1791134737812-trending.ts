import { MigrationInterface, QueryRunner } from "typeorm";

export class Trending1791134737812 implements MigrationInterface {
    name = 'Trending1791134737812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trendings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "showId" integer NOT NULL, "position" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_ea2c9e88b679ad714c16043377a" UNIQUE ("showId"), CONSTRAINT "PK_5b5148738629445d77b3509ae49" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "trendings"`);
    }

}
