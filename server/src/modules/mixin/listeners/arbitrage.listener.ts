import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ArbitrageStates } from 'src/common/types/orders/states';
import { ArbitrageMemoDetails } from 'src/common/types/memo/memo';
import { ArbitrageOrder } from 'src/common/entities/strategy.entity';
import { StrategyUserService } from 'src/modules/strategy/strategy-user.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';

@Injectable()
export class ArbitrageListener {
  constructor(
    private readonly snapshotService: SnapshotsService,
    private readonly strategyUserService: StrategyUserService,
  ) {}

  @OnEvent('arbitrage.create')
  async handleArbitrageCreate(
    details: ArbitrageMemoDetails,
    snapshot: SafeSnapshot,
  ) {
    // 1. Find if orderId is already created
    const order = await this.strategyUserService.findArbitrageByOrderId(
      details.traceId,
    );

    // 2. Not created, create temporary order (TODO: Add default arbitrage parameters)
    if (!order) {
      const newOrder: ArbitrageOrder = this.mapDetailsToArbitrageOrder(
        details,
        'temporary',
      );
      await this.strategyUserService.createArbitrage(newOrder);
      return;
    }

    // 3. Created, check if second transfer
    if (order.state === 'temporary') {
      // Check if second transfer valid
      await this.strategyUserService.updateArbitrageOrderState(
        order.orderId,
        'created',
      );
    } else {
      await this.snapshotService.refund(snapshot);
    }
  }

  private mapDetailsToArbitrageOrder(
    details: ArbitrageMemoDetails,
    state: ArbitrageStates,
  ): ArbitrageOrder {
    return {
      orderId: details.traceId,
      state,
    } as ArbitrageOrder;
  }
}
