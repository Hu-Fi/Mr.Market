import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RebalanceToken,
  RebalanceExchange,
  RebalanceTokenExchange,
  RebalanceHistory,
} from 'src/common/entities/rebalance-asset.entity';
import { DEFAULT_MINIMUM_BALANCE } from 'src/common/constants/constants';
import { CustomLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class RebalanceRepository {
  private readonly logger = new CustomLogger(RebalanceRepository.name);

  constructor(
    @InjectRepository(RebalanceToken)
    private tokenRepository: Repository<RebalanceToken>,

    @InjectRepository(RebalanceExchange)
    private exchangeRepository: Repository<RebalanceExchange>,

    @InjectRepository(RebalanceTokenExchange)
    private tokenExchangeRepository: Repository<RebalanceTokenExchange>,

    @InjectRepository(RebalanceHistory)
    private rebalanceRepository: Repository<RebalanceHistory>,
  ) {}

  async updateMinimumBalance(
    assetId: string,
    exchangeName: string,
    minimumBalance: string,
  ): Promise<void> {
    // Ensure the token and exchange exist
    const token = await this.tokenRepository.findOne({
      where: { asset_id: assetId },
    });
    if (!token) {
      throw new Error(`RebalanceToken with asset ID ${assetId} not found.`);
    }

    const exchange = await this.exchangeRepository.findOne({
      where: { name: exchangeName },
    });
    if (!exchange) {
      throw new Error(`RebalanceExchange with name ${exchangeName} not found.`);
    }

    // Check if the RebalanceTokenExchange entry exists
    const tokenExchange = await this.tokenExchangeRepository.findOne({
      where: { token_id: assetId, exchange_id: exchangeName },
    });

    if (!tokenExchange) {
      throw new Error(
        `RebalanceTokenExchange entry for asset ID ${assetId} and exchange ${exchangeName} not found.`,
      );
    }
    // Update existing minimum balance
    tokenExchange.minimumBalance = minimumBalance;
    await this.tokenExchangeRepository.save(tokenExchange);
  }

  async addMinimumBalance(
    symbol: string,
    assetId: string,
    exchangeName: string,
    minimumBalance: string,
  ): Promise<void> {
    // Check and add RebalanceToken if necessary
    let token = await this.tokenRepository.findOne({
      where: { asset_id: assetId },
    });
    if (!token) {
      token = this.tokenRepository.create({
        asset_id: assetId,
        symbol: symbol,
      });
      await this.tokenRepository.save(token);
    }

    // Check and add RebalanceExchange if necessary
    let exchange = await this.exchangeRepository.findOne({
      where: { name: exchangeName },
    });
    if (!exchange) {
      exchange = this.exchangeRepository.create({
        name: exchangeName,
      });
      await this.exchangeRepository.save(exchange);
    }

    // Check and add RebalanceTokenExchange with minimumBalance if necessary
    let tokenExchange = await this.tokenExchangeRepository.findOne({
      where: {
        token_id: assetId,
        exchange_id: exchangeName,
      },
    });

    if (!tokenExchange) {
      tokenExchange = this.tokenExchangeRepository.create({
        token_id: assetId,
        exchange_id: exchangeName,
        token: token,
        exchange: exchange,
        minimumBalance: minimumBalance,
      });
      await this.tokenExchangeRepository.save(tokenExchange);
    }
  }

  async addRebalanceHistory(
    history: Partial<RebalanceHistory>,
  ): Promise<RebalanceHistory> {
    const his = this.rebalanceRepository.create(history);
    return await this.rebalanceRepository.save(his);
  }

  async findAllExchagnes(): Promise<any[]> {
    return await this.exchangeRepository.find();
  }

  async findAllTokensWithExchangesAndBalances(): Promise<any[]> {
    const tokens = await this.tokenRepository.find();
    const tokenExchange = await this.tokenExchangeRepository.find();

    return tokens.map((token) => ({
      asset_id: token.asset_id,
      symbol: token.symbol,
      exchange: tokenExchange
        .filter((te) => te.token_id === token.asset_id)
        .map((te) => ({
          name: te.exchange_id,
          minimumBalance: te.minimumBalance,
        })),
    }));
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
      throw new Error(`RebalanceExchange with name ${exchangeName} not found.`);
    }

    // Find the token by symbol
    const token = await this.tokenRepository.findOne({
      where: { symbol },
    });
    if (!token) {
      throw new Error(`RebalanceToken with symbol ${symbol} not found.`);
    }

    // Find the RebalanceTokenExchange entry for the token and exchange
    const tokenExchange = await this.tokenExchangeRepository.findOne({
      where: {
        token_id: token.asset_id,
        exchange_id: exchange.name,
      },
    });

    return tokenExchange
      ? tokenExchange.minimumBalance
      : DEFAULT_MINIMUM_BALANCE;
  }
}
