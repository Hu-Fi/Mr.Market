import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentState } from 'src/common/entities/strategy-user.entity';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';
import { getRFC3339Timestamp } from 'src/common/helpers/utils';
import { MarketMakingCreateMemoDetails } from 'src/common/types/memo/memo';
import { GrowdataService } from 'src/modules/growdata/growdata.service';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { StrategyUserService } from 'src/modules/strategy/strategy-user.service';

@Injectable()
export class MarketMakingListener {
  private readonly logger = new CustomLogger(MarketMakingListener.name);

  constructor(
    private readonly snapshotService: SnapshotsService,
    private readonly strategyUserService: StrategyUserService,
    private readonly growdataService: GrowdataService,
  ) {}

  @OnEvent('market_making.create')
  async handleMarketMakingCreate(
    details: MarketMakingCreateMemoDetails,
    snapshot: SafeSnapshot,
  ) {
    if (!details || !snapshot) {
      this.logger.error('Invalid arguments passed to handleMarketMakingCreate');
      return;
    }
    const paymentState = await this.strategyUserService.findPaymentStateByIdRaw(
      details.orderId,
    );
    const pair = await this.growdataService.getMarketMakingPairById(
      details.marketMakingPairId,
    );
    if (!pair) {
      this.logger.error('Market making pair not found');
      return;
    }

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
        type: 'market_making',
        symbol: pair.symbol,
        firstAssetId: snapshot.asset_id,
        firstAssetAmount: snapshot.amount,
        firstSnapshotId: snapshot.snapshot_id,
        createdAt: now,
        updatedAt: now,
      } as PaymentState);
    }

    // Check if second asset
    if (paymentState && !paymentState.secondAssetId) {
      await this.strategyUserService.updatePaymentStateById(details.orderId, {
        secondAssetId: snapshot.asset_id,
        secondAssetAmount: snapshot.amount,
        secondSnapshotId: snapshot.snapshot_id,
        updatedAt: getRFC3339Timestamp(),
      } as PaymentState);

      await this.strategyUserService.createMarketMaking({
        orderId: details.orderId,
        userId: snapshot.opponent_id,
        pair: pair.symbol,
        state: 'created',
        exchangeName: pair.exchange_id,
        bidSpread: '0.1',
        askSpread: '0.1',
        orderAmount: '1',
        orderRefreshTime: '15000',
        numberOfLayers: '1',
        priceSourceType: PriceSourceType.MID_PRICE,
        amountChangePerLayer: '1',
        amountChangeType: 'percentage',
        ceilingPrice: '0',
        floorPrice: '0',
        balanceA: paymentState.firstAssetAmount,
        balanceB: snapshot.amount,
        createdAt: getRFC3339Timestamp(),
        rewardAddress: details.rewardAddress,
      });
    }
  }
}
