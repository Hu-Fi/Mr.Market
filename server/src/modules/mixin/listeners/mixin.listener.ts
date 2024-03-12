import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MixinListener {
  constructor() {}

  @OnEvent('mixin.release')
  async handleReleaseTokenEvent() {}
}
