import { Module } from '@nestjs/common';
import { CoingeckoProxyService } from './coingecko.service';
import { CoingeckoController } from './coingecko.controller';

@Module({
  controllers:[CoingeckoController],
  providers: [CoingeckoProxyService],
  exports: [CoingeckoProxyService]
})
export class CoingeckoModule {}