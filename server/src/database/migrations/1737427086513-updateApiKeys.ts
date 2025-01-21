import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1737427086513 implements MigrationInterface {
  name = 'Migrations1737427086513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "withdrawal_record" (
                "id" character varying NOT NULL,
                "api_key_id" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "amount" character varying NOT NULL,
                "network" character varying NOT NULL,
                "tx_hash" character varying NOT NULL,
                "address" character varying NOT NULL,
                "memo" character varying,
                "gas_fee" character varying,
                "gas_fee_usd" character varying,
                "created_at" character varying NOT NULL,
                CONSTRAINT "PK_fa66fefa4f12d12795cb653bed0" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "exchange_api_keys_config"
            ADD "enable" boolean NOT NULL DEFAULT true
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "exchange_api_keys_config" DROP COLUMN "enable"
        `);
    await queryRunner.query(`
            DROP TABLE "withdrawal_record"
        `);
  }
}
