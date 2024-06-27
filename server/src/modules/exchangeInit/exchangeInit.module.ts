import { Module } from '@nestjs/common';
import { ExchangeInitService } from './exchangeInit.service';

@Module({
  providers: [ExchangeInitService],
  exports: [ExchangeInitService],
})
export class ExchangeInitModule {}
