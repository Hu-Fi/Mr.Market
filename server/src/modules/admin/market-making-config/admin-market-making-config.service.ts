import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminMarketMakingConfig } from 'src/common/entities/admin-market-making-config.entity';

@Injectable()
export class AdminMarketMakingConfigService {
  constructor(
    @InjectRepository(AdminMarketMakingConfig)
    private readonly configRepository: Repository<AdminMarketMakingConfig>,
  ) { }

  async enablePair(
    exchange: string,
    symbol: string,
    baseSymbol: string,
    quoteSymbol: string,
    baseAssetId: string,
    quoteAssetId: string,
    baseIcon: string,
    quoteIcon: string,
  ): Promise<AdminMarketMakingConfig> {
    let config = await this.configRepository.findOne({
      where: { exchange, symbol },
    });

    if (!config) {
      config = this.configRepository.create({
        exchange,
        symbol,
        baseSymbol,
        quoteSymbol,
        baseAssetId,
        quoteAssetId,
        baseIcon,
        quoteIcon,
        isEnabled: true,
      });
    } else {
      config.isEnabled = true;
      // Update details in case they changed
      config.baseSymbol = baseSymbol;
      config.quoteSymbol = quoteSymbol;
      config.baseAssetId = baseAssetId;
      config.quoteAssetId = quoteAssetId;
      config.baseIcon = baseIcon;
      config.quoteIcon = quoteIcon;
    }

    return this.configRepository.save(config);
  }

  async disablePair(exchange: string, symbol: string): Promise<AdminMarketMakingConfig> {
    const config = await this.configRepository.findOne({
      where: { exchange, symbol },
    });

    if (config) {
      config.isEnabled = false;
      return this.configRepository.save(config);
    }
    return null;
  }

  async getEnabledPairs(exchange?: string): Promise<AdminMarketMakingConfig[]> {
    const query = { isEnabled: true };
    if (exchange) {
      query['exchange'] = exchange;
    }
    return this.configRepository.find({ where: query });
  }

  async getAllConfig(): Promise<AdminMarketMakingConfig[]> {
    return this.configRepository.find();
  }
}
