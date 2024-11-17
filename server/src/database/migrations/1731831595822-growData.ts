import { MigrationInterface, QueryRunner } from 'typeorm';

export class GrowData1731831595822 implements MigrationInterface {
  name = 'GrowData1731831595822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "growdata_exchanges" (
                "exchange_id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_04b62ddb093081ed52afa3fa685" PRIMARY KEY ("exchange_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "growdata_simply_grow_tokens" (
                "asset_id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "icon_url" character varying NOT NULL,
                "apy" character varying,
                CONSTRAINT "PK_636cc1eb38c728c0758744763d0" PRIMARY KEY ("asset_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "growdata_arbitrage_pairs" (
                "symbol" SERIAL NOT NULL,
                "base_symbol" character varying NOT NULL,
                "target_symbol" character varying NOT NULL,
                "base_asset_id" character varying NOT NULL,
                "base_icon_url" character varying NOT NULL,
                "target_asset_id" character varying NOT NULL,
                "target_icon_url" character varying NOT NULL,
                "base_price" character varying,
                "target_price" character varying,
                "exchange_id" integer,
                CONSTRAINT "PK_6c4830c50cbe1adbeb529626487" PRIMARY KEY ("symbol")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "growdata_market_making_pairs" (
                "symbol" SERIAL NOT NULL,
                "base_symbol" character varying NOT NULL,
                "target_symbol" character varying NOT NULL,
                "base_asset_id" character varying NOT NULL,
                "base_icon_url" character varying NOT NULL,
                "target_asset_id" character varying NOT NULL,
                "target_icon_url" character varying NOT NULL,
                "base_price" character varying,
                "target_price" character varying,
                "exchange_id" integer,
                CONSTRAINT "PK_8dea9cd25cb323e4f4eae5ed62a" PRIMARY KEY ("symbol")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "growdata_market_making_pairs" DROP CONSTRAINT "FK_8b49b25972265ebec6f7b52fbbd"
        `);
    await queryRunner.query(`
            ALTER TABLE "growdata_arbitrage_pairs" DROP CONSTRAINT "FK_0bee858dd2f5ac568e1b246deda"
        `);
    await queryRunner.query(`
            DROP TABLE "growdata_market_making_pairs"
        `);
    await queryRunner.query(`
            DROP TABLE "growdata_arbitrage_pairs"
        `);
    await queryRunner.query(`
            DROP TABLE "growdata_simply_grow_tokens"
        `);
    await queryRunner.query(`
            DROP TABLE "growdata_exchanges"
        `);
  }
}
