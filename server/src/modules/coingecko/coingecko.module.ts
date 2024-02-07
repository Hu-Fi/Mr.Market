import { Module } from '@nestjs/common';
import { CoingeckoProxyService } from './coingecko.service';
import { CoingeckoController } from './coingecko.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers:[CoingeckoController],
  providers: [CoingeckoProxyService],
  exports: [CoingeckoProxyService, CacheModule]
})
export class CoingeckoModule {}