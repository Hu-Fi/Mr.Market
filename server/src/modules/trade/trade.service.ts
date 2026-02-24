/**
 * TradeService
 *
 * This service handles trading operations, including executing market and limit trades, and canceling orders on various exchanges.
 * It uses the CCXT library for interacting with cryptocurrency exchanges and logs operations using a custom logger.
 *
 * Dependencies:
 * - TradeRepository: Repository for managing trade-related data in the database.
 * - CustomLogger: Custom logging service for recording errors and log information.
 * - CCXT: Cryptocurrency exchange trading library.
 * - DTOs: MarketTradeDto and LimitTradeDto for handling trade data transfer objects.
 * - Exceptions: BadRequestException and InternalServerErrorException for handling errors.
 *
 * Methods:
 *
 * - constructor: Initializes the service with the injected TradeRepository and sets up the exchange instances.
 *
 * - initializeExchange(): Sets up the exchange instances with the provided API keys and secrets.
 *
 * - executeMarketTrade(marketTradeDto: MarketTradeDto): Executes a market trade on the specified exchange.
 *   Validates required parameters, logs the operation, and stores the trade in the repository.
 *
 * - executeLimitTrade(limitTradeDto: LimitTradeDto): Executes a limit trade on the specified exchange.
 *   Validates required parameters, logs the operation, and stores the trade in the repository.
 *
 * - cancelOrder(orderId: string, symbol: string): Cancels an order on the exchange and updates the trade status in the repository.
 *
 * Notes:
 * - The service uses CCXT for interacting with exchanges and handles different types of trades (market and limit).
 * - Error handling is implemented to log and manage errors during trade execution and order cancellation.
 * - The service logs all trading operations and ensures that trade data is correctly recorded in the database.
 */

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as ccxt from 'ccxt';
import { TradeRepository } from './trade.repository';
import { MarketTradeDto, LimitTradeDto } from './trade.dto';
import { CustomLogger } from '../logger/logger.service';
import { ExchangeInitService } from 'src/modules/exchangeInit/exchangeInit.service';

@Injectable()
export class TradeService {
  private exchange: ccxt.Exchange;
  private readonly logger = new CustomLogger(TradeService.name);

  constructor(
    private tradeRepository: TradeRepository,
    private exchangeInitService: ExchangeInitService,
  ) {}

  private getExchange(exchangeName: string): ccxt.Exchange {
    const exchange = this.exchangeInitService.getExchange(exchangeName);
    if (!exchange) {
      this.logger.error(`Exchange: ${exchangeName} is not configured.`);
      throw new InternalServerErrorException('Exchange configuration error.');
    }
    return exchange;
  }

  async executeMarketTrade(marketTradeDto: MarketTradeDto) {
    const { userId, clientId, exchange, symbol, side, amount } = marketTradeDto;

    if (!symbol || !side || !amount) {
      throw new BadRequestException(
        'Missing required parameters for market trade.',
      );
    }

    this.exchange = this.getExchange(exchange);

    try {
      const order = await this.exchange.createOrder(
        symbol,
        'market',
        side,
        amount,
      );
      this.logger.log(
        `Market trade executed ${order.amount} @ ${order.average}`,
      );
      await this.tradeRepository.createTrade({
        userId,
        clientId,
        symbol,
        type: 'market',
        side: side,
        amount,
        status: order.status,
        price: order.price, // Assuming the order object has a price field
        orderId: order.id, // Assuming the order object has an id field
      });

      // return order;
    } catch (error) {
      this.logger.error(`Failed to execute market trade: ${error.message}`);
      throw new InternalServerErrorException(
        `Trade execution failed: ${error.message}`,
      );
    }
  }

  async executeLimitTrade(limitTradeDto: LimitTradeDto): Promise<ccxt.Order> {
    const { userId, clientId, exchange, symbol, side, amount, price } =
      limitTradeDto;

    if (!symbol || !side || !amount || !price) {
      throw new BadRequestException(
        'Missing required parameters for limit trade.',
      );
    }

    this.exchange = this.getExchange(exchange);

    try {
      const order = await this.exchange.createOrder(
        symbol,
        'limit',
        side,
        amount,
        price,
      );
      this.logger.log(
        `Limit trade executed: ${JSON.stringify(
          order.amount,
        )} @ ${JSON.stringify(order.price)}`,
      );

      await this.tradeRepository.createTrade({
        userId,
        clientId,
        symbol,
        side: side,
        type: 'limit',
        amount,
        price,
        status: order.status,
        orderId: order.id, // Assuming the order object has an id field
      });

      return order;
    } catch (error) {
      this.logger.error(`Failed to execute limit trade: ${error.message}`);
      throw new InternalServerErrorException(
        `Trade execution failed: ${error.message}`,
      );
    }
  }

  async cancelOrder(orderId: string, symbol: string): Promise<void> {
    try {
      await this.exchange.cancelOrder(orderId, symbol);
      // update the transaction status in database
      await this.tradeRepository.updateTradeStatus(orderId, 'cancelled');
    } catch (error) {
      this.logger.error(`Failed to cancel order: ${error.message}`);
      throw new InternalServerErrorException(
        `Order cancellation failed: ${error.message}`,
      );
    }
  }
}
