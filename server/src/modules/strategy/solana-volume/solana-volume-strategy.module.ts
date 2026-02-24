import { Module } from '@nestjs/common';
import { SolanaVolumeStrategyService } from './solana-volume-strategy.service';
import { SolanaVolumeStrategyController } from './solana-volume-strategy.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SolanaVolumeStrategyController],
  providers: [SolanaVolumeStrategyService],
  exports: [SolanaVolumeStrategyService],
})
export class SolanaVolumeStrategyModule {}
