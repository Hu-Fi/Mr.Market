import { MigrationInterface, QueryRunner } from 'typeorm';

export class GrowData1731831595822 implements MigrationInterface {
  name = 'GrowData1731831595822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "growdata_exchanges" (
            "exchange_id" SERIAL NOT NULL,
            "name" character varying NOT NULL,
            "enable" boolean NOT NULL DEFAULT true,
            CONSTRAINT "PK_04b62ddb093081ed52afa3fa685" PRIMARY KEY ("exchange_id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "growdata_simply_grow_tokens" (
            "asset_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "symbol" character varying NOT NULL,
            "icon_url" character varying NOT NULL,
            "apy" character varying,
            "enable" boolean NOT NULL DEFAULT true,
            CONSTRAINT "PK_636cc1eb38c728c0758744763d0" PRIMARY KEY ("asset_id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "growdata_arbitrage_pairs" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "symbol" character varying NOT NULL,
            "base_symbol" character varying NOT NULL,
            "target_symbol" character varying NOT NULL,
            "base_asset_id" character varying NOT NULL,
            "base_icon_url" character varying NOT NULL,
            "target_asset_id" character varying NOT NULL,
            "target_icon_url" character varying NOT NULL,
            "base_price" character varying,
            "target_price" character varying,
            "enable" boolean NOT NULL DEFAULT true,
            "exchange_id" integer,
            CONSTRAINT "PK_e24c0ee878d2b4a5dc173a48642" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "growdata_market_making_pairs" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "symbol" character varying NOT NULL,
            "base_symbol" character varying NOT NULL,
            "target_symbol" character varying NOT NULL,
            "base_asset_id" character varying NOT NULL,
            "base_icon_url" character varying NOT NULL,
            "target_asset_id" character varying NOT NULL,
            "target_icon_url" character varying NOT NULL,
            "base_price" character varying,
            "target_price" character varying,
            "enable" boolean NOT NULL DEFAULT true,
            "exchange_id" integer,
            CONSTRAINT "PK_cfb9bddcc748cbef49be9476dd6" PRIMARY KEY ("id")
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
