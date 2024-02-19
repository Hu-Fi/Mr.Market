import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { TradeRepository } from './trade.repository';
import { MarketTradeDto, LimitTradeDto } from './trade.dto';

@Injectable()
export class TradeService {
  private exchange: ccxt.Exchange;
  private exchanges = new Map<string, ccxt.Exchange>();
  private readonly logger = new Logger(TradeService.name);

  constructor(
    private tradeRepository: TradeRepository,
  ) {
    this.initializeExchange();
  }

  private initializeExchange() {
    // Initialize exchanges
    this.exchanges.set('bitfinex',new ccxt.pro.bitfinex({ apiKey: process.env.BITFINEX_API_KEY, secret: process.env.BITFINEX_SECRET}));
    this.exchanges.set('mexc', new ccxt.pro.mexc({ apiKey: process.env.MEXC_API_KEY, secret: process.env.MEXC_SECRET }));
    this.exchanges.set('binance', new ccxt.pro.binance({apiKey:process.env.BINANCE_API_KEY,secret:process.env.BINANCE_SECRET}))
  }

  async executeMarketTrade(marketTradeDto: MarketTradeDto) {
    const { userId, clientId, exchange, symbol, side, amount } = marketTradeDto;

    if (!symbol || !side || !amount) {
      throw new BadRequestException('Missing required parameters for market trade.');
    }
    this.exchange = this.exchanges.get(exchange);

    if (!this.exchange) {
      this.logger.error(`Exchange: ${exchange} is not configured.`);
      throw new InternalServerErrorException('Exchange configuration error.');
  }

    try {
      const order = await this.exchange.createOrder(symbol, 'market', side, amount);
      this.logger.log(`Market trade executed`, order);
      await this.tradeRepository.createTrade({
        userId,
        clientId,
        symbol,
        type: 'market',
        side: side,
        amount,
        status: order.status,
        price: order.price, // Assuming the order object has a price field
        orderId: order.id // Assuming the order object has an id field
      });

    //   return order;
    } catch (error) {
      this.logger.error(`Failed to execute market trade: ${error.message}`);
      throw new InternalServerErrorException(`Trade execution failed: ${error.message}`);
    }
  }

  async executeLimitTrade(limitTradeDto: LimitTradeDto): Promise<ccxt.Order> {
    const { userId, clientId, exchange,symbol, side, amount, price } = limitTradeDto;

    if (!symbol || !side || !amount || !price) {
      throw new BadRequestException('Missing required parameters for limit trade.');
    }

    this.exchange = this.exchanges.get(exchange);

    if (!this.exchange) {
      this.logger.error(`Exchange: ${exchange} is not configured.`);
      throw new InternalServerErrorException('Exchange configuration error.');
  }

    try {
      const order = await this.exchange.createOrder(symbol, 'limit', side, amount, price);
      this.logger.log(`Limit trade executed: ${JSON.stringify(order)}`);

      await this.tradeRepository.createTrade({
        userId,
        clientId,
        symbol,
        side: side,
        type: 'limit',
        amount,
        price,
        status: order.status,
        orderId: order.id // Assuming the order object has an id field
      });

      return order;
    } catch (error) {
      this.logger.error(`Failed to execute limit trade: ${error.message}`);
      throw new InternalServerErrorException(`Trade execution failed: ${error.message}`);
    }
  }

  async cancelOrder(orderId: string, symbol:string): Promise<void> {
    try {
      const result = await this.exchange.cancelOrder(orderId, symbol);
      this.logger.log(`Order cancelled: ${orderId}`, result);
      //  update the transaction status in database
      await this.tradeRepository.updateTradeStatus(orderId, 'cancelled');
    } catch (error) {
      this.logger.error(`Failed to cancel order: ${error.message}`);
      throw new InternalServerErrorException(`Order cancellation failed: ${error.message}`);
    }
  }


}