import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';
import {
  WebSocketGateway, SubscribeMessage, MessageBody,
  ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer
} from '@nestjs/websockets';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { MarketdataService, marketDataType } from './marketdata.service';

@WebSocketGateway(3012, { namespace: '/marketdata', cors: true })
export class MarketDataGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: SocketIOServer;
  private readonly logger = new Logger(MarketDataGateway.name);

  private clientSubscriptions = new Map<string, Set<string>>();
  private clients = new Map<string, Socket>();

  constructor(private marketDataService: MarketdataService) {}

  afterInit(server: SocketIOServer) {
    // Any initialization logic if needed
  }

  handleConnection(client: Socket) {
    const clientId = uuidv4();
    this.clients.set(clientId, client);
    client.emit("connected", "Connected Successfully");
    
    client.on('disconnect', () => this.handleDisconnect(clientId));
    this.logger.log(`Client connected: ${clientId}`);
  }

  private async subscribeToTickers(
    exchange: string,
    symbols: string[],
    clientId: string,
    client: Socket,
    callback: (data: any) => void
  ) {
    const compositeKey = this.createCompositeKey('tickers', exchange, undefined, symbols);
  
    if (!this.clientSubscriptions.has(clientId)) {
      this.clientSubscriptions.set(clientId, new Set());
    }
    this.clientSubscriptions.get(clientId).add(compositeKey);
  
    try {
      if (!this.marketDataService.isSubscribed('tickers', exchange, undefined, symbols)) {
        await this.marketDataService.watchTickers(exchange, symbols, callback);
      }
    } catch (error) {
      this.logger.error(`Error in subscribing to tickers: ${error.message}`);
      client.emit("error", `Failed to subscribe to tickers`);
    }
  }

  private async subscribeToMarketData(
    type: marketDataType,
    exchange: string,
    symbol: string,
    clientId: string,
    client: Socket,
    callback: (data: any) => void
  ) {
    const compositeKey = this.createCompositeKey(type, exchange, symbol);
  
    if (!this.clientSubscriptions.has(clientId)) {
      this.clientSubscriptions.set(clientId, new Set());
    }
    this.clientSubscriptions.get(clientId).add(compositeKey);
  
    try {
      if (!this.marketDataService.isSubscribed(type, exchange, symbol)) {
        switch(type) {
          case 'OHLCV':
            await this.marketDataService.watchOHLCV(exchange, symbol, callback); break;
          case 'orderbook':
            await this.marketDataService.watchOrderBook(exchange, symbol, callback); break;
          case 'ticker':
            await this.marketDataService.watchTicker(exchange, symbol, callback); break;
        }
      }
    } catch (error) {
      this.logger.error(`Error in subscribing to ${type}: ${error.message}`);
      client.emit("error", `Failed to subscribe to ${type}`);
    }
  }
  
  private createCompositeKey(type: marketDataType, exchange: string, symbol?: string, symbols?: string[]): string {
    return `${type}:${exchange}:${symbols ? symbols: symbol}`;
  }
  
  @SubscribeMessage('subscribeOrderBook')
  async handleSubscribeOrderBook(
    @MessageBody() data: { exchange: string; symbol: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Subscribing to order book ${data.exchange} ${data.symbol}`)
    const clientId = this.getClientId(client);
    if (!clientId) {
      this.logger.error(`Client ID not found for the connected socket`);
      return;
    }
    this.subscribeToMarketData('orderbook', data.exchange, data.symbol, clientId, client, (orderBookData) => {
      this.broadcastToSubscribedClients(this.createCompositeKey('orderbook', data.exchange, data.symbol), {
        exchange: data.exchange, 
        symbol: data.symbol,
        bids: orderBookData.bids.map(([price, amount]) => ({ price, amount })),
        asks: orderBookData.asks.map(([price, amount]) => ({ price, amount })).reverse(), 
      });
    })
  }

  @SubscribeMessage('subscribeOHLCV')
  async handleSubscribeOHLCV(
    @MessageBody() data: { exchange: string; symbol: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Subscribing to OHLCV ${data.exchange} ${data.symbol}`)
    const clientId = this.getClientId(client);
    if (!clientId) {
      this.logger.error(`Client ID not found for the connected socket`);
      return;
    }

    this.subscribeToMarketData('OHLCV', data.exchange, data.symbol, clientId, client, (OHLCVData) => {
      this.broadcastToSubscribedClients(this.createCompositeKey('OHLCV', data.exchange, data.symbol), { 
        exchange: data.exchange, 
        symbol: data.symbol, 
        data: OHLCVData 
      });
    })
  }

  @SubscribeMessage('subscribeTicker')
  async handleSubscribeTicker(
    @MessageBody() data: { exchange: string; symbol: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Subscribing to ticker ${data.exchange} ${data.symbol}`)
    const clientId = this.getClientId(client);
    if (!clientId) {
      this.logger.error(`Client ID not found for the connected socket`);
      return;
    }
    this.subscribeToMarketData('ticker', data.exchange, data.symbol, clientId, client, (tickerData) => {
      this.broadcastToSubscribedClients(this.createCompositeKey('ticker', data.exchange, data.symbol), { 
        exchange: data.exchange, 
        symbol: data.symbol, 
        price: tickerData.last,
        change: tickerData.percentage,
        info: {
          high: tickerData.high,
          low: tickerData.low,
          volume: tickerData.baseVolume,
        },
      });
    })
  }

  @SubscribeMessage('subscribeTickers')
  async handleSubscribeTickers(
    @MessageBody() data: { exchange: string; symbols: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Subscribing to tickers ${data.exchange} ${data.symbols}`)
    const clientId = this.getClientId(client);
    if (!clientId) {
      this.logger.error(`Client ID not found for the connected socket`);
      return;
    }
    
    this.subscribeToTickers(data.exchange, data.symbols, clientId, client, (tickersData) => {
      this.broadcastToSubscribedClients(this.createCompositeKey('ticker', data.exchange, undefined, data.symbols), { exchange: data.exchange, symbols: data.symbols, data: tickersData });
    })
  }

  private broadcastToSubscribedClients(compositeKey: string, data: object) {
    const [type, exchange, symbol] = compositeKey.split(':'); // Split the composite key
    this.clientSubscriptions.forEach((subscriptions, clientId) => {
      if (subscriptions.has(compositeKey)) {
        const subscribedClient = this.getClientById(clientId);
        if (subscribedClient) {
          switch (type) {
            case 'orderbook':
              subscribedClient.emit("orderBookData", { data });
              break;
            case 'OHLCV':
              subscribedClient.emit("OHLCVData", { data });
              break;
            case 'ticker':
              subscribedClient.emit("tickerData", { data });
              break;
            case 'tickers':
              subscribedClient.emit("tickersData", { data });
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
        const [type, exchange, symbol] = compositeKey.split(':');
        const symbols = symbol.includes(':') ? symbol.split(':') : undefined;
        this.handleUnsubscribeData({ type: type as marketDataType, exchange, symbol: symbols ? undefined : symbol, symbols }, this.getClientById(clientId));
      });
    }
    this.clientSubscriptions.delete(clientId);
    this.clients.delete(clientId);
    this.logger.log(`Client disconnected: ${clientId}`);
  }
  

  @SubscribeMessage('unsubscribeData') 
  handleUnsubscribeData(
    @MessageBody() data: { type: marketDataType, exchange: string, symbol?: string, symbols?: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    let subscriptionKey = '';
    const { type, exchange, symbol, symbols } = data;
    if (type === 'orderbook' || type === 'OHLCV' || type === 'ticker') {
      // Handle both single symbol and array of symbols for these types
      const symbolKey = Array.isArray(symbol) ? symbol.join(':') : symbol;
      subscriptionKey = `${type}:${exchange}:${symbolKey}`;
    } else if (type === 'tickers') {
      // Ensure symbols is an array and sort it to create a consistent key
      const symbolsKey = Array.isArray(symbols) ? symbols.sort().join(':') : symbols;
      subscriptionKey = `tickers:${exchange}:${symbolsKey}`;
    }

    const clientId = this.getClientId(client);
    this.logger.log(`Unsubscribe: ${type} ${exchange} ${symbol}`);
    this.clientSubscriptions.get(clientId)?.delete(subscriptionKey);

    if (!this.isSymbolSubscribedByAnyClient(subscriptionKey)) {
      switch (type) {
        case 'orderbook':
        case 'OHLCV':
        case 'ticker':
          this.marketDataService.unsubscribeData(type, exchange, symbol);
          break;
        case 'tickers':
          this.marketDataService.unsubscribeData(type, exchange, undefined, symbols);
          break;
      }
    }
  }

  private isSymbolSubscribedByAnyClient(compositeKey: string): boolean {
    for (let subscriptions of this.clientSubscriptions.values()) {
      if (subscriptions.has(compositeKey)) {
        return true;
      }
    }
    return false;
  }

  private getClientId(client: Socket): string | null {
    for (let [id, socketClient] of this.clients.entries()) {
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
