import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { WithdrawalService } from './withdrawal.service';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { WithdrawalMemoDetails } from 'src/common/types/memo/memo';

@Injectable()
export class WithdrawalEventHandler {
    private readonly logger = new CustomLogger(WithdrawalEventHandler.name);

    constructor(private readonly withdrawalService: WithdrawalService) { }

    @OnEvent('withdrawal.create')
    async handleWithdrawalCreate(
        memoDetails: WithdrawalMemoDetails,
        snapshot: SafeSnapshot,
    ) {
        this.logger.log(
            `Received withdrawal.create event for snapshot ${snapshot.snapshot_id}`,
        );

        try {
            // Initialize withdrawal with enhanced memo details
            await this.withdrawalService.initializeWithdrawal(snapshot, {
                version: memoDetails.version,
                tradingType: memoDetails.tradingType,
                destination: memoDetails.destination,
                destinationTag: memoDetails.destinationTag,
                assetId: snapshot.asset_id,
                amount: snapshot.amount,
            });
        } catch (error) {
            this.logger.error(
                `Error handling withdrawal.create event: ${error.message}`,
                error.stack,
            );
        }
    }
}
