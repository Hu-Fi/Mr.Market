import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Token,
  Exchange,
  TokenExchange,
} from 'src/common/entities/rebalance-asset.entity';

@Injectable()
export class RebalanceRepository {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,

    @InjectRepository(Exchange)
    private exchangeRepository: Repository<Exchange>,

    @InjectRepository(TokenExchange)
    private tokenExchangeRepository: Repository<TokenExchange>,
  ) {}

  async addOrUpdateMinimumBalance(
    assetId: string,
    exchangeName: string,
    minimumBalance: string,
  ): Promise<void> {
    // Ensure the token and exchange exist
    const token = await this.tokenRepository.findOne({
      where: { asset_id: assetId },
    });
    if (!token) {
      throw new Error(`Token with asset ID ${assetId} not found.`);
    }

    const exchange = await this.exchangeRepository.findOne({
      where: { name: exchangeName },
    });
    if (!exchange) {
      throw new Error(`Exchange with name ${exchangeName} not found.`);
    }

    // Check if the TokenExchange entry exists
    let tokenExchange = await this.tokenExchangeRepository.findOne({
      where: { token_id: assetId, exchange_id: exchangeName },
    });

    if (tokenExchange) {
      // Update existing minimum balance
      tokenExchange.minimumBalance = minimumBalance;
    } else {
      // Create new TokenExchange with the minimum balance
      tokenExchange = this.tokenExchangeRepository.create({
        token_id: assetId,
        exchange_id: exchangeName,
        minimumBalance,
        token,
        exchange,
      });
    }

    await this.tokenExchangeRepository.save(tokenExchange);
  }

  async findAllTokensWithExchangesAndBalances(): Promise<any[]> {
    const tokens = await this.tokenRepository.find({
      relations: ['exchanges'],
    });
    const tokenExchangeMap = await this.getTokenExchangeMap();

    return tokens.map((token) => ({
      asset_id: token.asset_id,
      symbol: token.symbol,
      exchanges: token.exchanges.map((exchange) => ({
        name: exchange.name,
        minimumBalance:
          tokenExchangeMap[`${token.asset_id}_${exchange.name}`] || 'N/A',
      })),
    }));
  }

  private async getTokenExchangeMap(): Promise<{ [key: string]: string }> {
    const tokenExchanges = await this.tokenExchangeRepository.find();
    const map = {};

    for (const te of tokenExchanges) {
      map[`${te.token_id}_${te.exchange_id}`] = te.minimumBalance;
    }

    return map;
  }

  async getCurrencyMinAmountBySymbol(
    exchangeName: string,
    symbol: string,
  ): Promise<string | null> {
    // Find the exchange by name
    const exchange = await this.exchangeRepository.findOne({
      where: { name: exchangeName },
    });
    if (!exchange) {
      throw new Error(`Exchange with name ${exchangeName} not found.`);
    }

    // Find the token by symbol
    const token = await this.tokenRepository.findOne({
      where: { symbol },
    });
    if (!token) {
      throw new Error(`Token with symbol ${symbol} not found.`);
    }

    // Find the TokenExchange entry for the token and exchange
    const tokenExchange = await this.tokenExchangeRepository.findOne({
      where: {
        token_id: token.asset_id,
        exchange_id: exchange.name,
      },
    });

    return tokenExchange ? tokenExchange.minimumBalance : null;
  }
}
