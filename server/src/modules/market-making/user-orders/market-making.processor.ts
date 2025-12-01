import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserOrdersService } from './user-orders.service';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { StrategyService } from '../strategy/strategy.service';
import { createStrategyKey } from 'src/common/helpers/strategyKey';

@Processor('market-making')
export class MarketMakingProcessor {
  private readonly logger = new CustomLogger(MarketMakingProcessor.name);

  constructor(
    private readonly userOrdersService: UserOrdersService,
    private readonly strategyService: StrategyService,
  ) { }

  @Process('start_mm')
  async handleStartMM(job: Job<{ userId: string; orderId: string }>) {
    const { userId, orderId } = job.data;
    this.logger.log(`Starting MM for user ${userId}, order ${orderId}`);

    const order = await this.userOrdersService.findMarketMakingByOrderId(orderId);
    if (!order) {
      this.logger.error(`MM Order ${orderId} not found`);
      return;
    }

    const key = createStrategyKey({
      user_id: userId,
      client_id: orderId,
      type: 'pureMarketMaking',
    });

    // Start the strategy via StrategyService
    // Note: StrategyService currently uses setInterval. We might want to migrate it to use this queue for execution cycles
    // For now, we keep the existing start logic but maybe trigger the first cycle here?
    // Or we can refactor StrategyService to be stateless and triggered by jobs.
    // Given the plan "execute_mm_cycle: New Job Type for continuous execution", let's try to implement that.

    // However, StrategyService is complex. For this step, let's stick to starting the existing strategy logic
    // OR if we want to fully move to Bull, we need to refactor StrategyService.
    // The plan said: "execute_mm_cycle ... Re-queues itself".

    // Let's implement the start which adds the first 'execute_mm_cycle' job.

    await this.userOrdersService.updateMarketMakingOrderState(orderId, 'running');

    // Add first execution cycle job
    await (job.queue as any).add('execute_mm_cycle', {
      userId,
      orderId,
      strategyParams: {
        ...order,
        pair: order.pair.replaceAll('-ERC20', ''),
        clientId: orderId,
        bidSpread: Number(order.bidSpread),
        askSpread: Number(order.askSpread),
        orderAmount: Number(order.orderAmount),
        orderRefreshTime: Number(order.orderRefreshTime),
        numberOfLayers: Number(order.numberOfLayers),
        amountChangePerLayer: Number(order.amountChangePerLayer),
        ceilingPrice: Number(order.ceilingPrice),
        floorPrice: Number(order.floorPrice),
      }
    });
  }

  @Process('stop_mm')
  async handleStopMM(job: Job<{ userId: string; orderId: string }>) {
    const { userId, orderId } = job.data;
    this.logger.log(`Stopping MM for user ${userId}, order ${orderId}`);

    await this.strategyService.stopStrategyForUser(userId, orderId, 'pureMarketMaking');
    await this.userOrdersService.updateMarketMakingOrderState(orderId, 'stopped');
  }

  @Process('execute_mm_cycle')
  async handleExecuteMMCycle(job: Job<{ userId: string; orderId: string; strategyParams: any }>) {
    const { userId, orderId, strategyParams } = job.data;

    // 1. Check if order is still running
    const order = await this.userOrdersService.findMarketMakingByOrderId(orderId);
    if (!order || order.state !== 'running') {
      this.logger.log(`MM Order ${orderId} is not running (state: ${order?.state}), stopping cycle.`);
      return;
    }

    // 2. Execute one cycle of MM
    try {
      await this.strategyService.executeMMCycle(strategyParams);
    } catch (error) {
      this.logger.error(`Error executing MM cycle for ${orderId}: ${error.message}`);
    }

    // 3. Re-queue
    await (job.queue as any).add('execute_mm_cycle', job.data, {
      delay: strategyParams.orderRefreshTime || 10000 // Default 10s
    });
  }
}
