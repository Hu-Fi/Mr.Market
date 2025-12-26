import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomConfigEntity1766674787493 implements MigrationInterface {
    name = 'AddCustomConfigEntity1766674787493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "custom_config_entity" ("config_id" SERIAL NOT NULL, "max_balance_mixin_bot" character varying NOT NULL, "max_balance_single_api_key" character varying NOT NULL, "funding_account" character varying NOT NULL, "spot_fee" character varying NOT NULL, "market_making_fee" character varying NOT NULL DEFAULT '0.001', "enable_spot_fee" boolean NOT NULL DEFAULT true, "enable_market_making_fee" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_7ba5aed5b83b9515ebb4cff37d8" PRIMARY KEY ("config_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "custom_config_entity"`);
    }

}
