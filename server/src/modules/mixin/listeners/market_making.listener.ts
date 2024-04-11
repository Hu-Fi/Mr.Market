import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentState } from 'src/common/entities/strategy.entity';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';
import {
  getAssetIDBySymbol,
  getRFC3339Timestamp,
} from 'src/common/helpers/utils';
import { MarketMakingMemoDetails } from 'src/common/types/memo/memo';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { StrategyUserService } from 'src/modules/strategy/strategy-user.service';

@Injectable()
export class MarketMakingListener {
  constructor(
    private readonly snapshotService: SnapshotsService,
    private readonly strategyUserService: StrategyUserService,
  ) {}

  @OnEvent('market_making.create')
  async handleMarketMakingCreate(
    details: MarketMakingMemoDetails,
    snapshot: SafeSnapshot,
  ) {
    if (!details || !snapshot) {
      console.error('Invalid arguments passed to handleMarketMakingCreate');
      return;
    }
    const paymentState = await this.strategyUserService.findPaymentStateByIdRaw(
      details.traceId,
    );

    const { baseAssetID, targetAssetID } = getAssetIDBySymbol(details.symbol);
    if (
      snapshot.asset_id != baseAssetID &&
      snapshot.asset_id != targetAssetID
    ) {
      // Transfer asset doesn't match any of symbol, refund
      return await this.snapshotService.refund(snapshot);
    }

    // First asset
    if (!paymentState) {
      const now = getRFC3339Timestamp();
      return await this.strategyUserService.createPaymentState({
        orderId: details.traceId,
        type: 'market_making',
        symbol: details.symbol,
        firstAssetId: snapshot.asset_id,
        firstAssetAmount: snapshot.amount,
        firstSnapshotId: snapshot.snapshot_id,
        createdAt: now,
        updatedAt: now,
      } as PaymentState);
    }

    // Check if second asset
    if (paymentState && !paymentState.secondAssetId) {
      await this.strategyUserService.updatePaymentStateById(details.traceId, {
        secondAssetId: snapshot.asset_id,
        secondAssetAmount: snapshot.amount,
        secondSnapshotId: snapshot.snapshot_id,
        updatedAt: getRFC3339Timestamp(),
      } as PaymentState);

      await this.strategyUserService.createMarketMaking({
        orderId: details.traceId,
        userId: snapshot.opponent_id,
        pair: details.symbol,
        state: 'created',
        exchangeName: details.exchangeName,
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
      });
    }
  }
}
