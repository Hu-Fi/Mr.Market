import { Module, Global } from '@nestjs/common';
import { ExchangeInitService } from './exchange-init.service';

@Global()
@Module({
  providers: [ExchangeInitService],
  exports: [ExchangeInitService],
})
export class ExchangeInitModule { }
