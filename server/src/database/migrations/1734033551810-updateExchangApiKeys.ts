import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateExchangeApiKeys1734033551810 implements MigrationInterface {
  name = 'UpdateExchangeApiKeys1734033551810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "exchange_api_keys_config"
            ALTER COLUMN "api_extra" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "exchange_api_keys_config"
            ALTER COLUMN "api_extra"
            SET NOT NULL
        `);
  }
}
