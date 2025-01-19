import { Module } from '@nestjs/common';
import { AdminStrategyService } from './strategy/adminStrategy.service';
import { AdminController } from './admin.controller';
import { StrategyService } from '../strategy/strategy.service';
import { PerformanceService } from '../performance/performance.service';
import { TradeService } from '../trade/trade.service';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { TradeModule } from '../trade/trade.module';
import { StrategyInstance } from 'src/common/entities/strategy-instances.entity';
import { Contribution } from 'src/common/entities/contribution.entity';
import { Web3Module } from '../web3/web3.module';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { AdminGrowService } from './growdata/adminGrow.service';
import { GrowdataModule } from '../growdata/growdata.module';
import { ExchangeInitModule } from '../exchangeInit/exchangeInit.module';
import { AdminSpotService } from './spotData/adminSpot.service';
import { SpotdataModule } from '../spotdata/spotdata.module';
import { AdminRebalanceService } from './rebalance/adminRebalance.service';
import { ExchangeModule } from '../mixin/exchange/exchange.module';
import { LoggerModule } from '../logger/logger.module';
import { AdminExchangeController } from './exchange/adminExchange.controller';
import { AdminRebalanceController } from './rebalance/adminRebalance.controller';
import { AdminUserController } from './user/adminUser.controller';
import { UserModule } from '../mixin/user/user.module';
import { AdminSpotController } from './spotData/adminSpot.controller';
import { AdminGrowController } from './growdata/adminGrow.controller';
import { AdminMixinMessageController } from './mixinMessage/adminMixinMessage.controller';
import { MixinModule } from '../mixin/mixin.module';
import { AdminRebalanceRepository } from './rebalance/adminRebalance.repository';
import {
  TransferRecord,
  WithdrawalRecord,
} from 'src/common/entities/rebalance.entity';
import { AdminOrdersController } from './orders/adminOrders.controller';
import { AdminOrdersService } from './orders/adminOrders.service';
import { AdminOrdersRepository } from './orders/adminOrders.repository';
import {
  ArbitrageOrder,
  MarketMakingOrder,
  SimplyGrowOrder,
} from 'src/common/entities/strategy-user.entity';
// import { MixinMessageModule } from '../mixin/message/message.module';
// import { SnapshotsModule } from '../mixin/snapshots/snapshots.module';

@Module({
  imports: [
    ExchangeInitModule,
    GrowdataModule,
    SpotdataModule,
    // SnapshotsModule,
    TypeOrmModule.forFeature([
      MarketMakingHistory,
      ArbitrageHistory,
      StrategyInstance,
      MixinUser,
      Contribution,
      Performance,
      TransferRecord,
      WithdrawalRecord,
      ArbitrageOrder,
      MarketMakingOrder,
      SimplyGrowOrder,
    ]),
    TradeModule,
    Web3Module,
    ExchangeModule,
    LoggerModule,
    UserModule,
    // MixinMessageModule,
    MixinModule,
  ],
  controllers: [
    AdminController,
    AdminExchangeController,
    AdminRebalanceController,
    AdminSpotController,
    AdminGrowController,
    AdminUserController,
    AdminMixinMessageController,
    AdminOrdersController,
  ],
  providers: [
    AdminOrdersService,
    AdminStrategyService,
    AdminRebalanceService,
    AdminRebalanceRepository,
    AdminOrdersRepository,
    StrategyService,
    PerformanceService,
    TradeService,
    ExchangeInitService,
    AdminGrowService,
    AdminSpotService,
  ],
  exports: [
    AdminStrategyService,
    AdminGrowService,
    AdminSpotService,
    AdminRebalanceService,
    AdminRebalanceRepository,
    AdminOrdersService,
  ],
})
export class AdminModule {}
