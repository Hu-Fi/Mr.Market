import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as ccxt from 'ccxt';
import { TradeRepository } from './trade.repository';
import { MarketTradeDto, LimitTradeDto } from './trade.dto';
import { CustomLogger } from '../../infrastructure/logger/logger.service';
import { ExchangeInitService } from 'src/modules/infrastructure/exchange-init/exchange-init.service';

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
      this.logger.log(`Market trade executed`, order.toString());
      await this.tradeRepository.createTrade({
        userId,
        clientId,
        symbol,
        type: 'market',
        side: side,
        amount: amount.toString(),
        status: order.status,
        price: (order.price || 0).toString(), // Assuming the order object has a price field
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
      this.logger.log(`Limit trade executed: ${JSON.stringify(order)}`);

      await this.tradeRepository.createTrade({
        userId,
        clientId,
        symbol,
        side: side,
        type: 'limit',
        amount: amount.toString(),
        price: price.toString(),
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
