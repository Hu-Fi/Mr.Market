import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateContribution1731671515679 implements MigrationInterface {
  name = 'UpdateContribution1731671515679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "mixin_user"
            ADD "walletAddress" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD "userId" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD "clientId" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD "status" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD "transactionHash" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD "tokenSymbol" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD "chainId" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD "tokenAddress" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD "strategyId" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD "mixinUserUserId" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD CONSTRAINT "FK_5ac95ac829064de9af986f64eb0" FOREIGN KEY ("strategyId") REFERENCES "strategy_instances"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD CONSTRAINT "FK_ea79d9af9fdb9af67e20c66cab0" FOREIGN KEY ("mixinUserUserId") REFERENCES "mixin_user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP CONSTRAINT "FK_ea79d9af9fdb9af67e20c66cab0"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP CONSTRAINT "FK_5ac95ac829064de9af986f64eb0"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP COLUMN "mixinUserUserId"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP COLUMN "strategyId"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP COLUMN "tokenAddress"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP COLUMN "chainId"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP COLUMN "tokenSymbol"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP COLUMN "transactionHash"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP COLUMN "clientId"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP COLUMN "userId"
        `);
    await queryRunner.query(`
            ALTER TABLE "mixin_user" DROP COLUMN "walletAddress"
        `);
  }
}
