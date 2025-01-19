import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { getRFC3339Timestamp } from 'src/common/helpers/utils';
import { ArbitrageCreateMemoDetails } from 'src/common/types/memo/memo';
import { PaymentState } from 'src/common/entities/strategy-user.entity';
import { StrategyUserService } from 'src/modules/strategy/strategy-user.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { GrowdataService } from 'src/modules/growdata/growdata.service';
import { CustomLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class ArbitrageListener {
  private readonly logger = new CustomLogger(ArbitrageListener.name);

  constructor(
    private readonly growdataService: GrowdataService,
    private readonly snapshotService: SnapshotsService,
    private readonly strategyUserService: StrategyUserService,
  ) {}

  @OnEvent('arbitrage.create')
  async handleArbitrageCreate(
    details: ArbitrageCreateMemoDetails,
    snapshot: SafeSnapshot,
  ) {
    if (!details || !snapshot) {
      this.logger.error('Invalid arguments passed to handleArbitrageCreate');
      return;
    }
    const paymentState = await this.strategyUserService.findPaymentStateByIdRaw(
      details.orderId,
    );

    const pair = await this.growdataService.getArbitragePairById(
      details.arbitragePairId,
    );
    if (!pair) {
      this.logger.error('Arbitrage pair not found');
      return;
    }

    // Transfer asset doesn't match any of symbol, refund
    if (
      snapshot.asset_id != pair.base_asset_id &&
      snapshot.asset_id != pair.target_asset_id
    ) {
      return await this.snapshotService.refund(snapshot);
    }

    // First asset
    if (!paymentState) {
      const now = getRFC3339Timestamp();
      return await this.strategyUserService.createPaymentState({
        orderId: details.orderId,
        type: 'arbitrage',
        symbol: pair.symbol,
        firstAssetId: snapshot.asset_id,
        firstAssetAmount: snapshot.amount,
        firstSnapshotId: snapshot.snapshot_id,
        createdAt: now,
        updatedAt: now,
      } as PaymentState);
    }

    // Second asset
    if (paymentState && !paymentState.secondAssetId) {
      await this.strategyUserService.updatePaymentStateById(details.orderId, {
        secondAssetId: snapshot.asset_id,
        secondAssetAmount: snapshot.amount,
        secondSnapshotId: snapshot.snapshot_id,
        updatedAt: getRFC3339Timestamp(),
      } as PaymentState);

      await this.strategyUserService.createArbitrage({
        orderId: details.orderId,
        userId: snapshot.opponent_id,
        pair: pair.symbol,
        amountToTrade: '1',
        minProfitability: '0.01',
        exchangeAName: pair.base_exchange_id,
        exchangeBName: pair.target_exchange_id,
        balanceA: paymentState.firstAssetAmount,
        balanceB: snapshot.amount,
        state: 'created',
        createdAt: getRFC3339Timestamp(),
        rewardAddress: details.rewardAddress,
      });
    }
  }
}
