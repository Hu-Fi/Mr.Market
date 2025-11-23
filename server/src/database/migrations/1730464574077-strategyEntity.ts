import { MigrationInterface, QueryRunner } from 'typeorm';

export class StrategyEntity1730464574077 implements MigrationInterface {
    name = 'StrategyEntity1730464574077';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "strategy_instances" (
                "id" SERIAL NOT NULL,
                "strategyKey" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "clientId" character varying NOT NULL,
                "strategyType" character varying NOT NULL,
                "parameters" json NOT NULL,
                "status" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_09080dbac0815101d4b0e883e7a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "contribution" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "amount" numeric(18, 8) NOT NULL,
                "joinedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_878330fa5bb34475732a5883d58" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "contribution"
        `);
        await queryRunner.query(`
            DROP TABLE "strategy_instances"
        `);
    }
}
