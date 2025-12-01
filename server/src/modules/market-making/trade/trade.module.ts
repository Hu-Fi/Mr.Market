import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeController } from './trade.controller';
import { TradeRepository } from './trade.repository';
import { Trade } from 'src/common/entities/trade.entity';
import { ExchangeInitService } from '../../infrastructure/exchange-init/exchange-init.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trade])],
  controllers: [TradeController],
  providers: [TradeService, TradeRepository, ExchangeInitService],
  exports: [TradeService, TradeRepository],
})
export class TradeModule {}
