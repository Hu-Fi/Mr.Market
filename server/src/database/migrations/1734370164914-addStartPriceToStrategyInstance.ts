import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStartPriceToStrategyInstance1734370164914
  implements MigrationInterface
{
  name = 'AddStartPriceToStrategyInstance1734370164914';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "strategy_instances"
            ADD "startPrice" integer NOT NULL DEFAULT 0
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "strategy_instances" DROP COLUMN "startPrice"
        `);
  }
}
