import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SpotOrderCreateEvent } from '../events/spot.event';

@Injectable()
export class SpotOrderCreateListener {
  @OnEvent('spot.create')
  handleSpotOrderCreateEvent(event: SpotOrderCreateEvent) {
    console.log(event);
  }
}
