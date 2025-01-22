import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1737518178517 implements MigrationInterface {
  name = 'Migrations1737518178517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
                RENAME COLUMN "config_id" TO "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
                RENAME CONSTRAINT "PK_7ba5aed5b83b9515ebb4cff37d8" TO "PK_e63f1c1bd79520c0d5728262035"
        `);
    await queryRunner.query(`
            ALTER SEQUENCE "custom_config_entity_config_id_seq"
            RENAME TO "custom_config_entity_name_seq"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity" DROP CONSTRAINT "PK_e63f1c1bd79520c0d5728262035"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ADD "name" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ADD CONSTRAINT "PK_e63f1c1bd79520c0d5728262035" PRIMARY KEY ("name")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity" DROP CONSTRAINT "PK_e63f1c1bd79520c0d5728262035"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ADD "name" SERIAL NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ADD CONSTRAINT "PK_e63f1c1bd79520c0d5728262035" PRIMARY KEY ("name")
        `);
    await queryRunner.query(`
            ALTER SEQUENCE "custom_config_entity_name_seq"
            RENAME TO "custom_config_entity_config_id_seq"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
                RENAME CONSTRAINT "PK_e63f1c1bd79520c0d5728262035" TO "PK_7ba5aed5b83b9515ebb4cff37d8"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
                RENAME COLUMN "name" TO "config_id"
        `);
  }
}
