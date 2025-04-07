import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1742997906010 implements MigrationInterface {
  name = 'Migrations1742997906010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "spot_order"
            ADD "filledAmount" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "spot_order"
            ADD "executionPrice" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "spot_order" DROP COLUMN "executionPrice"
        `);
    await queryRunner.query(`
            ALTER TABLE "spot_order" DROP COLUMN "filledAmount"
        `);
  }
}
