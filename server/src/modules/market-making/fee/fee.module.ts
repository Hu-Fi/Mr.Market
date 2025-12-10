import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';
import { ConfigModule } from '@nestjs/config';
import { ExchangeInitModule } from '../../infrastructure/exchange-init/exchange-init.module';

import { FeeController } from './fee.controller';

import { MixinClientModule } from '../../mixin/client/mixin-client.module';

@Module({
  imports: [ConfigModule, ExchangeInitModule, MixinClientModule],
  controllers: [FeeController],
  providers: [FeeService],
  exports: [FeeService],
})
export class FeeModule { }
