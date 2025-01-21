import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { SpotdataTradingPair } from 'src/common/entities/spot-data.entity';
import { SpotdataRepository } from 'src/modules/spotdata/spotdata.repository';
import { MarketdataService } from 'src/modules/marketdata/marketdata.service';

@Injectable()
export class SpotdataService {
  private readonly logger = new CustomLogger(SpotdataService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly spotdataRepository: SpotdataRepository,
    private readonly marketdataService: MarketdataService,
  ) {}

  private cachingTTL = 5; // 5 seconds

  async getSpotData() {
    const trading_pairs = await this.getSupportedPairs();

    // Derive exchanges from trading pairs, remove duplicates
    const exchanges = Array.from(
      new Set(trading_pairs.map((pair) => pair.exchange_id)),
    );

    // Placeholder
    const fee = { global: 0.002, spot: 0.002 };
    return {
      exchanges,
      trading_pairs,
      fee,
    };
  }

  // TradingPair Methods
  async addTradingPair(pair: SpotdataTradingPair) {
    try {
      return await this.spotdataRepository.addTradingPair(pair);
    } catch (error) {
      this.logger.error(`Failed to add trading pair: ${pair.id}`, error);
      throw error;
    }
  }

  async getSupportedPairs(): Promise<any> {
    const cacheID = `supported-spotdata-pairs`;
    try {
      const cachedData = await this.cacheService.get(cacheID);
      if (cachedData) {
        return JSON.parse(cachedData);
      } else {
        const pairs = await this._getSupportedPairs();
        await this.cacheService.set(cacheID, JSON.stringify(pairs), {
          ttl: this.cachingTTL,
        });
        return pairs;
      }
    } catch (error) {
      this.logger.error(
        'Error accessing cache for supported pairs',
        error.message,
      );
      const pairs = await this._getSupportedPairs();
      return pairs;
    }
  }

  private async _getSupportedPairs(): Promise<any> {
    const tradingPairs = await this.spotdataRepository.findAllTradingPairs();
    this.logger.debug(`Fetched trading pairs: ${JSON.stringify(tradingPairs)}`);

    const exchangeToSymbolsMap: { [exchange: string]: string[] } = {};

    // Organize symbols by exchange to minimize API calls
    tradingPairs.forEach((pair) => {
      if (!exchangeToSymbolsMap[pair.exchange_id]) {
        exchangeToSymbolsMap[pair.exchange_id] = [];
      }
      exchangeToSymbolsMap[pair.exchange_id].push(pair.symbol);
    });

    const promises = Object.entries(exchangeToSymbolsMap).map(
      async ([exchange, symbols]) => {
        try {
          const tickers = await this.marketdataService.getTickers(
            exchange,
            symbols,
          );
          this.logger.debug(
            `Fetched tickers for ${exchange}: ${JSON.stringify(tickers)}`,
          );

          // Filter trading pairs for the current exchange
          return tradingPairs
            .filter((pair) => pair.exchange_id === exchange)
            .map((pair) => ({
              id: pair.id,
              symbol: pair.symbol,
              ccxt_id: pair.ccxt_id,
              exchange_id: pair.exchange_id,
              base_asset_id: pair.base_asset_id,
              quote_asset_id: pair.quote_asset_id,
              amount_significant_figures: pair.amount_significant_figures,
              price_significant_figures: pair.price_significant_figures,
              max_buy_amount: pair.max_buy_amount,
              max_sell_amount: pair.max_sell_amount,
              buy_decimal_digits: pair.buy_decimal_digits,
              sell_decimal_digits: pair.sell_decimal_digits,
              enable: pair.enable,
              change: tickers[pair.symbol]?.percentage || '0',
              price: tickers[pair.symbol]?.last || '0',
            }));
        } catch (error) {
          this.logger.warn(
            `Error fetching tickers from ${exchange}: ${error.message}`,
          );
          return tradingPairs
            .filter((pair) => pair.exchange_id === exchange)
            .map((pair) => ({
              id: pair.id,
              symbol: pair.symbol,
              ccxt_id: pair.ccxt_id,
              exchange_id: pair.exchange_id,
              base_asset_id: pair.base_asset_id,
              quote_asset_id: pair.quote_asset_id,
              amount_significant_figures: pair.amount_significant_figures,
              price_significant_figures: pair.price_significant_figures,
              max_buy_amount: pair.max_buy_amount,
              max_sell_amount: pair.max_sell_amount,
              buy_decimal_digits: pair.buy_decimal_digits,
              sell_decimal_digits: pair.sell_decimal_digits,
              enable: pair.enable,
              change: '0',
              price: '0',
            }));
        }
      },
    );

    const results = await Promise.all(promises);

    const flattenedResults = results.flat();

    return flattenedResults;
  }

  async getTradingPairById(id: string) {
    const pair = await this.spotdataRepository.findTradingPairById(id);
    if (!pair) {
      this.logger.warn(`Trading pair with ID ${id} not found.`);
      return null;
    }

    return pair;
  }

  async removeTradingPair(id: string) {
    try {
      return await this.spotdataRepository.removeTradingPair(id);
    } catch (error) {
      this.logger.error(`Failed to remove trading pair with ID ${id}`, error);
      throw error;
    }
  }

  async updateTradingPair(
    id: string,
    updateData: Partial<SpotdataTradingPair>,
  ) {
    try {
      return await this.spotdataRepository.updateTradingPair(id, updateData);
    } catch (error) {
      this.logger.error(`Failed to update trading pair with ID ${id}`, error);
      throw error;
    }
  }
}
