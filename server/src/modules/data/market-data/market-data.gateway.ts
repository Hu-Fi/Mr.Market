import { v4 as uuidv4 } from 'uuid';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { MarketdataService, marketDataType } from './market-data.service';
import {
  createCompositeKey,
  decodeCompositeKey,
} from 'src/common/helpers/subscriptionKey';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

const webSocketPort = process.env.WS_PORT || '0';
@WebSocketGateway(parseInt(webSocketPort, 10), {
  namespace: '/market',
  cors: true,
})
export class MarketDataGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: SocketIOServer;
  private readonly logger = new CustomLogger(MarketDataGateway.name);

  private clientSubscriptions = new Map<string, Set<string>>();
  private clients = new Map<string, Socket>();

  constructor(private marketDataService: MarketdataService) {}

  afterInit() {
    // Any initialization logic if needed
  }

  handleConnection(client: Socket) {
    const clientId = uuidv4();
    this.clients.set(clientId, client);
    client.emit('connected', 'Connected Successfully');

    client.on('disconnect', () => this.handleDisconnect(clientId));
    this.logger.log(`Client connected: ${clientId}`);
  }

  private async subscribeToTickers(
    exchange: string,
    symbols: string[],
    clientId: string,
    client: Socket,
    callback: (data: any) => void,
  ) {
    const compositeKey = createCompositeKey(
      'tickers',
      exchange,
      undefined,
      symbols,
    );

    if (!this.clientSubscriptions.has(clientId)) {
      this.clientSubscriptions.set(clientId, new Set());
    }
    this.clientSubscriptions.get(clientId).add(compositeKey);

    try {
      if (
        !this.marketDataService.isSubscribed(
          'tickers',
          exchange,
          undefined,
          symbols,
        )
      ) {
        await this.marketDataService.watchTickers(exchange, symbols, callback);
      }
    } catch (error) {
      this.logger.error(`Error in subscribing to tickers: ${error.message}`);
      client.emit('error', `Failed to subscribe to tickers`);
    }
  }

  private async subscribeToOHLCV(
    exchange: string,
    symbol: string,
    clientId: string,
    client: Socket,
    callback: (data: any) => void,
    timeFrame?: string,
    since?: number,
    limit?: number,
  ) {
    const compositeKey = createCompositeKey(
      'OHLCV',
      exchange,
      symbol,
      undefined,
      timeFrame,
    );
    if (!this.clientSubscriptions.has(clientId)) {
      this.clientSubscriptions.set(clientId, new Set());
    }
    this.clientSubscriptions.get(clientId).add(compositeKey);
    try {
      if (
        !this.marketDataService.isSubscribed(
          'OHLCV',
          exchange,
          symbol,
          undefined,
          timeFrame,
        )
      ) {
        await this.marketDataService.watchOHLCV(
          exchange,
          symbol,
          callback,
          timeFrame,
          since,
          limit,
        );
      }
    } catch (error) {
      this.logger.error(`Error in subscribing to tickers: ${error.message}`);
      client.emit('error', `Failed to subscribe to tickers`);
    }
  }

  private async subscribeToMarketData(
    type: marketDataType,
    exchange: string,
    symbol: string,
    clientId: string,
    client: Socket,
    callback: (data: any) => void,
  ) {
    const compositeKey = createCompositeKey(type, exchange, symbol);

    if (!this.clientSubscriptions.has(clientId)) {
      this.clientSubscriptions.set(clientId, new Set());
    }
    this.clientSubscriptions.get(clientId).add(compositeKey);

    try {
      if (!this.marketDataService.isSubscribed(type, exchange, symbol)) {
        switch (type) {
          case 'orderbook':
            await this.marketDataService.watchOrderBook(
              exchange,
              symbol,
              callback,
            );
            break;
          case 'ticker':
            await this.marketDataService.watchTicker(
              exchange,
              symbol,
              callback,
            );
            break;
        }
      }
    } catch (error) {
      this.logger.error(`Error in subscribing to ${type}: ${error.message}`);
      client.emit('error', `Failed to subscribe to ${type}`);
    }
  }

  // Handler
  @SubscribeMessage('subscribeOrderBook')
  async handleSubscribeOrderBook(
    @MessageBody() data: { exchange: string; symbol: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `Subscribing to order book ${data.exchange} ${data.symbol}`,
    );
    const clientId = this.getClientId(client);
    if (!clientId) {
      this.logger.error(`Client ID not found for the connected socket`);
      return;
    }
    this.subscribeToMarketData(
      'orderbook',
      data.exchange,
      data.symbol,
      clientId,
      client,
      (orderBookData) => {
        this.broadcastToSubscribedClients(
          createCompositeKey('orderbook', data.exchange, data.symbol),
          {
            exchange: data.exchange,
            symbol: data.symbol,
            bids: orderBookData.bids.map(([price, amount]) => ({
              price,
              amount,
            })),
            asks: orderBookData.asks
              .map(([price, amount]) => ({ price, amount }))
              .reverse(),
          },
        );
      },
    );
  }

  @SubscribeMessage('subscribeOHLCV')
  async handleSubscribeOHLCV(
    @MessageBody()
    data: {
      exchange: string;
      symbol: string;
      timeFrame?: string;
      since?: number;
      limit?: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `Subscribing to OHLCV ${data.exchange} ${data.symbol} ${data.timeFrame}`,
    );
    const clientId = this.getClientId(client);
    if (!clientId) {
      this.logger.error(`Client ID not found for the connected socket`);
      return;
    }
    this.subscribeToOHLCV(
      data.exchange,
      data.symbol,
      clientId,
      client,
      (OHLCVData) => {
        this.broadcastToSubscribedClients(
          createCompositeKey(
            'OHLCV',
            data.exchange,
            data.symbol,
            undefined,
            data.timeFrame,
          ),
          {
            timestamp: OHLCVData[0][0],
            open: OHLCVData[0][1],
            close: OHLCVData[0][2],
            high: OHLCVData[0][3],
            low: OHLCVData[0][4],
            volume: OHLCVData[0][5],
          },
        );
      },
      data.timeFrame,
      data.since,
      data.limit,
    );
  }

  @SubscribeMessage('subscribeTicker')
  async handleSubscribeTicker(
    @MessageBody() data: { exchange: string; symbol: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Subscribing to ticker ${data.exchange} ${data.symbol}`);
    const clientId = this.getClientId(client);
    if (!clientId) {
      this.logger.error(`Client ID not found for the connected socket`);
      return;
    }
    this.subscribeToMarketData(
      'ticker',
      data.exchange,
      data.symbol,
      clientId,
      client,
      (tickerData) => {
        this.broadcastToSubscribedClients(
          createCompositeKey('ticker', data.exchange, data.symbol),
          {
            exchange: data.exchange,
            symbol: data.symbol,
            price: tickerData.last,
            change: tickerData.percentage,
            info: {
              high: tickerData.high,
              low: tickerData.low,
              volume: tickerData.baseVolume,
              open: tickerData.open,
              close: tickerData.close,
              timestamp: tickerData.timestamp,
            },
          },
        );
      },
    );
  }

  @SubscribeMessage('subscribeTickers')
  async handleSubscribeTickers(
    @MessageBody() data: { exchange: string; symbols: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Subscribing to tickers ${data.exchange} ${data.symbols}`);
    const clientId = this.getClientId(client);
    if (!clientId) {
      this.logger.error(`Client ID not found for the connected socket`);
      return;
    }

    this.subscribeToTickers(
      data.exchange,
      data.symbols,
      clientId,
      client,
      (tickersData) => {
        this.broadcastToSubscribedClients(
          createCompositeKey('tickers', data.exchange, undefined, data.symbols),
          {
            exchange: data.exchange,
            symbols: data.symbols,
            data: tickersData,
          },
        );
      },
    );
  }

  private broadcastToSubscribedClients(compositeKey: string, data: object) {
    const [type] = compositeKey.split(':'); // Split the composite key
    this.clientSubscriptions.forEach((subscriptions, clientId) => {
      if (subscriptions.has(compositeKey)) {
        const subscribedClient = this.getClientById(clientId);
        if (subscribedClient) {
          switch (type) {
            case 'orderbook':
              subscribedClient.emit('orderBookData', { data });
              break;
            case 'OHLCV':
              subscribedClient.emit('OHLCVData', { data });
              break;
            case 'ticker':
              subscribedClient.emit('tickerData', { data });
              break;
            case 'tickers':
              subscribedClient.emit('tickersData', { data });
              break;
          }
        }
      }
    });
  }

  handleDisconnect(clientId: string) {
    const subscriptions = this.clientSubscriptions.get(clientId);
    if (subscriptions) {
      subscriptions.forEach((compositeKey) => {
        const data = decodeCompositeKey(compositeKey);
        this.handleUnsubscribeData(data, this.getClientById(clientId));
      });
    }
    this.clientSubscriptions.delete(clientId);
    this.clients.delete(clientId);
    this.logger.log(`Client disconnected: ${clientId}`);
  }

  @SubscribeMessage('unsubscribeData')
  handleUnsubscribeData(
    @MessageBody()
    data: {
      type: marketDataType;
      exchange: string;
      symbol?: string;
      symbols?: string[];
      timeFrame?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { type, exchange, symbol, symbols, timeFrame } = data;
    const subscriptionKey = createCompositeKey(
      type,
      exchange,
      symbol,
      symbols,
      timeFrame,
    );

    const clientId = this.getClientId(client);
    this.logger.log(`Unsubscribe: ${subscriptionKey}`);
    this.clientSubscriptions.get(clientId)?.delete(subscriptionKey);

    if (!this.isSymbolSubscribedByAnyClient(subscriptionKey)) {
      switch (type) {
        case 'orderbook':
        case 'ticker':
          this.marketDataService.unsubscribeData(type, exchange, symbol);
          break;
        case 'OHLCV':
          this.marketDataService.unsubscribeData(
            type,
            exchange,
            symbol,
            undefined,
            timeFrame,
          );
          break;
        case 'tickers':
          this.marketDataService.unsubscribeData(
            type,
            exchange,
            undefined,
            symbols,
          );
          break;
      }
    }
  }

  private isSymbolSubscribedByAnyClient(compositeKey: string): boolean {
    for (const subscriptions of this.clientSubscriptions.values()) {
      if (subscriptions.has(compositeKey)) {
        return true;
      }
    }
    return false;
  }

  private getClientId(client: Socket): string | null {
    for (const [id, socketClient] of this.clients.entries()) {
      if (client === socketClient) {
        return id;
      }
    }
    return null;
  }

  private getClientById(clientId: string): Socket | undefined {
    return this.clients.get(clientId);
  }
}
