import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntities1763867067304 implements MigrationInterface {
    name = 'UpdateEntities1763867067304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "admin_market_making_config" (
                "id" SERIAL NOT NULL,
                "exchange" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "baseSymbol" character varying NOT NULL,
                "quoteSymbol" character varying NOT NULL,
                "baseAssetId" character varying NOT NULL,
                "quoteAssetId" character varying NOT NULL,
                "baseIcon" character varying,
                "quoteIcon" character varying,
                "isEnabled" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_7008a06d0a9fef3dc7566211d4c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "market_making_history"
            ADD "strategyInstanceId" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "strategy_instances"
            ALTER COLUMN "startPrice" DROP DEFAULT
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "strategy_instances"
            ALTER COLUMN "startPrice"
            SET DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "market_making_history" DROP COLUMN "strategyInstanceId"
        `);
        await queryRunner.query(`
            DROP TABLE "admin_market_making_config"
        `);
    }

}
