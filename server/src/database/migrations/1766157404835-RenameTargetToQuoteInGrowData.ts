import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTargetToQuoteInGrowData1766157404835 implements MigrationInterface {
    name = 'RenameTargetToQuoteInGrowData1766157404835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "growdata_arbitrage_pairs" RENAME COLUMN "target_asset_id" TO "quote_asset_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_arbitrage_pairs" RENAME COLUMN "target_symbol" TO "quote_symbol"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_arbitrage_pairs" RENAME COLUMN "target_icon_url" TO "quote_icon_url"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_market_making_pairs" RENAME COLUMN "target_asset_id" TO "quote_asset_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_market_making_pairs" RENAME COLUMN "target_symbol" TO "quote_symbol"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_market_making_pairs" RENAME COLUMN "target_icon_url" TO "quote_icon_url"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "growdata_market_making_pairs" RENAME COLUMN "quote_icon_url" TO "target_icon_url"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_market_making_pairs" RENAME COLUMN "quote_asset_id" TO "target_asset_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_market_making_pairs" RENAME COLUMN "quote_symbol" TO "target_symbol"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_arbitrage_pairs" RENAME COLUMN "quote_icon_url" TO "target_icon_url"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_arbitrage_pairs" RENAME COLUMN "quote_asset_id" TO "target_asset_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_arbitrage_pairs" RENAME COLUMN "quote_symbol" TO "target_symbol"
        `);
    }

}
