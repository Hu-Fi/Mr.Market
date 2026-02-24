import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { SpotdataService } from 'src/modules/spotdata/spotdata.service';

@ApiTags('Spotdata')
@Controller('spot')
export class SpotdataController {
  constructor(private readonly spotdataService: SpotdataService) {}

  @Get('/info')
  getSpotData() {
    return this.spotdataService.getSpotData();
  }
}
