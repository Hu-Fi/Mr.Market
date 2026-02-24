import { Body, Controller, Post } from '@nestjs/common';
import { DexVolumeStrategyService } from './dex-volume.strategy.service';
import { DexVolumeStrategyDto } from './dex-volume.dto';

@Controller('strategy/dex-volume')
export class DexVolumeController {
  constructor(private readonly svc: DexVolumeStrategyService) {}

  @Post('startdexvolume')
  start(@Body() dto: DexVolumeStrategyDto) {
    this.svc.execute(dto);
    return { ok: true };
  }

  @Post('stopdexvolume')
  stop(@Body() b: { userId: string; clientId: string }) {
    this.svc.stop(b.userId, b.clientId);
    return { ok: true };
  }
}
