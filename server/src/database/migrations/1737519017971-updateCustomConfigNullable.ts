import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1737519017971 implements MigrationInterface {
  name = 'Migrations1737519017971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ALTER COLUMN "max_balance_mixin_bot" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ALTER COLUMN "max_balance_single_api_key" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ALTER COLUMN "funding_account" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ALTER COLUMN "funding_account"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ALTER COLUMN "max_balance_single_api_key"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ALTER COLUMN "max_balance_mixin_bot"
            SET NOT NULL
        `);
  }
}
