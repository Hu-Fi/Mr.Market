import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMarketMakingEntities1763975996702 implements MigrationInterface {
    name = 'AddMarketMakingEntities1763975996702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "withdrawal" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "amount" numeric(20, 8) NOT NULL,
                "assetId" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "mixinTxId" character varying,
                "exchangeTxId" character varying,
                "onChainTxId" character varying,
                "status" character varying NOT NULL,
                "type" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_840e247aaad3fbd4e18129122a2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "campaign" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "pair" character varying NOT NULL,
                "exchange" character varying NOT NULL,
                "rewardToken" character varying NOT NULL,
                "startTime" TIMESTAMP NOT NULL,
                "endTime" TIMESTAMP NOT NULL,
                "status" character varying NOT NULL,
                "totalReward" numeric(20, 8) NOT NULL,
                "type" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "campaign_participation" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "campaignId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "orderId" character varying,
                "contributionAmount" numeric(20, 8) NOT NULL DEFAULT '0',
                "rewardAmount" numeric(20, 8),
                "status" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e941492a791a0f79ca5a533af34" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "campaign_participation"
        `);
        await queryRunner.query(`
            DROP TABLE "campaign"
        `);
        await queryRunner.query(`
            DROP TABLE "withdrawal"
        `);
    }

}
