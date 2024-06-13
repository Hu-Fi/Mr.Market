import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StrategyService } from 'src/modules/strategy/strategy.service';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { UserExchangeReward } from 'src/common/entities/user-rewards';
import { ArbitrageOrder, MarketMakingOrder } from 'src/common/entities/strategy.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StrategyRewardsService {
  private readonly logger = new CustomLogger(StrategyRewardsService.name);

  constructor(
    @InjectRepository(UserExchangeReward)
    private userExchangeRewardRepository: Repository<UserExchangeReward>,
    private strategyService: StrategyService,
    @InjectRepository(ArbitrageOrder)
    private readonly arbitrageRepository: Repository<ArbitrageOrder>,
    @InjectRepository(MarketMakingOrder)
    private readonly marketMakingRepository: Repository<MarketMakingOrder>,
  ) {}

  async getAllUsers(): Promise<string[]> {
    // Fetch all distinct user IDs from market making orders
    const mmUsers = await this.marketMakingRepository
      .createQueryBuilder("order")
      .select("distinct(order.userId)", "userId")
      .getRawMany();

    // Fetch all distinct user IDs from arbitrage orders
    const arbUsers = await this.arbitrageRepository
      .createQueryBuilder("order")
      .select("distinct(order.userId)", "userId")
      .getRawMany();

    // Combine user IDs from both sources and remove duplicates
    const allUserIds = [...mmUsers, ...arbUsers].map(user => user.userId);
    const uniqueUserIds = Array.from(new Set(allUserIds));

    return uniqueUserIds;
  }

  async calculateRewardsForPeriod(startDate: Date, endDate: Date, pair: string) {
    try {
      const allUsers = await this.getAllUsers(); // Assuming this method exists
      for (const userId of allUsers) {
        const mmOrders = (await this.strategyService.getUserOrders(userId)).filter(order =>
          new Date(order.executedAt) >= startDate && new Date(order.executedAt) <= endDate && order.pair === pair
        );
        const arbOrders = (await this.strategyService.getUserArbitrageHistorys(userId)).filter(order =>
          new Date(order.executedAt) >= startDate && new Date(order.executedAt) <= endDate && order.pair === pair
        );

        let rewardsMap = new Map<string, number>();

        // Aggregate market making rewards by exchange
        mmOrders.forEach(order => {
          const key = `${userId}-${order.exchange}`;
          rewardsMap.set(key, (rewardsMap.get(key) || 0) + order.amount);
        });

        // Aggregate arbitrage rewards by exchange
        arbOrders.forEach(order => {
          const keyBuy = `${userId}-${order.exchangeAName}`;
          const keySell = `${userId}-${order.exchangeBName}`;
          rewardsMap.set(keyBuy, (rewardsMap.get(keyBuy) || 0) + order.amount);
          rewardsMap.set(keySell, (rewardsMap.get(keySell) || 0) + order.amount);
        });

        // Update or create new rewards in the database per exchange
        for (const [key, score] of rewardsMap) {
          const [userId, exchange] = key.split('-');
          let userReward = await this.userExchangeRewardRepository.findOne({ where: { userId, exchange, startDate, endDate, pair } });
          if (userReward) {
            userReward.score += score;
          } else {
            userReward = this.userExchangeRewardRepository.create({ userId, exchange, score, startDate, endDate, pair });
          }
          await this.userExchangeRewardRepository.save(userReward);
        }
      }
    } catch (error) {
      this.logger.error('Failed to calculate rewards for specified period and pair', error);
    }
  }

  @Cron('0 0 * * *') // This cron expression means "At 00:00" every day
  async handleCron() {
    this.logger.debug('Calculating rewards for all users');
    try {
      //Fetch data from the user signing for the campaign and the campaign endDate.
      const endDate = new Date(); // Today
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 1); // Yesterday

      // fetch pairs dynamically from campaigns
      const pairs = ['BTC/USD']; // Get the pair from the campaign

      for (const pair of pairs) {
        await this.calculateRewardsForPeriod(startDate, endDate, pair);
      }
    } catch (error) {
      this.logger.error('Failed to calculate rewards:', error);
    }
  }
}
