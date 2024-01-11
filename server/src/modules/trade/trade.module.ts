// In trade.module.ts
import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../common/entities/transaction.entity';
import { TradeController } from './trade.controller';
import { TradeRepository } from './trade.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TradeController],
  providers: [TradeService,TradeRepository],
  exports: [TradeService],
})
export class TradeModule {}
