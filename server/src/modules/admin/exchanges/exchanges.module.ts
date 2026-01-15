import { Module } from '@nestjs/common';
import { ExchangeModule } from 'src/modules/mixin/exchange/exchange.module';
import { AdminExchangesController } from './exchanges.controller';

@Module({
  imports: [ExchangeModule],
  controllers: [AdminExchangesController],
})
export class AdminExchangesModule {}
