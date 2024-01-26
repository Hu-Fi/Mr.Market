import {
  WebSocketGateway, SubscribeMessage, MessageBody,
  ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer
} from '@nestjs/websockets';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { MarketdataService } from './marketdata.service';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway(3012, { namespace: '/orderbookdata' })
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

  @SubscribeMessage('subscribeOrderBook')
  async handleSubscribeOrderBook(
    @MessageBody() data: { exchange: string; symbol: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log("Subscribing to order book" ,data.exchange,data.symbol)
    const clientId = this.getClientId(client);
    if (!clientId) {
      this.logger.error(`Client ID not found for the connected socket`);
      return;
    }

    const compositeKey = `${data.exchange}:${data.symbol}`; // Create a composite key

    if (!this.clientSubscriptions.has(clientId)) {
      this.clientSubscriptions.set(clientId, new Set());
    }
    this.clientSubscriptions.get(clientId).add(compositeKey);

    try {
      if (!this.marketDataService.isSubscribed(data.exchange, data.symbol)) {

        await this.marketDataService.watchOrderBook(data.exchange, data.symbol, (orderBookData) => {
          this.broadcastToSubscribedClients(compositeKey, { exchange: data.exchange, symbol: data.symbol, data: orderBookData });
        });
      }
    } catch (error) {
      this.logger.error(`Error in subscribing to order book: ${error.message}`);
      client.emit("error", 'Failed to subscribe to order book');
    }
  }

  handleDisconnect(clientId: string) {
    const subscriptions = this.clientSubscriptions.get(clientId);
    if (subscriptions) {
      subscriptions.forEach(symbol => {
        this.handleUnsubscribeOrderBook({ exchange: 'relevant_exchange', symbol }, this.getClientById(clientId));
      });
    }
    this.clientSubscriptions.delete(clientId);
    this.clients.delete(clientId);
    this.logger.log(`Client disconnected: ${clientId}`);
  }

  @SubscribeMessage('unsubscribeOrderBook') 
  handleUnsubscribeOrderBook(
    @MessageBody() data: { exchange: string, symbol: string },
    @ConnectedSocket() client: Socket,
  ) {
    const clientId = this.getClientId(client);
    const { exchange, symbol } = data;
    const compositeKey = `${data.exchange}:${data.symbol}`; // Create a composite key
    this.logger.log("Unsubcscribe: ",exchange,symbol);
    this.clientSubscriptions.get(clientId)?.delete(compositeKey);

    if (!this.isSymbolSubscribedByAnyClient(compositeKey)) {
      this.marketDataService.unsubscribeOrderBook(exchange, symbol);
    }
  }

  private broadcastToSubscribedClients(compositeKey: string, data: object) {
    const [exchange, symbol] = compositeKey.split(':'); // Split the composite key
    this.clientSubscriptions.forEach((subscriptions, clientId) => {
      if (subscriptions.has(compositeKey)) {
        const subscribedClient = this.getClientById(clientId);
        if (subscribedClient) {
          subscribedClient.emit("orderBookData", { exchange, symbol, data });
        }
      }
    });
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
