import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarketMakingHistory])],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
