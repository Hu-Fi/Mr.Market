import { Module } from '@nestjs/common';
import { ExchangeInitService } from './exchange-init.service';

@Module({
  providers: [ExchangeInitService],
  exports: [ExchangeInitService],
})
export class ExchangeInitModule {}
