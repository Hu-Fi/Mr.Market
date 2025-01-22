import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1737518386373 implements MigrationInterface {
  name = 'Migrations1737518386373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
                RENAME COLUMN "name" TO "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
                RENAME CONSTRAINT "PK_e63f1c1bd79520c0d5728262035" TO "PK_3f234e758d2d4d91305b9f2aae5"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity" DROP CONSTRAINT "PK_3f234e758d2d4d91305b9f2aae5"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity" DROP COLUMN "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ADD "id" integer NOT NULL DEFAULT '1'
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ADD CONSTRAINT "PK_3f234e758d2d4d91305b9f2aae5" PRIMARY KEY ("id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity" DROP CONSTRAINT "PK_3f234e758d2d4d91305b9f2aae5"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity" DROP COLUMN "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ADD "id" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ADD CONSTRAINT "PK_3f234e758d2d4d91305b9f2aae5" PRIMARY KEY ("id")
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
                RENAME CONSTRAINT "PK_3f234e758d2d4d91305b9f2aae5" TO "PK_e63f1c1bd79520c0d5728262035"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
                RENAME COLUMN "id" TO "name"
        `);
  }
}
