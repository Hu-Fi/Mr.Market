
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MarketdataService } from './marketdata.service';
import { Logger } from '@nestjs/common';
@WebSocketGateway(3048,{ namespace: '/marketdata' })
export class MarketDataGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(MarketDataGateway.name);

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }


  // Mapping client IDs to their subscribed symbols
  private clientSubscriptions = new Map<string, Set<string>>();
  // Tracking active symbols to prevent redundant streams
  private activeSymbols = new Set<string>();

  constructor(private marketDataService: MarketdataService) {}

  @SubscribeMessage('subscribeOrderBook')
  async handleSubscribeOrderBook(
    @MessageBody() data: { exchange: string; symbol: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log('starting connection websocket')
    const { exchange, symbol } = data;
    const clientId = client.id;

    // Add this symbol to the client's subscriptions
    if (!this.clientSubscriptions.has(clientId)) {
      this.clientSubscriptions.set(clientId, new Set());
    }
    this.clientSubscriptions.get(clientId).add(symbol);

    // Start watching the order book for a new symbol
    if (!this.activeSymbols.has(symbol)) {
      this.activeSymbols.add(symbol);
      this.marketDataService.watchOrderBook(exchange, symbol, (orderBookData) => {
        // Send data to all subscribed clients
        this.clientSubscriptions.forEach((symbols, clientId) => {
          if (symbols.has(symbol)) {
            this.server.to(clientId).emit('orderBookUpdate', { exchange, symbol, data: orderBookData });
          }
        });
      });
    }
  }

  handleDisconnect(client: Socket) {
    // Clean up client subscriptions on disconnect
    const clientId = client.id;
    this.clientSubscriptions.delete(clientId);
  }

  @SubscribeMessage('unsubscribeOrderBook')
  handleUnsubscribeOrderBook(
    @MessageBody() data: {exchange:string ,symbol: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { exchange, symbol } = data;
    const clientId = client.id;

    // Remove the symbol from the client's subscriptions
    this.clientSubscriptions.get(clientId)?.delete(symbol);

    // Further optimization: check if the symbol has no more subscribers
    // and potentially stop watching it
    if (!this.isSymbolSubscribedByAnyClient(symbol)) {
      this.activeSymbols.delete(symbol);
      this.marketDataService.unsubscribeOrderBook(exchange,symbol);
    }
  }

  private isSymbolSubscribedByAnyClient(symbol: string): boolean {
    for (let subscriptions of this.clientSubscriptions.values()) {
      if (subscriptions.has(symbol)) {
        return true;
      }
    }
    return false;
  }
}