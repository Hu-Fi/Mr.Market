import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomFeeRateAndIconUrl1764670088522 implements MigrationInterface {
    name = 'AddCustomFeeRateAndIconUrl1764670088522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "spotdata_trading_pairs"
            ADD "custom_fee_rate" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_exchanges"
            ADD "icon_url" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_market_making_pairs"
            ADD "custom_fee_rate" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ADD "market_making_fee" character varying NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ADD "enable_spot_fee" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "custom_config_entity"
            ADD "enable_market_making_fee" boolean NOT NULL DEFAULT true
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "custom_config_entity" DROP COLUMN "enable_market_making_fee"
        `);
        await queryRunner.query(`
            ALTER TABLE "custom_config_entity" DROP COLUMN "enable_spot_fee"
        `);
        await queryRunner.query(`
            ALTER TABLE "custom_config_entity" DROP COLUMN "market_making_fee"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_market_making_pairs" DROP COLUMN "custom_fee_rate"
        `);
        await queryRunner.query(`
            ALTER TABLE "growdata_exchanges" DROP COLUMN "icon_url"
        `);
        await queryRunner.query(`
            ALTER TABLE "spotdata_trading_pairs" DROP COLUMN "custom_fee_rate"
        `);
    }

}
