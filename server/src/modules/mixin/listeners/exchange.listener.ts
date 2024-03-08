import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ExchangeListener {
  constructor() {}

  @OnEvent('exchange.place')
  async handlePlaceOrderEvent() {}
}
