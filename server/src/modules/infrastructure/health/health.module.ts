import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { MixinModule } from '../../mixin/mixin.module';
import { ExchangeInitModule } from '../exchange-init/exchange-init.module';

@Module({
  imports: [MixinModule, ExchangeInitModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule { }
