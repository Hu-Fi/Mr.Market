import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGrowOrders1733923487142 implements MigrationInterface {
  name = 'UpdateGrowOrders1733923487142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "simply_grow_order" (
                "orderId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "mixinAssetId" character varying NOT NULL,
                "amount" character varying NOT NULL,
                "state" character varying NOT NULL,
                "createdAt" character varying NOT NULL,
                "rewardAddress" character varying NOT NULL,
                CONSTRAINT "PK_0e115267f4e339fd5eb8f32a7b0" PRIMARY KEY ("orderId")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "spotdata_trading_pairs" (
                "id" uuid NOT NULL,
                "ccxt_id" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "exchange_id" character varying NOT NULL,
                "amount_significant_figures" character varying NOT NULL,
                "price_significant_figures" character varying NOT NULL,
                "buy_decimal_digits" character varying NOT NULL,
                "sell_decimal_digits" character varying NOT NULL,
                "max_buy_amount" character varying NOT NULL,
                "max_sell_amount" character varying NOT NULL,
                "base_asset_id" character varying NOT NULL,
                "quote_asset_id" character varying NOT NULL,
                "enable" boolean NOT NULL,
                CONSTRAINT "PK_883d6f632aaf2cf6f953731e94f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "growdata_exchanges" (
                "exchange_id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "enable" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_04b62ddb093081ed52afa3fa685" PRIMARY KEY ("exchange_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "growdata_simply_grow_tokens" (
                "asset_id" uuid NOT NULL,
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
                "id" uuid NOT NULL,
                "symbol" character varying NOT NULL,
                "base_symbol" character varying NOT NULL,
                "target_symbol" character varying NOT NULL,
                "base_asset_id" character varying NOT NULL,
                "base_icon_url" character varying NOT NULL,
                "target_asset_id" character varying NOT NULL,
                "target_icon_url" character varying NOT NULL,
                "base_price" character varying,
                "target_price" character varying,
                "base_exchange_id" character varying NOT NULL,
                "target_exchange_id" character varying NOT NULL,
                "enable" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_e24c0ee878d2b4a5dc173a48642" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "growdata_market_making_pairs" (
                "id" uuid NOT NULL,
                "symbol" character varying NOT NULL,
                "base_symbol" character varying NOT NULL,
                "target_symbol" character varying NOT NULL,
                "base_asset_id" character varying NOT NULL,
                "base_icon_url" character varying NOT NULL,
                "target_asset_id" character varying NOT NULL,
                "target_icon_url" character varying NOT NULL,
                "base_price" character varying,
                "target_price" character varying,
                "exchange_id" character varying NOT NULL,
                "enable" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_cfb9bddcc748cbef49be9476dd6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "arbitrage_order"
            ADD "rewardAddress" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "market_making_order"
            ADD "rewardAddress" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "market_making_order" DROP COLUMN "rewardAddress"
        `);
    await queryRunner.query(`
            ALTER TABLE "arbitrage_order" DROP COLUMN "rewardAddress"
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
    await queryRunner.query(`
            DROP TABLE "spotdata_trading_pairs"
        `);
    await queryRunner.query(`
            DROP TABLE "simply_grow_order"
        `);
  }
}
