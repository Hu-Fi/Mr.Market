import { Module } from '@nestjs/common';
import { ExchangeInitService } from './exchangeInit.service';
import { ExchangeModule } from '../mixin/exchange/exchange.module';

@Module({
  imports: [ExchangeModule],
  providers: [ExchangeInitService],
  exports: [ExchangeInitService],
})
export class ExchangeInitModule {}
