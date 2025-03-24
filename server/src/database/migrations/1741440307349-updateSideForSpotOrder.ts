import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1741440307349 implements MigrationInterface {
  name = 'Migrations1741440307349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "spot_order"
            ADD "side" character varying NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "spot_order" DROP COLUMN "side"
        `);
  }
}
