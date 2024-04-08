import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MarketMakingOrder } from 'src/common/entities/strategy.entity';
import { MarketMakingMemoDetails } from 'src/common/types/memo/memo';
import { MarketMakingStates } from 'src/common/types/orders/states';
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
    // 1. Find if orderId is already created
    const order = await this.strategyUserService.findMarketMakingByOrderId(
      details.traceId,
    );

    // 2. Not created, create temporary order (TODO: Add default market making parameters)
    if (!order) {
      const newOrder: MarketMakingOrder = this.mapDetailsToMarketMakingOrder(
        details,
        'temporary',
      );
      await this.strategyUserService.createMarketMaking(newOrder);
      return;
    }

    // 3. Created, check if second transfer
    if (order.state === 'temporary') {
      // Check if second transfer valid
      await this.strategyUserService.updateMarketMakingOrderState(
        order.orderId,
        'created',
      );
    } else {
      await this.snapshotService.refund(snapshot);
    }
  }

  private mapDetailsToMarketMakingOrder(
    details: MarketMakingMemoDetails,
    state: MarketMakingStates,
  ): MarketMakingOrder {
    return {
      orderId: details.traceId,
      state,
    } as MarketMakingOrder;
  }
}
