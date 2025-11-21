import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminMarketMakingConfigService } from './admin-market-making-config.service';
import { AdminMarketMakingConfigController } from './admin-market-making-config.controller';
import { AdminMarketMakingConfig } from 'src/common/entities/admin-market-making-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminMarketMakingConfig]),
  ],
  controllers: [AdminMarketMakingConfigController],
  providers: [AdminMarketMakingConfigService],
  exports: [AdminMarketMakingConfigService],
})
export class AdminMarketMakingConfigModule { }
