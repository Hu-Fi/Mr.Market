import { Module } from '@nestjs/common';
import { CoingeckoProxyService } from './coingecko.service';
import { CoingeckoController } from './coingecko.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    // Caching for 30 seconds
    CacheModule.register({
      ttl: 30,
      max: 30,
    }),
  ],
  controllers: [CoingeckoController],
  providers: [CoingeckoProxyService],
  exports: [CoingeckoProxyService, CacheModule],
})
export class CoingeckoModule {}
