import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { Repository } from 'typeorm';

@Injectable()
export class MetricsService {
  private readonly logger = new CustomLogger(MetricsService.name);

  constructor(
    @InjectRepository(MarketMakingHistory)
    private readonly orderRepository: Repository<MarketMakingHistory>,
  ) {}

  public async getStrategyMetrics() {
    const closedOrderAndVolume = await this.orderRepository.query(
      `SELECT
        "exchange",
        "userId",
        "clientId",
        DATE_TRUNC('day', "executedAt") AS date,
        COUNT(*) AS orders,
        SUM("amount" * "price") AS volume
      FROM market_making_history
      WHERE status = 'closed'
      GROUP BY "exchange", "userId", "clientId", date
      ORDER BY "exchange", "userId", "clientId", date
      `,
    );

    const orderBookVolume = await this.orderRepository.query(`SELECT
        "exchange",
        "userId",
        "clientId",
        DATE_TRUNC('day', "executedAt") AS date,
        SUM("amount" * "price") AS volume
      FROM market_making_history
      GROUP BY "exchange", "userId", "clientId", date
      ORDER BY "exchange", "userId", "clientId", date
      `);

    const metrics = {};

    closedOrderAndVolume.forEach((item) => {
      const strategyKey = `${item.exchange}-${item.userId}-${item.clientId}`;
      if (!metrics[strategyKey]) {
        metrics[strategyKey] = [];
      }

      metrics[strategyKey].push({
        date: item.date,
        ordersPlaced: item.orders,
        tradeVolume: item.volume,
      });
    });

    orderBookVolume.forEach((item) => {
      const strategyKey = `${item.exchange}-${item.userId}-${item.clientId}`;
      if (!metrics[strategyKey]) {
        metrics[strategyKey] = [];
      }

      if (!metrics[strategyKey].some((m) => m.date === item.date)) {
        metrics[strategyKey].push({
          date: item.date,
          orderBookVolume: item.volume,
        });
      } else {
        for (let i = 0; i < metrics[strategyKey].length; i++) {
          if (metrics[strategyKey][i].date === item.date) {
            metrics[strategyKey][i].orderBookVolume = item.volume;
          }
        }
      }
    });

    return metrics;
  }
}
